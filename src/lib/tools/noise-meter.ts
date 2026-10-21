/** 無音とみなす dBFS の下限。 */
export const MIN_DBFS = -100;
/** 表示するdB目安の範囲。 */
export const MIN_DISPLAY_DB = 0;
export const MAX_DISPLAY_DB = 130;
/** 校正オフセットの初期値。-30 dBFS の会話音声がおよそ 60 dB になる目安。 */
export const DEFAULT_OFFSET = 90;
export const MIN_OFFSET = 40;
export const MAX_OFFSET = 140;

/** 浮動小数点サンプル（-1〜1）のRMSをdBFSで返す。無音は MIN_DBFS に丸める。 */
export function calculateRmsDbfs(samples: ArrayLike<number>): number {
  if (samples.length === 0) return MIN_DBFS;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  const rms = Math.sqrt(sum / samples.length);
  if (!(rms > 0)) return MIN_DBFS;
  return Math.max(MIN_DBFS, 20 * Math.log10(rms));
}

/** 校正オフセットを許容範囲に収める。数値でなければ初期値。 */
export function clampOffset(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_OFFSET;
  return Math.min(MAX_OFFSET, Math.max(MIN_OFFSET, value));
}

/** dBFS を目安dBに変換する（オフセットを足し、0〜130に収める）。 */
export function toDisplayDb(dbfs: number, offset: number): number {
  const value = dbfs + clampOffset(offset);
  return Math.min(MAX_DISPLAY_DB, Math.max(MIN_DISPLAY_DB, value));
}

/** 実測のメーター値に合わせるためのオフセット。現在のdBFSと基準の値から求める。 */
export function offsetForReference(
  currentDbfs: number,
  referenceDb: number,
): number {
  return clampOffset(referenceDb - currentDbfs);
}

export interface NoiseStats {
  /** 最大 dBFS（まだ値が無ければ null） */
  maxDbfs: number | null;
  /** 最小 dBFS */
  minDbfs: number | null;
  /** エネルギー平均の計算用: 10^(dBFS/10) の合計 */
  energySum: number;
  count: number;
}

export function createStats(): NoiseStats {
  return { maxDbfs: null, minDbfs: null, energySum: 0, count: 0 };
}

/** 測定値を1つ加えた新しい統計を返す（元は変更しない）。 */
export function addSample(stats: NoiseStats, dbfs: number): NoiseStats {
  return {
    maxDbfs: stats.maxDbfs === null ? dbfs : Math.max(stats.maxDbfs, dbfs),
    minDbfs: stats.minDbfs === null ? dbfs : Math.min(stats.minDbfs, dbfs),
    energySum: stats.energySum + Math.pow(10, dbfs / 10),
    count: stats.count + 1,
  };
}

/** 等価騒音レベル（Leq。エネルギー平均）を dBFS で返す。データが無ければ null。 */
export function averageDbfs(stats: NoiseStats): number | null {
  if (stats.count === 0) return null;
  return Math.max(MIN_DBFS, 10 * Math.log10(stats.energySum / stats.count));
}

/** 履歴に値を追加し、最大 limit 件に収める（古いものから捨てる）。 */
export function pushHistory(
  history: readonly number[],
  value: number,
  limit: number,
): number[] {
  const next = [...history, value];
  return next.length > limit ? next.slice(next.length - limit) : next;
}

/** 履歴を SVG polyline の points 文字列にする。値は目安dBに変換済みのものを渡す。 */
export function historyToPoints(
  values: readonly number[],
  limit: number,
  width: number,
  height: number,
): string {
  if (values.length === 0 || limit < 2) return '';
  const offsetX = limit - values.length;
  return values
    .map((v, i) => {
      const x = ((offsetX + i) / (limit - 1)) * width;
      const clamped = Math.min(MAX_DISPLAY_DB, Math.max(MIN_DISPLAY_DB, v));
      const y = height - (clamped / MAX_DISPLAY_DB) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export type NoiseBand =
  'very-quiet' | 'quiet' | 'calm' | 'normal' | 'loud' | 'very-loud' | 'extreme';

/** 各区分の下限（目安dB）。昇順。 */
export const NOISE_BANDS: { band: NoiseBand; min: number }[] = [
  { band: 'very-quiet', min: 0 },
  { band: 'quiet', min: 30 },
  { band: 'calm', min: 40 },
  { band: 'normal', min: 50 },
  { band: 'loud', min: 60 },
  { band: 'very-loud', min: 70 },
  { band: 'extreme', min: 85 },
];

/** 目安dBから騒音レベルの区分を判定する。 */
export function classifyNoise(db: number): NoiseBand {
  let result: NoiseBand = 'very-quiet';
  for (const entry of NOISE_BANDS) {
    if (db >= entry.min) result = entry.band;
  }
  return result;
}

/** 目安dBを「62」のように整数文字列にする。 */
export function formatDb(db: number): string {
  return String(Math.round(db));
}
