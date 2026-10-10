import { CanvasSink, ALL_FORMATS, BlobSource, Input } from 'mediabunny';
import type { Size } from './image-cropper';
import {
  encodeGifSteps,
  gifSizeForWidth,
  MAX_GIF_WIDTH,
  quantize,
  type GifFrame,
} from './gif-maker';
import { parseTimeInput } from './media-converter';

export {
  MAX_FILE_SIZE,
  formatDuration,
  formatFileSize,
  isAcceptedMediaFile,
  readMediaInfo,
  type MediaInfo,
} from './media-converter';

/** GIFにするコマ数の上限 */
export const MAX_GIF_FRAMES = 300;
/** 全コマの画素数の合計の上限。減色後のインデックス配列のメモリを抑える */
export const MAX_TOTAL_PIXELS = 120_000_000;
/** 終了を空欄にしたとき、開始から何秒間をGIFにするか */
export const DEFAULT_GIF_SECONDS = 10;
export const FPS_OPTIONS = [5, 10, 15, 20] as const;
export const DEFAULT_WIDTH = 480;

export type RangeError = 'invalid' | 'outOfRange' | 'order';

export type RangeResult =
  { ok: true; start: number; end: number } | { ok: false; error: RangeError };

/**
 * 開始・終了の入力欄の値から、GIFにする範囲（秒）を決める。
 * 開始が空なら 0 秒から。終了が空なら、開始から DEFAULT_GIF_SECONDS 秒後（動画の長さまで）。
 */
export function resolveGifRange(
  startText: string,
  endText: string,
  duration: number,
): RangeResult {
  const start = parseTimeInput(startText);
  const end = parseTimeInput(endText);
  if (
    (start !== null && Number.isNaN(start)) ||
    (end !== null && Number.isNaN(end))
  ) {
    return { ok: false, error: 'invalid' };
  }
  const s = start ?? 0;
  if (s >= duration) return { ok: false, error: 'outOfRange' };
  const e = end === null ? Math.min(duration, s + DEFAULT_GIF_SECONDS) : end;
  if (e > duration + 0.05) return { ok: false, error: 'outOfRange' };
  if (s >= e) return { ok: false, error: 'order' };
  return { ok: true, start: s, end: Math.min(e, duration) };
}

export type FrameTimeResult =
  { ok: true; time: number } | { ok: false; error: 'invalid' | 'outOfRange' };

/** フレーム抽出の時刻。空欄は 0 秒。動画の長さ以降は範囲外 */
export function resolveFrameTime(
  text: string,
  duration: number,
): FrameTimeResult {
  const value = parseTimeInput(text);
  if (value !== null && Number.isNaN(value)) {
    return { ok: false, error: 'invalid' };
  }
  const time = value ?? 0;
  if (time >= duration) return { ok: false, error: 'outOfRange' };
  return { ok: true, time };
}

export type PlanError = 'tooManyFrames' | 'tooLarge';

export type GifPlan =
  | { ok: true; timestamps: number[]; width: number; height: number }
  | { ok: false; error: PlanError; max: number };

/**
 * 範囲・FPS・幅から、取り出す時刻の一覧とGIFの大きさを決める。
 * 幅は元の動画より大きくしない。コマ数・総画素数が上限を超えるときはエラー。
 */
export function planGif(options: {
  start: number;
  end: number;
  fps: number;
  source: Size;
  width: number;
}): GifPlan {
  const { start, end, fps, source } = options;
  const count = Math.max(1, Math.floor((end - start) * fps + 1e-9));
  if (count > MAX_GIF_FRAMES) {
    return { ok: false, error: 'tooManyFrames', max: MAX_GIF_FRAMES };
  }
  const requested = Math.min(
    Math.max(Math.round(options.width) || DEFAULT_WIDTH, 16),
    MAX_GIF_WIDTH,
    source.width,
  );
  const { width, height } = gifSizeForWidth(source, requested);
  if (count * width * height > MAX_TOTAL_PIXELS) {
    return { ok: false, error: 'tooLarge', max: MAX_TOTAL_PIXELS };
  }
  const timestamps = Array.from({ length: count }, (_, i) =>
    Math.min(start + i / fps, Math.max(end - 0.001, start)),
  );
  return { ok: true, timestamps, width, height };
}

function baseName(originalName: string): string {
  const dot = originalName.lastIndexOf('.');
  return (dot > 0 ? originalName.slice(0, dot) : originalName) || 'video';
}

export function buildGifFileName(originalName: string): string {
  return `${baseName(originalName)}.gif`;
}

/** 例: clip.mp4 の 12.5 秒 → `clip-12.5s.png` */
export function buildFrameFileName(
  originalName: string,
  seconds: number,
): string {
  const rounded = Math.round(seconds * 10) / 10;
  return `${baseName(originalName)}-${rounded}s.png`;
}

// ---- ブラウザ側の処理（mediabunny / canvas） ----

export type VideoToGifErrorCode =
  'no-video' | 'unsupported-input' | 'canceled' | 'failed';

export class VideoToGifError extends Error {
  constructor(public code: VideoToGifErrorCode) {
    super(code);
  }
}

const yieldToBrowser = () => new Promise<void>((r) => setTimeout(r, 0));

async function openVideoTrack(input: Input) {
  const track = await input.getPrimaryVideoTrack();
  if (!track) throw new VideoToGifError('no-video');
  if (!(await track.canDecode())) {
    throw new VideoToGifError('unsupported-input');
  }
  return track;
}

function wrapError(e: unknown): VideoToGifError {
  return e instanceof VideoToGifError ? e : new VideoToGifError('failed');
}

export interface VideoToGifOptions {
  timestamps: number[];
  width: number;
  height: number;
  fps: number;
  loop: boolean;
  signal?: AbortSignal;
  /** 取り出し・書き出しの進捗（0〜1） */
  onProgress?: (ratio: number) => void;
}

/** 動画の指定時刻のコマを取り出し、減色してGIFにする */
export async function videoToGif(
  file: File,
  options: VideoToGifOptions,
): Promise<Blob> {
  const { timestamps, width, height, signal } = options;
  const input = new Input({
    source: new BlobSource(file),
    formats: ALL_FORMATS,
  });
  const throwIfCanceled = () => {
    if (signal?.aborted) throw new VideoToGifError('canceled');
  };
  try {
    const track = await openVideoTrack(input);
    const sink = new CanvasSink(track, { width, height, fit: 'fill' });
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new VideoToGifError('failed');

    const frames: GifFrame[] = [];
    const delayMs = 1000 / options.fps;
    let index = 0;
    // 最初の時刻に映像がない（先頭より前）ときは、先頭のコマで代用する
    const firstTimestamp = await track.getFirstTimestamp();
    const times = timestamps.map((t) => Math.max(t, firstTimestamp));
    for await (const wrapped of sink.canvasesAtTimestamps(times)) {
      throwIfCanceled();
      index++;
      options.onProgress?.((index / times.length) * 0.8);
      if (wrapped) {
        ctx.drawImage(wrapped.canvas as CanvasImageSource, 0, 0, width, height);
        const { data } = ctx.getImageData(0, 0, width, height);
        frames.push({ ...quantize(data, width * height), delayMs });
      }
      await yieldToBrowser();
    }
    if (frames.length === 0) throw new VideoToGifError('failed');
    // 取り出せなかったコマは、最後のコマで埋めて総再生時間を保つ
    while (frames.length < times.length) {
      frames.push({ ...frames[frames.length - 1] });
    }

    const steps = encodeGifSteps({
      width,
      height,
      frames,
      loop: options.loop,
    });
    let bytes: Uint8Array;
    for (;;) {
      throwIfCanceled();
      const step = steps.next();
      if (step.done) {
        bytes = step.value;
        break;
      }
      options.onProgress?.(0.8 + (step.value / frames.length) * 0.2);
      await yieldToBrowser();
    }
    return new Blob([bytes as BlobPart], { type: 'image/gif' });
  } catch (e) {
    if (signal?.aborted) throw new VideoToGifError('canceled');
    throw wrapError(e);
  } finally {
    input.dispose();
  }
}

export interface FramePng {
  blob: Blob;
  width: number;
  height: number;
}

/** 動画の指定時刻のコマを、元の解像度のPNGとして取り出す */
export async function extractFramePng(
  file: File,
  time: number,
): Promise<FramePng> {
  const input = new Input({
    source: new BlobSource(file),
    formats: ALL_FORMATS,
  });
  try {
    const track = await openVideoTrack(input);
    const sink = new CanvasSink(track);
    const firstTimestamp = await track.getFirstTimestamp();
    const wrapped = await sink.getCanvas(Math.max(time, firstTimestamp));
    if (!wrapped) throw new VideoToGifError('failed');
    const { canvas } = wrapped;
    const blob =
      'convertToBlob' in canvas
        ? await canvas.convertToBlob({ type: 'image/png' })
        : await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/png'),
          );
    if (!blob) throw new VideoToGifError('failed');
    return { blob, width: canvas.width, height: canvas.height };
  } catch (e) {
    throw wrapError(e);
  } finally {
    input.dispose();
  }
}
