export type ElectricityCostError =
  | 'invalidWatts'
  | 'invalidHours'
  | 'invalidDays'
  | 'invalidPrice'
  | 'invalidQuantity';

export interface ElectricityCostInput {
  /** 1台あたりの消費電力（W） */
  watts: number;
  /** 1日あたりの使用時間（時間） */
  hoursPerDay: number;
  /** 1か月あたりの使用日数 */
  daysPerMonth: number;
  /** 電力量料金単価（1kWhあたり） */
  pricePerKwh: number;
  /** 台数 */
  quantity: number;
}

export interface ElectricityPeriod {
  kwh: number;
  cost: number;
}

export interface ElectricityCostResult {
  perHour: ElectricityPeriod;
  perDay: ElectricityPeriod;
  perMonth: ElectricityPeriod;
  perYear: ElectricityPeriod;
}

const MAX_WATTS = 1_000_000;
const MAX_QUANTITY = 1000;

function isFiniteNumber(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value);
}

/** 消費電力・使用時間・単価から、1時間／1日／1か月／1年の電力量と電気代を求める。 */
export function calculateElectricityCost(
  input: ElectricityCostInput,
): ElectricityCostResult | { error: ElectricityCostError } {
  const { watts, hoursPerDay, daysPerMonth, pricePerKwh, quantity } = input;
  if (!isFiniteNumber(watts) || watts <= 0 || watts > MAX_WATTS)
    return { error: 'invalidWatts' };
  if (!isFiniteNumber(hoursPerDay) || hoursPerDay < 0 || hoursPerDay > 24)
    return { error: 'invalidHours' };
  if (!Number.isInteger(daysPerMonth) || daysPerMonth < 1 || daysPerMonth > 31)
    return { error: 'invalidDays' };
  if (!isFiniteNumber(pricePerKwh) || pricePerKwh < 0)
    return { error: 'invalidPrice' };
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY)
    return { error: 'invalidQuantity' };

  const kwhPerHour = (watts * quantity) / 1000;
  const period = (kwh: number): ElectricityPeriod => ({
    kwh,
    cost: kwh * pricePerKwh,
  });
  const kwhPerDay = kwhPerHour * hoursPerDay;
  const kwhPerMonth = kwhPerDay * daysPerMonth;
  return {
    perHour: period(kwhPerHour),
    perDay: period(kwhPerDay),
    perMonth: period(kwhPerMonth),
    perYear: period(kwhPerMonth * 12),
  };
}
