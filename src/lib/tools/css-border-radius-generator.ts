export interface BorderRadiusCorners {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export type BorderRadiusUnit = 'px' | '%';

export const MIN_RADIUS = 0;

export const MAX_RADIUS: Record<BorderRadiusUnit, number> = {
  px: 500,
  '%': 50,
};

export function clampRadius(value: number, unit: BorderRadiusUnit): number {
  const max = MAX_RADIUS[unit];
  return Math.min(max, Math.max(MIN_RADIUS, Math.round(value)));
}

/** `border-radius:`は含まない値部分。4隅がすべて同じ場合は単一値に短縮する */
export function buildBorderRadiusValue(
  corners: BorderRadiusCorners,
  unit: BorderRadiusUnit,
): string {
  const [topLeft, topRight, bottomRight, bottomLeft] = [
    corners.topLeft,
    corners.topRight,
    corners.bottomRight,
    corners.bottomLeft,
  ].map((value) => clampRadius(value, unit));
  if (
    topLeft === topRight &&
    topRight === bottomRight &&
    bottomRight === bottomLeft
  ) {
    return `${topLeft}${unit}`;
  }
  return [topLeft, topRight, bottomRight, bottomLeft]
    .map((value) => `${value}${unit}`)
    .join(' ');
}

/** コピー用に整形した `border-radius: ...;` 宣言全体 */
export function buildCssDeclaration(
  corners: BorderRadiusCorners,
  unit: BorderRadiusUnit,
): string {
  return `border-radius: ${buildBorderRadiusValue(corners, unit)};`;
}
