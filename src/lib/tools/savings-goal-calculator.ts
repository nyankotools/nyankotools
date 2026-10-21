/** 受け付ける最大の積立期間（月数、60年） */
export const MAX_MONTHS = 720;
/** 受け付ける年利の上限（%） */
export const MAX_ANNUAL_RATE = 50;

export interface SavingsInput {
  /** 現在の貯金額・初期残高（円） */
  initialBalance: number;
  /** 毎月の積立額（円） */
  monthlyDeposit: number;
  /** 年利（%）。0も可 */
  annualRate: number;
  /** 期間（月数） */
  months: number;
}

export interface SavingsSnapshot {
  /** 経過月数 */
  months: number;
  /** 預入累計（初期残高＋積立累計、円） */
  deposited: number;
  /** 利息累計（円） */
  interest: number;
  /** 残高（円） */
  balance: number;
}

export interface SavingsResult {
  finalBalance: number;
  totalDeposit: number;
  totalInterest: number;
  /** 12ヶ月ごとの推移。期間が12の倍数でなければ最終月も追加する */
  yearly: SavingsSnapshot[];
}

function isValidRate(rate: number): boolean {
  return Number.isFinite(rate) && rate >= 0 && rate <= MAX_ANNUAL_RATE;
}

function isValidMonths(months: number): boolean {
  return Number.isInteger(months) && months >= 1 && months <= MAX_MONTHS;
}

/** n ヶ月後の残高（各月末に積立、月次複利）の閉形式 */
function balanceAfter(
  initial: number,
  monthly: number,
  monthlyRate: number,
  n: number,
): number {
  if (monthlyRate === 0) return initial + monthly * n;
  const g = Math.pow(1 + monthlyRate, n);
  return initial * g + monthly * ((g - 1) / monthlyRate);
}

/**
 * 順算：初期残高・毎月の積立額・年利・期間から最終残高を求める。
 * 積立は各月末に行い、利息は月利（年利÷12）で月次複利とする。
 * 初期残高・積立額は0以上で少なくとも一方は0より大きいこと。期間は1〜720ヶ月の整数。
 * 条件を満たさない、または結果が有限でない場合はnull。
 */
export function simulateSavings(input: SavingsInput): SavingsResult | null {
  const { initialBalance, monthlyDeposit, annualRate, months } = input;
  if (
    !(initialBalance >= 0) ||
    !(monthlyDeposit >= 0) ||
    !(initialBalance + monthlyDeposit > 0) ||
    !isValidRate(annualRate) ||
    !isValidMonths(months)
  )
    return null;

  const monthlyRate = annualRate / 100 / 12;
  let balance = initialBalance;
  let deposited = initialBalance;
  const yearly: SavingsSnapshot[] = [];

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthlyDeposit;
    deposited += monthlyDeposit;
    if (m % 12 === 0 || m === months) {
      yearly.push({
        months: m,
        deposited,
        interest: balance - deposited,
        balance,
      });
    }
  }

  if (!Number.isFinite(balance)) return null;
  return {
    finalBalance: balance,
    totalDeposit: deposited,
    totalInterest: balance - deposited,
    yearly,
  };
}

export interface SolveMonthlyInput {
  targetAmount: number;
  initialBalance: number;
  annualRate: number;
  months: number;
}

/**
 * 逆算：目標額に期間内で到達するために必要な毎月の積立額を求める。
 * 初期残高（と利息）だけで目標額に届く場合は0。目標額は0より大きいこと。
 * 条件を満たさない場合はnull。
 */
export function solveMonthlyDeposit(input: SolveMonthlyInput): number | null {
  const { targetAmount, initialBalance, annualRate, months } = input;
  if (
    !(targetAmount > 0) ||
    !(initialBalance >= 0) ||
    !isValidRate(annualRate) ||
    !isValidMonths(months)
  )
    return null;

  const monthlyRate = annualRate / 100 / 12;
  const grown = balanceAfter(initialBalance, 0, monthlyRate, months);
  const factor = balanceAfter(0, 1, monthlyRate, months);
  const monthly = Math.max(0, (targetAmount - grown) / factor);
  return Number.isFinite(monthly) ? monthly : null;
}

export interface SolveMonthsInput {
  targetAmount: number;
  initialBalance: number;
  monthlyDeposit: number;
  annualRate: number;
}

/**
 * 逆算：目標額に到達するまでに必要な月数（切り上げ）を求める。
 * すでに初期残高が目標額以上なら0。到達に720ヶ月を超える、
 * または到達しない（積立0かつ利率0など）場合はnull。
 */
export function solveMonthsToTarget(input: SolveMonthsInput): number | null {
  const { targetAmount, initialBalance, monthlyDeposit, annualRate } = input;
  if (
    !(targetAmount > 0) ||
    !(initialBalance >= 0) ||
    !(monthlyDeposit >= 0) ||
    !isValidRate(annualRate)
  )
    return null;
  if (initialBalance >= targetAmount) return 0;
  if (!(initialBalance + monthlyDeposit > 0)) return null;

  const monthlyRate = annualRate / 100 / 12;
  let estimate: number;
  if (monthlyRate === 0) {
    if (monthlyDeposit === 0) return null;
    estimate = (targetAmount - initialBalance) / monthlyDeposit;
  } else {
    const k = monthlyDeposit / monthlyRate;
    estimate =
      Math.log((targetAmount + k) / (initialBalance + k)) /
      Math.log(1 + monthlyRate);
  }
  if (!Number.isFinite(estimate)) return null;

  let n = Math.max(1, Math.ceil(estimate));
  if (n > MAX_MONTHS + 1) return null;
  // 浮動小数点誤差の補正
  while (
    n > 1 &&
    balanceAfter(initialBalance, monthlyDeposit, monthlyRate, n - 1) >=
      targetAmount
  )
    n--;
  while (
    n <= MAX_MONTHS &&
    balanceAfter(initialBalance, monthlyDeposit, monthlyRate, n) < targetAmount
  )
    n++;
  return n > MAX_MONTHS ? null : n;
}
