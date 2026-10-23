import { readFileSync } from 'node:fs';
import { test, expect } from './helpers/test';

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function makePng(width: number, height: number): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', Buffer.from([1, 2, 3, 4])),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

test.describe('画像DPI変更ツール', () => {
  test('PNGを読み込むとピクセル数・印刷サイズ・用紙への収まりが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/image-dpi-changer/');
    await page.locator('#idc-file-input').setInputFiles({
      name: 'a4.png',
      mimeType: 'image/png',
      buffer: makePng(2480, 3508),
    });
    await expect(page.locator('#idc-file-info')).toContainText('2480×3508px');
    await expect(page.locator('#idc-current-dpi')).toContainText('未設定');
    await expect(page.locator('#idc-print-size')).toContainText('210 × 297 mm');
    await expect(page.locator('tr[data-paper="A4"]')).toContainText('収まる');
    await expect(page.locator('tr[data-paper="A3"]')).toContainText('収まる');
    await expect(page.locator('tr[data-paper="A5"]')).toContainText('はみ出す');
  });

  test('DPIを変えると印刷サイズが再計算され、書き換えたPNGをダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/image-dpi-changer/');
    await page.locator('#idc-file-input').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: makePng(720, 360),
    });
    await page.locator('#idc-presets [data-dpi="72"]').click();
    await expect(page.locator('#idc-print-size')).toContainText('254 × 127 mm');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#idc-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('photo-72dpi.png');
    const data = readFileSync((await download.path())!);
    // IHDRの直後にpHYs(72dpi = 2835ppm)が入る
    expect(data.subarray(37, 41).toString('ascii')).toBe('pHYs');
    expect(data.readUInt32BE(41)).toBe(2835);
  });

  test('不正なDPIではエラーが出てダウンロードできない', async ({ page }) => {
    await page.goto('/tools/image-dpi-changer/');
    await page.locator('#idc-file-input').setInputFiles({
      name: 'a.png',
      mimeType: 'image/png',
      buffer: makePng(100, 100),
    });
    await page.locator('#idc-dpi').fill('0');
    await expect(page.locator('#idc-error')).toHaveText(
      'DPIは1〜65535の整数で指定してください',
    );
    await expect(page.locator('#idc-download-button')).toBeDisabled();
  });

  test('非対応形式は案内付きのエラーになる', async ({ page }) => {
    await page.goto('/tools/image-dpi-changer/');
    await page.locator('#idc-file-input').setInputFiles({
      name: 'a.gif',
      mimeType: 'image/gif',
      buffer: Buffer.from('GIF89a\x01\x00\x01\x00', 'binary'),
    });
    await expect(page.locator('#idc-error')).toContainText(
      'PNGまたはJPEGの画像を選んでください',
    );
    await expect(page.locator('#idc-result')).toBeHidden();
  });

  test('英語版でも読み込める', async ({ page }) => {
    await page.goto('/en/tools/image-dpi-changer/');
    await page.locator('#idc-file-input').setInputFiles({
      name: 'a.png',
      mimeType: 'image/png',
      buffer: makePng(300, 300),
    });
    await expect(page.locator('#idc-print-size')).toContainText(
      '25.4 x 25.4 mm',
    );
    await expect(page.locator('#idc-current-dpi')).toContainText('not set');
  });
});
