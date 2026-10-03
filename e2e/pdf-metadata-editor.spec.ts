import { readFile } from 'node:fs/promises';
import { test, expect } from './helpers/test';
import { PDFDocument } from 'pdf-lib';

async function createTestPdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.addPage([200, 300]);
  doc.addPage([200, 300]);
  doc.setTitle('元のタイトル');
  doc.setAuthor('Original Author');
  return Buffer.from(await doc.save());
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-metadata-editor/'],
  ['en', '/en/tools/pdf-metadata-editor/'],
] as const) {
  test.describe(`PDFメタデータ編集 (${locale})`, () => {
    test('現在の値が表示され、編集・削除して保存できる', async ({ page }) => {
      await page.goto(base);
      await expect(page.locator('#md-editor')).toBeHidden();
      await page.locator('#md-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(),
      });
      await expect(page.locator('#md-editor')).toBeVisible();
      await expect(page.locator('#md-title')).toHaveValue('元のタイトル');
      await expect(page.locator('#md-author')).toHaveValue('Original Author');
      await page.locator('#md-title').fill('新しいタイトル');
      await page.locator('#md-author').fill('');
      await page.locator('#md-run').click();
      const link = page.locator('#md-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'doc_metadata.pdf');
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        link.click(),
      ]);
      const out = await PDFDocument.load(
        await readFile((await download.path())!),
        { updateMetadata: false },
      );
      expect(out.getTitle()).toBe('新しいタイトル');
      expect(out.getAuthor()).toBeUndefined();
      expect(out.getPageCount()).toBe(2);
    });

    test('「すべての項目を空にする」で全欄が空になる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#md-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(),
      });
      await expect(page.locator('#md-title')).toHaveValue('元のタイトル');
      await page.locator('#md-empty').click();
      await expect(page.locator('#md-title')).toHaveValue('');
      await expect(page.locator('#md-author')).toHaveValue('');
    });

    test('未選択・壊れたPDF・PDF以外はエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#md-run').click();
      await expect(page.locator('#md-error')).toBeVisible();
      await page.locator('#md-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#md-error')).toBeVisible();
      await expect(page.locator('#md-editor')).toBeHidden();
      await page.locator('#md-file').setInputFiles({
        name: 'a.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#md-error')).toBeVisible();
    });
  });
}
