import { deflateSync } from 'node:zlib';
import { test, expect } from './helpers/test';
import { PDFDict, PDFDocument, PDFName } from 'pdf-lib';

function crc32(buf: Uint8Array): number {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/** 赤一色の 40x20 RGBA PNG */
function createPng(): Buffer {
  const w = 40;
  const h = 20;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      raw.set([200, 0, 0, 255], y * (w * 4 + 1) + 1 + x * 4);
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

async function createTestPdf(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300]);
  return Buffer.from(await doc.save());
}

function hasXObject(doc: PDFDocument, index: number): boolean {
  const res = doc.getPage(index).node.Resources();
  return !!res?.lookupMaybe(PDFName.of('XObject'), PDFDict);
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-stamp/'],
  ['en', '/en/tools/pdf-stamp/'],
] as const) {
  test.describe(`PDF署名・スタンプ挿入 (${locale})`, () => {
    async function loadPdf(
      page: import('@playwright/test').Page,
      pages: number,
    ) {
      await page.setViewportSize({ width: 1280, height: 2000 });
      await page.goto(base);
      await page.locator('#ps-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(pages),
      });
      await expect(page.locator('#ps-editor')).toBeVisible();
      await expect
        .poll(() =>
          page
            .locator('#ps-canvas')
            .evaluate((c: HTMLCanvasElement) => c.width),
        )
        .toBeGreaterThan(0);
    }

    async function loadImage(page: import('@playwright/test').Page) {
      await page.locator('#ps-image').setInputFiles({
        name: 'stamp.png',
        mimeType: 'image/png',
        buffer: createPng(),
      });
      await expect(page.locator('#ps-layer')).toBeVisible();
    }

    async function readDownload(page: import('@playwright/test').Page) {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#ps-download').click(),
      ]);
      const chunks: Buffer[] = [];
      for await (const c of await download.createReadStream())
        chunks.push(c as Buffer);
      return {
        name: download.suggestedFilename(),
        bytes: Buffer.concat(chunks),
      };
    }

    test('電子署名ではない旨の注意書きが表示される', async ({ page }) => {
      await page.goto(base);
      await expect(page.locator('#ps-disclaimer')).toBeVisible();
    });

    test('全ページに押して書き出すと全ページに画像が入る', async ({ page }) => {
      await loadPdf(page, 2);
      await loadImage(page);
      await page.locator('#ps-run').click();
      await expect(page.locator('#ps-result')).toBeVisible();
      const { name, bytes } = await readDownload(page);
      expect(name).toBe('doc_stamped.pdf');
      const out = await PDFDocument.load(bytes);
      expect(out.getPageCount()).toBe(2);
      expect(hasXObject(out, 0)).toBe(true);
      expect(hasXObject(out, 1)).toBe(true);
    });

    test('ページ指定では指定したページだけに入る', async ({ page }) => {
      await loadPdf(page, 3);
      await loadImage(page);
      await page.locator('#ps-target-range').click();
      await page.locator('#ps-range').fill('2-3');
      await page.locator('#ps-run').click();
      await expect(page.locator('#ps-result')).toBeVisible();
      const { bytes } = await readDownload(page);
      const out = await PDFDocument.load(bytes);
      expect(hasXObject(out, 0)).toBe(false);
      expect(hasXObject(out, 1)).toBe(true);
      expect(hasXObject(out, 2)).toBe(true);
    });

    test('ページ指定が不正だとエラー', async ({ page }) => {
      await loadPdf(page, 2);
      await loadImage(page);
      await page.locator('#ps-target-range').click();
      await page.locator('#ps-range').fill('9');
      await page.locator('#ps-run').click();
      await expect(page.locator('#ps-error')).toBeVisible();
      await expect(page.locator('#ps-result')).toBeHidden();
    });

    test('ドラッグで画像の位置が動き、スライダーで大きさが変わる', async ({
      page,
    }) => {
      await loadPdf(page, 1);
      await loadImage(page);
      const before = await page.locator('#ps-layer').boundingBox();
      const stamp = (await page.locator('#ps-stamp').boundingBox())!;
      await page.mouse.move(
        stamp.x + stamp.width / 2,
        stamp.y + stamp.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(
        stamp.x + stamp.width / 2 - 60,
        stamp.y + stamp.height / 2 - 60,
        { steps: 4 },
      );
      await page.mouse.up();
      const after = await page.locator('#ps-layer').boundingBox();
      expect(after!.x).toBeLessThan(before!.x - 30);
      expect(after!.y).toBeLessThan(before!.y - 30);
      await page.locator('#ps-size').fill('50');
      await expect
        .poll(
          async () => (await page.locator('#ps-layer').boundingBox())!.width,
        )
        .toBeGreaterThan(after!.width * 1.5);
    });

    test('画像未選択で実行するとエラー', async ({ page }) => {
      await loadPdf(page, 1);
      await page.locator('#ps-run').click();
      await expect(page.locator('#ps-error')).toBeVisible();
    });

    test('ファイル未選択で実行するとエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#ps-run').click();
      await expect(page.locator('#ps-error')).toBeVisible();
    });

    test('壊れたPDF・PDF以外・画像以外はエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#ps-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#ps-error')).toBeVisible();
      await expect(page.locator('#ps-editor')).toBeHidden();
      await page.locator('#ps-file').setInputFiles({
        name: 'a.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#ps-error')).toBeVisible();
      await page.locator('#ps-image').setInputFiles({
        name: 'a.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#ps-error')).toBeVisible();
    });

    test('クリアで状態がリセットされる', async ({ page }) => {
      await loadPdf(page, 1);
      await loadImage(page);
      await page.locator('#ps-run').click();
      await expect(page.locator('#ps-result')).toBeVisible();
      await page.locator('#ps-clear').click();
      await expect(page.locator('#ps-info')).toBeHidden();
      await expect(page.locator('#ps-editor')).toBeHidden();
      await expect(page.locator('#ps-result')).toBeHidden();
      await expect(page.locator('#ps-image-info')).toBeHidden();
    });
  });
}
