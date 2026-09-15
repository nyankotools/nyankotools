import { describe, expect, it } from 'vitest';
import {
  formatHsl,
  formatRgb,
  hexToRgb,
  hslToRgb,
  normalizeHex,
  parseHslString,
  parseRgbString,
  rgbToHex,
  rgbToHsl,
} from './color-converter';

describe('normalizeHex', () => {
  it('3桁HEXを6桁に展開する', () => {
    expect(normalizeHex('#f00')).toBe('#ff0000');
    expect(normalizeHex('0f0')).toBe('#00ff00');
  });

  it('6桁HEXをそのまま小文字化する', () => {
    expect(normalizeHex('#3B82F6')).toBe('#3b82f6');
  });

  it('不正な形式はnullを返す', () => {
    expect(normalizeHex('')).toBeNull();
    expect(normalizeHex('#12345')).toBeNull();
    expect(normalizeHex('xyz')).toBeNull();
  });
});

describe('hexToRgb / rgbToHex', () => {
  it('HEXをRGBに変換できる', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 });
  });

  it('RGBをHEXに変換できる', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
    expect(rgbToHex({ r: 59, g: 130, b: 246 })).toBe('#3b82f6');
  });

  it('不正なHEXはnullを返す', () => {
    expect(hexToRgb('not-a-color')).toBeNull();
  });
});

describe('rgbToHsl / hslToRgb', () => {
  it('赤をHSLに変換できる', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('白・黒・グレーをHSLに変換できる', () => {
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({
      h: 0,
      s: 0,
      l: 100,
    });
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 });
    expect(rgbToHsl({ r: 128, g: 128, b: 128 })).toEqual({
      h: 0,
      s: 0,
      l: 50,
    });
  });

  it('HSLをRGBに変換できる（往復変換で一致する）', () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({
      r: 0,
      g: 255,
      b: 0,
    });
    expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({
      r: 0,
      g: 0,
      b: 255,
    });
  });
});

describe('parseRgbString', () => {
  it('rgb()形式を解釈できる', () => {
    expect(parseRgbString('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('rgba()形式のアルファ値は無視して解釈できる', () => {
    expect(parseRgbString('rgba(255, 0, 0, 0.5)')).toEqual({
      r: 255,
      g: 0,
      b: 0,
    });
  });

  it('カンマ区切りの数値だけでも解釈できる', () => {
    expect(parseRgbString('59, 130, 246')).toEqual({ r: 59, g: 130, b: 246 });
  });

  it('範囲外や不正な値はnullを返す', () => {
    expect(parseRgbString('rgb(300, 0, 0)')).toBeNull();
    expect(parseRgbString('not a color')).toBeNull();
  });
});

describe('parseHslString', () => {
  it('hsl()形式を解釈できる', () => {
    expect(parseHslString('hsl(0, 100%, 50%)')).toEqual({
      h: 0,
      s: 100,
      l: 50,
    });
  });

  it('hsla()形式のアルファ値は無視して解釈できる', () => {
    expect(parseHslString('hsla(120, 100%, 50%, 0.5)')).toEqual({
      h: 120,
      s: 100,
      l: 50,
    });
  });

  it('範囲外や不正な値はnullを返す', () => {
    expect(parseHslString('hsl(0, 150%, 50%)')).toBeNull();
    expect(parseHslString('not a color')).toBeNull();
  });
});

describe('formatRgb / formatHsl', () => {
  it('RGB/HSLを表示用文字列に整形する', () => {
    expect(formatRgb({ r: 255, g: 0, b: 0 })).toBe('rgb(255, 0, 0)');
    expect(formatHsl({ h: 0, s: 100, l: 50 })).toBe('hsl(0, 100%, 50%)');
  });
});
