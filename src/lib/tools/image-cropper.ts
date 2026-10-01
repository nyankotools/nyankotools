export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect extends Point, Size {}

export type Rotation = 0 | 90 | 180 | 270;

export type OutputFormat = 'png' | 'jpeg' | 'webp';

/** 読み込める画像の1辺の上限（px）。canvasの上限を超えて空画像になるのを防ぐ */
export const MAX_DIMENSION = 16384;
/** 読み込める画像の総画素数の上限。メモリ不足によるタブのクラッシュを防ぐ */
export const MAX_PIXELS = 50_000_000;

const FORMATS: Record<OutputFormat, { mime: string; ext: string }> = {
  png: { mime: 'image/png', ext: 'png' },
  jpeg: { mime: 'image/jpeg', ext: 'jpg' },
  webp: { mime: 'image/webp', ext: 'webp' },
};

export function outputFormat(format: OutputFormat) {
  return FORMATS[format];
}

export function isWithinSourceLimit(size: Size): boolean {
  return (
    size.width <= MAX_DIMENSION &&
    size.height <= MAX_DIMENSION &&
    size.width * size.height <= MAX_PIXELS
  );
}

/** 回転後の画像サイズ。90°・270°では縦横が入れ替わる */
export function rotatedSize(size: Size, rotation: Rotation): Size {
  return rotation === 90 || rotation === 270
    ? { width: size.height, height: size.width }
    : { width: size.width, height: size.height };
}

/** 時計回りに90°回す（正の値）／反時計回りに回す（負の値） */
export function rotateBy(rotation: Rotation, delta: 90 | -90): Rotation {
  return ((((rotation + delta) % 360) + 360) % 360) as Rotation;
}

export function fullRect(bounds: Size): Rect {
  return { x: 0, y: 0, width: bounds.width, height: bounds.height };
}

/** 切り抜き範囲を整数にそろえ、画像の内側に収める（幅・高さは最小1px） */
export function clampRect(rect: Rect, bounds: Size): Rect {
  const num = (v: number) => (Number.isFinite(v) ? Math.round(v) : 0);
  const x = Math.min(Math.max(num(rect.x), 0), Math.max(bounds.width - 1, 0));
  const y = Math.min(Math.max(num(rect.y), 0), Math.max(bounds.height - 1, 0));
  const width = Math.min(Math.max(num(rect.width), 1), bounds.width - x);
  const height = Math.min(Math.max(num(rect.height), 1), bounds.height - y);
  return { x, y, width, height };
}

/** 'free' や空文字は null（自由）、'16:9' は 16/9、数値の文字列もそのまま比率として扱う */
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

/** 左上を固定したまま、幅を基準に縦横比を合わせる。画像からはみ出す場合は縮める */
export function fitAspect(rect: Rect, ratio: number, bounds: Size): Rect {
  const base = clampRect(rect, bounds);
  let width = base.width;
  let height = Math.round(width / ratio);
  const maxW = bounds.width - base.x;
  const maxH = bounds.height - base.y;
  if (height > maxH) {
    height = maxH;
    width = Math.round(height * ratio);
  }
  if (width > maxW) {
    width = maxW;
    height = Math.round(width / ratio);
  }
  return clampRect({ x: base.x, y: base.y, width, height }, bounds);
}

/**
 * ドラッグの始点 a を固定し、終点 b までの範囲を作る。ratio があれば縦横比を保つ。
 * 範囲は常に画像の内側に収める。
 */
export function rectFromDrag(
  a: Point,
  b: Point,
  bounds: Size,
  ratio: number | null,
): Rect {
  const ax = Math.min(Math.max(a.x, 0), bounds.width);
  const ay = Math.min(Math.max(a.y, 0), bounds.height);
  const dx = b.x - ax;
  const dy = b.y - ay;
  const right = dx >= 0;
  const down = dy >= 0;
  const maxW = right ? bounds.width - ax : ax;
  const maxH = down ? bounds.height - ay : ay;
  let w = Math.min(Math.abs(dx), maxW);
  let h = Math.min(Math.abs(dy), maxH);
  if (ratio) {
    if (h === 0 || w / h > ratio) w = h * ratio;
    else h = w / ratio;
  }
  return clampRect(
    { x: right ? ax : ax - w, y: down ? ay : ay - h, width: w, height: h },
    bounds,
  );
}

/** ダウンロード用のファイル名。元のファイル名の拡張子を出力形式に置き換え、末尾に -cropped を付ける */
export function croppedFileName(
  sourceName: string | null,
  format: OutputFormat,
): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}-cropped.${FORMATS[format].ext}`;
}
