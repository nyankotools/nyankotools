export const MAX_TEXT_LENGTH = 20;
export const MIN_FONT_SIZE = 40;
export const MAX_FONT_SIZE = 240;
export const MAX_OUTLINE = 40;
export const MIN_SCALE = 0.3;
export const MAX_SCALE = 5;

/** 入力文字列を書記素単位（絵文字等を1文字扱い）で分割する。改行・前後空白は除く */
export function splitGlyphs(text: string): string[] {
  const cleaned = text.replace(/[\r\n]+/g, ' ').trim();
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  return Array.from(segmenter.segment(cleaned), (s) => s.segment);
}

export function isValidFontSize(value: number): boolean {
  return (
    Number.isInteger(value) && value >= MIN_FONT_SIZE && value <= MAX_FONT_SIZE
  );
}

export function isValidOutline(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_OUTLINE;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface Point {
  x: number;
  y: number;
}

/** 猫耳の三角形（単位円に収まる正規化座標。右耳の向き。左耳は左右反転で作る） */
export const EAR_TRIANGLE: Point[] = [
  { x: -0.717, y: 0.687 },
  { x: 0.065, y: -0.687 },
  { x: 0.717, y: 0.687 },
];

/** 三角形の重心方向に縮めた三角形（耳の内側用） */
export function shrinkTriangle(tri: Point[], ratio: number): Point[] {
  const cx = tri.reduce((a, p) => a + p.x, 0) / tri.length;
  const cy = tri.reduce((a, p) => a + p.y, 0) / tri.length;
  return tri.map((p) => ({
    x: cx + (p.x - cx) * ratio,
    y: cy + (p.y - cy) * ratio,
  }));
}

// ---- 装飾部品 ----------------------------------------------------------
// 位置(x, y)は「文字サイズを1とした長さ(em)」で、原点は文字列の左端・ベースライン。
// こうしておくと文字サイズを変えても装飾が文字に追従する。

export type DecorKind =
  'ear' | 'whisker' | 'paw' | 'sparkle' | 'heart' | 'star' | 'moon';

export const DECOR_KINDS: DecorKind[] = [
  'ear',
  'whisker',
  'paw',
  'sparkle',
  'heart',
  'star',
  'moon',
];

export interface DecorInfo {
  /** scale=1 のとき、図形を囲む円の半径(em) */
  radius: number;
  /** 文字と同様に縁取り・影を付ける図形か */
  outlined: boolean;
}

export const DECOR_INFO: Record<DecorKind, DecorInfo> = {
  ear: { radius: 0.23, outlined: true },
  whisker: { radius: 0.2, outlined: false },
  paw: { radius: 0.2, outlined: false },
  sparkle: { radius: 0.2, outlined: false },
  heart: { radius: 0.22, outlined: true },
  star: { radius: 0.24, outlined: true },
  moon: { radius: 0.24, outlined: true },
};

export interface Decor {
  id: number;
  kind: DecorKind;
  x: number;
  y: number;
  scale: number;
  /** 度。時計回りが正 */
  rotation: number;
  flip: boolean;
  /** null のときは既定色（耳は文字色、それ以外は装飾色） */
  color: string | null;
}

export type NewDecor = Omit<Decor, 'id'>;

export function makeDecor(kind: DecorKind, x: number, y: number): NewDecor {
  return { kind, x, y, scale: 1, rotation: 0, flip: false, color: null };
}

export function decorRadius(d: Pick<Decor, 'kind' | 'scale'>): number {
  return DECOR_INFO[d.kind].radius * d.scale;
}

export function clampScale(scale: number): number {
  return clamp(scale, MIN_SCALE, MAX_SCALE);
}

/** 角度を (-180, 180] に正規化する */
export function normalizeRotation(deg: number): number {
  const r = ((((deg + 180) % 360) + 360) % 360) - 180;
  return r === -180 ? 180 : r;
}

/** 部品が文字列から離れすぎないよう、位置を範囲内に収める */
export function clampPosition(
  x: number,
  y: number,
  textWidthEm: number,
): Point {
  return {
    x: clamp(x, -1.2, textWidthEm + 1.2),
    y: clamp(y, -2, 1.2),
  };
}

/** 「部品を追加」したときの初期位置。文字の上の空き領域に、追加数 n に応じて横へずらして置く */
export function newDecorAt(
  kind: DecorKind,
  textWidthEm: number,
  n: number,
): NewDecor {
  const step = n % 5;
  return makeDecor(
    kind,
    textWidthEm / 2 + (step - 2) * 0.5,
    -1.08 + (step % 2) * 0.06,
  );
}

// ---- 当たり判定・ハンドル ------------------------------------------------

/** (x, y) にある最前面の部品のID。最小半径 minRadius(em) を保証して掴みやすくする */
export function hitTest(
  items: Decor[],
  x: number,
  y: number,
  minRadius = 0,
): number | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const d = items[i];
    const r = Math.max(decorRadius(d), minRadius);
    if (Math.hypot(x - d.x, y - d.y) <= r) return d.id;
  }
  return null;
}

const HANDLE_GAP = 0.14;

function rotateVec(vx: number, vy: number, deg: number): Point {
  const r = (deg * Math.PI) / 180;
  return {
    x: vx * Math.cos(r) - vy * Math.sin(r),
    y: vx * Math.sin(r) + vy * Math.cos(r),
  };
}

/** 回転ハンドルの位置（部品の「上」方向の外側） */
export function rotateHandlePos(d: Decor): Point {
  const v = rotateVec(0, -(decorRadius(d) + HANDLE_GAP), d.rotation);
  return { x: d.x + v.x, y: d.y + v.y };
}

/** 拡大縮小ハンドルの位置（円周上の右下方向） */
export function scaleHandlePos(d: Decor): Point {
  const r = decorRadius(d);
  const v = rotateVec(r * Math.SQRT1_2, r * Math.SQRT1_2, d.rotation);
  return { x: d.x + v.x, y: d.y + v.y };
}

export type HandleKind = 'rotate' | 'scale';

export function handleHit(
  d: Decor,
  x: number,
  y: number,
  tolerance: number,
): HandleKind | null {
  const rot = rotateHandlePos(d);
  if (Math.hypot(x - rot.x, y - rot.y) <= tolerance) return 'rotate';
  const sc = scaleHandlePos(d);
  if (Math.hypot(x - sc.x, y - sc.y) <= tolerance) return 'scale';
  return null;
}

/** ポインタ位置から、拡大縮小ハンドルを引いたときの倍率 */
export function scaleFromPointer(d: Decor, x: number, y: number): number {
  const dist = Math.hypot(x - d.x, y - d.y);
  return clampScale(dist / DECOR_INFO[d.kind].radius);
}

/** ポインタ位置から、回転ハンドルを引いたときの角度（度）。snap>0 でその刻みに丸める */
export function rotationFromPointer(
  d: Decor,
  x: number,
  y: number,
  snap = 0,
): number {
  const deg = (Math.atan2(y - d.y, x - d.x) * 180) / Math.PI + 90;
  const snapped = snap > 0 ? Math.round(deg / snap) * snap : deg;
  return normalizeRotation(Math.round(snapped));
}

// ---- キャンバス範囲 ------------------------------------------------------

export interface CanvasLayout {
  width: number;
  height: number;
  /** 文字列の左端・ベースラインのキャンバス上の位置(px) */
  originX: number;
  originY: number;
}

/**
 * 文字列の矩形に、はみ出した装飾の範囲を加えた書き出し範囲を求める。
 * base は文字だけのキャンバス寸法、origin はその中での文字列の左端・ベースライン(px)。
 */
export function canvasLayout(
  base: { width: number; height: number },
  origin: Point,
  items: Decor[],
  size: number,
  pad: number,
): CanvasLayout {
  let left = 0;
  let top = 0;
  let right = base.width;
  let bottom = base.height;
  for (const d of items) {
    const cx = origin.x + d.x * size;
    const cy = origin.y + d.y * size;
    const r = decorRadius(d) * size + pad;
    left = Math.min(left, cx - r);
    top = Math.min(top, cy - r);
    right = Math.max(right, cx + r);
    bottom = Math.max(bottom, cy + r);
  }
  left = Math.floor(left);
  top = Math.floor(top);
  return {
    width: Math.ceil(right) - left,
    height: Math.ceil(bottom) - top,
    originX: origin.x - left,
    originY: origin.y - top,
  };
}

/** ダウンロード用のファイル名（透過PNG） */
export function buildFilename(text: string): string {
  const base = text
    .trim()
    .replace(/[\\/:*?"<>|\s]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20);
  return `${base || 'cat'}-logo.png`;
}
