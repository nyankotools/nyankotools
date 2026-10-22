import { describe, expect, it } from 'vitest';
import {
  cmykToRgb,
  formatCmyk,
  formatHwb,
  formatLab,
  formatOklch,
  hwbToRgb,
  labToRgb,
  oklchToRgb,
  parseCmykString,
  parseHwbString,
  parseLabString,
  parseOklchString,
  rgbToCmyk,
  rgbToHwb,
  rgbToLab,
  rgbToOklch,
} from './color-space-converter';

const RED = { r: 255, g: 0, b: 0 };
const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };
const BLUE500 = { r: 59, g: 130, b: 246 };

describe('CMYK', () => {
  it('RGB→CMYK', () => {
    expect(rgbToCmyk(RED)).toEqual({ c: 0, m: 100, y: 100, k: 0 });
    expect(rgbToCmyk(WHITE)).toEqual({ c: 0, m: 0, y: 0, k: 0 });
    expect(rgbToCmyk(BLACK)).toEqual({ c: 0, m: 0, y: 0, k: 100 });
    expect(rgbToCmyk(BLUE500)).toEqual({ c: 76, m: 47, y: 0, k: 4 });
  });

  it('CMYK→RGB', () => {
    expect(cmykToRgb({ c: 0, m: 100, y: 100, k: 0 })).toEqual(RED);
    expect(cmykToRgb({ c: 0, m: 0, y: 0, k: 100 })).toEqual(BLACK);
    expect(cmykToRgb({ c: 76, m: 47, y: 0, k: 4 })).toEqual({
      r: 59,
      g: 130,
      b: 245,
    });
  });

  it('文字列を解釈する', () => {
    const expected = { c: 0, m: 100, y: 100, k: 0 };
    expect(parseCmykString('cmyk(0%, 100%, 100%, 0%)')).toEqual(expected);
    expect(parseCmykString('0, 100, 100, 0')).toEqual(expected);
    expect(parseCmykString('0 100 100 0')).toEqual(expected);
    expect(parseCmykString('CMYK(0% 100% 100% 0%)')).toEqual(expected);
  });

  it('不正な文字列と範囲外はnull', () => {
    expect(parseCmykString('')).toBeNull();
    expect(parseCmykString('0, 100, 100')).toBeNull();
    expect(parseCmykString('0, 100, 100, 101')).toBeNull();
    expect(parseCmykString('-1, 0, 0, 0')).toBeNull();
    expect(parseCmykString('a, b, c, d')).toBeNull();
    expect(parseCmykString('cmyk(0, 0, 0, 0')).toBeNull();
  });

  it('整形', () => {
    expect(formatCmyk({ c: 0, m: 100, y: 100, k: 0 })).toBe(
      'cmyk(0%, 100%, 100%, 0%)',
    );
  });
});

describe('HWB', () => {
  it('RGB→HWB', () => {
    expect(rgbToHwb(RED)).toEqual({ h: 0, w: 0, b: 0 });
    expect(rgbToHwb(WHITE)).toEqual({ h: 0, w: 100, b: 0 });
    expect(rgbToHwb(BLACK)).toEqual({ h: 0, w: 0, b: 100 });
    expect(rgbToHwb(BLUE500)).toEqual({ h: 217, w: 23, b: 4 });
  });

  it('HWB→RGB', () => {
    expect(hwbToRgb({ h: 0, w: 0, b: 0 })).toEqual(RED);
    expect(hwbToRgb({ h: 120, w: 0, b: 0 })).toEqual({ r: 0, g: 255, b: 0 });
    expect(hwbToRgb({ h: 240, w: 0, b: 0 })).toEqual({ r: 0, g: 0, b: 255 });
    expect(hwbToRgb({ h: 360, w: 0, b: 0 })).toEqual(RED);
    expect(hwbToRgb({ h: 0, w: 50, b: 0 })).toEqual({ r: 255, g: 128, b: 128 });
  });

  it('白と黒の合計が100%以上ならグレーになる', () => {
    expect(hwbToRgb({ h: 200, w: 50, b: 50 })).toEqual({
      r: 128,
      g: 128,
      b: 128,
    });
    expect(hwbToRgb({ h: 0, w: 100, b: 100 })).toEqual({
      r: 128,
      g: 128,
      b: 128,
    });
    expect(hwbToRgb({ h: 0, w: 100, b: 0 })).toEqual(WHITE);
  });

  it('文字列を解釈する', () => {
    const expected = { h: 217, w: 23, b: 4 };
    expect(parseHwbString('hwb(217 23% 4%)')).toEqual(expected);
    expect(parseHwbString('hwb(217, 23%, 4%)')).toEqual(expected);
    expect(parseHwbString('217, 23, 4')).toEqual(expected);
    expect(parseHwbString('hwb(217deg 23% 4% / 0.5)')).toEqual(expected);
    expect(parseHwbString('hwb(-143 23% 4%)')).toEqual(expected);
  });

  it('範囲外はnull', () => {
    expect(parseHwbString('hwb(0 101% 0%)')).toBeNull();
    expect(parseHwbString('hwb(0 0%)')).toBeNull();
  });

  it('整形', () => {
    expect(formatHwb({ h: 217, w: 23, b: 4 })).toBe('hwb(217 23% 4%)');
  });
});

describe('Lab（D50）', () => {
  it('白は L=100、a=b=0', () => {
    const lab = rgbToLab(WHITE);
    expect(lab.l).toBeCloseTo(100, 2);
    expect(lab.a).toBeCloseTo(0, 2);
    expect(lab.b).toBeCloseTo(0, 2);
  });

  it('黒は L=0', () => {
    expect(rgbToLab(BLACK).l).toBeCloseTo(0, 5);
  });

  it('赤はCSS Color 4の値に一致する', () => {
    const lab = rgbToLab(RED);
    expect(lab.l).toBeCloseTo(54.29, 1);
    expect(lab.a).toBeCloseTo(80.8, 1);
    expect(lab.b).toBeCloseTo(69.89, 1);
  });

  it('formatLab', () => {
    expect(formatLab(rgbToLab(RED))).toBe('lab(54.29 80.8 69.89)');
  });

  it('往復で元のRGBに戻る', () => {
    for (const rgb of [RED, WHITE, BLACK, BLUE500, { r: 12, g: 200, b: 99 }]) {
      const result = labToRgb(rgbToLab(rgb));
      expect(result.rgb).toEqual(rgb);
      expect(result.clipped).toBe(false);
    }
  });

  it('丸めた表示値からでも±1以内で戻る', () => {
    const parsed = parseLabString(formatLab(rgbToLab(BLUE500)))!;
    const { rgb } = labToRgb(parsed);
    expect(Math.abs(rgb.r - 59)).toBeLessThanOrEqual(1);
    expect(Math.abs(rgb.g - 130)).toBeLessThanOrEqual(1);
    expect(Math.abs(rgb.b - 246)).toBeLessThanOrEqual(1);
  });

  it('sRGBの範囲外の色はclippedになり0〜255に収まる', () => {
    const result = labToRgb({ l: 50, a: 120, b: -120 });
    expect(result.clipped).toBe(true);
    for (const v of Object.values(result.rgb)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    }
  });

  it('文字列を解釈する', () => {
    expect(parseLabString('lab(54.29 80.8 69.89)')).toEqual({
      l: 54.29,
      a: 80.8,
      b: 69.89,
    });
    expect(parseLabString('50, -20, 30')).toEqual({ l: 50, a: -20, b: 30 });
    expect(parseLabString('lab(50% 10 10 / 0.3)')).toEqual({
      l: 50,
      a: 10,
      b: 10,
    });
  });

  it('範囲外はnull', () => {
    expect(parseLabString('lab(101 0 0)')).toBeNull();
    expect(parseLabString('lab(-1 0 0)')).toBeNull();
    expect(parseLabString('lab(50 200 0)')).toBeNull();
    expect(parseLabString('lab(50 0)')).toBeNull();
  });
});

describe('OKLCH', () => {
  it('白は L=1、無彩色は C≈0・h=0', () => {
    const lch = rgbToOklch(WHITE);
    expect(lch.l).toBeCloseTo(1, 3);
    expect(lch.c).toBeLessThan(0.0001);
    expect(lch.h).toBe(0);
  });

  it('赤はCSS Color 4の値に一致する', () => {
    const lch = rgbToOklch(RED);
    expect(lch.l).toBeCloseTo(0.628, 3);
    expect(lch.c).toBeCloseTo(0.2577, 3);
    expect(lch.h).toBeCloseTo(29.23, 1);
  });

  it('formatOklch', () => {
    expect(formatOklch(rgbToOklch(RED))).toBe('oklch(0.628 0.2577 29.23)');
  });

  it('色相は0〜360に正規化される', () => {
    const { h } = rgbToOklch({ r: 0, g: 100, b: 255 });
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(360);
  });

  it('往復で元のRGBに戻る', () => {
    for (const rgb of [RED, WHITE, BLACK, BLUE500, { r: 12, g: 200, b: 99 }]) {
      const result = oklchToRgb(rgbToOklch(rgb));
      expect(result.rgb).toEqual(rgb);
      expect(result.clipped).toBe(false);
    }
  });

  it('色域外はclippedになる', () => {
    const result = oklchToRgb({ l: 0.7, c: 0.4, h: 150 });
    expect(result.clipped).toBe(true);
  });

  it('文字列を解釈する', () => {
    const expected = { l: 0.628, c: 0.2577, h: 29.23 };
    expect(parseOklchString('oklch(0.628 0.2577 29.23)')).toEqual(expected);
    expect(parseOklchString('oklch(62.8% 0.2577 29.23deg)')).toEqual({
      ...expected,
      l: 0.628,
    });
    expect(parseOklchString('0.628, 0.2577, 29.23')).toEqual(expected);
    expect(parseOklchString('oklch(50% 100% 400)')).toEqual({
      l: 0.5,
      c: 0.4,
      h: 40,
    });
  });

  it('範囲外はnull', () => {
    expect(parseOklchString('oklch(62.8 0.2 30)')).toBeNull();
    expect(parseOklchString('oklch(0.5 0.9 30)')).toBeNull();
    expect(parseOklchString('oklch(0.5 0.1)')).toBeNull();
    expect(parseOklchString('oklch(abc 0.1 30)')).toBeNull();
  });
});

describe('グレー（無彩色）', () => {
  const GRAY = { r: 128, g: 128, b: 128 };

  it('CMYKは C=M=Y=0、K は明度に応じた値になる', () => {
    expect(rgbToCmyk(GRAY)).toEqual({ c: 0, m: 0, y: 0, k: 50 });
  });

  it('HWBは W+B=100% で色相は0', () => {
    const hwb = rgbToHwb(GRAY);
    expect(hwb.h).toBe(0);
    expect(hwb.w + hwb.b).toBe(100);
    expect(formatHwb(hwb)).toBe('hwb(0 50% 50%)');
  });

  it('Labのa・bはほぼ0になる', () => {
    const lab = rgbToLab(GRAY);
    expect(Math.abs(lab.a)).toBeLessThan(0.01);
    expect(Math.abs(lab.b)).toBeLessThan(0.01);
  });

  it('OKLCHの彩度はほぼ0で、往復でも元に戻る', () => {
    expect(rgbToOklch(GRAY).c).toBeLessThan(0.0001);
    expect(oklchToRgb(rgbToOklch(GRAY)).rgb).toEqual(GRAY);
  });

  it('黒と白の表示は最小・最大値に整形される', () => {
    expect(formatLab(rgbToLab(BLACK))).toBe('lab(0 0 0)');
    expect(formatOklch(rgbToOklch(BLACK))).toBe('oklch(0 0 0)');
    expect(formatLab(rgbToLab(WHITE))).toBe('lab(100 0 0)');
  });
});

describe('色域の境界', () => {
  it('Labの白（L=100）は色域内で、255,255,255に戻る', () => {
    const result = labToRgb({ l: 100, a: 0, b: 0 });
    expect(result.clipped).toBe(false);
    expect(result.rgb).toEqual(WHITE);
  });

  it('OKLCHの黒（L=0, C=0）は色域内で、0,0,0に戻る', () => {
    const result = oklchToRgb({ l: 0, c: 0, h: 0 });
    expect(result.clipped).toBe(false);
    expect(result.rgb).toEqual(BLACK);
  });

  it('OKLCHのLが1を超える場合も0〜255に収まりclippedになる', () => {
    const result = oklchToRgb({ l: 1.5, c: 0, h: 0 });
    expect(result.clipped).toBe(true);
    for (const v of Object.values(result.rgb)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    }
  });

  it('グリッド状の全色で RGB→Lab→RGB、RGB→OKLCH→RGB が元に戻る', () => {
    const steps = [0, 51, 102, 153, 204, 255];
    for (const r of steps) {
      for (const g of steps) {
        for (const b of steps) {
          const rgb = { r, g, b };
          const lab = labToRgb(rgbToLab(rgb));
          expect(lab.rgb).toEqual(rgb);
          expect(lab.clipped).toBe(false);
          const lch = oklchToRgb(rgbToOklch(rgb));
          expect(lch.rgb).toEqual(rgb);
          expect(lch.clipped).toBe(false);
        }
      }
    }
  });
});

describe('入力の解釈（エッジケース）', () => {
  it('前後の空白やタブ区切りを許容する', () => {
    expect(parseCmykString('  cmyk(0%, 100%, 100%, 0%)  ')).toEqual({
      c: 0,
      m: 100,
      y: 100,
      k: 0,
    });
    expect(parseCmykString('0\t100\t100\t0')).toEqual({
      c: 0,
      m: 100,
      y: 100,
      k: 0,
    });
  });

  it('余分な文字が後ろに続く場合はnull', () => {
    expect(parseCmykString('cmyk(0%, 100%, 100%, 0%) extra')).toBeNull();
    expect(parseHwbString('hwb(217 23% 4%) hwb(0 0% 0%)')).toBeNull();
  });

  it('要素数が多すぎる場合はnull', () => {
    expect(parseCmykString('cmyk(0 0 0 0 0)')).toBeNull();
    expect(parseHwbString('hwb()')).toBeNull();
    expect(parseOklchString('oklch()')).toBeNull();
  });

  it('指数表記・全角数字・全角括弧・日本語はnull', () => {
    expect(parseCmykString('cmyk(1e2, 0, 0, 0)')).toBeNull();
    expect(parseCmykString('ｃｍｙｋ（０, ０, ０, ０）')).toBeNull();
    expect(parseCmykString('cmyk(１００, 0, 0, 0)')).toBeNull();
    expect(parseLabString('色')).toBeNull();
    expect(parseOklchString('oklch(0.5 0.1 30 0)')).toBeNull();
  });

  it('非常に長い入力でもnullを素早く返す', () => {
    const long = `cmyk(${'0,'.repeat(20000)}0)`;
    const start = Date.now();
    expect(parseCmykString(long)).toBeNull();
    expect(Date.now() - start).toBeLessThan(1000);
  });

  it('CMYKの境界値（0 と 100）は受け入れる', () => {
    expect(parseCmykString('100, 100, 100, 100')).toEqual({
      c: 100,
      m: 100,
      y: 100,
      k: 100,
    });
  });

  it('Labの境界値（L=100, a/b=±160）は受け入れ、超えるとnull', () => {
    expect(parseLabString('lab(100 160 -160)')).toEqual({
      l: 100,
      a: 160,
      b: -160,
    });
    expect(parseLabString('lab(100 160.1 0)')).toBeNull();
    expect(parseLabString('lab(100 0 -160.1)')).toBeNull();
  });

  it('OKLCHの境界値（L=1, C=0.5）は受け入れ、超えるとnull', () => {
    expect(parseOklchString('oklch(1 0.5 0)')).toEqual({
      l: 1,
      c: 0.5,
      h: 0,
    });
    expect(parseOklchString('oklch(1.01 0 0)')).toBeNull();
    expect(parseOklchString('oklch(0.5 0.5001 0)')).toBeNull();
  });

  it('OKLCHのアルファ値（/ 以降）は無視し、負の色相は0〜360に正規化する', () => {
    expect(parseOklchString('oklch(0.628 0.2577 29.23 / 50%)')).toEqual({
      l: 0.628,
      c: 0.2577,
      h: 29.23,
    });
    expect(parseOklchString('oklch(0.5 0.1 -30)')?.h).toBe(330);
  });

  it('HWBの色相が負や360超でも0〜360に正規化する', () => {
    expect(parseHwbString('hwb(-120 0% 0%)')?.h).toBe(240);
    expect(parseHwbString('hwb(720 0% 0%)')?.h).toBe(0);
  });
});

describe('変換の入力値の扱い', () => {
  it('hwbToRgbは色相の負や360超を同じ色として扱う', () => {
    expect(hwbToRgb({ h: -120, w: 0, b: 0 })).toEqual(
      hwbToRgb({ h: 240, w: 0, b: 0 }),
    );
    expect(hwbToRgb({ h: 720, w: 0, b: 0 })).toEqual(RED);
  });

  it('rgbToCmykは0〜255の範囲外の入力を範囲内に丸める', () => {
    expect(rgbToCmyk({ r: 300, g: -10, b: 255 })).toEqual(
      rgbToCmyk({ r: 255, g: 0, b: 255 }),
    );
  });
});
