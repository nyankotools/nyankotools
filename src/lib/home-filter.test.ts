import { describe, expect, it } from 'vitest';
import { filterTools, groupByCategory } from './home-filter';
import type { LocalizedTool } from '../data/tools';

const tools: LocalizedTool[] = [
  {
    slug: 'char-counter',
    name: '文字数カウント',
    keywords: ['字数'],
    description: 'テキストの文字数を数えます。',
    categoryId: 'text',
    category: 'テキスト',
  },
  {
    slug: 'json-formatter',
    name: 'JSON整形ツール',
    keywords: ['pretty print'],
    description: 'JSONを見やすく整形します。',
    categoryId: 'data',
    category: '変換',
  },
  {
    slug: 'base64-encoder',
    name: 'Base64エンコーダー',
    keywords: [],
    description: 'テキストをBase64に変換します。',
    categoryId: 'data',
    category: '変換',
  },
];

describe('filterTools', () => {
  it('returns all tools when no filter is given', () => {
    expect(filterTools(tools)).toEqual(tools);
  });

  it('filters by name substring, case-insensitively', () => {
    expect(filterTools(tools, { query: 'json' })).toEqual([tools[1]]);
  });

  it('filters by description substring', () => {
    expect(filterTools(tools, { query: 'base64に変換' })).toEqual([tools[2]]);
  });

  it('filters by category', () => {
    expect(filterTools(tools, { category: 'data' })).toEqual([
      tools[1],
      tools[2],
    ]);
  });

  it('treats category "all" as no filter', () => {
    expect(filterTools(tools, { category: 'all' })).toEqual(tools);
  });

  it('combines query and category filters', () => {
    expect(filterTools(tools, { query: 'base64', category: 'data' })).toEqual([
      tools[2],
    ]);
  });

  it('matches keywords (aliases), case-insensitively', () => {
    expect(filterTools(tools, { query: 'PRETTY' })).toEqual([tools[1]]);
    expect(filterTools(tools, { query: '字数' })).toEqual([tools[0]]);
  });

  it('ignores full-width/half-width differences', () => {
    expect(filterTools(tools, { query: 'ＰＲＥＴＴＹ' })).toEqual([tools[1]]);
  });

  it('treats a full-width-space-only query as no filter', () => {
    expect(filterTools(tools, { query: '　　' })).toEqual(tools);
  });

  it('treats half-width katakana as full-width', () => {
    expect(filterTools(tools, { query: 'ｶｳﾝﾄ' })).toEqual([tools[0]]);
  });

  it('does not throw on regex meta characters in the query', () => {
    for (const q of ['(', '[', '*', '.*', '\\', '?']) {
      expect(() => filterTools(tools, { query: q })).not.toThrow();
    }
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterTools(tools, { query: '存在しない' })).toEqual([]);
  });

  it('ignores surrounding whitespace in the query', () => {
    expect(filterTools(tools, { query: '  json  ' })).toEqual([tools[1]]);
  });
});

describe('groupByCategory', () => {
  it('groups tools under their category, preserving first-seen category order', () => {
    expect(groupByCategory(tools)).toEqual([
      { id: 'text', label: 'テキスト', tools: [tools[0]] },
      { id: 'data', label: '変換', tools: [tools[1], tools[2]] },
    ]);
  });

  it('returns an empty array when there are no tools', () => {
    expect(groupByCategory([])).toEqual([]);
  });
});
