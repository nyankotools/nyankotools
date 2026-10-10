export type LayoutMode = 'flex' | 'grid';

export const FLEX_DIRECTIONS = [
  'row',
  'row-reverse',
  'column',
  'column-reverse',
] as const;
export const FLEX_WRAPS = ['nowrap', 'wrap', 'wrap-reverse'] as const;
export const JUSTIFY_CONTENT_VALUES = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
] as const;
export const ALIGN_ITEMS_VALUES = [
  'stretch',
  'flex-start',
  'center',
  'flex-end',
  'baseline',
] as const;
export const ALIGN_CONTENT_VALUES = [
  'stretch',
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
] as const;
export const GRID_ALIGN_VALUES = ['stretch', 'start', 'center', 'end'] as const;

export type FlexDirection = (typeof FLEX_DIRECTIONS)[number];
export type FlexWrap = (typeof FLEX_WRAPS)[number];
export type JustifyContent = (typeof JUSTIFY_CONTENT_VALUES)[number];
export type AlignItems = (typeof ALIGN_ITEMS_VALUES)[number];
export type AlignContent = (typeof ALIGN_CONTENT_VALUES)[number];
export type GridAlign = (typeof GRID_ALIGN_VALUES)[number];

export interface FlexConfig {
  direction: FlexDirection;
  wrap: FlexWrap;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  alignContent: AlignContent;
  gap: number;
}

export interface GridConfig {
  columns: number;
  /** 0 は行数を指定しない（暗黙の行・auto） */
  rows: number;
  columnGap: number;
  rowGap: number;
  justifyItems: GridAlign;
  alignItems: GridAlign;
}

export interface Declaration {
  property: string;
  value: string;
}

export const MIN_ITEMS = 1;
export const MAX_ITEMS = 24;
export const MAX_GAP = 100;
export const MAX_TRACKS = 12;

export const DEFAULT_FLEX: FlexConfig = {
  direction: 'row',
  wrap: 'nowrap',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  alignContent: 'stretch',
  gap: 8,
};

export const DEFAULT_GRID: GridConfig = {
  columns: 3,
  rows: 0,
  columnGap: 8,
  rowGap: 8,
  justifyItems: 'stretch',
  alignItems: 'stretch',
};

/** 数値を整数に丸めて範囲内に収める。数値でない入力は min を返す */
export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function buildFlexDeclarations(config: FlexConfig): Declaration[] {
  const decls: Declaration[] = [
    { property: 'display', value: 'flex' },
    { property: 'flex-direction', value: config.direction },
    { property: 'flex-wrap', value: config.wrap },
    { property: 'justify-content', value: config.justifyContent },
    { property: 'align-items', value: config.alignItems },
  ];
  // align-content は折り返しがない（1行の）場合は効果がないため出力しない
  if (config.wrap !== 'nowrap') {
    decls.push({ property: 'align-content', value: config.alignContent });
  }
  const gap = clampInt(config.gap, 0, MAX_GAP);
  if (gap > 0) decls.push({ property: 'gap', value: `${gap}px` });
  return decls;
}

export function buildGridDeclarations(config: GridConfig): Declaration[] {
  const columns = clampInt(config.columns, 1, MAX_TRACKS);
  const rows = clampInt(config.rows, 0, MAX_TRACKS);
  const decls: Declaration[] = [
    { property: 'display', value: 'grid' },
    { property: 'grid-template-columns', value: `repeat(${columns}, 1fr)` },
  ];
  if (rows > 0) {
    decls.push({
      property: 'grid-template-rows',
      value: `repeat(${rows}, 1fr)`,
    });
  }
  const rowGap = clampInt(config.rowGap, 0, MAX_GAP);
  const columnGap = clampInt(config.columnGap, 0, MAX_GAP);
  if (rowGap === columnGap) {
    if (rowGap > 0) decls.push({ property: 'gap', value: `${rowGap}px` });
  } else {
    decls.push({ property: 'gap', value: `${rowGap}px ${columnGap}px` });
  }
  decls.push({ property: 'justify-items', value: config.justifyItems });
  decls.push({ property: 'align-items', value: config.alignItems });
  return decls;
}

/** セレクタ付きのCSSブロック文字列を組み立てる */
export function buildCss(
  declarations: Declaration[],
  selector = '.container',
): string {
  const body = declarations
    .map((d) => `  ${d.property}: ${d.value};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}
