import { describe, it, expect } from 'vitest';
import {
  calculatePfc,
  calorieForGoal,
  isValidRatio,
  MAX_CALORIES,
  presetRatios,
  proteinGuideGrams,
  proteinPerKg,
} from './pfc-calculator';

describe('calorieForGoal', () => {
  it('目標ごとに係数が掛かる', () => {
    expect(calorieForGoal(2000, 'loss')).toBeCloseTo(1600, 6);
    expect(calorieForGoal(2000, 'mildLoss')).toBeCloseTo(1800, 6);
    expect(calorieForGoal(2000, 'maintain')).toBe(2000);
    expect(calorieForGoal(2000, 'gain')).toBeCloseTo(2200, 6);
  });

  it('不正な値は null', () => {
    expect(calorieForGoal(0, 'maintain')).toBeNull();
    expect(calorieForGoal(-1, 'loss')).toBeNull();
    expect(calorieForGoal(NaN, 'gain')).toBeNull();
  });
});

describe('calculatePfc 境界値', () => {
  it('上限 MAX_CALORIES は有効、超過と0以下は null', () => {
    const ratio = presetRatios.balanced;
    expect(calculatePfc(MAX_CALORIES, ratio)).not.toBeNull();
    expect(calculatePfc(MAX_CALORIES + 1, ratio)).toBeNull();
    expect(calculatePfc(0, ratio)).toBeNull();
    expect(calculatePfc(NaN, ratio)).toBeNull();
  });

  it('各栄養素のグラム数は kcal ÷ (4/9/4) で求まる', () => {
    const r = calculatePfc(2000, { protein: 20, fat: 30, carb: 50 })!;
    expect(r.protein.grams).toBeCloseTo(100, 6);
    expect(r.fat.grams).toBeCloseTo(600 / 9, 6);
    expect(r.carb.grams).toBeCloseTo(250, 6);
  });

  it('比率に負数・NaNがあれば null', () => {
    expect(calculatePfc(2000, { protein: -5, fat: 55, carb: 50 })).toBeNull();
    expect(calculatePfc(2000, { protein: NaN, fat: 50, carb: 50 })).toBeNull();
  });
});

describe('isValidRatio', () => {
  it('合計100で有効', () => {
    expect(isValidRatio({ protein: 15, fat: 25, carb: 60 })).toBe(true);
  });
  it('合計が100でない・負数・NaN は無効', () => {
    expect(isValidRatio({ protein: 15, fat: 25, carb: 50 })).toBe(false);
    expect(isValidRatio({ protein: -10, fat: 50, carb: 60 })).toBe(false);
    expect(isValidRatio({ protein: NaN, fat: 50, carb: 50 })).toBe(false);
  });
  it('すべてのプリセットは有効', () => {
    for (const r of Object.values(presetRatios))
      expect(isValidRatio(r)).toBe(true);
  });
});

describe('calculatePfc', () => {
  it('2000kcal バランス型 15/25/60', () => {
    const r = calculatePfc(2000, presetRatios.balanced)!;
    expect(r.protein.grams).toBeCloseTo(75, 6); // 300/4
    expect(r.fat.grams).toBeCloseTo(55.5556, 3); // 500/9
    expect(r.carb.grams).toBeCloseTo(300, 6); // 1200/4
    expect(r.protein.kcal + r.fat.kcal + r.carb.kcal).toBeCloseTo(2000, 6);
  });

  it('カロリー不正は null', () => {
    expect(calculatePfc(0, presetRatios.balanced)).toBeNull();
    expect(calculatePfc(-100, presetRatios.balanced)).toBeNull();
    expect(calculatePfc(NaN, presetRatios.balanced)).toBeNull();
    expect(calculatePfc(1e9, presetRatios.balanced)).toBeNull();
  });

  it('比率不正は null', () => {
    expect(calculatePfc(2000, { protein: 10, fat: 10, carb: 10 })).toBeNull();
  });

  it('0% の栄養素は 0g', () => {
    const r = calculatePfc(1000, { protein: 20, fat: 0, carb: 80 })!;
    expect(r.fat.grams).toBe(0);
    expect(r.carb.grams).toBeCloseTo(200, 6);
  });
});

describe('proteinPerKg / proteinGuideGrams', () => {
  it('g/kg に換算する', () => {
    expect(proteinPerKg(100, 50)).toBe(2);
  });
  it('体重が不正なら null / 空配列', () => {
    expect(proteinPerKg(100, 0)).toBeNull();
    expect(proteinPerKg(100, NaN)).toBeNull();
    expect(proteinGuideGrams(0)).toEqual([]);
  });
  it('体重 60kg の目安', () => {
    const g = proteinGuideGrams(60);
    expect(g).toHaveLength(4);
    expect(g[0].grams).toBeCloseTo(48, 6);
    expect(g[3].grams).toBeCloseTo(120, 6);
  });
});
