import { describe, it, expect } from 'vitest';
import {
  calculateBreakEven,
  type BreakEvenInput,
} from './break-even-calculator';

const base: BreakEvenInput = {
  price: 1000,
  variableCost: 400,
  fixedCost: 300000,
  targetProfit: 0,
  expectedUnits: null,
};

function ok(input: BreakEvenInput) {
  const r = calculateBreakEven(input);
  if ('error' in r) throw new Error(`unexpected error: ${r.error}`);
  return r;
}

describe('calculateBreakEven', () => {
  it('損益分岐点を求める', () => {
    const r = ok(base);
    expect(r.contributionPerUnit).toBe(600);
    expect(r.contributionRatio).toBeCloseTo(0.6);
    expect(r.breakEvenUnits).toBe(500);
    expect(r.breakEvenSales).toBeCloseTo(500000);
    expect(r.expectedProfit).toBeNull();
    expect(r.marginOfSafety).toBeNull();
  });

  it('割り切れない場合は数量を切り上げる', () => {
    const r = ok({ ...base, fixedCost: 300100 });
    expect(r.breakEvenUnits).toBe(501);
  });

  it('目標利益の達成ラインを求める', () => {
    const r = ok({ ...base, targetProfit: 60000 });
    expect(r.targetUnits).toBe(600);
    expect(r.targetSales).toBeCloseTo(600000);
  });

  it('目標利益0なら損益分岐点と一致する', () => {
    const r = ok(base);
    expect(r.targetUnits).toBe(r.breakEvenUnits);
  });

  it('予想数量から利益と安全余裕率を求める', () => {
    const r = ok({ ...base, expectedUnits: 1000 });
    expect(r.expectedProfit).toBe(300000);
    expect(r.marginOfSafety).toBeCloseTo(0.5);
  });

  it('予想数量が損益分岐点未満なら赤字・安全余裕率は負', () => {
    const r = ok({ ...base, expectedUnits: 250 });
    expect(r.expectedProfit).toBe(-150000);
    expect(r.marginOfSafety).toBeLessThan(0);
  });

  it('予想数量0なら安全余裕率はnull', () => {
    const r = ok({ ...base, expectedUnits: 0 });
    expect(r.expectedProfit).toBe(-300000);
    expect(r.marginOfSafety).toBeNull();
  });

  it('固定費0なら損益分岐点は0個', () => {
    expect(ok({ ...base, fixedCost: 0 }).breakEvenUnits).toBe(0);
  });

  it('変動費が単価以上ならnoContribution', () => {
    expect(calculateBreakEven({ ...base, variableCost: 1000 })).toEqual({
      error: 'noContribution',
    });
    expect(calculateBreakEven({ ...base, variableCost: 1500 })).toEqual({
      error: 'noContribution',
    });
  });

  it('不正な入力を検出する', () => {
    expect(calculateBreakEven({ ...base, price: 0 })).toEqual({
      error: 'invalidPrice',
    });
    expect(calculateBreakEven({ ...base, price: NaN })).toEqual({
      error: 'invalidPrice',
    });
    expect(calculateBreakEven({ ...base, variableCost: -1 })).toEqual({
      error: 'invalidVariableCost',
    });
    expect(calculateBreakEven({ ...base, fixedCost: -1 })).toEqual({
      error: 'invalidFixedCost',
    });
    expect(calculateBreakEven({ ...base, targetProfit: -1 })).toEqual({
      error: 'invalidTargetProfit',
    });
    expect(calculateBreakEven({ ...base, expectedUnits: -1 })).toEqual({
      error: 'invalidExpectedUnits',
    });
  });
});
