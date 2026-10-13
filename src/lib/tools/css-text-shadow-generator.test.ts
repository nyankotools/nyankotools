import { describe, expect, it } from 'vitest';
import {
  buildCssDeclaration,
  buildTextShadowValue,
  clampBlur,
  clampOffset,
  getPreset,
  MAX_SHADOWS,
  normalizeColor,
  suggestNewShadow,
  TEXT_SHADOW_PRESETS,
  type TextShadowLayer,
} from './css-text-shadow-generator';

describe('clampOffset', () => {
  it('範囲内は四捨五入、範囲外は-100/100に丸める', () => {
    expect(clampOffset(2.4)).toBe(2);
    expect(clampOffset(2.6)).toBe(3);
    expect(clampOffset(-500)).toBe(-100);
    expect(clampOffset(500)).toBe(100);
  });

  it('NaN・Infinityは0として扱う', () => {
    expect(clampOffset(NaN)).toBe(0);
    expect(clampOffset(Infinity)).toBe(0);
  });
});

describe('clampBlur', () => {
  it('負の値は0、100超は100に丸める', () => {
    expect(clampBlur(-5)).toBe(0);
    expect(clampBlur(8)).toBe(8);
    expect(clampBlur(300)).toBe(100);
    expect(clampBlur(NaN)).toBe(0);
  });
});

describe('normalizeColor', () => {
  it('6桁・3桁の16進数を小文字6桁に正規化する', () => {
    expect(normalizeColor('#FF00DE')).toBe('#ff00de');
    expect(normalizeColor('#abc')).toBe('#aabbcc');
    expect(normalizeColor('  #123456 ')).toBe('#123456');
  });

  it('不正な値は黒にフォールバックする', () => {
    expect(normalizeColor('red')).toBe('#000000');
    expect(normalizeColor('')).toBe('#000000');
    expect(normalizeColor('#12345')).toBe('#000000');
  });
});

describe('suggestNewShadow', () => {
  it('既存数に応じて段階的に広がり、色は順にループする', () => {
    expect(suggestNewShadow(0)).toEqual({
      offsetX: 2,
      offsetY: 2,
      blur: 4,
      color: '#000000',
    });
    const second = suggestNewShadow(1);
    expect(second.offsetX).toBe(4);
    expect(second.blur).toBe(6);
    expect(second.color).toBe('#3b82f6');
    expect(suggestNewShadow(6).color).toBe('#000000');
  });
});

describe('buildTextShadowValue / buildCssDeclaration', () => {
  const one: TextShadowLayer = {
    offsetX: 2,
    offsetY: 2,
    blur: 4,
    color: '#000000',
  };

  it('1レイヤーを`x y blur color`形式で出力する', () => {
    expect(buildTextShadowValue([one])).toBe('2px 2px 4px #000000');
  });

  it('複数レイヤーはカンマ区切りで連結する', () => {
    expect(
      buildTextShadowValue([one, { ...one, offsetX: -3, color: '#FFF' }]),
    ).toBe('2px 2px 4px #000000, -3px 2px 4px #ffffff');
  });

  it('範囲外・不正値はクランプ／フォールバックされる', () => {
    expect(
      buildTextShadowValue([
        { offsetX: 999, offsetY: -999, blur: -1, color: 'bad' },
      ]),
    ).toBe('100px -100px 0px #000000');
  });

  it('宣言全体は`text-shadow: ...;`', () => {
    expect(buildCssDeclaration([one])).toBe(
      'text-shadow: 2px 2px 4px #000000;',
    );
  });

  it('空配列でも例外にならない', () => {
    expect(buildTextShadowValue([])).toBe('');
  });
});

describe('presets', () => {
  it('ネオン・縁取りを含む', () => {
    expect(getPreset('neon')?.layers.length).toBeGreaterThanOrEqual(3);
    expect(getPreset('outline')?.layers.length).toBe(4);
    expect(getPreset('unknown')).toBeUndefined();
  });

  it('全プリセットのレイヤー数が上限内で、色が正規形式', () => {
    for (const p of TEXT_SHADOW_PRESETS) {
      expect(p.layers.length).toBeGreaterThanOrEqual(1);
      expect(p.layers.length).toBeLessThanOrEqual(MAX_SHADOWS);
      for (const l of p.layers) {
        expect(normalizeColor(l.color)).toBe(l.color);
      }
      expect(normalizeColor(p.textColor)).toBe(p.textColor);
      expect(normalizeColor(p.backgroundColor)).toBe(p.backgroundColor);
    }
  });
});
