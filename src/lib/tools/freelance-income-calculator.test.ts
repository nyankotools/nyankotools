import { describe, expect, it } from 'vitest';
import { calculateFreelanceIncome } from './freelance-income-calculator';

describe('calculateFreelanceIncome', () => {
  it('売上・経費・青色申告特別控除・社会保険料から税額と手取りを計算する', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 6_000_000,
      annualExpenses: 1_000_000,
      blueReturnDeduction: 650_000,
      socialInsurancePayments: 500_000,
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.businessIncome).toBe(4_350_000);
    expect(result!.taxableIncomeForIncomeTax).toBe(3_370_000);
    expect(result!.incomeTax).toBe(246_500);
    expect(result!.reconstructionTax).toBe(5_176);
    expect(result!.totalNationalTax).toBe(251_676);
    expect(result!.taxableIncomeForResidentTax).toBe(3_420_000);
    expect(result!.residentTaxIncomeLevy).toBe(342_000);
    expect(result!.residentTaxPerCapitaLevy).toBe(5_000);
    expect(result!.residentTax).toBe(347_000);
    expect(result!.totalTax).toBe(598_676);
    expect(result!.netIncome).toBe(3_901_324);
    expect(result!.effectiveTaxRate).toBeCloseTo(9.978, 2);
  });

  it('課税所得が0円以下なら所得税・住民税ともに0円になる', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 1_000_000,
      annualExpenses: 200_000,
      blueReturnDeduction: 650_000,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.businessIncome).toBe(150_000);
    expect(result!.incomeTax).toBe(0);
    expect(result!.reconstructionTax).toBe(0);
    expect(result!.residentTax).toBe(5_000); // 均等割のみ課税される
    expect(result!.netIncome).toBe(795_000);
  });

  it('経費が売上を上回る場合は事業所得0円・手取りはマイナスになる', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 1_000_000,
      annualExpenses: 1_200_000,
      blueReturnDeduction: 0,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.businessIncome).toBe(0);
    expect(result!.incomeTax).toBe(0);
    expect(result!.residentTax).toBe(0);
    expect(result!.netIncome).toBe(-200_000);
  });

  it('青色申告特別控除は事業所得を超えて赤字にはしない', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 100_000,
      annualExpenses: 0,
      blueReturnDeduction: 650_000,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.businessIncome).toBe(0);
  });

  it('高所得帯では45%の税率区分が適用される', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 50_000_000,
      annualExpenses: 0,
      blueReturnDeduction: 0,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.taxableIncomeForIncomeTax).toBe(49_520_000);
    expect(result!.incomeTax).toBe(Math.floor(49_520_000 * 0.45 - 4_796_000));
  });

  it('売上・経費・社会保険料・その他の所得控除が負の場合はnull', () => {
    const base = {
      annualRevenue: 5_000_000,
      annualExpenses: 1_000_000,
      blueReturnDeduction: 0 as const,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    };

    expect(calculateFreelanceIncome({ ...base, annualRevenue: -1 })).toBeNull();
    expect(
      calculateFreelanceIncome({ ...base, annualExpenses: -1 }),
    ).toBeNull();
    expect(
      calculateFreelanceIncome({ ...base, socialInsurancePayments: -1 }),
    ).toBeNull();
    expect(
      calculateFreelanceIncome({ ...base, otherDeductions: -1 }),
    ).toBeNull();
  });

  it('青色申告特別控除10万円・55万円の場合、事業所得が正しく計算される', () => {
    // 10万円の場合
    const result10 = calculateFreelanceIncome({
      annualRevenue: 2_000_000,
      annualExpenses: 500_000,
      blueReturnDeduction: 100_000,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });
    expect(result10).not.toBeNull();
    expect(result10!.businessIncome).toBe(1_400_000); // 2M - 500k - 100k

    // 55万円の場合
    const result55 = calculateFreelanceIncome({
      annualRevenue: 2_000_000,
      annualExpenses: 500_000,
      blueReturnDeduction: 550_000,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });
    expect(result55).not.toBeNull();
    expect(result55!.businessIncome).toBe(950_000); // 2M - 500k - 550k
  });

  it('社会保険料が大きいと課税所得が0になる', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 2_000_000,
      annualExpenses: 500_000,
      blueReturnDeduction: 0,
      socialInsurancePayments: 2_000_000, // 事業所得全体を超える社会保険料
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.businessIncome).toBe(1_500_000);
    expect(result!.taxableIncomeForIncomeTax).toBe(0); // 1.5M - 480k (basic) - 2M (social insurance)
    expect(result!.incomeTax).toBe(0);
    expect(result!.reconstructionTax).toBe(0);
  });

  it('その他の所得控除が大きいと課税所得が0になる', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 2_000_000,
      annualExpenses: 500_000,
      blueReturnDeduction: 0,
      socialInsurancePayments: 0,
      otherDeductions: 2_000_000, // 事業所得全体を超える控除
    });

    expect(result).not.toBeNull();
    expect(result!.businessIncome).toBe(1_500_000);
    expect(result!.taxableIncomeForIncomeTax).toBe(0); // 1.5M - 480k (basic) - 2M (other)
    expect(result!.incomeTax).toBe(0);
  });

  it('売上がゼロの場合、事業所得と所得税がゼロになる', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 0,
      annualExpenses: 0,
      blueReturnDeduction: 0,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.businessIncome).toBe(0);
    expect(result!.incomeTax).toBe(0);
    expect(result!.residentTax).toBe(0); // 均等割も非課税（businessIncome = 0）
    expect(result!.netIncome).toBe(0);
  });

  it('小数点を含む値でも正しく計算される', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 1_500_000.5,
      annualExpenses: 500_000.3,
      blueReturnDeduction: 0,
      socialInsurancePayments: 100_000.1,
      otherDeductions: 50_000.2,
    });

    expect(result).not.toBeNull();
    // businessIncome = 1500000.5 - 500000.3 = 1000000.2
    expect(result!.businessIncome).toBeCloseTo(1_000_000.2, 1);
    expect(result!.taxableIncomeForIncomeTax).toBeGreaterThanOrEqual(0);
  });

  it('税率区分の境界値付近で正しく計算される（1,949,000円付近）', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 2_500_000,
      annualExpenses: 0,
      blueReturnDeduction: 0,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    // businessIncome = 2.5M, taxableIncome = 2.5M - 480k = 2.02M
    // This is above the 1.949M bracket boundary
    expect(result!.taxableIncomeForIncomeTax).toBe(2_020_000);
    // Should use 10% bracket (rate: 0.1, deduction: 97500) = 2020000 * 0.1 - 97500 = 104500
    expect(result!.incomeTax).toBe(104_500);
  });

  it('住民税の均等割は事業所得がゼロの場合は課税されない', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 100_000,
      annualExpenses: 200_000,
      blueReturnDeduction: 0,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    expect(result!.businessIncome).toBe(0);
    expect(result!.residentTaxPerCapitaLevy).toBe(0); // 均等割は0
    expect(result!.residentTax).toBe(0);
  });

  it('NaNが含まれる場合はnullを返す', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: NaN,
      annualExpenses: 1_000_000,
      blueReturnDeduction: 0,
      socialInsurancePayments: 0,
      otherDeductions: 0,
    });

    expect(result).toBeNull();
  });

  it('実効税率が0%から100%の範囲の妥当な値である', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 5_000_000,
      annualExpenses: 1_000_000,
      blueReturnDeduction: 0,
      socialInsurancePayments: 1_000_000,
      otherDeductions: 500_000,
    });

    expect(result).not.toBeNull();
    expect(result!.effectiveTaxRate).toBeGreaterThanOrEqual(0);
    expect(result!.effectiveTaxRate).toBeLessThan(100);
  });

  it('手取り額の計算が正確である（売上 - 経費 - 社会保険料 - 税金）', () => {
    const result = calculateFreelanceIncome({
      annualRevenue: 3_000_000,
      annualExpenses: 800_000,
      blueReturnDeduction: 0,
      socialInsurancePayments: 400_000,
      otherDeductions: 0,
    });

    expect(result).not.toBeNull();
    const expectedNetIncome =
      3_000_000 - 800_000 - 400_000 - result!.totalTax;
    expect(result!.netIncome).toBe(expectedNetIncome);
  });
});
