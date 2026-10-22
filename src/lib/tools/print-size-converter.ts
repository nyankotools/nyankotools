export const PRINT_UNITS = ['mm', 'cm', 'in', 'pt', 'px'] as const;

export type PrintUnit = (typeof PRINT_UNITS)[number];

export const DEFAULT_DPI = 300;
export const MM_PER_INCH = 25.4;
export const PT_PER_INCH = 72;

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)$/;

export function parseNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!NUMBER_PATTERN.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/** 0より大きい数値のみ許可する（DPI用） */
export function parseDpi(input: string): number | null {
  const value = parseNumber(input);
  return value !== null && value > 0 ? value : null;
}

export function isPrintUnit(value: string): value is PrintUnit {
  return (PRINT_UNITS as readonly string[]).includes(value);
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  const rounded = Math.round(value * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/** 1単位あたりのインチ数 */
function inchPerUnit(unit: PrintUnit, dpi: number): number {
  switch (unit) {
    case 'mm':
      return 1 / MM_PER_INCH;
    case 'cm':
      return 10 / MM_PER_INCH;
    case 'in':
      return 1;
    case 'pt':
      return 1 / PT_PER_INCH;
    case 'px':
      return 1 / dpi;
  }
}

export function convert(
  value: number,
  from: PrintUnit,
  to: PrintUnit,
  dpi: number,
): number {
  const inches = value * inchPerUnit(from, dpi);
  return inches / inchPerUnit(to, dpi);
}

export interface PrintUnitResult {
  unit: PrintUnit;
  value: number;
}

/** 入力値を全単位に換算する（表示用に丸める。px は小数第2位、他は第4位） */
export function convertAll(
  value: number,
  from: PrintUnit,
  dpi: number,
): PrintUnitResult[] {
  return PRINT_UNITS.map((unit) => ({
    unit,
    value: roundTo(convert(value, from, unit, dpi), unit === 'px' ? 2 : 4),
  }));
}

export interface PaperSize {
  name: string;
  /** 短辺（mm） */
  widthMm: number;
  /** 長辺（mm） */
  heightMm: number;
}

export const A_SERIES: PaperSize[] = [
  { name: 'A0', widthMm: 841, heightMm: 1189 },
  { name: 'A1', widthMm: 594, heightMm: 841 },
  { name: 'A2', widthMm: 420, heightMm: 594 },
  { name: 'A3', widthMm: 297, heightMm: 420 },
  { name: 'A4', widthMm: 210, heightMm: 297 },
  { name: 'A5', widthMm: 148, heightMm: 210 },
  { name: 'A6', widthMm: 105, heightMm: 148 },
  { name: 'A7', widthMm: 74, heightMm: 105 },
  { name: 'A8', widthMm: 52, heightMm: 74 },
  { name: 'A9', widthMm: 37, heightMm: 52 },
  { name: 'A10', widthMm: 26, heightMm: 37 },
];

/** JIS B 判 */
export const B_SERIES: PaperSize[] = [
  { name: 'B0', widthMm: 1030, heightMm: 1456 },
  { name: 'B1', widthMm: 728, heightMm: 1030 },
  { name: 'B2', widthMm: 515, heightMm: 728 },
  { name: 'B3', widthMm: 364, heightMm: 515 },
  { name: 'B4', widthMm: 257, heightMm: 364 },
  { name: 'B5', widthMm: 182, heightMm: 257 },
  { name: 'B6', widthMm: 128, heightMm: 182 },
  { name: 'B7', widthMm: 91, heightMm: 128 },
  { name: 'B8', widthMm: 64, heightMm: 91 },
  { name: 'B9', widthMm: 45, heightMm: 64 },
  { name: 'B10', widthMm: 32, heightMm: 45 },
];

export interface PaperPixels {
  widthPx: number;
  heightPx: number;
  widthPt: number;
  heightPt: number;
}

/** 用紙サイズを指定DPIでのピクセル数・ptに換算する（pxは整数に丸める） */
export function paperToPixels(paper: PaperSize, dpi: number): PaperPixels {
  return {
    widthPx: Math.round(convert(paper.widthMm, 'mm', 'px', dpi)),
    heightPx: Math.round(convert(paper.heightMm, 'mm', 'px', dpi)),
    widthPt: roundTo(convert(paper.widthMm, 'mm', 'pt', dpi), 1),
    heightPt: roundTo(convert(paper.heightMm, 'mm', 'pt', dpi), 1),
  };
}
