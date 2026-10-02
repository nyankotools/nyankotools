import { describe, expect, it } from 'vitest';
import {
  calculateSalaryTakeHome,
  estimateSocialInsurance,
} from './salary-take-home-calculator';
import { salaryIncomeDeduction } from './japan-income-tax';

const base = {
  grossSalary: 5_000_000,
  age40OrOver: false,
  socialInsuranceOverride: null,
  otherDeductions: 0,
};

describe('salaryIncomeDeduction', () => {
  it('190万円以下は65万円（収入が65万円未満ならその額）', () => {
    expect(salaryIncomeDeduction(1_900_000)).toBe(650_000);
    expect(salaryIncomeDeduction(500_000)).toBe(500_000);
  });
  it('区分の境目で連続している', () => {
    expect(salaryIncomeDeduction(3_600_000)).toBe(1_160_000);
    expect(salaryIncomeDeduction(6_600_000)).toBe(1_760_000);
    expect(salaryIncomeDeduction(8_500_000)).toBe(1_950_000);
    expect(salaryIncomeDeduction(20_000_000)).toBe(1_950_000);
  });
});

describe('estimateSocialInsurance', () => {
  it('40歳以上は介護保険料の分だけ増える', () => {
    expect(estimateSocialInsurance(5_000_000, true)).toBeGreaterThan(
      estimateSocialInsurance(5_000_000, false),
    );
  });
  it('年収500万円で額面の約14.6%', () => {
    const ratio = estimateSocialInsurance(5_000_000, false) / 5_000_000;
    expect(ratio).toBeGreaterThan(0.14);
    expect(ratio).toBeLessThan(0.15);
  });
  it('健康保険・厚生年金の上限を超えると頭打ちになる', () => {
    const a = estimateSocialInsurance(20_000_000, false);
    const b = estimateSocialInsurance(30_000_000, false);
    // 健康保険・厚生年金は上限超過分が増えず、雇用保険分だけ増える
    expect(b - a).toBeLessThan(10_000_000 * 0.0055 + 1000);
  });
});

describe('calculateSalaryTakeHome', () => {
  it('年収500万円の手取りが概ね400万円弱になる', () => {
    const r = calculateSalaryTakeHome(base)!;
    expect(r.salaryIncome).toBe(3_560_000);
    expect(r.incomeTax).toBeGreaterThan(0);
    expect(r.annualTakeHome).toBeGreaterThan(3_800_000);
    expect(r.annualTakeHome).toBeLessThan(4_100_000);
    expect(r.monthlyTakeHome).toBe(Math.floor(r.annualTakeHome / 12));
  });
  it('社会保険料の実額を指定するとその値を使う', () => {
    const r = calculateSalaryTakeHome({
      ...base,
      socialInsuranceOverride: 700_000,
    })!;
    expect(r.socialInsurance).toBe(700_000);
  });
  it('その他の所得控除を増やすと税金が減る', () => {
    const a = calculateSalaryTakeHome(base)!;
    const b = calculateSalaryTakeHome({ ...base, otherDeductions: 380_000 })!;
    expect(b.totalTax).toBeLessThan(a.totalTax);
  });
  it('年収0円は手取り0円', () => {
    const r = calculateSalaryTakeHome({ ...base, grossSalary: 0 })!;
    expect(r.annualTakeHome).toBe(0);
    expect(r.totalTax).toBe(0);
    expect(r.takeHomeRatio).toBe(0);
  });
  it('負の値・NaN・Infinityはnull', () => {
    expect(
      calculateSalaryTakeHome({ ...base, grossSalary: Infinity }),
    ).toBeNull();
    expect(calculateSalaryTakeHome({ ...base, grossSalary: -1 })).toBeNull();
    expect(
      calculateSalaryTakeHome({ ...base, otherDeductions: Number.NaN }),
    ).toBeNull();
    expect(
      calculateSalaryTakeHome({ ...base, socialInsuranceOverride: -5 }),
    ).toBeNull();
  });
  it('非常に大きい値（十億円超）でも計算できる', () => {
    const r = calculateSalaryTakeHome({
      ...base,
      grossSalary: 10_000_000_000,
    })!;
    expect(r).not.toBeNull();
    expect(r.annualTakeHome).toBeGreaterThan(0);
    expect(r.annualTakeHome).toBeLessThan(10_000_000_000);
  });
  it('社会保険料実額が0円でも計算できる', () => {
    const r = calculateSalaryTakeHome({
      ...base,
      socialInsuranceOverride: 0,
    })!;
    expect(r).not.toBeNull();
    expect(r.socialInsurance).toBe(0);
    expect(r.annualTakeHome).toBeGreaterThan(3_500_000);
  });
});
