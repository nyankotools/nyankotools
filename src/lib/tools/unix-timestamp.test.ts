import { describe, expect, it } from 'vitest';
import {
  dateToTimestamp,
  detectTimestampUnit,
  formatDateTimeLocalValue,
  parseDateTimeLocalValue,
  parseTimestampInput,
  timestampToDate,
} from './unix-timestamp';

describe('detectTimestampUnit', () => {
  it('小さい値は秒と判定する', () => {
    expect(detectTimestampUnit(1_700_000_000)).toBe('seconds');
    expect(detectTimestampUnit(-1_700_000_000)).toBe('seconds');
  });

  it('大きい値はミリ秒と判定する', () => {
    expect(detectTimestampUnit(1_700_000_000_000)).toBe('milliseconds');
  });

  it('10桁以下は秒、11桁以上はミリ秒という境界通りに判定する', () => {
    expect(detectTimestampUnit(9_999_999_999)).toBe('seconds'); // 10桁
    expect(detectTimestampUnit(10_000_000_000)).toBe('milliseconds'); // 11桁
  });
});

describe('parseTimestampInput', () => {
  it('整数文字列をパースできる', () => {
    expect(parseTimestampInput('1700000000')).toBe(1_700_000_000);
    expect(parseTimestampInput('-100')).toBe(-100);
    expect(parseTimestampInput('  42  ')).toBe(42);
  });

  it('不正な形式はnullを返す', () => {
    expect(parseTimestampInput('')).toBeNull();
    expect(parseTimestampInput('abc')).toBeNull();
    expect(parseTimestampInput('1.5')).toBeNull();
    expect(parseTimestampInput('1700000000abc')).toBeNull();
  });
});

describe('timestampToDate', () => {
  it('秒からDateに変換できる', () => {
    const date = timestampToDate(0, 'seconds');
    expect(date?.getTime()).toBe(0);
  });

  it('ミリ秒からDateに変換できる', () => {
    const date = timestampToDate(1_700_000_000_000, 'milliseconds');
    expect(date?.getTime()).toBe(1_700_000_000_000);
  });
});

describe('dateToTimestamp', () => {
  it('Dateから秒・ミリ秒を求められる', () => {
    const date = new Date(1_700_000_000_123);
    expect(dateToTimestamp(date)).toEqual({
      seconds: 1_700_000_000,
      milliseconds: 1_700_000_000_123,
    });
  });
});

describe('formatDateTimeLocalValue / parseDateTimeLocalValue', () => {
  it('往復変換で一致する', () => {
    const date = new Date(2024, 0, 5, 9, 3, 7);
    const formatted = formatDateTimeLocalValue(date);
    expect(formatted).toBe('2024-01-05T09:03:07');
    expect(parseDateTimeLocalValue(formatted)?.getTime()).toBe(date.getTime());
  });

  it('秒を省略した形式もパースできる', () => {
    const parsed = parseDateTimeLocalValue('2024-01-05T09:03');
    expect(parsed).toEqual(new Date(2024, 0, 5, 9, 3, 0));
  });

  it('不正な形式はnullを返す', () => {
    expect(parseDateTimeLocalValue('not-a-date')).toBeNull();
  });
});
