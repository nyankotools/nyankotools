import { describe, it, expect } from 'vitest';
import {
  STATUS_CODES,
  categoryOf,
  matchesStatus,
  normalizeQuery,
} from './http-status-codes';

describe('STATUS_CODES', () => {
  it('コードが重複せず昇順で、100〜599の範囲にある', () => {
    const codes = STATUS_CODES.map((s) => s.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect([...codes].sort((a, b) => a - b)).toEqual(codes);
    expect(codes.every((c) => c >= 100 && c <= 599)).toBe(true);
  });

  it('主要コードを含む', () => {
    const codes: number[] = STATUS_CODES.map((s) => s.code);
    for (const c of [200, 301, 302, 304, 400, 401, 403, 404, 429, 500, 503]) {
      expect(codes).toContain(c);
    }
  });

  it('306（未使用）は含まない', () => {
    expect(STATUS_CODES.some((s) => (s.code as number) === 306)).toBe(false);
  });
});

describe('categoryOf', () => {
  it('分類を返す', () => {
    expect(categoryOf(100)).toBe('1xx');
    expect(categoryOf(404)).toBe('4xx');
    expect(categoryOf(599)).toBe('5xx');
  });

  it('範囲外・非整数は null', () => {
    expect(categoryOf(99)).toBeNull();
    expect(categoryOf(600)).toBeNull();
    expect(categoryOf(404.5)).toBeNull();
  });
});

describe('normalizeQuery', () => {
  it('全角・大文字・空白を揃える', () => {
    expect(normalizeQuery('  ４０４ Not  ')).toBe('404 not');
  });
});

describe('matchesStatus', () => {
  it('空クエリは全件一致', () => {
    expect(matchesStatus(404, 'Not Found', '')).toBe(true);
    expect(matchesStatus(404, 'Not Found', '   ')).toBe(true);
  });

  it('数字はコードの前方一致', () => {
    expect(matchesStatus(404, '', '404')).toBe(true);
    expect(matchesStatus(404, '', '40')).toBe(true);
    expect(matchesStatus(404, '', '4')).toBe(true);
    expect(matchesStatus(404, '', '04')).toBe(false);
    expect(matchesStatus(404, '', '500')).toBe(false);
  });

  it('全角数字でも一致する', () => {
    expect(matchesStatus(404, '', '４０４')).toBe(true);
  });

  it('4xx 形式は分類に一致する', () => {
    expect(matchesStatus(404, '', '4xx')).toBe(true);
    expect(matchesStatus(404, '', '4XX')).toBe(true);
    expect(matchesStatus(500, '', '4xx')).toBe(false);
  });

  it('文字列は大文字小文字を無視した部分一致', () => {
    expect(matchesStatus(404, 'Not Found 見つからない', 'NOT found')).toBe(
      true,
    );
    expect(matchesStatus(404, 'Not Found 見つからない', '見つから')).toBe(true);
    expect(matchesStatus(404, 'Not Found', 'gateway')).toBe(false);
  });

  it('複数語はAND条件', () => {
    expect(matchesStatus(404, 'Not Found', 'not found')).toBe(true);
    expect(matchesStatus(404, 'Not Found', 'not gateway')).toBe(false);
    expect(matchesStatus(404, 'Not Found', '4xx found')).toBe(true);
  });

  it('分類フィルタと検索語を組み合わせる', () => {
    expect(matchesStatus(404, 'Not Found', 'not', '4xx')).toBe(true);
    expect(matchesStatus(404, 'Not Found', 'not', '5xx')).toBe(false);
    expect(matchesStatus(404, 'Not Found', '', '5xx')).toBe(false);
  });
});

describe('matchesStatus（境界・特殊入力）', () => {
  it('正規表現の記号を含む検索語でも例外にならず、文字として扱う', () => {
    expect(matchesStatus(404, 'Not Found', '(')).toBe(false);
    expect(() => matchesStatus(404, 'Not Found', '.*+?[')).not.toThrow();
  });

  it('長大な検索語でも例外にならず不一致になる', () => {
    expect(matchesStatus(404, 'Not Found', 'a'.repeat(10_000))).toBe(false);
  });

  it('絵文字（サロゲートペア）を含む検索語は不一致になる', () => {
    expect(matchesStatus(404, 'Not Found', '🙂')).toBe(false);
  });

  it('前後・語間の余分な空白は無視される', () => {
    expect(matchesStatus(404, 'Not Found', '  not    found  ')).toBe(true);
  });

  it('範囲外のコードは分類フィルタで常に除外される', () => {
    expect(matchesStatus(600, '', '', '5xx')).toBe(false);
    expect(matchesStatus(600, '', '')).toBe(true);
  });
});
