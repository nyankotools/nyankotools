/** 手書き署名パッドの純粋ロジック（座標はCSSピクセル単位） */

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  width: number;
  color: string;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const MIN_PEN_WIDTH = 1;
export const MAX_PEN_WIDTH = 24;
export const DEFAULT_PEN_WIDTH = 3;
export const MAX_PADDING = 200;
export const DEFAULT_PADDING = 8;
export const SCALES = [1, 2, 3] as const;
export type Scale = (typeof SCALES)[number];
/** 出力画像の1辺の上限（px） */
export const MAX_OUTPUT_DIMENSION = 8192;
/** この距離（CSSピクセル）より近い点は間引く */
export const MIN_POINT_DISTANCE = 0.5;

export function clampNumber(
  value: number,
  min: number,
  max: number,
  fallback: number,
): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function clampPenWidth(value: number): number {
  return clampNumber(value, MIN_PEN_WIDTH, MAX_PEN_WIDTH, DEFAULT_PEN_WIDTH);
}

export function clampPadding(value: number): number {
  return Math.round(clampNumber(value, 0, MAX_PADDING, DEFAULT_PADDING));
}

export function parseScale(value: number): Scale {
  return (SCALES as readonly number[]).includes(value) ? (value as Scale) : 2;
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** 直前の点に近すぎなければ追加した新しい配列を返す */
export function appendPoint(points: Point[], next: Point): Point[] {
  const last = points[points.length - 1];
  if (last && Math.hypot(next.x - last.x, next.y - last.y) < MIN_POINT_DISTANCE)
    return points;
  return [...points, next];
}

/** 全ストロークを含む外接矩形（線の太さ分を含む）。点が無ければ null */
export function strokeBounds(strokes: Stroke[]): Bounds | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const s of strokes) {
    const r = s.width / 2;
    for (const p of s.points) {
      minX = Math.min(minX, p.x - r);
      minY = Math.min(minY, p.y - r);
      maxX = Math.max(maxX, p.x + r);
      maxY = Math.max(maxY, p.y + r);
    }
  }
  if (!Number.isFinite(minX)) return null;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export interface ExportLayout {
  /** 出力画像の幅・高さ（px） */
  width: number;
  height: number;
  /** 書き出し時の座標変換: (x - originX) * scale */
  originX: number;
  originY: number;
  scale: number;
}

export type ExportResult =
  | { ok: true; layout: ExportLayout }
  | { ok: false; reason: 'empty' | 'too-large' };

/**
 * 書き出しの寸法を決める。trim が true なら描画範囲に余白を足した大きさ、
 * false なら描画面全体の大きさにする。
 */
export function exportLayout(
  strokes: Stroke[],
  options: {
    trim: boolean;
    padding: number;
    scale: number;
    canvasWidth: number;
    canvasHeight: number;
  },
): ExportResult {
  const bounds = strokeBounds(strokes);
  if (!bounds) return { ok: false, reason: 'empty' };
  const scale = parseScale(options.scale);
  let originX = 0;
  let originY = 0;
  let w = options.canvasWidth;
  let h = options.canvasHeight;
  if (options.trim) {
    const pad = clampPadding(options.padding);
    originX = Math.floor(bounds.x) - pad;
    originY = Math.floor(bounds.y) - pad;
    w = Math.ceil(bounds.x + bounds.width) + pad - originX;
    h = Math.ceil(bounds.y + bounds.height) + pad - originY;
  }
  const width = Math.max(1, Math.round(w * scale));
  const height = Math.max(1, Math.round(h * scale));
  if (width > MAX_OUTPUT_DIMENSION || height > MAX_OUTPUT_DIMENSION)
    return { ok: false, reason: 'too-large' };
  return { ok: true, layout: { width, height, originX, originY, scale } };
}

export function signatureFileName(): string {
  return 'signature.png';
}

/** #rgb / #rrggbb を検証し、不正なら黒を返す */
export function normalizeColor(value: string): string {
  const v = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(v)) return v;
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(v);
  if (short)
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  return '#000000';
}
