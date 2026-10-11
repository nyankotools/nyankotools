import {
  maxTile,
  move,
  newGame,
  planMove,
  type Direction,
} from '../../src/lib/tools/game-2048';

// 2048 達成の表示を E2E で確かめるため、固定乱数のもとで 2048 に到達する手順を求める。
// ページ側の乱数（crypto.getRandomValues）を同じ線形合同法に差し替えるので、
// ここで求めた手順をそのまま押せば、ページでも同じ盤面をたどる。

/** 盤面の左上を起点に蛇行して大きいタイルを並べるための重み */
const WEIGHTS = [15, 14, 13, 12, 8, 9, 10, 11, 7, 6, 5, 4, 0, 1, 2, 3].map(
  (w) => 4 ** (w / 3),
);
const DIRECTIONS: Direction[] = ['left', 'up', 'right', 'down'];

const same = (a: readonly number[], b: readonly number[]) =>
  a.every((v, i) => v === b[i]);

function evaluate(board: readonly number[]): number {
  let score = 0;
  let empties = 0;
  board.forEach((v, i) => {
    score += v * WEIGHTS[i];
    if (v === 0) empties++;
  });
  return score + empties * 3000;
}

/** 空きマスへ 2 が出る全パターンの平均を取りながら、depth 手先まで読んだ評価値 */
function lookahead(board: readonly number[], depth: number): number {
  let top = -Infinity;
  for (const d of DIRECTIONS) {
    const plan = planMove(board, 4, d);
    if (same(plan.board, board)) continue;
    let value: number;
    if (depth === 0) {
      value = evaluate(plan.board);
    } else {
      value = averageOverSpawns(plan.board, depth - 1);
    }
    if (value > top) top = value;
  }
  return top === -Infinity ? -1e12 : top;
}

function averageOverSpawns(board: readonly number[], depth: number): number {
  const empties: number[] = [];
  board.forEach((v, i) => {
    if (v === 0) empties.push(i);
  });
  let sum = 0;
  for (const e of empties) {
    const next = [...board];
    next[e] = 2;
    sum += lookahead(next, depth);
  }
  return sum / empties.length;
}

function chooseDirection(board: readonly number[]): Direction | null {
  let best: Direction | null = null;
  let bestScore = -Infinity;
  for (const d of DIRECTIONS) {
    const plan = planMove(board, 4, d);
    if (same(plan.board, board)) continue;
    const score = averageOverSpawns(plan.board, 1);
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return best;
}

/**
 * 線形合同法の初期値 seed のもとで、4×4 の盤面が最初に 2048 を作るまでの向きの列を返す。
 * ページは読み込み時に newGame を2回呼ぶ（初期化と startGame）ので、同じ回数だけ進める。
 */
export function solveTo2048(seed: number): Direction[] {
  let s = seed;
  const randomInt = (max: number) => {
    const limit = Math.floor(0x100000000 / max) * max;
    for (;;) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      if (s < limit) return s % max;
    }
  };
  newGame(4, randomInt);
  let state = newGame(4, randomInt);
  const moves: Direction[] = [];
  while (moves.length < 4000) {
    const d = chooseDirection(state.board);
    if (!d) break;
    state = move(state, d, randomInt);
    moves.push(d);
    if (maxTile(state.board) >= 2048) return moves;
  }
  throw new Error(`seed ${seed} では 2048 に到達しなかった`);
}
