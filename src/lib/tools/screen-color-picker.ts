import {
  formatHsl,
  formatRgb,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  type RgbColor,
} from './color-converter';

/** EyeDropper API（lib.dom に未収録のため自前で宣言する） */
export interface EyeDropperResult {
  sRGBHex: string;
}

export interface EyeDropperLike {
  open(options?: { signal?: AbortSignal }): Promise<EyeDropperResult>;
}

export type EyeDropperConstructor = new () => EyeDropperLike;

export interface PickedColor {
  hex: string;
  rgb: string;
  hsl: string;
}

export const HISTORY_MAX = 30;

/** window から EyeDropper のコンストラクタを取り出す。非対応なら null。 */
export function getEyeDropper(host: object): EyeDropperConstructor | null {
  const ctor = (host as { EyeDropper?: unknown }).EyeDropper;
  return typeof ctor === 'function' ? (ctor as EyeDropperConstructor) : null;
}

/** EyeDropper が返す sRGBHex（"#rrggbb"）を大文字HEXへ正規化する。不正なら null。 */
export function parseEyeDropperHex(value: string): string | null {
  const rgb = hexToRgb(value);
  return rgb ? rgbToHex(rgb).toUpperCase() : null;
}

/** ユーザーがスポイトを中断した（Esc など）ときのエラーか。 */
export function isEyeDropperAbort(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { name?: unknown }).name === 'AbortError'
  );
}

export function describeColor(rgb: RgbColor): PickedColor {
  return {
    hex: rgbToHex(rgb).toUpperCase(),
    rgb: formatRgb(rgb),
    hsl: formatHsl(rgbToHsl(rgb)),
  };
}

/** HEX 文字列から表示用の3形式を作る。不正なら null。 */
export function describeHex(hex: string): PickedColor | null {
  const rgb = hexToRgb(hex);
  return rgb ? describeColor(rgb) : null;
}

/** 色の上に載せる文字を白黒どちらにするか。 */
export function readableTextColor({
  r,
  g,
  b,
}: RgbColor): '#000000' | '#ffffff' {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#ffffff';
}

/**
 * 画像を表示した要素内の相対座標を、画像のピクセル座標へ変換する。
 * 要素外・サイズ不正のときは null。範囲は 0..size-1 に収める。
 */
export function mapPointToPixel(
  px: number,
  py: number,
  boxWidth: number,
  boxHeight: number,
  imgWidth: number,
  imgHeight: number,
): { x: number; y: number } | null {
  if (imgWidth <= 0 || imgHeight <= 0 || boxWidth <= 0 || boxHeight <= 0) {
    return null;
  }
  if (px < 0 || py < 0 || px > boxWidth || py > boxHeight) return null;
  const x = Math.min(imgWidth - 1, Math.floor((px / boxWidth) * imgWidth));
  const y = Math.min(imgHeight - 1, Math.floor((py / boxHeight) * imgHeight));
  return { x, y };
}

/** RGBA配列（幅 width）の (x, y) の色。範囲外は null。 */
export function pixelColorAt(
  data: ArrayLike<number>,
  width: number,
  x: number,
  y: number,
): RgbColor | null {
  if (width <= 0 || x < 0 || y < 0 || x >= width) return null;
  const i = (y * width + x) * 4;
  if (i + 2 >= data.length) return null;
  return { r: data[i], g: data[i + 1], b: data[i + 2] };
}

/** 履歴の先頭に追加する。同じ色は先頭へ移動し、max件を超えた分は捨てる。 */
export function addColorToHistory(
  history: string[],
  hex: string,
  max = HISTORY_MAX,
): string[] {
  const upper = hex.toUpperCase();
  return [upper, ...history.filter((h) => h !== upper)].slice(0, max);
}
