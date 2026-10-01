import { md5Hex } from './hash-generator';

export const FILE_HASH_ALGORITHMS = [
  'MD5',
  'SHA-1',
  'SHA-256',
  'SHA-384',
  'SHA-512',
] as const;

export type FileHashAlgorithm = (typeof FILE_HASH_ALGORITHMS)[number];

/** 1ファイルあたりの上限（全体をメモリに読み込んで計算するため） */
export const MAX_FILE_SIZE = 256 * 1024 * 1024;

/** 16進数ダイジェストの文字数からアルゴリズムを引く */
const HEX_LENGTH_TO_ALGORITHM: Record<number, FileHashAlgorithm> = {
  32: 'MD5',
  40: 'SHA-1',
  64: 'SHA-256',
  96: 'SHA-384',
  128: 'SHA-512',
};

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

/** バイト列の全アルゴリズムのハッシュ値（小文字16進数）を計算する */
export async function computeFileHashes(
  data: Uint8Array<ArrayBuffer>,
): Promise<Record<FileHashAlgorithm, string>> {
  const sha = await Promise.all(
    FILE_HASH_ALGORITHMS.filter((a) => a !== 'MD5').map(
      async (algorithm) =>
        [
          algorithm,
          toHex(new Uint8Array(await crypto.subtle.digest(algorithm, data))),
        ] as const,
    ),
  );
  return {
    MD5: md5Hex(data),
    ...Object.fromEntries(sha),
  } as Record<FileHashAlgorithm, string>;
}

/**
 * 照合用に貼り付けられたハッシュ値を正規化する（小文字化・`sha256:`等の接頭辞除去）。
 * `sha256sum` 形式（`<hash>  <ファイル名>`）は先頭の語だけを使い、空白区切りのバイト列は連結する。
 */
export function normalizeHashInput(input: string): string {
  const text = input.replace(/^\s*[A-Za-z0-9-]+\s*[:=]\s*/, '').toLowerCase();
  const first = text.trim().split(/\s+/)[0] ?? '';
  if (/^[0-9a-f]+$/.test(first) && first.length in HEX_LENGTH_TO_ALGORITHM) {
    return first;
  }
  return text.replace(/\s+/g, '');
}

export type HashCompareResult =
  | { status: 'empty' }
  | { status: 'invalid' }
  | { status: 'match'; algorithm: FileHashAlgorithm }
  | { status: 'mismatch'; algorithm: FileHashAlgorithm };

/** 貼り付けられたハッシュ値を、桁数から判定したアルゴリズムの計算結果と照合する */
export function compareHash(
  input: string,
  hashes: Record<FileHashAlgorithm, string>,
): HashCompareResult {
  const normalized = normalizeHashInput(input);
  if (normalized === '') return { status: 'empty' };
  const algorithm = HEX_LENGTH_TO_ALGORITHM[normalized.length];
  if (!algorithm || !/^[0-9a-f]+$/.test(normalized)) {
    return { status: 'invalid' };
  }
  return hashes[algorithm] === normalized
    ? { status: 'match', algorithm }
    : { status: 'mismatch', algorithm };
}
