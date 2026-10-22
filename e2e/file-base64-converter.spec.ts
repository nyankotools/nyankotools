import { test, expect } from './helpers/test';

const PDF_BYTES = Buffer.from('%PDF-1.4\n%test\n');
const PDF_BASE64 = PDF_BYTES.toString('base64');

test.describe('ファイルのBase64変換（日本語版）', () => {
  test('ファイルをData URIとBase64のみに変換できる', async ({ page }) => {
    await page.goto('/tools/file-base64-converter/');

    await page.locator('#fb-file-input').setInputFiles({
      name: 'sample.pdf',
      mimeType: 'application/pdf',
      buffer: PDF_BYTES,
    });

    const output = page.locator('#fb-output');
    await expect(output).toHaveValue(
      `data:application/pdf;base64,${PDF_BASE64}`,
    );
    await expect(page.locator('#fb-encode-file-info')).toContainText(
      'sample.pdf',
    );

    await page.locator('#fb-output-style [data-style="base64-only"]').click();
    await expect(output).toHaveValue(PDF_BASE64);
  });

  test('Base64からファイルをダウンロードできる', async ({ page }) => {
    await page.goto('/tools/file-base64-converter/');
    await page.locator('#fb-mode [data-mode="decode"]').click();

    await page.locator('#fb-decode-input').fill(PDF_BASE64);
    await expect(page.locator('#fb-decode-info')).toContainText(
      'application/pdf',
    );

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#fb-decode-download').click(),
    ]);
    expect(download.suggestedFilename()).toBe('file.pdf');
  });

  test('不正な入力はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/file-base64-converter/');
    await page.locator('#fb-mode [data-mode="decode"]').click();

    await page.locator('#fb-decode-input').fill('not-valid-base64-@@@');
    await expect(page.locator('#fb-decode-error')).toContainText(
      'ファイルに変換できませんでした',
    );
    await expect(page.locator('#fb-decode-result')).toBeHidden();
  });

  test('クリアで結果が消える', async ({ page }) => {
    await page.goto('/tools/file-base64-converter/');
    await page.locator('#fb-file-input').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#fb-encode-result')).toBeVisible();
    await page.locator('#fb-clear-button').click();
    await expect(page.locator('#fb-encode-result')).toBeHidden();
  });
});

test.describe('File to Base64 Converter (English)', () => {
  test('converts a file to a Data URI', async ({ page }) => {
    await page.goto('/en/tools/file-base64-converter/');
    await page.locator('#fb-file-input').setInputFiles({
      name: 'sample.pdf',
      mimeType: 'application/pdf',
      buffer: PDF_BYTES,
    });
    await expect(page.locator('#fb-output')).toHaveValue(
      /^data:application\/pdf;base64,/,
    );
  });
});
