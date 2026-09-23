export type PrepaymentType = 'shortenTerm' | 'reducePayment';

export interface MortgageInput {
  /** 繰り上げ返済前の借入残高（円） */
  remainingBalance: number;
  /** 適用金利（年利、%） */
  annualInterestRate: number;
  /** 残りの返済期間（月数、整数） */
  remainingMonths: number;
  /** 繰り上げ返済額（円） */
  prepaymentAmount: number;
  /** 繰り上げ返済の種類（期間短縮型 / 返済額軽減型） */
  prepaymentType: PrepaymentType;
}

export interface MortgageResult {
  /** 繰り上げ返済前の毎月の返済額（円、元利均等返済） */
  monthlyPaymentBefore: number;
  totalPaymentBefore: number;
  totalInterestBefore: number;
  /** 繰り上げ返済後の毎月の返済額（円。期間短縮型では変化しない） */
  monthlyPaymentAfter: number;
  /** 繰り上げ返済後の残り返済期間（月数。返済額軽減型では変化しない） */
  remainingMonthsAfter: number;
  totalPaymentAfter: number;
  totalInterestAfter: number;
  /** 利息軽減額（円） */
  interestSaved: number;
  /** 期間短縮型での短縮月数（返済額軽減型では0） */
  monthsShortened: number;
  /** 返済額軽減型での毎月の返済額の軽減額（円。期間短縮型では0） */
  monthlyPaymentReduced: number;
}

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
 * 元利均等返済で、指定の毎月返済額により残りの借入元金を完済するまでの月数を計算する
 * （期間短縮型の繰り上げ返済で、新しい残り期間を逆算するのに使う）
 */
function calculateMonthsToPayOff(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
): number {
  if (monthlyRate === 0) return principal / monthlyPayment;
  return (
    Math.log(monthlyPayment / (monthlyPayment - monthlyRate * principal)) /
    Math.log(1 + monthlyRate)
  );
}

/** 残りの返済期間として受け付ける最大月数（50年） */
const MAX_REMAINING_MONTHS = 600;

/**
 * 住宅ローンの繰り上げ返済（期間短縮型 / 返済額軽減型）による効果を、
 * 元利均等返済を前提に簡易試算する。
 * 借入残高・繰り上げ返済額は0より大きい必要があり、繰り上げ返済額は借入残高未満である必要がある。
 * 金利は0以上、残りの返済期間は1〜600（50年）の整数の月数である必要がある。
 * これらを満たさない、またはNaNが含まれる場合はnull。
 */
export function calculateMortgagePrepayment(
  input: MortgageInput,
): MortgageResult | null {
  const {
    remainingBalance,
    annualInterestRate,
    remainingMonths,
    prepaymentAmount,
    prepaymentType,
  } = input;

  if (
    !(remainingBalance > 0) ||
    !(annualInterestRate >= 0) ||
    !Number.isInteger(remainingMonths) ||
    remainingMonths < 1 ||
    remainingMonths > MAX_REMAINING_MONTHS ||
    !(prepaymentAmount > 0) ||
    !(prepaymentAmount < remainingBalance)
  )
    return null;

  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyPaymentBefore = calculateMonthlyPayment(
    remainingBalance,
    monthlyRate,
    remainingMonths,
  );
  const totalPaymentBefore = monthlyPaymentBefore * remainingMonths;
  const totalInterestBefore = totalPaymentBefore - remainingBalance;

  const newPrincipal = remainingBalance - prepaymentAmount;

  let monthlyPaymentAfter: number;
  let remainingMonthsAfter: number;

  if (prepaymentType === 'shortenTerm') {
    monthlyPaymentAfter = monthlyPaymentBefore;
    // newPrincipal > 0（prepaymentAmount < remainingBalanceで保証）なので、
    // 完済までの月数は必ず1以上になる
    remainingMonthsAfter = Math.max(
      1,
      Math.round(
        calculateMonthsToPayOff(
          newPrincipal,
          monthlyRate,
          monthlyPaymentBefore,
        ),
      ),
    );
  } else {
    remainingMonthsAfter = remainingMonths;
    monthlyPaymentAfter = calculateMonthlyPayment(
      newPrincipal,
      monthlyRate,
      remainingMonths,
    );
  }

  const totalPaymentAfter =
    prepaymentAmount + monthlyPaymentAfter * remainingMonthsAfter;
  const totalInterestAfter = totalPaymentAfter - remainingBalance;
  const interestSaved = totalInterestBefore - totalInterestAfter;

  if (
    !Number.isFinite(monthlyPaymentBefore) ||
    !Number.isFinite(monthlyPaymentAfter) ||
    !Number.isFinite(totalInterestAfter)
  )
    return null;

  return {
    monthlyPaymentBefore,
    totalPaymentBefore,
    totalInterestBefore,
    monthlyPaymentAfter,
    remainingMonthsAfter,
    totalPaymentAfter,
    totalInterestAfter,
    interestSaved,
    monthsShortened:
      prepaymentType === 'shortenTerm'
        ? remainingMonths - remainingMonthsAfter
        : 0,
    monthlyPaymentReduced:
      prepaymentType === 'reducePayment'
        ? monthlyPaymentBefore - monthlyPaymentAfter
        : 0,
  };
}
