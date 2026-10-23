export type CompressFormat = 'jpeg' | 'webp';
export type SizeUnit = 'KB' | 'MB';

export interface CompressFormatOption {
  value: CompressFormat;
  mimeType: string;
  extension: string;
}

export const COMPRESS_FORMAT_OPTIONS: CompressFormatOption[] = [
  { value: 'jpeg', mimeType: 'image/jpeg', extension: 'jpg' },
  { value: 'webp', mimeType: 'image/webp', extension: 'webp' },
];

export function getCompressFormatOption(
  format: CompressFormat,
): CompressFormatOption {
  const option = COMPRESS_FORMAT_OPTIONS.find((o) => o.value === format);
  if (!option) {
    throw new Error(`Unknown format: ${String(format)}`);
  }
  return option;
}

const ACCEPTED_INPUT_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/bmp',
]);

export function isAcceptedImageFile(file: { type: string }): boolean {
  return ACCEPTED_INPUT_MIME_TYPES.has(file.type);
}

/** 目標容量（数値＋単位）をバイト数に変換する。1KB=1024B。無効な値はnull */
export function parseTargetBytes(value: number, unit: SizeUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  const bytes = Math.floor(value * (unit === 'MB' ? 1024 * 1024 : 1024));
  return bytes >= 1 ? bytes : null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ['KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = -1;
  do {
    value /= 1024;
    unitIndex++;
  } while (value >= 1024 && unitIndex < units.length - 1);
  return `${value.toFixed(value < 10 ? 2 : 1)} ${units[unitIndex]}`;
}

export function calculateReductionPercent(
  originalBytes: number,
  convertedBytes: number,
): number {
  if (originalBytes <= 0) return 0;
  return Math.round((1 - convertedBytes / originalBytes) * 100);
}

export function buildOutputFileName(
  originalName: string,
  format: CompressFormat,
): string {
  const option = getCompressFormatOption(format);
  const lastDot = originalName.lastIndexOf('.');
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${base}-compressed.${option.extension}`;
}

/** 縮小率に対応するピクセル寸法（最小1px） */
export function scaledDimensions(
  width: number,
  height: number,
  scale: number,
): { width: number; height: number } {
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export interface EncodeResult<T> {
  size: number;
  data: T;
}

/** 指定の縮小率・品質（1-100）でエンコードし、サイズとデータを返す。失敗時はnull */
export type Encoder<T> = (
  scale: number,
  quality: number,
) => Promise<EncodeResult<T> | null>;

export interface QualitySearchOptions {
  minQuality: number;
  maxQuality: number;
}

export interface QualitySearchHit<T> {
  quality: number;
  size: number;
  data: T;
  /** 探索中に行ったエンコード回数 */
  attempts: number;
}

/**
 * 目標バイト数以下に収まる最大の品質を二分探索で求める。
 * サイズは品質に対して単調増加（非減少）であると仮定する。
 * 最低品質でも収まらない場合は null。
 */
export async function searchQuality<T>(
  encode: (quality: number) => Promise<EncodeResult<T> | null>,
  targetBytes: number,
  options: QualitySearchOptions,
): Promise<{
  hit: QualitySearchHit<T> | null;
  smallest: EncodeResult<T> | null;
  attempts: number;
}> {
  let attempts = 0;
  const run = async (q: number) => {
    attempts++;
    return encode(q);
  };

  const high = await run(options.maxQuality);
  if (high && high.size <= targetBytes) {
    return {
      hit: { quality: options.maxQuality, ...high, attempts },
      smallest: high,
      attempts,
    };
  }

  const low = await run(options.minQuality);
  if (!low) return { hit: null, smallest: null, attempts };
  if (low.size > targetBytes) {
    return { hit: null, smallest: low, attempts };
  }

  let lo = options.minQuality;
  let hi = options.maxQuality;
  let best = { quality: lo, ...low };
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    const result = await run(mid);
    if (result && result.size <= targetBytes) {
      lo = mid;
      best = { quality: mid, ...result };
    } else {
      hi = mid;
    }
  }
  return { hit: { ...best, attempts }, smallest: low, attempts };
}

export interface CompressOptions {
  minQuality: number;
  maxQuality: number;
  /** trueなら品質を下げても届かない場合に縮小率を下げて再挑戦する */
  allowResize: boolean;
  /** 試す縮小率（降順、先頭は1） */
  scales: number[];
}

export const DEFAULT_SCALES = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];

export const DEFAULT_COMPRESS_OPTIONS: CompressOptions = {
  minQuality: 5,
  maxQuality: 100,
  allowResize: true,
  scales: DEFAULT_SCALES,
};

export type CompressOutcome<T> =
  | {
      status: 'ok';
      data: T;
      size: number;
      quality: number;
      scale: number;
    }
  | {
      status: 'unreachable';
      /** 試した中で最小だった結果（あれば） */
      best: (EncodeResult<T> & { quality: number; scale: number }) | null;
    };

/**
 * 目標容量以下になる品質（必要なら縮小率も）を自動で決める。
 * まず縮小率1で品質を探索し、届かなければ縮小率を下げて再探索する。
 */
export async function compressToTarget<T>(
  encode: Encoder<T>,
  targetBytes: number,
  options: CompressOptions = DEFAULT_COMPRESS_OPTIONS,
): Promise<CompressOutcome<T>> {
  const scales = options.allowResize
    ? options.scales
    : options.scales.slice(0, 1);
  let best: (EncodeResult<T> & { quality: number; scale: number }) | null =
    null;

  for (const scale of scales) {
    const { hit, smallest } = await searchQuality(
      (q) => encode(scale, q),
      targetBytes,
      options,
    );
    if (hit) {
      return {
        status: 'ok',
        data: hit.data,
        size: hit.size,
        quality: hit.quality,
        scale,
      };
    }
    if (smallest && (!best || smallest.size < best.size)) {
      best = { ...smallest, quality: options.minQuality, scale };
    }
  }
  return { status: 'unreachable', best };
}
