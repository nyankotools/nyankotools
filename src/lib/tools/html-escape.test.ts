import { describe, expect, it } from 'vitest';
import {
  convertEscape,
  escapeHtml,
  escapeJsString,
  unescapeHtml,
  unescapeJsString,
} from './html-escape';

describe('escapeHtml', () => {
  it('HTMLの特殊文字を実体参照に変換する', () => {
    expect(escapeHtml(`<a href="x">it's & fun</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;it&#39;s &amp; fun&lt;/a&gt;',
    );
  });

  it('特殊文字を含まない文字列はそのまま返す', () => {
    expect(escapeHtml('こんにちは')).toBe('こんにちは');
  });

  it('空文字列は空文字列になる', () => {
    expect(escapeHtml('')).toBe('');
  });
});

describe('unescapeHtml', () => {
  it('主要な名前付き実体参照を元の文字に戻す', () => {
    expect(
      unescapeHtml('&lt;a href=&quot;x&quot;&gt;it&#39;s &amp; fun&lt;/a&gt;'),
    ).toBe(`<a href="x">it's & fun</a>`);
  });

  it('10進数・16進数の数値文字参照を復元する', () => {
    expect(unescapeHtml('&#65;&#x42;')).toBe('AB');
  });

  it('未知の実体参照はそのまま残す', () => {
    expect(unescapeHtml('&unknown;')).toBe('&unknown;');
  });
});

describe('escapeJsString', () => {
  it('バックスラッシュ・クォート・改行をエスケープする', () => {
    expect(escapeJsString(`it's a "test"\nline2\\end`)).toBe(
      'it\\\'s a \\"test\\"\\nline2\\\\end',
    );
  });

  it('特殊文字を含まない文字列はそのまま返す', () => {
    expect(escapeJsString('こんにちは')).toBe('こんにちは');
  });
});

describe('unescapeJsString', () => {
  it('エスケープシーケンスを元の文字に戻す', () => {
    expect(unescapeJsString('it\\\'s a \\"test\\"\\nline2\\\\end')).toBe(
      `it's a "test"\nline2\\end`,
    );
  });

  it('\\xHH と \\uHHHH 形式のエスケープを復元する', () => {
    expect(unescapeJsString('\\x41\\u0042')).toBe('AB');
  });

  it('\\u{H+} 形式のコードポイントエスケープを復元する', () => {
    expect(unescapeJsString('\\u{1F600}')).toBe('😀');
  });
});

describe('convertEscape', () => {
  it('modeに応じて適切な変換関数を呼び出す', () => {
    expect(convertEscape('<b>', 'html-escape')).toBe('&lt;b&gt;');
    expect(convertEscape('&lt;b&gt;', 'html-unescape')).toBe('<b>');
    expect(convertEscape("a'b", 'js-escape')).toBe("a\\'b");
    expect(convertEscape("a\\'b", 'js-unescape')).toBe("a'b");
  });
});
