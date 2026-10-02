export type HeicOutputFormat = 'jpeg' | 'png' | 'webp';

export interface HeicOutputOption {
  value: HeicOutputFormat;
  mimeType: string;
  extension: string;
  /** trueの場合、quality引数が有効に働く形式（PNGは可逆のため無効） */
  supportsQuality: boolean;
}

export const HEIC_OUTPUT_OPTIONS: HeicOutputOption[] = [
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
  {
    value: 'webp',
    mimeType: 'image/webp',
    extension: 'webp',
    supportsQuality: true,
  },
];

export function getHeicOutputOption(
  format: HeicOutputFormat,
): HeicOutputOption {
  const option = HEIC_OUTPUT_OPTIONS.find((o) => o.value === format);
  if (!option) {
    throw new Error(`Unknown output format: ${String(format)}`);
  }
  return option;
}

/** ISO BMFFの `ftyp` ボックスに現れる、HEIC/HEIFを示すブランド */
const HEIF_BRANDS = new Set([
  'heic',
  'heix',
  'heim',
  'heis',
  'hevc',
  'hevx',
  'hevm',
  'hevs',
  'mif1',
  'msf1',
]);

/** ファイル先頭のバイト列（先頭12バイト以上）が HEIC/HEIF の `ftyp` ボックスかを判定する */
export function hasHeifSignature(head: Uint8Array): boolean {
  if (head.length < 12) return false;
  const ascii = (from: number) =>
    String.fromCharCode(
      head[from],
      head[from + 1],
      head[from + 2],
      head[from + 3],
    );
  return ascii(4) === 'ftyp' && HEIF_BRANDS.has(ascii(8));
}

/** 元のファイル名の拡張子を、変換先フォーマットの拡張子に置き換える */
export function buildHeicOutputFileName(
  originalName: string,
  format: HeicOutputFormat,
): string {
  const option = getHeicOutputOption(format);
  const lastDot = originalName.lastIndexOf('.');
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${base}.${option.extension}`;
}
