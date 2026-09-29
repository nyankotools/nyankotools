import type { Locale } from '../data/tools';

export interface FaqItem {
  question: string;
  answer: string;
}

export type FaqContent = Record<Locale, FaqItem[]>;

const modules = import.meta.glob<{ faq: FaqContent }>('./faq/*.ts', {
  eager: true,
});

const faqBySlug: Record<string, FaqContent> = {};
for (const [path, mod] of Object.entries(modules)) {
  const slug = path.replace(/^\.\/faq\//, '').replace(/\.ts$/, '');
  faqBySlug[slug] = mod.faq;
}

/** ツールslugとロケールに対応するFAQ項目を返す。未登録なら空配列。 */
export function getFaqItems(slug: string, locale: Locale): FaqItem[] {
  return faqBySlug[slug]?.[locale] ?? [];
}
