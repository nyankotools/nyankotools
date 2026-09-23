/** 積立期間として受け付ける最大月数（60年） */
const MAX_MONTHS = 720;
/** 想定利回りとして受け付ける最大値（年率、%） */
const MAX_ANNUAL_RATE = 50;

function isValidAnnualRate(annualRate: number): boolean {
  return annualRate >= 0 && annualRate <= MAX_ANNUAL_RATE;
}

/** 積立期間を通じて一定と仮定する場合の、月次複利の年金終価（期首払い）係数を返す */
function annuityDueFactor(monthlyRate: number, totalMonths: number): number {
  if (monthlyRate === 0) return totalMonths;
  return (
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate)
  );
}

// ---- 積立シミュレーション（順算：将来の資産額を計算する） ----

export interface AccumulationInput {
  /** 初期投資額（円） */
  initialInvestment: number;
  /** 毎月の積立額（円） */
  monthlyContribution: number;
  /** 想定利回り（年率、%） */
  annualRate: number;
  /** 積立期間（月数） */
  totalMonths: number;
}

export interface AccumulationSnapshot {
  /** 経過月数 */
  months: number;
  /** その時点までの元本（初期投資額＋積立累計額） */
  principal: number;
  /** その時点での資産評価額（円） */
  balance: number;
  /** その時点での運用益（円） */
  gain: number;
}

export interface AccumulationResult {
  /** 積立終了時点の資産評価額（円） */
  finalBalance: number;
  /** 元本合計（初期投資額＋積立累計額、円） */
  totalPrincipal: number;
  /** 運用益（円） */
  totalGain: number;
  /**
   * 12ヶ月ごとの推移。積立期間が12の倍数でない場合は、
   * 最後に端数月時点のスナップショットも追加する。
   */
  yearly: AccumulationSnapshot[];
}

/**
 * 初期投資額と毎月の積立額を、月次複利で運用した場合の将来の資産額を試算する。
 * 各月の月初に積立額を投入し、その月の運用益をその積立額にも加える方式
 * （年金終価、いわゆる期首払い）で計算する。初期投資額は積立開始時点から運用される。
 * 初期投資額・毎月の積立額はいずれも0以上で、少なくとも一方は0より大きい必要がある。
 * 想定利回りは0以上MAX_ANNUAL_RATE(%)以下、積立期間は0以上MAX_MONTHS(720ヶ月＝60年)以下の
 * 整数月である必要がある。これらを満たさない、または計算結果が有限でない場合はnull。
 */
export function simulateAccumulation(
  input: AccumulationInput,
): AccumulationResult | null {
  const { initialInvestment, monthlyContribution, annualRate, totalMonths } =
    input;

  if (
    !(initialInvestment >= 0) ||
    !(monthlyContribution >= 0) ||
    !(initialInvestment + monthlyContribution > 0) ||
    !isValidAnnualRate(annualRate) ||
    !Number.isInteger(totalMonths) ||
    totalMonths < 0 ||
    totalMonths > MAX_MONTHS
  )
    return null;

  const monthlyRate = annualRate / 100 / 12;

  let balance = initialInvestment;
  let principalTotal = initialInvestment;
  const yearly: AccumulationSnapshot[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    balance += monthlyContribution;
    principalTotal += monthlyContribution;
    balance *= 1 + monthlyRate;

    if (month % 12 === 0) {
      yearly.push({
        months: month,
        principal: principalTotal,
        balance,
        gain: balance - principalTotal,
      });
    }
  }

  if (totalMonths === 0 || totalMonths % 12 !== 0) {
    yearly.push({
      months: totalMonths,
      principal: principalTotal,
      balance,
      gain: balance - principalTotal,
    });
  }

  if (!Number.isFinite(balance)) return null;

  return {
    finalBalance: balance,
    totalPrincipal: principalTotal,
    totalGain: balance - principalTotal,
    yearly,
  };
}

// ---- 逆算：毎月の積立額を計算する ----

export interface SolveMonthlyContributionInput {
  initialInvestment: number;
  targetFutureValue: number;
  annualRate: number;
  totalMonths: number;
}

/**
 * 目標の資産額・初期投資額・想定利回り・積立期間から、必要な毎月の積立額を逆算する。
 * 初期投資額だけで目標の資産額に到達している場合は0を返す。
 * 目標の資産額は0より大きく、初期投資額は0以上、積立期間は1以上MAX_MONTHS以下の整数月、
 * 想定利回りは0以上MAX_ANNUAL_RATE(%)以下である必要がある。これらを満たさない、
 * または計算結果が有限でない場合はnull。
 */
export function solveMonthlyContribution(
  input: SolveMonthlyContributionInput,
): number | null {
  const { initialInvestment, targetFutureValue, annualRate, totalMonths } =
    input;

  if (
    !(initialInvestment >= 0) ||
    !(targetFutureValue > 0) ||
    !isValidAnnualRate(annualRate) ||
    !Number.isInteger(totalMonths) ||
    totalMonths < 1 ||
    totalMonths > MAX_MONTHS
  )
    return null;

  const monthlyRate = annualRate / 100 / 12;
  const growthFactor = Math.pow(1 + monthlyRate, totalMonths);
  const annuityFactor = annuityDueFactor(monthlyRate, totalMonths);

  const monthlyContribution = Math.max(
    0,
    (targetFutureValue - initialInvestment * growthFactor) / annuityFactor,
  );

  if (!Number.isFinite(monthlyContribution)) return null;

  return monthlyContribution;
}

// ---- 逆算：積立期間を計算する ----

export interface SolveMonthsInput {
  initialInvestment: number;
  monthlyContribution: number;
  targetFutureValue: number;
  annualRate: number;
}

/**
 * 目標の資産額・初期投資額・毎月の積立額・想定利回りから、
 * 目標に到達するまでに必要な積立期間（月数）を逆算する。
 * 初期投資額だけで目標の資産額にすでに到達している場合は0を返す。
 * 必要な月数は切り上げで返す（返した月数の時点で目標額以上に達している）。
 * 初期投資額・毎月の積立額はいずれも0以上で少なくとも一方は0より大きく、
 * 目標の資産額は0より大きく、想定利回りは0以上MAX_ANNUAL_RATE(%)以下である必要がある。
 * これらを満たさない、必要な月数がMAX_MONTHSを超える、
 * または計算結果が有限でない場合はnull。
 */
export function solveMonthsToReachTarget(
  input: SolveMonthsInput,
): number | null {
  const {
    initialInvestment,
    monthlyContribution,
    targetFutureValue,
    annualRate,
  } = input;

  if (
    !(initialInvestment >= 0) ||
    !(monthlyContribution >= 0) ||
    !(initialInvestment + monthlyContribution > 0) ||
    !(targetFutureValue > 0) ||
    !isValidAnnualRate(annualRate)
  )
    return null;

  const monthlyRate = annualRate / 100 / 12;

  let months: number;
  if (monthlyRate === 0) {
    months =
      monthlyContribution === 0
        ? initialInvestment >= targetFutureValue
          ? 0
          : Infinity
        : (targetFutureValue - initialInvestment) / monthlyContribution;
  } else {
    const k = (monthlyContribution * (1 + monthlyRate)) / monthlyRate;
    const x = (targetFutureValue + k) / (initialInvestment + k);
    months = Math.log(x) / Math.log(1 + monthlyRate);
  }

  months = Math.max(0, Math.ceil(months));

  if (!Number.isFinite(months) || months > MAX_MONTHS) return null;

  return months;
}

// ---- 逆算：初期投資額を計算する ----

export interface SolveInitialInvestmentInput {
  monthlyContribution: number;
  targetFutureValue: number;
  annualRate: number;
  totalMonths: number;
}

/**
 * 目標の資産額・毎月の積立額・想定利回り・積立期間から、必要な初期投資額を逆算する。
 * 毎月の積立額だけで目標の資産額に到達している場合は0を返す。
 * 目標の資産額は0より大きく、毎月の積立額は0以上、積立期間は1以上MAX_MONTHS以下の整数月、
 * 想定利回りは0以上MAX_ANNUAL_RATE(%)以下である必要がある。これらを満たさない、
 * または計算結果が有限でない場合はnull。
 */
export function solveInitialInvestment(
  input: SolveInitialInvestmentInput,
): number | null {
  const { monthlyContribution, targetFutureValue, annualRate, totalMonths } =
    input;

  if (
    !(monthlyContribution >= 0) ||
    !(targetFutureValue > 0) ||
    !isValidAnnualRate(annualRate) ||
    !Number.isInteger(totalMonths) ||
    totalMonths < 1 ||
    totalMonths > MAX_MONTHS
  )
    return null;

  const monthlyRate = annualRate / 100 / 12;
  const growthFactor = Math.pow(1 + monthlyRate, totalMonths);
  const annuityFactor = annuityDueFactor(monthlyRate, totalMonths);

  const initialInvestment = Math.max(
    0,
    (targetFutureValue - monthlyContribution * annuityFactor) / growthFactor,
  );

  if (!Number.isFinite(initialInvestment)) return null;

  return initialInvestment;
}

// ---- 取り崩しシミュレーション ----

export interface WithdrawalInput {
  /** 取り崩しを開始する時点の資産評価額（円） */
  principal: number;
  /** 取り崩し期間中も運用を続けると仮定した場合の想定利回り（年率、%） */
  annualRate: number;
  /** 取り崩し期間（年） */
  withdrawalYears: number;
}

export interface WithdrawalYearlySnapshot {
  /** 経過年数 */
  year: number;
  /** その時点の残り資産評価額（円） */
  remainingBalance: number;
}

export interface WithdrawalResult {
  /** 毎月の取り崩し可能額（円） */
  monthlyWithdrawal: number;
  /** 取り崩し総額（円） */
  totalWithdrawn: number;
  /** 1年ごとの残り資産額の推移 */
  yearly: WithdrawalYearlySnapshot[];
}

/**
 * 運用を続けながら毎月一定額を取り崩す場合の、毎月の取り崩し可能額を試算する。
 * 資産残高が指定の利用年数でちょうど0になるように、月次複利を前提とした
 * 元利均等返済と同じ計算式（毎月末に運用益を加えたうえで取り崩す、期末払いの年金現価方式）
 * で毎月の取り崩し額を求める。
 * 資産評価額は0より大きく、想定利回りは0以上MAX_ANNUAL_RATE(%)以下、
 * 取り崩し期間は1以上60以下の整数年である必要がある。これらを満たさない、
 * または計算結果が有限でない場合はnull。
 */
export function calculateWithdrawal(
  input: WithdrawalInput,
): WithdrawalResult | null {
  const { principal, annualRate, withdrawalYears } = input;

  if (
    !(principal > 0) ||
    !isValidAnnualRate(annualRate) ||
    !Number.isInteger(withdrawalYears) ||
    withdrawalYears < 1 ||
    withdrawalYears > MAX_MONTHS / 12
  )
    return null;

  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = withdrawalYears * 12;

  const monthlyWithdrawal =
    monthlyRate === 0
      ? principal / totalMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

  if (!Number.isFinite(monthlyWithdrawal)) return null;

  let balance = principal;
  const yearly: WithdrawalYearlySnapshot[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    balance *= 1 + monthlyRate;
    balance -= monthlyWithdrawal;

    if (month % 12 === 0) {
      yearly.push({
        year: month / 12,
        remainingBalance: Math.max(0, balance),
      });
    }
  }

  return {
    monthlyWithdrawal,
    totalWithdrawn: monthlyWithdrawal * totalMonths,
    yearly,
  };
}
