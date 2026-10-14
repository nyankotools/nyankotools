import { describe, expect, it } from 'vitest';
import {
  cardinalToOrdinal,
  convertNumberToWords,
  integerToEnglish,
  integerToKana,
  ordinalSuffix,
} from './number-to-words';

const opts = { british: false, currency: 'dollars' as const };

describe('integerToEnglish', () => {
  it('基本', () => {
    expect(integerToEnglish('0', false)).toBe('zero');
    expect(integerToEnglish('13', false)).toBe('thirteen');
    expect(integerToEnglish('21', false)).toBe('twenty-one');
    expect(integerToEnglish('100', false)).toBe('one hundred');
    expect(integerToEnglish('1234', false)).toBe(
      'one thousand two hundred thirty-four',
    );
    expect(integerToEnglish('1000000', false)).toBe('one million');
    expect(integerToEnglish('1000001', false)).toBe('one million one');
  });
  it('英国式の and', () => {
    expect(integerToEnglish('101', true)).toBe('one hundred and one');
    expect(integerToEnglish('1001', true)).toBe('one thousand and one');
    expect(integerToEnglish('1100', true)).toBe('one thousand one hundred');
    expect(integerToEnglish('2000000', true)).toBe('two million');
  });
});

describe('ordinal', () => {
  it('序数語', () => {
    expect(cardinalToOrdinal('one')).toBe('first');
    expect(cardinalToOrdinal('twenty-one')).toBe('twenty-first');
    expect(cardinalToOrdinal('twenty')).toBe('twentieth');
    expect(cardinalToOrdinal('twelve')).toBe('twelfth');
    expect(cardinalToOrdinal('one hundred')).toBe('one hundredth');
    expect(cardinalToOrdinal('four')).toBe('fourth');
    expect(cardinalToOrdinal('one million')).toBe('one millionth');
  });
  it('数字の序数', () => {
    expect(ordinalSuffix('1')).toBe('1st');
    expect(ordinalSuffix('2')).toBe('2nd');
    expect(ordinalSuffix('3')).toBe('3rd');
    expect(ordinalSuffix('11')).toBe('11th');
    expect(ordinalSuffix('12')).toBe('12th');
    expect(ordinalSuffix('21')).toBe('21st');
    expect(ordinalSuffix('112')).toBe('112th');
  });
});

describe('integerToKana', () => {
  it('基本', () => {
    expect(integerToKana('0')).toBe('ぜろ');
    expect(integerToKana('1234')).toBe('せんにひゃくさんじゅうよん');
    expect(integerToKana('300')).toBe('さんびゃく');
    expect(integerToKana('600')).toBe('ろっぴゃく');
    expect(integerToKana('800')).toBe('はっぴゃく');
    expect(integerToKana('3000')).toBe('さんぜん');
    expect(integerToKana('8000')).toBe('はっせん');
    expect(integerToKana('10000')).toBe('いちまん');
    expect(integerToKana('100000000')).toBe('いちおく');
  });
  it('兆の促音', () => {
    expect(integerToKana('1000000000000')).toBe('いっちょう');
    expect(integerToKana('8000000000000')).toBe('はっちょう');
    expect(integerToKana('10000000000000')).toBe('じゅっちょう');
    expect(integerToKana('100000000000000')).toBe('ひゃくちょう');
    expect(integerToKana('3000000000000')).toBe('さんちょう');
  });
});

describe('convertNumberToWords', () => {
  it('整数', () => {
    const r = convertNumberToWords('1,234', opts);
    expect(r).toMatchObject({
      ok: true,
      normalized: '1234',
      cardinal: 'one thousand two hundred thirty-four',
      ordinal: 'one thousand two hundred thirty-fourth',
      ordinalDigits: '1234th',
      check: 'One thousand two hundred thirty-four and 00/100 dollars',
      reading: 'せんにひゃくさんじゅうよん',
    });
  });
  it('小数は小切手表記に使える', () => {
    const r = convertNumberToWords('12.5', { ...opts, currency: 'pounds' });
    expect(r).toMatchObject({
      ok: true,
      cardinal: 'twelve point five',
      ordinal: null,
      check: 'Twelve and 50/100 pounds',
      reading: 'じゅうにてんご',
    });
  });
  it('3桁以上の小数・負数は小切手表記なし', () => {
    expect(convertNumberToWords('1.234', opts)).toMatchObject({ check: null });
    expect(convertNumberToWords('-5', opts)).toMatchObject({
      cardinal: 'minus five',
      reading: 'マイナスご',
      check: null,
      ordinal: null,
    });
  });
  it('全角・先頭ゼロ・-0', () => {
    expect(convertNumberToWords('００７', opts)).toMatchObject({
      normalized: '7',
      cardinal: 'seven',
    });
    expect(convertNumberToWords('-0', opts)).toMatchObject({
      normalized: '0',
      cardinal: 'zero',
    });
  });
  it('3桁区切りでないカンマは不正', () => {
    expect(convertNumberToWords('1,5', opts)).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(convertNumberToWords('1,2,3', opts)).toEqual({
      ok: false,
      error: 'invalid',
    });
  });
  it('エラー', () => {
    expect(convertNumberToWords('  ', opts)).toEqual({
      ok: false,
      error: 'empty',
    });
    expect(convertNumberToWords('12a', opts)).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(convertNumberToWords('1'.repeat(37), opts)).toEqual({
      ok: false,
      error: 'tooLong',
    });
    expect(convertNumberToWords('9'.repeat(36), opts).ok).toBe(true);
  });
  it('0・符号・全角記号・空白の正規化', () => {
    expect(convertNumberToWords('0', opts)).toMatchObject({
      normalized: '0',
      cardinal: 'zero',
      ordinal: 'zeroth',
      ordinalDigits: '0th',
      check: 'Zero and 00/100 dollars',
      reading: 'ぜろ',
    });
    expect(convertNumberToWords('+5', opts)).toMatchObject({
      normalized: '5',
      cardinal: 'five',
    });
    expect(convertNumberToWords('−5', opts)).toMatchObject({
      normalized: '-5',
      cardinal: 'minus five',
    });
    expect(convertNumberToWords('１，２３４．５', opts)).toMatchObject({
      normalized: '1234.5',
    });
    expect(convertNumberToWords(' 1 234\r\n', opts)).toMatchObject({
      normalized: '1234',
    });
    expect(convertNumberToWords('　', opts)).toEqual({
      ok: false,
      error: 'empty',
    });
  });
  it('不正な形式', () => {
    expect(convertNumberToWords('-', opts)).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(convertNumberToWords('.5', opts)).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(convertNumberToWords('1,234.', opts)).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(convertNumberToWords('1,2345', opts)).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(convertNumberToWords('1.2.3', opts)).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(convertNumberToWords('😀', opts)).toEqual({
      ok: false,
      error: 'invalid',
    });
  });
  it('桁数の上限（整数36桁・小数30桁）', () => {
    expect(convertNumberToWords(`0.${'1'.repeat(30)}`, opts).ok).toBe(true);
    expect(convertNumberToWords(`0.${'1'.repeat(31)}`, opts)).toEqual({
      ok: false,
      error: 'tooLong',
    });
    // 先頭ゼロは桁数に数えない
    expect(convertNumberToWords(`000${'9'.repeat(36)}`, opts).ok).toBe(true);
    const big = convertNumberToWords('9'.repeat(36), opts);
    expect(big.ok).toBe(true);
    if (big.ok) {
      // 36桁 = 12グループ。最上位は decillion（10^33）の位
      expect(
        big.cardinal.startsWith('nine hundred ninety-nine decillion '),
      ).toBe(true);
      expect(big.cardinal.endsWith('nine hundred ninety-nine')).toBe(true);
    }
  });
  it('英国式の and（大きな桁・序数）', () => {
    expect(
      convertNumberToWords('1000001', { ...opts, british: true }),
    ).toMatchObject({ cardinal: 'one million and one' });
    expect(
      convertNumberToWords('1000100', { ...opts, british: true }),
    ).toMatchObject({ cardinal: 'one million one hundred' });
    expect(
      convertNumberToWords('1,000,000', { ...opts, british: true }),
    ).toMatchObject({ cardinal: 'one million', ordinal: 'one millionth' });
  });
  it('小数・負数の読み（ひらがな）', () => {
    expect(convertNumberToWords('-1.5', opts)).toMatchObject({
      normalized: '-1.5',
      reading: 'マイナスいちてんご',
      check: null,
    });
    expect(convertNumberToWords('0.50', opts)).toMatchObject({
      normalized: '0.50',
      check: 'Zero and 50/100 dollars',
    });
    expect(convertNumberToWords('-0.0', opts)).toMatchObject({
      normalized: '0.0',
      cardinal: 'zero point zero',
      ordinal: null,
    });
  });
});

describe('ordinal（追加）', () => {
  it('10の位・100の位・序数の数字', () => {
    expect(cardinalToOrdinal('ninety-nine')).toBe('ninety-ninth');
    expect(cardinalToOrdinal('zero')).toBe('zeroth');
    expect(cardinalToOrdinal('one thousand')).toBe('one thousandth');
    expect(ordinalSuffix('0')).toBe('0th');
    expect(ordinalSuffix('101')).toBe('101st');
    expect(ordinalSuffix('1000')).toBe('1000th');
    expect(ordinalSuffix('103')).toBe('103rd');
  });
});

describe('integerToKana（追加）', () => {
  it('兆・京の促音と大きな単位', () => {
    expect(integerToKana('2000000000000')).toBe('にちょう');
    expect(integerToKana('20000000000000')).toBe('にじゅっちょう');
    expect(integerToKana('110000000000000')).toBe('ひゃくじゅっちょう');
    expect(integerToKana('11000000000000')).toBe('じゅういっちょう');
    expect(integerToKana('10000000000000000')).toBe('いっけい');
    // がい・じょ等の単位は促音化しない（1がい = いちがい）
    expect(integerToKana('100000000000000000000')).toBe('いちがい');
  });
});
