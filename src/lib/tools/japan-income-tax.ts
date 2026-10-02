/**
 * 日本の所得税・住民税の試算で共有する税制テーブル（令和7・8年分）。
 * 税制改正のたびに、このファイルの数値を更新する。
 */

/**
 * 所得税の基礎控除（令和7・8年分。令和7年度税制改正後）。
 * 合計所得金額が低いほど特例加算で増え、2,350万円超は従来どおり逓減して2,500万円超で0になる。
 * 特例加算のうち132万円超の区分は令和7・8年分の時限措置（令和9年分以後は58万円）。
 */
export function basicDeductionIncomeTax(totalIncome: number): number {
  if (totalIncome <= 1_320_000) return 950_000;
  if (totalIncome <= 3_360_000) return 880_000;
  if (totalIncome <= 4_890_000) return 680_000;
  if (totalIncome <= 6_550_000) return 630_000;
  if (totalIncome <= 23_500_000) return 580_000;
  if (totalIncome <= 24_000_000) return 480_000;
  if (totalIncome <= 24_500_000) return 320_000;
  if (totalIncome <= 25_000_000) return 160_000;
  return 0;
}

/** 住民税の基礎控除（令和8年度。令和7年度改正の対象外で従来どおり） */
export function basicDeductionResidentTax(totalIncome: number): number {
  if (totalIncome <= 24_000_000) return 430_000;
  if (totalIncome <= 24_500_000) return 290_000;
  if (totalIncome <= 25_000_000) return 150_000;
  return 0;
}

/** 課税所得は1,000円未満を切り捨てる */
export function floorToThousand(value: number): number {
  return Math.floor(value / 1000) * 1000;
}

/** 住民税均等割の目安額（自治体により若干異なる） */
export const RESIDENT_TAX_PER_CAPITA_LEVY = 5000;
export const RESIDENT_TAX_INCOME_LEVY_RATE = 0.1;
/** 復興特別所得税率（所得税額の2.1%、2013〜2037年） */
export const RECONSTRUCTION_TAX_RATE = 0.021;

interface IncomeTaxBracket {
  /** この段階の課税所得の上限（円、超過分は次の段階の税率が適用される） */
  upTo: number;
  rate: number;
  deduction: number;
}

/** 所得税の速算表（令和7・8年分も同じ。国税庁公表の税率区分に基づく） */
const INCOME_TAX_BRACKETS: IncomeTaxBracket[] = [
  { upTo: 1_949_000, rate: 0.05, deduction: 0 },
  { upTo: 3_299_000, rate: 0.1, deduction: 97_500 },
  { upTo: 6_949_000, rate: 0.2, deduction: 427_500 },
  { upTo: 8_999_000, rate: 0.23, deduction: 636_000 },
  { upTo: 17_999_000, rate: 0.33, deduction: 1_536_000 },
  { upTo: 39_999_000, rate: 0.4, deduction: 2_796_000 },
  { upTo: Infinity, rate: 0.45, deduction: 4_796_000 },
];

export function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.upTo)!;
  return Math.floor(taxableIncome * bracket.rate - bracket.deduction);
}

/** 課税所得に適用される所得税の限界税率（0.05〜0.45）。課税所得が0以下なら0 */
export function incomeTaxMarginalRate(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  return INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.upTo)!.rate;
}

/**
 * 給与所得控除額（令和7年分以後。最低保障額が65万円に引き上げ後）。
 * 給与収入が190万円以下は一律65万円、850万円超は上限195万円。
 */
export function salaryIncomeDeduction(grossSalary: number): number {
  if (grossSalary <= 1_900_000) return Math.min(grossSalary, 650_000);
  if (grossSalary <= 3_600_000) return Math.floor(grossSalary * 0.3 + 80_000);
  if (grossSalary <= 6_600_000) return Math.floor(grossSalary * 0.2 + 440_000);
  if (grossSalary <= 8_500_000)
    return Math.floor(grossSalary * 0.1 + 1_100_000);
  return 1_950_000;
}
