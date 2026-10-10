import { describe, it, expect } from 'vitest';
import {
  buildMonth,
  buildYear,
  dayOfWeek,
  daysInMonth,
  isValidYear,
  isoWeekNumber,
  MAX_YEAR,
  MIN_YEAR,
  weekdayOrder,
} from './calendar-generator';

const sun = { weekStart: 0 as const, holidays: false };
const mon = { weekStart: 1 as const, holidays: false };

describe('dayOfWeek / daysInMonth', () => {
  it('既知の日付の曜日', () => {
    expect(dayOfWeek(2026, 10, 10)).toBe(6); // 土
    expect(dayOfWeek(2000, 1, 1)).toBe(6);
    expect(dayOfWeek(1900, 1, 1)).toBe(1);
    expect(dayOfWeek(2024, 2, 29)).toBe(4);
  });
  it('うるう年の2月', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2100, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(daysInMonth(2026, 4)).toBe(30);
  });
});

describe('isoWeekNumber', () => {
  it('年またぎ・53週の年', () => {
    expect(isoWeekNumber(2026, 1, 1)).toBe(1);
    expect(isoWeekNumber(2021, 1, 1)).toBe(53);
    expect(isoWeekNumber(2020, 12, 31)).toBe(53);
    expect(isoWeekNumber(2024, 12, 30)).toBe(1);
    expect(isoWeekNumber(2026, 10, 10)).toBe(41);
  });
});

describe('buildMonth', () => {
  it('範囲外は null', () => {
    expect(buildMonth(1899, 1, sun)).toBeNull();
    expect(buildMonth(2026, 13, sun)).toBeNull();
    expect(buildMonth(2026, 0, sun)).toBeNull();
  });

  it('2026年10月（日曜始まり）: 1日は木曜で5週', () => {
    const m = buildMonth(2026, 10, sun)!;
    expect(m.weeks).toHaveLength(5);
    expect(m.weeks[0].days.map((d) => d?.day ?? null)).toEqual([
      null,
      null,
      null,
      null,
      1,
      2,
      3,
    ]);
    expect(m.weeks[4].days.map((d) => d?.day ?? null)).toEqual([
      25, 26, 27, 28, 29, 30, 31,
    ]);
  });

  it('月曜始まりだと先頭の空きが変わる', () => {
    const m = buildMonth(2026, 10, mon)!;
    expect(m.weeks[0].days.map((d) => d?.day ?? null)).toEqual([
      null,
      null,
      null,
      1,
      2,
      3,
      4,
    ]);
  });

  it('週番号は月曜始まり・日曜始まりで日曜を前の週にそろえる', () => {
    const m = buildMonth(2026, 10, mon)!;
    expect(m.weeks.map((w) => w.weekNumber)).toEqual([40, 41, 42, 43, 44]);
    const s = buildMonth(2026, 10, sun)!;
    // 日曜(4日)を含む行は、月〜土(5〜10日)の第41週ではなく木曜までの40週に揃える
    expect(s.weeks.map((w) => w.weekNumber)).toEqual([40, 41, 42, 43, 44]);
  });

  it('日付が全て1回ずつ入る', () => {
    const m = buildMonth(2024, 2, sun)!;
    const days = m.weeks.flatMap((w) => w.days).filter((d) => d !== null);
    expect(days.map((d) => d!.day)).toEqual(
      Array.from({ length: 29 }, (_, i) => i + 1),
    );
  });

  it('祝日: オンなら付き、オフなら付かない', () => {
    const on = buildMonth(2026, 5, { weekStart: 0, holidays: true })!;
    expect(on.holidays.map((h) => `${h.iso} ${h.holiday}`)).toEqual([
      '2026-05-03 constitution',
      '2026-05-04 greenery',
      '2026-05-05 children',
      '2026-05-06 substitute',
    ]);
    const off = buildMonth(2026, 5, sun)!;
    expect(off.holidays).toEqual([]);
  });

  it('祝日の対応範囲外の年でも作れる（祝日なし）', () => {
    const m = buildMonth(1950, 1, { weekStart: 0, holidays: true })!;
    expect(m.holidays).toEqual([]);
    expect(m.weeks.length).toBeGreaterThan(0);
  });

  it('日曜始まりで月末が日曜の場合、最終行は日曜のみ', () => {
    const m = buildMonth(2026, 5, sun)!; // 5/31は日曜
    const last = m.weeks[m.weeks.length - 1];
    expect(last.days[0]?.day).toBe(31);
    expect(last.days.slice(1).every((d) => d === null)).toBe(true);
    expect(last.weekNumber).toBe(22);
  });
});

describe('buildYear / weekdayOrder', () => {
  it('12か月を返す', () => {
    expect(buildYear(2026, sun)).toHaveLength(12);
    expect(buildYear(3000, sun)).toBeNull();
  });
  it('曜日の並び', () => {
    expect(weekdayOrder(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(weekdayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
  });
});

describe('年の範囲（1900〜2100）', () => {
  it('境界の年は有効、前後と非整数は無効', () => {
    expect(isValidYear(MIN_YEAR)).toBe(true);
    expect(isValidYear(MAX_YEAR)).toBe(true);
    expect(isValidYear(MIN_YEAR - 1)).toBe(false);
    expect(isValidYear(MAX_YEAR + 1)).toBe(false);
    expect(isValidYear(2026.5)).toBe(false);
    expect(isValidYear(NaN)).toBe(false);
  });

  it('範囲外の年は月間・年間とも null、境界の年は作れる', () => {
    expect(buildMonth(MIN_YEAR - 1, 1, sun)).toBeNull();
    expect(buildMonth(MAX_YEAR + 1, 1, sun)).toBeNull();
    expect(buildYear(MIN_YEAR - 1, sun)).toBeNull();
    expect(buildYear(MAX_YEAR + 1, sun)).toBeNull();
    expect(buildYear(MIN_YEAR, sun)).toHaveLength(12);
    expect(buildYear(MAX_YEAR, sun)).toHaveLength(12);
  });
});

describe('暦計算の総当たり（1900〜2100年の全日）', () => {
  it('曜日・月の日数・ISO週番号が Date による計算と一致する', () => {
    const DAY = 86400000;
    // 参照実装: 木曜日を求めて、その年の1/1からの週数で数える（ISO 8601の定義どおり）
    const isoRef = (d: Date) => {
      const isoDow = d.getUTCDay() || 7;
      const thu = new Date(d.getTime() + (4 - isoDow) * DAY);
      const isoYear = thu.getUTCFullYear();
      return (
        Math.floor((thu.getTime() - Date.UTC(isoYear, 0, 1)) / DAY / 7) + 1
      );
    };
    const mismatches: string[] = [];
    for (
      let t = Date.UTC(MIN_YEAR, 0, 1);
      t <= Date.UTC(MAX_YEAR, 11, 31);
      t += DAY
    ) {
      const d = new Date(t);
      const y = d.getUTCFullYear();
      const m = d.getUTCMonth() + 1;
      const day = d.getUTCDate();
      if (dayOfWeek(y, m, day) !== d.getUTCDay())
        mismatches.push(`dow ${y}-${m}-${day}`);
      if (isoWeekNumber(y, m, day) !== isoRef(d))
        mismatches.push(`week ${y}-${m}-${day}`);
    }
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
      for (let m = 1; m <= 12; m++) {
        const ref = new Date(Date.UTC(y, m, 0)).getUTCDate();
        if (daysInMonth(y, m) !== ref) mismatches.push(`days ${y}-${m}`);
      }
    }
    expect(mismatches.slice(0, 10)).toEqual([]);
  });

  it('どの年月・週始まりでも各日は正しい列に入り、行は7列、日数は一致する', () => {
    for (const year of [1900, 2000, 2024, 2026, 2100]) {
      for (let month = 1; month <= 12; month++) {
        for (const weekStart of [0, 1] as const) {
          const order = weekdayOrder(weekStart);
          const m = buildMonth(year, month, { weekStart, holidays: false })!;
          let count = 0;
          for (const w of m.weeks) {
            expect(w.days).toHaveLength(7);
            w.days.forEach((c, col) => {
              if (!c) return;
              count++;
              expect(c.dow).toBe(order[col]);
            });
          }
          expect(count).toBe(daysInMonth(year, month));
        }
      }
    }
  });
});

describe('週番号・行数の境界', () => {
  it('年またぎ: 2027年1月（1/1は金曜）の第1行は前年の第53週', () => {
    expect(buildMonth(2027, 1, mon)!.weeks[0].weekNumber).toBe(53);
    expect(buildMonth(2027, 1, sun)!.weeks[0].weekNumber).toBe(53);
  });

  it('2026年1月（1/1は木曜）は日曜始まりでも第1週', () => {
    expect(buildMonth(2026, 1, sun)!.weeks[0].weekNumber).toBe(1);
  });

  it('2026年2月（2/1は日曜）: 日曜始まりの第1行は月〜土(2〜7日)の属する第6週、月曜始まりでは日曜だけの行が第5週', () => {
    const s = buildMonth(2026, 2, sun)!;
    expect(s.weeks[0].days.map((d) => d?.day ?? null)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(s.weeks[0].weekNumber).toBe(6);
    const m = buildMonth(2026, 2, mon)!;
    expect(m.weeks[0].days.map((d) => d?.day ?? null)).toEqual([
      null,
      null,
      null,
      null,
      null,
      null,
      1,
    ]);
    expect(m.weeks[0].weekNumber).toBe(5);
  });

  it('行数: 2026年8月は日曜始まり・月曜始まりとも6行', () => {
    expect(buildMonth(2026, 8, sun)!.weeks).toHaveLength(6);
    expect(buildMonth(2026, 8, mon)!.weeks).toHaveLength(6);
  });

  it('月曜1日（2026年6月）の月曜始まりは先頭列が1日', () => {
    expect(buildMonth(2026, 6, mon)!.weeks[0].days[0]?.day).toBe(1);
  });
});

describe('祝日の配置', () => {
  it('2026年10月の祝日はスポーツの日（10/12）のみ、該当セルにも印が付く', () => {
    const m = buildMonth(2026, 10, { weekStart: 0, holidays: true })!;
    expect(m.holidays.map((h) => [h.iso, h.holiday])).toEqual([
      ['2026-10-12', 'sports'],
    ]);
    const cells = m.weeks.flatMap((w) => w.days).filter((c) => c !== null);
    expect(cells.filter((c) => c!.holiday !== null).map((c) => c!.iso)).toEqual(
      ['2026-10-12'],
    );
  });

  it('祝日オフでは全セルの holiday が null', () => {
    const m = buildMonth(2026, 5, sun)!;
    expect(
      m.weeks
        .flatMap((w) => w.days)
        .every((c) => c === null || c.holiday === null),
    ).toBe(true);
  });

  it('2000〜2099年は祝日が付く（2000年1月の元日）、2100年は範囲外で祝日なし', () => {
    const jan2000 = buildMonth(2000, 1, { weekStart: 0, holidays: true })!;
    expect(jan2000.holidays.some((h) => h.iso === '2000-01-01')).toBe(true);
    expect(
      buildMonth(2100, 1, { weekStart: 0, holidays: true })!.holidays,
    ).toEqual([]);
  });

  it('2026年の年間の祝日は振替休日・国民の休日を含めて18日', () => {
    const year = buildYear(2026, { weekStart: 0, holidays: true })!;
    const total = year.reduce((n, m) => n + m.holidays.length, 0);
    expect(total).toBe(18);
  });
});
