import { describe, expect, it } from 'vitest';
import {
  MAX_GRID,
  PENALTY_MS,
  TIME_LIMIT_MS,
  createRound,
  diffFor,
  formatSeconds,
  gridSizeFor,
  parseBest,
  rankFor,
  remainingMs,
} from './color-sense-test';

describe('gridSizeFor', () => {
  it('2から始まり2ステージごとに増え、上限で止まる', () => {
    expect([1, 2, 3, 4, 5, 6].map(gridSizeFor)).toEqual([2, 2, 3, 3, 4, 4]);
    expect(gridSizeFor(11)).toBe(MAX_GRID);
    expect(gridSizeFor(500)).toBe(MAX_GRID);
  });

  it('範囲外・小数でも壊れない', () => {
    expect(gridSizeFor(0)).toBe(2);
    expect(gridSizeFor(-5)).toBe(2);
    expect(gridSizeFor(3.9)).toBe(3);
  });
});

describe('diffFor', () => {
  it('ステージが進むほど小さくなり、下限を下回らない', () => {
    let prev = Infinity;
    for (let s = 1; s <= 60; s++) {
      const d = diffFor(s);
      expect(d).toBeLessThanOrEqual(prev);
      expect(d).toBeGreaterThanOrEqual(1.5);
      prev = d;
    }
    expect(diffFor(1)).toBe(22);
    expect(diffFor(1000)).toBe(1.5);
  });
});

describe('createRound', () => {
  it('oddIndex は盤面内で、2色は異なる', () => {
    for (let stage = 1; stage <= 40; stage++) {
      const round = createRound(stage);
      expect(round.size).toBe(gridSizeFor(stage));
      expect(round.oddIndex).toBeGreaterThanOrEqual(0);
      expect(round.oddIndex).toBeLessThan(round.size * round.size);
      expect(round.oddColor).not.toBe(round.baseColor);
    }
  });

  it('乱数を差し替えると結果が決まる', () => {
    const values = [200, 10, 5, 0, 3];
    let i = 0;
    const round = createRound(1, () => values[i++]);
    expect(round.baseColor).toBe('hsl(200 55% 40%)');
    // sign=+1, diff=22
    expect(round.oddColor).toBe('hsl(200 55% 62%)');
    expect(round.oddIndex).toBe(3);
  });

  it('明るさは常に0〜100%に収まる', () => {
    for (let n = 0; n < 200; n++) {
      const round = createRound(1);
      const l = Number(/(\d+(?:\.\d+)?)%\)$/.exec(round.oddColor)?.[1]);
      expect(l).toBeGreaterThanOrEqual(0);
      expect(l).toBeLessThanOrEqual(100);
    }
  });
});

describe('remainingMs', () => {
  it('経過時間とミスの罰則を引く', () => {
    expect(remainingMs(0, 0)).toBe(TIME_LIMIT_MS);
    expect(remainingMs(10_000, 2)).toBe(
      TIME_LIMIT_MS - 10_000 - 2 * PENALTY_MS,
    );
  });

  it('0未満にならず、不正値は無視する', () => {
    expect(remainingMs(TIME_LIMIT_MS * 2, 0)).toBe(0);
    expect(remainingMs(NaN, -3)).toBe(TIME_LIMIT_MS);
    expect(remainingMs(0, NaN)).toBe(TIME_LIMIT_MS);
  });
});

describe('rankFor', () => {
  it('境界値でランクが切り替わる', () => {
    expect(rankFor(0)).toBe('beginner');
    expect(rankFor(14)).toBe('beginner');
    expect(rankFor(15)).toBe('average');
    expect(rankFor(25)).toBe('good');
    expect(rankFor(35)).toBe('great');
    expect(rankFor(45)).toBe('master');
    expect(rankFor(999)).toBe('master');
  });
});

describe('parseBest', () => {
  it('壊れた値は0にする', () => {
    expect(parseBest(null)).toBe(0);
    expect(parseBest('')).toBe(0);
    expect(parseBest('abc')).toBe(0);
    expect(parseBest('-4')).toBe(0);
    expect(parseBest('Infinity')).toBe(0);
    expect(parseBest('12.7')).toBe(12);
    expect(parseBest('30')).toBe(30);
  });
});

describe('formatSeconds', () => {
  it('切り上げて m:ss にする', () => {
    expect(formatSeconds(60_000)).toBe('1:00');
    expect(formatSeconds(59_001)).toBe('1:00');
    expect(formatSeconds(9_500)).toBe('0:10');
    expect(formatSeconds(0)).toBe('0:00');
    expect(formatSeconds(-5)).toBe('0:00');
  });
});
