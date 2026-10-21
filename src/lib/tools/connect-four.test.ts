import { describe, it, expect } from 'vitest';
import {
  COLS,
  ROWS,
  LEVELS,
  applyDrop,
  chooseMove,
  dropRow,
  emptyBoard,
  findWinLine,
  isFull,
  legalColumns,
  newGame,
  opponent,
  playMove,
  winLineAt,
  type Board,
  type Disc,
  type GameState,
} from './connect-four';

function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s % max;
  };
}

/** 6行の文字列（. 空き / X 先手 / O 後手）から盤面を作る */
function parse(rows: string[]): Board {
  return rows
    .join('')
    .split('')
    .map((ch): Disc => (ch === 'X' ? 1 : ch === 'O' ? 2 : 0));
}

function play(cols: number[]): GameState {
  let state = newGame();
  for (const c of cols) state = playMove(state, c);
  return state;
}

describe('盤面の基本', () => {
  it('7列6行の空の盤面', () => {
    const b = emptyBoard();
    expect(b).toHaveLength(COLS * ROWS);
    expect(b.every((d) => d === 0)).toBe(true);
    expect(legalColumns(b)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('石は一番下に積み上がる', () => {
    let b = emptyBoard();
    expect(dropRow(b, 2)).toBe(5);
    b = applyDrop(b, 2, 1)!.board;
    expect(dropRow(b, 2)).toBe(4);
    const second = applyDrop(b, 2, 2)!;
    expect(second.index).toBe(4 * COLS + 2);
    expect(second.board[second.index]).toBe(2);
  });

  it('範囲外・小数の列は落とせない', () => {
    const b = emptyBoard();
    expect(dropRow(b, -1)).toBe(-1);
    expect(dropRow(b, 7)).toBe(-1);
    expect(dropRow(b, 1.5)).toBe(-1);
    expect(applyDrop(b, 9, 1)).toBeNull();
  });

  it('満杯の列は落とせない', () => {
    let b = emptyBoard();
    for (let i = 0; i < ROWS; i++)
      b = applyDrop(b, 0, i % 2 === 0 ? 1 : 2)!.board;
    expect(dropRow(b, 0)).toBe(-1);
    expect(applyDrop(b, 0, 1)).toBeNull();
    expect(legalColumns(b)).not.toContain(0);
  });

  it('opponent は手番を入れ替える', () => {
    expect(opponent(1)).toBe(2);
    expect(opponent(2)).toBe(1);
  });
});

describe('勝敗判定', () => {
  it('横4つ', () => {
    const s = play([0, 0, 1, 1, 2, 2, 3]);
    expect(s.over).toBe(true);
    expect(s.winner).toBe(1);
    expect(s.line).toEqual([35, 36, 37, 38]);
  });

  it('縦4つ', () => {
    const s = play([0, 1, 0, 1, 0, 1, 0]);
    expect(s.winner).toBe(1);
    expect(s.line).toEqual([14, 21, 28, 35]);
  });

  it('斜め（右上がり・右下がり）', () => {
    const up = parse([
      '.......',
      '.......',
      '...X...',
      '..X....',
      '.X.....',
      'X......',
    ]);
    expect(winLineAt(up, 2 * COLS + 3)).toEqual([17, 23, 29, 35]);
    const down = parse([
      'O......',
      '.O.....',
      '..O....',
      '...O...',
      '.......',
      '.......',
    ]);
    expect(findWinLine(down)).toEqual([0, 8, 16, 24]);
  });

  it('5つ以上並んでも全部を返す', () => {
    const b = parse([
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      'XXXXX..',
    ]);
    expect(winLineAt(b, 5 * COLS + 2)).toHaveLength(5);
  });

  it('3つでは勝ちにならない', () => {
    const b = parse([
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      'XXX....',
    ]);
    expect(findWinLine(b)).toBeNull();
    expect(winLineAt(b, 5 * COLS)).toBeNull();
  });

  it('端をまたいだ並びは勝ちにならない', () => {
    const b = parse([
      '.......',
      '.......',
      '.......',
      '.......',
      'XX....X',
      'XX....X',
    ]);
    expect(findWinLine(b)).toBeNull();
  });

  it('終局後・満杯列への手は state を変えない', () => {
    const won = play([0, 0, 1, 1, 2, 2, 3]);
    expect(playMove(won, 4)).toBe(won);
    const s = newGame();
    expect(playMove(s, 99)).toBe(s);
  });

  it('最後の1手で盤面が埋まると引き分け', () => {
    const rows = [
      'XXOOXXO',
      'OOXXOOX',
      'XXOOXXO',
      'OOXXOOX',
      'XXOOXXO',
      'OOXXOOX',
    ];
    const full = parse(rows);
    expect(isFull(full)).toBe(true);
    expect(findWinLine(full)).toBeNull();
    const almost = full.slice();
    almost[6] = 0;
    const state: GameState = {
      board: almost,
      turn: 2,
      lastMove: 0,
      winner: null,
      line: [],
      over: false,
    };
    const s = playMove(state, 6);
    expect(s.over).toBe(true);
    expect(s.winner).toBeNull();
    expect(s.line).toEqual([]);
  });

  it('手番が交互に入れ替わる', () => {
    const s = playMove(newGame(), 3);
    expect(s.turn).toBe(2);
    expect(s.lastMove).toBe(5 * COLS + 3);
    expect(s.board[s.lastMove]).toBe(1);
  });
});

describe('chooseMove', () => {
  it('落とせる列がなければ -1', () => {
    const b = parse(
      Array.from({ length: ROWS }, (_, r) =>
        r % 2 === 0 ? 'XOXOXOX' : 'OXOXOXO',
      ),
    );
    expect(chooseMove(b, 1, 'hard')).toBe(-1);
  });

  it('easy は合法な列からランダムに選ぶ', () => {
    const rnd = seeded(5);
    const b = parse([
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
    ]);
    for (let i = 0; i < 50; i++) {
      const c = chooseMove(b, 1, 'easy', rnd);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThan(COLS);
    }
  });

  it('満杯列は選ばない', () => {
    let b = emptyBoard();
    for (let i = 0; i < ROWS; i++)
      b = applyDrop(b, 3, i % 2 === 0 ? 1 : 2)!.board;
    for (const level of LEVELS) {
      for (let i = 0; i < 10; i++) {
        expect(chooseMove(b, 1, level, seeded(i))).not.toBe(3);
      }
    }
  });

  it('normal / hard は即勝ちできる手を選ぶ', () => {
    const b = parse([
      '.......',
      '.......',
      '.......',
      '.......',
      'OO.....',
      'XXX....',
    ]);
    for (const level of ['normal', 'hard'] as const) {
      expect(chooseMove(b, 1, level, seeded(1))).toBe(3);
    }
  });

  it('normal / hard は相手の即勝ちを止める', () => {
    const b = parse([
      '.......',
      '.......',
      '.......',
      '.......',
      'X.....X',
      'OOO..X.',
    ]);
    for (const level of ['normal', 'hard'] as const) {
      expect(chooseMove(b, 1, level, seeded(2))).toBe(3);
    }
  });

  it('同点の手を乱数で選ぶ（空盤面の hard は中央を選びやすい）', () => {
    const picked = new Set<number>();
    for (let i = 0; i < 20; i++) {
      picked.add(chooseMove(emptyBoard(), 1, 'normal', seeded(i + 1)));
    }
    for (const c of picked) expect(c).toBeGreaterThanOrEqual(0);
  });

  it('CPU同士の対局が必ず終局する', () => {
    for (const level of ['easy', 'normal'] as const) {
      let s = newGame();
      const rnd = seeded(7);
      let guard = 0;
      while (!s.over && guard++ < 50) {
        s = playMove(s, chooseMove(s.board, s.turn, level, rnd));
      }
      expect(s.over).toBe(true);
    }
  });
});
