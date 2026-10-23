import { describe, it, expect } from 'vitest';
import {
  calcLuhnCheckDigit,
  checkLuhn,
  detectBrand,
  formatCardNumber,
  isLuhnValid,
  normalizeCardInput,
  TEST_NUMBERS,
} from './luhn-checker';

describe('isLuhnValid', () => {
  it('公開テスト番号はすべて Luhn を満たす', () => {
    for (const t of TEST_NUMBERS) expect(isLuhnValid(t.number)).toBe(true);
  });
  it('1桁違うと不正', () => {
    expect(isLuhnValid('4111111111111112')).toBe(false);
  });
  it('数字以外・1桁は不正', () => {
    expect(isLuhnValid('4111a')).toBe(false);
    expect(isLuhnValid('0')).toBe(false);
  });
});

describe('calcLuhnCheckDigit', () => {
  it('本体から検査桁を求める', () => {
    expect(calcLuhnCheckDigit('411111111111111')).toBe(1);
    expect(calcLuhnCheckDigit('7992739871')).toBe(3);
    expect(calcLuhnCheckDigit('37828224631000')).toBe(5);
  });
});

describe('detectBrand', () => {
  it('テスト番号のブランドを判定する', () => {
    for (const t of TEST_NUMBERS) expect(detectBrand(t.number)).toBe(t.brand);
  });
  it('Mastercard の 2 系レンジ', () => {
    expect(detectBrand('2221000000000009')).toBe('mastercard');
    expect(detectBrand('2720990000000007')).toBe('mastercard');
    expect(detectBrand('2720')).toBe('mastercard');
    expect(detectBrand('2721')).toBeNull();
  });
  it('JCB の境界', () => {
    expect(detectBrand('3528')).toBe('jcb');
    expect(detectBrand('3589')).toBe('jcb');
    expect(detectBrand('3590')).toBeNull();
  });
  it('不明', () => {
    expect(detectBrand('9999')).toBeNull();
  });
});

describe('normalizeCardInput / formatCardNumber', () => {
  it('全角・空白・ハイフンを除く', () => {
    expect(normalizeCardInput('４１１１ 1111-1111 1111')).toBe(
      '4111111111111111',
    );
  });
  it('区切りの形式', () => {
    expect(formatCardNumber('4111111111111111', 'visa')).toBe(
      '4111 1111 1111 1111',
    );
    expect(formatCardNumber('378282246310005', 'amex')).toBe(
      '3782 822463 10005',
    );
  });
});

describe('checkLuhn', () => {
  it('空・数字以外・桁数', () => {
    expect(checkLuhn('  ').kind).toBe('empty');
    expect(checkLuhn('4111x').kind).toBe('invalidChars');
    expect(checkLuhn('1')).toEqual({ kind: 'wrongLength', length: 1 });
    expect(checkLuhn('1'.repeat(20))).toEqual({
      kind: 'wrongLength',
      length: 20,
    });
  });
  it('正しい番号', () => {
    const r = checkLuhn('4111 1111 1111 1111');
    expect(r).toMatchObject({
      kind: 'checked',
      valid: true,
      brand: 'visa',
      lengthMatchesBrand: true,
      expectedCheckDigit: 1,
    });
  });
  it('不正な番号は期待検査桁を返す', () => {
    const r = checkLuhn('4111111111111112');
    expect(r).toMatchObject({
      valid: false,
      actualCheckDigit: 2,
      expectedCheckDigit: 1,
    });
  });
  it('ブランドの桁数と合わない', () => {
    const r = checkLuhn('411111111111');
    expect(r).toMatchObject({ brand: 'visa', lengthMatchesBrand: false });
  });
});
