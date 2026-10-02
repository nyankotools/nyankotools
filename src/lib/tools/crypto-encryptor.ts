/** PBKDF2の反復回数（OWASPのSHA-256向け推奨値） */
export const PBKDF2_ITERATIONS = 600_000;

const VERSION = 1;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const HEADER_LENGTH = 1 + SALT_LENGTH + IV_LENGTH;

export type DecryptResult =
  | { success: true; text: string }
  | { success: false; error: 'invalid-format' | 'wrong-password' };

async function deriveKey(
  password: string,
  salt: Uint8Array,
  usage: 'encrypt' | 'decrypt',
): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password) as BufferSource,
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    [usage],
  );
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(input: string): Uint8Array | null {
  const cleaned = input.replace(/\s/g, '');
  if (cleaned === '' || !/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) return null;
  try {
    const binary = atob(cleaned);
    return Uint8Array.from(binary, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

/**
 * テキストをパスワードでAES-256-GCM暗号化し、Base64文字列を返す。
 * 形式: バージョン(1) + ソルト(16) + IV(12) + 暗号文・認証タグ
 */
export async function encryptText(
  plaintext: string,
  password: string,
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt, 'encrypt');
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      new TextEncoder().encode(plaintext) as BufferSource,
    ),
  );
  const out = new Uint8Array(HEADER_LENGTH + encrypted.length);
  out[0] = VERSION;
  out.set(salt, 1);
  out.set(iv, 1 + SALT_LENGTH);
  out.set(encrypted, HEADER_LENGTH);
  return toBase64(out);
}

/** `encryptText` の出力を復号する。形式不正とパスワード違い（改ざん含む）を区別して返す */
export async function decryptText(
  payload: string,
  password: string,
): Promise<DecryptResult> {
  const bytes = fromBase64(payload);
  if (
    !bytes ||
    bytes.length < HEADER_LENGTH + TAG_LENGTH ||
    bytes[0] !== VERSION
  ) {
    return { success: false, error: 'invalid-format' };
  }
  const salt = bytes.slice(1, 1 + SALT_LENGTH);
  const iv = bytes.slice(1 + SALT_LENGTH, HEADER_LENGTH);
  const data = bytes.slice(HEADER_LENGTH);
  try {
    const key = await deriveKey(password, salt, 'decrypt');
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      data as BufferSource,
    );
    const text = new TextDecoder('utf-8', { fatal: true }).decode(decrypted);
    return { success: true, text };
  } catch {
    return { success: false, error: 'wrong-password' };
  }
}
