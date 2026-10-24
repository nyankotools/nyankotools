import { describe, expect, it } from 'vitest';
import {
  MAX_STEPS,
  generateSteps,
  mixColors,
  toCssVariables,
  toHexList,
} from './color-mixer';

describe('mixColors', () => {
  it('RGBで50%混合すると中間値になる', () => {
    expect(mixColors('#ff0000', '#0000ff', 0.5)).toBe('#800080');
  });

  it('割合0と1は端の色そのもの', () => {
    expect(mixColors('#336699', '#ffcc00', 0)).toBe('#336699');
    expect(mixColors('#336699', '#ffcc00', 1)).toBe('#ffcc00');
  });

  it('OKLabでも両端は一致する', () => {
    expect(mixColors('#336699', '#ffcc00', 0, 'oklab')).toBe('#336699');
    expect(mixColors('#336699', '#ffcc00', 1, 'oklab')).toBe('#ffcc00');
  });

  it('黒と白のOKLab中間はRGB中間より暗い', () => {
    const rgb = mixColors('#000000', '#ffffff', 0.5, 'rgb')!;
    const ok = mixColors('#000000', '#ffffff', 0.5, 'oklab')!;
    expect(rgb).toBe('#808080');
    expect(parseInt(ok.slice(1, 3), 16)).toBeLessThan(0x80);
    // グレーのまま
    expect(ok.slice(1, 3)).toBe(ok.slice(3, 5));
  });

  it('範囲外の割合は丸める', () => {
    expect(mixColors('#000000', '#ffffff', 2)).toBe('#ffffff');
    expect(mixColors('#000000', '#ffffff', -1)).toBe('#000000');
  });

  it('3桁HEXやシャープなしも受け付ける', () => {
    expect(mixColors('f00', '#00f', 0.5)).toBe('#800080');
  });

  it('大文字・前後の空白のあるHEXも受け付ける', () => {
    expect(mixColors('  #FF0000 ', '0000FF', 0.5)).toBe('#800080');
  });

  it('不正な入力は null', () => {
    expect(mixColors('xyz', '#ffffff', 0.5)).toBeNull();
    expect(mixColors('#000000', '', 0.5)).toBeNull();
    expect(mixColors('#000000', '#ffffff', NaN)).toBeNull();
  });
});

describe('generateSteps', () => {
  it('両端を含めて指定数を返す', () => {
    const steps = generateSteps('#000000', '#ffffff', 5)!;
    expect(steps).toHaveLength(5);
    expect(steps[0]).toBe('#000000');
    expect(steps[4]).toBe('#ffffff');
    expect(steps[2]).toBe('#808080');
  });

  it('2段なら両端のみ', () => {
    expect(generateSteps('#ff0000', '#0000ff', 2)).toEqual([
      '#ff0000',
      '#0000ff',
    ]);
  });

  it('段数は範囲に丸める', () => {
    expect(generateSteps('#000000', '#ffffff', 1)).toHaveLength(2);
    expect(generateSteps('#000000', '#ffffff', 100)).toHaveLength(MAX_STEPS);
  });

  it('OKLabの段も両端が一致する', () => {
    const steps = generateSteps('#ff0000', '#0000ff', 7, 'oklab')!;
    expect(steps[0]).toBe('#ff0000');
    expect(steps[6]).toBe('#0000ff');
  });

  it('不正な入力は null', () => {
    expect(generateSteps('xyz', '#ffffff', 5)).toBeNull();
    expect(generateSteps('#000000', '#ffffff', NaN)).toBeNull();
  });
});

describe('書き出し', () => {
  it('CSS変数', () => {
    expect(toCssVariables(['#000000', '#ffffff'])).toBe(
      ':root {\n  --color-1: #000000;\n  --color-2: #ffffff;\n}',
    );
  });

  it('HEX一覧', () => {
    expect(toHexList(['#000000', '#ffffff'])).toBe('#000000, #ffffff');
  });
});
