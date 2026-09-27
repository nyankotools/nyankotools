import { describe, expect, it } from 'vitest';
import {
  buildBorderRadiusValue,
  buildCssDeclaration,
  clampRadius,
  type BorderRadiusCorners,
} from './css-border-radius-generator';

describe('clampRadius', () => {
  it('pxは0〜500の範囲内はそのまま（四捨五入）', () => {
    expect(clampRadius(8.4, 'px')).toBe(8);
    expect(clampRadius(8.6, 'px')).toBe(9);
    expect(clampRadius(0, 'px')).toBe(0);
  });

  it('pxの範囲外は0または500に丸める', () => {
    expect(clampRadius(-10, 'px')).toBe(0);
    expect(clampRadius(1000, 'px')).toBe(500);
  });

  it('%は0〜50の範囲内はそのまま', () => {
    expect(clampRadius(25, '%')).toBe(25);
  });

  it('%の範囲外は0または50に丸める', () => {
    expect(clampRadius(-5, '%')).toBe(0);
    expect(clampRadius(100, '%')).toBe(50);
  });
});

describe('buildBorderRadiusValue', () => {
  it('4隅がすべて同じ場合は単一値に短縮する', () => {
    const corners: BorderRadiusCorners = {
      topLeft: 8,
      topRight: 8,
      bottomRight: 8,
      bottomLeft: 8,
    };
    expect(buildBorderRadiusValue(corners, 'px')).toBe('8px');
  });

  it('4隅が異なる場合は`top-left top-right bottom-right bottom-left`の順で出力する', () => {
    const corners: BorderRadiusCorners = {
      topLeft: 4,
      topRight: 8,
      bottomRight: 16,
      bottomLeft: 32,
    };
    expect(buildBorderRadiusValue(corners, 'px')).toBe('4px 8px 16px 32px');
  });

  it('%単位でも同様に出力する', () => {
    const corners: BorderRadiusCorners = {
      topLeft: 50,
      topRight: 50,
      bottomRight: 50,
      bottomLeft: 50,
    };
    expect(buildBorderRadiusValue(corners, '%')).toBe('50%');
  });

  it('範囲外の数値は出力時にクランプされる', () => {
    const corners: BorderRadiusCorners = {
      topLeft: -10,
      topRight: 1000,
      bottomRight: 8,
      bottomLeft: 8,
    };
    expect(buildBorderRadiusValue(corners, 'px')).toBe('0px 500px 8px 8px');
  });

  it('クランプ後に4隅が一致する場合も単一値に短縮する', () => {
    const corners: BorderRadiusCorners = {
      topLeft: 600,
      topRight: 500,
      bottomRight: 1000,
      bottomLeft: 500,
    };
    expect(buildBorderRadiusValue(corners, 'px')).toBe('500px');
  });
});

describe('buildCssDeclaration', () => {
  it('`border-radius: ...;`の形で出力する', () => {
    const corners: BorderRadiusCorners = {
      topLeft: 8,
      topRight: 8,
      bottomRight: 8,
      bottomLeft: 8,
    };
    expect(buildCssDeclaration(corners, 'px')).toBe('border-radius: 8px;');
  });

  it('4隅が異なる場合もそのまま宣言に含める', () => {
    const corners: BorderRadiusCorners = {
      topLeft: 4,
      topRight: 0,
      bottomRight: 4,
      bottomLeft: 0,
    };
    expect(buildCssDeclaration(corners, 'px')).toBe(
      'border-radius: 4px 0px 4px 0px;',
    );
  });
});

describe('clampRadius edge cases', () => {
  it('小数点値を四捨五入する（複数パターン）', () => {
    expect(clampRadius(0.4, 'px')).toBe(0);
    expect(clampRadius(0.5, 'px')).toBe(1);
    expect(clampRadius(1.5, 'px')).toBe(2);
    expect(clampRadius(2.4, 'px')).toBe(2);
    expect(clampRadius(2.5, 'px')).toBe(3);
    expect(clampRadius(2.6, 'px')).toBe(3);
    expect(clampRadius(499.4, 'px')).toBe(499);
    expect(clampRadius(499.6, 'px')).toBe(500);
  });

  it('非常に大きい負の値は0にクランプ', () => {
    expect(clampRadius(-99999, 'px')).toBe(0);
    expect(clampRadius(-99999, '%')).toBe(0);
  });

  it('非常に大きい正の値は上限にクランプ', () => {
    expect(clampRadius(99999, 'px')).toBe(500);
    expect(clampRadius(99999, '%')).toBe(50);
  });

  it('境界値の直近値をテスト', () => {
    // px境界値の周辺
    expect(clampRadius(499, 'px')).toBe(499);
    expect(clampRadius(500, 'px')).toBe(500);
    expect(clampRadius(501, 'px')).toBe(500);
    // %境界値の周辺
    expect(clampRadius(49, '%')).toBe(49);
    expect(clampRadius(50, '%')).toBe(50);
    expect(clampRadius(51, '%')).toBe(50);
  });
});

describe('buildBorderRadiusValue edge cases', () => {
  it('ゼロ値をテスト（すべて0の場合は短縮）', () => {
    const corners: BorderRadiusCorners = {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    };
    expect(buildBorderRadiusValue(corners, 'px')).toBe('0px');
  });

  it('複数隅が範囲外で、クランプ後に一致する複雑なケース', () => {
    const corners: BorderRadiusCorners = {
      topLeft: -50,
      topRight: 0,
      bottomRight: 600,
      bottomLeft: -100,
    };
    expect(buildBorderRadiusValue(corners, 'px')).toBe('0px 0px 500px 0px');
  });

  it('%の最大値でテスト', () => {
    const corners: BorderRadiusCorners = {
      topLeft: 50,
      topRight: 50,
      bottomRight: 50,
      bottomLeft: 50,
    };
    expect(buildBorderRadiusValue(corners, '%')).toBe('50%');
  });

  it('%で異なる値の場合', () => {
    const corners: BorderRadiusCorners = {
      topLeft: 10,
      topRight: 20,
      bottomRight: 30,
      bottomLeft: 40,
    };
    expect(buildBorderRadiusValue(corners, '%')).toBe('10% 20% 30% 40%');
  });

  it('%でクランプが発生する場合', () => {
    const corners: BorderRadiusCorners = {
      topLeft: -10,
      topRight: 100,
      bottomRight: 25,
      bottomLeft: 25,
    };
    expect(buildBorderRadiusValue(corners, '%')).toBe('0% 50% 25% 25%');
  });
});
