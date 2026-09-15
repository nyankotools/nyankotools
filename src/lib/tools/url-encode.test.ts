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
});
