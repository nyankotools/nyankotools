import { describe, it, expect } from 'vitest';
import { tools } from '../data/tools';

// 導線文などの本文HTMLに含まれる内部リンクが、言語・リンク先・自己参照の点で正しいことを保証する。
// ページ固有のコンテンツ辞書（tools/*.ts）とFAQ（faq/*.ts）を対象にする。
const modules = {
  ...import.meta.glob('./tools/*.ts', { eager: true }),
  ...import.meta.glob('./faq/*.ts', { eager: true }),
} as Record<string, Record<string, unknown>>;

const slugs = new Set(tools.map((t) => t.slug));

interface Found {
  file: string;
  slug: string;
  locale: string;
  href: string;
}

// ja/en をキーに持つオブジェクトを辿り、文字列中の href="..." を集める
function collect(
  node: unknown,
  locale: string | null,
  ctx: { file: string; slug: string },
  out: Found[],
) {
  if (typeof node === 'string') {
    if (!locale) return;
    for (const m of node.matchAll(/href=["']([^"']+)["']/g)) {
      out.push({ ...ctx, locale, href: m[1] });
    }
    // Markdown/オブジェクト形式のhrefプロパティは下のキー走査で拾う
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((n) => collect(n, locale, ctx, out));
    return;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'href' && typeof v === 'string' && locale) {
        out.push({ ...ctx, locale, href: v });
        continue;
      }
      collect(v, k === 'ja' || k === 'en' ? k : locale, ctx, out);
    }
  }
}

const found: Found[] = [];
for (const [path, mod] of Object.entries(modules)) {
  const slug = path.replace(/^.*\//, '').replace(/\.ts$/, '');
  for (const value of Object.values(mod)) {
    collect(value, null, { file: path, slug }, found);
  }
}

const internal = found.filter((f) => f.href.startsWith('/'));

describe('i18n 本文の内部リンク', () => {
  it('内部リンクが1件以上検出できる（検査が空振りしていない）', () => {
    expect(internal.length).toBeGreaterThan(0);
  });

  it('ja は /en/ 以外、en は /en/ 配下のリンクだけを含む', () => {
    const bad = internal
      .filter((f) =>
        f.locale === 'ja'
          ? f.href.startsWith('/en/') || f.href === '/en'
          : !(f.href.startsWith('/en/') || f.href === '/en'),
      )
      .map((f) => `${f.file} [${f.locale}] ${f.href}`);
    expect(bad).toEqual([]);
  });

  it('ツールへのリンク先 slug がすべて登録済みである', () => {
    const bad = internal
      .map((f) => ({ f, m: f.href.match(/^(?:\/en)?\/tools\/([^/#?]+)\/?/) }))
      .filter(({ m }) => m && !slugs.has(m[1]))
      .map(({ f }) => `${f.file} [${f.locale}] ${f.href}`);
    expect(bad).toEqual([]);
  });

  it('自分自身のツールページへのリンクを含まない', () => {
    const bad = internal
      .filter((f) => {
        const m = f.href.match(/^(?:\/en)?\/tools\/([^/#?]+)\/?/);
        return m && m[1] === f.slug;
      })
      .map((f) => `${f.file} [${f.locale}] ${f.href}`);
    expect(bad).toEqual([]);
  });
});
