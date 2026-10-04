export const STANDARD_POLLING_RATES = [125, 250, 500, 1000, 2000, 4000, 8000];

export type MouseButtonId =
  'left' | 'middle' | 'right' | 'back' | 'forward' | 'other';

/** MouseEvent.button の番号を識別子にする。 */
export function buttonId(button: number): MouseButtonId {
  switch (button) {
    case 0:
      return 'left';
    case 1:
      return 'middle';
    case 2:
      return 'right';
    case 3:
      return 'back';
    case 4:
      return 'forward';
    default:
      return 'other';
  }
}

/** クリック回数と計測時間（ミリ秒）から1秒あたりのクリック数（CPS）。 */
export function calculateCps(clicks: number, elapsedMs: number): number {
  if (clicks <= 0 || elapsedMs <= 0) return 0;
  return clicks / (elapsedMs / 1000);
}

/** 直近 windowMs 以内のクリック時刻の数（現在のCPS）。 */
export function recentCps(
  times: readonly number[],
  now: number,
  windowMs = 1000,
): number {
  return times.filter((t) => t <= now && now - t <= windowMs).length;
}

/** 連続するクリック間隔（ms）のうち、しきい値未満のものの数（チャタリングの疑い）。 */
export function countChatter(
  times: readonly number[],
  thresholdMs: number,
): number {
  let count = 0;
  for (let i = 1; i < times.length; i++) {
    if (times[i] - times[i - 1] < thresholdMs) count++;
  }
  return count;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * マウス移動イベントのタイムスタンプ（ms, 昇順）からポーリングレート（Hz）を推定する。
 * 隣り合うイベント間隔の中央値を使い、止まっていた区間（50ms超）は除く。
 * 十分なサンプル（間隔10個未満）がなければ null。
 */
export function estimatePollingRate(
  timestamps: readonly number[],
): number | null {
  const intervals: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    const dt = timestamps[i] - timestamps[i - 1];
    if (dt > 0 && dt <= 50) intervals.push(dt);
  }
  if (intervals.length < 10) return null;
  return 1000 / median(intervals);
}

/** 推定値を標準的なポーリングレートに丸める（±20% 以内に近い値がなければ四捨五入）。 */
export function snapPollingRate(hz: number): number {
  let best = STANDARD_POLLING_RATES[0];
  for (const rate of STANDARD_POLLING_RATES) {
    if (Math.abs(rate - hz) < Math.abs(best - hz)) best = rate;
  }
  return Math.abs(best - hz) / best <= 0.2 ? best : Math.round(hz);
}
