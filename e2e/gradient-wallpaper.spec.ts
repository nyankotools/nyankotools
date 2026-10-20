import { test, expect } from './helpers/test';

test('グラデーション壁紙：初期表示でプレビューが描画される', async ({
  page,
}) => {
  await page.goto('/tools/gradient-wallpaper/');
  const canvas = page.locator('#gw-canvas');
  // 1920x1080 を最大480pxに縮小したプレビュー
  await expect(canvas).toHaveAttribute('width', '480');
  await expect(canvas).toHaveAttribute('height', '270');
});

test('グラデーション壁紙：プリセットで解像度が入り、色の数で行が増える', async ({
  page,
}) => {
  await page.goto('/tools/gradient-wallpaper/');
  await page.locator('.gw-preset', { hasText: '1080×2400' }).click();
  await expect(page.locator('#gw-width')).toHaveValue('1080');
  await expect(page.locator('#gw-height')).toHaveValue('2400');
  await expect(page.locator('#gw-canvas')).toHaveAttribute('height', '480');

  await expect(page.locator('#gw-color-3')).toBeHidden();
  await page.locator('#gw-count').selectOption('5');
  await expect(page.locator('#gw-color-4')).toBeVisible();
});

test('グラデーション壁紙：放射では角度が無効になる', async ({ page }) => {
  await page.goto('/tools/gradient-wallpaper/');
  await page.locator('#gw-type').selectOption('radial');
  await expect(page.locator('#gw-angle')).toBeDisabled();
  await page.locator('#gw-type').selectOption('conic');
  await expect(page.locator('#gw-angle')).toBeEnabled();
});

test('グラデーション壁紙：画素数超過でエラーになり保存できない', async ({
  page,
}) => {
  await page.goto('/tools/gradient-wallpaper/');
  await page.locator('#gw-width').fill('8192');
  await page.locator('#gw-height').fill('8192');
  await expect(page.locator('#gw-error')).toBeVisible();
  await expect(page.locator('#gw-download')).toBeDisabled();
  await page.locator('#gw-height').fill('1000');
  await expect(page.locator('#gw-error')).toBeHidden();
  await expect(page.locator('#gw-download')).toBeEnabled();
});

test('グラデーション壁紙：ダウンロードでPNGが保存される', async ({ page }) => {
  await page.goto('/tools/gradient-wallpaper/');
  await page.locator('#gw-width').fill('400');
  await page.locator('#gw-height').fill('300');
  await page.locator('#gw-noise').fill('20');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#gw-download').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('gradient-wallpaper-400x300.png');
});

test('グラデーション壁紙（英語版）：ページが表示される', async ({ page }) => {
  await page.goto('/en/tools/gradient-wallpaper/');
  await expect(page.locator('main h1')).toHaveText(
    'Gradient Wallpaper & Background Image Generator',
  );
  await expect(page.locator('label[for="gw-type"]')).toHaveText(
    'Gradient type',
  );
});
