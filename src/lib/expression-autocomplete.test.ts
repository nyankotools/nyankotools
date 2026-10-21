import { describe, expect, it } from 'vitest';
import {
  MAX_SUGGESTIONS,
  applyCompletion,
  suggestCompletions,
  wordAtCursor,
} from './expression-autocomplete';

describe('wordAtCursor', () => {
  it('カーソル直前の識別子を返す', () => {
    expect(wordAtCursor('1+si', 4)).toEqual({ start: 2, end: 4, prefix: 'si' });
    expect(wordAtCursor('2sin', 4)).toEqual({
      start: 1,
      end: 4,
      prefix: 'sin',
    });
    expect(wordAtCursor('log2', 4)?.prefix).toBe('log2');
  });
  it('識別子がなければ null', () => {
    expect(wordAtCursor('', 0)).toBeNull();
    expect(wordAtCursor('12', 2)).toBeNull();
    expect(wordAtCursor('sin(', 4)).toBeNull();
  });
  it('カーソルが途中なら手前までを対象にする', () => {
    expect(wordAtCursor('sinx', 3)?.prefix).toBe('sin');
  });
});

describe('suggestCompletions', () => {
  it('前方一致で関数・定数・変数を返し、関数は開き括弧付き', () => {
    const r = suggestCompletions('si');
    expect(r.map((c) => c.name)).toEqual(['sin', 'sinh', 'sign']);
    expect(r[0].insert).toBe('sin(');
    expect(suggestCompletions('pi')).toEqual([]);
    expect(suggestCompletions('ta').map((c) => c.name)).toContain('tau');
  });
  it('変数が先頭に来る', () => {
    expect(suggestCompletions('a', ['ans'])[0]).toMatchObject({
      name: 'ans',
      kind: 'variable',
    });
  });
  it('大文字小文字を区別せず、空や該当なしは空配列', () => {
    expect(suggestCompletions('SIN').length).toBeGreaterThan(0);
    expect(suggestCompletions('')).toEqual([]);
    expect(suggestCompletions('zzz')).toEqual([]);
  });
  it('件数を制限する', () => {
    expect(suggestCompletions('a').length).toBeLessThanOrEqual(MAX_SUGGESTIONS);
    // 候補が上限を超える場合は先頭（変数側）から MAX_SUGGESTIONS 件だけ返す
    const many = Array.from({ length: 12 }, (_, i) => `a${i}`);
    const r = suggestCompletions('a', many);
    expect(r).toHaveLength(MAX_SUGGESTIONS);
    expect(r[0].name).toBe('a0');
  });
});

describe('applyCompletion', () => {
  it('単語を候補で置き換え、カーソルを末尾に置く', () => {
    const word = wordAtCursor('1+si', 4)!;
    const [sin] = suggestCompletions('si');
    expect(applyCompletion('1+si', word, sin)).toEqual({
      text: '1+sin(',
      cursor: 6,
    });
  });
  it('単語の途中で確定したら後ろの識別子も置き換える', () => {
    const word = wordAtCursor('sin', 2)!;
    const [sin] = suggestCompletions('si');
    expect(applyCompletion('sin', word, sin)).toEqual({
      text: 'sin(',
      cursor: 4,
    });
  });
  it('カーソル以降の文字列は保つ', () => {
    const word = wordAtCursor('si+2', 2)!;
    const [sin] = suggestCompletions('si');
    expect(applyCompletion('si+2', word, sin)).toEqual({
      text: 'sin(+2',
      cursor: 4,
    });
  });
});
