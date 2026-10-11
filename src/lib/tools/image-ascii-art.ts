import {
  formatFileSize,
  isAcceptedImageFile,
  MAX_FILE_SIZE,
} from './image-pixelart-converter';

export { formatFileSize, isAcceptedImageFile, MAX_FILE_SIZE };

export interface Dimensions {
  width: number;
  height: number;
}

export const MIN_COLUMNS = 10;
export const MAX_COLUMNS = 300;
export const DEFAULT_COLUMNS = 80;
/** 極端に縦長の画像でキャンバスや出力が巨大にならないよう、行数に設ける上限 */
export const MAX_ROWS = 1000;

/** 等幅フォントの文字は縦長（幅:高さ≒1:2）なので、行数はこの比率で縮めて縦横比を保つ */
export const CHAR_ASPECT = 0.5;

/** 横の文字数として妥当な範囲（10〜300の整数）にクランプする */
export function clampColumns(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_COLUMNS;
  return Math.min(Math.max(Math.round(value), MIN_COLUMNS), MAX_COLUMNS);
}

/** 元画像のサイズと横の文字数から、ASCIIアートの文字数（横×縦）を計算する */
export function computeAsciiGrid(
  original: Dimensions,
  columns: number,
  charAspect: number = CHAR_ASPECT,
): Dimensions {
  const cols = clampColumns(columns);
  if (original.width <= 0 || original.height <= 0) {
    return { width: cols, height: 1 };
  }
  const rows = Math.round(
    (original.height / original.width) * cols * charAspect,
  );
  return { width: cols, height: Math.min(Math.max(1, rows), MAX_ROWS) };
}

export type CharsetId = 'standard' | 'detailed' | 'blocks' | 'mono';

export const CHARSET_IDS: CharsetId[] = [
  'standard',
  'detailed',
  'blocks',
  'mono',
];

/** 各文字セット。先頭ほど濃く（暗い画素に）、末尾ほど薄く（明るい画素に）割り当てる */
export const CHARSETS: Record<CharsetId, string> = {
  standard: '@%#*+=-:. ',
  detailed:
    '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  blocks: '█▓▒░ ',
  mono: '# ',
};

export function isCharsetId(value: string): value is CharsetId {
  return (CHARSET_IDS as string[]).includes(value);
}

/**
 * RGBAから明るさ（0=黒〜1=白）を求める。
 * 透過部分は白い紙の上に重ねたものとして扱い、輝度はRec.709の係数で計算する。
 */
export function pixelBrightness(
  r: number,
  g: number,
  b: number,
  a: number = 255,
): number {
  const alpha = Math.min(Math.max(a, 0), 255) / 255;
  const blend = (c: number) => c * alpha + 255 * (1 - alpha);
  const luminance = 0.2126 * blend(r) + 0.7152 * blend(g) + 0.0722 * blend(b);
  return Math.min(Math.max(luminance / 255, 0), 1);
}

/**
 * 明るさ（0〜1）を文字セットの1文字に対応づける。
 * 通常は暗い画素ほど濃い文字（白背景に黒文字で見る想定）。invert=trueで明暗を反転する（黒背景に白文字向け）。
 */
export function brightnessToChar(
  brightness: number,
  charset: string,
  invert: boolean = false,
): string {
  const chars = Array.from(charset);
  if (chars.length === 0) return '';
  const b = Math.min(Math.max(brightness, 0), 1);
  const value = invert ? 1 - b : b;
  return chars[Math.round(value * (chars.length - 1))];
}

export interface AsciiOptions {
  charset: CharsetId;
  invert: boolean;
}

/**
 * RGBA画素データ（ImageData.data形式）をASCIIアートの文字列に変換する。行は改行（\n）で区切る。
 */
export function pixelsToAscii(
  data: ArrayLike<number>,
  width: number,
  height: number,
  options: AsciiOptions,
): string {
  const charset = CHARSETS[options.charset];
  const lines: string[] = [];
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      line += brightnessToChar(
        pixelBrightness(data[i], data[i + 1], data[i + 2], data[i + 3]),
        charset,
        options.invert,
      );
    }
    lines.push(line);
  }
  return lines.join('\n');
}

/** 元のファイル名の拡張子を .txt に置き換える（拡張子がなければ付け足す） */
export function buildTextFileName(originalName: string): string {
  const lastDot = originalName.lastIndexOf('.');
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${base || 'ascii-art'}.txt`;
}
