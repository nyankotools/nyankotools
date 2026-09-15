import { describe, expect, it } from 'vitest';
import { filterTools, getCategories } from './home-filter';
import type { Tool } from '../data/tools';

const tools: Tool[] = [
  {
    slug: 'char-counter',
    name: '文字数カウント',
    description: 'テキストの文字数を数えます。',
    category: 'テキスト',
  },
  {
    slug: 'json-formatter',
    name: 'JSON整形ツール',
    description: 'JSONを見やすく整形します。',
    category: '変換',
  },
  {
    slug: 'base64-encoder',
    name: 'Base64エンコーダー',
    description: 'テキストをBase64に変換します。',
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
    expect(filterTools(tools, { category: '変換' })).toEqual([
      tools[1],
      tools[2],
    ]);
  });

  it('treats category "all" as no filter', () => {
    expect(filterTools(tools, { category: 'all' })).toEqual(tools);
  });

  it('combines query and category filters', () => {
    expect(filterTools(tools, { query: 'base64', category: '変換' })).toEqual([
      tools[2],
    ]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterTools(tools, { query: '存在しない' })).toEqual([]);
  });

  it('ignores surrounding whitespace in the query', () => {
    expect(filterTools(tools, { query: '  json  ' })).toEqual([tools[1]]);
  });
});

describe('getCategories', () => {
  it('returns unique categories in first-seen order', () => {
    expect(getCategories(tools)).toEqual(['テキスト', '変換']);
  });
});
