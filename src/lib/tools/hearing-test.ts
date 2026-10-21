/** テスト周波数の下限・上限（Hz） */
export const MIN_TEST_FREQUENCY = 8000;
export const MAX_TEST_FREQUENCY = 20000;
/** 周波数の間隔として選べる値（Hz） */
export const STEP_OPTIONS = [500, 1000, 2000] as const;
export const DEFAULT_STEP = 1000;
/** 1回の再生時間（秒） */
export const TONE_SECONDS = 2;
/** フェードイン／アウトの長さ（秒）。クリックノイズを防ぐ。 */
export const FADE_SECONDS = 0.15;
/** 音量スライダーの上限（%）。耳を守るため、これ以上は上げられない。 */
export const MAX_VOLUME_PERCENT = 50;
export const DEFAULT_VOLUME_PERCENT = 10;
/** ゲイン全体の上限（スライダー最大でも、これを超えない） */
const MAX_GAIN = 0.25;

/** 間隔（Hz）を選択肢のいずれかにする。不正値は既定値。 */
export function normalizeStep(value: number): number {
  return (STEP_OPTIONS as readonly number[]).includes(value)
    ? value
    : DEFAULT_STEP;
}

/** 開始〜上限までを step 刻みで並べた周波数リスト（Hz、昇順）。 */
export function frequencyList(
  step: number,
  from = MIN_TEST_FREQUENCY,
  to = MAX_TEST_FREQUENCY,
): number[] {
  const s = normalizeStep(step);
  const list: number[] = [];
  for (let f = from; f <= to; f += s) list.push(f);
  return list;
}

/** 音量スライダー値を 0〜上限(%) に収める。数値でなければ既定値。 */
export function clampVolumePercent(percent: number): number {
  if (!Number.isFinite(percent)) return DEFAULT_VOLUME_PERCENT;
  return Math.min(MAX_VOLUME_PERCENT, Math.max(0, percent));
}

/** 音量(%)をゲインにする。二乗カーブで、上限でも MAX_GAIN 以下。 */
export function hearingGain(percent: number): number {
  const p = clampVolumePercent(percent) / MAX_VOLUME_PERCENT;
  return p * p * MAX_GAIN;
}

/** 出力機器のサンプルレートで再生できる最高周波数（ナイキスト周波数の手前まで）。 */
export function maxPlayableFrequency(sampleRate: number): number {
  if (!Number.isFinite(sampleRate) || sampleRate <= 0) return 0;
  return Math.floor((sampleRate / 2) * 0.98);
}

export function isPlayable(frequency: number, sampleRate: number): boolean {
  return frequency <= maxPlayableFrequency(sampleRate);
}

export interface ToneSchedule {
  /** フェードイン終了時刻（開始からの秒） */
  attackEnd: number;
  /** フェードアウト開始時刻 */
  releaseStart: number;
  /** 終了時刻 */
  end: number;
}

/** フェードを含む再生スケジュール。短すぎる音ではフェードを半分ずつに縮める。 */
export function toneSchedule(
  duration = TONE_SECONDS,
  fade = FADE_SECONDS,
): ToneSchedule {
  const d = Math.max(0, duration);
  const f = Math.min(Math.max(0, fade), d / 2);
  return { attackEnd: f, releaseStart: d - f, end: d };
}

/** 時刻 t（秒）でのフェード包絡（0〜1）。 */
export function envelopeGain(
  t: number,
  duration = TONE_SECONDS,
  fade = FADE_SECONDS,
): number {
  const { attackEnd, releaseStart, end } = toneSchedule(duration, fade);
  if (t <= 0 || t >= end) return 0;
  if (t < attackEnd) return t / attackEnd;
  if (t > releaseStart) return (end - t) / (end - releaseStart);
  return 1;
}

/** 周波数の表示（例: 8000 → "8 kHz"、12500 → "12.5 kHz"）。 */
export function formatHz(frequency: number): string {
  return `${Number((frequency / 1000).toFixed(2))} kHz`;
}

export interface AgeGuide {
  /** 聞こえた最高周波数。聞こえたものが無ければ null */
  highest: number | null;
  /** 年齢の目安の上限（「およそ◯歳以下」）。null は目安なし */
  maxAge: number | null;
  /** none: 未選択 / low: 12kHz未満 / normal: 目安あり */
  kind: 'none' | 'low' | 'normal';
}

/** 聞こえた最高周波数（Hz）と、年齢目安の上限の対応表。上から順に判定する。 */
export const AGE_TABLE: readonly { from: number; maxAge: number }[] = [
  { from: 19000, maxAge: 20 },
  { from: 17000, maxAge: 25 },
  { from: 16000, maxAge: 30 },
  { from: 15000, maxAge: 40 },
  { from: 14000, maxAge: 50 },
  { from: 12000, maxAge: 60 },
];

/**
 * 聞こえた周波数から年齢の目安を出す。医学的な診断ではなく、
 * 一般に言われる傾向に基づく大まかな目安。機器の再生限界にも左右される。
 */
export function ageGuide(heard: readonly number[]): AgeGuide {
  const valid = heard.filter((f) => Number.isFinite(f));
  if (valid.length === 0) return { highest: null, maxAge: null, kind: 'none' };
  const highest = Math.max(...valid);
  const row = AGE_TABLE.find((r) => highest >= r.from);
  if (!row) return { highest, maxAge: null, kind: 'low' };
  return { highest, maxAge: row.maxAge, kind: 'normal' };
}
