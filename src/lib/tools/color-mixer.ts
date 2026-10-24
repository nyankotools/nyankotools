import {
  hexToRgb,
  normalizeHex,
  rgbToHex,
  type RgbColor,
} from './color-converter';
import { oklchToRgb, rgbToOklch } from './color-space-converter';

export const mixSpaces = ['rgb', 'oklab'] as const;
export type MixSpace = (typeof mixSpaces)[number];

export const MIN_STEPS = 2;
export const MAX_STEPS = 21;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function toOklab(rgb: RgbColor): { l: number; a: number; b: number } {
  const { l, c, h } = rgbToOklch(rgb);
  const rad = (h * Math.PI) / 180;
  return { l, a: c * Math.cos(rad), b: c * Math.sin(rad) };
}

function mixRgb(from: RgbColor, to: RgbColor, t: number): RgbColor {
  return {
    r: Math.round(lerp(from.r, to.r, t)),
    g: Math.round(lerp(from.g, to.g, t)),
    b: Math.round(lerp(from.b, to.b, t)),
  };
}

function mixOklab(from: RgbColor, to: RgbColor, t: number): RgbColor {
  const p = toOklab(from);
  const q = toOklab(to);
  const a = lerp(p.a, q.a, t);
  const b = lerp(p.b, q.b, t);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return oklchToRgb({ l: lerp(p.l, q.l, t), c: Math.hypot(a, b), h }).rgb;
}

/**
 * 2色を混ぜる。ratio は2色目の割合（0〜1。範囲外は丸める）。
 * 不正なHEXは null。結果は小文字の #rrggbb
 */
export function mixColors(
  hexA: string,
  hexB: string,
  ratio: number,
  space: MixSpace = 'rgb',
): string | null {
  const a = normalizeHex(hexA);
  const b = normalizeHex(hexB);
  if (!a || !b || !Number.isFinite(ratio)) return null;
  const from = hexToRgb(a)!;
  const to = hexToRgb(b)!;
  const t = clamp(ratio, 0, 1);
  const mixed = space === 'oklab' ? mixOklab(from, to, t) : mixRgb(from, to, t);
  return rgbToHex(mixed);
}

/**
 * 2色の間を等間隔に分けた steps 色（両端を含む）を返す。
 * steps は 2〜21 の整数に丸める。不正なHEXは null
 */
export function generateSteps(
  hexA: string,
  hexB: string,
  steps: number,
  space: MixSpace = 'rgb',
): string[] | null {
  if (!Number.isFinite(steps)) return null;
  const count = clamp(Math.round(steps), MIN_STEPS, MAX_STEPS);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const mixed = mixColors(hexA, hexB, i / (count - 1), space);
    if (mixed === null) return null;
    result.push(mixed);
  }
  return result;
}

/** CSSカスタムプロパティ形式で書き出す */
export function toCssVariables(colors: string[], prefix = 'color'): string {
  const lines = colors.map((c, i) => `  --${prefix}-${i + 1}: ${c};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

/** カンマ区切りのHEX一覧 */
export function toHexList(colors: string[]): string {
  return colors.join(', ');
}
