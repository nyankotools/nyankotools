import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('連番・日付リスト生成', () => {
  test('ゼロ埋め・接頭辞・接尾辞つきの連番を生成する', async ({ page }) => {
    await page.goto('/tools/sequence-generator/');
    await page.locator('#sg-start').fill('8');
    await page.locator('#sg-pad').fill('3');
    await page.locator('#sg-prefix').fill('img_');
    await page.locator('#sg-suffix').fill('.jpg');
    await page.locator('#sg-count').fill('3');
    await page.locator('#sg-generate-button').click();
    await expect(page.locator('#sg-output')).toHaveValue(
      'img_008.jpg\nimg_009.jpg\nimg_010.jpg',
    );
    await expect(page.locator('#sg-summary')).toContainText('3件');
  });

  test('終了値指定と区切りの切り替え', async ({ page }) => {
    await page.goto('/tools/sequence-generator/');
    await page.locator('#sg-limit [data-limit="end"]').click();
    await page.locator('#sg-start').fill('0');
    await page.locator('#sg-step').fill('5');
    await page.locator('#sg-end').fill('12');
    await page.locator('#sg-generate-button').click();
    await expect(page.locator('#sg-output')).toHaveValue('0\n5\n10');
    await page.locator('#sg-separator').selectOption('comma');
    await expect(page.locator('#sg-output')).toHaveValue('0, 5, 10');
  });

  test('日付リストを曜日付き・土日除外で生成する', async ({ page }) => {
    await page.goto('/tools/sequence-generator/');
    await page.locator('#sg-mode [data-mode="date"]').click();
    await page.locator('#sg-start-date').fill('2026-10-16');
    await page.locator('#sg-count').fill('3');
    await page.locator('#sg-weekday').selectOption('short');
    await page.locator('#sg-skip-weekends').check();
    await page.locator('#sg-generate-button').click();
    await expect(page.locator('#sg-output')).toHaveValue(
      '2026-10-16（金）\n2026-10-19（月）\n2026-10-20（火）',
    );
  });

  test('増分0はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/sequence-generator/');
    await page.locator('#sg-step').fill('0');
    await page.locator('#sg-generate-button').click();
    await expect(page.locator('#sg-error')).toContainText('増分');
    await expect(page.locator('#sg-result')).toBeHidden();
  });

  test('エラー表示の状態でもaxeの違反がない', async ({ page }) => {
    await page.goto('/tools/sequence-generator/');
    await page.locator('#sg-step').fill('0');
    await page.locator('#sg-generate-button').click();
    await expect(page.locator('#sg-error')).not.toBeEmpty();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/sequence-generator/');
    await page.locator('#sg-generate-button').click();
    await page.locator('#sg-copy-button').click();
    await expect(page.locator('#sg-status')).toHaveText('コピーしました');
  });

  test('英語ページでも生成できる', async ({ page }) => {
    await page.goto('/en/tools/sequence-generator/');
    await page.locator('#sg-generate-button').click();
    await expect(page.locator('#sg-summary')).toContainText('Generated 10');
  });
});
