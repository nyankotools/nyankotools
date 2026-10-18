import { describe, expect, it } from 'vitest';
import {
  baseNFormats,
  decodeText,
  decodeToBytes,
  encodeBytes,
  encodeText,
  type BaseNFormat,
} from './base-n-encoder';

const enc = (s: string) => new TextEncoder().encode(s);

describe('base16', () => {
  it('エンコードする', () => {
    expect(encodeText('base16', 'Hello')).toBe('48656c6c6f');
    expect(encodeText('base16', 'Hello', { uppercase: true })).toBe(
      '48656C6C6F',
    );
  });
  it('大文字小文字・空白・0xを許容してデコードする', () => {
    expect(decodeText('base16', '48 65 6C 6c 6f')).toEqual({
      success: true,
      output: 'Hello',
    });
    expect(decodeText('base16', '0x4865')).toEqual({
      success: true,
      output: 'He',
    });
  });
  it('不正な文字と奇数長を報告する', () => {
    expect(decodeText('base16', '4g')).toEqual({
      success: false,
      error: { kind: 'invalid-char', char: 'g', index: 1 },
    });
    expect(decodeText('base16', '486')).toEqual({
      success: false,
      error: { kind: 'invalid-length' },
    });
  });
});

describe('base32', () => {
  const vectors: [string, string][] = [
    ['', ''],
    ['f', 'MY======'],
    ['fo', 'MZXQ===='],
    ['foo', 'MZXW6==='],
    ['foob', 'MZXW6YQ='],
    ['fooba', 'MZXW6YTB'],
    ['foobar', 'MZXW6YTBOI======'],
  ];
  it('RFC 4648 のテストベクタ', () => {
    for (const [plain, encoded] of vectors) {
      expect(encodeText('base32', plain)).toBe(encoded);
      expect(decodeText('base32', encoded)).toEqual({
        success: true,
        output: plain,
      });
    }
  });
  it('パディングなし出力・小文字・パディング省略入力', () => {
    expect(encodeText('base32', 'foo', { padding: false })).toBe('MZXW6');
    expect(decodeText('base32', 'mzxw6')).toEqual({
      success: true,
      output: 'foo',
    });
  });
  it('不正入力を報告する', () => {
    expect(decodeText('base32', 'MZ1W6')).toEqual({
      success: false,
      error: { kind: 'invalid-char', char: '1', index: 2 },
    });
    expect(decodeText('base32', 'M')).toEqual({
      success: false,
      error: { kind: 'invalid-length' },
    });
  });
});

describe('base58', () => {
  it('既知の値', () => {
    expect(encodeText('base58', 'Hello World!')).toBe('2NEpo7TZRRrLZSi2U');
    expect(encodeBytes('base58', Uint8Array.of(0, 0, 1))).toBe('112');
  });
  it('先頭のゼロバイトを保持して往復する', () => {
    const bytes = Uint8Array.of(0, 0, 255, 1);
    const r = decodeToBytes('base58', encodeBytes('base58', bytes));
    expect(r).toEqual({ success: true, bytes });
  });
  it('0 O I l は不正文字', () => {
    expect(decodeText('base58', '10')).toMatchObject({
      success: false,
      error: { kind: 'invalid-char', char: '0', index: 1 },
    });
  });
});

describe('base62', () => {
  it('既知の値と往復', () => {
    expect(encodeBytes('base62', Uint8Array.of(1))).toBe('1');
    expect(encodeBytes('base62', Uint8Array.of(255))).toBe('47');
    expect(encodeBytes('base62', Uint8Array.of(0, 1))).toBe('01');
    expect(decodeText('base62', encodeText('base62', 'こんにちは'))).toEqual({
      success: true,
      output: 'こんにちは',
    });
  });
  it('記号は不正文字', () => {
    expect(decodeText('base62', 'ab+')).toMatchObject({
      success: false,
      error: { kind: 'invalid-char', char: '+' },
    });
  });
});

describe('base85 (Ascii85)', () => {
  it('既知の値', () => {
    expect(encodeText('base85', 'Man ')).toBe('9jqo^');
    expect(encodeText('base85', 'Man is')).toBe('9jqo^Bla');
    expect(encodeBytes('base85', new Uint8Array(4))).toBe('z');
  });
  it('<~ ~> と z を含む入力をデコードできる', () => {
    expect(decodeText('base85', '<~9jqo^Bla~>')).toEqual({
      success: true,
      output: 'Man is',
    });
    expect(decodeToBytes('base85', 'z')).toEqual({
      success: true,
      bytes: new Uint8Array(4),
    });
  });
  it('不正入力を報告する', () => {
    expect(decodeText('base85', 'ab{')).toMatchObject({
      success: false,
      error: { kind: 'invalid-char', char: '{' },
    });
    expect(decodeText('base85', '9')).toEqual({
      success: false,
      error: { kind: 'invalid-length' },
    });
    expect(decodeText('base85', 'uuuuu')).toEqual({
      success: false,
      error: { kind: 'overflow' },
    });
  });
});

describe('共通', () => {
  it('全形式で日本語・絵文字・空文字が往復する', () => {
    for (const f of baseNFormats as readonly BaseNFormat[]) {
      for (const text of ['', 'a', 'こんにちは🐱', 'Hello, World!\n']) {
        const encoded = encodeText(f, text);
        expect(decodeText(f, encoded)).toEqual({
          success: true,
          output: text,
        });
      }
    }
  });
  it('全形式でランダムバイト列が往復する', () => {
    for (const f of baseNFormats as readonly BaseNFormat[]) {
      for (let len = 0; len < 12; len++) {
        const bytes = Uint8Array.from({ length: len }, (_, i) =>
          i % 3 === 0 ? 0 : (i * 37 + 11) % 256,
        );
        expect(decodeToBytes(f, encodeBytes(f, bytes))).toEqual({
          success: true,
          bytes,
        });
      }
    }
  });
  it('UTF-8として不正なバイト列は invalid-utf8', () => {
    expect(decodeText('base16', 'ff')).toEqual({
      success: false,
      error: { kind: 'invalid-utf8' },
    });
    expect(enc('a').length).toBe(1);
  });
});
