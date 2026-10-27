import { describe, expect, it } from 'vitest';
import { cyrb53, unitHash } from './hash';

describe('hash', () => {
  it('cyrb53 は実装を変えると全員の結果が変わるので値を固定する', () => {
    expect([cyrb53('a'), cyrb53('neko'), cyrb53('neko', 1)])
      .toMatchInlineSnapshot(`
      [
        7929297801672961,
        8384364317539135,
        3567877750527171,
      ]
    `);
  });

  it('cyrb53 は 53bit の非負整数', () => {
    for (const s of ['', 'a', 'あいうえお', '🐈'.repeat(50)]) {
      const h = cyrb53(s);
      expect(Number.isSafeInteger(h)).toBe(true);
      expect(h).toBeGreaterThanOrEqual(0);
    }
  });

  it('unitHash は (0, 1) に収まり、seed の上位bitも結果に効く', () => {
    const seed = 2 ** 40 + 123;
    const u = unitHash(seed, 'k');
    expect(u).toBeGreaterThan(0);
    expect(u).toBeLessThan(1);
    expect(unitHash(seed, 'k')).toBe(u);
    expect(unitHash(seed + 2 ** 32, 'k')).not.toBe(u);
    expect(unitHash(seed, 'k2')).not.toBe(u);
  });

  it('unitHash は seed の最大値・0 付近でも (0, 1) に収まる', () => {
    for (const seed of [0, 1, 2 ** 32 - 1, 2 ** 32, 2 ** 53 - 1]) {
      for (const key of ['', 'rarity', 'a|b']) {
        const u = unitHash(seed, key);
        expect(u).toBeGreaterThan(0);
        expect(u).toBeLessThan(1);
      }
    }
  });

  it('unitHash はおおむね一様（1万キーの平均が 0.5 付近、四分位に均等に入る）', () => {
    const n = 10000;
    const buckets = [0, 0, 0, 0];
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const u = unitHash(123456789, `k${i}`);
      sum += u;
      buckets[Math.floor(u * 4)]++;
    }
    expect(Math.abs(sum / n - 0.5)).toBeLessThan(0.01);
    for (const b of buckets) {
      expect(Math.abs(b / n - 0.25)).toBeLessThan(0.02);
    }
  });
});
