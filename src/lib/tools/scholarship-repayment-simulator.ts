export type RepaymentMethod = 'fixed' | 'reviewed';

export interface ScholarshipRepaymentInput {
  /** 貸与総額（円） */
  totalLoanAmount: number;
  /** 貸与終了時に確定する適用利率（年利、%） */
  initialAnnualRate: number;
  /** 返還期間（年数、整数） */
  repaymentYears: number;
  /** 返還方式（利率固定方式 / 利率見直し方式） */
  method: RepaymentMethod;
  /**
   * 利率見直し方式で、5年ごとの利率見直し時に想定する利率の変化幅
   * （年利、%ポイント。正で上昇、負で低下）。利率固定方式では無視される
   */
  rateChangePerReview: number;
}

export interface ScholarshipRepaymentPeriod {
  /** 何回目の利率見直しか（0 = 貸与終了時に確定した当初の利率） */
  reviewNumber: number;
  /** この適用利率が開始する経過年数（1年目起点） */
  fromYear: number;
  /** この期間に適用される年利率（%） */
  annualRate: number;
  /** この期間の毎月の返済額（円） */
  monthlyPayment: number;
}

export interface ScholarshipRepaymentResult {
  /** 貸与終了時に確定した当初利率での毎月の返済額（円） */
  initialMonthlyPayment: number;
  /** 最後に適用される毎月の返済額（円。利率固定方式では当初と同額） */
  finalMonthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  repaymentMonths: number;
  /** 適用利率の期間ごとの内訳（利率固定方式では常に1件） */
  periods: ScholarshipRepaymentPeriod[];
}

/** JASSO利率見直し方式は概ね5年ごとに利率を見直す */
const REVIEW_INTERVAL_MONTHS = 60;
/** JASSO奨学金の最長返還期間の目安（20年） */
const MAX_REPAYMENT_YEARS = 20;

/** 元利均等返済における毎月の返済額を計算する */
function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  months: number,
): number {
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * JASSO第二種奨学金（利子付き）を想定し、元利均等返済で毎月の返済額・総返済額・総利息を簡易試算する。
 * 利率固定方式は当初利率のまま完済まで一定、利率見直し方式は5年ごとに
 * `rateChangePerReview`（%ポイント/回、0未満に下がる場合は0で下限）だけ利率が変化する前提で、
 * 見直しのたびに残高・残り期間から毎月の返済額を再計算する（利率以外の変化は考慮しない）。
 *
 * 貸与総額は0より大きく、利率は0以上、返還期間は1〜20の整数の年数である必要がある。
 * これらを満たさない、またはNaNが含まれる場合はnull。
 */
export function simulateScholarshipRepayment(
  input: ScholarshipRepaymentInput,
): ScholarshipRepaymentResult | null {
  const {
    totalLoanAmount,
    initialAnnualRate,
    repaymentYears,
    method,
    rateChangePerReview,
  } = input;

  if (
    !(totalLoanAmount > 0) ||
    !(initialAnnualRate >= 0) ||
    !Number.isInteger(repaymentYears) ||
    repaymentYears < 1 ||
    repaymentYears > MAX_REPAYMENT_YEARS ||
    !Number.isFinite(rateChangePerReview)
  )
    return null;

  const totalMonths = repaymentYears * 12;

  let balance = totalLoanAmount;
  let remainingMonths = totalMonths;
  let currentAnnualRate = initialAnnualRate;
  let currentMonthlyRate = currentAnnualRate / 100 / 12;
  let monthlyPayment = calculateMonthlyPayment(
    balance,
    currentMonthlyRate,
    remainingMonths,
  );

  if (!Number.isFinite(monthlyPayment)) return null;

  const periods: ScholarshipRepaymentPeriod[] = [
    {
      reviewNumber: 0,
      fromYear: 1,
      annualRate: currentAnnualRate,
      monthlyPayment,
    },
  ];

  let totalInterest = 0;
  let totalPayment = 0;
  let reviewNumber = 0;

  for (let month = 1; month <= totalMonths; month++) {
    if (
      method === 'reviewed' &&
      month > 1 &&
      (month - 1) % REVIEW_INTERVAL_MONTHS === 0
    ) {
      reviewNumber++;
      currentAnnualRate = Math.max(
        0,
        initialAnnualRate + rateChangePerReview * reviewNumber,
      );
      currentMonthlyRate = currentAnnualRate / 100 / 12;
      monthlyPayment = calculateMonthlyPayment(
        balance,
        currentMonthlyRate,
        remainingMonths,
      );
      if (!Number.isFinite(monthlyPayment)) return null;
      periods.push({
        reviewNumber,
        fromYear: Math.floor((month - 1) / 12) + 1,
        annualRate: currentAnnualRate,
        monthlyPayment,
      });
    }

    const interest = balance * currentMonthlyRate;
    const principalPortion = monthlyPayment - interest;
    balance -= principalPortion;
    remainingMonths--;
    totalInterest += interest;
    totalPayment += monthlyPayment;
  }

  return {
    initialMonthlyPayment: periods[0].monthlyPayment,
    finalMonthlyPayment: periods[periods.length - 1].monthlyPayment,
    totalPayment,
    totalInterest,
    repaymentMonths: totalMonths,
    periods,
  };
}
