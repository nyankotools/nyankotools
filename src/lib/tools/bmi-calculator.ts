export type BmiCategory =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obeseClass1'
  | 'obeseClass2'
  | 'obeseClass3';

/**
 * BMI = 体重(kg) / 身長(m)^2。
 * 身長・体重がNaN・Infinity、または0以下の場合はnull。
 */
export function calculateBmi(
  heightCm: number,
  weightKg: number,
): number | null {
  if (
    !isFinite(heightCm) ||
    !isFinite(weightKg) ||
    !(heightCm > 0) ||
    !(weightKg > 0)
  )
    return null;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return isFinite(bmi) ? bmi : null;
}

/**
 * BMI値から体格区分を判定する。
 * 判定基準（18.5 / 25 / 30 / 35 / 40）は日本肥満学会・WHOのいずれも共通だが、
 * 25以上の呼称・区切り方が両者で異なるため、表示ラベルは呼び出し側（i18n辞書）で
 * ロケールごとに切り替える。
 */
export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  if (bmi < 35) return 'obeseClass1';
  if (bmi < 40) return 'obeseClass2';
  return 'obeseClass3';
}

export interface HealthyWeightRange {
  minKg: number;
  maxKg: number;
}

/**
 * BMI 18.5〜25（普通体重の範囲）に対応する体重の範囲を求める。
 * 身長がNaN・Infinity、または0以下の場合はnull。
 */
export function calculateHealthyWeightRange(
  heightCm: number,
): HealthyWeightRange | null {
  if (!isFinite(heightCm) || !(heightCm > 0)) return null;

  const heightM = heightCm / 100;
  const minKg = 18.5 * heightM * heightM;
  const maxKg = 25 * heightM * heightM;
  return isFinite(minKg) && isFinite(maxKg) ? { minKg, maxKg } : null;
}

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

export function lbToKg(lb: number): number {
  return lb * 0.45359237;
}

export function kgToLb(kg: number): number {
  return kg / 0.45359237;
}
