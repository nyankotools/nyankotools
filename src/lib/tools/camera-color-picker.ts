import {
  formatHsl,
  formatRgb,
  rgbToHex,
  rgbToHsl,
  type RgbColor,
} from './color-converter';

export interface PickedColor {
  hex: string;
  rgb: string;
  hsl: string;
}

export interface SampleRegion {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

/**
 * object-fit: contain で表示された映像の上の座標（要素内の相対位置）を、映像のピクセル座標に変換する。
 * 余白（レターボックス）の部分や映像サイズ未確定のときは null。
 */
export function mapPointToSource(
  px: number,
  py: number,
  boxWidth: number,
  boxHeight: number,
  srcWidth: number,
  srcHeight: number,
): { x: number; y: number } | null {
  if (srcWidth <= 0 || srcHeight <= 0 || boxWidth <= 0 || boxHeight <= 0) {
    return null;
  }
  const scale = Math.min(boxWidth / srcWidth, boxHeight / srcHeight);
  const shownW = srcWidth * scale;
  const shownH = srcHeight * scale;
  const offsetX = (boxWidth - shownW) / 2;
  const offsetY = (boxHeight - shownH) / 2;
  const x = (px - offsetX) / scale;
  const y = (py - offsetY) / scale;
  if (x < 0 || y < 0 || x >= srcWidth || y >= srcHeight) return null;
  return { x: Math.floor(x), y: Math.floor(y) };
}

/** 中心 (x, y) から半径 radius の正方形を、映像の範囲内に収めて返す。 */
export function sampleRegion(
  x: number,
  y: number,
  radius: number,
  srcWidth: number,
  srcHeight: number,
): SampleRegion {
  const r = Math.max(0, Math.floor(radius));
  const sx = Math.max(0, x - r);
  const sy = Math.max(0, y - r);
  const ex = Math.min(srcWidth - 1, x + r);
  const ey = Math.min(srcHeight - 1, y + r);
  return { sx, sy, sw: Math.max(1, ex - sx + 1), sh: Math.max(1, ey - sy + 1) };
}

/** RGBA配列の全画素の平均色（アルファは無視）。空配列は黒。 */
export function averageColor(data: ArrayLike<number>): RgbColor {
  const pixels = Math.floor(data.length / 4);
  if (pixels === 0) return { r: 0, g: 0, b: 0 };
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < pixels; i++) {
    r += data[i * 4];
    g += data[i * 4 + 1];
    b += data[i * 4 + 2];
  }
  return {
    r: Math.round(r / pixels),
    g: Math.round(g / pixels),
    b: Math.round(b / pixels),
  };
}

export function describeColor(rgb: RgbColor): PickedColor {
  return {
    hex: rgbToHex(rgb).toUpperCase(),
    rgb: formatRgb(rgb),
    hsl: formatHsl(rgbToHsl(rgb)),
  };
}

/** 色の上に載せる文字を白黒どちらにするか（相対輝度で判定）。 */
export function readableTextColor({
  r,
  g,
  b,
}: RgbColor): '#000000' | '#ffffff' {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#ffffff';
}

/** 履歴の先頭に追加する。同じ色は先頭へ移動し、max件を超えた分は捨てる。 */
export function addColorToHistory(
  history: string[],
  hex: string,
  max = 12,
): string[] {
  return [hex, ...history.filter((h) => h !== hex)].slice(0, max);
}
