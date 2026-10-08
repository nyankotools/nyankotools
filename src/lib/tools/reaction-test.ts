import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const ROUNDS = 5;
/** 待機時間の範囲（ミリ秒）。両端を含む */
export const MIN_WAIT_MS = 1500;
export const MAX_WAIT_MS = 5000;

export const RANK_IDS = [
  'excellent',
  'good',
  'average',
  'slow',
  'verySlow',
] as const;
export type RankId = (typeof RANK_IDS)[number];

/** ランクの上限（ミリ秒未満）。平均がこの値より小さければそのランク */
const RANK_LIMITS: readonly [RankId, number][] = [
  ['excellent', 200],
  ['good', 250],
  ['average', 300],
  ['slow', 400],
];

export interface ReactionSummary {
  count: number;
  average: number;
  best: number;
  worst: number;
  median: number;
}

/** 色が変わるまでの待機時間を、MIN〜MAX の範囲で決める */
export function generateWaitMs(
  randomInt: RandomInt = secureRandomInt,
  min = MIN_WAIT_MS,
  max = MAX_WAIT_MS,
): number {
  if (
    !Number.isInteger(min) ||
    !Number.isInteger(max) ||
    min < 0 ||
    max < min
  ) {
    throw new RangeError('invalid wait range');
  }
  return min + randomInt(max - min + 1);
}

/** 反応時間（ミリ秒）の一覧から統計を求める。空なら null */
export function summarize(times: readonly number[]): ReactionSummary | null {
  const valid = times.filter((t) => Number.isFinite(t) && t >= 0);
  if (valid.length === 0) return null;
  const sorted = [...valid].sort((a, b) => a - b);
  const sum = sorted.reduce((s, t) => s + t, 0);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return {
    count: sorted.length,
    average: sum / sorted.length,
    best: sorted[0],
    worst: sorted[sorted.length - 1],
    median,
  };
}

/** 平均反応時間からランクを判定する */
export function rankOf(averageMs: number): RankId {
  for (const [id, limit] of RANK_LIMITS) {
    if (averageMs < limit) return id;
  }
  return 'verySlow';
}

/** 表示用に整数ミリ秒へ丸める */
export function formatMs(ms: number): string {
  return String(Math.round(ms));
}
