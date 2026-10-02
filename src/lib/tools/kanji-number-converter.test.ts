import { describe, it, expect } from 'vitest';
import {
  convertKanjiNumbers,
  parseKanjiNumber,
  toKanjiNumber,
} from './kanji-number-converter';

describe('parseKanjiNumber', () => {
  it.each([
    ['千二百三十四', '1234'],
    ['二千二十四', '2024'],
    ['二〇二四', '2024'],
    ['壱萬弐千参百四拾五', '12345'],
    ['十', '10'],
    ['百', '100'],
    ['千', '1000'],
    ['万', '10000'],
    ['一万', '10000'],
    ['三億五千万', '350000000'],
    ['一兆二千三百四十五億', '1234500000000'],
    ['千〇五', '1005'],
    ['零', '0'],
    ['〇', '0'],
    ['一垓', '100000000000000000000'],
  ])('%s → %s', (input, expected) => {
    expect(parseKanjiNumber(input)).toBe(expected);
  });

  it.each(['十十', '百十千', '二三千', '億万億', '一万万'])(
    '成り立たない並び %s は null',
    (input) => {
      expect(parseKanjiNumber(input)).toBeNull();
    },
  );
});

describe('toKanjiNumber', () => {
  it.each([
    ['1234', 'unit', '千二百三十四'],
    ['10', 'unit', '十'],
    ['110', 'unit', '百十'],
    ['1000', 'unit', '千'],
    ['10000', 'unit', '一万'],
    ['11000', 'unit', '一万一千'],
    ['350000000', 'unit', '三億五千万'],
    ['100000000', 'unit', '一億'],
    ['0', 'unit', '零'],
    ['2024', 'plain', '二〇二四'],
    ['007', 'plain', '〇〇七'],
    ['12345', 'daiji', '壱萬弐千参百四拾五'],
    ['10', 'daiji', '壱拾'],
    ['1000', 'daiji', '壱千'],
    ['0', 'daiji', '零'],
  ] as const)('%s (%s) → %s', (digits, style, expected) => {
    expect(toKanjiNumber(digits, style)).toBe(expected);
  });

  it('桁が大きすぎる単位記法は null', () => {
    expect(toKanjiNumber('1' + '0'.repeat(24), 'unit')).toBeNull();
  });

  it('往復して元の数に戻る', () => {
    const numbers = [
      1, 9, 10, 11, 99, 100, 101, 1000, 1001, 10000, 10001, 123456789,
      1000000000000,
    ];
    for (const n of numbers) {
      for (const style of ['unit', 'daiji'] as const) {
        const k = toKanjiNumber(String(n), style)!;
        expect(parseKanjiNumber(k)).toBe(String(n));
      }
    }
  });
});

describe('convertKanjiNumbers', () => {
  const toArabic = {
    direction: 'toArabic',
    style: 'unit',
    comma: false,
  } as const;
  const toKanji = {
    direction: 'toKanji',
    style: 'unit',
    comma: false,
  } as const;

  it('文中の漢数字を算用数字にする', () => {
    const r = convertKanjiNumbers('金壱萬弐千円と三百円', toArabic);
    expect(r.output).toBe('金12000円と300円');
    expect(r.converted).toBe(2);
  });

  it('数字を含まない単位だけの並び（京都・千葉・十分）は変換しない', () => {
    const r = convertKanjiNumbers('京都の千葉で十分、万歳', toArabic);
    expect(r).toEqual({
      output: '京都の千葉で十分、万歳',
      converted: 0,
      skipped: 0,
    });
  });

  it('〇万のように零が係数のときは変換しない', () => {
    expect(parseKanjiNumber('〇万')).toBeNull();
  });

  it('3桁区切りにできる（位取り記法は区切らない）', () => {
    const r = convertKanjiNumbers('千二百三十四万 二〇二四年', {
      ...toArabic,
      comma: true,
    });
    expect(r.output).toBe('12,340,000 2024年');
  });

  it('数として成り立たない並びはそのまま残して数える', () => {
    const r = convertKanjiNumbers('二三千円', toArabic);
    expect(r.output).toBe('二三千円');
    expect(r.skipped).toBe(1);
    expect(r.converted).toBe(0);
  });

  it('算用数字を漢数字にする（全角・カンマ・小数）', () => {
    expect(convertKanjiNumbers('１,２３４円', toKanji).output).toBe(
      '千二百三十四円',
    );
    expect(convertKanjiNumbers('3.14', toKanji).output).toBe('三点一四');
    expect(
      convertKanjiNumbers('120000円', { ...toKanji, style: 'daiji' }).output,
    ).toBe('壱拾弐萬円');
  });

  it('漢数字以外の文字は変えない', () => {
    expect(convertKanjiNumbers('abc あいう', toKanji).output).toBe(
      'abc あいう',
    );
    expect(convertKanjiNumbers('', toArabic)).toEqual({
      output: '',
      converted: 0,
      skipped: 0,
    });
  });
});
