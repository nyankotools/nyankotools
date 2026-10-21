import { calculateLoan } from './loan-calculator';

export interface RealEstateYieldInput {
  /** 物件価格（円） */
  price: number;
  /** 満室時の月額家賃収入（円） */
  monthlyRent: number;
  /** 空室率（%）。年間家賃収入から差し引く */
  vacancyPercent: number;
  /** 管理費・手数料（実際に入る家賃収入に対する%） */
  managementPercent: number;
  /** 年間の修繕費・積立金（円） */
  repairsPerYear: number;
  /** 年間の固定資産税・都市計画税（円） */
  propertyTaxPerYear: number;
  /** 年間のその他経費（保険料・共用部の光熱費など、円） */
  otherExpensesPerYear: number;
  /** 購入時の諸費用（物件価格に対する%） */
  purchaseCostPercent: number;
  /** 自己資金（円）。物件価格＋諸費用との差額を借入れる */
  equity: number;
  /** ローンの実質年率（%） */
  annualInterestRate: number;
  /** 返済期間（年、整数）。借入がある場合のみ使用 */
  loanYears: number;
}

export interface RealEstateYieldResult {
  /** 満室時の年間家賃収入 */
  annualGrossRent: number;
  /** 空室を見込んだ年間家賃収入 */
  effectiveRent: number;
  /** 年間の運営経費（管理費＋修繕＋税＋その他。ローン返済は含まない） */
  operatingExpenses: number;
  /** 年間の純収益（NOI = 家賃収入 - 運営経費） */
  noi: number;
  /** 購入諸費用 */
  purchaseCosts: number;
  /** 購入に必要な総額（物件価格＋諸費用） */
  totalInvestment: number;
  /** 借入額 */
  loanAmount: number;
  /** 初年度の毎月のローン返済額（元利均等） */
  monthlyLoanPayment: number;
  /** 年間のローン返済額 */
  annualLoanPayment: number;
  /** 表面利回り（%）= 満室時の年間家賃収入 / 物件価格 */
  grossYield: number;
  /** 実質利回り（%）= NOI / (物件価格 + 諸費用) */
  netYield: number;
  /** ローン返済後の年間キャッシュフロー */
  annualCashFlow: number;
  /** ローン返済後の月間キャッシュフロー */
  monthlyCashFlow: number;
  /** 自己資金に対する年間キャッシュフローの割合（%）。自己資金0ならnull */
  cashOnCash: number | null;
  /** 返済余裕率（DSCR）= NOI / 年間ローン返済額。借入なしならnull */
  dscr: number | null;
  /** ローン全期間の利息総額 */
  totalInterest: number;
}

const isFiniteNumber = (n: number) =>
  typeof n === 'number' && Number.isFinite(n);

/**
 * 不動産投資の利回りとキャッシュフローを試算する。
 * - 表面利回り: 満室時の年間家賃収入 / 物件価格
 * - 実質利回り: NOI / (物件価格 + 購入諸費用)
 * - 借入額: 物件価格 + 諸費用 - 自己資金（0以下なら借入なし）
 * - ローン返済: 既存の calculateLoan（元利均等）の初回返済額を使い、金利は一定で試算
 * 入力が不正な場合はnull。税金（所得税・住民税）や売却益は含まない。
 */
export function calculateRealEstateYield(
  input: RealEstateYieldInput,
): RealEstateYieldResult | null {
  const nums = [
    input.price,
    input.monthlyRent,
    input.vacancyPercent,
    input.managementPercent,
    input.repairsPerYear,
    input.propertyTaxPerYear,
    input.otherExpensesPerYear,
    input.purchaseCostPercent,
    input.equity,
    input.annualInterestRate,
    input.loanYears,
  ];
  if (!nums.every(isFiniteNumber)) return null;
  if (!(input.price > 0)) return null;
  if (input.monthlyRent < 0) return null;
  if (input.vacancyPercent < 0 || input.vacancyPercent > 100) return null;
  if (input.managementPercent < 0 || input.managementPercent > 100) return null;
  if (
    input.repairsPerYear < 0 ||
    input.propertyTaxPerYear < 0 ||
    input.otherExpensesPerYear < 0
  )
    return null;
  if (input.purchaseCostPercent < 0 || input.purchaseCostPercent > 30)
    return null;
  if (input.equity < 0) return null;
  if (input.annualInterestRate < 0 || input.annualInterestRate > 30)
    return null;

  const annualGrossRent = input.monthlyRent * 12;
  const effectiveRent = annualGrossRent * (1 - input.vacancyPercent / 100);
  const operatingExpenses =
    (effectiveRent * input.managementPercent) / 100 +
    input.repairsPerYear +
    input.propertyTaxPerYear +
    input.otherExpensesPerYear;
  const noi = effectiveRent - operatingExpenses;
  const purchaseCosts = (input.price * input.purchaseCostPercent) / 100;
  const totalInvestment = input.price + purchaseCosts;

  const loanAmount = Math.max(0, totalInvestment - input.equity);
  let monthlyLoanPayment = 0;
  let totalInterest = 0;
  if (loanAmount > 0) {
    if (!Number.isInteger(input.loanYears) || input.loanYears < 1) return null;
    const loan = calculateLoan({
      principal: loanAmount,
      annualInterestRate: input.annualInterestRate,
      method: 'equalPayment',
      months: input.loanYears * 12,
    });
    if (loan === null) return null;
    monthlyLoanPayment = loan.firstPayment;
    totalInterest = loan.totalInterest;
  }
  const annualLoanPayment = monthlyLoanPayment * 12;
  const annualCashFlow = noi - annualLoanPayment;
  const actualEquity = Math.min(input.equity, totalInvestment);

  return {
    annualGrossRent,
    effectiveRent,
    operatingExpenses,
    noi,
    purchaseCosts,
    totalInvestment,
    loanAmount,
    monthlyLoanPayment,
    annualLoanPayment,
    grossYield: (annualGrossRent / input.price) * 100,
    netYield: (noi / totalInvestment) * 100,
    annualCashFlow,
    monthlyCashFlow: annualCashFlow / 12,
    cashOnCash: actualEquity > 0 ? (annualCashFlow / actualEquity) * 100 : null,
    dscr: annualLoanPayment > 0 ? noi / annualLoanPayment : null,
    totalInterest,
  };
}
