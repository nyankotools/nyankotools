export const MIN_DISCS = 3;
export const MAX_DISCS = 8;
export const PEG_COUNT = 3;

/** 各杭の円盤（大きさ。下から上の順。数字が大きいほど大きい円盤） */
export interface HanoiState {
  discs: number;
  pegs: number[][];
  moves: number;
}

export interface HanoiMove {
  from: number;
  to: number;
}

export function clampDiscs(value: number): number {
  if (!Number.isFinite(value)) return MIN_DISCS;
  return Math.min(MAX_DISCS, Math.max(MIN_DISCS, Math.round(value)));
}

export function createGame(discs: number): HanoiState {
  const n = clampDiscs(discs);
  const first = Array.from({ length: n }, (_, i) => n - i);
  return { discs: n, pegs: [first, [], []], moves: 0 };
}

/** 最短手数 2^n - 1 */
export function minMoves(discs: number): number {
  return 2 ** clampDiscs(discs) - 1;
}

function validPeg(index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < PEG_COUNT;
}

/** from の一番上の円盤を to に移せるか（空でない・自分自身でない・小さい円盤の上にのみ置ける） */
export function canMove(state: HanoiState, from: number, to: number): boolean {
  if (!validPeg(from) || !validPeg(to) || from === to) return false;
  const src = state.pegs[from]!;
  if (src.length === 0) return false;
  const dst = state.pegs[to]!;
  const top = dst[dst.length - 1];
  return top === undefined || src[src.length - 1]! < top;
}

/** 合法なら新しい状態、違法なら null を返す（元の状態は変更しない） */
export function move(
  state: HanoiState,
  from: number,
  to: number,
): HanoiState | null {
  if (!canMove(state, from, to)) return null;
  const pegs = state.pegs.map((p) => p.slice());
  pegs[to]!.push(pegs[from]!.pop()!);
  return { discs: state.discs, pegs, moves: state.moves + 1 };
}

/** 全円盤が最後の杭（右端）に移ったか */
export function isSolved(state: HanoiState): boolean {
  return state.pegs[PEG_COUNT - 1]!.length === state.discs;
}

/** 最適解の手順（再帰）。from から to へ via を使って discs 枚を移す */
export function solve(
  discs: number,
  from = 0,
  to = PEG_COUNT - 1,
  via = 1,
): HanoiMove[] {
  const result: HanoiMove[] = [];
  const rec = (n: number, a: number, b: number, c: number) => {
    if (n === 0) return;
    rec(n - 1, a, c, b);
    result.push({ from: a, to: b });
    rec(n - 1, c, b, a);
  };
  rec(clampDiscs(discs), from, to, via);
  return result;
}

/** 最短手数に対する余分な手数。0 なら最短 */
export function extraMoves(state: HanoiState): number {
  return Math.max(0, state.moves - minMoves(state.discs));
}

export function isOptimal(state: HanoiState): boolean {
  return isSolved(state) && state.moves === minMoves(state.discs);
}

/** 保存値を 手数 の正の整数として解釈する。不正なら 0 */
export function parseBest(raw: string | null): number {
  if (raw === null) return 0;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : 0;
}

/** best が 0（記録なし）または今回の手数が少なければ更新 */
export function isNewBest(moves: number, best: number): boolean {
  return moves > 0 && (best === 0 || moves < best);
}
