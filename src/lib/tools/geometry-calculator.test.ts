import { describe, expect, it } from 'vitest';
import {
  calculateGeometry,
  formatNumber,
  piValue,
  unitSymbol,
  type GeometryMetric,
} from './geometry-calculator';

function metric(
  outcome: ReturnType<typeof calculateGeometry>,
  key: GeometryMetric['key'],
): GeometryMetric {
  if (!outcome.ok) throw new Error('not ok');
  const m = outcome.metrics.find((x) => x.key === key);
  if (!m) throw new Error('missing ' + key);
  return m;
}

describe('calculateGeometry', () => {
  it('円の面積と円周', () => {
    const r = calculateGeometry('circle', { r: 3 });
    expect(metric(r, 'area').value).toBeCloseTo(28.274334, 5);
    expect(metric(r, 'circumference').value).toBeCloseTo(18.849556, 5);
    expect(metric(r, 'area').substitution).toBe('π × 3² = 28.274334');
  });

  it('π桁数指定で3.14を使う', () => {
    const r = calculateGeometry('circle', { r: 10 }, { piDigits: 2 });
    expect(metric(r, 'area').value).toBeCloseTo(314, 8);
    expect(metric(r, 'area').substitution).toBe('3.14 × 10² = 314');
  });

  it('三角形・四角形・台形', () => {
    expect(
      metric(calculateGeometry('triangle', { b: 6, h: 4 }), 'area').value,
    ).toBe(12);
    const rect = calculateGeometry('rectangle', { w: 3, h: 5 });
    expect(metric(rect, 'area').value).toBe(15);
    expect(metric(rect, 'perimeter').value).toBe(16);
    expect(
      metric(calculateGeometry('trapezoid', { a: 3, b: 5, h: 4 }), 'area')
        .value,
    ).toBe(16);
  });

  it('円柱・円錐・球・直方体', () => {
    const cyl = calculateGeometry('cylinder', { r: 2, h: 5 });
    expect(metric(cyl, 'volume').value).toBeCloseTo(62.831853, 5);
    expect(metric(cyl, 'surfaceArea').value).toBeCloseTo(87.964594, 5);

    const cone = calculateGeometry('cone', { r: 3, h: 4 });
    expect(metric(cone, 'slant').value).toBe(5);
    expect(metric(cone, 'volume').value).toBeCloseTo(37.699112, 5);
    expect(metric(cone, 'surfaceArea').value).toBeCloseTo(75.398224, 5);

    const sph = calculateGeometry('sphere', { r: 1 });
    expect(metric(sph, 'volume').value).toBeCloseTo(4.18879, 5);
    expect(metric(sph, 'surfaceArea').value).toBeCloseTo(12.566371, 5);

    const box = calculateGeometry('cuboid', { w: 2, d: 3, h: 4 });
    expect(metric(box, 'volume').value).toBe(24);
    expect(metric(box, 'surfaceArea').value).toBe(52);
  });

  it('小数の入力', () => {
    expect(
      metric(calculateGeometry('rectangle', { w: 1.5, h: 2.5 }), 'area').value,
    ).toBe(3.75);
  });

  it('未入力はempty', () => {
    expect(calculateGeometry('rectangle', { w: 1, h: null })).toEqual({
      ok: false,
      error: 'empty',
    });
    expect(calculateGeometry('circle', {})).toEqual({
      ok: false,
      error: 'empty',
    });
  });

  it('0と負数はnonPositive', () => {
    expect(calculateGeometry('circle', { r: 0 })).toEqual({
      ok: false,
      error: 'nonPositive',
    });
    expect(calculateGeometry('cuboid', { w: 1, d: -2, h: 3 })).toEqual({
      ok: false,
      error: 'nonPositive',
    });
  });

  it('NaN・Infinityはinvalid、巨大値のオーバーフローもinvalid', () => {
    expect(calculateGeometry('circle', { r: NaN })).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(calculateGeometry('circle', { r: Infinity })).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(
      calculateGeometry('cuboid', { w: 1e200, d: 1e200, h: 1e200 }),
    ).toEqual({ ok: false, error: 'invalid' });
  });
});

describe('helpers', () => {
  it('piValue', () => {
    expect(piValue(null)).toBe(Math.PI);
    expect(piValue(0)).toBe(3);
    expect(piValue(2)).toBe(3.14);
    expect(piValue(4)).toBe(3.1416);
    expect(piValue(99)).toBe(Math.PI);
  });

  it('unitSymbol', () => {
    expect(unitSymbol('cm', 1)).toBe('cm');
    expect(unitSymbol('cm', 2)).toBe('cm²');
    expect(unitSymbol('ft', 3)).toBe('ft³');
  });

  it('formatNumber', () => {
    expect(formatNumber(2)).toBe('2');
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
    expect(formatNumber(1 / 3)).toBe('0.333333');
    expect(formatNumber(-0)).toBe('0');
  });
});
