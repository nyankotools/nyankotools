/** スクリーンショット注釈ツールの純粋ロジック（座標・矢印の頭・連番・ヒット判定・履歴）。 */

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type AnnotationTool = 'arrow' | 'rect' | 'badge' | 'text' | 'erase';

interface AnnotationBase {
  /** #rrggbb */
  color: string;
  /** 線の太さ(画像px)。バッジ・文字のサイズもここから決める */
  lineWidth: number;
}

export interface ArrowAnnotation extends AnnotationBase {
  kind: 'arrow';
  from: Point;
  to: Point;
}

export interface RectAnnotation extends AnnotationBase {
  kind: 'rect';
  rect: Rect;
}

export interface BadgeAnnotation extends AnnotationBase {
  kind: 'badge';
  center: Point;
  number: number;
}

export interface TextAnnotation extends AnnotationBase {
  kind: 'text';
  /** 文字の左上ではなく、1行目の左端・縦中央の位置 */
  position: Point;
  text: string;
}

export type Annotation =
  ArrowAnnotation | RectAnnotation | BadgeAnnotation | TextAnnotation;

export const MIN_LINE_WIDTH = 1;
export const MAX_LINE_WIDTH = 40;
/** これより短い／小さいドラッグは誤タップとみなして無視する(画像px) */
export const MIN_SHAPE_SIZE = 4;
export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const MAX_TEXT_LENGTH = 200;

export function clampLineWidth(value: number): number {
  if (!Number.isFinite(value)) return MIN_LINE_WIDTH;
  return Math.min(MAX_LINE_WIDTH, Math.max(MIN_LINE_WIDTH, Math.round(value)));
}

/** 画像の幅に応じた既定の線の太さ（大きな画像でも見えるように） */
export function defaultLineWidth(width: number): number {
  if (!Number.isFinite(width) || width <= 0) return 4;
  return clampLineWidth(Math.max(3, Math.round(width / 300)));
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

/** 元ファイル名から "<名前>-annotated.png" を作る */
export function buildOutputFileName(original: string): string {
  const base = original.replace(/\.[^./\\]+$/, '').trim();
  return `${base || 'screenshot'}-annotated.png`;
}

/** 画面座標を画像ピクセル座標へ。範囲外は画像内にクランプする */
export function clientToImagePoint(
  clientX: number,
  clientY: number,
  bounds: { left: number; top: number; width: number; height: number },
  dims: Dimensions,
): Point {
  if (bounds.width <= 0 || bounds.height <= 0) return { x: 0, y: 0 };
  const x = ((clientX - bounds.left) / bounds.width) * dims.width;
  const y = ((clientY - bounds.top) / bounds.height) * dims.height;
  return {
    x: Math.min(dims.width, Math.max(0, x)),
    y: Math.min(dims.height, Math.max(0, y)),
  };
}

/** 2点から矩形を作る。小さすぎる場合は null */
export function normalizeRect(a: Point, b: Point): Rect | null {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const width = Math.abs(a.x - b.x);
  const height = Math.abs(a.y - b.y);
  if (width < MIN_SHAPE_SIZE && height < MIN_SHAPE_SIZE) return null;
  return { x, y, width, height };
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export interface ArrowHead {
  tip: Point;
  left: Point;
  right: Point;
  /** 軸線を終わらせる位置（頭の根元）。線が頭からはみ出ないようにする */
  base: Point;
}

/** 矢印の頭の三角形の頂点。長さがほぼ 0 なら null */
export function arrowHeadPoints(
  from: Point,
  to: Point,
  lineWidth: number,
): ArrowHead | null {
  const len = distance(from, to);
  if (len < MIN_SHAPE_SIZE) return null;
  const ux = (to.x - from.x) / len;
  const uy = (to.y - from.y) / len;
  // 頭の長さは太さの4倍。ただし矢印全体の半分は超えない
  const headLen = Math.min(Math.max(lineWidth * 4, 10), len * 0.5);
  const halfWidth = headLen * 0.5;
  const base = { x: to.x - ux * headLen, y: to.y - uy * headLen };
  return {
    tip: { x: to.x, y: to.y },
    left: { x: base.x - uy * halfWidth, y: base.y + ux * halfWidth },
    right: { x: base.x + uy * halfWidth, y: base.y - ux * halfWidth },
    base,
  };
}

export function badgeRadius(lineWidth: number): number {
  return Math.max(12, Math.round(lineWidth * 3.5));
}

export function textFontSize(lineWidth: number): number {
  return Math.max(16, Math.round(lineWidth * 5));
}

/** 次に振る連番（現在のバッジ数 + 1） */
export function nextBadgeNumber(annotations: readonly Annotation[]): number {
  return annotations.filter((a) => a.kind === 'badge').length + 1;
}

/** バッジが途中で消えたとき、連番を 1 から振り直す */
export function renumberBadges(
  annotations: readonly Annotation[],
): Annotation[] {
  let n = 0;
  return annotations.map((a) =>
    a.kind === 'badge' ? { ...a, number: ++n } : a,
  );
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return distance(p, a);
  const t = Math.max(
    0,
    Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq),
  );
  return distance(p, { x: a.x + t * dx, y: a.y + t * dy });
}

/** 文字の概算の幅（等幅でない文字も含むため目安。全角は1em、半角は0.6em） */
export function estimateTextWidth(text: string, fontSize: number): number {
  let w = 0;
  for (const ch of text) {
    w += ch.charCodeAt(0) < 0x80 ? 0.6 : 1;
  }
  return w * fontSize;
}

/** 点 p が注釈に当たっているか。tolerance は画像px */
export function hitsAnnotation(
  a: Annotation,
  p: Point,
  tolerance = 6,
): boolean {
  switch (a.kind) {
    case 'arrow':
      return distanceToSegment(p, a.from, a.to) <= a.lineWidth / 2 + tolerance;
    case 'rect': {
      const { x, y, width, height } = a.rect;
      const pad = a.lineWidth / 2 + tolerance;
      const inOuter =
        p.x >= x - pad &&
        p.x <= x + width + pad &&
        p.y >= y - pad &&
        p.y <= y + height + pad;
      const inInner =
        p.x > x + pad &&
        p.x < x + width - pad &&
        p.y > y + pad &&
        p.y < y + height - pad;
      return inOuter && !inInner;
    }
    case 'badge':
      return distance(p, a.center) <= badgeRadius(a.lineWidth) + tolerance;
    case 'text': {
      const size = textFontSize(a.lineWidth);
      const w = estimateTextWidth(a.text, size);
      return (
        p.x >= a.position.x - tolerance &&
        p.x <= a.position.x + w + tolerance &&
        p.y >= a.position.y - size / 2 - tolerance &&
        p.y <= a.position.y + size / 2 + tolerance
      );
    }
  }
}

/** 点に当たる最前面（最後に追加した）注釈の添字。無ければ -1 */
export function hitTest(
  annotations: readonly Annotation[],
  p: Point,
  tolerance = 6,
): number {
  for (let i = annotations.length - 1; i >= 0; i--) {
    if (hitsAnnotation(annotations[i], p, tolerance)) return i;
  }
  return -1;
}

/** 指定位置の注釈を取り除き、バッジ番号を振り直した新しい配列を返す */
export function removeAnnotation(
  annotations: readonly Annotation[],
  index: number,
): Annotation[] {
  if (index < 0 || index >= annotations.length) return [...annotations];
  const next = annotations.filter((_, i) => i !== index);
  return renumberBadges(next);
}

/** 履歴モデル: 注釈の配列そのものが履歴。undo は直前の追加を取り消す */
export const MAX_ANNOTATIONS = 500;

export function addAnnotation(
  annotations: readonly Annotation[],
  annotation: Annotation,
): Annotation[] {
  const next = [...annotations, annotation];
  return next.length > MAX_ANNOTATIONS ? next.slice(-MAX_ANNOTATIONS) : next;
}

export function undoAnnotation(
  annotations: readonly Annotation[],
): Annotation[] {
  return annotations.slice(0, -1);
}

/** 入力テキストを整える。空なら null */
export function normalizeText(text: string): string | null {
  const t = text.replace(/\r?\n/g, ' ').trim().slice(0, MAX_TEXT_LENGTH);
  return t === '' ? null : t;
}

export function isHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}
