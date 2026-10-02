import { describe, it, expect } from 'vitest';
import {
  computeHmac,
  formatBytes,
  matchesExpected,
  parseHex,
} from './hmac-generator';

async function hex(
  message: string,
  key: string,
  algorithm: Parameters<typeof computeHmac>[3],
  keyFormat: 'text' | 'hex' = 'text',
) {
  const result = await computeHmac(message, key, keyFormat, algorithm);
  if (!result.success) throw new Error(result.error);
  return formatBytes(result.bytes, 'hex');
}

describe('computeHmac', () => {
  it('RFC 2202 / RFC 4231 のテストベクタと一致する', async () => {
    const message = 'what do ya want for nothing?';
    expect(await hex(message, 'Jefe', 'SHA-1')).toBe(
      'effcdf6ae5eb2fa2d27416d5f184df9c259a7c79',
    );
    expect(await hex(message, 'Jefe', 'SHA-256')).toBe(
      '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843',
    );
  });

  it('空の鍵でも計算できる（ゼロ鍵と等価）', async () => {
    expect(await hex('', '', 'SHA-1')).toBe(
      'fbdb1d1b18aa6c08324b7d64b71fb76370690e1d',
    );
    expect(await hex('', '', 'SHA-256')).toBe(
      'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad',
    );
  });

  it('16進数の鍵はテキスト鍵と同じバイト列なら同じ結果になる', async () => {
    const message = 'hello';
    expect(await hex(message, '4a656665', 'SHA-256', 'hex')).toBe(
      await hex(message, 'Jefe', 'SHA-256'),
    );
  });

  it('不正な16進数の鍵はエラーになる', async () => {
    for (const key of ['xyz', 'abc']) {
      const result = await computeHmac('a', key, 'hex', 'SHA-256');
      expect(result).toEqual({ success: false, error: 'invalid-hex' });
    }
  });

  it('日本語メッセージはUTF-8として扱う', async () => {
    const a = await hex('こんにちは', 'k', 'SHA-256');
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toBe(await hex('こんにちわ', 'k', 'SHA-256'));
  });
});

describe('formatBytes / parseHex', () => {
  const bytes = new Uint8Array([0xfb, 0xff, 0xfe]);
  it('Base64とBase64URLを出力できる', () => {
    expect(formatBytes(bytes, 'hex')).toBe('fbfffe');
    expect(formatBytes(bytes, 'base64')).toBe('+//+');
    expect(formatBytes(new Uint8Array([1]), 'base64')).toBe('AQ==');
    expect(formatBytes(bytes, 'base64url')).toBe('-__-');
    expect(formatBytes(new Uint8Array([1]), 'base64url')).toBe('AQ');
  });

  it('parseHex は空白・コロンを許容し、不正なら null', () => {
    expect(parseHex('4a:65 66')).toEqual(new Uint8Array([0x4a, 0x65, 0x66]));
    expect(parseHex('')).toEqual(new Uint8Array());
    expect(parseHex('4g')).toBeNull();
    expect(parseHex('abc')).toBeNull();
  });
});

describe('matchesExpected', () => {
  const bytes = new Uint8Array([1, 2, 3, 250]);
  it('16進（大文字小文字・空白無視）とBase64系で一致を判定する', () => {
    expect(matchesExpected(bytes, '010203FA')).toBe('hex');
    expect(matchesExpected(bytes, ' 01 02 03 fa ')).toBe('hex');
    expect(matchesExpected(bytes, 'AQID+g==')).toBe('base64');
    expect(matchesExpected(bytes, 'AQID-g')).toBe('base64url');
  });

  it('不一致・空欄は null', () => {
    expect(matchesExpected(bytes, '010203FB')).toBeNull();
    expect(matchesExpected(bytes, '  ')).toBeNull();
  });
});
