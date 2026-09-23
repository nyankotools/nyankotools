import { describe, expect, it } from 'vitest';
import {
  simulateAccumulation,
  solveMonthlyContribution,
  solveMonthsToReachTarget,
  solveInitialInvestment,
  calculateWithdrawal,
  simulateFixedAmountWithdrawal,
  simulateFixedRateWithdrawal,
} from './investment-simulator';

describe('simulateAccumulation', () => {
  it('年利0%の場合、資産額は元本合計と一致し運用益は0', () => {
    const result = simulateAccumulation({
      initialInvestment: 1_000_000,
      monthlyContribution: 30_000,
      annualRate: 0,
      totalMonths: 120,
    });

    expect(result).not.toBeNull();
    expect(result!.totalPrincipal).toBe(1_000_000 + 30_000 * 120);
    expect(result!.finalBalance).toBe(result!.totalPrincipal);
    expect(result!.totalGain).toBe(0);
  });

  it('年金終価（期首払い）の公式と一致する（初期投資額あり）', () => {
    const initialInvestment = 500_000;
    const monthlyContribution = 10_000;
    const annualRate = 12;
    const totalMonths = 12;
    const monthlyRate = annualRate / 100 / 12;
    const growthFactor = (1 + monthlyRate) ** totalMonths;
    const expected =
      initialInvestment * growthFactor +
      monthlyContribution *
        (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate) *
        (1 + monthlyRate);

    const result = simulateAccumulation({
      initialInvestment,
      monthlyContribution,
      annualRate,
      totalMonths,
    });

    expect(result).not.toBeNull();
    expect(result!.finalBalance).toBeCloseTo(expected, 4);
  });

  it('積立期間が12の倍数でない場合、端数月のスナップショットが追加される', () => {
    const result = simulateAccumulation({
      initialInvestment: 0,
      monthlyContribution: 50_000,
      annualRate: 3,
      totalMonths: 30,
    });

    expect(result).not.toBeNull();
    expect(result!.yearly).toHaveLength(3);
    expect(result!.yearly[0].months).toBe(12);
    expect(result!.yearly[1].months).toBe(24);
    expect(result!.yearly[2].months).toBe(30);
    expect(result!.yearly[2].balance).toBeCloseTo(result!.finalBalance, 6);
  });

  it('積立期間が0ヶ月の場合、初期投資額のみのスナップショットを1件返す', () => {
    const result = simulateAccumulation({
      initialInvestment: 1_000_000,
      monthlyContribution: 0,
      annualRate: 5,
      totalMonths: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.yearly).toHaveLength(1);
    expect(result!.yearly[0].months).toBe(0);
    expect(result!.finalBalance).toBe(1_000_000);
    expect(result!.totalGain).toBe(0);
  });

  it('初期投資額・毎月の積立額のいずれかが0でも計算できる', () => {
    expect(
      simulateAccumulation({
        initialInvestment: 1_000_000,
        monthlyContribution: 0,
        annualRate: 5,
        totalMonths: 120,
      }),
    ).not.toBeNull();
    expect(
      simulateAccumulation({
        initialInvestment: 0,
        monthlyContribution: 30_000,
        annualRate: 5,
        totalMonths: 120,
      }),
    ).not.toBeNull();
  });

  it('初期投資額・毎月の積立額が両方0の場合はnull', () => {
    expect(
      simulateAccumulation({
        initialInvestment: 0,
        monthlyContribution: 0,
        annualRate: 5,
        totalMonths: 120,
      }),
    ).toBeNull();
  });

  it('想定利回りが負、または上限（50%）を超える場合はnull', () => {
    expect(
      simulateAccumulation({
        initialInvestment: 0,
        monthlyContribution: 30_000,
        annualRate: -0.1,
        totalMonths: 120,
      }),
    ).toBeNull();
    expect(
      simulateAccumulation({
        initialInvestment: 0,
        monthlyContribution: 30_000,
        annualRate: 50.1,
        totalMonths: 120,
      }),
    ).toBeNull();
  });

  it('積立期間が整数でない、または上限（720ヶ月）を超える場合はnull', () => {
    expect(
      simulateAccumulation({
        initialInvestment: 0,
        monthlyContribution: 30_000,
        annualRate: 5,
        totalMonths: 120.5,
      }),
    ).toBeNull();
    expect(
      simulateAccumulation({
        initialInvestment: 0,
        monthlyContribution: 30_000,
        annualRate: 5,
        totalMonths: 721,
      }),
    ).toBeNull();
    expect(
      simulateAccumulation({
        initialInvestment: 0,
        monthlyContribution: 30_000,
        annualRate: 5,
        totalMonths: 720,
      }),
    ).not.toBeNull();
  });
});

describe('solveMonthlyContribution', () => {
  it('必要な毎月の積立額をsimulateAccumulationで検算すると目標額とほぼ一致する', () => {
    const initialInvestment = 500_000;
    const targetFutureValue = 20_000_000;
    const annualRate = 4;
    const totalMonths = 240;

    const monthlyContribution = solveMonthlyContribution({
      initialInvestment,
      targetFutureValue,
      annualRate,
      totalMonths,
    });

    expect(monthlyContribution).not.toBeNull();

    const check = simulateAccumulation({
      initialInvestment,
      monthlyContribution: monthlyContribution!,
      annualRate,
      totalMonths,
    });

    expect(check!.finalBalance).toBeCloseTo(targetFutureValue, 4);
  });

  it('初期投資額だけで目標額にすでに到達している場合は0を返す', () => {
    const monthlyContribution = solveMonthlyContribution({
      initialInvestment: 10_000_000,
      targetFutureValue: 11_000_000,
      annualRate: 5,
      totalMonths: 120,
    });

    expect(monthlyContribution).toBe(0);
  });

  it('年利0%でも計算できる', () => {
    const monthlyContribution = solveMonthlyContribution({
      initialInvestment: 0,
      targetFutureValue: 3_600_000,
      annualRate: 0,
      totalMonths: 120,
    });

    expect(monthlyContribution).toBeCloseTo(30_000, 6);
  });

  it('目標の資産額が0以下、積立期間が不正な場合はnull', () => {
    expect(
      solveMonthlyContribution({
        initialInvestment: 0,
        targetFutureValue: 0,
        annualRate: 5,
        totalMonths: 120,
      }),
    ).toBeNull();
    expect(
      solveMonthlyContribution({
        initialInvestment: 0,
        targetFutureValue: 1_000_000,
        annualRate: 5,
        totalMonths: 0,
      }),
    ).toBeNull();
  });
});

describe('solveMonthsToReachTarget', () => {
  it('必要な月数をsimulateAccumulationで検算すると目標額以上になる', () => {
    const initialInvestment = 0;
    const monthlyContribution = 30_000;
    const targetFutureValue = 5_000_000;
    const annualRate = 5;

    const months = solveMonthsToReachTarget({
      initialInvestment,
      monthlyContribution,
      targetFutureValue,
      annualRate,
    });

    expect(months).not.toBeNull();

    const check = simulateAccumulation({
      initialInvestment,
      monthlyContribution,
      annualRate,
      totalMonths: months!,
    });

    expect(check!.finalBalance).toBeGreaterThanOrEqual(targetFutureValue);

    // 1ヶ月前ではまだ目標額に届いていない（切り上げが正しく機能している）
    if (months! > 0) {
      const checkBefore = simulateAccumulation({
        initialInvestment,
        monthlyContribution,
        annualRate,
        totalMonths: months! - 1,
      });
      expect(checkBefore!.finalBalance).toBeLessThan(targetFutureValue);
    }
  });

  it('初期投資額だけで目標額にすでに到達している場合は0を返す', () => {
    const months = solveMonthsToReachTarget({
      initialInvestment: 10_000_000,
      monthlyContribution: 30_000,
      targetFutureValue: 5_000_000,
      annualRate: 5,
    });

    expect(months).toBe(0);
  });

  it('年利0%でも計算できる', () => {
    const months = solveMonthsToReachTarget({
      initialInvestment: 0,
      monthlyContribution: 30_000,
      targetFutureValue: 3_600_000,
      annualRate: 0,
    });

    expect(months).toBe(120);
  });

  it('年利0%かつ積立額が0の場合、目標額に届かなければnull', () => {
    expect(
      solveMonthsToReachTarget({
        initialInvestment: 1_000_000,
        monthlyContribution: 0,
        targetFutureValue: 5_000_000,
        annualRate: 0,
      }),
    ).toBeNull();
  });

  it('必要な月数が上限（720ヶ月）を超える場合はnull', () => {
    expect(
      solveMonthsToReachTarget({
        initialInvestment: 0,
        monthlyContribution: 100,
        targetFutureValue: 1_000_000_000,
        annualRate: 0,
      }),
    ).toBeNull();
  });

  it('初期投資額・毎月の積立額が両方0、または目標額が0以下の場合はnull', () => {
    expect(
      solveMonthsToReachTarget({
        initialInvestment: 0,
        monthlyContribution: 0,
        targetFutureValue: 5_000_000,
        annualRate: 5,
      }),
    ).toBeNull();
    expect(
      solveMonthsToReachTarget({
        initialInvestment: 0,
        monthlyContribution: 30_000,
        targetFutureValue: 0,
        annualRate: 5,
      }),
    ).toBeNull();
  });
});

describe('solveInitialInvestment', () => {
  it('必要な初期投資額をsimulateAccumulationで検算すると目標額とほぼ一致する', () => {
    const monthlyContribution = 30_000;
    const targetFutureValue = 20_000_000;
    const annualRate = 4;
    const totalMonths = 240;

    const initialInvestment = solveInitialInvestment({
      monthlyContribution,
      targetFutureValue,
      annualRate,
      totalMonths,
    });

    expect(initialInvestment).not.toBeNull();

    const check = simulateAccumulation({
      initialInvestment: initialInvestment!,
      monthlyContribution,
      annualRate,
      totalMonths,
    });

    expect(check!.finalBalance).toBeCloseTo(targetFutureValue, 4);
  });

  it('毎月の積立額だけで目標額にすでに到達している場合は0を返す', () => {
    const initialInvestment = solveInitialInvestment({
      monthlyContribution: 100_000,
      targetFutureValue: 1_000_000,
      annualRate: 5,
      totalMonths: 120,
    });

    expect(initialInvestment).toBe(0);
  });

  it('目標の資産額が0以下、積立期間が不正な場合はnull', () => {
    expect(
      solveInitialInvestment({
        monthlyContribution: 30_000,
        targetFutureValue: 0,
        annualRate: 5,
        totalMonths: 120,
      }),
    ).toBeNull();
    expect(
      solveInitialInvestment({
        monthlyContribution: 30_000,
        targetFutureValue: 1_000_000,
        annualRate: 5,
        totalMonths: 721,
      }),
    ).toBeNull();
  });
});

describe('calculateWithdrawal', () => {
  it('毎月の取り崩し額で取り崩し期間ちょうどに残高が0になる', () => {
    const principal = 20_000_000;
    const annualRate = 3;
    const withdrawalYears = 20;

    const result = calculateWithdrawal({
      principal,
      annualRate,
      withdrawalYears,
    });

    expect(result).not.toBeNull();
    expect(result!.yearly).toHaveLength(20);
    expect(result!.yearly[19].remainingBalance).toBeCloseTo(0, 4);
  });

  it('残高は年を追うごとに減少する', () => {
    const result = calculateWithdrawal({
      principal: 20_000_000,
      annualRate: 3,
      withdrawalYears: 20,
    });

    expect(result).not.toBeNull();
    for (let i = 1; i < result!.yearly.length; i++) {
      expect(result!.yearly[i].remainingBalance).toBeLessThan(
        result!.yearly[i - 1].remainingBalance,
      );
    }
  });

  it('年利0%の場合、取り崩し額は単純に残高を期間で割った額になる', () => {
    const result = calculateWithdrawal({
      principal: 12_000_000,
      annualRate: 0,
      withdrawalYears: 20,
    });

    expect(result).not.toBeNull();
    expect(result!.monthlyWithdrawal).toBeCloseTo(12_000_000 / 240, 6);
  });

  it('資産評価額が0以下、取り崩し期間が不正な場合はnull', () => {
    expect(
      calculateWithdrawal({
        principal: 0,
        annualRate: 3,
        withdrawalYears: 20,
      }),
    ).toBeNull();
    expect(
      calculateWithdrawal({
        principal: 20_000_000,
        annualRate: 3,
        withdrawalYears: 0,
      }),
    ).toBeNull();
    expect(
      calculateWithdrawal({
        principal: 20_000_000,
        annualRate: 3,
        withdrawalYears: 61,
      }),
    ).toBeNull();
  });
});

describe('simulateFixedAmountWithdrawal', () => {
  it('取り崩し額をcalculateWithdrawalの結果と同じ額にすると、ほぼ同じ月数で資産が尽きる', () => {
    const withdrawalResult = calculateWithdrawal({
      principal: 20_000_000,
      annualRate: 3,
      withdrawalYears: 20,
    });
    expect(withdrawalResult).not.toBeNull();

    const result = simulateFixedAmountWithdrawal({
      principal: 20_000_000,
      annualRate: 3,
      monthlyWithdrawal: withdrawalResult!.monthlyWithdrawal,
    });

    expect(result).not.toBeNull();
    expect(result!.depletionMonths).not.toBeNull();
    expect(result!.depletionMonths!).toBeGreaterThanOrEqual(239);
    expect(result!.depletionMonths!).toBeLessThanOrEqual(240);
  });

  it('運用益が取り崩し額を上回る場合、60年以内に資産は尽きない（depletionMonthsはnull）', () => {
    const result = simulateFixedAmountWithdrawal({
      principal: 20_000_000,
      annualRate: 5,
      monthlyWithdrawal: 10_000,
    });

    expect(result).not.toBeNull();
    expect(result!.depletionMonths).toBeNull();
    expect(result!.yearly.length).toBe(60);
    expect(
      result!.yearly[result!.yearly.length - 1].remainingBalance,
    ).toBeGreaterThan(20_000_000);
  });

  it('残高は年を追うごとに減少する（資産が尽きるケース）', () => {
    const result = simulateFixedAmountWithdrawal({
      principal: 20_000_000,
      annualRate: 3,
      monthlyWithdrawal: 150_000,
    });

    expect(result).not.toBeNull();
    for (let i = 1; i < result!.yearly.length; i++) {
      expect(result!.yearly[i].remainingBalance).toBeLessThanOrEqual(
        result!.yearly[i - 1].remainingBalance,
      );
    }
    expect(
      result!.yearly[result!.yearly.length - 1].remainingBalance,
    ).toBeCloseTo(0, 4);
  });

  it('資産評価額・取り崩し額が0以下の場合はnull', () => {
    expect(
      simulateFixedAmountWithdrawal({
        principal: 0,
        annualRate: 3,
        monthlyWithdrawal: 100_000,
      }),
    ).toBeNull();
    expect(
      simulateFixedAmountWithdrawal({
        principal: 20_000_000,
        annualRate: 3,
        monthlyWithdrawal: 0,
      }),
    ).toBeNull();
  });
});

describe('simulateFixedRateWithdrawal', () => {
  it('毎月の取り崩し額は残高に比例して減っていく', () => {
    const result = simulateFixedRateWithdrawal({
      principal: 20_000_000,
      annualRate: 3,
      withdrawalRate: 4,
      withdrawalYears: 20,
    });

    expect(result).not.toBeNull();
    for (let i = 1; i < result!.yearly.length; i++) {
      expect(result!.yearly[i].remainingBalance).toBeLessThan(
        result!.yearly[i - 1].remainingBalance,
      );
    }
    expect(result!.finalBalance).toBeGreaterThan(0);
    expect(result!.finalBalance).toBeLessThan(20_000_000);
  });

  it('年利0%の場合、1ヶ月目の取り崩し額は残高に月率を掛けた額になる', () => {
    const result = simulateFixedRateWithdrawal({
      principal: 12_000_000,
      annualRate: 0,
      withdrawalRate: 4,
      withdrawalYears: 10,
    });

    expect(result).not.toBeNull();
    expect(result!.firstMonthWithdrawal).toBeCloseTo(
      12_000_000 * (0.04 / 12),
      6,
    );
  });

  it('資産評価額が0以下、取り崩し率・シミュレーション期間が不正な場合はnull', () => {
    expect(
      simulateFixedRateWithdrawal({
        principal: 0,
        annualRate: 3,
        withdrawalRate: 4,
        withdrawalYears: 20,
      }),
    ).toBeNull();
    expect(
      simulateFixedRateWithdrawal({
        principal: 20_000_000,
        annualRate: 3,
        withdrawalRate: 0,
        withdrawalYears: 20,
      }),
    ).toBeNull();
    expect(
      simulateFixedRateWithdrawal({
        principal: 20_000_000,
        annualRate: 3,
        withdrawalRate: 4,
        withdrawalYears: 61,
      }),
    ).toBeNull();
  });
});
