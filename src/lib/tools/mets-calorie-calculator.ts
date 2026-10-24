/** 1METsあたりの係数（kcal / kg / 時間）。消費kcal = METs × 体重(kg) × 時間(h) × 1.05 */
export const METS_FACTOR = 1.05;

export const MAX_WEIGHT_KG = 500;
export const MAX_METS = 30;
export const MAX_ENTRY_MINUTES = 24 * 60;

export type ExerciseGroup =
  'walking' | 'running' | 'cycling' | 'water' | 'training' | 'sports' | 'daily';

export const exerciseGroups: ExerciseGroup[] = [
  'walking',
  'running',
  'cycling',
  'water',
  'training',
  'sports',
  'daily',
];

export interface Exercise {
  id: string;
  group: ExerciseGroup;
  /** METs値（身体活動のMETs表を参考にした丸めた目安値） */
  mets: number;
}

/**
 * 主要な運動のMETs値。Ainsworth らの Compendium of Physical Activities および
 * 国立健康・栄養研究所「改訂版 身体活動のMETs表」を参考にした、代表値の目安。
 */
export const exercises: Exercise[] = [
  { id: 'walkSlow', group: 'walking', mets: 2.8 },
  { id: 'walkNormal', group: 'walking', mets: 3.0 },
  { id: 'walkBrisk', group: 'walking', mets: 4.3 },
  { id: 'stairsUp', group: 'walking', mets: 8.8 },
  { id: 'jogging', group: 'running', mets: 7.0 },
  { id: 'running8', group: 'running', mets: 8.3 },
  { id: 'running10', group: 'running', mets: 9.8 },
  { id: 'cyclingLight', group: 'cycling', mets: 4.0 },
  { id: 'cyclingModerate', group: 'cycling', mets: 6.8 },
  { id: 'swimLight', group: 'water', mets: 5.8 },
  { id: 'swimHard', group: 'water', mets: 9.8 },
  { id: 'aquaWalking', group: 'water', mets: 4.0 },
  { id: 'strengthLight', group: 'training', mets: 3.5 },
  { id: 'strengthHard', group: 'training', mets: 6.0 },
  { id: 'yoga', group: 'training', mets: 2.5 },
  { id: 'stretching', group: 'training', mets: 2.3 },
  { id: 'radioExercise', group: 'training', mets: 4.0 },
  { id: 'jumpRope', group: 'training', mets: 8.8 },
  { id: 'tennis', group: 'sports', mets: 7.3 },
  { id: 'badminton', group: 'sports', mets: 5.5 },
  { id: 'golf', group: 'sports', mets: 4.8 },
  { id: 'cooking', group: 'daily', mets: 1.8 },
  { id: 'laundry', group: 'daily', mets: 2.0 },
  { id: 'cleaning', group: 'daily', mets: 3.3 },
  { id: 'deskWork', group: 'daily', mets: 1.5 },
];

export function findExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function lbToKg(lb: number): number {
  return lb * 0.45359237;
}

/** 時間と分を合計の分に直す。空欄は0扱い。不正な値は null */
export function toMinutes(hours: number, minutes: number): number | null {
  if (!isFinite(hours) || !isFinite(minutes) || hours < 0 || minutes < 0)
    return null;
  const total = hours * 60 + minutes;
  return total <= MAX_ENTRY_MINUTES ? total : null;
}

/**
 * 消費カロリー（kcal）を求める。入力が不正なら null。
 * excludeResting が true のときは安静時の1METsを差し引いた「運動による上乗せ分」。
 */
export function calculateCalories(
  mets: number,
  weightKg: number,
  minutes: number,
  excludeResting = false,
): number | null {
  if (
    !isFinite(mets) ||
    !isFinite(weightKg) ||
    !isFinite(minutes) ||
    mets <= 0 ||
    mets > MAX_METS ||
    weightKg <= 0 ||
    weightKg > MAX_WEIGHT_KG ||
    minutes < 0 ||
    minutes > MAX_ENTRY_MINUTES
  )
    return null;
  const effective = excludeResting ? Math.max(mets - 1, 0) : mets;
  return effective * weightKg * (minutes / 60) * METS_FACTOR;
}

export interface ActivityEntry {
  mets: number;
  minutes: number;
}

export interface ActivitySummary {
  /** 各行の消費kcal（不正な行は null） */
  items: (number | null)[];
  totalKcal: number;
  totalMinutes: number;
  /** 有効な行の数 */
  validCount: number;
}

export function summarize(
  entries: ActivityEntry[],
  weightKg: number,
  excludeResting = false,
): ActivitySummary {
  let totalKcal = 0;
  let totalMinutes = 0;
  let validCount = 0;
  const items = entries.map((e) => {
    const kcal = calculateCalories(e.mets, weightKg, e.minutes, excludeResting);
    if (kcal !== null) {
      totalKcal += kcal;
      totalMinutes += e.minutes;
      validCount += 1;
    }
    return kcal;
  });
  return { items, totalKcal, totalMinutes, validCount };
}
