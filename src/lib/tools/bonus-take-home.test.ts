import { describe, expect, it } from 'vitest';
import {
  BONUS_WITHHOLDING_TABLE,
  bonusWithholdingRate,
  calculateBonusTakeHome,
  estimateMonthlySocialInsurance,
} from './bonus-take-home';

describe('bonusWithholdingRate', () => {
  it('低い給与では0%', () => {
    expect(bonusWithholdingRate(60_000, 0)).toBe(0);
  });
  it('区分の境界は下限以上で次の行になる', () => {
    expect(bonusWithholdingRate(251_999, 0)).toBe(4.084);
    expect(bonusWithholdingRate(252_000, 0)).toBe(6.126);
  });
  it('扶養人数が増えると率が下がる', () => {
    expect(bonusWithholdingRate(300_000, 2)).toBeLessThan(
      bonusWithholdingRate(300_000, 0),
    );
  });
  it('7人を超える扶養は7人として扱う', () => {
    expect(bonusWithholdingRate(800_000, 12)).toBe(
      bonusWithholdingRate(800_000, 7),
    );
  });
  it('高給与では最高率', () => {
    expect(bonusWithholdingRate(3_000_000, 0)).toBe(45.945);
  });
  it('表の各行は扶養が増えるほど率が単調に下がる', () => {
    for (const [, rates] of BONUS_WITHHOLDING_TABLE) {
      for (let i = 1; i < rates.length; i++) {
        expect(rates[i]).toBeLessThanOrEqual(rates[i - 1]);
      }
    }
  });
});

describe('estimateMonthlySocialInsurance', () => {
  it('30万円の月給で約4.4万円', () => {
    expect(estimateMonthlySocialInsurance(300_000, false)).toBe(43_965);
  });
});

describe('calculateBonusTakeHome', () => {
  it('100万円の賞与（月給30万円・扶養なし・40歳未満）', () => {
    const r = calculateBonusTakeHome({
      bonusGross: 1_000_000,
      previousMonthSalary: 300_000,
      age40OrOver: false,
      dependents: 0,
    })!;
    expect(r.healthInsurance).toBe(49_550);
    expect(r.pension).toBe(91_500);
    expect(r.employmentInsurance).toBe(5_500);
    expect(r.socialInsurance).toBe(146_550);
    expect(r.withholdingRate).toBe(6.126);
    expect(r.incomeTax).toBe(52_282);
    expect(r.takeHome).toBe(801_168);
    expect(r.takeHomeRatio).toBeCloseTo(80.1168, 3);
  });

  it('40歳以上は介護保険料が加わる', () => {
    const base = calculateBonusTakeHome({
      bonusGross: 1_000_000,
      previousMonthSalary: 300_000,
      age40OrOver: false,
      dependents: 0,
    })!;
    const aged = calculateBonusTakeHome({
      bonusGross: 1_000_000,
      previousMonthSalary: 300_000,
      age40OrOver: true,
      dependents: 0,
    })!;
    expect(aged.nursingCare).toBe(7_950);
    expect(aged.socialInsurance).toBeGreaterThan(base.socialInsurance);
  });

  it('標準賞与額は1,000円未満を切り捨てる', () => {
    const r = calculateBonusTakeHome({
      bonusGross: 1_000_999,
      previousMonthSalary: 300_000,
      age40OrOver: false,
      dependents: 0,
    })!;
    expect(r.standardBonus).toBe(1_000_000);
    expect(r.healthInsurance).toBe(49_550);
  });

  it('厚生年金は1回150万円が上限', () => {
    const r = calculateBonusTakeHome({
      bonusGross: 3_000_000,
      previousMonthSalary: 400_000,
      age40OrOver: false,
      dependents: 0,
    })!;
    expect(r.pension).toBe(137_250);
  });

  it('健康保険は年度累計573万円が上限', () => {
    const r = calculateBonusTakeHome({
      bonusGross: 2_000_000,
      previousMonthSalary: 400_000,
      age40OrOver: false,
      dependents: 0,
      bonusPaidThisFiscalYear: 5_000_000,
    })!;
    // 573万円 - 500万円 = 73万円分のみ
    expect(r.healthInsurance).toBe(Math.ceil(730_000 * 0.04955 - 0.5));
    const over = calculateBonusTakeHome({
      bonusGross: 1_000_000,
      previousMonthSalary: 400_000,
      age40OrOver: false,
      dependents: 0,
      bonusPaidThisFiscalYear: 6_000_000,
    })!;
    expect(over.healthInsurance).toBe(0);
  });

  it('賞与0円は手取り0円、割合0%', () => {
    const r = calculateBonusTakeHome({
      bonusGross: 0,
      previousMonthSalary: 300_000,
      age40OrOver: false,
      dependents: 0,
    })!;
    expect(r.takeHome).toBe(0);
    expect(r.takeHomeRatio).toBe(0);
  });

  it('負・NaNの入力はnull', () => {
    const base = {
      bonusGross: 100_000,
      previousMonthSalary: 300_000,
      age40OrOver: false,
      dependents: 0,
    };
    expect(calculateBonusTakeHome({ ...base, bonusGross: -1 })).toBeNull();
    expect(
      calculateBonusTakeHome({ ...base, previousMonthSalary: NaN }),
    ).toBeNull();
    expect(calculateBonusTakeHome({ ...base, dependents: -1 })).toBeNull();
  });
});
