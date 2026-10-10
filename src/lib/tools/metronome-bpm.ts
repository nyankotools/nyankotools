export const MIN_BPM = 20;
export const MAX_BPM = 300;
export const DEFAULT_BPM = 120;
export const MIN_BEATS_PER_BAR = 1;
export const MAX_BEATS_PER_BAR = 12;
/** タップテンポで平均に使う直近のタップ数 */
export const MAX_TAPS = 8;
/** この時間（ミリ秒）以上タップが空いたら、新しい計測として数え直す */
export const TAP_RESET_MS = 3000;

/** 1拍を何分割して鳴らすか（1=四分音符のみ、2=八分、3=三連符、4=十六分） */
export type Subdivision = 1 | 2 | 3 | 4;
export const SUBDIVISIONS: readonly Subdivision[] = [1, 2, 3, 4];

/** BPM を 20〜300 の整数に収める。数値でなければ 120。 */
export function clampBpm(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_BPM;
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));
}

/** 1小節の拍数を 1〜12 の整数に収める。数値でなければ 4。 */
export function clampBeatsPerBar(value: number): number {
  if (!Number.isFinite(value)) return 4;
  return Math.min(
    MAX_BEATS_PER_BAR,
    Math.max(MIN_BEATS_PER_BAR, Math.round(value)),
  );
}

/** 1拍の長さ（秒）。 */
export function beatSeconds(bpm: number): number {
  return 60 / clampBpm(bpm);
}

/** 分割した1打あたりの長さ（秒）。 */
export function tickSeconds(bpm: number, subdivision: Subdivision): number {
  return beatSeconds(bpm) / subdivision;
}

export interface TickInfo {
  /** 小節内の拍番号（1始まり） */
  beat: number;
  /** 拍内の分割位置（0が拍の頭） */
  sub: number;
  /** 小節の頭（アクセント）か */
  accent: boolean;
}

/** 通し番号 n 打目（0始まり）が、小節のどの拍・分割位置かを返す。 */
export function tickInfo(
  n: number,
  beatsPerBar: number,
  subdivision: Subdivision,
): TickInfo {
  const bar = clampBeatsPerBar(beatsPerBar);
  const index = Math.max(0, Math.floor(n));
  const sub = index % subdivision;
  const beat = (Math.floor(index / subdivision) % bar) + 1;
  return { beat, sub, accent: beat === 1 && sub === 0 };
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

const TEMPO_TERMS: { max: number; name: string }[] = [
  { max: 40, name: 'Grave' },
  { max: 60, name: 'Largo' },
  { max: 66, name: 'Larghetto' },
  { max: 76, name: 'Adagio' },
  { max: 108, name: 'Andante' },
  { max: 120, name: 'Moderato' },
  { max: 156, name: 'Allegro' },
  { max: 176, name: 'Vivace' },
  { max: 200, name: 'Presto' },
];

/** BPM に対応する速度標語（イタリア語）。目安であり、境界は曲や流派で異なる。 */
export function tempoTerm(bpm: number): string {
  const b = clampBpm(bpm);
  return TEMPO_TERMS.find((t) => b < t.max)?.name ?? 'Prestissimo';
}
