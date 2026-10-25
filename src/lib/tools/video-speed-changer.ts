/**
 * 動画の再生速度変更（倍速・スロー）のロジック。
 *
 * mediabunny の Conversion を使い、映像・音声のタイムスタンプを 1/速度 に付け替えて再エンコードする。
 * - 映像: 各フレームの timestamp / duration を 1/速度 にする（倍速では出力fpsが上がりすぎないよう間引く）
 * - 音声: 線形補間でリサンプルし、再生速度に連動してピッチも変わる簡易方式
 */
import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  Mp4OutputFormat,
  Output,
  QUALITY_HIGH,
  QUALITY_LOW,
  QUALITY_MEDIUM,
  QUALITY_VERY_LOW,
  WebMOutputFormat,
  canEncodeAudio,
  canEncodeVideo,
  type AudioCodec,
  type OutputFormat,
  type Quality,
  type VideoCodec,
  AudioSample,
} from 'mediabunny';
import {
  FORMAT_SPECS,
  buildOutputFileName,
  limitedHeight,
  type OutputFormatId,
  type QualityId,
} from './media-converter';
import { MAX_SPEED, MIN_SPEED, parseSpeed } from './audio-speed-changer';

export {
  MAX_FILE_SIZE,
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
export { MAX_SPEED, MIN_SPEED, parseSpeed };

export type SpeedOutputFormat = Extract<OutputFormatId, 'mp4' | 'webm'>;
export const SPEED_OUTPUT_FORMATS: SpeedOutputFormat[] = ['mp4', 'webm'];

export function isSpeedOutputFormat(value: string): value is SpeedOutputFormat {
  return (SPEED_OUTPUT_FORMATS as string[]).includes(value);
}

/** ボタンで選べる速度のプリセット */
export const SPEED_PRESETS = [0.25, 0.5, 0.75, 1.5, 2, 3, 4] as const;
export const DEFAULT_SPEED = 2;
/** 倍速時に出力する映像の最大fps（これを超えるぶんは間引く） */
export const MAX_OUTPUT_FPS = 60;

/** 速度を表示用の文字列にする（例: 2 → "2", 0.25 → "0.25"） */
export function formatSpeed(speed: number): string {
  return String(Math.round(speed * 1000) / 1000);
}

/** 速度変更後の長さ（秒） */
export function outputDuration(duration: number, speed: number): number {
  return speed > 0 ? duration / speed : duration;
}

/** 例: clip.mp4 を 2倍速 → `clip-2x.mp4` */
export function buildSpeedFileName(
  originalName: string,
  format: SpeedOutputFormat,
  speed: number,
): string {
  return buildOutputFileName(originalName, format, `-${formatSpeed(speed)}x`);
}

export interface RetimedFrame {
  timestamp: number;
  duration: number;
}

/**
 * 映像フレームの時刻を 1/speed に付け替える関数を作る。
 * speed > 1 のとき、出力が maxFps を超えないようにフレームを間引く（間引くフレームは null）。
 * フレームは時刻順に渡すこと。
 */
export function createVideoRetimer(speed: number, maxFps = MAX_OUTPUT_FPS) {
  if (!(speed > 0)) throw new Error('invalid speed');
  const minGap = 1 / maxFps - 1e-6;
  let lastKept = -Infinity;
  return (timestamp: number, duration: number): RetimedFrame | null => {
    const outTs = timestamp / speed;
    if (speed > 1 && outTs - lastKept < minGap) return null;
    lastKept = outTs;
    return { timestamp: outTs, duration: duration / speed };
  };
}

/**
 * 連続した音声チャンク（プレーナー形式）を、線形補間で speed 倍速に変換する。
 * 出力の長さは入力の 1/speed、ピッチは speed 倍になる。チャンクの境目でも途切れないよう位置と末尾サンプルを引き継ぐ。
 */
export class AudioSpeedResampler {
  private pos = 0;
  private prev: number[];
  /** これまでに出力したフレーム数 */
  outputFrames = 0;

  constructor(
    private speed: number,
    numberOfChannels: number,
  ) {
    if (!(speed > 0)) throw new Error('invalid speed');
    this.prev = new Array<number>(numberOfChannels).fill(0);
  }

  process(channels: Float32Array[]): Float32Array[] {
    const n = channels.length > 0 ? channels[0].length : 0;
    if (n === 0) return channels.map(() => new Float32Array(0));
    // pos は今回のチャンク先頭からの位置。pos が n - 1 以上になる分は次のチャンクで続きを処理する
    const count = Math.max(0, Math.ceil((n - 1 - this.pos) / this.speed));
    const outs = channels.map(() => new Float32Array(count));
    for (let i = 0; i < count; i++) {
      const p = this.pos + i * this.speed;
      const i0 = Math.floor(p);
      const frac = p - i0;
      for (let c = 0; c < channels.length; c++) {
        const src = channels[c];
        const a = i0 < 0 ? this.prev[c] : src[i0];
        const b = src[Math.min(i0 + 1, n - 1)];
        outs[c][i] = a * (1 - frac) + b * frac;
      }
    }
    this.pos = this.pos + count * this.speed - n;
    for (let c = 0; c < channels.length; c++) this.prev[c] = channels[c][n - 1];
    this.outputFrames += count;
    return outs;
  }
}

// ---- ブラウザ側の処理（mediabunny） ----

const QUALITY_MAP: Record<QualityId, Quality> = {
  high: QUALITY_HIGH,
  medium: QUALITY_MEDIUM,
  low: QUALITY_LOW,
  veryLow: QUALITY_VERY_LOW,
};

export type SpeedErrorCode =
  'unsupported-input' | 'unsupported-output' | 'canceled' | 'failed';

export class SpeedChangeError extends Error {
  constructor(public code: SpeedErrorCode) {
    super(code);
  }
}

export interface SpeedChangeOptions {
  format: SpeedOutputFormat;
  quality: QualityId;
  speed: number;
  /** 0 は元のサイズのまま */
  maxHeight: number;
  removeAudio: boolean;
  sourceHeight: number;
  onProgress?: (ratio: number) => void;
}

export interface SpeedChangeHandle {
  promise: Promise<{ blob: Blob; mimeType: string }>;
  cancel: () => void;
}

function createOutputFormat(id: SpeedOutputFormat): OutputFormat {
  return id === 'webm' ? new WebMOutputFormat() : new Mp4OutputFormat();
}

/** 速度変更を開始する。進捗は options.onProgress（0〜1）で通知される */
export function changeVideoSpeed(
  file: File,
  options: SpeedChangeOptions,
): SpeedChangeHandle {
  let conversion: Conversion | null = null;
  let canceled = false;
  // キャンセル通知と execute() を競わせ、エンコーダが止まっても必ずUIへ戻れるようにする（media-converter と同じ回避策）
  let notifyCanceled: () => void = () => {};
  const canceledSignal = new Promise<never>((_, reject) => {
    notifyCanceled = () => reject(new SpeedChangeError('canceled'));
  });
  canceledSignal.catch(() => {});

  const run = async () => {
    const { speed } = options;
    const spec = FORMAT_SPECS[options.format];
    const input = new Input({
      source: new BlobSource(file),
      formats: ALL_FORMATS,
    });
    try {
      if (canceled) throw new SpeedChangeError('canceled');
      const quality = QUALITY_MAP[options.quality];
      const height = limitedHeight(options.sourceHeight, options.maxHeight);

      let videoCodec: VideoCodec | undefined;
      for (const c of spec.videoCodecs) {
        if (await canEncodeVideo(c, { quality })) {
          videoCodec = c;
          break;
        }
      }
      if (!videoCodec) throw new SpeedChangeError('unsupported-output');
      let audioCodec: AudioCodec | undefined;
      for (const c of spec.audioCodecs) {
        if (await canEncodeAudio(c, { quality })) {
          audioCodec = c;
          break;
        }
      }
      if (!audioCodec && !options.removeAudio) {
        throw new SpeedChangeError('unsupported-output');
      }

      if (canceled) throw new SpeedChangeError('canceled');
      const target = new BufferTarget();
      const output = new Output({
        format: createOutputFormat(options.format),
        target,
      });

      const retime = createVideoRetimer(speed);
      let resampler: AudioSpeedResampler | null = null;
      let audioStart = 0;

      conversion = await Conversion.init({
        input,
        output,
        showWarnings: false,
        video: {
          codec: videoCodec,
          quality,
          ...(height ? { height } : {}),
          process: (sample) => {
            const next = retime(sample.timestamp, sample.duration);
            if (!next) return null;
            sample.setTimestamp(next.timestamp);
            sample.setDuration(next.duration);
            return sample;
          },
        },
        audio: options.removeAudio
          ? { discard: true }
          : {
              codec: audioCodec,
              quality,
              process: (sample) => {
                const channels: Float32Array[] = [];
                for (let c = 0; c < sample.numberOfChannels; c++) {
                  const plane = new Float32Array(sample.numberOfFrames);
                  sample.copyTo(plane, {
                    planeIndex: c,
                    format: 'f32-planar',
                  });
                  channels.push(plane);
                }
                if (!resampler) {
                  resampler = new AudioSpeedResampler(
                    speed,
                    sample.numberOfChannels,
                  );
                  audioStart = sample.timestamp / speed;
                }
                const startFrame = resampler.outputFrames;
                const outs = resampler.process(channels);
                const frames = outs.length > 0 ? outs[0].length : 0;
                if (frames === 0) return null;
                const data = new Float32Array(frames * outs.length);
                outs.forEach((o, c) => data.set(o, c * frames));
                return new AudioSample({
                  data,
                  format: 'f32-planar',
                  numberOfChannels: outs.length,
                  sampleRate: sample.sampleRate,
                  timestamp: audioStart + startFrame / sample.sampleRate,
                });
              },
            },
      });

      if (canceled) {
        await conversion.cancel();
        throw new SpeedChangeError('canceled');
      }

      if (!conversion.isValid) {
        const reasons = conversion.discardedTracks.map((d) => d.reason);
        throw new SpeedChangeError(
          reasons.includes('undecodable_source_codec')
            ? 'unsupported-input'
            : 'failed',
        );
      }

      conversion.onProgress = (p) => options.onProgress?.(Math.min(1, p));
      const execution = conversion.execute();
      execution.catch(() => {});
      await Promise.race([execution, canceledSignal]);
      if (!target.buffer) throw new SpeedChangeError('failed');
      const mimeType = await output.getMimeType();
      return { blob: new Blob([target.buffer], { type: mimeType }), mimeType };
    } catch (e) {
      if (canceled) throw new SpeedChangeError('canceled');
      if (e instanceof SpeedChangeError) throw e;
      throw new SpeedChangeError('failed');
    } finally {
      input.dispose();
    }
  };

  return {
    promise: run(),
    cancel: () => {
      canceled = true;
      notifyCanceled();
      conversion?.cancel().catch(() => {});
    },
  };
}
