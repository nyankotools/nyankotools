export type GradientType = 'linear' | 'radial';
export type RadialShape = 'circle' | 'ellipse';

export interface ColorStop {
  color: string;
  position: number;
}

export interface GradientOptions {
  type: GradientType;
  angle: number;
  shape: RadialShape;
  stops: ColorStop[];
}

export const MIN_STOPS = 2;
export const MAX_STOPS = 6;

export const DEFAULT_STOP_COLORS = [
  '#3b82f6',
  '#a855f7',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#ef4444',
];

export function clampPosition(position: number): number {
  return Math.min(100, Math.max(0, Math.round(position)));
}

export function clampAngle(angle: number): number {
  return ((Math.round(angle) % 360) + 360) % 360;
}

export function sortStops(stops: ColorStop[]): ColorStop[] {
  return [...stops].sort((a, b) => a.position - b.position);
}

/** 追加するカラーストップに割り当てる位置（%）。既存のカラーストップの間で最も広い隙間の中央を提案する */
export function suggestNewStopPosition(stops: ColorStop[]): number {
  if (stops.length === 0) return 50;
  const sorted = sortStops(stops);
  if (sorted.length === 1) {
    return sorted[0].position <= 50
      ? clampPosition(sorted[0].position + 50)
      : clampPosition(sorted[0].position - 50);
  }

  let bestGap = -1;
  let bestMid = 50;
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = sorted[i + 1].position - sorted[i].position;
    if (gap > bestGap) {
      bestGap = gap;
      bestMid = Math.round((sorted[i].position + sorted[i + 1].position) / 2);
    }
  }
  return clampPosition(bestMid);
}

function formatStop(stop: ColorStop): string {
  return `${stop.color} ${clampPosition(stop.position)}%`;
}

/** `linear-gradient(...)` / `radial-gradient(...)` の値部分（`background:`は含まない） */
export function buildGradientValue(options: GradientOptions): string {
  const stopsCss = sortStops(options.stops).map(formatStop).join(', ');
  if (options.type === 'linear') {
    return `linear-gradient(${clampAngle(options.angle)}deg, ${stopsCss})`;
  }
  return `radial-gradient(${options.shape}, ${stopsCss})`;
}

/** コピー用に整形した `background: ...;` 宣言全体 */
export function buildCssDeclaration(options: GradientOptions): string {
  return `background: ${buildGradientValue(options)};`;
}
