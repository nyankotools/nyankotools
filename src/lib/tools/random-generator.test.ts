import { describe, expect, it } from 'vitest';
import {
  HIRAGANA,
  JOYO_KANJI,
  KATAKANA,
  KYOIKU_KANJI,
} from './random-generator-chars';
import {
  buildPool,
  generateDecimals,
  generateIntegers,
  generateStrings,
  type StringOptions,
} from './random-generator';

const base: StringOptions = {
  lowercase: true,
  uppercase: false,
  digits: false,
  symbols: false,
  hiragana: false,
  katakana: false,
  kyoikuKanji: false,
  joyoKanji: false,
  customChars: '',
  excludeSimilar: false,
  length: 8,
  count: 3,
  unique: false,
};

/** 0,1,2,... を max で折り返して返す決定的な乱数 */
function counter() {
  let n = 0;
  return (max: number) => n++ % max;
}

describe('buildPool', () => {
  it('文字種を組み合わせて重複を除く', () => {
    const pool = buildPool({ ...base, digits: true, customChars: 'aa9あ' });
    expect(pool).toHaveLength(26 + 10 + 1);
    expect(pool).toContain('あ');
  });

  it('紛らわしい文字を除外する', () => {
    const pool = buildPool({
      ...base,
      uppercase: true,
      digits: true,
      excludeSimilar: true,
    });
    for (const ch of '1lI0Oo') expect(pool).not.toContain(ch);
  });

  it('制御文字は含めない', () => {
    expect(
      buildPool({ ...base, lowercase: false, customChars: 'a\nb\tc' }),
    ).toEqual(['a', 'b', 'c']);
  });

  it('サロゲートペアの文字を1文字として扱う', () => {
    expect(
      buildPool({ ...base, lowercase: false, customChars: '😀😀a' }),
    ).toEqual(['😀', 'a']);
  });
});

describe('かな・漢字の文字セット', () => {
  const chars = (s: string) => Array.from(s);

  it('ひらがな・カタカナは71字ずつで、すべて対応する文字種', () => {
    expect(chars(HIRAGANA)).toHaveLength(71);
    expect(chars(KATAKANA)).toHaveLength(71);
    expect(new Set(HIRAGANA).size).toBe(71);
    expect(new Set(KATAKANA).size).toBe(71);
    const hira = /^\p{Script=Hiragana}$/u;
    const kata = /^\p{Script=Katakana}$/u;
    expect(chars(HIRAGANA).every((c) => hira.test(c))).toBe(true);
    expect(chars(KATAKANA).every((c) => kata.test(c))).toBe(true);
  });

  it('教育漢字は1026字、常用漢字は2136字で重複がない', () => {
    expect(chars(KYOIKU_KANJI)).toHaveLength(1026);
    expect(chars(JOYO_KANJI)).toHaveLength(2136);
    expect(new Set(chars(KYOIKU_KANJI)).size).toBe(1026);
    expect(new Set(chars(JOYO_KANJI)).size).toBe(2136);
  });

  it('教育漢字はすべて常用漢字に含まれ、すべて漢字', () => {
    const joyo = new Set(chars(JOYO_KANJI));
    for (const c of chars(KYOIKU_KANJI)) expect(joyo.has(c)).toBe(true);
    for (const c of joyo) expect(/^\p{Script=Han}$/u.test(c)).toBe(true);
  });

  it('文字種を選ぶとプールに入り、重複は1つにまとまる', () => {
    expect(
      buildPool({ ...base, lowercase: false, hiragana: true }),
    ).toHaveLength(71);
    expect(
      buildPool({
        ...base,
        lowercase: false,
        kyoikuKanji: true,
        joyoKanji: true,
      }),
    ).toHaveLength(2136);
  });

  it('漢字を選んで生成すると、指定した文字数の文字列になる', () => {
    const r = generateStrings({
      ...base,
      lowercase: false,
      joyoKanji: true,
      length: 5,
      count: 20,
    });
    if (!r.ok) throw new Error('unexpected');
    for (const v of r.values) expect(Array.from(v)).toHaveLength(5);
  });
});

describe('generateStrings', () => {
  it('指定した長さ・個数・文字種で生成する', () => {
    const r = generateStrings({ ...base, digits: true });
    if (!r.ok) throw new Error('unexpected');
    expect(r.values).toHaveLength(3);
    for (const v of r.values) expect(v).toMatch(/^[a-z0-9]{8}$/);
  });

  it('乱数を差し替えると決定的になる', () => {
    const r = generateStrings(
      { ...base, lowercase: false, digits: true, length: 4, count: 2 },
      counter(),
    );
    expect(r).toEqual({ ok: true, values: ['0123', '4567'] });
  });

  it('重複なしを指定すると結果が重複しない', () => {
    const r = generateStrings({
      ...base,
      lowercase: false,
      customChars: 'ab',
      length: 3,
      count: 8,
      unique: true,
    });
    if (!r.ok) throw new Error('unexpected');
    expect(new Set(r.values).size).toBe(8);
  });

  it('組み合わせ数が足りないとエラー', () => {
    const r = generateStrings({
      ...base,
      lowercase: false,
      customChars: 'ab',
      length: 2,
      count: 5,
      unique: true,
    });
    expect(r).toEqual({ ok: false, error: 'notEnoughCombinations' });
  });

  it('文字が選ばれていないとエラー', () => {
    expect(generateStrings({ ...base, lowercase: false })).toEqual({
      ok: false,
      error: 'emptyCharset',
    });
  });

  it('空欄（NaN）や小数の長さはエラー', () => {
    expect(generateStrings({ ...base, length: NaN })).toMatchObject({
      error: 'invalidLength',
    });
    expect(generateStrings({ ...base, length: 1.5 })).toMatchObject({
      error: 'invalidLength',
    });
    expect(generateStrings({ ...base, count: NaN })).toMatchObject({
      error: 'invalidCount',
    });
  });

  it('長さ1・文字種1の重複なしは1件だけ作れる', () => {
    expect(
      generateStrings({
        ...base,
        lowercase: false,
        customChars: 'a',
        length: 1,
        count: 1,
        unique: true,
      }),
    ).toEqual({ ok: true, values: ['a'] });
  });

  it('長さ256・個数1000の上限は受け入れる', () => {
    const r = generateStrings({ ...base, length: 256, count: 1000 });
    if (!r.ok) throw new Error('unexpected');
    expect(r.values).toHaveLength(1000);
    expect(r.values[0]).toHaveLength(256);
  });

  it('長さ・個数の範囲外はエラー', () => {
    expect(generateStrings({ ...base, length: 0 })).toMatchObject({
      error: 'invalidLength',
    });
    expect(generateStrings({ ...base, length: 257 })).toMatchObject({
      error: 'invalidLength',
    });
    expect(generateStrings({ ...base, count: 1001 })).toMatchObject({
      error: 'invalidCount',
    });
    expect(generateStrings({ ...base, count: 1.5 })).toMatchObject({
      error: 'invalidCount',
    });
  });
});

describe('generateIntegers', () => {
  const opts = { min: 1, max: 10, count: 5, unique: false, sort: false };

  it('範囲内（両端を含む）の整数を生成する', () => {
    const r = generateIntegers({ ...opts, count: 200 });
    if (!r.ok) throw new Error('unexpected');
    for (const v of r.values) {
      expect(Number(v)).toBeGreaterThanOrEqual(1);
      expect(Number(v)).toBeLessThanOrEqual(10);
    }
  });

  it('両端の値が出る', () => {
    expect(generateIntegers({ ...opts, count: 2 }, (m) => m - 1)).toEqual({
      ok: true,
      values: ['10', '10'],
    });
    expect(generateIntegers({ ...opts, count: 1 }, () => 0)).toEqual({
      ok: true,
      values: ['1'],
    });
  });

  it('負の範囲も扱える', () => {
    const r = generateIntegers({ ...opts, min: -5, max: -1, count: 50 });
    if (!r.ok) throw new Error('unexpected');
    for (const v of r.values) {
      expect(Number(v)).toBeGreaterThanOrEqual(-5);
      expect(Number(v)).toBeLessThanOrEqual(-1);
    }
  });

  it('重複なしで範囲全体を取ると全値が1回ずつ出る', () => {
    const r = generateIntegers({
      ...opts,
      count: 10,
      unique: true,
      sort: true,
    });
    expect(r).toEqual({
      ok: true,
      values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    });
  });

  it('重複なしの結果は重複しない（巨大な範囲でも）', () => {
    const r = generateIntegers({
      min: 0,
      max: 4294967295,
      count: 1000,
      unique: true,
      sort: false,
    });
    if (!r.ok) throw new Error('unexpected');
    expect(new Set(r.values).size).toBe(1000);
  });

  it('昇順ソートできる', () => {
    const r = generateIntegers({ ...opts, count: 50, sort: true });
    if (!r.ok) throw new Error('unexpected');
    const nums = r.values.map(Number);
    expect(nums).toEqual([...nums].sort((a, b) => a - b));
  });

  it('エラーを返す', () => {
    expect(generateIntegers({ ...opts, min: 5, max: 1 })).toMatchObject({
      error: 'invalidRange',
    });
    expect(generateIntegers({ ...opts, min: 1.5 })).toMatchObject({
      error: 'invalidRange',
    });
    expect(
      generateIntegers({ ...opts, min: 0, max: 4294967296 }),
    ).toMatchObject({ error: 'rangeTooLarge' });
    expect(generateIntegers({ ...opts, count: 0 })).toMatchObject({
      error: 'invalidCount',
    });
    expect(
      generateIntegers({ ...opts, count: 11, unique: true }),
    ).toMatchObject({ error: 'countExceedsRange' });
  });
});

describe('generateDecimals', () => {
  const opts = { min: 0, max: 1, decimals: 2, count: 5, sort: false };

  it('指定桁数で範囲内の値を生成する', () => {
    const r = generateDecimals({ ...opts, count: 200 });
    if (!r.ok) throw new Error('unexpected');
    for (const v of r.values) {
      expect(v).toMatch(/^[01]\.\d{2}$/);
      expect(Number(v)).toBeLessThanOrEqual(1);
    }
  });

  it('両端の値が出る', () => {
    expect(generateDecimals({ ...opts, count: 1 }, () => 0)).toEqual({
      ok: true,
      values: ['0.00'],
    });
    expect(generateDecimals({ ...opts, count: 1 }, (m) => m - 1)).toEqual({
      ok: true,
      values: ['1.00'],
    });
  });

  it('0桁は整数として出力する', () => {
    const r = generateDecimals({ ...opts, min: 1, max: 6, decimals: 0 });
    if (!r.ok) throw new Error('unexpected');
    for (const v of r.values) expect(v).toMatch(/^[1-6]$/);
  });

  it('範囲の端が刻みに合わないときは範囲内に収める', () => {
    expect(
      generateDecimals({ ...opts, min: 0.005, max: 0.015, count: 3 }),
    ).toEqual({ ok: true, values: ['0.01', '0.01', '0.01'] });
  });

  it('負の値を扱える', () => {
    expect(generateDecimals({ ...opts, min: -1, max: -1, count: 1 })).toEqual({
      ok: true,
      values: ['-1.00'],
    });
  });

  it('刻みに合う値が1つも無い範囲はエラー', () => {
    expect(
      generateDecimals({ ...opts, min: 0.005, max: 0.005, count: 1 }),
    ).toMatchObject({ error: 'invalidRange' });
  });

  it('空欄（NaN）や不正な桁数・件数はエラー', () => {
    expect(generateDecimals({ ...opts, min: NaN })).toMatchObject({
      error: 'invalidRange',
    });
    expect(generateDecimals({ ...opts, max: NaN })).toMatchObject({
      error: 'invalidRange',
    });
    expect(generateDecimals({ ...opts, decimals: NaN })).toMatchObject({
      error: 'invalidDecimals',
    });
    expect(generateDecimals({ ...opts, decimals: 2.5 })).toMatchObject({
      error: 'invalidDecimals',
    });
    expect(generateDecimals({ ...opts, count: 1001 })).toMatchObject({
      error: 'invalidCount',
    });
  });

  it('エラーを返す', () => {
    expect(generateDecimals({ ...opts, decimals: 7 })).toMatchObject({
      error: 'invalidDecimals',
    });
    expect(generateDecimals({ ...opts, min: 2, max: 1 })).toMatchObject({
      error: 'invalidRange',
    });
    expect(generateDecimals({ ...opts, min: 0, max: 50000000 })).toMatchObject({
      error: 'rangeTooLarge',
    });
    expect(
      generateDecimals({ ...opts, decimals: 6, min: 1e10, max: 1e10 + 1000 }),
    ).toMatchObject({ error: 'rangeTooLarge' });
  });
});
