import { describe, expect, it } from 'vitest';
import {
  BOARD_SIZES,
  DIFFICULTIES,
  EMOJIS,
  applyResult,
  createDeck,
  flipCard,
  formatTime,
  isComplete,
  isMismatchPending,
  matchedPairs,
  newGame,
  pairCount,
  parseRecords,
  resolveMismatch,
  serializeRecords,
} from './memory-match';

const deck = ['a', 'b', 'a', 'c', 'b', 'c'];

describe('盤面サイズ', () => {
  it('どの難易度も枚数が偶数で、絵柄が足りる', () => {
    for (const d of DIFFICULTIES) {
      const { cols, rows } = BOARD_SIZES[d];
      expect((cols * rows) % 2).toBe(0);
      expect(pairCount(d)).toBeLessThanOrEqual(EMOJIS.length);
    }
  });

  it('絵柄に重複がない', () => {
    expect(new Set(EMOJIS).size).toBe(EMOJIS.length);
  });
});

describe('createDeck', () => {
  it('各絵柄がちょうど2枚ずつ、枚数は盤面サイズ通り', () => {
    for (const d of DIFFICULTIES) {
      const cards = createDeck(d);
      const { cols, rows } = BOARD_SIZES[d];
      expect(cards).toHaveLength(cols * rows);
      const counts = new Map<string, number>();
      for (const c of cards) counts.set(c, (counts.get(c) ?? 0) + 1);
      expect(counts.size).toBe(pairCount(d));
      for (const n of counts.values()) expect(n).toBe(2);
    }
  });

  it('乱数を差し替えると結果が決まる', () => {
    const zero = createDeck('easy', () => 0);
    expect(zero).toEqual(createDeck('easy', () => 0));
  });

  it('絵柄の数がペア数に足りないとエラー', () => {
    expect(() => createDeck('easy', undefined, ['x', 'y'])).toThrow(RangeError);
  });
});

describe('flipCard', () => {
  it('1枚目をめくっても手数は増えない', () => {
    const s = flipCard(newGame(deck), 0);
    expect(s.faceUp).toEqual([0]);
    expect(s.moves).toBe(0);
  });

  it('同じ絵柄の2枚目で確定し、手数が1増える', () => {
    const s = flipCard(flipCard(newGame(deck), 0), 2);
    expect(s.matched[0]).toBe(true);
    expect(s.matched[2]).toBe(true);
    expect(s.faceUp).toEqual([]);
    expect(s.moves).toBe(1);
    expect(matchedPairs(s)).toBe(1);
  });

  it('違う絵柄だと2枚とも表向きのまま不一致待ちになる', () => {
    const s = flipCard(flipCard(newGame(deck), 0), 1);
    expect(s.faceUp).toEqual([0, 1]);
    expect(isMismatchPending(s)).toBe(true);
    expect(s.moves).toBe(1);
    expect(matchedPairs(s)).toBe(0);
  });

  it('不一致待ちで別のカードを押すと、先に裏返して新しい1枚目になる', () => {
    const pending = flipCard(flipCard(newGame(deck), 0), 1);
    const s = flipCard(pending, 3);
    expect(s.faceUp).toEqual([3]);
    expect(s.moves).toBe(1);
  });

  it('resolveMismatch は不一致待ちのときだけ裏返す', () => {
    const pending = flipCard(flipCard(newGame(deck), 0), 1);
    expect(resolveMismatch(pending).faceUp).toEqual([]);
    const single = flipCard(newGame(deck), 0);
    expect(resolveMismatch(single)).toBe(single);
  });

  it('同じカードの二度押し・確定済み・範囲外は無視する', () => {
    const one = flipCard(newGame(deck), 0);
    expect(flipCard(one, 0)).toBe(one);
    const matched = flipCard(one, 2);
    expect(flipCard(matched, 0)).toBe(matched);
    expect(flipCard(one, -1)).toBe(one);
    expect(flipCard(one, deck.length)).toBe(one);
    expect(flipCard(one, 1.5)).toBe(one);
  });

  it('全ペアを揃えると完了になる', () => {
    let s = newGame(deck);
    expect(isComplete(s)).toBe(false);
    for (const [i, j] of [
      [0, 2],
      [1, 4],
      [3, 5],
    ]) {
      s = flipCard(flipCard(s, i), j);
    }
    expect(isComplete(s)).toBe(true);
    expect(s.moves).toBe(3);
  });

  it('元の状態を書き換えない', () => {
    const s = newGame(deck);
    flipCard(flipCard(s, 0), 2);
    expect(s.faceUp).toEqual([]);
    expect(s.matched.every((m) => !m)).toBe(true);
    expect(s.moves).toBe(0);
  });
});

describe('applyResult', () => {
  it('初回はそのまま記録され、両方新記録になる', () => {
    const r = applyResult({}, 'easy', 10, 30000);
    expect(r.records.easy).toEqual({ moves: 10, timeMs: 30000 });
    expect(r.newBestMoves).toBe(true);
    expect(r.newBestTime).toBe(true);
  });

  it('手数と時間は別々に更新される', () => {
    const base = { easy: { moves: 10, timeMs: 30000 } };
    const r = applyResult(base, 'easy', 8, 40000);
    expect(r.records.easy).toEqual({ moves: 8, timeMs: 30000 });
    expect(r.newBestMoves).toBe(true);
    expect(r.newBestTime).toBe(false);
  });

  it('同値は新記録にしない・他の難易度は保持する', () => {
    const base = {
      easy: { moves: 10, timeMs: 30000 },
      hard: { moves: 40, timeMs: 90000 },
    };
    const r = applyResult(base, 'easy', 10, 30000);
    expect(r.newBestMoves).toBe(false);
    expect(r.newBestTime).toBe(false);
    expect(r.records.hard).toEqual({ moves: 40, timeMs: 90000 });
  });
});

describe('parseRecords / serializeRecords', () => {
  it('往復できる', () => {
    const records = { normal: { moves: 12, timeMs: 45300 } };
    expect(parseRecords(serializeRecords(records))).toEqual(records);
  });

  it('null・壊れたJSON・配列・想定外の型は空として扱う', () => {
    expect(parseRecords(null)).toEqual({});
    expect(parseRecords('')).toEqual({});
    expect(parseRecords('{oops')).toEqual({});
    expect(parseRecords('[]')).toEqual({});
    expect(parseRecords('"x"')).toEqual({});
    expect(parseRecords('null')).toEqual({});
  });

  it('不正なエントリだけを捨てる', () => {
    const raw = JSON.stringify({
      easy: { moves: 'many', timeMs: 100 },
      normal: { moves: 0, timeMs: 100 },
      hard: { moves: 30, timeMs: 80000 },
      unknown: { moves: 1, timeMs: 1 },
      fraction: { moves: 0.5, timeMs: 0.9 },
    });
    expect(parseRecords(raw)).toEqual({ hard: { moves: 30, timeMs: 80000 } });
  });
});

describe('formatTime', () => {
  it('m:ss.s 形式にする', () => {
    expect(formatTime(0)).toBe('0:00.0');
    expect(formatTime(5300)).toBe('0:05.3');
    expect(formatTime(65999)).toBe('1:05.9');
    expect(formatTime(600000)).toBe('10:00.0');
  });

  it('負の値は0として扱う', () => {
    expect(formatTime(-500)).toBe('0:00.0');
  });

  it('秒の繰り上がり境界と1時間以上を正しく表示する', () => {
    expect(formatTime(59999)).toBe('0:59.9');
    expect(formatTime(60000)).toBe('1:00.0');
    expect(formatTime(3600000)).toBe('60:00.0');
  });
});
