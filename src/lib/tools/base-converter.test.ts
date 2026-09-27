import { describe, expect, it } from 'vitest';
import {
  convertToAllBases,
  parseSignedDecimal,
  parseUnsignedInBase,
  rawBitsToSigned,
  signedRange,
  signedToRawBits,
  unsignedMax,
} from './base-converter';

describe('signedRange', () => {
  it('8bitの符号付き範囲は-128〜127', () => {
    expect(signedRange(8)).toEqual({ min: -128n, max: 127n });
  });

  it('16bitの符号付き範囲は-32768〜32767', () => {
    expect(signedRange(16)).toEqual({ min: -32768n, max: 32767n });
  });
});

describe('unsignedMax', () => {
  it('8bitの最大値は255', () => {
    expect(unsignedMax(8)).toBe(255n);
  });

  it('64bitの最大値は18446744073709551615', () => {
    expect(unsignedMax(64)).toBe(18446744073709551615n);
  });
});

describe('signedToRawBits / rawBitsToSigned', () => {
  it('正の値はそのまま生ビット値になる', () => {
    expect(signedToRawBits(5n, 8)).toBe(5n);
    expect(rawBitsToSigned(5n, 8)).toBe(5n);
  });

  it('8bitで-1は生ビット値255（11111111）になる', () => {
    expect(signedToRawBits(-1n, 8)).toBe(255n);
    expect(rawBitsToSigned(255n, 8)).toBe(-1n);
  });

  it('8bitで-128（最小値）は生ビット値128（10000000）になる', () => {
    expect(signedToRawBits(-128n, 8)).toBe(128n);
    expect(rawBitsToSigned(128n, 8)).toBe(-128n);
  });

  it('相互変換が一致する（32bit）', () => {
    for (const value of [0n, 1n, -1n, 2147483647n, -2147483648n]) {
      expect(rawBitsToSigned(signedToRawBits(value, 32), 32)).toBe(value);
    }
  });
});

describe('parseUnsignedInBase', () => {
  it('2進数の文字列をパースする', () => {
    expect(parseUnsignedInBase('11111111', 2, 8)).toBe(255n);
  });

  it('8進数の文字列をパースする', () => {
    expect(parseUnsignedInBase('377', 8, 8)).toBe(255n);
  });

  it('16進数の文字列をパースする（大文字・小文字どちらも可）', () => {
    expect(parseUnsignedInBase('ff', 16, 8)).toBe(255n);
    expect(parseUnsignedInBase('FF', 16, 8)).toBe(255n);
  });

  it('0x/0b/0oプレフィックスを取り除いてパースする', () => {
    expect(parseUnsignedInBase('0xFF', 16, 8)).toBe(255n);
    expect(parseUnsignedInBase('0b11111111', 2, 8)).toBe(255n);
    expect(parseUnsignedInBase('0o377', 8, 8)).toBe(255n);
  });

  it('前後の空白を無視する', () => {
    expect(parseUnsignedInBase('  ff  ', 16, 8)).toBe(255n);
  });

  it('符号（+/-）はビット列表現として不正なのでnull', () => {
    expect(parseUnsignedInBase('-1', 16, 8)).toBeNull();
    expect(parseUnsignedInBase('+1', 16, 8)).toBeNull();
  });

  it('指定ビット幅で表せない値はnull（8bitで256=0x100は超過）', () => {
    expect(parseUnsignedInBase('100', 16, 8)).toBeNull();
    expect(parseUnsignedInBase('ff', 16, 8)).toBe(255n);
  });

  it('桁数の大きい数値も欠落なく変換する（BigInt、64bit）', () => {
    expect(parseUnsignedInBase('FFFFFFFFFFFFFFFF', 16, 64)).toBe(
      18446744073709551615n,
    );
  });

  it('空文字はnull', () => {
    expect(parseUnsignedInBase('', 16, 8)).toBeNull();
    expect(parseUnsignedInBase('   ', 16, 8)).toBeNull();
  });

  it('進数として不正な文字を含む場合はnull', () => {
    expect(parseUnsignedInBase('12', 2, 8)).toBeNull();
    expect(parseUnsignedInBase('8', 8, 8)).toBeNull();
    expect(parseUnsignedInBase('G', 16, 8)).toBeNull();
  });
});

describe('parseSignedDecimal', () => {
  it('正の整数をパースする', () => {
    expect(parseSignedDecimal('127', 8)).toBe(127n);
  });

  it('先頭の符号を解釈する', () => {
    expect(parseSignedDecimal('-128', 8)).toBe(-128n);
    expect(parseSignedDecimal('+127', 8)).toBe(127n);
  });

  it('前後の空白を無視する', () => {
    expect(parseSignedDecimal('  42  ', 8)).toBe(42n);
  });

  it('指定ビット幅の符号付き範囲を超える値はnull（8bitは-128〜127）', () => {
    expect(parseSignedDecimal('128', 8)).toBeNull();
    expect(parseSignedDecimal('-129', 8)).toBeNull();
    expect(parseSignedDecimal('255', 8)).toBeNull();
  });

  it('空文字・不正な形式はnull', () => {
    expect(parseSignedDecimal('', 8)).toBeNull();
    expect(parseSignedDecimal('1.5', 8)).toBeNull();
    expect(parseSignedDecimal('FF', 8)).toBeNull();
  });
});

describe('convertToAllBases', () => {
  it('8bitで-1は2進数11111111・8進数377・16進数FFになる（2の補数）', () => {
    expect(convertToAllBases(-1n, 8)).toEqual({
      binary: '11111111',
      octal: '377',
      decimal: '-1',
      hex: 'FF',
    });
  });

  it('8bitで-128（最小値）は2進数10000000・16進数80になる', () => {
    expect(convertToAllBases(-128n, 8)).toEqual({
      binary: '10000000',
      octal: '200',
      decimal: '-128',
      hex: '80',
    });
  });

  it('正の値は2進数・16進数がビット幅ぶん0埋めされる', () => {
    expect(convertToAllBases(5n, 8)).toEqual({
      binary: '00000101',
      octal: '5',
      decimal: '5',
      hex: '05',
    });
  });

  it('0を変換する', () => {
    expect(convertToAllBases(0n, 8)).toEqual({
      binary: '00000000',
      octal: '0',
      decimal: '0',
      hex: '00',
    });
  });

  it('32bitで-1は2進数32桁・16進数8桁のFFFFFFFFになる', () => {
    const result = convertToAllBases(-1n, 32);
    expect(result.binary).toBe('1'.repeat(32));
    expect(result.hex).toBe('FFFFFFFF');
    expect(result.decimal).toBe('-1');
  });

  it('64bitの最大値・最小値を欠落なく変換する（BigInt）', () => {
    expect(convertToAllBases(9223372036854775807n, 64).hex).toBe(
      '7FFFFFFFFFFFFFFF',
    );
    expect(convertToAllBases(-9223372036854775808n, 64).hex).toBe(
      '8000000000000000',
    );
  });
});
