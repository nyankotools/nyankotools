import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('長い文と同じ文末の連続がハイライトされ、スコアと指標が表示される', async ({
  page,
}) => {
  await page.goto('/tools/readability-checker/');

  await page
    .locator('#readability-input')
    .fill('私は走る。彼は眠る。母は帰る。' + 'あ'.repeat(70) + '。');

  await expect(page.locator('#readability-score-box')).toBeVisible();
  await expect(page.locator('#readability-preview mark')).toHaveCount(4);
  await expect(page.locator('#readability-issues li')).toHaveCount(4);
  await expect(page.locator('#readability-metrics')).toContainText('要確認');
});

test('問題のない文章は指摘なしで満点になる', async ({ page }) => {
  await page.goto('/tools/readability-checker/');

  await page.locator('#readability-input').fill('猫が好きだ。犬も飼いたい。');

  await expect(page.locator('#readability-score')).toHaveText('100');
  await expect(page.locator('#readability-preview mark')).toHaveCount(0);
  await expect(page.locator('#readability-issues-none')).toBeVisible();
});

test('入力中のHTMLはタグとして解釈されない', async ({ page }) => {
  await page.goto('/tools/readability-checker/');

  await page
    .locator('#readability-input')
    .fill('<img src=x onerror=alert(1)>。');

  await expect(page.locator('#readability-preview img')).toHaveCount(0);
  await expect(page.locator('#readability-preview')).toContainText('<img');
});

test('上限の変更で判定が変わり、サンプル挿入で結果が出る（英語版）', async ({
  page,
}) => {
  await page.goto('/en/tools/readability-checker/');

  await page.locator('#readability-input').fill('あ'.repeat(30) + '。');
  await expect(page.locator('#readability-preview mark')).toHaveCount(0);
  await page.locator('#readability-max-length').fill('20');
  await expect(page.locator('#readability-preview mark')).toHaveCount(1);

  await page.getByRole('button', { name: 'Insert sample' }).click();
  await expect(page.locator('#readability-score-box')).toBeVisible();
  await expect(page.locator('#readability-issues li').first()).toBeVisible();
});

test('指摘が表示された状態でもaxeの違反がない', async ({ page }) => {
  await page.goto('/tools/readability-checker/');
  await page
    .locator('#readability-input')
    .fill('私は走る。彼は眠る。母は帰る。' + 'あ'.repeat(70) + '。');
  await expect(page.locator('#readability-preview mark')).toHaveCount(4);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
    ),
  ).toEqual([]);
});
