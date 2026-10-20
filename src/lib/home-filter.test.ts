import { describe, expect, it } from 'vitest';
import {
  filterTools,
  groupByCategory,
  normalize,
  splitQuery,
} from './home-filter';
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
  it('空白区切りの語はすべて含む項目だけに絞る（AND検索）', () => {
    expect(filterTools(tools, { query: 'テキスト 変換' })).toEqual([tools[2]]);
    expect(filterTools(tools, { query: 'json　見やすく' })).toEqual([tools[1]]);
    expect(filterTools(tools, { query: 'json 存在しない' })).toEqual([]);
  });

  it('ひらがな・カタカナの違いを吸収する', () => {
    expect(filterTools(tools, { query: 'えんこーだー' })).toEqual([tools[2]]);
    expect(filterTools(tools, { query: 'かうんと' })).toEqual([tools[0]]);
  });

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

describe('normalize', () => {
  it('カタカナをひらがなに揃える', () => {
    expect(normalize('グラデーション')).toBe('ぐらでーしょん');
    expect(normalize('ヵヶ')).toBe('ゕゖ');
  });

  it('長音「ー」は残し、ひらがなと一致させる', () => {
    expect(normalize('コーヒー')).toBe('こーひー');
    expect(normalize('ー')).toBe('ー');
    expect(normalize('こーひー')).toBe(normalize('コーヒー'));
  });

  it('ヴはゔになり、ビ（び）とは区別される', () => {
    expect(normalize('ヴィ')).toBe('ゔぃ');
    expect(normalize('ビ')).toBe('び');
    expect(normalize('ヴ')).not.toBe(normalize('ビ'));
  });

  it('半角カナ（濁点・半濁点含む）も全角のひらがなに揃える', () => {
    expect(normalize('ｶﾞｷﾞｸﾞ')).toBe('がぎぐ');
    expect(normalize('ｳﾞｨ')).toBe('ゔぃ');
    expect(normalize('ﾊﾟ')).toBe('ぱ');
  });

  it('漢字・英数字・絵文字（サロゲートペア）は壊さない', () => {
    expect(normalize('文字数')).toBe('文字数');
    expect(normalize('ＡＢＣ')).toBe('abc');
    expect(normalize('🐱ネコ')).toBe('🐱ねこ');
  });

  it('空文字はそのまま空文字', () => {
    expect(normalize('')).toBe('');
  });
});

describe('splitQuery', () => {
  it('空・空白のみ（全角含む）・改行のみは空配列', () => {
    expect(splitQuery('')).toEqual([]);
    expect(splitQuery('   ')).toEqual([]);
    expect(splitQuery('　 　')).toEqual([]);
    expect(splitQuery('\n\t')).toEqual([]);
  });

  it('半角・全角空白、タブ、改行（LF/CRLF/CR）で区切る', () => {
    expect(splitQuery('json 整形')).toEqual(['json', '整形']);
    expect(splitQuery('a　b\tc\nd\r\ne\rf')).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
    ]);
  });

  it('連続する空白は1つの区切りとして扱う', () => {
    expect(splitQuery('  json   整形  ')).toEqual(['json', '整形']);
  });

  it('全角英数字・半角カナを正規化してから区切る', () => {
    expect(splitQuery('ＪＳＯＮ　ｶｳﾝﾄ')).toEqual(['json', 'かうんと']);
  });

  it('非常に長い入力でも1語として扱える', () => {
    const long = 'あ'.repeat(10000);
    expect(splitQuery(long)).toEqual([normalize(long)]);
    expect(splitQuery(`${long} json`)).toHaveLength(2);
  });
});

describe('filterTools（表記ゆれ・AND検索の追加ケース）', () => {
  const variants: LocalizedTool[] = [
    {
      slug: 'coffee',
      name: 'コーヒー換算',
      keywords: [],
      description: 'カップ数を計算します。',
      categoryId: 'calc',
      category: '計算',
    },
    {
      slug: 'visual',
      name: 'ヴィジュアル配色',
      keywords: ['ｶﾗｰ'],
      description: '配色を確認します。',
      categoryId: 'image',
      category: 'デザイン',
    },
    {
      slug: 'emoji',
      name: '🐱ネコ図鑑',
      keywords: [],
      description: '猫の絵文字を並べます。',
      categoryId: 'games',
      category: 'お遊び',
    },
  ];

  it('「ー」を含む語は長音のまま、ひらがな入力でも一致する', () => {
    expect(filterTools(variants, { query: 'こーひー' })).toEqual([variants[0]]);
    expect(filterTools(variants, { query: 'コーヒー' })).toEqual([variants[0]]);
    expect(filterTools(variants, { query: 'こひー' })).toEqual([]);
    // 「ー」を含むのは coffee の名前と visual のキーワード（カラー）
    expect(filterTools(variants, { query: 'ー' })).toEqual([
      variants[0],
      variants[1],
    ]);
  });

  it('ヴを含む語は ゔ / ヴ / ｳﾞ のどの表記でも一致する', () => {
    expect(filterTools(variants, { query: 'ゔぃじゅある' })).toEqual([
      variants[1],
    ]);
    expect(filterTools(variants, { query: 'ヴィジュアル' })).toEqual([
      variants[1],
    ]);
    expect(filterTools(variants, { query: 'ｳﾞｨｼﾞｭｱﾙ' })).toEqual([variants[1]]);
    expect(filterTools(variants, { query: 'びじゅある' })).toEqual([]);
  });

  it('半角カナのキーワードにも一致する', () => {
    expect(filterTools(variants, { query: 'からー' })).toEqual([variants[1]]);
  });

  it('絵文字（サロゲートペア）を含む語を検索できる', () => {
    expect(filterTools(variants, { query: '🐱' })).toEqual([variants[2]]);
    expect(filterTools(variants, { query: '🐱 図鑑' })).toEqual([variants[2]]);
    expect(filterTools(variants, { query: '🐶' })).toEqual([]);
  });

  it('同じ語の重複指定でも結果は変わらない', () => {
    expect(filterTools(variants, { query: 'ネコ ネコ' })).toEqual([
      variants[2],
    ]);
  });

  it('AND検索はカテゴリ絞り込みと併用できる', () => {
    expect(
      filterTools(variants, { query: '配色 確認', category: 'image' }),
    ).toEqual([variants[1]]);
    expect(
      filterTools(variants, { query: '配色 確認', category: 'calc' }),
    ).toEqual([]);
  });

  it('全角空白のみのクエリでも、カテゴリ指定が効く', () => {
    expect(filterTools(variants, { query: '　', category: 'games' })).toEqual([
      variants[2],
    ]);
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
