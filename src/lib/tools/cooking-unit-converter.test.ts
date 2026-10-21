import { describe, expect, it } from 'vitest';
import {
  buildIngredientTable,
  convertCooking,
  formatAmount,
  INGREDIENT_IDS,
} from './cooking-unit-converter';

describe('convertCooking', () => {
  it('大さじ1の水は15ml・15g・小さじ3', () => {
    const r = convertCooking({
      amount: 1,
      from: 'tbsp',
      ingredient: 'water',
      cup: 'jp',
    })!;
    expect(r.ml).toBe(15);
    expect(r.g).toBe(15);
    expect(r.tsp).toBe(3);
    expect(r.cup).toBeCloseTo(0.075);
  });

  it('小麦粉大さじ1は9g', () => {
    const r = convertCooking({
      amount: 1,
      from: 'tbsp',
      ingredient: 'flour',
      cup: 'jp',
    })!;
    expect(r.g).toBeCloseTo(9);
  });

  it('gから逆算できる（はちみつ21g=15ml）', () => {
    const r = convertCooking({
      amount: 21,
      from: 'g',
      ingredient: 'honey',
      cup: 'jp',
    })!;
    expect(r.ml).toBeCloseTo(15);
    expect(r.tbsp).toBeCloseTo(1);
  });

  it('カップの基準で結果が変わる', () => {
    const base = { amount: 1, from: 'cup', ingredient: 'water' } as const;
    expect(convertCooking({ ...base, cup: 'jp' })!.ml).toBe(200);
    expect(convertCooking({ ...base, cup: 'us' })!.ml).toBe(240);
    expect(convertCooking({ ...base, cup: 'metric' })!.ml).toBe(250);
  });

  it('0は全て0', () => {
    const r = convertCooking({
      amount: 0,
      from: 'g',
      ingredient: 'salt',
      cup: 'jp',
    })!;
    expect(Object.values(r)).toEqual([0, 0, 0, 0, 0]);
  });

  it('不正な値はnull', () => {
    const base = { from: 'ml', ingredient: 'water', cup: 'jp' } as const;
    expect(convertCooking({ ...base, amount: -1 })).toBeNull();
    expect(convertCooking({ ...base, amount: NaN })).toBeNull();
    expect(convertCooking({ ...base, amount: Infinity })).toBeNull();
    expect(convertCooking({ ...base, amount: 1e9 })).toBeNull();
  });
});

describe('formatAmount', () => {
  it('小数2桁に丸めて末尾の0を落とす', () => {
    expect(formatAmount(1.005 * 2)).toBe('2.01');
    expect(formatAmount(3)).toBe('3');
    expect(formatAmount(0.075)).toBe('0.08');
    expect(formatAmount(0.001)).toBe('0');
  });
});

describe('buildIngredientTable', () => {
  it('全食材の行を返し、水は5/15/200', () => {
    const rows = buildIngredientTable('jp');
    expect(rows).toHaveLength(INGREDIENT_IDS.length);
    const water = rows.find((r) => r.id === 'water')!;
    expect([water.tsp, water.tbsp, water.cup]).toEqual([5, 15, 200]);
  });
});
