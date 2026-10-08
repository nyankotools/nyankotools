import { describe, expect, it } from 'vitest';
import {
  generatePalette,
  harmonyTypes,
  toCssVariables,
  toJson,
} from './color-palette-generator';

describe('generatePalette', () => {
  it('補色は基準色と反対の色相', () => {
    expect(generatePalette('#ff0000', 'complementary')).toEqual([
      '#ff0000',
      '#00ffff',
    ]);
  });

  it('トライアドは120度ずつ', () => {
    expect(generatePalette('#ff0000', 'triadic')).toEqual([
      '#ff0000',
      '#00ff00',
      '#0000ff',
    ]);
  });

  it('類似色は基準色を中央に含む3色', () => {
    const p = generatePalette('#ff0000', 'analogous')!;
    expect(p).toHaveLength(3);
    expect(p[1]).toBe('#ff0000');
    expect(p[0]).toBe('#ff0080');
    expect(p[2]).toBe('#ff8000');
  });

  it('分裂補色・テトラード・スクエアの色数', () => {
    expect(generatePalette('#3b82f6', 'split-complementary')).toHaveLength(3);
    expect(generatePalette('#3b82f6', 'tetradic')).toHaveLength(4);
    expect(generatePalette('#3b82f6', 'square')).toHaveLength(4);
  });

  it('モノクロマティックは5色で色相が同じ', () => {
    const p = generatePalette('#3b82f6', 'monochromatic')!;
    expect(p).toHaveLength(5);
    expect(new Set(p).size).toBe(5);
  });

  it('3桁HEX・大文字・#なしを正規化する', () => {
    expect(generatePalette('F00', 'complementary')![0]).toBe('#ff0000');
  });

  it('不正なHEXはnull', () => {
    expect(generatePalette('zzz', 'triadic')).toBeNull();
    expect(generatePalette('', 'triadic')).toBeNull();
  });

  it('グレー（彩度0）でも落ちない', () => {
    expect(generatePalette('#808080', 'triadic')).toEqual([
      '#808080',
      '#808080',
      '#808080',
    ]);
  });

  it('全種類で結果が有効なHEX', () => {
    for (const type of harmonyTypes) {
      for (const c of generatePalette('#12ab9c', type)!) {
        expect(c).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });
});

describe('書き出し', () => {
  it('CSS変数形式', () => {
    expect(toCssVariables(['#ff0000', '#00ffff'])).toBe(
      ':root {\n  --color-1: #ff0000;\n  --color-2: #00ffff;\n}',
    );
  });

  it('JSON形式', () => {
    expect(JSON.parse(toJson(['#ff0000', '#00ffff']))).toEqual([
      '#ff0000',
      '#00ffff',
    ]);
  });
});
