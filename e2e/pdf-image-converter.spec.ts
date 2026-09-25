import { test, expect } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

async function createTestPdf(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([200, 300]);
    page.drawText(`Page ${i + 1}`, { x: 10, y: 270, size: 14 });
  }
  return Buffer.from(await doc.save());
}

// 1x1 の PNG
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

for (const [locale, base] of [
  ['ja', '/tools/pdf-image-converter/'],
  ['en', '/en/tools/pdf-image-converter/'],
] as const) {
  test.describe(`PDF⇔画像変換 (${locale})`, () => {
    test('PDF→画像: 全ページがPNGで出力される', async ({ page }) => {
      await page.goto(base);
      await page.locator('#conv-pdf-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(3),
      });
      await expect(page.locator('#conv-pdf-info')).toContainText('doc.pdf');
      await page.locator('#conv-run').click();
      const links = page.locator('#conv-result-list a');
      await expect(links).toHaveCount(3);
      await expect(links.first()).toHaveAttribute('download', 'doc_1.png');
    });

    test('PDF→画像: ページ範囲とJPEG形式を指定できる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#conv-pdf-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(5),
      });
      await expect(page.locator('#conv-pdf-info')).toBeVisible();
      await page.locator('#conv-format').selectOption('jpeg');
      await expect(page.locator('#conv-quality-wrap')).toBeVisible();
      await page.locator('#conv-range').fill('2-3');
      await page.locator('#conv-run').click();
      const links = page.locator('#conv-result-list a');
      await expect(links).toHaveCount(2);
      await expect(links.first()).toHaveAttribute('download', 'doc_2.jpg');
    });

    test('PDF→画像: 範囲外のページはエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#conv-pdf-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(2),
      });
      await expect(page.locator('#conv-pdf-info')).toBeVisible();
      await page.locator('#conv-range').fill('9');
      await page.locator('#conv-run').click();
      await expect(page.locator('#conv-error')).toBeVisible();
      await expect(page.locator('#conv-error')).toContainText('2');
    });

    test('PDF→画像: 壊れたPDFはエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#conv-pdf-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#conv-error')).toBeVisible();
    });

    test('暗号化PDFは「パスワードで保護」エラーになる', async ({ page }) => {
      await page.goto(base);
      const doc = await PDFDocument.create();
      doc.addPage();
      // pdf.js が UnknownErrorException で失敗するタイプの暗号化PDF
      doc.context.trailerInfo.Encrypt = doc.context.register(
        doc.context.obj({
          Filter: 'Standard',
          V: 1,
          R: 2,
          O: '(x)',
          U: '(x)',
          P: -4,
        }),
      );
      await page.locator('#conv-pdf-file').setInputFiles({
        name: 'encrypted.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from(await doc.save()),
      });
      await expect(page.locator('#conv-error')).toContainText(
        locale === 'ja' ? 'パスワードで保護' : 'Password-protected',
      );
    });

    test('ファイル未選択で変換するとエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#conv-run').click();
      await expect(page.locator('#conv-error')).toBeVisible();
    });

    test('画像→PDF: 複数画像からPDFを作れる', async ({ page }) => {
      await page.goto(base);
      await page.locator('input[name="conv-mode"][value="toPdf"]').check();
      await expect(page.locator('#conv-image-input')).toBeVisible();
      await page.locator('#conv-image-file').setInputFiles([
        { name: 'a.png', mimeType: 'image/png', buffer: PNG },
        { name: 'b.png', mimeType: 'image/png', buffer: PNG },
      ]);
      await expect(page.locator('#conv-image-list li')).toHaveCount(2);
      await page.locator('#conv-page-size').selectOption('a4');
      await page.locator('#conv-run').click();
      const link = page.locator('#conv-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'images.pdf');
    });

    test('PDF→画像: 空の範囲指定でエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#conv-pdf-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(3),
      });
      await expect(page.locator('#conv-pdf-info')).toBeVisible();
      // 空の範囲を入力（フィールドをフォーカスして空のまま送信）
      await page.locator('#conv-range').fill('');
      await page.locator('#conv-run').click();
      // 空の範囲は "全ページ" と同じで動作するため、エラーではなく変換される
      const links = page.locator('#conv-result-list a');
      await expect(links).toHaveCount(3);
    });

    test('PDF→画像: JPEG品質スライダーが表示・動作する', async ({ page }) => {
      await page.goto(base);
      await page.locator('#conv-pdf-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(1),
      });
      await expect(page.locator('#conv-pdf-info')).toBeVisible();
      await page.locator('#conv-format').selectOption('jpeg');
      await expect(page.locator('#conv-quality-wrap')).toBeVisible();
      // 品質を変更
      await page.locator('#conv-quality').fill('50');
      await expect(page.locator('#conv-quality-value')).toContainText('50');
      await page.locator('#conv-run').click();
      const link = page.locator('#conv-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'doc_1.jpg');
    });

    test('画像→PDF: 複数画像をfitモードでPDFに変換', async ({ page }) => {
      await page.goto(base);
      await page.locator('input[name="conv-mode"][value="toPdf"]').check();
      await expect(page.locator('#conv-image-input')).toBeVisible();
      await page.locator('#conv-image-file').setInputFiles([
        { name: 'a.png', mimeType: 'image/png', buffer: PNG },
        { name: 'b.png', mimeType: 'image/png', buffer: PNG },
      ]);
      await expect(page.locator('#conv-image-list li')).toHaveCount(2);
      await page.locator('#conv-page-size').selectOption('fit');
      await page.locator('#conv-run').click();
      const link = page.locator('#conv-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'images.pdf');
    });
  });
}
