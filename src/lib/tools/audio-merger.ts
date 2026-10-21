/**
 * 音声ファイル結合・フェード（ブラウザ完結）のロジック。
 *
 * 複数クリップ（Float32 チャンネル配列）を順に連結し、クリップ間の無音ギャップまたは
 * クロスフェード、全体の先頭フェードイン・末尾フェードアウトを適用する。
 * WAV エンコードや数値・ファイル判定は audio-speed-changer のものを再利用する。
 */
import {
  encodeWavBlob,
  formatDuration,
  formatFileSize,
  isAcceptedAudioFile,
  resample,
} from './audio-speed-changer';

export { encodeWavBlob, formatDuration, formatFileSize, isAcceptedAudioFile };

/** 結合できるファイル数の上限 */
export const MAX_CLIPS = 20;
/** 結合後の長さの上限（秒） */
export const MAX_TOTAL_SECONDS = 600;
/** 1ファイルのサイズ上限（バイト） */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const MAX_GAP_SECONDS = 60;
export const MAX_CROSSFADE_SECONDS = 30;
export const MAX_FADE_SECONDS = 60;

export type Transition = 'gap' | 'crossfade';

export interface AudioClip {
  channels: Float32Array[];
  sampleRate: number;
}

export interface MergeOptions {
  /** クリップ間のつなぎ方。`gap`: 無音を挟む / `crossfade`: 重ねて入れ替える */
  transition: Transition;
  /** `gap` のときの無音の長さ（秒） */
  gapSeconds: number;
  /** `crossfade` のときの重なりの長さ（秒） */
  crossfadeSeconds: number;
  /** 結合後の先頭のフェードイン（秒、0で無効） */
  fadeInSeconds: number;
  /** 結合後の末尾のフェードアウト（秒、0で無効） */
  fadeOutSeconds: number;
}

export type ParseResult =
  { ok: true; value: number } | { ok: false; error: 'invalid' | 'outOfRange' };

/** 全角数字・カンマ小数点を整えて数値化する。空欄・NaN は null */
function parseNumber(input: string): number | null {
  const normalized = input
    .trim()
    .replace(/[０-９．]/g, (c) =>
      c === '．' ? '.' : String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    )
    .replace(/,/g, '.');
  if (!/^(\d+\.?\d*|\.\d+)$/.test(normalized)) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/** 0〜max 秒の範囲で秒数を解釈する（負数は invalid） */
export function parseSeconds(input: string, max: number): ParseResult {
  const n = parseNumber(input);
  if (n === null) return { ok: false, error: 'invalid' };
  if (n > max) return { ok: false, error: 'outOfRange' };
  return { ok: true, value: n };
}

/* ------------------------------ 配置の計算 ------------------------------ */

export interface Layout {
  /** 各クリップの開始フレーム */
  starts: number[];
  /** クリップ i と i-1 の重なりフレーム数（i=0 は 0） */
  overlaps: number[];
  /** 結合後の総フレーム数 */
  total: number;
}

/**
 * 各クリップの長さ（フレーム）と設定から、開始位置と総フレーム数を求める。
 * クロスフェードの重なりは、隣り合うクリップのうち短い方の半分までに制限する
 * （3つ以上のクリップが同時に重ならないようにするため）。
 */
export function computeLayout(
  lengths: number[],
  sampleRate: number,
  options: MergeOptions,
): Layout {
  const starts: number[] = [];
  const overlaps: number[] = [];
  let total = 0;
  for (let i = 0; i < lengths.length; i++) {
    if (i === 0) {
      starts.push(0);
      overlaps.push(0);
      total = lengths[0];
      continue;
    }
    let start: number;
    let overlap = 0;
    if (options.transition === 'crossfade') {
      const wanted = Math.round(options.crossfadeSeconds * sampleRate);
      overlap = Math.max(
        0,
        Math.min(wanted, Math.floor(Math.min(lengths[i - 1], lengths[i]) / 2)),
      );
      start = starts[i - 1] + lengths[i - 1] - overlap;
    } else {
      const gap = Math.round(options.gapSeconds * sampleRate);
      start = starts[i - 1] + lengths[i - 1] + Math.max(0, gap);
    }
    starts.push(start);
    overlaps.push(overlap);
    total = Math.max(total, start + lengths[i]);
  }
  return { starts, overlaps, total };
}

/** 結合後の長さ（秒）の見積もり */
export function estimateDuration(
  durations: number[],
  options: MergeOptions,
): number {
  // 長さ（秒）を1000フレーム/秒として扱い、computeLayout を再利用する
  const rate = 1000;
  const layout = computeLayout(
    durations.map((d) => Math.round(d * rate)),
    rate,
    options,
  );
  return layout.total / rate;
}

/* ------------------------------ 結合 ------------------------------ */

/** チャンネル数を揃える（モノラルは複製、3ch以上は先頭2chに） */
export function toChannelCount(
  channels: Float32Array[],
  count: number,
): Float32Array[] {
  const out: Float32Array[] = [];
  for (let i = 0; i < count; i++) {
    out.push(channels[Math.min(i, channels.length - 1)]);
  }
  return out;
}

/** サンプルレートを変換する（線形補間。ブラウザ側でデコード時に揃えられる場合は不要） */
export function resampleToRate(
  channels: Float32Array[],
  fromRate: number,
  toRate: number,
): Float32Array[] {
  if (fromRate === toRate) return channels;
  return resample(channels, fromRate / toRate);
}

/**
 * クリップを結合して1本の音声にする。サンプルレートは先頭クリップに揃える。
 * 出力のチャンネル数は全クリップの最大（最大2）。
 */
export function mergeClips(
  clips: AudioClip[],
  options: MergeOptions,
): { channels: Float32Array[]; sampleRate: number; duration: number } {
  if (clips.length === 0) throw new Error('no clips');
  const sampleRate = clips[0].sampleRate;
  const outChannels = Math.min(
    2,
    Math.max(...clips.map((c) => c.channels.length)),
  );
  if (outChannels < 1) throw new Error('no channels');

  const prepared = clips.map((clip) => {
    const unified = resampleToRate(clip.channels, clip.sampleRate, sampleRate);
    return toChannelCount(unified, outChannels);
  });
  const lengths = prepared.map((p) => Math.min(...p.map((c) => c.length)));
  const layout = computeLayout(lengths, sampleRate, options);

  const out: Float32Array[] = [];
  for (let c = 0; c < outChannels; c++)
    out.push(new Float32Array(layout.total));

  for (let i = 0; i < prepared.length; i++) {
    const len = lengths[i];
    const start = layout.starts[i];
    const fadeInFrames = layout.overlaps[i];
    const fadeOutFrames = i + 1 < prepared.length ? layout.overlaps[i + 1] : 0;
    for (let c = 0; c < outChannels; c++) {
      const src = prepared[i][c];
      const dst = out[c];
      for (let j = 0; j < len; j++) {
        let g = 1;
        if (j < fadeInFrames) {
          g *= Math.sin((Math.PI / 2) * (j / fadeInFrames));
        }
        const tail = j - (len - fadeOutFrames);
        if (fadeOutFrames > 0 && tail >= 0) {
          g *= Math.cos((Math.PI / 2) * (tail / fadeOutFrames));
        }
        dst[start + j] += src[j] * g;
      }
    }
  }

  applyEdgeFades(
    out,
    Math.round(options.fadeInSeconds * sampleRate),
    Math.round(options.fadeOutSeconds * sampleRate),
  );
  return {
    channels: out,
    sampleRate,
    duration: layout.total / sampleRate,
  };
}

/** 先頭のフェードイン・末尾のフェードアウト（直線）を適用する（破壊的） */
export function applyEdgeFades(
  channels: Float32Array[],
  fadeInFrames: number,
  fadeOutFrames: number,
): void {
  for (const ch of channels) {
    const n = ch.length;
    const fin = Math.min(Math.max(0, fadeInFrames), n);
    const fout = Math.min(Math.max(0, fadeOutFrames), n);
    for (let i = 0; i < fin; i++) ch[i] *= i / fin;
    for (let i = 0; i < fout; i++) ch[n - 1 - i] *= i / fout;
  }
}

/* ------------------------------ 補助 ------------------------------ */

/** 配列内の要素を delta（-1: 上へ、+1: 下へ）だけ動かした新しい配列を返す。範囲外は変更なし */
export function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (index < 0 || index >= list.length) return list.slice();
  if (target < 0 || target >= list.length) return list.slice();
  const copy = list.slice();
  const [item] = copy.splice(index, 1);
  copy.splice(target, 0, item);
  return copy;
}

export function removeItem<T>(list: T[], index: number): T[] {
  if (index < 0 || index >= list.length) return list.slice();
  return list.filter((_, i) => i !== index);
}

/** 出力ファイル名（先頭ファイル名 + `-merged.wav`） */
export function buildOutputFileName(names: string[]): string {
  const first = names[0] ?? '';
  const base = first.replace(/\.[^./\\]+$/, '') || 'audio';
  return `${base}-merged.wav`;
}
