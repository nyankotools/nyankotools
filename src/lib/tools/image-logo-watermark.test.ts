import { describe, it, expect } from 'vitest';
import {
  anchorPosition,
  logoSize,
  MAX_SCALE,
  tileCenters,
  watermarkFileName,
} from './image-logo-watermark';

describe('logoSize', () => {
  it('幅をベース幅の割合にし、縦横比を保つ', () => {
    expect(
      logoSize({ width: 1000, height: 500 }, { width: 200, height: 100 }, 20),
    ).toEqual({ width: 200, height: 100 });
    expect(
      logoSize({ width: 1000, height: 500 }, { width: 100, height: 300 }, 10),
    ).toEqual({ width: 100, height: 300 });
  });
  it('範囲外の割合は丸め、非数は20%', () => {
    const base = { width: 100, height: 100 };
    const logo = { width: 10, height: 10 };
    expect(logoSize(base, logo, 0).width).toBe(1);
    expect(logoSize(base, logo, 99999).width).toBe(MAX_SCALE);
    expect(logoSize(base, logo, NaN).width).toBe(20);
  });
  it('最低1pxで、不正なロゴ寸法は1x1', () => {
    expect(
      logoSize({ width: 10, height: 10 }, { width: 1000, height: 1 }, 1),
    ).toEqual({ width: 1, height: 1 });
    expect(
      logoSize({ width: 10, height: 10 }, { width: 0, height: 5 }, 50),
    ).toEqual({ width: 1, height: 1 });
  });
});

describe('再エクスポートした配置関数', () => {
  it('9分割の右下は余白ぶん内側', () => {
    expect(
      anchorPosition(
        'bottom-right',
        { width: 400, height: 200 },
        { width: 100, height: 40 },
        10,
      ),
    ).toEqual({ x: 290, y: 150 });
  });
  it('敷き詰めは画像を覆う', () => {
    const { points } = tileCenters(
      { width: 400, height: 200 },
      { width: 50, height: 50 },
      10,
    );
    expect(points.length).toBeGreaterThan(10);
  });
});

describe('watermarkFileName', () => {
  it('拡張子を置き換えて -logo を付ける', () => {
    expect(watermarkFileName('photo.JPG', 'png')).toBe('photo-logo.png');
    expect(watermarkFileName('a.b.png', 'jpeg')).toBe('a.b-logo.jpg');
    expect(watermarkFileName(null, 'webp')).toBe('image-logo.webp');
  });
});
