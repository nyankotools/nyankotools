import { MAX_VALID_INTERVAL_MS } from './refresh-rate-tester';

/** 選べる移動速度（CSSピクセル/秒） */
export const SPEEDS = [240, 480, 960, 1920] as const;
export type Speed = (typeof SPEEDS)[number];

export interface BackgroundDef {
  id: 'black' | 'gray' | 'white';
  /** 背景色 */
  bg: string;
  /** 図形の色（背景とコントラストが取れる色） */
  fg: string;
}

export const BACKGROUNDS: readonly BackgroundDef[] = [
  { id: 'black', bg: '#000000', fg: '#ffffff' },
  { id: 'gray', bg: '#808080', fg: '#ffffff' },
  { id: 'white', bg: '#ffffff', fg: '#000000' },
];

/** 0 <= result < span になるよう周期的に折り返す（負値にも対応）。span<=0 は 0。 */
export function wrap(value: number, span: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(span) || span <= 0) return 0;
  return ((value % span) + span) % span;
}

/**
 * 経過時間から図形の左端X座標を求める。画面外から入って反対側へ抜ける周回移動。
 * direction=1 は左→右、-1 は右→左。
 */
export function positionAt(
  elapsedMs: number,
  speedPxPerSec: number,
  viewWidth: number,
  objectWidth: number,
  direction: 1 | -1 = 1,
): number {
  const span = viewWidth + objectWidth;
  const travelled = (speedPxPerSec * elapsedMs) / 1000;
  if (direction === 1) return wrap(travelled, span) - objectWidth;
  return viewWidth - wrap(travelled, span);
}

/** 1フレームあたりの移動量（px）。リフレッシュレートが不正なら null。 */
export function pixelsPerFrame(
  speedPxPerSec: number,
  hz: number,
): number | null {
  if (!Number.isFinite(hz) || hz <= 0 || !Number.isFinite(speedPxPerSec)) {
    return null;
  }
  return speedPxPerSec / hz;
}

/** 速度を1段階上げ下げする（範囲外はクランプ）。未知の速度は最も近い段階として扱う。 */
export function stepSpeed(current: number, delta: number): Speed {
  let idx = 0;
  let best = Infinity;
  SPEEDS.forEach((s, i) => {
    const d = Math.abs(s - current);
    if (d < best) {
      best = d;
      idx = i;
    }
  });
  const next = Math.min(SPEEDS.length - 1, Math.max(0, idx + delta));
  return SPEEDS[next];
}

export type FrameVerdict = 'smooth' | 'minor' | 'stutter';

export interface FrameAnalysis {
  /** 解析に使った描画間隔の数 */
  frames: number;
  /** 通常の描画間隔（中央値, ms） */
  baseIntervalMs: number;
  /** 推定リフレッシュレート（Hz） */
  hz: number;
  /** 飛ばされたと推定されるフレーム数の合計 */
  skippedFrames: number;
  /** フレーム飛びが起きた回数 */
  skipEvents: number;
  /** 1回で最大何フレーム飛んだか */
  worstSkip: number;
  /** 飛んだフレームの割合（0〜1。飛び数 / (描画数 + 飛び数)） */
  skipRatio: number;
  verdict: FrameVerdict;
}

/** 通常間隔の何倍を超えたら「飛んだ」とみなすか */
const SKIP_THRESHOLD = 1.5;

/** タイムスタンプ列（ms）からフレーム飛びを推定する。有効な間隔が2未満なら null。 */
export function analyzeFrames(timestamps: number[]): FrameAnalysis | null {
  const intervals: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    const d = timestamps[i] - timestamps[i - 1];
    if (d > 0 && d <= MAX_VALID_INTERVAL_MS) intervals.push(d);
  }
  if (intervals.length < 2) return null;
  const sorted = [...intervals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const base =
    sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  let skipped = 0;
  let events = 0;
  let worst = 0;
  for (const d of intervals) {
    if (d > base * SKIP_THRESHOLD) {
      const n = Math.max(1, Math.round(d / base) - 1);
      skipped += n;
      events += 1;
      if (n > worst) worst = n;
    }
  }
  const total = intervals.length + skipped;
  const ratio = skipped / total;
  let verdict: FrameVerdict = 'smooth';
  if (skipped > 0) verdict = ratio < 0.01 ? 'minor' : 'stutter';
  return {
    frames: intervals.length,
    baseIntervalMs: base,
    hz: 1000 / base,
    skippedFrames: skipped,
    skipEvents: events,
    worstSkip: worst,
    skipRatio: ratio,
    verdict,
  };
}
