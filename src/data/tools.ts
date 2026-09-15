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
  {
    slug: 'url-encode',
    translations: {
      ja: {
        name: 'URLエンコード/デコード',
        description:
          'テキストとパーセントエンコード形式を相互に変換します。クエリパラメータの日本語などマルチバイト文字にも対応。',
        category: 'コード',
      },
      en: {
        name: 'URL Encoder/Decoder',
        description:
          'Converts text to and from percent-encoding, with full support for multibyte characters in query parameters.',
        category: 'Code',
      },
    },
  },
  {
    slug: 'uuid-generator',
    translations: {
      ja: {
        name: 'UUID生成',
        description:
          'ランダムなUUID（v4）を1件〜100件まとめて生成します。ハイフンなし・大文字表記にも対応。',
        category: 'コード',
      },
      en: {
        name: 'UUID Generator',
        description:
          'Generates 1 to 100 random UUIDs (v4) at once, with optional hyphen removal and uppercase formatting.',
        category: 'Code',
      },
    },
  },
  {
    slug: 'password-generator',
    translations: {
      ja: {
        name: 'パスワード生成',
        description:
          '文字種（大文字・小文字・数字・記号）と桁数を指定して、安全なランダムパスワードを生成します。強度の目安も表示。',
        category: 'コード',
      },
      en: {
        name: 'Password Generator',
        description:
          'Generates strong random passwords by choosing character types (uppercase, lowercase, numbers, symbols) and length, with a strength estimate.',
        category: 'Code',
      },
    },
  },
  {
    slug: 'hash-generator',
    translations: {
      ja: {
        name: 'ハッシュ生成',
        description:
          'テキストからMD5・SHA-1・SHA-256のハッシュ値をリアルタイムで計算します。',
        category: 'コード',
      },
      en: {
        name: 'Hash Generator',
        description:
          'Computes MD5, SHA-1, and SHA-256 hashes from text in real time.',
        category: 'Code',
      },
    },
  },
  {
    slug: 'qr-generator',
    translations: {
      ja: {
        name: 'QRコード生成',
        description:
          'URLやテキストからQRコードを生成し、PNG画像としてダウンロードできます。誤り訂正レベルも選択可能。',
        category: 'コード',
      },
      en: {
        name: 'QR Code Generator',
        description:
          'Generates a QR code from a URL or text and downloads it as a PNG, with a selectable error correction level.',
        category: 'Code',
      },
    },
  },
  {
    slug: 'color-converter',
    translations: {
      ja: {
        name: 'カラーコード変換',
        description:
          'HEX・RGB・HSLのカラーコードを相互に変換します。カラーピッカーで色を選ぶこともできます。',
        category: 'コード',
      },
      en: {
        name: 'Color Converter',
        description:
          'Converts color codes between HEX, RGB, and HSL, with a color picker for choosing colors visually.',
        category: 'Code',
      },
    },
  },
  {
    slug: 'unix-timestamp',
    translations: {
      ja: {
        name: 'Unixタイムスタンプ変換',
        description:
          'Unixタイムスタンプ（エポック秒・ミリ秒）と日時を相互に変換します。現在時刻の取得にも対応。',
        category: 'コード',
      },
      en: {
        name: 'Unix Timestamp Converter',
        description:
          'Converts between a Unix timestamp (epoch seconds or milliseconds) and a date/time, and shows the current timestamp.',
        category: 'Code',
      },
    },
  },
  {
    slug: 'zenkaku-hankaku',
    translations: {
      ja: {
        name: '全角/半角変換',
        description:
          '英数字・記号・カタカナ・スペースを対象に、全角と半角を相互に変換します。変換したい文字種を個別に選択可能。',
        category: 'テキスト',
      },
      en: {
        name: 'Full-width / Half-width Converter',
        description:
          'Converts between full-width and half-width for alphanumerics, symbols, katakana, and spaces, with each character type selectable individually.',
        category: 'Text',
      },
    },
  },
  {
    slug: 'kana-converter',
    translations: {
      ja: {
        name: 'ひらがな/カタカナ変換',
        description:
          'ひらがなとカタカナを相互に変換します。濁音・半濁音・拗音・促音・踊り字にも対応。',
        category: 'テキスト',
      },
      en: {
        name: 'Hiragana / Katakana Converter',
        description:
          'Converts between hiragana and katakana, including voiced, semi-voiced, contracted, and geminate sounds, plus iteration marks.',
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
