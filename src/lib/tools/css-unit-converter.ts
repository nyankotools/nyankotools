export const CSS_UNITS = [
  'px',
  'rem',
  'em',
  '%',
  'vw',
  'vh',
  'vmin',
  'vmax',
  'ch',
  'pt',
  'pc',
  'cm',
  'mm',
  'in',
] as const;

export type CssUnit = (typeof CSS_UNITS)[number];

export interface UnitContext {
  /** html要素のfont-size（px）。rem の基準 */
  rootFontSize: number;
  /** 親要素のfont-size（px）。em・% の基準 */
  parentFontSize: number;
  /** ビューポート幅（px）。vw の基準 */
  viewportWidth: number;
  /** ビューポート高さ（px）。vh の基準 */
  viewportHeight: number;
}

export const DEFAULT_CONTEXT: UnitContext = {
  rootFontSize: 16,
  parentFontSize: 16,
  viewportWidth: 1920,
  viewportHeight: 1080,
};

/** chは「0」の幅。フォントにより異なるため、親font-sizeの0.5倍で近似する */
export const CH_RATIO = 0.5;

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)$/;

export function parseNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!NUMBER_PATTERN.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/** 0より大きい数値のみ許可する（基準値用） */
export function parsePositive(input: string): number | null {
  const value = parseNumber(input);
  return value !== null && value > 0 ? value : null;
}

function roundTo(value: number, decimals = 5): number {
  const factor = 10 ** decimals;
  const rounded = Math.round(value * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/** 1単位あたりのpx数 */
function pxPerUnit(unit: CssUnit, ctx: UnitContext): number {
  switch (unit) {
    case 'px':
      return 1;
    case 'rem':
      return ctx.rootFontSize;
    case 'em':
      return ctx.parentFontSize;
    case '%':
      return ctx.parentFontSize / 100;
    case 'vw':
      return ctx.viewportWidth / 100;
    case 'vh':
      return ctx.viewportHeight / 100;
    case 'vmin':
      return Math.min(ctx.viewportWidth, ctx.viewportHeight) / 100;
    case 'vmax':
      return Math.max(ctx.viewportWidth, ctx.viewportHeight) / 100;
    case 'ch':
      return ctx.parentFontSize * CH_RATIO;
    case 'pt':
      return 96 / 72;
    case 'pc':
      return 16;
    case 'cm':
      return 96 / 2.54;
    case 'mm':
      return 96 / 25.4;
    case 'in':
      return 96;
  }
}

export function toPx(value: number, unit: CssUnit, ctx: UnitContext): number {
  return value * pxPerUnit(unit, ctx);
}

export function fromPx(px: number, unit: CssUnit, ctx: UnitContext): number {
  return px / pxPerUnit(unit, ctx);
}

export function convert(
  value: number,
  from: CssUnit,
  to: CssUnit,
  ctx: UnitContext,
): number {
  return roundTo(fromPx(toPx(value, from, ctx), to, ctx));
}

export interface UnitResult {
  unit: CssUnit;
  value: number;
}

/** 入力値を全単位に換算する（入力単位自身も含む） */
export function convertAll(
  value: number,
  from: CssUnit,
  ctx: UnitContext,
): UnitResult[] {
  const px = toPx(value, from, ctx);
  return CSS_UNITS.map((unit) => ({
    unit,
    value: roundTo(fromPx(px, unit, ctx)),
  }));
}

export function isCssUnit(value: string): value is CssUnit {
  return (CSS_UNITS as readonly string[]).includes(value);
}
