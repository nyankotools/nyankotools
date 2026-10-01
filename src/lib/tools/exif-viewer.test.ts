import { describe, expect, it } from 'vitest';
import {
  buildExifSummary,
  buildNoExifFileName,
  buildRawExifEntries,
  didFlashFire,
  formatDateTime,
  formatExposureTime,
  formatFileSize,
  formatFNumber,
  formatFocalLength,
  formatGpsCoordinates,
  getOrientationKey,
  getWhiteBalanceKey,
  hasAnyExifField,
  isJpegBytes,
  isJpegFile,
  removeExifFromJpeg,
  removeExifFromJpegBytes,
  trimTagString,
} from './exif-viewer';

describe('isJpegFile', () => {
  it('image/jpegのみtrue', () => {
    expect(isJpegFile({ type: 'image/jpeg' })).toBe(true);
    expect(isJpegFile({ type: 'image/png' })).toBe(false);
    expect(isJpegFile({ type: '' })).toBe(false);
  });
});

describe('formatFileSize', () => {
  it('1024未満はB表記', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('KB/MB/GB単位に変換する', () => {
    expect(formatFileSize(2048)).toBe('2.00 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
  });
});

describe('getOrientationKey', () => {
  it('1〜8をキーに変換する', () => {
    expect(getOrientationKey(1)).toBe('normal');
    expect(getOrientationKey(6)).toBe('rotate-90-cw');
    expect(getOrientationKey(8)).toBe('rotate-90-ccw');
  });

  it('範囲外・数値以外はundefined', () => {
    expect(getOrientationKey(0)).toBeUndefined();
    expect(getOrientationKey(9)).toBeUndefined();
    expect(getOrientationKey('1')).toBeUndefined();
    expect(getOrientationKey(undefined)).toBeUndefined();
  });
});

describe('getWhiteBalanceKey', () => {
  it('0=auto, 1=manual', () => {
    expect(getWhiteBalanceKey(0)).toBe('auto');
    expect(getWhiteBalanceKey(1)).toBe('manual');
  });

  it('それ以外はundefined', () => {
    expect(getWhiteBalanceKey(2)).toBeUndefined();
    expect(getWhiteBalanceKey(undefined)).toBeUndefined();
  });
});

describe('didFlashFire', () => {
  it('最下位ビットが1なら発光したと判定する', () => {
    expect(didFlashFire(0x01)).toBe(true);
    expect(didFlashFire(0x09)).toBe(true); // 0b1001
    expect(didFlashFire(0x00)).toBe(false);
    expect(didFlashFire(0x18)).toBe(false); // 0b11000
  });

  it('数値以外はundefined', () => {
    expect(didFlashFire(undefined)).toBeUndefined();
    expect(didFlashFire('1')).toBeUndefined();
  });
});

describe('formatExposureTime', () => {
  it('1秒未満は分数表記', () => {
    expect(formatExposureTime(1 / 125)).toBe('1/125');
    expect(formatExposureTime(0.5)).toBe('1/2');
  });

  it('1秒以上は整数または小数第1位までの表記', () => {
    expect(formatExposureTime(1)).toBe('1');
    expect(formatExposureTime(2)).toBe('2');
    expect(formatExposureTime(2.5)).toBe('2.5');
  });

  it('0以下や数値以外はundefined', () => {
    expect(formatExposureTime(0)).toBeUndefined();
    expect(formatExposureTime(-1)).toBeUndefined();
    expect(formatExposureTime(undefined)).toBeUndefined();
  });
});

describe('formatFNumber', () => {
  it('f/表記に変換する', () => {
    expect(formatFNumber(2.8)).toBe('f/2.8');
    expect(formatFNumber(4)).toBe('f/4');
  });

  it('0以下や数値以外はundefined', () => {
    expect(formatFNumber(0)).toBeUndefined();
    expect(formatFNumber(undefined)).toBeUndefined();
  });
});

describe('formatFocalLength', () => {
  it('mm表記に変換する', () => {
    expect(formatFocalLength(50)).toBe('50mm');
    expect(formatFocalLength(35.5)).toBe('35.5mm');
  });

  it('0以下や数値以外はundefined', () => {
    expect(formatFocalLength(0)).toBeUndefined();
    expect(formatFocalLength(null)).toBeUndefined();
  });
});

describe('formatDateTime', () => {
  it('YYYY-MM-DD HH:mm:ss形式に変換する（ローカル時刻のまま）', () => {
    const date = new Date(2024, 0, 5, 9, 3, 7);
    expect(formatDateTime(date)).toBe('2024-01-05 09:03:07');
  });

  it('Date以外・不正な日付はundefined', () => {
    expect(formatDateTime('2024-01-01')).toBeUndefined();
    expect(formatDateTime(new Date(NaN))).toBeUndefined();
  });
});

describe('formatGpsCoordinates', () => {
  it('緯度経度を小数点以下6桁の文字列に変換する', () => {
    expect(formatGpsCoordinates(35.6585805, 139.7454329)).toBe(
      '35.658580, 139.745433',
    );
  });

  it('数値以外・欠損時はundefined', () => {
    expect(formatGpsCoordinates(undefined, undefined)).toBeUndefined();
    expect(formatGpsCoordinates(35.0, undefined)).toBeUndefined();
  });
});

describe('trimTagString', () => {
  it('末尾のnull文字と前後の空白を除去する', () => {
    expect(trimTagString('Canon\u0000\u0000')).toBe('Canon');
    expect(trimTagString('  Nikon  ')).toBe('Nikon');
  });

  it('空文字になる場合や文字列以外はundefined', () => {
    expect(trimTagString('\u0000')).toBeUndefined();
    expect(trimTagString(123)).toBeUndefined();
    expect(trimTagString(undefined)).toBeUndefined();
  });
});

describe('buildExifSummary', () => {
  it('主要なタグをサマリーに整形する', () => {
    const summary = buildExifSummary({
      Make: 'Canon\u0000',
      Model: 'EOS R5',
      LensModel: 'RF24-105mm',
      Software: 'Adobe Lightroom',
      DateTimeOriginal: new Date(2024, 5, 1, 12, 0, 0),
      ExposureTime: 1 / 250,
      FNumber: 5.6,
      ISO: 400,
      FocalLength: 85,
      Flash: 1,
      WhiteBalance: 0,
      Orientation: 1,
      latitude: 35.0,
      longitude: 139.0,
    });

    expect(summary).toEqual({
      make: 'Canon',
      model: 'EOS R5',
      lensModel: 'RF24-105mm',
      software: 'Adobe Lightroom',
      dateTimeOriginal: '2024-06-01 12:00:00',
      exposureTime: '1/250',
      fNumber: 'f/5.6',
      iso: 400,
      focalLength: '85mm',
      flash: true,
      whiteBalance: 'auto',
      orientation: 'normal',
      gpsCoordinates: '35.000000, 139.000000',
    });
  });

  it('タグがない場合は空のサマリーを返す', () => {
    expect(buildExifSummary(undefined)).toEqual({});
    expect(buildExifSummary(null)).toEqual({});
    expect(buildExifSummary({})).toEqual({});
  });
});

describe('hasAnyExifField', () => {
  it('1つでも値があればtrue', () => {
    expect(hasAnyExifField({ make: 'Canon' })).toBe(true);
  });

  it('全てundefinedならfalse', () => {
    expect(hasAnyExifField({})).toBe(false);
  });
});

describe('buildRawExifEntries', () => {
  it('スカラー値・日付・配列をキー順にエントリー化する', () => {
    const entries = buildRawExifEntries({
      Model: 'EOS R5',
      ISO: 400,
      FNumber: 2.79999,
      CreatedAt: new Date(2024, 0, 1, 0, 0, 0),
      Keywords: ['a', 'b'],
      latitude: 35.0,
      longitude: 139.0,
    });

    expect(entries).toEqual([
      { key: 'CreatedAt', value: '2024-01-01 00:00:00' },
      { key: 'FNumber', value: '2.8' },
      { key: 'ISO', value: '400' },
      { key: 'Keywords', value: 'a, b' },
      { key: 'Model', value: 'EOS R5' },
    ]);
  });

  it('バイナリ値・空配列・ネストしたオブジェクトは除外する', () => {
    const entries = buildRawExifEntries({
      Thumbnail: new Uint8Array([1, 2, 3]),
      EmptyList: [],
      Nested: { a: 1 },
      Note: 'hello',
    });

    expect(entries).toEqual([{ key: 'Note', value: 'hello' }]);
  });

  it('タグがない場合は空配列', () => {
    expect(buildRawExifEntries(undefined)).toEqual([]);
  });
});

describe('isJpegBytes', () => {
  it('JPEGのマジックナンバー(FFD8FF)を判定する', () => {
    expect(isJpegBytes(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe(true);
    expect(isJpegBytes(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(false);
    expect(isJpegBytes(new Uint8Array([0xff, 0xd8]))).toBe(false);
  });
});

/** テスト用: SOI + APP1(Exif) + EOI という最小限のJPEG風バイト列を組み立てる */
function buildJpegWithExifApp1(exifPayload: number[]): Uint8Array {
  const content = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, ...exifPayload]; // "Exif\0\0" + payload
  const length = content.length + 2;
  return Uint8Array.from([
    0xff,
    0xd8, // SOI
    0xff,
    0xe1, // APP1
    (length >> 8) & 0xff,
    length & 0xff,
    ...content,
    0xff,
    0xd9, // EOI
  ]);
}

function buildJpegWithoutExif(): Uint8Array {
  return Uint8Array.from([
    0xff,
    0xd8, // SOI
    0xff,
    0xe0,
    0x00,
    0x04,
    0x00,
    0x00, // APP0 (JFIF等、Exif以外)
    0xff,
    0xd9, // EOI
  ]);
}

/** テスト用: SOI + 指定マーカーのセグメント + APP0 + EOI のJPEG風バイト列を組み立てる */
function buildJpegWithSegment(marker: number, identifier: string): Uint8Array {
  const content = [
    ...Array.from(identifier, (c) => c.charCodeAt(0)),
    0x00,
    0x09,
  ];
  const length = content.length + 2;
  return Uint8Array.from([
    0xff,
    0xd8, // SOI
    0xff,
    marker,
    (length >> 8) & 0xff,
    length & 0xff,
    ...content,
    0xff,
    0xe0,
    0x00,
    0x04,
    0x00,
    0x00, // APP0 は残す
    0xff,
    0xd9, // EOI
  ]);
}

describe('removeExifFromJpegBytes のXMP・IPTC対応', () => {
  const keptOnly = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xd9];

  it('APP1のXMP（位置情報を含みうる）も取り除く', () => {
    const jpeg = buildJpegWithSegment(0xe1, 'http://ns.adobe.com/xap/1.0/');
    expect(Array.from(removeExifFromJpegBytes(jpeg))).toEqual(keptOnly);
  });

  it('APP1の拡張XMPも取り除く', () => {
    const jpeg = buildJpegWithSegment(
      0xe1,
      'http://ns.adobe.com/xmp/extension/',
    );
    expect(Array.from(removeExifFromJpegBytes(jpeg))).toEqual(keptOnly);
  });

  it('APP13のIPTC（Photoshop 3.0）も取り除く', () => {
    const jpeg = buildJpegWithSegment(0xed, 'Photoshop 3.0');
    expect(Array.from(removeExifFromJpegBytes(jpeg))).toEqual(keptOnly);
  });

  it('識別子が異なるAPP1・APP13は残す', () => {
    const app1 = buildJpegWithSegment(0xe1, 'OtherApp');
    expect(removeExifFromJpegBytes(app1).length).toBe(app1.length);
    const app13 = buildJpegWithSegment(0xed, 'OtherApp');
    expect(removeExifFromJpegBytes(app13).length).toBe(app13.length);
  });
});

/** テスト用: SOS ヘッダー（コンポーネント1つ）+ 指定のスキャンデータ */
const sos = (...scan: number[]): number[] => [
  0xff,
  0xda,
  0x00,
  0x08,
  0x01,
  0x01,
  0x00,
  0x00,
  0x3f,
  0x00,
  ...scan,
];
const EOI = [0xff, 0xd9];
const APP0 = [0xff, 0xe0, 0x00, 0x04, 0x00, 0x00];
/** GPS を含みうる Exif 付きの別 JPEG（連結される副画像役） */
const secondaryWithExif = [
  0xff, 0xd8, 0xff, 0xe1, 0x00, 0x0a, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00, 0x47,
  0x50, 0x53, 0xff, 0xd9,
];

describe('removeExifFromJpegBytes の末尾連結データ（MPF・Motion Photo）', () => {
  it('主画像の EOI より後ろに連結された副画像を取り除く', () => {
    const main = [0xff, 0xd8, ...APP0, ...sos(0x12, 0x34), ...EOI];
    const result = removeExifFromJpegBytes(
      Uint8Array.from([...main, ...secondaryWithExif]),
    );
    expect(Array.from(result)).toEqual(main);
  });

  it('スキャンデータ内の FF00・RSTn を EOI と誤認しない', () => {
    const main = [
      0xff,
      0xd8,
      ...APP0,
      ...sos(0x12, 0xff, 0x00, 0x34, 0xff, 0xd0, 0x56, 0xff, 0xd7, 0x78),
      ...EOI,
    ];
    const result = removeExifFromJpegBytes(
      Uint8Array.from([...main, ...secondaryWithExif]),
    );
    expect(Array.from(result)).toEqual(main);
  });

  it('プログレッシブ（複数 SOS）でも最後の EOI まで保持し、途中のメタデータは除く', () => {
    const exif = [0xff, 0xe1, 0x00, 0x08, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00];
    const scan1 = sos(0x11, 0x22);
    const scan2 = sos(0x33, 0xff, 0x00);
    const result = removeExifFromJpegBytes(
      Uint8Array.from([
        0xff,
        0xd8,
        ...scan1,
        ...exif,
        ...scan2,
        ...EOI,
        ...secondaryWithExif,
      ]),
    );
    expect(Array.from(result)).toEqual([
      0xff,
      0xd8,
      ...scan1,
      ...scan2,
      ...EOI,
    ]);
  });

  it('APP2 の MPF セグメントを取り除く', () => {
    const mpf = [0xff, 0xe2, 0x00, 0x08, 0x4d, 0x50, 0x46, 0x00, 0x01, 0x02];
    const icc = [0xff, 0xe2, 0x00, 0x06, 0x49, 0x43, 0x43, 0x00];
    const result = removeExifFromJpegBytes(
      Uint8Array.from([0xff, 0xd8, ...mpf, ...icc, ...EOI]),
    );
    expect(Array.from(result)).toEqual([0xff, 0xd8, ...icc, ...EOI]);
  });

  it('EOI が無い壊れた入力は末尾までそのまま保持する', () => {
    const broken = Uint8Array.from([0xff, 0xd8, ...APP0, ...sos(0x12, 0x34)]);
    expect(Array.from(removeExifFromJpegBytes(broken))).toEqual(
      Array.from(broken),
    );
  });
});

describe('removeExifFromJpegBytes', () => {
  it('APP1のExifセグメントのみを取り除き、他のマーカーは保持する', () => {
    const jpeg = buildJpegWithExifApp1([0x01, 0x02, 0x03]);
    const result = removeExifFromJpegBytes(jpeg);

    // SOI, APP1(Exif)なしでEOIまで直結される
    expect(Array.from(result)).toEqual([0xff, 0xd8, 0xff, 0xd9]);
  });

  it('Exif以外のセグメントは変更しない', () => {
    const jpeg = buildJpegWithoutExif();
    const result = removeExifFromJpegBytes(jpeg);
    expect(Array.from(result)).toEqual(Array.from(jpeg));
  });

  it('JPEGでないバイト列はそのまま返す', () => {
    const notJpeg = Uint8Array.from([0x89, 0x50, 0x4e, 0x47]);
    expect(removeExifFromJpegBytes(notJpeg)).toBe(notJpeg);
  });

  it('セグメント長フィールドが不正（2未満）な場合はクラッシュせず末尾まで保持する', () => {
    const malformed = Uint8Array.from([
      0xff,
      0xd8, // SOI
      0xff,
      0xe1, // APP1
      0x00,
      0x00, // 不正な長さ（2未満）
      0x01,
      0x02,
      0xff,
      0xd9, // EOI
    ]);
    const result = removeExifFromJpegBytes(malformed);
    expect(Array.from(result)).toEqual(Array.from(malformed));
  });
});

describe('removeExifFromJpeg', () => {
  it('Exifがあれば削除してhadExif:trueを返す', () => {
    const jpeg = buildJpegWithExifApp1([0x01, 0x02, 0x03]);
    const result = removeExifFromJpeg(jpeg);
    expect(result.hadExif).toBe(true);
    expect(result.bytes.length).toBeLessThan(jpeg.length);
  });

  it('ExifがなければhadExif:falseを返す', () => {
    const jpeg = buildJpegWithoutExif();
    const result = removeExifFromJpeg(jpeg);
    expect(result.hadExif).toBe(false);
    expect(result.bytes.length).toBe(jpeg.length);
  });
});

describe('buildNoExifFileName', () => {
  it('拡張子の前に-no-exifを挿入する', () => {
    expect(buildNoExifFileName('photo.jpg')).toBe('photo-no-exif.jpg');
    expect(buildNoExifFileName('IMG_0001.JPEG')).toBe('IMG_0001-no-exif.JPEG');
  });

  it('拡張子がない場合は.jpgを付与する', () => {
    expect(buildNoExifFileName('noext')).toBe('noext-no-exif.jpg');
  });
});
