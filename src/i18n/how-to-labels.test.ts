import { describe, it, expect } from 'vitest';

// 「使い方」の手順文・導線文・注意事項が引用するボタン名・ラベル（ja は「」、en は ""）が、
// 同じ辞書の UI ラベル側の文言に存在することを保証する。UI 文言を変えたときの食い違いを防ぐ。
// 照合先は UI ラベル側の文言のみ。説明文（intro・notes・description・glossary など）は、
// UI と異なる表記が含まれていても一致してしまうため検索対象から除く。
// FAQ（src/i18n/faq/*.ts）は別ファイルのため、この検査の対象外。
const modules = import.meta.glob('./tools/*.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

type Dict = Record<string, unknown>;

const EXCLUDED_KEYS = new Set([
  'howToSteps',
  'title',
  'description',
  'intro',
  'introHtml',
  'notes',
  'glossaryTerms',
]);

// 説明文系のキーを除く、辞書内の文字列（UI ラベル等）を集める
function collectStrings(node: unknown, out: string[]) {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => collectStrings(n, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (!EXCLUDED_KEYS.has(k)) collectStrings(v, out);
    }
  }
}

// UIラベルではなく、外部サービスの機能名などを引用している箇所
const NON_UI_QUOTES = new Set(['Add to Home Screen']);

const cases: {
  file: string;
  locale: 'ja' | 'en';
  steps: string[];
  prose: string[];
  strings: string[];
}[] = [];
for (const [file, mod] of Object.entries(modules)) {
  for (const value of Object.values(mod)) {
    if (!value || typeof value !== 'object') continue;
    for (const locale of ['ja', 'en'] as const) {
      const dict = (value as Record<string, Dict>)[locale];
      if (!dict || !Array.isArray(dict.howToSteps)) continue;
      const strings: string[] = [];
      collectStrings(dict, strings);
      const prose = [
        ...(typeof dict.introHtml === 'string'
          ? [dict.introHtml.replace(/<[^>]*>/g, '')]
          : []),
        ...(Array.isArray(dict.notes) ? (dict.notes as string[]) : []),
      ];
      cases.push({
        file,
        locale,
        steps: dict.howToSteps as string[],
        prose,
        strings,
      });
    }
  }
}

describe('使い方の手順文が引用するラベル', () => {
  it('手順を持つ辞書が検出できる（検査が空振りしていない）', () => {
    expect(cases.length).toBe(72);
  });

  const findMissing = (
    texts: string[],
    locale: 'ja' | 'en',
    strings: string[],
  ) => {
    const re = locale === 'ja' ? /「([^」]+)」/g : /"([^"]+)"/g;
    const missing: string[] = [];
    for (const text of texts) {
      for (const m of text.matchAll(re)) {
        if (NON_UI_QUOTES.has(m[1])) continue;
        if (!strings.some((s) => s.includes(m[1]))) missing.push(m[1]);
      }
    }
    return missing;
  };

  for (const { file, locale, steps, prose, strings } of cases) {
    it(`${file} [${locale}]: 手順文の引用ラベルが同じ辞書のUI文言に存在する`, () => {
      expect(findMissing(steps, locale, strings)).toEqual([]);
    });

    // 導線文・注意事項も同じラベルを引用するため、表記のずれを検出する
    it(`${file} [${locale}]: 導線文・注意事項の引用ラベルが同じ辞書のUI文言に存在する`, () => {
      expect(findMissing(prose, locale, strings)).toEqual([]);
    });
  }
});
