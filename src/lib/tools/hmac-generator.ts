export const HMAC_ALGORITHMS = [
  'SHA-1',
  'SHA-256',
  'SHA-384',
  'SHA-512',
] as const;

export type HmacAlgorithm = (typeof HMAC_ALGORITHMS)[number];
export type KeyFormat = 'text' | 'hex';
export type OutputFormat = 'hex' | 'base64' | 'base64url';

export type HmacResult =
  | { success: true; bytes: Uint8Array }
  | { success: false; error: 'invalid-hex' };

/** HMACのブロック長（バイト）。SHA-1/256は64、SHA-384/512は128 */
function blockSize(algorithm: HmacAlgorithm): number {
  return algorithm === 'SHA-384' || algorithm === 'SHA-512' ? 128 : 64;
}

/** 16進数文字列（空白・コロン区切り可）をバイト列にする。不正なら null */
export function parseHex(input: string): Uint8Array | null {
  const hex = input.replace(/[\s:]/g, '');
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(hex)) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function formatBytes(bytes: Uint8Array, format: OutputFormat): string {
  if (format === 'hex') return bytesToHex(bytes);
  const base64 = bytesToBase64(bytes);
  if (format === 'base64') return base64;
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** 鍵バイト列とデータからHMACを計算する（TOTPなど他ツールからも使う） */
export async function hmacBytes(
  key: Uint8Array,
  data: Uint8Array,
  algorithm: HmacAlgorithm,
): Promise<Uint8Array> {
  // Web Crypto は長さ0の鍵を拒否する。HMACの鍵はブロック長までゼロ埋めされるため、
  // 空の鍵はブロック長ぶんのゼロ鍵と等価
  const keyData = key.length === 0 ? new Uint8Array(blockSize(algorithm)) : key;
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData as BufferSource,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    data as BufferSource,
  );
  return new Uint8Array(signature);
}

/** メッセージ（UTF-8）と鍵からHMACを計算する */
export async function computeHmac(
  message: string,
  key: string,
  keyFormat: KeyFormat,
  algorithm: HmacAlgorithm,
): Promise<HmacResult> {
  const encoder = new TextEncoder();
  let keyBytes: Uint8Array;
  if (keyFormat === 'hex') {
    const parsed = parseHex(key);
    if (!parsed) return { success: false, error: 'invalid-hex' };
    keyBytes = parsed;
  } else {
    keyBytes = encoder.encode(key);
  }
  const bytes = await hmacBytes(keyBytes, encoder.encode(message), algorithm);
  return { success: true, bytes };
}

/**
 * 期待する署名と計算結果が一致するか比較する。
 * 16進は大文字小文字・空白を無視し、Base64系は末尾の=を無視する
 */
export function matchesExpected(
  bytes: Uint8Array,
  expected: string,
): OutputFormat | null {
  const trimmed = expected.trim();
  if (trimmed === '') return null;
  const hex = trimmed.replace(/[\s:]/g, '').toLowerCase();
  if (hex === bytesToHex(bytes)) return 'hex';
  const stripped = trimmed.replace(/=+$/, '');
  if (stripped === formatBytes(bytes, 'base64').replace(/=+$/, '')) {
    return 'base64';
  }
  if (stripped === formatBytes(bytes, 'base64url')) return 'base64url';
  return null;
}
