import { md5Hex } from './hash-generator';

export type SshFingerprintError = 'invalid-format' | 'unsupported-type';

export interface SshFingerprint {
  /** 例: ssh-ed25519 */
  keyType: string;
  /** ssh-keygen -l の括弧内に表示される名前（RSA / ED25519 など） */
  algorithm: string;
  /** 鍵長（ビット）。取得できなければ null */
  bits: number | null;
  comment: string;
  /** SHA256:xxxx（Base64、末尾の = なし） */
  sha256: string;
  /** MD5:aa:bb:...（旧形式） */
  md5: string;
}

export type SshLineResult =
  | { success: true; line: number; fingerprint: SshFingerprint }
  | { success: false; line: number; error: SshFingerprintError };

const KEY_TYPES: Record<string, string> = {
  'ssh-rsa': 'RSA',
  'ssh-dss': 'DSA',
  'ssh-ed25519': 'ED25519',
  'ecdsa-sha2-nistp256': 'ECDSA',
  'ecdsa-sha2-nistp384': 'ECDSA',
  'ecdsa-sha2-nistp521': 'ECDSA',
  'sk-ssh-ed25519@openssh.com': 'ED25519-SK',
  'sk-ecdsa-sha2-nistp256@openssh.com': 'ECDSA-SK',
};

const ECDSA_BITS: Record<string, number> = {
  nistp256: 256,
  nistp384: 384,
  nistp521: 521,
};

function decodeBase64(text: string): Uint8Array | null {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(text)) return null;
  try {
    const binary = atob(text);
    return Uint8Array.from(binary, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

function encodeBase64NoPad(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/=+$/, '');
}

/** 公開鍵blobの先頭から SSH wire形式の string / mpint を順に読む */
class BlobReader {
  private offset = 0;
  constructor(private readonly data: Uint8Array) {}

  readBytes(): Uint8Array | null {
    if (this.offset + 4 > this.data.length) return null;
    const view = new DataView(
      this.data.buffer,
      this.data.byteOffset + this.offset,
      4,
    );
    const length = view.getUint32(0);
    const start = this.offset + 4;
    if (start + length > this.data.length) return null;
    this.offset = start + length;
    return this.data.subarray(start, start + length);
  }
}

/** 先頭のゼロバイトを除いたビット長（mpint用） */
function bitLength(bytes: Uint8Array): number {
  let i = 0;
  while (i < bytes.length && bytes[i] === 0) i++;
  if (i === bytes.length) return 0;
  return (bytes.length - i - 1) * 8 + (32 - Math.clz32(bytes[i]));
}

function keyBits(keyType: string, reader: BlobReader): number | null {
  if (keyType === 'ssh-rsa') {
    if (!reader.readBytes()) return null; // e
    const n = reader.readBytes();
    return n ? bitLength(n) : null;
  }
  if (keyType === 'ssh-dss') {
    const p = reader.readBytes();
    return p ? bitLength(p) : null;
  }
  if (keyType.includes('ed25519')) return 256;
  if (keyType.startsWith('ecdsa-sha2-') || keyType.startsWith('sk-ecdsa-')) {
    const curve = reader.readBytes();
    if (!curve) return null;
    return ECDSA_BITS[new TextDecoder().decode(curve)] ?? null;
  }
  return null;
}

async function fingerprintOf(
  blob: Uint8Array,
  keyType: string,
  comment: string,
): Promise<SshFingerprint | null> {
  const reader = new BlobReader(blob);
  const typeBytes = reader.readBytes();
  // blob内の鍵種別と行頭の鍵種別が食い違うものは壊れた鍵として扱う
  if (!typeBytes || new TextDecoder().decode(typeBytes) !== keyType)
    return null;

  const digest = new Uint8Array(
    await crypto.subtle.digest('SHA-256', blob as BufferSource),
  );
  const md5 = md5Hex(blob).replace(/(..)(?!$)/g, '$1:');
  return {
    keyType,
    algorithm: KEY_TYPES[keyType],
    bits: keyBits(keyType, reader),
    comment,
    sha256: `SHA256:${encodeBase64NoPad(digest)}`,
    md5: `MD5:${md5}`,
  };
}

/**
 * 公開鍵1行（authorized_keys形式。先頭にオプションがあってもよい）を解析する。
 * 鍵種別が見つからなければ invalid-format、未知の鍵種別なら unsupported-type
 */
async function parseLine(text: string, line: number): Promise<SshLineResult> {
  const tokens = text.split(/\s+/);
  const typeIndex = tokens.findIndex((t) => Object.hasOwn(KEY_TYPES, t));
  if (typeIndex === -1) {
    const looksLikeKeyType = tokens.some((t) => /^(ssh|ecdsa|sk)-/.test(t));
    return {
      success: false,
      line,
      error: looksLikeKeyType ? 'unsupported-type' : 'invalid-format',
    };
  }
  const keyType = tokens[typeIndex];
  const blob = tokens[typeIndex + 1]
    ? decodeBase64(tokens[typeIndex + 1])
    : null;
  if (!blob) return { success: false, line, error: 'invalid-format' };
  const comment = tokens.slice(typeIndex + 2).join(' ');
  const fingerprint = await fingerprintOf(blob, keyType, comment);
  if (!fingerprint) return { success: false, line, error: 'invalid-format' };
  return { success: true, line, fingerprint };
}

/** 複数行の公開鍵（authorized_keys）を解析する。空行と # コメント行は無視する */
export async function computeSshFingerprints(
  input: string,
): Promise<SshLineResult[]> {
  const results: SshLineResult[] = [];
  const lines = input.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i].trim();
    if (text === '' || text.startsWith('#')) continue;
    results.push(await parseLine(text, i + 1));
  }
  return results;
}
