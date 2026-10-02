import { describe, it, expect } from 'vitest';
import {
  formatPath,
  getEntries,
  getKind,
  getValueAtPath,
  parseJsonTree,
  searchTree,
  summarize,
} from './json-tree-viewer';

describe('parseJsonTree', () => {
  it('成功・空・不正を区別する', () => {
    expect(parseJsonTree('{"a":1}')).toEqual({
      success: true,
      value: { a: 1 },
    });
    expect(parseJsonTree(' ')).toEqual({ success: false, reason: 'empty' });
    expect(parseJsonTree('{a')).toEqual({
      success: false,
      reason: 'invalid-json',
    });
  });
});

describe('getKind / getEntries / summarize', () => {
  it('種類を判定する', () => {
    expect(getKind(null)).toBe('null');
    expect(getKind([])).toBe('array');
    expect(getKind({})).toBe('object');
    expect(getKind('a')).toBe('string');
    expect(getKind(1)).toBe('number');
    expect(getKind(false)).toBe('boolean');
  });

  it('子要素と要約を返す', () => {
    expect(getEntries({ a: 1, b: 2 })).toEqual([
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ]);
    expect(getEntries(['x'])).toEqual([{ key: 0, value: 'x' }]);
    expect(getEntries(1)).toEqual([]);
    expect(summarize({ a: 1, b: 2 })).toBe('{2}');
    expect(summarize([1, 2, 3])).toBe('[3]');
    expect(summarize('a')).toBe('');
  });
});

describe('formatPath', () => {
  const path = ['items', 0, 'first-name', 'a/b~c'];
  it('JSONPath', () => {
    expect(formatPath([], 'jsonpath')).toBe('$');
    expect(formatPath(path, 'jsonpath')).toBe(
      '$.items[0]["first-name"]["a/b~c"]',
    );
  });
  it('JSON Pointer（~ と / をエスケープ）', () => {
    expect(formatPath([], 'pointer')).toBe('');
    expect(formatPath(path, 'pointer')).toBe('/items/0/first-name/a~1b~0c');
  });
  it('JavaScript式', () => {
    expect(formatPath(path, 'javascript')).toBe(
      'data.items[0]["first-name"]["a/b~c"]',
    );
  });
});

describe('searchTree', () => {
  const data = { user: { name: 'Taro', tags: ['Admin', 'dev'] }, id: 7 };

  it('キーと値の両方を大文字小文字無視で探す', () => {
    const { matches } = searchTree(data, 'ad');
    expect(matches).toEqual([
      { path: ['user', 'tags', 0], keyMatched: false, valueMatched: true },
    ]);
    const byKey = searchTree(data, 'NAME').matches;
    expect(byKey).toEqual([
      { path: ['user', 'name'], keyMatched: true, valueMatched: false },
    ]);
  });

  it('数値や真偽値の値にも一致する', () => {
    expect(searchTree(data, '7').matches.map((m) => m.path)).toEqual([['id']]);
  });

  it('空クエリは何も返さず、上限で打ち切る', () => {
    expect(searchTree(data, '')).toEqual({ matches: [], truncated: false });
    const many = Array.from({ length: 10 }, () => 'x');
    const result = searchTree(many, 'x', 3);
    expect(result.matches).toHaveLength(3);
    expect(result.truncated).toBe(true);
  });
});

describe('getValueAtPath', () => {
  it('パスの値を返し、無ければ undefined', () => {
    const data = { a: [{ b: 1 }] };
    expect(getValueAtPath(data, ['a', 0, 'b'])).toBe(1);
    expect(getValueAtPath(data, ['a', 1, 'b'])).toBeUndefined();
    expect(getValueAtPath(data, [])).toBe(data);
  });
});
