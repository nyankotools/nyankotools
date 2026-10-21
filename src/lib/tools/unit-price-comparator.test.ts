import { describe, expect, it } from 'vitest';
import {
  compareUnitPrices,
  type UnitPriceRowInput,
} from './unit-price-comparator';

function row(p: Partial<UnitPriceRowInput>): UnitPriceRowInput {
  return {
    name: '',
    price: '',
    quantity: '',
    count: '',
    unit: 'g',
    taxMode: 'included',
    ...p,
  };
}

describe('compareUnitPrices', () => {
  it('100gあたりの単価と最安を求める', () => {
    const r = compareUnitPrices([
      row({ name: 'A', price: '200', quantity: '500' }),
      row({ name: 'B', price: '350', quantity: '1', unit: 'kg' }),
      row({ name: 'C', price: '90', quantity: '200' }),
    ]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.dimension).toBe('weight');
    expect(r.items.map((i) => i.unitPrice)).toEqual([40, 35, 45]);
    expect(r.cheapestIndexes).toEqual([1]);
    expect(r.items[1].isCheapest).toBe(true);
    expect(r.items[0].diffPercent).toBeCloseTo((5 / 35) * 100, 6);
    expect(r.items.map((i) => i.rank)).toEqual([2, 1, 3]);
  });

  it('個数(パック数)を掛けて合計量にする', () => {
    const r = compareUnitPrices([
      row({ price: '600', quantity: '500', count: '6', unit: 'ml' }),
      row({ price: '150', quantity: '1', unit: 'l' }),
    ]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.items[0].totalAmount).toBe(3000);
    expect(r.items[0].unitPrice).toBeCloseTo(20, 6);
    expect(r.items[1].unitPrice).toBeCloseTo(15, 6);
  });

  it('税抜価格は税率を掛けて比較する', () => {
    const r = compareUnitPrices([
      row({ price: '100', quantity: '100', taxMode: 'excl10' }),
      row({ price: '108', quantity: '100', taxMode: 'included' }),
    ]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.items[0].taxIncludedPrice).toBeCloseTo(110, 6);
    expect(r.cheapestIndexes).toEqual([1]);
    const r8 = compareUnitPrices([
      row({ price: '100', quantity: '100', taxMode: 'excl8' }),
      row({ price: '108', quantity: '100' }),
    ]);
    if ('error' in r8) throw new Error('unexpected');
    expect(r8.cheapestIndexes).toEqual([0, 1]);
  });

  it('個数単位は1個あたりで比較する', () => {
    const r = compareUnitPrices([
      row({ price: '300', quantity: '10', unit: 'piece' }),
      row({ price: '500', quantity: '20', unit: 'piece' }),
    ]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.dimension).toBe('count');
    expect(r.items.map((i) => i.unitPrice)).toEqual([30, 25]);
  });

  it('同価格はどちらも最安・同順位になる', () => {
    const r = compareUnitPrices([
      row({ price: '100', quantity: '100' }),
      row({ price: '200', quantity: '200' }),
      row({ price: '300', quantity: '100' }),
    ]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.cheapestIndexes).toEqual([0, 1]);
    expect(r.items.map((i) => i.rank)).toEqual([1, 1, 3]);
    expect(r.items[2].diffPercent).toBeCloseTo(200, 6);
  });

  it('空行は無視し、入力途中の行は invalid として報告する', () => {
    const r = compareUnitPrices([
      row({ price: '100', quantity: '100' }),
      row({}),
      row({ price: '100' }),
      row({ price: '90', quantity: '100' }),
    ]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.items.map((i) => i.index)).toEqual([0, 3]);
    expect(r.issues).toEqual([{ index: 2, issue: 'invalid' }]);
  });

  it('0以下・非数・個数0は invalid', () => {
    const r = compareUnitPrices([
      row({ price: '0', quantity: '100' }),
      row({ price: '-5', quantity: '100' }),
      row({ price: '100', quantity: '100', count: '0' }),
      row({ price: 'abc', quantity: '100' }),
    ]);
    expect('error' in r).toBe(true);
    expect(r.issues.map((i) => i.issue)).toEqual([
      'invalid',
      'invalid',
      'invalid',
      'invalid',
    ]);
  });

  it('単位の種類が異なる行は除外して報告する', () => {
    const r = compareUnitPrices([
      row({ price: '100', quantity: '100' }),
      row({ price: '100', quantity: '100', unit: 'ml' }),
      row({ price: '90', quantity: '100' }),
    ]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.items.map((i) => i.index)).toEqual([0, 2]);
    expect(r.issues).toEqual([{ index: 1, issue: 'dimensionMismatch' }]);
  });

  it('比較できる商品が2つ未満なら tooFew', () => {
    expect(compareUnitPrices([row({ price: '100', quantity: '100' })])).toEqual(
      { error: 'tooFew', issues: [] },
    );
    expect(compareUnitPrices([])).toEqual({ error: 'tooFew', issues: [] });
  });
});
