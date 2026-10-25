/**
 * 音声の無音区間検出・カット（ブラウザ完結）のロジック。
 *
 * Float32 チャンネル配列から 10ms 窓ごとのピーク（エンベロープ）を求め、しきい値(dB)以下が
 * 最小無音長以上続く区間を無音として検出する。無音は「カット（余白だけ残して削除）」または
 * 「短縮（指定の長さまで詰める）」で取り除く。WAV 書き出しや判定は audio-speed-changer を再利用する。
 */
import {
  encodeWavBlob,
  formatDuration,
  formatFileSize,
  isAcceptedAudioFile,
} from './audio-speed-changer';

export { encodeWavBlob, formatDuration, formatFileSize, isAcceptedAudioFile };

/** 音声の長さの上限（秒） */
export const MAX_DURATION_SECONDS = 600;
/** 1ファイルのサイズ上限（バイト） */
export const MAX_FILE_SIZE = 200 * 1024 * 1024;

export const MIN_THRESHOLD_DB = -100;
export const MAX_THRESHOLD_DB = 0;
export const MIN_SILENCE_SECONDS = 0.05;
export const MAX_SILENCE_SECONDS = 60;
export const MAX_PADDING_SECONDS = 5;
export const MAX_SHORTEN_SECONDS = 10;
/** エンベロープの窓の長さ（秒） */
export const WINDOW_SECONDS = 0.01;
/** つなぎ目に入れる短いフェード（秒）。プチ音の抑制用 */
export const JOIN_FADE_SECONDS = 0.002;
/** 波形表示の下限（dB） */
export const DISPLAY_FLOOR_DB = -72;

export type RemoveMode = 'cut' | 'shorten';

export type ParseResult =
  { ok: true; value: number } | { ok: false; error: 'invalid' | 'outOfRange' };

/** 全角数字・マイナス・カンマ小数点を整えて数値化する。空欄・NaN は null */
function parseNumber(input: string): number | null {
  const normalized = input
    .trim()
    .replace(/[０-９．－−]/g, (c) =>
      c === '．'
        ? '.'
        : c === '－' || c === '−'
          ? '-'
          : String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    )
    .replace(/,/g, '.');
  if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(normalized)) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function parseInRange(input: string, min: number, max: number): ParseResult {
  const n = parseNumber(input);
  if (n === null) return { ok: false, error: 'invalid' };
  if (n < min || n > max) return { ok: false, error: 'outOfRange' };
  return { ok: true, value: n };
}

/** しきい値(dB)。-100〜0 */
export function parseThresholdDb(input: string): ParseResult {
  return parseInRange(input, MIN_THRESHOLD_DB, MAX_THRESHOLD_DB);
}

/** 最小無音長（秒）。0.05〜60 */
export function parseMinSilence(input: string): ParseResult {
  return parseInRange(input, MIN_SILENCE_SECONDS, MAX_SILENCE_SECONDS);
}

/** 残す余白（秒）。0〜5 */
export function parsePadding(input: string): ParseResult {
  return parseInRange(input, 0, MAX_PADDING_SECONDS);
}

/** 短縮後の無音の長さ（秒）。0〜10 */
export function parseShortenSeconds(input: string): ParseResult {
  return parseInRange(input, 0, MAX_SHORTEN_SECONDS);
}

/* ------------------------------ dB 変換 ------------------------------ */

export function dbToAmplitude(db: number): number {
  return Math.pow(10, db / 20);
}

export function amplitudeToDb(amplitude: number): number {
  if (amplitude <= 0) return -Infinity;
  return 20 * Math.log10(amplitude);
}

/** 振幅（0〜1）を波形表示用の 0〜1 に変換する（dB の対数表示。floorDb 以下は 0） */
export function amplitudeToDisplay(
  amplitude: number,
  floorDb: number = DISPLAY_FLOOR_DB,
): number {
  const db = amplitudeToDb(Math.abs(amplitude));
  if (!(db > floorDb)) return 0;
  return Math.min(1, (db - floorDb) / -floorDb);
}

/* ------------------------------ 解析 ------------------------------ */

/** 窓の長さ（フレーム） */
export function windowFrames(sampleRate: number): number {
  return Math.max(1, Math.round(sampleRate * WINDOW_SECONDS));
}

/** 全チャンネルの絶対値の最大を、窓ごとに求める */
export function computeEnvelope(
  channels: Float32Array[],
  window: number,
): Float32Array {
  if (channels.length === 0) return new Float32Array(0);
  const frames = Math.min(...channels.map((c) => c.length));
  const count = Math.ceil(frames / window);
  const env = new Float32Array(count);
  for (const ch of channels) {
    for (let w = 0; w < count; w++) {
      const end = Math.min(frames, (w + 1) * window);
      let peak = env[w];
      for (let i = w * window; i < end; i++) {
        const v = Math.abs(ch[i]);
        if (v > peak) peak = v;
      }
      env[w] = peak;
    }
  }
  return env;
}

/** 波形表示用に、等分した区間ごとのピーク（0〜1）を求める */
export function computePeaks(
  channels: Float32Array[],
  buckets: number,
): Float32Array {
  if (channels.length === 0 || buckets < 1) return new Float32Array(0);
  const frames = Math.min(...channels.map((c) => c.length));
  const peaks = new Float32Array(buckets);
  if (frames === 0) return peaks;
  for (const ch of channels) {
    for (let b = 0; b < buckets; b++) {
      const start = Math.floor((b * frames) / buckets);
      const end = Math.max(start + 1, Math.floor(((b + 1) * frames) / buckets));
      let peak = peaks[b];
      for (let i = start; i < Math.min(end, frames); i++) {
        const v = Math.abs(ch[i]);
        if (v > peak) peak = v;
      }
      peaks[b] = peak;
    }
  }
  return peaks;
}

export interface FrameRange {
  /** 開始フレーム（含む） */
  start: number;
  /** 終了フレーム（含まない） */
  end: number;
}

export interface DetectOptions {
  thresholdDb: number;
  minSilenceSeconds: number;
}

/**
 * エンベロープから無音区間（フレーム範囲）を検出する。
 * しきい値以下（<=）の窓が連続し、長さが最小無音長以上のものだけを返す。
 */
export function detectSilence(
  envelope: Float32Array,
  window: number,
  totalFrames: number,
  sampleRate: number,
  options: DetectOptions,
): FrameRange[] {
  const threshold = dbToAmplitude(options.thresholdDb);
  const minFrames = Math.max(
    1,
    Math.round(options.minSilenceSeconds * sampleRate),
  );
  const ranges: FrameRange[] = [];
  let runStart = -1;
  const flush = (endWindow: number) => {
    if (runStart < 0) return;
    const start = runStart * window;
    const end = Math.min(totalFrames, endWindow * window);
    if (end - start >= minFrames) ranges.push({ start, end });
    runStart = -1;
  };
  for (let w = 0; w < envelope.length; w++) {
    if (envelope[w] <= threshold) {
      if (runStart < 0) runStart = w;
    } else {
      flush(w);
    }
  }
  flush(envelope.length);
  return ranges;
}

export interface RemovalOptions {
  mode: RemoveMode;
  /** `cut`: 無音の両端に残す余白（秒） */
  paddingSeconds: number;
  /** `shorten`: 短縮後の無音の長さ（秒）。両端に半分ずつ残す */
  shortenSeconds: number;
}

/**
 * 無音区間から、実際に削除する範囲を求める。
 * 音のある側にだけ余白（または短縮後の無音）を残し、ファイルの先頭・末尾側には残さない。
 */
export function computeRemovals(
  silences: FrameRange[],
  totalFrames: number,
  sampleRate: number,
  options: RemovalOptions,
): FrameRange[] {
  const keep =
    options.mode === 'cut'
      ? Math.round(Math.max(0, options.paddingSeconds) * sampleRate)
      : Math.floor(
          Math.round(Math.max(0, options.shortenSeconds) * sampleRate) / 2,
        );
  const removals: FrameRange[] = [];
  for (const range of silences) {
    const head = range.start === 0 ? 0 : keep;
    const tail = range.end >= totalFrames ? 0 : keep;
    const start = range.start + head;
    const end = range.end - tail;
    if (end > start) removals.push({ start, end });
  }
  return removals;
}

/** 削除範囲の外側（残す範囲）を求める */
export function keepSegments(
  totalFrames: number,
  removals: FrameRange[],
): FrameRange[] {
  const segments: FrameRange[] = [];
  let pos = 0;
  for (const r of removals) {
    if (r.start > pos) segments.push({ start: pos, end: r.start });
    pos = Math.max(pos, r.end);
  }
  if (pos < totalFrames) segments.push({ start: pos, end: totalFrames });
  return segments;
}

/** 削除範囲を取り除いた音声を返す。つなぎ目には短いフェードを入れる */
export function applyRemovals(
  channels: Float32Array[],
  removals: FrameRange[],
  sampleRate: number,
): Float32Array[] {
  if (channels.length === 0) return [];
  const total = Math.min(...channels.map((c) => c.length));
  const segments = keepSegments(total, removals);
  const outLength = segments.reduce((sum, s) => sum + (s.end - s.start), 0);
  const fadeBase = Math.round(sampleRate * JOIN_FADE_SECONDS);
  return channels.map((src) => {
    const out = new Float32Array(outLength);
    let pos = 0;
    for (const seg of segments) {
      const len = seg.end - seg.start;
      out.set(src.subarray(seg.start, seg.end), pos);
      const fade = Math.min(fadeBase, Math.floor(len / 2));
      if (seg.start > 0) {
        for (let i = 0; i < fade; i++) out[pos + i] *= i / fade;
      }
      if (seg.end < total) {
        for (let i = 0; i < fade; i++) out[pos + len - 1 - i] *= i / fade;
      }
      pos += len;
    }
    return out;
  });
}

export interface RemovalSummary {
  originalSeconds: number;
  resultSeconds: number;
  removedSeconds: number;
  /** 削減した割合（0〜100） */
  removedPercent: number;
  /** 検出した無音区間の数 */
  silenceCount: number;
  /** 実際にカットする箇所の数 */
  cutCount: number;
}

export function summarize(
  totalFrames: number,
  sampleRate: number,
  silences: FrameRange[],
  removals: FrameRange[],
): RemovalSummary {
  const removedFrames = removals.reduce((sum, r) => sum + (r.end - r.start), 0);
  const originalSeconds = totalFrames / sampleRate;
  const removedSeconds = removedFrames / sampleRate;
  return {
    originalSeconds,
    resultSeconds: originalSeconds - removedSeconds,
    removedSeconds,
    removedPercent: totalFrames > 0 ? (removedFrames / totalFrames) * 100 : 0,
    silenceCount: silences.length,
    cutCount: removals.length,
  };
}

/* ------------------------------ 補助 ------------------------------ */

/** 0.1 秒単位の長さ表示（例: 1:05.3） */
export function formatPreciseDuration(seconds: number): string {
  const tenths = Math.max(0, Math.round(seconds * 10));
  const total = Math.floor(tenths / 10);
  const t = tenths % 10;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${s}.${t}`
    : `${m}:${s}.${t}`;
}

/** 出力ファイル名（拡張子を .wav にして `-nosilence` を付ける） */
export function buildOutputFileName(originalName: string): string {
  const base = originalName.replace(/\.[^./\\]+$/, '') || 'audio';
  return `${base}-nosilence.wav`;
}
