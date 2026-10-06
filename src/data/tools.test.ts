import { describe, it, expect } from 'vitest';
import { categories, categoryIds, getLocalizedTools, tools } from './tools';
import { updates } from './updates';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

describe('tools registry', () => {
  it('all tools count should be 139', () => {
    expect(tools.length).toBe(139);
  });

  it('slug が重複していない', () => {
    const slugs = tools.map((t) => t.slug);
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([]);
  });
});

describe('tools registry - category', () => {
  it('categories は categoryIds と同じ13個のIDを持つ', () => {
    expect(Object.keys(categories).sort()).toEqual([...categoryIds].sort());
    expect(categoryIds).toHaveLength(13);
  });

  it('各カテゴリに ja/en の表示名があり、ロケール内で重複しない', () => {
    for (const locale of ['ja', 'en'] as const) {
      const labels = categoryIds.map((id) => categories[id][locale]);
      for (const label of labels) expect(label.trim()).not.toBe('');
      expect(new Set(labels).size).toBe(labels.length);
    }
  });

  it('全ツールが定義済みのカテゴリIDに属する', () => {
    const invalid = tools
      .filter((t) => !(categoryIds as readonly string[]).includes(t.category))
      .map((t) => `${t.slug}: ${t.category}`);
    expect(invalid).toEqual([]);
  });

  it('どのカテゴリにも1つ以上のツールがある', () => {
    for (const id of categoryIds) {
      expect(tools.some((t) => t.category === id)).toBe(true);
    }
  });

  it('getLocalizedTools がカテゴリIDと表示名をロケールごとに解決する', () => {
    const ja = getLocalizedTools('ja').find((t) => t.slug === 'char-counter');
    const en = getLocalizedTools('en').find((t) => t.slug === 'char-counter');
    expect(ja).toMatchObject({ categoryId: 'text', category: 'テキスト' });
    expect(en).toMatchObject({ categoryId: 'text', category: 'Text' });
  });
});

describe('tools registry - dates', () => {
  it('addedAt / updatedAt は実在する YYYY-MM-DD 形式である', () => {
    for (const t of tools) {
      for (const value of [t.addedAt, t.updatedAt]) {
        expect(value, t.slug).toMatch(DATE_PATTERN);
        const d = new Date(`${value}T00:00:00Z`);
        expect(d.toISOString().slice(0, 10), t.slug).toBe(value);
      }
    }
  });

  it('updatedAt は addedAt 以降である', () => {
    const invalid = tools
      .filter((t) => t.updatedAt < t.addedAt)
      .map((t) => t.slug);
    expect(invalid).toEqual([]);
  });

  it('addedAt は updates.ts で最初にそのツールを紹介した日付と一致する', () => {
    const firstSeen = new Map<string, string>();
    for (const u of [...updates].sort((a, b) => (a.date < b.date ? -1 : 1))) {
      for (const slug of u.toolSlugs ?? []) {
        if (!firstSeen.has(slug)) firstSeen.set(slug, u.date);
      }
    }
    const mismatched = tools
      .filter((t) => firstSeen.get(t.slug) !== t.addedAt)
      .map(
        (t) => `${t.slug}: ${t.addedAt} (updates: ${firstSeen.get(t.slug)})`,
      );
    expect(mismatched).toEqual([]);
  });
});

describe('tools registry - related', () => {
  const slugs = new Set(tools.map((t) => t.slug));

  it('全ツールに関連ツールが1〜3件ある', () => {
    const invalid = tools
      .filter((t) => t.related.length < 1 || t.related.length > 3)
      .map((t) => `${t.slug}: ${t.related.length}`);
    expect(invalid).toEqual([]);
  });

  it('関連ツールは実在し、自己参照・重複がない', () => {
    const problems: string[] = [];
    for (const t of tools) {
      for (const [i, r] of t.related.entries()) {
        if (!slugs.has(r)) problems.push(`${t.slug}: unknown "${r}"`);
        if (r === t.slug) problems.push(`${t.slug}: self reference`);
        if (t.related.indexOf(r) !== i)
          problems.push(`${t.slug}: duplicate "${r}"`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('tools registry - keywords', () => {
  it('全ツール・全ロケールにキーワードが2〜8件あり、空文字・重複がない', () => {
    const problems: string[] = [];
    for (const t of tools) {
      for (const locale of ['ja', 'en'] as const) {
        const list = t.translations[locale].keywords;
        const lowered = list.map((k) =>
          k.trim().normalize('NFKC').toLowerCase(),
        );
        const id = `${t.slug}/${locale}`;
        if (list.length < 2 || list.length > 8)
          problems.push(`${id}: ${list.length}件`);
        if (lowered.some((k) => k === ''))
          problems.push(`${id}: 空のキーワード`);
        if (new Set(lowered).size !== lowered.length)
          problems.push(`${id}: 重複`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('tools registry - flags', () => {
  it('needsCamera のツールは sensitive でもある（カメラ映像は機微情報）', () => {
    const invalid = tools
      .filter((t) => t.needsCamera && !t.sensitive)
      .map((t) => t.slug);
    expect(invalid).toEqual([]);
  });

  it('秘密情報・個人情報を扱うツールと、データ貼り付け系・画像系は sensitive である', () => {
    for (const slug of [
      'password-generator',
      'jwt-decoder',
      'hash-generator',
      'base64',
      'json-formatter',
      'text-diff',
      'csv-json-converter',
      'yaml-json-converter',
      'toml-converter',
      'url-encode',
      'json-path-tester',
      'curl-converter',
      'json-to-typescript',
      'json-diff',
      'image-converter',
      'heic-converter',
      'image-resizer',
      'image-to-base64',
      'image-pixelart-converter',
      'image-palette-extractor',
      'exif-viewer',
      'webcam-tester',
      'age-calculator',
      'bmi-calculator',
      'hourly-wage-calculator',
      'freelance-income-calculator',
      'mortgage-calculator',
      'investment-simulator',
      'scholarship-repayment-simulator',
      'pdf-merge-split',
      'pdf-image-converter',
      'pdf-compressor',
      'pdf-page-editor',
      'pdf-password-protector',
      'pdf-to-markdown',
      'pdf-redactor',
      'pdf-page-number-watermark',
      'pdf-metadata-editor',
      'zip-tool',
      'screen-recorder',
      'crypto-encryptor',
      'keypair-generator',
      'data-recipe-builder',
      'hmac-generator',
      'totp-generator',
      'bcrypt-generator',
      'xml-json-converter',
      'env-json-converter',
      'csv-markdown-table',
      'html-table-to-csv',
      'json-tree-viewer',
      'json-schema-generator',
    ]) {
      expect(tools.find((t) => t.slug === slug)?.sensitive, slug).toBe(true);
    }
  });
});
