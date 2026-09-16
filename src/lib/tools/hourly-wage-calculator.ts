export type WageUnit = 'hourly' | 'daily' | 'monthly' | 'annual';

export interface WageConversionInput {
  amount: number;
  unit: WageUnit;
  hoursPerDay: number;
  daysPerMonth: number;
}

export interface WageConversionResult {
  hourly: number;
  daily: number;
  monthly: number;
  annual: number;
}

/**
 * 時給・日給・月給・年収を相互換算する。
 * 月給→年収はボーナスを含まず単純に12倍した金額。
 * 入力値や勤務時間・勤務日数が0以下の場合はnull。
 */
export function convertWage(
  input: WageConversionInput,
): WageConversionResult | null {
  const { amount, unit, hoursPerDay, daysPerMonth } = input;
  if (!(amount > 0) || !(hoursPerDay > 0) || !(daysPerMonth > 0)) return null;

  let hourly: number;
  switch (unit) {
    case 'hourly':
      hourly = amount;
      break;
    case 'daily':
      hourly = amount / hoursPerDay;
      break;
    case 'monthly':
      hourly = amount / (hoursPerDay * daysPerMonth);
      break;
    case 'annual':
      hourly = amount / 12 / (hoursPerDay * daysPerMonth);
      break;
  }

  const daily = hourly * hoursPerDay;
  const monthly = daily * daysPerMonth;
  const annual = monthly * 12;

  return { hourly, daily, monthly, annual };
}

export interface OvertimeCategoryInput {
  /** 区分の表示名（例: 「時間外労働（法定・60時間以内）」） */
  label: string;
  /** この区分に該当する労働時間数 */
  hours: number;
  /** 割増率（%）。例: 25なら1.25倍 */
  ratePercent: number;
}

export interface OvertimeCategoryResult extends OvertimeCategoryInput {
  /** 割増分のみの金額（基礎時給分は含まない） */
  premiumPay: number;
  /** 基礎時給分＋割増分の合計金額 */
  totalPay: number;
}

export interface OvertimePayResult {
  categories: OvertimeCategoryResult[];
  /** 割増分のみの合計金額 */
  totalPremiumPay: number;
  /** 基礎時給分を含めた合計金額 */
  totalPay: number;
}

/**
 * 基礎時給と、区分ごとの労働時間・割増率から割増賃金を計算する。
 * 各区分は独立して計算するため、同じ時間帯が複数区分（例: 時間外労働中の深夜労働）に
 * 重複する場合は、呼び出し側で対象時間を区分ごとに振り分けるか、
 * 該当する割増率を合算した区分として入力する必要がある。
 * 基礎時給が0以下、またはいずれかの区分の時間・割増率が負の場合はnull。
 */
export function calculateOvertimePay(
  hourlyWage: number,
  categories: OvertimeCategoryInput[],
): OvertimePayResult | null {
  if (!(hourlyWage > 0)) return null;
  if (categories.some((c) => !(c.hours >= 0) || !(c.ratePercent >= 0)))
    return null;

  const results = categories.map((c) => {
    const basePay = hourlyWage * c.hours;
    const premiumPay = basePay * (c.ratePercent / 100);
    return { ...c, premiumPay, totalPay: basePay + premiumPay };
  });

  return {
    categories: results,
    totalPremiumPay: results.reduce((sum, c) => sum + c.premiumPay, 0),
    totalPay: results.reduce((sum, c) => sum + c.totalPay, 0),
  };
}
