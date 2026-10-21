import { describe, expect, it } from 'vitest';
import {
  getKigaku,
  getMonthStar,
  getRisshun,
  getStarTable,
  getYearStar,
} from './kyusei-kigaku';

describe('getYearStar', () => {
  it('1984年は七赤、1990年は一白、2000年は九紫、2024年は三碧', () => {
    expect(getYearStar(1984)).toBe(7);
    expect(getYearStar(1990)).toBe(1);
    expect(getYearStar(2000)).toBe(9);
    expect(getYearStar(2024)).toBe(3);
  });
  it('年が進むと星は1つずつ戻り、9年で一巡する', () => {
    expect(getYearStar(1985)).toBe(6);
    expect(getYearStar(1991)).toBe(9);
    expect(getYearStar(1993)).toBe(getYearStar(1984));
  });
});

describe('getMonthStar', () => {
  it('寅月の星は本命星のグループで決まる', () => {
    expect(getMonthStar(3, 1)).toBe(2); // 三碧 → 二黒
    expect(getMonthStar(1, 1)).toBe(8); // 一白 → 八白
    expect(getMonthStar(2, 1)).toBe(5); // 二黒 → 五黄
  });
  it('月が進むと1つずつ戻り、丑月まで一巡して9を超えない', () => {
    expect(getMonthStar(3, 2)).toBe(1);
    expect(getMonthStar(3, 3)).toBe(9);
    expect(getMonthStar(3, 12)).toBe(9);
  });
});

describe('getRisshun', () => {
  it('年による立春の日付', () => {
    expect(getRisshun(2021)).toEqual({ month: 2, day: 3 });
    expect(getRisshun(2022)).toEqual({ month: 2, day: 4 });
    expect(getRisshun(2024)).toEqual({ month: 2, day: 4 });
    expect(getRisshun(2025)).toEqual({ month: 2, day: 3 });
    expect(getRisshun(2026)).toEqual({ month: 2, day: 4 });
  });
  it('対応範囲の全年で2/3〜2/5に収まる', () => {
    for (let y = 1900; y <= 2100; y++) {
      const r = getRisshun(y)!;
      expect(r.month).toBe(2);
      expect(r.day).toBeGreaterThanOrEqual(3);
      expect(r.day).toBeLessThanOrEqual(5);
    }
  });
  it('範囲外は null', () => {
    expect(getRisshun(1899)).toBeNull();
    expect(getRisshun(2101)).toBeNull();
  });
});

describe('getKigaku 立春の境界', () => {
  it('立春前日は前年扱い、立春当日から当年（2024年は2/4）', () => {
    const before = getKigaku({ year: 2024, month: 2, day: 3 })!;
    expect(before.honmei).toBe(4); // 2023年 四緑
    expect(before.beforeRisshun).toBe(true);
    expect(before.starYear).toBe(2023);
    const on = getKigaku({ year: 2024, month: 2, day: 4 })!;
    expect(on.honmei).toBe(3);
    expect(on.beforeRisshun).toBe(false);
    expect(on.isRisshunDay).toBe(true);
  });
  it('立春が2/3の年（2025年）は2/2まで前年扱い', () => {
    expect(getKigaku({ year: 2025, month: 2, day: 2 })!.honmei).toBe(3);
    const on = getKigaku({ year: 2025, month: 2, day: 3 })!;
    expect(on.honmei).toBe(2);
    expect(on.isRisshunDay).toBe(true);
    expect(getKigaku({ year: 2025, month: 2, day: 4 })!.isRisshunDay).toBe(
      false,
    );
  });
  it('1月生まれは前年扱い', () => {
    expect(getKigaku({ year: 1990, month: 1, day: 15 })!.honmei).toBe(2); // 1989年
    expect(getKigaku({ year: 1990, month: 12, day: 31 })!.honmei).toBe(1);
  });
});

describe('getKigaku 月命星', () => {
  it('2024年の寅月（2/4〜）は二黒、卯月は一白', () => {
    expect(getKigaku({ year: 2024, month: 2, day: 4 })!.getsumei).toBe(2);
    expect(getKigaku({ year: 2024, month: 2, day: 4 })!.monthIndex).toBe(1);
    expect(getKigaku({ year: 2024, month: 3, day: 10 })!.getsumei).toBe(1);
  });
  it('節入り（小寒）の前後で月が切り替わる（2025年は1/5）', () => {
    const before = getKigaku({ year: 2025, month: 1, day: 4 })!;
    expect(before.monthIndex).toBe(11);
    expect(before.getsumei).toBe(1);
    expect(before.setsuStart).toBeNull();
    const on = getKigaku({ year: 2025, month: 1, day: 5 })!;
    expect(on.monthIndex).toBe(12);
    expect(on.getsumei).toBe(9);
    expect(on.isSetsuDay).toBe(true);
    expect(on.setsuStart).toEqual({ month: 1, day: 5 });
  });
  it('12月の大雪以降は子月', () => {
    const r = getKigaku({ year: 2024, month: 12, day: 31 })!;
    expect(r.monthIndex).toBe(11);
    expect(r.setsuStart!.month).toBe(12);
  });
  it('月命星は常に1〜9', () => {
    for (let m = 1; m <= 12; m++) {
      const r = getKigaku({ year: 2023, month: m, day: 20 })!;
      expect(r.getsumei).toBeGreaterThanOrEqual(1);
      expect(r.getsumei).toBeLessThanOrEqual(9);
    }
  });
});

describe('getKigaku 入力検証', () => {
  it('実在しない日付・範囲外は null', () => {
    expect(getKigaku({ year: 2023, month: 2, day: 29 })).toBeNull();
    expect(getKigaku({ year: 1899, month: 12, day: 31 })).toBeNull();
    expect(getKigaku({ year: 2101, month: 1, day: 1 })).toBeNull();
    expect(getKigaku({ year: 2000, month: 13, day: 1 })).toBeNull();
  });
  it('対応範囲の端でも計算できる', () => {
    expect(getKigaku({ year: 1900, month: 1, day: 1 })).not.toBeNull();
    expect(getKigaku({ year: 2100, month: 12, day: 31 })).not.toBeNull();
  });
});

describe('getStarTable', () => {
  it('9つの星に年を振り分け、各星は9年おき', () => {
    const rows = getStarTable(1990, 2008);
    expect(rows).toHaveLength(9);
    expect(rows[0].years).toEqual([1990, 1999, 2008]);
    expect(rows.reduce((s, r) => s + r.years.length, 0)).toBe(19);
  });
});
