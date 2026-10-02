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
  ['ja', '/tools/pdf-redactor/'],
  ['en', '/en/tools/pdf-redactor/'],
] as const) {
  test.describe(`PDF黒塗り (${locale})`, () => {
    async function loadPdf(
      page: import('@playwright/test').Page,
      pages: number,
      name = 'doc.pdf',
    ) {
      // プレビューが縦長なので、範囲外へのマウス操作にならないよう高いビューポートにする
      await page.setViewportSize({ width: 1280, height: 2000 });
      await page.goto(base);
      await page.locator('#rd-file').setInputFiles({
        name,
        mimeType: 'application/pdf',
        buffer: await createTestPdf(pages),
      });
      await expect(page.locator('#rd-editor')).toBeVisible();
      // プレビューの描画完了（canvasに寸法が入る）を待つ
      await expect
        .poll(() =>
          page
            .locator('#rd-canvas')
            .evaluate((c: HTMLCanvasElement) => c.width),
        )
        .toBeGreaterThan(0);
    }

    async function drag(
      page: import('@playwright/test').Page,
      from: [number, number],
      to: [number, number],
    ) {
      const box = (await page.locator('#rd-canvas').boundingBox())!;
      await page.mouse.move(
        box.x + box.width * from[0],
        box.y + box.height * from[1],
      );
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width * to[0],
        box.y + box.height * to[1],
        {
          steps: 4,
        },
      );
      await page.mouse.up();
    }

    test('ドラッグで黒塗りを追加して書き出し、ダウンロードリンクが表示される', async ({
      page,
    }) => {
      await loadPdf(page, 2);
      await expect(page.locator('#rd-info')).toContainText('doc.pdf');
      await drag(page, [0.05, 0.05], [0.6, 0.2]);
      await expect(page.locator('#rd-boxes > div')).toHaveCount(1);
      await page.locator('#rd-run').click();
      const link = page.locator('#rd-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'doc_redacted.pdf');
    });

    test('書き出したPDFは画像のみで、黒塗り部分が黒く塗られている', async ({
      page,
    }) => {
      await loadPdf(page, 1);
      await drag(page, [0.2, 0.2], [0.8, 0.8]);
      await page.locator('#rd-run').click();
      const link = page.locator('#rd-result-list a');
      await expect(link).toHaveCount(1);
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        link.click(),
      ]);
      const chunks: Buffer[] = [];
      for await (const chunk of await download.createReadStream())
        chunks.push(chunk as Buffer);
      const text = Buffer.concat(chunks).toString('latin1');
      // 画像化されているのでフォント・テキスト描画命令を含まない
      expect(text).not.toContain('/Font');
      expect(text).toContain('/DCTDecode');
    });

    test('ページ移動で黒塗りがページごとに保持される', async ({ page }) => {
      await loadPdf(page, 2);
      await drag(page, [0.1, 0.1], [0.5, 0.3]);
      await expect(page.locator('#rd-boxes > div')).toHaveCount(1);
      await page.locator('#rd-next').click();
      await expect(page.locator('#rd-indicator')).toContainText('2');
      await expect(page.locator('#rd-boxes > div')).toHaveCount(0);
      await page.locator('#rd-prev').click();
      await expect(page.locator('#rd-boxes > div')).toHaveCount(1);
    });

    test('取り消しとこのページを消すボタンが動く', async ({ page }) => {
      await loadPdf(page, 1);
      await drag(page, [0.1, 0.1], [0.4, 0.2]);
      await expect(page.locator('#rd-boxes > div')).toHaveCount(1);
      await drag(page, [0.1, 0.4], [0.4, 0.5]);
      await expect(page.locator('#rd-boxes > div')).toHaveCount(2);
      await page.locator('#rd-undo').click();
      await expect(page.locator('#rd-boxes > div')).toHaveCount(1);
      await page.locator('#rd-clear-page').click();
      await expect(page.locator('#rd-boxes > div')).toHaveCount(0);
    });

    test('黒塗りが0件のまま書き出すとエラー', async ({ page }) => {
      await loadPdf(page, 1);
      await page.locator('#rd-run').click();
      await expect(page.locator('#rd-error')).toBeVisible();
      await expect(page.locator('#rd-result')).toBeHidden();
    });

    test('壊れたPDFはエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#rd-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#rd-error')).toBeVisible();
      await expect(page.locator('#rd-editor')).toBeHidden();
    });

    test('PDF以外のファイルはエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#rd-file').setInputFiles({
        name: 'a.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#rd-error')).toBeVisible();
    });

    test('ファイル未選択で実行するとエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#rd-run').click();
      await expect(page.locator('#rd-error')).toBeVisible();
    });

    test('クリアで状態がリセットされる', async ({ page }) => {
      await loadPdf(page, 1);
      await drag(page, [0.1, 0.1], [0.5, 0.3]);
      await page.locator('#rd-run').click();
      await expect(page.locator('#rd-result')).toBeVisible();
      await page.locator('#rd-clear').click();
      await expect(page.locator('#rd-info')).toBeHidden();
      await expect(page.locator('#rd-editor')).toBeHidden();
      await expect(page.locator('#rd-result')).toBeHidden();
    });
  });
}
