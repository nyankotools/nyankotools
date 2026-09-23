export type BlueReturnDeduction = 0 | 100000 | 550000 | 650000;

/** 所得税の基礎控除（令和6年分。合計所得金額2,400万円以下を想定） */
const BASIC_DEDUCTION_INCOME_TAX = 480000;
/** 住民税の基礎控除（令和6年度。合計所得金額2,400万円以下を想定） */
const BASIC_DEDUCTION_RESIDENT_TAX = 430000;
/** 住民税均等割の目安額（自治体により若干異なる） */
const RESIDENT_TAX_PER_CAPITA_LEVY = 5000;
const RESIDENT_TAX_INCOME_LEVY_RATE = 0.1;
/** 復興特別所得税率（所得税額の2.1%、2013〜2037年） */
const RECONSTRUCTION_TAX_RATE = 0.021;

interface IncomeTaxBracket {
  /** この段階の課税所得の上限（円、超過分は次の段階の税率が適用される） */
  upTo: number;
  rate: number;
  deduction: number;
}

/** 所得税の速算表（令和6年分。国税庁公表の税率区分に基づく） */
const INCOME_TAX_BRACKETS: IncomeTaxBracket[] = [
  { upTo: 1_949_000, rate: 0.05, deduction: 0 },
  { upTo: 3_299_000, rate: 0.1, deduction: 97_500 },
  { upTo: 6_949_000, rate: 0.2, deduction: 427_500 },
  { upTo: 8_999_000, rate: 0.23, deduction: 636_000 },
  { upTo: 17_999_000, rate: 0.33, deduction: 1_536_000 },
  { upTo: 39_999_000, rate: 0.4, deduction: 2_796_000 },
  { upTo: Infinity, rate: 0.45, deduction: 4_796_000 },
];

function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.upTo)!;
  return Math.floor(taxableIncome * bracket.rate - bracket.deduction);
}

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

  const taxableIncomeForIncomeTax = Math.max(
    0,
    businessIncome -
      BASIC_DEDUCTION_INCOME_TAX -
      socialInsurancePayments -
      otherDeductions,
  );
  const incomeTax = calculateIncomeTax(taxableIncomeForIncomeTax);
  const reconstructionTax = Math.floor(incomeTax * RECONSTRUCTION_TAX_RATE);
  const totalNationalTax = incomeTax + reconstructionTax;

  const taxableIncomeForResidentTax = Math.max(
    0,
    businessIncome -
      BASIC_DEDUCTION_RESIDENT_TAX -
      socialInsurancePayments -
      otherDeductions,
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
