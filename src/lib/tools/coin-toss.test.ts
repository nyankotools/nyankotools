import { describe, it, expect } from 'vitest';
import {
  MAX_HISTORY,
  MAX_TOSS_COUNT,
  appendHistory,
  coinRotation,
  flipCoin,
  flipCoins,
  sideAtRotation,
  summarizeHistory,
  validateTossCount,
} from './coin-toss';
import type { CoinSide } from './coin-toss';

function sequence(...values: number[]) {
  let i = 0;
  return (max: number) => values[i++ % values.length] % max;
}

describe('flipCoin', () => {
  it('0 が表、1 が裏', () => {
    expect(flipCoin(() => 0)).toBe('heads');
    expect(flipCoin(() => 1)).toBe('tails');
  });

  it('randomInt には 2 が渡される', () => {
    let received = 0;
    flipCoin((max) => {
      received = max;
      return 0;
    });
    expect(received).toBe(2);
  });

  it('既定の乱数で表裏の両方が出る', () => {
    const seen = new Set<CoinSide>();
    for (let i = 0; i < 200; i++) seen.add(flipCoin());
    expect(seen).toEqual(new Set(['heads', 'tails']));
  });
});

describe('flipCoins', () => {
  it('投げた順に結果を返す', () => {
    expect(flipCoins(4, sequence(0, 1, 1, 0))).toEqual([
      'heads',
      'tails',
      'tails',
      'heads',
    ]);
  });

  it('範囲外・非整数は RangeError', () => {
    expect(() => flipCoins(0)).toThrow(RangeError);
    expect(() => flipCoins(MAX_TOSS_COUNT + 1)).toThrow(RangeError);
    expect(() => flipCoins(1.5)).toThrow(RangeError);
    expect(() => flipCoins(NaN)).toThrow(RangeError);
  });

  it('上限ちょうどは投げられる', () => {
    expect(flipCoins(MAX_TOSS_COUNT, () => 0)).toHaveLength(MAX_TOSS_COUNT);
  });
});

describe('validateTossCount', () => {
  it('1〜上限の整数は null', () => {
    expect(validateTossCount(1)).toBeNull();
    expect(validateTossCount(MAX_TOSS_COUNT)).toBeNull();
  });
  it('範囲外・小数・NaN はエラー', () => {
    expect(validateTossCount(0)).toBe('count');
    expect(validateTossCount(-3)).toBe('count');
    expect(validateTossCount(MAX_TOSS_COUNT + 1)).toBe('count');
    expect(validateTossCount(2.5)).toBe('count');
    expect(validateTossCount(NaN)).toBe('count');
  });
});

describe('coinRotation / sideAtRotation', () => {
  it('指定の面を上にして止まり、現在より大きく回る', () => {
    let rotation = 0;
    for (const side of ['tails', 'tails', 'heads', 'heads', 'tails'] as const) {
      const next = coinRotation(rotation, side, 5);
      expect(next).toBeGreaterThanOrEqual(rotation + 360 * 5);
      expect(sideAtRotation(next)).toBe(side);
      rotation = next;
    }
  });

  it('表は 360 の倍数、裏は +180', () => {
    expect(coinRotation(0, 'heads', 0)).toBe(0);
    expect(coinRotation(0, 'tails', 0)).toBe(180);
    expect(coinRotation(180, 'heads', 0)).toBe(360);
    expect(coinRotation(180, 'tails', 2)).toBe(1260);
  });

  it('sideAtRotation は負の角度や境界も扱える', () => {
    expect(sideAtRotation(0)).toBe('heads');
    expect(sideAtRotation(89)).toBe('heads');
    expect(sideAtRotation(90)).toBe('tails');
    expect(sideAtRotation(269)).toBe('tails');
    expect(sideAtRotation(270)).toBe('heads');
    expect(sideAtRotation(-180)).toBe('tails');
  });
});

describe('appendHistory', () => {
  it('末尾に追加し、元の配列は変更しない', () => {
    const history: CoinSide[] = ['heads'];
    expect(appendHistory(history, ['tails'])).toEqual(['heads', 'tails']);
    expect(history).toEqual(['heads']);
  });

  it('上限を超えたら古いものから捨てる', () => {
    const full: CoinSide[] = Array(MAX_HISTORY).fill('heads');
    const next = appendHistory(full, ['tails', 'tails']);
    expect(next).toHaveLength(MAX_HISTORY);
    expect(next.slice(-2)).toEqual(['tails', 'tails']);
    expect(next[0]).toBe('heads');
  });
});

describe('summarizeHistory', () => {
  it('空の履歴', () => {
    expect(summarizeHistory([])).toEqual({
      total: 0,
      heads: 0,
      tails: 0,
      headsRatio: 0,
      currentStreak: null,
      longestStreak: null,
    });
  });

  it('枚数と割合を数える', () => {
    const stats = summarizeHistory(['heads', 'tails', 'heads', 'heads']);
    expect(stats.total).toBe(4);
    expect(stats.heads).toBe(3);
    expect(stats.tails).toBe(1);
    expect(stats.headsRatio).toBe(0.75);
  });

  it('現在の連続と最長の連続', () => {
    const stats = summarizeHistory([
      'heads',
      'heads',
      'heads',
      'tails',
      'tails',
    ]);
    expect(stats.currentStreak).toEqual({ side: 'tails', length: 2 });
    expect(stats.longestStreak).toEqual({ side: 'heads', length: 3 });
  });

  it('最長が同じ長さなら先に現れた方', () => {
    const stats = summarizeHistory(['tails', 'tails', 'heads', 'heads']);
    expect(stats.longestStreak).toEqual({ side: 'tails', length: 2 });
  });

  it('1件だけ', () => {
    const stats = summarizeHistory(['tails']);
    expect(stats.currentStreak).toEqual({ side: 'tails', length: 1 });
    expect(stats.longestStreak).toEqual({ side: 'tails', length: 1 });
  });
});
