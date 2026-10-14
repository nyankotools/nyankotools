import { describe, expect, it } from 'vitest';
import {
  MAX_DIMENSION,
  MAX_MARGIN,
  clampMargin,
  computeLayout,
  isWithinLimit,
  outputFormat,
  paddedFileName,
  parseAspect,
} from './image-padding';

describe('parseAspect', () => {
  it('比率文字列を数値にする', () => {
    expect(parseAspect('16:9')).toBeCloseTo(16 / 9);
    expect(parseAspect('4/5')).toBeCloseTo(0.8);
    expect(parseAspect(' 1 : 1 ')).toBe(1);
    expect(parseAspect('1.91:1')).toBeCloseTo(1.91);
  });
  it('数値の文字列はそのまま比率', () => {
    expect(parseAspect('1.5')).toBe(1.5);
  });
  it('none・空・不正・0 は null', () => {
    expect(parseAspect('none')).toBeNull();
    expect(parseAspect('')).toBeNull();
    expect(parseAspect('0:5')).toBeNull();
    expect(parseAspect('-1')).toBeNull();
  });
});

describe('clampMargin', () => {
  it('整数にそろえ範囲内に収める', () => {
    expect(clampMargin(10.6)).toBe(11);
    expect(clampMargin(-5)).toBe(0);
    expect(clampMargin(NaN)).toBe(0);
    expect(clampMargin(1e9)).toBe(MAX_MARGIN);
  });
});

describe('computeLayout', () => {
  it('横長画像を1:1にすると上下に余白が付く', () => {
    const l = computeLayout({ width: 400, height: 200 }, 1, 0);
    expect(l.canvas).toEqual({ width: 400, height: 400 });
    expect(l.x).toBe(0);
    expect(l.y).toBe(100);
    expect(l.bottom).toBe(100);
  });
  it('縦長画像を1:1にすると左右に余白が付く', () => {
    const l = computeLayout({ width: 200, height: 400 }, 1, 0);
    expect(l.canvas).toEqual({ width: 400, height: 400 });
    expect(l.x).toBe(100);
    expect(l.y).toBe(0);
  });
  it('すでに同じ比率なら変わらない', () => {
    const l = computeLayout({ width: 160, height: 90 }, 16 / 9, 0);
    expect(l.canvas).toEqual({ width: 160, height: 90 });
    expect(l.x).toBe(0);
  });
  it('4:5 に合わせる', () => {
    const l = computeLayout({ width: 1000, height: 1000 }, 4 / 5, 0);
    expect(l.canvas).toEqual({ width: 1000, height: 1250 });
    expect(l.y).toBe(125);
  });
  it('比率なしなら余白だけを足す', () => {
    const l = computeLayout({ width: 100, height: 50 }, null, 20);
    expect(l.canvas).toEqual({ width: 140, height: 90 });
    expect(l.x).toBe(20);
    expect(l.y).toBe(20);
  });
  it('余白と比率を組み合わせる', () => {
    const l = computeLayout({ width: 100, height: 100 }, 2, 10);
    expect(l.canvas).toEqual({ width: 240, height: 120 });
    expect(l.x).toBe(70);
    expect(l.y).toBe(10);
  });
  it('端数は右・下に1px多く付く', () => {
    const l = computeLayout({ width: 100, height: 100 }, 1, 0);
    expect(l.right).toBe(0);
    const o = computeLayout({ width: 101, height: 100 }, 1, 0);
    expect(o.canvas).toEqual({ width: 101, height: 101 });
    expect(o.y).toBe(0);
    expect(o.bottom).toBe(1);
  });
  it('画像は縮小されず、余白の合計が必ず非負', () => {
    for (const ratio of [0.3, 1, 1.78, 3.2]) {
      const l = computeLayout({ width: 37, height: 53 }, ratio, 3);
      expect(l.x).toBeGreaterThanOrEqual(0);
      expect(l.y).toBeGreaterThanOrEqual(0);
      expect(l.x + 37 + l.right).toBe(l.canvas.width);
      expect(l.y + 53 + l.bottom).toBe(l.canvas.height);
    }
  });
});

describe('isWithinLimit', () => {
  it('上限を判定する', () => {
    expect(isWithinLimit({ width: 100, height: 100 })).toBe(true);
    expect(isWithinLimit({ width: MAX_DIMENSION + 1, height: 1 })).toBe(false);
    expect(isWithinLimit({ width: 10000, height: 10000 })).toBe(false);
    expect(isWithinLimit({ width: 0, height: 10 })).toBe(false);
  });
});

describe('paddedFileName / outputFormat', () => {
  it('拡張子を置き換えて -padded を付ける', () => {
    expect(paddedFileName('photo.png', 'jpeg')).toBe('photo-padded.jpg');
    expect(paddedFileName('a.b.webp', 'webp')).toBe('a.b-padded.webp');
    expect(paddedFileName(null, 'png')).toBe('image-padded.png');
    expect(paddedFileName('  ', 'png')).toBe('image-padded.png');
  });
  it('MIMEを返す', () => {
    expect(outputFormat('webp').mime).toBe('image/webp');
  });
});
