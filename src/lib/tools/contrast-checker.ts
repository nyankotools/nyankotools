import { hexToRgb, parseRgbString, type RgbColor } from './color-converter';

export interface ContrastEvaluation {
  ratio: number;
  normalAA: boolean;
  normalAAA: boolean;
  largeAA: boolean;
  largeAAA: boolean;
}

function srgbChannelToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** WCAG 2.x の相対輝度（0〜1） */
export function relativeLuminance(rgb: RgbColor): number {
  const r = srgbChannelToLinear(rgb.r);
  const g = srgbChannelToLinear(rgb.g);
  const b = srgbChannelToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x のコントラスト比（1〜21） */
export function contrastRatio(a: RgbColor, b: RgbColor): number {
  const lighter = Math.max(relativeLuminance(a), relativeLuminance(b));
  const darker = Math.min(relativeLuminance(a), relativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

/** コントラスト比とWCAG AA/AAA（通常テキスト・大きな文字）の適合判定 */
export function evaluateContrast(
  foreground: RgbColor,
  background: RgbColor,
): ContrastEvaluation {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio: Math.round(ratio * 100) / 100,
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
  };
}

/** "#3b82f6" "rgb(59, 130, 246)" "59, 130, 246" などを解釈する。不正な形式はnull */
export function parseColorInput(input: string): RgbColor | null {
  return hexToRgb(input) ?? parseRgbString(input);
}
