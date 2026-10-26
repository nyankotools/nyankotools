import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

/** 1ゲームで出現する的の数 */
export const TARGET_COUNT = 20;
/** 選べる的の直径（px）。小さいほど難しい */
export const TARGET_SIZES = [56, 40, 24, 16] as const;
/** 的の直径（px）の既定値 */
export const TARGET_SIZE = 24;

/** セレクトの値から的の直径を決める。選べない値は既定値にする */
export function parseTargetSize(raw: string | null | undefined): number {
  const n = Number(raw);
  return (TARGET_SIZES as readonly number[]).includes(n) ? n : TARGET_SIZE;
}

export interface TargetPosition {
  /** 的の左上のX座標（px） */
  left: number;
  top: number;
}

export interface AimSummary {
  hits: number;
  misses: number;
  /** 命中率（0〜100）。クリックが1回もなければ null */
  accuracy: number | null;
  average: number;
  best: number;
  worst: number;
  median: number;
}

/**
 * 的の位置を決める。的が的場からはみ出さない範囲で、左上座標を整数で返す。
 * previous を渡すと、直前の的と中心が近すぎない（直径以上離れる）位置を選ぶ。
 * 何度試しても条件を満たせない場合は最後の候補をそのまま返す。
 */
export function generateTargetPosition(
  width: number,
  height: number,
  size: number = TARGET_SIZE,
  previous: TargetPosition | null = null,
  randomInt: RandomInt = secureRandomInt,
): TargetPosition {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    !Number.isFinite(size) ||
    size <= 0
  ) {
    throw new RangeError('invalid arena size');
  }
  const rangeX = Math.max(0, Math.floor(width - size));
  const rangeY = Math.max(0, Math.floor(height - size));
  let pos: TargetPosition = { left: 0, top: 0 };
  for (let i = 0; i < 12; i++) {
    pos = {
      left: randomInt(rangeX + 1),
      top: randomInt(rangeY + 1),
    };
    if (!previous) return pos;
    if (Math.hypot(pos.left - previous.left, pos.top - previous.top) >= size) {
      return pos;
    }
  }
  return pos;
}

/** 命中率（%）。ヒット数とミス数の合計が0なら null */
export function calcAccuracy(hits: number, misses: number): number | null {
  const total = hits + misses;
  if (total <= 0) return null;
  return (hits / total) * 100;
}

/** 的が出てから命中するまでの時間（ミリ秒）の一覧とミス数から統計を求める。命中が0なら null */
export function summarize(
  times: readonly number[],
  misses: number,
): AimSummary | null {
  const valid = times.filter((t) => Number.isFinite(t) && t >= 0);
  if (valid.length === 0) return null;
  const sorted = [...valid].sort((a, b) => a - b);
  const sum = sorted.reduce((s, t) => s + t, 0);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const safeMisses = Math.max(0, Math.floor(misses) || 0);
  return {
    hits: sorted.length,
    misses: safeMisses,
    accuracy: calcAccuracy(sorted.length, safeMisses),
    average: sum / sorted.length,
    best: sorted[0],
    worst: sorted[sorted.length - 1],
    median,
  };
}

/** 保存済みのベスト平均時間（ms）を読み取る。不正値は null */
export function parseBest(raw: string | null): number | null {
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function serializeBest(best: number): string {
  return String(Math.round(best * 10) / 10);
}

/** 平均時間が短いほどよい。ベスト未保存なら更新扱い */
export function isNewBest(previous: number | null, average: number): boolean {
  if (!Number.isFinite(average) || average <= 0) return false;
  return previous === null || average < previous;
}

export function formatMs(ms: number): string {
  return String(Math.round(ms));
}

export function formatPercent(value: number | null): string {
  if (value === null) return '-';
  return `${Math.round(value * 10) / 10}%`;
}
