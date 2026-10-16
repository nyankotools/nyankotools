import { describe, expect, it } from 'vitest';
import { calculateLoan } from './loan-calculator';

describe('calculateLoan', () => {
  it('元利均等：毎月の返済額が一定で、総返済額が元金＋利息になる', () => {
    const r = calculateLoan({
      principal: 1_000_000,
      annualInterestRate: 12,
      method: 'equalPayment',
      months: 12,
    })!;
    expect(r.totalMonths).toBe(12);
    expect(r.firstPayment).toBeCloseTo(88_848.79, 1);
    expect(r.lastPayment).toBeCloseTo(88_848.79, 1);
    expect(r.totalInterest).toBeCloseTo(66_185.46, 0);
    expect(r.schedule[11].balance).toBe(0);
  });

  it('元金均等：毎月の元金が一定で、返済額は逓減する', () => {
    const r = calculateLoan({
      principal: 1_200_000,
      annualInterestRate: 12,
      method: 'equalPrincipal',
      months: 12,
    })!;
    expect(r.schedule[0].principal).toBeCloseTo(100_000, 6);
    expect(r.firstPayment).toBeCloseTo(112_000, 6);
    expect(r.lastPayment).toBeCloseTo(101_000, 6);
    // 利息総額 = 元金 × 月利 × (n+1)/2
    expect(r.totalInterest).toBeCloseTo(1_200_000 * 0.01 * 6.5, 6);
  });

  it('金利0%：元金を均等割りにする', () => {
    const r = calculateLoan({
      principal: 120_000,
      annualInterestRate: 0,
      method: 'equalPayment',
      months: 12,
    })!;
    expect(r.firstPayment).toBeCloseTo(10_000, 6);
    expect(r.totalInterest).toBeCloseTo(0, 6);
  });

  it('リボ払い：定額で支払い、最終回で残高を精算する', () => {
    const r = calculateLoan({
      principal: 100_000,
      annualInterestRate: 15,
      method: 'revolving',
      monthlyPayment: 10_000,
    })!;
    expect(r.schedule[0].interest).toBeCloseTo(1_250, 6);
    expect(r.firstPayment).toBe(10_000);
    expect(r.lastPayment).toBeLessThanOrEqual(10_000);
    expect(r.schedule[r.totalMonths - 1].balance).toBe(0);
    expect(r.totalMonths).toBeGreaterThan(10);
    expect(r.totalPayment - 100_000).toBeCloseTo(r.totalInterest, 6);
  });

  it('リボ払い：支払額が手数料以下だと完済しないのでnull', () => {
    expect(
      calculateLoan({
        principal: 1_000_000,
        annualInterestRate: 15,
        method: 'revolving',
        monthlyPayment: 12_500,
      }),
    ).toBeNull();
  });

  it('不正な入力はnull', () => {
    const base = {
      principal: 1_000_000,
      annualInterestRate: 5,
      method: 'equalPayment' as const,
      months: 12,
    };
    expect(calculateLoan({ ...base, principal: 0 })).toBeNull();
    expect(calculateLoan({ ...base, annualInterestRate: -1 })).toBeNull();
    expect(calculateLoan({ ...base, months: 0 })).toBeNull();
    expect(calculateLoan({ ...base, months: 1.5 })).toBeNull();
    expect(calculateLoan({ ...base, months: 601 })).toBeNull();
    expect(calculateLoan({ ...base, principal: NaN })).toBeNull();
  });

  it('不正な入力（追加）：負の月数・無限大・負の元金・NaN金利はnull', () => {
    const base = {
      principal: 1_000_000,
      annualInterestRate: 5,
      method: 'equalPayment' as const,
      months: 12,
    };
    expect(calculateLoan({ ...base, months: -1 })).toBeNull();
    expect(calculateLoan({ ...base, months: Infinity })).toBeNull();
    expect(calculateLoan({ ...base, months: NaN })).toBeNull();
    expect(calculateLoan({ ...base, months: undefined })).toBeNull();
    expect(calculateLoan({ ...base, principal: -1 })).toBeNull();
    expect(calculateLoan({ ...base, principal: Infinity })).toBeNull();
    expect(calculateLoan({ ...base, annualInterestRate: NaN })).toBeNull();
    expect(calculateLoan({ ...base, annualInterestRate: Infinity })).toBeNull();
  });

  it('不正な入力（リボ）：支払額の未指定・0以下・NaN・無限大はnull', () => {
    const base = {
      principal: 100_000,
      annualInterestRate: 15,
      method: 'revolving' as const,
    };
    expect(calculateLoan({ ...base })).toBeNull();
    expect(calculateLoan({ ...base, monthlyPayment: 0 })).toBeNull();
    expect(calculateLoan({ ...base, monthlyPayment: -10_000 })).toBeNull();
    expect(calculateLoan({ ...base, monthlyPayment: NaN })).toBeNull();
    expect(calculateLoan({ ...base, monthlyPayment: Infinity })).toBeNull();
  });

  it('高金利・長期間で指数計算が溢れる場合はNaNにならずnullを返す', () => {
    // 年利1,000,000%（月利約833%）× 600回では (1+r)^n が Infinity になり NaN が出るため null
    expect(
      calculateLoan({
        principal: 1_000_000,
        annualInterestRate: 1_000_000,
        method: 'equalPayment',
        months: 600,
      }),
    ).toBeNull();
    // 元金均等は指数計算を使わないため、極端な金利でも有限値のまま返る
    const p = calculateLoan({
      principal: 1_000_000,
      annualInterestRate: 1_000_000,
      method: 'equalPrincipal',
      months: 600,
    });
    expect(p).not.toBeNull();
    expect(Number.isFinite(p!.totalPayment)).toBe(true);
    expect(Number.isNaN(p!.totalInterest)).toBe(false);
  });

  it('返済回数の上限ちょうど（600回）は受け付ける', () => {
    const r = calculateLoan({
      principal: 1_000_000,
      annualInterestRate: 5,
      method: 'equalPayment',
      months: 600,
    });
    expect(r).not.toBeNull();
    expect(r!.totalMonths).toBe(600);
    expect(r!.schedule[599].balance).toBe(0);
  });

  it('リボ払い：支払額が手数料をわずかに上回るだけで600回を超える場合はnull', () => {
    // 初月手数料12,500円に対し12,501円では元金が毎月1円ずつしか減らず、600回では完済しない
    expect(
      calculateLoan({
        principal: 1_000_000,
        annualInterestRate: 15,
        method: 'revolving',
        monthlyPayment: 12_501,
      }),
    ).toBeNull();
  });

  it('金利0%のリボ払い：手数料がないので支払額どおりに減り、最終回で精算される', () => {
    const r = calculateLoan({
      principal: 100_000,
      annualInterestRate: 0,
      method: 'revolving',
      monthlyPayment: 30_000,
    })!;
    expect(r.totalMonths).toBe(4);
    expect(r.lastPayment).toBeCloseTo(10_000, 6);
    expect(r.totalInterest).toBeCloseTo(0, 6);
  });

  it('元金均等・金利0%：利息ゼロで総返済額が元金に一致する', () => {
    const r = calculateLoan({
      principal: 120_000,
      annualInterestRate: 0,
      method: 'equalPrincipal',
      months: 12,
    })!;
    expect(r.totalPayment).toBeCloseTo(120_000, 6);
    expect(r.totalInterest).toBeCloseTo(0, 6);
  });
});
