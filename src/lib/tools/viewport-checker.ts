export interface BreakpointDefinition {
  name: string;
  minWidth: number;
}

/** Tailwind CSS v4 のデフォルトブレークポイント（幅の広い順） */
export const TAILWIND_BREAKPOINTS: BreakpointDefinition[] = [
  { name: '2xl', minWidth: 1536 },
  { name: 'xl', minWidth: 1280 },
  { name: 'lg', minWidth: 1024 },
  { name: 'md', minWidth: 768 },
  { name: 'sm', minWidth: 640 },
];

/**
 * 幅に対応するブレークポイント名を返す。
 * どのブレークポイントにも達していない場合（デフォルトのbreakpointsでは640px未満）はnull。
 */
export function getActiveBreakpoint(
  width: number,
  breakpoints: BreakpointDefinition[] = TAILWIND_BREAKPOINTS,
): string | null {
  const match = breakpoints.find((bp) => width >= bp.minWidth);
  return match ? match.name : null;
}

export type Orientation = 'landscape' | 'portrait';

/** 幅・高さから画面の向きを判定する（幅 >= 高さ の場合は横向きとする） */
export function getOrientation(width: number, height: number): Orientation {
  return width >= height ? 'landscape' : 'portrait';
}
