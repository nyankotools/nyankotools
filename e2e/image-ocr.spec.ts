import { test, expect, type Page } from './helpers/test';

/** ブラウザのCanvas APIで、白地に大きな黒文字を描いたテスト用PNGを生成する */
async function createTextPng(page: Page, text: string): Promise<Buffer> {
  const dataUrl = await page.evaluate((t) => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 72px Arial, Helvetica, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(t, 24, 80);
    return canvas.toDataURL('image/png');
  }, text);
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

test.describe('画像から文字抽出（OCR）', () => {
  test('英語の画像から文字を認識でき、コピー・保存ボタンが使える（CSP下でwasmが動く）', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.goto('/tools/image-ocr/');
    const buffer = await createTextPng(page, 'Hello OCR 123');
    await page
      .locator('#ocr-file-input')
      .setInputFiles({ name: 'sample.png', mimeType: 'image/png', buffer });

    await expect(page.locator('#ocr-source')).toBeVisible();
    await expect(page.locator('#ocr-file-info')).toContainText('sample.png');

    await page.locator('#ocr-language [data-lang="eng"]').click();
    await page.locator('#ocr-recognize-button').click();

    await expect(page.locator('#ocr-result-section')).toBeVisible({
      timeout: 90_000,
    });
    await expect(page.locator('#ocr-result')).toHaveValue(/Hello/i);
    await expect(page.locator('#ocr-confidence')).toContainText('%');
    await expect(page.locator('#ocr-error')).toBeHidden();
    await expect(page.locator('#ocr-recognize-button')).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#ocr-download-button').click();
    expect((await downloadPromise).suggestedFilename()).toBe('sample.txt');
  });

  test('日本語＋英語（既定）でも認識が完了する', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/tools/image-ocr/');
    const buffer = await createTextPng(page, 'Hello OCR 123');
    await page
      .locator('#ocr-file-input')
      .setInputFiles({ name: 'sample.png', mimeType: 'image/png', buffer });
    await expect(
      page.locator('#ocr-language [data-lang="jpn+eng"]'),
    ).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#ocr-recognize-button').click();
    await expect(page.locator('#ocr-result-section')).toBeVisible({
      timeout: 90_000,
    });
    await expect(page.locator('#ocr-result')).toHaveValue(/Hello/i);
  });

  test('画像以外のファイルはエラーになり、画像選択後にクリアできる', async ({
    page,
  }) => {
    await page.goto('/tools/image-ocr/');
    await page.locator('#ocr-file-input').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#ocr-error')).toBeVisible();
    await expect(page.locator('#ocr-source')).toBeHidden();

    const buffer = await createTextPng(page, 'Hi');
    await page
      .locator('#ocr-file-input')
      .setInputFiles({ name: 'b.png', mimeType: 'image/png', buffer });
    await expect(page.locator('#ocr-source')).toBeVisible();
    await expect(page.locator('#ocr-error')).toBeHidden();
    await page.locator('#ocr-clear-button').click();
    await expect(page.locator('#ocr-source')).toBeHidden();
  });

  test('英語ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/image-ocr/');
    await expect(page.locator('#ocr-recognize-button')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('OCR');
  });
});
