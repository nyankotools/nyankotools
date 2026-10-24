/**
 * 報酬・料金等の源泉徴収税額の計算（令和8年時点の制度。国税庁タックスアンサー No.2795）。
 * 復興特別所得税（2.1%）を含む率で計算し、1円未満は切り捨てる。
 * 税制改正のたびに、下の定数を見直す。
 */

/** 100万円以下の部分に適用する率（10.21% = 10% × 1.021）を万分率で表したもの */
export const LOW_RATE_PER_10000 = 1021;
/** 100万円を超える部分に適用する率（20.42% = 20% × 1.021）を万分率で表したもの */
export const HIGH_RATE_PER_10000 = 2042;
/** 低い率を適用する支払金額の上限（円） */
export const WITHHOLDING_THRESHOLD = 1_000_000;
/** 100万円ちょうどのときの税額。超過分の計算に加える（円） */
export const WITHHOLDING_BASE_TAX = 102_100;
/** 司法書士・土地家屋調査士等の報酬から1回の支払ごとに控除する額（円） */
export const JUDICIAL_DEDUCTION = 10_000;
/** 消費税率（標準税率10%）を百分率で表したもの */
export const CONSUMPTION_TAX_PERCENT = 10;
/** 入力できる金額の上限（円）。計算が安全な整数の範囲に収まるようにする */
export const MAX_AMOUNT = 1_000_000_000_000;

/**
 * 入力モード。
 * - excl: 税抜報酬を入力。請求書で消費税が区分されている（源泉対象は税抜）
 * - incl: 税込金額を入力。消費税が区分されていない（源泉対象は税込）
 * - net-excl: 手取り（振込額）から逆算。消費税は区分されている
 * - net-incl: 手取り（振込額）から逆算。消費税は区分されていない
 */
export type WithholdingMode = 'excl' | 'incl' | 'net-excl' | 'net-incl';

export interface WithholdingInput {
  mode: WithholdingMode;
  /** 入力金額（円）。モードにより税抜報酬・税込金額・手取りのいずれか */
  amount: number;
  /** 司法書士・土地家屋調査士等の報酬として（1回の支払ごとに1万円を控除） */
  judicial: boolean;
}

export interface WithholdingResult {
  /** 源泉徴収の対象となる金額（司法書士等の控除前） */
  targetAmount: number;
  /** 税率計算に使う金額（司法書士等は1万円控除後） */
  taxBase: number;
  /** 100万円を超える部分があるか（20.42%の区分を使ったか） */
  overThreshold: boolean;
  /** 消費税額。区分記載なしのモードでは 0 */
  consumptionTax: number;
  /** 消費税を区分して記載しているか */
  taxSeparated: boolean;
  /** 請求額（報酬 + 区分された消費税） */
  invoiceTotal: number;
  /** 源泉徴収税額 */
  withholding: number;
  /** 差引支払額（振込額） */
  payment: number;
  /** 手取り逆算で、入力した手取りちょうどになる請求額が存在したか。逆算以外は true */
  exact: boolean;
  /** 請求額に対する源泉徴収税額の割合（%）。請求額が0なら0 */
  effectiveRate: number;
}

/** 源泉徴収の対象金額から税額を求める（1円未満切り捨て）。対象金額は0以上の整数 */
export function withholdingTax(target: number, judicial: boolean): number {
  const base = judicial ? Math.max(0, target - JUDICIAL_DEDUCTION) : target;
  if (base <= WITHHOLDING_THRESHOLD) {
    return Math.floor((base * LOW_RATE_PER_10000) / 10000);
  }
  return (
    Math.floor(((base - WITHHOLDING_THRESHOLD) * HIGH_RATE_PER_10000) / 10000) +
    WITHHOLDING_BASE_TAX
  );
}

/** 税抜報酬から消費税額（1円未満切り捨て） */
export function consumptionTaxOf(price: number): number {
  return Math.floor((price * CONSUMPTION_TAX_PERCENT) / 100);
}

function build(
  target: number,
  taxSeparated: boolean,
  judicial: boolean,
  exact: boolean,
): WithholdingResult {
  const taxBase = judicial ? Math.max(0, target - JUDICIAL_DEDUCTION) : target;
  const consumptionTax = taxSeparated ? consumptionTaxOf(target) : 0;
  const invoiceTotal = target + consumptionTax;
  const withholding = withholdingTax(target, judicial);
  return {
    targetAmount: target,
    taxBase,
    overThreshold: taxBase > WITHHOLDING_THRESHOLD,
    consumptionTax,
    taxSeparated,
    invoiceTotal,
    withholding,
    payment: invoiceTotal - withholding,
    exact,
    effectiveRate: invoiceTotal > 0 ? (withholding / invoiceTotal) * 100 : 0,
  };
}

/** 報酬（源泉対象額）から差引支払額を求める。単調非減少 */
function paymentFor(
  target: number,
  taxSeparated: boolean,
  judicial: boolean,
): number {
  const tax = taxSeparated ? consumptionTaxOf(target) : 0;
  return target + tax - withholdingTax(target, judicial);
}

export function calculateWithholding(
  input: WithholdingInput,
): WithholdingResult | null {
  const { mode, amount, judicial } = input;
  if (!Number.isFinite(amount) || amount < 0 || amount > MAX_AMOUNT) {
    return null;
  }
  const value = Math.floor(amount);

  if (mode === 'excl') return build(value, true, judicial, true);
  if (mode === 'incl') return build(value, false, judicial, true);

  const taxSeparated = mode === 'net-excl';
  // 手取りから逆算: 支払額が手取り以上になる最小の報酬額を二分探索する。
  // 支払額は報酬額に対して単調非減少（1円増えると支払額は0〜2円増える）。
  let lo = 0;
  let hi = value * 2 + 2 * JUDICIAL_DEDUCTION;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (paymentFor(mid, taxSeparated, judicial) >= value) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  const exact = paymentFor(lo, taxSeparated, judicial) === value;
  return build(lo, taxSeparated, judicial, exact);
}
