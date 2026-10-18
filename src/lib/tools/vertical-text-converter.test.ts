import { describe, it, expect } from 'vitest';
import {
  convertVertical,
  toColumns,
  toCharPerLine,
  toFullWidth,
  toVerticalGlyphs,
} from './vertical-text-converter';

describe('toFullWidth', () => {
  it('半角英数記号と空白を全角にする', () => {
    expect(toFullWidth('Ab1! ~')).toBe('Ａｂ１！　～');
  });
  it('日本語はそのまま', () => {
    expect(toFullWidth('あ漢')).toBe('あ漢');
  });
});

describe('toVerticalGlyphs', () => {
  it('句読点・括弧・長音を縦書き字形にする', () => {
    expect(toVerticalGlyphs('「あ」、。')).toBe('﹁あ﹂︑︒');
    expect(toVerticalGlyphs('ラーメン')).toBe('ラ︱メン');
    expect(toVerticalGlyphs('（x）')).toBe('︵x︶');
  });
  it('対象外の文字は変えない', () => {
    expect(toVerticalGlyphs('abc')).toBe('abc');
  });
});

describe('toCharPerLine', () => {
  it('1文字1行にし、元の改行は空行になる', () => {
    expect(toCharPerLine('ab\ncd')).toBe('a\nb\n\nc\nd');
  });
  it('サロゲートペアを分割しない', () => {
    expect(toCharPerLine('𠮷a')).toBe('𠮷\na');
  });
});

describe('toColumns', () => {
  it('行を右から左へ並べ、足りない分は全角スペースで埋める', () => {
    expect(toColumns('abc\nde', 0)).toBe('d　a\ne　b\n　　c');
  });
  it('最大文字数で列を折り返す', () => {
    expect(toColumns('abcd', 2)).toBe('c　a\nd　b');
  });
  it('空文字は空文字', () => {
    expect(toColumns('', 0)).toBe('');
  });
});

describe('convertVertical', () => {
  it('既定で全角化・字形置換・1文字1行にする', () => {
    expect(convertVertical('A!')).toBe('Ａ\n︕');
  });
  it('オプションを無効にできる', () => {
    expect(convertVertical('a。', { fullWidth: false, glyphs: false })).toBe(
      'a\n。',
    );
  });
  it('columns レイアウト', () => {
    expect(convertVertical('ab', { layout: 'columns', fullWidth: false })).toBe(
      'a\nb',
    );
  });
  it('空入力は空文字', () => {
    expect(convertVertical('')).toBe('');
  });
  it('CRLF・CRの改行もLFと同じ結果になる', () => {
    const lf = convertVertical('ab\ncd', { layout: 'columns' });
    expect(convertVertical('ab\r\ncd', { layout: 'columns' })).toBe(lf);
    expect(convertVertical('ab\rcd', { layout: 'columns' })).toBe(lf);
    expect(convertVertical('ab\r\ncd')).toBe(convertVertical('ab\ncd'));
  });
});
