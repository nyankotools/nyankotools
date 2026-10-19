import { describe, it, expect } from 'vitest';
import {
  PATTERNS,
  PATTERN_CATEGORIES,
  compilePattern,
  matchesPattern,
  testExample,
  toLiteral,
} from './regex-pattern-library';

describe('PATTERNS のデータ整合性', () => {
  it('id が一意で、カテゴリが定義済みである', () => {
    const ids = PATTERNS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PATTERNS) {
      expect(PATTERN_CATEGORIES).toContain(p.category);
    }
  });

  it('すべてのパターンがコンパイルでき、例を最低1件ずつ持つ', () => {
    for (const p of PATTERNS) {
      expect(() => compilePattern(p), p.id).not.toThrow();
      expect(p.matches.length, p.id).toBeGreaterThan(0);
      expect(p.nonMatches.length, p.id).toBeGreaterThan(0);
    }
  });

  it('全カテゴリにパターンがある', () => {
    for (const c of PATTERN_CATEGORIES) {
      expect(
        PATTERNS.some((p) => p.category === c),
        c,
      ).toBe(true);
    }
  });
});

describe('各パターンの一致/不一致の例', () => {
  for (const p of PATTERNS) {
    describe(p.id, () => {
      for (const ex of p.matches) {
        it(`一致する: ${JSON.stringify(ex)}`, () => {
          expect(testExample(p, ex)).toBe(true);
        });
      }
      for (const ex of p.nonMatches) {
        it(`一致しない: ${JSON.stringify(ex)}`, () => {
          expect(testExample(p, ex)).toBe(false);
        });
      }
    });
  }
});

describe('testExample', () => {
  it('g フラグでも繰り返し呼んで結果が変わらない', () => {
    const p = { pattern: 'a', flags: 'g' };
    expect(testExample(p, 'a')).toBe(true);
    expect(testExample(p, 'a')).toBe(true);
  });
});

describe('matchesPattern', () => {
  it('空クエリはカテゴリだけで絞り込む', () => {
    expect(matchesPattern('japan', 'x', '', 'all')).toBe(true);
    expect(matchesPattern('japan', 'x', '', 'web')).toBe(false);
    expect(matchesPattern('web', 'x', '  ', 'web')).toBe(true);
  });

  it('空白区切りの語はすべて含まれる必要があり、大文字小文字は無視する', () => {
    expect(matchesPattern('web', 'Email address', 'email addr', 'all')).toBe(
      true,
    );
    expect(matchesPattern('web', 'Email address', 'email phone', 'all')).toBe(
      false,
    );
  });
});

describe('matchesPattern（カテゴリと語の組み合わせ）', () => {
  it('カテゴリが合わなければ語が一致しても false', () => {
    expect(matchesPattern('japan', 'email address', 'email', 'web')).toBe(
      false,
    );
  });

  it('日本語の語で検索でき、全角の語は半角の本文に一致しない（正規化しない）', () => {
    expect(
      matchesPattern('japan', 'マイナンバー 12桁', 'マイナンバー', 'all'),
    ).toBe(true);
    expect(matchesPattern('japan', 'マイナンバー 12桁', '１２', 'all')).toBe(
      false,
    );
  });
});

describe('toLiteral', () => {
  it('スラッシュをエスケープして /pattern/flags にする', () => {
    expect(toLiteral({ pattern: '^a$', flags: 'i' })).toBe('/^a$/i');
    expect(toLiteral({ pattern: 'a/b', flags: '' })).toBe('/a\\/b/');
  });
});
