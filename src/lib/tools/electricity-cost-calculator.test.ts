import { describe, it, expect } from 'vitest';
import {
  calculateElectricityCost,
  type ElectricityCostInput,
} from './electricity-cost-calculator';

const base: ElectricityCostInput = {
  watts: 1000,
  hoursPerDay: 2,
  daysPerMonth: 30,
  pricePerKwh: 30,
  quantity: 1,
};

describe('calculateElectricityCost', () => {
  it('1000Wを1時間で1kWh、単価30円なら30円', () => {
    const r = calculateElectricityCost(base);
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perHour).toEqual({ kwh: 1, cost: 30 });
    expect(r.perDay).toEqual({ kwh: 2, cost: 60 });
    expect(r.perMonth).toEqual({ kwh: 60, cost: 1800 });
    expect(r.perYear).toEqual({ kwh: 720, cost: 21600 });
  });

  it('台数を掛ける', () => {
    const r = calculateElectricityCost({ ...base, quantity: 3 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perHour.kwh).toBe(3);
  });

  it('使用時間0は0円（エラーにしない）', () => {
    const r = calculateElectricityCost({ ...base, hoursPerDay: 0 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perMonth.cost).toBe(0);
    expect(r.perHour.cost).toBe(30);
  });

  it('単価0も許可する', () => {
    const r = calculateElectricityCost({ ...base, pricePerKwh: 0 });
    expect('error' in r).toBe(false);
  });

  it('不正な入力はエラー', () => {
    expect(calculateElectricityCost({ ...base, watts: 0 })).toEqual({
      error: 'invalidWatts',
    });
    expect(calculateElectricityCost({ ...base, watts: NaN })).toEqual({
      error: 'invalidWatts',
    });
    expect(calculateElectricityCost({ ...base, hoursPerDay: 25 })).toEqual({
      error: 'invalidHours',
    });
    expect(calculateElectricityCost({ ...base, daysPerMonth: 32 })).toEqual({
      error: 'invalidDays',
    });
    expect(calculateElectricityCost({ ...base, daysPerMonth: 1.5 })).toEqual({
      error: 'invalidDays',
    });
    expect(calculateElectricityCost({ ...base, pricePerKwh: -1 })).toEqual({
      error: 'invalidPrice',
    });
    expect(calculateElectricityCost({ ...base, quantity: 0 })).toEqual({
      error: 'invalidQuantity',
    });
  });

  it('最大ワット数（1,000,000W）で計算できる', () => {
    const r = calculateElectricityCost({ ...base, watts: 1_000_000 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perHour.kwh).toBe(1000);
  });

  it('ワット数が上限を超えるとエラー', () => {
    expect(calculateElectricityCost({ ...base, watts: 1_000_001 })).toEqual({
      error: 'invalidWatts',
    });
  });

  it('最大台数（1000台）で計算できる', () => {
    const r = calculateElectricityCost({ ...base, quantity: 1000 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perHour.kwh).toBe(1000);
  });

  it('台数が上限を超えるとエラー', () => {
    expect(calculateElectricityCost({ ...base, quantity: 1001 })).toEqual({
      error: 'invalidQuantity',
    });
  });

  it('使用時間が24時間（最大値）で計算できる', () => {
    const r = calculateElectricityCost({ ...base, hoursPerDay: 24 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perDay.kwh).toBe(24);
  });

  it('使用日数が1日（最小値）で計算できる', () => {
    const r = calculateElectricityCost({ ...base, daysPerMonth: 1 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perMonth.kwh).toEqual(2);
  });

  it('使用日数が31日（最大値）で計算できる', () => {
    const r = calculateElectricityCost({ ...base, daysPerMonth: 31 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perMonth.kwh).toEqual(62);
  });

  it('小数のワット数で計算できる', () => {
    const r = calculateElectricityCost({ ...base, watts: 500.5 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perHour.kwh).toBeCloseTo(0.5005);
  });

  it('小数の単価で計算できる', () => {
    const r = calculateElectricityCost({ ...base, pricePerKwh: 25.5 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.perHour.cost).toBeCloseTo(25.5);
  });

  it('Infinity はエラー', () => {
    expect(calculateElectricityCost({ ...base, watts: Infinity })).toEqual({
      error: 'invalidWatts',
    });
  });

  it('負のwattsはエラー', () => {
    expect(calculateElectricityCost({ ...base, watts: -1 })).toEqual({
      error: 'invalidWatts',
    });
  });

  it('負のhoursPerDayはエラー', () => {
    expect(calculateElectricityCost({ ...base, hoursPerDay: -0.1 })).toEqual({
      error: 'invalidHours',
    });
  });
});
