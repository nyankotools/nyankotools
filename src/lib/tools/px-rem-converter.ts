export const DEFAULT_BASE_FONT_SIZE = 16;

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)$/;

function roundTo(value: number, decimals = 5): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** 数値文字列をパースする。空文字・不正な形式はnull */
export function parseNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!NUMBER_PATTERN.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/** ベースフォントサイズ（px）をパースする。0以下・不正な形式はnull */
export function parseBaseFontSize(input: string): number | null {
  const value = parseNumber(input);
  return value !== null && value > 0 ? value : null;
}

export function pxToRem(px: number, baseFontSize: number): number {
  return roundTo(px / baseFontSize);
}

export function remToPx(rem: number, baseFontSize: number): number {
  return roundTo(rem * baseFontSize);
}

/** -0を0に正規化して数値を文字列化する */
export function formatNumber(value: number): string {
  return Object.is(value, -0) ? '0' : String(value);
}
