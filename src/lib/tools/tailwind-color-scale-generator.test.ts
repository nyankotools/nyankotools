import { describe, expect, it } from 'vitest';
import {
  generateScale,
  sanitizeName,
  scaleSteps,
  toCssVariables,
  toTailwindConfig,
  toTailwindTheme,
} from './tailwind-color-scale-generator';

describe('generateScale', () => {
  it('11段階を返し、明度は50から950へ単調に下がる', () => {
    const scale = generateScale('#3b82f6', false)!;
    expect(scale.entries.map((e) => e.step)).toEqual([...scaleSteps]);
    expect(scale.entries).toHaveLength(11);
    expect(scale.baseStep).toBeNull();
    expect(scale.entries[0].hex).toBe('#f0f6fe');
    const lum = scale.entries.map((e) => {
      const n = parseInt(e.hex.slice(1), 16);
      return (n >> 16) + ((n >> 8) & 255) + (n & 255);
    });
    for (let i = 1; i < lum.length; i++)
      expect(lum[i]).toBeLessThan(lum[i - 1]);
  });

  it('keepBase で最も近い段に基準色をそのまま置く', () => {
    const scale = generateScale('#3B82F6')!;
    // 明度 60% → 400(64) が最も近い
    expect(scale.baseStep).toBe(400);
    expect(scale.entries.find((e) => e.step === 400)!.hex).toBe('#3b82f6');
  });

  it('3桁HEXやシャープ無しも受け付ける', () => {
    expect(generateScale('f00')!.entries).toHaveLength(11);
  });

  it('不正なHEXはnull', () => {
    expect(generateScale('xyz')).toBeNull();
    expect(generateScale('')).toBeNull();
  });

  it('グレーは全段グレーのまま', () => {
    const scale = generateScale('#808080', false)!;
    for (const e of scale.entries) {
      expect(e.hex.slice(1, 3)).toBe(e.hex.slice(3, 5));
      expect(e.hex.slice(3, 5)).toBe(e.hex.slice(5, 7));
    }
  });

  it('白・黒でも11段階が壊れない', () => {
    expect(generateScale('#ffffff')!.baseStep).toBe(50);
    expect(generateScale('#000000')!.baseStep).toBe(950);
  });
});

describe('sanitizeName', () => {
  it('整形する', () => {
    expect(sanitizeName(' My Brand!! ')).toBe('my-brand');
    expect(sanitizeName('日本語')).toBe('brand');
    expect(sanitizeName('')).toBe('brand');
  });
});

describe('出力形式', () => {
  const entries = generateScale('#3b82f6', false)!.entries;
  it('CSS変数', () => {
    const css = toCssVariables(entries, 'primary');
    expect(css.startsWith(':root {')).toBe(true);
    expect(css).toContain('--primary-50: #f0f6fe;');
    expect(css).toContain('--primary-950:');
  });
  it('Tailwind v4 @theme', () => {
    expect(toTailwindTheme(entries, 'brand')).toContain('--color-brand-500:');
  });
  it('Tailwind config', () => {
    const cfg = toTailwindConfig(entries, 'brand');
    expect(cfg).toContain('brand: {');
    expect(cfg).toContain("50: '#f0f6fe',");
    expect(toTailwindConfig(entries, 'my-blue')).toContain("'my-blue': {");
  });
});
