import { base64ToBytes, parsePem, pemKind, type PemKind } from '../pem';

const OAEP_HASH_BYTES = 32; // SHA-256

export type KeyError =
  'empty-key' | 'invalid-pem' | 'wrong-kind' | 'unsupported-key';

export type LoadKeyResult =
  | { success: true; key: CryptoKey; modulusBits: number; maxBytes: number }
  | { success: false; error: KeyError };

export type EncryptResult =
  | {
      success: true;
      ciphertext: string;
      modulusBits: number;
      maxBytes: number;
    }
  | {
      success: false;
      error: KeyError | 'too-long';
      modulusBits?: number;
      maxBytes?: number;
      length?: number;
    };

export type DecryptResult =
  | { success: true; text: string }
  | { success: false; error: KeyError | 'invalid-format' | 'decrypt-failed' };

/** RSA-OAEP（SHA-256）で暗号化できる平文の最大バイト数: modulusLength/8 - 2*32 - 2 */
export function maxPlaintextBytes(modulusBits: number): number {
  return Math.max(0, Math.floor(modulusBits / 8) - 2 * OAEP_HASH_BYTES - 2);
}

/** PEMから鍵を読み込む。expected と種類（公開鍵/秘密鍵）が違えば wrong-kind */
export async function loadKey(
  pem: string,
  expected: PemKind,
): Promise<LoadKeyResult> {
  if (pem.trim() === '') return { success: false, error: 'empty-key' };
  const parsed = parsePem(pem);
  if (!parsed) return { success: false, error: 'invalid-pem' };
  const kind = pemKind(parsed.label);
  if (kind === null) return { success: false, error: 'unsupported-key' };
  if (kind !== expected) return { success: false, error: 'wrong-kind' };
  try {
    const key = await crypto.subtle.importKey(
      expected === 'public' ? 'spki' : 'pkcs8',
      parsed.der,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      [expected === 'public' ? 'encrypt' : 'decrypt'],
    );
    const modulusBits = (key.algorithm as RsaHashedKeyAlgorithm).modulusLength;
    return {
      success: true,
      key,
      modulusBits,
      maxBytes: maxPlaintextBytes(modulusBits),
    };
  } catch {
    return { success: false, error: 'unsupported-key' };
  }
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/** テキスト（UTF-8）を公開鍵PEMでRSA-OAEP暗号化し、Base64を返す */
export async function encryptWithPublicKey(
  plaintext: string,
  publicPem: string,
): Promise<EncryptResult> {
  const loaded = await loadKey(publicPem, 'public');
  if (!loaded.success) return loaded;
  const data = new TextEncoder().encode(plaintext);
  const { modulusBits, maxBytes } = loaded;
  if (data.length > maxBytes) {
    return {
      success: false,
      error: 'too-long',
      modulusBits,
      maxBytes,
      length: data.length,
    };
  }
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, loaded.key, data),
  );
  return {
    success: true,
    ciphertext: toBase64(encrypted),
    modulusBits,
    maxBytes,
  };
}

/** Base64の暗号文を秘密鍵PEMで復号する */
export async function decryptWithPrivateKey(
  ciphertext: string,
  privatePem: string,
): Promise<DecryptResult> {
  const loaded = await loadKey(privatePem, 'private');
  if (!loaded.success) return loaded;
  const bytes = base64ToBytes(ciphertext);
  if (!bytes || bytes.length !== loaded.modulusBits / 8) {
    return { success: false, error: 'invalid-format' };
  }
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      loaded.key,
      bytes,
    );
    const text = new TextDecoder('utf-8', { fatal: true }).decode(decrypted);
    return { success: true, text };
  } catch {
    return { success: false, error: 'decrypt-failed' };
  }
}
