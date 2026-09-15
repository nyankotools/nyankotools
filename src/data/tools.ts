export type Locale = 'ja' | 'en';

export interface ToolTranslation {
  name: string;
  description: string;
  category: string;
}

export interface Tool {
  slug: string;
  translations: Record<Locale, ToolTranslation>;
}

/** ロケールごとに文言を解決した、表示・検索用のツール情報 */
export interface LocalizedTool {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export const tools: Tool[] = [
  {
    slug: 'char-counter',
    translations: {
      ja: {
        name: '文字数カウント',
        description:
          '入力したテキストの文字数・単語数・行数をリアルタイムで数えます。',
        category: 'テキスト',
      },
      en: {
        name: 'Character Counter',
        description:
          'Counts the characters, words, and lines of your text in real time.',
        category: 'Text',
      },
    },
  },
];

export function getLocalizedTools(locale: Locale): LocalizedTool[] {
  return tools.map((tool) => ({
    slug: tool.slug,
    ...tool.translations[locale],
  }));
}
