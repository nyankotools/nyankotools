export type Locale = 'ja' | 'en';

/** カテゴリID。表示名は `categories` から引く（サイドバー開閉保存・カテゴリ別LPのURLはこのIDを使う） */
export const categoryIds = [
  'text',
  'data',
  'encode',
  'datetime',
  'image',
  'pdf',
  'calc',
  'dev',
  'generate',
  'camera',
] as const;

export type CategoryId = (typeof categoryIds)[number];

/** カテゴリの表示名（サイドバー・トップの表示順は、ツールの登録順での初出順） */
export const categories: Record<CategoryId, Record<Locale, string>> = {
  text: { ja: 'テキスト', en: 'Text' },
  data: { ja: 'データ変換', en: 'Data Formats' },
  encode: { ja: 'エンコード/デコード', en: 'Encode/Decode' },
  datetime: { ja: '日付・時間', en: 'Date & Time' },
  image: { ja: '画像・デザイン', en: 'Image & Design' },
  pdf: { ja: 'PDF', en: 'PDF' },
  calc: { ja: '計算', en: 'Calculate' },
  dev: { ja: '開発', en: 'Development' },
  generate: { ja: '生成', en: 'Generate' },
  camera: { ja: 'カメラ', en: 'Camera' },
};

export interface ToolTranslation {
  name: string;
  /** 検索用の別名・関連キーワード（表記ゆれ・略称・英語表記など。トップの検索対象になる） */
  keywords: string[];
  description: string;
}

export interface Tool {
  slug: string;
  category: CategoryId;
  /** 公開日（YYYY-MM-DD）。「新着」表示・更新情報・sitemapのlastmodに使う */
  addedAt: string;
  /** 最終更新日（YYYY-MM-DD）。機能追加・大きな改修のたびに更新する。初公開時は addedAt と同じ */
  updatedAt: string;
  /** 関連ツールのslug（「関連ツール」欄の表示用。存在しないslug・自己参照は tools.test.ts が検出する） */
  related: string[];
  /**
   * 秘密情報・個人情報（写真・書類を含む）・健康・収入を入力として扱う。
   * 任意のデータを貼り付ける変換・整形系（JSON/YAML/CSV/URL など）も対象。
   * URLクエリ初期値・入力状態の保持の対象外にする。迷ったら付ける側に倒す。
   */
  sensitive?: boolean;
  /** 重いライブラリ（wasm・PDF処理・大きめのJSライブラリなど）を読み込む */
  heavy?: boolean;
  /** カメラ・マイクの権限を要求する */
  needsCamera?: boolean;
  /** 広告を表示してよいか（省略時は表示可） */
  ads?: boolean;
  translations: Record<Locale, ToolTranslation>;
}

/** ロケールごとに文言を解決した、表示・検索用のツール情報 */
export interface LocalizedTool {
  slug: string;
  name: string;
  keywords: string[];
  description: string;
  categoryId: CategoryId;
  /** カテゴリの表示名（ロケール解決済み） */
  category: string;
}

export const tools: Tool[] = [
  {
    slug: 'char-counter',
    category: 'text',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['text-diff', 'text-case-converter', 'text-list-tools'],
    translations: {
      ja: {
        name: '文字数カウント',
        keywords: [
          '文字数',
          '文字カウント',
          '字数',
          '単語数',
          '行数',
          'バイト数',
        ],
        description:
          '入力したテキストの文字数・単語数・行数をリアルタイムで数えます。',
      },
      en: {
        name: 'Character Counter',
        keywords: [
          'word count',
          'character count',
          'letter count',
          'text length',
        ],
        description:
          'Counts the characters, words, and lines of your text in real time.',
      },
    },
  },
  {
    slug: 'zenkaku-hankaku',
    category: 'text',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['kana-converter', 'text-case-converter', 'char-counter'],
    translations: {
      ja: {
        name: '全角/半角変換',
        keywords: ['全角', '半角', '全角半角変換', '英数字', 'カタカナ'],
        description:
          '英数字・記号・カタカナ・スペースを対象に、全角と半角を相互に変換します。変換したい文字種を個別に選択可能。',
      },
      en: {
        name: 'Full-width / Half-width Converter',
        keywords: [
          'fullwidth',
          'halfwidth',
          'zenkaku',
          'hankaku',
          'width converter',
        ],
        description:
          'Converts between full-width and half-width for alphanumerics, symbols, katakana, and spaces, with each character type selectable individually.',
      },
    },
  },
  {
    slug: 'kana-converter',
    category: 'text',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['zenkaku-hankaku', 'text-case-converter', 'char-counter'],
    translations: {
      ja: {
        name: 'ひらがな/カタカナ変換',
        keywords: ['ひらがな', 'カタカナ', '平仮名', '片仮名', 'かな変換'],
        description:
          'ひらがなとカタカナを相互に変換します。濁音・半濁音・拗音・促音・踊り字にも対応。',
      },
      en: {
        name: 'Hiragana / Katakana Converter',
        keywords: ['hiragana', 'katakana', 'kana', 'japanese script'],
        description:
          'Converts Japanese text between hiragana and katakana — handy for learners checking vocabulary, flashcards, and loanwords.',
      },
    },
  },
  {
    slug: 'json-formatter',
    category: 'data',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['json-path-tester', 'yaml-json-converter', 'csv-json-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: 'JSON整形',
        keywords: [
          'JSON',
          '整形',
          'フォーマット',
          '圧縮',
          'minify',
          'pretty print',
          'バリデーション',
        ],
        description:
          'JSONデータを整形・圧縮し、構文エラーがあれば分かりやすく表示します。',
      },
      en: {
        name: 'JSON Formatter',
        keywords: [
          'JSON',
          'pretty print',
          'beautify',
          'minify',
          'validator',
          'lint',
        ],
        description:
          'Formats and minifies JSON data, with clear syntax error messages.',
      },
    },
  },
  {
    slug: 'yaml-json-converter',
    category: 'data',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['json-formatter', 'toml-converter', 'csv-json-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: 'YAML⇔JSON変換',
        keywords: [
          'YAML',
          'YML',
          'JSON',
          '変換',
          'Docker Compose',
          'GitHub Actions',
        ],
        description:
          'YAMLとJSONを相互に変換します。Docker ComposeやGitHub Actionsなどの設定ファイル確認に便利。',
      },
      en: {
        name: 'YAML to JSON Converter',
        keywords: [
          'YAML',
          'YML',
          'JSON',
          'convert',
          'docker compose',
          'github actions',
        ],
        description:
          'Converts between YAML and JSON, handy for checking Docker Compose or GitHub Actions config files.',
      },
    },
  },
  {
    slug: 'csv-json-converter',
    category: 'data',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['json-formatter', 'yaml-json-converter', 'text-list-tools'],
    sensitive: true,
    translations: {
      ja: {
        name: 'CSV⇔JSON変換',
        keywords: ['CSV', 'JSON', '変換', 'TSV', 'タブ区切り', 'カンマ区切り'],
        description:
          'CSVとJSONを相互に変換します。ヘッダー行をキーとして使用し、カンマ・タブ区切りや引用符付きフィールドにも対応。',
      },
      en: {
        name: 'CSV to JSON Converter',
        keywords: ['CSV', 'JSON', 'TSV', 'convert', 'delimiter'],
        description:
          'Converts between CSV and JSON using the header row as keys, with support for comma/tab delimiters and quoted fields.',
      },
    },
  },
  {
    slug: 'toml-converter',
    category: 'data',
    addedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    related: ['yaml-json-converter', 'json-formatter', 'csv-json-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: 'TOML⇔JSON/YAML変換',
        keywords: ['TOML', 'JSON', 'YAML', '変換', '設定ファイル', 'pyproject'],
        description:
          'TOML・JSON・YAMLを相互に変換します。Cargo.tomlやpyproject.tomlなどのTOML設定ファイル確認に便利。',
      },
      en: {
        name: 'TOML to JSON/YAML Converter',
        keywords: ['TOML', 'JSON', 'YAML', 'convert', 'config', 'cargo'],
        description:
          'Converts between TOML, JSON, and YAML, handy for checking a TOML config file like Cargo.toml or pyproject.toml.',
      },
    },
  },
  {
    slug: 'markdown-preview',
    category: 'data',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['pdf-to-markdown', 'html-escape', 'text-diff'],
    translations: {
      ja: {
        name: 'Markdown⇔HTML変換',
        keywords: ['Markdown', 'マークダウン', 'プレビュー', 'md', 'エディタ'],
        description:
          'Markdownをリアルタイムプレビューしながら、HTMLと相互変換します。README や記事の下書き確認に便利。',
      },
      en: {
        name: 'Markdown to HTML Converter',
        keywords: ['markdown', 'preview', 'md', 'editor', 'live preview'],
        description:
          'Converts Markdown to HTML with a live preview, and HTML back to Markdown. Handy for checking a README or article draft.',
      },
    },
  },
  {
    slug: 'unix-timestamp',
    category: 'datetime',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['date-calculator', 'cron-parser', 'japanese-era-converter'],
    translations: {
      ja: {
        name: 'Unixタイムスタンプ変換',
        keywords: [
          'UNIXタイムスタンプ',
          'エポック',
          'epoch',
          '日時変換',
          'UNIX時間',
        ],
        description:
          'Unixタイムスタンプ（エポック秒・ミリ秒）と日時を相互に変換します。現在時刻の取得にも対応。',
      },
      en: {
        name: 'Unix Timestamp Converter',
        keywords: ['unix timestamp', 'epoch', 'epoch time', 'date converter'],
        description:
          'Converts between a Unix timestamp (epoch seconds or milliseconds) and a date/time, and shows the current timestamp.',
      },
    },
  },
  {
    slug: 'color-converter',
    category: 'image',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: [
      'contrast-checker',
      'css-gradient-generator',
      'image-palette-extractor',
    ],
    translations: {
      ja: {
        name: 'カラーコード変換',
        keywords: [
          'カラーコード',
          'HEX',
          'RGB',
          'HSL',
          '色変換',
          'カラーピッカー',
        ],
        description:
          'HEX・RGB・HSLのカラーコードを相互に変換します。カラーピッカーで色を選ぶこともできます。',
      },
      en: {
        name: 'Color Converter',
        keywords: [
          'color code',
          'hex',
          'rgb',
          'hsl',
          'color picker',
          'color converter',
        ],
        description:
          'Converts color codes between HEX, RGB, and HSL, with a color picker for choosing colors visually.',
      },
    },
  },
  {
    slug: 'base64',
    category: 'encode',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['image-to-base64', 'url-encode', 'jwt-decoder'],
    sensitive: true,
    translations: {
      ja: {
        name: 'Base64エンコード/デコード',
        keywords: ['Base64', 'エンコード', 'デコード', '変換', 'base64url'],
        description:
          'テキストとBase64文字列を相互に変換します。日本語などのマルチバイト文字にも対応。',
      },
      en: {
        name: 'Base64 Encoder/Decoder',
        keywords: ['base64', 'encode', 'decode', 'base64url'],
        description:
          'Converts text to and from Base64, with full support for multibyte characters.',
      },
    },
  },
  {
    slug: 'url-encode',
    category: 'encode',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['base64', 'html-escape', 'encoding-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: 'URLエンコード/デコード',
        keywords: [
          'URLエンコード',
          'パーセントエンコーディング',
          'デコード',
          'クエリ文字列',
        ],
        description:
          'テキストとパーセントエンコード形式を相互に変換します。クエリパラメータの日本語などマルチバイト文字にも対応。',
      },
      en: {
        name: 'URL Encoder/Decoder',
        keywords: [
          'url encode',
          'percent encoding',
          'decode',
          'query string',
          'encodeURIComponent',
        ],
        description:
          'Converts text to and from percent-encoding, with full support for multibyte characters in query parameters.',
      },
    },
  },
  {
    slug: 'kishu-izon-checker',
    category: 'text',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['encoding-converter', 'zenkaku-hankaku', 'char-counter'],
    translations: {
      ja: {
        name: '機種依存文字チェッカー',
        keywords: [
          '機種依存文字',
          '文字化け',
          '丸数字',
          '環境依存文字',
          'Shift_JIS',
        ],
        description:
          '①②③などの丸数字やⅠⅡⅢのローマ数字、㈱㍉㍻といった機種依存文字（環境依存文字）を検出し、安全な表記への置き換え案も表示します。',
      },
      en: {
        name: 'Machine-Dependent Character Checker',
        keywords: [
          'platform dependent characters',
          'mojibake',
          'garbled text',
          'Shift_JIS',
          'circled numbers',
        ],
        description:
          'Detects machine-dependent characters such as circled numbers, Roman numerals, and ligatures like ㈱ ㍉ ㍻, with a safe replacement suggestion for each.',
      },
    },
  },
  {
    slug: 'html-escape',
    category: 'encode',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['url-encode', 'base64', 'markdown-preview'],
    translations: {
      ja: {
        name: 'HTML/JS文字列エスケープ・アンエスケープ',
        keywords: [
          'HTMLエスケープ',
          '特殊文字',
          'エンティティ',
          'アンエスケープ',
          'XSS',
        ],
        description:
          'HTMLの特殊文字（& < > " \'）やJavaScript文字列内の改行・クォートなどを相互に変換します。XSS対策やコード生成時の文字列組み立てに便利。',
      },
      en: {
        name: 'HTML/JS String Escape & Unescape',
        keywords: [
          'html escape',
          'html entities',
          'unescape',
          'special characters',
          'XSS',
        ],
        description:
          'Escapes and unescapes HTML special characters (& < > " \') and JavaScript string escape sequences such as newlines and quotes.',
      },
    },
  },
  {
    slug: 'uuid-generator',
    category: 'generate',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['password-generator', 'hash-generator', 'unix-timestamp'],
    translations: {
      ja: {
        name: 'UUID生成',
        keywords: ['UUID', 'GUID', 'ランダムID', 'v4', 'v7', '一意ID'],
        description:
          'ランダムなUUID（v4）を1件〜100件まとめて生成します。ハイフンなし・大文字表記にも対応。',
      },
      en: {
        name: 'UUID Generator',
        keywords: ['UUID', 'GUID', 'random id', 'v4', 'v7', 'unique id'],
        description:
          'Generates 1 to 100 random UUIDs (v4) at once, with optional hyphen removal and uppercase formatting.',
      },
    },
  },
  {
    slug: 'password-generator',
    category: 'generate',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['hash-generator', 'uuid-generator', 'qr-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: 'パスワード生成',
        keywords: [
          'パスワード',
          'パスワード生成',
          'ランダム',
          '強力なパスワード',
          '安全',
        ],
        description:
          '文字種（大文字・小文字・数字・記号）と桁数を指定して、安全なランダムパスワードを生成します。強度の目安も表示。',
      },
      en: {
        name: 'Password Generator',
        keywords: [
          'password',
          'password generator',
          'random password',
          'strong password',
          'secure',
        ],
        description:
          'Generates strong random passwords by choosing character types (uppercase, lowercase, numbers, symbols) and length, with a strength estimate.',
      },
    },
  },
  {
    slug: 'hash-generator',
    category: 'generate',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['base64', 'password-generator', 'uuid-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: 'ハッシュ生成',
        keywords: ['ハッシュ', 'SHA-256', 'SHA-1', 'MD5', 'チェックサム'],
        description:
          'テキストからMD5・SHA-1・SHA-256のハッシュ値をリアルタイムで計算します。',
      },
      en: {
        name: 'Hash Generator',
        keywords: ['hash', 'SHA-256', 'SHA-1', 'MD5', 'checksum', 'digest'],
        description:
          'Computes MD5, SHA-1, and SHA-256 hashes from text in real time.',
      },
    },
  },
  {
    slug: 'regex-tester',
    category: 'dev',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['text-diff', 'json-path-tester', 'text-list-tools'],
    translations: {
      ja: {
        name: '正規表現テスター',
        keywords: ['正規表現', 'regex', 'RegExp', 'マッチ', '置換', 'テスター'],
        description:
          '正規表現のパターンとテスト文字列を入力すると、マッチ箇所のハイライト表示・キャプチャグループの一覧・置換結果のプレビューができます。',
      },
      en: {
        name: 'Regex Tester',
        keywords: [
          'regex',
          'regular expression',
          'regexp',
          'match',
          'replace',
          'tester',
        ],
        description:
          'Tests a regular expression against sample text with match highlighting, a capture group list, and a live replacement preview.',
      },
    },
  },
  {
    slug: 'text-diff',
    category: 'text',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['char-counter', 'regex-tester', 'line-ending-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: 'テキスト差分比較（diff）',
        keywords: ['差分', 'diff', 'テキスト比較', 'ファイル比較', '違い'],
        description:
          '2つのテキストを行単位で比較し、追加・削除された箇所をハイライト表示します。空白や大文字小文字の違いを無視する比較にも対応。',
      },
      en: {
        name: 'Text Diff Checker',
        keywords: ['diff', 'text compare', 'difference', 'file compare'],
        description:
          'Compares two texts line by line and highlights added and removed lines, with options to ignore whitespace or case differences.',
      },
    },
  },
  {
    slug: 'jwt-decoder',
    category: 'encode',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['base64', 'json-formatter', 'unix-timestamp'],
    sensitive: true,
    translations: {
      ja: {
        name: 'JWTデコーダー',
        keywords: ['JWT', 'JSON Web Token', 'トークン', 'デコード', '認証'],
        description:
          'JWT（JSON Web Token）のヘッダーとペイロードをデコードして整形表示します。exp/iat等の日時クレームも人が読める形式に変換。署名の検証は行いません。',
      },
      en: {
        name: 'JWT Decoder',
        keywords: ['JWT', 'JSON Web Token', 'token', 'decode', 'auth'],
        description:
          'Decodes a JWT (JSON Web Token) and displays its header and payload as formatted JSON, with time-based claims like exp/iat shown as human-readable dates. The signature is not verified.',
      },
    },
  },
  {
    slug: 'lorem-ipsum',
    category: 'text',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['placeholder-image-generator', 'char-counter', 'text-list-tools'],
    translations: {
      ja: {
        name: 'ダミーテキスト生成',
        keywords: [
          'ダミーテキスト',
          'Lorem Ipsum',
          'ダミー文章',
          '仮テキスト',
          'サンプル文',
        ],
        description:
          'Lorem ipsum（欧文）または日本語のダミーテキストを、段落・文・単語単位で指定した個数だけ生成します。',
      },
      en: {
        name: 'Dummy Text Generator',
        keywords: [
          'lorem ipsum',
          'dummy text',
          'placeholder text',
          'filler text',
        ],
        description:
          'Generates Lorem ipsum (Latin) or Japanese placeholder text by paragraphs, sentences, or words, in any count you choose.',
      },
    },
  },
  {
    slug: 'text-list-tools',
    category: 'text',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['char-counter', 'text-diff', 'csv-json-converter'],
    translations: {
      ja: {
        name: '文字列の重複削除・ソート・シャッフル',
        keywords: [
          '重複削除',
          'ソート',
          '行ソート',
          'リスト整形',
          '並べ替え',
          '行操作',
        ],
        description:
          '改行区切りのテキストの重複行削除・昇順/降順/数値ソート・ランダムシャッフルをまとめて行います。空行削除や前後の空白削除にも対応。',
      },
      en: {
        name: 'Text List Deduplicate, Sort & Shuffle',
        keywords: [
          'remove duplicates',
          'sort lines',
          'dedupe',
          'list tools',
          'line sort',
        ],
        description:
          'Deduplicates, sorts (alphabetical, reverse, or numeric), or randomly shuffles newline-separated text, with options to remove empty lines and trim whitespace.',
      },
    },
  },
  {
    slug: 'line-ending-converter',
    category: 'text',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['encoding-converter', 'text-diff', 'char-counter'],
    translations: {
      ja: {
        name: '改行コード変換',
        keywords: ['改行コード', 'CRLF', 'LF', 'CR', '改行変換'],
        description:
          'テキストの改行コード（LF/CRLF/CR）を判定し、指定した種類に統一変換します。',
      },
      en: {
        name: 'Line Ending Converter',
        keywords: ['line ending', 'CRLF', 'LF', 'newline', 'EOL', 'convert'],
        description:
          'Detects the line endings (LF, CRLF, or CR) in your text and converts them all to the type you choose.',
      },
    },
  },
  {
    slug: 'qr-generator',
    category: 'generate',
    addedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    related: ['url-encode', 'favicon-generator', 'image-converter'],
    translations: {
      ja: {
        name: 'QRコード生成',
        keywords: ['QRコード', 'QR', '二次元コード', 'QRコード作成'],
        description:
          'URLやテキストからQRコードを生成し、PNG画像としてダウンロードできます。誤り訂正レベルも選択可能。',
      },
      en: {
        name: 'QR Code Generator',
        keywords: ['QR code', 'QR', 'qr generator', '2D code'],
        description:
          'Generates a QR code from a URL or text and downloads it as a PNG, with a selectable error correction level.',
      },
    },
  },
  {
    slug: 'cron-parser',
    category: 'datetime',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['unix-timestamp', 'date-calculator', 'regex-tester'],
    translations: {
      ja: {
        name: 'Cron式スケジュールシミュレーター',
        keywords: [
          'cron',
          'クーロン',
          'クロン',
          'crontab',
          'スケジュール',
          '定期実行',
        ],
        description:
          'cron式の意味を日本語で解説し、次回の実行予定日時を一覧表示します。crontabやGitHub Actionsの動作確認に便利。',
      },
      en: {
        name: 'Cron Expression Simulator',
        keywords: [
          'cron',
          'crontab',
          'schedule',
          'cron expression',
          'cron parser',
        ],
        description:
          'Explains a cron expression in plain English and lists its upcoming run times. Handy for checking crontab or GitHub Actions schedules.',
      },
    },
  },
  {
    slug: 'japanese-era-converter',
    category: 'datetime',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['date-calculator', 'age-calculator', 'unix-timestamp'],
    translations: {
      ja: {
        name: '和暦⇔西暦変換',
        keywords: [
          '和暦',
          '西暦',
          '元号',
          '令和',
          '平成',
          '昭和',
          '和暦西暦変換',
        ],
        description:
          '明治・大正・昭和・平成・令和の和暦と西暦を相互に変換します。改元日をまたぐ日付にも対応した元号早見表付き。',
      },
      en: {
        name: 'Japanese Era Converter',
        keywords: [
          'japanese era',
          'wareki',
          'gengo',
          'reiwa',
          'heisei',
          'showa',
          'year converter',
        ],
        description:
          'Converts between the Japanese era calendar (Meiji, Taisho, Showa, Heisei, Reiwa) and the Western year, with an era reference table covering transition dates.',
      },
    },
  },
  {
    slug: 'date-calculator',
    category: 'datetime',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['age-calculator', 'japanese-era-converter', 'unix-timestamp'],
    translations: {
      ja: {
        name: '日数計算機',
        keywords: [
          '日付計算',
          '日数計算',
          '営業日',
          '日数差',
          '何日後',
          '何日前',
        ],
        description:
          '二つの日付の差（日数）や、指定した日から○日後・○日前の日付を計算します。初日を含めて数えるかどうかも選択可能。',
      },
      en: {
        name: 'Date Calculator',
        keywords: [
          'date calculator',
          'days between',
          'business days',
          'add days',
          'date difference',
        ],
        description:
          'Calculates the difference in days between two dates, or the date a set number of days before or after a given date, with an option to count both endpoints.',
      },
    },
  },
  {
    slug: 'age-calculator',
    category: 'datetime',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: ['date-calculator', 'japanese-era-converter', 'bmi-calculator'],
    sensitive: true,
    translations: {
      ja: {
        name: '年齢計算機',
        keywords: ['年齢計算', '満年齢', '生年月日', '誕生日'],
        description:
          '生年月日から満年齢・数え年・生まれてから経過した日数・次の誕生日までの日数を計算します。基準日を指定して未来・過去時点の年齢も確認可能。',
      },
      en: {
        name: 'Age Calculator',
        keywords: [
          'age calculator',
          'birthday',
          'date of birth',
          'age in days',
        ],
        description:
          'Calculates the exact age, traditional East Asian age, days lived, and days until the next birthday from a date of birth, with a customizable reference date.',
      },
    },
  },
  {
    slug: 'hourly-wage-calculator',
    category: 'calc',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: [
      'tax-calculator',
      'freelance-income-calculator',
      'ratio-calculator',
    ],
    sensitive: true,
    translations: {
      ja: {
        name: '時給・日給・月給換算＆残業代計算機',
        keywords: [
          '時給',
          '日給',
          '月給',
          '年収',
          '割増賃金',
          '残業代',
          '時給換算',
        ],
        description:
          '時給・日給・月給・年収を相互換算し、時間外労働・法定休日労働・深夜労働の割増賃金（残業代）もまとめてシミュレーションできます。',
      },
      en: {
        name: 'Hourly Wage Converter & Overtime Pay Calculator',
        keywords: [
          'hourly wage',
          'salary',
          'overtime pay',
          'annual income',
          'wage converter',
        ],
        description:
          'Converts between hourly, daily, monthly, and annual wages, and simulates overtime, holiday, and late-night premium pay.',
      },
    },
  },
  {
    slug: 'tax-calculator',
    category: 'calc',
    addedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    related: [
      'freelance-income-calculator',
      'hourly-wage-calculator',
      'mortgage-calculator',
    ],
    translations: {
      ja: {
        name: '消費税・割引計算機',
        keywords: [
          '消費税',
          '税込',
          '税抜',
          '税率',
          '軽減税率',
          'インボイス',
          '内税',
          '外税',
        ],
        description:
          '税込/税抜金額を相互に変換し、割引率や割引額からセール後の価格も計算します。標準税率10%・軽減税率8%・カスタム税率に対応。',
      },
      en: {
        name: 'Consumption Tax & Discount Calculator',
        keywords: [
          'sales tax',
          'consumption tax',
          'tax included',
          'tax excluded',
          'VAT',
        ],
        description:
          'Converts between tax-included and tax-excluded prices, and calculates the discounted price from a discount rate or amount.',
      },
    },
  },
  {
    slug: 'ratio-calculator',
    category: 'calc',
    addedAt: '2026-09-23',
    updatedAt: '2026-09-23',
    related: ['px-rem-converter', 'viewport-checker', 'image-resizer'],
    translations: {
      ja: {
        name: '割合・比率計算機',
        keywords: ['比率', '比', 'アスペクト比', '縦横比', '割合', '比例'],
        description:
          '比を最も簡単な整数比に約分し、比例式（A:B=C:D）の空欄の値や、部分・全体・割合(%)・増減率を相互に計算します。',
      },
      en: {
        name: 'Ratio & Percentage Calculator',
        keywords: [
          'ratio',
          'aspect ratio',
          'proportion',
          'scale',
          'ratio calculator',
        ],
        description:
          'Reduces a ratio to its simplest whole-number form, solves for a missing term in a proportion, and converts between a part, a whole, a percentage, and a rate of change.',
      },
    },
  },
  {
    slug: 'bmi-calculator',
    category: 'calc',
    addedAt: '2026-09-23',
    updatedAt: '2026-09-23',
    related: ['age-calculator', 'ratio-calculator'],
    sensitive: true,
    translations: {
      ja: {
        name: 'BMI計算機',
        keywords: ['BMI', '体格指数', '肥満度', '適正体重', '標準体重'],
        description:
          '身長・体重からBMI（体格指数）を計算し、日本肥満学会の基準に基づく肥満度判定と普通体重の範囲を表示します。',
      },
      en: {
        name: 'BMI Calculator',
        keywords: ['BMI', 'body mass index', 'healthy weight', 'obesity'],
        description:
          'Calculates your Body Mass Index from height and weight, shows the WHO weight category, and gives the healthy weight range for your height.',
      },
    },
  },
  {
    slug: 'freelance-income-calculator',
    category: 'calc',
    addedAt: '2026-09-23',
    updatedAt: '2026-09-23',
    related: [
      'tax-calculator',
      'hourly-wage-calculator',
      'investment-simulator',
    ],
    sensitive: true,
    translations: {
      ja: {
        name: 'フリーランス手取り計算機',
        keywords: [
          'フリーランス',
          '手取り',
          '個人事業主',
          '所得税',
          '住民税',
          '国民健康保険',
          '年収',
        ],
        description:
          '年間の売上・必要経費・青色申告特別控除・社会保険料から、所得税・復興特別所得税・住民税と手取り額を簡易試算します。',
      },
      en: {
        name: 'Freelancer Take-Home Pay Calculator',
        keywords: [
          'freelance',
          'take-home pay',
          'self-employed',
          'income tax',
          'net income',
        ],
        description:
          "Estimates a Japanese freelancer's income tax, reconstruction surtax, and resident tax from annual revenue, expenses, and deductions, with a rough take-home pay figure.",
      },
    },
  },
  {
    slug: 'mortgage-calculator',
    category: 'calc',
    addedAt: '2026-09-23',
    updatedAt: '2026-09-23',
    related: [
      'investment-simulator',
      'scholarship-repayment-simulator',
      'tax-calculator',
    ],
    sensitive: true,
    translations: {
      ja: {
        name: '住宅ローン繰り上げ返済比較シミュレーション',
        keywords: [
          '住宅ローン',
          'ローン返済',
          '毎月返済額',
          '元利均等',
          '元金均等',
          '借入',
        ],
        description:
          '借入残高・金利・残りの返済期間と繰り上げ返済額から、「期間短縮型」「返済額軽減型」それぞれの利息軽減額・返済期間短縮・返済額軽減効果を比較します。',
      },
      en: {
        name: 'Mortgage Prepayment Comparison Calculator',
        keywords: [
          'mortgage',
          'loan repayment',
          'monthly payment',
          'amortization',
          'loan calculator',
        ],
        description:
          'Compares the interest saved, term shortened, or monthly payment reduced by a lump-sum mortgage prepayment, for both the "shorten term" and "reduce payment" strategies.',
      },
    },
  },
  {
    slug: 'investment-simulator',
    category: 'calc',
    addedAt: '2026-09-23',
    updatedAt: '2026-09-23',
    related: [
      'mortgage-calculator',
      'tax-calculator',
      'scholarship-repayment-simulator',
    ],
    sensitive: true,
    translations: {
      ja: {
        name: '資産運用シミュレーション',
        keywords: [
          '投資',
          '積立',
          '複利',
          'NISA',
          '資産運用',
          'シミュレーション',
        ],
        description:
          '初期投資額・毎月の積立額・想定利回り・積立期間のうち3つから残る1つを複利計算で試算します。積立元本と運用益の内訳をグラフと年別の表で確認でき、取り崩し可能額（毎月）もあわせて試算できます。',
      },
      en: {
        name: 'Investment Growth Simulator',
        keywords: [
          'investment',
          'compound interest',
          'savings',
          'NISA',
          'portfolio',
          'simulation',
        ],
        description:
          'Solves for any one of initial investment, monthly contribution, annual return, or time horizon from the other three under compound interest, with a chart and year-by-year table, plus a sustainable monthly withdrawal estimate.',
      },
    },
  },
  {
    slug: 'sql-formatter',
    category: 'data',
    addedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    related: ['code-minifier', 'json-formatter', 'regex-tester'],
    heavy: true,
    translations: {
      ja: {
        name: 'SQL整形',
        keywords: [
          'SQL',
          '整形',
          'フォーマット',
          'クエリ',
          'MySQL',
          'PostgreSQL',
        ],
        description:
          'SQLクエリを整形・ミニファイします。MySQL・PostgreSQL・SQLite・BigQuery等の方言、インデント幅、キーワードの大文字/小文字に対応。',
      },
      en: {
        name: 'SQL Formatter',
        keywords: [
          'SQL',
          'formatter',
          'beautify',
          'query',
          'MySQL',
          'PostgreSQL',
        ],
        description:
          'Formats and minifies SQL queries, with support for MySQL, PostgreSQL, SQLite, BigQuery and other dialects, indent width, and keyword case.',
      },
    },
  },
  {
    slug: 'code-minifier',
    category: 'data',
    addedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    related: ['sql-formatter', 'svg-optimizer', 'json-formatter'],
    heavy: true,
    translations: {
      ja: {
        name: 'CSS/JS/HTMLミニファイ＆整形',
        keywords: [
          'minify',
          '圧縮',
          'ミニファイ',
          'JavaScript',
          'CSS',
          'HTML',
          '軽量化',
        ],
        description:
          'CSS・JavaScript・HTMLのコードを整形・ミニファイします。インデント幅の指定にも対応。',
      },
      en: {
        name: 'CSS/JS/HTML Minifier',
        keywords: [
          'minify',
          'minifier',
          'compress',
          'JavaScript',
          'CSS',
          'HTML',
          'uglify',
        ],
        description:
          'Formats and minifies CSS, JavaScript, and HTML code, with a selectable indent width.',
      },
    },
  },
  {
    slug: 'chmod-calculator',
    category: 'dev',
    addedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    related: ['cidr-calculator', 'base-converter', 'cron-parser'],
    translations: {
      ja: {
        name: 'Chmodパーミッション計算機',
        keywords: ['chmod', 'パーミッション', '権限', 'Linux', '755', '644'],
        description:
          'ファイルパーミッションをチェックボックス・8進数（755等）・シンボル表記（rwxr-xr-x等）で相互変換します。setuid/setgid/スティッキービットにも対応。',
      },
      en: {
        name: 'Chmod Permission Calculator',
        keywords: ['chmod', 'permissions', 'linux', 'file mode', '755', '644'],
        description:
          'Converts file permissions between checkboxes, octal notation (e.g. 755), and symbolic notation (e.g. rwxr-xr-x), with setuid/setgid/sticky bit support.',
      },
    },
  },
  {
    slug: 'cidr-calculator',
    category: 'dev',
    addedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    related: ['chmod-calculator', 'base-converter'],
    translations: {
      ja: {
        name: 'CIDR/サブネット計算機',
        keywords: [
          'CIDR',
          'サブネット',
          'サブネットマスク',
          'IPアドレス',
          'ネットワーク',
          'IPv4',
        ],
        description:
          'CIDR表記やIPアドレス+サブネットマスクから、ネットワークアドレス・ブロードキャストアドレス・利用可能ホスト数を計算します。',
      },
      en: {
        name: 'CIDR / Subnet Calculator',
        keywords: [
          'CIDR',
          'subnet',
          'subnet mask',
          'IP address',
          'network',
          'IPv4',
        ],
        description:
          'Calculates the network address, broadcast address, and usable host count from CIDR notation or an IP address plus subnet mask.',
      },
    },
  },
  {
    slug: 'keycode-checker',
    category: 'dev',
    addedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    related: ['regex-tester', 'viewport-checker', 'webcam-tester'],
    translations: {
      ja: {
        name: 'キーコード（e.code/e.key）チェッカー',
        keywords: [
          'キーコード',
          'keyCode',
          'KeyboardEvent',
          'キー入力',
          'キーボード',
        ],
        description:
          '押したキーのevent.key・event.code・keyCode・location・修飾キーの状態をリアルタイムで表示します。JavaScriptのキーボードイベント実装時の値確認に便利。',
      },
      en: {
        name: 'Keycode (e.code / e.key) Checker',
        keywords: [
          'keycode',
          'key code',
          'KeyboardEvent',
          'keyboard',
          'key event',
        ],
        description:
          'Shows the event.key, event.code, keyCode, location, and modifier keys of any key you press, in real time. Handy for checking values while implementing keyboard event handling.',
      },
    },
  },
  {
    slug: 'viewport-checker',
    category: 'dev',
    addedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    related: ['px-rem-converter', 'ratio-calculator', 'keycode-checker'],
    translations: {
      ja: {
        name: 'スクリーンサイズ・Viewportチェッカー',
        keywords: [
          'ビューポート',
          '画面サイズ',
          '解像度',
          'ウィンドウサイズ',
          'レスポンシブ',
          'devicePixelRatio',
        ],
        description:
          'ビューポートサイズ・ウィンドウサイズ・画面解像度・デバイスピクセル比・Tailwind CSSのブレークポイントをリアルタイムで表示します。レスポンシブデザインの確認に便利。',
      },
      en: {
        name: 'Screen Size & Viewport Checker',
        keywords: [
          'viewport',
          'screen size',
          'resolution',
          'window size',
          'responsive',
          'devicePixelRatio',
        ],
        description:
          'Shows the viewport size, window size, screen resolution, device pixel ratio, and current Tailwind CSS breakpoint in real time. Handy for checking responsive designs.',
      },
    },
  },
  {
    slug: 'json-path-tester',
    category: 'dev',
    addedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    related: ['json-formatter', 'yaml-json-converter', 'regex-tester'],
    sensitive: true,
    translations: {
      ja: {
        name: 'JSON Path / JSON Pointerテスター',
        keywords: ['JSONPath', 'JSON抽出', 'クエリ', 'jq', 'パス式'],
        description:
          'JSONPathやJSON Pointer（RFC 6901）のクエリを入力すると、マッチした値と絶対パスを一覧表示します。APIレスポンスから値を取り出すクエリの動作確認に便利。',
      },
      en: {
        name: 'JSON Path / JSON Pointer Tester',
        keywords: [
          'JSONPath',
          'JSON query',
          'jq',
          'path expression',
          'extract',
        ],
        description:
          'Tests a JSONPath or JSON Pointer (RFC 6901) query against your JSON data and lists every matched value with its absolute path. Handy for checking a query before pulling a value out of an API response.',
      },
    },
  },
  {
    slug: 'text-case-converter',
    category: 'text',
    addedAt: '2026-09-18',
    updatedAt: '2026-09-18',
    related: ['char-counter', 'zenkaku-hankaku', 'kana-converter'],
    translations: {
      ja: {
        name: 'テキストケース変換',
        keywords: [
          '大文字',
          '小文字',
          'キャメルケース',
          'スネークケース',
          'ケバブケース',
          'パスカルケース',
        ],
        description:
          '文字列をcamelCase・PascalCase・snake_case・kebab-caseなど9種類の命名規則に一括変換します。プログラミングの変数名・関数名の書き換えに便利。',
      },
      en: {
        name: 'Text Case Converter',
        keywords: [
          'uppercase',
          'lowercase',
          'camelCase',
          'snake_case',
          'kebab-case',
          'PascalCase',
          'case converter',
        ],
        description:
          'Converts text into 9 naming conventions at once, including camelCase, PascalCase, snake_case, and kebab-case. Handy for renaming variables and functions.',
      },
    },
  },
  {
    slug: 'scholarship-repayment-simulator',
    category: 'calc',
    addedAt: '2026-09-23',
    updatedAt: '2026-09-23',
    related: ['mortgage-calculator', 'investment-simulator', 'tax-calculator'],
    sensitive: true,
    translations: {
      ja: {
        name: '奨学金返済シミュレーション',
        keywords: [
          '奨学金',
          '返済',
          '返済シミュレーション',
          'JASSO',
          '日本学生支援機構',
        ],
        description:
          'JASSO第二種奨学金（利子付き）を想定し、貸与総額・利率・返還期間から、利率固定方式・利率見直し方式それぞれの毎月の返済額・総返済額・総利息を簡易試算します。',
      },
      en: {
        name: 'JASSO Student Loan Repayment Simulator',
        keywords: [
          'scholarship',
          'student loan',
          'repayment',
          'JASSO',
          'loan simulator',
        ],
        description:
          'Estimates the monthly payment, total repayment, and total interest for a JASSO Type 2 (interest-bearing) student loan, comparing the fixed-rate and rate-review repayment methods.',
      },
    },
  },
  {
    slug: 'image-converter',
    category: 'image',
    addedAt: '2026-09-24',
    updatedAt: '2026-09-24',
    related: ['image-resizer', 'image-to-base64', 'favicon-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: '画像フォーマット変換',
        keywords: [
          '画像変換',
          'PNG',
          'JPEG',
          'JPG',
          'WebP',
          'フォーマット変換',
          '画像圧縮',
        ],
        description:
          'PNG・JPEG・GIF・BMP画像をWebP・JPEG・PNGに変換し、品質を指定して圧縮できます。複数画像の一括変換に対応。',
      },
      en: {
        name: 'Image Format Converter',
        keywords: [
          'image converter',
          'PNG',
          'JPEG',
          'JPG',
          'WebP',
          'format conversion',
          'image compress',
        ],
        description:
          'Converts PNG, JPEG, GIF, and BMP images to WebP, JPEG, or PNG with adjustable quality, and supports converting several files at once.',
      },
    },
  },
  {
    slug: 'image-resizer',
    category: 'image',
    addedAt: '2026-09-24',
    updatedAt: '2026-09-24',
    related: ['image-converter', 'image-pixelart-converter', 'exif-viewer'],
    sensitive: true,
    translations: {
      ja: {
        name: '画像リサイズ・圧縮',
        keywords: [
          '画像リサイズ',
          'サイズ変更',
          '画像縮小',
          '拡大',
          '画像圧縮',
          '解像度',
        ],
        description:
          '画像の幅・高さをpxまたは%指定でリサイズし、WebP・JPEG・PNGで圧縮できます。複数画像の一括処理に対応。',
      },
      en: {
        name: 'Image Resizer & Compressor',
        keywords: ['image resizer', 'resize image', 'scale image', 'shrink'],
        description:
          'Resizes images by pixel size or percentage and compresses them to WebP, JPEG, or PNG, with support for processing several files at once.',
      },
    },
  },
  {
    slug: 'image-to-base64',
    category: 'image',
    addedAt: '2026-09-24',
    updatedAt: '2026-09-24',
    related: ['base64', 'image-converter', 'svg-optimizer'],
    sensitive: true,
    translations: {
      ja: {
        name: '画像のBase64（Data URL）変換',
        keywords: ['画像Base64', 'データURI', 'data URI', '画像埋め込み'],
        description:
          '画像ファイルをBase64文字列・Data URLに変換したり、Base64文字列やData URLを画像に戻して保存できます。',
      },
      en: {
        name: 'Image to Base64 Converter',
        keywords: ['image to base64', 'data URI', 'data URL', 'embed image'],
        description:
          'Converts an image file to a Base64 string or Data URL, and converts a Base64 string or Data URL back into a downloadable image.',
      },
    },
  },
  {
    slug: 'favicon-generator',
    category: 'image',
    addedAt: '2026-09-24',
    updatedAt: '2026-09-24',
    related: ['image-converter', 'image-resizer', 'meta-tag-generator'],
    translations: {
      ja: {
        name: 'favicon一括生成',
        keywords: [
          'ファビコン',
          'favicon',
          'アイコン',
          'ico',
          'apple-touch-icon',
        ],
        description:
          '1枚の画像からfavicon.ico（16/32/48px同梱）と複数サイズのPNG（apple-touch-icon等）を一括生成し、HTML貼り付け用のlinkタグも出力します。',
      },
      en: {
        name: 'Favicon Generator',
        keywords: ['favicon', 'icon', 'ico', 'apple-touch-icon', 'site icon'],
        description:
          'Generates favicon.ico (bundling 16/32/48px) and multiple PNG sizes (apple-touch-icon, etc.) from a single image, plus the HTML link tags to reference them.',
      },
    },
  },
  {
    slug: 'exif-viewer',
    category: 'image',
    addedAt: '2026-09-24',
    updatedAt: '2026-09-24',
    related: ['image-converter', 'image-resizer', 'image-palette-extractor'],
    sensitive: true,
    translations: {
      ja: {
        name: 'EXIF情報表示・削除',
        keywords: [
          'EXIF',
          '位置情報',
          'GPS',
          '撮影日時',
          'メタデータ',
          '写真情報',
        ],
        description:
          'JPEG画像のExif（撮影日時・カメラ機種・レンズ・露出・GPS位置情報など）を一覧表示し、Exif情報だけを削除した画像（画質そのまま）をダウンロードできます。',
      },
      en: {
        name: 'EXIF Viewer & Remover',
        keywords: [
          'EXIF',
          'GPS',
          'metadata',
          'photo info',
          'camera info',
          'geotag',
        ],
        description:
          "Reads a JPEG photo's Exif metadata (date taken, camera, lens, exposure, GPS location, and more), and lets you download a copy with only the Exif data removed, at full quality.",
      },
    },
  },
  {
    slug: 'image-pixelart-converter',
    category: 'image',
    addedAt: '2026-09-24',
    updatedAt: '2026-09-24',
    related: ['image-resizer', 'image-palette-extractor', 'image-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: '画像ドット絵化・モザイク・減色',
        keywords: [
          'ドット絵',
          'ピクセルアート',
          'モザイク',
          '減色',
          'ドット化',
        ],
        description:
          '画像をブロックサイズ指定でモザイク・ドット絵風に、色数指定で減色できます。WebP・JPEG・PNGで書き出し可能。',
      },
      en: {
        name: 'Pixelate, Mosaic & Color Reduction',
        keywords: [
          'pixel art',
          'pixelate',
          'mosaic',
          '8-bit',
          'retro',
          'dot art',
        ],
        description:
          'Pixelates or mosaics an image by block size and reduces its color palette, then exports it as WebP, JPEG, or PNG.',
      },
    },
  },
  {
    slug: 'image-palette-extractor',
    category: 'image',
    addedAt: '2026-09-24',
    updatedAt: '2026-09-24',
    related: [
      'color-converter',
      'contrast-checker',
      'image-pixelart-converter',
    ],
    sensitive: true,
    translations: {
      ja: {
        name: '画像カラーパレット抽出',
        keywords: ['カラーパレット', '配色', '主要色', '色抽出'],
        description:
          '画像から主要な色を自動検出し、HEX・RGBコードと使用割合の一覧として表示・コピーできます。',
      },
      en: {
        name: 'Image Color Palette Extractor',
        keywords: [
          'color palette',
          'dominant colors',
          'color extractor',
          'swatches',
        ],
        description:
          'Detects the dominant colors in an image and lists each as a HEX/RGB code with its usage percentage, ready to copy.',
      },
    },
  },
  {
    slug: 'svg-optimizer',
    category: 'image',
    addedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    related: ['image-to-base64', 'code-minifier', 'image-converter'],
    heavy: true,
    translations: {
      ja: {
        name: 'SVG最適化（SVGO）',
        keywords: ['SVG', '最適化', '軽量化', 'SVGO', '圧縮'],
        description:
          'SVGファイルやコードをSVGOで最適化し、不要なメタデータを削除してファイルサイズを削減します。',
      },
      en: {
        name: 'SVG Optimizer (SVGO)',
        keywords: ['SVG', 'optimize', 'minify', 'SVGO', 'compress'],
        description:
          'Optimizes SVG files or code with SVGO, stripping unnecessary metadata to reduce file size.',
      },
    },
  },
  {
    slug: 'placeholder-image-generator',
    category: 'image',
    addedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    related: ['image-resizer', 'lorem-ipsum', 'cat-logo-text-generator'],
    translations: {
      ja: {
        name: 'ダミー画像生成',
        keywords: ['ダミー画像', 'プレースホルダー', '仮画像', 'サンプル画像'],
        description:
          '幅・高さ・背景色・文字を指定して、プレースホルダー用のダミー画像を生成しPNG・JPEG・WebPで保存できます。',
      },
      en: {
        name: 'Placeholder Image Generator',
        keywords: [
          'placeholder image',
          'dummy image',
          'mock image',
          'placeholder',
        ],
        description:
          'Generates dummy placeholder images from a width, height, colors, and text, and saves them as PNG, JPEG, or WebP.',
      },
    },
  },
  {
    slug: 'pdf-merge-split',
    category: 'pdf',
    addedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    related: ['pdf-page-editor', 'pdf-compressor', 'pdf-image-converter'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'PDF結合・分割・ページ抽出',
        keywords: ['PDF結合', 'PDF分割', 'PDFマージ', 'PDF抽出', 'ページ抽出'],
        description:
          '複数のPDFを1つに結合、PDFをページ数ごとに分割、必要なページだけを抽出します。',
      },
      en: {
        name: 'PDF Merge, Split & Extract',
        keywords: ['PDF merge', 'PDF split', 'combine PDF', 'extract pages'],
        description:
          'Merge several PDFs into one, split a PDF by page count, or extract just the pages you need.',
      },
    },
  },
  {
    slug: 'pdf-image-converter',
    category: 'pdf',
    addedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    related: ['pdf-merge-split', 'pdf-compressor', 'image-converter'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'PDF⇔画像変換（PNG/JPEG）',
        keywords: [
          'PDF画像変換',
          'PDF PNG',
          'PDF JPEG',
          '画像PDF化',
          '画像からPDF',
        ],
        description:
          'PDFの各ページをPNG・JPEG画像に変換、または複数の画像を1つのPDFにまとめます。',
      },
      en: {
        name: 'PDF ⇔ Image Converter',
        keywords: ['PDF to image', 'PDF to PNG', 'PDF to JPG', 'image to PDF'],
        description:
          'Convert PDF pages to PNG or JPEG images, or combine several images into one PDF.',
      },
    },
  },
  {
    slug: 'pdf-compressor',
    category: 'pdf',
    addedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    related: ['pdf-merge-split', 'pdf-page-editor', 'pdf-password-protector'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'PDF圧縮',
        keywords: ['PDF圧縮', 'PDF軽量化', 'PDF容量削減', 'ファイルサイズ'],
        description:
          'PDFの各ページを画像として再圧縮し、ファイルサイズを小さくします。',
      },
      en: {
        name: 'PDF Compressor',
        keywords: [
          'PDF compress',
          'reduce PDF size',
          'shrink PDF',
          'optimize PDF',
        ],
        description:
          'Reduce PDF file size by recompressing each page as an image.',
      },
    },
  },
  {
    slug: 'pdf-page-editor',
    category: 'pdf',
    addedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    related: ['pdf-merge-split', 'pdf-compressor', 'pdf-password-protector'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'PDFページ回転・削除・並び替え',
        keywords: [
          'パスワード解除',
          'PDFページ編集',
          'ページ並べ替え',
          'ページ削除',
          'ページ回転',
          'PDF回転',
        ],
        description:
          'PDFのページを回転・削除・並び替え。パスワードを知っているPDFの保護解除にも対応。',
      },
      en: {
        name: 'PDF Page Editor',
        keywords: [
          'remove password',
          'PDF page editor',
          'reorder pages',
          'delete pages',
          'rotate PDF',
        ],
        description:
          'Rotate, delete and reorder PDF pages, or remove the password from a PDF you know the password for.',
      },
    },
  },
  {
    slug: 'pdf-password-protector',
    category: 'pdf',
    addedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    related: ['pdf-compressor', 'pdf-merge-split', 'pdf-page-editor'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'PDFパスワード設定',
        keywords: ['PDFパスワード', 'PDF暗号化', 'PDFロック', 'PDF保護'],
        description:
          'PDFに開くためのパスワードを設定しAES-256で暗号化。印刷・コピー・編集の制限も指定できます。',
      },
      en: {
        name: 'PDF Password Protector',
        keywords: ['PDF password', 'encrypt PDF', 'lock PDF', 'protect PDF'],
        description:
          'Add a password to a PDF and encrypt it with AES-256, with optional print/copy/edit restrictions.',
      },
    },
  },
  {
    slug: 'cat-logo-text-generator',
    category: 'image',
    addedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    related: [
      'favicon-generator',
      'image-converter',
      'placeholder-image-generator',
    ],
    translations: {
      ja: {
        name: '猫ロゴ文字ジェネレーター',
        keywords: [
          'ロゴ',
          'ロゴ作成',
          '猫',
          'ネコ',
          'ワードロゴ',
          'テキストロゴ',
        ],
        description:
          '丸ゴシックのロゴ文字に猫耳・ひげ・肉球・ハート・星・月を好きな位置へ配置し、背景透過PNGで保存できます。',
      },
      en: {
        name: 'Cat Logo Text Generator',
        keywords: ['logo maker', 'cat logo', 'text logo', 'wordmark', 'cat'],
        description:
          'Creates cat-style logo text and lets you place ears, whiskers, paws, hearts, stars and moons freely, then saves it as a transparent PNG.',
      },
    },
  },
  {
    slug: 'encoding-converter',
    category: 'text',
    addedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    related: ['kishu-izon-checker', 'url-encode', 'line-ending-converter'],
    translations: {
      ja: {
        name: '文字コード変換・文字化け診断',
        keywords: [
          '文字コード',
          'Shift_JIS',
          'UTF-8',
          'EUC-JP',
          '文字化け',
          'エンコーディング',
        ],
        description:
          'テキストファイルの文字コードを自動判定し、Shift_JIS・EUC-JP・UTF-8などへ変換。文字化けの原因診断と復元も。',
      },
      en: {
        name: 'Encoding Converter & Mojibake Fixer',
        keywords: [
          'character encoding',
          'Shift_JIS',
          'UTF-8',
          'EUC-JP',
          'mojibake',
        ],
        description:
          "Detects a text file's encoding and converts between Shift_JIS, EUC-JP and UTF-8. Diagnoses and repairs garbled text.",
      },
    },
  },
  {
    slug: 'pdf-to-markdown',
    category: 'pdf',
    addedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    related: ['markdown-preview', 'pdf-merge-split', 'pdf-image-converter'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'PDFをMarkdownに変換',
        keywords: [
          'PDF Markdown',
          'PDF変換',
          'PDFテキスト抽出',
          'PDFからMarkdown',
        ],
        description:
          'PDFのテキストを見出し・段落・箇条書き・表を推定してMarkdownに変換。AIに読ませる前処理にも。',
      },
      en: {
        name: 'PDF to Markdown Converter',
        keywords: ['PDF to markdown', 'extract text from PDF', 'convert PDF'],
        description:
          'Convert PDF text to Markdown with headings, lists and tables detected. Handy for preparing documents for AI tools.',
      },
    },
  },
  {
    slug: 'webcam-tester',
    category: 'camera',
    addedAt: '2026-09-27',
    updatedAt: '2026-09-27',
    related: ['keycode-checker', 'viewport-checker'],
    sensitive: true,
    needsCamera: true,
    translations: {
      ja: {
        name: 'Webカメラ動作確認',
        keywords: [
          'Webカメラ',
          'カメラテスト',
          'マイクテスト',
          'カメラ確認',
          'ウェブカメラ',
        ],
        description:
          'Webカメラの映像・解像度・フレームレート（FPS）とマイクの入力レベルをブラウザ上で確認。購入直後やWeb会議・配信前のチェックに。',
      },
      en: {
        name: 'Webcam & Microphone Test',
        keywords: [
          'webcam test',
          'camera test',
          'microphone test',
          'mic check',
        ],
        description:
          'Check your webcam video, actual resolution, frame rate (FPS) and microphone level in the browser. Ideal before a call or stream.',
      },
    },
  },
  {
    slug: 'base-converter',
    category: 'dev',
    addedAt: '2026-09-27',
    updatedAt: '2026-09-27',
    related: ['chmod-calculator', 'color-converter', 'cidr-calculator'],
    translations: {
      ja: {
        name: '進数変換（2/8/10/16進）',
        keywords: [
          '進数変換',
          '2進数',
          '10進数',
          '16進数',
          '8進数',
          '基数変換',
        ],
        description:
          '2進数・8進数・10進数・16進数の数値をリアルタイムに相互変換します。0x/0b/0oプレフィックスや負数にも対応。',
      },
      en: {
        name: 'Base Converter (Binary/Octal/Decimal/Hex)',
        keywords: [
          'base converter',
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
          'radix',
        ],
        description:
          'Converts numbers between binary, octal, decimal, and hexadecimal in real time. Supports 0x/0b/0o prefixes and negative numbers.',
      },
    },
  },
  {
    slug: 'css-gradient-generator',
    category: 'dev',
    addedAt: '2026-09-27',
    updatedAt: '2026-09-27',
    related: [
      'css-box-shadow-generator',
      'css-border-radius-generator',
      'color-converter',
    ],
    translations: {
      ja: {
        name: 'CSSグラデーションジェネレーター',
        keywords: [
          'CSSグラデーション',
          'グラデーション',
          'linear-gradient',
          'radial-gradient',
          '背景',
        ],
        description:
          'カラーストップと角度・形状を指定して、線形/円形のCSSグラデーションをプレビューしながら生成します。',
      },
      en: {
        name: 'CSS Gradient Generator',
        keywords: [
          'CSS gradient',
          'linear-gradient',
          'radial-gradient',
          'background',
        ],
        description:
          'Builds linear/radial CSS gradients with a live preview from color stops, angle, and shape.',
      },
    },
  },
  {
    slug: 'css-box-shadow-generator',
    category: 'dev',
    addedAt: '2026-09-27',
    updatedAt: '2026-09-27',
    related: [
      'css-gradient-generator',
      'css-border-radius-generator',
      'contrast-checker',
    ],
    translations: {
      ja: {
        name: 'CSS box-shadowジェネレーター',
        keywords: ['box-shadow', '影', 'シャドウ', 'CSS影', 'ドロップシャドウ'],
        description:
          'オフセット・ぼかし・広がり・色・insetを調整して、複数レイヤーのCSS box-shadowをプレビューしながら生成します。',
      },
      en: {
        name: 'CSS Box-Shadow Generator',
        keywords: ['box-shadow', 'shadow', 'CSS shadow', 'drop shadow'],
        description:
          'Builds multi-layer CSS box-shadow declarations with a live preview from offset, blur, spread, color, and inset.',
      },
    },
  },
  {
    slug: 'css-border-radius-generator',
    category: 'dev',
    addedAt: '2026-09-27',
    updatedAt: '2026-09-27',
    related: [
      'css-box-shadow-generator',
      'css-gradient-generator',
      'px-rem-converter',
    ],
    translations: {
      ja: {
        name: 'CSS border-radiusジェネレーター',
        keywords: ['border-radius', '角丸', '丸み', 'CSS角丸', '角を丸く'],
        description:
          '4つの角の丸みをそれぞれ調整して、CSSのborder-radiusをプレビューしながら生成します。px/%の単位切り替えにも対応。',
      },
      en: {
        name: 'CSS Border-Radius Generator',
        keywords: ['border-radius', 'rounded corners', 'round', 'CSS radius'],
        description:
          'Builds a CSS border-radius with a live preview from four independent (or linked) corner values, with px/% unit switching.',
      },
    },
  },
  {
    slug: 'px-rem-converter',
    category: 'dev',
    addedAt: '2026-09-28',
    updatedAt: '2026-09-28',
    related: [
      'viewport-checker',
      'css-border-radius-generator',
      'ratio-calculator',
    ],
    translations: {
      ja: {
        name: 'px⇔rem変換',
        keywords: ['px', 'rem', 'em', '単位変換', 'フォントサイズ', 'CSS単位'],
        description:
          'pxとremの値をリアルタイムに相互変換します。ベースフォントサイズを自由に指定可能。',
      },
      en: {
        name: 'px to rem Converter',
        keywords: [
          'px to rem',
          'rem to px',
          'em',
          'unit converter',
          'font size',
          'CSS units',
        ],
        description:
          'Converts between px and rem in real time with a customizable base font size.',
      },
    },
  },
  {
    slug: 'contrast-checker',
    category: 'image',
    addedAt: '2026-09-28',
    updatedAt: '2026-09-28',
    related: [
      'color-converter',
      'css-gradient-generator',
      'image-palette-extractor',
    ],
    translations: {
      ja: {
        name: '色のコントラスト比チェッカー（WCAG）',
        keywords: [
          'コントラスト比',
          'WCAG',
          'アクセシビリティ',
          '色の組み合わせ',
          '配色チェック',
        ],
        description:
          '文字色と背景色のコントラスト比を計算し、WCAGのAA/AAA基準（通常テキスト・大きな文字）に適合するか判定します。',
      },
      en: {
        name: 'Color Contrast Checker (WCAG)',
        keywords: [
          'contrast ratio',
          'WCAG',
          'accessibility',
          'color contrast',
          'a11y',
        ],
        description:
          'Calculates the contrast ratio between text and background colors and checks it against WCAG AA/AAA levels for normal and large text.',
      },
    },
  },
  {
    slug: 'meta-tag-generator',
    category: 'dev',
    addedAt: '2026-09-28',
    updatedAt: '2026-09-28',
    related: ['favicon-generator', 'html-escape', 'url-encode'],
    translations: {
      ja: {
        name: 'metaタグ・OGPタグ生成',
        keywords: [
          'metaタグ',
          'OGP',
          'Twitter Card',
          'SEO',
          'ogp画像',
          'タグ生成',
        ],
        description:
          'タイトル・説明文・URL・画像から、基本metaタグ・OGP・Twitter Cardのタグをまとめて生成します。SNSシェア時のプレビュー確認付き。',
      },
      en: {
        name: 'Meta Tag & OGP Generator',
        keywords: ['meta tags', 'OGP', 'open graph', 'Twitter Card', 'SEO'],
        description:
          'Generates basic meta tags, Open Graph (OGP), and Twitter Card tags from a page title, description, URL, and image, with a social share preview.',
      },
    },
  },
  {
    slug: 'curl-converter',
    category: 'dev',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['json-formatter', 'url-encode', 'base64'],
    sensitive: true,
    translations: {
      ja: {
        name: 'cURL→Fetch/Axios変換',
        keywords: ['curl', 'fetch', 'axios', 'API', 'cURLとしてコピー'],
        description:
          'curlコマンドをfetch・axiosのJavaScriptコードに変換します。ヘッダー・JSONボディ・フォーム・Basic認証に対応し、通信は行わず解析のみ。',
      },
      en: {
        name: 'cURL to Fetch / Axios Converter',
        keywords: ['curl', 'fetch', 'axios', 'API', 'copy as cURL'],
        description:
          'Converts a curl command to JavaScript fetch or axios code. Handles headers, JSON bodies, form data, and basic auth; it only parses the command and never sends a request.',
      },
    },
  },
];

export function getLocalizedTools(locale: Locale): LocalizedTool[] {
  return tools.map((tool) => ({
    slug: tool.slug,
    ...tool.translations[locale],
    categoryId: tool.category,
    category: categories[tool.category][locale],
  }));
}
