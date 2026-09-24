import { describe, expect, it } from 'vitest';
import {
  aggregatePixelsIntoBuckets,
  buildPalette,
  clampPaletteSize,
  computeSampleDimensions,
  formatFileSize,
  formatPaletteAsText,
  isAcceptedImageFile,
  rgbToHex,
} from './image-palette-extractor';

describe('computeSampleDimensions', () => {
  it('最大辺が上限以下ならそのまま返す', () => {
    expect(computeSampleDimensions({ width: 100, height: 80 })).toEqual({
      width: 100,
      height: 80,
    });
  });

  it('最大辺が上限を超える場合は縦横比を保って縮小する', () => {
    expect(computeSampleDimensions({ width: 1500, height: 300 })).toEqual({
      width: 150,
      height: 30,
    });
  });

  it('縦長の画像でも正しく計算できる', () => {
    expect(computeSampleDimensions({ width: 300, height: 1500 })).toEqual({
      width: 30,
      height: 150,
    });
  });

  it('極端に小さい画像でも最低1x1になる', () => {
    expect(computeSampleDimensions({ width: 1, height: 1 })).toEqual({
      width: 1,
      height: 1,
    });
  });
});

describe('clampPaletteSize', () => {
  it('範囲内の値はそのまま（四捨五入して）返す', () => {
    expect(clampPaletteSize(6)).toBe(6);
    expect(clampPaletteSize(6.6)).toBe(7);
  });

  it('下限未満は2に、上限超過は12にクランプする', () => {
    expect(clampPaletteSize(0)).toBe(2);
    expect(clampPaletteSize(-5)).toBe(2);
    expect(clampPaletteSize(100)).toBe(12);
  });

  it('数値でない値は既定値（6）を返す', () => {
    expect(clampPaletteSize(NaN)).toBe(6);
    expect(clampPaletteSize(Infinity)).toBe(6);
  });
});

describe('rgbToHex', () => {
  it('RGB値をHEXコードに変換する', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
  });

  it('小数値は四捨五入する', () => {
    expect(rgbToHex(127.6, 0, 0)).toBe('#800000');
  });

  it('範囲外の値はクランプする', () => {
    expect(rgbToHex(-10, 300, 0)).toBe('#00ff00');
  });
});

describe('aggregatePixelsIntoBuckets', () => {
  it('同じ色のピクセルは1つのバケットに集計される', () => {
    // 赤3px + 青1px（すべて不透明）
    const data = new Uint8ClampedArray([
      255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 0, 0, 255, 255,
    ]);
    const buckets = aggregatePixelsIntoBuckets(data);
    expect(buckets).toHaveLength(2);
    expect(buckets[0]).toEqual({ r: 255, g: 0, b: 0, count: 3 });
    expect(buckets[1]).toEqual({ r: 0, g: 0, b: 255, count: 1 });
  });

  it('出現数の多い順（降順）に並ぶ', () => {
    const data = new Uint8ClampedArray([
      0, 255, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
    ]);
    const buckets = aggregatePixelsIntoBuckets(data);
    expect(buckets[0]).toMatchObject({ r: 255, g: 0, b: 0, count: 2 });
    expect(buckets[1]).toMatchObject({ r: 0, g: 255, b: 0, count: 1 });
  });

  it('アルファ値が閾値未満のピクセルは除外する', () => {
    const data = new Uint8ClampedArray([
      255, 0, 0, 255, 0, 0, 255, 0 /* ほぼ透明 */,
    ]);
    const buckets = aggregatePixelsIntoBuckets(data);
    expect(buckets).toHaveLength(1);
    expect(buckets[0]).toMatchObject({ r: 255, g: 0, b: 0, count: 1 });
  });

  it('近い色は同じバケットにまとめられ、平均色になる', () => {
    const data = new Uint8ClampedArray([
      200, 0, 0, 255, 210, 0, 0, 255, 220, 0, 0, 255,
    ]);
    const buckets = aggregatePixelsIntoBuckets(data);
    expect(buckets).toHaveLength(1);
    expect(buckets[0]).toEqual({ r: 210, g: 0, b: 0, count: 3 });
  });

  it('全ピクセルが透明な場合は空配列を返す', () => {
    const data = new Uint8ClampedArray([255, 0, 0, 0, 0, 255, 0, 0]);
    expect(aggregatePixelsIntoBuckets(data)).toEqual([]);
  });

  it('空の配列を渡すと空配列を返す', () => {
    expect(aggregatePixelsIntoBuckets(new Uint8ClampedArray([]))).toEqual([]);
  });
});

describe('buildPalette', () => {
  it('出現数の多い順に上位paletteSize件を占有率付きで返す', () => {
    const buckets = [
      { r: 255, g: 0, b: 0, count: 6 },
      { r: 0, g: 255, b: 0, count: 3 },
      { r: 0, g: 0, b: 255, count: 1 },
    ];
    const palette = buildPalette(buckets, 2);
    expect(palette).toEqual([
      { hex: '#ff0000', r: 255, g: 0, b: 0, percent: 60 },
      { hex: '#00ff00', r: 0, g: 255, b: 0, percent: 30 },
    ]);
  });

  it('paletteSizeがバケット数より多い場合は全件返す', () => {
    const buckets = [{ r: 255, g: 0, b: 0, count: 1 }];
    expect(buildPalette(buckets, 6)).toHaveLength(1);
  });

  it('バケットが空の場合は空配列を返す', () => {
    expect(buildPalette([], 6)).toEqual([]);
  });

  it('割合は小数点1桁に丸められる', () => {
    const buckets = [
      { r: 255, g: 0, b: 0, count: 1 },
      { r: 0, g: 255, b: 0, count: 2 },
    ];
    const palette = buildPalette(buckets, 2);
    expect(palette[0].percent).toBeCloseTo(33.3, 1);
    expect(palette[1].percent).toBeCloseTo(66.7, 1);
  });
});

describe('formatPaletteAsText', () => {
  it('HEXコードを改行区切りでまとめる', () => {
    const palette = [
      { hex: '#ff0000', r: 255, g: 0, b: 0, percent: 60 },
      { hex: '#00ff00', r: 0, g: 255, b: 0, percent: 40 },
    ];
    expect(formatPaletteAsText(palette)).toBe('#ff0000\n#00ff00');
  });

  it('空のパレットは空文字列になる', () => {
    expect(formatPaletteAsText([])).toBe('');
  });
});

describe('isAcceptedImageFile', () => {
  it('PNG/JPEG/WebP/GIF/BMPを受け付ける', () => {
    expect(isAcceptedImageFile({ type: 'image/png' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/jpeg' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/webp' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/gif' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/bmp' })).toBe(true);
  });

  it('SVGやテキストファイルは受け付けない', () => {
    expect(isAcceptedImageFile({ type: 'image/svg+xml' })).toBe(false);
    expect(isAcceptedImageFile({ type: 'text/plain' })).toBe(false);
  });
});

describe('formatFileSize', () => {
  it('1024未満はB表記', () => {
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('KB/MB単位に変換する', () => {
    expect(formatFileSize(2048)).toBe('2.00 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
  });
});
