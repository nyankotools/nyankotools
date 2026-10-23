import { describe, expect, it } from 'vitest';
import {
  calculateLedResistor,
  combineResistors,
  formatSi,
  nextE24,
  parseSiNumber,
  solveOhm,
} from './ohm-calculator';

const ohm = (o: Partial<Record<string, string>>) =>
  solveOhm({ voltage: '', current: '', resistance: '', power: '', ...o });

describe('parseSiNumber', () => {
  it('接頭辞と単位を解釈する', () => {
    expect(parseSiNumber('4.7k')).toBe(4700);
    expect(parseSiNumber('100m')).toBe(0.1);
    expect(parseSiNumber('20mA')).toBe(0.02);
    expect(parseSiNumber('2.2kΩ')).toBe(2200);
    expect(parseSiNumber('1M')).toBe(1_000_000);
    expect(parseSiNumber('5V')).toBe(5);
    expect(parseSiNumber('10 uA')).toBe(0.00001);
    expect(parseSiNumber('1e3')).toBe(1000);
    expect(parseSiNumber(' .5 ')).toBe(0.5);
  });
  it('解釈できない文字列は null', () => {
    expect(parseSiNumber('abc')).toBeNull();
    expect(parseSiNumber('')).toBeNull();
    expect(parseSiNumber('1.2.3')).toBeNull();
    expect(parseSiNumber('5x')).toBeNull();
  });
});

describe('formatSi', () => {
  it('SI接頭辞付きにする', () => {
    expect(formatSi(4700)).toBe('4.7k');
    expect(formatSi(0.02)).toBe('20m');
    expect(formatSi(1)).toBe('1');
    expect(formatSi(0)).toBe('0');
    expect(formatSi(2_200_000)).toBe('2.2M');
    expect(formatSi(0.000047)).toBe('47µ');
    expect(formatSi(999.99)).toBe('1k');
    expect(formatSi(NaN)).toBe('-');
  });
});

describe('solveOhm', () => {
  it('V と I から R と P', () => {
    const r = ohm({ voltage: '12', current: '2' });
    expect(r.ok && r.values).toEqual({
      voltage: 12,
      current: 2,
      resistance: 6,
      power: 24,
    });
  });
  it('V と R から I と P', () => {
    const r = ohm({ voltage: '10', resistance: '5' });
    expect(r.ok && r.values).toEqual({
      voltage: 10,
      current: 2,
      resistance: 5,
      power: 20,
    });
  });
  it('V と P から I と R', () => {
    const r = ohm({ voltage: '10', power: '20' });
    expect(r.ok && r.values).toEqual({
      voltage: 10,
      current: 2,
      resistance: 5,
      power: 20,
    });
  });
  it('I と R から V と P', () => {
    const r = ohm({ current: '2', resistance: '5' });
    expect(r.ok && r.values).toEqual({
      voltage: 10,
      current: 2,
      resistance: 5,
      power: 20,
    });
  });
  it('I と P から V と R', () => {
    const r = ohm({ current: '2', power: '20' });
    expect(r.ok && r.values).toEqual({
      voltage: 10,
      current: 2,
      resistance: 5,
      power: 20,
    });
  });
  it('R と P から V と I', () => {
    const r = ohm({ resistance: '5', power: '20' });
    expect(r.ok && r.values).toEqual({
      voltage: 10,
      current: 2,
      resistance: 5,
      power: 20,
    });
  });
  it('接頭辞付きの入力', () => {
    const r = ohm({ voltage: '5', resistance: '1k' });
    expect(r.ok && r.values.current).toBeCloseTo(0.005, 12);
    expect(r.ok && r.values.power).toBeCloseTo(0.025, 12);
  });
  it('given に入力済みのキーが入る', () => {
    const r = ohm({ voltage: '5', power: '1' });
    expect(r.ok && r.given).toEqual(['voltage', 'power']);
  });
  it('入力が2つでないとエラー', () => {
    expect(ohm({})).toEqual({ ok: false, error: 'few' });
    expect(ohm({ voltage: '5' })).toEqual({ ok: false, error: 'few' });
    expect(ohm({ voltage: '5', current: '1', resistance: '5' })).toEqual({
      ok: false,
      error: 'many',
    });
  });
  it('不正値・負数・0除算を弾く', () => {
    expect(ohm({ voltage: 'x', current: '1' })).toEqual({
      ok: false,
      error: 'invalid',
      key: 'voltage',
    });
    expect(ohm({ voltage: '-5', current: '1' })).toEqual({
      ok: false,
      error: 'negative',
      key: 'voltage',
    });
    expect(ohm({ voltage: '5', current: '0' })).toEqual({
      ok: false,
      error: 'zero',
    });
    expect(ohm({ voltage: '5', resistance: '0' })).toEqual({
      ok: false,
      error: 'zero',
    });
    expect(ohm({ voltage: '0', current: '0' })).toEqual({
      ok: false,
      error: 'zero',
    });
  });
  it('電圧0Vは抵抗0Ωとして計算できる', () => {
    const r = ohm({ voltage: '0', current: '1' });
    expect(r.ok && r.values.resistance).toBe(0);
  });
});

describe('combineResistors', () => {
  it('直列と並列を求める', () => {
    const r = combineResistors('100, 200\n300');
    expect(r.ok && r.series).toBe(600);
    expect(r.ok && r.parallel).toBeCloseTo(54.5454545, 5);
  });
  it('同じ値2本の並列は半分', () => {
    const r = combineResistors('1k 1k');
    expect(r.ok && r.parallel).toBeCloseTo(500, 9);
    expect(r.ok && r.series).toBe(2000);
  });
  it('0Ωを含む並列は0', () => {
    const r = combineResistors('0, 100');
    expect(r.ok && r.parallel).toBe(0);
    expect(r.ok && r.series).toBe(100);
  });
  it('エラーを返す', () => {
    expect(combineResistors('  ')).toEqual({ ok: false, error: 'empty' });
    expect(combineResistors('100')).toEqual({ ok: false, error: 'few' });
    expect(combineResistors('100, abc')).toEqual({
      ok: false,
      error: 'invalid',
      token: 'abc',
    });
    expect(combineResistors('100, -5')).toEqual({
      ok: false,
      error: 'negative',
      token: '-5',
    });
  });
});

describe('nextE24', () => {
  it('次に大きい E24 値を返す', () => {
    expect(nextE24(150)).toBe(150);
    expect(nextE24(151)).toBe(160);
    expect(nextE24(100)).toBe(100);
    expect(nextE24(92)).toBe(100);
    expect(nextE24(0.5)).toBe(0.51);
    expect(nextE24(0.47)).toBe(0.47);
    expect(nextE24(4600)).toBe(4700);
    expect(nextE24(9500)).toBe(10000);
  });
  it('不正値は NaN', () => {
    expect(nextE24(0)).toBeNaN();
    expect(nextE24(-1)).toBeNaN();
  });
});

describe('calculateLedResistor', () => {
  it('5V電源・赤LED 2V・20mA で 150Ω', () => {
    const r = calculateLedResistor({
      supplyVoltage: '5',
      forwardVoltage: '2',
      current: '20m',
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.resistance).toBeCloseTo(150, 9);
    expect(r.result.standard).toBe(150);
    expect(r.result.resistorPower).toBeCloseTo(0.06, 9);
    expect(r.result.drop).toBe(3);
  });
  it('E24 に丸めると電流は少し減る', () => {
    const r = calculateLedResistor({
      supplyVoltage: '3.3',
      forwardVoltage: '2',
      current: '0.02',
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.resistance).toBeCloseTo(65, 9);
    expect(r.result.standard).toBe(68);
    expect(r.result.actualCurrent).toBeLessThan(0.02);
    expect(r.result.actualCurrent).toBeCloseTo(1.3 / 68, 12);
  });
  it('電流が極小で抵抗値が無限大になる場合は電流のエラー', () => {
    expect(
      calculateLedResistor({
        supplyVoltage: '5',
        forwardVoltage: '2',
        current: '1e-320',
      }),
    ).toMatchObject({ ok: false, error: 'current', key: 'current' });
  });
  it('エラーを返す', () => {
    const base = { supplyVoltage: '5', forwardVoltage: '2', current: '20m' };
    expect(calculateLedResistor({ ...base, current: '' })).toEqual({
      ok: false,
      error: 'few',
    });
    expect(calculateLedResistor({ ...base, current: 'z' })).toMatchObject({
      error: 'invalid',
      key: 'current',
    });
    expect(calculateLedResistor({ ...base, current: '-1' })).toMatchObject({
      error: 'negative',
    });
    expect(calculateLedResistor({ ...base, current: '0' })).toMatchObject({
      error: 'current',
    });
    expect(calculateLedResistor({ ...base, supplyVoltage: '2' })).toMatchObject(
      { error: 'supply' },
    );
    expect(
      calculateLedResistor({ ...base, supplyVoltage: '1.8' }),
    ).toMatchObject({ error: 'supply' });
  });
});
