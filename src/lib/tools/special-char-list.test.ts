import { describe, it, expect } from 'vitest';
import { charGroups, codePointLabel, matchesQuery } from './special-char-list';

describe('charGroups', () => {
  it('グループIDが重複せず、各グループに文字とキーワードがある', () => {
    const ids = charGroups.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const group of charGroups) {
      expect(group.items.length).toBeGreaterThan(0);
      expect(group.keywords.length).toBeGreaterThan(0);
    }
  });

  it('グループ内で同じ文字が重複しない', () => {
    for (const group of charGroups) {
      const duplicated = group.items.filter(
        (item, i) => group.items.indexOf(item) !== i,
      );
      expect(duplicated, group.id).toEqual([]);
    }
  });

  it('グループ間で同じ文字が重複しない', () => {
    const allItems = charGroups.flatMap((g) => g.items);
    const duplicates: string[] = [];
    const seen = new Set<string>();
    for (const item of allItems) {
      if (seen.has(item)) {
        duplicates.push(item);
      }
      seen.add(item);
    }
    expect(duplicates).toEqual([]);
  });

  it('空の要素や空白だけの要素を含まない', () => {
    for (const group of charGroups) {
      for (const item of group.items) {
        expect(item.trim(), group.id).not.toBe('');
      }
    }
  });
});

describe('matchesQuery', () => {
  it('空の検索語はすべてに一致する', () => {
    expect(matchesQuery('星 star', '')).toBe(true);
    expect(matchesQuery('星 star', '  ')).toBe(true);
  });

  it('大文字小文字を区別せず、複数語はAND条件', () => {
    expect(matchesQuery('星 star ★', 'STAR')).toBe(true);
    expect(matchesQuery('星 star ★', '星 star')).toBe(true);
    expect(matchesQuery('星 star ★', '星　heart')).toBe(false);
  });

  it('文字そのものでも検索できる', () => {
    expect(matchesQuery('星 star ★☆', '☆')).toBe(true);
  });
});

describe('codePointLabel', () => {
  it('コードポイントを U+XXXX で返す', () => {
    expect(codePointLabel('★')).toBe('U+2605');
    expect(codePointLabel('😀')).toBe('U+1F600');
    expect(codePointLabel('ab')).toBe('U+0061 U+0062');
  });

  it('サロゲートペア（絵文字）のコードポイントを正しく返す', () => {
    // ZWJ sequence (zero-width joiner) を含む絵文字
    expect(codePointLabel('👨‍👩‍👧‍👦')).toContain('U+1F468');
    expect(codePointLabel('👨‍👩‍👧‍👦')).toContain('U+200D');
  });

  it('複数の異なる絵文字を処理する', () => {
    expect(codePointLabel('😀😃')).toContain('U+1F600');
    expect(codePointLabel('😀😃')).toContain('U+1F603');
  });
});
