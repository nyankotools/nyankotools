import { test, expect, type Page } from './helpers/test';

async function createTestPng(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 120, 80);
    return canvas.toDataURL('image/png');
  });
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function upload(page: Page) {
  const buffer = await createTestPng(page);
  await page
    .locator('#if-file-input')
    .setInputFiles({ name: 'red.png', mimeType: 'image/png', buffer });
  await expect(page.locator('#if-results-section')).toBeVisible();
}

test('初期状態では操作が無効で結果は非表示', async ({ page }) => {
  await page.goto('/tools/image-filter/');
  await expect(page.locator('#if-dropzone')).toBeVisible();
  await expect(page.locator('#if-results-section')).toBeHidden();
  await expect(page.locator('#if-brightness')).toBeDisabled();
  await expect(page.locator('#if-clear-button')).toBeDisabled();
});

test('画像を読み込むと情報とプレビューが表示される', async ({ page }) => {
  await page.goto('/tools/image-filter/');
  await upload(page);
  await expect(page.locator('#if-source-info')).toContainText('120×80px');
  await expect(page.locator('#if-brightness')).toBeEnabled();
});

test('モノクロのプリセットで結果が無彩色になる', async ({ page }) => {
  await page.goto('/tools/image-filter/');
  await upload(page);
  await page.locator('[data-preset="mono"]').click();
  await expect(page.locator('#if-grayscale-value')).toContainText('100');
  await expect
    .poll(async () =>
      page.locator('#if-result-canvas').evaluate((el) => {
        const c = el as HTMLCanvasElement;
        const d = c.getContext('2d')!.getImageData(1, 1, 1, 1).data;
        return d[0] === d[1] && d[1] === d[2];
      }),
    )
    .toBe(true);
});

test('リセットで値が戻る', async ({ page }) => {
  await page.goto('/tools/image-filter/');
  await upload(page);
  await page.locator('#if-contrast').fill('40');
  await expect(page.locator('#if-contrast-value')).toContainText('+40');
  await page.locator('#if-reset-button').click();
  await expect(page.locator('#if-contrast-value')).toContainText('0');
  await expect(page.locator('#if-reset-button')).toBeDisabled();
});

test('フォーマット切替で画質スライダーが切り替わる', async ({ page }) => {
  await page.goto('/tools/image-filter/');
  await upload(page);
  await expect(page.locator('#if-quality')).toBeDisabled();
  await page.locator('[data-format="jpeg"]').click();
  await expect(page.locator('#if-quality')).toBeEnabled();
});

test('ダウンロードでフィルター済みファイル名が使われる', async ({ page }) => {
  await page.goto('/tools/image-filter/');
  await upload(page);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#if-download-button').click(),
  ]);
  expect(download.suggestedFilename()).toBe('red-filtered.png');
});

test('非対応ファイルはエラー表示', async ({ page }) => {
  await page.goto('/tools/image-filter/');
  await page.locator('#if-file-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });
  await expect(page.locator('#if-error')).toBeVisible();
  await expect(page.locator('#if-results-section')).toBeHidden();
});

test('クリアで状態が戻る', async ({ page }) => {
  await page.goto('/en/tools/image-filter/');
  await upload(page);
  await page.locator('#if-clear-button').click();
  await expect(page.locator('#if-results-section')).toBeHidden();
  await expect(page.locator('#if-source-info')).toHaveText('');
});
