import { describe, it, expect } from 'vitest';
import { updates } from './updates';
import { tools } from './tools';

describe('updates data', () => {
  const slugs = new Set(tools.map((t) => t.slug));

  it('toolSlugs はすべて tools.ts に登録されている', () => {
    const unknown = updates.flatMap((u) =>
      (u.toolSlugs ?? [])
        .filter((s) => !slugs.has(s))
        .map((s) => `${u.date}: ${s}`),
    );
    expect(unknown).toEqual([]);
  });

  it('同じ更新内で toolSlugs が重複していない', () => {
    const dups = updates.flatMap((u) => {
      const list = u.toolSlugs ?? [];
      return list
        .filter((s, i) => list.indexOf(s) !== i)
        .map((s) => `${u.date}: ${s}`);
    });
    expect(dups).toEqual([]);
  });

  it('日付は実在する YYYY-MM-DD 形式である', () => {
    for (const { date } of updates) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const d = new Date(`${date}T00:00:00Z`);
      expect(Number.isNaN(d.getTime())).toBe(false);
      expect(d.toISOString().slice(0, 10)).toBe(date);
    }
  });

  it('日付が重複していない', () => {
    const dates = updates.map((u) => u.date);
    expect(dates.filter((d, i) => dates.indexOf(d) !== i)).toEqual([]);
  });

  it('ja/en の summary が空でない', () => {
    for (const u of updates) {
      for (const locale of ['ja', 'en'] as const) {
        expect(
          u.translations[locale].summary.trim().length,
          `${u.date} ${locale}`,
        ).toBeGreaterThan(0);
      }
    }
  });
});
