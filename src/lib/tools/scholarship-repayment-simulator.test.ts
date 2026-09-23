import { describe, expect, it } from 'vitest';
import { simulateScholarshipRepayment } from './scholarship-repayment-simulator';

describe('simulateScholarshipRepayment', () => {
  it('利率固定方式：毎月の返済額は完済まで一定になる（元利均等返済）', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 30_000_000,
      initialAnnualRate: 1.0,
      repaymentYears: 20,
      method: 'fixed',
      rateChangePerReview: 0,
    });

    expect(result).not.toBeNull();
    // 元利均等返済の年金現価公式で独立に検算した値（借入3000万円・年利1.0%・240ヶ月）
    expect(result!.initialMonthlyPayment).toBeCloseTo(137_968.29, 1);
    expect(result!.finalMonthlyPayment).toBeCloseTo(137_968.29, 1);
    expect(result!.repaymentMonths).toBe(240);
    expect(result!.totalInterest).toBeCloseTo(3_112_390.1, 1);
    expect(result!.totalPayment).toBeCloseTo(30_000_000 + 3_112_390.1, 1);
    expect(result!.periods).toHaveLength(1);
    expect(result!.periods[0].annualRate).toBe(1.0);
  });

  it('金利0%の場合、利息は発生せず単純な元金按分になる', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 2_400_000,
      initialAnnualRate: 0,
      repaymentYears: 20,
      method: 'fixed',
      rateChangePerReview: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.initialMonthlyPayment).toBeCloseTo(10_000, 5);
    expect(result!.totalInterest).toBeCloseTo(0, 5);
    expect(result!.totalPayment).toBeCloseTo(2_400_000, 1);
  });

  it('利率見直し方式：5年ごとに利率が変化し、残高・残り期間から返済額が再計算される', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 3_000_000,
      initialAnnualRate: 0.5,
      repaymentYears: 15,
      method: 'reviewed',
      rateChangePerReview: 0.2,
    });

    expect(result).not.toBeNull();
    // 180ヶ月 → 60ヶ月目・120ヶ月目の2回見直し（当初と合わせて3期間）
    expect(result!.periods).toHaveLength(3);
    expect(result!.periods[0].annualRate).toBe(0.5);
    expect(result!.periods[1].annualRate).toBeCloseTo(0.7, 5);
    expect(result!.periods[2].annualRate).toBeCloseTo(0.9, 5);
    expect(result!.periods[1].fromYear).toBe(6);
    expect(result!.periods[2].fromYear).toBe(11);
    // 利率が上昇し続けるため、返済額は見直しのたびに増える
    expect(result!.periods[1].monthlyPayment).toBeGreaterThan(
      result!.periods[0].monthlyPayment,
    );
    expect(result!.periods[2].monthlyPayment).toBeGreaterThan(
      result!.periods[1].monthlyPayment,
    );
    expect(result!.finalMonthlyPayment).toBe(result!.periods[2].monthlyPayment);
  });

  it('利率見直し方式：利率の変化幅が負でも、0%を下回らない', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 3_000_000,
      initialAnnualRate: 0.5,
      repaymentYears: 15,
      method: 'reviewed',
      rateChangePerReview: -1,
    });

    expect(result).not.toBeNull();
    for (const period of result!.periods) {
      expect(period.annualRate).toBeGreaterThanOrEqual(0);
    }
    // 0.5 - 1*2 = -1.5 のはずが0で下限
    expect(result!.periods[2].annualRate).toBe(0);
  });

  it('返還期間が5年未満なら、利率見直し方式でも見直しは発生しない', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 1_000_000,
      initialAnnualRate: 0.5,
      repaymentYears: 4,
      method: 'reviewed',
      rateChangePerReview: 0.5,
    });

    expect(result).not.toBeNull();
    expect(result!.periods).toHaveLength(1);
    expect(result!.initialMonthlyPayment).toBe(result!.finalMonthlyPayment);
  });

  it('貸与総額が0以下、または利率が負の場合はnull', () => {
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: 0,
        initialAnnualRate: 0.5,
        repaymentYears: 15,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).toBeNull();
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: 2_400_000,
        initialAnnualRate: -0.1,
        repaymentYears: 15,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).toBeNull();
  });

  it('返還期間が1〜20年の範囲外、または整数でない場合はnull', () => {
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: 2_400_000,
        initialAnnualRate: 0.5,
        repaymentYears: 0,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).toBeNull();
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: 2_400_000,
        initialAnnualRate: 0.5,
        repaymentYears: 21,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).toBeNull();
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: 2_400_000,
        initialAnnualRate: 0.5,
        repaymentYears: 15.5,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).toBeNull();
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: 2_400_000,
        initialAnnualRate: 0.5,
        repaymentYears: 20,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).not.toBeNull();
  });

  it('NaNが含まれる場合はnull', () => {
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: NaN,
        initialAnnualRate: 0.5,
        repaymentYears: 15,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).toBeNull();
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: 2_400_000,
        initialAnnualRate: 0.5,
        repaymentYears: 15,
        method: 'reviewed',
        rateChangePerReview: NaN,
      }),
    ).toBeNull();
  });

  it('総返済額の内訳が整合する（総返済額－貸与総額＝総利息）', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 2_400_000,
      initialAnnualRate: 0.8,
      repaymentYears: 14,
      method: 'reviewed',
      rateChangePerReview: -0.1,
    });

    expect(result).not.toBeNull();
    expect(result!.totalPayment - 2_400_000).toBeCloseTo(
      result!.totalInterest,
      6,
    );
  });

  it('返還期間が1年の場合、最小値でも動作する', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 1_200_000,
      initialAnnualRate: 0.5,
      repaymentYears: 1,
      method: 'fixed',
      rateChangePerReview: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.repaymentMonths).toBe(12);
    expect(result!.periods).toHaveLength(1);
  });

  it('返還期間が20年の場合、最大値でも動作する', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 3_000_000,
      initialAnnualRate: 1.5,
      repaymentYears: 20,
      method: 'fixed',
      rateChangePerReview: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.repaymentMonths).toBe(240);
    expect(result!.periods).toHaveLength(1);
  });

  it('高利率（10%）でも計算が可能', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 2_000_000,
      initialAnnualRate: 10.0,
      repaymentYears: 10,
      method: 'fixed',
      rateChangePerReview: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.totalInterest).toBeGreaterThan(1_000_000);
  });

  it('非常に小さな金額（10000円）でも計算が可能', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 10_000,
      initialAnnualRate: 0.5,
      repaymentYears: 1,
      method: 'fixed',
      rateChangePerReview: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.totalPayment).toBeGreaterThanOrEqual(10_000);
  });

  it('利率見直し方式で20年返済の場合、見直しが3回発生する（60, 120, 180ヶ月目）', () => {
    const result = simulateScholarshipRepayment({
      totalLoanAmount: 2_000_000,
      initialAnnualRate: 1.0,
      repaymentYears: 20,
      method: 'reviewed',
      rateChangePerReview: 0.1,
    });

    expect(result).not.toBeNull();
    // 当初 + 3回の見直し = 4期間
    expect(result!.periods).toHaveLength(4);
    expect(result!.periods[0].reviewNumber).toBe(0);
    expect(result!.periods[1].reviewNumber).toBe(1);
    expect(result!.periods[2].reviewNumber).toBe(2);
    expect(result!.periods[3].reviewNumber).toBe(3);
    expect(result!.periods[1].fromYear).toBe(6);
    expect(result!.periods[2].fromYear).toBe(11);
    expect(result!.periods[3].fromYear).toBe(16);
  });

  it('初期借入金0円（ちょうど0）はnullになる', () => {
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: 0,
        initialAnnualRate: 0.5,
        repaymentYears: 15,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).toBeNull();
  });

  it('負の金額はnullになる', () => {
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: -1000,
        initialAnnualRate: 0.5,
        repaymentYears: 15,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).toBeNull();
  });

  it('Infinityはnullになる', () => {
    expect(
      simulateScholarshipRepayment({
        totalLoanAmount: Infinity,
        initialAnnualRate: 0.5,
        repaymentYears: 15,
        method: 'fixed',
        rateChangePerReview: 0,
      }),
    ).toBeNull();
  });
});
