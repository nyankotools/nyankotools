import { describe, expect, it } from 'vitest';
import {
  buildFilename,
  computeDrawRect,
  computeOutputSize,
  hasBackgroundGap,
  ID_PHOTO_PRESETS,
  parseSizeMm,
} from './id-photo-maker';

describe('computeOutputSize', () => {
  it('35×45mm・300dpi は 413×531', () => {
    expect(computeOutputSize(35, 45, 300)).toEqual({ width: 413, height: 531 });
  });

  it('30×40mm・300dpi は 354×472', () => {
    expect(computeOutputSize(30, 40, 300)).toEqual({ width: 354, height: 472 });
  });

  it('極小でも1px以上', () => {
    expect(computeOutputSize(0.01, 0.01, 1)).toEqual({ width: 1, height: 1 });
  });
});

describe('parseSizeMm', () => {
  it('範囲内の数値を返す', () => {
    expect(parseSizeMm('35')).toBe(35);
    expect(parseSizeMm(42.5)).toBe(42.5);
    expect(parseSizeMm('10')).toBe(10);
    expect(parseSizeMm('100')).toBe(100);
  });

  it('範囲外・空・非数は null', () => {
    expect(parseSizeMm('9.9')).toBeNull();
    expect(parseSizeMm('101')).toBeNull();
    expect(parseSizeMm('')).toBeNull();
    expect(parseSizeMm('abc')).toBeNull();
    expect(parseSizeMm('Infinity')).toBeNull();
  });
});

describe('computeDrawRect', () => {
  it('zoom=1・オフセット0 は枠を短辺基準で覆い、中央に置く', () => {
    // 1600×1200 を 400×500 へ → 高さ基準で scale=500/1200
    const r = computeDrawRect(1600, 1200, 400, 500, 1, 0, 0);
    expect(r.dh).toBeCloseTo(500);
    expect(r.dw).toBeCloseTo((1600 * 500) / 1200);
    expect(r.dx + r.dw / 2).toBeCloseTo(200);
    expect(r.dy + r.dh / 2).toBeCloseTo(250);
    expect(hasBackgroundGap(r, 400, 500)).toBe(false);
  });

  it('zoom を上げると大きくなる', () => {
    const a = computeDrawRect(1000, 1000, 400, 500, 1, 0, 0);
    const b = computeDrawRect(1000, 1000, 400, 500, 2, 0, 0);
    expect(b.dw).toBeCloseTo(a.dw * 2);
  });

  it('範囲外の zoom / offset は丸める', () => {
    const r = computeDrawRect(1000, 1000, 400, 500, 99, 5, -5);
    const max = computeDrawRect(1000, 1000, 400, 500, 3, 1, -1);
    expect(r).toEqual(max);
  });

  it('zoom<1 では背景が見える', () => {
    const r = computeDrawRect(1000, 1000, 400, 500, 0.5, 0, 0);
    expect(hasBackgroundGap(r, 400, 500)).toBe(true);
  });

  it('オフセットで画像が動く（正で右・下）', () => {
    const base = computeDrawRect(1000, 1000, 400, 500, 1, 0, 0);
    const moved = computeDrawRect(1000, 1000, 400, 500, 1, 0.5, 0.5);
    expect(moved.dx).toBeCloseTo(base.dx + 100);
    expect(moved.dy).toBeCloseTo(base.dy + 125);
    expect(hasBackgroundGap(moved, 400, 500)).toBe(true);
  });
});

describe('buildFilename', () => {
  it('サイズと拡張子を含む', () => {
    expect(buildFilename(35, 45, 'jpeg')).toBe('id-photo-35x45mm.jpg');
    expect(buildFilename(30.5, 40, 'png')).toBe('id-photo-30.5x40mm.png');
  });
});

describe('ID_PHOTO_PRESETS', () => {
  it('id が重複せず、サイズが範囲内', () => {
    const ids = ID_PHOTO_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of ID_PHOTO_PRESETS) {
      expect(parseSizeMm(p.widthMm)).not.toBeNull();
      expect(parseSizeMm(p.heightMm)).not.toBeNull();
    }
  });
});
