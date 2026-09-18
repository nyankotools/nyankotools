import { describe, expect, it } from 'vitest';
import { decodeUrl, encodeUrl } from './url-encode';

describe('encodeUrl', () => {
  it('記号を含む文字列をパーセントエンコードする', () => {
    expect(encodeUrl('a=1&b=2')).toEqual({
      success: true,
      output: 'a%3D1%26b%3D2',
    });
  });

  it('日本語（マルチバイト文字）を正しくエンコードする', () => {
    expect(encodeUrl('こんにちは')).toEqual({
      success: true,
      output: '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF',
    });
  });

  it('空文字列は空文字列になる', () => {
    expect(encodeUrl('')).toEqual({ success: true, output: '' });
  });

  it('絵文字（サロゲートペア）を正しくエンコードする', () => {
    expect(encodeUrl('🐱')).toEqual({
      success: true,
      output: '%F0%9F%90%B1',
    });
  });

  it('半角スペースを%20に変換する', () => {
    expect(encodeUrl('a b')).toEqual({ success: true, output: 'a%20b' });
  });
});

describe('decodeUrl', () => {
  it('パーセントエンコードされた文字列をデコードする', () => {
    expect(decodeUrl('a%3D1%26b%3D2')).toEqual({
      success: true,
      output: 'a=1&b=2',
    });
  });

  it('日本語を含むエンコード文字列を正しくデコードする', () => {
    expect(decodeUrl('%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF')).toEqual({
      success: true,
      output: 'こんにちは',
    });
  });

  it('不正なパーセントエンコード文字列の場合は失敗を返す', () => {
    const result = decodeUrl('%E3%81');
    expect(result).toEqual({ success: false });
  });

  it('16進数として不正な%表記の場合は失敗を返す', () => {
    expect(decodeUrl('%zz')).toEqual({ success: false });
  });

  it('末尾が%で終わる不完全な文字列の場合は失敗を返す', () => {
    expect(decodeUrl('abc%')).toEqual({ success: false });
  });

  it('空文字列は空文字列になる', () => {
    expect(decodeUrl('')).toEqual({ success: true, output: '' });
  });

  it('エンコードされていない通常の文字列はそのまま返す', () => {
    expect(decodeUrl('hello world')).toEqual({
      success: true,
      output: 'hello world',
    });
  });

  it('絵文字（サロゲートペア）のエンコード結果を正しくデコードする', () => {
    expect(decodeUrl('%F0%9F%90%B1')).toEqual({ success: true, output: '🐱' });
  });
});
