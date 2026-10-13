import { describe, expect, it } from 'vitest';
import {
  RATIO_PRESETS,
  RESOLUTION_PRESETS,
  calculateScreen,
  cmToInch,
  formatNumber,
  inchToCm,
  simplifyInteger,
  sizeToDiagonal,
} from './screen-size-calculator';

const base = {
  diagonalInch: 27,
  ratioW: 16,
  ratioH: 9,
  resWidth: 3840,
  resHeight: 2160,
};

describe('inch / cm conversion', () => {
  it('converts both ways', () => {
    expect(inchToCm(1)).toBeCloseTo(2.54, 10);
    expect(cmToInch(2.54)).toBeCloseTo(1, 10);
    expect(cmToInch(inchToCm(27))).toBeCloseTo(27, 10);
  });
});

describe('calculateScreen', () => {
  it('computes physical size of a 27 inch 16:9 screen', () => {
    const r = calculateScreen(base)!;
    expect(r.widthCm).toBeCloseTo(59.77, 2);
    expect(r.heightCm).toBeCloseTo(33.62, 2);
    expect(r.widthInch).toBeCloseTo(23.53, 2);
    expect(r.heightInch).toBeCloseTo(13.24, 2);
    expect(r.diagonalCm).toBeCloseTo(68.58, 2);
    expect(Math.hypot(r.widthCm, r.heightCm)).toBeCloseTo(r.diagonalCm, 8);
    expect(r.areaCm2).toBeCloseTo(r.widthCm * r.heightCm, 8);
  });

  it('computes PPI and dot pitch', () => {
    const r = calculateScreen(base)!;
    expect(r.ppi).toBeCloseTo(163.2, 1);
    expect(r.dotPitchMm).toBeCloseTo(25.4 / r.ppi, 10);
    const fhd = calculateScreen({ ...base, resWidth: 1920, resHeight: 1080 })!;
    expect(fhd.ppi).toBeCloseTo(81.6, 1);
    expect(fhd.dotPitchMm).toBeCloseTo(0.311, 3);
  });

  it('estimates viewing distances', () => {
    const fhd = calculateScreen({ ...base, resWidth: 1920, resHeight: 1080 })!;
    // 0.311mm * 3438 ≒ 1070mm
    expect(fhd.pixelInvisibleCm).toBeCloseTo(107, 0);
    expect(fhd.overviewMinCm).toBeCloseTo(68.58, 2);
    expect(fhd.overviewMaxCm).toBeCloseTo(102.87, 2);
  });

  it('reports a ratio mismatch between screen and resolution', () => {
    expect(calculateScreen(base)!.ratioMismatchPercent).toBeCloseTo(0, 8);
    const r = calculateScreen({ ...base, ratioW: 16, ratioH: 10 })!;
    expect(r.ratioMismatchPercent).toBeCloseTo(11.11, 1);
  });

  it('works with a square ratio', () => {
    const r = calculateScreen({ ...base, ratioW: 1, ratioH: 1 })!;
    expect(r.widthCm).toBeCloseTo(r.heightCm, 10);
  });

  it('rejects zero, negative, non-finite and huge values', () => {
    expect(calculateScreen({ ...base, diagonalInch: 0 })).toBeNull();
    expect(calculateScreen({ ...base, diagonalInch: -5 })).toBeNull();
    expect(calculateScreen({ ...base, ratioW: 0 })).toBeNull();
    expect(calculateScreen({ ...base, ratioH: -1 })).toBeNull();
    expect(calculateScreen({ ...base, resWidth: 0 })).toBeNull();
    expect(calculateScreen({ ...base, resHeight: NaN })).toBeNull();
    expect(calculateScreen({ ...base, diagonalInch: Infinity })).toBeNull();
    expect(calculateScreen({ ...base, diagonalInch: 1e9 })).toBeNull();
  });
});

describe('sizeToDiagonal', () => {
  it('computes diagonal inch from width and height in cm', () => {
    const r = sizeToDiagonal(59.77, 33.62)!;
    expect(r.diagonalInch).toBeCloseTo(27, 1);
    expect(r.nearest.value).toBe('16:9');
    expect(r.nearestDiffPercent).toBeLessThan(0.1);
  });

  it('picks 4:3 and 1:1 as nearest ratios', () => {
    expect(sizeToDiagonal(40, 30)!.nearest.value).toBe('4:3');
    expect(sizeToDiagonal(30, 30)!.nearest.value).toBe('1:1');
  });

  it('rejects invalid values', () => {
    expect(sizeToDiagonal(0, 10)).toBeNull();
    expect(sizeToDiagonal(10, -1)).toBeNull();
    expect(sizeToDiagonal(NaN, 10)).toBeNull();
  });
});

describe('helpers and presets', () => {
  it('simplifies integer ratios', () => {
    expect(simplifyInteger(1920, 1080)).toEqual({ w: 16, h: 9 });
    expect(simplifyInteger(2560, 1600)).toEqual({ w: 8, h: 5 });
    expect(simplifyInteger(1.5, 2)).toBeNull();
    expect(simplifyInteger(0, 5)).toBeNull();
  });

  it('formats numbers without trailing zeros', () => {
    expect(formatNumber(23.5300001, 2)).toBe('23.53');
    expect(formatNumber(10, 2)).toBe('10');
    expect(formatNumber(NaN)).toBe('');
  });

  it('has consistent preset values', () => {
    for (const p of RESOLUTION_PRESETS) {
      expect(p.value).toBe(`${p.width}x${p.height}`);
    }
    for (const p of RATIO_PRESETS) {
      expect(p.value).toBe(`${p.w}:${p.h}`);
    }
  });
});
