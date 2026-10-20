export const MIN_BPM = 20;
export const MAX_BPM = 300;
export const DEFAULT_BPM = 120;
/** タップテンポで平均に使う直近のタップ数 */
export const MAX_TAPS = 8;
/** この時間（ミリ秒）以上タップが空いたら、新しい計測として数え直す */
export const TAP_RESET_MS = 3000;

/** 音符の種類。1 = 全音符、4 = 四分音符（1拍） */
export type NoteDenominator = 1 | 2 | 4 | 8 | 16 | 32 | 64;
export const NOTE_DENOMINATORS: readonly NoteDenominator[] = [
  1, 2, 4, 8, 16, 32, 64,
];

/** straight = 通常、dotted = 付点、triplet = 3連符 */
export type NoteKind = 'straight' | 'dotted' | 'triplet';
export const NOTE_KINDS: readonly NoteKind[] = [
  'straight',
  'dotted',
  'triplet',
];

const KIND_FACTOR: Record<NoteKind, number> = {
  straight: 1,
  dotted: 1.5,
  triplet: 2 / 3,
};

/** BPM を 20〜300 に収め、小数第2位に丸める。数値でなければ 120。 */
export function clampBpm(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_BPM;
  const clamped = Math.min(MAX_BPM, Math.max(MIN_BPM, value));
  return Math.round(clamped * 100) / 100;
}

/** 四分音符（1拍）の長さ（ミリ秒）。 */
export function beatMs(bpm: number): number {
  return 60000 / clampBpm(bpm);
}

/** 指定した音符の長さ（ミリ秒）。四分音符を1拍とする。 */
export function noteMs(
  bpm: number,
  denominator: NoteDenominator,
  kind: NoteKind = 'straight',
): number {
  return beatMs(bpm) * (4 / denominator) * KIND_FACTOR[kind];
}

/** ミリ秒の長さに対応する周波数（Hz。LFO やディレイのレート用）。 */
export function msToHz(ms: number): number {
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return 1000 / ms;
}

export interface DelayRow {
  denominator: NoteDenominator;
  straight: number;
  dotted: number;
  triplet: number;
}

/** 全音符〜64分音符それぞれの通常・付点・3連符の長さ（ミリ秒）。 */
export function delayTable(bpm: number): DelayRow[] {
  return NOTE_DENOMINATORS.map((denominator) => ({
    denominator,
    straight: noteMs(bpm, denominator, 'straight'),
    dotted: noteMs(bpm, denominator, 'dotted'),
    triplet: noteMs(bpm, denominator, 'triplet'),
  }));
}

export interface ReverbGuideItem {
  group: 'predelay' | 'decay';
  denominator: NoteDenominator;
  kind: NoteKind;
  ms: number;
}

const REVERB_GUIDE_DEFS: {
  group: 'predelay' | 'decay';
  denominator: NoteDenominator;
  kind: NoteKind;
}[] = [
  { group: 'predelay', denominator: 64, kind: 'straight' },
  { group: 'predelay', denominator: 32, kind: 'straight' },
  { group: 'predelay', denominator: 16, kind: 'straight' },
  { group: 'predelay', denominator: 8, kind: 'straight' },
  { group: 'decay', denominator: 4, kind: 'straight' },
  { group: 'decay', denominator: 2, kind: 'straight' },
  { group: 'decay', denominator: 1, kind: 'straight' },
];

/**
 * リバーブのプリディレイ（1/64〜1/8）とディケイ（1拍〜1小節）の目安。
 * テンポに同期させるための出発点で、最終的には耳で調整する。
 */
export function reverbGuide(bpm: number): ReverbGuideItem[] {
  return REVERB_GUIDE_DEFS.map((d) => ({
    ...d,
    ms: noteMs(bpm, d.denominator, d.kind),
  }));
}

/** ミリ秒の表示用文字列。小数第2位まで、末尾の 0 は省く。 */
export function formatMs(ms: number): string {
  return trimZeros(ms, 2);
}

/** Hz の表示用文字列。小数第2位まで、末尾の 0 は省く。 */
export function formatHz(hz: number): string {
  return trimZeros(hz, 2);
}

function trimZeros(value: number, digits: number): string {
  if (!Number.isFinite(value)) return '0';
  return String(Number(value.toFixed(digits)));
}

/**
 * タップ時刻（ミリ秒）の列に新しいタップを加える。
 * 直前のタップから TAP_RESET_MS 以上空いていたら数え直し、直近 MAX_TAPS 件だけ残す。
 */
export function addTap(taps: readonly number[], now: number): number[] {
  const last = taps[taps.length - 1];
  const base = last !== undefined && now - last >= TAP_RESET_MS ? [] : taps;
  return [...base, now].slice(-MAX_TAPS);
}

/** タップ列から BPM（小数）を求める。2回未満、または間隔が 0 以下なら null。 */
export function bpmFromTaps(taps: readonly number[]): number | null {
  if (taps.length < 2) return null;
  const span = taps[taps.length - 1] - taps[0];
  if (span <= 0) return null;
  return 60000 / (span / (taps.length - 1));
}
