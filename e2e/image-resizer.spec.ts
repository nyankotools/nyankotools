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
      return canvas.toDataURL('image/png');
    },
    { w: width, h: height },
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

test('画像リサイズ・圧縮ツール（日本語）が正しく表示される', async ({
  page,
}) => {
  await page.goto('/tools/image-resizer/');

  await expect(page.locator('main h1')).toHaveText('画像リサイズ・圧縮');
});

test('画像リサイズ・圧縮ツール（英語）が正しく表示される', async ({ page }) => {
  await page.goto('/en/tools/image-resizer/');

  await expect(page.locator('main h1')).toHaveText(
    'Image Resizer & Compressor',
  );
});

test('ページ要素が正しく配置されている', async ({ page }) => {
  await page.goto('/tools/image-resizer/');

  await expect(page.locator('#ir-dropzone')).toBeVisible();
  await expect(page.locator('#ir-file-input')).toBeVisible();

  await expect(page.locator('[data-dimension-mode="px"]')).toBeVisible();
  await expect(page.locator('[data-dimension-mode="percent"]')).toBeVisible();

  await expect(page.locator('#ir-width')).toBeVisible();
  await expect(page.locator('#ir-height')).toBeVisible();
  await expect(page.locator('#ir-aspect-lock')).toBeVisible();

  await expect(page.locator('[data-format="webp"]')).toBeVisible();
  await expect(page.locator('[data-format="jpeg"]')).toBeVisible();
  await expect(page.locator('[data-format="png"]')).toBeVisible();

  await expect(page.locator('#ir-quality')).toBeVisible();

  await expect(page.locator('#ir-clear-button')).toBeVisible();
  await expect(page.locator('#ir-reset-button')).toBeVisible();
});

test('px指定で幅を変更すると縦横比を保って高さが自動計算され、変換結果に反映される', async ({
  page,
}) => {
  await page.goto('/tools/image-resizer/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#ir-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#ir-file-count')).toContainText('1');
  await expect(page.locator('#ir-results-section')).not.toHaveAttribute(
    'hidden',
  );

  const widthInput = page.locator('#ir-width');
  const heightInput = page.locator('#ir-height');

  // 読み込んだ画像の元サイズが幅・高さ欄の初期値になる
  await expect(widthInput).toHaveValue('200');
  await expect(heightInput).toHaveValue('100');

  const sizeEl = page.locator('[data-size]').first();
  await expect(sizeEl).toContainText('200×100px');

  // 幅を100に変更すると、縦横比を保って高さ欄が自動的に50へ更新される
  await widthInput.fill('100');
  await expect(heightInput).toHaveValue('50');
  await expect(sizeEl).toContainText('100×50px');
});

test('縦横比の固定を解除すると幅・高さを個別に指定できる', async ({ page }) => {
  await page.goto('/tools/image-resizer/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#ir-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  await page.locator('#ir-aspect-lock').uncheck();
  await page.locator('#ir-width').fill('80');
  await page.locator('#ir-height').fill('40');

  const sizeEl = page.locator('[data-size]').first();
  await expect(sizeEl).toContainText('80×40px');
});

test('パーセント指定でリサイズできる', async ({ page }) => {
  await page.goto('/tools/image-resizer/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#ir-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  await page.locator('[data-dimension-mode="percent"]').click();
  await page.locator('#ir-percent').fill('25');

  const sizeEl = page.locator('[data-size]').first();
  await expect(sizeEl).toContainText('50×25px');
});

test('先頭画像を削除すると幅・高さ入力欄が新しい基準画像に同期される', async ({
  page,
}) => {
  await page.goto('/tools/image-resizer/');

  const firstBuffer = await createTestPng(page, 300, 300);
  await page.locator('#ir-file-input').setInputFiles({
    name: 'first.png',
    mimeType: 'image/png',
    buffer: firstBuffer,
  });
  await expect(page.locator('#ir-width')).toHaveValue('300');
  await expect(page.locator('#ir-height')).toHaveValue('300');

  const secondBuffer = await createTestPng(page, 100, 50);
  await page.locator('#ir-file-input').setInputFiles({
    name: 'second.png',
    mimeType: 'image/png',
    buffer: secondBuffer,
  });
  await expect(page.locator('#ir-file-count')).toContainText('2');

  // 先頭（基準）画像を削除する
  await page.locator('[data-remove]').first().click();
  await expect(page.locator('#ir-file-count')).toContainText('1');

  // 幅欄の値(300)はそのままに、新しい基準画像(100×50)を基に高さ欄が再計算される
  await expect(page.locator('#ir-height')).toHaveValue('150');
});

test('対応外ファイル形式を選択するとエラーが表示される', async ({ page }) => {
  await page.goto('/tools/image-resizer/');

  await page.locator('#ir-file-input').setInputFiles({
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });

  await expect(page.locator('#ir-file-count')).toHaveText('');
  await expect(page.locator('#ir-error')).toBeVisible();
});

test('ファイルを削除するとリストから消える', async ({ page }) => {
  await page.goto('/tools/image-resizer/');
  const buffer = await createTestPng(page, 100, 100);
  await page
    .locator('#ir-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });
  await expect(page.locator('#ir-file-count')).toContainText('1');

  await page.locator('[data-remove]').click();

  await expect(page.locator('#ir-file-count')).toHaveText('');
  await expect(page.locator('#ir-results-section')).toHaveAttribute('hidden');
});

test('すべてクリアボタンでファイルをすべてクリアできる', async ({ page }) => {
  await page.goto('/tools/image-resizer/');
  const buffer = await createTestPng(page, 100, 100);
  await page
    .locator('#ir-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });
  await expect(page.locator('#ir-file-count')).toContainText('1');

  const clearButton = page.locator('#ir-clear-button');
  await expect(clearButton).not.toBeDisabled();
  await clearButton.click();

  await expect(page.locator('#ir-file-count')).toHaveText('');
  await expect(clearButton).toBeDisabled();
  await expect(page.locator('#ir-results-section')).toHaveAttribute('hidden');
});

test('px/percent指定モードの切り替えが動作する', async ({ page }) => {
  await page.goto('/tools/image-resizer/');

  const pxButton = page.locator('[data-dimension-mode="px"]');
  const percentButton = page.locator('[data-dimension-mode="percent"]');
  const pxPanel = page.locator('#ir-px-panel');
  const percentPanel = page.locator('#ir-percent-panel');

  await expect(pxButton).toHaveAttribute('aria-pressed', 'true');
  await expect(pxPanel).not.toHaveAttribute('hidden');
  await expect(percentPanel).toHaveAttribute('hidden');

  await percentButton.click();
  await expect(percentButton).toHaveAttribute('aria-pressed', 'true');
  await expect(pxPanel).toHaveAttribute('hidden');
  await expect(percentPanel).not.toHaveAttribute('hidden');

  await pxButton.click();
  await expect(pxButton).toHaveAttribute('aria-pressed', 'true');
  await expect(pxPanel).not.toHaveAttribute('hidden');
  await expect(percentPanel).toHaveAttribute('hidden');
});

test('フォーマット選択が動作する', async ({ page }) => {
  await page.goto('/tools/image-resizer/');

  const webpButton = page.locator('[data-format="webp"]');
  const jpegButton = page.locator('[data-format="jpeg"]');
  const pngButton = page.locator('[data-format="png"]');
  const qualityInput = page.locator('#ir-quality');
  const qualityNote = page.locator('#ir-quality-note');

  await expect(webpButton).toHaveAttribute('aria-pressed', 'true');
  await expect(qualityInput).not.toBeDisabled();
  await expect(qualityNote).toHaveAttribute('hidden');

  await jpegButton.click();
  await expect(jpegButton).toHaveAttribute('aria-pressed', 'true');
  await expect(qualityInput).not.toBeDisabled();
  await expect(qualityNote).toHaveAttribute('hidden');

  await pngButton.click();
  await expect(pngButton).toHaveAttribute('aria-pressed', 'true');
  await expect(qualityInput).toBeDisabled();
  await expect(qualityNote).not.toHaveAttribute('hidden');
});

test('縦横比固定チェックボックスが動作する', async ({ page }) => {
  await page.goto('/tools/image-resizer/');

  const aspectLock = page.locator('#ir-aspect-lock');

  await expect(aspectLock).toBeChecked();

  await aspectLock.uncheck();
  await expect(aspectLock).not.toBeChecked();

  await aspectLock.check();
  await expect(aspectLock).toBeChecked();
});

test('パーセンテージスライダーが動作する', async ({ page }) => {
  await page.goto('/tools/image-resizer/');

  const percentButton = page.locator('[data-dimension-mode="percent"]');
  const percentInput = page.locator('#ir-percent');
  const percentValue = page.locator('#ir-percent-value');

  await percentButton.click();

  await expect(percentInput).toHaveValue('50');
  await expect(percentValue).toContainText('50%');

  await percentInput.fill('200');
  await expect(percentValue).toContainText('200%');

  await percentInput.fill('100');
  await expect(percentValue).toContainText('100%');
});

test('品質スライダーが動作する', async ({ page }) => {
  await page.goto('/tools/image-resizer/');

  const qualityInput = page.locator('#ir-quality');
  const qualityValue = page.locator('#ir-quality-value');

  await expect(qualityInput).toHaveValue('80');
  await expect(qualityValue).toContainText('80%');

  await qualityInput.fill('50');
  await expect(qualityValue).toContainText('50%');

  await qualityInput.fill('100');
  await expect(qualityValue).toContainText('100%');
});

test('ボタンの初期状態が正しい', async ({ page }) => {
  await page.goto('/tools/image-resizer/');

  const resetButton = page.locator('#ir-reset-button');
  const clearButton = page.locator('#ir-clear-button');

  await expect(resetButton).toBeDisabled();
  await expect(clearButton).toBeDisabled();
});
