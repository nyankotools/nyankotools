export interface IdPhotoPreset {
  id: string;
  /** 横（mm） */
  widthMm: number;
  /** 縦（mm） */
  heightMm: number;
}

export const ID_PHOTO_PRESETS: IdPhotoPreset[] = [
  { id: 'resume', widthMm: 30, heightMm: 40 },
  { id: 'resume-large', widthMm: 34, heightMm: 45 },
  { id: 'passport', widthMm: 35, heightMm: 45 },
  { id: 'license', widthMm: 24, heightMm: 30 },
];

export const MIN_SIZE_MM = 10;
export const MAX_SIZE_MM = 100;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 3;

const MM_PER_INCH = 25.4;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 用紙サイズ（mm）と解像度（dpi）から出力ピクセル数を求める。 */
export function computeOutputSize(
  widthMm: number,
  heightMm: number,
  dpi: number,
): { width: number; height: number } {
  return {
    width: Math.max(1, Math.round((widthMm / MM_PER_INCH) * dpi)),
    height: Math.max(1, Math.round((heightMm / MM_PER_INCH) * dpi)),
  };
}

/** 任意サイズ入力の検証。範囲外・非数は null。 */
export function parseSizeMm(value: string | number): number | null {
  const n = typeof value === 'number' ? value : Number(value.trim());
  if (value === '' || !Number.isFinite(n)) return null;
  if (n < MIN_SIZE_MM || n > MAX_SIZE_MM) return null;
  return n;
}

export interface DrawRect {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/**
 * 元画像を出力枠に配置する位置と大きさを求める。
 * zoom=1 で枠いっぱい（短い辺に合わせて拡大）。1未満だと余白ができ、背景色で塗りつぶされる。
 * offsetX / offsetY は -1〜1 で、画像中心を枠の半分のサイズ単位でずらす。
 */
export function computeDrawRect(
  srcWidth: number,
  srcHeight: number,
  outWidth: number,
  outHeight: number,
  zoom: number,
  offsetX: number,
  offsetY: number,
): DrawRect {
  const z = clamp(zoom, MIN_ZOOM, MAX_ZOOM);
  const scale = Math.max(outWidth / srcWidth, outHeight / srcHeight) * z;
  const dw = srcWidth * scale;
  const dh = srcHeight * scale;
  const cx = outWidth / 2 + clamp(offsetX, -1, 1) * (outWidth / 2);
  const cy = outHeight / 2 + clamp(offsetY, -1, 1) * (outHeight / 2);
  return { dx: cx - dw / 2, dy: cy - dh / 2, dw, dh };
}

/** 画像が枠を覆いきれていない（背景色が見える）かどうか。 */
export function hasBackgroundGap(
  rect: DrawRect,
  outWidth: number,
  outHeight: number,
): boolean {
  const eps = 0.5;
  return (
    rect.dx > eps ||
    rect.dy > eps ||
    rect.dx + rect.dw < outWidth - eps ||
    rect.dy + rect.dh < outHeight - eps
  );
}

export function buildFilename(
  widthMm: number,
  heightMm: number,
  format: 'jpeg' | 'png',
): string {
  const fmt = (n: number) => String(Math.round(n * 10) / 10);
  return `id-photo-${fmt(widthMm)}x${fmt(heightMm)}mm.${format === 'jpeg' ? 'jpg' : 'png'}`;
}
