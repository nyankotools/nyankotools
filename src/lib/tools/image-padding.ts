export interface Size {
  width: number;
  height: number;
}

export type OutputFormat = 'png' | 'jpeg' | 'webp';

/** 読み込める画像・出力する画像の1辺の上限（px）。canvasの上限を超えて空画像になるのを防ぐ */
export const MAX_DIMENSION = 16384;
/** 読み込める画像・出力する画像の総画素数の上限 */
export const MAX_PIXELS = 50_000_000;
/** 余白（px）の上限 */
export const MAX_MARGIN = 8192;

const FORMATS: Record<OutputFormat, { mime: string; ext: string }> = {
  png: { mime: 'image/png', ext: 'png' },
  jpeg: { mime: 'image/jpeg', ext: 'jpg' },
  webp: { mime: 'image/webp', ext: 'webp' },
};

export function outputFormat(format: OutputFormat) {
  return FORMATS[format];
}

export function isWithinLimit(size: Size): boolean {
  return (
    size.width >= 1 &&
    size.height >= 1 &&
    size.width <= MAX_DIMENSION &&
    size.height <= MAX_DIMENSION &&
    size.width * size.height <= MAX_PIXELS
  );
}

/** 'none' や空文字は null（比率を使わない）、'16:9' は 16/9、数値の文字列もそのまま比率として扱う */
export function parseAspect(value: string): number | null {
  const m = /^\s*(\d*\.?\d+)\s*(?::|\/)\s*(\d*\.?\d+)\s*$/.exec(value);
  if (m) {
    const w = parseFloat(m[1]);
    const h = parseFloat(m[2]);
    return w > 0 && h > 0 ? w / h : null;
  }
  const n = Number(value);
  return value.trim() !== '' && Number.isFinite(n) && n > 0 ? n : null;
}

/** 余白の入力値を 0〜MAX_MARGIN の整数にそろえる。数でなければ 0 */
export function clampMargin(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), MAX_MARGIN);
}

export interface PaddingLayout {
  /** 出力キャンバスの大きさ */
  canvas: Size;
  /** 元画像を置く左上の位置 */
  x: number;
  y: number;
  /** 上下左右に増えた余白（左・上は x・y と同じ。右・下は端数で1px多くなることがある） */
  right: number;
  bottom: number;
}

/**
 * 元画像の周囲に margin px の余白を付けたうえで、ratio（幅/高さ）があれば
 * その比率になるよう短い辺側へ余白を足す。画像は縮小せず、常に中央に置く。
 */
export function computeLayout(
  source: Size,
  ratio: number | null,
  margin: number,
): PaddingLayout {
  const m = clampMargin(margin);
  let width = source.width + m * 2;
  let height = source.height + m * 2;
  if (ratio !== null && ratio > 0 && Number.isFinite(ratio)) {
    if (width / height < ratio) {
      width = Math.max(Math.round(height * ratio), width);
    } else {
      height = Math.max(Math.round(width / ratio), height);
    }
  }
  const x = Math.floor((width - source.width) / 2);
  const y = Math.floor((height - source.height) / 2);
  return {
    canvas: { width, height },
    x,
    y,
    right: width - source.width - x,
    bottom: height - source.height - y,
  };
}

/** ダウンロード用のファイル名。元のファイル名の拡張子を出力形式に置き換え、末尾に -padded を付ける */
export function paddedFileName(
  sourceName: string | null,
  format: OutputFormat,
): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}-padded.${FORMATS[format].ext}`;
}
