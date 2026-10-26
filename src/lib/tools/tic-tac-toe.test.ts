import { describe, it, expect } from 'vitest';
import {
  CELLS,
  LEVELS,
  chooseMove,
  emptyBoard,
  findWinLine,
  isFull,
  legalMoves,
  newGame,
  opponent,
  playMove,
  type Board,
  type GameState,
  type Mark,
  type Player,
} from './tic-tac-toe';

function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s % max;
  };
}

/** 9文字（. 空き / X 先手 / O 後手）から盤面を作る */
function parse(text: string): Board {
  return text
    .split('')
    .map((ch): Mark => (ch === 'X' ? 1 : ch === 'O' ? 2 : 0));
}

function play(moves: number[]): GameState {
  let state = newGame();
  for (const m of moves) state = playMove(state, m);
  return state;
}

describe('基本', () => {
  it('空の盤面は9マスすべて空き', () => {
    expect(emptyBoard()).toHaveLength(CELLS);
    expect(legalMoves(emptyBoard())).toHaveLength(9);
    expect(isFull(emptyBoard())).toBe(false);
  });

  it('opponent は手番を反転する', () => {
    expect(opponent(1)).toBe(2);
    expect(opponent(2)).toBe(1);
  });

  it('新しいゲームは先手から始まる', () => {
    const g = newGame();
    expect(g.turn).toBe(1);
    expect(g.over).toBe(false);
    expect(g.lastMove).toBe(-1);
  });
});

describe('findWinLine', () => {
  it('横・縦・斜めを検出する', () => {
    expect(findWinLine(parse('XXX......'))).toEqual([0, 1, 2]);
    expect(findWinLine(parse('.O..O..O.'))).toEqual([1, 4, 7]);
    expect(findWinLine(parse('X...X...X'))).toEqual([0, 4, 8]);
    expect(findWinLine(parse('..X.X.X..'))).toEqual([2, 4, 6]);
  });

  it('揃っていなければ null', () => {
    expect(findWinLine(emptyBoard())).toBeNull();
    expect(findWinLine(parse('XOXXOOOXX'))).toBeNull();
  });
});

describe('playMove', () => {
  it('交互に置く', () => {
    const g = playMove(newGame(), 4);
    expect(g.board[4]).toBe(1);
    expect(g.turn).toBe(2);
    expect(g.lastMove).toBe(4);
  });

  it('埋まったマス・範囲外は無視する', () => {
    const g = playMove(newGame(), 4);
    expect(playMove(g, 4)).toBe(g);
    expect(playMove(g, -1)).toBe(g);
    expect(playMove(g, 9)).toBe(g);
    expect(playMove(g, 1.5)).toBe(g);
  });

  it('3つ揃うと勝ちで終局する', () => {
    const g = play([0, 3, 1, 4, 2]);
    expect(g.over).toBe(true);
    expect(g.winner).toBe(1);
    expect(g.line).toEqual([0, 1, 2]);
    expect(playMove(g, 8)).toBe(g);
  });

  it('後手の勝ちも判定する', () => {
    const g = play([0, 3, 1, 4, 8, 5]);
    expect(g.winner).toBe(2);
    expect(g.line).toEqual([3, 4, 5]);
  });

  it('埋まって揃わなければ引き分け', () => {
    const g = play([0, 1, 2, 4, 3, 5, 7, 6, 8]);
    expect(g.over).toBe(true);
    expect(g.winner).toBeNull();
    expect(g.line).toEqual([]);
  });

  it('最後の9手目で揃えば引き分けではなく勝ち', () => {
    const g = play([0, 1, 2, 3, 7, 5, 6, 8, 4]);
    expect(g.board.every((c) => c !== 0)).toBe(true);
    expect(g.winner).toBe(1);
  });
});

describe('chooseMove', () => {
  it('置けるマスがなければ -1', () => {
    const full = parse('XOXXOOOXX');
    for (const level of LEVELS) {
      expect(chooseMove(full, 1, level, seeded(1))).toBe(-1);
    }
  });

  it('どの強さでも空きマスを返す', () => {
    const board = parse('XO.......');
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 10; seed++) {
        const m = chooseMove(board, 1, level, seeded(seed));
        expect(board[m]).toBe(0);
      }
    }
  });

  it('easy は乱数に従う', () => {
    const board = emptyBoard();
    expect(chooseMove(board, 1, 'easy', () => 0)).toBe(0);
    expect(chooseMove(board, 1, 'easy', (max) => max - 1)).toBe(8);
  });

  it('normal は勝てる手を打つ', () => {
    const board = parse('XX.OO....');
    expect(chooseMove(board, 1, 'normal', seeded(3))).toBe(2);
    expect(chooseMove(board, 2, 'normal', seeded(3))).toBe(5);
  });

  it('normal は相手の勝ちを防ぐ', () => {
    const board = parse('XX..O....');
    for (let seed = 1; seed <= 10; seed++) {
      expect(chooseMove(board, 2, 'normal', seeded(seed))).toBe(2);
    }
  });

  it('hard は勝てる手を逃さず、防ぐべき手を防ぐ', () => {
    expect(chooseMove(parse('XX.OO....'), 1, 'hard', seeded(1))).toBe(2);
    expect(chooseMove(parse('XX..O....'), 2, 'hard', seeded(1))).toBe(2);
  });

  it('hard は先手が角を取られたら中央を取る（唯一の引き分け手）', () => {
    for (let seed = 1; seed <= 10; seed++) {
      expect(chooseMove(parse('X........'), 2, 'hard', seeded(seed))).toBe(4);
    }
  });

  it('hard はフォークを避ける（X が対角の角を取った局面で辺を打つ）', () => {
    // X: 0, 8 / O: 4。O が角を打つと負ける。辺（1,3,5,7）のみが引き分け
    const board = parse('X...O...X');
    for (let seed = 1; seed <= 20; seed++) {
      const m = chooseMove(board, 2, 'hard', seeded(seed));
      expect([1, 3, 5, 7]).toContain(m);
    }
  });
});

/** CPU(hard) が cpu 側のとき、人間側のあらゆる手順で CPU が負けないことを全探索で確認する */
function cpuNeverLoses(state: GameState, cpu: Player, seed: number): boolean {
  if (state.over) return state.winner !== opponent(cpu);
  if (state.turn === cpu) {
    const m = chooseMove(state.board, cpu, 'hard', seeded(seed));
    return cpuNeverLoses(playMove(state, m), cpu, seed + 1);
  }
  return legalMoves(state.board).every((m) =>
    cpuNeverLoses(playMove(state, m), cpu, seed + 1),
  );
}

describe('hard は負けない', () => {
  it('CPU が後手のとき、人間がどう打っても負けない', () => {
    expect(cpuNeverLoses(newGame(), 2, 7)).toBe(true);
  });

  it('CPU が先手のとき、人間がどう打っても負けない', () => {
    expect(cpuNeverLoses(newGame(), 1, 11)).toBe(true);
  });

  it('hard 同士は引き分けになる', () => {
    let state = newGame();
    const rnd = seeded(5);
    while (!state.over) {
      state = playMove(state, chooseMove(state.board, state.turn, 'hard', rnd));
    }
    expect(state.winner).toBeNull();
  });
});

describe('normal / easy を hard が相手にしたとき', () => {
  it('easy 相手なら hard が先手で負けない（複数シード）', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const rnd = seeded(seed);
      let state = newGame();
      while (!state.over) {
        const level = state.turn === 1 ? 'hard' : 'easy';
        state = playMove(
          state,
          chooseMove(state.board, state.turn, level, rnd),
        );
      }
      expect(state.winner).not.toBe(2);
    }
  });
});
