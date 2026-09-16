import { describe, expect, it } from 'vitest';
import { convertLineEndings, countLineEndings } from './line-ending-converter';

describe('countLineEndings', () => {
  it('改行がなければすべて0', () => {
    expect(countLineEndings('abc')).toEqual({ lf: 0, crlf: 0, cr: 0 });
  });

  it('LF/CRLF/CRそれぞれの数を個別にカウントする', () => {
    expect(countLineEndings('a\nb\r\nc\rd\n')).toEqual({
      lf: 2,
      crlf: 1,
      cr: 1,
    });
  });

  it('CRLFをCRとLFの二重カウントにしない', () => {
    expect(countLineEndings('a\r\nb\r\n')).toEqual({ lf: 0, crlf: 2, cr: 0 });
  });
});

describe('convertLineEndings', () => {
  it('LFに統一する', () => {
    expect(convertLineEndings('a\r\nb\rc\n', 'lf')).toBe('a\nb\nc\n');
  });

  it('CRLFに統一する', () => {
    expect(convertLineEndings('a\nb\rc\r\n', 'crlf')).toBe('a\r\nb\r\nc\r\n');
  });

  it('CRに統一する', () => {
    expect(convertLineEndings('a\nb\r\nc\r', 'cr')).toBe('a\rb\rc\r');
  });

  it('改行が含まれない場合はそのまま返す', () => {
    expect(convertLineEndings('abc', 'crlf')).toBe('abc');
  });

  it('空文字はそのまま空文字を返す', () => {
    expect(convertLineEndings('', 'lf')).toBe('');
  });
});
