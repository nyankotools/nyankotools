import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('A/Bテスト: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/ab-test-calculator/',
    '/en/tools/ab-test-calculator/',
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => v.id),
      path,
    ).toEqual([]);
  }
});

test('A/Bテスト: 初期値で有意差ありと判定される', async ({ page }) => {
  await page.goto('/tools/ab-test-calculator/');
  await expect(page.locator('#ab-rate-a')).toHaveText('10.00%');
  await expect(page.locator('#ab-rate-b')).toHaveText('13.00%');
  await expect(page.locator('#ab-z')).toHaveText('2.103');
  await expect(page.locator('#ab-p')).toHaveText('0.0355');
  await expect(page.locator('#ab-verdict')).toContainText('有意差あり');
});

test('A/Bテスト: 差が小さいと有意差なしで、サンプル不足の警告が出る', async ({
  page,
}) => {
  await page.goto('/tools/ab-test-calculator/');
  await page.locator('#ab-visitors-a').fill('20');
  await page.locator('#ab-conv-a').fill('2');
  await page.locator('#ab-visitors-b').fill('20');
  await page.locator('#ab-conv-b').fill('3');
  await expect(page.locator('#ab-verdict')).toContainText('有意差なし');
  await expect(page.locator('#ab-warn-small')).toBeVisible();
});

test('A/Bテスト: コンバージョン数が訪問数を超えるとエラー', async ({
  page,
}) => {
  await page.goto('/tools/ab-test-calculator/');
  await page.locator('#ab-conv-a').fill('2000');
  await expect(page.locator('#ab-error')).toContainText('コンバージョン数');
  await expect(page.locator('#ab-results')).toBeHidden();
});

test('A/Bテスト: 必要サンプルサイズモードで各群約8,158', async ({ page }) => {
  await page.goto('/tools/ab-test-calculator/');
  await page.getByRole('button', { name: '必要サンプルサイズ' }).click();
  await expect(page.locator('#ab-panel-test')).toBeHidden();
  await expect(page.locator('#ss-per-group')).toHaveText('8,158');
  await expect(page.locator('#ss-total')).toHaveText('16,316');
});

test('A/Bテスト: 英語版で片側検定に切り替えるとp値が半分になる', async ({
  page,
}) => {
  await page.goto('/en/tools/ab-test-calculator/');
  await expect(page.locator('#ab-p')).toHaveText('0.0355');
  await page.locator('#ab-tail').selectOption('one');
  await expect(page.locator('#ab-p')).toHaveText('0.0177');
  await expect(page.locator('#ab-verdict')).toContainText('significant');
});
