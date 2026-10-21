/**
 * 失業保険（雇用保険の基本手当）の日額・所定給付日数の概算。
 * 一般被保険者（65歳未満）を対象とし、就職困難者・日雇・短期雇用特例は扱わない。
 *
 * 基準年（毎年8月1日に改定される）: 賃金日額の上下限・給付率の区切りはいずれも
 * 令和8年8月1日現在の額（厚生労働省「雇用保険の基本手当日額の変更」の公表値）。
 */

export type AgeGroup = 'under30' | '30to44' | '45to59' | '60to64';
export type LeaveReason = 'self' | 'company' | 'contract-end' | 'justified';
export type InputError = 'age' | 'wage' | 'period' | 'ageService';

export const MIN_AGE = 15;
export const MAX_AGE = 64;
export const MAX_MONTHLY_WAGE = 100_000_000;
export const MAX_INSURED_YEARS = 60;

/** 賃金日額の下限（令和8年8月1日現在） */
export const WAGE_DAILY_MIN = 3203;
/** 給付率80%から傾斜が始まる賃金日額 A（令和8年8月1日現在） */
export const RATE_BAND_START = 5480;
/** 60歳未満で給付率50%になる賃金日額 B（令和8年8月1日現在） */
export const RATE_BAND_END = 13490;
/** 60〜64歳で給付率45%になる賃金日額 B'（令和8年8月1日現在） */
export const RATE_BAND_END_60S = 12120;

/** 賃金日額の上限（令和8年8月1日現在） */
export const WAGE_DAILY_MAX: Readonly<Record<AgeGroup, number>> = {
  under30: 14900,
  '30to44': 16540,
  '45to59': 18220,
  '60to64': 17400,
};

/** 60歳未満の最低給付率と、60〜64歳の最低給付率 */
const MIN_RATE: Readonly<Record<AgeGroup, number>> = {
  under30: 0.5,
  '30to44': 0.5,
  '45to59': 0.5,
  '60to64': 0.45,
};

/** 賃金日額の算出に使う日数（離職前6か月の賃金合計 ÷ 180） */
export const WAGE_DAYS_DIVISOR = 180;
export const WAGE_MONTHS = 6;

/** 待期期間（全員共通） */
export const WAITING_DAYS = 7;
/** 自己都合の給付制限（令和7年4月1日以降の離職） */
export const RESTRICTION_MONTHS_SELF = 1;
/** 5年以内に3回以上自己都合離職した場合の給付制限 */
export const RESTRICTION_MONTHS_REPEATED = 3;
/** 失業認定1回分の日数（約4週間に1回） */
export const CERTIFICATION_CYCLE_DAYS = 28;
/** 特定理由離職者（契約満了で更新なし）が特定受給資格者と同じ日数になる離職日の期限 */
export const SPECIFIC_REASON_TABLE_UNTIL = '2027-03-31';

/** 被保険者期間の区分。0:1年未満 1:1〜5年 2:5〜10年 3:10〜20年 4:20年以上 */
type DaysRow = readonly [number, number, number, number, number];

/** 特定受給資格者（会社都合）および特定理由離職者（契約満了で更新なし）の所定給付日数 */
export const BENEFIT_DAYS_SPECIFIC: Readonly<
  Record<'under30' | '30to34' | '35to44' | '45to59' | '60to64', DaysRow>
> = {
  under30: [90, 90, 120, 180, 180],
  '30to34': [90, 120, 180, 210, 240],
  '35to44': [90, 150, 180, 240, 270],
  '45to59': [90, 180, 240, 270, 330],
  '60to64': [90, 150, 180, 210, 240],
};

/**
 * 上記以外の離職者（自己都合など）の所定給付日数。全年齢共通。
 * 1年未満の列は特定理由離職者（正当な理由のある自己都合）が6か月以上あるときだけ使われる
 * （自己都合は12か月未満だと受給資格がない）。
 */
export const BENEFIT_DAYS_GENERAL: DaysRow = [90, 90, 90, 120, 150];

export function ageGroupOf(age: number): AgeGroup | null {
  if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) return null;
  if (age < 30) return 'under30';
  if (age < 45) return '30to44';
  if (age < 60) return '45to59';
  return '60to64';
}

function periodBand(totalMonths: number): number {
  const years = totalMonths / 12;
  if (years < 1) return 0;
  if (years < 5) return 1;
  if (years < 10) return 2;
  if (years < 20) return 3;
  return 4;
}

function specificRowOf(age: number): DaysRow {
  if (age < 30) return BENEFIT_DAYS_SPECIFIC.under30;
  if (age < 35) return BENEFIT_DAYS_SPECIFIC['30to34'];
  if (age < 45) return BENEFIT_DAYS_SPECIFIC['35to44'];
  if (age < 60) return BENEFIT_DAYS_SPECIFIC['45to59'];
  return BENEFIT_DAYS_SPECIFIC['60to64'];
}

/** 離職理由の区分から、特定受給資格者と同じ日数表を使うかを返す */
export function usesSpecificTable(reason: LeaveReason): boolean {
  return reason === 'company' || reason === 'contract-end';
}

/** 離職理由に応じた受給資格に必要な被保険者期間（月数） */
export function requiredInsuredMonths(reason: LeaveReason): number {
  return reason === 'self' ? 12 : 6;
}

/** 離職前6か月の月額賃金（平均）から賃金日額を求める（円未満切捨て） */
export function wageDailyFromMonthly(monthlyWage: number): number {
  return Math.floor((monthlyWage * WAGE_MONTHS) / WAGE_DAYS_DIVISOR);
}

/** 賃金日額に上下限を適用する */
export function clampWageDaily(wageDaily: number, group: AgeGroup): number {
  return Math.min(Math.max(wageDaily, WAGE_DAILY_MIN), WAGE_DAILY_MAX[group]);
}

/** 基本手当日額（円未満切捨て前）。賃金日額は上下限適用後の値を渡す。 */
function rawDailyAllowance(wageDaily: number, group: AgeGroup): number {
  const minRate = MIN_RATE[group];
  const end = group === '60to64' ? RATE_BAND_END_60S : RATE_BAND_END;
  if (wageDaily <= RATE_BAND_START) return 0.8 * wageDaily;
  if (wageDaily >= end) return minRate * wageDaily;
  // 賃金日額が上がるほど 80% から最低給付率へ傾斜して下がる
  const sloped =
    0.8 * wageDaily -
    ((0.8 - minRate) * (wageDaily - RATE_BAND_START) * wageDaily) /
      (end - RATE_BAND_START);
  // 60〜64歳は「0.05w + 区切り額×0.4」のいずれか低い方の額になる
  if (group === '60to64') return Math.min(sloped, 0.05 * wageDaily + end * 0.4);
  return sloped;
}

/** 給付率（0.45〜0.8）。賃金日額は上下限適用後の値を渡す。 */
export function benefitRate(wageDaily: number, group: AgeGroup): number {
  return rawDailyAllowance(wageDaily, group) / wageDaily;
}

/** 基本手当日額（円未満切捨て）。賃金日額は上下限適用後の値を渡す。 */
export function dailyAllowanceOf(wageDaily: number, group: AgeGroup): number {
  return Math.floor(rawDailyAllowance(wageDaily, group));
}

/** 所定給付日数。受給資格がなければ 0。 */
export function benefitDays(
  age: number,
  insuredMonths: number,
  reason: LeaveReason,
): number {
  if (insuredMonths < requiredInsuredMonths(reason)) return 0;
  const band = periodBand(insuredMonths);
  if (usesSpecificTable(reason)) return specificRowOf(age)[band];
  return BENEFIT_DAYS_GENERAL[band];
}

export interface UnemploymentBenefitInput {
  /** 離職日時点の年齢 */
  age: number;
  /** 離職前6か月の月額賃金の平均（税引前・賞与を除く） */
  monthlyWage: number;
  /** 被保険者であった期間（年） */
  insuredYears: number;
  /** 被保険者であった期間（月、0〜11） */
  insuredMonthsPart: number;
  reason: LeaveReason;
  /** 過去5年以内に自己都合で3回以上離職したか */
  repeatedSelfLeave: boolean;
}

export interface UnemploymentBenefitResult {
  ageGroup: AgeGroup;
  /** 離職前6か月の賃金から求めた賃金日額（上下限適用前） */
  wageDailyRaw: number;
  /** 上下限を適用した賃金日額 */
  wageDaily: number;
  wageClamp: 'min' | 'max' | null;
  /** 給付率（0.45〜0.8） */
  rate: number;
  /** 基本手当日額 */
  dailyAllowance: number;
  insuredMonths: number;
  /** 受給資格があるか（被保険者期間の要件） */
  eligible: boolean;
  requiredMonths: number;
  /** 所定給付日数（受給資格なしは 0） */
  days: number;
  /** 基本手当の総額（日額 × 所定給付日数） */
  totalAmount: number;
  /** 失業認定1回分（28日）の目安 */
  perCertification: number;
  waitingDays: number;
  /** 給付制限の月数（なしは 0） */
  restrictionMonths: number;
  /** 受給期間（離職日の翌日から1年）に加わる日数（所定給付日数330日で30日） */
  extraValidityDays: number;
}

export function calculateUnemploymentBenefit(
  input: UnemploymentBenefitInput,
): UnemploymentBenefitResult | { error: InputError } {
  const { age, monthlyWage, insuredYears, insuredMonthsPart, reason } = input;
  const group = ageGroupOf(age);
  if (!group) return { error: 'age' };
  if (
    !Number.isFinite(monthlyWage) ||
    monthlyWage <= 0 ||
    monthlyWage > MAX_MONTHLY_WAGE
  ) {
    return { error: 'wage' };
  }
  if (
    !Number.isInteger(insuredYears) ||
    !Number.isInteger(insuredMonthsPart) ||
    insuredYears < 0 ||
    insuredYears > MAX_INSURED_YEARS ||
    insuredMonthsPart < 0 ||
    insuredMonthsPart > 11
  ) {
    return { error: 'period' };
  }
  const insuredMonths = insuredYears * 12 + insuredMonthsPart;
  if (insuredMonths === 0) return { error: 'period' };
  // 15歳より前から被保険者であることはない
  if (insuredMonths > (age - MIN_AGE) * 12) return { error: 'ageService' };

  const wageDailyRaw = wageDailyFromMonthly(monthlyWage);
  const wageDaily = clampWageDaily(wageDailyRaw, group);
  const wageClamp =
    wageDailyRaw < WAGE_DAILY_MIN
      ? 'min'
      : wageDailyRaw > WAGE_DAILY_MAX[group]
        ? 'max'
        : null;
  const rate = benefitRate(wageDaily, group);
  const dailyAllowance = dailyAllowanceOf(wageDaily, group);
  const requiredMonths = requiredInsuredMonths(reason);
  const days = benefitDays(age, insuredMonths, reason);
  const restrictionMonths =
    reason === 'self'
      ? input.repeatedSelfLeave
        ? RESTRICTION_MONTHS_REPEATED
        : RESTRICTION_MONTHS_SELF
      : 0;

  return {
    ageGroup: group,
    wageDailyRaw,
    wageDaily,
    wageClamp,
    rate,
    dailyAllowance,
    insuredMonths,
    eligible: insuredMonths >= requiredMonths,
    requiredMonths,
    days,
    totalAmount: dailyAllowance * days,
    perCertification: dailyAllowance * CERTIFICATION_CYCLE_DAYS,
    waitingDays: WAITING_DAYS,
    restrictionMonths,
    extraValidityDays: days === 330 ? 30 : days === 360 ? 60 : 0,
  };
}

export function isError(
  result: UnemploymentBenefitResult | { error: InputError },
): result is { error: InputError } {
  return 'error' in result;
}
