import { test, expect } from './helpers/test';

test.describe('CSS clamp()計算機', () => {
  test('初期値でclamp()式が表示される', async ({ page }) => {
    await page.goto('/tools/css-clamp-calculator/');
    await expect(page.locator('#css-clamp-result')).toHaveValue(
      'font-size: clamp(1rem, 0.8333rem + 0.8333vw, 1.5rem);',
    );
  });

  test('px出力に切り替えられる', async ({ page }) => {
    await page.goto('/tools/css-clamp-calculator/');
    await page.locator('#css-clamp-min-vw').fill('400');
    await page.locator('#css-clamp-max-vw').fill('800');
    await page.locator('#css-clamp-max-size').fill('32');
    await page.locator('#css-clamp-unit').selectOption('px');
    await expect(page.locator('#css-clamp-result')).toHaveValue(
      'font-size: clamp(16px, 4vw, 32px);',
    );
  });

  test('画面幅の範囲が不正だとエラーが出る', async ({ page }) => {
    await page.goto('/tools/css-clamp-calculator/');
    await page.locator('#css-clamp-min-vw').fill('1500');
    await expect(page.locator('#css-clamp-error')).toHaveText(
      '最小の画面幅は最大の画面幅より小さい値にしてください',
    );
    await expect(page.locator('#css-clamp-result')).toHaveValue('');
  });

  test('指定幅での実サイズが表示される', async ({ page }) => {
    await page.goto('/tools/css-clamp-calculator/');
    await expect(page.locator('#css-clamp-preview')).toHaveText(
      '800px のとき：20px（1.25rem）',
    );
  });

  test('コピーできる', async ({ page }) => {
    await page
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-clamp-calculator/');
    await page.locator('#css-clamp-copy-button').click();
    await expect(page.locator('#css-clamp-status')).toHaveText(
      'コピーしました',
    );
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/css-clamp-calculator/');
    await expect(page.locator('#css-clamp-preview')).toHaveText(
      'At 800px: 20px (1.25rem)',
    );
  });
});
