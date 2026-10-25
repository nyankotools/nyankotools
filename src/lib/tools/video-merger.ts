/**
 * 動画の結合（連結）のロジック。
 *
 * 複数の動画を、先頭の動画の解像度・fpsに揃えて1本につなぐ（mediabunny でデコード→再エンコード）。
 * - 映像: 出力は一定fps。各フレームを「次のフレームが来るまで保持」して出力のコマ時刻に割り当てる。
 *   解像度が違うクリップは、出力サイズの中に縦横比を保って収める（余白は黒）
 * - 音声: 48kHz ステレオに揃える。音声のないクリップ・音声が短いクリップは無音で補い、映像とずれないようにする
 * 数値計算（コマ割り・音声の配置・上限チェック）は純粋関数にしてテストする。
 */
import {
  ALL_FORMATS,
  AudioSample,
  AudioSampleSink,
  AudioSampleSource,
  BlobSource,
  BufferTarget,
  Input,
  Mp4OutputFormat,
  Output,
  QUALITY_HIGH,
  QUALITY_LOW,
  QUALITY_MEDIUM,
  QUALITY_VERY_LOW,
  VideoSample,
  VideoSampleSink,
  VideoSampleSource,
  WebMOutputFormat,
  canEncodeAudio,
  canEncodeVideo,
  type AudioCodec,
  type OutputFormat,
  type Quality,
  type VideoCodec,
} from 'mediabunny';
import {
  FORMAT_SPECS,
  buildOutputFileName,
  limitedHeight,
  type OutputFormatId,
  type QualityId,
} from './media-converter';
import { AudioSpeedResampler } from './video-speed-changer';
import { toChannelCount } from './audio-merger';

export {
  formatDuration,
  formatFileSize,
  isAcceptedMediaFile,
  readMediaInfo,
  HEIGHT_OPTIONS,
  QUALITY_IDS,
  isQualityId,
  type MediaInfo,
  type QualityId,
} from './media-converter';
export { moveItem, removeItem } from './audio-merger';

export type MergeOutputFormat = Extract<OutputFormatId, 'mp4' | 'webm'>;
export const MERGE_OUTPUT_FORMATS: MergeOutputFormat[] = ['mp4', 'webm'];

export function isMergeOutputFormat(value: string): value is MergeOutputFormat {
  return (MERGE_OUTPUT_FORMATS as string[]).includes(value);
}

/* ------------------------------ 上限 ------------------------------ */

/** 結合できるファイル数の上限 */
export const MAX_CLIPS = 10;
/** 1ファイルのサイズ上限（バイト） */
export const MAX_FILE_SIZE = 300 * 1024 * 1024;
/** 合計サイズの上限（バイト） */
export const MAX_TOTAL_SIZE = 600 * 1024 * 1024;
/** 結合後の合計の長さの上限（秒） */
export const MAX_TOTAL_SECONDS = 600;
/** 出力fpsの上限 */
export const MAX_OUTPUT_FPS = 60;
/** 出力fpsの下限 */
export const MIN_OUTPUT_FPS = 1;
/** 出力fpsが取れなかったときの既定値 */
export const DEFAULT_FPS = 30;
/** 出力音声のサンプルレート */
export const AUDIO_SAMPLE_RATE = 48000;
/** 出力音声のチャンネル数 */
export const AUDIO_CHANNELS = 2;

export interface ClipSummary {
  size: number;
  duration: number;
}

export type LimitError =
  'tooMany' | 'fileTooLarge' | 'totalTooLarge' | 'totalTooLong';

/**
 * 既存のクリップ一覧に `next` を足せるか調べる。足せるなら null、上限を超えるなら理由を返す。
 */
export function checkAddLimit(
  existing: ClipSummary[],
  next: ClipSummary,
): LimitError | null {
  if (existing.length + 1 > MAX_CLIPS) return 'tooMany';
  if (next.size > MAX_FILE_SIZE) return 'fileTooLarge';
  const totalSize = existing.reduce((a, c) => a + c.size, 0) + next.size;
  if (totalSize > MAX_TOTAL_SIZE) return 'totalTooLarge';
  const totalSeconds =
    existing.reduce((a, c) => a + c.duration, 0) + next.duration;
  if (totalSeconds > MAX_TOTAL_SECONDS) return 'totalTooLong';
  return null;
}

export function sumSize(clips: ClipSummary[]): number {
  return clips.reduce((a, c) => a + c.size, 0);
}

export function sumDuration(clips: ClipSummary[]): number {
  return clips.reduce((a, c) => a + (c.duration > 0 ? c.duration : 0), 0);
}

/** 各クリップの開始位置（秒）。先頭は 0 */
export function computeOffsets(durations: number[]): number[] {
  const offsets: number[] = [];
  let acc = 0;
  for (const d of durations) {
    offsets.push(acc);
    acc += d > 0 ? d : 0;
  }
  return offsets;
}

/* ------------------------------ 出力サイズ・fps ------------------------------ */

function even(n: number): number {
  return Math.max(2, Math.floor(n / 2) * 2);
}

/**
 * 出力の幅・高さを決める。先頭の動画のサイズを基準に、高さ上限（0 は無制限）を超える場合だけ縮小する。
 * 動画エンコーダの都合で幅・高さは偶数にそろえる。
 */
export function computeOutputSize(
  width: number,
  height: number,
  maxHeight: number,
): { width: number; height: number } {
  const w = width > 0 ? width : 2;
  const h = height > 0 ? height : 2;
  const limited = limitedHeight(h, maxHeight);
  if (!limited) return { width: even(w), height: even(h) };
  return { width: even((w * limited) / h), height: even(limited) };
}

/** 先頭動画のfpsを出力fpsに整える（29.97 → 30 のように整数に近ければ丸め、範囲外は収める） */
export function normalizeFps(rate: number): number {
  if (!Number.isFinite(rate) || rate <= 0) return DEFAULT_FPS;
  const clamped = Math.min(MAX_OUTPUT_FPS, Math.max(MIN_OUTPUT_FPS, rate));
  const rounded = Math.round(clamped);
  if (Math.abs(clamped - rounded) < 0.1) return rounded;
  return Math.round(clamped * 1000) / 1000;
}

/** 出力のコマ（一定fps）の時刻を、出力の先頭から順に払い出す */
export class FrameGrid {
  private next = 0;

  constructor(readonly fps: number) {
    if (!(fps > 0)) throw new Error('invalid fps');
  }

  /** 払い出し済みのコマ数 */
  get count(): number {
    return this.next;
  }

  /** `end`（秒）より前の、まだ払い出していないコマの時刻を返す */
  advanceTo(end: number): number[] {
    const endIndex = Math.ceil(end * this.fps - 1e-6);
    const times: number[] = [];
    while (this.next < endIndex) {
      times.push(this.next / this.fps);
      this.next++;
    }
    return times;
  }
}

/* ------------------------------ 音声の配置 ------------------------------ */

export interface AudioPlacement {
  /** チャンクの前に挟む無音のフレーム数 */
  silence: number;
  /** チャンクの先頭から捨てるフレーム数（重なり分） */
  skip: number;
  /** チャンクから使うフレーム数（クリップの終端を超える分は使わない） */
  take: number;
}

/**
 * 音声チャンクを出力のどこに置くか決める。
 * @param cursor 出力済みのフレーム数
 * @param startFrame チャンクを置きたい位置（出力先頭からのフレーム）
 * @param length チャンクのフレーム数
 * @param endFrame このクリップの終端位置（これ以降は使わない）
 */
export function planAudioChunk(
  cursor: number,
  startFrame: number,
  length: number,
  endFrame: number,
): AudioPlacement {
  const gap = startFrame - cursor;
  const silence = Math.max(0, Math.min(gap, endFrame - cursor));
  const skip = Math.min(length, Math.max(0, -gap));
  const room = Math.max(0, endFrame - (cursor + silence));
  const take = Math.max(0, Math.min(length - skip, room));
  return { silence, skip, take };
}

/* ------------------------------ ファイル名 ------------------------------ */

/** 先頭ファイル名 + `-merged` を出力名にする */
export function buildMergedFileName(
  names: string[],
  format: MergeOutputFormat,
): string {
  return buildOutputFileName(names[0] ?? '', format, '-merged');
}

/* ------------------------------ ブラウザ側の処理（mediabunny） ------------------------------ */

const QUALITY_MAP: Record<QualityId, Quality> = {
  high: QUALITY_HIGH,
  medium: QUALITY_MEDIUM,
  low: QUALITY_LOW,
  veryLow: QUALITY_VERY_LOW,
};

export type MergeErrorCode =
  'unsupported-input' | 'unsupported-output' | 'canceled' | 'failed';

export class MergeError extends Error {
  constructor(public code: MergeErrorCode) {
    super(code);
  }
}

export interface MergeClip {
  file: File;
  duration: number;
  hasAudio: boolean;
}

export interface MergeOptions {
  format: MergeOutputFormat;
  quality: QualityId;
  /** 0 は先頭動画のサイズのまま */
  maxHeight: number;
  removeAudio: boolean;
  /** 先頭動画の幅・高さ */
  firstWidth: number;
  firstHeight: number;
  onProgress?: (ratio: number) => void;
}

export interface MergeHandle {
  promise: Promise<{ blob: Blob; mimeType: string }>;
  cancel: () => void;
}

function createOutputFormat(id: MergeOutputFormat): OutputFormat {
  return id === 'webm' ? new WebMOutputFormat() : new Mp4OutputFormat();
}

/** 動画を結合する。進捗は options.onProgress（0〜1）で通知される */
export function mergeVideos(
  clips: MergeClip[],
  options: MergeOptions,
): MergeHandle {
  let canceled = false;
  let output: Output | null = null;
  let finalized = false;
  let notifyCanceled: () => void = () => {};
  const canceledSignal = new Promise<never>((_, reject) => {
    notifyCanceled = () => reject(new MergeError('canceled'));
  });
  canceledSignal.catch(() => {});

  const checkCanceled = () => {
    if (canceled) throw new MergeError('canceled');
  };

  const run = async () => {
    if (clips.length === 0) throw new MergeError('failed');
    const spec = FORMAT_SPECS[options.format];
    const quality = QUALITY_MAP[options.quality];
    const withAudio = !options.removeAudio && clips.some((c) => c.hasAudio);
    try {
      let videoCodec: VideoCodec | undefined;
      for (const c of spec.videoCodecs) {
        if (await canEncodeVideo(c, { quality })) {
          videoCodec = c;
          break;
        }
      }
      if (!videoCodec) throw new MergeError('unsupported-output');
      let audioCodec: AudioCodec | undefined;
      if (withAudio) {
        for (const c of spec.audioCodecs) {
          if (
            await canEncodeAudio(c, {
              quality,
              numberOfChannels: AUDIO_CHANNELS,
              sampleRate: AUDIO_SAMPLE_RATE,
            })
          ) {
            audioCodec = c;
            break;
          }
        }
        if (!audioCodec) throw new MergeError('unsupported-output');
      }
      checkCanceled();

      // 先頭動画のfpsを調べる
      const probe = new Input({
        source: new BlobSource(clips[0].file),
        formats: ALL_FORMATS,
      });
      let fps = DEFAULT_FPS;
      try {
        const track = await probe.getPrimaryVideoTrack();
        if (!track) throw new MergeError('failed');
        const stats = await track.computePacketStats(120);
        fps = normalizeFps(stats.averagePacketRate);
      } finally {
        probe.dispose();
      }
      checkCanceled();

      const size = computeOutputSize(
        options.firstWidth,
        options.firstHeight,
        options.maxHeight,
      );
      const target = new BufferTarget();
      const out = new Output({
        format: createOutputFormat(options.format),
        target,
      });
      output = out;
      const videoSource = new VideoSampleSource({
        codec: videoCodec,
        quality,
      });
      out.addVideoTrack(videoSource, { frameRate: fps });
      const audioSource =
        withAudio && audioCodec
          ? new AudioSampleSource({ codec: audioCodec, quality })
          : null;
      if (audioSource) out.addAudioTrack(audioSource);
      await out.start();
      checkCanceled();

      const durations = clips.map((c) => c.duration);
      const offsets = computeOffsets(durations);
      const totalDuration = sumDuration(
        clips.map((c) => ({ size: 0, duration: c.duration })),
      );
      const grid = new FrameGrid(fps);
      const canvas = new OffscreenCanvas(size.width, size.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new MergeError('failed');
      let audioCursor = 0;

      const addSilence = async (frames: number) => {
        if (!audioSource) return;
        let remaining = frames;
        while (remaining > 0) {
          checkCanceled();
          const n = Math.min(remaining, AUDIO_SAMPLE_RATE);
          const sample = new AudioSample({
            data: new Float32Array(n * AUDIO_CHANNELS),
            format: 'f32-planar',
            numberOfChannels: AUDIO_CHANNELS,
            sampleRate: AUDIO_SAMPLE_RATE,
            timestamp: audioCursor / AUDIO_SAMPLE_RATE,
          });
          await audioSource.add(sample);
          sample.close();
          audioCursor += n;
          remaining -= n;
        }
      };

      for (let i = 0; i < clips.length; i++) {
        checkCanceled();
        const clip = clips[i];
        const offset = offsets[i];
        const input = new Input({
          source: new BlobSource(clip.file),
          formats: ALL_FORMATS,
        });
        try {
          const videoTrack = await input.getPrimaryVideoTrack();
          if (!videoTrack) throw new MergeError('failed');
          if (!(await videoTrack.canDecode())) {
            throw new MergeError('unsupported-input');
          }
          const audioTrack = withAudio
            ? await input.getPrimaryAudioTrack()
            : null;
          if (audioTrack && !(await audioTrack.canDecode())) {
            throw new MergeError('unsupported-input');
          }

          const pumpVideo = async () => {
            const sink = new VideoSampleSink(videoTrack);
            let pending: VideoSample | null = null;
            const flush = async (endLocal: number) => {
              if (!pending) return;
              const times = grid.advanceTo(offset + endLocal);
              if (times.length > 0) {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, size.width, size.height);
                pending.drawWithFit(ctx, { fit: 'contain' });
                for (const t of times) {
                  checkCanceled();
                  const frame = new VideoSample(canvas, {
                    timestamp: t,
                    duration: 1 / fps,
                  });
                  await videoSource.add(frame);
                  frame.close();
                }
                if (totalDuration > 0) {
                  options.onProgress?.(
                    Math.min(1, (offset + endLocal) / totalDuration),
                  );
                }
              }
              pending.close();
              pending = null;
            };
            try {
              for await (const sample of sink.samples()) {
                if (canceled) {
                  sample.close();
                  throw new MergeError('canceled');
                }
                await flush(sample.timestamp);
                pending = sample;
              }
              await flush(clip.duration);
            } finally {
              (pending as VideoSample | null)?.close();
            }
          };

          const pumpAudio = async () => {
            if (!audioSource) return;
            const endFrame = Math.round(
              (offset + clip.duration) * AUDIO_SAMPLE_RATE,
            );
            if (audioTrack) {
              const sink = new AudioSampleSink(audioTrack);
              let resampler: AudioSpeedResampler | null = null;
              let first = true;
              for await (const sample of sink.samples()) {
                try {
                  checkCanceled();
                  const channels: Float32Array[] = [];
                  for (let c = 0; c < sample.numberOfChannels; c++) {
                    const plane = new Float32Array(sample.numberOfFrames);
                    sample.copyTo(plane, {
                      planeIndex: c,
                      format: 'f32-planar',
                    });
                    channels.push(plane);
                  }
                  if (channels.length === 0) continue;
                  let planes = toChannelCount(channels, AUDIO_CHANNELS);
                  if (sample.sampleRate !== AUDIO_SAMPLE_RATE) {
                    resampler ??= new AudioSpeedResampler(
                      sample.sampleRate / AUDIO_SAMPLE_RATE,
                      AUDIO_CHANNELS,
                    );
                    planes = resampler.process(planes);
                  }
                  const length = planes[0].length;
                  if (length === 0) continue;
                  const startFrame = first
                    ? Math.round(
                        (offset + sample.timestamp) * AUDIO_SAMPLE_RATE,
                      )
                    : audioCursor;
                  first = false;
                  const plan = planAudioChunk(
                    audioCursor,
                    startFrame,
                    length,
                    endFrame,
                  );
                  await addSilence(plan.silence);
                  if (plan.take > 0) {
                    const data = new Float32Array(plan.take * AUDIO_CHANNELS);
                    planes.forEach((p, c) =>
                      data.set(
                        p.subarray(plan.skip, plan.skip + plan.take),
                        c * plan.take,
                      ),
                    );
                    const chunk = new AudioSample({
                      data,
                      format: 'f32-planar',
                      numberOfChannels: AUDIO_CHANNELS,
                      sampleRate: AUDIO_SAMPLE_RATE,
                      timestamp: audioCursor / AUDIO_SAMPLE_RATE,
                    });
                    await audioSource.add(chunk);
                    chunk.close();
                    audioCursor += plan.take;
                  }
                } finally {
                  sample.close();
                }
              }
            }
            // 音声がない・短いクリップは無音で補い、次のクリップの音声が映像とずれないようにする
            await addSilence(endFrame - audioCursor);
          };

          const settled = await Promise.allSettled([pumpVideo(), pumpAudio()]);
          for (const r of settled) if (r.status === 'rejected') throw r.reason;
        } finally {
          input.dispose();
        }
      }

      checkCanceled();
      await out.finalize();
      finalized = true;
      if (!target.buffer) throw new MergeError('failed');
      const mimeType = await out.getMimeType();
      return { blob: new Blob([target.buffer], { type: mimeType }), mimeType };
    } catch (e) {
      if (canceled) throw new MergeError('canceled');
      if (e instanceof MergeError) throw e;
      throw new MergeError('failed');
    } finally {
      if (output && !finalized)
        await (output as Output).cancel().catch(() => {});
    }
  };

  const promise = (async () => {
    const task = run();
    task.catch(() => {});
    return Promise.race([task, canceledSignal]);
  })();

  return {
    promise,
    cancel: () => {
      canceled = true;
      notifyCanceled();
      output?.cancel().catch(() => {});
    },
  };
}
