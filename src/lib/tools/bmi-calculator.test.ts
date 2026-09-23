import { describe, expect, it } from 'vitest';
import {
  calculateBmi,
  calculateHealthyWeightRange,
  feetInchesToCm,
  getBmiCategory,
  kgToLb,
  lbToKg,
} from './bmi-calculator';

describe('calculateBmi', () => {
  it('身長・体重からBMIを計算する', () => {
    expect(calculateBmi(170, 65)).toBeCloseTo(22.4913, 4);
  });

  it('様々な身長・体重の組み合わせでBMIを計算する', () => {
    // BMI 18.5
    const height185 = 160;
    const weight185 = ((height185 * height185) / 10000) * 18.5;
    expect(calculateBmi(height185, weight185)).toBeCloseTo(18.5, 1);

    // BMI 25
    const height25 = 170;
    const weight25 = ((height25 * height25) / 10000) * 25;
    expect(calculateBmi(height25, weight25)).toBeCloseTo(25, 1);

    // BMI 30
    const height30 = 180;
    const weight30 = ((height30 * height30) / 10000) * 30;
    expect(calculateBmi(height30, weight30)).toBeCloseTo(30, 1);
  });

  it('身長または体重が0以下ならnull', () => {
    expect(calculateBmi(0, 65)).toBeNull();
    expect(calculateBmi(170, 0)).toBeNull();
    expect(calculateBmi(-170, 65)).toBeNull();
    expect(calculateBmi(170, -65)).toBeNull();
  });

  it('NaNまたはInfinityを含む場合はnull', () => {
    expect(calculateBmi(NaN, 65)).toBeNull();
    expect(calculateBmi(170, Infinity)).toBeNull();
    expect(calculateBmi(-Infinity, 65)).toBeNull();
    expect(calculateBmi(170, NaN)).toBeNull();
  });

  it('極めて小さい正数でも計算できる', () => {
    const result = calculateBmi(0.1, 0.1);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(0);
  });

  it('極めて大きい値でも計算できる', () => {
    const result = calculateBmi(500, 500);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(0);
  });
});

describe('getBmiCategory', () => {
  it('境界値未満はunderweight', () => {
    expect(getBmiCategory(18.4)).toBe('underweight');
    expect(getBmiCategory(0.1)).toBe('underweight');
  });

  it('18.5以上25未満はnormal', () => {
    expect(getBmiCategory(18.5)).toBe('normal');
    expect(getBmiCategory(24.9)).toBe('normal');
    expect(getBmiCategory(22)).toBe('normal');
  });

  it('25以上30未満はoverweight', () => {
    expect(getBmiCategory(25)).toBe('overweight');
    expect(getBmiCategory(29.9)).toBe('overweight');
  });

  it('30以上35未満はobeseClass1', () => {
    expect(getBmiCategory(30)).toBe('obeseClass1');
    expect(getBmiCategory(34.9)).toBe('obeseClass1');
  });

  it('35以上40未満はobeseClass2', () => {
    expect(getBmiCategory(35)).toBe('obeseClass2');
    expect(getBmiCategory(39.9)).toBe('obeseClass2');
  });

  it('40以上はobeseClass3', () => {
    expect(getBmiCategory(40)).toBe('obeseClass3');
    expect(getBmiCategory(50)).toBe('obeseClass3');
    expect(getBmiCategory(100)).toBe('obeseClass3');
  });
});

describe('calculateHealthyWeightRange', () => {
  it('身長からBMI18.5〜25に相当する体重範囲を計算する', () => {
    const result = calculateHealthyWeightRange(170);
    expect(result).not.toBeNull();
    expect(result!.minKg).toBeCloseTo(53.465, 3);
    expect(result!.maxKg).toBeCloseTo(72.25, 3);
  });

  it('身長が0以下ならnull', () => {
    expect(calculateHealthyWeightRange(0)).toBeNull();
    expect(calculateHealthyWeightRange(-170)).toBeNull();
  });

  it('NaNまたはInfinityの場合はnull', () => {
    expect(calculateHealthyWeightRange(NaN)).toBeNull();
    expect(calculateHealthyWeightRange(Infinity)).toBeNull();
  });
});

describe('unit conversions', () => {
  it('feetInchesToCm: フィート・インチをcmに変換する', () => {
    expect(feetInchesToCm(5, 7)).toBeCloseTo(170.18, 2);
    expect(feetInchesToCm(6, 0)).toBeCloseTo(182.88, 2);
    expect(feetInchesToCm(0, 0)).toBe(0);
  });

  it('lbToKg: ポンドをkgに変換する', () => {
    expect(lbToKg(143)).toBeCloseTo(64.864, 2);
    expect(lbToKg(200)).toBeCloseTo(90.718, 2);
    expect(lbToKg(0)).toBe(0);
  });

  it('kgToLb: kgをポンドに変換する', () => {
    expect(kgToLb(65)).toBeCloseTo(143.3, 1);
    expect(kgToLb(90.718)).toBeCloseTo(200, 1);
    expect(kgToLb(0)).toBe(0);
  });

  it('unit conversions: 逆変換も正確', () => {
    const originalCm = 170.18;
    const feet = 5;
    const inches = 7;
    expect(feetInchesToCm(feet, inches)).toBeCloseTo(originalCm, 2);

    const originalKg = 65;
    expect(lbToKg(kgToLb(originalKg))).toBeCloseTo(originalKg, 5);
  });
});
