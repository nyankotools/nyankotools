import { describe, expect, it } from 'vitest';
import {
  buildBoxShadowValue,
  buildCssDeclaration,
  clampBlur,
  clampOffset,
  clampSpread,
  suggestNewShadow,
  type BoxShadowLayer,
} from './css-box-shadow-generator';

describe('clampOffset', () => {
  it('-200〜200の範囲内はそのまま（四捨五入）', () => {
    expect(clampOffset(4.4)).toBe(4);
    expect(clampOffset(4.6)).toBe(5);
    expect(clampOffset(-50)).toBe(-50);
  });

  it('範囲外は-200または200に丸める', () => {
    expect(clampOffset(-500)).toBe(-200);
    expect(clampOffset(500)).toBe(200);
  });
});

describe('clampBlur', () => {
  it('0〜200の範囲内はそのまま', () => {
    expect(clampBlur(8)).toBe(8);
    expect(clampBlur(0)).toBe(0);
  });

  it('負の値は0に、200を超える値は200に丸める', () => {
    expect(clampBlur(-10)).toBe(0);
    expect(clampBlur(300)).toBe(200);
  });
});

describe('clampSpread', () => {
  it('-200〜200の範囲内はそのまま', () => {
    expect(clampSpread(-10)).toBe(-10);
    expect(clampSpread(10)).toBe(10);
  });

  it('範囲外は-200または200に丸める', () => {
    expect(clampSpread(-500)).toBe(-200);
    expect(clampSpread(500)).toBe(200);
  });
});

describe('suggestNewShadow', () => {
  it('既存レイヤー数が0のとき、控えめなオフセット・ぼかしを提案する', () => {
    expect(suggestNewShadow(0)).toEqual({
      offsetX: 0,
      offsetY: 4,
      blur: 8,
      spread: 0,
      color: '#000000',
      inset: false,
    });
  });

  it('既存レイヤー数に応じてオフセット・ぼかしが段階的に広がる', () => {
    const second = suggestNewShadow(1);
    expect(second.offsetY).toBe(8);
    expect(second.blur).toBe(12);
    expect(second.color).toBe('#3b82f6');
  });

  it('色は既定パレットを順にループする', () => {
    expect(suggestNewShadow(6).color).toBe('#000000');
  });
});

describe('buildBoxShadowValue', () => {
  it('1レイヤーを`offsetX offsetY blur spread color`形式で出力する', () => {
    const layers: BoxShadowLayer[] = [
      {
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        spread: 0,
        color: '#000000',
        inset: false,
      },
    ];
    expect(buildBoxShadowValue(layers)).toBe('0px 4px 8px 0px #000000');
  });

  it('insetがtrueの場合は先頭に`inset`を付与する', () => {
    const layers: BoxShadowLayer[] = [
      {
        offsetX: 0,
        offsetY: 2,
        blur: 4,
        spread: 0,
        color: '#111111',
        inset: true,
      },
    ];
    expect(buildBoxShadowValue(layers)).toBe('inset 0px 2px 4px 0px #111111');
  });

  it('複数レイヤーはカンマ区切りで連結する', () => {
    const layers: BoxShadowLayer[] = [
      {
        offsetX: 0,
        offsetY: 1,
        blur: 2,
        spread: 0,
        color: '#aaaaaa',
        inset: false,
      },
      {
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        spread: 0,
        color: '#bbbbbb',
        inset: false,
      },
    ];
    expect(buildBoxShadowValue(layers)).toBe(
      '0px 1px 2px 0px #aaaaaa, 0px 4px 8px 0px #bbbbbb',
    );
  });

  it('範囲外の数値は出力時にクランプされる', () => {
    const layers: BoxShadowLayer[] = [
      {
        offsetX: 999,
        offsetY: -999,
        blur: -10,
        spread: 999,
        color: '#000000',
        inset: false,
      },
    ];
    expect(buildBoxShadowValue(layers)).toBe('200px -200px 0px 200px #000000');
  });
});

describe('buildCssDeclaration', () => {
  it('`box-shadow: ...;`の形で出力する', () => {
    const layers: BoxShadowLayer[] = [
      {
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        spread: 0,
        color: '#000000',
        inset: false,
      },
    ];
    expect(buildCssDeclaration(layers)).toBe(
      'box-shadow: 0px 4px 8px 0px #000000;',
    );
  });
});
