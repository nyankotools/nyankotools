import { describe, it, expect } from 'vitest';
import {
  bandRoles,
  colorsForRole,
  decodeBands,
  eSeriesMantissas,
  encodeResistance,
  formatResistance,
  nearestESeries,
  parseResistance,
} from './resistor-color-code';

describe('decodeBands', () => {
  it('4本: 黄紫赤金 = 4.7kΩ ±5%', () => {
    const r = decodeBands(4, ['yellow', 'violet', 'red', 'gold']);
    expect(r).toMatchObject({
      ok: true,
      ohms: 4700,
      tolerance: 5,
      tempco: null,
    });
    if (r.ok) {
      expect(r.min).toBe(4465);
      expect(r.max).toBe(4935);
    }
  });

  it('5本: 茶黒黒赤茶 = 10kΩ ±1%', () => {
    expect(
      decodeBands(5, ['brown', 'black', 'black', 'red', 'brown']),
    ).toMatchObject({ ok: true, ohms: 10000, tolerance: 1 });
  });

  it('6本: 温度係数を読む', () => {
    expect(
      decodeBands(6, ['red', 'red', 'black', 'brown', 'brown', 'red']),
    ).toMatchObject({ ok: true, ohms: 2200, tolerance: 1, tempco: 50 });
  });

  it('金・銀の乗数で小数の抵抗値になる', () => {
    expect(decodeBands(4, ['green', 'blue', 'gold', 'gold'])).toMatchObject({
      ok: true,
      ohms: 5.6,
    });
    expect(decodeBands(4, ['brown', 'black', 'silver', 'gold'])).toMatchObject({
      ok: true,
      ohms: 0.1,
    });
  });

  it('0Ω（黒1本相当）も読める', () => {
    expect(decodeBands(4, ['black', 'black', 'black', 'gold'])).toMatchObject({
      ok: true,
      ohms: 0,
    });
  });

  it('桁の位置に金・許容差の位置に黒は不正', () => {
    expect(decodeBands(4, ['gold', 'red', 'red', 'gold'])).toEqual({
      ok: false,
      reason: 'invalidBand',
      index: 0,
    });
    expect(decodeBands(4, ['red', 'red', 'red', 'black'])).toEqual({
      ok: false,
      reason: 'invalidBand',
      index: 3,
    });
  });

  it('本数が合わないとエラー', () => {
    expect(decodeBands(5, ['red', 'red', 'red', 'gold'])).toEqual({
      ok: false,
      reason: 'bandCount',
    });
  });
});

describe('encodeResistance', () => {
  it('4.7kΩ 4本', () => {
    const r = encodeResistance(4700, 4, 5);
    expect(r).toMatchObject({
      ok: true,
      colors: ['yellow', 'violet', 'red', 'gold'],
    });
  });

  it('5本・6本', () => {
    expect(encodeResistance(10000, 5, 1)).toMatchObject({
      colors: ['brown', 'black', 'black', 'red', 'brown'],
    });
    expect(encodeResistance(2200, 6, 1, 50)).toMatchObject({
      colors: ['red', 'red', 'black', 'brown', 'brown', 'red'],
    });
  });

  it('1Ω・0.1Ω・5.6Ω は金・銀の乗数', () => {
    expect(encodeResistance(1, 4, 5)).toMatchObject({
      colors: ['brown', 'black', 'gold', 'gold'],
    });
    expect(encodeResistance(0.1, 4, 5)).toMatchObject({
      colors: ['brown', 'black', 'silver', 'gold'],
    });
    expect(encodeResistance(5.6, 4, 5)).toMatchObject({
      colors: ['green', 'blue', 'gold', 'gold'],
    });
  });

  it('0Ω', () => {
    expect(encodeResistance(0, 4, 5)).toMatchObject({
      colors: ['black', 'black', 'black', 'gold'],
    });
  });

  it('桁数に収まらない値は表せない', () => {
    expect(encodeResistance(4710, 4, 5)).toEqual({
      ok: false,
      reason: 'notRepresentable',
    });
    expect(encodeResistance(0.01, 4, 5)).toEqual({
      ok: false,
      reason: 'notRepresentable',
    });
    expect(encodeResistance(0.123, 4, 5)).toEqual({
      ok: false,
      reason: 'notRepresentable',
    });
  });

  it('範囲外・不正な値・未対応の許容差/温度係数', () => {
    expect(encodeResistance(1e12, 4, 5)).toEqual({
      ok: false,
      reason: 'outOfRange',
    });
    expect(encodeResistance(-1, 4, 5)).toEqual({
      ok: false,
      reason: 'invalid',
    });
    expect(encodeResistance(NaN, 4, 5)).toEqual({
      ok: false,
      reason: 'invalid',
    });
    expect(encodeResistance(100, 4, 3)).toEqual({
      ok: false,
      reason: 'tolerance',
    });
    expect(encodeResistance(100, 6, 1, 7)).toEqual({
      ok: false,
      reason: 'tempco',
    });
  });

  it('エンコード→デコードで元の値に戻る', () => {
    for (const ohms of [10, 47, 330, 1500, 4700, 220000, 1e6, 2.2e7, 3.3]) {
      const e = encodeResistance(ohms, 5, 2);
      if (!e.ok) throw new Error(`failed ${ohms}`);
      const d = decodeBands(5, e.colors);
      expect(d).toMatchObject({ ok: true, ohms });
    }
  });
});

describe('parseResistance', () => {
  it('単位付き・RKM表記', () => {
    expect(parseResistance('470')).toBe(470);
    expect(parseResistance('4.7k')).toBe(4700);
    expect(parseResistance('4k7')).toBe(4700);
    expect(parseResistance('2M2')).toBe(2200000);
    expect(parseResistance('4R7')).toBe(4.7);
    expect(parseResistance('R47')).toBe(0.47);
    expect(parseResistance('2.2 kΩ')).toBe(2200);
    expect(parseResistance('１０ｋ')).toBe(10000);
    expect(parseResistance('1,000')).toBe(1000);
    expect(parseResistance('100 ohm')).toBe(100);
  });

  it('不正な文字列は null', () => {
    expect(parseResistance('')).toBeNull();
    expect(parseResistance('abc')).toBeNull();
    expect(parseResistance('4.7k3')).toBeNull();
    expect(parseResistance('47')).toBe(47);
    expect(parseResistance('-5')).toBeNull();
  });
});

describe('formatResistance', () => {
  it('単位を付けて整形する', () => {
    expect(formatResistance(0)).toBe('0 Ω');
    expect(formatResistance(0.47)).toBe('0.47 Ω');
    expect(formatResistance(470)).toBe('470 Ω');
    expect(formatResistance(4700)).toBe('4.7 kΩ');
    expect(formatResistance(2.2e6)).toBe('2.2 MΩ');
    expect(formatResistance(1e9)).toBe('1 GΩ');
  });
});

describe('E series', () => {
  it('各系列の要素数', () => {
    expect(eSeriesMantissas('E6')).toHaveLength(6);
    expect(eSeriesMantissas('E12')).toHaveLength(12);
    expect(eSeriesMantissas('E24')).toHaveLength(24);
    expect(eSeriesMantissas('E48')).toHaveLength(48);
    expect(eSeriesMantissas('E96')).toHaveLength(96);
    expect(eSeriesMantissas('E192')).toHaveLength(192);
  });

  it('E96 は規格の代表値と一致する', () => {
    const e96 = eSeriesMantissas('E96');
    for (const v of [1.0, 1.02, 1.87, 2.37, 4.75, 4.99, 6.19, 9.76]) {
      expect(e96).toContain(v);
    }
  });

  it('E48 は規格の代表値と一致する', () => {
    const e48 = eSeriesMantissas('E48');
    for (const v of [1.0, 1.05, 2.15, 4.64, 9.53]) expect(e48).toContain(v);
  });

  it('近い値と上下の値を返す', () => {
    const r = nearestESeries(4800, 'E24')!;
    expect(r.value).toBe(4700);
    expect(r.exact).toBe(false);
    expect(r.lower).toBe(4300);
    expect(r.upper).toBe(5100);
    expect(r.deviationPercent).toBeCloseTo(-2.0833, 3);
  });

  it('標準値ならちょうど一致', () => {
    const r = nearestESeries(4700, 'E12')!;
    expect(r).toMatchObject({ value: 4700, exact: true, deviationPercent: 0 });
  });

  it('デケードをまたぐ（9.5 → 10）', () => {
    expect(nearestESeries(9.7, 'E6')!.value).toBe(10);
    expect(nearestESeries(98000, 'E12')!.value).toBe(100000);
  });

  it('小数・巨大な値でも動く', () => {
    expect(nearestESeries(0.5, 'E12')!.value).toBe(0.47);
    expect(nearestESeries(3.3e8, 'E24')!.value).toBe(3.3e8);
  });

  it('0 以下や非数は null', () => {
    expect(nearestESeries(0, 'E24')).toBeNull();
    expect(nearestESeries(-1, 'E24')).toBeNull();
    expect(nearestESeries(NaN, 'E24')).toBeNull();
  });
});

describe('bandRoles / colorsForRole', () => {
  it('本数ごとの役割', () => {
    expect(bandRoles(4)).toEqual(['digit', 'digit', 'multiplier', 'tolerance']);
    expect(bandRoles(5)).toHaveLength(5);
    expect(bandRoles(6)[5]).toBe('tempco');
  });

  it('役割ごとの色の候補', () => {
    expect(colorsForRole('digit')).toHaveLength(10);
    expect(colorsForRole('multiplier')).toHaveLength(12);
    expect(colorsForRole('tolerance')).toContain('silver');
    expect(colorsForRole('tolerance')).not.toContain('black');
    expect(colorsForRole('tempco')).not.toContain('gold');
  });
});
