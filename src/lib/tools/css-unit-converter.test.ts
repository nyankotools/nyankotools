import { describe, expect, it } from 'vitest';
import {
  CSS_UNITS,
  DEFAULT_CONTEXT,
  convert,
  convertAll,
  isCssUnit,
  parseNumber,
  parsePositive,
} from './css-unit-converter';

const ctx = DEFAULT_CONTEXT;

describe('parseNumber / parsePositive', () => {
  it('数値を受け付ける', () => {
    expect(parseNumber(' 12.5 ')).toBe(12.5);
    expect(parseNumber('.5')).toBe(0.5);
    expect(parseNumber('-3')).toBe(-3);
  });
  it('不正値はnull', () => {
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('1e3')).toBeNull();
  });
  it('0以下はnull', () => {
    expect(parsePositive('0')).toBeNull();
    expect(parsePositive('-1')).toBeNull();
    expect(parsePositive('1')).toBe(1);
  });
  it('境界: 空白のみ・符号のみ・末尾ドット・0 の扱い', () => {
    expect(parseNumber('   ')).toBeNull();
    expect(parseNumber('+')).toBeNull();
    expect(parseNumber('5.')).toBe(5);
    expect(parseNumber('+5')).toBe(5);
    expect(parseNumber('0')).toBe(0);
    expect(parseNumber('-0')).toBe(-0);
  });
  it('境界: 全角数字・全角ドット・単位付きは不正', () => {
    expect(parseNumber('１６')).toBeNull();
    expect(parseNumber('1．5')).toBeNull();
    expect(parseNumber('16px')).toBeNull();
    expect(parseNumber('１６px')).toBeNull();
  });
  it('境界: 非常に大きい値は有限数として受け付ける', () => {
    expect(parseNumber('100000000000000000000')).toBe(1e20);
    expect(parseNumber('1' + '0'.repeat(400))).toBeNull();
  });
});

describe('convert', () => {
  it('px⇔rem', () => {
    expect(convert(24, 'px', 'rem', ctx)).toBe(1.5);
    expect(convert(1.5, 'rem', 'px', ctx)).toBe(24);
  });
  it('remとemは基準が別', () => {
    const c = { ...ctx, rootFontSize: 10, parentFontSize: 20 };
    expect(convert(2, 'rem', 'px', c)).toBe(20);
    expect(convert(2, 'em', 'px', c)).toBe(40);
    expect(convert(50, '%', 'px', c)).toBe(10);
  });
  it('vw / vh / vmin / vmax', () => {
    expect(convert(10, 'vw', 'px', ctx)).toBe(192);
    expect(convert(10, 'vh', 'px', ctx)).toBe(108);
    expect(convert(10, 'vmin', 'px', ctx)).toBe(108);
    expect(convert(10, 'vmax', 'px', ctx)).toBe(192);
    expect(convert(960, 'px', 'vw', ctx)).toBe(50);
  });
  it('絶対単位', () => {
    expect(convert(1, 'in', 'px', ctx)).toBe(96);
    expect(convert(12, 'pt', 'px', ctx)).toBe(16);
    expect(convert(1, 'pc', 'px', ctx)).toBe(16);
    expect(convert(2.54, 'cm', 'px', ctx)).toBe(96);
    expect(convert(25.4, 'mm', 'px', ctx)).toBe(96);
    expect(convert(72, 'pt', 'in', ctx)).toBe(1);
  });
  it('chは親font-sizeの0.5倍で近似', () => {
    expect(convert(10, 'ch', 'px', ctx)).toBe(80);
  });
  it('丸めと-0の正規化', () => {
    expect(convert(10, 'px', 'rem', { ...ctx, rootFontSize: 3 })).toBe(3.33333);
    expect(Object.is(convert(-0.000001, 'px', 'rem', ctx), 0)).toBe(true);
  });
  it('負の値も換算する', () => {
    expect(convert(-16, 'px', 'rem', ctx)).toBe(-1);
  });
  it('境界: 0 は全単位で 0', () => {
    for (const unit of CSS_UNITS) {
      expect(convert(0, unit, 'px', ctx)).toBe(0);
      expect(convert(0, 'px', unit, ctx)).toBe(0);
    }
  });
  it('境界: 縦長ビューポートでは vmin と vmax が入れ替わる', () => {
    const portrait = { ...ctx, viewportWidth: 390, viewportHeight: 844 };
    expect(convert(10, 'vmin', 'px', portrait)).toBe(39);
    expect(convert(10, 'vmax', 'px', portrait)).toBe(84.4);
    expect(convert(10, 'vw', 'px', portrait)).toBe(39);
  });
  it('境界: % は親 font-size 基準で換算する', () => {
    const c = { ...ctx, parentFontSize: 20 };
    expect(convert(100, '%', 'px', c)).toBe(20);
    expect(convert(20, 'px', '%', c)).toBe(100);
  });
  it('境界: 非常に小さい値は丸めで 0 になる', () => {
    expect(convert(0.000001, 'px', 'rem', ctx)).toBe(0);
  });
});

describe('convertAll', () => {
  it('全単位を返し、入力単位自身は入力値と一致する', () => {
    const results = convertAll(16, 'px', ctx);
    expect(results.map((r) => r.unit)).toEqual([...CSS_UNITS]);
    expect(results.find((r) => r.unit === 'px')?.value).toBe(16);
    expect(results.find((r) => r.unit === 'rem')?.value).toBe(1);
    expect(results.find((r) => r.unit === 'pt')?.value).toBe(12);
  });
});

describe('isCssUnit', () => {
  it('判定する', () => {
    expect(isCssUnit('vw')).toBe(true);
    expect(isCssUnit('foo')).toBe(false);
  });
});
