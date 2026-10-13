import { describe, expect, it } from 'vitest';
import {
  buildGlassCss,
  buildGlassDeclarations,
  buildNeuCss,
  buildNeuDeclarations,
  clampGlass,
  clampNeu,
  DEFAULT_NEU,
  GLASS_BACKGROUND_IDS,
  GLASS_BACKGROUNDS,
  GLASS_PRESET_IDS,
  GLASS_PRESETS,
  hexToRgb,
  normalizeHex,
  rgba,
  shade,
} from './css-glassmorphism-generator';

describe('normalizeHex / hexToRgb', () => {
  it('3桁を6桁に展開し、小文字に揃える', () => {
    expect(normalizeHex('#ABC', '#000000')).toBe('#aabbcc');
    expect(normalizeHex('E0E5EC', '#000000')).toBe('#e0e5ec');
  });

  it('不正値はフォールバックする', () => {
    expect(normalizeHex('red', '#123456')).toBe('#123456');
    expect(normalizeHex('', '#123456')).toBe('#123456');
  });

  it('RGBに変換する', () => {
    expect(hexToRgb('#ff8000')).toEqual([255, 128, 0]);
  });
});

describe('shade', () => {
  it('正の値は白へ、負の値は黒へ近づける', () => {
    expect(shade('#000000', 0.5)).toBe('#808080');
    expect(shade('#ffffff', -0.5)).toBe('#808080');
  });

  it('0は変化なし、範囲外はクランプ', () => {
    expect(shade('#336699', 0)).toBe('#336699');
    expect(shade('#336699', 5)).toBe('#ffffff');
    expect(shade('#336699', -5)).toBe('#000000');
  });
});

describe('rgba', () => {
  it('パーセントを小数のアルファに変換する', () => {
    expect(rgba('#ffffff', 25)).toBe('rgba(255, 255, 255, 0.25)');
    expect(rgba('#000000', 100)).toBe('rgba(0, 0, 0, 1)');
    expect(rgba('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
  });
});

describe('buildGlassCss', () => {
  it('lightプリセットの出力が期待通り', () => {
    expect(buildGlassDeclarations(GLASS_PRESETS.light)).toEqual([
      'background: rgba(255, 255, 255, 0.25);',
      'backdrop-filter: blur(10px) saturate(150%);',
      '-webkit-backdrop-filter: blur(10px) saturate(150%);',
      'border: 1px solid rgba(255, 255, 255, 0.3);',
      'border-radius: 16px;',
      'box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);',
    ]);
  });

  it('範囲外・非有限の値をクランプする', () => {
    const c = clampGlass({
      color: 'nope',
      opacity: 500,
      blur: -3,
      saturate: 10,
      borderOpacity: Number.NaN,
      radius: 999,
      shadowOpacity: 50.6,
    });
    expect(c).toEqual({
      color: '#ffffff',
      opacity: 100,
      blur: 0,
      saturate: 100,
      borderOpacity: 0,
      radius: 100,
      shadowOpacity: 51,
    });
  });

  it('改行区切りで連結する', () => {
    expect(buildGlassCss(GLASS_PRESETS.dark).split('\n')).toHaveLength(6);
  });

  it('全プリセットと背景が定義されている', () => {
    for (const id of GLASS_PRESET_IDS) expect(GLASS_PRESETS[id]).toBeDefined();
    for (const id of GLASS_BACKGROUND_IDS) {
      expect(GLASS_BACKGROUNDS[id]).toMatch(/^linear-gradient\(/);
    }
  });
});

describe('buildNeuCss', () => {
  it('flatは単色背景と2層の影（左上光源）', () => {
    expect(buildNeuDeclarations(DEFAULT_NEU)).toEqual([
      'background: #e0e5ec;',
      'border-radius: 24px;',
      `box-shadow: 10px 10px 20px ${shade('#e0e5ec', -0.15)}, -10px -10px 20px ${shade('#e0e5ec', 0.15)};`,
    ]);
  });

  it('光源が右下だと影の向きが反転する', () => {
    const css = buildNeuCss({ ...DEFAULT_NEU, light: 'bottom-right' });
    expect(css).toContain('box-shadow: -10px -10px 20px');
    expect(css).toContain(', 10px 10px 20px');
  });

  it('pressedは両方の影にinsetが付く', () => {
    const css = buildNeuCss({ ...DEFAULT_NEU, shape: 'pressed' });
    expect(css).toMatch(
      /box-shadow: inset 10px 10px 20px #[0-9a-f]{6}, inset -10px -10px 20px #[0-9a-f]{6};/,
    );
  });

  it('concave/convexはグラデーション背景で向きが逆', () => {
    const concave = buildNeuDeclarations({
      ...DEFAULT_NEU,
      shape: 'concave',
    })[0];
    const convex = buildNeuDeclarations({ ...DEFAULT_NEU, shape: 'convex' })[0];
    expect(concave).toMatch(/^background: linear-gradient\(145deg, /);
    expect(convex).toMatch(/^background: linear-gradient\(145deg, /);
    expect(concave).not.toBe(convex);
    const [cA, cB] = concave.match(/#[0-9a-f]{6}/g)!;
    const [vA, vB] = convex.match(/#[0-9a-f]{6}/g)!;
    expect([cA, cB]).toEqual([vB, vA]);
  });

  it('範囲外・不正な値をクランプする', () => {
    const c = clampNeu({
      color: 'zzz',
      shape: 'weird' as never,
      light: 'x' as never,
      distance: 0,
      blur: 500,
      intensity: 99,
      radius: -5,
    });
    expect(c).toEqual({
      color: DEFAULT_NEU.color,
      shape: 'flat',
      light: 'top-left',
      distance: 1,
      blur: 100,
      intensity: 40,
      radius: 0,
    });
  });
});
