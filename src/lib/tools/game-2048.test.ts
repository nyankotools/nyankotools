import { describe, it, expect } from 'vitest';
import {
  EMPTY,
  SIZES,
  WIN_TILE,
  isGameOver,
  maxTile,
  move,
  newGame,
  parseRecords,
  serializeRecords,
  slideLine,
  spawnTile,
  swipeDirection,
  updateBest,
  type GameState,
} from './game-2048';

// 決定的な疑似乱数（LCG）
function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s % max;
  };
}

// 常に先頭の空きマスに 2 を置く乱数
const firstEmptyTwo = (max: number) => (max === 10 ? 1 : 0);

function state(board: number[], overrides: Partial<GameState> = {}): GameState {
  const size = Math.round(Math.sqrt(board.length));
  return { size, board, score: 0, moves: 0, won: false, ...overrides };
}

describe('slideLine', () => {
  it('詰めて、隣り合う同じ数を合体させる', () => {
    expect(slideLine([2, 0, 2, 0])).toEqual({ line: [4, 0, 0, 0], gained: 4 });
    expect(slideLine([0, 0, 0, 2])).toEqual({ line: [2, 0, 0, 0], gained: 0 });
  });

  it('1回の操作で同じタイルは1度しか合体しない', () => {
    expect(slideLine([2, 2, 2, 2])).toEqual({ line: [4, 4, 0, 0], gained: 8 });
    expect(slideLine([4, 2, 2, 0])).toEqual({ line: [4, 4, 0, 0], gained: 4 });
    expect(slideLine([2, 2, 4, 0])).toEqual({ line: [4, 4, 0, 0], gained: 4 });
  });

  it('3枚並びは先頭側から合体する', () => {
    expect(slideLine([2, 2, 2, 0])).toEqual({ line: [4, 2, 0, 0], gained: 4 });
  });

  it('動かせない並びはそのまま', () => {
    expect(slideLine([2, 4, 8, 16])).toEqual({
      line: [2, 4, 8, 16],
      gained: 0,
    });
    expect(slideLine([0, 0, 0, 0])).toEqual({ line: [0, 0, 0, 0], gained: 0 });
  });

  it('入力を変更しない', () => {
    const line = [2, 2, 0, 4];
    slideLine(line);
    expect(line).toEqual([2, 2, 0, 4]);
  });
});

describe('spawnTile', () => {
  it('空きマスに 2 または 4 を1枚だけ置く', () => {
    const board = [2, 0, 0, 4];
    const next = spawnTile(board, seeded(1));
    expect(board).toEqual([2, 0, 0, 4]);
    const added = next.filter((v, i) => v !== board[i]);
    expect(added).toHaveLength(1);
    expect([2, 4]).toContain(added[0]);
    expect(next[0]).toBe(2);
    expect(next[3]).toBe(4);
  });

  it('乱数の10分の1で 4 になる', () => {
    expect(spawnTile([0, 2], () => 0)[0]).toBe(4);
    expect(spawnTile([0, 2], (max) => (max === 10 ? 5 : 0))[0]).toBe(2);
  });

  it('空きマスがなければそのまま', () => {
    expect(spawnTile([2, 4, 8, 16])).toEqual([2, 4, 8, 16]);
  });
});

describe('newGame', () => {
  it('タイル2枚・スコア0で始まる', () => {
    for (const size of SIZES) {
      const g = newGame(size, seeded(size));
      expect(g.board).toHaveLength(size * size);
      expect(g.board.filter((v) => v !== EMPTY)).toHaveLength(2);
      expect(g.board.every((v) => v === EMPTY || v === 2 || v === 4)).toBe(
        true,
      );
      expect(g.score).toBe(0);
      expect(g.moves).toBe(0);
      expect(g.won).toBe(false);
    }
  });

  it('不正な大きさは RangeError', () => {
    expect(() => newGame(1)).toThrow(RangeError);
    expect(() => newGame(2.5)).toThrow(RangeError);
  });
});

describe('move', () => {
  // 0 2 0 2
  // 0 0 0 0
  // 4 0 0 4
  // 0 0 2 0
  const base = state([0, 2, 0, 2, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 2, 0]);

  it('左へ寄せて合体し、スコアが増え、新しいタイルが1枚出る', () => {
    const next = move(base, 'left', firstEmptyTwo);
    // 左寄せ結果: [4,0,0,0 / 0.. / 8,0,0,0 / 2,0,0,0] の空きに2が1枚
    expect(next.board.slice(0, 4)).toEqual([4, 2, 0, 0]);
    expect(next.board[8]).toBe(8);
    expect(next.board[12]).toBe(2);
    expect(next.score).toBe(12);
    expect(next.moves).toBe(1);
    expect(next.board.filter((v) => v !== EMPTY)).toHaveLength(4);
  });

  it('4方向でタイルの総和は（新規タイルを除き）保たれる', () => {
    const sum = (b: readonly number[]) => b.reduce((a, v) => a + v, 0);
    for (const dir of ['up', 'down', 'left', 'right'] as const) {
      const next = move(base, dir, firstEmptyTwo);
      expect(sum(next.board)).toBe(sum(base.board) + 2);
    }
  });

  it('右・上・下へも正しく寄せる', () => {
    expect(move(base, 'right', firstEmptyTwo).board[3]).toBe(4);
    expect(move(base, 'right', firstEmptyTwo).board[11]).toBe(8);
    const up = move(base, 'up', firstEmptyTwo);
    expect(up.board[1]).toBe(2);
    expect(up.board[2]).toBe(2);
    const down = move(base, 'down', firstEmptyTwo);
    expect(down.board[13]).toBe(2);
    expect(down.board[15]).toBe(4);
  });

  it('動かせない向きは同じ state を返し、手数・タイルも増えない', () => {
    const stuck = state([2, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 16, 0, 0, 0]);
    expect(move(stuck, 'left', firstEmptyTwo)).toBe(stuck);
    expect(move(stuck, 'up', firstEmptyTwo)).toBe(stuck);
  });

  it('入力の state を変更しない', () => {
    const board = [...base.board];
    move(base, 'left', firstEmptyTwo);
    expect([...base.board]).toEqual(board);
    expect(base.score).toBe(0);
  });

  it('5×5 でも4方向へ正しく寄せる（行・列の並びが4×4と違う）', () => {
    // 5×5 の (row2, col1) に 4 を1枚だけ置く。空きマス先頭(0)には乱数で2が出る
    const b5 = (): number[] => {
      const b = new Array<number>(25).fill(EMPTY);
      b[11] = 4;
      return b;
    };
    const g = state(b5());
    expect(g.size).toBe(5);
    expect(move(g, 'right', firstEmptyTwo).board[14]).toBe(4);
    expect(move(g, 'left', firstEmptyTwo).board[10]).toBe(4);
    expect(move(g, 'up', firstEmptyTwo).board[1]).toBe(4);
    expect(move(g, 'down', firstEmptyTwo).board[21]).toBe(4);
  });

  it('6×6 の行で同じ数が4つ並ぶと、先頭側から2組に合体する', () => {
    const row = [2, 2, 2, 2, 2, 2];
    const g = state([...row, ...new Array<number>(30).fill(EMPTY)]);
    expect(g.size).toBe(6);
    const next = move(g, 'left', firstEmptyTwo);
    // 合体後は [4,4,4,0,0,0]。空きマス先頭(3)に乱数で2が出る
    expect(next.board.slice(0, 6)).toEqual([4, 4, 4, 2, 0, 0]);
    expect(next.score).toBe(12);
  });

  it('合体して 1024 になっても won にはならない（2048 未満）', () => {
    const g = state([512, 512, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const next = move(g, 'left', firstEmptyTwo);
    expect(maxTile(next.board)).toBe(1024);
    expect(next.won).toBe(false);
  });

  it('動かした結果そのまま埋まって、どの向きも動かせなくなる', () => {
    // 2×2: [4,8 / 16,0] を右へ寄せると [4,8 / 2,16] になり、以後どの向きにも動かせない
    const g = state([4, 8, 16, 0]);
    expect(isGameOver(g)).toBe(false);
    const next = move(g, 'right', firstEmptyTwo);
    expect(next.board).toEqual([4, 8, 2, 16]);
    expect(isGameOver(next)).toBe(true);
  });

  it('2048 を作ると won になり、その後も維持される', () => {
    const g = state([1024, 1024, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const won = move(g, 'left', firstEmptyTwo);
    expect(maxTile(won.board)).toBe(WIN_TILE);
    expect(won.won).toBe(true);
    expect(won.score).toBe(2048);
    const next = move(won, 'down', firstEmptyTwo);
    expect(next.won).toBe(true);
  });

  it('ランダムに遊び続けても盤面の整合性が崩れない', () => {
    const rnd = seeded(42);
    let g = newGame(4, rnd);
    const dirs = ['up', 'down', 'left', 'right'] as const;
    for (let i = 0; i < 500 && !isGameOver(g); i++) {
      const next = move(g, dirs[rnd(4)], rnd);
      if (next !== g) {
        expect(next.moves).toBe(g.moves + 1);
        expect(next.score).toBeGreaterThanOrEqual(g.score);
      }
      expect(
        next.board.every((v) => v === 0 || (v >= 2 && (v & (v - 1)) === 0)),
      ).toBe(true);
      g = next;
    }
  });
});

describe('isGameOver', () => {
  it('空きマスがあれば終わっていない', () => {
    expect(
      isGameOver(state([2, 4, 2, 0, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2])),
    ).toBe(false);
  });

  it('埋まっていて隣り合う同じ数もなければ終了', () => {
    expect(
      isGameOver(state([2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2])),
    ).toBe(true);
  });

  it('5×5・6×6 の埋まった盤面でも判定が正しい', () => {
    // 市松模様（隣は必ず違う数）なら終了
    const checker = (n: number) =>
      Array.from({ length: n * n }, (_, i) =>
        (Math.floor(i / n) + (i % n)) % 2 === 0 ? 2 : 4,
      );
    expect(isGameOver(state(checker(5)))).toBe(true);
    expect(isGameOver(state(checker(6)))).toBe(true);
    // 右下の角だけ隣と同じ数にすると、まだ終わっていない
    const b5 = checker(5);
    b5[24] = b5[23];
    expect(isGameOver(state(b5))).toBe(false);
    const b6 = checker(6);
    b6[35] = b6[34];
    expect(isGameOver(state(b6))).toBe(false);
  });

  it('埋まっていても横・縦に同じ数が隣り合えば終わっていない', () => {
    expect(
      isGameOver(state([2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 4])),
    ).toBe(false);
    expect(
      isGameOver(state([2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 2, 2, 4, 2])),
    ).toBe(false);
    expect(
      isGameOver(state([2, 4, 2, 4, 2, 8, 4, 2, 4, 2, 8, 4, 8, 4, 2, 8])),
    ).toBe(false);
  });
});

describe('updateBest', () => {
  it('スコアと最大タイルを別々に更新する', () => {
    let r = updateBest({}, 4, 100, 32);
    expect(r[4]).toEqual({ score: 100, maxTile: 32 });
    r = updateBest(r, 4, 80, 64);
    expect(r[4]).toEqual({ score: 100, maxTile: 64 });
    r = updateBest(r, 4, 300, 16);
    expect(r[4]).toEqual({ score: 300, maxTile: 64 });
  });

  it('更新がなければ同じ records を返す', () => {
    const r = { 4: { score: 100, maxTile: 64 } } as const;
    expect(updateBest(r, 4, 50, 32)).toBe(r);
    expect(updateBest({}, 4, 0, 0)).toEqual({});
  });

  it('大きさごとに別々に記録する', () => {
    const r = updateBest(updateBest({}, 4, 10, 4), 5, 99, 8);
    expect(r[4]?.score).toBe(10);
    expect(r[5]?.score).toBe(99);
  });
});

describe('parseRecords / serializeRecords', () => {
  it('保存した記録を復元できる', () => {
    const records = { 4: { score: 1234, maxTile: 128 } };
    expect(parseRecords(serializeRecords(records))).toEqual(records);
  });

  it('壊れた値・想定外の形は無視する', () => {
    expect(parseRecords(null)).toEqual({});
    expect(parseRecords('')).toEqual({});
    expect(parseRecords('not json')).toEqual({});
    expect(parseRecords('[1,2]')).toEqual({});
    expect(parseRecords('{"4":{"score":"x","maxTile":8}}')).toEqual({});
    expect(parseRecords('{"4":{"score":-1,"maxTile":8}}')).toEqual({});
    expect(parseRecords('{"9":{"score":10,"maxTile":8}}')).toEqual({});
  });

  it('一部だけ壊れていても、正しい大きさの記録は残す', () => {
    expect(
      parseRecords(
        '{"4":{"score":5,"maxTile":8},"5":{"score":"x","maxTile":1},"6":null}',
      ),
    ).toEqual({ 4: { score: 5, maxTile: 8 } });
    expect(parseRecords('{"4":{"score":1}}')).toEqual({});
    expect(parseRecords('{"4":{"score":1e400,"maxTile":8}}')).toEqual({});
    expect(parseRecords('"text"')).toEqual({});
    expect(parseRecords('null')).toEqual({});
  });

  it('小数は切り捨てる', () => {
    expect(parseRecords('{"4":{"score":10.9,"maxTile":8}}')).toEqual({
      4: { score: 10, maxTile: 8 },
    });
  });
});

describe('swipeDirection', () => {
  it('移動量の大きい軸の向きを返す', () => {
    expect(swipeDirection(50, 10)).toBe('right');
    expect(swipeDirection(-50, 10)).toBe('left');
    expect(swipeDirection(5, 60)).toBe('down');
    expect(swipeDirection(5, -60)).toBe('up');
  });

  it('しきい値未満は無視する', () => {
    expect(swipeDirection(10, 10)).toBeNull();
    expect(swipeDirection(0, 0)).toBeNull();
  });

  it('しきい値ちょうどは動かし、1px手前は無視する', () => {
    expect(swipeDirection(24, 0)).toBe('right');
    expect(swipeDirection(23, 0)).toBeNull();
    expect(swipeDirection(0, -24)).toBe('up');
    expect(swipeDirection(10, -24)).toBe('up');
    expect(swipeDirection(24, 24)).toBe('right');
    expect(swipeDirection(30, 30, 40)).toBeNull();
  });
});
