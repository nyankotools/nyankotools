import { describe, expect, it } from 'vitest';
import {
  endColumn,
  generateLadder,
  MIN_BARS,
  parseLines,
  rowCountFor,
  shuffle,
  traceRoute,
} from './amidakuji-generator';

// 線形合同法の簡易乱数（テスト用の再現可能な乱数）
function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return Math.floor((s / 4294967296) * max);
  };
}

describe('parseLines', () => {
  it('空行と前後の空白を除く', () => {
    expect(parseLines(' A \r\n\n B\n  \nC')).toEqual(['A', 'B', 'C']);
  });
});

describe('generateLadder', () => {
  it('段数は人数に応じ、最低10段', () => {
    expect(rowCountFor(2)).toBe(10);
    expect(rowCountFor(20)).toBe(60);
    expect(generateLadder(3, seeded(1))).toHaveLength(10);
  });

  it('隣り合う横線を作らず、どの隙間にも MIN_BARS 本以上ある', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const players = 2 + (seed % 19);
      const ladder = generateLadder(players, seeded(seed));
      for (const row of ladder) {
        expect(row).toHaveLength(players - 1);
        for (let c = 1; c < row.length; c++) {
          expect(row[c] && row[c - 1]).toBe(false);
        }
      }
      for (let c = 0; c < players - 1; c++) {
        expect(ladder.filter((row) => row[c]).length).toBeGreaterThanOrEqual(
          MIN_BARS,
        );
      }
    }
  });

  it('乱数が常に1を返しても（横線が1本もできなくても）補完で各隙間 MIN_BARS 本入る', () => {
    for (let players = 2; players <= 20; players++) {
      const ladder = generateLadder(players, () => 1);
      for (let c = 0; c < players - 1; c++) {
        expect(ladder.filter((row) => row[c]).length).toBeGreaterThanOrEqual(
          MIN_BARS,
        );
      }
    }
  });

  it('乱数が常に0を返しても隣接する横線は作らない', () => {
    const ladder = generateLadder(5, () => 0);
    for (const row of ladder) {
      for (let c = 1; c < row.length; c++)
        expect(row[c] && row[c - 1]).toBe(false);
    }
  });
});

describe('traceRoute / endColumn', () => {
  it('横線がなければまっすぐ下に着く', () => {
    const ladder = [
      [false, false],
      [false, false],
    ];
    expect(endColumn(ladder, 1)).toBe(1);
    expect(traceRoute(ladder, 1)).toEqual([
      { col: 1, row: 0 },
      { col: 1, row: 3 },
    ]);
  });

  it('横線で左右に移る', () => {
    const ladder = [
      [true, false],
      [false, true],
    ];
    expect(endColumn(ladder, 0)).toBe(2);
    expect(endColumn(ladder, 1)).toBe(0);
    expect(endColumn(ladder, 2)).toBe(1);
  });

  it('全員の到着列は重複しない（全単射）', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const players = 2 + (seed % 19);
      const ladder = generateLadder(players, seeded(seed));
      const ends = Array.from({ length: players }, (_, i) =>
        endColumn(ladder, i),
      );
      expect(new Set(ends).size).toBe(players);
    }
  });
});

describe('shuffle', () => {
  it('要素を保ったまま並べ替え、元の配列は変更しない', () => {
    const src = ['a', 'b', 'c', 'd', 'e'];
    for (let seed = 1; seed <= 30; seed++) {
      const out = shuffle(src, seeded(seed));
      expect([...out].sort()).toEqual(src);
    }
    expect(src).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('乱数によって並びが変わる', () => {
    const orders = new Set<string>();
    for (let seed = 1; seed <= 30; seed++) {
      orders.add(shuffle([1, 2, 3, 4], seeded(seed)).join());
    }
    expect(orders.size).toBeGreaterThan(1);
  });
});
