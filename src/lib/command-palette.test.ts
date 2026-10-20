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

  it('空白区切りの語はすべて一致した項目だけを返す（AND検索）', () => {
    expect(rankTools(tools, 'json 整形').map((t) => t.slug)).toEqual(['a']);
    expect(rankTools(tools, 'json zzz')).toEqual([]);
  });

  it('ひらがなでもカタカナの名前に一致する', () => {
    expect(rankTools(tools, 'えんこーど').map((t) => t.slug)).toEqual(['b']);
  });

  it('半角カナ・「ー」を含む名前にも一致する', () => {
    const extra = [
      tool('d', 'カウント変換'),
      tool('e', 'コーヒー換算'),
      tool('f', 'ヴィジュアル'),
    ];
    expect(rankTools(extra, 'ｶｳﾝﾄ').map((t) => t.slug)).toEqual(['d']);
    expect(rankTools(extra, 'こーひー').map((t) => t.slug)).toEqual(['e']);
    expect(rankTools(extra, 'コーヒー').map((t) => t.slug)).toEqual(['e']);
    expect(rankTools(extra, 'ゔぃじゅある').map((t) => t.slug)).toEqual(['f']);
    expect(rankTools(extra, 'びじゅある')).toEqual([]);
  });

  it('AND検索の順位は最も弱い一致で決まる', () => {
    const extra = [
      tool('x', 'JSON整形'), // json: 名前の前方一致(0), 整形: 名前(1) → 1
      tool('y', 'Base64変換', ['json'], '整形の例'), // json: 別名(2), 整形: 説明(4) → 4
      tool('z', 'JSONパス', [], '整形'), // json: 名前(0), 整形: 説明(4) → 4
    ];
    expect(rankTools(extra, 'json 整形').map((t) => t.slug)).toEqual([
      'x',
      'y',
      'z',
    ]);
  });

  it('空白のみ（全角含む）のクエリは全件を返す', () => {
    expect(rankTools(tools, '　 　')).toEqual(tools);
  });

  it('絵文字（サロゲートペア）を含む名前に一致する', () => {
    const extra = [tool('g', '🐱ネコ図鑑')];
    expect(rankTools(extra, '🐱').map((t) => t.slug)).toEqual(['g']);
    expect(rankTools(extra, '🐶')).toEqual([]);
  });

  it('一致が無ければ空、limit で件数を絞る', () => {
    expect(rankTools(tools, 'zzz')).toEqual([]);
    expect(rankTools(tools, 'json', 1)).toHaveLength(1);
  });
});
