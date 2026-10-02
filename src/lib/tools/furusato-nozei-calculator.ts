import {
  calculateSalaryTax,
  type SalaryInput,
  type SalaryTaxBreakdown,
} from './salary-take-home-calculator';

/** ふるさと納税の自己負担額（円） */
export const FURUSATO_SELF_PAY = 2000;

export interface FurusatoResult {
  /** 自己負担2,000円で済む寄付額の上限の目安（円） */
  donationLimit: number;
  /** 寄付額の上限の目安から自己負担2,000円を除いた、控除される税額の合計（円） */
  deductibleTotal: number;
  /** 調整控除後の住民税所得割額（円） */
  residentTaxIncomeLevy: number;
  /** 所得税の限界税率（0.05〜0.45） */
  incomeTaxMarginalRate: number;
  tax: SalaryTaxBreakdown;
}

/**
 * 給与所得者のふるさと納税（ワンストップ特例または確定申告）の控除上限額を概算する。
 * 上限 = 住民税所得割額 × 20% ÷ (90% − 所得税の限界税率 × 1.021) + 2,000円。
 * 住宅ローン控除・配当控除・扶養に伴う調整控除の加算分などは考慮しない。
 * 入力が不正な場合はnull。
 */
export function calculateFurusatoLimit(
  input: SalaryInput,
): FurusatoResult | null {
  const tax = calculateSalaryTax(input);
  if (tax === null) return null;

  const levy = tax.residentTaxIncomeLevy;
  const donationLimit =
    levy > 0
      ? Math.floor(
          (levy * 0.2) / (0.9 - tax.incomeTaxMarginalRate * 1.021) +
            FURUSATO_SELF_PAY,
        )
      : 0;

  return {
    donationLimit,
    deductibleTotal: Math.max(0, donationLimit - FURUSATO_SELF_PAY),
    residentTaxIncomeLevy: levy,
    incomeTaxMarginalRate: tax.incomeTaxMarginalRate,
    tax,
  };
}
