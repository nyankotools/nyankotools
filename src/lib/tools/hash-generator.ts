export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256';

export const HASH_ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256'];

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

function leftRotate(value: number, shift: number): number {
  return ((value << shift) | (value >>> (32 - shift))) >>> 0;
}

/** RFC 1321準拠のMD5ハッシュを計算する（Web Crypto APIはMD5に対応していないため独自実装） */
function md5(message: Uint8Array): Uint8Array {
  const SHIFTS = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
    9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
    16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10,
    15, 21,
  ];
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0;
  }

  const bitLength = message.length * 8;
  let paddedLength = message.length + 1;
  while (paddedLength % 64 !== 56) paddedLength++;
  paddedLength += 8;

  const padded = new Uint8Array(paddedLength);
  padded.set(message);
  padded[message.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 2 ** 32) >>> 0, true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let chunkStart = 0; chunkStart < paddedLength; chunkStart += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] = view.getUint32(chunkStart + j * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }
      f = (f + a + K[i] + M[g]) >>> 0;
      a = d;
      d = c;
      c = b;
      b = (b + leftRotate(f, SHIFTS[i])) >>> 0;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const result = new Uint8Array(16);
  const resultView = new DataView(result.buffer);
  resultView.setUint32(0, a0, true);
  resultView.setUint32(4, b0, true);
  resultView.setUint32(8, c0, true);
  resultView.setUint32(12, d0, true);
  return result;
}

/** 指定したアルゴリズムでテキストのハッシュ値（16進数文字列）を計算する */
export async function computeHash(
  text: string,
  algorithm: HashAlgorithm,
): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  if (algorithm === 'MD5') {
    return bytesToHex(md5(bytes));
  }
  const digest = await crypto.subtle.digest(algorithm, bytes);
  return bytesToHex(new Uint8Array(digest));
}

/** 複数アルゴリズムのハッシュ値をまとめて計算する */
export async function computeHashes(
  text: string,
  algorithms: HashAlgorithm[] = HASH_ALGORITHMS,
): Promise<Record<HashAlgorithm, string>> {
  const entries = await Promise.all(
    algorithms.map(
      async (algorithm) =>
        [algorithm, await computeHash(text, algorithm)] as const,
    ),
  );
  return Object.fromEntries(entries) as Record<HashAlgorithm, string>;
}
