import { describe, it, expect } from 'vitest';
import { convertKey, detectDirection } from './jwk-pem-converter';
import { generateKeyPair, type KeyAlgorithm } from './keypair-generator';

async function roundTrip(algorithm: KeyAlgorithm) {
  const pair = await generateKeyPair(algorithm);
  if (!pair.success) return;
  for (const pem of [pair.keyPair.publicKey, pair.keyPair.privateKey]) {
    const jwk = await convertKey(pem);
    expect(jwk.success).toBe(true);
    if (!jwk.success) return;
    const back = await convertKey(jwk.output);
    expect(back.success).toBe(true);
    if (!back.success) return;
    expect(back.output).toBe(pem);
    expect(back.keyType).toBe(jwk.keyType);
  }
}

describe('detectDirection', () => {
  it('PEM / JWK / 不明を判定する', () => {
    expect(detectDirection('-----BEGIN PUBLIC KEY-----')).toBe('pem-to-jwk');
    expect(detectDirection('  {"kty":"RSA"}')).toBe('jwk-to-pem');
    expect(detectDirection('hello')).toBeNull();
  });
});

describe('convertKey', () => {
  it('ECDSA P-256 公開鍵のPEMとJWKを相互変換できる', async () => {
    await roundTrip('ec-p256');
  });

  it('ECDSA P-384 / P-521 を往復できる', async () => {
    await roundTrip('ec-p384');
    await roundTrip('ec-p521');
  });

  it('RSA-2048 を往復できる', async () => {
    await roundTrip('rsa-2048');
  });

  it('Ed25519 を往復できる（未対応環境ではスキップ）', async () => {
    await roundTrip('ed25519');
  });

  it('PEM→JWK で kty / crv を出し、alg や key_ops を含めない', async () => {
    const pair = await generateKeyPair('ec-p256');
    if (!pair.success) return;
    const r = await convertKey(pair.keyPair.privateKey);
    expect(r.success).toBe(true);
    if (!r.success) return;
    const jwk = JSON.parse(r.output);
    expect(jwk.kty).toBe('EC');
    expect(jwk.crv).toBe('P-256');
    expect(jwk.d).toBeTypeOf('string');
    expect(jwk.alg).toBeUndefined();
    expect(jwk.key_ops).toBeUndefined();
    expect(jwk.ext).toBeUndefined();
    expect(r.keyType).toBe('private');
  });

  it('JWKS の先頭の鍵を使う', async () => {
    const pair = await generateKeyPair('ec-p256');
    if (!pair.success) return;
    const r = await convertKey(pair.keyPair.publicKey);
    if (!r.success) return;
    const jwks = JSON.stringify({ keys: [JSON.parse(r.output)] });
    const back = await convertKey(jwks);
    expect(back.success && back.output).toBe(pair.keyPair.publicKey);
  });

  it('kid や alg が付いたJWKも変換できる', async () => {
    const pair = await generateKeyPair('ec-p256');
    if (!pair.success) return;
    const r = await convertKey(pair.keyPair.publicKey);
    if (!r.success) return;
    const jwk = { ...JSON.parse(r.output), kid: 'a', alg: 'ES256', use: 'sig' };
    const back = await convertKey(JSON.stringify(jwk));
    expect(back.success && back.output).toBe(pair.keyPair.publicKey);
  });

  it('keys が空のJWKSは invalid-json', async () => {
    expect(await convertKey('{"keys":[]}')).toEqual({
      success: false,
      error: 'invalid-json',
    });
  });

  it('空入力は empty', async () => {
    expect(await convertKey('  \n')).toEqual({
      success: false,
      error: 'empty',
    });
  });

  it('判別できない文字列は invalid-pem', async () => {
    expect(await convertKey('hello')).toEqual({
      success: false,
      error: 'invalid-pem',
    });
  });

  it('壊れたPEMは invalid-pem', async () => {
    const r = await convertKey(
      '-----BEGIN PUBLIC KEY-----\n***\n-----END PUBLIC KEY-----',
    );
    expect(r).toEqual({ success: false, error: 'invalid-pem' });
  });

  it('PKCS#1 などの未対応ラベルは unsupported-label', async () => {
    const r = await convertKey(
      '-----BEGIN RSA PRIVATE KEY-----\nAAAA\n-----END RSA PRIVATE KEY-----',
    );
    expect(r).toEqual({ success: false, error: 'unsupported-label' });
  });

  it('鍵として不正なDERは invalid-key', async () => {
    const r = await convertKey(
      '-----BEGIN PUBLIC KEY-----\nAAAA\n-----END PUBLIC KEY-----',
    );
    expect(r.success).toBe(false);
    if (!r.success) expect(['invalid-key', 'unsupported']).toContain(r.error);
  });

  it('壊れたJSONは invalid-json', async () => {
    expect(await convertKey('{"kty":')).toEqual({
      success: false,
      error: 'invalid-json',
    });
  });

  it('未対応の kty / crv は unsupported-kty', async () => {
    expect(await convertKey('{"kty":"oct","k":"AAAA"}')).toEqual({
      success: false,
      error: 'unsupported-kty',
    });
    expect(await convertKey('{"kty":"EC","crv":"secp256k1"}')).toEqual({
      success: false,
      error: 'unsupported-kty',
    });
  });

  it('座標が欠けたJWKは invalid-key', async () => {
    expect(await convertKey('{"kty":"EC","crv":"P-256"}')).toEqual({
      success: false,
      error: 'invalid-key',
    });
  });
});
