import { readFile } from 'node:fs/promises';
import { test, expect } from './helpers/test';
import { PDFDocument } from 'pdf-lib';

async function createTestPdf(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300]);
  return Buffer.from(await doc.save());
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-page-number-watermark/'],
  ['en', '/en/tools/pdf-page-number-watermark/'],
] as const) {
  test.describe(`PDFページ番号・透かし (${locale})`, () => {
    test('ページ番号と日本語の透かしを付けて保存できる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#pw-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(3),
      });
      await expect(page.locator('#pw-info')).toBeVisible();
      await page.locator('#pw-mark-on').check();
      await page.locator('#pw-mark-text').fill('社外秘');
      await page.locator('#pw-run').click();
      const link = page.locator('#pw-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'doc_stamped.pdf');
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        link.click(),
      ]);
      const out = await PDFDocument.load(
        await readFile((await download.path())!),
      );
      expect(out.getPageCount()).toBe(3);
    });

    test('未選択・両方オフ・透かし文字なし・不正な書式はエラー', async ({
      page,
    }) => {
      await page.goto(base);
      const error = page.locator('#pw-error');
      await page.locator('#pw-run').click();
      await expect(error).toBeVisible();
      await page.locator('#pw-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(1),
      });
      await page.locator('#pw-number-on').uncheck();
      await page.locator('#pw-run').click();
      await expect(error).toBeVisible();
      const noOperation = await error.textContent();
      await page.locator('#pw-mark-on').check();
      await page.locator('#pw-run').click();
      await expect(error).toBeVisible();
      expect(await error.textContent()).not.toBe(noOperation);
      await page.locator('#pw-mark-on').uncheck();
      await page.locator('#pw-number-on').check();
      await page.locator('#pw-template').fill('ページ{n}');
      await page.locator('#pw-run').click();
      await expect(error).toBeVisible();
      await expect(page.locator('#pw-result-list a')).toHaveCount(0);
    });

    test('壊れたPDF・PDF以外はエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#pw-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#pw-error')).toBeVisible();
      await page.locator('#pw-file').setInputFiles({
        name: 'a.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#pw-error')).toBeVisible();
    });
  });
}
