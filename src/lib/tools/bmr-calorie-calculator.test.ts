import { describe, it, expect } from 'vitest';
import {
  activityFactors,
  calculateBmr,
  calculateCalorieTargets,
  calculateTdee,
} from './bmr-calorie-calculator';

describe('calculateBmr', () => {
  it('Mifflin-St Jeor: 男性30歳 170cm 65kg', () => {
    // 650 + 1062.5 - 150 + 5 = 1567.5
    expect(calculateBmr('mifflin', 'male', 30, 170, 65)).toBeCloseTo(1567.5, 6);
  });

  it('Mifflin-St Jeor: 女性30歳 160cm 50kg', () => {
    // 500 + 1000 - 150 - 161 = 1189
    expect(calculateBmr('mifflin', 'female', 30, 160, 50)).toBeCloseTo(1189, 6);
  });

  it('Harris-Benedict（改良版）: 男性30歳 170cm 65kg', () => {
    // 88.362 + 870.805 + 815.83 - 170.31 = 1604.687
    expect(calculateBmr('harris', 'male', 30, 170, 65)).toBeCloseTo(
      1604.687,
      3,
    );
  });

  it('Harris-Benedict（改良版）: 女性30歳 160cm 50kg', () => {
    // 447.593 + 462.35 + 495.68 - 129.9 = 1275.723
    expect(calculateBmr('harris', 'female', 30, 160, 50)).toBeCloseTo(
      1275.723,
      3,
    );
  });

  it('日本人の基準値: 年齢区分ごとの値×体重', () => {
    expect(calculateBmr('japan', 'male', 25, 170, 60)).toBeCloseTo(
      23.7 * 60,
      6,
    );
    expect(calculateBmr('japan', 'male', 30, 170, 60)).toBeCloseTo(
      22.5 * 60,
      6,
    );
    expect(calculateBmr('japan', 'female', 49, 160, 50)).toBeCloseTo(
      21.9 * 50,
      6,
    );
    expect(calculateBmr('japan', 'female', 50, 160, 50)).toBeCloseTo(
      20.7 * 50,
      6,
    );
    expect(calculateBmr('japan', 'male', 80, 160, 60)).toBeCloseTo(
      21.5 * 60,
      6,
    );
  });

  it('日本人の基準値は18歳未満では null', () => {
    expect(calculateBmr('japan', 'male', 17, 170, 60)).toBeNull();
    expect(calculateBmr('japan', 'male', 18, 170, 60)).not.toBeNull();
  });

  it('不正な入力は null', () => {
    expect(calculateBmr('mifflin', 'male', 0, 170, 60)).toBeNull();
    expect(calculateBmr('mifflin', 'male', 121, 170, 60)).toBeNull();
    expect(calculateBmr('mifflin', 'male', 29.5, 170, 60)).toBeNull();
    expect(calculateBmr('mifflin', 'male', 30, 0, 60)).toBeNull();
    expect(calculateBmr('mifflin', 'male', 30, 170, -1)).toBeNull();
    expect(calculateBmr('mifflin', 'male', NaN, 170, 60)).toBeNull();
    expect(calculateBmr('mifflin', 'male', 30, Infinity, 60)).toBeNull();
  });

  it('結果が0以下になる極端な入力は null', () => {
    expect(calculateBmr('mifflin', 'female', 120, 50, 3)).toBeNull();
  });
});

describe('calculateTdee / calculateCalorieTargets', () => {
  it('活動係数を掛ける', () => {
    expect(calculateTdee(1500, 'sedentary')).toBeCloseTo(
      1500 * activityFactors.sedentary,
      9,
    );
    expect(calculateTdee(1500, 'moderate')).toBeCloseTo(2325, 9);
  });

  it('減量・増量の目安は維持カロリーの 90% / 80% / 110%', () => {
    const t = calculateCalorieTargets(2000);
    expect(t.maintain).toBe(2000);
    expect(t.mildLoss).toBeCloseTo(1800, 9);
    expect(t.loss).toBeCloseTo(1600, 9);
    expect(t.gain).toBeCloseTo(2200, 9);
  });
});
