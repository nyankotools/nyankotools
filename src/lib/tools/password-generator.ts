export interface PasswordGeneratorOptions {
  /** 生成する文字数（4〜128） */
  length: number;
  /** 小文字（a-z）を含める */
  lowercase?: boolean;
  /** 大文字（A-Z）を含める */
  uppercase?: boolean;
  /** 数字（0-9）を含める */
  numbers?: boolean;
  /** 記号（!@#$%など）を含める */
  symbols?: boolean;
  /** 紛らわしい文字（l, 1, I, O, 0 など）を除外する */
  excludeSimilar?: boolean;
}

export type PasswordStrength = 'weak' | 'fair' | 'strong' | 'very-strong';

export interface PasswordStrengthResult {
  /** 総当たり攻撃への強さを示すビット数（log2(文字種数^桁数)） */
  entropyBits: number;
  strength: PasswordStrength;
}

const MIN_LENGTH = 4;
const MAX_LENGTH = 128;
const DEFAULT_LENGTH = 16;

const MIN_COUNT = 1;
const MAX_COUNT = 100;

const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS_PATTERN = /[il1IloO0]/g;

export function clampPasswordLength(length: number): number {
  if (!Number.isFinite(length)) return DEFAULT_LENGTH;
  return Math.min(Math.max(Math.trunc(length), MIN_LENGTH), MAX_LENGTH);
}

export function clampPasswordCount(count: number): number {
  if (!Number.isFinite(count)) return MIN_COUNT;
  return Math.min(Math.max(Math.trunc(count), MIN_COUNT), MAX_COUNT);
}

/** 選択されたオプションから生成に使う文字プールを組み立てる */
export function buildCharPool(
  options: Pick<
    PasswordGeneratorOptions,
    'lowercase' | 'uppercase' | 'numbers' | 'symbols' | 'excludeSimilar'
  >,
): string {
  let pool = '';
  if (options.lowercase) pool += LOWERCASE_CHARS;
  if (options.uppercase) pool += UPPERCASE_CHARS;
  if (options.numbers) pool += NUMBER_CHARS;
  if (options.symbols) pool += SYMBOL_CHARS;
  if (options.excludeSimilar) {
    pool = pool.replace(SIMILAR_CHARS_PATTERN, '');
  }
  return pool;
}

/** 文字種が1つも選択されていない場合に投げるエラー */
export class EmptyCharPoolError extends Error {}

/** ランダムなパスワードを1件生成する。文字種が1つも選択されていない場合はエラーを投げる */
export function generatePassword(options: PasswordGeneratorOptions): string {
  const pool = buildCharPool(options);
  if (pool.length === 0) {
    throw new EmptyCharPoolError(
      'At least one character type must be selected',
    );
  }

  const length = clampPasswordLength(options.length);
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (value) => pool[value % pool.length]).join(
    '',
  );
}

/** ランダムなパスワードを指定した個数（1〜100）まとめて生成する */
export function generatePasswords(
  options: PasswordGeneratorOptions & { count: number },
): string[] {
  const count = clampPasswordCount(options.count);
  return Array.from({ length: count }, () => generatePassword(options));
}

/**
 * 選択中の文字種・桁数から、総当たり攻撃への強さを簡易的に評価する。
 * 実際に生成された1件の文字列ではなく設定そのものを評価するため、
 * 複数件まとめて生成した場合でも共通の強度として表示できる。
 */
export function evaluatePasswordStrength(
  options: PasswordGeneratorOptions,
): PasswordStrengthResult {
  const poolSize = buildCharPool(options).length;
  const length = clampPasswordLength(options.length);
  const entropyBits = poolSize === 0 ? 0 : length * Math.log2(poolSize);

  let strength: PasswordStrength;
  if (entropyBits < 36) {
    strength = 'weak';
  } else if (entropyBits < 60) {
    strength = 'fair';
  } else if (entropyBits < 80) {
    strength = 'strong';
  } else {
    strength = 'very-strong';
  }

  return { entropyBits, strength };
}
