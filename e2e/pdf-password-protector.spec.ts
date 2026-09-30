import { test, expect } from './helpers/test';
import { PDFDocument } from 'pdf-lib';

async function createTestPdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.addPage([200, 300]);
  return Buffer.from(await doc.save());
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-password-protector/'],
  ['en', '/en/tools/pdf-password-protector/'],
] as const) {
  test.describe(`PDFパスワード設定 (${locale})`, () => {
    test('パスワードを設定して暗号化PDFをダウンロードできる', async ({
      page,
    }) => {
      await page.goto(base);
      await page.locator('#pp-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(),
      });
      await expect(page.locator('#pp-info')).toBeVisible();
      await page.locator('#pp-user').fill('secret123');
      await page.locator('#pp-print').uncheck();
      await page.locator('#pp-run').click();
      const link = page.locator('#pp-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'doc_protected.pdf');
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        link.click(),
      ]);
      const stream = await download.createReadStream();
      const chunks: Buffer[] = [];
      for await (const c of stream) chunks.push(c as Buffer);
      const text = Buffer.concat(chunks).toString('latin1');
      expect(text).toContain('/Encrypt');
      expect(text).toContain('/V 5');
    });

    test('ファイル未選択・パスワード未入力ではエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#pp-run').click();
      await expect(page.locator('#pp-error')).toBeVisible();
      await page.locator('#pp-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(),
      });
      await expect(page.locator('#pp-info')).toBeVisible();
      await page.locator('#pp-run').click();
      await expect(page.locator('#pp-error')).toBeVisible();
      await expect(page.locator('#pp-result')).toBeHidden();
    });

    test('パスワード表示の切り替えができる', async ({ page }) => {
      await page.goto(base);
      await expect(page.locator('#pp-user')).toHaveAttribute(
        'type',
        'password',
      );
      await page.locator('#pp-show').check();
      await expect(page.locator('#pp-user')).toHaveAttribute('type', 'text');
    });
  });
}
