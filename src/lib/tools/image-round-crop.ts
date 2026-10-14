import {
  isWithinSourceLimit,
  MAX_DIMENSION,
  type Point,
  type Size,
} from './image-cropper';

export { isWithinSourceLimit, MAX_DIMENSION };
export type { Point, Size };

export type Shape = 'circle' | 'rounded';
export type Frame = 'square' | 'original';
export type RoundFormat = 'png' | 'webp';

/** 正方形の切り抜き範囲（左上の座標と1辺の長さ） */
export interface Square {
  x: number;
  y: number;
  size: number;
}

export type Geometry = { kind: 'ellipse' } | { kind: 'rect'; radius: number };

const FORMATS: Record<RoundFormat, { mime: string; ext: string }> = {
  png: { mime: 'image/png', ext: 'png' },
  webp: { mime: 'image/webp', ext: 'webp' },
};

export function roundFormat(format: RoundFormat) {
  return FORMATS[format];
}

const num = (v: number) => (Number.isFinite(v) ? Math.round(v) : 0);

/** 正方形の範囲を整数にそろえ、画像の内側に収める（1辺は最小1px） */
export function clampSquare(sq: Square, bounds: Size): Square {
  const maxSize = Math.max(Math.min(bounds.width, bounds.height), 1);
  const size = Math.min(Math.max(num(sq.size), 1), maxSize);
  const x = Math.min(Math.max(num(sq.x), 0), Math.max(bounds.width - size, 0));
  const y = Math.min(Math.max(num(sq.y), 0), Math.max(bounds.height - size, 0));
  return { x, y, size };
}

/** 画像の中央に置いた、収まる最大の正方形 */
export function defaultSquare(bounds: Size): Square {
  const size = Math.max(Math.min(bounds.width, bounds.height), 1);
  return clampSquare(
    {
      x: (bounds.width - size) / 2,
      y: (bounds.height - size) / 2,
      size,
    },
    bounds,
  );
}

/** 指定した中心点まわりに正方形を置く。はみ出す場合は内側へ寄せる */
export function squareAround(
  center: Point,
  size: number,
  bounds: Size,
): Square {
  const s = Math.min(
    Math.max(num(size), 1),
    Math.min(bounds.width, bounds.height),
  );
  return clampSquare(
    { x: center.x - s / 2, y: center.y - s / 2, size: s },
    bounds,
  );
}

/** 角丸の割合（0〜100）を範囲内に収める。100で円（短辺の半分） */
export function clampRadiusPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), 100);
}

/** 出力の形。円は楕円（縦横が違うときは楕円になる）、角丸は短辺の半分×割合 */
export function shapeGeometry(
  shape: Shape,
  size: Size,
  radiusPercent: number,
): Geometry {
  if (shape === 'circle') return { kind: 'ellipse' };
  const half = Math.min(size.width, size.height) / 2;
  return {
    kind: 'rect',
    radius: (half * clampRadiusPercent(radiusPercent)) / 100,
  };
}

/**
 * 出力サイズ。target は長辺のpx（0以下・非数なら原寸）。
 * 縦横比は保ち、各辺は最小1px。拡大はしない。
 */
export function outputSize(source: Size, target: number): Size {
  const w = Math.max(Math.round(source.width), 1);
  const h = Math.max(Math.round(source.height), 1);
  if (!Number.isFinite(target) || target <= 0) return { width: w, height: h };
  const longest = Math.max(w, h);
  if (target >= longest) return { width: w, height: h };
  const scale = target / longest;
  return {
    width: Math.max(Math.round(w * scale), 1),
    height: Math.max(Math.round(h * scale), 1),
  };
}

/** ピクセル（中心座標で判定）が形の内側にあるか。テスト・検証用 */
export function insideShape(
  px: number,
  py: number,
  size: Size,
  geometry: Geometry,
): boolean {
  const { width: w, height: h } = size;
  if (px < 0 || py < 0 || px > w || py > h) return false;
  if (geometry.kind === 'ellipse') {
    const a = w / 2;
    const b = h / 2;
    const dx = (px - a) / a;
    const dy = (py - b) / b;
    return dx * dx + dy * dy <= 1;
  }
  const r = geometry.radius;
  if (r <= 0) return true;
  const cx = Math.min(Math.max(px, r), w - r);
  const cy = Math.min(Math.max(py, r), h - r);
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= r * r;
}

/** ダウンロード用のファイル名。拡張子を出力形式に置き換え、末尾に -round を付ける */
export function roundFileName(
  sourceName: string | null,
  format: RoundFormat,
): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}-round.${FORMATS[format].ext}`;
}
