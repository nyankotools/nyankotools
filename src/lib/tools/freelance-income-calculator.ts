import {
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_INCOME_LEVY_RATE,
  RESIDENT_TAX_PER_CAPITA_LEVY,
  basicDeductionIncomeTax,
  basicDeductionResidentTax,
  calculateIncomeTax,
  floorToThousand,
} from './japan-income-tax';

export type BlueReturnDeduction = 0 | 100000 | 550000 | 650000;

export interface FreelanceIncomeInput {
  /** 年間の売上・報酬合計（円） */
  annualRevenue: number;
  /** 年間の必要経費（円） */
  annualExpenses: number;
  /** 青色申告特別控除額（白色申告・記帳内容に応じて0/10万/55万/65万円） */
  blueReturnDeduction: BlueReturnDeduction;
  /** 国民年金・国民健康保険等、社会保険料の年間支払額（円） */
  socialInsurancePayments: number;
  /** 基礎控除以外の所得控除の合計（配偶者控除・生命保険料控除等、円） */
  otherDeductions: number;
}

export interface FreelanceIncomeResult {
  /** 事業所得（売上－経費－青色申告特別控除、0円が下限） */
  businessIncome: number;
  taxableIncomeForIncomeTax: number;
  incomeTax: number;
  reconstructionTax: number;
  totalNationalTax: number;
  taxableIncomeForResidentTax: number;
  residentTaxIncomeLevy: number;
  residentTaxPerCapitaLevy: number;
  residentTax: number;
  totalTax: number;
  /** 手取り額（売上－経費－社会保険料－税金の合計） */
  netIncome: number;
  /** 売上に対する税負担割合（%） */
  effectiveTaxRate: number;
}

/**
 * フリーランス（個人事業主）の事業所得のみを前提に、所得税・復興特別所得税・住民税と
 * 手取り額を簡易試算する。給与所得等の他の所得、個人事業税、消費税、ふるさと納税、
 * iDeCo・小規模企業共済等掛金控除は考慮しない（「その他の所得控除」でまとめて入力する想定）。
 * 売上・経費・社会保険料・その他の所得控除のいずれかが負、またはNaNの場合はnull。
 */
export function calculateFreelanceIncome(
  input: FreelanceIncomeInput,
): FreelanceIncomeResult | null {
  const {
    annualRevenue,
    annualExpenses,
    blueReturnDeduction,
    socialInsurancePayments,
    otherDeductions,
  } = input;

  if (
    !(annualRevenue >= 0) ||
    !(annualExpenses >= 0) ||
    !(socialInsurancePayments >= 0) ||
    !(otherDeductions >= 0)
  )
    return null;

  const incomeBeforeBlueDeduction = Math.max(0, annualRevenue - annualExpenses);
  const businessIncome = Math.max(
    0,
    incomeBeforeBlueDeduction - blueReturnDeduction,
  );

  const taxableIncomeForIncomeTax = floorToThousand(
    Math.max(
      0,
      businessIncome -
        basicDeductionIncomeTax(businessIncome) -
        socialInsurancePayments -
        otherDeductions,
    ),
  );
  const incomeTax = calculateIncomeTax(taxableIncomeForIncomeTax);
  const reconstructionTax = Math.floor(incomeTax * RECONSTRUCTION_TAX_RATE);
  const totalNationalTax = incomeTax + reconstructionTax;

  const taxableIncomeForResidentTax = floorToThousand(
    Math.max(
      0,
      businessIncome -
        basicDeductionResidentTax(businessIncome) -
        socialInsurancePayments -
        otherDeductions,
    ),
  );
  const residentTaxIncomeLevy = Math.floor(
    taxableIncomeForResidentTax * RESIDENT_TAX_INCOME_LEVY_RATE,
  );
  const residentTaxPerCapitaLevy =
    businessIncome > 0 ? RESIDENT_TAX_PER_CAPITA_LEVY : 0;
  const residentTax = residentTaxIncomeLevy + residentTaxPerCapitaLevy;

  const totalTax = totalNationalTax + residentTax;
  const netIncome =
    annualRevenue - annualExpenses - socialInsurancePayments - totalTax;
  const effectiveTaxRate =
    annualRevenue > 0 ? (totalTax / annualRevenue) * 100 : 0;

  return {
    businessIncome,
    taxableIncomeForIncomeTax,
    incomeTax,
    reconstructionTax,
    totalNationalTax,
    taxableIncomeForResidentTax,
    residentTaxIncomeLevy,
    residentTaxPerCapitaLevy,
    residentTax,
    totalTax,
    netIncome,
    effectiveTaxRate,
  };
}
