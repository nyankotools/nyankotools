import {
  compileExpression,
  type AngleMode,
  type ParseErrorCode,
} from '../expression-parser';

/** 数式の本数（入力欄の数） */
export const MAX_FUNCTIONS = 6;

/** 式ごとの線の色（白背景のキャンバスで読める濃さ） */
export const CURVE_COLORS: readonly string[] = [
  '#2563eb',
  '#dc2626',
  '#16a34a',
  '#9333ea',
  '#d97706',
  '#0891b2',
];

export interface View {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const DEFAULT_VIEW: Readonly<View> = {
  xMin: -10,
  xMax: 10,
  yMin: -6,
  yMax: 6,
};

/** 表示範囲の幅・高さの下限と上限 */
export const MIN_SPAN = 1e-6;
export const MAX_SPAN = 1e9;

export type ViewError = 'notNumber' | 'order' | 'span';

export function validateView(v: View): ViewError | null {
  const nums = [v.xMin, v.xMax, v.yMin, v.yMax];
  if (nums.some((n) => !Number.isFinite(n))) return 'notNumber';
  if (v.xMin >= v.xMax || v.yMin >= v.yMax) return 'order';
  const sx = v.xMax - v.xMin;
  const sy = v.yMax - v.yMin;
  if (sx < MIN_SPAN || sy < MIN_SPAN || sx > MAX_SPAN || sy > MAX_SPAN)
    return 'span';
  return null;
}

/**
 * 点 (fx, fy)（キャンバス上の割合 0〜1、fy は上端が 0）を固定したまま拡大縮小する。
 * factor < 1 で拡大、> 1 で縮小。範囲外になる場合は元の範囲を返す。
 */
export function zoomView(v: View, factor: number, fx = 0.5, fy = 0.5): View {
  if (!Number.isFinite(factor) || factor <= 0) return v;
  const cx = v.xMin + (v.xMax - v.xMin) * fx;
  const cy = v.yMax - (v.yMax - v.yMin) * fy;
  const next: View = {
    xMin: cx - (cx - v.xMin) * factor,
    xMax: cx + (v.xMax - cx) * factor,
    yMin: cy - (cy - v.yMin) * factor,
    yMax: cy + (v.yMax - cy) * factor,
  };
  return validateView(next) ? v : next;
}

/** ドラッグ量（ピクセル）に応じて表示範囲を動かす */
export function panView(
  v: View,
  dxPx: number,
  dyPx: number,
  widthPx: number,
  heightPx: number,
): View {
  if (widthPx <= 0 || heightPx <= 0) return v;
  const dx = (dxPx / widthPx) * (v.xMax - v.xMin);
  const dy = (dyPx / heightPx) * (v.yMax - v.yMin);
  return {
    xMin: v.xMin - dx,
    xMax: v.xMax - dx,
    yMin: v.yMin + dy,
    yMax: v.yMax + dy,
  };
}

/** 数学座標 → キャンバスのピクセル座標 */
export function toPixel(
  v: View,
  widthPx: number,
  heightPx: number,
  x: number,
  y: number,
): { px: number; py: number } {
  return {
    px: ((x - v.xMin) / (v.xMax - v.xMin)) * widthPx,
    py: ((v.yMax - y) / (v.yMax - v.yMin)) * heightPx,
  };
}

/** キャンバスのピクセル座標 → 数学座標 */
export function fromPixel(
  v: View,
  widthPx: number,
  heightPx: number,
  px: number,
  py: number,
): { x: number; y: number } {
  return {
    x: v.xMin + (px / widthPx) * (v.xMax - v.xMin),
    y: v.yMax - (py / heightPx) * (v.yMax - v.yMin),
  };
}

/** 1・2・5 × 10^n のきりのよい目盛り間隔 */
export function niceStep(range: number, targetCount = 8): number {
  if (!(range > 0) || targetCount < 1) return 1;
  const raw = range / targetCount;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / pow;
  const nice = f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10;
  return nice * pow;
}

export interface Ticks {
  step: number;
  values: number[];
}

/** [min, max] に含まれる目盛り位置（浮動小数点の誤差を丸める） */
export function makeTicks(min: number, max: number, targetCount = 8): Ticks {
  const step = niceStep(max - min, targetCount);
  const values: number[] = [];
  const first = Math.ceil(min / step - 1e-9);
  const last = Math.floor(max / step + 1e-9);
  // 上限を設けて暴走を防ぐ
  for (let i = first; i <= last && values.length < 200; i++) {
    values.push(Number((i * step).toPrecision(12)));
  }
  return { step, values };
}

/** 目盛りラベルの文字列 */
export function formatTick(value: number, step: number): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e6 || abs < 1e-4) {
    return Number(value.toPrecision(6)).toExponential().replace('e+', 'e');
  }
  const decimals = Math.min(10, Math.max(0, -Math.floor(Math.log10(step))));
  return value.toFixed(decimals);
}

/** 式の先頭の「y =」「f(x) =」を取り除く */
export function normalizeSource(src: string): string {
  return src.replace(/^\s*(?:y|f\s*\(\s*x\s*\))\s*[=＝]/i, '');
}

export type CurveEntry =
  | { status: 'empty' }
  | { status: 'ok'; evaluate: (x: number) => number }
  | { status: 'error'; error: ParseErrorCode; position: number };

export function compileCurve(src: string, angle: AngleMode): CurveEntry {
  const body = normalizeSource(src);
  if (body.trim() === '') return { status: 'empty' };
  const r = compileExpression(body, { angle, variables: ['x'] });
  if (!r.ok) return { status: 'error', error: r.error, position: r.position };
  const { evaluate } = r;
  return { status: 'ok', evaluate: (x) => evaluate({ x }) };
}

export interface Point {
  x: number;
  y: number;
}

/**
 * 表示範囲の x を等間隔にサンプリングし、線を引ける区間（連続な点列）に分割する。
 * NaN / ±Infinity の点と、漸近線をまたぐような大きなジャンプで区間を切る。
 */
export function sampleCurve(
  evaluate: (x: number) => number,
  view: View,
  samples: number,
): Point[][] {
  const n = Math.max(2, Math.min(5000, Math.floor(samples)));
  const ySpan = view.yMax - view.yMin;
  const segments: Point[][] = [];
  let current: Point[] = [];
  const flush = () => {
    if (current.length >= 2) segments.push(current);
    current = [];
  };
  let prev: Point | null = null;
  for (let i = 0; i <= n; i++) {
    const x = view.xMin + ((view.xMax - view.xMin) * i) / n;
    let y: number;
    try {
      y = evaluate(x);
    } catch {
      y = NaN;
    }
    if (!Number.isFinite(y)) {
      flush();
      prev = null;
      continue;
    }
    if (prev && Math.abs(y - prev.y) > ySpan * 2 && prev.y * y < 0) {
      flush();
    }
    current.push({ x, y });
    prev = { x, y };
  }
  flush();
  return segments;
}

export function pngFilename(count: number): string {
  return `function-graph-${count}.png`;
}
