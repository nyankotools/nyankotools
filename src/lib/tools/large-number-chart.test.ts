import { describe, expect, it } from 'vitest';
import {
  annotateJaReadings,
  buildChartRows,
  formatJa,
  formatScientific,
  formatShort,
  formatWithCommas,
  parseLargeNumber,
} from './large-number-chart';

function value(input: string): bigint | null {
  const result = parseLargeNumber(input);
  return result.ok ? result.value : null;
}

describe('formatWithCommas', () => {
  it('3桁ごとにカンマを入れる', () => {
    expect(formatWithCommas(0n)).toBe('0');
    expect(formatWithCommas(999n)).toBe('999');
    expect(formatWithCommas(1000n)).toBe('1,000');
    expect(formatWithCommas(1234567n)).toBe('1,234,567');
    expect(formatWithCommas(-1234567n)).toBe('-1,234,567');
  });
});

describe('formatScientific', () => {
  it('指数表記にする', () => {
    expect(formatScientific(0n)).toBe('0');
    expect(formatScientific(5n)).toBe('5e+0');
    expect(formatScientific(12345678n)).toBe('1.2345678e+7');
    expect(formatScientific(10n ** 50n)).toBe('1e+50');
  });
});

describe('formatShort', () => {
  it('1000未満はそのまま', () => {
    expect(formatShort(999n)).toBe('999');
  });
  it('K/M/B/T表記（切り捨て）', () => {
    expect(formatShort(1000n)).toBe('1K');
    expect(formatShort(1500n)).toBe('1.5K');
    expect(formatShort(1234567n)).toBe('1.23M');
    expect(formatShort(1999999n)).toBe('1.99M');
    expect(formatShort(10n ** 9n)).toBe('1B');
    expect(formatShort(10n ** 12n)).toBe('1T');
  });
  it('接尾辞が尽きた後は最大の接尾辞で表す', () => {
    expect(formatShort(10n ** 63n)).toBe('1Vg');
    expect(formatShort(10n ** 66n)).toBe('1,000Vg');
  });
  it('負数は null', () => {
    expect(formatShort(-1n)).toBeNull();
  });
});

describe('formatJa', () => {
  it('万・億・兆で位取りする', () => {
    expect(formatJa(0n)).toBe('0');
    expect(formatJa(9999n)).toBe('9999');
    expect(formatJa(10000n)).toBe('1万');
    expect(formatJa(123456789n)).toBe('1億2345万6789');
    expect(formatJa(10n ** 12n)).toBe('1兆');
    expect(formatJa(100000001n)).toBe('1億1');
  });
  it('無量大数まで対応し、それ以上は係数が増える', () => {
    expect(formatJa(10n ** 68n)).toBe('1無量大数');
    expect(formatJa(10n ** 72n)).toBe('10000無量大数');
  });
});

describe('parseLargeNumber', () => {
  it('整数（区切り文字付き）', () => {
    expect(value('1234567')).toBe(1234567n);
    expect(value('1,234,567')).toBe(1234567n);
    expect(value('1 234 567')).toBe(1234567n);
    expect(value('１２３４')).toBe(1234n);
  });
  it('指数表記', () => {
    expect(value('1e50')).toBe(10n ** 50n);
    expect(value('1.5e3')).toBe(1500n);
    expect(value('2E+3')).toBe(2000n);
  });
  it('英語接尾辞（大文字小文字は問わない）', () => {
    expect(value('1.5M')).toBe(1500000n);
    expect(value('3 qa')).toBe(3n * 10n ** 15n);
    expect(value('2Vg')).toBe(2n * 10n ** 63n);
  });
  it('日本語の位取り', () => {
    expect(value('3億')).toBe(300000000n);
    expect(value('2億3000万')).toBe(230000000n);
    expect(value('1億2345万6789')).toBe(123456789n);
    expect(value('1.5兆')).toBe(1500000000000n);
    expect(value('1 億 2 万')).toBe(100020000n);
  });
  it('0 は 0', () => {
    expect(value('0')).toBe(0n);
    expect(value('0e5')).toBe(0n);
  });
  it('エラー', () => {
    expect(parseLargeNumber('')).toEqual({ ok: false, error: 'empty' });
    expect(parseLargeNumber('abc')).toEqual({ ok: false, error: 'invalid' });
    expect(parseLargeNumber('1Z')).toEqual({ ok: false, error: 'invalid' });
    expect(parseLargeNumber('-5')).toEqual({ ok: false, error: 'invalid' });
    expect(parseLargeNumber('1.5')).toEqual({ ok: false, error: 'fraction' });
    expect(parseLargeNumber('1.0005K')).toEqual({
      ok: false,
      error: 'fraction',
    });
    expect(parseLargeNumber('1e99999')).toEqual({
      ok: false,
      error: 'tooLarge',
    });
    expect(parseLargeNumber('億億')).toEqual({ ok: false, error: 'invalid' });
  });
  it('小数点つきでも1000桁を超える入力は拒否する', () => {
    expect(parseLargeNumber('1'.repeat(1500) + '.0')).toEqual({
      ok: false,
      error: 'tooLarge',
    });
    expect(parseLargeNumber('1'.repeat(3000))).toEqual({
      ok: false,
      error: 'tooLarge',
    });
  });
  it('小数でも整数になる場合は受け付ける', () => {
    expect(value('2.0')).toBe(2n);
    expect(value('1.250K')).toBe(1250n);
  });
});

describe('エッジケース（境界・全角・空白・改行・絵文字）', () => {
  it('1000桁ちょうどは受け付け、1001桁は拒否する', () => {
    expect(value('1'.repeat(1000))).toBe(BigInt('1'.repeat(1000)));
    expect(parseLargeNumber('1'.repeat(1001))).toEqual({
      ok: false,
      error: 'tooLarge',
    });
    expect(value('1e999')).toBe(10n ** 999n);
    expect(parseLargeNumber('1e1000')).toEqual({
      ok: false,
      error: 'tooLarge',
    });
  });
  it('2001文字を超える入力は即座に拒否する', () => {
    expect(parseLargeNumber('9'.repeat(2001))).toEqual({
      ok: false,
      error: 'tooLarge',
    });
  });
  it('空白のみは empty、前後の空白・改行・CRLF は無視する', () => {
    expect(parseLargeNumber('   ')).toEqual({ ok: false, error: 'empty' });
    expect(value('1234\r\n')).toBe(1234n);
    expect(value('  3億  ')).toBe(300000000n);
    expect(value('0001234')).toBe(1234n);
  });
  it('全角の数字・記号・全角スペースを正規化する', () => {
    expect(value('１，２３４')).toBe(1234n);
    expect(value('２．５Ｋ')).toBe(2500n);
    expect(value('１ｅ５０')).toBe(10n ** 50n);
    expect(value('３　億')).toBe(300000000n);
    expect(value('１．５Ｍ')).toBe(1500000n);
  });
  it('サロゲートペアの数字（数学用英数字）も正規化される', () => {
    expect(value('\u{1D7CF}')).toBe(1n);
  });
  it('絵文字・漢数字・記号は invalid', () => {
    expect(parseLargeNumber('🐱')).toEqual({ ok: false, error: 'invalid' });
    expect(parseLargeNumber('二億')).toEqual({ ok: false, error: 'invalid' });
    expect(parseLargeNumber('+5')).toEqual({ ok: false, error: 'invalid' });
    expect(parseLargeNumber('1e-5')).toEqual({ ok: false, error: 'invalid' });
    expect(parseLargeNumber('.5')).toEqual({ ok: false, error: 'invalid' });
  });
  it('小数点の後に数字が無い・改行を挟む入力は invalid', () => {
    expect(parseLargeNumber('5.')).toEqual({ ok: false, error: 'invalid' });
    expect(parseLargeNumber('1\n2')).toEqual({ ok: false, error: 'invalid' });
  });
  it('接尾辞と単位の前後に空白があっても受け付ける', () => {
    expect(value('1.5 K')).toBe(1500n);
    expect(value('1.5 億')).toBe(150000000n);
    expect(value('1万 5000')).toBe(15000n);
  });
  it('表示の境界（999.99K / 1M / 9999 / 1万）', () => {
    expect(formatShort(999999n)).toBe('999.99K');
    expect(formatShort(1000000n)).toBe('1M');
    expect(formatShort(0n)).toBe('0');
    expect(formatJa(9999n)).toBe('9999');
    expect(formatJa(10000n)).toBe('1万');
  });
  it('1000桁の数でも表示系関数が例外を投げない', () => {
    const big = BigInt('9'.repeat(1000));
    expect(formatWithCommas(big)).toMatch(/^9{1,3}(,9{3})+$/);
    expect(formatShort(big)).toMatch(/Vg$/);
    expect(formatJa(big)).toContain('無量大数');
    expect(formatScientific(big)).toMatch(/^9\.9+e\+999$/);
  });
});

describe('buildChartRows', () => {
  it('10^3〜10^68 の行を作る', () => {
    const rows = buildChartRows();
    expect(rows).toHaveLength(66);
    expect(rows[0]).toMatchObject({
      exponent: 3,
      commas: '1,000',
      short: '1K',
      ja: '1000',
    });
    const last = rows[rows.length - 1];
    expect(last.exponent).toBe(68);
    expect(last.ja).toBe('1無量大数');
  });
});

describe('annotateJaReadings', () => {
  it('各単位に読み方を付ける', () => {
    expect(annotateJaReadings('1億2345万6789', 'ja')).toBe(
      '1億（おく）2345万（まん）6789',
    );
    expect(annotateJaReadings('100恒河沙', 'en')).toBe('100恒河沙（gōgasha）');
    expect(annotateJaReadings('1000', 'ja')).toBe('1000');
  });
});
