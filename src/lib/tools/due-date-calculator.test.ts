import { describe, expect, it } from 'vitest';
import {
  calculateDueDate,
  calculateGestationalAge,
  calculateMilestones,
} from './due-date-calculator';

const d = (year: number, month: number, day: number) => ({
  year,
  month,
  day,
});

describe('calculateDueDate', () => {
  it('最終月経日 + 280日（28日周期）', () => {
    const r = calculateDueDate({ mode: 'lmp', date: d(2023, 1, 1) })!;
    expect(r.dueDate).toEqual(d(2023, 10, 8));
    expect(r.startDate).toEqual(d(2023, 1, 1));
    expect(r.ovulationDate).toEqual(d(2023, 1, 15));
  });

  it('うるう年をまたいでも280日後になる', () => {
    const r = calculateDueDate({ mode: 'lmp', date: d(2024, 1, 1) })!;
    expect(r.dueDate).toEqual(d(2024, 10, 7));
  });

  it('周期35日なら7日後ろにずれる', () => {
    const r = calculateDueDate({
      mode: 'lmp',
      date: d(2023, 1, 1),
      cycleLength: 35,
    })!;
    expect(r.dueDate).toEqual(d(2023, 10, 15));
    expect(r.startDate).toEqual(d(2023, 1, 8));
  });

  it('周期24日なら4日前にずれる', () => {
    const r = calculateDueDate({
      mode: 'lmp',
      date: d(2023, 1, 1),
      cycleLength: 24,
    })!;
    expect(r.dueDate).toEqual(d(2023, 10, 4));
  });

  it('排卵日 + 266日', () => {
    const r = calculateDueDate({ mode: 'ovulation', date: d(2023, 1, 15) })!;
    expect(r.dueDate).toEqual(d(2023, 10, 8));
    expect(r.startDate).toEqual(d(2023, 1, 1));
  });

  it('分娩予定日から逆算して妊娠0週0日を求める', () => {
    const r = calculateDueDate({ mode: 'due', date: d(2023, 10, 8) })!;
    expect(r.dueDate).toEqual(d(2023, 10, 8));
    expect(r.startDate).toEqual(d(2023, 1, 1));
    expect(r.dueWeekday).toBe(0); // 2023-10-08 は日曜日
  });

  it('周期は lmp 以外では無視される', () => {
    const r = calculateDueDate({
      mode: 'due',
      date: d(2023, 10, 8),
      cycleLength: 99,
    });
    expect(r).not.toBeNull();
  });

  it('不正な日付・範囲外・周期範囲外は null', () => {
    expect(calculateDueDate({ mode: 'lmp', date: d(2023, 2, 30) })).toBeNull();
    expect(calculateDueDate({ mode: 'lmp', date: d(1800, 1, 1) })).toBeNull();
    expect(
      calculateDueDate({ mode: 'lmp', date: d(2023, 1, 1), cycleLength: 10 }),
    ).toBeNull();
    expect(
      calculateDueDate({ mode: 'lmp', date: d(2023, 1, 1), cycleLength: 28.5 }),
    ).toBeNull();
  });
});

describe('calculateGestationalAge', () => {
  const r = calculateDueDate({ mode: 'lmp', date: d(2023, 1, 1) })!;

  it('起点当日は0週0日・1ヶ月目', () => {
    const g = calculateGestationalAge(r, d(2023, 1, 1))!;
    expect(g).toMatchObject({
      weeks: 0,
      days: 0,
      month: 1,
      status: 'ongoing',
      daysToDue: 280,
    });
  });

  it('週数と日数に分解される', () => {
    const g = calculateGestationalAge(r, d(2023, 3, 5))!; // 63日目
    expect(g.totalDays).toBe(63);
    expect(g.weeks).toBe(9);
    expect(g.days).toBe(0);
    expect(g.month).toBe(3);
  });

  it('予定日当日は40週0日・10ヶ月で残り0日', () => {
    const g = calculateGestationalAge(r, d(2023, 10, 8))!;
    expect(g).toMatchObject({ weeks: 40, days: 0, month: 10, daysToDue: 0 });
  });

  it('42週以降は overdue、予定日超過は daysToDue が負', () => {
    const g = calculateGestationalAge(r, d(2023, 10, 22))!; // 294日目
    expect(g.status).toBe('overdue');
    expect(g.weeks).toBe(42);
    expect(g.daysToDue).toBe(-14);
  });

  it('起点より前は beforeStart', () => {
    const g = calculateGestationalAge(r, d(2022, 12, 31))!;
    expect(g.status).toBe('beforeStart');
    expect(g.totalDays).toBe(-1);
    expect(g.weeks).toBe(0);
  });

  it('基準日が不正なら null', () => {
    expect(calculateGestationalAge(r, d(2023, 2, 30))).toBeNull();
  });
});

describe('calculateMilestones', () => {
  const r = calculateDueDate({ mode: 'lmp', date: d(2023, 1, 1) })!;
  const list = calculateMilestones(r, d(2023, 1, 1));

  it('週数順に8件', () => {
    expect(list.map((m) => m.week)).toEqual([4, 12, 16, 22, 28, 37, 40, 42]);
  });

  it('40週の節目は予定日と一致する', () => {
    const w40 = list.find((m) => m.key === 'week40')!;
    expect(w40.date).toEqual(r.dueDate);
    expect(w40.daysFromReference).toBe(280);
  });

  it('過ぎた節目は負の日数になる', () => {
    const later = calculateMilestones(r, d(2023, 5, 1));
    const w16 = later.find((m) => m.key === 'week16')!; // 112日目 = 4/23
    expect(w16.date).toEqual(d(2023, 4, 23));
    expect(w16.daysFromReference).toBe(-8);
  });
});

describe('境界値', () => {
  it('周期は21日・45日（上下限）を受け付ける', () => {
    const short = calculateDueDate({
      mode: 'lmp',
      date: d(2023, 1, 1),
      cycleLength: 21,
    })!;
    expect(short.startDate).toEqual(d(2022, 12, 25));
    expect(short.dueDate).toEqual(d(2023, 10, 1));
    const long = calculateDueDate({
      mode: 'lmp',
      date: d(2023, 1, 1),
      cycleLength: 45,
    })!;
    expect(long.startDate).toEqual(d(2023, 1, 18));
    expect(long.dueDate).toEqual(d(2023, 10, 25));
  });

  it('41週6日は ongoing、42週0日から overdue', () => {
    const r = calculateDueDate({ mode: 'lmp', date: d(2023, 1, 1) })!;
    const before = calculateGestationalAge(r, d(2023, 10, 21))!; // 293日目
    expect(before).toMatchObject({ weeks: 41, days: 6, status: 'ongoing' });
    const at42 = calculateGestationalAge(r, d(2023, 10, 22))!;
    expect(at42).toMatchObject({ weeks: 42, days: 0, status: 'overdue' });
  });

  it('39週0日は妊娠10ヶ月（月数は10で頭打ち）', () => {
    const r = calculateDueDate({ mode: 'lmp', date: d(2023, 1, 1) })!;
    const g = calculateGestationalAge(r, d(2023, 10, 1))!;
    expect(g).toMatchObject({ weeks: 39, days: 0, month: 10, daysToDue: 7 });
  });
});
