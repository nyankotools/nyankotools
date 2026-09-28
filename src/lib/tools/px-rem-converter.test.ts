import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BASE_FONT_SIZE,
  formatNumber,
  parseBaseFontSize,
  parseNumber,
  pxToRem,
  remToPx,
} from './px-rem-converter';

describe('parseNumber', () => {
  it('整数・小数・符号付きをパースできる', () => {
    expect(parseNumber('16')).toBe(16);
    expect(parseNumber('1.5')).toBe(1.5);
    expect(parseNumber('-1.5')).toBe(-1.5);
    expect(parseNumber('+2')).toBe(2);
    expect(parseNumber('.5')).toBe(0.5);
    expect(parseNumber('1.')).toBe(1);
  });

  it('空文字・不正な形式はnull', () => {
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('   ')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('16px')).toBeNull();
    expect(parseNumber('1.2.3')).toBeNull();
  });

  it('前後の空白は無視する', () => {
    expect(parseNumber('  16  ')).toBe(16);
  });
});

describe('parseBaseFontSize', () => {
  it('正の数値はそのまま返す', () => {
    expect(parseBaseFontSize('16')).toBe(16);
    expect(parseBaseFontSize('10.5')).toBe(10.5);
  });

  it('0以下・不正な形式はnull', () => {
    expect(parseBaseFontSize('0')).toBeNull();
    expect(parseBaseFontSize('-16')).toBeNull();
    expect(parseBaseFontSize('abc')).toBeNull();
    expect(parseBaseFontSize('')).toBeNull();
  });
});

describe('pxToRem / remToPx', () => {
  it('デフォルトのベースフォントサイズ(16px)で変換できる', () => {
    expect(pxToRem(16, DEFAULT_BASE_FONT_SIZE)).toBe(1);
    expect(pxToRem(24, DEFAULT_BASE_FONT_SIZE)).toBe(1.5);
    expect(pxToRem(10, DEFAULT_BASE_FONT_SIZE)).toBe(0.625);
    expect(remToPx(1, DEFAULT_BASE_FONT_SIZE)).toBe(16);
    expect(remToPx(1.5, DEFAULT_BASE_FONT_SIZE)).toBe(24);
    expect(remToPx(0.625, DEFAULT_BASE_FONT_SIZE)).toBe(10);
  });

  it('ベースフォントサイズを変更しても変換できる', () => {
    expect(pxToRem(20, 20)).toBe(1);
    expect(remToPx(2, 20)).toBe(40);
  });

  it('負の値を扱える', () => {
    expect(pxToRem(-16, DEFAULT_BASE_FONT_SIZE)).toBe(-1);
    expect(remToPx(-1, DEFAULT_BASE_FONT_SIZE)).toBe(-16);
  });

  it('割り切れない値は小数第5位で丸める', () => {
    expect(pxToRem(10, 3)).toBe(3.33333);
  });
});

describe('formatNumber', () => {
  it('通常の数値はそのまま文字列化する', () => {
    expect(formatNumber(1.5)).toBe('1.5');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(-1)).toBe('-1');
  });

  it('-0は0として扱う', () => {
    expect(formatNumber(-0)).toBe('0');
  });
});
