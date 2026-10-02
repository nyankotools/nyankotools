import {
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_INCOME_LEVY_RATE,
  RESIDENT_TAX_PER_CAPITA_LEVY,
  basicDeductionIncomeTax,
  basicDeductionResidentTax,
  calculateIncomeTax,
  floorToThousand,
  incomeTaxMarginalRate,
  salaryIncomeDeduction,
} from './japan-income-tax';

/** 協会けんぽ平均の本人負担率（健康保険料率9.91%の半分） */
const HEALTH_INSURANCE_RATE = 0.04955;
/** 介護保険料率1.59%の半分（40〜64歳のみ） */
const NURSING_CARE_INSURANCE_RATE = 0.00795;
/** 厚生年金保険料率18.3%の半分 */
const PENSION_RATE = 0.0915;
/** 雇用保険の労働者負担率（一般の事業） */
const EMPLOYMENT_INSURANCE_RATE = 0.0055;
/** 標準報酬月額の上限（健康保険・厚生年金） */
const HEALTH_INSURANCE_MONTHLY_CAP = 1_390_000;
const PENSION_MONTHLY_CAP = 650_000;

export interface SalaryInput {
  /** 年間の給与収入（賞与込みの額面、円） */
  grossSalary: number;
  /** 40歳以上（介護保険料の対象）か */
  age40OrOver: boolean;
  /** 社会保険料の年間額がわかっている場合の実額（円）。null なら概算する */
  socialInsuranceOverride: number | null;
  /** 基礎控除以外の所得控除の合計（配偶者控除・扶養控除・生命保険料控除等、円） */
  otherDeductions: number;
}

export interface SalaryTaxBreakdown {
  salaryDeduction: number;
  /** 給与所得（給与収入－給与所得控除） */
  salaryIncome: number;
  socialInsurance: number;
  taxableIncomeForIncomeTax: number;
  incomeTax: number;
  reconstructionTax: number;
  taxableIncomeForResidentTax: number;
  /** 調整控除後の住民税所得割額 */
  residentTaxIncomeLevy: number;
  residentTaxPerCapitaLevy: number;
  residentTax: number;
  /** 課税所得に適用される所得税の限界税率（0.05〜0.45） */
  incomeTaxMarginalRate: number;
}

/** 給与収入に対する社会保険料（本人負担分）の年額を概算する。賞与込みで12等分した月額で上限判定する簡易計算 */
export function estimateSocialInsurance(
  grossSalary: number,
  age40OrOver: boolean,
): number {
  const monthly = grossSalary / 12;
  const healthBase = Math.min(monthly, HEALTH_INSURANCE_MONTHLY_CAP);
  const pensionBase = Math.min(monthly, PENSION_MONTHLY_CAP);
  const healthRate =
    HEALTH_INSURANCE_RATE + (age40OrOver ? NURSING_CARE_INSURANCE_RATE : 0);
  return Math.floor(
    healthBase * healthRate * 12 +
      pensionBase * PENSION_RATE * 12 +
      grossSalary * EMPLOYMENT_INSURANCE_RATE,
  );
}

/**
 * 住民税の調整控除額。人的控除額の差（基礎控除分の5万円のみを想定）に5%を掛ける。
 * 課税所得が200万円を超える場合は超過分だけ人的控除差を減らし、最低2,500円。
 */
function residentTaxAdjustmentCredit(taxableIncome: number): number {
  const personalDeductionDifference = 50_000;
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 2_000_000) {
    return Math.floor(
      Math.min(personalDeductionDifference, taxableIncome) * 0.05,
    );
  }
  return Math.max(
    2500,
    Math.floor(
      (personalDeductionDifference - (taxableIncome - 2_000_000)) * 0.05,
    ),
  );
}

/**
 * 給与所得者の所得税・復興特別所得税・住民税を概算する。
 * 給与収入・その他の所得控除・社会保険料の実額のいずれかが負、またはNaNの場合はnull。
 */
export function calculateSalaryTax(
  input: SalaryInput,
): SalaryTaxBreakdown | null {
  const { grossSalary, age40OrOver, socialInsuranceOverride, otherDeductions } =
    input;
  if (
    !Number.isFinite(grossSalary) ||
    !Number.isFinite(otherDeductions) ||
    grossSalary < 0 ||
    otherDeductions < 0 ||
    (socialInsuranceOverride !== null &&
      !(
        Number.isFinite(socialInsuranceOverride) && socialInsuranceOverride >= 0
      ))
  )
    return null;

  const salaryDeduction = salaryIncomeDeduction(grossSalary);
  const salaryIncome = Math.max(0, grossSalary - salaryDeduction);
  const socialInsurance =
    socialInsuranceOverride ??
    estimateSocialInsurance(grossSalary, age40OrOver);

  const taxableIncomeForIncomeTax = floorToThousand(
    Math.max(
      0,
      salaryIncome -
        basicDeductionIncomeTax(salaryIncome) -
        socialInsurance -
        otherDeductions,
    ),
  );
  const incomeTax = calculateIncomeTax(taxableIncomeForIncomeTax);
  const reconstructionTax = Math.floor(incomeTax * RECONSTRUCTION_TAX_RATE);

  const taxableIncomeForResidentTax = floorToThousand(
    Math.max(
      0,
      salaryIncome -
        basicDeductionResidentTax(salaryIncome) -
        socialInsurance -
        otherDeductions,
    ),
  );
  const residentTaxIncomeLevy = Math.max(
    0,
    Math.floor(taxableIncomeForResidentTax * RESIDENT_TAX_INCOME_LEVY_RATE) -
      residentTaxAdjustmentCredit(taxableIncomeForResidentTax),
  );
  const residentTaxPerCapitaLevy =
    grossSalary > 0 ? RESIDENT_TAX_PER_CAPITA_LEVY : 0;

  return {
    salaryDeduction,
    salaryIncome,
    socialInsurance,
    taxableIncomeForIncomeTax,
    incomeTax,
    reconstructionTax,
    taxableIncomeForResidentTax,
    residentTaxIncomeLevy,
    residentTaxPerCapitaLevy,
    residentTax: residentTaxIncomeLevy + residentTaxPerCapitaLevy,
    incomeTaxMarginalRate: incomeTaxMarginalRate(taxableIncomeForIncomeTax),
  };
}

export interface SalaryTakeHomeResult extends SalaryTaxBreakdown {
  totalTax: number;
  /** 手取り額（年間。給与収入－社会保険料－所得税等－住民税） */
  annualTakeHome: number;
  monthlyTakeHome: number;
  /** 額面に対する手取りの割合（%） */
  takeHomeRatio: number;
}

/** 会社員の額面年収から、社会保険料・所得税・住民税を差し引いた年間・月間の手取りを概算する */
export function calculateSalaryTakeHome(
  input: SalaryInput,
): SalaryTakeHomeResult | null {
  const tax = calculateSalaryTax(input);
  if (tax === null) return null;
  const totalTax = tax.incomeTax + tax.reconstructionTax + tax.residentTax;
  const annualTakeHome = input.grossSalary - tax.socialInsurance - totalTax;
  return {
    ...tax,
    totalTax,
    annualTakeHome,
    monthlyTakeHome: Math.floor(annualTakeHome / 12),
    takeHomeRatio:
      input.grossSalary > 0 ? (annualTakeHome / input.grossSalary) * 100 : 0,
  };
}
