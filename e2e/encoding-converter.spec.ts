import { test, expect } from './helpers/test';

// 「こんにちは、世界」のShift_JIS
const SJIS_BYTES = Buffer.from([
  0x82, 0xb1, 0x82, 0xf1, 0x82, 0xc9, 0x82, 0xbf, 0x82, 0xcd, 0x81, 0x41, 0x90,
  0xa2, 0x8a, 0x45,
]);

test.describe('文字コード変換・文字化け診断（日本語版）', () => {
  test('Shift_JISのファイルを自動判定して表示できる', async ({ page }) => {
    await page.goto('/tools/encoding-converter/');

    await page.locator('#enc-file-input').setInputFiles({
      name: 'sample.csv',
      mimeType: 'text/csv',
      buffer: SJIS_BYTES,
    });

    await expect(page.locator('#enc-text')).toHaveValue('こんにちは、世界');
    await expect(page.locator('#enc-detected')).toContainText('Shift_JIS');
    await expect(page.locator('#enc-filename')).toHaveValue(
      'sample_converted.csv',
    );
  });

  test('読み込む文字コードを手動で変えると内容が変わり、不正バイトが警告される', async ({
    page,
  }) => {
    await page.goto('/tools/encoding-converter/');
    await page.locator('#enc-file-input').setInputFiles({
      name: 'sample.txt',
      mimeType: 'text/plain',
      buffer: SJIS_BYTES,
    });

    await page.locator('#enc-source').selectOption('utf-8');
    await expect(page.locator('#enc-invalid')).toBeVisible();
    await page.locator('#enc-source').selectOption('shift_jis');
    await expect(page.locator('#enc-invalid')).toBeHidden();
    await expect(page.locator('#enc-text')).toHaveValue('こんにちは、世界');
  });

  test('UTF-8に変換してダウンロードできる', async ({ page }) => {
    await page.goto('/tools/encoding-converter/');
    await page.locator('#enc-file-input').setInputFiles({
      name: 'sample.txt',
      mimeType: 'text/plain',
      buffer: SJIS_BYTES,
    });
    await page.locator('#enc-target').selectOption('utf-8');
    await page.locator('#enc-bom').check();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#enc-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('sample_converted.txt');
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk as Buffer);
    const data = Buffer.concat(chunks);
    expect(data.subarray(0, 3)).toEqual(Buffer.from([0xef, 0xbb, 0xbf]));
    expect(data.subarray(3).toString('utf-8')).toBe('こんにちは、世界');
  });

  test('変換先で表現できない文字は警告される', async ({ page }) => {
    await page.goto('/tools/encoding-converter/');
    await page.locator('#enc-text').fill('a😀b');
    await page.locator('#enc-target').selectOption('shift_jis');
    await expect(page.locator('#enc-unmappable')).toContainText('😀');
    await page.locator('#enc-target').selectOption('utf-8');
    await expect(page.locator('#enc-unmappable')).toBeHidden();
  });

  test('文字化け診断で元のテキストに復元できる', async ({ page }) => {
    await page.goto('/tools/encoding-converter/');
    await page.locator('#enc-mode [data-mode="diagnose"]').click();

    await page.locator('#enc-garbled').fill('縺薙ｓ縺ｫ縺｡縺ｯ');
    const first = page.locator('#enc-diagnose-results li').first();
    await expect(first.locator('pre')).toHaveText('こんにちは');

    await page.locator('#enc-garbled').fill('abc');
    await expect(page.locator('#enc-diagnose-results li')).toHaveCount(0);
    await expect(page.locator('#enc-diagnose-message')).toBeVisible();
  });
});

test.describe('ドラッグ＆ドロップ', () => {
  test('ファイルをドロップして読み込める', async ({ page }) => {
    await page.goto('/tools/encoding-converter/');
    const dataTransfer = await page.evaluateHandle((bytes) => {
      const dt = new DataTransfer();
      dt.items.add(
        new File([new Uint8Array(bytes)], 'drop.txt', { type: 'text/plain' }),
      );
      return dt;
    }, Array.from(SJIS_BYTES));
    await page.locator('#enc-dropzone').dispatchEvent('drop', { dataTransfer });
    await expect(page.locator('#enc-text')).toHaveValue('こんにちは、世界');
    await expect(page.locator('#enc-filename')).toHaveValue(
      'drop_converted.txt',
    );
  });
});

test.describe('改行コードの保持', () => {
  test('CRLFのファイルは変換後もCRLFのまま、LFを選ぶとLFになる', async ({
    page,
  }) => {
    await page.goto('/tools/encoding-converter/');
    await page.locator('#enc-file-input').setInputFiles({
      name: 'crlf.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('a\r\nb\r\n', 'utf-8'),
    });
    const download = async () => {
      const p = page.waitForEvent('download');
      await page.locator('#enc-download').click();
      const stream = await (await p).createReadStream();
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(chunk as Buffer);
      return Buffer.concat(chunks).toString('utf-8');
    };
    expect(await download()).toBe('a\r\nb\r\n');
    await page.locator('#enc-line-ending').selectOption('lf');
    expect(await download()).toBe('a\nb\n');
  });
});

test.describe('Encoding Converter（English）', () => {
  test('英語版でも文字化けを復元できる', async ({ page }) => {
    await page.goto('/en/tools/encoding-converter/');
    await expect(page.locator('main h1')).toHaveText(
      'Character Encoding Converter & Mojibake Fixer',
    );
    await page.locator('#enc-mode [data-mode="diagnose"]').click();
    await page.locator('#enc-garbled').fill('縺薙ｓ縺ｫ縺｡縺ｯ');
    await expect(
      page.locator('#enc-diagnose-results li').first().locator('pre'),
    ).toHaveText('こんにちは');
  });
});
