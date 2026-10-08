import { describe, expect, it } from 'vitest';
import {
  COLOR_IDS,
  FORTUNE_IDS,
  FORTUNE_WEIGHTS,
  ITEM_IDS,
  MAX_LUCKY_NUMBER,
  TIER_WEIGHTS,
  VARIANTS,
  drawDaily,
  drawOmikuji,
  fortuneRank,
  hashString,
  localDateKey,
  normalizeName,
  pickWeighted,
  seededRandomInt,
} from './omikuji';

describe('weights', () => {
  it('運勢の重みは合計100', () => {
    const total = FORTUNE_IDS.reduce((s, id) => s + FORTUNE_WEIGHTS[id], 0);
    expect(total).toBe(100);
  });
  it('項目の重みは運勢ごとに合計100', () => {
    for (const id of FORTUNE_IDS) {
      expect(TIER_WEIGHTS[id].reduce((a, b) => a + b, 0)).toBe(100);
    }
  });
});

describe('pickWeighted', () => {
  it('境界で正しい項目を選ぶ', () => {
    expect(pickWeighted([1, 2, 3], () => 0)).toBe(0);
    expect(pickWeighted([1, 2, 3], () => 1)).toBe(1);
    expect(pickWeighted([1, 2, 3], () => 2)).toBe(1);
    expect(pickWeighted([1, 2, 3], () => 3)).toBe(2);
    expect(pickWeighted([1, 2, 3], () => 5)).toBe(2);
  });
  it('重み0の項目は選ばれない', () => {
    expect(pickWeighted([0, 5], () => 0)).toBe(1);
  });
  it('合計0はエラー', () => {
    expect(() => pickWeighted([0, 0], () => 0)).toThrow(RangeError);
  });
});

describe('drawOmikuji', () => {
  it('乱数0で大吉・先頭の値になる', () => {
    const r = drawOmikuji(() => 0);
    expect(r.fortune).toBe('daikichi');
    expect(r.message).toBe(0);
    expect(r.luckyColor).toBe(COLOR_IDS[0]);
    expect(r.luckyNumber).toBe(1);
    expect(r.items.map((i) => i.item)).toEqual([...ITEM_IDS]);
    expect(r.items.every((i) => i.tier === 'good')).toBe(true);
  });
  it('乱数が最大なら大凶・悪い項目・最大のラッキーナンバー', () => {
    const r = drawOmikuji((max) => max - 1);
    expect(r.fortune).toBe('daikyo');
    expect(r.items.every((i) => i.tier === 'bad')).toBe(true);
    expect(r.luckyNumber).toBe(MAX_LUCKY_NUMBER);
  });
  it('出現頻度が重みに近い', () => {
    const rng = seededRandomInt(12345);
    const counts: Record<string, number> = {};
    const n = 20000;
    for (let i = 0; i < n; i++) {
      const f = drawOmikuji(rng).fortune;
      counts[f] = (counts[f] ?? 0) + 1;
    }
    for (const id of FORTUNE_IDS) {
      const expected = FORTUNE_WEIGHTS[id] / 100;
      expect(Math.abs((counts[id] ?? 0) / n - expected)).toBeLessThan(0.02);
    }
  });
  it('文例番号は範囲内', () => {
    const rng = seededRandomInt(7);
    for (let i = 0; i < 200; i++) {
      const r = drawOmikuji(rng);
      expect(r.message).toBeGreaterThanOrEqual(0);
      expect(r.message).toBeLessThan(VARIANTS);
      for (const item of r.items) expect(item.variant).toBeLessThan(VARIANTS);
    }
  });
});

describe('daily', () => {
  const day = new Date(2026, 0, 1, 9, 30);
  it('localDateKey はゼロ埋めする', () => {
    expect(localDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(localDateKey(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
  });
  it('同じ日・同じ名前なら時刻が違っても同じ結果', () => {
    const a = drawDaily(day, 'たろう');
    const b = drawDaily(new Date(2026, 0, 1, 23, 59), 'たろう');
    expect(b).toEqual(a);
  });
  it('名前の表記ゆれ（空白・全角半角・大文字小文字）は同じ扱い', () => {
    expect(normalizeName('  ＡＢＣ ')).toBe('abc');
    expect(drawDaily(day, ' ＡＢＣ ')).toEqual(drawDaily(day, 'abc'));
  });
  it('名前なしでも動く', () => {
    expect(drawDaily(day)).toEqual(drawDaily(day, '   '));
  });
  it('日付が変わると結果が変わりうる（30日で複数種類）', () => {
    const set = new Set<string>();
    for (let d = 1; d <= 30; d++) {
      set.add(JSON.stringify(drawDaily(new Date(2026, 5, d), 'x')));
    }
    expect(set.size).toBeGreaterThan(20);
  });
  it('名前が違うと結果が変わりうる', () => {
    const set = new Set<string>();
    for (let i = 0; i < 30; i++) {
      set.add(JSON.stringify(drawDaily(day, `user${i}`)));
    }
    expect(set.size).toBeGreaterThan(20);
  });
});

describe('prng', () => {
  it('hashString は決定的で32bit符号なし', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).not.toBe(hashString('abd'));
    expect(hashString('')).toBe(0x811c9dc5);
  });
  it('seededRandomInt は範囲内で、不正な max はエラー', () => {
    const r = seededRandomInt(1);
    for (let i = 0; i < 1000; i++) {
      const v = r(7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
    }
    expect(() => r(0)).toThrow(RangeError);
  });
});

describe('fortuneRank', () => {
  it('大吉が最大、大凶が0', () => {
    expect(fortuneRank('daikichi')).toBe(6);
    expect(fortuneRank('daikyo')).toBe(0);
  });
});
