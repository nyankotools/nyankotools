import { volumeToGain } from './speaker-tester';

export { volumeToGain };

export type NoiseType = 'white' | 'pink' | 'brown';
export const NOISE_TYPES: NoiseType[] = ['white', 'pink', 'brown'];

/** ループ用バッファの長さ（秒） */
export const LOOP_SECONDS = 10;
/** ループのつなぎ目をなじませるクロスフェードの長さ（秒） */
export const LOOP_CROSSFADE_SECONDS = 1;
/** タイマー終了前のフェードアウトの最大長（秒） */
export const MAX_FADE_SECONDS = 10;
/** タイマーの選択肢（分）。0 はタイマーなし。 */
export const TIMER_OPTIONS = [0, 5, 15, 30, 45, 60, 90, 120, 240, 480];

export type Random = () => number;

function whiteSample(rng: Random): number {
  return rng() * 2 - 1;
}

/**
 * 指定した種類のノイズを生成する（-1〜1、ピークが 1 になるよう正規化）。
 * ホワイト: 一様乱数 / ピンク: Paul Kellet の近似フィルタ / ブラウン: 白色ノイズの漏れ積分。
 */
export function generateNoise(
  type: NoiseType,
  length: number,
  rng: Random = Math.random,
): Float32Array<ArrayBuffer> {
  const n = Math.max(0, Math.floor(length));
  const out = new Float32Array(n);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  let last = 0;
  for (let i = 0; i < n; i++) {
    const w = whiteSample(rng);
    if (type === 'white') {
      out[i] = w;
    } else if (type === 'pink') {
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      out[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362;
      b6 = w * 0.115926;
    } else {
      last = (last + 0.02 * w) / 1.02;
      out[i] = last;
    }
  }
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  if (peak > 0) for (let i = 0; i < n; i++) out[i] /= peak;
  return out;
}

/**
 * 継ぎ目のない（ループしても途切れにくい）ノイズを生成する。
 * 末尾に余分に生成した区間を、先頭へ等電力クロスフェードで重ねる。
 */
export function generateLoopableNoise(
  type: NoiseType,
  length: number,
  fadeLength: number,
  rng: Random = Math.random,
): Float32Array<ArrayBuffer> {
  const n = Math.max(0, Math.floor(length));
  const fade = Math.min(Math.max(0, Math.floor(fadeLength)), n);
  const raw = generateNoise(type, n + fade, rng);
  const out = raw.slice(0, n);
  for (let i = 0; i < fade; i++) {
    const t = ((i + 0.5) / fade) * (Math.PI / 2);
    out[i] = raw[i] * Math.sin(t) + raw[n + i] * Math.cos(t);
  }
  return out;
}

/** タイマー（分）を範囲内の整数に収める。数値でなければ 0（タイマーなし）。 */
export function clampTimerMinutes(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(480, Math.max(0, Math.round(value)));
}

/** 秒数を "m:ss"（1 時間以上は "h:mm:ss"）にする。負数は 0 として扱う。 */
export function formatTimer(totalSeconds: number): string {
  const s = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.ceil(totalSeconds))
    : 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (v: number) => String(v).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/** タイマー全体の長さ（秒）に対するフェードアウトの長さ。短いタイマーでは全体の半分まで。 */
export function fadeSeconds(totalSeconds: number): number {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return 0;
  return Math.min(MAX_FADE_SECONDS, totalSeconds / 2);
}

/** 残り秒数に応じたフェードの倍率（0〜1）。フェード区間より前は 1。 */
export function fadeGain(remainingSeconds: number, fade: number): number {
  if (!Number.isFinite(remainingSeconds)) return 1;
  if (remainingSeconds <= 0) return 0;
  if (!(fade > 0) || remainingSeconds >= fade) return 1;
  return remainingSeconds / fade;
}

/** 音量（0〜100）とフェードの倍率から実際のゲインを求める。 */
export function outputGain(percent: number, fadeFactor: number): number {
  return volumeToGain(percent) * Math.min(1, Math.max(0, fadeFactor));
}
