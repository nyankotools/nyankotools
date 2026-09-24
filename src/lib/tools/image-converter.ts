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
