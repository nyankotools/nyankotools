import { deflateSync } from 'node:zlib';
import { test, expect } from './helpers/test';

test.use({
  permissions: ['camera'],
  launchOptions: {
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
    ],
  },
});

function crc32(buf: Buffer): number {
  let c = ~0;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), body.length + 4);
  return out;
}

/** 単色のRGB PNG。 */
function solidPng(
  width: number,
  height: number,
  rgb: [number, number, number],
) {
  const row = Buffer.alloc(1 + width * 3);
  for (let x = 0; x < width; x++) {
    row[1 + x * 3] = rgb[0];
    row[2 + x * 3] = rgb[1];
    row[3 + x * 3] = rgb[2];
  }
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const PNG = solidPng(200, 200, [255, 0, 0]);

test.describe('証明写真作成（日本語版）', () => {
  test('初期状態はエディタが非表示', async ({ page }) => {
    await page.goto('/tools/id-photo-maker/');
    await expect(page.locator('#idp-empty')).toBeVisible();
    await expect(page.locator('#idp-editor')).toBeHidden();
    await expect(page.locator('#idp-capture')).toBeDisabled();
  });

  test('画像ファイルを選ぶと履歴書サイズ(354×472)で表示される', async ({
    page,
  }) => {
    await page.goto('/tools/id-photo-maker/');
    await page.locator('#idp-file').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: PNG,
    });
    await expect(page.locator('#idp-editor')).toBeVisible();
    await expect(page.locator('#idp-info')).toContainText('354 × 472');
    const size = await page.evaluate(() => {
      const c = document.getElementById('idp-canvas') as HTMLCanvasElement;
      return [c.width, c.height];
    });
    expect(size).toEqual([354, 472]);
  });

  test('サイズ・解像度の変更が出力サイズに反映される', async ({ page }) => {
    await page.goto('/tools/id-photo-maker/');
    await page.locator('#idp-file').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: PNG,
    });
    await page.locator('#idp-preset').selectOption('passport');
    await expect(page.locator('#idp-info')).toContainText('413 × 531');
    await page.locator('#idp-dpi').selectOption('600');
    await expect(page.locator('#idp-info')).toContainText('827 × 1063');
  });

  test('サイズ指定では入力でき、範囲外はエラーになる', async ({ page }) => {
    await page.goto('/tools/id-photo-maker/');
    await page.locator('#idp-file').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: PNG,
    });
    await expect(page.locator('#idp-width')).toHaveAttribute('readonly', '');
    await page.locator('#idp-preset').selectOption('custom');
    await page.locator('#idp-width').fill('50');
    await page.locator('#idp-height').fill('50');
    await expect(page.locator('#idp-info')).toContainText('591 × 591');
    await page.locator('#idp-width').fill('5');
    await expect(page.locator('#idp-size-error')).toBeVisible();
  });

  test('縮小すると余白が背景色で塗られ、注意書きが出る', async ({ page }) => {
    await page.goto('/tools/id-photo-maker/');
    await page.locator('#idp-file').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: PNG,
    });
    await expect(page.locator('#idp-gap-note')).toBeHidden();
    await page.locator('#idp-bg').evaluate((el: HTMLInputElement) => {
      el.value = '#0000ff';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.locator('#idp-zoom').evaluate((el: HTMLInputElement) => {
      el.value = '0.5';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(page.locator('#idp-gap-note')).toBeVisible();
    const corner = await page.evaluate(() => {
      const c = document.getElementById('idp-canvas') as HTMLCanvasElement;
      return Array.from(c.getContext('2d')!.getImageData(1, 1, 1, 1).data);
    });
    expect(corner).toEqual([0, 0, 255, 255]);
    // 中央は元画像（赤）
    const center = await page.evaluate(() => {
      const c = document.getElementById('idp-canvas') as HTMLCanvasElement;
      return Array.from(
        c.getContext('2d')!.getImageData(c.width / 2, c.height / 2, 1, 1).data,
      );
    });
    expect(center).toEqual([255, 0, 0, 255]);
  });

  test('ダウンロードでサイズ入りファイル名のJPEGが保存される', async ({
    page,
  }) => {
    await page.goto('/tools/id-photo-maker/');
    await page.locator('#idp-file').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: PNG,
    });
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#idp-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('id-photo-30x40mm.jpg');
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/id-photo-maker/');
    await page.locator('#idp-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#idp-file-error')).toBeVisible();
    await expect(page.locator('#idp-editor')).toBeHidden();
  });

  test('カメラで撮影するとエディタに表示される', async ({ page }) => {
    await page.goto('/tools/id-photo-maker/');
    await page.locator('#idp-toggle').click();
    await expect(page.locator('#idp-capture')).toBeEnabled();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (document.getElementById('idp-video') as HTMLVideoElement)
              .readyState,
        ),
      )
      .toBeGreaterThanOrEqual(2);
    await page.locator('#idp-capture').click();
    await expect(page.locator('#idp-editor')).toBeVisible();
    await expect(page.locator('#idp-info')).toContainText('354 × 472');
  });
});

test.describe('ID Photo Maker（英語版）', () => {
  test('英語版でも画像から作成できる', async ({ page }) => {
    await page.goto('/en/tools/id-photo-maker/');
    await page.locator('#idp-file').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: PNG,
    });
    await expect(page.locator('#idp-info')).toContainText('Output size');
  });
});

test.describe('権限拒否時（日本語版）', () => {
  test('カメラが許可されないとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/id-photo-maker/');
    await page.evaluate(() => {
      navigator.mediaDevices.getUserMedia = () =>
        Promise.reject(new DOMException('denied', 'NotAllowedError'));
    });
    await page.locator('#idp-toggle').click();
    await expect(page.locator('#idp-error')).toContainText('許可');
    await expect(page.locator('#idp-toggle')).toHaveText('カメラを開始');
  });
});
