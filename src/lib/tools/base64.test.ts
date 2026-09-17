import { describe, expect, it } from 'vitest';
import { decodeBase64, encodeBase64 } from './base64';

describe('encodeBase64', () => {
  it('ASCII文字列をBase64に変換する', () => {
    expect(encodeBase64('hello')).toEqual({
      success: true,
      output: 'aGVsbG8=',
    });
  });

  it('日本語（マルチバイト文字）を正しくBase64に変換する', () => {
    expect(encodeBase64('こんにちは')).toEqual({
      success: true,
      output: '44GT44KT44Gr44Gh44Gv',
    });
  });

  it('空文字列は空文字列になる', () => {
    expect(encodeBase64('')).toEqual({ success: true, output: '' });
  });

  it('絵文字（サロゲートペア）を正しくBase64に変換する', () => {
    expect(encodeBase64('😺🐾')).toEqual({
      success: true,
      output: '8J+YuvCfkL4=',
    });
  });

  it('非常に長い文字列も正しくBase64に変換する', () => {
    const long = 'a'.repeat(100000);
    const result = encodeBase64(long);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toHaveLength(133336);
      expect(result.output.startsWith('YWFh')).toBe(true);
    }
  });
});

describe('decodeBase64', () => {
  it('Base64文字列をデコードする', () => {
    expect(decodeBase64('aGVsbG8=')).toEqual({
      success: true,
      output: 'hello',
    });
  });

  it('日本語を含むBase64文字列を正しくデコードする', () => {
    expect(decodeBase64('44GT44KT44Gr44Gh44Gv')).toEqual({
      success: true,
      output: 'こんにちは',
    });
  });

  it('前後の空白を無視してデコードする', () => {
    expect(decodeBase64('  aGVsbG8=  ')).toEqual({
      success: true,
      output: 'hello',
    });
  });

  it('不正なBase64文字列の場合は失敗を返す', () => {
    const result = decodeBase64('not-valid-base64!!');
    expect(result).toEqual({ success: false });
  });

  it('空文字列は空文字列になる', () => {
    expect(decodeBase64('')).toEqual({ success: true, output: '' });
  });

  it('絵文字（サロゲートペア）を含むBase64文字列を正しくデコードする', () => {
    expect(decodeBase64('8J+YuvCfkL4=')).toEqual({
      success: true,
      output: '😺🐾',
    });
  });

  it('非常に長いBase64文字列も正しくデコードする', () => {
    const long = 'a'.repeat(100000);
    const encoded = encodeBase64(long);
    expect(encoded.success).toBe(true);
    if (encoded.success) {
      expect(decodeBase64(encoded.output)).toEqual({
        success: true,
        output: long,
      });
    }
  });

  it('構文としては正しいBase64だが不正なUTF-8バイト列の場合は失敗を返す', () => {
    // 0x80単体はUTF-8の先頭バイトとして不正（継続バイトのみでリードバイトが無い）
    const result = decodeBase64('gA==');
    expect(result).toEqual({ success: false });
  });
});
