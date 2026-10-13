import { describe, expect, it } from 'vitest';
import {
  buildMilestones,
  countdownTo,
  dayMilestone,
  daysInMonth,
  elapsedSince,
  findNextMilestone,
  formatISODate,
  monthMilestone,
  parseISODate,
  yearMilestone,
} from './anniversary-calculator';

const d = (year: number, month: number, day: number) => ({ year, month, day });

describe('parseISODate / formatISODate', () => {
  it('正しい日付を解析する', () => {
    expect(parseISODate('2024-02-29')).toEqual(d(2024, 2, 29));
  });
  it('存在しない日付・形式違い・空文字は null', () => {
    expect(parseISODate('2023-02-29')).toBeNull();
    expect(parseISODate('2024-13-01')).toBeNull();
    expect(parseISODate('2024/01/01')).toBeNull();
    expect(parseISODate('')).toBeNull();
    expect(parseISODate('0000-01-01')).toBeNull();
  });
  it('0埋めして整形する', () => {
    expect(formatISODate(d(5, 3, 9))).toBe('0005-03-09');
  });
});

describe('daysInMonth', () => {
  it('うるう年の2月は29日', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2100, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 12)).toBe(31);
  });
});

describe('dayMilestone', () => {
  it('初日を含めない場合は起点日 + N日', () => {
    expect(dayMilestone(d(2024, 1, 1), 100, false)).toEqual(d(2024, 4, 10));
  });
  it('初日を含める場合は起点日が1日目', () => {
    expect(dayMilestone(d(2024, 1, 1), 100, true)).toEqual(d(2024, 4, 9));
    expect(dayMilestone(d(2024, 1, 1), 1, true)).toEqual(d(2024, 1, 1));
  });
  it('年をまたぐ', () => {
    expect(dayMilestone(d(2025, 12, 31), 1, false)).toEqual(d(2026, 1, 1));
  });
  it('不正な N と範囲外は null', () => {
    expect(dayMilestone(d(2024, 1, 1), 0, false)).toBeNull();
    expect(dayMilestone(d(2024, 1, 1), 1.5, false)).toBeNull();
    expect(dayMilestone(d(9999, 12, 31), 1, false)).toBeNull();
  });
});

describe('monthMilestone', () => {
  it('月末日を丸める（1/31の1か月後）', () => {
    expect(monthMilestone(d(2025, 1, 31), 1)).toEqual(d(2025, 2, 28));
    expect(monthMilestone(d(2024, 1, 31), 1)).toEqual(d(2024, 2, 29));
  });
  it('起点日から丸めた値を連鎖させず、常に起点の日で計算する', () => {
    expect(monthMilestone(d(2025, 1, 31), 2)).toEqual(d(2025, 3, 31));
  });
  it('年をまたぐ・12か月は同月同日', () => {
    expect(monthMilestone(d(2025, 11, 15), 3)).toEqual(d(2026, 2, 15));
    expect(monthMilestone(d(2025, 12, 15), 1)).toEqual(d(2026, 1, 15));
    expect(monthMilestone(d(2025, 6, 10), 12)).toEqual(d(2026, 6, 10));
  });
  it('範囲外・不正は null', () => {
    expect(monthMilestone(d(9999, 12, 1), 1)).toBeNull();
    expect(monthMilestone(d(2025, 1, 1), 0)).toBeNull();
  });
});

describe('yearMilestone', () => {
  it('通常は同じ月日', () => {
    expect(yearMilestone(d(2020, 5, 17), 5)).toEqual(d(2025, 5, 17));
  });
  it('2/29起点で平年になる場合は既定で2/28', () => {
    expect(yearMilestone(d(2024, 2, 29), 1)).toEqual(d(2025, 2, 28));
  });
  it('2/29起点で平年になる場合は3/1を選べる', () => {
    expect(yearMilestone(d(2024, 2, 29), 1, 'mar1')).toEqual(d(2025, 3, 1));
  });
  it('2/29起点でもうるう年なら2/29', () => {
    expect(yearMilestone(d(2024, 2, 29), 4)).toEqual(d(2028, 2, 29));
    expect(yearMilestone(d(2024, 2, 29), 4, 'mar1')).toEqual(d(2028, 2, 29));
  });
  it('100年は平年（2100年）、400年はうるう年', () => {
    expect(yearMilestone(d(2000, 2, 29), 100)).toEqual(d(2100, 2, 28));
    expect(yearMilestone(d(2000, 2, 29), 400)).toEqual(d(2400, 2, 29));
  });
  it('2/29以外では mar1 でも影響しない', () => {
    expect(yearMilestone(d(2024, 2, 28), 1, 'mar1')).toEqual(d(2025, 2, 28));
  });
  it('範囲外は null', () => {
    expect(yearMilestone(d(2000, 1, 1), 8000)).toBeNull();
  });
});

describe('buildMilestones', () => {
  const opts = { inclusive: false, leapDayPolicy: 'feb28' as const };

  it('日数記念日の日付・曜日・基準日からの日数を返す', () => {
    const list = buildMilestones(
      'days',
      d(2026, 1, 1),
      d(2026, 4, 1),
      opts,
      [100],
    );
    expect(list).toEqual([
      {
        n: 100,
        date: d(2026, 4, 11),
        weekday: 6, // 2026-04-11 は土曜
        daysFromBase: 10,
      },
    ]);
  });
  it('過去の記念日は負の daysFromBase', () => {
    const list = buildMilestones(
      'days',
      d(2026, 1, 1),
      d(2026, 12, 31),
      opts,
      [100],
    );
    expect(list[0].daysFromBase).toBe(-264);
  });
  it('既定の日数一覧は100日・1000日を含む', () => {
    const list = buildMilestones('days', d(2026, 1, 1), d(2026, 1, 1), opts);
    const ns = list.map((m) => m.n);
    expect(ns).toContain(100);
    expect(ns).toContain(1000);
    expect(ns).toContain(10000);
  });
  it('既定の年一覧は1〜50で、範囲外は除外される', () => {
    const list = buildMilestones('years', d(2026, 1, 1), d(2026, 1, 1), opts);
    expect(list).toHaveLength(50);
    const late = buildMilestones('years', d(9990, 1, 1), d(9990, 1, 1), opts);
    expect(late.map((m) => m.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it('不正な起点日・基準日は空配列', () => {
    expect(
      buildMilestones('days', d(2026, 2, 30), d(2026, 1, 1), opts),
    ).toEqual([]);
    expect(
      buildMilestones('days', d(2026, 1, 1), d(2026, 13, 1), opts),
    ).toEqual([]);
  });
});

describe('findNextMilestone', () => {
  it('基準日当日を含めて最も近い未来の記念日を返す', () => {
    const base = d(2026, 1, 11);
    const list = buildMilestones('days', d(2026, 1, 1), base, {
      inclusive: false,
      leapDayPolicy: 'feb28',
    });
    // 50日後 = 2/20 が最初。基準日当日が記念日になるケースは別途
    expect(findNextMilestone(list)?.n).toBe(50);
    const todayList = buildMilestones(
      'days',
      d(2026, 1, 1),
      d(2026, 4, 11),
      { inclusive: false, leapDayPolicy: 'feb28' },
      [50, 100, 200],
    );
    expect(findNextMilestone(todayList)).toMatchObject({
      n: 100,
      daysFromBase: 0,
    });
  });
  it('すべて過去なら null', () => {
    const list = buildMilestones(
      'days',
      d(2020, 1, 1),
      d(2026, 1, 1),
      { inclusive: false, leapDayPolicy: 'feb28' },
      [100, 200],
    );
    expect(findNextMilestone(list)).toBeNull();
  });
});

describe('elapsedSince', () => {
  it('起点日当日は 0日・1日目', () => {
    expect(elapsedSince(d(2026, 1, 1), d(2026, 1, 1))).toEqual({
      days: 0,
      dayNumber: 1,
    });
  });
  it('経過日数と日目', () => {
    expect(elapsedSince(d(2026, 1, 1), d(2026, 4, 11))).toEqual({
      days: 100,
      dayNumber: 101,
    });
  });
  it('基準日が起点日より前なら日目は null', () => {
    expect(elapsedSince(d(2026, 1, 10), d(2026, 1, 1))).toEqual({
      days: -9,
      dayNumber: null,
    });
  });
  it('不正な日付は null', () => {
    expect(elapsedSince(d(2026, 2, 31), d(2026, 1, 1))).toBeNull();
  });
});

describe('countdownTo', () => {
  it('未来・当日・過去', () => {
    expect(countdownTo(d(2026, 10, 13), d(2026, 12, 25))).toEqual({
      days: 73,
      weekday: 5, // 2026-12-25 は金曜
    });
    expect(countdownTo(d(2026, 10, 13), d(2026, 10, 13))?.days).toBe(0);
    expect(countdownTo(d(2026, 10, 13), d(2026, 10, 1))?.days).toBe(-12);
  });
  it('うるう日をまたいでも暦通りに数える', () => {
    expect(countdownTo(d(2027, 12, 31), d(2028, 3, 1))?.days).toBe(61);
  });
  it('不正な日付は null', () => {
    expect(countdownTo(d(2026, 10, 13), d(2026, 2, 30))).toBeNull();
  });
});

describe('buildMilestones（か月単位）', () => {
  const opts = { inclusive: false, leapDayPolicy: 'feb28' as const };

  it('既定のか月一覧は1〜36か月の16件', () => {
    const list = buildMilestones('months', d(2026, 1, 1), d(2026, 1, 1), opts);
    expect(list).toHaveLength(16);
    expect(list.map((m) => m.n)).toContain(36);
  });

  it('1/31起点でも各か月の応当日を起点の日で計算する', () => {
    const list = buildMilestones(
      'months',
      d(2025, 1, 31),
      d(2025, 1, 31),
      opts,
      [1, 2],
    );
    expect(list.map((m) => m.date)).toEqual([d(2025, 2, 28), d(2025, 3, 31)]);
    expect(list[0].daysFromBase).toBe(28);
  });
});
