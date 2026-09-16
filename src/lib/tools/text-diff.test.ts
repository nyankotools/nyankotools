import { describe, expect, it } from 'vitest';
import { diffLines, getDiffStats } from './text-diff';

describe('diffLines', () => {
  it('完全に同じテキストはすべてequalになる', () => {
    const result = diffLines('a\nb\nc', 'a\nb\nc');
    expect(result).toEqual([
      { type: 'equal', text: 'a', leftLine: 1, rightLine: 1 },
      { type: 'equal', text: 'b', leftLine: 2, rightLine: 2 },
      { type: 'equal', text: 'c', leftLine: 3, rightLine: 3 },
    ]);
  });

  it('末尾に行が追加された場合をaddedとして検出する', () => {
    const result = diffLines('a\nb', 'a\nb\nc');
    expect(result).toEqual([
      { type: 'equal', text: 'a', leftLine: 1, rightLine: 1 },
      { type: 'equal', text: 'b', leftLine: 2, rightLine: 2 },
      { type: 'added', text: 'c', leftLine: null, rightLine: 3 },
    ]);
  });

  it('行が削除された場合をremovedとして検出する', () => {
    const result = diffLines('a\nb\nc', 'a\nc');
    expect(result).toEqual([
      { type: 'equal', text: 'a', leftLine: 1, rightLine: 1 },
      { type: 'removed', text: 'b', leftLine: 2, rightLine: null },
      { type: 'equal', text: 'c', leftLine: 3, rightLine: 2 },
    ]);
  });

  it('行の変更をremoved+addedのペアとして検出する', () => {
    const result = diffLines('a\nb\nc', 'a\nX\nc');
    expect(result).toEqual([
      { type: 'equal', text: 'a', leftLine: 1, rightLine: 1 },
      { type: 'removed', text: 'b', leftLine: 2, rightLine: null },
      { type: 'added', text: 'X', leftLine: null, rightLine: 2 },
      { type: 'equal', text: 'c', leftLine: 3, rightLine: 3 },
    ]);
  });

  it('ignoreWhitespaceを指定すると前後の空白差を無視する', () => {
    const result = diffLines('  a  ', 'a', { ignoreWhitespace: true });
    expect(result).toEqual([
      { type: 'equal', text: '  a  ', leftLine: 1, rightLine: 1 },
    ]);
  });

  it('ignoreCaseを指定すると大文字小文字の差を無視する', () => {
    const result = diffLines('Hello', 'hello', { ignoreCase: true });
    expect(result).toEqual([
      { type: 'equal', text: 'Hello', leftLine: 1, rightLine: 1 },
    ]);
  });

  it('空文字列同士は空行1件のequalになる', () => {
    const result = diffLines('', '');
    expect(result).toEqual([
      { type: 'equal', text: '', leftLine: 1, rightLine: 1 },
    ]);
  });
});

describe('getDiffStats', () => {
  it('各typeの件数を集計する', () => {
    const lines = diffLines('a\nb\nc', 'a\nX\nc\nd');
    expect(getDiffStats(lines)).toEqual({ added: 2, removed: 1, equal: 2 });
  });
});
