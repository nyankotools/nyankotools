export interface Dimensions {
  width: number;
  height: number;
}

/** faviconとして書き出すPNGのサイズとファイル名 */
export interface FaviconSizeSpec {
  size: number;
  filename: string;
}

export const PNG_SIZES: FaviconSizeSpec[] = [
  { size: 16, filename: 'favicon-16x16.png' },
  { size: 32, filename: 'favicon-32x32.png' },
  { size: 48, filename: 'favicon-48x48.png' },
  { size: 180, filename: 'apple-touch-icon.png' },
  { size: 192, filename: 'android-chrome-192x192.png' },
  { size: 512, filename: 'android-chrome-512x512.png' },
];

/** favicon.icoに同梱するサイズ（Windows等の互換性を考慮し、代表的な3サイズをまとめて格納する） */
export const ICO_SIZES = [16, 32, 48];
export const ICO_FILENAME = 'favicon.ico';

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

export interface SquareCrop {
  sx: number;
  sy: number;
  size: number;
}

/** 元画像から中央基準で切り抜く正方形の範囲（元画像の座標系）を計算する */
export function computeSquareCrop(original: Dimensions): SquareCrop {
  const size = Math.min(original.width, original.height);
  return {
    sx: Math.floor((original.width - size) / 2),
    sy: Math.floor((original.height - size) / 2),
    size,
  };
}

/**
 * 正方形の切り抜き範囲を、指定した位置（元画像の座標系）を基準に、
 * 元画像からはみ出さない範囲にクランプして計算し直す。
 * サイズ（一辺の長さ）は変えず、位置（sx/sy）だけを移動させたい場合に使う。
 */
export function clampCropPosition(
  original: Dimensions,
  size: number,
  sx: number,
  sy: number,
): SquareCrop {
  const maxSx = Math.max(original.width - size, 0);
  const maxSy = Math.max(original.height - size, 0);
  return {
    sx: Math.min(Math.max(Math.round(sx), 0), maxSx),
    sy: Math.min(Math.max(Math.round(sy), 0), maxSy),
    size,
  };
}

/** 出力する中で最大のPNGサイズ（この値未満の正方形サイズの元画像は拡大されてぼやける可能性がある） */
export function getMaxOutputSize(): number {
  return Math.max(...PNG_SIZES.map((s) => s.size));
}

/** 元画像の正方形部分の一辺が、最大出力サイズに対して拡大が必要になるほど小さいかどうか */
export function isSourceTooSmall(original: Dimensions): boolean {
  return computeSquareCrop(original).size < getMaxOutputSize();
}

export interface IcoImageInput {
  size: number;
  /** PNG形式でエンコードされた画像データ */
  pngData: Uint8Array;
}

/**
 * 複数サイズのPNGデータから、Windows Vista以降が対応するPNG格納形式のICOファイルを組み立てる。
 * 構造は ICONDIR（6バイト） + ICONDIRENTRY（16バイト）×N + 各画像のPNGデータ、という並び。
 */
export function buildIcoFile(images: IcoImageInput[]): Uint8Array<ArrayBuffer> {
  if (images.length === 0) {
    throw new Error('images must not be empty');
  }

  const HEADER_SIZE = 6;
  const ENTRY_SIZE = 16;
  const dataStart = HEADER_SIZE + ENTRY_SIZE * images.length;
  const totalSize =
    dataStart + images.reduce((sum, img) => sum + img.pngData.length, 0);

  const buffer: Uint8Array<ArrayBuffer> = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: 1 = icon
  view.setUint16(4, images.length, true);

  let dataOffset = dataStart;
  images.forEach((img, i) => {
    const entryOffset = HEADER_SIZE + ENTRY_SIZE * i;
    const dim = img.size >= 256 ? 0 : img.size; // ICO仕様では0は256pxを表す
    buffer[entryOffset + 0] = dim; // width
    buffer[entryOffset + 1] = dim; // height
    buffer[entryOffset + 2] = 0; // color count（パレットなし）
    buffer[entryOffset + 3] = 0; // reserved
    view.setUint16(entryOffset + 4, 1, true); // color planes
    view.setUint16(entryOffset + 6, 32, true); // bits per pixel
    view.setUint32(entryOffset + 8, img.pngData.length, true); // bytes in resource
    view.setUint32(entryOffset + 12, dataOffset, true); // image data offset

    buffer.set(img.pngData, dataOffset);
    dataOffset += img.pngData.length;
  });

  return buffer;
}

/** faviconファイル一式を参照するための、head内に貼り付けるHTMLスニペットを組み立てる */
export function buildHtmlSnippet(): string {
  return [
    '<link rel="icon" href="/favicon.ico" sizes="any">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">',
    '<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">',
  ].join('\n');
}
