import { describe, it, expect } from 'vitest';
import {
  LEVELS,
  applyMove,
  chooseMove,
  countDiscs,
  flipsFor,
  initialBoard,
  legalMoves,
  newGame,
  opponent,
  playMove,
  winnerOf,
  type Board,
  type Disc,
  type GameState,
} from './reversi';

function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s % max;
  };
}

/** 8行の文字列（. 空き / B 黒 / W 白）から盤面を作る */
function parse(rows: string[]): Board {
  return rows
    .join('')
    .split('')
    .map((c) => (c === 'B' ? 1 : c === 'W' ? 2 : 0) as Disc);
}

const idx = (row: number, col: number) => row * 8 + col;

describe('初期盤面', () => {
  it('中央に黒2・白2が斜めに並ぶ', () => {
    const board = initialBoard();
    expect(countDiscs(board)).toEqual({ black: 2, white: 2 });
    expect(board[idx(3, 3)]).toBe(2);
    expect(board[idx(3, 4)]).toBe(1);
    expect(board[idx(4, 3)]).toBe(1);
    expect(board[idx(4, 4)]).toBe(2);
  });

  it('黒の最初の合法手は4つ', () => {
    expect(legalMoves(initialBoard(), 1).sort((a, b) => a - b)).toEqual([
      idx(2, 3),
      idx(3, 2),
      idx(4, 5),
      idx(5, 4),
    ]);
  });

  it('白の最初の合法手も4つ', () => {
    expect(legalMoves(initialBoard(), 2)).toHaveLength(4);
  });
});

describe('flipsFor / applyMove', () => {
  it('挟めない場所・埋まっている場所・範囲外は空', () => {
    const board = initialBoard();
    expect(flipsFor(board, idx(0, 0), 1)).toEqual([]);
    expect(flipsFor(board, idx(3, 3), 1)).toEqual([]);
    expect(flipsFor(board, -1, 1)).toEqual([]);
    expect(flipsFor(board, 64, 1)).toEqual([]);
    expect(flipsFor(board, 1.5, 1)).toEqual([]);
  });

  it('1方向を挟んで裏返す', () => {
    const board = initialBoard();
    expect(flipsFor(board, idx(2, 3), 1)).toEqual([idx(3, 3)]);
    const next = applyMove(board, idx(2, 3), 1) as Board;
    expect(next[idx(2, 3)]).toBe(1);
    expect(next[idx(3, 3)]).toBe(1);
    expect(countDiscs(next)).toEqual({ black: 4, white: 1 });
  });

  it('元の盤面は変更されない', () => {
    const board = initialBoard();
    const copy = [...board];
    applyMove(board, idx(2, 3), 1);
    expect([...board]).toEqual(copy);
  });

  it('置けない手は null', () => {
    expect(applyMove(initialBoard(), idx(0, 0), 1)).toBeNull();
  });

  it('複数方向をまとめて裏返す', () => {
    const board = parse([
      '........',
      '........',
      '..B.B...',
      '...WW...',
      '..BW....',
      '........',
      '........',
      '........',
    ]);
    expect(flipsFor(board, idx(4, 4), 1).sort((x, y) => x - y)).toEqual([
      idx(3, 3),
      idx(3, 4),
      idx(4, 3),
    ]);
  });

  it('盤面の端で次の行へ折り返して挟まない', () => {
    const board = parse([
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      'WB......',
      '........',
    ]);
    expect(flipsFor(board, idx(5, 7), 1)).toEqual([]);
    expect(flipsFor(board, idx(5, 7), 2)).toEqual([]);
  });

  it('挟む相手の石が連続していても全部裏返る', () => {
    const board = parse(['BWWWW...', ...Array<string>(7).fill('........')]);
    expect(flipsFor(board, idx(0, 5), 1)).toEqual([
      idx(0, 4),
      idx(0, 3),
      idx(0, 2),
      idx(0, 1),
    ]);
  });
});

describe('playMove / パスと終局', () => {
  it('合法手を打つと手番が交代し、最後の手と裏返しが記録される', () => {
    const state = playMove(newGame(), idx(2, 3));
    expect(state.turn).toBe(2);
    expect(state.lastMove).toBe(idx(2, 3));
    expect(state.flipped).toEqual([idx(3, 3)]);
    expect(state.passed).toBeNull();
    expect(state.over).toBe(false);
  });

  it('置けない手は同じ state を返す', () => {
    const state = newGame();
    expect(playMove(state, idx(0, 0))).toBe(state);
  });

  it('相手が打てないときは手番が戻り passed が入る', () => {
    const board = parse([
      'W.......',
      '........',
      '........',
      '........',
      '....WBBB',
      '........',
      '........',
      '..WB....',
    ]);
    const state: GameState = {
      board,
      turn: 1,
      lastMove: -1,
      flipped: [],
      passed: null,
      over: false,
    };
    // 黒が (7,1) に置くと白は打てる場所がなく、黒はまだ (4,3) に打てる
    const next = playMove(state, idx(7, 1));
    expect(next.board[idx(7, 2)]).toBe(1);
    expect(next.over).toBe(false);
    expect(next.passed).toBe(2);
    expect(next.turn).toBe(1);
  });

  it('双方打てなくなったら終局', () => {
    const board = parse([
      'WB......',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
    ]);
    const full: GameState = {
      board,
      turn: 2,
      lastMove: -1,
      flipped: [],
      passed: null,
      over: false,
    };
    const next = playMove(full, idx(0, 2));
    expect(next.board[idx(0, 1)]).toBe(2);
    expect(next.over).toBe(true);
    expect(winnerOf(next.board)).toBe('white');
  });

  it('終局後は手を受け付けない', () => {
    const over: GameState = { ...newGame(), over: true };
    expect(playMove(over, idx(2, 3))).toBe(over);
  });
});

describe('winnerOf / countDiscs / opponent', () => {
  it('石の多い側が勝ち、同数は引き分け', () => {
    expect(winnerOf(parse(['BBW.....', ...Array(7).fill('........')]))).toBe(
      'black',
    );
    expect(winnerOf(parse(['BWW.....', ...Array(7).fill('........')]))).toBe(
      'white',
    );
    expect(winnerOf(parse(['BW......', ...Array(7).fill('........')]))).toBe(
      'draw',
    );
  });

  it('opponent', () => {
    expect(opponent(1)).toBe(2);
    expect(opponent(2)).toBe(1);
  });
});

describe('chooseMove', () => {
  it('どの強さでも合法手を返す', () => {
    for (const level of LEVELS) {
      const board = initialBoard();
      const move = chooseMove(board, 1, level, seeded(7));
      expect(legalMoves(board, 1)).toContain(move);
    }
  });

  it('打てる場所がなければ -1', () => {
    const board = parse(['W.......', ...Array(7).fill('........')]);
    expect(chooseMove(board, 1, 'hard', seeded(1))).toBe(-1);
  });

  it('入力の盤面を書き換えない', () => {
    const board = initialBoard();
    const copy = [...board];
    chooseMove(board, 1, 'expert', seeded(5));
    expect([...board]).toEqual(copy);
  });

  it('AI同士で最後まで打ち切れて、石数の合計が64以下に収まる', () => {
    const rand = seeded(11);
    let state = newGame();
    let guard = 0;
    while (!state.over && guard++ < 200) {
      const level = state.turn === 1 ? 'normal' : 'easy';
      const move = chooseMove(state.board, state.turn, level, rand);
      expect(move).toBeGreaterThanOrEqual(0);
      const next = playMove(state, move);
      expect(next).not.toBe(state);
      state = next;
    }
    expect(state.over).toBe(true);
    const { black, white } = countDiscs(state.board);
    expect(black + white).toBeLessThanOrEqual(64);
    expect(legalMoves(state.board, 1)).toEqual([]);
    expect(legalMoves(state.board, 2)).toEqual([]);
  });

  it('強い側（hard）はランダム（easy）に対して勝ち越す', () => {
    let hardWins = 0;
    for (let g = 0; g < 4; g++) {
      const rand = seeded(100 + g);
      let state = newGame();
      const hardIsBlack = g % 2 === 0;
      let guard = 0;
      while (!state.over && guard++ < 200) {
        const isHard = (state.turn === 1) === hardIsBlack;
        const move = chooseMove(
          state.board,
          state.turn,
          isHard ? 'hard' : 'easy',
          rand,
        );
        state = playMove(state, move);
      }
      const w = winnerOf(state.board);
      if ((w === 'black') === hardIsBlack && w !== 'draw') hardWins++;
    }
    expect(hardWins).toBeGreaterThanOrEqual(3);
  });
});

describe('境界条件', () => {
  it('盤面が全部埋まると合法手はなく、AIも -1 を返す', () => {
    const full: Board = Array.from({ length: 64 }, (_, i) =>
      i % 2 === 0 ? 1 : 2,
    );
    expect(legalMoves(full, 1)).toEqual([]);
    expect(legalMoves(full, 2)).toEqual([]);
    expect(chooseMove(full, 1, 'expert', seeded(3))).toBe(-1);
    expect(winnerOf(full)).toBe('draw');
  });

  it('範囲外の index を playMove に渡しても state は変わらない', () => {
    const state = newGame();
    expect(playMove(state, -1)).toBe(state);
    expect(playMove(state, 64)).toBe(state);
    expect(playMove(state, Number.NaN)).toBe(state);
  });

  it('上方向と斜め方向の挟みも裏返る', () => {
    const board = parse([
      '........',
      '........',
      '........',
      '...W....',
      '...W....',
      '...B....',
      '........',
      '........',
    ]);
    // (3,3) への上からの挟み: (4,3) の白が裏返る
    expect(flipsFor(board, idx(2, 3), 1)).toEqual([idx(3, 3), idx(4, 3)]);

    // (2,6) から左下へ: (3,5),(4,4),(5,3) が白、(6,2) が黒で挟まれる
    const diag = parse([
      '........',
      '........',
      '........',
      '.....W..',
      '....W...',
      '...W....',
      '..B.....',
      '........',
    ]);
    expect(flipsFor(diag, idx(2, 6), 1)).toEqual([
      idx(3, 5),
      idx(4, 4),
      idx(5, 3),
    ]);
  });
});
