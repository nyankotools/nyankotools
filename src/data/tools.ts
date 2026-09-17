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
    slug: 'text-diff',
    translations: {
      ja: {
        name: 'テキスト差分比較（diff）',
        description:
          '2つのテキストを行単位で比較し、追加・削除された箇所をハイライト表示します。空白や大文字小文字の違いを無視する比較にも対応。',
        category: '開発',
      },
      en: {
        name: 'Text Diff Checker',
        description:
          'Compares two texts line by line and highlights added and removed lines, with options to ignore whitespace or case differences.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'jwt-decoder',
    translations: {
      ja: {
        name: 'JWTデコーダー',
        description:
          'JWT（JSON Web Token）のヘッダーとペイロードをデコードして整形表示します。exp/iat等の日時クレームも人が読める形式に変換。署名の検証は行いません。',
        category: '開発',
      },
      en: {
        name: 'JWT Decoder',
        description:
          'Decodes a JWT (JSON Web Token) and displays its header and payload as formatted JSON, with time-based claims like exp/iat shown as human-readable dates. The signature is not verified.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'lorem-ipsum',
    translations: {
      ja: {
        name: 'ダミーテキスト生成',
        description:
          'Lorem ipsum（欧文）または日本語のダミーテキストを、段落・文・単語単位で指定した個数だけ生成します。',
        category: '生成',
      },
      en: {
        name: 'Dummy Text Generator',
        description:
          'Generates Lorem ipsum (Latin) or Japanese placeholder text by paragraphs, sentences, or words, in any count you choose.',
        category: 'Generate',
      },
    },
  },
  {
    slug: 'text-list-tools',
    translations: {
      ja: {
        name: '文字列の重複削除・ソート・シャッフル',
        description:
          '改行区切りのテキストの重複行削除・昇順/降順/数値ソート・ランダムシャッフルをまとめて行います。空行削除や前後の空白削除にも対応。',
        category: 'テキスト',
      },
      en: {
        name: 'Text List Deduplicate, Sort & Shuffle',
        description:
          'Deduplicates, sorts (alphabetical, reverse, or numeric), or randomly shuffles newline-separated text, with options to remove empty lines and trim whitespace.',
        category: 'Text',
      },
    },
  },
  {
    slug: 'line-ending-converter',
    translations: {
      ja: {
        name: '改行コード変換',
        description:
          'テキストの改行コード（LF/CRLF/CR）を判定し、指定した種類に統一変換します。',
        category: 'テキスト',
      },
      en: {
        name: 'Line Ending Converter',
        description:
          'Detects the line endings (LF, CRLF, or CR) in your text and converts them all to the type you choose.',
        category: 'Text',
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
  {
    slug: 'cron-parser',
    translations: {
      ja: {
        name: 'Cron式スケジュールシミュレーター',
        description:
          'cron式の意味を日本語で解説し、次回の実行予定日時を一覧表示します。crontabやGitHub Actionsの動作確認に便利。',
        category: '開発',
      },
      en: {
        name: 'Cron Expression Simulator',
        description:
          'Explains a cron expression in plain English and lists its upcoming run times. Handy for checking crontab or GitHub Actions schedules.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'japanese-era-converter',
    translations: {
      ja: {
        name: '和暦⇔西暦変換',
        description:
          '明治・大正・昭和・平成・令和の和暦と西暦を相互に変換します。改元日をまたぐ日付にも対応した元号早見表付き。',
        category: '変換',
      },
      en: {
        name: 'Japanese Era Converter',
        description:
          'Converts between the Japanese era calendar (Meiji, Taisho, Showa, Heisei, Reiwa) and the Western year, with an era reference table covering transition dates.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'date-calculator',
    translations: {
      ja: {
        name: '日数計算機',
        description:
          '二つの日付の差（日数）や、指定した日から○日後・○日前の日付を計算します。初日を含めて数えるかどうかも選択可能。',
        category: '計算',
      },
      en: {
        name: 'Date Calculator',
        description:
          'Calculates the difference in days between two dates, or the date a set number of days before or after a given date, with an option to count both endpoints.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'age-calculator',
    translations: {
      ja: {
        name: '年齢計算機',
        description:
          '生年月日から満年齢・数え年・生まれてから経過した日数・次の誕生日までの日数を計算します。基準日を指定して未来・過去時点の年齢も確認可能。',
        category: '計算',
      },
      en: {
        name: 'Age Calculator',
        description:
          'Calculates the exact age, traditional East Asian age, days lived, and days until the next birthday from a date of birth, with a customizable reference date.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'hourly-wage-calculator',
    translations: {
      ja: {
        name: '時給・日給・月給換算＆残業代計算機',
        description:
          '時給・日給・月給・年収を相互換算し、時間外労働・法定休日労働・深夜労働の割増賃金（残業代）もまとめてシミュレーションできます。',
        category: '計算',
      },
      en: {
        name: 'Hourly Wage Converter & Overtime Pay Calculator',
        description:
          'Converts between hourly, daily, monthly, and annual wages, and simulates overtime, holiday, and late-night premium pay.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'tax-calculator',
    translations: {
      ja: {
        name: '消費税・割引計算機',
        description:
          '税込/税抜金額を相互に変換し、割引率や割引額からセール後の価格も計算します。標準税率10%・軽減税率8%・カスタム税率に対応。',
        category: '計算',
      },
      en: {
        name: 'Consumption Tax & Discount Calculator',
        description:
          'Converts between tax-included and tax-excluded prices, and calculates the discounted price from a discount rate or amount.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'sql-formatter',
    translations: {
      ja: {
        name: 'SQL整形',
        description:
          'SQLクエリを整形・ミニファイします。MySQL・PostgreSQL・SQLite・BigQuery等の方言、インデント幅、キーワードの大文字/小文字に対応。',
        category: '変換',
      },
      en: {
        name: 'SQL Formatter',
        description:
          'Formats and minifies SQL queries, with support for MySQL, PostgreSQL, SQLite, BigQuery and other dialects, indent width, and keyword case.',
        category: 'Convert',
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
