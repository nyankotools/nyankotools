export type IdKind = 'ulid' | 'nanoid';

const MIN_COUNT = 1;
const MAX_COUNT = 100;
export const MIN_NANOID_SIZE = 1;
export const MAX_NANOID_SIZE = 128;
export const DEFAULT_NANOID_SIZE = 21;
export const DEFAULT_NANOID_ALPHABET =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
const MIN_ALPHABET_LENGTH = 2;
const MAX_ALPHABET_LENGTH = 256;

/** ULID の文字セット（Crockford's Base32。I・L・O・U を含まない） */
const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const ULID_TIME_LENGTH = 10;
const ULID_RANDOM_LENGTH = 16;
const ULID_RANDOM_MODULUS = 1n << 80n;

export function clampIdCount(count: number): number {
  if (!Number.isFinite(count)) return MIN_COUNT;
  return Math.min(Math.max(Math.trunc(count), MIN_COUNT), MAX_COUNT);
}

export function clampNanoidSize(size: number): number {
  if (!Number.isFinite(size)) return DEFAULT_NANOID_SIZE;
  return Math.min(Math.max(Math.trunc(size), MIN_NANOID_SIZE), MAX_NANOID_SIZE);
}

function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

function encodeBase32(value: bigint, length: number): string {
  let result = '';
  let rest = value;
  for (let i = 0; i < length; i++) {
    result = ULID_ALPHABET[Number(rest & 31n)] + result;
    rest >>= 5n;
  }
  return result;
}

export interface UlidOptions {
  count: number;
  lowercase?: boolean;
  /** 時刻（ミリ秒）。テスト用に差し替え可能 */
  now?: number;
}

/**
 * ULID を生成する。同一バッチは同じタイムスタンプで、ランダム部を +1 ずつ
 * 増やすため、生成順に辞書順で昇順に並ぶ（monotonic）。
 */
export function generateUlids(options: UlidOptions): string[] {
  const count = clampIdCount(options.count);
  const time = BigInt(Math.max(0, Math.trunc(options.now ?? Date.now())));
  const timePart = encodeBase32(time & ((1n << 48n) - 1n), ULID_TIME_LENGTH);

  let random = 0n;
  for (const byte of randomBytes(10)) random = (random << 8n) | BigInt(byte);

  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    const id =
      timePart +
      encodeBase32(
        (random + BigInt(i)) % ULID_RANDOM_MODULUS,
        ULID_RANDOM_LENGTH,
      );
    ids.push(options.lowercase ? id.toLowerCase() : id);
  }
  return ids;
}

export interface NanoidOptions {
  count: number;
  size: number;
  /** 未指定・空なら既定の URL-safe 64 文字 */
  alphabet?: string;
}

export type NanoidResult =
  { ok: true; ids: string[] } | { ok: false; reason: 'alphabet-length' };

/** 重複文字を除いた文字セットを返す（サロゲートペアも1文字として扱う） */
export function normalizeAlphabet(alphabet: string): string[] {
  return Array.from(new Set(Array.from(alphabet)));
}

/** NanoID を生成する。剰余バイアスを避けるため棄却サンプリングを使う */
export function generateNanoids(options: NanoidOptions): NanoidResult {
  const alphabet = normalizeAlphabet(
    options.alphabet === undefined || options.alphabet === ''
      ? DEFAULT_NANOID_ALPHABET
      : options.alphabet,
  );
  if (
    alphabet.length < MIN_ALPHABET_LENGTH ||
    alphabet.length > MAX_ALPHABET_LENGTH
  ) {
    return { ok: false, reason: 'alphabet-length' };
  }

  const count = clampIdCount(options.count);
  const size = clampNanoidSize(options.size);
  const mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
  const step = Math.ceil((1.6 * mask * size) / alphabet.length);

  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    const chars: string[] = [];
    while (chars.length < size) {
      for (const byte of randomBytes(step)) {
        const index = byte & mask;
        if (index < alphabet.length) {
          chars.push(alphabet[index]);
          if (chars.length === size) break;
        }
      }
    }
    ids.push(chars.join(''));
  }
  return { ok: true, ids };
}
