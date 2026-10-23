import { describe, expect, it } from 'vitest';
import {
  buildOutputName,
  crc32,
  detectFormat,
  isValidDpi,
  mimeTypeOf,
  paperFits,
  printSizeMm,
  readImageDpi,
  setImageDpi,
} from './image-dpi-changer';

function u32be(value: number): number[] {
  return [
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ];
}

function pngChunk(type: string, data: number[]): number[] {
  const typeBytes = [...type].map((c) => c.charCodeAt(0));
  const crc = crc32(new Uint8Array([...typeBytes, ...data]));
  return [...u32be(data.length), ...typeBytes, ...data, ...u32be(crc)];
}

function buildPng(
  width: number,
  height: number,
  phys?: { ppm: number; unit: number },
): Uint8Array {
  const ihdr = pngChunk('IHDR', [
    ...u32be(width),
    ...u32be(height),
    8,
    2,
    0,
    0,
    0,
  ]);
  const physChunk = phys
    ? pngChunk('pHYs', [...u32be(phys.ppm), ...u32be(phys.ppm), phys.unit])
    : [];
  const idat = pngChunk('IDAT', [1, 2, 3, 4]);
  const iend = pngChunk('IEND', []);
  return new Uint8Array([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
    ...ihdr,
    ...physChunk,
    ...idat,
    ...iend,
  ]);
}

function buildJpeg(
  width: number,
  height: number,
  opts: { jfif?: { units: number; x: number; y: number }; exif?: boolean } = {},
): Uint8Array {
  const bytes: number[] = [0xff, 0xd8];
  if (opts.jfif) {
    const { units, x, y } = opts.jfif;
    bytes.push(
      0xff,
      0xe0,
      0x00,
      0x10,
      0x4a,
      0x46,
      0x49,
      0x46,
      0x00,
      0x01,
      0x01,
      units,
      x >> 8,
      x & 0xff,
      y >> 8,
      y & 0xff,
      0,
      0,
    );
  }
  if (opts.exif) {
    bytes.push(0xff, 0xe1, 0x00, 0x08, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00);
  }
  // SOF0
  bytes.push(
    0xff,
    0xc0,
    0x00,
    0x0b,
    8,
    height >> 8,
    height & 0xff,
    width >> 8,
    width & 0xff,
    1,
    0x01,
    0x11,
    0x00,
  );
  // SOS + data + EOI
  bytes.push(0xff, 0xda, 0x00, 0x04, 0x01, 0x00, 0x12, 0x34, 0xff, 0xd9);
  return new Uint8Array(bytes);
}

describe('crc32', () => {
  it('標準的なテストベクタと一致する', () => {
    const data = new TextEncoder().encode('123456789');
    expect(crc32(data)).toBe(0xcbf43926);
  });
});

describe('detectFormat', () => {
  it('PNG/JPEGを判定し、それ以外はnull', () => {
    expect(detectFormat(buildPng(1, 1))).toBe('png');
    expect(detectFormat(buildJpeg(1, 1))).toBe('jpeg');
    expect(detectFormat(new TextEncoder().encode('GIF89a'))).toBeNull();
    expect(detectFormat(new Uint8Array())).toBeNull();
  });
});

describe('PNG', () => {
  it('pHYsが無ければDPIはnull、寸法は読める', () => {
    const r = readImageDpi(buildPng(2480, 3508));
    expect(r).toMatchObject({
      ok: true,
      format: 'png',
      widthPx: 2480,
      heightPx: 3508,
      dpiX: null,
      dpiY: null,
    });
  });

  it('pHYs(メートル単位)をDPIに換算して読む', () => {
    const r = readImageDpi(buildPng(10, 10, { ppm: 11811, unit: 1 }));
    expect(r).toMatchObject({ ok: true, dpiX: 300, dpiY: 300 });
  });

  it('単位不明のpHYsはDPIをnullにする', () => {
    const r = readImageDpi(buildPng(10, 10, { ppm: 100, unit: 0 }));
    expect(r).toMatchObject({ ok: true, dpiX: null });
  });

  it('pHYsが無い場合は挿入し、読み戻すと指定DPIになる', () => {
    const src = buildPng(10, 20);
    const w = setImageDpi(src, 300);
    if (!w.ok) throw new Error('failed');
    expect(w.data.length).toBe(src.length + 21);
    expect(readImageDpi(w.data)).toMatchObject({
      ok: true,
      widthPx: 10,
      heightPx: 20,
      dpiX: 300,
      dpiY: 300,
    });
    // IHDRの直後（33バイト目）に挿入される
    expect(String.fromCharCode(...w.data.subarray(37, 41))).toBe('pHYs');
  });

  it('挿入したpHYsのCRCが正しい', () => {
    const w = setImageDpi(buildPng(10, 20), 72);
    if (!w.ok) throw new Error('failed');
    const chunk = w.data.subarray(33, 33 + 21);
    const stored =
      ((chunk[17] << 24) | (chunk[18] << 16) | (chunk[19] << 8) | chunk[20]) >>>
      0;
    expect(stored).toBe(crc32(chunk.subarray(4, 17)));
  });

  it('既存のpHYsは置換され、チャンクは増えない', () => {
    const src = buildPng(10, 20, { ppm: 2835, unit: 1 });
    const w = setImageDpi(src, 350);
    if (!w.ok) throw new Error('failed');
    expect(w.data.length).toBe(src.length);
    expect(readImageDpi(w.data)).toMatchObject({ dpiX: 350, dpiY: 350 });
  });

  it('単位不明のpHYsも置換して単位をメートルにする', () => {
    const w = setImageDpi(buildPng(4, 4, { ppm: 1, unit: 0 }), 96);
    if (!w.ok) throw new Error('failed');
    expect(readImageDpi(w.data)).toMatchObject({ dpiX: 96 });
  });

  it('IDATなどのほかのチャンクは変更されない', () => {
    const src = buildPng(10, 20);
    const w = setImageDpi(src, 300);
    if (!w.ok) throw new Error('failed');
    expect([...w.data.subarray(33 + 21)]).toEqual([...src.subarray(33)]);
  });

  it('途切れたPNGはcorrupt', () => {
    const src = buildPng(10, 20);
    expect(readImageDpi(src.subarray(0, 20))).toEqual({
      ok: false,
      error: 'corrupt',
    });
    expect(setImageDpi(src.subarray(0, 20), 300)).toEqual({
      ok: false,
      error: 'corrupt',
    });
  });
});

describe('JPEG', () => {
  it('JFIFのdpi単位を読む', () => {
    const r = readImageDpi(
      buildJpeg(640, 480, { jfif: { units: 1, x: 72, y: 96 } }),
    );
    expect(r).toMatchObject({
      ok: true,
      format: 'jpeg',
      widthPx: 640,
      heightPx: 480,
      dpiX: 72,
      dpiY: 96,
    });
  });

  it('dpcm単位はdpiに換算し、アスペクト比のみ(0)はnull', () => {
    expect(
      readImageDpi(buildJpeg(8, 8, { jfif: { units: 2, x: 100, y: 100 } })),
    ).toMatchObject({ dpiX: 254, dpiY: 254 });
    expect(
      readImageDpi(buildJpeg(8, 8, { jfif: { units: 0, x: 1, y: 1 } })),
    ).toMatchObject({ dpiX: null });
  });

  it('JFIFが無ければDPIはnull', () => {
    expect(readImageDpi(buildJpeg(8, 8, { exif: true }))).toMatchObject({
      ok: true,
      dpiX: null,
    });
  });

  it('既存JFIFを書き換え、長さは変わらない', () => {
    const src = buildJpeg(640, 480, { jfif: { units: 0, x: 1, y: 1 } });
    const w = setImageDpi(src, 300);
    if (!w.ok) throw new Error('failed');
    expect(w.data.length).toBe(src.length);
    expect(readImageDpi(w.data)).toMatchObject({
      dpiX: 300,
      dpiY: 300,
      widthPx: 640,
    });
    // 元のバイト列は破壊されない
    expect(readImageDpi(src)).toMatchObject({ dpiX: null });
  });

  it('JFIFが無い場合はSOI直後にAPP0を挿入する', () => {
    const src = buildJpeg(320, 200, { exif: true });
    const w = setImageDpi(src, 350);
    if (!w.ok) throw new Error('failed');
    expect(w.data.length).toBe(src.length + 18);
    expect([...w.data.subarray(0, 4)]).toEqual([0xff, 0xd8, 0xff, 0xe0]);
    expect(readImageDpi(w.data)).toMatchObject({
      dpiX: 350,
      dpiY: 350,
      widthPx: 320,
      heightPx: 200,
    });
  });

  it('65535dpiまで書ける', () => {
    const w = setImageDpi(buildJpeg(8, 8), 65535);
    if (!w.ok) throw new Error('failed');
    expect(readImageDpi(w.data)).toMatchObject({ dpiX: 65535 });
  });

  it('SOFが無いJPEGはcorrupt', () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    expect(readImageDpi(bytes)).toEqual({ ok: false, error: 'corrupt' });
  });
});

describe('エラー', () => {
  it('非対応形式はunsupported-format', () => {
    const gif = new TextEncoder().encode('GIF89a......');
    expect(readImageDpi(gif)).toEqual({
      ok: false,
      error: 'unsupported-format',
    });
    expect(setImageDpi(gif, 300)).toEqual({
      ok: false,
      error: 'unsupported-format',
    });
  });

  it('不正なDPIはinvalid-dpi', () => {
    const png = buildPng(1, 1);
    for (const dpi of [0, -1, 1.5, 65536, NaN]) {
      expect(setImageDpi(png, dpi)).toEqual({
        ok: false,
        error: 'invalid-dpi',
      });
    }
  });

  it('isValidDpi', () => {
    expect(isValidDpi(300)).toBe(true);
    expect(isValidDpi(1)).toBe(true);
    expect(isValidDpi(65535)).toBe(true);
    expect(isValidDpi(0)).toBe(false);
    expect(isValidDpi(72.5)).toBe(false);
  });
});

describe('印刷サイズ', () => {
  it('2480x3508pxを300dpiで印刷するとほぼA4', () => {
    expect(printSizeMm(2480, 3508, 300)).toEqual({
      widthMm: 210,
      heightMm: 297,
    });
  });

  it('72dpiだと大きくなる', () => {
    expect(printSizeMm(720, 360, 72)).toEqual({ widthMm: 254, heightMm: 127 });
  });

  it('paperFitsは向きに依存せず収まりを判定する', () => {
    const fits = paperFits(3508, 2480, 300);
    const a4 = fits.find((f) => f.name === 'A4')!;
    expect(a4.fitDpi).toBeCloseTo(300, 0);
    expect(a4.fitsAtDpi).toBe(true);
    const a5 = fits.find((f) => f.name === 'A5')!;
    expect(a5.fitsAtDpi).toBe(false);
    expect(a5.fitDpi).toBeGreaterThan(400);
    const a3 = fits.find((f) => f.name === 'A3')!;
    expect(a3.fitsAtDpi).toBe(true);
  });
});

describe('buildOutputName', () => {
  it('拡張子の前にdpiを付ける', () => {
    expect(buildOutputName('photo.png', 300, 'png')).toBe('photo-300dpi.png');
    expect(buildOutputName('a.b.JPG', 72, 'jpeg')).toBe('a.b-72dpi.JPG');
    expect(buildOutputName('noext', 96, 'jpeg')).toBe('noext-96dpi.jpg');
  });
  it('名前が空なら image を基本名にする', () => {
    expect(buildOutputName('', 300, 'png')).toBe('image-300dpi.png');
    expect(buildOutputName('', 300, 'jpeg')).toBe('image-300dpi.jpg');
  });
  it('先頭ドットのみの名前・日本語名も扱える', () => {
    expect(buildOutputName('.png', 300, 'png')).toBe('.png-300dpi.png');
    expect(buildOutputName('写真.jpg', 150, 'jpeg')).toBe('写真-150dpi.jpg');
  });
  it('mimeTypeOf', () => {
    expect(mimeTypeOf('png')).toBe('image/png');
    expect(mimeTypeOf('jpeg')).toBe('image/jpeg');
  });
});

describe('破損・境界ケース', () => {
  it('空のバイト列は unsupported-format', () => {
    expect(readImageDpi(new Uint8Array())).toEqual({
      ok: false,
      error: 'unsupported-format',
    });
  });
  it('途中で切れたJPEG（セグメント長が超過）はcorrupt', () => {
    const truncated = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
    ]);
    expect(readImageDpi(truncated)).toEqual({ ok: false, error: 'corrupt' });
    expect(setImageDpi(truncated, 300)).toEqual({
      ok: false,
      error: 'corrupt',
    });
  });
  it('幅0・高さ0のJPEG/PNGはcorrupt', () => {
    expect(readImageDpi(buildJpeg(0, 8))).toEqual({
      ok: false,
      error: 'corrupt',
    });
    expect(readImageDpi(buildPng(10, 0))).toEqual({
      ok: false,
      error: 'corrupt',
    });
  });
  it('先頭チャンクがIHDRでないPNGはcorrupt', () => {
    const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    const bytes = new Uint8Array([
      ...sig,
      ...pngChunk('tEXt', [0x41]),
      ...pngChunk('IEND', []),
    ]);
    expect(readImageDpi(bytes)).toEqual({ ok: false, error: 'corrupt' });
  });
  it('1dpi（最小値）はpHYsに換算して読み戻せる', () => {
    const w = setImageDpi(buildPng(10, 10), 1);
    if (!w.ok) throw new Error('failed');
    expect(readImageDpi(w.data)).toMatchObject({ dpiX: 1, dpiY: 1 });
  });
  it('SOF後にJFIFを持つJPEGで幅・高さを読める（非正方形）', () => {
    expect(
      readImageDpi(
        buildJpeg(4000, 3000, { jfif: { units: 1, x: 300, y: 300 } }),
      ),
    ).toMatchObject({ widthPx: 4000, heightPx: 3000, dpiX: 300 });
  });
});
