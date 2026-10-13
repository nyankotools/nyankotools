import { describe, expect, it } from 'vitest';
import {
  buildSitemapFiles,
  buildSitemapIndex,
  buildUrlset,
  escapeXml,
  formatDate,
  isValidLastmod,
  normalizePriority,
  parseSitemapInput,
  splitEntries,
  type SitemapDefaults,
} from './sitemap-generator';

const noDefaults: SitemapDefaults = {
  lastmod: '',
  changefreq: '',
  priority: '',
};

describe('escapeXml', () => {
  it('5つの特殊文字をエスケープする', () => {
    expect(escapeXml(`a&b<c>d"e'f`)).toBe('a&amp;b&lt;c&gt;d&quot;e&apos;f');
  });
});

describe('isValidLastmod', () => {
  it('日付・年月・年・時刻付きを受け付ける', () => {
    expect(isValidLastmod('2026-10-13')).toBe(true);
    expect(isValidLastmod('2026-10')).toBe(true);
    expect(isValidLastmod('2026')).toBe(true);
    expect(isValidLastmod('2026-10-13T12:30:00+09:00')).toBe(true);
    expect(isValidLastmod('2026-10-13T12:30Z')).toBe(true);
  });

  it('実在しない日付や形式違いを拒否する', () => {
    expect(isValidLastmod('2026-02-30')).toBe(false);
    expect(isValidLastmod('2026-13-01')).toBe(false);
    expect(isValidLastmod('2026/10/13')).toBe(false);
    expect(isValidLastmod('2026-10-13T25:00Z')).toBe(false);
    expect(isValidLastmod('2026-10-13T12:30')).toBe(false);
    expect(isValidLastmod('')).toBe(false);
  });
});

describe('normalizePriority', () => {
  it('0.0〜1.0 を受け付けて小数1桁に揃える', () => {
    expect(normalizePriority('1')).toBe('1.0');
    expect(normalizePriority('0')).toBe('0.0');
    expect(normalizePriority('.5')).toBe('0.5');
    expect(normalizePriority('0.8')).toBe('0.8');
    expect(normalizePriority('0.85')).toBe('0.85');
  });

  it('範囲外・非数を拒否する', () => {
    expect(normalizePriority('1.1')).toBeUndefined();
    expect(normalizePriority('-0.1')).toBeUndefined();
    expect(normalizePriority('abc')).toBeUndefined();
    expect(normalizePriority('')).toBeUndefined();
  });
});

describe('formatDate', () => {
  it('ゼロ埋めした YYYY-MM-DD にする', () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('parseSitemapInput', () => {
  it('1行1URLを解析し、空行とコメントを無視する', () => {
    const r = parseSitemapInput(
      'https://example.com/\n\n# コメント\nhttps://example.com/about',
      noDefaults,
    );
    expect(r.entries.map((e) => e.loc)).toEqual([
      'https://example.com/',
      'https://example.com/about',
    ]);
    expect(r.issues).toEqual([]);
    expect(r.hosts).toEqual(['example.com']);
  });

  it('CRLFを扱える', () => {
    const r = parseSitemapInput('https://a.example/\r\nhttps://a.example/b', {
      ...noDefaults,
    });
    expect(r.entries).toHaveLength(2);
  });

  it('既定値を全URLに付与する', () => {
    const r = parseSitemapInput('https://example.com/a', {
      lastmod: '2026-10-13',
      changefreq: 'Weekly',
      priority: '0.8',
    });
    expect(r.entries[0]).toEqual({
      loc: 'https://example.com/a',
      lastmod: '2026-10-13',
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  it('行ごとの上書きを順不同で受け付ける', () => {
    const r = parseSitemapInput('https://example.com/a 1 2025-01-02 daily', {
      lastmod: '2026-10-13',
      changefreq: 'weekly',
      priority: '0.5',
    });
    expect(r.entries[0]).toEqual({
      loc: 'https://example.com/a',
      lastmod: '2025-01-02',
      changefreq: 'daily',
      priority: '1.0',
    });
  });

  it('不正なURL・スキームを除外して理由を返す', () => {
    const r = parseSitemapInput(
      'example.com/a\nftp://example.com/x\nhttps://ok.example/\njavascript:alert(1)',
      noDefaults,
    );
    expect(r.entries).toHaveLength(1);
    expect(r.issues).toEqual([
      { line: 1, text: 'example.com/a', reason: 'invalid-url' },
      { line: 2, text: 'ftp://example.com/x', reason: 'unsupported-scheme' },
      { line: 4, text: 'javascript:alert(1)', reason: 'unsupported-scheme' },
    ]);
  });

  it('重複（末尾スラッシュ違い・フラグメント違いを含む）を除外する', () => {
    const r = parseSitemapInput(
      'https://example.com\nhttps://example.com/\nhttps://example.com/#top\nhttps://example.com/p',
      noDefaults,
    );
    expect(r.entries.map((e) => e.loc)).toEqual([
      'https://example.com/',
      'https://example.com/p',
    ]);
    expect(r.issues.map((i) => [i.line, i.reason])).toEqual([
      [2, 'duplicate'],
      [3, 'duplicate'],
    ]);
  });

  it('不正な個別オプションがある行は除外する', () => {
    const r = parseSitemapInput(
      'https://example.com/a foo\nhttps://example.com/b 2026-02-30\nhttps://example.com/c 2',
      noDefaults,
    );
    expect(r.entries).toHaveLength(0);
    expect(r.issues.map((i) => i.token)).toEqual(['foo', '2026-02-30', '2']);
  });

  it('不正な既定値は無視して通知する', () => {
    const r = parseSitemapInput('https://example.com/', {
      lastmod: 'yesterday',
      changefreq: 'often',
      priority: '5',
    });
    expect(r.invalidDefaults).toEqual(['lastmod', 'changefreq', 'priority']);
    expect(r.entries[0]).toEqual({ loc: 'https://example.com/' });
  });

  it('日本語パスはパーセントエンコードされる', () => {
    const r = parseSitemapInput('https://example.com/日本語', noDefaults);
    expect(r.entries[0].loc).toBe(
      'https://example.com/%E6%97%A5%E6%9C%AC%E8%AA%9E',
    );
  });

  it('複数ホストを検出する', () => {
    const r = parseSitemapInput(
      'https://a.example/\nhttps://b.example/',
      noDefaults,
    );
    expect(r.hosts).toEqual(['a.example', 'b.example']);
  });

  it('2048文字を超えるURLを除外する', () => {
    const r = parseSitemapInput(
      `https://example.com/${'a'.repeat(2100)}`,
      noDefaults,
    );
    expect(r.issues[0].reason).toBe('too-long');
  });

  it('空入力は空の結果', () => {
    const r = parseSitemapInput('  \n\n', noDefaults);
    expect(r.entries).toEqual([]);
    expect(r.issues).toEqual([]);
  });
});

describe('buildUrlset', () => {
  it('XMLを生成し、&などをエスケープする', () => {
    const xml = buildUrlset([
      {
        loc: 'https://example.com/?a=1&b=2',
        lastmod: '2026-10-13',
        changefreq: 'daily',
        priority: '0.5',
      },
      { loc: "https://example.com/it's" },
    ]);
    expect(xml).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        '    <loc>https://example.com/?a=1&amp;b=2</loc>',
        '    <lastmod>2026-10-13</lastmod>',
        '    <changefreq>daily</changefreq>',
        '    <priority>0.5</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://example.com/it&apos;s</loc>',
        '  </url>',
        '</urlset>',
        '',
      ].join('\n'),
    );
  });
});

describe('分割', () => {
  const make = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      loc: `https://example.com/${i}`,
    }));

  it('上限以内なら sitemap.xml 1つだけ', () => {
    const files = buildSitemapFiles(make(3));
    expect(files.map((f) => f.filename)).toEqual(['sitemap.xml']);
  });

  it('0件なら何も返さない', () => {
    expect(buildSitemapFiles([])).toEqual([]);
  });

  it('件数上限を超えたら分割し、インデックスを付ける', () => {
    const files = buildSitemapFiles(make(5), { maxUrls: 2, maxBytes: 1e9 });
    expect(files.map((f) => f.filename)).toEqual([
      'sitemap-1.xml',
      'sitemap-2.xml',
      'sitemap-3.xml',
      'sitemap-index.xml',
    ]);
    expect(files[3].kind).toBe('index');
    expect(files[3].xml).toContain(
      '<loc>https://example.com/sitemap-3.xml</loc>',
    );
    expect(files[3].xml).toContain('<sitemapindex');
  });

  it('50,000件ちょうどは分割しない、50,001件で分割する', () => {
    expect(splitEntries(make(50_000))).toHaveLength(1);
    expect(splitEntries(make(50_001))).toHaveLength(2);
  });

  it('バイト数上限でも分割する', () => {
    const chunks = splitEntries(make(10), { maxUrls: 100, maxBytes: 300 });
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.flat()).toHaveLength(10);
  });

  it('1件が上限を超えても無限ループせず1件ずつ入る', () => {
    const chunks = splitEntries(make(3), { maxUrls: 100, maxBytes: 1 });
    expect(chunks).toHaveLength(3);
  });
});

describe('buildSitemapIndex', () => {
  it('lastmod を付けられる', () => {
    const xml = buildSitemapIndex(['https://e.com/s1.xml'], '2026-10-13');
    expect(xml).toContain('<lastmod>2026-10-13</lastmod>');
  });
});

describe('host:port 形式', () => {
  it('scheme なしの host:port/path は無効URLとして扱う', () => {
    const r = parseSitemapInput('localhost:3000/a\nexample.com:8080/x', {
      lastmod: '',
      changefreq: '',
      priority: '',
    } as SitemapDefaults);
    expect(r.entries).toHaveLength(0);
    expect(r.issues.map((i) => i.reason)).toEqual([
      'invalid-url',
      'invalid-url',
    ]);
  });
});

describe('追加の境界・特殊入力', () => {
  it('CR のみの改行でも行を分ける', () => {
    expect(
      parseSitemapInput('https://a.example/\rhttps://a.example/b', noDefaults)
        .entries,
    ).toHaveLength(2);
  });

  it('タブや連続空白で区切られたオプションを扱える', () => {
    const r = parseSitemapInput(
      'https://a.example/x\t0.5\t\tdaily',
      noDefaults,
    );
    expect(r.entries[0]).toEqual({
      loc: 'https://a.example/x',
      changefreq: 'daily',
      priority: '0.5',
    });
  });

  it('絵文字を含むパスはUTF-8のパーセントエンコードになる', () => {
    expect(
      parseSitemapInput('https://example.com/🙂', noDefaults).entries[0].loc,
    ).toBe('https://example.com/%F0%9F%99%82');
  });

  it('スキームとホストは小文字に正規化され、パスの大文字はそのまま残す', () => {
    expect(
      parseSitemapInput('HTTPS://EXAMPLE.com/A', noDefaults).entries[0].loc,
    ).toBe('https://example.com/A');
  });

  it('2048文字ちょうどのURLは受け付ける', () => {
    const base = 'https://example.com/';
    const url = base + 'a'.repeat(2048 - base.length);
    expect(url).toHaveLength(2048);
    expect(parseSitemapInput(url, noDefaults).entries).toHaveLength(1);
  });

  it('優先度 1.01 は不正として扱う', () => {
    expect(normalizePriority('1.01')).toBeUndefined();
  });

  it('空白だけの lastmod 既定値は不正扱いにしない', () => {
    const r = parseSitemapInput('https://e.com/', {
      lastmod: '  ',
      changefreq: '',
      priority: '',
    });
    expect(r.invalidDefaults).toEqual([]);
  });

  it('分割時も loc の特殊文字をエスケープし、index は分割ファイルを同一オリジンで指す', () => {
    const files = buildSitemapFiles(
      [{ loc: 'https://e.com/?a=1&b=2' }, { loc: 'https://e.com/x' }],
      { maxUrls: 1, maxBytes: 1e9 },
    );
    expect(files[0].xml).toContain('<loc>https://e.com/?a=1&amp;b=2</loc>');
    expect(files[2].kind).toBe('index');
    expect(files[2].xml).toContain('<loc>https://e.com/sitemap-2.xml</loc>');
  });
});
