import { describe, it, expect } from 'vitest';
import {
  roundToUnit,
  splitBill,
  type SplitBillInput,
} from './split-bill-calculator';

const base: SplitBillInput = {
  total: 10000,
  people: 3,
  higherCount: 0,
  higherRatio: 1.5,
  roundingUnit: 100,
  roundingMode: 'up',
};

describe('roundToUnit', () => {
  it('切り上げ・切り捨て・四捨五入', () => {
    expect(roundToUnit(3333.33, 100, 'up')).toBe(3400);
    expect(roundToUnit(3333.33, 100, 'down')).toBe(3300);
    expect(roundToUnit(3350, 100, 'nearest')).toBe(3400);
    expect(roundToUnit(3349, 100, 'nearest')).toBe(3300);
  });

  it('ちょうど割り切れる値は誤差で繰り上がらない', () => {
    expect(roundToUnit(0.3, 0.1, 'up')).toBe(0.3);
    expect(roundToUnit(1200, 100, 'up')).toBe(1200);
  });

  it('小数の単位（0.01）でも誤差が出ない', () => {
    expect(roundToUnit(3.333333, 0.01, 'up')).toBe(3.34);
  });
});

describe('splitBill', () => {
  it('均等割り（切り上げ）で余りが出る', () => {
    expect(splitBill(base)).toEqual({
      groups: [{ count: 3, amountEach: 3400 }],
      collected: 10200,
      difference: 200,
    });
  });

  it('切り捨てでは不足が出る', () => {
    expect(splitBill({ ...base, roundingMode: 'down' })).toEqual({
      groups: [{ count: 3, amountEach: 3300 }],
      collected: 9900,
      difference: -100,
    });
  });

  it('割り切れるときは差が0', () => {
    const r = splitBill({ ...base, total: 9000 });
    expect(r).toEqual({
      groups: [{ count: 3, amountEach: 3000 }],
      collected: 9000,
      difference: 0,
    });
  });

  it('多めに払う人がいる場合は倍率で按分する', () => {
    // 重み: 1人×2 + 2人×1 = 4 → 12000/4 = 3000
    const r = splitBill({
      total: 12000,
      people: 3,
      higherCount: 1,
      higherRatio: 2,
      roundingUnit: 100,
      roundingMode: 'up',
    });
    expect(r).toEqual({
      groups: [
        { count: 1, amountEach: 6000 },
        { count: 2, amountEach: 3000 },
      ],
      collected: 12000,
      difference: 0,
    });
  });

  it('全員が多めに払う場合は通常グループが出ない', () => {
    const r = splitBill({ ...base, higherCount: 3, higherRatio: 2 });
    expect(r).toMatchObject({ groups: [{ count: 3, amountEach: 3400 }] });
  });

  it('1人の場合は全額', () => {
    expect(splitBill({ ...base, people: 1 })).toMatchObject({
      groups: [{ count: 1, amountEach: 10000 }],
      difference: 0,
    });
  });

  it('不正な入力はエラーを返す', () => {
    expect(splitBill({ ...base, total: 0 })).toEqual({ error: 'invalidTotal' });
    expect(splitBill({ ...base, total: NaN })).toEqual({
      error: 'invalidTotal',
    });
    expect(splitBill({ ...base, people: 0 })).toEqual({
      error: 'invalidPeople',
    });
    expect(splitBill({ ...base, people: 2.5 })).toEqual({
      error: 'invalidPeople',
    });
    expect(splitBill({ ...base, people: 1001 })).toEqual({
      error: 'invalidPeople',
    });
    expect(splitBill({ ...base, higherCount: 4 })).toEqual({
      error: 'invalidHigherCount',
    });
    expect(splitBill({ ...base, higherCount: 1, higherRatio: 0 })).toEqual({
      error: 'invalidRatio',
    });
    expect(splitBill({ ...base, roundingUnit: 0 })).toEqual({
      error: 'invalidUnit',
    });
  });

  it('多めに払う人数が0なら倍率が不正でもエラーにならない', () => {
    expect(splitBill({ ...base, higherRatio: NaN })).not.toHaveProperty(
      'error',
    );
  });
});
