import { describe, expect, it } from 'vitest';
import {
  canMove,
  clampDiscs,
  createGame,
  extraMoves,
  isNewBest,
  isOptimal,
  isSolved,
  minMoves,
  move,
  parseBest,
  solve,
} from './tower-of-hanoi';

describe('createGame / clampDiscs / minMoves', () => {
  it('全円盤が左の杭に大きい順で積まれる', () => {
    const g = createGame(4);
    expect(g.pegs).toEqual([[4, 3, 2, 1], [], []]);
    expect(g.moves).toBe(0);
  });
  it('枚数は3〜8に丸められる', () => {
    expect(clampDiscs(1)).toBe(3);
    expect(clampDiscs(99)).toBe(8);
    expect(clampDiscs(NaN)).toBe(3);
    expect(createGame(100).discs).toBe(8);
  });
  it('最短手数は 2^n - 1', () => {
    expect(minMoves(3)).toBe(7);
    expect(minMoves(8)).toBe(255);
  });
});

describe('canMove / move', () => {
  it('小さい円盤は大きい円盤の上や空の杭に置ける', () => {
    const g = createGame(3);
    expect(canMove(g, 0, 1)).toBe(true);
    const g2 = move(g, 0, 1)!;
    expect(g2.moves).toBe(1);
    expect(g2.pegs).toEqual([[3, 2], [1], []]);
    expect(canMove(g2, 1, 0)).toBe(true);
  });
  it('大きい円盤は小さい円盤の上に置けない', () => {
    const g2 = move(createGame(3), 0, 1)!;
    expect(canMove(g2, 0, 1)).toBe(false);
    expect(move(g2, 0, 1)).toBeNull();
  });
  it('空の杭からの移動・同じ杭・範囲外は不可', () => {
    const g = createGame(3);
    expect(canMove(g, 1, 2)).toBe(false);
    expect(canMove(g, 0, 0)).toBe(false);
    expect(canMove(g, 0, 3)).toBe(false);
    expect(canMove(g, -1, 0)).toBe(false);
    expect(canMove(g, 0.5, 1)).toBe(false);
  });
  it('元の状態を変更しない', () => {
    const g = createGame(3);
    move(g, 0, 2);
    expect(g.pegs).toEqual([[3, 2, 1], [], []]);
  });
});

describe('solve', () => {
  it.each([3, 4, 5, 8])('%d枚の解は最短手数で、実行するとクリアになる', (n) => {
    const moves = solve(n);
    expect(moves).toHaveLength(minMoves(n));
    let g = createGame(n);
    for (const m of moves) {
      const next = move(g, m.from, m.to);
      expect(next).not.toBeNull();
      g = next!;
    }
    expect(isSolved(g)).toBe(true);
    expect(isOptimal(g)).toBe(true);
  });
  it('3枚の手順は既知の7手と一致する', () => {
    expect(solve(3).map((m) => `${m.from}${m.to}`)).toEqual([
      '02',
      '01',
      '21',
      '02',
      '10',
      '12',
      '02',
    ]);
  });
});

describe('isSolved / extraMoves', () => {
  it('開始直後は未クリア', () => {
    expect(isSolved(createGame(3))).toBe(false);
  });
  it('中央の杭に全部あってもクリアではない', () => {
    expect(isSolved({ discs: 3, pegs: [[], [3, 2, 1], []], moves: 7 })).toBe(
      false,
    );
  });
  it('余分な手数は最短との差', () => {
    const s = { discs: 3, pegs: [[], [], [3, 2, 1]], moves: 10 };
    expect(extraMoves(s)).toBe(3);
    expect(isOptimal(s)).toBe(false);
    expect(extraMoves({ ...s, moves: 7 })).toBe(0);
  });
});

describe('best', () => {
  it('parseBest は正の整数のみ受け付ける', () => {
    expect(parseBest(null)).toBe(0);
    expect(parseBest('15')).toBe(15);
    expect(parseBest('-1')).toBe(0);
    expect(parseBest('1.5')).toBe(0);
    expect(parseBest('abc')).toBe(0);
  });
  it('isNewBest は少ない手数で更新', () => {
    expect(isNewBest(7, 0)).toBe(true);
    expect(isNewBest(7, 9)).toBe(true);
    expect(isNewBest(9, 7)).toBe(false);
    expect(isNewBest(7, 7)).toBe(false);
  });
});
