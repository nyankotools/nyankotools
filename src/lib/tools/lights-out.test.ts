import { describe, expect, it } from 'vitest';
import {
  SIZES,
  applyPress,
  boardToString,
  countLit,
  createBoard,
  hint,
  isSolved,
  newGame,
  press,
  restart,
  solve,
} from './lights-out';

/** 決定的な乱数（LCG） */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

describe('press', () => {
  it('中央を押すと十字が反転する', () => {
    const b = press(new Array<boolean>(9).fill(false), 3, 4);
    expect(boardToString(b, 3)).toBe('.#.\n###\n.#.');
  });

  it('角を押すと3マスだけ反転する', () => {
    const b = press(new Array<boolean>(9).fill(false), 3, 0);
    expect(boardToString(b, 3)).toBe('##.\n#..\n...');
  });

  it('端（右辺）でも折り返さない', () => {
    const b = press(new Array<boolean>(9).fill(false), 3, 2);
    expect(boardToString(b, 3)).toBe('.##\n..#\n...');
  });

  it('同じマスを2回押すと元に戻り、元の配列は変更されない', () => {
    const base = createBoard(5, seeded(1));
    const copy = base.slice();
    expect(press(press(base, 5, 7), 5, 7)).toEqual(base);
    expect(base).toEqual(copy);
  });

  it('範囲外のインデックスは何もしない', () => {
    const base = new Array<boolean>(9).fill(false);
    expect(press(base, 3, -1)).toBe(base);
    expect(press(base, 3, 9)).toBe(base);
    expect(press(base, 3, 1.5)).toBe(base);
  });
});

describe('createBoard', () => {
  it('全サイズで完成済みでなく、必ず解ける', () => {
    for (const size of SIZES) {
      for (let seed = 1; seed <= 20; seed++) {
        const b = createBoard(size, seeded(seed * 7 + size));
        expect(b).toHaveLength(size * size);
        expect(isSolved(b)).toBe(false);
        const sol = solve(b, size);
        expect(sol).not.toBeNull();
        let cur = b;
        for (const i of sol!) cur = press(cur, size, i);
        expect(isSolved(cur)).toBe(true);
      }
    }
  });

  it('乱数が常に0.99でも完成済みにならない（全マスを押すと全消灯にはならない場合を含む）', () => {
    const b = createBoard(3, () => 0.99);
    expect(isSolved(b)).toBe(false);
  });

  it('乱数が常に0.0でも保険で完成済みにならない', () => {
    // 全マスを押すと偶然全消灯になる盤面もあるが、いずれにせよ未完成を返す
    for (const size of SIZES) {
      expect(isSolved(createBoard(size, () => 0))).toBe(false);
    }
  });
});

describe('solve', () => {
  it('全消灯なら空の解', () => {
    expect(solve(new Array<boolean>(25).fill(false), 5)).toEqual([]);
  });

  it('1回押した盤面は、その1回が最少解になる', () => {
    const b = press(new Array<boolean>(25).fill(false), 5, 12);
    expect(solve(b, 5)).toEqual([12]);
  });

  it('解けない盤面（5×5 で1マスだけ点灯）は null', () => {
    const b = new Array<boolean>(25).fill(false);
    b[0] = true;
    expect(solve(b, 5)).toBeNull();
  });

  it('4×4 は零空間があるが、最少手数の解を返す', () => {
    // 任意の押下パターンの盤面に対し、解の手数は元のパターン以下
    const pattern = [0, 5, 6, 9, 10, 15];
    let b = new Array<boolean>(16).fill(false);
    for (const i of pattern) b = press(b, 4, i);
    const sol = solve(b, 4)!;
    expect(sol.length).toBeLessThanOrEqual(pattern.length);
    let cur = b;
    for (const i of sol) cur = press(cur, 4, i);
    expect(isSolved(cur)).toBe(true);
  });

  it('長さが合わない盤面は null', () => {
    expect(solve([true, false], 3)).toBeNull();
  });
});

describe('hint', () => {
  it('ヒントのマスを押し続けると必ず完成する', () => {
    for (const size of SIZES) {
      let b = createBoard(size, seeded(size * 31));
      let guard = 0;
      while (!isSolved(b) && guard++ < size * size) {
        const h = hint(b, size);
        expect(h).not.toBeNull();
        b = press(b, size, h!);
      }
      expect(isSolved(b)).toBe(true);
    }
  });

  it('完成済みは null', () => {
    expect(hint(new Array<boolean>(9).fill(false), 3)).toBeNull();
  });
});

describe('game state', () => {
  it('newGame は手数0で、押すと手数が増える', () => {
    const g = newGame(5, seeded(3));
    expect(g.moves).toBe(0);
    const g2 = applyPress(g, 0);
    expect(g2.moves).toBe(1);
    expect(g2.board).toEqual(press(g.board, 5, 0));
    expect(g2.initial).toEqual(g.initial);
  });

  it('範囲外は無視され、完成後は動かない', () => {
    const g = newGame(3, seeded(5));
    expect(applyPress(g, 99)).toBe(g);
    let cur = g;
    for (const i of solve(g.board, 3)!) cur = applyPress(cur, i);
    expect(isSolved(cur.board)).toBe(true);
    expect(applyPress(cur, 0)).toBe(cur);
  });

  it('restart で開始盤面と手数0に戻る', () => {
    const g = applyPress(newGame(4, seeded(9)), 3);
    const r = restart(g);
    expect(r.board).toEqual(g.initial);
    expect(r.moves).toBe(0);
    expect(countLit(r.board)).toBe(countLit(g.initial));
  });
});
