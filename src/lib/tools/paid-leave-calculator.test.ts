import { describe, expect, it } from 'vitest';
import {
  addMonths,
  addMonthsForGrant,
  calculatePaidLeave,
  classifyWorkPattern,
} from './paid-leave-calculator';

const d = (year: number, month: number, day: number) => ({
  year,
  month,
  day,
});

describe('classifyWorkPattern', () => {
  it('週5日以上は通常付与', () => {
    expect(classifyWorkPattern(5, null)).toBe('full');
    expect(classifyWorkPattern(7, 10)).toBe('full');
  });
  it('週4日以下で週30時間未満は比例付与', () => {
    expect(classifyWorkPattern(4, 29.5)).toBe('proportional');
    expect(classifyWorkPattern(1, null)).toBe('proportional');
  });
  it('週30時間以上なら週4日以下でも通常付与', () => {
    expect(classifyWorkPattern(4, 30)).toBe('full');
  });
  it('範囲外は null', () => {
    expect(classifyWorkPattern(0, null)).toBeNull();
    expect(classifyWorkPattern(8, null)).toBeNull();
    expect(classifyWorkPattern(2.5, null)).toBeNull();
    expect(classifyWorkPattern(3, 0)).toBeNull();
    expect(classifyWorkPattern(3, 200)).toBeNull();
  });
});

describe('addMonths', () => {
  it('月末は移動先の月末に丸める', () => {
    expect(addMonths(d(2023, 8, 31), 6)).toEqual(d(2024, 2, 29));
    expect(addMonths(d(2022, 8, 31), 6)).toEqual(d(2023, 2, 28));
  });
  it('年をまたぐ', () => {
    expect(addMonths(d(2023, 10, 1), 6)).toEqual(d(2024, 4, 1));
    expect(addMonths(d(2023, 4, 1), 18)).toEqual(d(2024, 10, 1));
  });
});

describe('calculatePaidLeave', () => {
  it('通常付与の法定表（10,11,12,14,16,18,20）', () => {
    const r = calculatePaidLeave({
      hireDate: d(2020, 4, 1),
      reference: d(2026, 10, 14),
      daysPerWeek: 5,
      hoursPerWeek: null,
    })!;
    expect(r.category).toBe('full');
    expect(r.grants.map((g) => g.days)).toEqual([
      10, 11, 12, 14, 16, 18, 20, 20,
    ]);
    expect(r.grants[0].grantDate).toEqual(d(2020, 10, 1));
    expect(r.grants[1].grantDate).toEqual(d(2021, 10, 1));
    expect(r.grants[6].grantDate).toEqual(d(2026, 10, 1));
    expect(r.grants.every((g) => g.mustTakeFive)).toBe(true);
  });

  it('比例付与の法定表', () => {
    const table = (daysPerWeek: number) =>
      calculatePaidLeave({
        hireDate: d(2020, 4, 1),
        reference: d(2020, 4, 1),
        daysPerWeek,
        hoursPerWeek: 20,
      })!.grants.map((g) => g.days);
    expect(table(4)).toEqual([7, 8, 9, 10, 12, 13, 15]);
    expect(table(3)).toEqual([5, 6, 6, 8, 9, 10, 11]);
    expect(table(2)).toEqual([3, 4, 4, 5, 6, 6, 7]);
    expect(table(1)).toEqual([1, 2, 2, 2, 3, 3, 3]);
  });

  it('年5日の取得義務は付与10日以上のみ', () => {
    const r = calculatePaidLeave({
      hireDate: d(2020, 4, 1),
      reference: d(2020, 4, 1),
      daysPerWeek: 4,
      hoursPerWeek: null,
    })!;
    expect(r.grants.map((g) => g.mustTakeFive)).toEqual([
      false,
      false,
      false,
      true,
      true,
      true,
      true,
    ]);
  });

  it('基準日時点の current / next と最大保有日数', () => {
    const r = calculatePaidLeave({
      hireDate: d(2020, 4, 1),
      reference: d(2022, 10, 14),
      daysPerWeek: 5,
      hoursPerWeek: null,
    })!;
    // 付与日: 2020-10-01(10), 2021-10-01(11), 2022-10-01(12), 2023-10-01(14)
    expect(r.current?.days).toBe(12);
    expect(r.current?.status).toBe('current');
    expect(r.next?.grantDate).toEqual(d(2023, 10, 1));
    expect(r.grants[0].status).toBe('past');
    // 2020-10-01分は2022-10-01で時効、残るのは11日+12日
    expect(r.maxHeldDays).toBe(23);
  });

  it('入社前の基準日では current が null で最初が next', () => {
    const r = calculatePaidLeave({
      hireDate: d(2026, 12, 1),
      reference: d(2026, 10, 14),
      daysPerWeek: 5,
      hoursPerWeek: null,
    })!;
    expect(r.current).toBeNull();
    expect(r.next?.index).toBe(0);
    expect(r.maxHeldDays).toBe(0);
  });

  it('付与日当日は付与済み、6.5年以降は毎年同じ日数', () => {
    const onDay = calculatePaidLeave({
      hireDate: d(2020, 4, 1),
      reference: d(2020, 10, 1),
      daysPerWeek: 5,
      hoursPerWeek: null,
    })!;
    expect(onDay.current?.index).toBe(0);
    const late = calculatePaidLeave({
      hireDate: d(2010, 4, 1),
      reference: d(2026, 10, 14),
      daysPerWeek: 5,
      hoursPerWeek: null,
    })!;
    // 2025-10 と 2026-10 付与分（各20日）が有効
    expect(late.current?.index).toBe(16);
    expect(late.current?.days).toBe(20);
    expect(late.next?.index).toBe(17);
    expect(late.maxHeldDays).toBe(40);
  });

  it('不正な入力は null', () => {
    const base = {
      hireDate: d(2020, 4, 1),
      reference: d(2026, 10, 14),
      daysPerWeek: 5,
      hoursPerWeek: null,
    };
    expect(
      calculatePaidLeave({ ...base, hireDate: d(2021, 2, 30) }),
    ).toBeNull();
    expect(calculatePaidLeave({ ...base, daysPerWeek: 0 })).toBeNull();
    expect(calculatePaidLeave({ ...base, hireDate: d(1800, 1, 1) })).toBeNull();
    expect(
      calculatePaidLeave({ ...base, reference: d(2026, 2, 30) }),
    ).toBeNull();
  });

  it('時効の境界: 付与日から2年後の同日は消滅済み（その前日までは保有）', () => {
    const at = (reference: ReturnType<typeof d>) =>
      calculatePaidLeave({
        hireDate: d(2020, 4, 1),
        reference,
        daysPerWeek: 5,
        hoursPerWeek: null,
      })!.maxHeldDays;
    // 2020-10-01分(10日)は 2022-10-01 に時効。前日はまだ保有
    expect(at(d(2022, 9, 30))).toBe(21);
    expect(at(d(2022, 10, 1))).toBe(23);
  });

  it('入社日が月末で応当日がない場合、付与日は月末満了の翌日（翌月1日）になる', () => {
    const r = calculatePaidLeave({
      hireDate: d(2023, 8, 31),
      reference: d(2023, 8, 31),
      daysPerWeek: 5,
      hoursPerWeek: null,
    })!;
    expect(r.grants.slice(0, 5).map((g) => g.grantDate)).toEqual([
      d(2024, 3, 1),
      d(2025, 3, 1),
      d(2026, 3, 1),
      d(2027, 3, 1),
      d(2028, 3, 1),
    ]);
  });
});

describe('addMonthsForGrant', () => {
  it('応当日がなければ満了日（月末）の翌日にする', () => {
    expect(addMonthsForGrant(d(2023, 8, 31), 6)).toEqual(d(2024, 3, 1));
    expect(addMonthsForGrant(d(2022, 8, 31), 6)).toEqual(d(2023, 3, 1));
    expect(addMonthsForGrant(d(2023, 3, 31), 6)).toEqual(d(2023, 10, 1));
  });
  it('応当日があればその日', () => {
    expect(addMonthsForGrant(d(2023, 10, 1), 6)).toEqual(d(2024, 4, 1));
    expect(addMonthsForGrant(d(2023, 8, 29), 6)).toEqual(d(2024, 2, 29));
  });
});

describe('勤務時間の境界', () => {
  it('週29.9時間は比例付与、週4日・時間未入力も比例付与', () => {
    expect(classifyWorkPattern(4, 29.9)).toBe('proportional');
    expect(classifyWorkPattern(4, null)).toBe('proportional');
    expect(classifyWorkPattern(5, 168)).toBe('full');
    expect(classifyWorkPattern(4, 168.1)).toBeNull();
  });
});
