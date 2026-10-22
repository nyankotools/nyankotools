import { describe, expect, it } from 'vitest';
import { toPem } from '../pem';
import {
  defaultHash,
  signText,
  verifyText,
  type SignatureAlgorithm,
  type SignatureHash,
} from './digital-signature-tool';

async function makePair(algorithm: SignatureAlgorithm) {
  const params =
    algorithm === 'rsa-pss'
      ? {
          name: 'RSA-OAEP', // keypair-generatorと同じ鍵（PKCS#8/SPKIは共通）
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        }
      : {
          name: 'ECDSA',
          namedCurve: `P-${algorithm.slice(7)}`,
        };
  const usages: KeyUsage[] =
    algorithm === 'rsa-pss' ? ['encrypt', 'decrypt'] : ['sign', 'verify'];
  const pair = (await crypto.subtle.generateKey(
    params,
    true,
    usages,
  )) as CryptoKeyPair;
  return {
    publicPem: toPem(
      await crypto.subtle.exportKey('spki', pair.publicKey),
      'PUBLIC KEY',
    ),
    privatePem: toPem(
      await crypto.subtle.exportKey('pkcs8', pair.privateKey),
      'PRIVATE KEY',
    ),
  };
}

describe('digital-signature-tool', () => {
  const cases: [SignatureAlgorithm, SignatureHash][] = [
    ['rsa-pss', 'SHA-256'],
    ['rsa-pss', 'SHA-512'],
    ['ecdsa-p256', 'SHA-256'],
    ['ecdsa-p384', 'SHA-384'],
    ['ecdsa-p521', 'SHA-512'],
  ];

  it.each(cases)(
    '%s / %s: 署名して検証でき、改ざんで失敗する',
    async (alg, hash) => {
      const { publicPem, privatePem } = await makePair(alg);
      const signed = await signText('こんにちは', privatePem, alg, hash);
      expect(signed.success).toBe(true);
      if (!signed.success) return;
      expect(
        await verifyText('こんにちは', signed.signature, publicPem, alg, hash),
      ).toEqual({ success: true, valid: true });
      expect(
        await verifyText('こんにちは!', signed.signature, publicPem, alg, hash),
      ).toEqual({ success: true, valid: false });
    },
  );

  it('空のメッセージも署名・検証できる', async () => {
    const { publicPem, privatePem } = await makePair('ecdsa-p256');
    const signed = await signText('', privatePem, 'ecdsa-p256', 'SHA-256');
    if (!signed.success) throw new Error('sign failed');
    expect(
      await verifyText(
        '',
        signed.signature,
        publicPem,
        'ecdsa-p256',
        'SHA-256',
      ),
    ).toEqual({ success: true, valid: true });
  });

  it('ECDSA署名はr||s形式（P-256で64バイト）', async () => {
    const { privatePem } = await makePair('ecdsa-p256');
    const signed = await signText('x', privatePem, 'ecdsa-p256', 'SHA-256');
    expect(signed.success && atob(signed.signature).length).toBe(64);
  });

  it('別の鍵では検証に失敗する', async () => {
    const a = await makePair('ecdsa-p256');
    const b = await makePair('ecdsa-p256');
    const signed = await signText('msg', a.privatePem, 'ecdsa-p256', 'SHA-256');
    if (!signed.success) throw new Error('sign failed');
    expect(
      await verifyText(
        'msg',
        signed.signature,
        b.publicPem,
        'ecdsa-p256',
        'SHA-256',
      ),
    ).toEqual({ success: true, valid: false });
  });

  it('ハッシュが違うと検証に失敗する', async () => {
    const { publicPem, privatePem } = await makePair('ecdsa-p256');
    const signed = await signText('msg', privatePem, 'ecdsa-p256', 'SHA-256');
    if (!signed.success) throw new Error('sign failed');
    expect(
      await verifyText(
        'msg',
        signed.signature,
        publicPem,
        'ecdsa-p256',
        'SHA-384',
      ),
    ).toEqual({ success: true, valid: false });
  });

  it('アルゴリズムが鍵と合わないと key-import-failed', async () => {
    const rsa = await makePair('rsa-pss');
    const ec = await makePair('ecdsa-p256');
    expect(
      await signText('a', rsa.privatePem, 'ecdsa-p256', 'SHA-256'),
    ).toEqual({ success: false, error: 'key-import-failed' });
    expect(await signText('a', ec.privatePem, 'rsa-pss', 'SHA-256')).toEqual({
      success: false,
      error: 'key-import-failed',
    });
    expect(await signText('a', ec.privatePem, 'ecdsa-p384', 'SHA-384')).toEqual(
      { success: false, error: 'key-import-failed' },
    );
  });

  it('鍵の種類の取り違えを検出する', async () => {
    const ec = await makePair('ecdsa-p256');
    expect(await signText('a', ec.publicPem, 'ecdsa-p256', 'SHA-256')).toEqual({
      success: false,
      error: 'wrong-key-kind',
    });
    expect(
      await verifyText('a', 'AAAA', ec.privatePem, 'ecdsa-p256', 'SHA-256'),
    ).toEqual({ success: false, error: 'wrong-key-kind' });
  });

  it('不正なPEMはエラーになる', async () => {
    expect(await signText('a', '', 'rsa-pss', 'SHA-256')).toEqual({
      success: false,
      error: 'invalid-pem',
    });
    expect(
      await signText(
        'a',
        '-----BEGIN RSA PRIVATE KEY-----\nAAAA\n-----END RSA PRIVATE KEY-----',
        'rsa-pss',
        'SHA-256',
      ),
    ).toEqual({ success: false, error: 'invalid-pem' });
    expect(
      await signText(
        'a',
        '-----BEGIN PRIVATE KEY-----\nAAAA\n-----END PRIVATE KEY-----',
        'ecdsa-p256',
        'SHA-256',
      ),
    ).toEqual({ success: false, error: 'key-import-failed' });
  });

  it('不正なBase64署名はエラーになる', async () => {
    const { publicPem } = await makePair('ecdsa-p256');
    expect(
      await verifyText('a', '***', publicPem, 'ecdsa-p256', 'SHA-256'),
    ).toEqual({ success: false, error: 'invalid-signature' });
    expect(
      await verifyText('a', '', publicPem, 'ecdsa-p256', 'SHA-256'),
    ).toEqual({ success: false, error: 'invalid-signature' });
  });

  it('壊れた長さの署名は valid: false', async () => {
    const { publicPem } = await makePair('ecdsa-p256');
    expect(
      await verifyText('a', 'AAAA', publicPem, 'ecdsa-p256', 'SHA-256'),
    ).toEqual({ success: true, valid: false });
  });

  it('defaultHash は曲に合わせる', () => {
    expect(defaultHash('rsa-pss')).toBe('SHA-256');
    expect(defaultHash('ecdsa-p384')).toBe('SHA-384');
    expect(defaultHash('ecdsa-p521')).toBe('SHA-512');
  });
});
