import { describe, it, expect } from 'vitest';
import {
  calcCorporateCheckDigit,
  calcMyNumberCheckDigit,
  checkNumber,
  normalizeNumberInput,
} from './my-number-checker';

describe('個人番号', () => {
  it('検査用数字を計算できる（123456789018）', () => {
    expect(calcMyNumberCheckDigit('12345678901')).toBe(8);
  });

  it('余りが0・1のときは検査用数字が0', () => {
    expect(calcMyNumberCheckDigit('00000000000')).toBe(0);
  });

  it('正しい番号を検証できる', () => {
    expect(checkNumber('123456789018', 'myNumber')).toEqual({
      kind: 'verified',
      valid: true,
      digits: '123456789018',
      actualCheckDigit: 8,
      expectedCheckDigit: 8,
    });
  });

  it('検査用数字が違えば不正', () => {
    expect(checkNumber('123456789019', 'myNumber')).toMatchObject({
      kind: 'verified',
      valid: false,
      expectedCheckDigit: 8,
    });
  });

  it('11桁なら検査用数字を補う', () => {
    expect(checkNumber('12345678901', 'myNumber')).toEqual({
      kind: 'computed',
      digits: '123456789018',
      checkDigit: 8,
    });
  });

  it('全角・空白・ハイフンを無視する', () => {
    expect(checkNumber('１２３４ 5678-9018', 'myNumber')).toMatchObject({
      kind: 'verified',
      valid: true,
    });
  });

  it('桁数違い・数字以外・空', () => {
    expect(checkNumber('12345', 'myNumber')).toEqual({
      kind: 'wrongLength',
      length: 5,
      expected: 12,
    });
    expect(checkNumber('12345678901a', 'myNumber')).toEqual({
      kind: 'invalidChars',
    });
    expect(checkNumber('  ', 'myNumber')).toEqual({ kind: 'empty' });
  });
});

describe('法人番号', () => {
  it('検査用数字を計算できる（国税庁 7000012050002）', () => {
    expect(calcCorporateCheckDigit('000012050002')).toBe(7);
  });

  it('正しい番号を検証できる（T付き・全角も可）', () => {
    expect(checkNumber('7000012050002', 'corporate')).toMatchObject({
      kind: 'verified',
      valid: true,
    });
    expect(checkNumber('Ｔ7000012050002', 'corporate')).toMatchObject({
      kind: 'verified',
      valid: true,
      digits: '7000012050002',
    });
  });

  it('不正な番号', () => {
    expect(checkNumber('8000012050002', 'corporate')).toMatchObject({
      kind: 'verified',
      valid: false,
      expectedCheckDigit: 7,
    });
  });

  it('12桁なら検査用数字を先頭に補う', () => {
    expect(checkNumber('000012050002', 'corporate')).toEqual({
      kind: 'computed',
      digits: '7000012050002',
      checkDigit: 7,
    });
  });

  it('個人番号モードでは先頭の T を取り除かない', () => {
    expect(normalizeNumberInput('T123', 'myNumber')).toBe('T123');
    expect(checkNumber('T12345678901', 'myNumber')).toEqual({
      kind: 'invalidChars',
    });
  });
});
