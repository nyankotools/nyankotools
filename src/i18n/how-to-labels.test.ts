import { describe, it, expect } from 'vitest';

// 「使い方」の手順文が引用するボタン名・ラベル（ja は「」、en は ""）が、同じ辞書の
// 他の文言（UI ラベル）に存在することを保証する。UI 文言を変えたときの食い違いを防ぐ。
const modules = import.meta.glob('./tools/*.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

type Dict = Record<string, unknown>;

// howToSteps を除く、辞書内のすべての文字列を集める
function collectStrings(node: unknown, out: string[]) {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => collectStrings(n, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k !== 'howToSteps') collectStrings(v, out);
    }
  }
}

const cases: {
  file: string;
  locale: 'ja' | 'en';
  steps: string[];
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
      cases.push({ file, locale, steps: dict.howToSteps as string[], strings });
    }
  }
}

describe('使い方の手順文が引用するラベル', () => {
  it('手順を持つ辞書が検出できる（検査が空振りしていない）', () => {
    expect(cases.length).toBe(24);
  });

  for (const { file, locale, steps, strings } of cases) {
    it(`${file} [${locale}]: 引用ラベルが同じ辞書のUI文言に存在する`, () => {
      const re = locale === 'ja' ? /「([^」]+)」/g : /"([^"]+)"/g;
      const missing: string[] = [];
      for (const step of steps) {
        for (const m of step.matchAll(re)) {
          if (!strings.some((s) => s.includes(m[1]))) missing.push(m[1]);
        }
      }
      expect(missing).toEqual([]);
    });
  }
});
