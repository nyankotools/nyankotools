import { describe, expect, it } from 'vitest';
import {
  calculateRealEstateYield,
  type RealEstateYieldInput,
} from './real-estate-yield';

const base: RealEstateYieldInput = {
  price: 30_000_000,
  monthlyRent: 200_000,
  vacancyPercent: 0,
  managementPercent: 0,
  repairsPerYear: 0,
  propertyTaxPerYear: 0,
  otherExpensesPerYear: 0,
  purchaseCostPercent: 0,
  equity: 30_000_000,
  annualInterestRate: 2,
  loanYears: 30,
};

describe('calculateRealEstateYield', () => {
  it('表面利回りと実質利回り（経費なし・全額自己資金）', () => {
    const r = calculateRealEstateYield(base)!;
    expect(r.annualGrossRent).toBe(2_400_000);
    expect(r.grossYield).toBeCloseTo(8, 10);
    expect(r.netYield).toBeCloseTo(8, 10);
    expect(r.loanAmount).toBe(0);
    expect(r.annualCashFlow).toBe(2_400_000);
    expect(r.dscr).toBeNull();
    expect(r.cashOnCash).toBeCloseTo(8, 10);
  });

  it('空室率・経費・諸費用が実質利回りに反映される', () => {
    const r = calculateRealEstateYield({
      ...base,
      vacancyPercent: 10,
      managementPercent: 5,
      repairsPerYear: 100_000,
      propertyTaxPerYear: 150_000,
      otherExpensesPerYear: 50_000,
      purchaseCostPercent: 7,
    })!;
    expect(r.effectiveRent).toBeCloseTo(2_160_000, 6);
    expect(r.operatingExpenses).toBeCloseTo(108_000 + 300_000, 6);
    expect(r.noi).toBeCloseTo(2_160_000 - 408_000, 6);
    expect(r.purchaseCosts).toBeCloseTo(2_100_000, 6);
    expect(r.netYield).toBeCloseTo((1_752_000 / 32_100_000) * 100, 10);
    expect(r.grossYield).toBeCloseTo(8, 10);
  });

  it('借入がある場合は元利均等の返済額をキャッシュフローから引く', () => {
    const r = calculateRealEstateYield({
      ...base,
      equity: 5_000_000,
      annualInterestRate: 0,
      loanYears: 25,
    })!;
    expect(r.loanAmount).toBe(25_000_000);
    expect(r.monthlyLoanPayment).toBeCloseTo(25_000_000 / 300, 6);
    expect(r.annualCashFlow).toBeCloseTo(
      2_400_000 - (25_000_000 / 300) * 12,
      6,
    );
    expect(r.monthlyCashFlow).toBeCloseTo(r.annualCashFlow / 12, 6);
    expect(r.dscr).toBeCloseTo(2_400_000 / 1_000_000, 6);
    expect(r.totalInterest).toBeCloseTo(0, 6);
  });

  it('金利ありのローンでは返済額が増えキャッシュフローが減る', () => {
    const zero = calculateRealEstateYield({
      ...base,
      equity: 0,
      annualInterestRate: 0,
    })!;
    const withRate = calculateRealEstateYield({
      ...base,
      equity: 0,
      annualInterestRate: 2,
    })!;
    expect(withRate.annualLoanPayment).toBeGreaterThan(zero.annualLoanPayment);
    expect(withRate.annualCashFlow).toBeLessThan(zero.annualCashFlow);
    expect(withRate.totalInterest).toBeGreaterThan(0);
    expect(withRate.cashOnCash).toBeNull();
  });

  it('自己資金が総額を超える場合は借入なし', () => {
    const r = calculateRealEstateYield({ ...base, equity: 40_000_000 })!;
    expect(r.loanAmount).toBe(0);
    expect(r.cashOnCash).toBeCloseTo((2_400_000 / 30_000_000) * 100, 10);
  });

  it('赤字（キャッシュフローがマイナス）になる', () => {
    const r = calculateRealEstateYield({
      ...base,
      monthlyRent: 80_000,
      equity: 0,
    })!;
    expect(r.annualCashFlow).toBeLessThan(0);
  });

  it('借入なしなら返済期間が不正でも計算できる', () => {
    expect(calculateRealEstateYield({ ...base, loanYears: 0 })).not.toBeNull();
  });

  it('不正な入力はnull', () => {
    expect(calculateRealEstateYield({ ...base, price: 0 })).toBeNull();
    expect(calculateRealEstateYield({ ...base, price: NaN })).toBeNull();
    expect(calculateRealEstateYield({ ...base, monthlyRent: -1 })).toBeNull();
    expect(
      calculateRealEstateYield({ ...base, vacancyPercent: 101 }),
    ).toBeNull();
    expect(
      calculateRealEstateYield({ ...base, managementPercent: -1 }),
    ).toBeNull();
    expect(
      calculateRealEstateYield({ ...base, purchaseCostPercent: 31 }),
    ).toBeNull();
    expect(calculateRealEstateYield({ ...base, equity: -1 })).toBeNull();
    expect(
      calculateRealEstateYield({ ...base, annualInterestRate: -1 }),
    ).toBeNull();
    expect(
      calculateRealEstateYield({ ...base, equity: 0, loanYears: 0 }),
    ).toBeNull();
    expect(
      calculateRealEstateYield({ ...base, equity: 0, loanYears: 51 }),
    ).toBeNull();
    expect(
      calculateRealEstateYield({ ...base, equity: 0, loanYears: 2.5 }),
    ).toBeNull();
    expect(calculateRealEstateYield({ ...base, price: Infinity })).toBeNull();
  });

  it('家賃0円でも計算でき、利回りは0%・経費だけ赤字になる', () => {
    const r = calculateRealEstateYield({
      ...base,
      monthlyRent: 0,
      repairsPerYear: 100_000,
    })!;
    expect(r.grossYield).toBe(0);
    expect(r.noi).toBe(-100_000);
    expect(r.netYield).toBeLessThan(0);
  });

  it('空室率100%・管理費率100%・境界値（諸費用30%・金利30%）は有効', () => {
    const vacant = calculateRealEstateYield({
      ...base,
      vacancyPercent: 100,
      managementPercent: 100,
    })!;
    expect(vacant.effectiveRent).toBe(0);
    expect(vacant.noi).toBe(0);

    const edge = calculateRealEstateYield({
      ...base,
      purchaseCostPercent: 30,
      equity: 0,
      annualInterestRate: 30,
      loanYears: 35,
    })!;
    expect(edge.purchaseCosts).toBeCloseTo(9_000_000, 6);
    expect(edge.loanAmount).toBeCloseTo(39_000_000, 6);
  });

  it('自己資金がちょうど総額と同じなら借入なし', () => {
    const r = calculateRealEstateYield({ ...base, equity: 30_000_000 })!;
    expect(r.loanAmount).toBe(0);
    expect(r.cashOnCash).toBeCloseTo(8, 10);
  });
});
