import { test, expect } from './helpers/test';
import { PDFDocument, rgb } from 'pdf-lib';

/** 白地の中央に黒い四角を 1 つ描いた PDF（四角は x 60-140, y 100-200 pt） */
async function createTestPdf(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([200, 300]);
    page.drawRectangle({
      x: 60,
      y: 100,
      width: 80,
      height: 100,
      color: rgb(0, 0, 0),
    });
  }
  return Buffer.from(await doc.save());
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-crop/'],
  ['en', '/en/tools/pdf-crop/'],
] as const) {
  test.describe(`PDF余白トリミング (${locale})`, () => {
    async function loadPdf(
      page: import('@playwright/test').Page,
      pages: number,
    ) {
      await page.setViewportSize({ width: 1280, height: 2000 });
      await page.goto(base);
      await page.locator('#pc-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(pages),
      });
      await expect(page.locator('#pc-editor')).toBeVisible();
      // プレビューの描画完了（canvasに寸法が入る）を待つ
      await expect
        .poll(() =>
          page
            .locator('#pc-canvas')
            .evaluate((c: HTMLCanvasElement) => c.width),
        )
        .toBeGreaterThan(0);
    }

    async function readDownload(page: import('@playwright/test').Page) {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#pc-download').click(),
      ]);
      const chunks: Buffer[] = [];
      for await (const chunk of await download.createReadStream())
        chunks.push(chunk as Buffer);
      return {
        name: download.suggestedFilename(),
        bytes: Buffer.concat(chunks),
      };
    }

    test('数値入力で切り抜いて書き出すと CropBox が設定される', async ({
      page,
    }) => {
      await loadPdf(page, 2);
      await page.locator('#pc-top').fill('10');
      await page.locator('#pc-left').fill('20');
      await page.locator('#pc-run').click();
      await expect(page.locator('#pc-result')).toBeVisible();
      const { name, bytes } = await readDownload(page);
      expect(name).toBe('doc_cropped.pdf');
      const out = await PDFDocument.load(bytes);
      expect(out.getPageCount()).toBe(2);
      for (const i of [0, 1]) {
        const box = out.getPage(i).getCropBox();
        expect(box.x).toBeCloseTo((20 * 72) / 25.4, 1);
        expect(box.width).toBeCloseTo(200 - (20 * 72) / 25.4, 1);
        expect(box.height).toBeCloseTo(300 - (10 * 72) / 25.4, 1);
      }
    });

    test('余白の自動検出で四角の周りに合わせて設定される', async ({ page }) => {
      await loadPdf(page, 1);
      await page.locator('#pc-padding').fill('0');
      await page.locator('#pc-detect').click();
      await expect(page.locator('#pc-status')).not.toHaveText('');
      // 四角は左60pt・右60pt・上100pt・下100pt の余白に囲まれている
      const mm = (pt: number) => (pt * 25.4) / 72;
      await expect
        .poll(async () => Number(await page.locator('#pc-left').inputValue()))
        .toBeGreaterThan(mm(60) - 1.5);
      expect(Number(await page.locator('#pc-left').inputValue())).toBeLessThan(
        mm(60) + 1.5,
      );
      expect(
        Number(await page.locator('#pc-top').inputValue()),
      ).toBeGreaterThan(mm(100) - 1.5);
      await page.locator('#pc-run').click();
      await expect(page.locator('#pc-result')).toBeVisible();
    });

    test('ドラッグで残す範囲を指定すると数値欄に反映される', async ({
      page,
    }) => {
      await loadPdf(page, 1);
      const box = (await page.locator('#pc-canvas').boundingBox())!;
      await page.mouse.move(
        box.x + box.width * 0.25,
        box.y + box.height * 0.25,
      );
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width * 0.75,
        box.y + box.height * 0.75,
        { steps: 4 },
      );
      await page.mouse.up();
      // 200x300pt のページの 25% = 左 50pt（約17.6mm）、上 75pt（約26.5mm）
      await expect
        .poll(async () => Number(await page.locator('#pc-left').inputValue()))
        .toBeGreaterThan(16);
      expect(Number(await page.locator('#pc-left').inputValue())).toBeLessThan(
        19,
      );
      expect(
        Number(await page.locator('#pc-top').inputValue()),
      ).toBeGreaterThan(25);
    });

    test('ページごとモードでは別々の切り抜きを設定できる', async ({ page }) => {
      await loadPdf(page, 2);
      await page.locator('#pc-scope-page').click();
      await page.locator('#pc-left').fill('10');
      await page.locator('#pc-next').click();
      await expect(page.locator('#pc-indicator')).toContainText('2');
      await expect(page.locator('#pc-left')).toHaveValue('0');
      await page.locator('#pc-right').fill('15');
      await page.locator('#pc-run').click();
      await expect(page.locator('#pc-result')).toBeVisible();
      const { bytes } = await readDownload(page);
      const out = await PDFDocument.load(bytes);
      const b0 = out.getPage(0).getCropBox();
      const b1 = out.getPage(1).getCropBox();
      expect(b0.x).toBeCloseTo((10 * 72) / 25.4, 1);
      expect(b0.width).toBeCloseTo(200 - (10 * 72) / 25.4, 1);
      expect(b1.x).toBeCloseTo(0, 1);
      expect(b1.width).toBeCloseTo(200 - (15 * 72) / 25.4, 1);
    });

    test('切り抜きが未設定のまま書き出すとエラー', async ({ page }) => {
      await loadPdf(page, 1);
      await page.locator('#pc-run').click();
      await expect(page.locator('#pc-error')).toBeVisible();
      await expect(page.locator('#pc-result')).toBeHidden();
    });

    test('壊れたPDFはエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#pc-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#pc-error')).toBeVisible();
      await expect(page.locator('#pc-editor')).toBeHidden();
    });

    test('PDF以外のファイルはエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#pc-file').setInputFiles({
        name: 'a.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#pc-error')).toBeVisible();
    });

    test('ファイル未選択で実行するとエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#pc-run').click();
      await expect(page.locator('#pc-error')).toBeVisible();
    });

    test('クリアで状態がリセットされる', async ({ page }) => {
      await loadPdf(page, 1);
      await page.locator('#pc-top').fill('10');
      await page.locator('#pc-run').click();
      await expect(page.locator('#pc-result')).toBeVisible();
      await page.locator('#pc-clear').click();
      await expect(page.locator('#pc-info')).toBeHidden();
      await expect(page.locator('#pc-editor')).toBeHidden();
      await expect(page.locator('#pc-result')).toBeHidden();
    });
  });
}
