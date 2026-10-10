import { test, expect } from './helpers/test';
import { blockAnalytics } from './helpers/block-analytics';

const PNG_BYTES = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49,
  0x48, 0x44, 0x52,
]);

/** 非圧縮・サイズ既知のZIPエントリ（ローカルヘッダー）を作る */
function zipEntry(name: string, content = ''): Buffer {
  const nameBytes = Buffer.from(name, 'utf8');
  const body = Buffer.from(content, 'utf8');
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt32LE(body.length, 18);
  header.writeUInt32LE(body.length, 22);
  header.writeUInt16LE(nameBytes.length, 26);
  return Buffer.concat([header, nameBytes, body]);
}

test.describe('ファイル種別判定（日本語版）', () => {
  test('PNGを正しい拡張子で選ぶと一致と表示される', async ({ page }) => {
    await page.goto('/tools/file-type-detector/');
    await expect(page.locator('main h1')).toHaveText(
      'ファイル種別判定（マジックナンバー）',
    );

    await page.locator('#ftd-file-input').setInputFiles({
      name: 'image.png',
      mimeType: 'image/png',
      buffer: PNG_BYTES,
    });

    const card = page.locator('#ftd-results section').first();
    await expect(card.locator('[role="status"]')).toContainText(
      '中身（PNG）と一致しています',
    );
    await expect(card).toContainText('image/png');
    await expect(card).toContainText('89 50 4E 47 0D 0A 1A 0A');
  });

  test('拡張子が中身と違うと警告が表示される', async ({ page }) => {
    await page.goto('/tools/file-type-detector/');
    await page.locator('#ftd-file-input').setInputFiles({
      name: 'photo.jpg',
      mimeType: 'image/jpeg',
      buffer: PNG_BYTES,
    });

    await expect(
      page.locator('#ftd-results [role="status"]').first(),
    ).toContainText('一致しません');
  });

  test('画像の拡張子で保存されたHTMLを検出する', async ({ page }) => {
    await page.goto('/tools/file-type-detector/');
    await page.locator('#ftd-file-input').setInputFiles({
      name: 'download.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('<!DOCTYPE html><html><body>404</body></html>'),
    });

    const status = page.locator('#ftd-results [role="status"]').first();
    await expect(status).toContainText('中身はHTMLのテキスト');
  });

  test('16進ダンプを開いて先頭バイトを確認できる', async ({ page }) => {
    await page.goto('/tools/file-type-detector/');
    await page.locator('#ftd-file-input').setInputFiles({
      name: 'a.png',
      mimeType: 'image/png',
      buffer: PNG_BYTES,
    });

    await page.locator('#ftd-results details summary').first().click();
    await expect(page.locator('#ftd-results pre').first()).toContainText(
      '00000000  89 50 4E 47 0D 0A 1A 0A',
    );
  });

  test('空ファイルでは空である旨が表示される', async ({ page }) => {
    await page.goto('/tools/file-type-detector/');
    await page.locator('#ftd-file-input').setInputFiles({
      name: 'empty.txt',
      mimeType: 'text/plain',
      buffer: Buffer.alloc(0),
    });

    await expect(
      page.locator('#ftd-results [role="status"]').first(),
    ).toContainText('空のファイルです');
  });

  test('複数ファイルを同時に選ぶと、選んだ順に1件ずつ結果が並ぶ', async ({
    page,
  }) => {
    await page.goto('/tools/file-type-detector/');
    await page.locator('#ftd-file-input').setInputFiles([
      { name: 'first.png', mimeType: 'image/png', buffer: PNG_BYTES },
      {
        name: 'second.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('<html><body>x</body></html>'),
      },
      { name: 'third.txt', mimeType: 'text/plain', buffer: Buffer.alloc(0) },
    ]);

    await expect(page.locator('#ftd-results section')).toHaveCount(3);
    await expect(page.locator('#ftd-results section h2')).toHaveText([
      'first.png',
      'second.pdf',
      'third.txt',
    ]);
    await expect(
      page.locator('#ftd-results section').nth(0).locator('[role="status"]'),
    ).toContainText('一致しています');
    await expect(
      page.locator('#ftd-results section').nth(1).locator('[role="status"]'),
    ).toContainText('中身はHTMLのテキスト');
    await expect(
      page.locator('#ftd-results section').nth(2).locator('[role="status"]'),
    ).toContainText('空のファイルです');
  });

  test('ZIP形式のDOCXを拡張子 .docx と一致すると判定する', async ({ page }) => {
    await page.goto('/tools/file-type-detector/');
    const docx = Buffer.concat([
      zipEntry('[Content_Types].xml', '<Types/>'),
      zipEntry('word/document.xml', '<w:document/>'),
    ]);
    await page.locator('#ftd-file-input').setInputFiles({
      name: 'report.docx',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      buffer: docx,
    });

    const card = page.locator('#ftd-results section').first();
    await expect(card.locator('[role="status"]')).toContainText(
      '中身（DOCX）と一致しています',
    );
    await expect(card).toContainText('application/vnd.openxmlformats');
  });

  test('拡張子が無いファイルは、その旨と推定形式を表示する', async ({
    page,
  }) => {
    await page.goto('/tools/file-type-detector/');
    await page.locator('#ftd-file-input').setInputFiles({
      name: 'README',
      mimeType: 'application/octet-stream',
      buffer: PNG_BYTES,
    });

    await expect(
      page.locator('#ftd-results [role="status"]').first(),
    ).toContainText('拡張子がありません');
  });

  test('375px幅で長いファイル名があっても横にはみ出さない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/file-type-detector/');
    await page.locator('#ftd-file-input').setInputFiles({
      name: `${'とても長いファイル名'.repeat(12)}.png`,
      mimeType: 'image/png',
      buffer: PNG_BYTES,
    });

    await expect(page.locator('#ftd-results section')).toHaveCount(1);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('ダークモードでも結果の文字色が切り替わる', async ({ browser }) => {
    const verdictColor = async (scheme: 'light' | 'dark') => {
      const context = await browser.newContext({ colorScheme: scheme });
      await blockAnalytics(context);
      const page = await context.newPage();
      await page.goto('/tools/file-type-detector/');
      await page.locator('#ftd-file-input').setInputFiles({
        name: 'photo.jpg',
        mimeType: 'image/jpeg',
        buffer: PNG_BYTES,
      });
      const status = page.locator('#ftd-results [role="status"]').first();
      await expect(status).toContainText('一致しません');
      const color = await status.evaluate((el) => getComputedStyle(el).color);
      const bodyBg = await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
      );
      await context.close();
      return { color, bodyBg };
    };

    const light = await verdictColor('light');
    const dark = await verdictColor('dark');
    expect(dark.color).not.toBe(light.color);
    expect(dark.bodyBg).not.toBe(light.bodyBg);
  });
});

test.describe('File Type Detector (English)', () => {
  test('detects a PNG and reports a mismatch for the wrong extension', async ({
    page,
  }) => {
    await page.goto('/en/tools/file-type-detector/');
    await expect(page.locator('main h1')).toHaveText(
      'File Type Detector (Magic Number Checker)',
    );

    await page.locator('#ftd-file-input').setInputFiles({
      name: 'photo.gif',
      mimeType: 'image/gif',
      buffer: PNG_BYTES,
    });

    const status = page.locator('#ftd-results [role="status"]').first();
    await expect(status).toContainText('does not match the contents (PNG)');
  });

  test('identifies a ZIP-based DOCX from its entry names', async ({ page }) => {
    await page.goto('/en/tools/file-type-detector/');
    const docx = Buffer.concat([
      zipEntry('[Content_Types].xml', '<Types/>'),
      zipEntry('word/document.xml', '<w:document/>'),
    ]);
    await page.locator('#ftd-file-input').setInputFiles({
      name: 'memo.docx',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      buffer: docx,
    });

    const status = page.locator('#ftd-results [role="status"]').first();
    await expect(status).toContainText('matches the contents (DOCX)');
  });

  test('shows the empty-file message for a 0-byte file', async ({ page }) => {
    await page.goto('/en/tools/file-type-detector/');
    await page.locator('#ftd-file-input').setInputFiles({
      name: 'empty.bin',
      mimeType: 'application/octet-stream',
      buffer: Buffer.alloc(0),
    });

    const status = page.locator('#ftd-results [role="status"]').first();
    await expect(status).toContainText('The file is empty (0 bytes).');
  });
});
