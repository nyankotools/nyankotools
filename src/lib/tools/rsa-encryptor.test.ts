import { beforeAll, describe, expect, it } from 'vitest';
import { toPem } from '../pem';
import { generateKeyPair } from './keypair-generator';
import {
  decryptWithPrivateKey,
  encryptWithPublicKey,
  loadKey,
  maxPlaintextBytes,
} from './rsa-encryptor';

let publicKey = '';
let privateKey = '';
let smallPublic = '';
let smallPrivate = '';

async function rsaPair(bits: number) {
  const pair = (await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: bits,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  )) as CryptoKeyPair;
  return {
    pub: toPem(
      await crypto.subtle.exportKey('spki', pair.publicKey),
      'PUBLIC KEY',
    ),
    priv: toPem(
      await crypto.subtle.exportKey('pkcs8', pair.privateKey),
      'PRIVATE KEY',
    ),
  };
}

beforeAll(async () => {
  const r = await generateKeyPair('rsa-2048');
  if (!r.success) throw new Error('keygen');
  publicKey = r.keyPair.publicKey;
  privateKey = r.keyPair.privateKey;
  const small = await rsaPair(1024);
  smallPublic = small.pub;
  smallPrivate = small.priv;
}, 60_000);

describe('maxPlaintextBytes', () => {
  it('modulusLength/8 - 66 バイト', () => {
    expect(maxPlaintextBytes(2048)).toBe(190);
    expect(maxPlaintextBytes(3072)).toBe(318);
    expect(maxPlaintextBytes(4096)).toBe(446);
    expect(maxPlaintextBytes(1024)).toBe(62);
  });
});

describe('rsa-encryptor', () => {
  it('keypair-generatorの鍵で暗号化→復号の往復ができる（日本語・絵文字）', async () => {
    const plain = 'こんにちは 🐱';
    const enc = await encryptWithPublicKey(plain, publicKey);
    expect(enc.success).toBe(true);
    if (!enc.success) return;
    expect(enc.modulusBits).toBe(2048);
    expect(enc.maxBytes).toBe(190);
    expect(enc.ciphertext).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(await decryptWithPrivateKey(enc.ciphertext, privateKey)).toEqual({
      success: true,
      text: plain,
    });
  });

  it('毎回異なる暗号文になる（OAEPのランダム性）', async () => {
    const a = await encryptWithPublicKey('same', publicKey);
    const b = await encryptWithPublicKey('same', publicKey);
    expect(a.success && b.success && a.ciphertext !== b.ciphertext).toBe(true);
  });

  it('空文字も往復できる', async () => {
    const enc = await encryptWithPublicKey('', publicKey);
    if (!enc.success) throw new Error('enc');
    expect(await decryptWithPrivateKey(enc.ciphertext, privateKey)).toEqual({
      success: true,
      text: '',
    });
  });

  it('上限ちょうどは暗号化でき、1バイト超過はエラー', async () => {
    const ok = await encryptWithPublicKey('a'.repeat(62), smallPublic);
    expect(ok.success).toBe(true);
    if (ok.success) {
      expect(await decryptWithPrivateKey(ok.ciphertext, smallPrivate)).toEqual({
        success: true,
        text: 'a'.repeat(62),
      });
    }
    const over = await encryptWithPublicKey('a'.repeat(63), smallPublic);
    expect(over).toEqual({
      success: false,
      error: 'too-long',
      modulusBits: 1024,
      maxBytes: 62,
      length: 63,
    });
  });

  it('上限はUTF-8のバイト数で判定する', async () => {
    // 日本語1文字=3バイト。21文字=63バイトで超過
    const r = await encryptWithPublicKey('あ'.repeat(21), smallPublic);
    expect(r.success).toBe(false);
    if (!r.success) expect(r.length).toBe(63);
  });

  it('暗号化に秘密鍵、復号に公開鍵を渡すと wrong-kind', async () => {
    expect(await encryptWithPublicKey('x', privateKey)).toEqual({
      success: false,
      error: 'wrong-kind',
    });
    expect(await decryptWithPrivateKey('AAAA', publicKey)).toEqual({
      success: false,
      error: 'wrong-kind',
    });
  });

  it('不正なPEM・空の鍵・未対応ラベル', async () => {
    expect(await loadKey('', 'public')).toEqual({
      success: false,
      error: 'empty-key',
    });
    expect(await loadKey('hello', 'public')).toEqual({
      success: false,
      error: 'invalid-pem',
    });
    expect(
      await loadKey(
        '-----BEGIN RSA PRIVATE KEY-----\nAAAA\n-----END RSA PRIVATE KEY-----',
        'private',
      ),
    ).toEqual({ success: false, error: 'unsupported-key' });
    expect(
      await loadKey(
        '-----BEGIN PUBLIC KEY-----\nAAAA\n-----END PUBLIC KEY-----',
        'public',
      ),
    ).toEqual({ success: false, error: 'unsupported-key' });
  });

  it('RSA以外の鍵（EC）は unsupported-key', async () => {
    const ec = await generateKeyPair('ec-p256');
    if (!ec.success) throw new Error('keygen');
    expect(await encryptWithPublicKey('x', ec.keyPair.publicKey)).toEqual({
      success: false,
      error: 'unsupported-key',
    });
  });

  it('暗号文の形式不正・別の鍵・改ざんはエラー', async () => {
    const enc = await encryptWithPublicKey('secret', publicKey);
    if (!enc.success) throw new Error('enc');
    expect(await decryptWithPrivateKey('not base64!', privateKey)).toEqual({
      success: false,
      error: 'invalid-format',
    });
    expect(await decryptWithPrivateKey('AAAA', privateKey)).toEqual({
      success: false,
      error: 'invalid-format',
    });
    // 別の鍵（長さ違い）
    expect(await decryptWithPrivateKey(enc.ciphertext, smallPrivate)).toEqual({
      success: false,
      error: 'invalid-format',
    });
    // 同じ長さの別の鍵
    const other = await generateKeyPair('rsa-2048');
    if (!other.success) throw new Error('keygen');
    expect(
      await decryptWithPrivateKey(enc.ciphertext, other.keyPair.privateKey),
    ).toEqual({ success: false, error: 'decrypt-failed' });
    // 改ざん
    const bytes = Uint8Array.from(atob(enc.ciphertext), (c) => c.charCodeAt(0));
    bytes[10] ^= 0xff;
    const tampered = btoa(String.fromCharCode(...bytes));
    expect(await decryptWithPrivateKey(tampered, privateKey)).toEqual({
      success: false,
      error: 'decrypt-failed',
    });
  });

  it('暗号文の改行・空白は無視して復号できる', async () => {
    const enc = await encryptWithPublicKey('wrap', publicKey);
    if (!enc.success) throw new Error('enc');
    const wrapped = enc.ciphertext.replace(/(.{40})/g, '$1\n  ');
    expect(await decryptWithPrivateKey(wrapped, privateKey)).toEqual({
      success: true,
      text: 'wrap',
    });
  });
});
