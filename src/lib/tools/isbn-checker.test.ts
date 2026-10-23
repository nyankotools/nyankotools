import { describe, expect, it } from 'vitest';
import {
  checkCode,
  eanCheckDigit,
  isbn10CheckDigit,
  isbn10To13,
  isbn13To10,
  normalizeCode,
} from './isbn-checker';

describe('normalizeCode', () => {
  it('ハイフン・空白・全角を処理する', () => {
    expect(normalizeCode(' 978-4-12-345678 -9 ')).toBe('9784123456789');
    expect(normalizeCode('９７８４１２３４５６７８９')).toBe('9784123456789');
    expect(normalizeCode('4-8399-xxx')).toBe('48399XXX');
    expect(normalizeCode('0-8044-2957-x')).toBe('080442957X');
  });
});

describe('check digits', () => {
  it('EAN-13', () => {
    expect(eanCheckDigit('490123456789')).toBe('4');
    expect(eanCheckDigit('978030640615')).toBe('7');
  });
  it('EAN-8', () => {
    expect(eanCheckDigit('4901234')).toBe('7');
    expect(eanCheckDigit('9638507')).toBe('4');
  });
  it('ISBN-10 (X を含む)', () => {
    expect(isbn10CheckDigit('080442957')).toBe('X');
    expect(isbn10CheckDigit('030640615')).toBe('2');
  });
});

describe('conversion', () => {
  it('ISBN-10 → 13', () => {
    expect(isbn10To13('0306406152')).toBe('9780306406157');
    expect(isbn10To13('080442957X')).toBe('9780804429573');
  });
  it('ISBN-13 → 10', () => {
    expect(isbn13To10('9780306406157')).toBe('0306406152');
    expect(isbn13To10('9791234567896')).toBeNull();
  });
});

describe('checkCode', () => {
  it('正しいISBN-10', () => {
    const r = checkCode('0-306-40615-2');
    expect(r).toMatchObject({
      ok: true,
      kind: 'isbn10',
      valid: true,
      hasCheck: true,
      isbn13: '9780306406157',
    });
  });
  it('ISBN-10 末尾X', () => {
    const r = checkCode('0-8044-2957-x');
    expect(r).toMatchObject({ ok: true, valid: true, checkDigit: 'X' });
  });
  it('チェックデジット誤りのISBN-10', () => {
    const r = checkCode('0306406153');
    expect(r).toMatchObject({ ok: true, valid: false, checkDigit: '2' });
  });
  it('9桁はチェックデジットを補完', () => {
    const r = checkCode('030640615');
    expect(r).toMatchObject({
      ok: true,
      hasCheck: false,
      valid: true,
      completed: '0306406152',
    });
  });
  it('ISBN-13 978 は ISBN-10 も返す', () => {
    const r = checkCode('978-0-306-40615-7');
    expect(r).toMatchObject({
      ok: true,
      kind: 'ean13',
      valid: true,
      isbnPrefix: '978',
      isbn10: '0306406152',
      isbn13: '9780306406157',
    });
  });
  it('ISBN-13 979 は ISBN-10 なし', () => {
    const r = checkCode('9791234567896');
    expect(r).toMatchObject({ ok: true, valid: true, isbnPrefix: '979' });
    expect((r as { isbn10?: string }).isbn10).toBeUndefined();
  });
  it('JAN 13桁（49始まり）', () => {
    const r = checkCode('4901234567894');
    expect(r).toMatchObject({ ok: true, valid: true, japanJan: true });
    expect((r as { isbnPrefix?: string }).isbnPrefix).toBeUndefined();
  });
  it('12桁はチェックデジットを計算', () => {
    expect(checkCode('490123456789')).toMatchObject({
      hasCheck: false,
      checkDigit: '4',
      completed: '4901234567894',
    });
  });
  it('13桁の誤り', () => {
    expect(checkCode('4901234567895')).toMatchObject({
      ok: true,
      valid: false,
      checkDigit: '4',
    });
  });
  it('EAN-8', () => {
    expect(checkCode('96385074')).toMatchObject({ kind: 'ean8', valid: true });
    expect(checkCode('9638507')).toMatchObject({
      kind: 'ean8',
      hasCheck: false,
      completed: '96385074',
    });
    expect(checkCode('96385075')).toMatchObject({ valid: false });
  });
  it('エラー', () => {
    expect(checkCode('')).toEqual({ ok: false, error: 'empty' });
    expect(checkCode(' - ')).toEqual({ ok: false, error: 'empty' });
    expect(checkCode('abc')).toEqual({ ok: false, error: 'chars' });
    expect(checkCode('12345678X')).toEqual({ ok: false, error: 'chars' });
    expect(checkCode('978030640615X')).toEqual({ ok: false, error: 'chars' });
    expect(checkCode('12345')).toEqual({ ok: false, error: 'length' });
    expect(checkCode('12345678901')).toEqual({ ok: false, error: 'length' });
  });
});
