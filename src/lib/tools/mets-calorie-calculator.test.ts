import { describe, expect, it } from 'vitest';
import {
  calculateCalories,
  exercises,
  findExercise,
  lbToKg,
  summarize,
  toMinutes,
} from './mets-calorie-calculator';

describe('calculateCalories', () => {
  it('METs × 体重 × 時間 × 1.05 で求める', () => {
    expect(calculateCalories(3, 60, 60)).toBeCloseTo(189, 5);
    expect(calculateCalories(7, 70, 30)).toBeCloseTo(257.25, 5);
  });

  it('安静時分を差し引ける', () => {
    expect(calculateCalories(3, 60, 60, true)).toBeCloseTo(126, 5);
    expect(calculateCalories(1, 60, 60, true)).toBe(0);
  });

  it('0分は0kcal', () => {
    expect(calculateCalories(5, 60, 0)).toBe(0);
  });

  it('不正な入力は null', () => {
    expect(calculateCalories(0, 60, 30)).toBeNull();
    expect(calculateCalories(-1, 60, 30)).toBeNull();
    expect(calculateCalories(3, 0, 30)).toBeNull();
    expect(calculateCalories(3, 60, -5)).toBeNull();
    expect(calculateCalories(NaN, 60, 30)).toBeNull();
    expect(calculateCalories(3, Infinity, 30)).toBeNull();
    expect(calculateCalories(31, 60, 30)).toBeNull();
    expect(calculateCalories(3, 501, 30)).toBeNull();
    expect(calculateCalories(3, 60, 24 * 60 + 1)).toBeNull();
  });
});

describe('toMinutes', () => {
  it('時間と分を合算する', () => {
    expect(toMinutes(1, 30)).toBe(90);
    expect(toMinutes(0, 45)).toBe(45);
    expect(toMinutes(0.5, 0)).toBe(30);
  });
  it('負数・非数・24時間超は null', () => {
    expect(toMinutes(-1, 0)).toBeNull();
    expect(toMinutes(0, NaN)).toBeNull();
    expect(toMinutes(24, 1)).toBeNull();
  });
});

describe('summarize', () => {
  it('複数運動を合計し、不正な行は除く', () => {
    const s = summarize(
      [
        { mets: 3, minutes: 60 },
        { mets: 7, minutes: 30 },
        { mets: 0, minutes: 30 },
      ],
      60,
    );
    expect(s.items[2]).toBeNull();
    expect(s.validCount).toBe(2);
    expect(s.totalMinutes).toBe(90);
    expect(s.totalKcal).toBeCloseTo(189 + 220.5, 5);
  });

  it('安静時分を除くと合計が小さくなり、1METsの行は0kcal', () => {
    const s = summarize(
      [
        { mets: 3, minutes: 60 },
        { mets: 1, minutes: 60 },
      ],
      60,
      true,
    );
    expect(s.items[0]).toBeCloseTo(126, 5);
    expect(s.items[1]).toBe(0);
    expect(s.totalMinutes).toBe(120);
    expect(s.validCount).toBe(2);
  });

  it('空配列は0', () => {
    const s = summarize([], 60);
    expect(s.totalKcal).toBe(0);
    expect(s.validCount).toBe(0);
  });
});

describe('exercises', () => {
  it('idが一意でMETsが範囲内', () => {
    const ids = new Set(exercises.map((e) => e.id));
    expect(ids.size).toBe(exercises.length);
    for (const e of exercises) {
      expect(e.mets).toBeGreaterThan(0);
      expect(e.mets).toBeLessThanOrEqual(30);
    }
    expect(findExercise('jogging')?.mets).toBe(7);
    expect(findExercise('nope')).toBeUndefined();
  });
});

describe('lbToKg', () => {
  it('ポンドをkgに変換する', () => {
    expect(lbToKg(100)).toBeCloseTo(45.359237, 5);
  });
});
