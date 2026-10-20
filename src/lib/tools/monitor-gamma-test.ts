export type PatternId = 'ramp' | 'steps' | 'gamma' | 'black' | 'white';

/** 表示順。ids は辞書のパターン名キーと対応する。 */
export const PATTERN_IDS: PatternId[] = [
  'ramp',
  'steps',
  'gamma',
  'black',
  'white',
];

/** ガンマチェッカーで並べる代表的なガンマ値。 */
export const GAMMA_VALUES = [1.8, 2.0, 2.2, 2.4, 2.6];

/** 段階パターンの段数。 */
export const STEP_COUNT = 32;

/** 黒つぶれ・白飛び確認で並べるパッチ数。 */
export const DETAIL_PATCH_COUNT = 16;

/** 巡回インデックス。delta は負でもよい。 */
export function cycleIndex(
  current: number,
  delta: number,
  length: number,
): number {
  if (length <= 0) return 0;
  return (((current + delta) % length) + length) % length;
}

/** 0〜255 に丸めて整数化する。NaN は 0。 */
export function clampLevel(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(255, Math.max(0, Math.round(value)));
}

/** グレー階調値 → #rrggbb。 */
export function grayHex(level: number): string {
  const h = clampLevel(level).toString(16).padStart(2, '0');
  return `#${h}${h}${h}`;
}

/**
 * ガンマ値 gamma のディスプレイで、白黒の細い縞（平均輝度50%）と同じ明るさに見えるグレー階調値。
 * level = 255 * 0.5^(1/gamma)。gamma 2.2 で 186。
 */
export function gammaMatchLevel(gamma: number): number {
  if (!Number.isFinite(gamma) || gamma <= 0) return 0;
  return clampLevel(255 * Math.pow(0.5, 1 / gamma));
}

/**
 * 縞とグレーがなじんで見えた階調値から実効ガンマを推定する。
 * 0 や 255、範囲外・非数のときは null。
 */
export function estimateGamma(level: number): number | null {
  if (!Number.isFinite(level) || level <= 0 || level >= 255) return null;
  return Math.log(0.5) / Math.log(level / 255);
}

/** 0 から 255 まで等間隔の count 段の階調値。count が 1 以下なら [0]。 */
export function stepLevels(count: number): number[] {
  const n = Math.floor(count);
  if (!Number.isFinite(n) || n <= 1) return [0];
  return Array.from({ length: n }, (_, i) => clampLevel((i * 255) / (n - 1)));
}

/** 黒つぶれ確認用: 背景の黒(0)の上に置く 1〜count の暗い階調。 */
export function nearBlackLevels(count: number = DETAIL_PATCH_COUNT): number[] {
  const n = Math.max(0, Math.min(254, Math.floor(count)));
  return Array.from({ length: n }, (_, i) => i + 1);
}

/** 白飛び確認用: 背景の白(255)の上に置く 254 から下がっていく明るい階調。 */
export function nearWhiteLevels(count: number = DETAIL_PATCH_COUNT): number[] {
  const n = Math.max(0, Math.min(254, Math.floor(count)));
  return Array.from({ length: n }, (_, i) => 254 - i);
}

/** 横位置 x（0..width-1）の滑らかなグレーランプの階調値。 */
export function rampLevel(x: number, width: number): number {
  if (!Number.isFinite(width) || width <= 1) return 0;
  return clampLevel((x / (width - 1)) * 255);
}

export interface Range {
  start: number;
  end: number;
}

/** total ピクセルを count 個に整数で分割する（隙間・重なりなし、端数は前の方に1pxずつ配る）。 */
export function splitRanges(total: number, count: number): Range[] {
  const n = Math.floor(count);
  const t = Math.floor(total);
  if (!Number.isFinite(n) || !Number.isFinite(t) || n <= 0 || t < 0) return [];
  const base = Math.floor(t / n);
  const extra = t % n;
  const out: Range[] = [];
  let pos = 0;
  for (let i = 0; i < n; i++) {
    const size = base + (i < extra ? 1 : 0);
    out.push({ start: pos, end: pos + size });
    pos += size;
  }
  return out;
}

/** 階調値の背景に対して読みやすい文字色（黒/白）。 */
export function labelColor(level: number): '#000000' | '#ffffff' {
  return clampLevel(level) >= 128 ? '#000000' : '#ffffff';
}
