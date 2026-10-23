import { describe, expect, it } from 'vitest';
import {
  A_SERIES,
  B_SERIES,
  convert,
  convertAll,
  isPrintUnit,
  paperToPixels,
  parseDpi,
  parseNumber,
} from './print-size-converter';

describe('parseNumber / parseDpi', () => {
  it('数値を解釈する', () => {
    expect(parseNumber(' 12.5 ')).toBe(12.5);
    expect(parseNumber('.5')).toBe(0.5);
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('1e3')).toBeNull();
  });
  it('DPIは正の数のみ', () => {
    expect(parseDpi('300')).toBe(300);
    expect(parseDpi('0')).toBeNull();
    expect(parseDpi('-1')).toBeNull();
  });
});

describe('convert', () => {
  it('mm→px（300dpi）', () => {
    expect(convert(25.4, 'mm', 'px', 300)).toBeCloseTo(300, 9);
    expect(Math.round(convert(210, 'mm', 'px', 300))).toBe(2480);
    expect(Math.round(convert(297, 'mm', 'px', 300))).toBe(3508);
  });
  it('pt⇔mm', () => {
    expect(convert(72, 'pt', 'mm', 300)).toBeCloseTo(25.4, 9);
    expect(convert(10, 'pt', 'mm', 300)).toBeCloseTo(3.5278, 4);
  });
  it('px→mm はDPIに依存し、pt は依存しない', () => {
    expect(convert(96, 'px', 'mm', 96)).toBeCloseTo(25.4, 9);
    expect(convert(1, 'in', 'pt', 1)).toBeCloseTo(72, 9);
  });
  it('cm', () => {
    expect(convert(1, 'cm', 'mm', 300)).toBeCloseTo(10, 9);
  });
});

describe('convertAll', () => {
  it('全単位を返す', () => {
    const r = convertAll(1, 'in', 300);
    expect(r.map((x) => x.unit)).toEqual(['mm', 'cm', 'in', 'pt', 'px']);
    expect(r.find((x) => x.unit === 'mm')?.value).toBe(25.4);
    expect(r.find((x) => x.unit === 'pt')?.value).toBe(72);
    expect(r.find((x) => x.unit === 'px')?.value).toBe(300);
  });
  it('0とマイナス0を正規化する', () => {
    expect(convertAll(0, 'mm', 300).every((x) => x.value === 0)).toBe(true);
    expect(Object.is(convertAll(-0.00001, 'mm', 300)[0].value, 0)).toBe(true);
  });
  it('負の値も換算する', () => {
    expect(
      convertAll(-25.4, 'mm', 300).find((x) => x.unit === 'px')?.value,
    ).toBe(-300);
  });
});

describe('paperToPixels', () => {
  it('A4 300dpi', () => {
    expect(paperToPixels(A_SERIES[4], 300)).toEqual({
      widthPx: 2480,
      heightPx: 3508,
      widthPt: 595.3,
      heightPt: 841.9,
    });
  });
  it('A4 72dpi は pt とほぼ一致', () => {
    const p = paperToPixels(A_SERIES[4], 72);
    expect(p.widthPx).toBe(595);
    expect(p.heightPx).toBe(842);
  });
});

describe('用紙サイズ表', () => {
  it('A0〜A10・B0〜B10がある', () => {
    expect(A_SERIES).toHaveLength(11);
    expect(B_SERIES).toHaveLength(11);
    expect(A_SERIES[0].name).toBe('A0');
    expect(B_SERIES[5]).toMatchObject({
      name: 'B5',
      widthMm: 182,
      heightMm: 257,
    });
  });
  it('1つ下の判の長辺は上の判の短辺', () => {
    for (const series of [A_SERIES, B_SERIES]) {
      for (let i = 1; i < series.length; i++) {
        expect(series[i].heightMm).toBe(series[i - 1].widthMm);
      }
    }
  });
});

describe('isPrintUnit', () => {
  it('判定する', () => {
    expect(isPrintUnit('mm')).toBe(true);
    expect(isPrintUnit('rem')).toBe(false);
  });
});
