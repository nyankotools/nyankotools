import { describe, expect, it } from 'vitest';
import { base64ToBytes, parsePem, pemKind, toPem } from './pem';

describe('pem', () => {
  it('toPem と parsePem は往復できる', () => {
    const der = Uint8Array.from({ length: 100 }, (_, i) => i).buffer;
    const pem = toPem(der, 'PUBLIC KEY');
    const parsed = parsePem(pem);
    expect(parsed?.label).toBe('PUBLIC KEY');
    expect(Array.from(parsed!.der)).toEqual(Array.from(new Uint8Array(der)));
  });

  it('toPem は64文字で折り返す', () => {
    const lines = toPem(new Uint8Array(100).buffer, 'PUBLIC KEY')
      .trimEnd()
      .split('\n');
    expect(lines[1]).toHaveLength(64);
  });

  it('PEMでない入力・不正なBase64は null', () => {
    expect(parsePem('hello')).toBeNull();
    expect(
      parsePem('-----BEGIN PUBLIC KEY-----\n!!!\n-----END PUBLIC KEY-----'),
    ).toBeNull();
    expect(base64ToBytes('')).toBeNull();
  });

  it('BEGIN と END のラベルが違うブロックは無効', () => {
    expect(
      parsePem('-----BEGIN PUBLIC KEY-----\nAAAA\n-----END PRIVATE KEY-----'),
    ).toBeNull();
  });

  it('pemKind はラベルから種別を返す', () => {
    expect(pemKind('PUBLIC KEY')).toBe('public');
    expect(pemKind('PRIVATE KEY')).toBe('private');
    expect(pemKind('RSA PRIVATE KEY')).toBeNull();
  });
});
