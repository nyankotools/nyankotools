import { parsePem, pemKind, toPem } from '../pem';

export type ConvertDirection = 'pem-to-jwk' | 'jwk-to-pem';
export type KeyType = 'public' | 'private';

export type ConvertError =
  | 'empty'
  | 'invalid-pem'
  | 'unsupported-label'
  | 'invalid-json'
  | 'unsupported-kty'
  | 'invalid-key'
  | 'unsupported';

export type ConvertResult =
  | {
      success: true;
      direction: ConvertDirection;
      keyType: KeyType;
      output: string;
    }
  | { success: false; error: ConvertError };

/** 入力が PEM（-----BEGIN を含む）か JWK（{ で始まる）かを判定する */
export function detectDirection(text: string): ConvertDirection | null {
  const trimmed = text.trim();
  if (trimmed.includes('-----BEGIN')) return 'pem-to-jwk';
  if (trimmed.startsWith('{')) return 'jwk-to-pem';
  return null;
}

type ImportAlgorithm =
  RsaHashedImportParams | EcKeyImportParams | { name: 'Ed25519' };

const PEM_CANDIDATES: ImportAlgorithm[] = [
  { name: 'RSA-OAEP', hash: 'SHA-256' },
  { name: 'ECDSA', namedCurve: 'P-256' },
  { name: 'ECDSA', namedCurve: 'P-384' },
  { name: 'ECDSA', namedCurve: 'P-521' },
  { name: 'Ed25519' },
];

function usagesFor(algorithm: ImportAlgorithm, keyType: KeyType): KeyUsage[] {
  if (algorithm.name === 'RSA-OAEP') {
    return keyType === 'private' ? ['decrypt'] : ['encrypt'];
  }
  return keyType === 'private' ? ['sign'] : ['verify'];
}

function isNotSupported(e: unknown): boolean {
  return (
    e instanceof DOMException &&
    (e.name === 'NotSupportedError' || e.name === 'SyntaxError')
  );
}

/** 出力するJWKからWeb Cryptoが付けるメタ情報（alg / key_ops / ext）を除く */
function cleanExportedJwk(jwk: JsonWebKey): JsonWebKey {
  const { alg, key_ops, ext, use, ...rest } = jwk;
  void alg;
  void key_ops;
  void ext;
  void use;
  return rest;
}

async function pemToJwk(input: string): Promise<ConvertResult> {
  const parsed = parsePem(input);
  if (!parsed) return { success: false, error: 'invalid-pem' };
  const keyType = pemKind(parsed.label);
  if (!keyType) return { success: false, error: 'unsupported-label' };
  const format = keyType === 'public' ? 'spki' : 'pkcs8';

  let ed25519Unsupported = false;
  for (const algorithm of PEM_CANDIDATES) {
    try {
      const key = await crypto.subtle.importKey(
        format,
        parsed.der,
        algorithm,
        true,
        usagesFor(algorithm, keyType),
      );
      const jwk = await crypto.subtle.exportKey('jwk', key);
      return {
        success: true,
        direction: 'pem-to-jwk',
        keyType,
        output: JSON.stringify(cleanExportedJwk(jwk), null, 2),
      };
    } catch (e) {
      if (algorithm.name === 'Ed25519' && isNotSupported(e)) {
        ed25519Unsupported = true;
      }
    }
  }
  return {
    success: false,
    error: ed25519Unsupported ? 'unsupported' : 'invalid-key',
  };
}

const JWK_MEMBERS = [
  'kty',
  'crv',
  'x',
  'y',
  'd',
  'n',
  'e',
  'p',
  'q',
  'dp',
  'dq',
  'qi',
] as const;

async function jwkToPem(input: string): Promise<ConvertResult> {
  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch {
    return { success: false, error: 'invalid-json' };
  }
  // JWKS（{"keys":[...]}）は先頭の鍵を使う
  if (
    data !== null &&
    typeof data === 'object' &&
    Array.isArray((data as { keys?: unknown }).keys)
  ) {
    data = (data as { keys: unknown[] }).keys[0];
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { success: false, error: 'invalid-json' };
  }
  const source = data as Record<string, unknown>;
  const jwk: Record<string, string> = {};
  for (const name of JWK_MEMBERS) {
    const value = source[name];
    if (typeof value === 'string') jwk[name] = value;
  }

  let algorithm: ImportAlgorithm;
  if (jwk.kty === 'RSA') {
    algorithm = { name: 'RSA-OAEP', hash: 'SHA-256' };
  } else if (
    jwk.kty === 'EC' &&
    (jwk.crv === 'P-256' || jwk.crv === 'P-384' || jwk.crv === 'P-521')
  ) {
    algorithm = { name: 'ECDSA', namedCurve: jwk.crv };
  } else if (jwk.kty === 'OKP' && jwk.crv === 'Ed25519') {
    algorithm = { name: 'Ed25519' };
  } else {
    return { success: false, error: 'unsupported-kty' };
  }

  const keyType: KeyType = jwk.d !== undefined ? 'private' : 'public';
  try {
    const key = await crypto.subtle.importKey(
      'jwk',
      jwk as JsonWebKey,
      algorithm,
      true,
      usagesFor(algorithm, keyType),
    );
    const der = await crypto.subtle.exportKey(
      keyType === 'public' ? 'spki' : 'pkcs8',
      key,
    );
    return {
      success: true,
      direction: 'jwk-to-pem',
      keyType,
      output: toPem(der, keyType === 'public' ? 'PUBLIC KEY' : 'PRIVATE KEY'),
    };
  } catch (e) {
    return {
      success: false,
      error: isNotSupported(e) ? 'unsupported' : 'invalid-key',
    };
  }
}

/**
 * PEM（SPKI / PKCS#8）と JWK を相互変換する。入力の形から変換方向を自動判定する。
 * RSA・ECDSA（P-256/384/521）・Ed25519 に対応。
 */
export async function convertKey(input: string): Promise<ConvertResult> {
  if (input.trim() === '') return { success: false, error: 'empty' };
  const direction = detectDirection(input);
  if (direction === 'pem-to-jwk') return pemToJwk(input);
  if (direction === 'jwk-to-pem') return jwkToPem(input.trim());
  return { success: false, error: 'invalid-pem' };
}
