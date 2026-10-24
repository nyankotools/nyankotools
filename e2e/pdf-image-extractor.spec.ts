import { test, expect } from './helpers/test';
import { PDFDocument } from 'pdf-lib';

// 1x1 の PNG
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

async function createPdfWithImages(
  pageCount: number,
  imagePages: number[],
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const image = await doc.embedPng(PNG);
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([200, 300]);
    page.drawText(`Page ${i + 1}`, { x: 10, y: 270, size: 14 });
    if (imagePages.includes(i + 1)) {
      page.drawImage(image, { x: 20, y: 100, width: 80, height: 80 });
    }
  }
  return Buffer.from(await doc.save());
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-image-extractor/'],
  ['en', '/en/tools/pdf-image-extractor/'],
] as const) {
  test.describe(`PDF画像抽出 (${locale})`, () => {
    test('埋め込み画像を抽出し、サムネイルとZIP保存ボタンが出る', async ({
      page,
    }) => {
      await page.goto(base);
      await page.locator('#ext-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createPdfWithImages(3, [1, 3]),
      });
      await expect(page.locator('#ext-info')).toContainText('doc.pdf');
      await page.locator('#ext-run').click();
      await expect(page.locator('#ext-list li')).toHaveCount(2);
      await expect(page.locator('#ext-list img').first()).toHaveAttribute(
        'alt',
        'doc_p1_img01.png',
      );
      await expect(page.locator('#ext-zip-button')).toBeVisible();
      const downloadPromise = page.waitForEvent('download');
      await page.locator('#ext-zip-button').click();
      expect((await downloadPromise).suggestedFilename()).toBe(
        'doc_images.zip',
      );
    });

    test('ページ範囲を指定すると対象ページの画像だけ抽出される', async ({
      page,
    }) => {
      await page.goto(base);
      await page.locator('#ext-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createPdfWithImages(3, [1, 3]),
      });
      await expect(page.locator('#ext-info')).toBeVisible();
      await page.locator('#ext-range').fill('3');
      await page.locator('#ext-run').click();
      await expect(page.locator('#ext-list li')).toHaveCount(1);
      await expect(page.locator('#ext-list img')).toHaveAttribute(
        'alt',
        'doc_p3_img01.png',
      );
    });

    test('小さい画像の除外を指定すると結果が空になる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#ext-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createPdfWithImages(1, [1]),
      });
      await expect(page.locator('#ext-info')).toBeVisible();
      await page.locator('#ext-min-size').selectOption('32');
      await page.locator('#ext-run').click();
      await expect(page.locator('#ext-result')).toBeVisible();
      await expect(page.locator('#ext-list li')).toHaveCount(0);
      await expect(page.locator('#ext-zip-button')).toBeHidden();
    });

    test('範囲外のページ指定はエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#ext-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createPdfWithImages(2, [1]),
      });
      await expect(page.locator('#ext-info')).toBeVisible();
      await page.locator('#ext-range').fill('9');
      await page.locator('#ext-run').click();
      await expect(page.locator('#ext-error')).toBeVisible();
      await expect(page.locator('#ext-error')).toContainText('2');
    });

    test('壊れたPDFとファイル未選択はエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#ext-run').click();
      await expect(page.locator('#ext-error')).toBeVisible();
      await page.locator('#ext-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#ext-error')).toBeVisible();
    });
  });
}
