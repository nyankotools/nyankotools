export type KeyAlgorithm =
  | 'rsa-2048'
  | 'rsa-3072'
  | 'rsa-4096'
  | 'ec-p256'
  | 'ec-p384'
  | 'ec-p521'
  | 'ed25519';

export const keyAlgorithms: KeyAlgorithm[] = [
  'rsa-2048',
  'rsa-3072',
  'rsa-4096',
  'ec-p256',
  'ec-p384',
  'ec-p521',
  'ed25519',
];

export interface KeyPairPem {
  publicKey: string;
  privateKey: string;
}

export type KeyPairResult =
  | { success: true; keyPair: KeyPairPem }
  | { success: false; error: 'unsupported' };

type GenerateParams =
  RsaHashedKeyGenParams | EcKeyGenParams | { name: 'Ed25519' };

function paramsFor(algorithm: KeyAlgorithm): GenerateParams {
  switch (algorithm) {
    case 'rsa-2048':
    case 'rsa-3072':
    case 'rsa-4096':
      return {
        name: 'RSA-OAEP',
        modulusLength: Number(algorithm.slice(4)),
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      };
    case 'ec-p256':
      return { name: 'ECDSA', namedCurve: 'P-256' };
    case 'ec-p384':
      return { name: 'ECDSA', namedCurve: 'P-384' };
    case 'ec-p521':
      return { name: 'ECDSA', namedCurve: 'P-521' };
    case 'ed25519':
      return { name: 'Ed25519' };
  }
}

function usagesFor(algorithm: KeyAlgorithm): KeyUsage[] {
  if (algorithm.startsWith('rsa')) return ['encrypt', 'decrypt'];
  return ['sign', 'verify'];
}

/** DER（ArrayBuffer）を64文字折り返しのPEMにする */
export function toPem(der: ArrayBuffer, label: string): string {
  const bytes = new Uint8Array(der);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const body = btoa(binary)
    .replace(/(.{64})/g, '$1\n')
    .replace(/\n$/, '');
  return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----\n`;
}

/**
 * 鍵ペアを生成し、公開鍵（SPKI）・秘密鍵（PKCS#8）のPEMで返す。
 * ブラウザが対象アルゴリズム（主にEd25519）に未対応の場合は `unsupported` を返す。
 */
export async function generateKeyPair(
  algorithm: KeyAlgorithm,
): Promise<KeyPairResult> {
  let pair: CryptoKeyPair;
  try {
    pair = (await crypto.subtle.generateKey(
      paramsFor(algorithm),
      true,
      usagesFor(algorithm),
    )) as CryptoKeyPair;
  } catch (e) {
    if (
      e instanceof DOMException &&
      (e.name === 'NotSupportedError' || e.name === 'SyntaxError')
    ) {
      return { success: false, error: 'unsupported' };
    }
    throw e;
  }
  const [spki, pkcs8] = await Promise.all([
    crypto.subtle.exportKey('spki', pair.publicKey),
    crypto.subtle.exportKey('pkcs8', pair.privateKey),
  ]);
  return {
    success: true,
    keyPair: {
      publicKey: toPem(spki, 'PUBLIC KEY'),
      privateKey: toPem(pkcs8, 'PRIVATE KEY'),
    },
  };
}
