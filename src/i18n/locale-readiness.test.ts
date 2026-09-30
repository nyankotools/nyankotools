import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { categories, tools } from '../data/tools';
import {
  defaultLocale,
  languageNames,
  localePath,
  locales,
  ogLocaleMap,
  resolveLocale,
  ui,
} from './ui';

// 3言語目を追加したときに「辞書の書き忘れ」で壊れないことを保証する。
// `locales`（ui.ts）が唯一の正で、Record<Locale, …> の各辞書がそのキーを過不足なく持つことを検査する。
// 新しいロケールを足したら、ここが失敗する箇所が「対応が必要な辞書」の一覧になる。

const root = resolve(import.meta.dirname, '../..');
const sorted = (keys: string[]) => [...keys].sort();
const expected = sorted(locales);

const toolDicts = import.meta.glob<Record<string, unknown>>('./tools/*.ts', {
  eager: true,
});
const faqDicts = import.meta.glob<{ faq: Record<string, unknown> }>(
  './faq/*.ts',
  { eager: true },
);

describe('ロケール追加への備え', () => {
  it('既定ロケールは locales に含まれる', () => {
    expect(locales).toContain(defaultLocale);
  });

  it('サイト共通の Record<Locale, …> が locales と同じキーを持つ', () => {
    expect(sorted(Object.keys(languageNames))).toEqual(expected);
    expect(sorted(Object.keys(ogLocaleMap))).toEqual(expected);
    expect(sorted(Object.keys(ui))).toEqual(expected);
    for (const [id, names] of Object.entries(categories)) {
      expect(sorted(Object.keys(names)), `categories.${id}`).toEqual(expected);
    }
  });

  it('UI辞書は全ロケールで同じキーを持つ', () => {
    const base = sorted(Object.keys(ui[defaultLocale]));
    for (const locale of locales) {
      expect(sorted(Object.keys(ui[locale])), locale).toEqual(base);
    }
  });

  it('レジストリの translations が locales と同じキーを持つ', () => {
    for (const tool of tools) {
      expect(sorted(Object.keys(tool.translations)), tool.slug).toEqual(
        expected,
      );
    }
  });

  it('ツールの辞書・FAQ が locales と同じキーを持つ', () => {
    const problems: string[] = [];
    for (const [path, mod] of Object.entries(toolDicts)) {
      for (const [name, value] of Object.entries(mod)) {
        if (!value || typeof value !== 'object') continue;
        const keys = Object.keys(value);
        // ロケール別の辞書（title / h1 を持つもの）だけを対象にする
        const perLocale = keys.length > 0 && keys.every((k) => k.length <= 5);
        const first = Object.values(value)[0] as object | undefined;
        const looksLikeDict =
          perLocale &&
          typeof first === 'object' &&
          first !== null &&
          'h1' in first;
        if (looksLikeDict && sorted(keys).join() !== expected.join()) {
          problems.push(`${path}:${name}`);
        }
      }
    }
    for (const [path, mod] of Object.entries(faqDicts)) {
      if (sorted(Object.keys(mod.faq)).join() !== expected.join()) {
        problems.push(path);
      }
    }
    expect(problems).toEqual([]);
  });

  it('既定以外のロケールには、対応するトップページ（src/pages/<locale>/）がある', () => {
    for (const locale of locales) {
      if (locale === defaultLocale) continue;
      expect(
        existsSync(resolve(root, 'src/pages', locale, 'index.astro')),
        locale,
      ).toBe(true);
    }
  });

  it('astro.config.mjs の i18n ロケールが locales と一致する', () => {
    const config = readFileSync(resolve(root, 'astro.config.mjs'), 'utf8');
    const match = config.match(/i18n:\s*\{[^}]*?locales:\s*\[([^\]]*)\]/s);
    const configured = (match?.[1].match(/'([^']+)'/g) ?? []).map((s) =>
      s.replaceAll("'", ''),
    );
    expect(sorted(configured)).toEqual(expected);
  });
});

describe('localePath / resolveLocale', () => {
  it('既定ロケールは接頭辞なし、それ以外は /<locale> を付ける', () => {
    expect(localePath('ja', '/tools/base64/')).toBe('/tools/base64/');
    expect(localePath('en', '/tools/base64/')).toBe('/en/tools/base64/');
    expect(localePath('en', '/')).toBe('/en/');
    expect(localePath('en', '')).toBe('/en');
  });

  it('未知・未指定のロケールは既定ロケールに寄せる', () => {
    expect(resolveLocale('en')).toBe('en');
    expect(resolveLocale('fr')).toBe(defaultLocale);
    expect(resolveLocale(undefined)).toBe(defaultLocale);
  });
});
