import { describe, it, expect } from 'vitest';
import {
  escapeUnicode,
  unescapeUnicode,
  type UnicodeEscapeFormat,
} from './unicode-escape';

const opts = (
  format: UnicodeEscapeFormat,
  scope: 'non-ascii' | 'all' = 'non-ascii',
  uppercase = false,
) => ({ format, scope, uppercase });

describe('escapeUnicode', () => {
  it('JS形式: 非ASCIIだけを \\uXXXX にする', () => {
    expect(escapeUnicode('aあb', opts('js'))).toBe('a\\u3042b');
  });

  it('JS形式: サロゲートペアは2つの \\u になる', () => {
    expect(escapeUnicode('😀', opts('js'))).toBe('\\ud83d\\ude00');
    expect(escapeUnicode('😀', opts('js', 'non-ascii', true))).toBe(
      '\\uD83D\\uDE00',
    );
  });

  it('ES6形式: \\u{...}', () => {
    expect(escapeUnicode('😀あ', opts('es6'))).toBe('\\u{1f600}\\u{3042}');
  });

  it('Python形式: BMP外は \\UXXXXXXXX', () => {
    expect(escapeUnicode('あ😀', opts('python'))).toBe('\\u3042\\U0001f600');
  });

  it('U+形式は常に大文字4桁以上', () => {
    expect(escapeUnicode('あ😀', opts('codepoint'))).toBe('U+3042U+1F600');
  });

  it('HTML数値参照（16進・10進）', () => {
    expect(escapeUnicode('あ', opts('html-hex'))).toBe('&#x3042;');
    expect(escapeUnicode('あ', opts('html-dec'))).toBe('&#12354;');
  });

  it('範囲「すべて」ならASCIIも変換する', () => {
    expect(escapeUnicode('a\n', opts('js', 'all'))).toBe('\\u0061\\u000a');
  });

  it('空文字は空文字', () => {
    expect(escapeUnicode('', opts('js'))).toBe('');
  });
});

describe('unescapeUnicode', () => {
  it('各形式を元に戻す', () => {
    expect(unescapeUnicode('\\u3042')).toBe('あ');
    expect(unescapeUnicode('\\u{1F600}')).toBe('😀');
    expect(unescapeUnicode('\\U0001F600')).toBe('😀');
    expect(unescapeUnicode('U+3042')).toBe('あ');
    expect(unescapeUnicode('&#x3042;&#12356;')).toBe('あい');
    expect(unescapeUnicode('\\x41')).toBe('A');
  });

  it('サロゲートペアの \\u 連続は絵文字に戻る', () => {
    expect(unescapeUnicode('\\uD83D\\uDE00')).toBe('😀');
  });

  it('エスケープ以外の文字は保持する', () => {
    expect(unescapeUnicode('x\\u3042y\\n')).toBe('xあy\\n');
  });

  it('壊れた表記・範囲外は変換せずそのまま残す', () => {
    expect(unescapeUnicode('\\u30')).toBe('\\u30');
    expect(unescapeUnicode('\\u{110000}')).toBe('\\u{110000}');
    expect(unescapeUnicode('&#99999999;')).toBe('&#99999999;');
  });

  it('二重バックスラッシュの直後の \\u は展開しない', () => {
    expect(unescapeUnicode('\\\\u3042')).toBe('\\\\u3042');
  });

  it('単語の途中の U+ は変換しない', () => {
    expect(unescapeUnicode('MU+1234')).toBe('MU+1234');
  });

  it('escape → unescape で往復できる', () => {
    const text = 'Hello こんにちは 😀 𠮷';
    for (const format of [
      'js',
      'es6',
      'python',
      'html-hex',
      'html-dec',
    ] as const) {
      expect(unescapeUnicode(escapeUnicode(text, opts(format, 'all')))).toBe(
        text,
      );
    }
  });
});
