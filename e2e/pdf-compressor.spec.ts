import { test, expect } from './helpers/test';
import { PDFDocument } from 'pdf-lib';

async function createTestPdf(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([200, 300]);
    page.drawText(`Page ${i + 1}`, { x: 10, y: 270, size: 14 });
  }
  return Buffer.from(await doc.save());
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-compressor/'],
  ['en', '/en/tools/pdf-compressor/'],
] as const) {
  test.describe(`PDF圧縮 (${locale})`, () => {
    test('PDFを圧縮してダウンロードリンクとサイズ比較が表示される', async ({
      page,
    }) => {
      await page.goto(base);
      await page.locator('#cmp-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(2),
      });
      await expect(page.locator('#cmp-info')).toContainText('doc.pdf');
      await page.locator('#cmp-level').selectOption('low');
      await page.locator('#cmp-run').click();
      const link = page.locator('#cmp-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'doc_compressed.pdf');
      await expect(page.locator('#cmp-summary')).toContainText('→');
    });

    test('壊れたPDFはエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#cmp-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#cmp-error')).toBeVisible();
    });

    test('PDF以外のファイルはエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#cmp-file').setInputFiles({
        name: 'a.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#cmp-error')).toBeVisible();
    });

    test('ファイル未選択で実行するとエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#cmp-run').click();
      await expect(page.locator('#cmp-error')).toBeVisible();
    });

    test('すべての圧縮レベルで動作する', async ({ page }) => {
      await page.goto(base);
      for (const level of ['high', 'medium', 'low']) {
        await page.locator('#cmp-file').setInputFiles({
          name: `test_${level}.pdf`,
          mimeType: 'application/pdf',
          buffer: await createTestPdf(1),
        });
        await expect(page.locator('#cmp-info')).toBeVisible();
        await page.locator('#cmp-level').selectOption(level);
        await page.locator('#cmp-run').click();
        const link = page.locator('#cmp-result-list a');
        await expect(link).toHaveCount(1);
        await expect(link).toHaveAttribute(
          'download',
          `test_${level}_compressed.pdf`,
        );
        // 次のテストのためクリア
        await page.locator('#cmp-clear').click();
        await expect(page.locator('#cmp-result')).toBeHidden();
      }
    });

    test('複数ページPDFが正常に処理される', async ({ page }) => {
      await page.goto(base);
      const pdfBuffer = await createTestPdf(5);
      await page.locator('#cmp-file').setInputFiles({
        name: 'large.pdf',
        mimeType: 'application/pdf',
        buffer: pdfBuffer,
      });
      await expect(page.locator('#cmp-info')).toContainText('5');
      await page.locator('#cmp-run').click();
      // 大きなPDFなので処理時間が必要
      const link = page.locator('#cmp-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'large_compressed.pdf');
    });

    test('クリアボタンで状態がリセットされる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#cmp-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(1),
      });
      await expect(page.locator('#cmp-info')).toBeVisible();
      await page.locator('#cmp-run').click();
      await expect(page.locator('#cmp-result')).toBeVisible();
      // クリア
      await page.locator('#cmp-clear').click();
      // 情報と結果が隠れる
      await expect(page.locator('#cmp-info')).toBeHidden();
      await expect(page.locator('#cmp-result')).toBeHidden();
    });

    test('大きなPDF（10ページ）も処理できる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#cmp-file').setInputFiles({
        name: 'large.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(10),
      });
      await expect(page.locator('#cmp-info')).toContainText('10');
      await page.locator('#cmp-run').click();
      const link = page.locator('#cmp-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'large_compressed.pdf');
    });
  });
}
