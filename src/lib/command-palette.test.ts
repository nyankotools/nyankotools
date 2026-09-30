import { describe, expect, it } from 'vitest';
import { rankTools } from './command-palette';
import type { LocalizedTool } from '../data/tools';

function tool(
  slug: string,
  name: string,
  keywords: string[] = [],
  description = '',
): LocalizedTool {
  return {
    slug,
    name,
    keywords,
    description,
    categoryId: 'text',
    category: 'テキスト',
  };
}

const tools = [
  tool('a', 'JSON整形', ['json'], 'データを整形'),
  tool('b', 'Base64変換', ['エンコード'], 'JSON に使える'),
  tool('c', 'JSONパス', [], ''),
];

describe('rankTools', () => {
  it('空クエリは全件を登録順で返す', () => {
    expect(rankTools(tools, '  ')).toEqual(tools);
  });

  it('名前の前方一致 → 説明の順に並べる', () => {
    expect(rankTools(tools, 'json').map((t) => t.slug)).toEqual([
      'a',
      'c',
      'b',
    ]);
  });

  it('別名（keywords）にも一致する', () => {
    expect(rankTools(tools, 'エンコ').map((t) => t.slug)).toEqual(['b']);
  });

  it('全角・大文字小文字の表記ゆれを吸収する', () => {
    expect(rankTools(tools, 'ＢＡＳＥ64').map((t) => t.slug)).toEqual(['b']);
  });

  it('一致が無ければ空、limit で件数を絞る', () => {
    expect(rankTools(tools, 'zzz')).toEqual([]);
    expect(rankTools(tools, 'json', 1)).toHaveLength(1);
  });
});
