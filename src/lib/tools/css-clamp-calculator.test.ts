import { describe, expect, it } from 'vitest';
import {
  calculateClamp,
  formatNumber,
  parseNumber,
  sizeAtViewport,
  type ClampInput,
} from './css-clamp-calculator';

const base: ClampInput = {
  minSize: 16,
  maxSize: 24,
  minViewport: 320,
  maxViewport: 1280,
  baseFontSize: 16,
  unit: 'rem',
};

describe('parseNumber', () => {
  it('数値をパースし、不正はnull', () => {
    expect(parseNumber(' 16 ')).toBe(16);
    expect(parseNumber('1.5')).toBe(1.5);
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('16px')).toBeNull();
  });
});

describe('formatNumber', () => {
  it('小数第4位で丸め、-0を0にする', () => {
    expect(formatNumber(1 / 3)).toBe('0.3333');
    expect(formatNumber(-0.00001)).toBe('0');
    expect(formatNumber(2)).toBe('2');
  });
});

describe('calculateClamp', () => {
  it('rem出力: 16px@320 -> 24px@1280', () => {
    const r = calculateClamp(base);
    expect(r).toEqual({
      clamp: 'clamp(1rem, 0.8333rem + 0.8333vw, 1.5rem)',
      preferred: '0.8333rem + 0.8333vw',
      slopeVw: expect.closeTo(0.8333, 3),
      interceptPx: expect.closeTo(13.3333, 3),
    });
  });

  it('px出力', () => {
    const r = calculateClamp({
      ...base,
      minSize: 16,
      maxSize: 32,
      minViewport: 400,
      maxViewport: 800,
      unit: 'px',
    });
    // slope = 0.04 -> 4vw, intercept = 16 - 16 = 0
    expect(r).toMatchObject({ clamp: 'clamp(16px, 4vw, 32px)' });
  });

  it('切片が負になる場合は符号付きで出力する', () => {
    const r = calculateClamp({
      ...base,
      minSize: 16,
      maxSize: 48,
      minViewport: 640,
      maxViewport: 1280,
      unit: 'px',
    });
    // slope=0.05 -> 5vw, intercept=16-32=-16
    expect(r).toMatchObject({ preferred: '-16px + 5vw' });
  });

  it('サイズが同じなら傾き0で固定値になる', () => {
    const r = calculateClamp({ ...base, minSize: 20, maxSize: 20 });
    expect(r).toMatchObject({ clamp: 'clamp(1.25rem, 1.25rem, 1.25rem)' });
  });

  it('縮小方向では第1引数と第3引数を入れ替える', () => {
    const r = calculateClamp({
      ...base,
      minSize: 32,
      maxSize: 16,
      minViewport: 400,
      maxViewport: 800,
      unit: 'px',
    });
    // slope=-0.04 -> -4vw, intercept=32+16=48
    expect(r).toMatchObject({
      clamp: 'clamp(16px, 48px - 4vw, 32px)',
    });
  });

  it('ベースフォントサイズでrem換算が変わる', () => {
    const r = calculateClamp({
      ...base,
      baseFontSize: 10,
      minSize: 10,
      maxSize: 20,
      minViewport: 0,
      maxViewport: 1000,
    });
    expect(r).toMatchObject({ clamp: 'clamp(1rem, 1rem + 1vw, 2rem)' });
  });

  it('不正な入力はエラーコードを返す', () => {
    expect(calculateClamp({ ...base, minSize: -1 })).toBe('invalidSize');
    expect(calculateClamp({ ...base, maxSize: NaN })).toBe('invalidSize');
    expect(calculateClamp({ ...base, minViewport: -5 })).toBe(
      'invalidViewport',
    );
    expect(calculateClamp({ ...base, minViewport: 1280 })).toBe('invalidRange');
    expect(calculateClamp({ ...base, minViewport: 1500 })).toBe('invalidRange');
    expect(calculateClamp({ ...base, baseFontSize: 0 })).toBe('invalidBase');
  });
});

describe('sizeAtViewport', () => {
  it('範囲内は線形補間、範囲外はクランプされる', () => {
    expect(sizeAtViewport(base, 800)).toBe(20);
    expect(sizeAtViewport(base, 100)).toBe(16);
    expect(sizeAtViewport(base, 3000)).toBe(24);
  });

  it('縮小方向でもクランプされる', () => {
    const d = { ...base, minSize: 32, maxSize: 16 };
    expect(sizeAtViewport(d, 100)).toBe(32);
    expect(sizeAtViewport(d, 3000)).toBe(16);
  });
});
