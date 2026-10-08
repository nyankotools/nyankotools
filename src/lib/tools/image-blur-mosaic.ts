export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type EffectMode = 'mosaic' | 'blur' | 'fill';

export interface Region {
  rect: Rect;
  mode: EffectMode;
  /** モザイクのブロックサイズ(px) またはぼかし半径(px) */
  strength: number;
  /** 塗りつぶし色 (#rrggbb) */
  color: string;
}

export const MIN_STRENGTH = 2;
export const MAX_STRENGTH = 80;
export const DEFAULT_MOSAIC_BLOCK = 16;
export const DEFAULT_BLUR_RADIUS = 12;
export const MAX_FILE_SIZE = 25 * 1024 * 1024;
/** これより小さい選択範囲は誤タップとみなして無視する(px) */
export const MIN_REGION_SIZE = 3;

export function clampStrength(value: number): number {
  if (!Number.isFinite(value)) return MIN_STRENGTH;
  return Math.min(MAX_STRENGTH, Math.max(MIN_STRENGTH, Math.round(value)));
}

const ACCEPTED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/bmp',
]);

export function isAcceptedImageFile(file: { type: string }): boolean {
  return ACCEPTED_MIME.has(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes;
  let i = -1;
  do {
    value /= 1024;
    i++;
  } while (value >= 1024 && i < units.length - 1);
  return `${value.toFixed(value < 10 ? 2 : 1)} ${units[i]}`;
}

export type OutputFormat = 'png' | 'jpeg' | 'webp';

export const OUTPUT_FORMATS: Record<
  OutputFormat,
  { mimeType: string; extension: string }
> = {
  png: { mimeType: 'image/png', extension: 'png' },
  jpeg: { mimeType: 'image/jpeg', extension: 'jpg' },
  webp: { mimeType: 'image/webp', extension: 'webp' },
};

/** 元ファイル名から "<名前>-masked.<拡張子>" を作る */
export function buildOutputFileName(
  originalName: string,
  format: OutputFormat,
): string {
  const dot = originalName.lastIndexOf('.');
  const base = dot > 0 ? originalName.slice(0, dot) : originalName;
  return `${base || 'image'}-masked.${OUTPUT_FORMATS[format].extension}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * 表示上の座標(clientX/Y)を画像のピクセル座標に変換する。
 * 画像の範囲外は端に丸める。
 */
export function clientToImagePoint(
  clientX: number,
  clientY: number,
  box: { left: number; top: number; width: number; height: number },
  image: Dimensions,
): Point {
  if (box.width <= 0 || box.height <= 0) return { x: 0, y: 0 };
  const x = ((clientX - box.left) / box.width) * image.width;
  const y = ((clientY - box.top) / box.height) * image.height;
  return {
    x: clamp(x, 0, image.width),
    y: clamp(y, 0, image.height),
  };
}

/**
 * ドラッグの始点・終点から、画像内に収まる整数の矩形を作る。
 * 始点と終点の大小は問わない。小さすぎる場合は null。
 */
export function normalizeRect(
  start: Point,
  end: Point,
  image: Dimensions,
): Rect | null {
  const x1 = clamp(Math.round(Math.min(start.x, end.x)), 0, image.width);
  const y1 = clamp(Math.round(Math.min(start.y, end.y)), 0, image.height);
  const x2 = clamp(Math.round(Math.max(start.x, end.x)), 0, image.width);
  const y2 = clamp(Math.round(Math.max(start.y, end.y)), 0, image.height);
  const width = x2 - x1;
  const height = y2 - y1;
  if (width < MIN_REGION_SIZE || height < MIN_REGION_SIZE) return null;
  return { x: x1, y: y1, width, height };
}

/** 矩形を画像内に収める。範囲が空になる場合は null */
export function clipRect(rect: Rect, image: Dimensions): Rect | null {
  const x1 = clamp(Math.floor(rect.x), 0, image.width);
  const y1 = clamp(Math.floor(rect.y), 0, image.height);
  const x2 = clamp(Math.ceil(rect.x + rect.width), 0, image.width);
  const y2 = clamp(Math.ceil(rect.y + rect.height), 0, image.height);
  if (x2 <= x1 || y2 <= y1) return null;
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

/** "#rgb" / "#rrggbb" を [r,g,b] に変換する。不正なら黒 */
export function parseHexColor(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [0, 0, 0];
  let h = m[1];
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** 矩形内をブロックごとの平均色で塗りつぶす(ブロックは矩形の左上基準) */
export function applyMosaic(
  data: Uint8ClampedArray,
  imageWidth: number,
  rect: Rect,
  blockSize: number,
): void {
  const size = Math.max(1, Math.round(blockSize));
  const x0 = rect.x;
  const y0 = rect.y;
  const x1 = rect.x + rect.width;
  const y1 = rect.y + rect.height;
  for (let by = y0; by < y1; by += size) {
    const bh = Math.min(size, y1 - by);
    for (let bx = x0; bx < x1; bx += size) {
      const bw = Math.min(size, x1 - bx);
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let y = by; y < by + bh; y++) {
        for (let x = bx; x < bx + bw; x++) {
          const i = (y * imageWidth + x) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
        }
      }
      const n = bw * bh;
      const ar = Math.round(r / n);
      const ag = Math.round(g / n);
      const ab = Math.round(b / n);
      const aa = Math.round(a / n);
      for (let y = by; y < by + bh; y++) {
        for (let x = bx; x < bx + bw; x++) {
          const i = (y * imageWidth + x) * 4;
          data[i] = ar;
          data[i + 1] = ag;
          data[i + 2] = ab;
          data[i + 3] = aa;
        }
      }
    }
  }
}

/** 矩形内を単色で塗りつぶす(不透明) */
export function applyFill(
  data: Uint8ClampedArray,
  imageWidth: number,
  rect: Rect,
  color: [number, number, number],
): void {
  for (let y = rect.y; y < rect.y + rect.height; y++) {
    for (let x = rect.x; x < rect.x + rect.width; x++) {
      const i = (y * imageWidth + x) * 4;
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
      data[i + 3] = 255;
    }
  }
}

/** 1ライン分のボックスブラー(端は最も近い画素で延長) */
function boxBlurLine(
  src: Float32Array,
  dst: Float32Array,
  length: number,
  radius: number,
): void {
  const window = radius * 2 + 1;
  let sum = 0;
  for (let k = -radius; k <= radius; k++) {
    sum += src[clamp(k, 0, length - 1)];
  }
  for (let i = 0; i < length; i++) {
    dst[i] = sum / window;
    sum +=
      src[clamp(i + radius + 1, 0, length - 1)] -
      src[clamp(i - radius, 0, length - 1)];
  }
}

/** ボックスブラーを3回かけ(ガウスぼかし相当)、結果が入った配列を返す */
function blur3(
  a: Float32Array,
  b: Float32Array,
  length: number,
  radius: number,
): Float32Array {
  let from = a;
  let to = b;
  for (let pass = 0; pass < 3; pass++) {
    boxBlurLine(from, to, length, radius);
    const t = from;
    from = to;
    to = t;
  }
  return from;
}

/**
 * 矩形内をぼかす。矩形の外側の画素は参照しない。
 */
export function applyBlur(
  data: Uint8ClampedArray,
  imageWidth: number,
  rect: Rect,
  radius: number,
): void {
  const r = Math.max(1, Math.round(radius));
  const { width, height } = rect;
  const maxLen = Math.max(width, height);
  const bufA = new Float32Array(maxLen);
  const bufB = new Float32Array(maxLen);

  for (let ch = 0; ch < 4; ch++) {
    for (let y = 0; y < height; y++) {
      const row = (rect.y + y) * imageWidth + rect.x;
      for (let x = 0; x < width; x++) bufA[x] = data[(row + x) * 4 + ch];
      const out = blur3(bufA, bufB, width, r);
      for (let x = 0; x < width; x++)
        data[(row + x) * 4 + ch] = Math.round(out[x]);
    }
    for (let x = 0; x < width; x++) {
      const col = rect.y * imageWidth + rect.x + x;
      for (let y = 0; y < height; y++)
        bufA[y] = data[(col + y * imageWidth) * 4 + ch];
      const out = blur3(bufA, bufB, height, r);
      for (let y = 0; y < height; y++)
        data[(col + y * imageWidth) * 4 + ch] = Math.round(out[y]);
    }
  }
}

/** 1つの領域に効果を適用する(画像外にはみ出す分は切り詰める) */
export function applyRegion(
  data: Uint8ClampedArray,
  image: Dimensions,
  region: Region,
): void {
  const rect = clipRect(region.rect, image);
  if (!rect) return;
  switch (region.mode) {
    case 'mosaic':
      applyMosaic(data, image.width, rect, region.strength);
      break;
    case 'blur':
      applyBlur(data, image.width, rect, region.strength);
      break;
    case 'fill':
      applyFill(data, image.width, rect, parseHexColor(region.color));
      break;
  }
}

/** 複数領域を順に適用する */
export function applyRegions(
  data: Uint8ClampedArray,
  image: Dimensions,
  regions: Region[],
): void {
  for (const region of regions) applyRegion(data, image, region);
}
