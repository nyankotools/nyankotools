/** ペグソリティアの盤面ロジック（DOM・文言に依存しない純関数） */

export type BoardType = 'english' | 'european';

export const BOARD_TYPES: readonly BoardType[] = ['english', 'european'];

/** 盤面は 7x7 の格子の中に穴を置く */
export const GRID = 7;

export const CENTER = 3 * GRID + 3;

export interface Move {
  from: number;
  over: number;
  to: number;
}

export interface GameState {
  type: BoardType;
  /** 長さ GRID*GRID。穴がある位置のうち駒が載っているものだけ true */
  pegs: boolean[];
  history: Move[];
}

export type Outcome = 'playing' | 'perfect' | 'solved' | 'stuck';

export function toIndex(row: number, col: number): number {
  return row * GRID + col;
}

export function toRowCol(index: number): { row: number; col: number } {
  return { row: Math.floor(index / GRID), col: index % GRID };
}

/** その盤面に穴があるか */
export function isHole(type: BoardType, row: number, col: number): boolean {
  if (row < 0 || row >= GRID || col < 0 || col >= GRID) return false;
  // 各行・各列の端からの距離。角のくぼみ判定に使う
  const dr = Math.min(row, GRID - 1 - row);
  const dc = Math.min(col, GRID - 1 - col);
  if (type === 'english') return dr >= 2 || dc >= 2;
  // european: 角の1マスだけ欠ける
  return dr + dc >= 2;
}

export function holeIndices(type: BoardType): number[] {
  const out: number[] = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (isHole(type, r, c)) out.push(toIndex(r, c));
    }
  }
  return out;
}

export function holeCount(type: BoardType): number {
  return holeIndices(type).length;
}

export function isHoleIndex(type: BoardType, index: number): boolean {
  if (!Number.isInteger(index) || index < 0 || index >= GRID * GRID)
    return false;
  const { row, col } = toRowCol(index);
  return isHole(type, row, col);
}

/** 初期配置: 中央だけ空で、ほかの穴はすべて駒あり */
export function newGame(type: BoardType): GameState {
  const pegs = new Array<boolean>(GRID * GRID).fill(false);
  for (const i of holeIndices(type)) pegs[i] = i !== CENTER;
  return { type, pegs, history: [] };
}

const DIRECTIONS: readonly [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/** 指定した駒の合法手 */
export function movesFrom(
  type: BoardType,
  pegs: readonly boolean[],
  from: number,
): Move[] {
  if (!isHoleIndex(type, from) || !pegs[from]) return [];
  const { row, col } = toRowCol(from);
  const moves: Move[] = [];
  for (const [dr, dc] of DIRECTIONS) {
    const or = row + dr;
    const oc = col + dc;
    const tr = row + dr * 2;
    const tc = col + dc * 2;
    if (!isHole(type, or, oc) || !isHole(type, tr, tc)) continue;
    const over = toIndex(or, oc);
    const to = toIndex(tr, tc);
    if (pegs[over] && !pegs[to]) moves.push({ from, over, to });
  }
  return moves;
}

/** 盤面全体の合法手 */
export function legalMoves(state: GameState): Move[] {
  const out: Move[] = [];
  for (const i of holeIndices(state.type)) {
    out.push(...movesFrom(state.type, state.pegs, i));
  }
  return out;
}

export function findMove(
  state: GameState,
  from: number,
  to: number,
): Move | null {
  return (
    movesFrom(state.type, state.pegs, from).find((m) => m.to === to) ?? null
  );
}

/** ジャンプを適用する。不正な手なら同じ state を返す */
export function applyMove(state: GameState, move: Move): GameState {
  const legal = movesFrom(state.type, state.pegs, move.from).some(
    (m) => m.over === move.over && m.to === move.to,
  );
  if (!legal) return state;
  const pegs = state.pegs.slice();
  pegs[move.from] = false;
  pegs[move.over] = false;
  pegs[move.to] = true;
  return {
    type: state.type,
    pegs,
    history: [...state.history, { ...move }],
  };
}

/** 直前の手を戻す。履歴がなければ同じ state を返す */
export function undo(state: GameState): GameState {
  const last = state.history[state.history.length - 1];
  if (!last) return state;
  const pegs = state.pegs.slice();
  pegs[last.from] = true;
  pegs[last.over] = true;
  pegs[last.to] = false;
  return {
    type: state.type,
    pegs,
    history: state.history.slice(0, -1),
  };
}

export function pegCount(state: GameState): number {
  return state.pegs.filter(Boolean).length;
}

/** 動かせる手が1つもない */
export function isStuck(state: GameState): boolean {
  return legalMoves(state).length === 0;
}

/**
 * 状況の評価。
 * - perfect: 残り1個。英国式は、それが中央にある場合だけ（欧州式は中央スタート→中央1個の解が存在しないため、1個残れば常に perfect）
 * - solved: 残り1個（英国式で中央以外）
 * - stuck: 2個以上残っていて手がない
 */
export function evaluate(state: GameState): Outcome {
  const count = pegCount(state);
  if (count === 1) {
    return state.type === 'european' || state.pegs[CENTER]
      ? 'perfect'
      : 'solved';
  }
  return isStuck(state) ? 'stuck' : 'playing';
}

export type Rank = 'genius' | 'good' | 'average' | 'beginner';

/** 残数による段階評価（伝統的な呼び名に沿う） */
export function rankFor(remaining: number): Rank {
  if (remaining <= 1) return 'genius';
  if (remaining === 2) return 'good';
  if (remaining <= 4) return 'average';
  return 'beginner';
}
