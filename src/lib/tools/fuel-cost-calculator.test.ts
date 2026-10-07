import { describe, expect, it } from 'vitest';
import { calculateFuelCost, type FuelCostInput } from './fuel-cost-calculator';

const base: FuelCostInput = {
  distanceKm: 300,
  economy: 15,
  economyUnit: 'kmPerL',
  pricePerLiter: 175,
  extraCost: 0,
  people: 1,
};

describe('calculateFuelCost', () => {
  it('km/L の燃費から燃料代と1km当たりのコストを計算する', () => {
    const r = calculateFuelCost(base)!;
    expect(r.liters).toBeCloseTo(20);
    expect(r.fuelCost).toBeCloseTo(3500);
    expect(r.totalCost).toBeCloseTo(3500);
    expect(r.fuelCostPerKm).toBeCloseTo(3500 / 300);
    expect(r.perPersonCeil).toBe(3500);
  });

  it('L/100km の燃費を km/L と同じ結果に換算する', () => {
    const r = calculateFuelCost({
      ...base,
      economy: 20,
      economyUnit: 'lPer100km',
    })!;
    // 20L/100km = 5km/L → 300km で 60L
    expect(r.liters).toBeCloseTo(60);
    expect(r.fuelCost).toBeCloseTo(10500);
  });

  it('追加費用と人数で割り勘額を計算し、1円単位に切り上げる', () => {
    const r = calculateFuelCost({ ...base, extraCost: 2000, people: 3 })!;
    expect(r.totalCost).toBeCloseTo(5500);
    expect(r.totalCostPerKm).toBeCloseTo(5500 / 300);
    expect(r.fuelCostPerKm).toBeCloseTo(3500 / 300);
    expect(r.perPerson).toBeCloseTo(5500 / 3);
    expect(r.perPersonCeil).toBe(1834);
  });

  it('割り切れる場合は浮動小数点誤差で切り上がらない', () => {
    const r = calculateFuelCost({
      distanceKm: 10,
      economy: 10,
      economyUnit: 'kmPerL',
      pricePerLiter: 150.3,
      extraCost: 0,
      people: 3,
    })!;
    // 燃料代 150.3 → 1人 50.1 → 51
    expect(r.perPersonCeil).toBe(51);
    const exact = calculateFuelCost({ ...base, distanceKm: 30, people: 2 })!;
    expect(exact.fuelCost).toBeCloseTo(350);
    expect(exact.perPersonCeil).toBe(175);
  });

  it('小数の距離・燃費・単価を扱える', () => {
    const r = calculateFuelCost({
      ...base,
      distanceKm: 12.5,
      economy: 12.5,
      pricePerLiter: 170.5,
    })!;
    expect(r.liters).toBeCloseTo(1);
    expect(r.fuelCost).toBeCloseTo(170.5);
  });

  it('距離・燃費・単価が0以下ならnull', () => {
    expect(calculateFuelCost({ ...base, distanceKm: 0 })).toBeNull();
    expect(calculateFuelCost({ ...base, economy: 0 })).toBeNull();
    expect(
      calculateFuelCost({ ...base, economy: 0, economyUnit: 'lPer100km' }),
    ).toBeNull();
    expect(calculateFuelCost({ ...base, pricePerLiter: -1 })).toBeNull();
  });

  it('追加費用が負、人数が0・小数ならnull。追加費用0は有効', () => {
    expect(calculateFuelCost({ ...base, extraCost: -1 })).toBeNull();
    expect(calculateFuelCost({ ...base, people: 0 })).toBeNull();
    expect(calculateFuelCost({ ...base, people: 2.5 })).toBeNull();
    expect(calculateFuelCost({ ...base, extraCost: 0 })).not.toBeNull();
  });

  it('NaN・Infinityはnull', () => {
    expect(calculateFuelCost({ ...base, distanceKm: NaN })).toBeNull();
    expect(calculateFuelCost({ ...base, economy: Infinity })).toBeNull();
    expect(calculateFuelCost({ ...base, extraCost: NaN })).toBeNull();
  });
});
