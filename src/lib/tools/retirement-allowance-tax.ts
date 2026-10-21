import {
  RECONSTRUCTION_TAX_RATE,
  calculateIncomeTax,
  floorToThousand,
} from './japan-income-tax';

/**
 * 退職金（退職手当等）にかかる税金の概算（令和7・8年分の制度）。
 * 退職所得控除・2分の1課税・分離課税の所得税（復興特別所得税を含む）・住民税10%を扱う。
 * 税制改正のたびに、下の定数と式を見直す。
 */

/** 退職所得控除: 勤続20年以下の1年あたりの額 */
export const DEDUCTION_PER_YEAR_UNTIL_20 = 400_000;
/** 退職所得控除: 勤続20年超の1年あたりの額 */
export const DEDUCTION_PER_YEAR_OVER_20 = 700_000;
/** 退職所得控除の最低保障額 */
export const MIN_RETIREMENT_DEDUCTION = 800_000;
/** 障害退職の場合の加算額 */
export const DISABILITY_ADDITION = 1_000_000;
/** 短期退職手当等（勤続5年以下）で2分の1課税が使えなくなる境界額 */
export const SHORT_TERM_HALF_LIMIT = 3_000_000;
/** 住民税（道府県民税4% + 市町村民税6%）の税率 */
export const RESIDENT_TAX_RATE = 0.1;

export type RetirementKind = 'regular' | 'officer';

/** 2分の1課税の適用区分 */
export type HalfRule =
  /** 全額に2分の1を適用 */
  | 'full'
  /** 短期退職手当等: 控除後300万円超の部分には2分の1を適用しない */
  | 'partial'
  /** 役員等の短期退職手当等: 2分の1を適用しない */
  | 'none';

export interface RetirementAllowanceInput {
  /** 退職手当等の収入金額（円） */
  retirementPay: number;
  /** 勤続年数（年）。0以上の整数 */
  serviceYears: number;
  /** 勤続年数の端数の月数（0〜11） */
  serviceMonths: number;
  /** 障害退職か（控除に100万円加算） */
  disability: boolean;
  /** 役員等（法人の役員・議員・公務員）としての退職か */
  kind: RetirementKind;
}

export interface RetirementAllowanceResult {
  /** 1年未満の端数を切り上げた勤続年数 */
  countedYears: number;
  /** 退職所得控除額 */
  deduction: number;
  /** 収入金額から退職所得控除を引いた額（0以上） */
  afterDeduction: number;
  halfRule: HalfRule;
  /** 課税退職所得金額（1,000円未満切り捨て） */
  taxableIncome: number;
  /** 所得税額（復興特別所得税を除く） */
  incomeTaxBase: number;
  /** 復興特別所得税額 */
  reconstructionTax: number;
  /** 所得税と復興特別所得税の合計 */
  incomeTax: number;
  /** 住民税額（100円未満切り捨て） */
  residentTax: number;
  totalTax: number;
  /** 税引後の手取り額 */
  takeHome: number;
  /** 収入金額に対する税の割合（%）。収入が0なら0 */
  effectiveRate: number;
}

/** 1年未満の端数を切り上げた勤続年数。0年0か月は null 扱いにするため呼び出し側で判定する */
export function countServiceYears(years: number, months: number): number {
  const totalMonths = years * 12 + months;
  return Math.ceil(totalMonths / 12);
}

/** 退職所得控除額。勤続年数は1年未満切り上げ後の値（1以上）を渡す */
export function retirementDeduction(
  countedYears: number,
  disability: boolean,
): number {
  let base: number;
  if (countedYears <= 20) {
    base = Math.max(
      DEDUCTION_PER_YEAR_UNTIL_20 * countedYears,
      MIN_RETIREMENT_DEDUCTION,
    );
  } else {
    base =
      DEDUCTION_PER_YEAR_UNTIL_20 * 20 +
      DEDUCTION_PER_YEAR_OVER_20 * (countedYears - 20);
  }
  return disability ? base + DISABILITY_ADDITION : base;
}

/** 控除後の金額に2分の1課税を適用した後の金額（1,000円未満切り捨て前） */
export function applyHalfRule(afterDeduction: number, rule: HalfRule): number {
  if (rule === 'none') return afterDeduction;
  if (rule === 'partial') {
    if (afterDeduction <= SHORT_TERM_HALF_LIMIT) return afterDeduction / 2;
    // 300万円以下の部分は2分の1、超える部分はそのまま
    return SHORT_TERM_HALF_LIMIT / 2 + (afterDeduction - SHORT_TERM_HALF_LIMIT);
  }
  return afterDeduction / 2;
}

export function determineHalfRule(
  kind: RetirementKind,
  countedYears: number,
): HalfRule {
  if (countedYears > 5) return 'full';
  return kind === 'officer' ? 'none' : 'partial';
}

export function calculateRetirementAllowanceTax(
  input: RetirementAllowanceInput,
): RetirementAllowanceResult | null {
  const { retirementPay, serviceYears, serviceMonths } = input;
  if (
    !Number.isFinite(retirementPay) ||
    !Number.isFinite(serviceYears) ||
    !Number.isFinite(serviceMonths)
  ) {
    return null;
  }
  if (retirementPay < 0) return null;
  if (
    !Number.isInteger(serviceYears) ||
    serviceYears < 0 ||
    serviceYears > 80
  ) {
    return null;
  }
  if (
    !Number.isInteger(serviceMonths) ||
    serviceMonths < 0 ||
    serviceMonths > 11
  ) {
    return null;
  }
  if (serviceYears === 0 && serviceMonths === 0) return null;

  const pay = Math.floor(retirementPay);
  const countedYears = countServiceYears(serviceYears, serviceMonths);
  const deduction = retirementDeduction(countedYears, input.disability);
  const afterDeduction = Math.max(0, pay - deduction);
  const halfRule = determineHalfRule(input.kind, countedYears);
  const taxableIncome = floorToThousand(
    applyHalfRule(afterDeduction, halfRule),
  );

  const incomeTaxBase = calculateIncomeTax(taxableIncome);
  const reconstructionTax = Math.floor(incomeTaxBase * RECONSTRUCTION_TAX_RATE);
  const incomeTax = incomeTaxBase + reconstructionTax;
  const residentTax =
    Math.floor((taxableIncome * RESIDENT_TAX_RATE) / 100) * 100;
  const totalTax = incomeTax + residentTax;

  return {
    countedYears,
    deduction,
    afterDeduction,
    halfRule,
    taxableIncome,
    incomeTaxBase,
    reconstructionTax,
    incomeTax,
    residentTax,
    totalTax,
    takeHome: pay - totalTax,
    effectiveRate: pay > 0 ? (totalTax / pay) * 100 : 0,
  };
}
