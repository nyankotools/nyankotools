export type Goal = 'loss' | 'mildLoss' | 'maintain' | 'gain';
export type PfcPreset = 'balanced' | 'highProtein' | 'lowCarb' | 'custom';

export const goals: Goal[] = ['loss', 'mildLoss', 'maintain', 'gain'];
export const presets: PfcPreset[] = [
  'balanced',
  'highProtein',
  'lowCarb',
  'custom',
];

/** 1gあたりのエネルギー（Atwater係数、kcal/g） */
export const KCAL_PER_GRAM = { protein: 4, fat: 9, carb: 4 } as const;

/** 目標ごとの摂取カロリー係数（維持カロリー比） */
export const goalFactors: Record<Goal, number> = {
  loss: 0.8,
  mildLoss: 0.9,
  maintain: 1,
  gain: 1.1,
};

export interface PfcRatio {
  protein: number;
  fat: number;
  carb: number;
}

/** プリセットの比率（%）。custom は含まない。 */
export const presetRatios: Record<Exclude<PfcPreset, 'custom'>, PfcRatio> = {
  balanced: { protein: 15, fat: 25, carb: 60 },
  highProtein: { protein: 30, fat: 25, carb: 45 },
  lowCarb: { protein: 30, fat: 40, carb: 30 },
};

/** 体重あたりタンパク質量の目安（g/kg） */
export const proteinPerKgGuide: number[] = [0.8, 1.2, 1.6, 2.0];

export const MAX_CALORIES = 20000;

/** 目標に応じた摂取カロリー。入力が不正なら null。 */
export function calorieForGoal(maintenance: number, goal: Goal): number | null {
  if (!isFinite(maintenance) || !(maintenance > 0)) return null;
  return maintenance * goalFactors[goal];
}

/** 比率（%）の合計が100（誤差0.01以内）で、各値が0以上かを判定する。 */
export function isValidRatio(ratio: PfcRatio): boolean {
  const values = [ratio.protein, ratio.fat, ratio.carb];
  if (values.some((v) => !isFinite(v) || v < 0)) return false;
  return Math.abs(values[0] + values[1] + values[2] - 100) < 0.01;
}

export interface PfcResult {
  protein: { grams: number; kcal: number; percent: number };
  fat: { grams: number; kcal: number; percent: number };
  carb: { grams: number; kcal: number; percent: number };
}

/**
 * 摂取カロリーと比率（%）から P/F/C の摂取量(g)を求める。
 * カロリーが不正、または比率が不正な場合は null。
 */
export function calculatePfc(
  calories: number,
  ratio: PfcRatio,
): PfcResult | null {
  if (!isFinite(calories) || !(calories > 0) || calories > MAX_CALORIES)
    return null;
  if (!isValidRatio(ratio)) return null;
  const make = (percent: number, perGram: number) => {
    const kcal = (calories * percent) / 100;
    return { grams: kcal / perGram, kcal, percent };
  };
  return {
    protein: make(ratio.protein, KCAL_PER_GRAM.protein),
    fat: make(ratio.fat, KCAL_PER_GRAM.fat),
    carb: make(ratio.carb, KCAL_PER_GRAM.carb),
  };
}

/** タンパク質量(g)を体重あたり(g/kg)に換算する。体重が不正なら null。 */
export function proteinPerKg(
  proteinGrams: number,
  weightKg: number,
): number | null {
  if (!isFinite(proteinGrams) || !isFinite(weightKg) || !(weightKg > 0))
    return null;
  return proteinGrams / weightKg;
}

/** 体重から各 g/kg 目安のタンパク質量(g)を求める。体重が不正なら空配列。 */
export function proteinGuideGrams(
  weightKg: number,
): { perKg: number; grams: number }[] {
  if (!isFinite(weightKg) || !(weightKg > 0)) return [];
  return proteinPerKgGuide.map((perKg) => ({ perKg, grams: perKg * weightKg }));
}
