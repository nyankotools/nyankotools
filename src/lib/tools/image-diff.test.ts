import { describe, expect, it } from 'vitest';
import {
  buildOutputFileName,
  clampThreshold,
  diffImages,
  formatFileSize,
  formatPercent,
  isAcceptedImageFile,
  pixelDelta,
  resolveTargetSize,
  thresholdToDelta,
  type RgbaImage,
} from './image-diff';

function solid(
  width: number,
  height: number,
  rgba: [number, number, number, number],
): RgbaImage {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) data.set(rgba, i * 4);
  return { data, width, height };
}

function setPixel(
  img: RgbaImage,
  x: number,
  y: number,
  rgba: [number, number, number, number],
) {
  img.data.set(rgba, (y * img.width + x) * 4);
}

describe('diffImages', () => {
  it('同一画像は差異0', () => {
    const r = diffImages(
      solid(4, 4, [10, 20, 30, 255]),
      solid(4, 4, [10, 20, 30, 255]),
      0,
    );
    expect(r.diffPixels).toBe(0);
    expect(r.diffPercent).toBe(0);
    expect(r.maxDelta).toBe(0);
    expect(r.bounds).toBeNull();
  });

  it('1画素の違いを検出し差異率と範囲を返す', () => {
    const a = solid(4, 4, [0, 0, 0, 255]);
    const b = solid(4, 4, [0, 0, 0, 255]);
    setPixel(b, 2, 1, [255, 0, 0, 255]);
    const r = diffImages(a, b, 0);
    expect(r.diffPixels).toBe(1);
    expect(r.diffPercent).toBeCloseTo(6.25);
    expect(r.maxDelta).toBe(255);
    expect(r.bounds).toEqual({ x: 2, y: 1, width: 1, height: 1 });
  });

  it('範囲は差異画素を囲む最小矩形', () => {
    const a = solid(5, 5, [0, 0, 0, 255]);
    const b = solid(5, 5, [0, 0, 0, 255]);
    setPixel(b, 1, 1, [200, 0, 0, 255]);
    setPixel(b, 3, 4, [0, 200, 0, 255]);
    expect(diffImages(a, b, 0).bounds).toEqual({
      x: 1,
      y: 1,
      width: 3,
      height: 4,
    });
  });

  it('しきい値以下の差は数えない（境界は含まない）', () => {
    const a = solid(2, 1, [100, 100, 100, 255]);
    const b = solid(2, 1, [110, 100, 100, 255]);
    expect(diffImages(a, b, 0).diffPixels).toBe(2);
    // 10/255 = 3.92%
    expect(diffImages(a, b, 3.9).diffPixels).toBe(2);
    expect(diffImages(a, b, 4).diffPixels).toBe(0);
  });

  it('アルファの違いも差異になる', () => {
    const r = diffImages(
      solid(1, 1, [0, 0, 0, 255]),
      solid(1, 1, [0, 0, 0, 128]),
      0,
    );
    expect(r.diffPixels).toBe(1);
    expect(r.maxDelta).toBe(127);
  });

  it('両方とも完全透明なら色が違っても同じ', () => {
    const r = diffImages(
      solid(1, 1, [255, 0, 0, 0]),
      solid(1, 1, [0, 0, 255, 0]),
      0,
    );
    expect(r.diffPixels).toBe(0);
  });

  it('平均差分値を計算する', () => {
    const a = solid(2, 1, [0, 0, 0, 255]);
    const b = solid(2, 1, [0, 0, 0, 255]);
    setPixel(b, 0, 0, [100, 0, 0, 255]);
    expect(diffImages(a, b, 0).meanDelta).toBe(50);
  });

  it('ヒートマップ: 差異なしは黒、差異ありは赤〜黄', () => {
    const a = solid(2, 1, [0, 0, 0, 255]);
    const b = solid(2, 1, [0, 0, 0, 255]);
    setPixel(b, 1, 0, [255, 255, 255, 255]);
    const { map } = diffImages(a, b, 0, 'heatmap');
    expect(Array.from(map.slice(0, 4))).toEqual([0, 0, 0, 255]);
    expect(map[4]).toBe(255);
    expect(map[5]).toBeGreaterThan(200);
    expect(map[6]).toBe(0);
    expect(map[7]).toBe(255);
  });

  it('ハイライト: 差異は赤、他はグレー', () => {
    const a = solid(2, 1, [255, 255, 255, 255]);
    const b = solid(2, 1, [255, 255, 255, 255]);
    setPixel(b, 0, 0, [0, 0, 0, 255]);
    const { map } = diffImages(a, b, 0, 'highlight');
    expect(Array.from(map.slice(0, 4))).toEqual([255, 0, 64, 255]);
    expect(map[4]).toBe(map[5]);
    expect(map[4]).toBe(255);
  });

  it('サイズ不一致・データ不足は例外', () => {
    expect(() =>
      diffImages(solid(2, 2, [0, 0, 0, 255]), solid(2, 3, [0, 0, 0, 255]), 0),
    ).toThrow();
    expect(() =>
      diffImages(
        { data: new Uint8ClampedArray(4), width: 2, height: 2 },
        solid(2, 2, [0, 0, 0, 255]),
        0,
      ),
    ).toThrow();
  });

  it('しきい値100%では最大差(255)でも差異にならない', () => {
    const a = solid(2, 1, [0, 0, 0, 255]);
    const b = solid(2, 1, [255, 255, 255, 255]);
    expect(diffImages(a, b, 100).diffPixels).toBe(0);
    expect(diffImages(a, b, 99.9).diffPixels).toBe(2);
  });

  it('大きな画像の右下1画素の差分も範囲に正しく反映される', () => {
    const a = solid(1000, 1000, [0, 0, 0, 255]);
    const b = solid(1000, 1000, [0, 0, 0, 255]);
    setPixel(b, 999, 999, [255, 255, 255, 255]);
    const r = diffImages(a, b, 0);
    expect(r.diffPixels).toBe(1);
    expect(r.totalPixels).toBe(1_000_000);
    expect(r.bounds).toEqual({ x: 999, y: 999, width: 1, height: 1 });
  });

  it('差異が1行目・1列目のみでも範囲の原点が正しい', () => {
    const a = solid(3, 3, [0, 0, 0, 255]);
    const b = solid(3, 3, [0, 0, 0, 255]);
    setPixel(b, 0, 2, [9, 0, 0, 255]);
    expect(diffImages(a, b, 0).bounds).toEqual({
      x: 0,
      y: 2,
      width: 1,
      height: 1,
    });
  });

  it('ハイライト: 差異なしで不透明な画素はグレー（元画像の明るさ）', () => {
    const white = solid(1, 1, [255, 255, 255, 255]);
    const { map } = diffImages(
      white,
      solid(1, 1, [255, 255, 255, 255]),
      0,
      'highlight',
    );
    // 白 → 255*0.4+153 = 255
    expect(Array.from(map)).toEqual([255, 255, 255, 255]);
  });

  it('0画素でも落ちない', () => {
    const empty: RgbaImage = {
      data: new Uint8ClampedArray(0),
      width: 0,
      height: 0,
    };
    const r = diffImages(empty, empty, 0);
    expect(r.diffPercent).toBe(0);
    expect(r.bounds).toBeNull();
  });
});

describe('pixelDelta', () => {
  it('RGBAの最大絶対差', () => {
    const a = new Uint8ClampedArray([10, 20, 30, 255]);
    const b = new Uint8ClampedArray([15, 50, 30, 250]);
    expect(pixelDelta(a, b, 0)).toBe(30);
  });
});

describe('thresholds', () => {
  it('clampThreshold', () => {
    expect(clampThreshold(-5)).toBe(0);
    expect(clampThreshold(150)).toBe(100);
    expect(clampThreshold(NaN)).toBe(0);
    expect(clampThreshold(12.5)).toBe(12.5);
  });
  it('thresholdToDelta', () => {
    expect(thresholdToDelta(0)).toBe(0);
    expect(thresholdToDelta(100)).toBe(255);
    expect(thresholdToDelta(50)).toBeCloseTo(127.5);
  });
});

describe('resolveTargetSize', () => {
  it('pad は幅・高さそれぞれ大きい方', () => {
    expect(
      resolveTargetSize(
        { width: 100, height: 50 },
        { width: 80, height: 120 },
        'pad',
      ),
    ).toEqual({ width: 100, height: 120, scale: 1 });
  });
  it('resize は面積の大きい方に合わせる', () => {
    expect(
      resolveTargetSize(
        { width: 100, height: 50 },
        { width: 80, height: 120 },
        'resize',
      ),
    ).toEqual({ width: 80, height: 120, scale: 1 });
    expect(
      resolveTargetSize(
        { width: 200, height: 100 },
        { width: 80, height: 120 },
        'resize',
      ),
    ).toEqual({ width: 200, height: 100, scale: 1 });
  });
  it('同面積なら1枚目に合わせる', () => {
    expect(
      resolveTargetSize(
        { width: 10, height: 20 },
        { width: 20, height: 10 },
        'resize',
      ),
    ).toEqual({ width: 10, height: 20, scale: 1 });
  });
  it('pad で長辺が上限を超えるときは長辺を4096に収める', () => {
    const t = resolveTargetSize(
      { width: 5000, height: 100 },
      { width: 10, height: 10 },
      'pad',
    );
    expect(t.width).toBeLessThanOrEqual(4096);
    expect(t.scale).toBeLessThan(1);
  });
  it('長辺・面積が上限を超えたら縮小する', () => {
    const t = resolveTargetSize(
      { width: 8000, height: 4000 },
      { width: 100, height: 100 },
      'resize',
    );
    expect(t.scale).toBeLessThan(1);
    expect(Math.max(t.width, t.height)).toBeLessThanOrEqual(4096);
    expect(t.width * t.height).toBeLessThanOrEqual(16_000_000);
    const u = resolveTargetSize(
      { width: 4096, height: 4096 },
      { width: 1, height: 1 },
      'pad',
    );
    expect(u.width * u.height).toBeLessThanOrEqual(16_000_000);
  });
});

describe('helpers', () => {
  it('isAcceptedImageFile', () => {
    expect(isAcceptedImageFile({ type: 'image/png' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/svg+xml' })).toBe(false);
    expect(isAcceptedImageFile({ type: '' })).toBe(false);
  });
  it('formatFileSize: B/KB/MBの境界', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1023)).toBe('1023 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.0 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatFileSize(25 * 1024 * 1024)).toBe('25.0 MB');
  });
  it('formatPercent', () => {
    expect(formatPercent(0)).toBe('0');
    expect(formatPercent(NaN)).toBe('0');
    expect(formatPercent(12.345)).toBe('12.3');
    expect(formatPercent(1.2345)).toBe('1.23');
    expect(formatPercent(0.001234)).toBe('0.0012');
  });
  it('buildOutputFileName', () => {
    expect(buildOutputFileName('photo.v2.png')).toBe('photo.v2-diff.png');
    expect(buildOutputFileName('')).toBe('image-diff.png');
    expect(buildOutputFileName('.png')).toBe('image-diff.png');
  });
});
