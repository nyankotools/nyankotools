export type PemKind = 'public' | 'private';

export interface ParsedPem {
  label: string;
  der: Uint8Array<ArrayBuffer>;
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

/** Base64文字列をバイト列にする。不正なら null */
export function base64ToBytes(text: string): Uint8Array<ArrayBuffer> | null {
  const compact = text.replace(/\s+/g, '');
  if (compact === '' || !/^[A-Za-z0-9+/]+={0,2}$/.test(compact)) return null;
  try {
    return Uint8Array.from(atob(compact), (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

/** 最初のPEMブロックを取り出す。ブロックが無い・Base64が不正なら null */
export function parsePem(input: string): ParsedPem | null {
  const m = /-----BEGIN ([A-Z0-9 ]+)-----([\s\S]*?)-----END \1-----/.exec(
    input,
  );
  if (!m) return null;
  const der = base64ToBytes(m[2]);
  return der ? { label: m[1], der } : null;
}

/** PEMのラベルから公開鍵（SPKI）・秘密鍵（PKCS#8）かを判定する。未対応のラベルは null */
export function pemKind(label: string): PemKind | null {
  if (label === 'PUBLIC KEY') return 'public';
  if (label === 'PRIVATE KEY') return 'private';
  return null;
}
