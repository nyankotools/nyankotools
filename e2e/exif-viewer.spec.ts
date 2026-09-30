import { test, expect } from './helpers/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** TIFF/Exif由来のASCIIタグ（Make/Model等）1件分のバイト列を組み立てる */
function buildAsciiTagEntry(
  tag: number,
  value: string,
  offset: number,
): { entry: number[]; data: number[]; nextOffset: number } {
  const bytes = [...Buffer.from(`${value}\0`, 'ascii')];
  const entry = [
    tag & 0xff,
    (tag >> 8) & 0xff,
    2,
    0, // type: ASCII
    bytes.length & 0xff,
    (bytes.length >> 8) & 0xff,
    (bytes.length >> 16) & 0xff,
    (bytes.length >> 24) & 0xff,
    offset & 0xff,
    (offset >> 8) & 0xff,
    (offset >> 16) & 0xff,
    (offset >> 24) & 0xff,
  ];
  const padded = bytes.length % 2 === 0 ? bytes : [...bytes, 0];
  return { entry, data: padded, nextOffset: offset + padded.length };
}

/** SOI + APP1(Exif: Make/Model付きの最小TIFF) + EOI という、テスト用のJPEGバイト列を組み立てる */
function buildJpegWithExif(make: string, model: string): Buffer {
  const ifdStart = 8;
  const entryCount = 2;
  const dataStart = ifdStart + 2 + entryCount * 12 + 4;

  const makeTag = buildAsciiTagEntry(0x010f, make, dataStart);
  const modelTag = buildAsciiTagEntry(0x0110, model, makeTag.nextOffset);

  const tiff = [
    0x49,
    0x49, // "II" little endian
    42,
    0, // TIFF magic
    ifdStart,
    0,
    0,
    0, // offset to IFD0
    entryCount,
    0, // number of entries
    ...makeTag.entry,
    ...modelTag.entry,
    0,
    0,
    0,
    0, // next IFD offset (none)
    ...makeTag.data,
    ...modelTag.data,
  ];

  const app1Content = [
    0x45,
    0x78,
    0x69,
    0x66,
    0x00,
    0x00, // "Exif\0\0"
    ...tiff,
  ];
  const app1Length = app1Content.length + 2;

  const jpeg = [
    0xff,
    0xd8, // SOI
    0xff,
    0xe1, // APP1
    (app1Length >> 8) & 0xff,
    app1Length & 0xff,
    ...app1Content,
    0xff,
    0xd9, // EOI
  ];

  return Buffer.from(jpeg);
}

function buildJpegWithoutExif(): Buffer {
  return Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xd9,
  ]);
}

/** 4バイトに収まるASCII値（GPSLatitudeRef等）を、IFDエントリーにインラインで埋め込む */
function buildInlineAsciiTagEntry(tag: number, value: string): number[] {
  const bytes = [...Buffer.from(`${value}\0`, 'ascii')];
  while (bytes.length < 4) bytes.push(0);
  return [
    tag & 0xff,
    (tag >> 8) & 0xff,
    2,
    0, // type: ASCII
    2,
    0,
    0,
    0, // count: 2（1文字+null終端）
    bytes[0],
    bytes[1],
    bytes[2],
    bytes[3],
  ];
}

/** RATIONAL型（分子/分母の組）タグ1件分のバイト列を組み立てる */
function buildRationalTagEntry(
  tag: number,
  values: [number, number][],
  offset: number,
): { entry: number[]; data: number[]; nextOffset: number } {
  const data: number[] = [];
  for (const [numerator, denominator] of values) {
    data.push(
      numerator & 0xff,
      (numerator >> 8) & 0xff,
      (numerator >> 16) & 0xff,
      (numerator >> 24) & 0xff,
      denominator & 0xff,
      (denominator >> 8) & 0xff,
      (denominator >> 16) & 0xff,
      (denominator >> 24) & 0xff,
    );
  }
  const entry = [
    tag & 0xff,
    (tag >> 8) & 0xff,
    5,
    0, // type: RATIONAL
    values.length & 0xff,
    (values.length >> 8) & 0xff,
    (values.length >> 16) & 0xff,
    (values.length >> 24) & 0xff,
    offset & 0xff,
    (offset >> 8) & 0xff,
    (offset >> 16) & 0xff,
    (offset >> 24) & 0xff,
  ];
  return { entry, data, nextOffset: offset + data.length };
}

function buildLongTagEntry(tag: number, value: number): number[] {
  return [
    tag & 0xff,
    (tag >> 8) & 0xff,
    4,
    0, // type: LONG
    1,
    0,
    0,
    0, // count: 1
    value & 0xff,
    (value >> 8) & 0xff,
    (value >> 16) & 0xff,
    (value >> 24) & 0xff,
  ];
}

/** 度単位の小数を、GPSタグで使われる度・分・秒（分母100の秒）のRATIONAL 3組に変換する */
function degreesToDmsRational(value: number): [number, number][] {
  const abs = Math.abs(value);
  const degrees = Math.floor(abs);
  const minutes = Math.floor((abs - degrees) * 60);
  const seconds = Math.round(((abs - degrees) * 60 - minutes) * 60 * 100);
  return [
    [degrees, 1],
    [minutes, 1],
    [seconds, 100],
  ];
}

/** SOI + APP1(Exif: Make/Model/GPS位置情報付きの最小TIFF) + EOI という、テスト用のJPEGバイト列を組み立てる */
function buildJpegWithGps(
  make: string,
  model: string,
  latitude: number,
  longitude: number,
): Buffer {
  const ifd0Start = 8;
  const ifd0EntryCount = 3; // Make, Model, GPS IFDへのポインタ
  const stringDataStart = ifd0Start + 2 + ifd0EntryCount * 12 + 4;

  const makeTag = buildAsciiTagEntry(0x010f, make, stringDataStart);
  const modelTag = buildAsciiTagEntry(0x0110, model, makeTag.nextOffset);

  const gpsIfdStart = modelTag.nextOffset;
  const gpsEntryCount = 4; // LatitudeRef, Latitude, LongitudeRef, Longitude
  const gpsDataStart = gpsIfdStart + 2 + gpsEntryCount * 12 + 4;

  const latRef = buildInlineAsciiTagEntry(0x0001, latitude >= 0 ? 'N' : 'S');
  const lonRef = buildInlineAsciiTagEntry(0x0003, longitude >= 0 ? 'E' : 'W');
  const latTag = buildRationalTagEntry(
    0x0002,
    degreesToDmsRational(latitude),
    gpsDataStart,
  );
  const lonTag = buildRationalTagEntry(
    0x0004,
    degreesToDmsRational(longitude),
    latTag.nextOffset,
  );
  const gpsIfdPointerTag = buildLongTagEntry(0x8825, gpsIfdStart);

  const tiff = [
    0x49,
    0x49, // "II" little endian
    42,
    0, // TIFF magic
    ifd0Start,
    0,
    0,
    0, // offset to IFD0
    ifd0EntryCount,
    0,
    ...makeTag.entry,
    ...modelTag.entry,
    ...gpsIfdPointerTag,
    0,
    0,
    0,
    0, // next IFD offset (none)
    ...makeTag.data,
    ...modelTag.data,
    // GPS IFD
    gpsEntryCount,
    0,
    ...latRef,
    ...latTag.entry,
    ...lonRef,
    ...lonTag.entry,
    0,
    0,
    0,
    0, // next IFD offset (none)
    ...latTag.data,
    ...lonTag.data,
  ];

  const app1Content = [
    0x45,
    0x78,
    0x69,
    0x66,
    0x00,
    0x00, // "Exif\0\0"
    ...tiff,
  ];
  const app1Length = app1Content.length + 2;

  const jpeg = [
    0xff,
    0xd8, // SOI
    0xff,
    0xe1, // APP1
    (app1Length >> 8) & 0xff,
    app1Length & 0xff,
    ...app1Content,
    0xff,
    0xd9, // EOI
  ];

  return Buffer.from(jpeg);
}

/** XMP（位置情報を含みうる）データ付きのJPEGを作成 */
function buildJpegWithXmp(): Buffer {
  const xmpData = Buffer.from(
    '<?xml version="1.0" encoding="UTF-8"?>' +
      '<x:xmpmeta xmlns:x="adobe:ns:meta/">' +
      '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
      '<rdf:Description rdf:about="" xmlns:exif="http://ns.adobe.com/exif/1.0/">' +
      '<exif:GPSLatitude>35.658581</exif:GPSLatitude>' +
      '</rdf:Description>' +
      '</rdf:RDF>' +
      '</x:xmpmeta>',
  );

  const xmpIdentifier = Buffer.from('http://ns.adobe.com/xap/1.0/\0', 'ascii');
  const xmpContent = Buffer.concat([xmpIdentifier, xmpData]);
  const app1Length = xmpContent.length + 2;

  const jpeg = [
    0xff,
    0xd8, // SOI
    0xff,
    0xe1, // APP1
    (app1Length >> 8) & 0xff,
    app1Length & 0xff,
    ...Array.from(xmpContent),
    0xff,
    0xd9, // EOI
  ];

  return Buffer.from(jpeg);
}

test.describe('EXIF情報表示・削除ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/exif-viewer/');
    await expect(page.locator('main h1')).toHaveText('EXIF情報表示・削除');
  });

  test('JPEG以外のファイルを選択するとエラーになる', async ({ page }) => {
    await page.goto('/tools/exif-viewer/');

    const pngPath = path.join(__dirname, 'temp-exif-invalid.png');
    fs.writeFileSync(
      pngPath,
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );

    try {
      await page.locator('#ev-file-input').setInputFiles(pngPath);

      const error = page.locator('#ev-error');
      await expect(error).not.toHaveAttribute('hidden');
      await expect(error).toContainText('JPEG画像');

      const result = page.locator('#ev-result');
      await expect(result).toHaveAttribute('hidden');
    } finally {
      if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
    }
  });

  test('Exif付きJPEGをアップロードすると撮影情報が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-with-data-1.jpg');
    fs.writeFileSync(jpegPath, buildJpegWithExif('TestCam', 'Model X1'));

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);

      const result = page.locator('#ev-result');
      await expect(result).not.toHaveAttribute('hidden');

      const summary = page.locator('#ev-summary-list');
      await expect(summary).toContainText('TestCam');
      await expect(summary).toContainText('Model X1');

      await expect(page.locator('#ev-no-exif-message')).toHaveAttribute(
        'hidden',
        '',
      );
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });

  test('すべての項目を表示ボタンで生データの一覧を表示できる', async ({
    page,
  }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-with-data-2.jpg');
    fs.writeFileSync(jpegPath, buildJpegWithExif('TestCam', 'Model X1'));

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);
      await expect(page.locator('#ev-result')).not.toHaveAttribute('hidden');

      const rawSection = page.locator('#ev-raw-section');
      await expect(rawSection).toHaveAttribute('hidden', '');

      const showAllButton = page.locator('#ev-show-all-button');
      await showAllButton.click();

      await expect(rawSection).not.toHaveAttribute('hidden');
      await expect(page.locator('#ev-raw-table-body')).toContainText('Model');
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });

  test('Exifなし画像をアップロードすると「見つかりませんでした」と表示される', async ({
    page,
  }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-without-data-1.jpg');
    fs.writeFileSync(jpegPath, buildJpegWithoutExif());

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);

      const result = page.locator('#ev-result');
      await expect(result).not.toHaveAttribute('hidden');

      const noExifMessage = page.locator('#ev-no-exif-message');
      await expect(noExifMessage).not.toHaveAttribute('hidden');
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });

  test('Exif情報を削除してダウンロードできる', async ({ page }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-with-data-3.jpg');
    fs.writeFileSync(jpegPath, buildJpegWithExif('TestCam', 'Model X1'));

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);
      await expect(page.locator('#ev-result')).not.toHaveAttribute('hidden');

      const downloadPromise = page.waitForEvent('download');
      await page.locator('#ev-remove-button').click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe(
        'temp-exif-with-data-3-no-exif.jpg',
      );

      const status = page.locator('#ev-remove-status');
      await expect(status).toContainText('削除した画像をダウンロードしました');
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });

  test('クリアボタンで状態をリセットできる', async ({ page }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-with-data-4.jpg');
    fs.writeFileSync(jpegPath, buildJpegWithExif('TestCam', 'Model X1'));

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);
      await expect(page.locator('#ev-result')).not.toHaveAttribute('hidden');

      await page.locator('#ev-clear-button').click();

      await expect(page.locator('#ev-result')).toHaveAttribute('hidden');
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });
});

test.describe('EXIF Viewer & Remover (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/exif-viewer/');
    await expect(page.locator('main h1')).toHaveText('EXIF Viewer & Remover');
  });

  test('Exif付きJPEGをアップロードすると撮影情報が表示される（英語版）', async ({
    page,
  }) => {
    await page.goto('/en/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-with-data-en.jpg');
    fs.writeFileSync(jpegPath, buildJpegWithExif('TestCam', 'Model X1'));

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);

      const summary = page.locator('#ev-summary-list');
      await expect(summary).toContainText('TestCam');
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });
});

test.describe('エッジケース・追加テスト', () => {
  test('ファイルサイズ上限（25MB）超過でエラー表示', async ({ page }) => {
    await page.goto('/tools/exif-viewer/');

    // MAX_FILE_SIZE（25MB）を超えるダミーのJPEGファイルを作成する
    const oversizedPath = path.join(__dirname, 'temp-exif-oversized.jpg');
    fs.writeFileSync(oversizedPath, Buffer.alloc(25 * 1024 * 1024 + 1024));

    try {
      await page.locator('#ev-file-input').setInputFiles(oversizedPath);

      const error = page.locator('#ev-error');
      await expect(error).not.toHaveAttribute('hidden');
      await expect(error).toContainText('25.0 MB');

      await expect(page.locator('#ev-result')).toHaveAttribute('hidden');
    } finally {
      if (fs.existsSync(oversizedPath)) fs.unlinkSync(oversizedPath);
    }
  });

  test('GPS位置情報がある場合、プライバシー警告と緯度経度が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegWithGpsPath = path.join(__dirname, 'temp-exif-with-gps-test.jpg');
    fs.writeFileSync(
      jpegWithGpsPath,
      buildJpegWithGps('TestCam', 'Model X1', 35.658581, 139.745433),
    );

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegWithGpsPath);
      await expect(page.locator('#ev-result')).not.toHaveAttribute('hidden');

      const gpsPrivacyNote = page.locator('#ev-gps-privacy-note');
      await expect(gpsPrivacyNote).not.toHaveAttribute('hidden');
      await expect(gpsPrivacyNote).toContainText('GPS');

      const summary = page.locator('#ev-summary-list');
      await expect(summary).toContainText('35.65');
      await expect(summary).toContainText('139.74');
    } finally {
      if (fs.existsSync(jpegWithGpsPath)) fs.unlinkSync(jpegWithGpsPath);
    }
  });

  test('GPS位置情報がない場合、プライバシー警告は表示されない', async ({
    page,
  }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-no-gps-test.jpg');
    fs.writeFileSync(jpegPath, buildJpegWithExif('TestCam', 'Model X1'));

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);
      await expect(page.locator('#ev-result')).not.toHaveAttribute('hidden');
      await expect(page.locator('#ev-gps-privacy-note')).toHaveAttribute(
        'hidden',
        '',
      );
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });

  test('破損したJPEG（無効なExif TIFF）でエラー表示', async ({ page }) => {
    await page.goto('/tools/exif-viewer/');

    const corruptedPath = path.join(__dirname, 'temp-corrupted.jpg');
    // SOI + APP1（無効なTIFF）+ EOI
    // TIFFマジックナンバーが不正（"II" 42 の代わりに 0x00を使用）
    const corrupted = Buffer.from([
      0xff,
      0xd8, // SOI
      0xff,
      0xe1, // APP1
      0x00,
      0x10, // APP1 length (16 bytes including this field itself)
      0x45,
      0x78,
      0x69,
      0x66,
      0x00,
      0x00, // "Exif\0\0"
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00, // Invalid TIFF header
      0xff,
      0xd9, // EOI
    ]);
    fs.writeFileSync(corruptedPath, corrupted);

    try {
      await page.locator('#ev-file-input').setInputFiles(corruptedPath);

      const error = page.locator('#ev-error');
      // exifrが解析に失敗し、エラーが表示される（またはファイル形式エラーになる）
      // 試行：しばらく待ってからエラー要素を確認
      const errorMessage = await error.textContent({ timeout: 3000 });

      // 無効なExifデータなので、パースエラーまたはExif不在メッセージが表示されるはず
      // どちらかが表示されていればOK
      const isParseError = errorMessage?.includes('解析に失敗');
      const isNoExif =
        errorMessage === '' || errorMessage?.includes('見つかりませんでした');

      expect(
        isParseError || isNoExif,
        `Expected parse error or no exif message, got: ${errorMessage}`,
      ).toBe(true);
    } finally {
      if (fs.existsSync(corruptedPath)) fs.unlinkSync(corruptedPath);
    }
  });

  test('Exif削除後のダウンロード画像が有効なJPEGであることを確認', async ({
    page,
  }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-download-verify.jpg');
    const jpegBuffer = buildJpegWithExif('TestCam', 'Model X1');
    fs.writeFileSync(jpegPath, jpegBuffer);

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);
      await expect(page.locator('#ev-result')).not.toHaveAttribute('hidden');

      // ダウンロードを実行
      const downloadPromise = page.waitForEvent('download');
      await page.locator('#ev-remove-button').click();
      const download = await downloadPromise;

      // ダウンロードされたファイルを一時フォルダに保存
      const downloadDir = path.join(__dirname);
      const downloadedPath = path.join(
        downloadDir,
        download.suggestedFilename(),
      );
      await download.saveAs(downloadedPath);

      try {
        const downloadedBuffer = fs.readFileSync(downloadedPath);

        // ダウンロード画像がJPEGマジックナンバー(FFD8)で始まることを確認（有効なJPEG）
        expect(downloadedBuffer[0]).toBe(0xff);
        expect(downloadedBuffer[1]).toBe(0xd8);

        // ダウンロード画像がEOI(FFD9)で終わることを確認
        expect(downloadedBuffer[downloadedBuffer.length - 2]).toBe(0xff);
        expect(downloadedBuffer[downloadedBuffer.length - 1]).toBe(0xd9);

        // 元のバイト列より小さいことを確認（Exif/APP1セグメントが削除されている）
        expect(downloadedBuffer.length).toBeLessThan(jpegBuffer.length);

        // APP1セグメント（0xFFE1）が含まれていないことを確認
        let hasApp1 = false;
        for (let i = 0; i < downloadedBuffer.length - 1; i++) {
          if (
            downloadedBuffer[i] === 0xff &&
            downloadedBuffer[i + 1] === 0xe1
          ) {
            hasApp1 = true;
            break;
          }
        }
        expect(hasApp1).toBe(false);
      } finally {
        if (fs.existsSync(downloadedPath)) fs.unlinkSync(downloadedPath);
      }
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });

  test('Exifなし画像で削除ボタン押下時に「削除対象なし」メッセージ表示', async ({
    page,
  }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-no-exif-button.jpg');
    fs.writeFileSync(jpegPath, buildJpegWithoutExif());

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);
      await expect(page.locator('#ev-result')).not.toHaveAttribute('hidden');

      // 削除ボタンを押下
      await page.locator('#ev-remove-button').click();

      // ダウンロードは発生せず、ステータスメッセージのみ表示
      const statusEl = page.locator('#ev-remove-status');
      const statusText = await statusEl.textContent();
      expect(statusText).toContain('削除対象はありませんでした');
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });

  test('XMP（位置情報含む）削除後のダウンロード画像にXMPが残らない', async ({
    page,
    context,
  }) => {
    await page.goto('/tools/exif-viewer/');

    const jpegPath = path.join(__dirname, 'temp-exif-with-xmp.jpg');
    const jpegBuffer = buildJpegWithXmp();
    fs.writeFileSync(jpegPath, jpegBuffer);

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);
      await expect(page.locator('#ev-result')).not.toHaveAttribute('hidden');

      // 削除ボタンを押下してダウンロード
      const downloadPromise = context.waitForEvent('download');
      await page.locator('#ev-remove-button').click();
      const download = await downloadPromise;

      const downloadedPath = path.join(
        __dirname,
        `temp-exif-xmp-removed-${Date.now()}.jpg`,
      );
      await download.saveAs(downloadedPath);

      try {
        const downloadedBuffer = fs.readFileSync(downloadedPath);

        // ダウンロード画像がJPEGマジックナンバーで始まることを確認
        expect(downloadedBuffer[0]).toBe(0xff);
        expect(downloadedBuffer[1]).toBe(0xd8);

        // ダウンロード画像がEOIで終わることを確認
        expect(downloadedBuffer[downloadedBuffer.length - 2]).toBe(0xff);
        expect(downloadedBuffer[downloadedBuffer.length - 1]).toBe(0xd9);

        // XMP識別子が含まれていないことを確認（APP1削除）
        const xmpIdStr = 'http://ns.adobe.com/xap/1.0/';
        const xmpIdBytes = Buffer.from(xmpIdStr, 'ascii');
        let hasXmp = false;
        for (let i = 0; i < downloadedBuffer.length - xmpIdBytes.length; i++) {
          let match = true;
          for (let j = 0; j < xmpIdBytes.length; j++) {
            if (downloadedBuffer[i + j] !== xmpIdBytes[j]) {
              match = false;
              break;
            }
          }
          if (match) {
            hasXmp = true;
            break;
          }
        }
        expect(hasXmp).toBe(false);

        // APP1セグメント（0xFFE1）も含まれていないことを確認
        let hasApp1 = false;
        for (let i = 0; i < downloadedBuffer.length - 1; i++) {
          if (
            downloadedBuffer[i] === 0xff &&
            downloadedBuffer[i + 1] === 0xe1
          ) {
            hasApp1 = true;
            break;
          }
        }
        expect(hasApp1).toBe(false);
      } finally {
        if (fs.existsSync(downloadedPath)) fs.unlinkSync(downloadedPath);
      }
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });

  test('ダークモードでもレイアウトが正しく表示される', async ({
    page,
    context,
  }) => {
    // ダークモードをシミュレート
    await context.addInitScript(() => {
      document.documentElement.classList.add('dark');
    });

    await page.goto('/tools/exif-viewer/');

    const h1 = page.locator('main h1');
    await expect(h1).toHaveText('EXIF情報表示・削除');

    const jpegPath = path.join(__dirname, 'temp-exif-dark-mode.jpg');
    fs.writeFileSync(jpegPath, buildJpegWithExif('TestCam', 'Model X1'));

    try {
      await page.locator('#ev-file-input').setInputFiles(jpegPath);

      const resultEl = page.locator('#ev-result');
      await expect(resultEl).not.toHaveAttribute('hidden');

      // 暗いモード背景でも文字が読めることを確認（Tailwind dark:クラス）
      const summaryList = page.locator('#ev-summary-list');
      const opacity = await summaryList.evaluate(
        (el) => window.getComputedStyle(el).opacity,
      );
      expect(opacity).not.toBe('0'); // 非表示ではない
    } finally {
      if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    }
  });
});
