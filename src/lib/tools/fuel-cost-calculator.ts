export type FuelEconomyUnit = 'kmPerL' | 'lPer100km';

export interface FuelCostInput {
  /** 走行距離（km） */
  distanceKm: number;
  /** 燃費の値。単位は economyUnit に従う */
  economy: number;
  economyUnit: FuelEconomyUnit;
  /** 燃料単価（1Lあたり） */
  pricePerLiter: number;
  /** 高速料金・駐車場代などの追加費用（合計）。0以上 */
  extraCost: number;
  /** 割り勘の人数（1以上の整数） */
  people: number;
}

export interface FuelCostResult {
  /** 必要な燃料（L） */
  liters: number;
  /** 燃料代 */
  fuelCost: number;
  /** 燃料代＋追加費用 */
  totalCost: number;
  /** 1kmあたりの燃料代 */
  fuelCostPerKm: number;
  /** 1kmあたりの総費用（追加費用込み） */
  totalCostPerKm: number;
  /** 総費用を人数で割った金額（端数あり） */
  perPerson: number;
  /** 総費用を人数で割り、1円単位に切り上げた金額（徴収漏れを防ぐ） */
  perPersonCeil: number;
}

/**
 * 走行距離・燃費・燃料単価から燃料代と1km当たりのコスト、割り勘額を計算する。
 * 距離・燃費・単価が0以下、追加費用が負、人数が1以上の整数でない、
 * または有限でない値が含まれる場合は null。
 */
export function calculateFuelCost(input: FuelCostInput): FuelCostResult | null {
  const { distanceKm, economy, economyUnit, pricePerLiter, extraCost, people } =
    input;
  if (
    !Number.isFinite(distanceKm) ||
    !Number.isFinite(economy) ||
    !Number.isFinite(pricePerLiter) ||
    !Number.isFinite(extraCost)
  )
    return null;
  if (!(distanceKm > 0) || !(economy > 0) || !(pricePerLiter > 0)) return null;
  if (extraCost < 0) return null;
  if (!Number.isInteger(people) || people < 1) return null;

  const kmPerLiter = economyUnit === 'kmPerL' ? economy : 100 / economy;
  const liters = distanceKm / kmPerLiter;
  const fuelCost = liters * pricePerLiter;
  const totalCost = fuelCost + extraCost;
  const perPerson = totalCost / people;

  return {
    liters,
    fuelCost,
    totalCost,
    fuelCostPerKm: fuelCost / distanceKm,
    totalCostPerKm: totalCost / distanceKm,
    perPerson,
    // 浮動小数点誤差で 1000.0000000001 → 1001 になるのを避ける
    perPersonCeil: Math.ceil(Math.round(perPerson * 1e6) / 1e6),
  };
}
