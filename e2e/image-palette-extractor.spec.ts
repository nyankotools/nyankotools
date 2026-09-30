import { test, expect, type Page } from './helpers/test';

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

test('画像カラーパレット抽出ツール（日本語）が正しく表示される', async ({
  page,
}) => {
  await page.goto('/tools/image-palette-extractor/');

  await expect(page.locator('main h1')).toHaveText(
    '画像カラーパレット抽出ツール',
  );
});

test('画像カラーパレット抽出ツール（英語）が正しく表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/image-palette-extractor/');

  await expect(page.locator('main h1')).toHaveText(
    'Image Color Palette Extractor',
  );
});

test('ページ要素が正しく配置されている', async ({ page }) => {
  await page.goto('/tools/image-palette-extractor/');

  await expect(page.locator('#pe-dropzone')).toBeVisible();
  await expect(page.locator('#pe-file-input')).toBeVisible();
  await expect(page.locator('#pe-palette-size')).toBeVisible();

  await expect(page.locator('#pe-clear-button')).toBeDisabled();
  await expect(page.locator('#pe-results-section')).toHaveAttribute('hidden');
});

test('画像を選択するとカラーパレットが抽出される', async ({ page }) => {
  await page.goto('/tools/image-palette-extractor/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#pe-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#pe-source-info')).toContainText('200×100px');
  await expect(page.locator('#pe-results-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#pe-palette-list li')).not.toHaveCount(0);
  await expect(page.locator('#pe-copy-all-button')).not.toBeDisabled();
  await expect(page.locator('#pe-clear-button')).not.toBeDisabled();

  // テスト画像は2色（青・オレンジ）で構成されているため、上位2色にその系統のHEXが含まれる
  const hexTexts = await page
    .locator('#pe-palette-list [data-hex]')
    .allTextContents();
  expect(hexTexts.some((hex) => hex.toLowerCase() === '#3366ff')).toBe(true);
  expect(hexTexts.some((hex) => hex.toLowerCase() === '#ff9933')).toBe(true);
});

test('抽出する色数を変更すると一覧の件数が変わる', async ({ page }) => {
  await page.goto('/tools/image-palette-extractor/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#pe-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  const paletteSizeInput = page.locator('#pe-palette-size');
  const paletteSizeValue = page.locator('#pe-palette-size-value');

  await expect(paletteSizeValue).toContainText('6色');
  // 境界部分のアンチエイリアスも別の色として集計されるため、件数は6以下の範囲で確認する
  const initialCount = await page.locator('#pe-palette-list li').count();
  expect(initialCount).toBeGreaterThan(0);
  expect(initialCount).toBeLessThanOrEqual(6);

  await paletteSizeInput.fill('2');
  await expect(paletteSizeValue).toContainText('2色');
  await expect(page.locator('#pe-palette-list li')).toHaveCount(2);
});

test('スウォッチのコピーボタンでHEXコードをコピーできる', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/tools/image-palette-extractor/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#pe-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  await page.locator('#pe-palette-list li [data-copy]').first().click();
  await expect(page.locator('#pe-copy-status')).toHaveText('コピーしました');

  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  expect(clipboardText).toMatch(/^#[0-9a-f]{6}$/i);
});

test('対応外ファイル形式を選択するとエラーが表示される', async ({ page }) => {
  await page.goto('/tools/image-palette-extractor/');

  await page.locator('#pe-file-input').setInputFiles({
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });

  await expect(page.locator('#pe-error')).toBeVisible();
  await expect(page.locator('#pe-results-section')).toHaveAttribute('hidden');
});

test('クリアボタンで状態がリセットされる', async ({ page }) => {
  await page.goto('/tools/image-palette-extractor/');
  const buffer = await createTestPng(page, 100, 100);
  await page
    .locator('#pe-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });
  await expect(page.locator('#pe-results-section')).not.toHaveAttribute(
    'hidden',
  );

  await page.locator('#pe-clear-button').click();

  await expect(page.locator('#pe-results-section')).toHaveAttribute('hidden');
  await expect(page.locator('#pe-source-info')).toHaveText('');
  await expect(page.locator('#pe-clear-button')).toBeDisabled();
});

test('単色画像（全て同じ色）でもパレットが抽出される', async ({ page }) => {
  await page.goto('/tools/image-palette-extractor/');
  const singleColorPng = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff5500';
    ctx.fillRect(0, 0, 100, 100);
    return canvas.toDataURL('image/png');
  });
  const buffer = Buffer.from(singleColorPng.split(',')[1], 'base64');

  await page
    .locator('#pe-file-input')
    .setInputFiles({ name: 'single-color.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#pe-results-section')).not.toHaveAttribute(
    'hidden',
  );
  const items = page.locator('#pe-palette-list li');
  expect(await items.count()).toBeGreaterThan(0);
  expect(await items.count()).toBeLessThanOrEqual(6);
});

test('非常に小さい画像（1x1）でもパレットが抽出される', async ({ page }) => {
  await page.goto('/tools/image-palette-extractor/');
  const tinyPng = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 1, 1);
    return canvas.toDataURL('image/png');
  });
  const buffer = Buffer.from(tinyPng.split(',')[1], 'base64');

  await page
    .locator('#pe-file-input')
    .setInputFiles({ name: 'tiny.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#pe-source-info')).toContainText('1×1px');
  await expect(page.locator('#pe-results-section')).not.toHaveAttribute(
    'hidden',
  );
});

test('全透明画像ではエラーが表示される', async ({ page }) => {
  await page.goto('/tools/image-palette-extractor/');
  const transparentPng = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    // 描画しない（全透明のまま）
    return canvas.toDataURL('image/png');
  });
  const buffer = Buffer.from(transparentPng.split(',')[1], 'base64');

  await page.locator('#pe-file-input').setInputFiles({
    name: 'transparent.png',
    mimeType: 'image/png',
    buffer,
  });

  await expect(page.locator('#pe-error')).toBeVisible();
  await expect(page.locator('#pe-error')).toContainText('検出できませんでした');
  await expect(page.locator('#pe-results-section')).toHaveAttribute('hidden');
});

test('スライダーの最小値（2色）と最大値（12色）で正しく動作する', async ({
  page,
}) => {
  await page.goto('/tools/image-palette-extractor/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#pe-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  const paletteSizeInput = page.locator('#pe-palette-size');

  // 最小値（2）テスト
  await paletteSizeInput.fill('2');
  await expect(page.locator('#pe-palette-list li')).toHaveCount(2);

  // 最大値（12）テスト
  await paletteSizeInput.fill('12');
  const maxCountLiResult = await page.locator('#pe-palette-list li').count();
  expect(maxCountLiResult).toBeLessThanOrEqual(12);
  expect(maxCountLiResult).toBeGreaterThan(0);
});

test('クリア後に再度画像を選択できる', async ({ page }) => {
  await page.goto('/tools/image-palette-extractor/');
  const buffer1 = await createTestPng(page, 100, 100);
  await page.locator('#pe-file-input').setInputFiles({
    name: 'test1.png',
    mimeType: 'image/png',
    buffer: buffer1,
  });

  await expect(page.locator('#pe-results-section')).not.toHaveAttribute(
    'hidden',
  );
  const firstResultCount = await page.locator('#pe-palette-list li').count();
  expect(firstResultCount).toBeGreaterThan(0);

  // クリア
  await page.locator('#pe-clear-button').click();
  await expect(page.locator('#pe-results-section')).toHaveAttribute('hidden');

  // 別の画像を選択
  const buffer2 = await createTestPng(page, 150, 75);
  await page.locator('#pe-file-input').setInputFiles({
    name: 'test2.png',
    mimeType: 'image/png',
    buffer: buffer2,
  });

  await expect(page.locator('#pe-results-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#pe-source-info')).toContainText('150×75px');
});

test('コピーボタンで全HEXコードをコピーできる', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/tools/image-palette-extractor/');
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#pe-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });

  await page.locator('#pe-copy-all-button').click();
  await expect(page.locator('#pe-copy-status')).toHaveText('コピーしました');

  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  expect(clipboardText).toBeTruthy();
  // 複数の HEX コードが改行で区切られている
  expect(clipboardText.includes('\n')).toBe(true);
  // 各行が HEX コードの形式（trim で空白を削除）
  const lines = clipboardText.trim().split('\n');
  expect(lines.length).toBeGreaterThan(0);
  for (const line of lines) {
    expect(line.trim()).toMatch(/^#[0-9a-f]{6}$/i);
  }
});
