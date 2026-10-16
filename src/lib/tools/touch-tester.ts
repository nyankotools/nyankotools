/** 画面を縦横に分割するグリッドの列数・行数（タッチの届いていない範囲の確認用） */
export const GRID_COLS = 8;
export const GRID_ROWS = 12;

export interface PointerInfo {
  id: number;
  x: number;
  y: number;
  pointerType: string;
  pressure: number;
}

export interface TouchState {
  /** 現在押下中のポインター（id → 最新の情報） */
  active: Map<number, PointerInfo>;
  /** 同時に押下された最大数 */
  maxSimultaneous: number;
  /** これまでの押下回数 */
  totalTouches: number;
  /** 触れたグリッドセルの番号 */
  touchedCells: Set<number>;
}

export function createState(): TouchState {
  return {
    active: new Map(),
    maxSimultaneous: 0,
    totalTouches: 0,
    touchedCells: new Set(),
  };
}

/** 座標 (x, y) が属するグリッドセル番号。領域外は範囲内に丸める。 */
export function cellIndex(
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  if (width <= 0 || height <= 0) return 0;
  const col = Math.min(
    GRID_COLS - 1,
    Math.max(0, Math.floor((x / width) * GRID_COLS)),
  );
  const row = Math.min(
    GRID_ROWS - 1,
    Math.max(0, Math.floor((y / height) * GRID_ROWS)),
  );
  return row * GRID_COLS + col;
}

export function pointerDown(
  state: TouchState,
  info: PointerInfo,
  width: number,
  height: number,
): void {
  state.active.set(info.id, info);
  state.totalTouches++;
  state.maxSimultaneous = Math.max(state.maxSimultaneous, state.active.size);
  state.touchedCells.add(cellIndex(info.x, info.y, width, height));
}

/** 押下中でないポインターの移動は無視する（マウスのホバー等）。 */
export function pointerMove(
  state: TouchState,
  info: PointerInfo,
  width: number,
  height: number,
): void {
  if (!state.active.has(info.id)) return;
  state.active.set(info.id, info);
  state.touchedCells.add(cellIndex(info.x, info.y, width, height));
}

export function pointerUp(state: TouchState, id: number): void {
  state.active.delete(id);
}

/** 触れたセルの割合（0〜100、小数第1位まで）。 */
export function coveragePercent(state: TouchState): number {
  const total = GRID_COLS * GRID_ROWS;
  return Math.round((state.touchedCells.size / total) * 1000) / 10;
}
