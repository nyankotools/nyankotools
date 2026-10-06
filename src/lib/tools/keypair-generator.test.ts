import { describe, it, expect } from 'vitest';
import { generateKeyPair, toPem } from './keypair-generator';

describe('keypair-generator', () => {
  it('toPem は64文字で折り返し、ヘッダ・フッタを付ける', () => {
    const der = new Uint8Array(100).fill(1).buffer;
    const lines = toPem(der, 'PUBLIC KEY').trimEnd().split('\n');
    expect(lines[0]).toBe('-----BEGIN PUBLIC KEY-----');
    expect(lines[lines.length - 1]).toBe('-----END PUBLIC KEY-----');
    expect(lines[1]).toHaveLength(64);
    expect(lines[2].length).toBeLessThanOrEqual(64);
  });

  it('ECDSA P-256 の鍵ペアをPEMで生成できる', async () => {
    const result = await generateKeyPair('ec-p256');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.keyPair.publicKey).toMatch(
      /^-----BEGIN PUBLIC KEY-----\n[\s\S]+\n-----END PUBLIC KEY-----\n$/,
    );
    expect(result.keyPair.privateKey).toMatch(
      /^-----BEGIN PRIVATE KEY-----\n[\s\S]+\n-----END PRIVATE KEY-----\n$/,
    );
  });

  it('RSA-2048 の鍵ペアを生成でき、毎回異なる鍵になる', async () => {
    const a = await generateKeyPair('rsa-2048');
    const b = await generateKeyPair('rsa-2048');
    expect(a.success && b.success).toBe(true);
    if (!a.success || !b.success) return;
    expect(a.keyPair.privateKey).not.toBe(b.keyPair.privateKey);
  });

  it('Ed25519 は生成できるか、未対応なら unsupported を返す', async () => {
    const result = await generateKeyPair('ed25519');
    if (result.success) {
      expect(result.keyPair.publicKey).toContain('BEGIN PUBLIC KEY');
    } else {
      expect(result.error).toBe('unsupported');
    }
  });
});
