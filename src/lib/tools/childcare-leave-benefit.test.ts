import { describe, expect, it } from 'vitest';
import {
  SICK_MAX_PAYMENT_DAYS,
  WAGE_DAILY_LOWER,
  WAGE_DAILY_UPPER,
  calculateChildcareLeave,
  calculateMaternityAllowance,
  calculateSickAllowance,
  clampWageDaily,
  standardDailyFromMonthly,
  wageDailyFromSixMonthTotal,
} from './childcare-leave-benefit';

describe('賃金日額・標準報酬日額', () => {
  it('6か月の賃金総額を180で割り切り捨てる', () => {
    expect(wageDailyFromSixMonthTotal(1_800_000)).toBe(10_000);
    expect(wageDailyFromSixMonthTotal(1_800_179)).toBe(10_000);
  });
  it('上限・下限を適用する', () => {
    expect(clampWageDaily(20_000)).toBe(WAGE_DAILY_UPPER);
    expect(clampWageDaily(1_000)).toBe(WAGE_DAILY_LOWER);
    expect(clampWageDaily(10_000)).toBe(10_000);
  });
  it('標準報酬日額は30で割って10円未満を四捨五入する', () => {
    expect(standardDailyFromMonthly(300_000)).toBe(10_000);
    expect(standardDailyFromMonthly(280_000)).toBe(9_330);
    expect(standardDailyFromMonthly(260_000)).toBe(8_670);
  });
});

describe('calculateChildcareLeave', () => {
  it('月給30万円・180日以内は67%', () => {
    const r = calculateChildcareLeave({
      monthlyWage: 300_000,
      leaveDays: 180,
      birthSupport: false,
    })!;
    expect(r.wageDaily).toBe(10_000);
    expect(r.monthlyFirst).toBe(201_000);
    expect(r.monthlyAfter).toBe(150_000);
    expect(r.benefitFirst).toBe(1_206_000);
    expect(r.benefitAfter).toBe(0);
    expect(r.total).toBe(1_206_000);
    expect(r.limitApplied).toBeNull();
  });
  it('181日目以降は50%で計算する', () => {
    const r = calculateChildcareLeave({
      monthlyWage: 300_000,
      leaveDays: 365,
      birthSupport: false,
    })!;
    expect(r.daysFirst).toBe(180);
    expect(r.daysAfter).toBe(185);
    expect(r.benefitAfter).toBe(925_000);
    expect(r.total).toBe(2_131_000);
  });
  it('出生後休業支援給付金は最大28日分を13%で加算する', () => {
    const r = calculateChildcareLeave({
      monthlyWage: 300_000,
      leaveDays: 60,
      birthSupport: true,
    })!;
    expect(r.supportDays).toBe(28);
    expect(r.supportBenefit).toBe(36_400);
    expect(r.total).toBe(402_000 + 36_400);
  });
  it('休業が28日未満なら日数分だけ加算する', () => {
    const r = calculateChildcareLeave({
      monthlyWage: 300_000,
      leaveDays: 14,
      birthSupport: true,
    })!;
    expect(r.supportDays).toBe(14);
    expect(r.supportBenefit).toBe(18_200);
  });
  it('賃金日額が上限を超える場合は上限で計算する', () => {
    const r = calculateChildcareLeave({
      monthlyWage: 600_000,
      leaveDays: 30,
      birthSupport: false,
    })!;
    expect(r.rawWageDaily).toBe(20_000);
    expect(r.wageDaily).toBe(WAGE_DAILY_UPPER);
    expect(r.limitApplied).toBe('upper');
    expect(r.total).toBe(Math.floor(WAGE_DAILY_UPPER * 30 * 0.67));
  });
  it('賃金日額が下限を下回る場合は下限で計算する', () => {
    const r = calculateChildcareLeave({
      monthlyWage: 50_000,
      leaveDays: 30,
      birthSupport: false,
    })!;
    expect(r.wageDaily).toBe(WAGE_DAILY_LOWER);
    expect(r.limitApplied).toBe('lower');
  });
  it('不正な入力はnull', () => {
    const base = { monthlyWage: 300_000, leaveDays: 30, birthSupport: false };
    expect(calculateChildcareLeave({ ...base, monthlyWage: 0 })).toBeNull();
    expect(calculateChildcareLeave({ ...base, monthlyWage: -1 })).toBeNull();
    expect(calculateChildcareLeave({ ...base, leaveDays: 0 })).toBeNull();
    expect(calculateChildcareLeave({ ...base, leaveDays: 1.5 })).toBeNull();
    expect(calculateChildcareLeave({ ...base, leaveDays: NaN })).toBeNull();
  });
});

describe('calculateMaternityAllowance', () => {
  it('単胎は42日+56日=98日分', () => {
    const r = calculateMaternityAllowance({
      standardMonthly: 300_000,
      multiple: false,
      delayDays: 0,
    })!;
    expect(r.standardDaily).toBe(10_000);
    expect(r.benefitDaily).toBe(6_667);
    expect(r.totalDays).toBe(98);
    expect(r.total).toBe(6_667 * 98);
  });
  it('多胎は98日+56日、遅れた日数は産前に加算される', () => {
    const r = calculateMaternityAllowance({
      standardMonthly: 300_000,
      multiple: true,
      delayDays: 5,
    })!;
    expect(r.preDays).toBe(103);
    expect(r.totalDays).toBe(159);
  });
  it('不正な入力はnull', () => {
    const base = { standardMonthly: 300_000, multiple: false, delayDays: 0 };
    expect(
      calculateMaternityAllowance({ ...base, standardMonthly: 0 }),
    ).toBeNull();
    expect(calculateMaternityAllowance({ ...base, delayDays: -1 })).toBeNull();
    expect(calculateMaternityAllowance({ ...base, delayDays: 1.5 })).toBeNull();
  });
});

describe('calculateSickAllowance', () => {
  it('待期3日を除いた日数分を支給する', () => {
    const r = calculateSickAllowance({
      standardMonthly: 300_000,
      absentDays: 10,
    })!;
    expect(r.paidDays).toBe(7);
    expect(r.total).toBe(6_667 * 7);
    expect(r.cappedByPeriod).toBe(false);
  });
  it('3日以内の休業は支給なし', () => {
    const r = calculateSickAllowance({
      standardMonthly: 300_000,
      absentDays: 3,
    })!;
    expect(r.paidDays).toBe(0);
    expect(r.total).toBe(0);
    expect(r.waitingDays).toBe(3);
  });
  it('支給期間の上限を超える分は支給しない', () => {
    const r = calculateSickAllowance({
      standardMonthly: 300_000,
      absentDays: 1000,
    })!;
    expect(r.paidDays).toBe(SICK_MAX_PAYMENT_DAYS);
    expect(r.cappedByPeriod).toBe(true);
  });
  it('不正な入力はnull', () => {
    expect(
      calculateSickAllowance({ standardMonthly: 300_000, absentDays: -1 }),
    ).toBeNull();
    expect(
      calculateSickAllowance({ standardMonthly: 0, absentDays: 10 }),
    ).toBeNull();
  });
});
