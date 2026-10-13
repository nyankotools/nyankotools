import { describe, it, expect } from 'vitest';
import {
  convertFromRoman,
  convertToRoman,
  formatParts,
  formatRoman,
  integerToRoman,
} from './roman-numeral-converter';

const PLAIN = { unicode: false, lowercase: false };

describe('integerToRoman', () => {
  it.each([
    [1, 'I'],
    [4, 'IV'],
    [9, 'IX'],
    [14, 'XIV'],
    [40, 'XL'],
    [90, 'XC'],
    [400, 'CD'],
    [1994, 'MCMXCIV'],
    [2024, 'MMXXIV'],
    [3888, 'MMMDCCCLXXXVIII'],
    [3999, 'MMMCMXCIX'],
  ])('%i → %s', (n, expected) => {
    expect(integerToRoman(n)?.roman).toBe(expected);
  });

  it('範囲外・非整数は null', () => {
    expect(integerToRoman(0)).toBeNull();
    expect(integerToRoman(4000)).toBeNull();
    expect(integerToRoman(-1)).toBeNull();
    expect(integerToRoman(1.5)).toBeNull();
    expect(integerToRoman(NaN)).toBeNull();
  });

  it('構成要素を返す', () => {
    expect(integerToRoman(1994)?.parts).toEqual([
      { symbol: 'M', value: 1000 },
      { symbol: 'CM', value: 900 },
      { symbol: 'XC', value: 90 },
      { symbol: 'IV', value: 4 },
    ]);
  });

  it('1〜3999 すべてで往復変換が一致する', () => {
    for (let n = 1; n <= 3999; n++) {
      const roman = integerToRoman(n)!.roman;
      const back = convertFromRoman(roman);
      expect(back.kind).toBe('ok');
      if (back.kind === 'ok') expect(back.value).toBe(n);
    }
  });
});

describe('formatRoman', () => {
  it('小文字', () => {
    expect(formatRoman('XIV', 14, { unicode: false, lowercase: true })).toBe(
      'xiv',
    );
  });

  it('Unicode: 1〜12 は合字1文字', () => {
    expect(formatRoman('XII', 12, { unicode: true, lowercase: false })).toBe(
      'Ⅻ',
    );
    expect(formatRoman('IV', 4, { unicode: true, lowercase: false })).toBe('Ⅳ');
    expect(formatRoman('XI', 11, { unicode: true, lowercase: true })).toBe('ⅺ');
  });

  it('Unicode: 13 以上は1文字ずつ変換する', () => {
    expect(
      formatRoman('MCMXCIV', 1994, { unicode: true, lowercase: false }),
    ).toBe('ⅯⅭⅯⅩⅭⅠⅤ');
    expect(formatRoman('XIII', 13, { unicode: true, lowercase: true })).toBe(
      'ⅹⅰⅰⅰ',
    );
  });
});

describe('convertToRoman', () => {
  it('基本変換', () => {
    const r = convertToRoman('2024', PLAIN);
    expect(r).toMatchObject({ ok: true, value: 2024, output: 'MMXXIV' });
  });

  it('全角数字・カンマ・空白・先頭ゼロを受け付ける', () => {
    expect(convertToRoman('２０２４', PLAIN)).toMatchObject({
      output: 'MMXXIV',
    });
    expect(convertToRoman(' 1,994 ', PLAIN)).toMatchObject({
      output: 'MCMXCIV',
    });
    expect(convertToRoman('0007', PLAIN)).toMatchObject({ output: 'VII' });
  });

  it('範囲外', () => {
    expect(convertToRoman('0', PLAIN)).toEqual({
      ok: false,
      reason: 'out-of-range',
    });
    expect(convertToRoman('4000', PLAIN)).toEqual({
      ok: false,
      reason: 'out-of-range',
    });
    expect(convertToRoman('99999999999999999999', PLAIN)).toEqual({
      ok: false,
      reason: 'out-of-range',
    });
  });

  it('数字として読めない入力', () => {
    for (const s of ['', 'abc', '3.5', '-5', '1e3', '12a']) {
      expect(convertToRoman(s, PLAIN)).toEqual({
        ok: false,
        reason: 'invalid',
      });
    }
  });

  it('オプションを反映する', () => {
    expect(
      convertToRoman('12', { unicode: true, lowercase: false }),
    ).toMatchObject({ output: 'Ⅻ', roman: 'XII' });
  });
});

describe('convertFromRoman', () => {
  it('標準的な表記', () => {
    expect(convertFromRoman('MCMXCIV')).toMatchObject({
      kind: 'ok',
      value: 1994,
    });
  });

  it('小文字・前後の空白・全角を受け付ける', () => {
    expect(convertFromRoman('  xiv ')).toMatchObject({
      kind: 'ok',
      value: 14,
    });
    expect(convertFromRoman('ＸＩＶ')).toMatchObject({ kind: 'ok', value: 14 });
  });

  it('Unicode ローマ数字を読める', () => {
    expect(convertFromRoman('Ⅻ')).toMatchObject({ kind: 'ok', value: 12 });
    expect(convertFromRoman('ⅯⅯⅩⅩⅣ')).toMatchObject({
      kind: 'ok',
      value: 2024,
    });
    expect(convertFromRoman('ⅳ')).toMatchObject({ kind: 'ok', value: 4 });
  });

  it('IIII などは値と正規形を返す', () => {
    expect(convertFromRoman('IIII')).toMatchObject({
      kind: 'nonstandard',
      value: 4,
      roman: 'IV',
    });
    expect(convertFromRoman('VIIII')).toMatchObject({
      kind: 'nonstandard',
      value: 9,
      roman: 'IX',
    });
    expect(convertFromRoman('XXXX')).toMatchObject({
      kind: 'nonstandard',
      value: 40,
      roman: 'XL',
    });
    expect(convertFromRoman('CCCC')).toMatchObject({
      kind: 'nonstandard',
      roman: 'CD',
    });
  });

  it('VX・IC・IIX・VV などは形式不正', () => {
    for (const s of ['VX', 'IC', 'IIX', 'VV', 'IVI', 'LC', 'DM', 'IXI']) {
      expect(convertFromRoman(s)).toEqual({
        kind: 'error',
        reason: 'invalid-form',
      });
    }
  });

  it('範囲外（MMMM = 4000）', () => {
    expect(convertFromRoman('MMMM')).toEqual({
      kind: 'error',
      reason: 'out-of-range',
      value: 4000,
    });
  });

  it('空・ローマ数字以外の文字', () => {
    expect(convertFromRoman('  ')).toEqual({ kind: 'error', reason: 'empty' });
    expect(convertFromRoman('ABC')).toEqual({
      kind: 'error',
      reason: 'invalid-char',
    });
    expect(convertFromRoman('XIV年')).toEqual({
      kind: 'error',
      reason: 'invalid-char',
    });
  });
});

describe('formatParts', () => {
  it('記号と値を連ねる', () => {
    expect(formatParts(integerToRoman(14)!.parts)).toBe('X=10 + IV=4');
  });
});

describe('境界値（追加）', () => {
  it('上限 3999 は通り、0・負数・小数の入力は範囲外・不正', () => {
    expect(convertToRoman('3999', PLAIN)).toMatchObject({
      ok: true,
      output: 'MMMCMXCIX',
    });
    expect(convertToRoman('-0', PLAIN)).toEqual({
      ok: false,
      reason: 'invalid',
    });
    expect(convertToRoman('0000', PLAIN)).toEqual({
      ok: false,
      reason: 'out-of-range',
    });
  });

  it('桁数が多い入力（7桁超）は範囲外として扱い、先頭ゼロ付きの短い数は通す', () => {
    expect(convertToRoman('1000000', PLAIN)).toEqual({
      ok: false,
      reason: 'out-of-range',
    });
    expect(convertToRoman('0000000000001', PLAIN)).toMatchObject({
      ok: true,
      output: 'I',
    });
  });

  it('全角カンマ・アンダースコア区切りを受け付ける', () => {
    expect(convertToRoman('１，０００', PLAIN)).toMatchObject({
      output: 'M',
    });
    expect(convertToRoman('1_000', PLAIN)).toMatchObject({ output: 'M' });
  });

  it('IIII を含む長い繰り返しは正規形と値を返す', () => {
    expect(convertFromRoman('I'.repeat(16))).toMatchObject({
      kind: 'nonstandard',
      value: 16,
      roman: 'XVI',
    });
  });

  it('CCCCCCCCCC（1000）は非標準として値 1000 を返す', () => {
    expect(convertFromRoman('C'.repeat(10))).toMatchObject({
      kind: 'nonstandard',
      value: 1000,
      roman: 'M',
    });
  });

  it('非常に長い入力は範囲外で打ち切る（Number 化しない）', () => {
    expect(convertFromRoman('I'.repeat(100000))).toEqual({
      kind: 'error',
      reason: 'out-of-range',
      value: 100000,
    });
    expect(convertFromRoman('M'.repeat(100000))).toEqual({
      kind: 'error',
      reason: 'out-of-range',
      value: 100000000,
    });
  });

  it('Unicode の大文字・小文字の単独文字（Ⅿ・ⅿ）を読める', () => {
    expect(convertFromRoman('Ⅿ')).toMatchObject({ kind: 'ok', value: 1000 });
    expect(convertFromRoman('ⅿ')).toMatchObject({ kind: 'ok', value: 1000 });
  });

  it('サロゲートペア（絵文字）は invalid-char', () => {
    expect(convertFromRoman('X😀')).toEqual({
      kind: 'error',
      reason: 'invalid-char',
    });
  });
});
