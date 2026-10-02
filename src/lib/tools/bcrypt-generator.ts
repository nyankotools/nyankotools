import bcrypt from 'bcryptjs';

export const MIN_COST = 4;
export const MAX_COST = 14;
export const DEFAULT_COST = 10;
/** bcrypt が入力として使うのは先頭72バイトまで（それ以降は無視される） */
export const MAX_PASSWORD_BYTES = 72;

export interface BcryptInfo {
  /** 例: 2a / 2b / 2y */
  version: string;
  cost: number;
  /** ソルト（Base64風の22文字） */
  salt: string;
  /** ハッシュ本体（31文字） */
  digest: string;
}

export type BcryptHashResult =
  | { success: true; hash: string }
  | { success: false; error: 'invalid-cost' | 'password-too-long' };

export type BcryptVerifyResult =
  { success: true; match: boolean } | { success: false; error: 'invalid-hash' };

const HASH_PATTERN =
  /^\$(2[aby]?)\$(\d{2})\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/;

export function passwordByteLength(password: string): number {
  return new TextEncoder().encode(password).length;
}

/** bcryptハッシュを解析する。形式が不正なら null */
export function parseBcryptHash(hash: string): BcryptInfo | null {
  const m = HASH_PATTERN.exec(hash.trim());
  if (!m) return null;
  const cost = Number(m[2]);
  if (cost < 4 || cost > 31) return null;
  return { version: m[1], cost, salt: m[3], digest: m[4] };
}

export async function hashPassword(
  password: string,
  cost: number,
): Promise<BcryptHashResult> {
  if (!Number.isInteger(cost) || cost < MIN_COST || cost > MAX_COST) {
    return { success: false, error: 'invalid-cost' };
  }
  // 73バイト以上を黙って切り捨てると、別のパスワードでも照合に成功してしまうため拒否する
  if (passwordByteLength(password) > MAX_PASSWORD_BYTES) {
    return { success: false, error: 'password-too-long' };
  }
  const hash = await bcrypt.hash(password, cost);
  return { success: true, hash };
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<BcryptVerifyResult> {
  const trimmed = hash.trim();
  if (!parseBcryptHash(trimmed))
    return { success: false, error: 'invalid-hash' };
  const match = await bcrypt.compare(password, trimmed);
  return { success: true, match };
}
