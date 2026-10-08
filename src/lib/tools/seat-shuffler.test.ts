import { describe, expect, it } from 'vitest';
import {
  formatOrderText,
  formatSeatText,
  MAX_ATTEMPTS,
  MAX_COLS,
  MAX_NAMES,
  parseFixedLine,
  parsePairLine,
  shuffleOrder,
  shuffleSeats,
  type SeatInput,
} from './seat-shuffler';

function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return Math.floor((s / 4294967296) * max);
  };
}

const base = (over: Partial<SeatInput> = {}): SeatInput => ({
  names: ['A', 'B', 'C', 'D'],
  rows: 2,
  cols: 2,
  fixedLines: [],
  pairLines: [],
  diagonal: false,
  ...over,
});

function find(grid: (string | null)[][], name: string): [number, number] {
  for (let r = 0; r < grid.length; r++) {
    const c = grid[r].indexOf(name);
    if (c !== -1) return [r, c];
  }
  throw new Error('not found');
}

describe('parseFixedLine / parsePairLine', () => {
  it('固定席を解釈する', () => {
    expect(parseFixedLine('田中@1,3')).toEqual({
      ok: true,
      seat: { name: '田中', row: 1, col: 3 },
    });
    expect(parseFixedLine('a@b @ 2，4')).toEqual({
      ok: true,
      seat: { name: 'a@b', row: 2, col: 4 },
    });
  });
  it('不正な固定席は失敗', () => {
    expect(parseFixedLine('田中')).toEqual({ ok: false });
    expect(parseFixedLine('@1,2')).toEqual({ ok: false });
    expect(parseFixedLine('A@1')).toEqual({ ok: false });
    expect(parseFixedLine('A@x,2')).toEqual({ ok: false });
  });
  it('ペアを解釈する', () => {
    expect(parsePairLine('A, B')).toEqual({ ok: true, pair: ['A', 'B'] });
    expect(parsePairLine('A、B')).toEqual({ ok: true, pair: ['A', 'B'] });
    expect(parsePairLine('A,B,C')).toEqual({ ok: false });
    expect(parsePairLine('A,')).toEqual({ ok: false });
  });
});

describe('shuffleSeats', () => {
  it('全員がちょうど1回ずつ配置される', () => {
    const r = shuffleSeats(base(), seeded(1));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.grid.flat().sort()).toEqual(['A', 'B', 'C', 'D']);
  });

  it('席が多いと空席ができる', () => {
    const r = shuffleSeats(
      base({ names: ['A', 'B', 'C'], rows: 2, cols: 3 }),
      seeded(2),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.grid.flat().filter((n) => n === null)).toHaveLength(3);
    expect(
      r.grid
        .flat()
        .filter((n) => n !== null)
        .sort(),
    ).toEqual(['A', 'B', 'C']);
  });

  it('固定席は動かない', () => {
    for (let s = 1; s <= 20; s++) {
      const r = shuffleSeats(base({ fixedLines: ['A@2,2'] }), seeded(s));
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.grid[1][1]).toBe('A');
    }
  });

  it('離したいペアは隣り合わない（縦横）', () => {
    for (let s = 1; s <= 30; s++) {
      const r = shuffleSeats(
        base({
          names: ['A', 'B', 'C', 'D', 'E', 'F'],
          rows: 2,
          cols: 3,
          pairLines: ['A,B', 'C,D'],
        }),
        seeded(s),
      );
      expect(r.ok).toBe(true);
      if (!r.ok) continue;
      const [a, b] = [find(r.grid, 'A'), find(r.grid, 'B')];
      expect(Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])).not.toBe(1);
    }
  });

  it('斜めを含めると斜めも離す。斜めを許すと縦横のみ判定', () => {
    for (let s = 1; s <= 30; s++) {
      const r = shuffleSeats(
        base({
          names: ['A', 'B'],
          rows: 3,
          cols: 3,
          pairLines: ['A,B'],
          diagonal: true,
        }),
        seeded(s),
      );
      expect(r.ok).toBe(true);
      if (!r.ok) continue;
      const [a, b] = [find(r.grid, 'A'), find(r.grid, 'B')];
      expect(
        Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])),
      ).toBeGreaterThan(1);
    }
  });

  it('満たせない条件は上限回数後に unsatisfiable', () => {
    let calls = 0;
    const r = shuffleSeats(
      base({ names: ['A', 'B'], rows: 1, cols: 2, pairLines: ['A,B'] }),
      (max) => {
        calls++;
        return max - 1;
      },
    );
    expect(r).toEqual({
      ok: false,
      error: { code: 'unsatisfiable', detail: undefined },
    });
    expect(calls).toBeGreaterThanOrEqual(MAX_ATTEMPTS);
  });

  it('入力エラーを返す', () => {
    const code = (over: Partial<SeatInput>) => {
      const r = shuffleSeats(base(over), seeded(1));
      return r.ok ? 'ok' : r.error.code;
    };
    expect(code({ names: [] })).toBe('noNames');
    expect(
      code({ names: Array.from({ length: MAX_NAMES + 1 }, (_, i) => `n${i}`) }),
    ).toBe('tooManyNames');
    expect(code({ rows: 0 })).toBe('badSize');
    expect(code({ cols: MAX_COLS + 1 })).toBe('badSize');
    expect(code({ rows: 1.5 })).toBe('badSize');
    expect(code({ rows: 1, cols: 3 })).toBe('notEnoughSeats');
    expect(code({ names: ['A', 'A'] })).toBe('duplicateName');
    expect(code({ fixedLines: ['A'] })).toBe('badFixed');
    expect(code({ fixedLines: ['Z@1,1'] })).toBe('unknownFixedName');
    expect(code({ fixedLines: ['A@3,1'] })).toBe('fixedOutOfRange');
    expect(code({ fixedLines: ['A@0,1'] })).toBe('fixedOutOfRange');
    expect(code({ fixedLines: ['A@1,1', 'B@1,1'] })).toBe('fixedSeatTaken');
    expect(code({ fixedLines: ['A@1,1', 'A@1,2'] })).toBe('fixedNameTwice');
    expect(code({ pairLines: ['A'] })).toBe('badPair');
    expect(code({ pairLines: ['A,Z'] })).toBe('unknownPairName');
    expect(code({ pairLines: ['A,A'] })).toBe('samePair');
  });

  it('randomInt を差し替えると結果が決まる', () => {
    const a = shuffleSeats(base(), () => 0);
    const b = shuffleSeats(base(), () => 0);
    expect(a).toEqual(b);
  });
});

describe('shuffleOrder', () => {
  it('全員を並べ替える', () => {
    const r = shuffleOrder(['A', 'B', 'C'], seeded(3));
    expect(r.ok).toBe(true);
    if (r.ok) expect([...r.order].sort()).toEqual(['A', 'B', 'C']);
  });
  it('空と上限超過はエラー', () => {
    expect(shuffleOrder([])).toEqual({ ok: false, error: { code: 'noNames' } });
    const many = Array.from({ length: MAX_NAMES + 1 }, (_, i) => `n${i}`);
    expect(shuffleOrder(many)).toEqual({
      ok: false,
      error: { code: 'tooManyNames' },
    });
  });
});

describe('format', () => {
  it('座席表をタブ区切りで出力', () => {
    expect(
      formatSeatText(
        [
          ['A', null],
          ['B', 'C'],
        ],
        { front: '[前]', empty: '空席' },
      ),
    ).toBe('[前]\nA\t空席\nB\tC');
  });
  it('発表順に番号を付ける', () => {
    expect(formatOrderText(['X', 'Y'])).toBe('1. X\n2. Y');
  });
});
