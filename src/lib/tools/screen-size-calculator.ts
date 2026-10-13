export const CM_PER_INCH = 2.54;
const MAX_VALUE = 1e6;
/** 視力1.0（1分角）で1画素が見分けられなくなる距離 = 画素ピッチ / tan(1/60°) ≒ ピッチ × 3438 */
const ARCMINUTE_FACTOR = 1 / Math.tan(Math.PI / 180 / 60);

export interface ScreenRatioPreset {
  w: number;
  h: number;
  value: string;
}

export interface ResolutionPreset {
  /** select の value（"1920x1080"） */
  value: string;
  /** 表示名（辞書化しない固有名: FHD など） */
  label: string;
  width: number;
  height: number;
}

export const RATIO_PRESETS: ScreenRatioPreset[] = [
  { w: 16, h: 9, value: '16:9' },
  { w: 16, h: 10, value: '16:10' },
  { w: 21, h: 9, value: '21:9' },
  { w: 4, h: 3, value: '4:3' },
];

function res(label: string, width: number, height: number): ResolutionPreset {
  return { value: `${width}x${height}`, label, width, height };
}

export const RESOLUTION_PRESETS: ResolutionPreset[] = [
  res('HD', 1280, 720),
  res('FHD', 1920, 1080),
  res('WUXGA', 1920, 1200),
  res('QHD', 2560, 1440),
  res('WQXGA', 2560, 1600),
  res('UWQHD', 3440, 1440),
  res('4K UHD', 3840, 2160),
  res('5K', 5120, 2880),
  res('8K UHD', 7680, 4320),
];

function isValid(n: number): boolean {
  return Number.isFinite(n) && n > 0 && n <= MAX_VALUE;
}

export function inchToCm(inch: number): number {
  return inch * CM_PER_INCH;
}

export function cmToInch(cm: number): number {
  return cm / CM_PER_INCH;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

/** 整数の幅・高さを約分する。整数でない・0以下は null */
export function simplifyInteger(
  w: number,
  h: number,
): { w: number; h: number } | null {
  if (!Number.isInteger(w) || !Number.isInteger(h) || w <= 0 || h <= 0) {
    return null;
  }
  const g = gcd(w, h);
  return { w: w / g, h: h / g };
}

/** 小数を指定桁で丸めて末尾の0を除いた文字列にする */
export function formatNumber(n: number, maxDigits = 2): string {
  if (!Number.isFinite(n)) return '';
  return String(Number(n.toFixed(maxDigits)));
}

export interface ScreenInput {
  diagonalInch: number;
  ratioW: number;
  ratioH: number;
  resWidth: number;
  resHeight: number;
}

export interface ScreenResult {
  widthInch: number;
  heightInch: number;
  widthCm: number;
  heightCm: number;
  diagonalCm: number;
  areaCm2: number;
  areaInch2: number;
  ppi: number;
  /** 画素ピッチ（mm） */
  dotPitchMm: number;
  /** 画素が見分けにくくなる距離（cm、視力1.0の目安） */
  pixelInvisibleCm: number;
  /** 画面全体を見渡しやすい距離の目安（cm）の下限・上限（対角の1.0〜1.5倍） */
  overviewMinCm: number;
  overviewMaxCm: number;
  /** 画面の縦横比と解像度の縦横比の差（％、絶対値） */
  ratioMismatchPercent: number;
}

/** 対角インチ・縦横比・解像度から画面の物理サイズ・PPIなどを求める。不正値は null */
export function calculateScreen(input: ScreenInput): ScreenResult | null {
  const { diagonalInch, ratioW, ratioH, resWidth, resHeight } = input;
  if (
    !isValid(diagonalInch) ||
    !isValid(ratioW) ||
    !isValid(ratioH) ||
    !isValid(resWidth) ||
    !isValid(resHeight)
  ) {
    return null;
  }
  const norm = Math.hypot(ratioW, ratioH);
  const widthInch = (diagonalInch * ratioW) / norm;
  const heightInch = (diagonalInch * ratioH) / norm;
  const widthCm = inchToCm(widthInch);
  const heightCm = inchToCm(heightInch);
  const ppi = Math.hypot(resWidth, resHeight) / diagonalInch;
  const dotPitchMm = (CM_PER_INCH * 10) / ppi;
  const diagonalCm = inchToCm(diagonalInch);
  const mismatch = Math.abs(resWidth / resHeight / (ratioW / ratioH) - 1) * 100;
  return {
    widthInch,
    heightInch,
    widthCm,
    heightCm,
    diagonalCm,
    areaCm2: widthCm * heightCm,
    areaInch2: widthInch * heightInch,
    ppi,
    dotPitchMm,
    pixelInvisibleCm: (dotPitchMm * ARCMINUTE_FACTOR) / 10,
    overviewMinCm: diagonalCm,
    overviewMaxCm: diagonalCm * 1.5,
    ratioMismatchPercent: mismatch,
  };
}

export interface SizeToDiagonalResult {
  diagonalInch: number;
  diagonalCm: number;
  widthInch: number;
  heightInch: number;
  /** 近い代表的な縦横比 */
  nearest: ScreenRatioPreset;
  /** 代表的な縦横比との差（％、絶対値） */
  nearestDiffPercent: number;
}

/** 幅×高さ（cm）から対角インチを求める。不正値は null */
export function sizeToDiagonal(
  widthCm: number,
  heightCm: number,
): SizeToDiagonalResult | null {
  if (!isValid(widthCm) || !isValid(heightCm)) return null;
  const diagonalCm = Math.hypot(widthCm, heightCm);
  const r = widthCm / heightCm;
  const candidates: ScreenRatioPreset[] = [
    ...RATIO_PRESETS,
    { w: 1, h: 1, value: '1:1' },
  ];
  let nearest = candidates[0];
  let best = Infinity;
  for (const p of candidates) {
    const diff = Math.abs(Math.log(r / (p.w / p.h)));
    if (diff < best) {
      best = diff;
      nearest = p;
    }
  }
  return {
    diagonalInch: cmToInch(diagonalCm),
    diagonalCm,
    widthInch: cmToInch(widthCm),
    heightInch: cmToInch(heightCm),
    nearest,
    nearestDiffPercent: Math.abs(r / (nearest.w / nearest.h) - 1) * 100,
  };
}
