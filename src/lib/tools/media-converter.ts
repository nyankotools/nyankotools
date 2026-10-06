import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  Mp3OutputFormat,
  Mp4OutputFormat,
  OggOutputFormat,
  Output,
  QUALITY_HIGH,
  QUALITY_LOW,
  QUALITY_MEDIUM,
  QUALITY_VERY_LOW,
  WavOutputFormat,
  WebMOutputFormat,
  canEncodeAudio,
  canEncodeVideo,
  type AudioCodec,
  type OutputFormat,
  type Quality,
  type VideoCodec,
} from 'mediabunny';

export const MAX_FILE_SIZE = 1024 * 1024 * 1024;

export type OutputFormatId = 'mp4' | 'webm' | 'mp3' | 'm4a' | 'ogg' | 'wav';
export type QualityId = 'high' | 'medium' | 'low' | 'veryLow';

interface FormatSpec {
  id: OutputFormatId;
  extension: string;
  hasVideo: boolean;
  videoCodecs: VideoCodec[];
  audioCodecs: AudioCodec[];
}

export const FORMAT_SPECS: Record<OutputFormatId, FormatSpec> = {
  mp4: {
    id: 'mp4',
    extension: 'mp4',
    hasVideo: true,
    videoCodecs: ['avc', 'vp9', 'av1'],
    audioCodecs: ['aac', 'opus', 'mp3'],
  },
  webm: {
    id: 'webm',
    extension: 'webm',
    hasVideo: true,
    videoCodecs: ['vp9', 'vp8', 'av1'],
    audioCodecs: ['opus', 'vorbis'],
  },
  mp3: {
    id: 'mp3',
    extension: 'mp3',
    hasVideo: false,
    videoCodecs: [],
    audioCodecs: ['mp3'],
  },
  m4a: {
    id: 'm4a',
    extension: 'm4a',
    hasVideo: false,
    videoCodecs: [],
    audioCodecs: ['aac'],
  },
  ogg: {
    id: 'ogg',
    extension: 'ogg',
    hasVideo: false,
    videoCodecs: [],
    audioCodecs: ['opus', 'vorbis'],
  },
  wav: {
    id: 'wav',
    extension: 'wav',
    hasVideo: false,
    videoCodecs: [],
    audioCodecs: ['pcm-s16'],
  },
};

export const FORMAT_IDS = Object.keys(FORMAT_SPECS) as OutputFormatId[];

export const QUALITY_IDS: QualityId[] = ['high', 'medium', 'low', 'veryLow'];

/** 解像度の上限（高さ）の選択肢。0 は元のサイズのまま */
export const HEIGHT_OPTIONS = [0, 1080, 720, 480, 360] as const;

const QUALITY_MAP: Record<QualityId, Quality> = {
  high: QUALITY_HIGH,
  medium: QUALITY_MEDIUM,
  low: QUALITY_LOW,
  veryLow: QUALITY_VERY_LOW,
};

export function isQualityId(value: string): value is QualityId {
  return (QUALITY_IDS as string[]).includes(value);
}

export function isFormatId(value: string): value is OutputFormatId {
  return (FORMAT_IDS as string[]).includes(value);
}

const MEDIA_EXTENSIONS = [
  'mp4',
  'm4v',
  'mov',
  'webm',
  'mkv',
  'ogv',
  'ogg',
  'oga',
  'opus',
  'mp3',
  'm4a',
  'aac',
  'wav',
  'flac',
  'ts',
];

/** 動画/音声ファイルらしいかを MIME とファイル名の拡張子で判定する（最終的な可否は読み込み時に判定する） */
export function isAcceptedMediaFile(file: { name: string; type: string }) {
  if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
    return true;
  }
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return MEDIA_EXTENSIONS.includes(ext);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** 秒数を `m:ss` または `h:mm:ss`（小数1桁まで）で表示する */
export function formatDuration(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const tenths = Math.round(safe * 10);
  const total = Math.floor(tenths / 10);
  const frac = tenths % 10;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  const base =
    h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
  return frac > 0 ? `${base}.${frac}` : base;
}

/**
 * 「90」「1:30」「1:02:03.5」形式の時刻を秒に変換する。空文字は null、不正な形式は NaN。
 */
export function parseTimeInput(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  if (!/^\d+(?::\d{1,2}){0,2}(?:\.\d+)?$/.test(trimmed)) return NaN;
  const parts = trimmed.split(':').map(Number);
  if (parts.length > 1 && parts.slice(1).some((p) => p >= 60)) return NaN;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

export interface TrimRange {
  start: number;
  end: number;
}

export type TrimError = 'invalid' | 'outOfRange' | 'order';

export type TrimResult =
  { ok: true; range: TrimRange | null } | { ok: false; error: TrimError };

/**
 * 開始・終了の入力欄の値から、トリミング範囲を決める。
 * 両方空なら全体（range: null）。終了が空なら動画の最後まで。
 */
export function resolveTrim(
  startText: string,
  endText: string,
  duration: number,
): TrimResult {
  const start = parseTimeInput(startText);
  const end = parseTimeInput(endText);
  if (
    (start !== null && Number.isNaN(start)) ||
    (end !== null && Number.isNaN(end))
  ) {
    return { ok: false, error: 'invalid' };
  }
  if (start === null && end === null) return { ok: true, range: null };
  const s = start ?? 0;
  const e = end ?? duration;
  if (s >= duration || e > duration + 0.05) {
    return { ok: false, error: 'outOfRange' };
  }
  if (s >= e) return { ok: false, error: 'order' };
  if (s === 0 && e >= duration) return { ok: true, range: null };
  return { ok: true, range: { start: s, end: Math.min(e, duration) } };
}

/** 高さ上限を超える場合だけ縮小した出力の高さを返す（拡大はしない） */
export function limitedHeight(
  sourceHeight: number,
  maxHeight: number,
): number | undefined {
  if (maxHeight <= 0 || sourceHeight <= maxHeight) return undefined;
  return maxHeight;
}

export function buildOutputFileName(
  originalName: string,
  format: OutputFormatId,
  suffix = '',
): string {
  const dot = originalName.lastIndexOf('.');
  const base = (dot > 0 ? originalName.slice(0, dot) : originalName) || 'media';
  return `${base}${suffix}.${FORMAT_SPECS[format].extension}`;
}

function createOutputFormat(id: OutputFormatId): OutputFormat {
  switch (id) {
    case 'mp4':
    case 'm4a':
      return new Mp4OutputFormat();
    case 'webm':
      return new WebMOutputFormat();
    case 'mp3':
      return new Mp3OutputFormat();
    case 'ogg':
      return new OggOutputFormat();
    case 'wav':
      return new WavOutputFormat();
  }
}

let mp3EncoderReady: Promise<void> | null = null;

/** ブラウザ標準のMP3エンコーダが無い場合だけ、LAME（JS/wasm）を登録する */
async function ensureMp3Encoder() {
  mp3EncoderReady ??= (async () => {
    if (await canEncodeAudio('mp3')) return;
    const { registerMp3Encoder } = await import('@mediabunny/mp3-encoder');
    registerMp3Encoder();
  })();
  return mp3EncoderReady;
}

export interface MediaInfo {
  duration: number;
  hasVideo: boolean;
  hasAudio: boolean;
  width: number;
  height: number;
}

export async function readMediaInfo(file: File): Promise<MediaInfo> {
  const input = new Input({
    source: new BlobSource(file),
    formats: ALL_FORMATS,
  });
  try {
    const video = await input.getPrimaryVideoTrack();
    const audio = await input.getPrimaryAudioTrack();
    if (!video && !audio) throw new Error('no-tracks');
    const duration = await input.computeDuration();
    return {
      duration,
      hasVideo: video !== null,
      hasAudio: audio !== null,
      width: video?.displayWidth ?? 0,
      height: video?.displayHeight ?? 0,
    };
  } finally {
    input.dispose();
  }
}

export interface ConvertOptions {
  format: OutputFormatId;
  quality: QualityId;
  /** 0 は元のサイズのまま */
  maxHeight: number;
  removeAudio: boolean;
  trim: TrimRange | null;
  sourceHeight: number;
  onProgress?: (ratio: number) => void;
}

export type ConvertErrorCode =
  | 'unsupported-input'
  | 'unsupported-output'
  | 'no-audio'
  | 'canceled'
  | 'failed';

export class ConvertError extends Error {
  constructor(public code: ConvertErrorCode) {
    super(code);
  }
}

export interface ConvertHandle {
  promise: Promise<{ blob: Blob; mimeType: string }>;
  cancel: () => void;
}

/** 変換を開始する。進捗は options.onProgress（0〜1）で通知される */
export function convertMedia(
  file: File,
  options: ConvertOptions,
): ConvertHandle {
  let conversion: Conversion | null = null;
  let canceled = false;

  const run = async () => {
    const spec = FORMAT_SPECS[options.format];
    const input = new Input({
      source: new BlobSource(file),
      formats: ALL_FORMATS,
    });
    try {
      if (options.format === 'mp3') await ensureMp3Encoder();

      if (canceled) throw new ConvertError('canceled');
      const quality = QUALITY_MAP[options.quality];
      const height = spec.hasVideo
        ? limitedHeight(options.sourceHeight, options.maxHeight)
        : undefined;

      let videoCodec: VideoCodec | undefined;
      if (spec.hasVideo) {
        for (const c of spec.videoCodecs) {
          if (await canEncodeVideo(c, { quality })) {
            videoCodec = c;
            break;
          }
        }
        if (!videoCodec) throw new ConvertError('unsupported-output');
      }
      let audioCodec: AudioCodec | undefined;
      for (const c of spec.audioCodecs) {
        if (await canEncodeAudio(c, { quality })) {
          audioCodec = c;
          break;
        }
      }
      if (!audioCodec && !(spec.hasVideo && options.removeAudio)) {
        throw new ConvertError('unsupported-output');
      }

      if (canceled) throw new ConvertError('canceled');
      const target = new BufferTarget();
      const output = new Output({
        format: createOutputFormat(options.format),
        target,
      });

      conversion = await Conversion.init({
        input,
        output,
        showWarnings: false,
        trim: options.trim ?? undefined,
        video: spec.hasVideo
          ? {
              codec: videoCodec,
              quality,
              ...(height ? { height } : {}),
            }
          : { discard: true },
        audio:
          spec.hasVideo && options.removeAudio
            ? { discard: true }
            : { codec: audioCodec, quality },
      });

      if (canceled) {
        await conversion.cancel();

        throw new ConvertError('canceled');
      }

      if (!conversion.isValid) {
        const audioOnlyOutput = !spec.hasVideo;
        const reasons = conversion.discardedTracks.map((d) => d.reason);
        if (audioOnlyOutput && conversion.utilizedTracks.length === 0) {
          throw new ConvertError('no-audio');
        }
        throw new ConvertError(
          reasons.includes('undecodable_source_codec')
            ? 'unsupported-input'
            : 'failed',
        );
      }

      conversion.onProgress = (p) => options.onProgress?.(Math.min(1, p));
      await conversion.execute();
      if (!target.buffer) throw new ConvertError('failed');
      const mimeType =
        options.format === 'm4a' ? 'audio/mp4' : await output.getMimeType();
      return { blob: new Blob([target.buffer], { type: mimeType }), mimeType };
    } catch (e) {
      if (canceled) throw new ConvertError('canceled');
      if (e instanceof ConvertError) throw e;
      throw new ConvertError('failed');
    } finally {
      input.dispose();
    }
  };

  return {
    promise: run(),
    cancel: () => {
      canceled = true;
      void conversion?.cancel();
    },
  };
}
