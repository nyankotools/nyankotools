import { hmacBytes, type HmacAlgorithm } from './hmac-generator';

export const TOTP_ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-512'] as const;
export type TotpAlgorithm = (typeof TOTP_ALGORITHMS)[number];

export interface TotpOptions {
  period: number;
  digits: number;
  algorithm: TotpAlgorithm;
}

export const DEFAULT_TOTP_OPTIONS: TotpOptions = {
  period: 30,
  digits: 6,
  algorithm: 'SHA-1',
};

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** Base32（RFC 4648）をバイト列にする。空白・ハイフン・末尾の=・小文字は許容し、不正文字や空なら null */
export function decodeBase32(input: string): Uint8Array | null {
  const cleaned = input.replace(/[\s-]/g, '').replace(/=+$/, '').toUpperCase();
  if (cleaned === '') return null;
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index < 0) return null;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return out.length === 0 ? null : new Uint8Array(out);
}

export function encodeBase32(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

/** ランダムな秘密鍵（20バイト＝160bit）をBase32で生成する */
export function generateSecret(): string {
  return encodeBase32(crypto.getRandomValues(new Uint8Array(20)));
}

/** HOTP（RFC 4226）。カウンタから桁数ぶんの数字コードを求める */
export async function hotp(
  secret: Uint8Array,
  counter: number,
  digits: number,
  algorithm: HmacAlgorithm,
): Promise<string> {
  const counterBytes = new Uint8Array(8);
  new DataView(counterBytes.buffer).setBigUint64(0, BigInt(counter));
  const hash = await hmacBytes(secret, counterBytes, algorithm);
  const offset = hash[hash.length - 1] & 0x0f;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    (hash[offset + 1] << 16) |
    (hash[offset + 2] << 8) |
    hash[offset + 3];
  return String(binary % 10 ** digits).padStart(digits, '0');
}

/** 時刻（ミリ秒）に対応するタイムステップ */
export function timeStep(timeMs: number, period: number): number {
  return Math.floor(timeMs / 1000 / period);
}

/** 現在のコードが切り替わるまでの残り秒数（1〜period） */
export function secondsRemaining(timeMs: number, period: number): number {
  return period - (Math.floor(timeMs / 1000) % period);
}

/** TOTP（RFC 6238）。指定時刻のコードを返す */
export async function totp(
  secret: Uint8Array,
  timeMs: number,
  options: TotpOptions = DEFAULT_TOTP_OPTIONS,
): Promise<string> {
  return hotp(
    secret,
    timeStep(timeMs, options.period),
    options.digits,
    options.algorithm,
  );
}

/**
 * 入力コードを前後 window ステップの範囲で検証する。
 * 一致したステップのずれ（0=現在、-1=1つ前、+1=1つ後）を返し、不一致なら null
 */
export async function verifyTotp(
  secret: Uint8Array,
  code: string,
  timeMs: number,
  options: TotpOptions = DEFAULT_TOTP_OPTIONS,
  window = 1,
): Promise<number | null> {
  const normalized = code.replace(/\s/g, '');
  if (!/^\d+$/.test(normalized) || normalized.length !== options.digits) {
    return null;
  }
  const base = timeStep(timeMs, options.period);
  for (const offset of [0, -1, 1, -2, 2].filter((o) => Math.abs(o) <= window)) {
    if (base + offset < 0) continue;
    const expected = await hotp(
      secret,
      base + offset,
      options.digits,
      options.algorithm,
    );
    if (expected === normalized) return offset;
  }
  return null;
}

export interface OtpauthParams {
  secret: string;
  algorithm?: TotpAlgorithm;
  digits?: number;
  period?: number;
  issuer?: string;
  label?: string;
}

/** otpauth://totp/... のURIを解析する。TOTP以外・secretなしは null */
export function parseOtpauthUri(uri: string): OtpauthParams | null {
  let url: URL;
  try {
    url = new URL(uri.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'otpauth:' || url.hostname !== 'totp') return null;
  const secret = url.searchParams.get('secret');
  if (!secret) return null;
  const result: OtpauthParams = { secret };
  const algorithm = url.searchParams.get('algorithm')?.toUpperCase();
  if (algorithm) {
    const normalized = algorithm.replace(/^SHA(\d)/, 'SHA-$1');
    if ((TOTP_ALGORITHMS as readonly string[]).includes(normalized)) {
      result.algorithm = normalized as TotpAlgorithm;
    }
  }
  const digits = Number(url.searchParams.get('digits'));
  if (Number.isInteger(digits) && digits >= 6 && digits <= 8) {
    result.digits = digits;
  }
  const period = Number(url.searchParams.get('period'));
  if (Number.isInteger(period) && period >= 1 && period <= 300) {
    result.period = period;
  }
  const issuer = url.searchParams.get('issuer');
  if (issuer) result.issuer = issuer;
  try {
    const label = decodeURIComponent(url.pathname.replace(/^\//, ''));
    if (label) result.label = label;
  } catch {
    // 不正なパーセントエンコードのラベルは無視する
  }
  return result;
}
