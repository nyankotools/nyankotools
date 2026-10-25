/**
 * コイントスのロジック。
 * 乱数は共有ヘルパーの secureRandomInt（crypto.getRandomValues）。テストでは randomInt を差し替える。
 */
import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type CoinSide = 'heads' | 'tails';

/** 1回の操作で連続して投げられる最大回数 */
export const MAX_TOSS_COUNT = 10;
/** 履歴として保持する最大件数（超えたら古いものから捨てる） */
export const MAX_HISTORY = 1000;

/** 表(heads)か裏(tails)を等確率で返す */
export function flipCoin(randomInt: RandomInt = secureRandomInt): CoinSide {
  return randomInt(2) === 0 ? 'heads' : 'tails';
}

/** count 回投げた結果を投げた順に返す。count は検証済みの整数を渡すこと */
export function flipCoins(
  count: number,
  randomInt: RandomInt = secureRandomInt,
): CoinSide[] {
  if (!Number.isInteger(count) || count < 1 || count > MAX_TOSS_COUNT) {
    throw new RangeError('invalid toss count');
  }
  return Array.from({ length: count }, () => flipCoin(randomInt));
}

/** 連続回数の入力値の検証。問題がなければ null */
export function validateTossCount(count: number): 'count' | null {
  return Number.isInteger(count) && count >= 1 && count <= MAX_TOSS_COUNT
    ? null
    : 'count';
}

/**
 * コインが指定の面を上にして止まる回転角（度、X軸まわり）。
 * 表は 360 の倍数、裏は 360 の倍数 + 180。現在の角度より必ず大きく、
 * extraTurns 周以上（1周 = 360度）回る。
 */
export function coinRotation(
  current: number,
  side: CoinSide,
  extraTurns: number,
): number {
  const base = Math.ceil(current / 360) * 360 + 360 * extraTurns;
  return side === 'heads' ? base : base + 180;
}

/** 回転角のとき、上を向いている面 */
export function sideAtRotation(rotation: number): CoinSide {
  const angle = ((rotation % 360) + 360) % 360;
  return angle < 90 || angle >= 270 ? 'heads' : 'tails';
}

/** 履歴の末尾に追加し、MAX_HISTORY を超えた分は古いものから捨てる */
export function appendHistory(
  history: readonly CoinSide[],
  added: readonly CoinSide[],
): CoinSide[] {
  const all = [...history, ...added];
  return all.length > MAX_HISTORY ? all.slice(all.length - MAX_HISTORY) : all;
}

export interface CoinStats {
  total: number;
  heads: number;
  tails: number;
  /** 表の割合（0〜1）。履歴が空なら 0 */
  headsRatio: number;
  /** 末尾から数えた、同じ面の連続回数。履歴が空なら null */
  currentStreak: { side: CoinSide; length: number } | null;
  /** 履歴全体での最長連続。履歴が空なら null（同じ長さなら先に現れたもの） */
  longestStreak: { side: CoinSide; length: number } | null;
}

export function summarizeHistory(history: readonly CoinSide[]): CoinStats {
  const total = history.length;
  const heads = history.filter((s) => s === 'heads').length;
  let current: CoinStats['currentStreak'] = null;
  let longest: CoinStats['longestStreak'] = null;
  for (const side of history) {
    current =
      current && current.side === side
        ? { side, length: current.length + 1 }
        : { side, length: 1 };
    if (!longest || current.length > longest.length) longest = current;
  }
  return {
    total,
    heads,
    tails: total - heads,
    headsRatio: total === 0 ? 0 : heads / total,
    currentStreak: current,
    longestStreak: longest,
  };
}
