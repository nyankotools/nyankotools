/**
 * 贈与税（暦年課税）の概算（令和8年時点の制度。国税庁タックスアンサー No.4408 に基づく）。
 * 基礎控除110万円と、一般税率・特例税率（直系尊属から18歳以上の子・孫などへの贈与）の速算表を扱う。
 * 税制改正のたびに、下の定数を見直す。
 */

/** 暦年課税の基礎控除（受贈者1人につき年間110万円） */
export const GIFT_BASIC_DEDUCTION = 1_100_000;
/** 課税価格の切り捨て単位（国税通則法118条） */
export const TAXABLE_PRICE_UNIT = 1_000;
/** 納付税額の切り捨て単位（国税通則法119条） */
export const PAYABLE_TAX_UNIT = 100;
/** 特例税率の基準年（令和8年） */
export const GIFT_TAX_BASIS_YEAR = 2026;

export interface GiftTaxBracket {
  /** 基礎控除後の課税価格の上限（この額以下）。最後の行は Infinity */
  upTo: number;
  /** 税率（%） */
  ratePercent: number;
  /** 控除額（円） */
  deduction: number;
}

/** 一般税率（一般贈与財産用）の速算表 */
export const GENERAL_BRACKETS: readonly GiftTaxBracket[] = [
  { upTo: 2_000_000, ratePercent: 10, deduction: 0 },
  { upTo: 3_000_000, ratePercent: 15, deduction: 100_000 },
  { upTo: 4_000_000, ratePercent: 20, deduction: 250_000 },
  { upTo: 6_000_000, ratePercent: 30, deduction: 650_000 },
  { upTo: 10_000_000, ratePercent: 40, deduction: 1_250_000 },
  { upTo: 15_000_000, ratePercent: 45, deduction: 1_750_000 },
  { upTo: 30_000_000, ratePercent: 50, deduction: 2_500_000 },
  { upTo: Infinity, ratePercent: 55, deduction: 4_000_000 },
];

/** 特例税率（特例贈与財産用）の速算表 */
export const SPECIAL_BRACKETS: readonly GiftTaxBracket[] = [
  { upTo: 2_000_000, ratePercent: 10, deduction: 0 },
  { upTo: 4_000_000, ratePercent: 15, deduction: 100_000 },
  { upTo: 6_000_000, ratePercent: 20, deduction: 300_000 },
  { upTo: 10_000_000, ratePercent: 30, deduction: 900_000 },
  { upTo: 15_000_000, ratePercent: 40, deduction: 1_900_000 },
  { upTo: 30_000_000, ratePercent: 45, deduction: 2_650_000 },
  { upTo: 45_000_000, ratePercent: 50, deduction: 4_150_000 },
  { upTo: Infinity, ratePercent: 55, deduction: 6_400_000 },
];

/** 入力できる贈与額の上限（BigInt 按分でも安全に扱える範囲） */
export const MAX_GIFT_AMOUNT = 1_000_000_000_000;

export type GiftTaxRateKind = 'special' | 'general';

export interface GiftTaxInput {
  /** 特例税率の対象贈与の合計（円） */
  specialAmount: number;
  /** 一般税率の対象贈与の合計（円） */
  generalAmount: number;
}

export interface GiftTaxBracketUse {
  /** 速算表の行番号（0始まり） */
  index: number;
  bracket: GiftTaxBracket;
}

export interface GiftTaxResult {
  specialAmount: number;
  generalAmount: number;
  /** 年間贈与額の合計 */
  totalGift: number;
  /** 実際に引かれる基礎控除額（合計がそれ未満なら合計額） */
  appliedDeduction: number;
  /** 基礎控除後の課税価格（1,000円未満切り捨て） */
  taxablePrice: number;
  /** 該当する特例税率の行（対象贈与がない・課税価格0なら null） */
  specialBracket: GiftTaxBracketUse | null;
  /** 該当する一般税率の行（対象贈与がない・課税価格0なら null） */
  generalBracket: GiftTaxBracketUse | null;
  /** 課税価格の全体に特例税率を適用した場合の税額（按分前） */
  specialFullTax: number;
  /** 課税価格の全体に一般税率を適用した場合の税額（按分前） */
  generalFullTax: number;
  /** 特例贈与財産分の按分後税額（1円未満切り捨て） */
  specialShareTax: number;
  /** 一般贈与財産分の按分後税額（1円未満切り捨て） */
  generalShareTax: number;
  /** 算出税額（按分後の合計） */
  calculatedTax: number;
  /** 納付額の目安（算出税額の100円未満切り捨て） */
  payableTax: number;
  /** 贈与額合計に対する納付額の割合（%）。贈与0なら0 */
  effectiveRate: number;
  /** 比較: 贈与全体が特例税率だった場合の納付額の目安 */
  allSpecialPayable: number;
  /** 比較: 贈与全体が一般税率だった場合の納付額の目安 */
  allGeneralPayable: number;
  /** 比較: 一般税率 − 特例税率 の納付額差（正なら特例が有利） */
  comparisonDifference: number;
}

export function floorTo(value: number, unit: number): number {
  return Math.floor(value / unit) * unit;
}

export function findBracketIndex(
  brackets: readonly GiftTaxBracket[],
  taxablePrice: number,
): number {
  const i = brackets.findIndex((b) => taxablePrice <= b.upTo);
  return i < 0 ? brackets.length - 1 : i;
}

/** 課税価格に速算表を適用した税額（1円未満切り捨て）。課税価格0以下は0 */
export function taxByBrackets(
  brackets: readonly GiftTaxBracket[],
  taxablePrice: number,
): number {
  if (taxablePrice <= 0) return 0;
  const b = brackets[findBracketIndex(brackets, taxablePrice)];
  return Math.max(
    0,
    Math.floor((taxablePrice * b.ratePercent) / 100) - b.deduction,
  );
}

/** tax × part ÷ total を1円未満切り捨てで求める（桁あふれを避けるため BigInt） */
export function apportion(tax: number, part: number, total: number): number {
  if (total <= 0 || part <= 0 || tax <= 0) return 0;
  return Number((BigInt(tax) * BigInt(part)) / BigInt(total));
}

function isValidAmount(n: number): boolean {
  return Number.isFinite(n) && n >= 0 && n <= MAX_GIFT_AMOUNT;
}

export function calculateGiftTax(input: GiftTaxInput): GiftTaxResult | null {
  if (
    !isValidAmount(input.specialAmount) ||
    !isValidAmount(input.generalAmount)
  ) {
    return null;
  }
  const specialAmount = Math.floor(input.specialAmount);
  const generalAmount = Math.floor(input.generalAmount);
  const totalGift = specialAmount + generalAmount;

  const appliedDeduction = Math.min(totalGift, GIFT_BASIC_DEDUCTION);
  const taxablePrice = floorTo(
    totalGift - appliedDeduction,
    TAXABLE_PRICE_UNIT,
  );

  const specialFullTax = taxByBrackets(SPECIAL_BRACKETS, taxablePrice);
  const generalFullTax = taxByBrackets(GENERAL_BRACKETS, taxablePrice);

  // 国税庁の按分計算: 各税率で全体を計算した税額を、財産の価額（基礎控除前）の比で按分する
  const specialShareTax = apportion(specialFullTax, specialAmount, totalGift);
  const generalShareTax = apportion(generalFullTax, generalAmount, totalGift);
  const calculatedTax = specialShareTax + generalShareTax;
  const payableTax = floorTo(calculatedTax, PAYABLE_TAX_UNIT);

  const pick = (
    brackets: readonly GiftTaxBracket[],
    amount: number,
  ): GiftTaxBracketUse | null => {
    if (taxablePrice <= 0 || amount <= 0) return null;
    const index = findBracketIndex(brackets, taxablePrice);
    return { index, bracket: brackets[index] };
  };

  const allSpecialPayable = floorTo(specialFullTax, PAYABLE_TAX_UNIT);
  const allGeneralPayable = floorTo(generalFullTax, PAYABLE_TAX_UNIT);

  return {
    specialAmount,
    generalAmount,
    totalGift,
    appliedDeduction,
    taxablePrice,
    specialBracket: pick(SPECIAL_BRACKETS, specialAmount),
    generalBracket: pick(GENERAL_BRACKETS, generalAmount),
    specialFullTax,
    generalFullTax,
    specialShareTax,
    generalShareTax,
    calculatedTax,
    payableTax,
    effectiveRate: totalGift > 0 ? (payableTax / totalGift) * 100 : 0,
    allSpecialPayable,
    allGeneralPayable,
    comparisonDifference: allGeneralPayable - allSpecialPayable,
  };
}
