import { describe, expect, it } from 'vitest';
import { calculateMortgagePrepayment } from './mortgage-calculator';

describe('calculateMortgagePrepayment', () => {
  it('期間短縮型：毎月の返済額は変わらず、残り期間が短縮される', () => {
    const result = calculateMortgagePrepayment({
      remainingBalance: 30_000_000,
      annualInterestRate: 1.0,
      remainingMonths: 300,
      prepaymentAmount: 2_000_000,
      prepaymentType: 'shortenTerm',
    });

    expect(result).not.toBeNull();
    expect(result!.monthlyPaymentBefore).toBeCloseTo(113_061.74, 1);
    expect(result!.totalInterestBefore).toBeCloseTo(3_918_520.88, 1);
    expect(result!.monthlyPaymentAfter).toBeCloseTo(
      result!.monthlyPaymentBefore,
      6,
    );
    // 端数の月は最終回として数え（切り上げ）、最終回の支払額は毎月の返済額より小さい
    expect(result!.remainingMonthsAfter).toBe(278);
    expect(result!.monthsShortened).toBe(22);
    expect(result!.totalInterestAfter).toBeCloseTo(3_373_686.18, 1);
    expect(result!.interestSaved).toBeCloseTo(544_834.71, 1);
    expect(result!.monthlyPaymentReduced).toBe(0);
  });

  it('返済額軽減型：残り期間は変わらず、毎月の返済額が軽減される', () => {
    const result = calculateMortgagePrepayment({
      remainingBalance: 30_000_000,
      annualInterestRate: 1.0,
      remainingMonths: 300,
      prepaymentAmount: 2_000_000,
      prepaymentType: 'reducePayment',
    });

    expect(result).not.toBeNull();
    expect(result!.remainingMonthsAfter).toBe(300);
    expect(result!.monthsShortened).toBe(0);
    expect(result!.monthlyPaymentAfter).toBeCloseTo(105_524.29, 1);
    expect(result!.monthlyPaymentReduced).toBeCloseTo(7_537.45, 1);
    expect(result!.totalInterestAfter).toBeCloseTo(3_657_286.16, 1);
    expect(result!.interestSaved).toBeCloseTo(261_234.73, 1);
  });

  it('金利0%の場合、利息は発生せず単純な元金按分になる', () => {
    const result = calculateMortgagePrepayment({
      remainingBalance: 12_000_000,
      annualInterestRate: 0,
      remainingMonths: 120,
      prepaymentAmount: 1_000_000,
      prepaymentType: 'shortenTerm',
    });

    expect(result).not.toBeNull();
    expect(result!.monthlyPaymentBefore).toBe(100_000);
    expect(result!.totalInterestBefore).toBe(0);
    expect(result!.remainingMonthsAfter).toBe(110);
    expect(result!.monthsShortened).toBe(10);
    expect(result!.totalInterestAfter).toBe(0);
    expect(result!.interestSaved).toBe(0);
  });

  it('金利0%・返済額軽減型でも毎月の返済額が正しく軽減される', () => {
    const result = calculateMortgagePrepayment({
      remainingBalance: 12_000_000,
      annualInterestRate: 0,
      remainingMonths: 120,
      prepaymentAmount: 1_000_000,
      prepaymentType: 'reducePayment',
    });

    expect(result).not.toBeNull();
    expect(result!.remainingMonthsAfter).toBe(120);
    expect(result!.monthlyPaymentAfter).toBeCloseTo(91_666.67, 1);
    expect(result!.monthlyPaymentReduced).toBeCloseTo(8_333.33, 1);
    expect(result!.totalInterestAfter).toBe(0);
  });

  it('借入残高が0以下ならnull', () => {
    expect(
      calculateMortgagePrepayment({
        remainingBalance: 0,
        annualInterestRate: 1.0,
        remainingMonths: 120,
        prepaymentAmount: 100_000,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
    expect(
      calculateMortgagePrepayment({
        remainingBalance: -1,
        annualInterestRate: 1.0,
        remainingMonths: 120,
        prepaymentAmount: 100_000,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
  });

  it('金利が負の場合はnull', () => {
    expect(
      calculateMortgagePrepayment({
        remainingBalance: 10_000_000,
        annualInterestRate: -0.1,
        remainingMonths: 120,
        prepaymentAmount: 100_000,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
  });

  it('残りの返済期間が0以下、または整数でない場合はnull', () => {
    expect(
      calculateMortgagePrepayment({
        remainingBalance: 10_000_000,
        annualInterestRate: 1.0,
        remainingMonths: 0,
        prepaymentAmount: 100_000,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
    expect(
      calculateMortgagePrepayment({
        remainingBalance: 10_000_000,
        annualInterestRate: 1.0,
        remainingMonths: 120.5,
        prepaymentAmount: 100_000,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
  });

  it('繰り上げ返済額が0以下、または借入残高以上の場合はnull', () => {
    expect(
      calculateMortgagePrepayment({
        remainingBalance: 10_000_000,
        annualInterestRate: 1.0,
        remainingMonths: 120,
        prepaymentAmount: 0,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
    expect(
      calculateMortgagePrepayment({
        remainingBalance: 10_000_000,
        annualInterestRate: 1.0,
        remainingMonths: 120,
        prepaymentAmount: 10_000_000,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
    expect(
      calculateMortgagePrepayment({
        remainingBalance: 10_000_000,
        annualInterestRate: 1.0,
        remainingMonths: 120,
        prepaymentAmount: 15_000_000,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
  });

  it('NaNが含まれる場合はnull', () => {
    expect(
      calculateMortgagePrepayment({
        remainingBalance: NaN,
        annualInterestRate: 1.0,
        remainingMonths: 120,
        prepaymentAmount: 100_000,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
  });

  it('総返済額の内訳が整合する（繰り上げ返済額＋残り月々返済総額＝元本＋利息）', () => {
    const result = calculateMortgagePrepayment({
      remainingBalance: 25_000_000,
      annualInterestRate: 1.5,
      remainingMonths: 240,
      prepaymentAmount: 3_000_000,
      prepaymentType: 'reducePayment',
    });

    expect(result).not.toBeNull();
    expect(result!.totalPaymentAfter).toBeCloseTo(
      25_000_000 + result!.totalInterestAfter,
      6,
    );
  });

  it('期間短縮型：繰り上げ返済額が借入残高にほぼ等しくても総利息はマイナスにならない', () => {
    const result = calculateMortgagePrepayment({
      remainingBalance: 10_000_000,
      annualInterestRate: 1.0,
      remainingMonths: 120,
      prepaymentAmount: 9_999_999,
      prepaymentType: 'shortenTerm',
    });

    expect(result).not.toBeNull();
    expect(result!.remainingMonthsAfter).toBeGreaterThanOrEqual(1);
    expect(result!.totalInterestAfter).toBeGreaterThanOrEqual(0);
  });

  it('残りの返済期間が上限（600ヶ月＝50年）を超える場合はnull', () => {
    expect(
      calculateMortgagePrepayment({
        remainingBalance: 10_000_000,
        annualInterestRate: 1.0,
        remainingMonths: 601,
        prepaymentAmount: 100_000,
        prepaymentType: 'shortenTerm',
      }),
    ).toBeNull();
    expect(
      calculateMortgagePrepayment({
        remainingBalance: 10_000_000,
        annualInterestRate: 1.0,
        remainingMonths: 600,
        prepaymentAmount: 100_000,
        prepaymentType: 'shortenTerm',
      }),
    ).not.toBeNull();
  });
});
