import { describe, it, expect } from 'vitest';
import {
  CENTER,
  LEVELS,
  SIZE,
  chooseMove,
  countStones,
  findFive,
  initialBoard,
  isFull,
  newGame,
  opponent,
  placeStone,
  playMove,
  type Board,
  type Player,
  type Stone,
} from './gomoku';

function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s % max;
  };
}

const idx = (row: number, col: number) => row * SIZE + col;

function boardWith(stones: [number, number, Player][]): Board {
  const board = new Array<Stone>(SIZE * SIZE).fill(0);
  for (const [r, c, p] of stones) board[idx(r, c)] = p;
  return board;
}

describe('初期盤面と置く操作', () => {
  it('15×15の空の盤面', () => {
    const board = initialBoard();
    expect(board).toHaveLength(225);
    expect(countStones(board)).toEqual({ black: 0, white: 0 });
    expect(CENTER).toBe(idx(7, 7));
  });

  it('石を置くと新しい盤面を返し、元の盤面は変わらない', () => {
    const board = initialBoard();
    const next = placeStone(board, 10, 1);
    expect(next?.[10]).toBe(1);
    expect(board[10]).toBe(0);
  });

  it('埋まっている場所・範囲外・小数には置けない', () => {
    const board = placeStone(initialBoard(), 10, 1) as Board;
    expect(placeStone(board, 10, 2)).toBeNull();
    expect(placeStone(board, -1, 1)).toBeNull();
    expect(placeStone(board, 225, 1)).toBeNull();
    expect(placeStone(board, 1.5, 1)).toBeNull();
  });

  it('opponent は手番を入れ替える', () => {
    expect(opponent(1)).toBe(2);
    expect(opponent(2)).toBe(1);
  });
});

describe('findFive', () => {
  it('横5つで勝ち', () => {
    const board = boardWith([0, 1, 2, 3, 4].map((c) => [3, c, 1]));
    expect(findFive(board, idx(3, 2))).toEqual(
      [0, 1, 2, 3, 4].map((c) => idx(3, c)),
    );
  });

  it('縦・右下がり・左下がりの斜めも判定する', () => {
    const v = boardWith([0, 1, 2, 3, 4].map((r) => [r, 5, 2]));
    expect(findFive(v, idx(4, 5))).toHaveLength(5);
    const d1 = boardWith([0, 1, 2, 3, 4].map((k) => [k, k, 1]));
    expect(findFive(d1, idx(0, 0))).toHaveLength(5);
    const d2 = boardWith([0, 1, 2, 3, 4].map((k) => [k, 10 - k, 1]));
    expect(findFive(d2, idx(2, 8))).toHaveLength(5);
  });

  it('4つでは勝ちにならない', () => {
    const board = boardWith([0, 1, 2, 3].map((c) => [3, c, 1]));
    expect(findFive(board, idx(3, 3))).toEqual([]);
  });

  it('相手の石で切れていれば勝ちにならない', () => {
    const board = boardWith([
      [3, 0, 1],
      [3, 1, 1],
      [3, 2, 2],
      [3, 3, 1],
      [3, 4, 1],
    ]);
    expect(findFive(board, idx(3, 4))).toEqual([]);
  });

  it('6つ以上（長連）も勝ち（禁じ手なし）', () => {
    const board = boardWith([0, 1, 2, 3, 4, 5].map((c) => [7, c, 1]));
    expect(findFive(board, idx(7, 2))).toHaveLength(6);
  });

  it('盤の端でも判定できる', () => {
    const board = boardWith([10, 11, 12, 13, 14].map((c) => [14, c, 2]));
    expect(findFive(board, idx(14, 14))).toHaveLength(5);
  });

  it('空きマス・範囲外は空配列', () => {
    expect(findFive(initialBoard(), 5)).toEqual([]);
    expect(findFive(initialBoard(), -3)).toEqual([]);
    expect(findFive(initialBoard(), 999)).toEqual([]);
  });

  it('2方向同時に5つ並ぶとどちらも返す', () => {
    const board = boardWith([
      [5, 3, 1],
      [5, 4, 1],
      [5, 6, 1],
      [5, 7, 1],
      [2, 5, 1],
      [3, 5, 1],
      [4, 5, 1],
      [6, 5, 1],
      [5, 5, 1],
    ]);
    expect(findFive(board, idx(5, 5))).toHaveLength(9);
  });
});

describe('playMove', () => {
  it('黒から始まり、交互に打つ', () => {
    let s = newGame();
    expect(s.turn).toBe(1);
    s = playMove(s, CENTER);
    expect(s.turn).toBe(2);
    expect(s.lastMove).toBe(CENTER);
    s = playMove(s, CENTER + 1);
    expect(s.turn).toBe(1);
  });

  it('埋まった場所では同じ state を返す', () => {
    const s = playMove(newGame(), CENTER);
    expect(playMove(s, CENTER)).toBe(s);
  });

  it('5つ並べると終局し、勝者と連を記録する', () => {
    let s = newGame();
    for (let i = 0; i < 4; i++) {
      s = playMove(s, idx(0, i));
      s = playMove(s, idx(5, i));
    }
    expect(s.over).toBe(false);
    s = playMove(s, idx(0, 4));
    expect(s.over).toBe(true);
    expect(s.winner).toBe(1);
    expect(s.winLine).toEqual([0, 1, 2, 3, 4]);
    expect(playMove(s, idx(9, 9))).toBe(s);
  });

  it('盤面が埋まったら引き分け', () => {
    // どの方向にも同色が3つ以上続かない配置
    const color = (r: number, c: number): Player =>
      (Math.floor(c / 2) + r) % 2 === 0 ? 1 : 2;
    const board = new Array<Stone>(SIZE * SIZE).fill(0);
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) board[idx(r, c)] = color(r, c);
    }
    const last = idx(14, 14);
    board[last] = 0;
    const state = { ...newGame(), board, turn: color(14, 14) };
    const after = playMove(state, last);
    expect(isFull(after.board)).toBe(true);
    expect(after.over).toBe(true);
    expect(after.winner).toBeNull();
    expect(after.winLine).toEqual([]);
  });
});

describe('chooseMove', () => {
  it('空の盤面では中央に打つ', () => {
    for (const level of LEVELS) {
      expect(chooseMove(initialBoard(), 1, level, seeded(1))).toBe(CENTER);
    }
  });

  it('満杯の盤面では -1', () => {
    const board = new Array<Stone>(SIZE * SIZE).fill(1);
    expect(chooseMove(board, 2, 'normal', seeded(1))).toBe(-1);
  });

  it('どの強さでも、4つ並んでいれば5つ目を打って勝つ', () => {
    const board = boardWith([
      [7, 3, 2],
      [7, 4, 2],
      [7, 5, 2],
      [7, 6, 2],
      [8, 3, 1],
      [8, 4, 1],
      [9, 9, 1],
    ]);
    for (const level of LEVELS) {
      const move = chooseMove(board, 2, level, seeded(3));
      expect([idx(7, 2), idx(7, 7)]).toContain(move);
    }
  });

  it('normal 以上は相手の4つを止める', () => {
    const board = boardWith([
      [7, 3, 1],
      [7, 4, 1],
      [7, 5, 1],
      [7, 6, 1],
      [7, 2, 2],
      [8, 8, 2],
    ]);
    for (const level of ['normal', 'hard', 'expert'] as const) {
      expect(chooseMove(board, 2, level, seeded(5))).toBe(idx(7, 7));
    }
  });

  it('hard 以上は開いた三を止める', () => {
    const board = boardWith([
      [7, 5, 1],
      [7, 6, 1],
      [7, 7, 1],
      [9, 9, 2],
    ]);
    for (const level of ['hard', 'expert'] as const) {
      const move = chooseMove(board, 2, level, seeded(7));
      expect([idx(7, 4), idx(7, 8)]).toContain(move);
    }
  });

  it('選ぶ手は必ず空きマス', () => {
    for (const level of LEVELS) {
      const rand = seeded(11);
      let s = newGame();
      for (let i = 0; i < 12 && !s.over; i++) {
        const move = chooseMove(s.board, s.turn, level, rand);
        expect(s.board[move]).toBe(0);
        s = playMove(s, move);
      }
    }
  });

  it('乱数を固定すると同じ手になる', () => {
    const board = boardWith([
      [7, 7, 1],
      [8, 8, 2],
    ]);
    expect(chooseMove(board, 1, 'hard', seeded(9))).toBe(
      chooseMove(board, 1, 'hard', seeded(9)),
    );
  });

  it('入力の盤面を変更しない', () => {
    const board = boardWith([
      [7, 7, 1],
      [8, 8, 2],
      [7, 8, 1],
    ]);
    const copy = board.slice();
    chooseMove(board, 2, 'expert', seeded(2));
    expect(board).toEqual(copy);
  });

  it('expert 同士の対局が終局まで進み、時間内に終わる', () => {
    const rand = seeded(21);
    let s = newGame();
    const start = Date.now();
    for (let i = 0; i < 40 && !s.over; i++) {
      s = playMove(s, chooseMove(s.board, s.turn, 'expert', rand));
    }
    expect(Date.now() - start).toBeLessThan(20_000);
  });

  it('強い側（expert）は easy に負けない', () => {
    let expertWins = 0;
    for (let g = 0; g < 3; g++) {
      const rand = seeded(100 + g);
      const expertSide: Player = g % 2 === 0 ? 1 : 2;
      let s = newGame();
      while (!s.over) {
        const level = s.turn === expertSide ? 'expert' : 'easy';
        s = playMove(s, chooseMove(s.board, s.turn, level, rand));
      }
      if (s.winner === expertSide) expertWins++;
    }
    expect(expertWins).toBe(3);
  });
});
