import { OUTPUT_FORMATS } from './image-blur-mosaic';
import type { Dimensions, OutputFormat, Point } from './image-blur-mosaic';

export {
  clientToImagePoint,
  formatFileSize,
  isAcceptedImageFile,
  MAX_FILE_SIZE,
  OUTPUT_FORMATS,
} from './image-blur-mosaic';
export type { Dimensions, OutputFormat, Point } from './image-blur-mosaic';

/** 元ファイル名から "<名前>-reveal.<拡張子>" を作る */
export function buildOutputFileName(
  originalName: string,
  format: OutputFormat,
): string {
  const dot = originalName.lastIndexOf('.');
  const base = dot > 0 ? originalName.slice(0, dot) : originalName;
  return `${base || 'image'}-reveal.${OUTPUT_FORMATS[format].extension}`;
}

export type ShapeKind =
  | 'rect'
  | 'rounded'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'diamond'
  | 'star'
  | 'heart';

export const SHAPE_KINDS: ShapeKind[] = [
  'rect',
  'rounded',
  'circle',
  'ellipse',
  'triangle',
  'diamond',
  'star',
  'heart',
];

export interface Shape {
  id: number;
  kind: ShapeKind;
  /** 中心(画像ピクセル座標) */
  cx: number;
  cy: number;
  width: number;
  height: number;
  /** 回転角(度、時計回り) */
  rotation: number;
}

export type HandleKind = 'nw' | 'ne' | 'se' | 'sw' | 'rotate';

export const MIN_SHAPE_SIZE = 16;
/** 作業用キャンバスの長辺の上限(px)。これを超える画像は縮小する */
export const MAX_SIDE = 4096;
export const DEFAULT_OPACITY = 100;
export const MIN_OPACITY = 0;
export const MAX_OPACITY = 100;
export const DEFAULT_COLOR = '#000000';
/** 追加直後の図形の大きさ(画像の短辺に対する割合) */
const INITIAL_SIZE_RATIO = 0.35;
const CURVE_SEGMENTS = 48;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampOpacity(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_OPACITY;
  return clamp(Math.round(value), MIN_OPACITY, MAX_OPACITY);
}

/** 正方形を保つ図形かどうか(円) */
export function isSquareKind(kind: ShapeKind): boolean {
  return kind === 'circle';
}

/** 長辺が MAX_SIDE を超える画像の縮小後サイズ(超えなければそのまま) */
export function fitWithin(
  width: number,
  height: number,
  maxSide: number = MAX_SIDE,
): Dimensions {
  const longest = Math.max(width, height);
  if (longest <= maxSide) return { width, height };
  const scale = maxSide / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function ellipsePoints(w: number, h: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < CURVE_SEGMENTS; i++) {
    const a = (i / CURVE_SEGMENTS) * Math.PI * 2;
    points.push({ x: (Math.cos(a) * w) / 2, y: (Math.sin(a) * h) / 2 });
  }
  return points;
}

function roundedRectPoints(w: number, h: number): Point[] {
  const r = Math.min(w, h) * 0.22;
  const hw = w / 2;
  const hh = h / 2;
  const centers: Point[] = [
    { x: hw - r, y: -hh + r },
    { x: hw - r, y: hh - r },
    { x: -hw + r, y: hh - r },
    { x: -hw + r, y: -hh + r },
  ];
  const points: Point[] = [];
  const steps = 10;
  centers.forEach((c, corner) => {
    const start = -Math.PI / 2 + (corner * Math.PI) / 2;
    for (let i = 0; i <= steps; i++) {
      const a = start + (i / steps) * (Math.PI / 2);
      points.push({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r });
    }
  });
  return points;
}

function starPoints(w: number, h: number): Point[] {
  const raw: Point[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? 1 : 0.4;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    raw.push({ x: Math.cos(a) * radius, y: Math.sin(a) * radius });
  }
  // 上下左右が非対称なので、外接矩形が w×h に収まるよう正規化する
  const xs = raw.map((p) => p.x);
  const ys = raw.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return raw.map((p) => ({
    x: ((p.x - (minX + maxX) / 2) / (maxX - minX)) * w,
    y: ((p.y - (minY + maxY) / 2) / (maxY - minY)) * h,
  }));
}

function heartPoints(w: number, h: number): Point[] {
  const raw: Point[] = [];
  for (let i = 0; i < CURVE_SEGMENTS; i++) {
    const t = (i / CURVE_SEGMENTS) * Math.PI * 2;
    raw.push({
      x: 16 * Math.sin(t) ** 3,
      y: -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      ),
    });
  }
  const xs = raw.map((p) => p.x);
  const ys = raw.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return raw.map((p) => ({
    x: ((p.x - (minX + maxX) / 2) / (maxX - minX)) * w,
    y: ((p.y - (minY + maxY) / 2) / (maxY - minY)) * h,
  }));
}

/** 図形の輪郭を、中心を原点とするローカル座標の多角形で返す */
export function shapePolygon(
  kind: ShapeKind,
  width: number,
  height: number,
): Point[] {
  const hw = width / 2;
  const hh = height / 2;
  switch (kind) {
    case 'rect':
      return [
        { x: -hw, y: -hh },
        { x: hw, y: -hh },
        { x: hw, y: hh },
        { x: -hw, y: hh },
      ];
    case 'rounded':
      return roundedRectPoints(width, height);
    case 'circle':
    case 'ellipse':
      return ellipsePoints(width, height);
    case 'triangle':
      return [
        { x: 0, y: -hh },
        { x: hw, y: hh },
        { x: -hw, y: hh },
      ];
    case 'diamond':
      return [
        { x: 0, y: -hh },
        { x: hw, y: 0 },
        { x: 0, y: hh },
        { x: -hw, y: 0 },
      ];
    case 'star':
      return starPoints(width, height);
    case 'heart':
      return heartPoints(width, height);
  }
}

function toWorld(shape: Shape, local: Point): Point {
  const rad = (shape.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: shape.cx + local.x * cos - local.y * sin,
    y: shape.cy + local.x * sin + local.y * cos,
  };
}

/** 画像座標 → 図形のローカル座標(回転を打ち消す) */
export function toLocal(shape: Shape, point: Point): Point {
  const rad = (-shape.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = point.x - shape.cx;
  const dy = point.y - shape.cy;
  return { x: dx * cos - dy * sin, y: dx * sin + dy * cos };
}

/** 回転・移動を反映した、画像座標での輪郭 */
export function shapeWorldPolygon(shape: Shape): Point[] {
  return shapePolygon(shape.kind, shape.width, shape.height).map((p) =>
    toWorld(shape, p),
  );
}

export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x
    ) {
      inside = !inside;
    }
  }
  return inside;
}

export function hitTestShape(shape: Shape, point: Point): boolean {
  return pointInPolygon(point, shapeWorldPolygon(shape));
}

/** 手前(配列の後ろ)の図形から順に当たり判定し、最初に当たった図形のIDを返す */
export function findShapeAt(shapes: Shape[], point: Point): number | null {
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (hitTestShape(shapes[i], point)) return shapes[i].id;
  }
  return null;
}

/** 選択枠のハンドル位置(画像座標)。rotateOffset は枠の上端から回転ハンドルまでの距離(px) */
export function getHandlePositions(
  shape: Shape,
  rotateOffset: number,
): Record<HandleKind, Point> {
  const hw = shape.width / 2;
  const hh = shape.height / 2;
  return {
    nw: toWorld(shape, { x: -hw, y: -hh }),
    ne: toWorld(shape, { x: hw, y: -hh }),
    se: toWorld(shape, { x: hw, y: hh }),
    sw: toWorld(shape, { x: -hw, y: hh }),
    rotate: toWorld(shape, { x: 0, y: -hh - rotateOffset }),
  };
}

/** ポインタ位置がハンドルの半径内ならそのハンドルを返す */
export function findHandleAt(
  shape: Shape,
  point: Point,
  radius: number,
  rotateOffset: number,
): HandleKind | null {
  const positions = getHandlePositions(shape, rotateOffset);
  const order: HandleKind[] = ['rotate', 'nw', 'ne', 'se', 'sw'];
  for (const kind of order) {
    const p = positions[kind];
    if (Math.hypot(p.x - point.x, p.y - point.y) <= radius) return kind;
  }
  return null;
}

export function createShape(
  id: number,
  kind: ShapeKind,
  image: Dimensions,
  offsetIndex = 0,
): Shape {
  const base = Math.max(
    MIN_SHAPE_SIZE,
    Math.round(Math.min(image.width, image.height) * INITIAL_SIZE_RATIO),
  );
  const wide = kind === 'rect' || kind === 'ellipse' || kind === 'rounded';
  const width = wide ? Math.round(base * 1.4) : base;
  const shift = (offsetIndex % 5) * Math.round(base * 0.12);
  return {
    id,
    kind,
    cx: clamp(image.width / 2 + shift, 0, image.width),
    cy: clamp(image.height / 2 + shift, 0, image.height),
    width,
    height: base,
    rotation: 0,
  };
}

/** 中心が画像の外に出ないように移動する */
export function moveShape(
  shape: Shape,
  cx: number,
  cy: number,
  image: Dimensions,
): Shape {
  return {
    ...shape,
    cx: clamp(cx, 0, image.width),
    cy: clamp(cy, 0, image.height),
  };
}

/**
 * コーナーのハンドルをポインタ位置まで動かして拡大縮小する(中心は固定)。
 * 円は縦横を揃える。
 */
export function resizeShape(
  shape: Shape,
  point: Point,
  image: Dimensions,
): Shape {
  const local = toLocal(shape, point);
  const maxSize = Math.max(image.width, image.height) * 2;
  let width = clamp(Math.abs(local.x) * 2, MIN_SHAPE_SIZE, maxSize);
  let height = clamp(Math.abs(local.y) * 2, MIN_SHAPE_SIZE, maxSize);
  if (isSquareKind(shape.kind)) {
    width = height = Math.max(width, height);
  }
  return { ...shape, width, height };
}

/** 回転ハンドルをポインタ位置へ向ける。snap が true なら15度刻み */
export function rotateShape(shape: Shape, point: Point, snap = false): Shape {
  const angle =
    (Math.atan2(point.y - shape.cy, point.x - shape.cx) * 180) / Math.PI + 90;
  let rotation = ((angle % 360) + 360) % 360;
  if (snap) rotation = (Math.round(rotation / 15) * 15) % 360;
  return { ...shape, rotation };
}

/**
 * 図形の種類を変更する。円は正方形に揃える。
 */
export function changeShapeKind(shape: Shape, kind: ShapeKind): Shape {
  if (isSquareKind(kind)) {
    const size = Math.max(shape.width, shape.height);
    return { ...shape, kind, width: size, height: size };
  }
  return { ...shape, kind };
}

export function duplicateShape(
  shape: Shape,
  id: number,
  image: Dimensions,
): Shape {
  const shift = Math.max(
    12,
    Math.round(Math.min(shape.width, shape.height) * 0.15),
  );
  return moveShape({ ...shape, id }, shape.cx + shift, shape.cy + shift, image);
}

/** 図形のパスを ctx に追加する(塗り・くり抜きの両方で使う) */
export function tracePolygon(
  ctx: {
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    closePath(): void;
  },
  polygon: Point[],
): void {
  polygon.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
}
