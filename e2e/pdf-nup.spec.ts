import { readFile } from 'node:fs/promises';
import { test, expect } from './helpers/test';
import { PDFDocument } from 'pdf-lib';

async function createTestPdf(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const p = doc.addPage([200, 300]);
    p.drawRectangle({ x: 10, y: 10, width: 100, height: 50 });
  }
  return Buffer.from(await doc.save());
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-nup/'],
  ['en', '/en/tools/pdf-nup/'],
] as const) {
  test.describe(`PDF割付 (${locale})`, () => {
    test('5ページを4in1にして2枚のPDFを保存できる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#nu-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(5),
      });
      await expect(page.locator('#nu-info')).toBeVisible();
      await page.locator('#nu-run').click();
      const link = page.locator('#nu-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'doc_nup.pdf');
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        link.click(),
      ]);
      const out = await PDFDocument.load(
        await readFile((await download.path())!),
      );
      expect(out.getPageCount()).toBe(2);
    });

    for (const [orientation, landscape] of [
      ['auto', true],
      ['portrait', false],
    ] as const) {
      test(`2in1の用紙の向き (${orientation})`, async ({ page }) => {
        await page.goto(base);
        await page.locator('#nu-file').setInputFiles({
          name: 'doc.pdf',
          mimeType: 'application/pdf',
          buffer: await createTestPdf(2),
        });
        await page.locator('#nu-per-sheet').selectOption('2');
        await page.locator('#nu-orientation').selectOption(orientation);
        await page.locator('#nu-run').click();
        const link = page.locator('#nu-result-list a');
        await expect(link).toHaveCount(1);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          link.click(),
        ]);
        const out = await PDFDocument.load(
          await readFile((await download.path())!),
        );
        const sheet = out.getPage(0);
        expect(sheet.getWidth() > sheet.getHeight()).toBe(landscape);
      });
    }

    test('未選択・範囲外の余白はエラー', async ({ page }) => {
      await page.goto(base);
      const error = page.locator('#nu-error');
      await page.locator('#nu-run').click();
      await expect(error).toBeVisible();
      await page.locator('#nu-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(2),
      });
      await page.locator('#nu-margin').fill('500');
      await page.locator('#nu-run').click();
      await expect(error).toBeVisible();
      await expect(page.locator('#nu-result-list a')).toHaveCount(0);
    });

    test('壊れたPDF・PDF以外はエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#nu-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#nu-error')).toBeVisible();
      await page.locator('#nu-file').setInputFiles({
        name: 'a.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#nu-error')).toBeVisible();
    });
  });
}
