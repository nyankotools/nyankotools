import { describe, expect, it } from 'vitest';
import {
  calculatePercentage,
  simplifyRatio,
  solveProportion,
} from './ratio-calculator';

describe('simplifyRatio', () => {
  it('整数の比を最も簡単な整数比に約分する', () => {
    expect(simplifyRatio(4, 6)).toEqual({ a: 2, b: 3 });
  });

  it('すでに既約な比はそのまま返す', () => {
    expect(simplifyRatio(3, 5)).toEqual({ a: 3, b: 5 });
  });

  it('等しい比は1:1になる', () => {
    expect(simplifyRatio(7, 7)).toEqual({ a: 1, b: 1 });
  });

  it('小数を含む比も整数化してから約分する', () => {
    expect(simplifyRatio(1.5, 2)).toEqual({ a: 3, b: 4 });
    expect(simplifyRatio(0.2, 0.5)).toEqual({ a: 2, b: 5 });
  });

  it('aまたはbが0以下ならnull', () => {
    expect(simplifyRatio(0, 5)).toBeNull();
    expect(simplifyRatio(5, 0)).toBeNull();
    expect(simplifyRatio(-1, 5)).toBeNull();
  });

  it('NaNまたはInfinityを含む場合はnull', () => {
    expect(simplifyRatio(NaN, 5)).toBeNull();
    expect(simplifyRatio(5, Infinity)).toBeNull();
  });

  it('小数点を含む極小の指数表記でも仮数部の小数桁を正しく数えて約分する', () => {
    // 1.5e-7 : 1 の比率を保ったまま整数比にする（仮数部の".5"を無視すると誤った比になる）
    expect(simplifyRatio(0.00000015, 1)).toEqual({ a: 3, b: 20000000 });
  });
});

describe('solveProportion', () => {
  it('aが未知の場合を計算する（a:b = c:d）', () => {
    // a:4 = 6:8 -> a = 3
    expect(solveProportion({ a: null, b: 4, c: 6, d: 8 })).toBe(3);
  });

  it('bが未知の場合を計算する', () => {
    // 3:b = 6:8 -> b = 4
    expect(solveProportion({ a: 3, b: null, c: 6, d: 8 })).toBe(4);
  });

  it('cが未知の場合を計算する', () => {
    // 3:4 = c:8 -> c = 6
    expect(solveProportion({ a: 3, b: 4, c: null, d: 8 })).toBe(6);
  });

  it('dが未知の場合を計算する', () => {
    // 3:4 = 6:d -> d = 8
    expect(solveProportion({ a: 3, b: 4, c: 6, d: null })).toBe(8);
  });

  it('未知の項が0個の場合はnull', () => {
    expect(solveProportion({ a: 1, b: 2, c: 3, d: 4 })).toBeNull();
  });

  it('未知の項が2個以上の場合はnull', () => {
    expect(solveProportion({ a: null, b: null, c: 3, d: 4 })).toBeNull();
  });

  it('既知の値に0以下が含まれる場合はnull', () => {
    expect(solveProportion({ a: null, b: 0, c: 6, d: 8 })).toBeNull();
    expect(solveProportion({ a: null, b: -4, c: 6, d: 8 })).toBeNull();
  });

  it('既知の値にNaNが含まれる場合はnull', () => {
    expect(solveProportion({ a: null, b: NaN, c: 6, d: 8 })).toBeNull();
  });

  it('計算結果がオーバーフローしてInfinityになる場合はnull', () => {
    expect(solveProportion({ a: null, b: 1e200, c: 1e200, d: 1 })).toBeNull();
  });
});

describe('calculatePercentage', () => {
  it('partToPercent: 部分と全体から割合(%)を計算する', () => {
    expect(
      calculatePercentage({ mode: 'partToPercent', value1: 25, value2: 200 }),
    ).toBe(12.5);
  });

  it('partToPercent: 全体が0以下ならnull', () => {
    expect(
      calculatePercentage({ mode: 'partToPercent', value1: 25, value2: 0 }),
    ).toBeNull();
  });

  it('partToPercent: 部分が負ならnull', () => {
    expect(
      calculatePercentage({ mode: 'partToPercent', value1: -1, value2: 200 }),
    ).toBeNull();
  });

  it('percentToPart: 全体と割合(%)から部分の値を計算する', () => {
    expect(
      calculatePercentage({ mode: 'percentToPart', value1: 200, value2: 12.5 }),
    ).toBe(25);
  });

  it('partToWhole: 部分と割合(%)から全体の値を計算する', () => {
    expect(
      calculatePercentage({ mode: 'partToWhole', value1: 25, value2: 12.5 }),
    ).toBe(200);
  });

  it('partToWhole: 割合(%)が0以下ならnull', () => {
    expect(
      calculatePercentage({ mode: 'partToWhole', value1: 25, value2: 0 }),
    ).toBeNull();
  });

  it('changeRate: 増加の場合は正の増減率(%)を計算する', () => {
    expect(
      calculatePercentage({ mode: 'changeRate', value1: 100, value2: 120 }),
    ).toBe(20);
  });

  it('changeRate: 減少の場合は負の増減率(%)を計算する', () => {
    expect(
      calculatePercentage({ mode: 'changeRate', value1: 200, value2: 150 }),
    ).toBe(-25);
  });

  it('changeRate: 元の値が0ならnull', () => {
    expect(
      calculatePercentage({ mode: 'changeRate', value1: 0, value2: 150 }),
    ).toBeNull();
  });

  it('NaN・Infinityを含む場合はnull', () => {
    expect(
      calculatePercentage({ mode: 'partToPercent', value1: NaN, value2: 200 }),
    ).toBeNull();
    expect(
      calculatePercentage({
        mode: 'changeRate',
        value1: 100,
        value2: Infinity,
      }),
    ).toBeNull();
  });

  it('計算結果がオーバーフローしてInfinityになる場合はnull', () => {
    expect(
      calculatePercentage({
        mode: 'percentToPart',
        value1: 1e200,
        value2: 1e200,
      }),
    ).toBeNull();
  });
});
