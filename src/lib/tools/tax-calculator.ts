export type RoundingMode = 'floor' | 'round' | 'ceil';

// 浮動小数点誤差（例: 1100 / 1.1 が 999.9999999999999 になる）を
// 端数処理の前に補正するため、十分小さい単位で一度四捨五入しておく。
function correctFloatingPointError(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

function roundBy(value: number, rounding: RoundingMode): number {
  const corrected = correctFloatingPointError(value);
  switch (rounding) {
    case 'floor':
      return Math.floor(corrected);
    case 'ceil':
      return Math.ceil(corrected);
    case 'round':
      return Math.round(corrected);
  }
}

export interface TaxCalculationInput {
  /** 入力金額（税込・税抜のどちらかは priceIncludesTax で指定） */
  amount: number;
  /** 消費税率（%）。標準税率10・軽減税率8のほかカスタム値も想定 */
  taxRatePercent: number;
  /** true: amountは税込金額 / false: amountは税抜金額 */
  priceIncludesTax: boolean;
  /** 消費税額の端数処理方法 */
  rounding: RoundingMode;
}

export interface TaxCalculationResult {
  taxExcludedAmount: number;
  taxAmount: number;
  taxIncludedAmount: number;
}

/**
 * 税抜/税込金額の一方から、消費税額ともう一方の金額を計算する。
 * 税込金額から税抜金額を逆算する場合、端数処理は税抜金額に対して行い、
 * 消費税額は差分（税込金額－税抜金額）として求める。
 * 金額または税率が負、あるいはNaNの場合はnull。
 */
export function calculateTax(
  input: TaxCalculationInput,
): TaxCalculationResult | null {
  const { amount, taxRatePercent, priceIncludesTax, rounding } = input;
  if (!(amount >= 0) || !(taxRatePercent >= 0)) return null;

  if (priceIncludesTax) {
    const taxExcludedAmount = roundBy(
      amount / (1 + taxRatePercent / 100),
      rounding,
    );
    return {
      taxExcludedAmount,
      taxAmount: amount - taxExcludedAmount,
      taxIncludedAmount: amount,
    };
  }

  const taxAmount = roundBy(amount * (taxRatePercent / 100), rounding);
  return {
    taxExcludedAmount: amount,
    taxAmount,
    taxIncludedAmount: amount + taxAmount,
  };
}

export type DiscountType = 'percent' | 'amount';

export interface DiscountCalculationInput {
  originalPrice: number;
  discountType: DiscountType;
  /** discountTypeが'percent'なら割引率（%）、'amount'なら割引額 */
  discountValue: number;
  /** 割引額の端数処理方法（discountTypeが'percent'の場合のみ使用） */
  rounding: RoundingMode;
}

export interface DiscountCalculationResult {
  discountAmount: number;
  discountedPrice: number;
  /** 実際の割引率（%）。discountTypeが'amount'の場合も参考値として計算する */
  discountRatePercent: number;
}

/**
 * 元の価格と割引率または割引額から、割引額・割引後の価格を計算する。
 * 元の価格が0以下、割引値が負、または割引額・割引率が元の価格を超える場合はnull。
 */
export function calculateDiscount(
  input: DiscountCalculationInput,
): DiscountCalculationResult | null {
  const { originalPrice, discountType, discountValue, rounding } = input;
  if (!(originalPrice > 0) || !(discountValue >= 0)) return null;

  let discountAmount: number;
  if (discountType === 'percent') {
    if (discountValue > 100) return null;
    discountAmount = roundBy(originalPrice * (discountValue / 100), rounding);
  } else {
    if (discountValue > originalPrice) return null;
    discountAmount = discountValue;
  }

  return {
    discountAmount,
    discountedPrice: originalPrice - discountAmount,
    discountRatePercent: (discountAmount / originalPrice) * 100,
  };
}
