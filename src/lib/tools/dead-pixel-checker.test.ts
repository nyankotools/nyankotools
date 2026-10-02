import { describe, it, expect } from 'vitest';
import { TEST_COLORS, cycleIndex } from './dead-pixel-checker';

describe('cycleIndex', () => {
  it('進む・戻る', () => {
    expect(cycleIndex(0, 1, 5)).toBe(1);
    expect(cycleIndex(3, -1, 5)).toBe(2);
  });

  it('末尾から先頭、先頭から末尾へ回り込む', () => {
    expect(cycleIndex(4, 1, 5)).toBe(0);
    expect(cycleIndex(0, -1, 5)).toBe(4);
  });

  it('長さが0以下なら0', () => {
    expect(cycleIndex(2, 1, 0)).toBe(0);
  });

  it('大きなdeltaでも範囲内に収まる', () => {
    expect(cycleIndex(1, -12, 5)).toBe(4);
    expect(cycleIndex(1, 12, 5)).toBe(3);
  });
});

describe('TEST_COLORS', () => {
  it('idが重複せず、hexが#rrggbb形式', () => {
    const ids = TEST_COLORS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of TEST_COLORS) expect(c.hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('白と黒を含む', () => {
    const ids = TEST_COLORS.map((c) => c.id);
    expect(ids).toContain('white');
    expect(ids).toContain('black');
  });
});
