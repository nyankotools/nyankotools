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
          'Converts Japanese text between hiragana and katakana — handy for learners checking vocabulary, flashcards, and loanwords.',
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
        category: '変換',
      },
      en: {
        name: 'JSON Formatter',
        description:
          'Formats and minifies JSON data, with clear syntax error messages.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'yaml-json-converter',
    translations: {
      ja: {
        name: 'YAML⇔JSON変換',
        description:
          'YAMLとJSONを相互に変換します。Docker ComposeやGitHub Actionsなどの設定ファイル確認に便利。',
        category: '変換',
      },
      en: {
        name: 'YAML to JSON Converter',
        description:
          'Converts between YAML and JSON, handy for checking Docker Compose or GitHub Actions config files.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'csv-json-converter',
    translations: {
      ja: {
        name: 'CSV⇔JSON変換',
        description:
          'CSVとJSONを相互に変換します。ヘッダー行をキーとして使用し、カンマ・タブ区切りや引用符付きフィールドにも対応。',
        category: '変換',
      },
      en: {
        name: 'CSV to JSON Converter',
        description:
          'Converts between CSV and JSON using the header row as keys, with support for comma/tab delimiters and quoted fields.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'markdown-preview',
    translations: {
      ja: {
        name: 'Markdown⇔HTML変換',
        description:
          'Markdownをリアルタイムプレビューしながら、HTMLと相互変換します。README や記事の下書き確認に便利。',
        category: '変換',
      },
      en: {
        name: 'Markdown to HTML Converter',
        description:
          'Converts Markdown to HTML with a live preview, and HTML back to Markdown. Handy for checking a README or article draft.',
        category: 'Convert',
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
        category: '変換',
      },
      en: {
        name: 'Unix Timestamp Converter',
        description:
          'Converts between a Unix timestamp (epoch seconds or milliseconds) and a date/time, and shows the current timestamp.',
        category: 'Convert',
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
        category: '変換',
      },
      en: {
        name: 'Color Converter',
        description:
          'Converts color codes between HEX, RGB, and HSL, with a color picker for choosing colors visually.',
        category: 'Convert',
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
        category: 'エンコード/デコード',
      },
      en: {
        name: 'Base64 Encoder/Decoder',
        description:
          'Converts text to and from Base64, with full support for multibyte characters.',
        category: 'Encode/Decode',
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
        category: 'エンコード/デコード',
      },
      en: {
        name: 'URL Encoder/Decoder',
        description:
          'Converts text to and from percent-encoding, with full support for multibyte characters in query parameters.',
        category: 'Encode/Decode',
      },
    },
  },
  {
    slug: 'kishu-izon-checker',
    translations: {
      ja: {
        name: '機種依存文字チェッカー',
        description:
          '①②③などの丸数字やⅠⅡⅢのローマ数字、㈱㍉㍻といった機種依存文字（環境依存文字）を検出し、安全な表記への置き換え案も表示します。',
        category: 'テキスト',
      },
      en: {
        name: 'Machine-Dependent Character Checker',
        description:
          'Detects machine-dependent characters such as circled numbers, Roman numerals, and ligatures like ㈱ ㍉ ㍻, with a safe replacement suggestion for each.',
        category: 'Text',
      },
    },
  },
  {
    slug: 'html-escape',
    translations: {
      ja: {
        name: 'HTML/JS文字列エスケープ・アンエスケープ',
        description:
          'HTMLの特殊文字（& < > " \'）やJavaScript文字列内の改行・クォートなどを相互に変換します。XSS対策やコード生成時の文字列組み立てに便利。',
        category: 'エンコード/デコード',
      },
      en: {
        name: 'HTML/JS String Escape & Unescape',
        description:
          'Escapes and unescapes HTML special characters (& < > " \') and JavaScript string escape sequences such as newlines and quotes.',
        category: 'Encode/Decode',
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
        category: '生成',
      },
      en: {
        name: 'UUID Generator',
        description:
          'Generates 1 to 100 random UUIDs (v4) at once, with optional hyphen removal and uppercase formatting.',
        category: 'Generate',
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
        category: '生成',
      },
      en: {
        name: 'Password Generator',
        description:
          'Generates strong random passwords by choosing character types (uppercase, lowercase, numbers, symbols) and length, with a strength estimate.',
        category: 'Generate',
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
        category: '生成',
      },
      en: {
        name: 'Hash Generator',
        description:
          'Computes MD5, SHA-1, and SHA-256 hashes from text in real time.',
        category: 'Generate',
      },
    },
  },
  {
    slug: 'regex-tester',
    translations: {
      ja: {
        name: '正規表現テスター',
        description:
          '正規表現のパターンとテスト文字列を入力すると、マッチ箇所のハイライト表示・キャプチャグループの一覧・置換結果のプレビューができます。',
        category: '開発',
      },
      en: {
        name: 'Regex Tester',
        description:
          'Tests a regular expression against sample text with match highlighting, a capture group list, and a live replacement preview.',
        category: 'Development',
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
        category: '生成',
      },
      en: {
        name: 'QR Code Generator',
        description:
          'Generates a QR code from a URL or text and downloads it as a PNG, with a selectable error correction level.',
        category: 'Generate',
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
