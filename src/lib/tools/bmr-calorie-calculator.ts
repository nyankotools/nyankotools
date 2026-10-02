export type Sex = 'male' | 'female';
export type BmrFormula = 'mifflin' | 'harris' | 'japan';
export type ActivityLevel =
  'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export const activityLevels: ActivityLevel[] = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'veryActive',
];

/** 活動係数（Harris-Benedict式で一般的に使われる値） */
export const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

/** 日本人の食事摂取基準（2020年版）の基礎代謝基準値（kcal/kg体重/日）。18歳以上のみ。 */
const japanReferenceValues: { maxAge: number; male: number; female: number }[] =
  [
    { maxAge: 29, male: 23.7, female: 22.1 },
    { maxAge: 49, male: 22.5, female: 21.9 },
    { maxAge: 64, male: 21.8, female: 20.7 },
    { maxAge: 74, male: 21.6, female: 20.7 },
    { maxAge: Infinity, male: 21.5, female: 20.7 },
  ];

export const JAPAN_FORMULA_MIN_AGE = 18;
export const MAX_AGE = 120;

/**
 * 基礎代謝量（kcal/日）を求める。入力が不正な場合、または日本人の基準値を
 * 18歳未満に使おうとした場合は null。
 */
export function calculateBmr(
  formula: BmrFormula,
  sex: Sex,
  age: number,
  heightCm: number,
  weightKg: number,
): number | null {
  if (
    !isFinite(age) ||
    !isFinite(heightCm) ||
    !isFinite(weightKg) ||
    !Number.isInteger(age) ||
    age < 1 ||
    age > MAX_AGE ||
    !(heightCm > 0) ||
    !(weightKg > 0)
  )
    return null;

  let bmr: number;
  if (formula === 'mifflin') {
    bmr =
      10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
  } else if (formula === 'harris') {
    bmr =
      sex === 'male'
        ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
        : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
  } else {
    if (age < JAPAN_FORMULA_MIN_AGE) return null;
    const row = japanReferenceValues.find((r) => age <= r.maxAge)!;
    bmr = (sex === 'male' ? row.male : row.female) * weightKg;
  }
  return isFinite(bmr) && bmr > 0 ? bmr : null;
}

/** 1日の総消費カロリー（維持カロリー）= 基礎代謝量 × 活動係数 */
export function calculateTdee(bmr: number, level: ActivityLevel): number {
  return bmr * activityFactors[level];
}

export interface CalorieTargets {
  maintain: number;
  mildLoss: number;
  loss: number;
  gain: number;
}

/** 維持カロリーを基準にした、減量（-10% / -20%）・増量（+10%）の目安 */
export function calculateCalorieTargets(tdee: number): CalorieTargets {
  return {
    maintain: tdee,
    mildLoss: tdee * 0.9,
    loss: tdee * 0.8,
    gain: tdee * 1.1,
  };
}
