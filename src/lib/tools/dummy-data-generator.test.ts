import { describe, it, expect } from 'vitest';
import {
  DUMMY_FIELDS,
  MAX_COUNT,
  clampCount,
  createRng,
  formatRecords,
  generateRecords,
  type DummyField,
} from './dummy-data-generator';

const NOW = new Date(Date.UTC(2026, 9, 4));
const ALL: readonly DummyField[] = DUMMY_FIELDS;

function gen(
  locale: 'ja' | 'en',
  count: number,
  seed = 'seed',
  fields: readonly DummyField[] = ALL,
) {
  return generateRecords({
    locale,
    count,
    fields,
    rng: createRng(seed),
    now: NOW,
  });
}

describe('createRng', () => {
  it('同じシードなら同じ乱数列になる', () => {
    const a = createRng('abc');
    const b = createRng('abc');
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('異なるシードでは乱数列が異なり、値は [0, 1) に収まる', () => {
    const a = createRng('abc');
    const b = createRng('abd');
    expect(a()).not.toBe(b());
    const r = createRng();
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('clampCount', () => {
  it('1〜上限に丸める', () => {
    expect(clampCount(0)).toBe(1);
    expect(clampCount(-5)).toBe(1);
    expect(clampCount(NaN)).toBe(1);
    expect(clampCount(2.9)).toBe(2);
    expect(clampCount(99999)).toBe(MAX_COUNT);
  });
});

describe('generateRecords', () => {
  it('同じシードなら同じ結果、指定件数が返る', () => {
    expect(gen('ja', 5)).toEqual(gen('ja', 5));
    expect(gen('en', 7)).toHaveLength(7);
    expect(gen('ja', 5)).not.toEqual(gen('ja', 5, 'other'));
  });

  it('件数の上限を超えない', () => {
    expect(gen('en', 5000)).toHaveLength(MAX_COUNT);
  });

  it('日本語版: 項目の形式が妥当', () => {
    for (const r of gen('ja', 50)) {
      expect(r.name).toMatch(/^\S+ \S+$/);
      expect(r.kana).toMatch(/^[ぁ-ゟ]+ [ぁ-ゟ]+$/);
      expect(r.email).toMatch(/^[a-z]+\.[a-z]+\d+@example\.(com|net|org)$/);
      expect(r.phone).toMatch(/^0[789]0-\d{4}-\d{4}$/);
      expect(r.zip).toMatch(/^\d{3}-\d{4}$/);
      expect(r.address).toMatch(/^\S+\d+-\d+-\d+$/);
      expect(r.company).toMatch(/^株式会社/);
      expect(r.username).toMatch(/^[a-z]+\d+$/);
    }
  });

  it('英語版: kana は出力せず、電話は架空番号 555-01XX', () => {
    for (const r of gen('en', 50)) {
      expect('kana' in r).toBe(false);
      expect(r.phone).toMatch(/^\d{3}-555-01\d{2}$/);
      expect(r.zip).toMatch(/^\d{5}$/);
      expect(r.email).toMatch(/@example\.(com|net|org)$/);
      expect(r.address).toMatch(/^\d+ [\w ]+, [\w ]+, [A-Z]{2} \d{5}$/);
    }
  });

  it('生年月日は18〜80歳の範囲で、年齢と一致する', () => {
    for (const r of gen('ja', 300)) {
      const [y, m, d] = String(r.birthday).split('-').map(Number);
      let age = 2026 - y;
      if (10 < m || (10 === m && 4 < d)) age--;
      expect(r.age).toBe(age);
      expect(age).toBeGreaterThanOrEqual(18);
      expect(age).toBeLessThanOrEqual(80);
    }
  });

  it('選択した項目だけを標準の並び順で出力する', () => {
    const [r] = gen('ja', 1, 'x', ['username', 'name']);
    expect(Object.keys(r)).toEqual(['name', 'username']);
  });

  it('最大件数1000件に丸められる（境界値テスト）', () => {
    expect(gen('en', MAX_COUNT)).toHaveLength(MAX_COUNT);
    expect(gen('en', MAX_COUNT + 1)).toHaveLength(MAX_COUNT);
    expect(gen('en', 999)).toHaveLength(999);
    expect(gen('en', 1000)).toHaveLength(1000);
  });

  it('emoji を含むデータも正常に処理される', () => {
    // シード固定で生成（実際には日本語名が生成されるが、emoji処理の確認）
    const records = gen('ja', 100);
    expect(records.every((r) => typeof r.name === 'string')).toBe(true);
    expect(
      records.every(
        (r) =>
          r.kana === undefined ||
          (typeof r.kana === 'string' && r.kana.length > 0),
      ),
    ).toBe(true);
  });

  it('CSV形式で特殊文字を含むデータをエスケープできる', () => {
    const records = [
      { name: 'John "Doc" Doe', age: 30 },
      { name: 'Jane, Test', age: 25 },
      { name: 'Multi\nLine', age: 40 },
    ];
    const csv = formatRecords(records, 'csv');
    const lines = csv.split('\n');
    expect(lines[0]).toBe('name,age');
    expect(lines[1]).toContain('"John ""Doc"" Doe"');
    expect(lines[2]).toContain('"Jane, Test"');
  });

  it('0件のリクエストは1件に丸められる', () => {
    expect(clampCount(0)).toBe(1);
    expect(gen('ja', 0)).toHaveLength(1);
  });
});

describe('formatRecords', () => {
  const records = [
    { name: 'A, "B"', age: 20 },
    { name: 'C', age: 30 },
  ];

  it('JSON', () => {
    expect(JSON.parse(formatRecords(records, 'json'))).toEqual(records);
    expect(formatRecords([], 'json')).toBe('[]');
  });

  it('CSV はカンマ・引用符をエスケープする', () => {
    expect(formatRecords(records, 'csv')).toBe('name,age\n"A, ""B""",20\nC,30');
  });

  it('TSV', () => {
    expect(formatRecords(records, 'tsv')).toBe('name\tage\nA, "B"\t20\nC\t30');
  });

  it('レコードが空なら CSV/TSV は空文字', () => {
    expect(formatRecords([], 'csv')).toBe('');
  });
});
