// Shamir秘密分散（GF(256)）。UI文言は持たない。
//
// シェア形式（16進文字列）: バージョン(1B=0x01) + しきい値k(1B) + x座標(1B, 1〜255) + データ
// データ = 各バイトの多項式評価値。元のデータは「UTF-8の秘密 + CRC32(4B)」で、
// 復元時にCRC32で検証し、シェアの取り違えや破損を検出する。

export const MIN_SHARES = 2;
export const MAX_SHARES = 255;
const VERSION = 1;
const HEADER_LENGTH = 3;
const CHECKSUM_LENGTH = 4;

export type SplitError =
  | 'empty-secret'
  | 'invalid-count'
  | 'invalid-threshold'
  | 'threshold-exceeds-count';

export type CombineError =
  | 'no-shares'
  | 'invalid-format'
  | 'length-mismatch'
  | 'duplicate-x'
  | 'threshold-mismatch'
  | 'not-enough-shares'
  | 'corrupted';

export type SplitResult =
  { success: true; shares: string[] } | { success: false; error: SplitError };

export type CombineResult =
  | { success: true; secret: string }
  | { success: false; error: CombineError; index?: number };

export type RandomFill = (buffer: Uint8Array) => void;

// --- GF(256)（既約多項式 x^8+x^4+x^3+x+1 = 0x11b、生成元 3） ---
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let v = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = v;
    LOG[v] = i;
    // v *= 3
    let doubled = v << 1;
    if (doubled & 0x100) doubled ^= 0x11b;
    v = doubled ^ v;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

export function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

export function gfDiv(a: number, b: number): number {
  if (b === 0) throw new RangeError('division by zero');
  if (a === 0) return 0;
  return EXP[LOG[a] + 255 - LOG[b]];
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function toHex(bytes: Uint8Array): string {
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

function fromHex(hex: string): Uint8Array | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/.test(hex)) {
    return null;
  }
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

const defaultRandom: RandomFill = (buffer) => {
  // getRandomValues は1回65536バイトまでのため分割して埋める
  for (let i = 0; i < buffer.length; i += 65536) {
    crypto.getRandomValues(
      buffer.subarray(i, i + 65536) as Uint8Array<ArrayBuffer>,
    );
  }
};

/** 秘密（UTF-8テキスト）を n 個のシェアに分割し、k 個以上で復元できるようにする */
export function splitSecret(
  secret: string,
  count: number,
  threshold: number,
  random: RandomFill = defaultRandom,
): SplitResult {
  if (secret === '') return { success: false, error: 'empty-secret' };
  if (!Number.isInteger(count) || count < MIN_SHARES || count > MAX_SHARES) {
    return { success: false, error: 'invalid-count' };
  }
  if (!Number.isInteger(threshold) || threshold < 2) {
    return { success: false, error: 'invalid-threshold' };
  }
  if (threshold > count) {
    return { success: false, error: 'threshold-exceeds-count' };
  }

  const text = new TextEncoder().encode(secret);
  const data = new Uint8Array(text.length + CHECKSUM_LENGTH);
  data.set(text);
  new DataView(data.buffer).setUint32(text.length, crc32(text), false);

  // 各バイトにつき k-1 個のランダム係数を用意する
  const coefficients = new Uint8Array(data.length * (threshold - 1));
  random(coefficients);

  const payloads: Uint8Array[] = [];
  for (let x = 1; x <= count; x++) {
    const payload = new Uint8Array(HEADER_LENGTH + data.length);
    payload[0] = VERSION;
    payload[1] = threshold;
    payload[2] = x;
    for (let i = 0; i < data.length; i++) {
      // ホーナー法: ((c_{k-1} x + ... ) x + c_1) x + secret
      let y = 0;
      for (let d = threshold - 2; d >= 0; d--) {
        y = gfMul(y ^ coefficients[i * (threshold - 1) + d], x);
      }
      payload[HEADER_LENGTH + i] = y ^ data[i];
    }
    payloads.push(payload);
  }
  return { success: true, shares: payloads.map(toHex) };
}

interface ParsedShare {
  threshold: number;
  x: number;
  data: Uint8Array;
}

function parseShare(text: string): ParsedShare | null {
  const bytes = fromHex(text.replace(/\s+/g, '').toLowerCase());
  if (!bytes || bytes.length < HEADER_LENGTH + CHECKSUM_LENGTH + 1) {
    return null;
  }
  const [version, threshold, x] = bytes;
  if (version !== VERSION || threshold < 2 || x < 1) return null;
  return { threshold, x, data: bytes.slice(HEADER_LENGTH) };
}

/** 改行区切りなどで貼り付けられたテキストをシェアの配列にする */
export function splitShareLines(text: string): string[] {
  return text
    .split(/[\r\n]+/)
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

/** シェア（16進文字列）の配列から秘密を復元する */
export function combineShares(shareTexts: string[]): CombineResult {
  if (shareTexts.length === 0) return { success: false, error: 'no-shares' };

  const shares: ParsedShare[] = [];
  for (let i = 0; i < shareTexts.length; i++) {
    const parsed = parseShare(shareTexts[i]);
    if (!parsed) return { success: false, error: 'invalid-format', index: i };
    shares.push(parsed);
  }

  const { threshold } = shares[0];
  const length = shares[0].data.length;
  for (let i = 1; i < shares.length; i++) {
    if (shares[i].threshold !== threshold) {
      return { success: false, error: 'threshold-mismatch', index: i };
    }
    if (shares[i].data.length !== length) {
      return { success: false, error: 'length-mismatch', index: i };
    }
  }
  const seen = new Set<number>();
  for (let i = 0; i < shares.length; i++) {
    if (seen.has(shares[i].x)) {
      return { success: false, error: 'duplicate-x', index: i };
    }
    seen.add(shares[i].x);
  }
  if (shares.length < threshold) {
    return { success: false, error: 'not-enough-shares' };
  }

  // x=0 でのラグランジュ補間（GF(256)では加算・減算ともXOR）
  const weights = shares.map((s, i) => {
    let w = 1;
    shares.forEach((o, j) => {
      if (i !== j) w = gfMul(w, gfDiv(o.x, o.x ^ s.x));
    });
    return w;
  });
  const data = new Uint8Array(length);
  for (let b = 0; b < length; b++) {
    let acc = 0;
    for (let i = 0; i < shares.length; i++) {
      acc ^= gfMul(shares[i].data[b], weights[i]);
    }
    data[b] = acc;
  }

  const text = data.slice(0, length - CHECKSUM_LENGTH);
  const expected = new DataView(data.buffer).getUint32(
    length - CHECKSUM_LENGTH,
    false,
  );
  if (crc32(text) !== expected) return { success: false, error: 'corrupted' };
  try {
    const secret = new TextDecoder('utf-8', { fatal: true }).decode(text);
    return { success: true, secret };
  } catch {
    return { success: false, error: 'corrupted' };
  }
}
