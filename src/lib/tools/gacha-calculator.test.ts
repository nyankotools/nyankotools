import { describe, expect, it } from 'vitest';
import {
  calculateConfidencePulls,
  calculateGacha,
  expectedPullsToFirst,
  probabilityWithin,
  pullsForConfidence,
  toDisplayPercent,
} from './gacha-calculator';

const base = {
  ratePercent: 3,
  pulls: 100,
  ceiling: null,
  costPerPull: null,
  ownedStones: null,
};

describe('probabilityWithin', () => {
  it('1-(1-p)^n を返す', () => {
    expect(probabilityWithin(0.5, 3, null)).toBeCloseTo(0.875, 10);
    expect(probabilityWithin(0.03, 100, null)).toBeCloseTo(
      1 - Math.pow(0.97, 100),
      10,
    );
  });
  it('0回は0、排出率0は0、排出率100%は1', () => {
    expect(probabilityWithin(0.5, 0, null)).toBe(0);
    expect(probabilityWithin(0, 1000, null)).toBe(0);
    expect(probabilityWithin(1, 1, null)).toBe(1);
  });
  it('天井以上の回数なら必ず1', () => {
    expect(probabilityWithin(0, 200, 200)).toBe(1);
    expect(probabilityWithin(0.01, 199, 200)).toBeLessThan(1);
  });
  it('極小の排出率でも桁落ちしない', () => {
    expect(probabilityWithin(1e-12, 1, null)).toBeCloseTo(1e-12, 20);
  });
});

describe('expectedPullsToFirst', () => {
  it('天井なしは 1/p', () => {
    expect(expectedPullsToFirst(0.03, null)).toBeCloseTo(100 / 3, 10);
  });
  it('天井ありは (1-(1-p)^C)/p', () => {
    expect(expectedPullsToFirst(0.5, 2)).toBeCloseTo(1.5, 10);
  });
  it('排出率0は天井、天井なしなら null', () => {
    expect(expectedPullsToFirst(0, 100)).toBe(100);
    expect(expectedPullsToFirst(0, null)).toBeNull();
  });
});

describe('pullsForConfidence', () => {
  it('ちょうど届く境界を繰り上げない', () => {
    expect(pullsForConfidence(0.5, 0.75, null)).toBe(2);
  });
  it('3%で50/90/99%に必要な回数', () => {
    expect(pullsForConfidence(0.03, 0.5, null)).toBe(23);
    expect(pullsForConfidence(0.03, 0.9, null)).toBe(76);
    expect(pullsForConfidence(0.03, 0.99, null)).toBe(152);
  });
  it('天井で頭打ちになる', () => {
    expect(pullsForConfidence(0.03, 0.99, 100)).toBe(100);
    expect(pullsForConfidence(0, 0.5, 80)).toBe(80);
    expect(pullsForConfidence(0, 0.5, null)).toBeNull();
  });
});

describe('calculateGacha', () => {
  it('N回で1回以上出る確率と期待値', () => {
    const r = calculateGacha(base)!;
    expect(r.probabilityAtLeastOne).toBeCloseTo(1 - Math.pow(0.97, 100), 10);
    expect(r.expectedHits).toBeCloseTo(3, 10);
    expect(r.expectedPulls).toBeCloseTo(100 / 3, 10);
    expect(r.expectedStones).toBeNull();
    expect(r.ownedPulls).toBeNull();
  });
  it('石数・天井・所持数から必要石数と到達確率を出す', () => {
    const r = calculateGacha({
      ratePercent: 1,
      pulls: 50,
      ceiling: 200,
      costPerPull: 3,
      ownedStones: 100,
    })!;
    expect(r.ceilingStones).toBe(600);
    expect(r.ownedPulls).toBe(33);
    expect(r.ownedProbability).toBeCloseTo(1 - Math.pow(0.99, 33), 10);
    expect(r.expectedStones).toBeCloseTo(
      3 * ((1 - Math.pow(0.99, 200)) / 0.01),
      8,
    );
  });
  it('所持数が天井回数以上なら確率100%', () => {
    const r = calculateGacha({
      ratePercent: 0.5,
      pulls: 0,
      ceiling: 10,
      costPerPull: 5,
      ownedStones: 50,
    })!;
    expect(r.ownedProbability).toBe(1);
    expect(r.probabilityAtLeastOne).toBe(0);
  });
  it('1回0石の場合は所持数からの回数を出さない', () => {
    const r = calculateGacha({ ...base, costPerPull: 0, ownedStones: 10 })!;
    expect(r.ownedPulls).toBeNull();
    expect(r.expectedStones).toBeCloseTo(0, 10);
  });
  it('排出率0・天井なしは期待値なし', () => {
    const r = calculateGacha({ ...base, ratePercent: 0, costPerPull: 3 })!;
    expect(r.expectedPulls).toBeNull();
    expect(r.expectedStones).toBeNull();
    expect(r.probabilityAtLeastOne).toBe(0);
  });
  it('不正な入力は null', () => {
    expect(calculateGacha({ ...base, ratePercent: -1 })).toBeNull();
    expect(calculateGacha({ ...base, ratePercent: 101 })).toBeNull();
    expect(calculateGacha({ ...base, ratePercent: NaN })).toBeNull();
    expect(calculateGacha({ ...base, pulls: 1.5 })).toBeNull();
    expect(calculateGacha({ ...base, pulls: -1 })).toBeNull();
    expect(calculateGacha({ ...base, ceiling: 0 })).toBeNull();
    expect(calculateGacha({ ...base, costPerPull: -3 })).toBeNull();
    expect(calculateGacha({ ...base, ownedStones: -1 })).toBeNull();
  });
});

describe('calculateConfidencePulls', () => {
  it('既定で50/90/99%を返す', () => {
    const r = calculateConfidencePulls(3, null)!;
    expect(r.map((x) => x.confidence)).toEqual([0.5, 0.9, 0.99]);
    expect(r[0].pulls).toBe(23);
  });
  it('不正な排出率は null', () => {
    expect(calculateConfidencePulls(-1, null)).toBeNull();
    expect(calculateConfidencePulls(3, 0)).toBeNull();
  });
});

describe('toDisplayPercent', () => {
  it('通常は小数第2位まで', () => {
    expect(toDisplayPercent(0.12345)).toBe(12.35);
  });
  it('1未満が100に、0超が0に丸まらない', () => {
    expect(toDisplayPercent(0.999999)).toBe(99.99);
    expect(toDisplayPercent(0.000001)).toBe(0.01);
    expect(toDisplayPercent(1)).toBe(100);
    expect(toDisplayPercent(0)).toBe(0);
  });
});
