export type RoundingMode = 'up' | 'down' | 'nearest';

export type SplitBillError =
  | 'invalidTotal'
  | 'invalidPeople'
  | 'invalidHigherCount'
  | 'invalidRatio'
  | 'invalidUnit';

export interface SplitBillInput {
  total: number;
  people: number;
  /** 多めに払う人数（0なら均等割り） */
  higherCount: number;
  /** 多めに払う人の負担倍率（例: 1.5） */
  higherRatio: number;
  /** 丸める単位（例: 100） */
  roundingUnit: number;
  roundingMode: RoundingMode;
}

export interface SplitBillGroup {
  count: number;
  /** 1人あたりの支払額（丸め後） */
  amountEach: number;
}

export interface SplitBillResult {
  groups: SplitBillGroup[];
  /** 全員の支払額の合計 */
  collected: number;
  /** 集まる金額 − 合計金額（プラス=余り、マイナス=不足） */
  difference: number;
}

const MAX_PEOPLE = 1000;

/** value を unit の倍数に丸める。割り算の誤差で境界がずれないよう補正する。 */
export function roundToUnit(
  value: number,
  unit: number,
  mode: RoundingMode,
): number {
  const q = value / unit;
  const nearestInt = Math.round(q);
  let rounded: number;
  if (Math.abs(q - nearestInt) < 1e-9) {
    rounded = nearestInt;
  } else if (mode === 'up') {
    rounded = Math.ceil(q);
  } else if (mode === 'down') {
    rounded = Math.floor(q);
  } else {
    rounded = nearestInt;
  }
  return Number((rounded * unit).toFixed(6));
}

/**
 * 割り勘を計算する。多めに払う人は higherRatio 倍の重みで按分し、
 * 1人あたりの金額を丸め単位で丸める。丸めによる余り・不足は difference で返す。
 */
export function splitBill(
  input: SplitBillInput,
): SplitBillResult | { error: SplitBillError } {
  const { total, people, higherCount, higherRatio, roundingUnit } = input;
  if (!isFinite(total) || !(total > 0)) return { error: 'invalidTotal' };
  if (!Number.isInteger(people) || people < 1 || people > MAX_PEOPLE)
    return { error: 'invalidPeople' };
  if (!Number.isInteger(higherCount) || higherCount < 0 || higherCount > people)
    return { error: 'invalidHigherCount' };
  if (higherCount > 0 && (!isFinite(higherRatio) || !(higherRatio > 0)))
    return { error: 'invalidRatio' };
  if (!isFinite(roundingUnit) || !(roundingUnit > 0))
    return { error: 'invalidUnit' };

  const ratio = higherCount > 0 ? higherRatio : 1;
  const totalWeight = higherCount * ratio + (people - higherCount);
  const base = total / totalWeight;

  const groups: SplitBillGroup[] = [];
  const regularCount = people - higherCount;
  if (higherCount > 0) {
    groups.push({
      count: higherCount,
      amountEach: roundToUnit(base * ratio, roundingUnit, input.roundingMode),
    });
  }
  if (regularCount > 0) {
    groups.push({
      count: regularCount,
      amountEach: roundToUnit(base, roundingUnit, input.roundingMode),
    });
  }

  const collected = Number(
    groups.reduce((sum, g) => sum + g.count * g.amountEach, 0).toFixed(6),
  );
  return {
    groups,
    collected,
    difference: Number((collected - total).toFixed(6)),
  };
}
