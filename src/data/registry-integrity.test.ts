import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { tools, type Locale } from './tools';

// レジストリ（tools.ts）と、ページ・辞書・FAQ の整合性、および title / description / h1 の
// 品質（AdSense「低品質・重複コンテンツ」対策）を機械的に検査する。
// 新しいツールを登録すると自動で検査対象になる。

const locales: Locale[] = ['ja', 'en'];
const root = resolve(import.meta.dirname, '../..');

interface PageMeta {
  title: string;
  description: string;
  h1: string;
}

// src/i18n/tools/<slug>.ts の export のうち、ja/en 両方に title / description / h1 を持つものを辞書とみなす
const dictModules = import.meta.glob<Record<string, unknown>>(
  '../i18n/tools/*.ts',
  { eager: true },
);

function loadMeta(slug: string): Record<Locale, PageMeta> | undefined {
  const mod = dictModules[`../i18n/tools/${slug}.ts`];
  if (!mod) return undefined;
  for (const value of Object.values(mod)) {
    const rec = value as Record<string, Partial<PageMeta>> | undefined;
    if (
      rec &&
      typeof rec === 'object' &&
      typeof rec.ja?.h1 === 'string' &&
      typeof rec.en?.h1 === 'string'
    ) {
      return rec as Record<Locale, PageMeta>;
    }
  }
  return undefined;
}

// 幅は「全角=2・半角=1」換算。現行の分布（title 最大76・description 最大493）を基準にした回帰ガード
const TITLE_MAX_WIDTH = 80;
const DESCRIPTION_MIN_WIDTH = 80;
const DESCRIPTION_MAX_WIDTH = 520;
// description の文字バイグラム類似度の上限。現行の最大（英語 0.79）を許容し、コピペ同然の酷似だけ弾く
const DESCRIPTION_SIMILARITY_MAX = 0.85;

const metas = new Map(tools.map((t) => [t.slug, loadMeta(t.slug)]));

/** 文字の見た目の幅（全角=2、半角=1）。検索結果での切り詰めの目安に使う */
function visualWidth(s: string): number {
  let w = 0;
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    w += c <= 0xff || (c >= 0xff61 && c <= 0xff9f) ? 1 : 2;
  }
  return w;
}

/** 大小・全半角・空白・記号のゆらぎを無視した比較用の正規化 */
function normalize(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]/gu, '');
}

/** 文字バイグラムの Jaccard 類似度（0〜1） */
function similarity(a: string, b: string): number {
  const grams = (s: string) => {
    const set = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  const ga = grams(normalize(a));
  const gb = grams(normalize(b));
  if (ga.size === 0 || gb.size === 0) return 0;
  let inter = 0;
  for (const g of ga) if (gb.has(g)) inter++;
  return inter / (ga.size + gb.size - inter);
}

describe('registry integrity - files', () => {
  it('全ツールに ja/en のページ・ページ部品・辞書・FAQ が揃っている', () => {
    const missing: string[] = [];
    for (const t of tools) {
      const paths = [
        `src/pages/tools/${t.slug}/index.astro`,
        `src/pages/en/tools/${t.slug}/index.astro`,
        `src/i18n/tools/${t.slug}.ts`,
        `src/i18n/faq/${t.slug}.ts`,
        `src/lib/tools/${t.slug}.ts`,
      ];
      for (const p of paths) {
        if (!existsSync(resolve(root, p))) missing.push(p);
      }
    }
    expect(missing).toEqual([]);
  });

  it('ja/en のページラッパーが、対応する tool-pages 部品を正しい locale で呼んでいる', () => {
    const problems: string[] = [];
    for (const t of tools) {
      for (const locale of locales) {
        const file = resolve(
          root,
          locale === 'ja'
            ? `src/pages/tools/${t.slug}/index.astro`
            : `src/pages/en/tools/${t.slug}/index.astro`,
        );
        if (!existsSync(file)) continue;
        const src = readFileSync(file, 'utf8');
        if (!src.includes(`locale="${locale}"`))
          problems.push(`${t.slug}: ${locale} ラッパーの locale 指定が不一致`);
        const component = src.match(
          /components\/tool-pages\/(\w+)\.astro/,
        )?.[1];
        if (
          !component ||
          !existsSync(
            resolve(root, `src/components/tool-pages/${component}.astro`),
          )
        )
          problems.push(
            `${t.slug}: ${locale} ラッパーの tool-pages 部品が見つからない`,
          );
      }
    }
    expect(problems).toEqual([]);
  });

  it('ページ・辞書・FAQ に、レジストリ未登録のツールがない', () => {
    const registered = new Set(tools.map((t) => t.slug));
    const orphans = [
      ...readdirSync(resolve(root, 'src/pages/tools'), {
        withFileTypes: true,
      })
        .filter((d) => d.isDirectory() && d.name !== 'category')
        .map((d) => `pages/tools/${d.name}`),
      ...readdirSync(resolve(root, 'src/pages/en/tools'), {
        withFileTypes: true,
      })
        .filter((d) => d.isDirectory() && d.name !== 'category')
        .map((d) => `pages/en/tools/${d.name}`),
      ...readdirSync(resolve(root, 'src/i18n/faq'))
        .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
        .map((f) => `i18n/faq/${f.replace(/.ts$/, '')}`),
      ...readdirSync(resolve(root, 'src/i18n/tools'))
        .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
        .map((f) => `i18n/tools/${f.replace(/\.ts$/, '')}`),
    ].filter((p) => !registered.has(p.split('/').pop() as string));
    expect(orphans).toEqual([]);
  });
});

describe('registry integrity - page meta', () => {
  it('全ツールの辞書に ja/en の title / description / h1 がある', () => {
    const missing = tools.filter((t) => !metas.get(t.slug)).map((t) => t.slug);
    expect(missing).toEqual([]);
  });

  it('title / description / h1 が空でなく、前後に空白がない', () => {
    const problems: string[] = [];
    for (const t of tools) {
      const meta = metas.get(t.slug);
      if (!meta) continue;
      for (const locale of locales) {
        for (const key of ['title', 'description', 'h1'] as const) {
          const v = meta[locale][key];
          if (typeof v !== 'string' || v.trim() === '' || v !== v.trim())
            problems.push(`${t.slug}/${locale}: ${key}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('title が長すぎず（検索結果で切れない）、description が適切な長さ', () => {
    const problems: string[] = [];
    for (const t of tools) {
      const meta = metas.get(t.slug);
      if (!meta) continue;
      for (const locale of locales) {
        const { title, description } = meta[locale];
        // 既存の最長（英語76幅）を許容しつつ、極端に長い title の混入を防ぐ回帰ガード
        if (visualWidth(title) > TITLE_MAX_WIDTH)
          problems.push(`${t.slug}/${locale}: title ${visualWidth(title)}幅`);
        if (
          visualWidth(description) < DESCRIPTION_MIN_WIDTH ||
          visualWidth(description) > DESCRIPTION_MAX_WIDTH
        )
          problems.push(
            `${t.slug}/${locale}: description ${visualWidth(description)}幅`,
          );
      }
    }
    expect(problems).toEqual([]);
  });

  it('ロケール内で title / description / h1 が他のツールと重複しない', () => {
    const problems: string[] = [];
    for (const locale of locales) {
      for (const key of ['title', 'description', 'h1'] as const) {
        const seen = new Map<string, string>();
        for (const t of tools) {
          const v = metas.get(t.slug)?.[locale][key];
          if (!v) continue;
          const n = normalize(v);
          const prev = seen.get(n);
          if (prev) problems.push(`${locale}/${key}: ${prev} と ${t.slug}`);
          else seen.set(n, t.slug);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('description がツール間でテンプレート的に酷似していない', () => {
    const problems: string[] = [];
    for (const locale of locales) {
      const list = tools.flatMap((t) => {
        const d = metas.get(t.slug)?.[locale].description;
        return d ? [{ slug: t.slug, d }] : [];
      });
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const s = similarity(list[i].d, list[j].d);
          if (s >= DESCRIPTION_SIMILARITY_MAX)
            problems.push(
              `${locale}: ${list[i].slug} ≒ ${list[j].slug} (${s.toFixed(2)})`,
            );
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('英語版の title / description が日本語と同一（未翻訳）でない', () => {
    const problems: string[] = [];
    for (const t of tools) {
      const meta = metas.get(t.slug);
      if (!meta) continue;
      for (const key of ['title', 'description', 'h1'] as const) {
        if (meta.ja[key] === meta.en[key])
          problems.push(`${t.slug}: ${key} が ja と en で同一`);
      }
      // 英語版に日本語（かな・漢字）が混ざっていない
      for (const key of ['title', 'description', 'h1'] as const) {
        if (/[぀-ヿ一-鿿]/.test(meta.en[key]))
          problems.push(`${t.slug}: en の ${key} に日本語が含まれる`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('registry integrity - registry copy', () => {
  it('レジストリの name / description が空でなく、ロケール内で name が重複しない', () => {
    const problems: string[] = [];
    for (const locale of locales) {
      const names = new Map<string, string>();
      for (const t of tools) {
        const { name, description } = t.translations[locale];
        if (name.trim() === '' || description.trim() === '')
          problems.push(`${t.slug}/${locale}: 空の name/description`);
        const n = normalize(name);
        const prev = names.get(n);
        if (prev) problems.push(`${locale}: name 重複 ${prev} と ${t.slug}`);
        else names.set(n, t.slug);
      }
    }
    expect(problems).toEqual([]);
  });
});
