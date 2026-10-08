/**
 * ビンゴ抽選機・ビンゴカード生成のロジック。
 * 乱数は src/lib/random.ts（crypto.getRandomValues）。テストでは randomInt を差し替える。
 */
import { secureRandomInt, shuffle, type RandomInt } from '../random';

export { secureRandomInt, type RandomInt };

/** 抽選機の番号範囲（1〜max）の下限・上限・既定値 */
export const MIN_DRAW_MAX = 5;
export const MAX_DRAW_MAX = 100;
export const DEFAULT_DRAW_MAX = 75;

/** カードの一括生成枚数の上限・既定値 */
export const MAX_CARDS = 100;
export const DEFAULT_CARDS = 10;

/** 標準ビンゴの列見出し。各列は15個ずつの範囲（B=1-15 … O=61-75） */
export const COLUMN_LETTERS = ['B', 'I', 'N', 'G', 'O'] as const;
export const COLUMN_SIZE = 15;
export const CARD_SIZE = 5;
export const CARD_MAX_NUMBER = COLUMN_LETTERS.length * COLUMN_SIZE;

/** 行ごとの配列（cards[row][col]）。中央のFREEは null */
export type BingoCard = (number | null)[][];

/** 範囲外・非数は既定値寄りに丸めた整数を返す */
function clampInt(
  value: number,
  min: number,
  max: number,
  fallback: number,
): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

export function clampDrawMax(value: number): number {
  return clampInt(value, MIN_DRAW_MAX, MAX_DRAW_MAX, DEFAULT_DRAW_MAX);
}

export function clampCardCount(value: number): number {
  return clampInt(value, 1, MAX_CARDS, DEFAULT_CARDS);
}

/** 1〜max の番号をすべて並べた、まだ引いていない番号の山 */
export function createPool(max: number): number[] {
  const size = clampDrawMax(max);
  return Array.from({ length: size }, (_, i) => i + 1);
}

export interface DrawResult {
  drawn: number;
  remaining: number[];
}

/** 山から重複なしで1つ引く。山が空なら null */
export function drawNumber(
  remaining: readonly number[],
  randomInt: RandomInt = secureRandomInt,
): DrawResult | null {
  if (remaining.length === 0) return null;
  const index = randomInt(remaining.length);
  const next = [...remaining];
  const [drawn] = next.splice(index, 1);
  return { drawn, remaining: next };
}

/** 標準ビンゴ（1〜75）の番号の列見出し。範囲外は空文字 */
export function columnLetter(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > CARD_MAX_NUMBER) return '';
  return COLUMN_LETTERS[Math.floor((n - 1) / COLUMN_SIZE)];
}

/** 標準ビンゴカード1枚。各列は列の範囲から重複なしの5個（中央は FREE = null） */
export function generateCard(
  randomInt: RandomInt = secureRandomInt,
): BingoCard {
  const columns = COLUMN_LETTERS.map((_, c) => {
    const pool = Array.from(
      { length: COLUMN_SIZE },
      (_, i) => c * COLUMN_SIZE + i + 1,
    );
    return shuffle(pool, randomInt).slice(0, CARD_SIZE);
  });
  const center = Math.floor(CARD_SIZE / 2);
  return Array.from({ length: CARD_SIZE }, (_, r) =>
    columns.map((col, c) => (r === center && c === center ? null : col[r])),
  );
}

export function generateCards(
  count: number,
  randomInt: RandomInt = secureRandomInt,
): BingoCard[] {
  return Array.from({ length: clampCardCount(count) }, () =>
    generateCard(randomInt),
  );
}
