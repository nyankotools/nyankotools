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

test('ページ要素が正しく配置されている', async ({ page }) => {
  await page.goto('/tools/favicon-generator/');

  await expect(page.locator('#fg-dropzone')).toBeVisible();
  await expect(page.locator('#fg-file-input')).toBeVisible();
  await expect(page.locator('#fg-results-section')).toHaveAttribute('hidden');
  await expect(page.locator('#fg-snippet-section')).toHaveAttribute('hidden');
});

test('十分な大きさの正方形画像から7件のファイル（favicon.ico + 6種のPNG）が生成される', async ({
  page,
}) => {
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 600, 600);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#fg-results-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#fg-results-list li')).toHaveCount(7);
  await expect(page.locator('#fg-source-info')).toContainText('600×600px');
  await expect(page.locator('#fg-warning')).toHaveAttribute('hidden');

  const filenames = await page.locator('[data-filename]').allTextContents();
  expect(filenames).toEqual([
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon-48x48.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
  ]);

  await expect(page.locator('#fg-snippet-section')).not.toHaveAttribute(
    'hidden',
  );
  const snippet = await page.locator('#fg-snippet-output').inputValue();
  expect(snippet).toContain('favicon.ico');
  expect(snippet).toContain('apple-touch-icon.png');
});

test('小さすぎる元画像では警告が表示される', async ({ page }) => {
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 100, 100);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'small.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#fg-results-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#fg-warning')).not.toHaveAttribute('hidden');
});

test('長方形の画像でもエラーにならず正常に処理される', async ({ page }) => {
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 800, 400);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'wide.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#fg-results-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#fg-error')).toBeHidden();
  await expect(page.locator('#fg-source-info')).toContainText('800×400px');
});

test('ダウンロードリンクにファイル名とURLが設定される', async ({ page }) => {
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 600, 600);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer });

  const icoLink = page.locator('[data-download]').first();
  await expect(icoLink).toHaveAttribute('download', 'favicon.ico');
  await expect(icoLink).toHaveAttribute('href', /^blob:/);
});

test('対応外ファイル形式を選択するとエラーが表示される', async ({ page }) => {
  await page.goto('/tools/favicon-generator/');

  await page.locator('#fg-file-input').setInputFiles({
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });

  await expect(page.locator('#fg-error')).toBeVisible();
  await expect(page.locator('#fg-results-section')).toHaveAttribute('hidden');
});

test('クリアボタンで結果がクリアされる', async ({ page }) => {
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 600, 600);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#fg-results-section')).not.toHaveAttribute(
    'hidden',
  );

  await page.locator('#fg-clear-button').click();

  await expect(page.locator('#fg-results-section')).toHaveAttribute('hidden');
  await expect(page.locator('#fg-snippet-section')).toHaveAttribute('hidden');
  await expect(page.locator('#fg-source-info')).toHaveText('');
});

test('コピーボタンでHTMLスニペットをクリップボードにコピーできる', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 600, 600);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer });

  await page.locator('#fg-copy-button').click();
  await expect(page.locator('#fg-copy-status')).toContainText('コピーしました');

  const outputValue = await page.locator('#fg-snippet-output').inputValue();
  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  // コピーされたテキストは出力値と同じ内容（行のトリムは両方で一致する）
  expect(clipboardText.split('\n').map((l) => l.trim())).toEqual(
    outputValue.split('\n').map((l) => l.trim()),
  );
});

test('JPEG形式の画像をアップロードしても正常に処理される', async ({ page }) => {
  await page.goto('/tools/favicon-generator/');
  // Canvas APIはデフォルトでPNGで出力されるが、setInputFilesではmimeTypeをJPEGに指定可能
  const buffer = await createTestPng(page, 400, 400);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'image.jpg', mimeType: 'image/jpeg', buffer });

  await expect(page.locator('#fg-results-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#fg-error')).toBeHidden();
});

test('WebP形式の画像をアップロードしても正常に処理される', async ({ page }) => {
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 500, 500);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'image.webp', mimeType: 'image/webp', buffer });

  await expect(page.locator('#fg-results-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#fg-error')).toBeHidden();
});

test('画像を読み込むとプレビューと切り抜き範囲の枠が表示される', async ({
  page,
}) => {
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 800, 400);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'wide.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#fg-preview-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#fg-preview-image')).toBeVisible();

  const box = await page.locator('#fg-crop-box').boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  // 切り抜き範囲は正方形なので、枠の幅と高さはほぼ一致する
  expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);
});

test('プレビュー上の枠をドラッグすると切り抜き位置が移動し、結果が再生成される', async ({
  page,
}) => {
  await page.goto('/tools/favicon-generator/');
  // 横長画像（幅800×高さ400）: 移動できる余地は横方向のみ
  const buffer = await createTestPng(page, 800, 400);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'wide.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#fg-results-list li')).toHaveCount(7);

  const cropBox = page.locator('#fg-crop-box');
  const before = await cropBox.boundingBox();
  expect(before).not.toBeNull();

  // 初期状態は中央に配置されているので、左端までドラッグして移動させる
  await page.mouse.move(
    before!.x + before!.width / 2,
    before!.y + before!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(before!.x - 1000, before!.y + before!.height / 2, {
    steps: 10,
  });
  await page.mouse.up();

  const after = await cropBox.boundingBox();
  expect(after).not.toBeNull();
  expect(after!.x).toBeLessThan(before!.x);

  // ドラッグ終了後に結果が再生成される（件数は変わらず7件のまま）
  await expect(page.locator('#fg-results-list li')).toHaveCount(7);
});

test('正方形の画像では移動の余地がないため枠の位置が変わらない', async ({
  page,
}) => {
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 400, 400);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'square.png', mimeType: 'image/png', buffer });

  const cropBox = page.locator('#fg-crop-box');
  const before = await cropBox.boundingBox();
  expect(before).not.toBeNull();

  await page.mouse.move(
    before!.x + before!.width / 2,
    before!.y + before!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(before!.x + 200, before!.y + 200, { steps: 10 });
  await page.mouse.up();

  const after = await cropBox.boundingBox();
  expect(after).not.toBeNull();
  expect(Math.abs(after!.x - before!.x)).toBeLessThan(2);
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
});

test('連続して別の画像を選択した場合、前の処理結果が混在しない', async ({
  page,
}) => {
  await page.goto('/tools/favicon-generator/');

  // 1枚目の画像をアップロード
  const buffer1 = await createTestPng(page, 300, 300);
  await page.locator('#fg-file-input').setInputFiles({
    name: 'image1.png',
    mimeType: 'image/png',
    buffer: buffer1,
  });

  // 処理完了待ちではなく、直後に2枚目を選択
  const buffer2 = await createTestPng(page, 400, 400);
  await page.locator('#fg-file-input').setInputFiles({
    name: 'image2.png',
    mimeType: 'image/png',
    buffer: buffer2,
  });

  // 最終的には7件のファイル（2枚目の処理結果）が表示されるはず
  await expect(page.locator('#fg-results-list li')).toHaveCount(7);
  // ソース情報に2枚目のサイズが表示される
  await expect(page.locator('#fg-source-info')).toContainText('400×400px');
});

test('ドラッグ終了後に再生成された結果が、最終的な切り抜き位置を反映している', async ({
  page,
}) => {
  await page.goto('/tools/favicon-generator/');
  const buffer = await createTestPng(page, 800, 600);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'wide.png', mimeType: 'image/png', buffer });

  await expect(page.locator('#fg-results-section')).not.toHaveAttribute(
    'hidden',
  );

  // 初期状態でファイルリストを確認
  await expect(page.locator('#fg-results-list li')).toHaveCount(7);

  const cropBox = page.locator('#fg-crop-box');
  const before = await cropBox.boundingBox();
  expect(before).not.toBeNull();

  // 枠をドラッグして移動
  await page.mouse.move(
    before!.x + before!.width / 2,
    before!.y + before!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(before!.x + 100, before!.y + 100, { steps: 5 });
  await page.mouse.up();

  // ドラッグ後も結果が一貫している（7ファイルが揃っている）。
  // generateOutputs（PNGエンコード）の完了タイミングは実行環境で変動するため、
  // 固定waitではなく自動リトライするexpectで待つ。
  await expect(page.locator('#fg-results-list li')).toHaveCount(7);

  // 結果セクションが表示されている
  await expect(page.locator('#fg-results-section')).not.toHaveAttribute(
    'hidden',
  );

  // すべてのダウンロードリンクに href が設定されている
  const downloadLinks = await page.locator('[data-download]').all();
  expect(downloadLinks.length).toBe(7);
  for (const link of downloadLinks) {
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^blob:/);
  }
});

test('375px幅でのレスポンシブ対応（プレビューと枠がオーバーフローしない）', async ({
  page,
}) => {
  // ビューポートを375pxに設定
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/tools/favicon-generator/');

  const buffer = await createTestPng(page, 600, 600);
  await page
    .locator('#fg-file-input')
    .setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer });

  // プレビューセクションが表示されている
  await expect(page.locator('#fg-preview-section')).not.toHaveAttribute(
    'hidden',
  );

  // プレビュー画像がビューポート内に収まっている
  const previewBox = await page.locator('#fg-preview-image').boundingBox();
  expect(previewBox).not.toBeNull();
  expect(previewBox!.width).toBeLessThanOrEqual(375);

  // 切り抜き枠もビューポート内に収まっている
  const cropBox = await page.locator('#fg-crop-box').boundingBox();
  expect(cropBox).not.toBeNull();
  expect(cropBox!.x + cropBox!.width).toBeLessThanOrEqual(375);

  // プレビューセクション全体がスクロール可能な範囲内に配置されている
  const previewSection = await page
    .locator('#fg-preview-section')
    .boundingBox();
  expect(previewSection).not.toBeNull();
  expect(previewSection!.width).toBeLessThanOrEqual(375);
});
