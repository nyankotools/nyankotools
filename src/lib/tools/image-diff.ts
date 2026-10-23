/** 画像差分比較（ピクセルdiff）の純ロジック。DOM・コピーは持たない。 */

export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const MAX_PIXELS = 40_000_000;
/** 比較キャンバスの長辺の上限（メモリ・処理時間対策）。超える場合は縮小して比較する */
export const COMPARE_MAX_EDGE = 4096;
export const COMPARE_MAX_PIXELS = 16_000_000;

export interface RgbaImage {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/**
 * サイズが異なる場合の扱い。
 * - pad: 大きい方の幅・高さを取り、画像は拡縮せず左上に置く。はみ出さない余白部分は「透明」扱いで差異になる
 * - resize: 面積の大きい方のサイズに、もう一方を引き伸ばして合わせる
 */
export type SizeMode = 'pad' | 'resize';
export type HeatmapStyle = 'heatmap' | 'highlight';

export function isAcceptedImageFile(file: { type: string }): boolean {
  return /^image\/(png|jpeg|webp|gif|bmp)$/.test(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function clampThreshold(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/** しきい値(0〜100%)を 0〜255 の差分値に変換する */
export function thresholdToDelta(percent: number): number {
  return (clampThreshold(percent) / 100) * 255;
}

export interface TargetSize {
  width: number;
  height: number;
  /** 比較用に縮小した場合の倍率（1以下） */
  scale: number;
}

/** 比較に使うキャンバスサイズを決める。長辺・面積の上限を超えるときは縮小する。 */
export function resolveTargetSize(
  a: { width: number; height: number },
  b: { width: number; height: number },
  mode: SizeMode,
): TargetSize {
  let width: number;
  let height: number;
  if (mode === 'pad') {
    width = Math.max(a.width, b.width);
    height = Math.max(a.height, b.height);
  } else {
    const larger = a.width * a.height >= b.width * b.height ? a : b;
    width = larger.width;
    height = larger.height;
  }
  width = Math.max(1, Math.floor(width));
  height = Math.max(1, Math.floor(height));
  let scale = 1;
  const edge = Math.max(width, height);
  if (edge > COMPARE_MAX_EDGE) scale = COMPARE_MAX_EDGE / edge;
  const area = width * height * scale * scale;
  if (area > COMPARE_MAX_PIXELS) scale *= Math.sqrt(COMPARE_MAX_PIXELS / area);
  if (scale < 1) {
    return {
      width: Math.max(1, Math.floor(width * scale)),
      height: Math.max(1, Math.floor(height * scale)),
      scale,
    };
  }
  return { width, height, scale: 1 };
}

/** 1画素の差分値 (0〜255)。R/G/B/A のうち最大の絶対差。両方とも完全透明なら 0。 */
export function pixelDelta(
  a: Uint8ClampedArray,
  b: Uint8ClampedArray,
  index: number,
): number {
  const aa = a[index + 3];
  const ba = b[index + 3];
  if (aa === 0 && ba === 0) return 0;
  return Math.max(
    Math.abs(a[index] - b[index]),
    Math.abs(a[index + 1] - b[index + 1]),
    Math.abs(a[index + 2] - b[index + 2]),
    Math.abs(aa - ba),
  );
}

export interface DiffBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DiffResult {
  width: number;
  height: number;
  totalPixels: number;
  diffPixels: number;
  /** 差異のある画素の割合（0〜100%） */
  diffPercent: number;
  /** 画素ごとの最大差分値の平均（0〜255）。全画素が対象 */
  meanDelta: number;
  /** 最大差分値（0〜255） */
  maxDelta: number;
  /** 差異のある画素を囲む最小矩形。差異なしは null */
  bounds: DiffBounds | null;
  /** 差分マップ（RGBA, width×height） */
  map: Uint8ClampedArray<ArrayBuffer>;
}

function heatColor(t: number): [number, number, number] {
  // t: 0〜1。黒→赤→黄→白に近い黄
  const v = Math.min(1, Math.max(0, t));
  if (v < 0.5) return [Math.round(v * 2 * 255), 0, 0];
  return [255, Math.round((v - 0.5) * 2 * 255), 0];
}

/**
 * 同じサイズの2画像を比較する。しきい値(%)を超えた画素を「差異あり」と数える。
 * しきい値 0 なら 1 でも違えば差異。
 */
export function diffImages(
  a: RgbaImage,
  b: RgbaImage,
  thresholdPercent: number,
  style: HeatmapStyle = 'heatmap',
): DiffResult {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error('Image sizes must match');
  }
  const { width, height } = a;
  const total = width * height;
  if (a.data.length < total * 4 || b.data.length < total * 4) {
    throw new Error('Pixel data is shorter than width x height');
  }
  const limit = thresholdToDelta(thresholdPercent);
  const map = new Uint8ClampedArray(total * 4);
  let diffPixels = 0;
  let sum = 0;
  let maxDelta = 0;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let i = 0; i < total; i++) {
    const o = i * 4;
    const d = pixelDelta(a.data, b.data, o);
    sum += d;
    if (d > maxDelta) maxDelta = d;
    const differs = d > limit;
    if (differs) {
      diffPixels++;
      const x = i % width;
      const y = (i - x) / width;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    if (style === 'heatmap') {
      if (differs) {
        const [r, g, bl] = heatColor(0.35 + (d / 255) * 0.65);
        map[o] = r;
        map[o + 1] = g;
        map[o + 2] = bl;
      }
      // 差異なしは黒
      map[o + 3] = 255;
    } else {
      if (differs) {
        map[o] = 255;
        map[o + 1] = 0;
        map[o + 2] = 64;
        map[o + 3] = 255;
      } else {
        // 元画像Aをグレースケールで薄く表示
        const alpha = a.data[o + 3] / 255;
        const gray =
          0.299 * a.data[o] + 0.587 * a.data[o + 1] + 0.114 * a.data[o + 2];
        const v = Math.round((gray * alpha + 255 * (1 - alpha)) * 0.4 + 153);
        map[o] = v;
        map[o + 1] = v;
        map[o + 2] = v;
        map[o + 3] = 255;
      }
    }
  }

  return {
    width,
    height,
    totalPixels: total,
    diffPixels,
    diffPercent: total === 0 ? 0 : (diffPixels / total) * 100,
    meanDelta: total === 0 ? 0 : sum / total,
    maxDelta,
    bounds:
      diffPixels === 0
        ? null
        : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 },
    map,
  };
}

/** 差異率の表示用整形（小数点以下の桁数は大きさに応じて調整） */
export function formatPercent(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0';
  if (value >= 10) return value.toFixed(1);
  if (value >= 0.01) return value.toFixed(2);
  return value.toFixed(4);
}

export function buildOutputFileName(baseName: string): string {
  const stem = baseName.replace(/\.[^./\\]+$/, '').trim();
  return `${stem || 'image'}-diff.png`;
}
