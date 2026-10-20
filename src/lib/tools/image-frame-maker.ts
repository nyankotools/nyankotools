import {
  MAX_DIMENSION,
  MAX_PIXELS,
  isWithinLimit,
  outputFormat,
  type OutputFormat,
  type Size,
} from './image-padding';

export { MAX_DIMENSION, MAX_PIXELS, isWithinLimit, outputFormat };
export type { OutputFormat, Size };

export type FramePreset =
  'polaroid' | 'simple' | 'double' | 'frame' | 'rounded' | 'shadow';

export const FRAME_PRESETS: FramePreset[] = [
  'polaroid',
  'simple',
  'double',
  'frame',
  'rounded',
  'shadow',
];

/** 太さ（短辺に対する%）の範囲 */
export const MIN_THICKNESS = 1;
export const MAX_THICKNESS = 30;
/** 角丸（枠込みの出力の短辺に対する%）の範囲 */
export const MAX_RADIUS = 50;
/** プレビューcanvasの長辺の上限（実寸の描画は保存時だけ行う） */
export const PREVIEW_MAX_EDGE = 800;

export interface FrameOptions {
  preset: FramePreset;
  /** 枠の太さ。元画像の短辺に対する%（1〜30） */
  thickness: number;
  /** 角丸。出力の短辺に対する%（0〜50） */
  radius: number;
  /** 枠の色（#rrggbb） */
  color: string;
  /** 補助色（二重枠の線・額縁のマット・影の色）（#rrggbb） */
  accent: string;
  /** 影付きのときだけ、外側の背景を塗らず透明にする */
  transparentBackground: boolean;
}

/** プリセットを選んだときに設定へ入れる初期値 */
export const PRESET_DEFAULTS: Record<
  FramePreset,
  Pick<FrameOptions, 'thickness' | 'radius' | 'color' | 'accent'>
> = {
  polaroid: { thickness: 5, radius: 0, color: '#ffffff', accent: '#e5e7eb' },
  simple: { thickness: 4, radius: 0, color: '#000000', accent: '#ffffff' },
  double: { thickness: 6, radius: 0, color: '#ffffff', accent: '#1f2937' },
  frame: { thickness: 9, radius: 0, color: '#8b5a2b', accent: '#f5f0e6' },
  rounded: { thickness: 3, radius: 12, color: '#ffffff', accent: '#e5e7eb' },
  shadow: { thickness: 8, radius: 2, color: '#ffffff', accent: '#000000' },
};

export function clampNumber(
  value: number,
  min: number,
  max: number,
  fallback = min,
): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

/** #rgb / #rrggbb を [r,g,b] に。解釈できなければ null */
export function parseHex(value: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function toHex(rgb: [number, number, number]): string {
  return (
    '#' +
    rgb
      .map((n) =>
        Math.min(255, Math.max(0, Math.round(n)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/** 色を暗く（amount<0）または明るく（amount>0）する。amountは -1〜1。解釈できない色は黒として扱う */
export function shadeColor(value: string, amount: number): string {
  const rgb = parseHex(value) ?? [0, 0, 0];
  const a = clampNumber(amount, -1, 1, 0);
  const target = a < 0 ? 0 : 255;
  const k = Math.abs(a);
  return toHex(
    rgb.map((c) => c + (target - c) * k) as [number, number, number],
  );
}

export function hexToRgba(value: string, alpha: number): string {
  const [r, g, b] = parseHex(value) ?? [0, 0, 0];
  const a = clampNumber(alpha, 0, 1, 1);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** 太さ（%）を元画像の短辺からpxに換算する。最低1px */
export function thicknessPx(source: Size, percent: number): number {
  const p = clampNumber(percent, MIN_THICKNESS, MAX_THICKNESS, MIN_THICKNESS);
  return Math.max(
    1,
    Math.round((Math.min(source.width, source.height) * p) / 100),
  );
}

/** 塗りつぶす角丸矩形（描画順に並ぶ。後のものが上に重なる） */
export interface FillOp {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  color: string;
}

export interface ShadowSpec {
  blur: number;
  offsetY: number;
  /** rgba(...) 形式 */
  color: string;
}

export interface FramePlan {
  canvas: Size;
  image: { x: number; y: number; width: number; height: number };
  /** 元画像を切り抜く角丸の半径 */
  imageRadius: number;
  /** 枠の外側の角丸の半径 */
  outerRadius: number;
  /** 元画像より下に描く塗り */
  ops: FillOp[];
  shadow: ShadowSpec | null;
  /** 上・右・下・左に増えた幅 */
  border: { top: number; right: number; bottom: number; left: number };
}

/** 矩形を内側へ inset px 縮めた塗りを作る。小さすぎれば最小限の大きさにする */
function inset(
  base: { width: number; height: number },
  amount: number,
  outerRadius: number,
  color: string,
): FillOp {
  const a = Math.max(
    0,
    Math.min(amount, Math.floor((Math.min(base.width, base.height) - 1) / 2)),
  );
  return {
    x: a,
    y: a,
    width: base.width - a * 2,
    height: base.height - a * 2,
    radius: Math.max(0, outerRadius - amount),
    color,
  };
}

/**
 * 元画像の大きさと設定から、出力サイズ・画像の位置・塗りの重ね順を決める。
 * 描画は呼び出し側が ops → shadow → image の順に行う。
 */
export function planFrame(source: Size, options: FrameOptions): FramePlan {
  const t = thicknessPx(source, options.thickness);
  const color = options.color;
  const accent = options.accent;

  let border = { top: t, right: t, bottom: t, left: t };
  if (options.preset === 'polaroid') border.bottom = Math.round(t * 3.2);

  const canvas = {
    width: source.width + border.left + border.right,
    height: source.height + border.top + border.bottom,
  };
  const maxRadius = Math.floor(Math.min(canvas.width, canvas.height) / 2);
  const outerRadius = Math.min(
    maxRadius,
    Math.round(
      (Math.min(canvas.width, canvas.height) *
        clampNumber(options.radius, 0, MAX_RADIUS, 0)) /
        100,
    ),
  );
  const image = {
    x: border.left,
    y: border.top,
    width: source.width,
    height: source.height,
  };
  const ops: FillOp[] = [];
  let shadow: ShadowSpec | null = null;
  let imageRadius = Math.max(0, outerRadius - t);

  const full: FillOp = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    radius: outerRadius,
    color,
  };

  switch (options.preset) {
    case 'polaroid':
    case 'simple':
    case 'rounded':
      ops.push(full);
      break;
    case 'double': {
      const w = Math.max(1, Math.floor(t / 5));
      ops.push({ ...full, color: accent });
      ops.push(inset(canvas, w, outerRadius, color));
      ops.push(inset(canvas, Math.max(w, t - w), outerRadius, accent));
      break;
    }
    case 'frame': {
      const lip = Math.max(1, Math.round(t / 12));
      const band = t >= 3 ? Math.max(2, Math.round(t * 0.7)) : t;
      ops.push(full);
      ops.push(
        inset(
          canvas,
          Math.max(0, band - lip),
          outerRadius,
          shadeColor(color, -0.4),
        ),
      );
      ops.push(inset(canvas, band, outerRadius, accent));
      ops.push(
        inset(
          canvas,
          Math.max(band, t - lip),
          outerRadius,
          shadeColor(accent, -0.25),
        ),
      );
      break;
    }
    case 'shadow': {
      // 外側は背景。画像そのものの角を丸め、周囲の余白に影を落とす
      border = { top: t, right: t, bottom: t, left: t };
      imageRadius = Math.min(
        outerRadius,
        Math.floor(Math.min(source.width, source.height) / 2),
      );
      if (!options.transparentBackground) {
        ops.push({ ...full, radius: 0 });
      }
      shadow = {
        blur: Math.max(1, Math.round(t / 2)),
        offsetY: Math.round(t / 4),
        color: hexToRgba(accent, 0.45),
      };
      break;
    }
  }

  return {
    canvas,
    image,
    imageRadius,
    outerRadius: options.preset === 'shadow' ? 0 : outerRadius,
    ops,
    shadow,
    border,
  };
}

/** ダウンロード用のファイル名。拡張子を出力形式に置き換え、末尾に -framed を付ける */
export function framedFileName(
  sourceName: string | null,
  format: OutputFormat,
): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}-framed.${outputFormat(format).ext}`;
}
