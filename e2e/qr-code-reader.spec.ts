import { deflateSync } from 'node:zlib';
import { test, expect } from './helpers/test';
import { generateQrMatrix } from '../src/lib/tools/qr-generator';

// Chromium のフェイクカメラ（テストパターン）を使い、getUserMedia の実処理まで通す。
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

/** テキストのQRコードをグレースケールPNGのバッファにする。 */
function qrPng(text: string, scale = 6): Buffer {
  const result = generateQrMatrix(text, 'M');
  if (!result.ok) throw new Error('generate failed');
  const { moduleCount, isDark } = result.matrix;
  const quiet = 4;
  const size = (moduleCount + quiet * 2) * scale;
  const raw = Buffer.alloc((size + 1) * size, 255);
  for (let y = 0; y < size; y++) {
    raw[y * (size + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const row = Math.floor(y / scale) - quiet;
      const col = Math.floor(x / scale) - quiet;
      if (
        row >= 0 &&
        col >= 0 &&
        row < moduleCount &&
        col < moduleCount &&
        isDark(row, col)
      ) {
        raw[y * (size + 1) + 1 + x] = 0;
      }
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // ビット深度
  header[9] = 0; // グレースケール
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function file(name: string, buffer: Buffer) {
  return { name, mimeType: 'image/png', buffer };
}

test.describe('QRコードリーダー', () => {
  test('画像からURLのQRコードを読み取り、種類とリンクを表示する', async ({
    page,
  }) => {
    await page.goto('/tools/qr-code-reader/');
    await page
      .locator('#qrr-file')
      .setInputFiles(file('qr.png', qrPng('https://example.com/path')));

    await expect(page.locator('#qrr-result-text')).toHaveText(
      'https://example.com/path',
    );
    await expect(page.locator('#qrr-result')).toContainText('URL');
    const link = page.locator('#qrr-open-link');
    await expect(link).toHaveAttribute('href', 'https://example.com/path');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(page.locator('#qrr-file-error')).toBeHidden();
  });

  test('Wi-Fi用QRコードはSSIDとパスワードを分けて表示する', async ({
    page,
  }) => {
    await page.goto('/tools/qr-code-reader/');
    await page
      .locator('#qrr-file')
      .setInputFiles(file('wifi.png', qrPng('WIFI:T:WPA;S:MyNet;P:secret;;')));

    await expect(page.locator('#qrr-result')).toContainText('Wi-Fi');
    await expect(page.locator('#qrr-result dl')).toContainText('MyNet');
    await expect(page.locator('#qrr-result dl')).toContainText('secret');
  });

  test('javascript: のQRコードはリンクとして開けない', async ({ page }) => {
    await page.goto('/tools/qr-code-reader/');
    await page
      .locator('#qrr-file')
      .setInputFiles(file('js.png', qrPng('javascript:alert(1)')));

    await expect(page.locator('#qrr-result-text')).toHaveText(
      'javascript:alert(1)',
    );
    await expect(page.locator('#qrr-open-link')).toHaveCount(0);
  });

  test('QRコードの無い画像ではエラーを表示する', async ({ page }) => {
    await page.goto('/tools/qr-code-reader/');
    // 1x1の白いPNG
    const blank = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4//8/AwAI/AL+XJ/P2QAAAABJRU5ErkJggg==',
      'base64',
    );
    await page.locator('#qrr-file').setInputFiles(file('blank.png', blank));

    await expect(page.locator('#qrr-file-error')).toBeVisible();
    await expect(page.locator('#qrr-result-text')).toHaveCount(0);
  });

  test('複数読み取ると履歴に残り、履歴から結果を切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/qr-code-reader/');
    const input = page.locator('#qrr-file');
    await input.setInputFiles(file('a.png', qrPng('first')));
    await expect(page.locator('#qrr-result-text')).toHaveText('first');
    await input.setInputFiles(file('b.png', qrPng('second')));
    await expect(page.locator('#qrr-result-text')).toHaveText('second');

    await expect(page.locator('#qrr-history li')).toHaveCount(2);
    await page.locator('#qrr-history li button', { hasText: 'first' }).click();
    await expect(page.locator('#qrr-result-text')).toHaveText('first');
  });

  test('カメラを開始・停止できる（フェイクカメラ）', async ({ page }) => {
    await page.goto('/tools/qr-code-reader/');
    await page.locator('#qrr-toggle').click();
    await expect(page.locator('#qrr-placeholder')).toBeHidden();
    await expect(page.locator('#qrr-status')).toBeVisible();
    await expect(page.locator('#qrr-error')).toBeHidden();

    await page.locator('#qrr-toggle').click();
    await expect(page.locator('#qrr-placeholder')).toBeVisible();
    await expect(page.locator('#qrr-status')).toBeHidden();
  });

  test('英語版でも画像から読み取れる', async ({ page }) => {
    await page.goto('/en/tools/qr-code-reader/');
    await expect(page.locator('main h1')).toHaveText('QR Code Reader');
    await page
      .locator('#qrr-file')
      .setInputFiles(file('qr.png', qrPng('hello')));
    await expect(page.locator('#qrr-result-text')).toHaveText('hello');
  });
});

test.describe('カメラ権限拒否時', () => {
  test.use({ permissions: [] });

  test('権限が拒否されるとエラーが表示され、ボタンは開始に戻る', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      navigator.mediaDevices.getUserMedia = () =>
        Promise.reject(new DOMException('denied', 'NotAllowedError'));
    });
    await page.goto('/tools/qr-code-reader/');
    await page.locator('#qrr-toggle').click();
    await expect(page.locator('#qrr-error')).toBeVisible();
    await expect(page.locator('#qrr-toggle')).toHaveText('カメラを開始');
  });
});
