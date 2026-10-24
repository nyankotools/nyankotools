import { test, expect, type Page } from './helpers/test';

/** 左が暗い（影）紙に黒い文字を置いたテスト画像 */
async function createTestPng(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 120, 0);
    g.addColorStop(0, '#fafafa');
    g.addColorStop(1, '#8c8c8c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 120, 80);
    ctx.fillStyle = '#202020';
    ctx.fillRect(20, 30, 4, 20);
    return canvas.toDataURL('image/png');
  });
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function upload(page: Page) {
  const buffer = await createTestPng(page);
  await page
    .locator('#ds-file-input')
    .setInputFiles({ name: 'doc.png', mimeType: 'image/png', buffer });
  await expect(page.locator('#ds-results-section')).toBeVisible();
}

test('初期状態では操作が無効で結果は非表示', async ({ page }) => {
  await page.goto('/tools/document-scan-filter/');
  await expect(page.locator('#ds-dropzone')).toBeVisible();
  await expect(page.locator('#ds-results-section')).toBeHidden();
  await expect(page.locator('#ds-shadow')).toBeDisabled();
  await expect(page.locator('#ds-clear-button')).toBeDisabled();
});

test('画像を読み込むと情報が表示され、影の側の紙が白くなる', async ({
  page,
}) => {
  await page.goto('/tools/document-scan-filter/');
  await upload(page);
  await expect(page.locator('#ds-source-info')).toContainText('120×80px');
  await expect
    .poll(async () =>
      page.locator('#ds-result-canvas').evaluate((el) => {
        const c = el as HTMLCanvasElement;
        return c.getContext('2d')!.getImageData(c.width - 3, 2, 1, 1).data[0];
      }),
    )
    .toBeGreaterThan(230);
});

test('白黒2値のプリセットで結果が0か255になりしきい値欄が出る', async ({
  page,
}) => {
  await page.goto('/tools/document-scan-filter/');
  await upload(page);
  await expect(page.locator('#ds-threshold-group')).toBeHidden();
  await page.locator('[data-preset="bw"]').click();
  await expect(page.locator('#ds-threshold-group')).toBeVisible();
  await expect
    .poll(async () =>
      page.locator('#ds-result-canvas').evaluate((el) => {
        const c = el as HTMLCanvasElement;
        const d = c
          .getContext('2d')!
          .getImageData(0, 0, c.width, c.height).data;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] !== 0 && d[i] !== 255) return false;
        }
        return true;
      }),
    )
    .toBe(true);
});

test('自動しきい値をオフにすると手動スライダーが有効になる', async ({
  page,
}) => {
  await page.goto('/tools/document-scan-filter/');
  await upload(page);
  await page.locator('[data-mode="bw"]').click();
  await expect(page.locator('#ds-threshold')).toBeDisabled();
  await page.locator('#ds-auto-threshold').uncheck();
  await expect(page.locator('#ds-threshold')).toBeEnabled();
});

test('リセットで値が戻る', async ({ page }) => {
  await page.goto('/tools/document-scan-filter/');
  await upload(page);
  await page.locator('#ds-shadow').fill('10');
  await expect(page.locator('#ds-shadow-value')).toContainText('10');
  await page.locator('#ds-reset-button').click();
  await expect(page.locator('#ds-shadow-value')).toContainText('80');
  await expect(page.locator('#ds-reset-button')).toBeDisabled();
});

test('ダウンロードで -scan 付きファイル名が使われる', async ({ page }) => {
  await page.goto('/tools/document-scan-filter/');
  await upload(page);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#ds-download-button').click(),
  ]);
  expect(download.suggestedFilename()).toBe('doc-scan.png');
});

test('非対応ファイルはエラー表示', async ({ page }) => {
  await page.goto('/tools/document-scan-filter/');
  await page.locator('#ds-file-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });
  await expect(page.locator('#ds-error')).toBeVisible();
  await expect(page.locator('#ds-results-section')).toBeHidden();
});

test('クリアで状態が戻る', async ({ page }) => {
  await page.goto('/en/tools/document-scan-filter/');
  await upload(page);
  await page.locator('#ds-clear-button').click();
  await expect(page.locator('#ds-results-section')).toBeHidden();
  await expect(page.locator('#ds-source-info')).toHaveText('');
});
