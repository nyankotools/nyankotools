import { describe, expect, it } from 'vitest';
import {
  countFrequency,
  toCsv,
  tokenize,
  type FrequencyOptions,
} from './word-frequency';

const base: FrequencyOptions = {
  unit: 'word',
  ignoreCase: true,
  skipSymbols: true,
  topN: 0,
};

describe('countFrequency (word)', () => {
  it('英語の単語を大文字小文字を区別せず数える', () => {
    const r = countFrequency('The cat and the Dog and THE bird', base);
    expect(r.entries[0]).toMatchObject({ item: 'the', count: 3 });
    expect(r.entries[1]).toMatchObject({ item: 'and', count: 2 });
    expect(r.total).toBe(8);
    expect(r.unique).toBe(5);
  });

  it('ignoreCase=false なら区別する', () => {
    const r = countFrequency('A a A', { ...base, ignoreCase: false });
    expect(r.entries.map((e) => [e.item, e.count])).toEqual([
      ['A', 2],
      ['a', 1],
    ]);
  });

  it('句読点は単語に含めない', () => {
    const r = countFrequency('hello, hello! world.', base);
    expect(r.entries[0]).toMatchObject({ item: 'hello', count: 2 });
    expect(r.unique).toBe(2);
  });

  it('同数は初出順になる', () => {
    const r = countFrequency('b a c', base);
    expect(r.entries.map((e) => e.item)).toEqual(['b', 'a', 'c']);
  });

  it('割合を計算する', () => {
    const r = countFrequency('a a a b', base);
    expect(r.entries[0].percent).toBeCloseTo(75);
    expect(r.entries[1].percent).toBeCloseTo(25);
  });

  it('日本語の文章も単語に分割して数える', () => {
    const r = countFrequency('猫と犬と猫', base);
    expect(r.total).toBeGreaterThanOrEqual(3);
    expect(r.entries.find((e) => e.item === '猫')?.count).toBe(2);
  });
});

describe('countFrequency (char)', () => {
  const opt = { ...base, unit: 'char' as const };

  it('文字単位で数える', () => {
    const r = countFrequency('ああいう', opt);
    expect(r.entries[0]).toMatchObject({ item: 'あ', count: 2 });
    expect(r.total).toBe(4);
  });

  it('空白・句読点・記号を除く', () => {
    const r = countFrequency('あ、あ。 \n!い', opt);
    expect(r.total).toBe(3);
  });

  it('skipSymbols=false なら空白や記号も数える', () => {
    const r = countFrequency('a a!', { ...opt, skipSymbols: false });
    expect(r.total).toBe(4);
    expect(r.entries[0]).toMatchObject({ item: 'a', count: 2 });
  });

  it('絵文字（ZWJ連結）を1文字として数える', () => {
    const family = '👨‍👩‍👧';
    const r = countFrequency(family + family, opt);
    expect(r.total).toBe(2);
    expect(r.unique).toBe(1);
  });

  it('サロゲートペアを分割しない', () => {
    const r = countFrequency('𠮷𠮷', opt);
    expect(r.entries[0]).toMatchObject({ item: '𠮷', count: 2 });
  });

  it('大文字小文字の無視は文字単位にも効く', () => {
    expect(countFrequency('aA', opt).unique).toBe(1);
    expect(countFrequency('aA', { ...opt, ignoreCase: false }).unique).toBe(2);
  });
});

describe('topN と空入力', () => {
  it('上位N件に絞っても total / unique は全体の値', () => {
    const r = countFrequency('a a b c', { ...base, topN: 2 });
    expect(r.entries).toHaveLength(2);
    expect(r.total).toBe(4);
    expect(r.unique).toBe(3);
  });

  it('0・負・NaN は全件', () => {
    for (const topN of [0, -1, NaN, Infinity]) {
      expect(countFrequency('a b c', { ...base, topN }).entries).toHaveLength(
        3,
      );
    }
  });

  it('小数のNは切り捨てる', () => {
    expect(
      countFrequency('a b c', { ...base, topN: 2.9 }).entries,
    ).toHaveLength(2);
  });

  it('空文字は空の結果', () => {
    const r = countFrequency('', base);
    expect(r).toEqual({ entries: [], total: 0, unique: 0 });
  });

  it('記号だけの文字単位入力は空', () => {
    expect(countFrequency('!?、。', { ...base, unit: 'char' }).total).toBe(0);
  });
});

describe('tokenize', () => {
  it('単語単位では記号を返さない', () => {
    expect(tokenize('a, b', 'word', true)).toEqual(['a', 'b']);
  });
});

describe('改行コードと大量入力', () => {
  it('CRLF / CR / LF の混在でも単語は正しく数える', () => {
    const r = countFrequency('a\r\nb\rb\na', base);
    expect(r.total).toBe(4);
    expect(r.unique).toBe(2);
    expect(r.entries[0]).toMatchObject({ item: 'a', count: 2 });
  });

  it('文字単位では改行（CRLF含む）を数えない', () => {
    const r = countFrequency('あ\r\nあ\rあ\n', { ...base, unit: 'char' });
    expect(r.total).toBe(3);
    expect(r.entries).toEqual([{ item: 'あ', count: 3, percent: 100 }]);
  });

  it('大量の単語（10万語）でも件数と上位が正しい', () => {
    const text = 'word '.repeat(100000) + 'other';
    const r = countFrequency(text, { ...base, topN: 1 });
    expect(r.total).toBe(100001);
    expect(r.unique).toBe(2);
    expect(r.entries[0]).toMatchObject({ item: 'word', count: 100000 });
  });
});

describe('toCsv', () => {
  const headers = { rank: 'rank', item: 'item', count: 'count', percent: '%' };

  it('ヘッダと行をCRLFで出力する', () => {
    const csv = toCsv([{ item: 'a', count: 2, percent: 50 }], headers);
    expect(csv).toBe('rank,item,count,%\r\n1,a,2,50.00');
  });

  it('カンマ・引用符・改行を含む項目をエスケープする', () => {
    const csv = toCsv(
      [
        { item: 'a,b', count: 1, percent: 10 },
        { item: 'say "hi"', count: 1, percent: 10 },
        { item: '\n', count: 1, percent: 10 },
      ],
      headers,
    );
    expect(csv).toContain('1,"a,b",1');
    expect(csv).toContain('2,"say ""hi""",1');
    expect(csv).toContain('3,"\n",1');
  });

  it('数式として解釈されうる先頭文字を無効化する', () => {
    const csv = toCsv(
      [
        { item: '=1+1', count: 1, percent: 0 },
        { item: '-', count: 1, percent: 0 },
      ],
      headers,
    );
    expect(csv).toContain("1,'=1+1,1");
    expect(csv).toContain("2,'-,1");
  });

  it('空配列ならヘッダのみ', () => {
    expect(toCsv([], headers)).toBe('rank,item,count,%');
  });

  it('割合は小数第2位に丸める', () => {
    const csv = toCsv([{ item: 'a', count: 1, percent: 100 / 3 }], headers);
    expect(csv).toBe('rank,item,count,%\r\n1,a,1,33.33');
  });

  it('日本語の項目もそのまま出力する', () => {
    const csv = toCsv([{ item: '猫', count: 2, percent: 50 }], headers);
    expect(csv).toContain('1,猫,2,50.00');
  });
});
