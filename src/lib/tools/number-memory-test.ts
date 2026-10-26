import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const START_DIGITS = 1;
export const MAX_DIGITS = 30;
export const STORAGE_KEY = 'nyankotools:number-memory-test:best';

/** 桁数 n に応じた表示時間（ミリ秒）。1桁で1秒、1桁増えるごとに0.4秒延びる */
export function displayMs(digits: number): number {
  if (!Number.isInteger(digits) || digits < 1) {
    throw new RangeError('digits must be a positive integer');
  }
  return 1000 + 400 * (digits - 1);
}

/** n桁の数字列を作る。先頭の 0 も許可する */
export function generateDigits(
  digits: number,
  randomInt: RandomInt = secureRandomInt,
): string {
  if (!Number.isInteger(digits) || digits < 1 || digits > MAX_DIGITS) {
    throw new RangeError('invalid digits');
  }
  let result = '';
  for (let i = 0; i < digits; i++) result += String(randomInt(10));
  return result;
}

/** 入力を半角数字だけにそろえる（全角数字は半角へ、空白やその他の文字は除く） */
export function normalizeAnswer(input: string): string {
  return input
    .replace(/[０-９]/g, (c) => String(c.charCodeAt(0) - 0xff10))
    .replace(/\D/g, '');
}

/** 入力が正解かどうか */
export function isCorrect(expected: string, input: string): boolean {
  return expected !== '' && normalizeAnswer(input) === expected;
}

/** ベスト記録（到達桁数）を保存文字列から読む。不正なら 0 */
export function parseBest(raw: string | null): number {
  if (raw === null) return 0;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > MAX_DIGITS) return 0;
  return n;
}

/** ベストを更新するか判定して新しい値を返す */
export function updateBest(best: number, reached: number): number {
  return reached > best ? reached : best;
}
