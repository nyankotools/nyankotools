import { describe, expect, it } from 'vitest';
import {
  erfc,
  normalCdf,
  normalInv,
  requiredSampleSize,
  testTwoProportions,
  type AbTestInput,
} from './ab-test-calculator';

describe('normalCdf / erfc', () => {
  it('代表値', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 12);
    expect(normalCdf(1.96)).toBeCloseTo(0.9750021048517795, 10);
    expect(normalCdf(-1.96)).toBeCloseTo(0.0249978951482205, 10);
    expect(normalCdf(3)).toBeCloseTo(0.9986501019683699, 10);
  });
  it('裾でも正の値で単調', () => {
    expect(erfc(4)).toBeCloseTo(1.541725790028002e-8, 18);
    expect(erfc(6)).toBeGreaterThan(0);
    expect(erfc(6)).toBeLessThan(erfc(5));
    expect(erfc(100)).toBe(0);
  });
  it('3付近の境界で連続', () => {
    expect(erfc(2.9999999)).toBeCloseTo(erfc(3.0000001), 8);
  });
});

describe('normalInv', () => {
  it('代表値', () => {
    expect(normalInv(0.5)).toBeCloseTo(0, 12);
    expect(normalInv(0.975)).toBeCloseTo(1.959963984540054, 9);
    expect(normalInv(0.8)).toBeCloseTo(0.8416212335729143, 9);
    expect(normalInv(0.995)).toBeCloseTo(2.5758293035489, 9);
  });
  it('CDFの逆関数になっている', () => {
    for (const p of [1e-6, 0.01, 0.2, 0.7, 0.99, 0.999999]) {
      expect(normalCdf(normalInv(p))).toBeCloseTo(p, 10);
    }
  });
  it('範囲外はNaN', () => {
    expect(normalInv(0)).toBeNaN();
    expect(normalInv(1)).toBeNaN();
  });
});

const base: AbTestInput = {
  visitorsA: 1000,
  conversionsA: 100,
  visitorsB: 1000,
  conversionsB: 130,
  alpha: 0.05,
  tail: 'two',
};

describe('testTwoProportions', () => {
  it('10% vs 13% (各1000)', () => {
    const r = testTwoProportions(base);
    if ('error' in r) throw new Error(r.error);
    expect(r.rateA).toBeCloseTo(0.1);
    expect(r.rateB).toBeCloseTo(0.13);
    expect(r.relativeLift).toBeCloseTo(0.3);
    expect(r.z).toBeCloseTo(2.1028, 3);
    expect(r.pValue).toBeGreaterThan(0.035);
    expect(r.pValue).toBeLessThan(0.0361);
    expect(r.significant).toBe(true);
    expect(r.ciLower).toBeGreaterThan(0);
    expect(r.ciLower).toBeLessThan(0.03);
    expect(r.ciUpper).toBeGreaterThan(0.03);
    expect(r.smallExpected).toBe(false);
  });
  it('片側のp値は両側の半分（Bが高いとき）', () => {
    const two = testTwoProportions(base);
    const one = testTwoProportions({ ...base, tail: 'one' });
    if ('error' in two || 'error' in one) throw new Error('error');
    expect(one.pValue).toBeCloseTo(two.pValue / 2, 12);
  });
  it('Bが低いと片側のp値は0.5超', () => {
    const r = testTwoProportions({
      ...base,
      conversionsA: 130,
      conversionsB: 100,
      tail: 'one',
    });
    if ('error' in r) throw new Error(r.error);
    expect(r.pValue).toBeGreaterThan(0.5);
    expect(r.significant).toBe(false);
  });
  it('差がないときはz=0、p=1', () => {
    const r = testTwoProportions({ ...base, conversionsB: 100 });
    if ('error' in r) throw new Error(r.error);
    expect(r.z).toBe(0);
    expect(r.pValue).toBeCloseTo(1, 12);
    expect(r.significant).toBe(false);
  });
  it('CVが両方0でも壊れず、期待度数警告が出る', () => {
    const r = testTwoProportions({
      ...base,
      conversionsA: 0,
      conversionsB: 0,
    });
    if ('error' in r) throw new Error(r.error);
    expect(r.z).toBe(0);
    expect(r.relativeLift).toBeNull();
    expect(r.smallExpected).toBe(true);
  });
  it('サンプルが小さいと警告', () => {
    const r = testTwoProportions({
      visitorsA: 20,
      conversionsA: 2,
      visitorsB: 20,
      conversionsB: 6,
      alpha: 0.05,
      tail: 'two',
    });
    if ('error' in r) throw new Error(r.error);
    expect(r.smallExpected).toBe(true);
  });
  it('不正な入力', () => {
    expect(testTwoProportions({ ...base, visitorsA: 0 })).toEqual({
      error: 'visitors',
    });
    expect(testTwoProportions({ ...base, visitorsB: 10.5 })).toEqual({
      error: 'visitors',
    });
    expect(testTwoProportions({ ...base, conversionsA: 1001 })).toEqual({
      error: 'conversions',
    });
    expect(testTwoProportions({ ...base, conversionsB: -1 })).toEqual({
      error: 'conversions',
    });
    expect(testTwoProportions({ ...base, alpha: 0 })).toEqual({
      error: 'alpha',
    });
    expect(testTwoProportions({ ...base, alpha: NaN })).toEqual({
      error: 'alpha',
    });
  });
});

describe('requiredSampleSize', () => {
  it('5% -> 6% (絶対+1pt, α5%, 検出力80%) は各群約8,100', () => {
    const r = requiredSampleSize({
      baselineRate: 0.05,
      effect: 0.01,
      effectType: 'absolute',
      alpha: 0.05,
      power: 0.8,
      tail: 'two',
    });
    if ('error' in r) throw new Error(r.error);
    expect(r.perGroup).toBeGreaterThan(8000);
    expect(r.perGroup).toBeLessThan(8300);
    expect(r.total).toBe(r.perGroup * 2);
    expect(r.targetRate).toBeCloseTo(0.06);
  });
  it('相対+20%は絶対+1ptと同じ（5%基準）', () => {
    const a = requiredSampleSize({
      baselineRate: 0.05,
      effect: 0.2,
      effectType: 'relative',
      alpha: 0.05,
      power: 0.8,
      tail: 'two',
    });
    const b = requiredSampleSize({
      baselineRate: 0.05,
      effect: 0.01,
      effectType: 'absolute',
      alpha: 0.05,
      power: 0.8,
      tail: 'two',
    });
    if ('error' in a || 'error' in b) throw new Error('error');
    expect(a.perGroup).toBe(b.perGroup);
  });
  it('片側・α大・検出力小で必要数が減る', () => {
    const two = requiredSampleSize({
      baselineRate: 0.1,
      effect: 0.1,
      effectType: 'relative',
      alpha: 0.05,
      power: 0.8,
      tail: 'two',
    });
    const one = requiredSampleSize({
      baselineRate: 0.1,
      effect: 0.1,
      effectType: 'relative',
      alpha: 0.05,
      power: 0.8,
      tail: 'one',
    });
    if ('error' in two || 'error' in one) throw new Error('error');
    expect(two.perGroup).toBeGreaterThan(14000);
    expect(two.perGroup).toBeLessThan(15500);
    expect(one.perGroup).toBeLessThan(two.perGroup);
  });
  it('改善が小さいほど必要数が増える', () => {
    const mk = (effect: number) =>
      requiredSampleSize({
        baselineRate: 0.1,
        effect,
        effectType: 'relative',
        alpha: 0.05,
        power: 0.8,
        tail: 'two',
      });
    const big = mk(0.2);
    const small = mk(0.05);
    if ('error' in big || 'error' in small) throw new Error('error');
    expect(small.perGroup).toBeGreaterThan(big.perGroup * 10);
  });
  it('負の改善（低下の検出）も計算できる', () => {
    const r = requiredSampleSize({
      baselineRate: 0.1,
      effect: -0.1,
      effectType: 'relative',
      alpha: 0.05,
      power: 0.8,
      tail: 'two',
    });
    if ('error' in r) throw new Error(r.error);
    expect(r.targetRate).toBeCloseTo(0.09);
  });
  it('不正な入力', () => {
    const ok = {
      baselineRate: 0.1,
      effect: 0.1,
      effectType: 'relative' as const,
      alpha: 0.05,
      power: 0.8,
      tail: 'two' as const,
    };
    expect(requiredSampleSize({ ...ok, baselineRate: 0 })).toEqual({
      error: 'baseline',
    });
    expect(requiredSampleSize({ ...ok, baselineRate: 1 })).toEqual({
      error: 'baseline',
    });
    expect(requiredSampleSize({ ...ok, effect: 0 })).toEqual({
      error: 'effect',
    });
    expect(requiredSampleSize({ ...ok, effect: 10 })).toEqual({
      error: 'effect',
    });
    expect(
      requiredSampleSize({ ...ok, effectType: 'absolute', effect: 0.95 }),
    ).toEqual({ error: 'effect' });
    expect(requiredSampleSize({ ...ok, power: 1 })).toEqual({
      error: 'power',
    });
    expect(requiredSampleSize({ ...ok, alpha: 0.7 })).toEqual({
      error: 'alpha',
    });
  });
});
