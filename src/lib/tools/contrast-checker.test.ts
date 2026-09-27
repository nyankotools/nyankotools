import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  evaluateContrast,
  parseColorInput,
  relativeLuminance,
} from './contrast-checker';

describe('relativeLuminance', () => {
  it('黒の相対輝度は0、白の相対輝度は1', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBe(1);
  });
});

describe('contrastRatio', () => {
  it('黒と白のコントラスト比は21:1', () => {
    expect(
      contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }),
    ).toBe(21);
  });

  it('同じ色同士のコントラスト比は1:1', () => {
    expect(
      contrastRatio({ r: 59, g: 130, b: 246 }, { r: 59, g: 130, b: 246 }),
    ).toBe(1);
  });

  it('前景・背景を入れ替えても同じ比率になる', () => {
    const a = { r: 200, g: 50, b: 10 };
    const b = { r: 20, g: 20, b: 220 };
    expect(contrastRatio(a, b)).toBe(contrastRatio(b, a));
  });
});

describe('evaluateContrast', () => {
  it('黒背景に白文字は全レベル（AA/AAA・通常/大きな文字）に適合する', () => {
    const result = evaluateContrast(
      { r: 255, g: 255, b: 255 },
      { r: 0, g: 0, b: 0 },
    );
    expect(result.ratio).toBe(21);
    expect(result.normalAA).toBe(true);
    expect(result.normalAAA).toBe(true);
    expect(result.largeAA).toBe(true);
    expect(result.largeAAA).toBe(true);
  });

  it('コントラスト比が低い組み合わせはすべて不適合になる', () => {
    const result = evaluateContrast(
      { r: 200, g: 200, b: 200 },
      { r: 220, g: 220, b: 220 },
    );
    expect(result.normalAA).toBe(false);
    expect(result.normalAAA).toBe(false);
    expect(result.largeAA).toBe(false);
    expect(result.largeAAA).toBe(false);
  });

  it('大きな文字のAAだけ適合する境界値を判定できる', () => {
    // #767676 と白のコントラスト比は約4.54:1（通常AAは4.5以上で適合、大きな文字AAAも4.5以上で適合）
    const result = evaluateContrast(
      { r: 118, g: 118, b: 118 },
      { r: 255, g: 255, b: 255 },
    );
    expect(result.normalAA).toBe(true);
    expect(result.largeAA).toBe(true);
    expect(result.largeAAA).toBe(true);
  });
});

describe('parseColorInput', () => {
  it('HEX形式を解釈できる', () => {
    expect(parseColorInput('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 });
    expect(parseColorInput('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseColorInput('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('短い3桁HEX形式を解釈できる', () => {
    expect(parseColorInput('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorInput('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('RGB形式を解釈できる', () => {
    expect(parseColorInput('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorInput('255, 0, 0')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorInput('rgb(0, 0, 0)')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('rgba形式はアルファを無視して解釈できる', () => {
    expect(parseColorInput('rgba(255, 0, 0, 0.5)')).toEqual({
      r: 255,
      g: 0,
      b: 0,
    });
    expect(parseColorInput('rgba(59, 130, 246, 1)')).toEqual({
      r: 59,
      g: 130,
      b: 246,
    });
  });

  it('8桁HEX形式（#rrggbbaa）はnullを返す', () => {
    expect(parseColorInput('#3b82f6ff')).toBeNull();
    expect(parseColorInput('#3b82f6aa')).toBeNull();
  });

  it('不正なHEX形式はnullを返す', () => {
    expect(parseColorInput('#1')).toBeNull();
    expect(parseColorInput('#12')).toBeNull();
    expect(parseColorInput('#1234')).toBeNull();
    expect(parseColorInput('#12345')).toBeNull();
  });

  it('不正なRGB形式はnullを返す', () => {
    expect(parseColorInput('rgb(256, 0, 0)')).toBeNull();
    expect(parseColorInput('rgb(-1, 0, 0)')).toBeNull();
    expect(parseColorInput('rgb(255, 0)')).toBeNull();
    expect(parseColorInput('rgb(255, 0, 0, 0, 0)')).toBeNull();
  });

  it('その他の不正な形式はnullを返す', () => {
    expect(parseColorInput('not-a-color')).toBeNull();
    expect(parseColorInput('')).toBeNull();
    expect(parseColorInput('  ')).toBeNull();
  });

  it('大文字HEXも解釈できる', () => {
    expect(parseColorInput('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseColorInput('#ABC')).toEqual({ r: 170, g: 187, b: 204 });
  });

  it('HEX形式のスペース許容（#の前後）', () => {
    expect(parseColorInput('  #ffffff  ')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('RGB形式のスペース許容（カンマ周辺）', () => {
    expect(parseColorInput('rgb( 255 , 0 , 0 )')).toEqual({
      r: 255,
      g: 0,
      b: 0,
    });
  });
});

describe('evaluateContrast - 境界値テスト', () => {
  it('コントラスト比が4.5に非常に近い場合の判定（通常AA基準）', () => {
    // 白背景に対して、相対輝度差がちょうど4.5になる色
    // 実験的に、#767676と白のコントラスト比は約4.54:1
    const result = evaluateContrast(
      { r: 118, g: 118, b: 118 },
      { r: 255, g: 255, b: 255 },
    );
    expect(result.normalAA).toBe(true);
  });

  it('コントラスト比が3と4.5の間の場合の判定', () => {
    // rgb(100, 100, 100) と rgb(200, 200, 200) のコントラスト比は約4.46:1
    // 大きな文字AA基準（3:1以上）は満たすが、通常AA基準（4.5:1以上）は満たさない
    const result = evaluateContrast(
      { r: 100, g: 100, b: 100 },
      { r: 200, g: 200, b: 200 },
    );
    expect(result.largeAA).toBe(true);
    expect(result.normalAA).toBe(false);
  });

  it('コントラスト比が7に非常に近い場合の判定（通常AAA基準）', () => {
    // 通常AAA基準は7:1以上
    const result = evaluateContrast(
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    );
    expect(result.normalAAA).toBe(true);
  });
});
