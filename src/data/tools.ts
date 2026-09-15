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
  {
    slug: 'json-formatter',
    translations: {
      ja: {
        name: 'JSON整形',
        description:
          'JSONデータを整形・圧縮し、構文エラーがあれば分かりやすく表示します。',
        category: 'コード',
      },
      en: {
        name: 'JSON Formatter',
        description:
          'Formats and minifies JSON data, with clear syntax error messages.',
        category: 'Code',
      },
    },
  },
  {
    slug: 'base64',
    translations: {
      ja: {
        name: 'Base64エンコード/デコード',
        description:
          'テキストとBase64文字列を相互に変換します。日本語などのマルチバイト文字にも対応。',
        category: 'コード',
      },
      en: {
        name: 'Base64 Encoder/Decoder',
        description:
          'Converts text to and from Base64, with full support for multibyte characters.',
        category: 'Code',
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
