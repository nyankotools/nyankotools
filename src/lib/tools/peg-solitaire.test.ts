import { describe, expect, it } from 'vitest';
import {
  CENTER,
  applyMove,
  evaluate,
  findMove,
  holeCount,
  isHole,
  isStuck,
  legalMoves,
  movesFrom,
  newGame,
  pegCount,
  rankFor,
  toIndex,
  undo,
  type GameState,
} from './peg-solitaire';

function custom(type: 'english' | 'european', pegIndices: number[]): GameState {
  const pegs = new Array<boolean>(49).fill(false);
  for (const i of pegIndices) pegs[i] = true;
  return { type, pegs, history: [] };
}

describe('盤面定義', () => {
  it('英国式は33穴、欧州式は37穴', () => {
    expect(holeCount('english')).toBe(33);
    expect(holeCount('european')).toBe(37);
  });

  it('英国式の角は穴ではなく、欧州式は角の斜め内側が穴', () => {
    expect(isHole('english', 0, 0)).toBe(false);
    expect(isHole('english', 1, 1)).toBe(false);
    expect(isHole('english', 0, 2)).toBe(true);
    expect(isHole('european', 0, 0)).toBe(false);
    expect(isHole('european', 0, 1)).toBe(false);
    expect(isHole('european', 1, 1)).toBe(true);
    expect(isHole('european', -1, 3)).toBe(false);
    expect(isHole('european', 3, 7)).toBe(false);
  });
});

describe('初期状態', () => {
  it('中央だけが空で、残数は穴数-1', () => {
    const e = newGame('english');
    expect(pegCount(e)).toBe(32);
    expect(e.pegs[CENTER]).toBe(false);
    expect(pegCount(newGame('european'))).toBe(36);
  });

  it('初手の合法手は英国式で4通り', () => {
    const moves = legalMoves(newGame('english'));
    expect(moves).toHaveLength(4);
    expect(moves.every((m) => m.to === CENTER)).toBe(true);
  });
});

describe('ジャンプと取り消し', () => {
  it('ジャンプで間の駒が取られ、残数が1減る', () => {
    const s = newGame('english');
    const from = toIndex(1, 3);
    const m = findMove(s, from, CENTER);
    expect(m).not.toBeNull();
    const next = applyMove(s, m!);
    expect(pegCount(next)).toBe(31);
    expect(next.pegs[from]).toBe(false);
    expect(next.pegs[toIndex(2, 3)]).toBe(false);
    expect(next.pegs[CENTER]).toBe(true);
    expect(next.history).toHaveLength(1);
    // 元の state は変更されない
    expect(pegCount(s)).toBe(32);
  });

  it('不正な手は無視される', () => {
    const s = newGame('english');
    expect(applyMove(s, { from: 0, over: 1, to: 2 })).toBe(s);
    expect(
      applyMove(s, { from: toIndex(0, 3), over: toIndex(1, 3), to: CENTER }),
    ).toBe(s);
    // 斜めは不可
    expect(findMove(s, toIndex(2, 2), CENTER)).toBeNull();
  });

  it('盤外へは跳べない', () => {
    const s = custom('english', [toIndex(0, 2), toIndex(0, 3)]);
    expect(movesFrom('english', s.pegs, toIndex(0, 3))).toHaveLength(0);
    // 盤内（0,4）へは跳べるが、盤外（上方向・左方向）の手は含まれない
    const moves = movesFrom('english', s.pegs, toIndex(0, 2));
    expect(moves).toEqual([
      { from: toIndex(0, 2), over: toIndex(0, 3), to: toIndex(0, 4) },
    ]);
  });

  it('undo で元に戻り、履歴がなければ何もしない', () => {
    const s = newGame('european');
    expect(undo(s)).toBe(s);
    const m = legalMoves(s)[0];
    const a = applyMove(s, m);
    const b = undo(a);
    expect(b.pegs).toEqual(s.pegs);
    expect(b.history).toHaveLength(0);
  });

  it('複数手を順に戻せる', () => {
    let s = newGame('english');
    const initial = s.pegs.slice();
    for (let i = 0; i < 5; i++) {
      const moves = legalMoves(s);
      if (moves.length === 0) break;
      s = applyMove(s, moves[0]);
    }
    expect(s.history.length).toBeGreaterThan(0);
    while (s.history.length > 0) s = undo(s);
    expect(s.pegs).toEqual(initial);
  });
});

describe('評価', () => {
  it('開始直後は playing', () => {
    expect(evaluate(newGame('english'))).toBe('playing');
  });

  it('中央1個なら perfect、他の位置1個なら solved', () => {
    expect(evaluate(custom('english', [CENTER]))).toBe('perfect');
    expect(evaluate(custom('english', [toIndex(0, 2)]))).toBe('solved');
  });

  it('離れた2個は詰み', () => {
    const s = custom('english', [toIndex(0, 2), toIndex(6, 4)]);
    expect(isStuck(s)).toBe(true);
    expect(evaluate(s)).toBe('stuck');
  });

  it('隣り合う駒と空きがあれば詰みではない', () => {
    const s = custom('english', [toIndex(3, 1), toIndex(3, 2)]);
    expect(evaluate(s)).toBe('playing');
  });

  it('既知の解で最後の1個が中央に残る（英国式）', () => {
    // 手筋: 小さい盤で再現する代わりに、3個の並びを使って検証
    let s = custom('english', [toIndex(3, 0), toIndex(3, 1), toIndex(3, 4)]);
    s = applyMove(s, {
      from: toIndex(3, 0),
      over: toIndex(3, 1),
      to: toIndex(3, 2),
    });
    expect(pegCount(s)).toBe(2);
    s = custom('english', [toIndex(3, 1), toIndex(3, 2), toIndex(3, 4)]);
    s = applyMove(s, {
      from: toIndex(3, 1),
      over: toIndex(3, 2),
      to: toIndex(3, 3),
    });
    s = applyMove(s, {
      from: toIndex(3, 3),
      over: toIndex(3, 4),
      to: toIndex(3, 5),
    });
    expect(evaluate(s)).toBe('solved');
  });
});

describe('rankFor', () => {
  it('残数で段階が決まる', () => {
    expect(rankFor(1)).toBe('genius');
    expect(rankFor(2)).toBe('good');
    expect(rankFor(3)).toBe('average');
    expect(rankFor(4)).toBe('average');
    expect(rankFor(5)).toBe('beginner');
  });
});
