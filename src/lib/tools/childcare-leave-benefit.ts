/**
 * 育児休業給付金・出産手当金・傷病手当金の概算ロジック。
 *
 * 制度改定の追随が必要な定数は下にまとめている。見直し時は
 * .claude/docs/regulation-dependent-tools.md の行も参照すること。
 */

/** 雇用保険の賃金日額の上限・下限の適用期間（毎年8月1日に改定される） */
export const WAGE_DAILY_LIMITS_LABEL = '令和8年8月1日〜';
/** 賃金日額の上限（円）。休業開始時賃金日額がこれを超えるときはこの額で計算する */
export const WAGE_DAILY_UPPER = 16_540;
/** 賃金日額の下限（円）。これを下回るときはこの額で計算する */
export const WAGE_DAILY_LOWER = 3_203;

/** 育児休業給付金の支給率（休業開始から180日目まで） */
export const CHILDCARE_RATE_FIRST = 0.67;
/** 育児休業給付金の支給率（181日目以降） */
export const CHILDCARE_RATE_AFTER = 0.5;
/** 支給率が下がる境目の日数 */
export const CHILDCARE_FIRST_PERIOD_DAYS = 180;
/** 出生後休業支援給付金の給付率（賃金日額の13%） */
export const BIRTH_SUPPORT_RATE = 0.13;
/** 出生後休業支援給付金の上限日数 */
export const BIRTH_SUPPORT_MAX_DAYS = 28;
/** 1か月あたりの支給日数（支給単位期間は原則30日） */
export const DAYS_PER_MONTH = 30;
/** 賃金日額を出すための日数（休業前6か月分の賃金総額÷180） */
export const WAGE_DAILY_DIVISOR_DAYS = 180;

/** 健康保険の傷病手当金・出産手当金の給付割合 */
export const HEALTH_BENEFIT_RATIO = 2 / 3;
/** 出産手当金: 出産日以前の対象日数（単胎） */
export const MATERNITY_PRE_DAYS_SINGLE = 42;
/** 出産手当金: 出産日以前の対象日数（多胎） */
export const MATERNITY_PRE_DAYS_MULTIPLE = 98;
/** 出産手当金: 出産日の翌日以後の対象日数 */
export const MATERNITY_POST_DAYS = 56;
/** 傷病手当金の待期期間（連続する休業の日数） */
export const SICK_WAITING_DAYS = 3;
/** 傷病手当金の支給期間の上限日数（支給開始日から通算1年6か月の暦日数の概算） */
export const SICK_MAX_PAYMENT_DAYS = 548;

function isNonNegative(v: number): boolean {
  return Number.isFinite(v) && v >= 0;
}

/** 四捨五入（浮動小数点の誤差を避けるため微小値を足す） */
function roundHalfUp(v: number): number {
  return Math.floor(v + 0.5 + 1e-9);
}

/** 賃金日額に上限・下限を適用する */
export function clampWageDaily(wageDaily: number): number {
  return Math.min(WAGE_DAILY_UPPER, Math.max(WAGE_DAILY_LOWER, wageDaily));
}

/** 休業前6か月の賃金総額（賞与を除く）から賃金日額を求める（円未満切り捨て） */
export function wageDailyFromSixMonthTotal(sixMonthTotal: number): number {
  return Math.floor(sixMonthTotal / WAGE_DAILY_DIVISOR_DAYS);
}

/** 標準報酬月額から標準報酬日額を求める（10円未満四捨五入） */
export function standardDailyFromMonthly(standardMonthly: number): number {
  return roundHalfUp(standardMonthly / DAYS_PER_MONTH / 10) * 10;
}

export interface ChildcareLeaveInput {
  /** 休業開始前6か月の賃金の月平均（賞与を除く・円） */
  monthlyWage: number;
  /** 育児休業の日数（休業開始日から終了日まで・暦日） */
  leaveDays: number;
  /** 出生後休業支援給付金（13%上乗せ）を受けられるか */
  birthSupport: boolean;
}

export interface ChildcareLeaveResult {
  /** 休業前の賃金日額（上限・下限適用前） */
  rawWageDaily: number;
  /** 上限・下限を適用した賃金日額 */
  wageDaily: number;
  limitApplied: 'upper' | 'lower' | null;
  /** 67%で計算する日数 */
  daysFirst: number;
  /** 50%で計算する日数 */
  daysAfter: number;
  /** 67%期間の1か月（30日）あたりの額 */
  monthlyFirst: number;
  /** 50%期間の1か月（30日）あたりの額 */
  monthlyAfter: number;
  /** 育児休業給付金の合計 */
  benefitFirst: number;
  benefitAfter: number;
  /** 出生後休業支援給付金の対象日数 */
  supportDays: number;
  /** 出生後休業支援給付金 */
  supportBenefit: number;
  total: number;
}

/** 育児休業給付金（と出生後休業支援給付金）を概算する。不正な入力はnull */
export function calculateChildcareLeave(
  input: ChildcareLeaveInput,
): ChildcareLeaveResult | null {
  const { monthlyWage, leaveDays, birthSupport } = input;
  if (!isNonNegative(monthlyWage) || !isNonNegative(leaveDays)) return null;
  if (!(monthlyWage > 0) || !Number.isInteger(leaveDays) || leaveDays < 1) {
    return null;
  }

  const rawWageDaily = wageDailyFromSixMonthTotal(monthlyWage * 6);
  const wageDaily = clampWageDaily(rawWageDaily);
  const limitApplied =
    rawWageDaily > WAGE_DAILY_UPPER
      ? 'upper'
      : rawWageDaily < WAGE_DAILY_LOWER
        ? 'lower'
        : null;

  const daysFirst = Math.min(leaveDays, CHILDCARE_FIRST_PERIOD_DAYS);
  const daysAfter = Math.max(0, leaveDays - CHILDCARE_FIRST_PERIOD_DAYS);
  const monthlyFirst = Math.floor(
    wageDaily * DAYS_PER_MONTH * CHILDCARE_RATE_FIRST,
  );
  const monthlyAfter = Math.floor(
    wageDaily * DAYS_PER_MONTH * CHILDCARE_RATE_AFTER,
  );
  const benefitFirst = Math.floor(wageDaily * daysFirst * CHILDCARE_RATE_FIRST);
  const benefitAfter = Math.floor(wageDaily * daysAfter * CHILDCARE_RATE_AFTER);

  const supportDays = birthSupport
    ? Math.min(leaveDays, BIRTH_SUPPORT_MAX_DAYS)
    : 0;
  const supportBenefit = Math.floor(
    wageDaily * supportDays * BIRTH_SUPPORT_RATE,
  );

  return {
    rawWageDaily,
    wageDaily,
    limitApplied,
    daysFirst,
    daysAfter,
    monthlyFirst,
    monthlyAfter,
    benefitFirst,
    benefitAfter,
    supportDays,
    supportBenefit,
    total: benefitFirst + benefitAfter + supportBenefit,
  };
}

export interface MaternityInput {
  /** 標準報酬月額（直近12か月の平均・円） */
  standardMonthly: number;
  /** 多胎妊娠か */
  multiple: boolean;
  /** 出産が予定日より遅れた日数（産前の日数に加算される） */
  delayDays: number;
}

export interface MaternityResult {
  standardDaily: number;
  benefitDaily: number;
  preDays: number;
  postDays: number;
  totalDays: number;
  total: number;
}

/** 出産手当金を概算する。不正な入力はnull */
export function calculateMaternityAllowance(
  input: MaternityInput,
): MaternityResult | null {
  const { standardMonthly, multiple, delayDays } = input;
  if (!(Number.isFinite(standardMonthly) && standardMonthly > 0)) return null;
  if (!isNonNegative(delayDays) || !Number.isInteger(delayDays)) return null;

  const standardDaily = standardDailyFromMonthly(standardMonthly);
  const benefitDaily = roundHalfUp(standardDaily * HEALTH_BENEFIT_RATIO);
  const preDays =
    (multiple ? MATERNITY_PRE_DAYS_MULTIPLE : MATERNITY_PRE_DAYS_SINGLE) +
    delayDays;
  const totalDays = preDays + MATERNITY_POST_DAYS;
  return {
    standardDaily,
    benefitDaily,
    preDays,
    postDays: MATERNITY_POST_DAYS,
    totalDays,
    total: benefitDaily * totalDays,
  };
}

export interface SickInput {
  /** 標準報酬月額（直近12か月の平均・円） */
  standardMonthly: number;
  /** 連続して仕事を休んだ日数（待期の3日間を含む） */
  absentDays: number;
}

export interface SickResult {
  standardDaily: number;
  benefitDaily: number;
  waitingDays: number;
  /** 支給の対象になる日数（待期3日を除き、上限あり） */
  paidDays: number;
  cappedByPeriod: boolean;
  total: number;
}

/** 傷病手当金を概算する。不正な入力はnull */
export function calculateSickAllowance(input: SickInput): SickResult | null {
  const { standardMonthly, absentDays } = input;
  if (!(Number.isFinite(standardMonthly) && standardMonthly > 0)) return null;
  if (!isNonNegative(absentDays) || !Number.isInteger(absentDays)) return null;

  const standardDaily = standardDailyFromMonthly(standardMonthly);
  const benefitDaily = roundHalfUp(standardDaily * HEALTH_BENEFIT_RATIO);
  const afterWaiting = Math.max(0, absentDays - SICK_WAITING_DAYS);
  const paidDays = Math.min(afterWaiting, SICK_MAX_PAYMENT_DAYS);
  return {
    standardDaily,
    benefitDaily,
    waitingDays: Math.min(absentDays, SICK_WAITING_DAYS),
    paidDays,
    cappedByPeriod: afterWaiting > SICK_MAX_PAYMENT_DAYS,
    total: benefitDaily * paidDays,
  };
}
