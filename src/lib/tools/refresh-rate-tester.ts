/** 代表的なリフレッシュレート（Hz）。測定値に最も近いものを「想定レート」として提示する。 */
export const STANDARD_RATES = [
  30, 48, 50, 60, 72, 75, 90, 100, 120, 144, 165, 180, 240, 360,
] as const;

/** 想定レートとして採用する、測定値と標準値の許容誤差（割合） */
const MATCH_TOLERANCE = 0.04;

/** この間隔（ms）を超えるフレーム間隔はタブ非表示などによる中断とみなし、統計から除外する。 */
export const MAX_VALID_INTERVAL_MS = 250;

export interface RefreshRateStats {
  /** 統計に使ったフレーム間隔の数 */
  samples: number;
  /** 中央値ベースのフレーム間隔（ms） */
  medianIntervalMs: number;
  /** 平均フレーム間隔（ms） */
  averageIntervalMs: number;
  minIntervalMs: number;
  maxIntervalMs: number;
  /** 中央値ベースのリフレッシュレート（Hz） */
  hz: number;
  /** 平均ベースのリフレッシュレート（Hz） */
  averageHz: number;
  /** 間隔の標準偏差（ms） */
  stdDevMs: number;
  /** 中央値の1.5倍を超えた間隔の数（フレーム落ちの目安） */
  droppedFrames: number;
  /** 最も近い標準レート。許容誤差内になければ null */
  nearestStandard: number | null;
}

/** performance.now() 等の単調増加タイムスタンプ列から、隣接する間隔（ms）の配列を作る。 */
export function toIntervals(timestamps: number[]): number[] {
  const intervals: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    const d = timestamps[i] - timestamps[i - 1];
    if (d > 0 && d <= MAX_VALID_INTERVAL_MS) intervals.push(d);
  }
  return intervals;
}

function median(sorted: number[]): number {
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** 測定値（Hz）に最も近い標準レートを返す。許容誤差（約4%）を超える場合は null。 */
export function nearestStandardRate(hz: number): number | null {
  if (!Number.isFinite(hz) || hz <= 0) return null;
  let best: number | null = null;
  let bestDiff = Infinity;
  for (const rate of STANDARD_RATES) {
    const diff = Math.abs(hz - rate) / rate;
    if (diff < bestDiff) {
      bestDiff = diff;
      best = rate;
    }
  }
  return bestDiff <= MATCH_TOLERANCE ? best : null;
}

/** フレーム間隔（ms）の配列から統計を計算する。間隔が空なら null。 */
export function computeStats(intervals: number[]): RefreshRateStats | null {
  if (intervals.length === 0) return null;
  const sorted = [...intervals].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((s, v) => s + v, 0);
  const avg = sum / n;
  const med = median(sorted);
  const variance = sorted.reduce((s, v) => s + (v - avg) ** 2, 0) / n;
  const hz = 1000 / med;
  return {
    samples: n,
    medianIntervalMs: med,
    averageIntervalMs: avg,
    minIntervalMs: sorted[0],
    maxIntervalMs: sorted[n - 1],
    hz,
    averageHz: 1000 / avg,
    stdDevMs: Math.sqrt(variance),
    droppedFrames: sorted.filter((v) => v > med * 1.5).length,
    nearestStandard: nearestStandardRate(hz),
  };
}
