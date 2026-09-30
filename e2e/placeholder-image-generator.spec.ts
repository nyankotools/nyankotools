import { test, expect } from './helpers/test';

test('ダミー画像生成ツール：デフォルト値（600x400）で画像が生成される', async ({
  page,
}) => {
  await page.goto('/tools/placeholder-image-generator/');

  // h1を確認
  await expect(page.locator('main h1')).toHaveText(
    'ダミー画像生成（プレースホルダー画像）',
  );

  // キャンバスが存在し、width/height属性が正しく設定されていることを確認
  const canvas = page.locator('#ph-canvas');
  await expect(canvas).toHaveAttribute('width', '600');
  await expect(canvas).toHaveAttribute('height', '400');

  // ダウンロードボタンが有効（aria-disabled="false"）になっていることを確認
  await expect(page.locator('#ph-download')).toHaveAttribute(
    'aria-disabled',
    'false',
  );

  // ダウンロードボタンの href が設定されていることを確認
  const downloadBtn = page.locator('#ph-download');
  const href = await downloadBtn.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href).toMatch(/^blob:/);
});

test('ダミー画像生成ツール：サイズを変更すると新しい画像が生成される', async ({
  page,
}) => {
  await page.goto('/tools/placeholder-image-generator/');

  const widthInput = page.locator('#ph-width');
  const heightInput = page.locator('#ph-height');
  const canvas = page.locator('#ph-canvas');
  const downloadBtn = page.locator('#ph-download');

  // 初期状態: 600x400
  await expect(canvas).toHaveAttribute('width', '600');
  await expect(canvas).toHaveAttribute('height', '400');
  const initialHref1 = await downloadBtn.getAttribute('href');

  // 800x600に変更
  await widthInput.fill('800');
  await heightInput.fill('600');

  // キャンバスが更新されたことを確認
  await expect(canvas).toHaveAttribute('width', '800');
  await expect(canvas).toHaveAttribute('height', '600');

  // href が新しくなっていることを確認
  const newHref = await downloadBtn.getAttribute('href');
  expect(newHref).not.toBe(initialHref1);
  expect(newHref).toMatch(/^blob:/);
});

test('ダミー画像生成ツール：不正なサイズ入力でエラーが表示される', async ({
  page,
}) => {
  await page.goto('/tools/placeholder-image-generator/');

  const widthInput = page.locator('#ph-width');
  const errorEl = page.locator('#ph-error');
  const downloadBtn = page.locator('#ph-download');

  // サイズを0に変更（不正）
  await widthInput.fill('0');

  // エラーメッセージが表示されることを確認
  await expect(errorEl).not.toHaveAttribute('hidden');
  const errorText = await errorEl.textContent();
  expect(errorText).toContain('1');
  expect(errorText).toContain('4096');

  // ダウンロードボタンが無効（aria-disabled="true"）になっていることを確認
  await expect(downloadBtn).toHaveAttribute('aria-disabled', 'true');

  // href が削除されていることを確認
  const href = await downloadBtn.getAttribute('href');
  expect(href).toBeNull();
});

test('ダミー画像生成ツール：背景色を変更すると画像が更新される', async ({
  page,
}) => {
  await page.goto('/tools/placeholder-image-generator/');

  const bgInput = page.locator('#ph-bg');
  const bgPicker = page.locator('#ph-bg-picker');
  const downloadBtn = page.locator('#ph-download');

  // 初期の href を取得
  const initialHref = await downloadBtn.getAttribute('href');

  // 背景色を赤（#ff0000）に変更
  await bgInput.fill('#ff0000');

  // href が新しくなっていることを確認
  await page.waitForTimeout(100); // レンダリング完了を待つ
  const newHref = await downloadBtn.getAttribute('href');
  expect(newHref).not.toBe(initialHref);

  // カラーピッカーが同期されていることを確認
  await expect(bgPicker).toHaveValue('#ff0000');
});

test('ダミー画像生成ツール：フォーマットを変更するとダウンロード名が更新される', async ({
  page,
}) => {
  await page.goto('/tools/placeholder-image-generator/');

  const formatSelect = page.locator('#ph-format');
  const downloadBtn = page.locator('#ph-download');

  // デフォルト（PNG）のダウンロード名を確認
  let downloadName = await downloadBtn.getAttribute('download');
  expect(downloadName).toContain('.png');

  // JPEGに変更
  await formatSelect.selectOption('jpeg');

  // ダウンロード名が jpg に変更されたことを確認
  downloadName = await downloadBtn.getAttribute('download');
  expect(downloadName).toContain('.jpg');

  // WebPに変更
  await formatSelect.selectOption('webp');

  // ダウンロード名が webp に変更されたことを確認
  downloadName = await downloadBtn.getAttribute('download');
  expect(downloadName).toContain('.webp');
});

test('ダミー画像生成ツール：プリセットボタンでサイズが変更される', async ({
  page,
}) => {
  await page.goto('/tools/placeholder-image-generator/');

  const widthInput = page.locator('#ph-width');
  const heightInput = page.locator('#ph-height');
  const canvas = page.locator('#ph-canvas');

  // 1200x630プリセットをクリック
  const presetBtn = page.locator('.ph-preset', {
    hasText: '1200×630',
  });
  await presetBtn.click();

  // 入力フィールドが更新されたことを確認
  await expect(widthInput).toHaveValue('1200');
  await expect(heightInput).toHaveValue('630');

  // キャンバスが更新されたことを確認
  await expect(canvas).toHaveAttribute('width', '1200');
  await expect(canvas).toHaveAttribute('height', '630');
});

test('ダミー画像生成ツール：テキストを入力すると画像に表示される', async ({
  page,
}) => {
  await page.goto('/tools/placeholder-image-generator/');

  const textInput = page.locator('#ph-text');
  const canvas = page.locator('#ph-canvas');
  const downloadBtn = page.locator('#ph-download');

  // 初期の href を取得
  const initialHref = await downloadBtn.getAttribute('href');

  // テキストを入力
  await textInput.fill('Custom Text');

  // href が新しくなっていることを確認（画像が再生成されたことを示す）
  await page.waitForTimeout(100);
  const newHref = await downloadBtn.getAttribute('href');
  expect(newHref).not.toBe(initialHref);

  // キャンバスはまだ600x400のままであることを確認
  await expect(canvas).toHaveAttribute('width', '600');
  await expect(canvas).toHaveAttribute('height', '400');
});

test('ダミー画像生成ツール（英語版）：ページが正しく表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/placeholder-image-generator/');

  // h1を確認
  await expect(page.locator('main h1')).toHaveText(
    'Placeholder Image Generator',
  );

  // 各ラベルが英語で表示されていることを確認
  await expect(page.locator('label', { hasText: 'Width (px)' })).toBeVisible();
  await expect(page.locator('label', { hasText: 'Height (px)' })).toBeVisible();
  await expect(
    page.locator('label', { hasText: 'Background color' }),
  ).toBeVisible();
});
