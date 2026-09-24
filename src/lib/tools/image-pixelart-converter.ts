export interface Dimensions {
  width: number;
  height: number;
}

export const MIN_BLOCK_SIZE = 1;
export const MAX_BLOCK_SIZE = 100;

/** モザイク・ドット絵化のブロックサイズ（1辺のpx数）として妥当な範囲（1〜100の整数）にクランプする */
export function clampBlockSize(value: number): number {
  if (!Number.isFinite(value)) return MIN_BLOCK_SIZE;
  return Math.min(Math.max(Math.round(value), MIN_BLOCK_SIZE), MAX_BLOCK_SIZE);
}

/**
 * 元画像のサイズとブロックサイズから、モザイク処理の下準備として縮小描画するキャンバスのサイズを計算する。
 * ここへ縮小してから元のサイズへ最近傍補間で拡大し直すことで、ブロック状の見た目を作る。
 */
export function computeMosaicDimensions(
  original: Dimensions,
  blockSize: number,
): Dimensions {
  const clamped = clampBlockSize(blockSize);
  return {
    width: Math.max(1, Math.round(original.width / clamped)),
    height: Math.max(1, Math.round(original.height / clamped)),
  };
}

export const MIN_COLOR_LEVELS = 2;
export const MAX_COLOR_LEVELS = 256;

/** 減色（ポスタリゼーション）の階調数として妥当な範囲（2〜256の整数）にクランプする */
export function clampColorLevels(value: number): number {
  if (!Number.isFinite(value)) return MAX_COLOR_LEVELS;
  return Math.min(
    Math.max(Math.round(value), MIN_COLOR_LEVELS),
    MAX_COLOR_LEVELS,
  );
}

/** 階調数が最大（256＝元の色をそのまま使う状態）かどうか。減色処理を実行するかどうかの判定に使う */
export function isColorReductionEnabled(levels: number): boolean {
  return clampColorLevels(levels) < MAX_COLOR_LEVELS;
}

/**
 * 0〜255の色チャンネル値を、指定した階調数（levels）で均等割りしたレベルへスナップする（ポスタリゼーション）。
 * 例: levels=2なら0か255の2値、levels=256なら元の値のまま変化しない。
 */
export function quantizeChannelValue(value: number, levels: number): number {
  const clampedLevels = clampColorLevels(levels);
  if (clampedLevels >= MAX_COLOR_LEVELS) return value;
  const step = 255 / (clampedLevels - 1);
  return Math.round(Math.round(value / step) * step);
}

/** 現在の階調数設定のもとで、RGB各チャンネルの組み合わせ上あり得る色数の理論上の上限（levels^3） */
export function estimateMaxColorCount(levels: number): number {
  return clampColorLevels(levels) ** 3;
}

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

export const MAX_FILE_SIZE = 25 * 1024 * 1024;

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
