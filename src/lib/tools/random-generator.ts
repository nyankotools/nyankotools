/**
 * ランダム文字列・乱数生成のロジック。
 * 乱数は src/lib/random.ts（crypto.getRandomValues、棄却サンプリングで偏りなし）。テストでは randomInt を差し替える。
 */
import { secureRandomInt, type RandomInt } from '../random';
import {
  HIRAGANA,
  JOYO_KANJI,
  KATAKANA,
  KYOIKU_KANJI,
} from './random-generator-chars';

export const MAX_COUNT = 1000;
export const MAX_STRING_LENGTH = 256;
export const MAX_DECIMALS = 6;
/** randomInt が扱える範囲（2^32）。整数・小数の範囲幅の上限 */
export const MAX_SPAN = 0x100000000;

export type GenerateError =
  | 'emptyCharset'
  | 'invalidLength'
  | 'invalidCount'
  | 'notEnoughCombinations'
  | 'invalidRange'
  | 'rangeTooLarge'
  | 'countExceedsRange'
  | 'invalidDecimals';

export type GenerateResult =
  { ok: true; values: string[] } | { ok: false; error: GenerateError };

const fail = (error: GenerateError): GenerateResult => ({ ok: false, error });

export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DIGITS = '0123456789';
export const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>/?';
/** 紛らわしい文字（1 l I 0 O o） */
const SIMILAR_CHARS = new Set('1lI0Oo');

export interface StringOptions {
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
  hiragana: boolean;
  katakana: boolean;
  /** 教育漢字（小学校の1026字） */
  kyoikuKanji: boolean;
  /** 常用漢字（2136字） */
  joyoKanji: boolean;
  /** 追加で使う文字（重複は1つにまとめる） */
  customChars: string;
  excludeSimilar: boolean;
  length: number;
  count: number;
  /** 生成結果どうしが重複しないようにする */
  unique: boolean;
}

/** 選択された文字種から、重複のない文字プール（コードポイント単位）を組み立てる */
export function buildPool(
  options: Pick<
    StringOptions,
    | 'lowercase'
    | 'uppercase'
    | 'digits'
    | 'symbols'
    | 'hiragana'
    | 'katakana'
    | 'kyoikuKanji'
    | 'joyoKanji'
    | 'customChars'
    | 'excludeSimilar'
  >,
): string[] {
  let source = '';
  if (options.lowercase) source += LOWERCASE;
  if (options.uppercase) source += UPPERCASE;
  if (options.digits) source += DIGITS;
  if (options.symbols) source += SYMBOLS;
  if (options.hiragana) source += HIRAGANA;
  if (options.katakana) source += KATAKANA;
  if (options.kyoikuKanji) source += KYOIKU_KANJI;
  if (options.joyoKanji) source += JOYO_KANJI;
  // 改行・タブなどの制御文字は文字として扱わない
  source += options.customChars.replace(/\p{Cc}/gu, '');
  const pool = Array.from(new Set(Array.from(source)));
  return options.excludeSimilar
    ? pool.filter((ch) => !SIMILAR_CHARS.has(ch))
    : pool;
}

function isIntInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

export function generateStrings(
  options: StringOptions,
  randomInt: RandomInt = secureRandomInt,
): GenerateResult {
  const pool = buildPool(options);
  if (pool.length === 0) return fail('emptyCharset');
  if (!isIntInRange(options.length, 1, MAX_STRING_LENGTH)) {
    return fail('invalidLength');
  }
  if (!isIntInRange(options.count, 1, MAX_COUNT)) return fail('invalidCount');
  if (options.unique && pool.length ** options.length < options.count) {
    return fail('notEnoughCombinations');
  }

  const one = () => {
    let s = '';
    for (let i = 0; i < options.length; i++) s += pool[randomInt(pool.length)];
    return s;
  };

  if (!options.unique) {
    return {
      ok: true,
      values: Array.from({ length: options.count }, one),
    };
  }
  // count ≤ MAX_COUNT かつ 組み合わせ数 ≥ count なので、引き直しは十分少ない回数で終わる
  const seen = new Set<string>();
  while (seen.size < options.count) seen.add(one());
  return { ok: true, values: [...seen] };
}

export interface IntegerOptions {
  min: number;
  max: number;
  count: number;
  unique: boolean;
  sort: boolean;
}

/** min〜max（両端を含む）の整数を count 個。unique のときは重複なし（疎なFisher-Yates） */
export function generateIntegers(
  options: IntegerOptions,
  randomInt: RandomInt = secureRandomInt,
): GenerateResult {
  const { min, max, count } = options;
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || max < min) {
    return fail('invalidRange');
  }
  const span = max - min + 1;
  if (!Number.isSafeInteger(span) || span > MAX_SPAN) {
    return fail('rangeTooLarge');
  }
  if (!isIntInRange(count, 1, MAX_COUNT)) return fail('invalidCount');
  if (options.unique && count > span) return fail('countExceedsRange');

  const numbers: number[] = [];
  if (options.unique) {
    // 0..span-1 の仮想配列を、入れ替えた箇所だけMapに持って先頭から count 個取り出す
    const swapped = new Map<number, number>();
    for (let i = 0; i < count; i++) {
      const j = i + randomInt(span - i);
      numbers.push(min + (swapped.get(j) ?? j));
      swapped.set(j, swapped.get(i) ?? i);
    }
  } else {
    for (let i = 0; i < count; i++) numbers.push(min + randomInt(span));
  }
  if (options.sort) numbers.sort((a, b) => a - b);
  return { ok: true, values: numbers.map(String) };
}

export interface DecimalOptions {
  min: number;
  max: number;
  /** 小数点以下の桁数（0〜6） */
  decimals: number;
  count: number;
  sort: boolean;
}

/** min〜max（両端を含む）を 10^-decimals 刻みの一様な値で count 個 */
export function generateDecimals(
  options: DecimalOptions,
  randomInt: RandomInt = secureRandomInt,
): GenerateResult {
  const { min, max, decimals, count } = options;
  if (!isIntInRange(decimals, 0, MAX_DECIMALS)) return fail('invalidDecimals');
  if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
    return fail('invalidRange');
  }
  if (!isIntInRange(count, 1, MAX_COUNT)) return fail('invalidCount');
  const scale = 10 ** decimals;
  const scaledMin = Math.ceil(min * scale - 1e-9);
  const scaledMax = Math.floor(max * scale + 1e-9);
  if (scaledMax < scaledMin) return fail('invalidRange');
  const span = scaledMax - scaledMin + 1;
  if (
    !Number.isSafeInteger(scaledMin) ||
    !Number.isSafeInteger(scaledMax) ||
    span > MAX_SPAN
  ) {
    return fail('rangeTooLarge');
  }
  const scaled: number[] = [];
  for (let i = 0; i < count; i++) scaled.push(scaledMin + randomInt(span));
  if (options.sort) scaled.sort((a, b) => a - b);
  return {
    ok: true,
    values: scaled.map((n) => (n / scale).toFixed(decimals)),
  };
}
