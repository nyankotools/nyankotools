export interface Dimensions {
  width: number;
  height: number;
}

/** パレット抽出の集計対象とする画像の最大辺（px）。大きい画像はこのサイズまで縮小してから解析する */
export const MAX_SAMPLE_DIMENSION = 150;

/** 元画像のサイズから、パレット解析用に縮小描画するキャンバスのサイズを計算する（縦横比を維持） */
export function computeSampleDimensions(original: Dimensions): Dimensions {
  const largestSide = Math.max(original.width, original.height);
  if (largestSide <= MAX_SAMPLE_DIMENSION) {
    return { width: original.width, height: original.height };
  }
  const scale = MAX_SAMPLE_DIMENSION / largestSide;
  return {
    width: Math.max(1, Math.round(original.width * scale)),
    height: Math.max(1, Math.round(original.height * scale)),
  };
}

export const MIN_PALETTE_SIZE = 2;
export const MAX_PALETTE_SIZE = 12;
export const DEFAULT_PALETTE_SIZE = 6;

/** 抽出する色数として妥当な範囲（2〜12の整数）にクランプする */
export function clampPaletteSize(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_PALETTE_SIZE;
  return Math.min(
    Math.max(Math.round(value), MIN_PALETTE_SIZE),
    MAX_PALETTE_SIZE,
  );
}

/** アルファ値がこの値未満のピクセルは、ほぼ透明として集計対象から除外する */
export const ALPHA_THRESHOLD = 16;

/** RGB各チャンネルをこの幅で丸めてバケット化する（近い色をまとめて集計するため） */
const CHANNEL_BUCKET_STEP = 32;

export interface ColorBucket {
  r: number;
  g: number;
  b: number;
  count: number;
}

/**
 * RGBA画素データ（Canvasの`ImageData.data`のような、4バイト単位でr,g,b,aが並ぶ配列）を、
 * 近い色ごとにバケット分けして集計する。各バケットの色はそのバケットに属したピクセルの平均値。
 * 出現数（count）の多い順に並べて返す。
 */
export function aggregatePixelsIntoBuckets(
  rgba: ArrayLike<number>,
): ColorBucket[] {
  const buckets = new Map<
    number,
    { rSum: number; gSum: number; bSum: number; count: number }
  >();

  for (let i = 0; i + 3 < rgba.length; i += 4) {
    const a = rgba[i + 3];
    if (a < ALPHA_THRESHOLD) continue;
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    const key =
      Math.floor(r / CHANNEL_BUCKET_STEP) * 1024 +
      Math.floor(g / CHANNEL_BUCKET_STEP) * 32 +
      Math.floor(b / CHANNEL_BUCKET_STEP);
    const existing = buckets.get(key);
    if (existing) {
      existing.rSum += r;
      existing.gSum += g;
      existing.bSum += b;
      existing.count++;
    } else {
      buckets.set(key, { rSum: r, gSum: g, bSum: b, count: 1 });
    }
  }

  return Array.from(buckets.values())
    .map(({ rSum, gSum, bSum, count }) => ({
      r: Math.round(rSum / count),
      g: Math.round(gSum / count),
      b: Math.round(bSum / count),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function toHexChannel(value: number): string {
  return Math.min(255, Math.max(0, Math.round(value)))
    .toString(16)
    .padStart(2, '0');
}

/** RGB値（0〜255）を "#rrggbb" 形式のHEXコードに変換する */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;
}

export interface PaletteColor {
  hex: string;
  r: number;
  g: number;
  b: number;
  /** 画像内でこの色（バケット）が占める割合（%、小数点1桁） */
  percent: number;
}

/**
 * バケット集計結果（出現数の多い順）から、上位`paletteSize`件を占有率付きのパレットとして取り出す。
 * 集計対象ピクセルが1つも無かった場合（画像全体が透明など）は空配列を返す。
 */
export function buildPalette(
  buckets: ColorBucket[],
  paletteSize: number,
): PaletteColor[] {
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  if (total === 0) return [];
  const size = clampPaletteSize(paletteSize);
  return buckets.slice(0, size).map((bucket) => ({
    hex: rgbToHex(bucket.r, bucket.g, bucket.b),
    r: bucket.r,
    g: bucket.g,
    b: bucket.b,
    percent: Math.round((bucket.count / total) * 1000) / 10,
  }));
}

/** パレットのHEXコードを改行区切りのテキストにまとめる（まとめてコピー用） */
export function formatPaletteAsText(palette: PaletteColor[]): string {
  return palette.map((color) => color.hex).join('\n');
}

export const MAX_FILE_SIZE = 25 * 1024 * 1024;

/** <img>での読み込み・Canvasでの解析が可能な、入力として受け付ける画像形式 */
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
