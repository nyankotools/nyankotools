import { describe, expect, it } from 'vitest';
import {
  calculateTaxWall,
  findTakeHomeCliffs,
  salaryAtIncomeLimit,
  spouseDeductionIncomeTax,
  spouseDeductionResidentTax,
  wallStatuses,
  type TaxWallInput,
} from './tax-wall-calculator';

const base: TaxWallInput = {
  grossSalary: 1_000_000,
  age40OrOver: false,
  employerInsuranceFrom106: false,
  spouseClass: 'upTo9m',
  spouseMarginalRate: 0.1,
  nationalHealthOverride: null,
};

describe('salaryAtIncomeLimit', () => {
  it('給与所得58万円以下は年収123万円まで', () => {
    expect(salaryAtIncomeLimit(580_000)).toBe(1_230_000);
  });
  it('給与所得95万円以下は年収160万円まで', () => {
    expect(salaryAtIncomeLimit(950_000)).toBe(1_600_000);
  });
  it('給与所得133万円以下は年収約201万円まで', () => {
    const limit = salaryAtIncomeLimit(1_330_000);
    expect(limit).toBeGreaterThan(2_010_000);
    expect(limit).toBeLessThan(2_020_000);
  });
});

describe('spouseDeduction', () => {
  it('配偶者の合計所得58万円以下は38万円', () => {
    expect(spouseDeductionIncomeTax(580_000, 'upTo9m')).toBe(380_000);
  });
  it('58万円超95万円以下も満額38万円', () => {
    expect(spouseDeductionIncomeTax(950_000, 'upTo9m')).toBe(380_000);
  });
  it('95万円超から段階的に減る', () => {
    expect(spouseDeductionIncomeTax(950_001, 'upTo9m')).toBe(360_000);
    expect(spouseDeductionIncomeTax(1_300_000, 'upTo9m')).toBe(60_000);
    expect(spouseDeductionIncomeTax(1_330_000, 'upTo9m')).toBe(30_000);
    expect(spouseDeductionIncomeTax(1_330_001, 'upTo9m')).toBe(0);
  });
  it('納税者の所得が高い区分は減額される', () => {
    expect(spouseDeductionIncomeTax(500_000, 'upTo9_5m')).toBe(260_000);
    expect(spouseDeductionIncomeTax(1_000_000, 'upTo9_5m')).toBe(240_000);
    expect(spouseDeductionIncomeTax(1_330_000, 'upTo10m')).toBe(10_000);
    expect(spouseDeductionIncomeTax(500_000, 'upTo10m')).toBe(130_000);
  });
  it('配偶者なしは0', () => {
    expect(spouseDeductionIncomeTax(500_000, 'none')).toBe(0);
  });
  it('住民税の満額は33万円', () => {
    expect(spouseDeductionResidentTax(500_000, 'upTo9m')).toBe(330_000);
    expect(spouseDeductionResidentTax(1_100_000, 'upTo9m')).toBe(260_000);
  });
});

describe('wallStatuses', () => {
  it('年収105万円では106万円の壁に達していない', () => {
    const w = wallStatuses(1_050_000, base);
    expect(w.find((x) => x.id === 'social-insurance')!.exceeded).toBe(false);
  });
  it('106万円ちょうどで達する', () => {
    const w = wallStatuses(1_060_000, base);
    expect(w.find((x) => x.id === 'social-insurance')!.exceeded).toBe(true);
  });
  it('130万円未満は扶養内、130万円で達する', () => {
    expect(
      wallStatuses(1_299_999, base).find((x) => x.id === 'dependent')!.exceeded,
    ).toBe(false);
    expect(
      wallStatuses(1_300_000, base).find((x) => x.id === 'dependent')!.exceeded,
    ).toBe(true);
  });
  it('所得税の壁と配偶者特別控除の満額は160万円', () => {
    const w = wallStatuses(1_600_000, base);
    expect(w.find((x) => x.id === 'income-tax')).toMatchObject({
      threshold: 1_600_000,
      exceeded: false,
    });
    expect(
      wallStatuses(1_600_001, base).find((x) => x.id === 'income-tax')!
        .exceeded,
    ).toBe(true);
  });
  it('配偶者なしだと配偶者の壁は対象外', () => {
    const w = wallStatuses(1_000_000, { ...base, spouseClass: 'none' });
    expect(w.find((x) => x.id === 'spouse-special-full')!.applicable).toBe(
      false,
    );
  });
});

describe('calculateTaxWall', () => {
  it('扶養内の年収90万円は社会保険料0で所得税0', () => {
    const r = calculateTaxWall({ ...base, grossSalary: 900_000 })!;
    expect(r.insuranceStatus).toBe('dependent');
    expect(r.socialInsurance).toBe(0);
    expect(r.incomeTax).toBe(0);
    expect(r.residentTax).toBe(0);
    expect(r.takeHome).toBe(900_000);
    expect(r.spouseDeduction).toBe(380_000);
  });
  it('106万円の対象で106万円以上なら社会保険に加入する', () => {
    const r = calculateTaxWall({
      ...base,
      grossSalary: 1_100_000,
      employerInsuranceFrom106: true,
    })!;
    expect(r.insuranceStatus).toBe('employer');
    expect(r.socialInsurance).toBeGreaterThan(150_000);
  });
  it('106万円の対象外なら110万円でも扶養のまま', () => {
    const r = calculateTaxWall({ ...base, grossSalary: 1_100_000 })!;
    expect(r.insuranceStatus).toBe('dependent');
  });
  it('130万円以上で社会保険に入らなければ国保・国民年金', () => {
    const r = calculateTaxWall({ ...base, grossSalary: 1_300_000 })!;
    expect(r.insuranceStatus).toBe('national');
    expect(r.socialInsurance).toBeGreaterThan(215_040);
  });
  it('国民健康保険料の実額を使える', () => {
    const r = calculateTaxWall({
      ...base,
      grossSalary: 1_300_000,
      nationalHealthOverride: 100_000,
    })!;
    expect(r.socialInsurance).toBe(100_000 + 215_040);
  });
  it('配偶者側の税の軽減額は税率に比例して増える', () => {
    const low = calculateTaxWall({ ...base, spouseMarginalRate: 0.05 })!;
    const high = calculateTaxWall({ ...base, spouseMarginalRate: 0.33 })!;
    expect(high.spouseTaxSaving).toBeGreaterThan(low.spouseTaxSaving);
    expect(high.householdTakeHome).toBe(high.takeHome + high.spouseTaxSaving);
  });
  it('年収0でも計算できる', () => {
    const r = calculateTaxWall({ ...base, grossSalary: 0 })!;
    expect(r.takeHome).toBe(0);
  });
  it('不正な入力はnull', () => {
    expect(calculateTaxWall({ ...base, grossSalary: -1 })).toBeNull();
    expect(calculateTaxWall({ ...base, grossSalary: NaN })).toBeNull();
    expect(calculateTaxWall({ ...base, spouseMarginalRate: 0.5 })).toBeNull();
    expect(
      calculateTaxWall({ ...base, nationalHealthOverride: -5 }),
    ).toBeNull();
  });
});

describe('findTakeHomeCliffs', () => {
  it('106万円の対象なら106万円で手取りが逆転し、元に戻る年収が見つかる', () => {
    const cliffs = findTakeHomeCliffs({
      ...base,
      employerInsuranceFrom106: true,
    })!;
    const c = cliffs.find((x) => x.afterIncome === 1_060_000)!;
    expect(c).toBeDefined();
    expect(c.drop).toBeGreaterThan(100_000);
    expect(c.recoverIncome).not.toBeNull();
    expect(c.recoverIncome!).toBeGreaterThan(1_100_000);
  });
  it('106万円の対象外なら106万円の逆転はなく、130万円で逆転する', () => {
    const cliffs = findTakeHomeCliffs(base)!;
    expect(cliffs.some((x) => x.afterIncome === 1_060_000)).toBe(false);
    const c = cliffs.find((x) => x.afterIncome === 1_300_000)!;
    expect(c).toBeDefined();
    expect(c.drop).toBeGreaterThan(150_000);
    expect(c.recoverIncome!).toBeGreaterThan(1_400_000);
  });
  it('年収のあと手取りが回復した年収では手取りが壁前を上回る', () => {
    const cliffs = findTakeHomeCliffs(base)!;
    const c = cliffs.find((x) => x.afterIncome === 1_300_000)!;
    const r = calculateTaxWall({ ...base, grossSalary: c.recoverIncome! })!;
    expect(r.householdTakeHome).toBeGreaterThanOrEqual(c.beforeTakeHome);
  });
  it('不正な入力はnull', () => {
    expect(findTakeHomeCliffs({ ...base, grossSalary: NaN })).toBeNull();
  });
});
