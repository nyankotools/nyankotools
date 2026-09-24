import { test, expect, type Page } from '@playwright/test';

/** ブラウザのCanvas APIで指定サイズのテスト用PNGを生成し、Bufferとして返す */
async function createTestPng(
  page: Page,
  width: number,
  height: number,
): Promise<Buffer> {
  const dataUrl = await page.evaluate(
    ({ w, h }) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#3366ff';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ff9933';
      ctx.fillRect(w / 2, 0, w / 2, h / 2);
      return canvas.toDataURL('image/png');
    },
    { w: width, h: height },
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

test('画像ドット絵化・モザイク・減色ツール（日本語）が正しく表示される', async ({
  page,
}) => {
  await page.goto('/tools/image-pixelart-converter/');

  await expect(page.locator('main h1')).toHaveText(
    '画像ドット絵化・モザイク・減色ツール',
  );
});

test('画像ドット絵化・モザイク・減色ツール（英語）が正しく表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/image-pixelart-converter/');

  await expect(page.locator('main h1')).toHaveText(
    'Image Pixelate, Mosaic & Color Reduction Tool',
  );
});

test('ページ要素が正しく配置されている', async ({ page }) => {
  await page.goto('/tools/image-pixelart-converter/');

  await expect(page.locator('#pa-dropzone')).toBeVisible();
  await expect(page.locator('#pa-file-input')).toBeVisible();
  await expect(page.locator('#pa-block-size')).toBeVisible();
  await expect(page.locator('#pa-color-levels')).toBeVisible();

  await expect(page.locator('[data-format="png"]')).toBeVisible();
  await expect(page.locator('[data-format="webp"]')).toBeVisible();
  await expect(page.locator('[data-format="jpeg"]')).toBeVisible();

  await expect(page.locator('#pa-clear-button')).toBeDisabled();
  await expect(page.locator('#pa-results-section')).toHaveAttribute('hidden');
});

test('画像を選択すると変換結果が表示され、ダウンロードできる状態になる', async ({
  page,
}) => {
  await page.goto('/tools/image-pixelart-converter/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#pa-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#pa-source-info')).toContainText('200×100px');
  await expect(page.locator('#pa-results-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#pa-result-size')).not.toHaveText('');
  await expect(page.locator('#pa-download-button')).not.toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(page.locator('#pa-clear-button')).not.toBeDisabled();
});

test('ブロックサイズを変更すると表示値が更新される', async ({ page }) => {
  await page.goto('/tools/image-pixelart-converter/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#pa-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  const blockSizeInput = page.locator('#pa-block-size');
  const blockSizeValue = page.locator('#pa-block-size-value');

  await expect(blockSizeValue).toContainText('8px');

  await blockSizeInput.fill('20');
  await expect(blockSizeValue).toContainText('20px');
});

test('色数（階調）を変更すると表示値が更新され、最大値ではオフ表示になる', async ({
  page,
}) => {
  await page.goto('/tools/image-pixelart-converter/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#pa-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  const colorLevelsInput = page.locator('#pa-color-levels');
  const colorLevelsValue = page.locator('#pa-color-levels-value');

  // 初期値（最大256階調）はオフ表示
  await expect(colorLevelsValue).toContainText('オフ');

  await colorLevelsInput.fill('4');
  await expect(colorLevelsValue).toContainText('4階調');
  await expect(colorLevelsValue).toContainText('64');
});

test('フォーマット選択が動作する', async ({ page }) => {
  await page.goto('/tools/image-pixelart-converter/');

  const pngButton = page.locator('[data-format="png"]');
  const webpButton = page.locator('[data-format="webp"]');
  const jpegButton = page.locator('[data-format="jpeg"]');
  const qualityInput = page.locator('#pa-quality');
  const qualityNote = page.locator('#pa-quality-note');

  await expect(pngButton).toHaveAttribute('aria-pressed', 'true');
  await expect(qualityInput).toBeDisabled();
  await expect(qualityNote).toBeVisible();

  await webpButton.click();
  await expect(webpButton).toHaveAttribute('aria-pressed', 'true');
  await expect(qualityInput).not.toBeDisabled();
  await expect(qualityNote).toBeHidden();

  await jpegButton.click();
  await expect(jpegButton).toHaveAttribute('aria-pressed', 'true');
  await expect(qualityInput).not.toBeDisabled();
});

test('対応外ファイル形式を選択するとエラーが表示される', async ({ page }) => {
  await page.goto('/tools/image-pixelart-converter/');

  await page.locator('#pa-file-input').setInputFiles({
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });

  await expect(page.locator('#pa-error')).toBeVisible();
  await expect(page.locator('#pa-results-section')).toHaveAttribute('hidden');
});

test('クリアボタンで状態がリセットされる', async ({ page }) => {
  await page.goto('/tools/image-pixelart-converter/');
  const buffer = await createTestPng(page, 100, 100);
  await page
    .locator('#pa-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });
  await expect(page.locator('#pa-results-section')).not.toHaveAttribute(
    'hidden',
  );

  await page.locator('#pa-clear-button').click();

  await expect(page.locator('#pa-results-section')).toHaveAttribute('hidden');
  await expect(page.locator('#pa-source-info')).toHaveText('');
  await expect(page.locator('#pa-clear-button')).toBeDisabled();
});
