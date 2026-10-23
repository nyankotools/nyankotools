import { base64ToBytes, parsePem } from '../pem';

export type SignatureAlgorithm =
  'rsa-pss' | 'ecdsa-p256' | 'ecdsa-p384' | 'ecdsa-p521';

export type SignatureHash = 'SHA-256' | 'SHA-384' | 'SHA-512';

export const signatureAlgorithms: SignatureAlgorithm[] = [
  'rsa-pss',
  'ecdsa-p256',
  'ecdsa-p384',
  'ecdsa-p521',
];

export const signatureHashes: SignatureHash[] = [
  'SHA-256',
  'SHA-384',
  'SHA-512',
];

/** 曲に合わせた既定のハッシュ（RSA-PSSはSHA-256） */
export function defaultHash(algorithm: SignatureAlgorithm): SignatureHash {
  switch (algorithm) {
    case 'ecdsa-p384':
      return 'SHA-384';
    case 'ecdsa-p521':
      return 'SHA-512';
    default:
      return 'SHA-256';
  }
}

export type SignatureError =
  | 'invalid-pem' // PEMとして読めない
  | 'wrong-key-kind' // 署名に公開鍵、検証に秘密鍵が渡された
  | 'key-import-failed' // 選んだアルゴリズムの鍵として読めない
  | 'invalid-signature' // 署名がBase64として不正
  | 'failed'; // その他の失敗

export type SignResult =
  | { success: true; signature: string }
  | { success: false; error: SignatureError };

export type VerifyResult =
  { success: true; valid: boolean } | { success: false; error: SignatureError };

function hashBytes(hash: SignatureHash): number {
  return Number(hash.slice(4)) / 8;
}

function importParams(
  algorithm: SignatureAlgorithm,
  hash: SignatureHash,
): RsaHashedImportParams | EcKeyImportParams {
  switch (algorithm) {
    case 'rsa-pss':
      return { name: 'RSA-PSS', hash };
    case 'ecdsa-p256':
      return { name: 'ECDSA', namedCurve: 'P-256' };
    case 'ecdsa-p384':
      return { name: 'ECDSA', namedCurve: 'P-384' };
    case 'ecdsa-p521':
      return { name: 'ECDSA', namedCurve: 'P-521' };
  }
}

function signParams(
  algorithm: SignatureAlgorithm,
  hash: SignatureHash,
): RsaPssParams | EcdsaParams {
  if (algorithm === 'rsa-pss') {
    return { name: 'RSA-PSS', saltLength: hashBytes(hash) };
  }
  return { name: 'ECDSA', hash };
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

type KeyResult =
  { ok: true; key: CryptoKey } | { ok: false; error: SignatureError };

async function importPemKey(
  pem: string,
  expected: 'private' | 'public',
  algorithm: SignatureAlgorithm,
  hash: SignatureHash,
): Promise<KeyResult> {
  const parsed = parsePem(pem);
  if (!parsed) return { ok: false, error: 'invalid-pem' };
  let format: 'pkcs8' | 'spki';
  if (parsed.label === 'PRIVATE KEY') format = 'pkcs8';
  else if (parsed.label === 'PUBLIC KEY') format = 'spki';
  else return { ok: false, error: 'invalid-pem' };
  if ((format === 'pkcs8') !== (expected === 'private')) {
    return { ok: false, error: 'wrong-key-kind' };
  }
  try {
    const key = await crypto.subtle.importKey(
      format,
      parsed.der,
      importParams(algorithm, hash),
      false,
      [expected === 'private' ? 'sign' : 'verify'],
    );
    return { ok: true, key };
  } catch {
    return { ok: false, error: 'key-import-failed' };
  }
}

/** テキスト（UTF-8）に署名し、署名をBase64で返す。ECDSAはr||s（IEEE P1363）形式 */
export async function signText(
  text: string,
  privateKeyPem: string,
  algorithm: SignatureAlgorithm,
  hash: SignatureHash,
): Promise<SignResult> {
  const imported = await importPemKey(
    privateKeyPem,
    'private',
    algorithm,
    hash,
  );
  if (!imported.ok) return { success: false, error: imported.error };
  try {
    const sig = await crypto.subtle.sign(
      signParams(algorithm, hash),
      imported.key,
      new TextEncoder().encode(text),
    );
    return { success: true, signature: bytesToBase64(new Uint8Array(sig)) };
  } catch {
    return { success: false, error: 'failed' };
  }
}

/** 署名（Base64）を公開鍵で検証する。署名が合わない場合は valid: false */
export async function verifyText(
  text: string,
  signatureBase64: string,
  publicKeyPem: string,
  algorithm: SignatureAlgorithm,
  hash: SignatureHash,
): Promise<VerifyResult> {
  const signature = base64ToBytes(signatureBase64);
  if (!signature) return { success: false, error: 'invalid-signature' };
  const imported = await importPemKey(publicKeyPem, 'public', algorithm, hash);
  if (!imported.ok) return { success: false, error: imported.error };
  try {
    const valid = await crypto.subtle.verify(
      signParams(algorithm, hash),
      imported.key,
      signature,
      new TextEncoder().encode(text),
    );
    return { success: true, valid };
  } catch {
    return { success: false, error: 'failed' };
  }
}
