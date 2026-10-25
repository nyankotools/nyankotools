import { describe, expect, it } from 'vitest';
import {
  getWeekInfo,
  getWeekRange,
  getWeekday,
  isValidDate,
  weeksInIsoYear,
} from './week-number-calculator';

describe('getWeekInfo: 年末年始の境界', () => {
  it('2020-12-31 は 2020-W53', () => {
    const r = getWeekInfo(2020, 12, 31)!;
    expect([r.isoYear, r.week, r.isoWeekday]).toEqual([2020, 53, 4]);
  });

  it('2021-01-01 は 2020-W53（金曜）', () => {
    const r = getWeekInfo(2021, 1, 1)!;
    expect([r.isoYear, r.week, r.isoWeekday]).toEqual([2020, 53, 5]);
  });

  it('2021-01-04 は 2021-W01', () => {
    const r = getWeekInfo(2021, 1, 4)!;
    expect([r.isoYear, r.week]).toEqual([2021, 1]);
  });

  it('2024-12-30 は 2025-W01', () => {
    const r = getWeekInfo(2024, 12, 30)!;
    expect([r.isoYear, r.week]).toEqual([2025, 1]);
    expect(r.weekStart).toEqual({ year: 2024, month: 12, day: 30 });
    expect(r.weekEnd).toEqual({ year: 2025, month: 1, day: 5 });
  });

  it('2024-12-29 は 2024-W52', () => {
    const r = getWeekInfo(2024, 12, 29)!;
    expect([r.isoYear, r.week]).toEqual([2024, 52]);
  });

  it('2016-01-01 は 2015-W53、2012-01-01 は 2011-W52', () => {
    expect(getWeekInfo(2016, 1, 1)).toMatchObject({ isoYear: 2015, week: 53 });
    expect(getWeekInfo(2012, 1, 1)).toMatchObject({ isoYear: 2011, week: 52 });
  });

  it('2026-01-01（木曜）は 2026-W01、NaN の日付は null', () => {
    expect(getWeekInfo(2026, 1, 1)).toMatchObject({
      isoYear: 2026,
      week: 1,
      isoWeekday: 4,
    });
    expect(getWeekInfo(Number.NaN, 1, 1)).toBeNull();
    expect(getWeekday(2025, Number.NaN, 1)).toBeNull();
  });

  it('2026-10-25（日曜）は W43', () => {
    const r = getWeekInfo(2026, 10, 25)!;
    expect([r.isoYear, r.week, r.isoWeekday, r.weekday]).toEqual([
      2026, 43, 7, 0,
    ]);
  });
});

describe('getWeekInfo: 年内の情報', () => {
  it('年の何日目・残り日数（うるう年）', () => {
    const r = getWeekInfo(2024, 12, 31)!;
    expect(r.dayOfYear).toBe(366);
    expect(r.daysRemaining).toBe(0);
    expect(r.daysInYear).toBe(366);
    expect(getWeekInfo(2024, 3, 1)!.dayOfYear).toBe(61);
    expect(getWeekInfo(2023, 3, 1)!.dayOfYear).toBe(60);
  });

  it('1月1日は1日目', () => {
    const r = getWeekInfo(2025, 1, 1)!;
    expect(r.dayOfYear).toBe(1);
    expect(r.daysRemaining).toBe(364);
  });

  it('四半期', () => {
    expect(getWeekInfo(2025, 3, 31)!.quarter).toBe(1);
    expect(getWeekInfo(2025, 4, 1)!.quarter).toBe(2);
    expect(getWeekInfo(2025, 9, 30)!.quarter).toBe(3);
    expect(getWeekInfo(2025, 12, 1)!.quarter).toBe(4);
  });

  it('不正な日付は null', () => {
    expect(getWeekInfo(2023, 2, 29)).toBeNull();
    expect(getWeekInfo(2025, 13, 1)).toBeNull();
    expect(getWeekInfo(0, 1, 1)).toBeNull();
    expect(getWeekInfo(10000, 1, 1)).toBeNull();
    expect(getWeekInfo(2025, 1.5, 1)).toBeNull();
  });

  it('範囲の端（0001-01-01 は月曜 W01、9999-12-31 は金曜 W52）', () => {
    expect(getWeekInfo(1, 1, 1)).toMatchObject({
      isoYear: 1,
      week: 1,
      weekday: 1,
    });
    expect(getWeekInfo(9999, 12, 31)).toMatchObject({
      isoYear: 9999,
      week: 52,
      weekday: 5,
    });
  });
});

describe('getWeekday / isValidDate', () => {
  it('曜日', () => {
    expect(getWeekday(2000, 1, 1)).toBe(6);
    expect(getWeekday(1970, 1, 1)).toBe(4);
    expect(getWeekday(2023, 2, 30)).toBeNull();
  });

  it('うるう年判定', () => {
    expect(isValidDate(1900, 2, 29)).toBe(false);
    expect(isValidDate(2000, 2, 29)).toBe(true);
  });
});

describe('weeksInIsoYear', () => {
  it('53週の年と52週の年', () => {
    expect(weeksInIsoYear(2020)).toBe(53);
    expect(weeksInIsoYear(2015)).toBe(53);
    expect(weeksInIsoYear(2026)).toBe(53);
    expect(weeksInIsoYear(2024)).toBe(52);
    expect(weeksInIsoYear(2025)).toBe(52);
  });
});

describe('getWeekRange', () => {
  it('2025-W01 は 2024-12-30〜2025-01-05', () => {
    expect(getWeekRange(2025, 1)).toEqual({
      start: { year: 2024, month: 12, day: 30 },
      end: { year: 2025, month: 1, day: 5 },
    });
  });

  it('2020-W53 は 2020-12-28〜2021-01-03', () => {
    expect(getWeekRange(2020, 53)).toEqual({
      start: { year: 2020, month: 12, day: 28 },
      end: { year: 2021, month: 1, day: 3 },
    });
  });

  it('存在しない週番号は null', () => {
    expect(getWeekRange(2024, 53)).toBeNull();
    expect(getWeekRange(2024, 0)).toBeNull();
    expect(getWeekRange(2024, 1.5)).toBeNull();
  });

  it('西暦の範囲外になる週は null', () => {
    expect(getWeekRange(9999, 52)).toBeNull();
    expect(getWeekRange(0, 1)).toBeNull();
  });

  it('順引きと逆引きが一致する', () => {
    for (const [y, m, d] of [
      [2021, 1, 1],
      [2024, 12, 30],
      [2026, 10, 25],
      [2015, 12, 31],
    ]) {
      const info = getWeekInfo(y, m, d)!;
      const range = getWeekRange(info.isoYear, info.week)!;
      expect(range.start).toEqual(info.weekStart);
      expect(range.end).toEqual(info.weekEnd);
    }
  });
});
