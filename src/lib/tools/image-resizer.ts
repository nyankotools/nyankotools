export type OutputFormat = 'webp' | 'jpeg' | 'png';

export interface OutputFormatOption {
  value: OutputFormat;
  mimeType: string;
  extension: string;
  /** trueの場合、toBlobのquality引数が有効に働く形式（PNGは常に可逆のため無効） */
  supportsQuality: boolean;
}

export const OUTPUT_FORMAT_OPTIONS: OutputFormatOption[] = [
  {
    value: 'webp',
    mimeType: 'image/webp',
    extension: 'webp',
    supportsQuality: true,
  },
  {
    value: 'jpeg',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    supportsQuality: true,
  },
  {
    value: 'png',
    mimeType: 'image/png',
    extension: 'png',
    supportsQuality: false,
  },
];

export function getOutputFormatOption(
  format: OutputFormat,
): OutputFormatOption {
  const option = OUTPUT_FORMAT_OPTIONS.find((o) => o.value === format);
  if (!option) {
    throw new Error(`Unknown output format: ${String(format)}`);
  }
  return option;
}

/** <img>での読み込み・Canvasでの再エンコードが可能な、変換元として受け付ける画像形式 */
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

/** バイト数を人間が読みやすい単位（B/KB/MB/GB）の文字列に変換する */
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

/** 変換前後のバイト数から削減率（%）を計算する。増加した場合は負の値になる */
export function calculateReductionPercent(
  originalBytes: number,
  convertedBytes: number,
): number {
  if (originalBytes <= 0) return 0;
  return Math.round((1 - convertedBytes / originalBytes) * 100);
}

/** 元のファイル名の拡張子を、変換先フォーマットの拡張子に置き換える */
export function buildOutputFileName(
  originalName: string,
  format: OutputFormat,
): string {
  const option = getOutputFormatOption(format);
  const lastDot = originalName.lastIndexOf('.');
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${base}.${option.extension}`;
}

export interface Dimensions {
  width: number;
  height: number;
}

export const MIN_DIMENSION = 1;
export const MAX_DIMENSION = 10000;

/** リサイズ後の一辺として妥当な値（1〜10000の整数）かどうかを判定する */
export function isValidDimensionValue(value: number): boolean {
  return (
    Number.isInteger(value) && value >= MIN_DIMENSION && value <= MAX_DIMENSION
  );
}

/** 任意の数値を、リサイズ後の一辺として妥当な範囲（1〜10000の整数）にクランプする。数値でない場合はMIN_DIMENSIONを返す */
export function clampDimensionValue(value: number): number {
  if (!Number.isFinite(value)) return MIN_DIMENSION;
  return Math.min(Math.max(Math.round(value), MIN_DIMENSION), MAX_DIMENSION);
}

/** 指定した幅から、元の縦横比を保った高さを計算する */
export function computeHeightForWidth(
  original: Dimensions,
  width: number,
): number {
  if (original.width <= 0) return 0;
  return clampDimensionValue((width * original.height) / original.width);
}

/** 指定した高さから、元の縦横比を保った幅を計算する */
export function computeWidthForHeight(
  original: Dimensions,
  height: number,
): number {
  if (original.height <= 0) return 0;
  return clampDimensionValue((height * original.width) / original.height);
}

/** 元のサイズに対する拡大縮小率（%）から、変更後の幅・高さを計算する */
export function computeDimensionsForPercent(
  original: Dimensions,
  percent: number,
): Dimensions {
  const clampedPercent = Math.max(1, percent);
  return {
    width: clampDimensionValue((original.width * clampedPercent) / 100),
    height: clampDimensionValue((original.height * clampedPercent) / 100),
  };
}

export type ResizeMode = 'width' | 'height' | 'both' | 'percent';

export interface ResizeTarget {
  mode: ResizeMode;
  width?: number;
  height?: number;
  percent?: number;
}

/**
 * 元のサイズとリサイズ指定から、変更後の幅・高さを計算する。
 * - 'width'/'height': 指定した一辺から、縦横比を保ってもう一辺を算出する
 * - 'both': 幅・高さを両方とも指定値どおりに適用する（縦横比を無視）
 * - 'percent': 元のサイズに対する拡大縮小率を適用する
 */
export function computeTargetDimensions(
  original: Dimensions,
  target: ResizeTarget,
): Dimensions {
  switch (target.mode) {
    case 'width': {
      const width = clampDimensionValue(target.width ?? original.width);
      return { width, height: computeHeightForWidth(original, width) };
    }
    case 'height': {
      const height = clampDimensionValue(target.height ?? original.height);
      return { width: computeWidthForHeight(original, height), height };
    }
    case 'both':
      return {
        width: clampDimensionValue(target.width ?? original.width),
        height: clampDimensionValue(target.height ?? original.height),
      };
    case 'percent':
      return computeDimensionsForPercent(original, target.percent ?? 100);
  }
}
