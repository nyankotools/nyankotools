import { describe, expect, it } from 'vitest';
import {
  COMBINATION_MAX,
  calculate,
  combination,
  describeNumber,
  factorial,
  parseCount,
  permutation,
  reciprocalScientific,
  repeatedCombination,
  repeatedPermutation,
} from './combination-calculator';

describe('parseCount', () => {
  it('整数を読み取る（全角・カンマ・空白・先頭0）', () => {
    expect(parseCount('10')).toEqual({ ok: true, value: 10 });
    expect(parseCount(' １２ ')).toEqual({ ok: true, value: 12 });
    expect(parseCount('1,000')).toEqual({ ok: true, value: 1000 });
    expect(parseCount('007')).toEqual({ ok: true, value: 7 });
    expect(parseCount('0')).toEqual({ ok: true, value: 0 });
    expect(parseCount('5.0')).toEqual({ ok: true, value: 5 });
  });

  it('エラーを区別する', () => {
    expect(parseCount('')).toEqual({ ok: false, reason: 'empty' });
    expect(parseCount('  ')).toEqual({ ok: false, reason: 'empty' });
    expect(parseCount('-3')).toEqual({ ok: false, reason: 'negative' });
    expect(parseCount('2.5')).toEqual({ ok: false, reason: 'not-integer' });
    expect(parseCount('abc')).toEqual({ ok: false, reason: 'invalid' });
    expect(parseCount('1e3')).toEqual({ ok: false, reason: 'invalid' });
  });

  it('上限を境界で判定する', () => {
    expect(parseCount(String(COMBINATION_MAX))).toEqual({
      ok: true,
      value: COMBINATION_MAX,
    });
    expect(parseCount(String(COMBINATION_MAX + 1))).toEqual({
      ok: false,
      reason: 'too-large',
    });
    expect(parseCount('99999999999999999999')).toEqual({
      ok: false,
      reason: 'too-large',
    });
  });
});

describe('各種計算', () => {
  it('階乗', () => {
    expect(factorial(0)).toBe(1n);
    expect(factorial(5)).toBe(120n);
    expect(factorial(20)).toBe(2432902008176640000n);
    expect(factorial(25)).toBe(15511210043330985984000000n);
  });

  it('順列', () => {
    expect(permutation(5, 0)).toBe(1n);
    expect(permutation(5, 2)).toBe(20n);
    expect(permutation(5, 5)).toBe(120n);
    expect(permutation(3, 4)).toBeNull();
    expect(permutation(0, 0)).toBe(1n);
  });

  it('組合せ', () => {
    expect(combination(5, 0)).toBe(1n);
    expect(combination(5, 2)).toBe(10n);
    expect(combination(5, 5)).toBe(1n);
    expect(combination(52, 5)).toBe(2598960n);
    expect(combination(100, 50)).toBe(100891344545564193334812497256n);
    expect(combination(3, 4)).toBeNull();
  });

  it('重複順列・重複組合せ', () => {
    expect(repeatedPermutation(2, 10)).toBe(1024n);
    expect(repeatedPermutation(0, 0)).toBe(1n);
    expect(repeatedPermutation(0, 3)).toBe(0n);
    expect(repeatedCombination(3, 2)).toBe(6n);
    expect(repeatedCombination(3, 5)).toBe(21n);
    expect(repeatedCombination(0, 0)).toBe(1n);
    expect(repeatedCombination(0, 2)).toBe(0n);
    expect(repeatedCombination(4, 0)).toBe(1n);
  });

  it('r > n では順列・組合せだけ null', () => {
    const r = calculate(3, 5);
    expect(r.permutation).toBeNull();
    expect(r.combination).toBeNull();
    expect(r.factorial).toBe(6n);
    expect(r.repeatedPermutation).toBe(243n);
    expect(r.repeatedCombination).toBe(21n);
  });

  it('上限でも正しい桁数で計算できる', () => {
    expect(factorial(COMBINATION_MAX).toString().length).toBe(35660);
    const r = calculate(COMBINATION_MAX, COMBINATION_MAX);
    expect(r.combination).toBe(1n);
    expect(r.permutation).toBe(r.factorial);
    expect(r.repeatedPermutation.toString().length).toBe(40001);
  });
});

describe('describeNumber / reciprocalScientific', () => {
  it('桁数と科学的記法', () => {
    expect(describeNumber(0n)).toEqual({
      digits: '0',
      length: 1,
      scientific: '0',
    });
    expect(describeNumber(5n).scientific).toBe('5e+0');
    expect(describeNumber(120n)).toMatchObject({
      length: 3,
      scientific: '1.2e+2',
    });
    expect(describeNumber(factorial(20))).toMatchObject({
      length: 19,
      scientific: '2.4329e+18',
    });
  });

  it('逆数の近似', () => {
    expect(reciprocalScientific(1n)).toBe('1e+0');
    expect(reciprocalScientific(2n)).toBe('5e-1');
    expect(reciprocalScientific(8n)).toBe('1.25e-1');
    expect(reciprocalScientific(3n)).toBe('3.33333e-1');
    expect(reciprocalScientific(2598960n)).toBe('3.84769e-7');
    expect(reciprocalScientific(0n)).toBeNull();
  });
});
