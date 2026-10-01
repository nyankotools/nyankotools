import { describe, it, expect } from 'vitest';
import {
  convert,
  convertAll,
  formatNumber,
  getUnits,
  unitCategories,
} from './unit-converter';

describe('convert', () => {
  it('長さ: 1 mi = 1609.344 m、1 ft = 12 in', () => {
    expect(convert('length', 'mi', 'm', 1)).toBeCloseTo(1609.344, 6);
    expect(convert('length', 'ft', 'in', 1)).toBeCloseTo(12, 9);
  });

  it('長さ: 尺・寸・間（1尺=10/33m、10寸=1尺、1間=6尺）', () => {
    expect(convert('length', 'shaku', 'sun', 1)).toBeCloseTo(10, 9);
    expect(convert('length', 'ken', 'shaku', 1)).toBeCloseTo(6, 9);
    expect(convert('length', 'shaku', 'cm', 1)).toBeCloseTo(30.303, 3);
  });

  it('質量: 1 lb = 453.59237 g、1貫 = 3.75 kg = 1000匁', () => {
    expect(convert('mass', 'lb', 'g', 1)).toBeCloseTo(453.59237, 6);
    expect(convert('mass', 'kan', 'kg', 1)).toBeCloseTo(3.75, 9);
    expect(convert('mass', 'kan', 'monme', 1)).toBeCloseTo(1000, 9);
  });

  it('面積: 1坪 ≈ 3.3058 m²、1 ha = 10000 m²、1 acre ≈ 4046.86 m²', () => {
    expect(convert('area', 'tsubo', 'm2', 1)).toBeCloseTo(3.305785, 5);
    expect(convert('area', 'ha', 'm2', 1)).toBe(10000);
    expect(convert('area', 'acre', 'm2', 1)).toBeCloseTo(4046.856, 3);
  });

  it('体積: 1 L = 1000 mL、1合 ≈ 180.39 mL、10合 = 1升', () => {
    expect(convert('volume', 'l', 'ml', 1)).toBe(1000);
    expect(convert('volume', 'go', 'ml', 1)).toBeCloseTo(180.39, 9);
    expect(convert('volume', 'sho', 'go', 1)).toBeCloseTo(10, 9);
  });

  it('データ容量: 1 KB = 1000 B、1 KiB = 1024 B、1 B = 8 bit', () => {
    expect(convert('data', 'KB', 'B', 1)).toBe(1000);
    expect(convert('data', 'KiB', 'B', 1)).toBe(1024);
    expect(convert('data', 'B', 'bit', 1)).toBe(8);
    expect(convert('data', 'GiB', 'MiB', 1)).toBe(1024);
  });

  it('温度: 0℃=32°F=273.15K、100℃=212°F', () => {
    expect(convert('temperature', 'c', 'f', 0)).toBe(32);
    expect(convert('temperature', 'c', 'k', 0)).toBeCloseTo(273.15, 9);
    expect(convert('temperature', 'c', 'f', 100)).toBe(212);
    expect(convert('temperature', 'f', 'c', -40)).toBeCloseTo(-40, 9);
  });

  it('負の値・0 も変換できる', () => {
    expect(convert('length', 'm', 'cm', -2)).toBe(-200);
    expect(convert('length', 'm', 'cm', 0)).toBe(0);
  });

  it('絶対零度を下回る温度は null', () => {
    expect(convert('temperature', 'c', 'k', -300)).toBeNull();
    expect(convert('temperature', 'k', 'c', -1)).toBeNull();
    expect(convert('temperature', 'k', 'c', 0)).toBeCloseTo(-273.15, 9);
  });

  it('NaN・Infinity・未知の単位・別カテゴリの単位は null', () => {
    expect(convert('length', 'm', 'cm', NaN)).toBeNull();
    expect(convert('length', 'm', 'cm', Infinity)).toBeNull();
    expect(convert('length', 'm', 'xx', 1)).toBeNull();
    expect(convert('length', 'm', 'kg', 1)).toBeNull();
  });

  it('結果がオーバーフローする場合は null', () => {
    expect(convert('length', 'km', 'mm', 1e308)).toBeNull();
  });
});

describe('convertAll', () => {
  it('入力単位以外の全単位が返る', () => {
    for (const category of unitCategories) {
      const units = getUnits(category);
      const rows = convertAll(category, units[0], 1);
      expect(rows.map((r) => r.unit)).toEqual(units.slice(1));
    }
  });
});

describe('formatNumber', () => {
  it('浮動小数点の誤差を丸める', () => {
    expect(formatNumber(0.1 + 0.2, 'en-US')).toBe('0.3');
  });

  it('0 は "0"', () => {
    expect(formatNumber(0, 'en-US')).toBe('0');
  });

  it('ロケールに応じて桁区切りされる', () => {
    expect(formatNumber(1234.5, 'en-US')).toBe('1,234.5');
  });

  it('極端に大きい・小さい値は指数表記', () => {
    expect(formatNumber(1.5e20, 'en-US')).toBe('1.5×10^20');
    expect(formatNumber(2.5e-9, 'en-US')).toBe('2.5×10^-9');
  });
});
