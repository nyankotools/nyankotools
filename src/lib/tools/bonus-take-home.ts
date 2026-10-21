import {
  EMPLOYMENT_INSURANCE_RATE,
  HEALTH_INSURANCE_RATE,
  NURSING_CARE_INSURANCE_RATE,
  PENSION_RATE,
} from './salary-take-home-calculator';

/** 健康保険・介護保険の標準賞与額の年度（4月〜翌3月）累計上限 */
export const HEALTH_BONUS_FISCAL_YEAR_CAP = 5_730_000;
/** 厚生年金の標準賞与額の1回あたり上限 */
export const PENSION_BONUS_PER_PAYMENT_CAP = 1_500_000;
/** 前月給与の社会保険料を概算するときの標準報酬月額の上限 */
const HEALTH_MONTHLY_CAP = 1_390_000;
const PENSION_MONTHLY_CAP = 650_000;

/** 扶養親族等の数の最大（7人以上は7人として扱う） */
export const MAX_DEPENDENTS = 7;

/**
 * 賞与に対する源泉徴収税額の算出率の表（甲欄）の近似値。令和7年分の区分に基づく概算。
 * 各行は [前月の社会保険料等控除後の給与等の金額（千円）の下限（以上）, 扶養親族等0〜7人以上の率（%）]。
 * 率は復興特別所得税を含む。上の行の下限以上・次の行の下限未満が当該行の範囲。
 *
 * 注意: 国税庁の公表表を厳密に転記したものではなく、段階の傾向に合わせた近似値。
 * 税制改正（源泉徴収税額表の改定、基礎控除・給与所得控除の見直し等）があったら
 * 国税庁の「賞与に対する源泉徴収税額の算出率の表」で必ず見直すこと。
 * 対応年: 令和7年分
 */
export const BONUS_WITHHOLDING_TABLE_LABEL = '令和7年分';
export const BONUS_WITHHOLDING_TABLE: readonly (readonly [
  number,
  readonly number[],
])[] = [
  [0, [0, 0, 0, 0, 0, 0, 0, 0]],
  [68, [2.042, 0, 0, 0, 0, 0, 0, 0]],
  [79, [4.084, 2.042, 0, 0, 0, 0, 0, 0]],
  [252, [6.126, 4.084, 2.042, 0, 0, 0, 0, 0]],
  [300, [8.168, 6.126, 4.084, 2.042, 0, 0, 0, 0]],
  [334, [10.21, 8.168, 6.126, 4.084, 2.042, 0, 0, 0]],
  [363, [12.252, 10.21, 8.168, 6.126, 4.084, 2.042, 0, 0]],
  [395, [14.294, 12.252, 10.21, 8.168, 6.126, 4.084, 2.042, 0]],
  [426, [16.336, 14.294, 12.252, 10.21, 8.168, 6.126, 4.084, 2.042]],
  [520, [18.378, 16.336, 14.294, 12.252, 10.21, 8.168, 6.126, 4.084]],
  [601, [20.42, 18.378, 16.336, 14.294, 12.252, 10.21, 8.168, 6.126]],
  [678, [22.462, 20.42, 18.378, 16.336, 14.294, 12.252, 10.21, 8.168]],
  [708, [24.504, 22.462, 20.42, 18.378, 16.336, 14.294, 12.252, 10.21]],
  [745, [26.546, 24.504, 22.462, 20.42, 18.378, 16.336, 14.294, 12.252]],
  [780, [28.588, 26.546, 24.504, 22.462, 20.42, 18.378, 16.336, 14.294]],
  [840, [30.63, 28.588, 26.546, 24.504, 22.462, 20.42, 18.378, 16.336]],
  [906, [32.672, 30.63, 28.588, 26.546, 24.504, 22.462, 20.42, 18.378]],
  [1000, [35.735, 32.672, 30.63, 28.588, 26.546, 24.504, 22.462, 20.42]],
  [1300, [38.798, 35.735, 32.672, 30.63, 28.588, 26.546, 24.504, 22.462]],
  [1500, [40.84, 38.798, 35.735, 32.672, 30.63, 28.588, 26.546, 24.504]],
  [2000, [45.945, 40.84, 38.798, 35.735, 32.672, 30.63, 28.588, 26.546]],
];

/** 前月の社会保険料等控除後の給与（円）と扶養人数から算出率（%）を返す */
export function bonusWithholdingRate(
  previousMonthNetOfInsurance: number,
  dependents: number,
): number {
  const thousand = Math.max(0, previousMonthNetOfInsurance) / 1000;
  const col = Math.min(MAX_DEPENDENTS, Math.max(0, Math.floor(dependents)));
  let row = BONUS_WITHHOLDING_TABLE[0];
  for (const r of BONUS_WITHHOLDING_TABLE) {
    if (thousand >= r[0]) row = r;
    else break;
  }
  return row[1][col];
}

/** 本人負担分の端数処理: 50銭以下切り捨て、50銭超切り上げ */
function roundHalfDown(value: number): number {
  return Math.max(0, Math.ceil(value - 0.5 - 1e-9)) + 0;
}

/** 前月給与（額面）から、その月の本人負担社会保険料を概算する */
export function estimateMonthlySocialInsurance(
  monthlyGross: number,
  age40OrOver: boolean,
): number {
  const healthRate =
    HEALTH_INSURANCE_RATE + (age40OrOver ? NURSING_CARE_INSURANCE_RATE : 0);
  return Math.floor(
    Math.min(monthlyGross, HEALTH_MONTHLY_CAP) * healthRate +
      Math.min(monthlyGross, PENSION_MONTHLY_CAP) * PENSION_RATE +
      monthlyGross * EMPLOYMENT_INSURANCE_RATE,
  );
}

export interface BonusInput {
  /** 賞与の額面（円） */
  bonusGross: number;
  /** 前月の給与の額面（円） */
  previousMonthSalary: number;
  /** 40歳以上（介護保険料の対象）か */
  age40OrOver: boolean;
  /** 扶養親族等の数（甲欄） */
  dependents: number;
  /** 同じ年度（4月〜翌3月）にすでに支給された賞与の標準賞与額の合計（円）。省略時は0 */
  bonusPaidThisFiscalYear?: number;
}

export interface BonusResult {
  standardBonus: number;
  healthInsurance: number;
  nursingCare: number;
  pension: number;
  employmentInsurance: number;
  socialInsurance: number;
  /** 前月の社会保険料等控除後の給与（推定） */
  previousMonthNet: number;
  /** 算出率（%・復興特別所得税を含む） */
  withholdingRate: number;
  taxableBonus: number;
  incomeTax: number;
  takeHome: number;
  /** 額面に対する手取りの割合（%） */
  takeHomeRatio: number;
}

/** 賞与の社会保険料・源泉所得税・手取りを概算する。入力が負・非有限ならnull */
export function calculateBonusTakeHome(input: BonusInput): BonusResult | null {
  const {
    bonusGross,
    previousMonthSalary,
    age40OrOver,
    dependents,
    bonusPaidThisFiscalYear = 0,
  } = input;
  for (const v of [
    bonusGross,
    previousMonthSalary,
    dependents,
    bonusPaidThisFiscalYear,
  ]) {
    if (!Number.isFinite(v) || v < 0) return null;
  }

  const standardBonus = Math.floor(bonusGross / 1000) * 1000;
  const healthBase = Math.max(
    0,
    Math.min(
      standardBonus,
      HEALTH_BONUS_FISCAL_YEAR_CAP - Math.floor(bonusPaidThisFiscalYear),
    ),
  );
  const pensionBase = Math.min(standardBonus, PENSION_BONUS_PER_PAYMENT_CAP);

  const healthInsurance = roundHalfDown(healthBase * HEALTH_INSURANCE_RATE);
  const nursingCare = age40OrOver
    ? roundHalfDown(healthBase * NURSING_CARE_INSURANCE_RATE)
    : 0;
  const pension = roundHalfDown(pensionBase * PENSION_RATE);
  const employmentInsurance = roundHalfDown(
    bonusGross * EMPLOYMENT_INSURANCE_RATE,
  );
  const socialInsurance =
    healthInsurance + nursingCare + pension + employmentInsurance;

  const previousMonthNet = Math.max(
    0,
    previousMonthSalary -
      estimateMonthlySocialInsurance(previousMonthSalary, age40OrOver),
  );
  const withholdingRate = bonusWithholdingRate(previousMonthNet, dependents);
  const taxableBonus = Math.max(0, bonusGross - socialInsurance);
  const incomeTax = Math.floor((taxableBonus * withholdingRate) / 100);
  const takeHome = bonusGross - socialInsurance - incomeTax;

  return {
    standardBonus,
    healthInsurance,
    nursingCare,
    pension,
    employmentInsurance,
    socialInsurance,
    previousMonthNet,
    withholdingRate,
    taxableBonus,
    incomeTax,
    takeHome,
    takeHomeRatio: bonusGross > 0 ? (takeHome / bonusGross) * 100 : 0,
  };
}
