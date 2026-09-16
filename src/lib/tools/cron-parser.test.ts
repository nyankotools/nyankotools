import { describe, expect, it } from 'vitest';
import {
  cronMatchesDate,
  getNextRunTimes,
  parseCronExpression,
  parseFieldItems,
} from './cron-parser';

describe('parseFieldItems', () => {
  it('*は範囲全体になる', () => {
    expect(parseFieldItems('*', 0, 59)).toEqual([
      { isWildcard: true, start: 0, end: 59, step: undefined },
    ]);
  });

  it('単一値・範囲・ステップをパースできる', () => {
    expect(parseFieldItems('5', 0, 59)).toEqual([
      { isWildcard: false, start: 5, end: 5, step: undefined },
    ]);
    expect(parseFieldItems('1-5', 0, 59)).toEqual([
      { isWildcard: false, start: 1, end: 5, step: undefined },
    ]);
    expect(parseFieldItems('*/15', 0, 59)).toEqual([
      { isWildcard: true, start: 0, end: 59, step: 15 },
    ]);
    expect(parseFieldItems('10-20/5', 0, 59)).toEqual([
      { isWildcard: false, start: 10, end: 20, step: 5 },
    ]);
    expect(parseFieldItems('5/15', 0, 59)).toEqual([
      { isWildcard: false, start: 5, end: 59, step: 15 },
    ]);
  });

  it('カンマ区切りの複数項目をパースできる', () => {
    expect(parseFieldItems('1,3,5-7', 0, 59)).toEqual([
      { isWildcard: false, start: 1, end: 1, step: undefined },
      { isWildcard: false, start: 3, end: 3, step: undefined },
      { isWildcard: false, start: 5, end: 7, step: undefined },
    ]);
  });

  it('不正な形式や範囲外の値はnullを返す', () => {
    expect(parseFieldItems('', 0, 59)).toBeNull();
    expect(parseFieldItems('abc', 0, 59)).toBeNull();
    expect(parseFieldItems('60', 0, 59)).toBeNull();
    expect(parseFieldItems('5-3', 0, 59)).toBeNull();
    expect(parseFieldItems('1/2/3', 0, 59)).toBeNull();
    expect(parseFieldItems('*/0', 0, 59)).toBeNull();
  });
});

describe('parseCronExpression', () => {
  it('標準的な5フィールドをパースできる', () => {
    const result = parseCronExpression('*/15 9-18 * * 1-5');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect([...result.cron.minute]).toEqual([0, 15, 30, 45]);
    expect(result.cron.dayOfWeekRestricted).toBe(true);
    expect(result.cron.dayOfMonthRestricted).toBe(false);
  });

  it('エイリアスをパースできる', () => {
    const result = parseCronExpression('@daily');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.cron.fields).toEqual({
      minute: '0',
      hour: '0',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*',
    });
  });

  it('曜日の7は0(日曜)として扱う', () => {
    const result = parseCronExpression('0 0 * * 7');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect([...result.cron.dayOfWeek]).toEqual([0]);
  });

  it('フィールド数が5でない場合はエラーになる', () => {
    const result = parseCronExpression('0 0 * *');
    expect(result).toEqual({ ok: false, error: 'field-count' });
  });

  it('空文字はエラーになる', () => {
    expect(parseCronExpression('')).toEqual({ ok: false, error: 'empty' });
  });

  it('範囲外の値はエラーになる', () => {
    expect(parseCronExpression('60 0 * * *')).toEqual({
      ok: false,
      error: 'minute',
    });
    expect(parseCronExpression('0 24 * * *')).toEqual({
      ok: false,
      error: 'hour',
    });
  });
});

describe('cronMatchesDate', () => {
  it('日と曜日が両方指定されている場合はORで判定する', () => {
    const result = parseCronExpression('0 0 1 * 1');
    if (!result.ok) throw new Error('parse failed');
    // 2024-01-01は月曜日 かつ 1日 -> 両方マッチ
    expect(cronMatchesDate(result.cron, new Date(2024, 0, 1, 0, 0))).toBe(true);
    // 2024-01-08は月曜日だが1日ではない -> 曜日側でマッチ
    expect(cronMatchesDate(result.cron, new Date(2024, 0, 8, 0, 0))).toBe(true);
    // 2024-01-02は1日でも月曜日でもない -> マッチしない
    expect(cronMatchesDate(result.cron, new Date(2024, 0, 2, 0, 0))).toBe(
      false,
    );
  });

  it('日・曜日ともに*の場合は常にtrue', () => {
    const result = parseCronExpression('0 0 * * *');
    if (!result.ok) throw new Error('parse failed');
    expect(cronMatchesDate(result.cron, new Date(2024, 5, 15, 0, 0))).toBe(
      true,
    );
  });
});

describe('getNextRunTimes', () => {
  it('毎日0時0分の次回実行を計算できる', () => {
    const result = parseCronExpression('0 0 * * *');
    if (!result.ok) throw new Error('parse failed');
    const from = new Date(2024, 0, 1, 12, 0, 0);
    const runs = getNextRunTimes(result.cron, { count: 3, from });
    expect(runs).toEqual([
      new Date(2024, 0, 2, 0, 0),
      new Date(2024, 0, 3, 0, 0),
      new Date(2024, 0, 4, 0, 0),
    ]);
  });

  it('基準時刻がちょうどマッチする分の場合は含める', () => {
    const result = parseCronExpression('0 * * * *');
    if (!result.ok) throw new Error('parse failed');
    const from = new Date(2024, 0, 1, 12, 0, 0);
    const runs = getNextRunTimes(result.cron, { count: 1, from });
    expect(runs).toEqual([new Date(2024, 0, 1, 12, 0)]);
  });

  it('存在しない日付（2月30日）は指定件数に満たなくても無限ループしない', () => {
    const result = parseCronExpression('0 0 30 2 *');
    if (!result.ok) throw new Error('parse failed');
    const runs = getNextRunTimes(result.cron, {
      count: 3,
      from: new Date(2024, 0, 1),
      maxYears: 1,
    });
    expect(runs).toEqual([]);
  });
});
