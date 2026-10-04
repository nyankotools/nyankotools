export type BreakEvenError =
  | 'invalidPrice'
  | 'invalidVariableCost'
  | 'invalidFixedCost'
  | 'invalidTargetProfit'
  | 'invalidExpectedUnits'
  | 'noContribution';

export interface BreakEvenInput {
  /** 販売単価 */
  price: number;
  /** 1個あたりの変動費 */
  variableCost: number;
  /** 固定費（期間合計） */
  fixedCost: number;
  /** 目標利益（0なら損益分岐点のみ） */
  targetProfit: number;
  /** 予想販売数量（nullなら未指定） */
  expectedUnits: number | null;
}

export interface BreakEvenResult {
  /** 1個あたりの限界利益 */
  contributionPerUnit: number;
  /** 限界利益率（0〜1） */
  contributionRatio: number;
  /** 損益分岐点の販売数量（端数は切り上げ） */
  breakEvenUnits: number;
  /** 損益分岐点売上高 */
  breakEvenSales: number;
  /** 目標利益を達成する販売数量（端数は切り上げ） */
  targetUnits: number;
  /** 目標利益を達成する売上高 */
  targetSales: number;
  /** 予想販売数量での利益（予想数量が未指定ならnull） */
  expectedProfit: number | null;
  /** 安全余裕率（予想売上が損益分岐点売上をどれだけ上回るか。予想数量が未指定ならnull） */
  marginOfSafety: number | null;
}

const MAX_VALUE = 1e12;

function isNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= MAX_VALUE;
}

/** 販売単価・変動費・固定費から損益分岐点（数量・売上高）と目標利益の達成ラインを求める。 */
export function calculateBreakEven(
  input: BreakEvenInput,
): BreakEvenResult | { error: BreakEvenError } {
  const { price, variableCost, fixedCost, targetProfit, expectedUnits } = input;
  if (!Number.isFinite(price) || price <= 0 || price > MAX_VALUE)
    return { error: 'invalidPrice' };
  if (!isNonNegative(variableCost)) return { error: 'invalidVariableCost' };
  if (!isNonNegative(fixedCost)) return { error: 'invalidFixedCost' };
  if (!isNonNegative(targetProfit)) return { error: 'invalidTargetProfit' };
  if (expectedUnits !== null && !isNonNegative(expectedUnits))
    return { error: 'invalidExpectedUnits' };

  const contributionPerUnit = price - variableCost;
  if (contributionPerUnit <= 0) return { error: 'noContribution' };
  const contributionRatio = contributionPerUnit / price;

  const breakEvenUnits = Math.max(
    0,
    Math.ceil(fixedCost / contributionPerUnit - 1e-9),
  );
  const targetUnits = Math.ceil(
    (fixedCost + targetProfit) / contributionPerUnit - 1e-9,
  );
  const breakEvenSales = fixedCost / contributionRatio;
  const targetSales = (fixedCost + targetProfit) / contributionRatio;

  let expectedProfit: number | null = null;
  let marginOfSafety: number | null = null;
  if (expectedUnits !== null) {
    expectedProfit = expectedUnits * contributionPerUnit - fixedCost;
    const expectedSales = expectedUnits * price;
    marginOfSafety =
      expectedSales === 0
        ? null
        : (expectedSales - breakEvenSales) / expectedSales;
  }

  return {
    contributionPerUnit,
    contributionRatio,
    breakEvenUnits,
    breakEvenSales,
    targetUnits,
    targetSales,
    expectedProfit,
    marginOfSafety,
  };
}
