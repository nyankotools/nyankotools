export interface Ratio {
  w: number;
  h: number;
}

export interface RatioPreset extends Ratio {
  /** 表示・選択用の値（例: "16:9"） */
  value: string;
}

const MAX_VALUE = 1e9;
const MAX_DECIMALS = 6;

function makePreset(w: number, h: number): RatioPreset {
  return { w, h, value: `${w}:${h}` };
}

/** よく使うアスペクト比（横長 → 縦長の順） */
export const RATIO_PRESETS: RatioPreset[] = [
  makePreset(16, 9),
  makePreset(4, 3),
  makePreset(3, 2),
  makePreset(16, 10),
  makePreset(21, 9),
  makePreset(32, 9),
  makePreset(5, 4),
  makePreset(2, 1),
  makePreset(1, 1),
  makePreset(9, 16),
  makePreset(3, 4),
  makePreset(2, 3),
  makePreset(4, 5),
  makePreset(9, 21),
];

/** 解像度一覧に使う代表的な幅 */
export const COMMON_WIDTHS = [640, 1280, 1920, 2560, 3840, 7680];

function isValidDimension(n: number): boolean {
  return Number.isFinite(n) && n > 0 && n <= MAX_VALUE;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

function decimalPlaces(n: number): number {
  if (Number.isInteger(n)) return 0;
  const s = n.toString();
  if (s.includes('e-')) {
    const [mantissa, exp] = s.split('e-');
    const frac = mantissa.split('.')[1]?.length ?? 0;
    return frac + Number(exp);
  }
  return s.split('.')[1]?.length ?? 0;
}

/**
 * 幅・高さを約分した整数比にする。
 * 小数は最大6桁まで整数に直してから約分する。0以下・非数・極端に大きい値は null。
 */
export function simplifyRatio(width: number, height: number): Ratio | null {
  if (!isValidDimension(width) || !isValidDimension(height)) return null;
  const places = Math.min(
    MAX_DECIMALS,
    Math.max(decimalPlaces(width), decimalPlaces(height)),
  );
  const scale = 10 ** places;
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  if (w <= 0 || h <= 0) return null;
  const g = gcd(w, h);
  return { w: w / g, h: h / g };
}

/** "16:9" / "16/9" / "16×9" / "16x9" / "16 9" 形式の文字列を比率に変換する */
export function parseRatio(text: string): Ratio | null {
  const normalized = text
    .trim()
    .replace(/[：／×]/g, (c) => (c === '：' ? ':' : c === '／' ? '/' : 'x'));
  const m = normalized.match(
    /^(\d+(?:\.\d+)?)\s*(?::|\/|x|X|\s)\s*(\d+(?:\.\d+)?)$/,
  );
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  if (!isValidDimension(w) || !isValidDimension(h)) return null;
  return { w, h };
}

export function formatRatio(ratio: Ratio): string {
  return `${ratio.w}:${ratio.h}`;
}

/** 数値を小数点以下 maxDigits 桁で丸め、末尾の0を除く */
export function formatDecimal(n: number, maxDigits = 2): string {
  if (!Number.isFinite(n)) return '';
  return String(Number(n.toFixed(maxDigits)));
}

/** 比率の値（幅 ÷ 高さ） */
export function ratioValue(width: number, height: number): number | null {
  if (!isValidDimension(width) || !isValidDimension(height)) return null;
  return width / height;
}

export interface NearestPreset {
  preset: RatioPreset;
  /** プリセットとの比率の差（％、絶対値） */
  diffPercent: number;
  /** 比率が完全に一致するか */
  exact: boolean;
}

/** 幅・高さにもっとも近い代表的なアスペクト比を返す */
export function nearestPreset(
  width: number,
  height: number,
): NearestPreset | null {
  const r = ratioValue(width, height);
  if (r === null) return null;
  let best: RatioPreset | null = null;
  let bestDiff = Infinity;
  for (const p of RATIO_PRESETS) {
    const diff = Math.abs(Math.log(r / (p.w / p.h)));
    if (diff < bestDiff) {
      best = p;
      bestDiff = diff;
    }
  }
  if (!best) return null;
  const diffPercent = Math.abs(r / (best.w / best.h) - 1) * 100;
  return { preset: best, diffPercent, exact: diffPercent < 1e-9 };
}

export type KnownSide = 'width' | 'height';

export interface OtherSide {
  /** 厳密値 */
  exact: number;
  /** 四捨五入した整数 */
  rounded: number;
  /** 厳密値が整数か（誤差を考慮） */
  isInteger: boolean;
}

/** 比率と片辺の長さから、もう一辺の長さを求める */
export function calcOtherSide(
  ratio: Ratio,
  known: KnownSide,
  value: number,
): OtherSide | null {
  if (
    !isValidDimension(ratio.w) ||
    !isValidDimension(ratio.h) ||
    !isValidDimension(value)
  ) {
    return null;
  }
  const exact =
    known === 'width'
      ? (value * ratio.h) / ratio.w
      : (value * ratio.w) / ratio.h;
  if (!Number.isFinite(exact)) return null;
  const rounded = Math.round(exact);
  return {
    exact,
    rounded,
    isInteger: Math.abs(exact - rounded) < 1e-9,
  };
}

export interface ResolutionRow {
  width: number;
  height: number;
  isInteger: boolean;
}

/** 比率に合う代表的な幅ごとの高さ一覧 */
export function resolutionTable(
  ratio: Ratio,
  widths: number[] = COMMON_WIDTHS,
): ResolutionRow[] {
  const rows: ResolutionRow[] = [];
  for (const width of widths) {
    const other = calcOtherSide(ratio, 'width', width);
    if (other) {
      rows.push({
        width,
        height: other.rounded,
        isInteger: other.isInteger,
      });
    }
  }
  return rows;
}
