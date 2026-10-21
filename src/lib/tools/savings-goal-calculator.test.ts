import { describe, expect, it } from 'vitest';
import {
  MAX_ANNUAL_RATE,
  MAX_MONTHS,
  simulateSavings,
  solveMonthlyDeposit,
  solveMonthsToTarget,
} from './savings-goal-calculator';

describe('simulateSavings', () => {
  it('利率0%は単純な合計になる', () => {
    const r = simulateSavings({
      initialBalance: 100000,
      monthlyDeposit: 30000,
      annualRate: 0,
      months: 24,
    })!;
    expect(r.finalBalance).toBe(100000 + 30000 * 24);
    expect(r.totalInterest).toBe(0);
    expect(r.yearly.map((y) => y.months)).toEqual([12, 24]);
  });

  it('月次複利で利息がつく', () => {
    const r = simulateSavings({
      initialBalance: 0,
      monthlyDeposit: 10000,
      annualRate: 12,
      months: 12,
    })!;
    // 月利1%の期末払い年金終価: 10000 * (1.01^12 - 1) / 0.01
    expect(r.finalBalance).toBeCloseTo(126825.03, 1);
    expect(r.totalDeposit).toBe(120000);
  });

  it('12の倍数でない期間は最終月も推移に含む', () => {
    const r = simulateSavings({
      initialBalance: 0,
      monthlyDeposit: 1000,
      annualRate: 0,
      months: 14,
    })!;
    expect(r.yearly.map((y) => y.months)).toEqual([12, 14]);
  });

  it('不正な入力はnull', () => {
    const base = {
      initialBalance: 0,
      monthlyDeposit: 1000,
      annualRate: 1,
      months: 12,
    };
    expect(simulateSavings({ ...base, months: 0 })).toBeNull();
    expect(simulateSavings({ ...base, months: 721 })).toBeNull();
    expect(simulateSavings({ ...base, months: 1.5 })).toBeNull();
    expect(simulateSavings({ ...base, annualRate: -1 })).toBeNull();
    expect(simulateSavings({ ...base, annualRate: 51 })).toBeNull();
    expect(simulateSavings({ ...base, monthlyDeposit: -1 })).toBeNull();
    expect(simulateSavings({ ...base, monthlyDeposit: 0 })).toBeNull();
    expect(simulateSavings({ ...base, annualRate: NaN })).toBeNull();
  });

  it('上限ちょうど（年利50%・720ヶ月）と下限（1ヶ月）は受け付ける', () => {
    const base = { initialBalance: 0, monthlyDeposit: 1000 };
    expect(
      simulateSavings({ ...base, annualRate: 50, months: MAX_MONTHS }),
    ).not.toBeNull();
    expect(
      simulateSavings({ ...base, annualRate: MAX_ANNUAL_RATE, months: 1 }),
    ).not.toBeNull();
    expect(simulateSavings({ ...base, annualRate: 0, months: 1 })).toEqual(
      expect.objectContaining({ finalBalance: 1000, totalInterest: 0 }),
    );
  });

  it('720ヶ月は60件（12ヶ月ごと）の推移になり、最終月を重複させない', () => {
    const r = simulateSavings({
      initialBalance: 0,
      monthlyDeposit: 1000,
      annualRate: 1,
      months: MAX_MONTHS,
    });
    if (!r) throw new Error('unexpected');
    expect(r.yearly).toHaveLength(60);
    expect(r.yearly[59].months).toBe(720);
  });

  it('初期残高のみ（積立0）でも計算でき、積立0・残高0は null', () => {
    const r = simulateSavings({
      initialBalance: 100000,
      monthlyDeposit: 0,
      annualRate: 0,
      months: 12,
    });
    expect(r?.finalBalance).toBe(100000);
    expect(r?.totalDeposit).toBe(100000);
    expect(
      simulateSavings({
        initialBalance: 0,
        monthlyDeposit: 0,
        annualRate: 1,
        months: 12,
      }),
    ).toBeNull();
  });
});

describe('solveMonthlyDeposit', () => {
  it('利率0%は目標額÷月数', () => {
    expect(
      solveMonthlyDeposit({
        targetAmount: 1200000,
        initialBalance: 0,
        annualRate: 0,
        months: 24,
      }),
    ).toBe(50000);
  });

  it('初期残高を差し引く', () => {
    expect(
      solveMonthlyDeposit({
        targetAmount: 1200000,
        initialBalance: 600000,
        annualRate: 0,
        months: 12,
      }),
    ).toBe(50000);
  });

  it('初期残高だけで足りる場合は0', () => {
    expect(
      solveMonthlyDeposit({
        targetAmount: 100,
        initialBalance: 500,
        annualRate: 0,
        months: 12,
      }),
    ).toBe(0);
  });

  it('逆算した積立額で順算すると目標額に一致する', () => {
    const monthly = solveMonthlyDeposit({
      targetAmount: 5000000,
      initialBalance: 200000,
      annualRate: 3,
      months: 60,
    })!;
    const r = simulateSavings({
      initialBalance: 200000,
      monthlyDeposit: monthly,
      annualRate: 3,
      months: 60,
    })!;
    expect(r.finalBalance).toBeCloseTo(5000000, 4);
  });

  it('不正な入力はnull', () => {
    expect(
      solveMonthlyDeposit({
        targetAmount: 0,
        initialBalance: 0,
        annualRate: 0,
        months: 12,
      }),
    ).toBeNull();
    expect(
      solveMonthlyDeposit({
        targetAmount: 100,
        initialBalance: 0,
        annualRate: 0,
        months: 0,
      }),
    ).toBeNull();
  });
});

describe('solveMonthsToTarget', () => {
  it('利率0%は切り上げ', () => {
    expect(
      solveMonthsToTarget({
        targetAmount: 1000000,
        initialBalance: 0,
        monthlyDeposit: 30000,
        annualRate: 0,
      }),
    ).toBe(34);
  });

  it('ちょうど割り切れる場合は切り上げで増えない', () => {
    expect(
      solveMonthsToTarget({
        targetAmount: 1200000,
        initialBalance: 0,
        monthlyDeposit: 100000,
        annualRate: 0,
      }),
    ).toBe(12);
  });

  it('すでに達成済みなら0', () => {
    expect(
      solveMonthsToTarget({
        targetAmount: 100,
        initialBalance: 100,
        monthlyDeposit: 0,
        annualRate: 0,
      }),
    ).toBe(0);
  });

  it('積立0・利率0で未達ならnull', () => {
    expect(
      solveMonthsToTarget({
        targetAmount: 1000,
        initialBalance: 100,
        monthlyDeposit: 0,
        annualRate: 0,
      }),
    ).toBeNull();
  });

  it('初期残高だけでも利息で到達できる', () => {
    const n = solveMonthsToTarget({
      targetAmount: 2000000,
      initialBalance: 1000000,
      monthlyDeposit: 0,
      annualRate: 6,
    })!;
    // 月利0.5%で2倍: 約139ヶ月
    expect(n).toBe(139);
  });

  it('720ヶ月を超えるならnull', () => {
    expect(
      solveMonthsToTarget({
        targetAmount: 1000000000,
        initialBalance: 0,
        monthlyDeposit: 1000,
        annualRate: 0,
      }),
    ).toBeNull();
  });

  it('得られた月数で目標に届き、1ヶ月前では届かない', () => {
    const args = {
      targetAmount: 3000000,
      initialBalance: 100000,
      monthlyDeposit: 25000,
      annualRate: 2,
    };
    const n = solveMonthsToTarget(args)!;
    const at = simulateSavings({
      initialBalance: args.initialBalance,
      monthlyDeposit: args.monthlyDeposit,
      annualRate: args.annualRate,
      months: n,
    })!;
    const before = simulateSavings({
      initialBalance: args.initialBalance,
      monthlyDeposit: args.monthlyDeposit,
      annualRate: args.annualRate,
      months: n - 1,
    })!;
    expect(at.finalBalance).toBeGreaterThanOrEqual(args.targetAmount);
    expect(before.finalBalance).toBeLessThan(args.targetAmount);
  });

  it('不正な入力はnull', () => {
    expect(
      solveMonthsToTarget({
        targetAmount: -1,
        initialBalance: 0,
        monthlyDeposit: 1000,
        annualRate: 0,
      }),
    ).toBeNull();
    expect(
      solveMonthsToTarget({
        targetAmount: 1000,
        initialBalance: 0,
        monthlyDeposit: 1000,
        annualRate: 60,
      }),
    ).toBeNull();
  });
});
