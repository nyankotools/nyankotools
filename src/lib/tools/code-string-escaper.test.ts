import { describe, expect, it } from 'vitest';
import {
  ESCAPE_LANGUAGES,
  convertCodeString,
  escapeCsv,
  escapeJson,
  escapeRegex,
  escapeShell,
  escapeSql,
  escapeSqlMysql,
  unescapeCsv,
  unescapeJson,
  unescapeRegex,
  unescapeShell,
  unescapeSql,
  unescapeSqlMysql,
} from './code-string-escaper';

describe('shell', () => {
  it('単一引用符で囲み、内部の単一引用符を処理する', () => {
    expect(escapeShell("it's $HOME")).toBe(`'it'\\''s $HOME'`);
    expect(escapeShell('')).toBe("''");
  });
  it('アンエスケープで往復できる', () => {
    const src = 'it\'s "q" $x `y` \\ \n end';
    expect(unescapeShell(escapeShell(src))).toEqual({ ok: true, value: src });
  });
  it('二重引用符とバックスラッシュを解釈する', () => {
    expect(unescapeShell('"a \\"b\\" \\$c \\n"')).toEqual({
      ok: true,
      value: 'a "b" $c \\n',
    });
    expect(unescapeShell('a\\ b')).toEqual({ ok: true, value: 'a b' });
  });
  it('閉じていない引用符はエラー', () => {
    expect(unescapeShell("'abc")).toEqual({
      ok: false,
      error: 'unterminated-quote',
    });
    expect(unescapeShell('"abc')).toEqual({
      ok: false,
      error: 'unterminated-quote',
    });
  });
});

describe('regex', () => {
  it('メタ文字をエスケープする', () => {
    expect(escapeRegex('a.b*c?(d)[e]{f}|^$\\/+-')).toBe(
      'a\\.b\\*c\\?\\(d\\)\\[e\\]\\{f\\}\\|\\^\\$\\\\\\/\\+-',
    );
  });
  it('エスケープ結果は元の文字列に完全一致する', () => {
    const src = '1+1=2? (yes) [a-z] $5.00';
    expect(new RegExp(`^${escapeRegex(src)}$`).test(src)).toBe(true);
  });
  it('アンエスケープは記号の前のバックスラッシュだけ外す', () => {
    expect(unescapeRegex('a\\.b\\d\\\\')).toBe('a.b\\d\\');
    expect(unescapeRegex(escapeRegex('a.b*c'))).toBe('a.b*c');
  });
});

describe('sql', () => {
  it('標準SQLは単一引用符を二重化する', () => {
    expect(escapeSql("O'Reilly")).toBe("O''Reilly");
    expect(unescapeSql("O''Reilly")).toBe("O'Reilly");
  });
  it('MySQL方式はバックスラッシュ系', () => {
    expect(escapeSqlMysql('a\'b"c\\d\n\0')).toBe('a\\\'b\\"c\\\\d\\n\\0');
    const src = 'a\'b"c\\d\n\r\0\x1a';
    expect(unescapeSqlMysql(escapeSqlMysql(src))).toBe(src);
  });
  it('MySQLの \\% と \\_ はそのまま残す', () => {
    expect(unescapeSqlMysql('50\\% a\\_b')).toBe('50\\% a\\_b');
    expect(unescapeSqlMysql("it''s")).toBe("it's");
  });
});

describe('csv', () => {
  it('必要なときだけ囲む', () => {
    expect(escapeCsv('plain')).toBe('plain');
    expect(escapeCsv('a,b')).toBe('"a,b"');
    expect(escapeCsv('say "hi"')).toBe('"say ""hi"""');
    expect(escapeCsv('l1\nl2')).toBe('"l1\nl2"');
  });
  it('アンエスケープで往復できる', () => {
    const src = 'a,"b"\nc';
    expect(unescapeCsv(escapeCsv(src))).toEqual({ ok: true, value: src });
    expect(unescapeCsv('plain')).toEqual({ ok: true, value: 'plain' });
  });
  it('不正な引用符はエラー', () => {
    expect(unescapeCsv('"abc')).toEqual({ ok: false, error: 'invalid-csv' });
    expect(unescapeCsv('"a"b"')).toEqual({ ok: false, error: 'invalid-csv' });
    expect(unescapeCsv('"')).toEqual({ ok: false, error: 'invalid-csv' });
  });
});

describe('json', () => {
  it('JSON文字列としてエスケープする', () => {
    expect(escapeJson('a"b\\c\n\t')).toBe('a\\"b\\\\c\\n\\t');
    expect(escapeJson('日本語')).toBe('日本語');
  });
  it('引用符あり・なし両方をアンエスケープできる', () => {
    expect(unescapeJson('a\\"b\\n\\u3042')).toEqual({
      ok: true,
      value: 'a"b\nあ',
    });
    expect(unescapeJson('"a\\tb"')).toEqual({ ok: true, value: 'a\tb' });
  });
  it('不正なエスケープはエラー', () => {
    expect(unescapeJson('a\\qb')).toEqual({ ok: false, error: 'invalid-json' });
    expect(unescapeJson('a"b')).toEqual({ ok: false, error: 'invalid-json' });
  });
});

describe('convertCodeString', () => {
  it('全言語で往復できる', () => {
    const src = 'He said "it\'s fine", ok\\n';
    for (const lang of ESCAPE_LANGUAGES) {
      if (lang === 'regex') continue;
      const esc = convertCodeString(src, lang, 'escape');
      expect(esc.ok).toBe(true);
      if (!esc.ok) continue;
      const un = convertCodeString(esc.value, lang, 'unescape');
      expect(un).toEqual({ ok: true, value: src });
    }
  });
  it('空文字列', () => {
    expect(convertCodeString('', 'json', 'escape')).toEqual({
      ok: true,
      value: '',
    });
  });
  it('絵文字・サロゲートペアを全言語で往復できる', () => {
    const src = '😀 "q" \'x\' \\ 𠮷野家';
    for (const lang of ESCAPE_LANGUAGES) {
      if (lang === 'regex') continue;
      const esc = convertCodeString(src, lang, 'escape');
      expect(esc.ok).toBe(true);
      if (!esc.ok) continue;
      expect(convertCodeString(esc.value, lang, 'unescape')).toEqual({
        ok: true,
        value: src,
      });
    }
    expect(unescapeRegex(escapeRegex(src))).toBe(src);
  });
  it('改行（CRLF・CR）を含む文字列を往復できる', () => {
    const src = 'a\r\nb\rc\nd';
    expect(escapeJson(src)).toBe('a\\r\\nb\\rc\\nd');
    expect(unescapeJson(escapeJson(src))).toEqual({ ok: true, value: src });
    expect(unescapeCsv(escapeCsv(src))).toEqual({ ok: true, value: src });
    expect(unescapeSqlMysql(escapeSqlMysql(src))).toBe(src);
  });
  it('JSONのサロゲートペア形式のエスケープを解釈する', () => {
    expect(unescapeJson('\\ud83d\\ude00')).toEqual({ ok: true, value: '😀' });
  });
});
