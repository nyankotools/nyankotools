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
  'security',
  'file',
  'hardware',
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
  security: { ja: 'セキュリティ', en: 'Security' },
  file: { ja: 'ファイル', en: 'File' },
  hardware: { ja: 'ハードウェア', en: 'Hardware' },
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
    related: ['age-calculator', 'ratio-calculator', 'bmr-calorie-calculator'],
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
    slug: 'pdf-redactor',
    category: 'pdf',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['pdf-page-editor', 'pdf-compressor', 'pdf-password-protector'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'PDF黒塗り',
        keywords: ['PDF黒塗り', 'PDF墨消し', 'PDFマスキング', '個人情報を隠す'],
        description:
          'PDFの氏名・住所・金額などをドラッグで黒塗り。元の文字を復元できない形で書き出せます。',
      },
      en: {
        name: 'PDF Redactor',
        keywords: [
          'redact PDF',
          'black out PDF',
          'PDF censor',
          'hide text in PDF',
        ],
        description:
          'Black out names, addresses and amounts in a PDF by dragging, and export a file where the hidden text cannot be recovered.',
      },
    },
  },
  {
    slug: 'pdf-page-number-watermark',
    category: 'pdf',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['pdf-page-editor', 'pdf-metadata-editor', 'pdf-merge-split'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'PDFページ番号・透かし追加',
        keywords: [
          'PDFページ番号',
          'PDF透かし',
          'ウォーターマーク',
          '社外秘',
          'DRAFT',
          'ページ番号を振る',
        ],
        description:
          'PDFの各ページにページ番号や「社外秘」などの透かし文字を追加。位置・サイズ・濃さ・角度を指定できます。',
      },
      en: {
        name: 'PDF Page Numbers & Watermark',
        keywords: [
          'PDF page numbers',
          'PDF watermark',
          'number PDF pages',
          'confidential stamp',
          'draft watermark',
        ],
        description:
          'Add page numbers and watermark text such as CONFIDENTIAL or DRAFT to every page of a PDF, with position, size, opacity and angle controls.',
      },
    },
  },
  {
    slug: 'pdf-metadata-editor',
    category: 'pdf',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['pdf-page-number-watermark', 'pdf-redactor', 'pdf-page-editor'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'PDFメタデータ編集',
        keywords: [
          'PDFプロパティ',
          'PDF作成者',
          'PDFタイトル',
          '文書情報',
          'メタデータ削除',
        ],
        description:
          'PDFのタイトル・作成者・キーワード・作成日時などの文書情報を確認・編集・削除。公開前の個人情報消去に。',
      },
      en: {
        name: 'PDF Metadata Editor',
        keywords: [
          'PDF properties',
          'PDF author',
          'PDF title',
          'remove PDF metadata',
          'document info',
        ],
        description:
          'View, edit or remove a PDF’s title, author, keywords and dates. Handy for clearing personal details before sharing.',
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
  {
    slug: 'json-to-typescript',
    category: 'data',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['json-formatter', 'json-path-tester', 'yaml-json-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: 'JSON→TypeScript型生成',
        keywords: [
          'json',
          'typescript',
          'interface',
          'type',
          '型定義',
          'APIレスポンス',
        ],
        description:
          'JSONからTypeScriptのinterface・type定義を自動生成します。ネストしたオブジェクト・配列・省略可能なプロパティ・ユニオン型に対応。',
      },
      en: {
        name: 'JSON to TypeScript Converter',
        keywords: [
          'json',
          'typescript',
          'interface',
          'type',
          'quicktype',
          'api response',
        ],
        description:
          'Generates TypeScript interfaces or type aliases from JSON, handling nested objects, arrays, optional properties, and union types.',
      },
    },
  },
  {
    slug: 'json-diff',
    category: 'data',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['json-formatter', 'text-diff', 'json-path-tester'],
    sensitive: true,
    translations: {
      ja: {
        name: 'JSON差分比較',
        keywords: ['json', 'diff', '差分', '比較', 'JSON比較'],
        description:
          '2つのJSONを構造的に比較し、追加・削除・変更された箇所をパスつきで一覧表示します。キー順序は無視、配列の並び順を無視する比較にも対応。',
      },
      en: {
        name: 'JSON Diff',
        keywords: ['json', 'diff', 'compare', 'json compare', 'difference'],
        description:
          'Compares two JSON documents structurally and lists added, removed, and changed values with their paths. Ignores key order, with an option to ignore array order.',
      },
    },
  },
  {
    slug: 'barcode-generator',
    category: 'generate',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['qr-generator', 'uuid-generator', 'image-converter'],
    translations: {
      ja: {
        name: 'バーコード生成',
        keywords: ['バーコード', 'CODE128', 'JAN', 'EAN-13', 'UPC', 'CODE39'],
        description:
          'CODE128・EAN-13・EAN-8・UPC・CODE39・ITFのバーコードを生成し、PNG画像でダウンロードできます。',
      },
      en: {
        name: 'Barcode Generator',
        keywords: ['barcode', 'CODE128', 'EAN-13', 'JAN', 'UPC', 'CODE39'],
        description:
          'Generates CODE128, EAN-13, EAN-8, UPC, CODE39, and ITF barcodes and lets you download them as PNG images.',
      },
    },
  },
  {
    slug: 'ulid-nanoid-generator',
    category: 'generate',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['uuid-generator', 'password-generator', 'hash-generator'],
    translations: {
      ja: {
        name: 'ULID・NanoID生成',
        keywords: ['ULID', 'NanoID', 'ランダムID', '一意ID', '時刻順ID'],
        description:
          '時刻順に並ぶULIDと、短くURLに使いやすいNanoIDを1件〜100件まとめて生成します。NanoIDは長さ・文字セットも指定可能。',
      },
      en: {
        name: 'ULID & NanoID Generator',
        keywords: ['ULID', 'NanoID', 'random id', 'unique id', 'sortable id'],
        description:
          'Generates 1 to 100 time-sortable ULIDs or compact, URL-friendly NanoIDs at once, with custom length and alphabet for NanoID.',
      },
    },
  },
  {
    slug: 'password-strength-checker',
    category: 'security',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['password-generator', 'hash-generator', 'ulid-nanoid-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: 'パスワード強度チェッカー',
        keywords: ['パスワード', '強度', 'エントロピー', '安全性', '解読時間'],
        description:
          'パスワードの強さを文字種・長さ・連番やキーボード配列などのパターンから判定し、解読にかかる目安時間を表示します。',
      },
      en: {
        name: 'Password Strength Checker',
        keywords: ['password', 'strength', 'entropy', 'crack time', 'security'],
        description:
          'Rates a password by length, character types, and weak patterns like sequences and keyboard runs, and estimates how long it would take to crack.',
      },
    },
  },
  {
    slug: 'crypto-encryptor',
    category: 'security',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['password-strength-checker', 'hmac-generator', 'base64'],
    sensitive: true,
    translations: {
      ja: {
        name: 'テキスト暗号化・復号',
        keywords: ['暗号化', '復号', 'AES', 'AES-GCM', 'パスワード暗号'],
        description:
          'テキストをパスワードでAES-256-GCM暗号化し、Base64文字列にして共有。同じパスワードで復号もできます。',
      },
      en: {
        name: 'Text Encryptor & Decryptor',
        keywords: [
          'encrypt',
          'decrypt',
          'AES',
          'AES-GCM',
          'password encryption',
        ],
        description:
          'Encrypt text with a password using AES-256-GCM and share it as Base64, then decrypt it with the same password.',
      },
    },
  },
  {
    slug: 'hmac-generator',
    category: 'security',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['hash-generator', 'jwt-decoder', 'totp-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: 'HMAC署名生成',
        keywords: [
          'HMAC',
          'HMAC-SHA256',
          'Webhook署名',
          '署名検証',
          'シークレット',
        ],
        description:
          'メッセージと秘密鍵からHMAC-SHA1/256/384/512の署名を計算。Webhook署名の照合やAPI認証のデバッグに。',
      },
      en: {
        name: 'HMAC Generator',
        keywords: [
          'HMAC',
          'HMAC-SHA256',
          'webhook signature',
          'signature verify',
          'secret key',
        ],
        description:
          'Compute HMAC-SHA1/256/384/512 signatures from a message and secret key, and compare them with a received signature.',
      },
    },
  },
  {
    slug: 'totp-generator',
    category: 'security',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['hmac-generator', 'password-generator', 'qr-code-reader'],
    sensitive: true,
    translations: {
      ja: {
        name: 'TOTPコード生成・検証',
        keywords: [
          'TOTP',
          '2段階認証',
          '二要素認証',
          'OTP',
          'ワンタイムパスワード',
          '2FA',
        ],
        description:
          'Base32の秘密鍵やotpauth://のURIから2段階認証のTOTPコードを生成・検証。実装のデバッグや動作確認に。',
      },
      en: {
        name: 'TOTP Code Generator',
        keywords: [
          'TOTP',
          '2FA',
          'two-factor',
          'OTP',
          'one-time password',
          'authenticator',
        ],
        description:
          'Generate and verify 2FA TOTP codes from a Base32 secret or an otpauth:// URI, for debugging and testing.',
      },
    },
  },
  {
    slug: 'bcrypt-generator',
    category: 'security',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: [
      'hash-generator',
      'password-generator',
      'password-strength-checker',
    ],
    sensitive: true,
    translations: {
      ja: {
        name: 'bcryptハッシュ生成・照合',
        keywords: [
          'bcrypt',
          'パスワードハッシュ',
          'ハッシュ化',
          'ソルト',
          'コスト',
        ],
        description:
          'パスワードからbcryptハッシュを生成し、既存のハッシュと照合。コスト（ラウンド数）も選べます。',
      },
      en: {
        name: 'Bcrypt Hash Generator & Verifier',
        keywords: [
          'bcrypt',
          'password hash',
          'hash password',
          'salt',
          'cost factor',
        ],
        description:
          'Generate a bcrypt hash from a password and verify it against an existing hash, with an adjustable cost factor.',
      },
    },
  },
  {
    slug: 'x509-decoder',
    category: 'security',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['ssh-fingerprint', 'jwt-decoder', 'base64'],
    translations: {
      ja: {
        name: 'X.509証明書デコーダー',
        keywords: [
          'X.509',
          'SSL証明書',
          'TLS証明書',
          'PEM',
          'SAN',
          '有効期限',
          'フィンガープリント',
        ],
        description:
          'PEM形式のSSL/TLS証明書を貼り付けて、発行者・有効期限・SAN・公開鍵・フィンガープリントを確認。',
      },
      en: {
        name: 'X.509 Certificate Decoder',
        keywords: [
          'X.509',
          'SSL certificate',
          'TLS certificate',
          'PEM',
          'SAN',
          'expiry',
          'fingerprint',
        ],
        description:
          'Paste a PEM SSL/TLS certificate to read its issuer, validity dates, SANs, public key, and fingerprints.',
      },
    },
  },
  {
    slug: 'ssh-fingerprint',
    category: 'security',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['x509-decoder', 'hash-generator', 'base64'],
    translations: {
      ja: {
        name: 'SSH鍵フィンガープリント表示',
        keywords: [
          'SSH',
          'フィンガープリント',
          '公開鍵',
          'authorized_keys',
          'ssh-keygen',
          'ED25519',
        ],
        description:
          'SSH公開鍵からSHA256・MD5のフィンガープリントを計算。authorized_keysの複数行にも対応。',
      },
      en: {
        name: 'SSH Key Fingerprint Viewer',
        keywords: [
          'SSH',
          'fingerprint',
          'public key',
          'authorized_keys',
          'ssh-keygen',
          'ED25519',
        ],
        description:
          'Compute the SHA256 and MD5 fingerprint of an SSH public key, including multi-line authorized_keys.',
      },
    },
  },
  {
    slug: 'file-hash-calculator',
    category: 'file',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['hash-generator', 'password-strength-checker'],
    sensitive: true,
    translations: {
      ja: {
        name: 'ファイルハッシュ計算',
        keywords: [
          'ハッシュ',
          'チェックサム',
          'MD5',
          'SHA-256',
          'ファイル照合',
        ],
        description:
          'ファイルをドラッグ＆ドロップして、MD5・SHA-1・SHA-256・SHA-384・SHA-512のハッシュ値を計算します。配布元のハッシュ値との照合もできます。',
      },
      en: {
        name: 'File Hash Calculator',
        keywords: ['hash', 'checksum', 'MD5', 'SHA-256', 'file verify'],
        description:
          'Drag and drop files to calculate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes, and compare them with a published checksum.',
      },
    },
  },
  {
    slug: 'svg-to-png',
    category: 'image',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['svg-optimizer', 'image-converter', 'favicon-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: 'SVG→PNG変換',
        keywords: ['SVG', 'PNG', '画像変換', 'ラスター化', '透過', '高解像度'],
        description:
          'SVGファイルやSVGコードをPNG画像に変換します。1〜4倍の高解像度出力と、透過・白・任意色の背景に対応しています。',
      },
      en: {
        name: 'SVG to PNG Converter',
        keywords: ['SVG', 'PNG', 'rasterize', 'convert', 'transparent'],
        description:
          'Converts SVG files or code to PNG at 1x to 4x resolution, with a transparent, white, or custom background.',
      },
    },
  },
  {
    slug: 'ogp-image-generator',
    category: 'image',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['meta-tag-generator', 'svg-to-png', 'image-resizer'],
    translations: {
      ja: {
        name: 'OGP画像ジェネレーター',
        keywords: [
          'OGP',
          'OGP画像',
          'SNS',
          'サムネイル',
          'シェア画像',
          'og:image',
        ],
        description:
          'タイトルとサイト名を入力して、SNSシェア用のOGP画像（1200×630）をPNGで作成します。背景色や文字色も調整できます。',
      },
      en: {
        name: 'OGP Image Generator',
        keywords: [
          'OGP',
          'og:image',
          'social image',
          'thumbnail',
          'share image',
        ],
        description:
          'Creates a social share (OGP) image at 1200×630 as PNG from a title and site name, with adjustable background and text colors.',
      },
    },
  },
  {
    slug: 'image-cropper',
    category: 'image',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['image-resizer', 'image-converter', 'favicon-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: '画像トリミング・回転・反転',
        keywords: [
          'トリミング',
          '切り抜き',
          'クロップ',
          '画像回転',
          '左右反転',
          '縦横比',
        ],
        description:
          '画像を好きな範囲に切り抜き、90度回転や左右・上下反転ができます。縦横比の固定に対応し、PNG・JPEG・WebPで保存できます。',
      },
      en: {
        name: 'Image Cropper, Rotator & Flipper',
        keywords: [
          'crop image',
          'rotate image',
          'flip image',
          'trim',
          'aspect ratio',
        ],
        description:
          'Crops images to any area, rotates in 90° steps, and flips horizontally or vertically, with aspect ratio locking and PNG, JPEG, or WebP output.',
      },
    },
  },
  {
    slug: 'image-background-remover',
    category: 'image',
    addedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    related: ['image-cropper', 'image-converter', 'svg-to-png'],
    sensitive: true,
    translations: {
      ja: {
        name: '画像の背景透過（輪郭付き）',
        keywords: [
          '背景透過',
          '背景削除',
          '透過PNG',
          '白背景',
          '縁取り',
          'ステッカー',
        ],
        description:
          '単色の背景を指定して透過PNGにします。縁に残る背景色の除去と、好きな色・太さの輪郭（縁取り）の追加に対応しています。',
      },
      en: {
        name: 'Image Background Remover (With Outline)',
        keywords: [
          'remove background',
          'transparent png',
          'background eraser',
          'outline',
          'sticker',
        ],
        description:
          'Makes a solid-color background transparent and saves a PNG, with edge cleanup for leftover background color and an optional outline of any color and width.',
      },
    },
  },
  {
    slug: 'mic-tester',
    category: 'hardware',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['webcam-tester', 'keyboard-tester', 'dead-pixel-checker'],
    sensitive: true,
    needsCamera: true,
    translations: {
      ja: {
        name: 'マイクテスト（入力レベル・録音）',
        keywords: [
          'マイクテスト',
          'マイク確認',
          '録音',
          '音量',
          '音割れ',
          'マイク入力',
        ],
        description:
          'マイクの入力レベルをリアルタイムで確認し、音割れを検出できます。録音して聞き返すことも可能。Web会議や配信の前のチェックに。',
      },
      en: {
        name: 'Microphone Test (Level & Recording)',
        keywords: [
          'mic test',
          'microphone test',
          'mic check',
          'record audio',
          'input level',
        ],
        description:
          'See your microphone input level live, detect clipping, and record a clip to play back. Handy before a call or stream.',
      },
    },
  },
  {
    slug: 'keyboard-tester',
    category: 'hardware',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['keycode-checker', 'mic-tester', 'dead-pixel-checker'],
    translations: {
      ja: {
        name: 'キーボードテスト（全キー押下判定）',
        keywords: [
          'キーボードテスト',
          'キーテスト',
          '全キー',
          'チャタリング',
          'キーボード確認',
        ],
        description:
          'キーボードの全キーを押して、反応するかを画面のキーボード図で確認します。押し忘れが一目で分かり、キー名・コードも表示。',
      },
      en: {
        name: 'Keyboard Tester (Test Every Key)',
        keywords: [
          'keyboard test',
          'key tester',
          'test all keys',
          'key chatter',
          'keyboard checker',
        ],
        description:
          'Press every key and see it light up on an on-screen keyboard so missed keys are obvious, with the key name and code shown.',
      },
    },
  },
  {
    slug: 'dead-pixel-checker',
    category: 'hardware',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['viewport-checker', 'keyboard-tester', 'webcam-tester'],
    translations: {
      ja: {
        name: 'ドット抜けチェック（色ムラ確認）',
        keywords: [
          'ドット抜け',
          '輝点',
          '黒点',
          '色ムラ',
          'モニター確認',
          '焼き付き',
        ],
        description:
          '画面全体を単色で塗りつぶして、モニター・スマホのドット抜けや色ムラを確認します。白・黒・RGBなど9色をクリックやキーで切り替え。',
      },
      en: {
        name: 'Dead Pixel Test (Screen Check)',
        keywords: [
          'dead pixel',
          'stuck pixel',
          'screen test',
          'monitor test',
          'backlight bleed',
          'burn-in',
        ],
        description:
          'Fill the screen with a solid color to check a monitor or phone for dead pixels and uneven color, cycling through 9 colors with a click or the arrow keys.',
      },
    },
  },
  {
    slug: 'unit-converter',
    category: 'calc',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['px-rem-converter', 'base-converter', 'ratio-calculator'],
    translations: {
      ja: {
        name: '単位変換（長さ・重さ・面積・体積・温度・データ容量）',
        keywords: [
          '単位変換',
          '尺貫法',
          '坪',
          '畳',
          'インチ',
          'ポンド',
          'KB KiB',
          '華氏',
        ],
        description:
          '長さ・重さ・面積・体積・温度・データ容量の単位を相互に変換します。尺・坪・畳・合・貫などの尺貫法やインチ・ポンド、KBとKiBの違いにも対応。',
      },
      en: {
        name: 'Unit Converter (Length, Weight, Area, Volume, Temperature, Data)',
        keywords: [
          'unit converter',
          'metric imperial',
          'inches to cm',
          'pounds to kg',
          'KB vs KiB',
          'tsubo',
          'fahrenheit celsius',
        ],
        description:
          'Convert length, weight, area, volume, temperature, and data size, including metric, imperial, traditional Japanese units, and KB vs KiB.',
      },
    },
  },
  {
    slug: 'split-bill-calculator',
    category: 'calc',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['tax-calculator', 'ratio-calculator', 'mortgage-calculator'],
    translations: {
      ja: {
        name: '割り勘計算機（端数処理・傾斜割り勘）',
        keywords: [
          '割り勘',
          '飲み会',
          '幹事',
          '傾斜',
          '端数',
          '切り上げ',
          '人数割り',
        ],
        description:
          '合計金額と人数から1人あたりの金額を計算します。100円単位の端数処理や、上司・幹事が多めに払う傾斜割り勘にも対応。余りと不足も表示。',
      },
      en: {
        name: 'Split Bill Calculator (Rounding & Uneven Shares)',
        keywords: [
          'split bill',
          'bill splitter',
          'split the check',
          'dinner split',
          'tip split',
          'uneven split',
        ],
        description:
          'Split a total among people with rounding up, down, or to the nearest unit, and let some people pay more. Shows the extra or shortfall.',
      },
    },
  },
  {
    slug: 'bmr-calorie-calculator',
    category: 'calc',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['bmi-calculator', 'age-calculator'],
    sensitive: true,
    translations: {
      ja: {
        name: '基礎代謝・消費カロリー計算機',
        keywords: [
          '基礎代謝',
          '消費カロリー',
          '必要カロリー',
          'TDEE',
          'ダイエット',
          '摂取カロリー',
        ],
        description:
          '年齢・性別・身長・体重から基礎代謝量と、活動レベルを加味した1日の消費カロリーを計算します。ダイエット・増量の目安カロリーも表示。',
      },
      en: {
        name: 'BMR & Calorie Calculator',
        keywords: [
          'BMR',
          'TDEE',
          'daily calories',
          'calorie calculator',
          'basal metabolic rate',
          'Mifflin-St Jeor',
        ],
        description:
          'Estimate your basal metabolic rate and daily calorie needs from age, sex, height, weight, and activity level, with calorie targets for losing or gaining weight.',
      },
    },
  },
  {
    slug: 'salary-take-home-calculator',
    category: 'calc',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: [
      'freelance-income-calculator',
      'furusato-nozei-calculator',
      'tax-calculator',
    ],
    sensitive: true,
    translations: {
      ja: {
        name: '会社員の手取り計算機（年収から手取りを試算）',
        keywords: [
          '手取り',
          '年収',
          '額面',
          '月収',
          '給与',
          '社会保険料',
          '所得税',
          '住民税',
        ],
        description:
          '額面の年収から、社会保険料・所得税・住民税を差し引いた会社員の手取り額（年間・月間）を簡易試算します。令和7・8年分の税制に対応。',
      },
      en: {
        name: 'Japan Salary Take-Home Pay Calculator',
        keywords: [
          'take-home pay',
          'gross to net',
          'salary after tax',
          'Japan income tax',
          'social insurance',
          'resident tax',
        ],
        description:
          'Estimate annual and monthly take-home pay in Japan from gross salary after social insurance, income tax, and resident tax, using 2025-2026 rules.',
      },
    },
  },
  {
    slug: 'furusato-nozei-calculator',
    category: 'calc',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['salary-take-home-calculator', 'freelance-income-calculator'],
    sensitive: true,
    translations: {
      ja: {
        name: 'ふるさと納税の上限額シミュレーション',
        keywords: [
          'ふるさと納税',
          '控除上限',
          '寄付上限',
          '上限額',
          '自己負担2000円',
          'ワンストップ特例',
        ],
        description:
          '年収と所得控除から、ふるさと納税で自己負担2,000円で寄付できる上限額の目安を試算します。会社員向け・令和7・8年分の税制に対応。',
      },
      en: {
        name: 'Furusato Nozei Donation Limit Calculator',
        keywords: [
          'furusato nozei',
          'hometown tax',
          'donation limit',
          'Japan tax deduction',
          'one-stop exception',
        ],
        description:
          'Estimate the furusato nozei (hometown tax) donation limit for a ¥2,000 out-of-pocket cost from your salary and deductions, using 2025-2026 rules.',
      },
    },
  },
  {
    slug: 'timezone-converter',
    category: 'datetime',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['unix-timestamp', 'date-calculator', 'cron-parser'],
    translations: {
      ja: {
        name: 'タイムゾーン変換・世界時計',
        keywords: [
          'タイムゾーン',
          '時差',
          '世界時計',
          '時差変換',
          'サマータイム',
          'UTC',
          'JST',
        ],
        description:
          '日時を入力して、東京・ニューヨーク・ロンドンなど世界各地の現地時刻に一括変換します。サマータイム対応の世界時計としても使えます。',
      },
      en: {
        name: 'Time Zone Converter & World Clock',
        keywords: [
          'time zone',
          'timezone converter',
          'time difference',
          'world clock',
          'daylight saving',
          'UTC',
          'meeting planner',
        ],
        description:
          'Converts a date and time to the local time in cities around the world at once, with daylight saving support, and doubles as a world clock.',
      },
    },
  },
  {
    slug: 'business-day-calculator',
    category: 'datetime',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: [
      'date-calculator',
      'japanese-era-converter',
      'hourly-wage-calculator',
    ],
    translations: {
      ja: {
        name: '営業日計算・祝日一覧（日本）',
        keywords: [
          '営業日',
          '祝日',
          '休日',
          '振替休日',
          '営業日後',
          '納期',
          '稼働日',
        ],
        description:
          '日本の祝日・土日を除いた「◯営業日後（前）の日付」と期間内の営業日数を計算し、年ごとの祝日一覧も確認できます。振替休日・国民の休日に対応。',
      },
      en: {
        name: 'Japan Business Day Calculator & Holiday List',
        keywords: [
          'business days',
          'working days',
          'Japan holidays',
          'national holidays',
          'substitute holiday',
          'due date',
        ],
        description:
          'Finds the date N business days away and counts business days in a range, skipping weekends and Japanese national holidays, and lists holidays by year.',
      },
    },
  },
  {
    slug: 'timer-stopwatch',
    category: 'datetime',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['date-calculator', 'age-calculator', 'unix-timestamp'],
    translations: {
      ja: {
        name: 'タイマー・ストップウォッチ・ポモドーロ',
        keywords: [
          'タイマー',
          'ストップウォッチ',
          'ポモドーロ',
          'カウントダウン',
          'ラップタイム',
          '勉強タイマー',
        ],
        description:
          'ラップ記録つきのストップウォッチ、カウントダウンタイマー、ポモドーロタイマーをブラウザで使えます。終了時のアラーム音に対応しています。',
      },
      en: {
        name: 'Timer, Stopwatch & Pomodoro Timer',
        keywords: [
          'timer',
          'stopwatch',
          'pomodoro',
          'countdown',
          'lap timer',
          'study timer',
        ],
        description:
          'A browser stopwatch with laps, a countdown timer, and a Pomodoro timer, with an alarm sound when time is up.',
      },
    },
  },
  {
    slug: 'kanji-number-converter',
    category: 'text',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: [
      'japanese-era-converter',
      'zenkaku-hankaku',
      'kyujitai-converter',
    ],
    translations: {
      ja: {
        name: '漢数字⇔算用数字・大字変換',
        keywords: [
          '漢数字',
          '算用数字',
          '大字',
          '壱弐参',
          '金額',
          'アラビア数字',
        ],
        description:
          '漢数字と算用数字を相互に変換します。千二百三十四・二〇二四・壱萬弐千円のような単位記法・位取り記法・大字に対応し、文章中の数をまとめて変換できます。',
      },
      en: {
        name: 'Kanji Numeral Converter',
        keywords: [
          'kanji numbers',
          'japanese numerals',
          'daiji',
          'arabic numerals',
          'formal numerals',
        ],
        description:
          'Converts Japanese kanji numerals to Arabic digits and back, including formal daiji numerals (壱弐参) used on contracts, and converts every number in a block of text at once.',
      },
    },
  },
  {
    slug: 'kyujitai-converter',
    category: 'text',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['kana-converter', 'zenkaku-hankaku', 'kanji-number-converter'],
    translations: {
      ja: {
        name: '旧字体⇔新字体変換',
        keywords: [
          '旧字体',
          '新字体',
          '旧漢字',
          '異体字',
          '髙',
          '﨑',
          '康熙字典体',
        ],
        description:
          '旧字体と新字体を相互に変換します。國→国・學→学・體→体や、髙→高・﨑→崎などの異体字に対応し、変換した文字の一覧も確認できます。',
      },
      en: {
        name: 'Kyujitai ⇔ Shinjitai Converter',
        keywords: [
          'kyujitai',
          'shinjitai',
          'old kanji',
          'new kanji',
          'variant kanji',
          'traditional kanji',
        ],
        description:
          'Converts between old kanji forms (國 學 體) and modern forms (国 学 体), including name variants like 髙 and 﨑, and lists the characters it changed.',
      },
    },
  },
  {
    slug: 'my-number-checker',
    category: 'calc',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: [
      'salary-take-home-calculator',
      'tax-calculator',
      'freelance-income-calculator',
    ],
    sensitive: true,
    translations: {
      ja: {
        name: 'マイナンバー・法人番号チェックデジット検証',
        keywords: [
          'マイナンバー',
          '個人番号',
          '法人番号',
          'インボイス',
          '登録番号',
          '検査用数字',
        ],
        description:
          'マイナンバー（12桁）と法人番号（13桁・インボイス登録番号のT＋13桁）の検査用数字を検証・計算します。入力した番号はサーバーに送信されません。',
      },
      en: {
        name: 'My Number & Corporate Number Validator',
        keywords: [
          'my number',
          'corporate number',
          'check digit',
          'invoice number',
          'japan tax id',
        ],
        description:
          'Validates or calculates the check digit of a Japanese My Number (12 digits) or Corporate Number (13 digits, incl. the invoice registration number). Nothing is sent to a server.',
      },
    },
  },
  {
    slug: 'romaji-kana-converter',
    category: 'text',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: [
      'kana-converter',
      'english-katakana-converter',
      'zenkaku-hankaku',
    ],
    translations: {
      ja: {
        name: 'ローマ字⇔ひらがな変換',
        keywords: [
          'ローマ字',
          'ひらがな',
          'カタカナ',
          'ヘボン式',
          '訓令式',
          'ローマ字入力',
          '名前 ローマ字',
        ],
        description:
          'ローマ字をひらがな・カタカナに、かなをローマ字（ヘボン式・訓令式）に変換します。nn・促音・長音のローマ字入力や、名前のローマ字表記づくりに使えます。',
      },
      en: {
        name: 'Romaji ⇔ Hiragana Converter',
        keywords: [
          'romaji',
          'hiragana',
          'katakana',
          'hepburn',
          'kunrei',
          'romanization',
          'japanese name in romaji',
        ],
        description:
          'Converts romaji to hiragana or katakana, and kana to romaji in Hepburn or Kunrei-shiki style, with options for long vowels and letter case.',
      },
    },
  },
  {
    slug: 'english-katakana-converter',
    category: 'text',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['romaji-kana-converter', 'kana-converter', 'zenkaku-hankaku'],
    translations: {
      ja: {
        name: '英単語カタカナ変換',
        keywords: [
          '英語 カタカナ',
          '英単語',
          'カタカナ表記',
          '片仮名',
          'ふりがな',
          '英語 読み方',
        ],
        description:
          '英単語の綴りを片仮名表記に変換する簡易ツールです。綴りのルールと頻出語の辞書で変換し、USB などの略語は文字読みにもできます。',
      },
      en: {
        name: 'English to Katakana Converter',
        keywords: [
          'english to katakana',
          'katakana transcription',
          'gairaigo',
          'katakana reading',
          'english words in japanese',
        ],
        description:
          'Converts English words to katakana from their spelling using simple rules and a small dictionary of common words, and can spell out acronyms like USB.',
      },
    },
  },
  {
    slug: 'unicode-decorator',
    category: 'text',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['special-char-list', 'zenkaku-hankaku', 'text-case-converter'],
    translations: {
      ja: {
        name: 'Unicode装飾文字変換',
        keywords: [
          'おしゃれ文字',
          '装飾文字',
          '太字',
          '丸文字',
          '筆記体',
          '取り消し線',
          'プロフィール 文字',
        ],
        description:
          '英数字を太字・斜体・筆記体・丸文字・全角・取り消し線などのUnicode装飾文字に変換します。SNSのプロフィールやゲーム名にコピペできます。',
      },
      en: {
        name: 'Unicode Text Decorator',
        keywords: [
          'fancy text',
          'fancy font',
          'bold text',
          'bubble text',
          'cursive text',
          'strikethrough text',
          'text generator',
        ],
        description:
          'Converts letters and numbers into fancy Unicode text such as bold, italic, script, circled, fullwidth and strikethrough, ready to paste into bios and usernames.',
      },
    },
  },
  {
    slug: 'special-char-list',
    category: 'text',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['unicode-decorator', 'zenkaku-hankaku', 'html-escape'],
    translations: {
      ja: {
        name: '特殊文字・絵文字一覧',
        keywords: [
          '特殊文字',
          '記号',
          '絵文字',
          '顔文字',
          '丸数字',
          '星 ハート 矢印',
          '機種依存文字',
        ],
        description:
          '星・ハート・矢印・丸数字・単位記号・顔文字・絵文字などの特殊文字を、クリックしてまとめてコピーできる一覧です。キーワード検索に対応。',
      },
      en: {
        name: 'Special Characters & Emoji List',
        keywords: [
          'special characters',
          'symbols',
          'emoji',
          'kaomoji',
          'unicode symbols',
          'copy paste symbols',
          'arrows hearts stars',
        ],
        description:
          'A click-to-copy list of stars, hearts, arrows, circled numbers, unit symbols, kaomoji and emoji, with keyword search.',
      },
    },
  },
  {
    slug: 'roulette-dice',
    category: 'generate',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['password-generator', 'uuid-generator', 'text-list-tools'],
    translations: {
      ja: {
        name: 'ルーレット・抽選・サイコロ',
        keywords: [
          'ルーレット',
          '抽選',
          'くじ引き',
          'サイコロ',
          'ダイス',
          'ランダム',
          'TRPG',
        ],
        description:
          '項目を入力して回すルーレット、重複なしで当選者を選ぶ抽選、1D6や2D6+3などのダイスロールができます。ランチ決めや順番決めに。',
      },
      en: {
        name: 'Roulette, Random Picker & Dice',
        keywords: [
          'roulette',
          'random picker',
          'wheel spinner',
          'dice roller',
          'raffle',
          'random name picker',
          'd20',
        ],
        description:
          'Spin a roulette wheel from your own list, draw several winners without repeats, or roll dice like 1d6 and 2d6+3 using cryptographic randomness.',
      },
    },
  },
  {
    slug: 'qr-code-reader',
    category: 'camera',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['qr-generator', 'webcam-tester', 'barcode-generator'],
    sensitive: true,
    needsCamera: true,
    translations: {
      ja: {
        name: 'QRコードリーダー（カメラ・画像）',
        keywords: [
          'QRコード読み取り',
          'QRリーダー',
          'QRスキャン',
          'バーコード読み取り',
          'QRコード 画像',
        ],
        description:
          'カメラまたは画像ファイルからQRコードを読み取り、URL・Wi-Fiなどの種類を自動判別。対応ブラウザではバーコードも読み取れます。',
      },
      en: {
        name: 'QR Code Reader (Camera & Image)',
        keywords: [
          'QR scanner',
          'QR code reader',
          'scan QR code',
          'barcode scanner',
          'read QR from image',
        ],
        description:
          'Scan QR codes with your camera or from an image file, with URLs and Wi-Fi details recognized automatically. Reads common barcodes too in supporting browsers.',
      },
    },
  },
  {
    slug: 'heic-converter',
    category: 'image',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['image-converter', 'image-resizer', 'exif-viewer'],
    sensitive: true,
    heavy: true,
    translations: {
      ja: {
        name: 'HEIC→JPEG変換',
        keywords: ['HEIC', 'HEIF', 'iPhone', 'JPG', 'HEIC 変換', 'iPhone 写真'],
        description:
          'iPhoneのHEIC・HEIF写真をJPEG・PNG・WebPに変換します。複数枚の一括変換と画質の指定に対応。',
      },
      en: {
        name: 'HEIC to JPG Converter',
        keywords: ['HEIC', 'HEIF', 'iPhone photo', 'JPG', 'HEIC to JPEG'],
        description:
          'Converts iPhone HEIC and HEIF photos to JPEG, PNG, or WebP, with batch conversion and adjustable quality.',
      },
    },
  },
  {
    slug: 'xml-json-converter',
    category: 'data',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['json-formatter', 'yaml-json-converter', 'csv-json-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: 'XML⇔JSON変換',
        keywords: ['XML', 'JSON', '変換', 'RSS', 'XML 変換', 'XML パース'],
        description:
          'XMLとJSONを相互に変換します。属性やテキストも扱え、タグの閉じ忘れなどの構文エラーは行・列つきで表示。',
      },
      en: {
        name: 'XML to JSON Converter',
        keywords: [
          'XML',
          'JSON',
          'convert',
          'RSS',
          'XML parser',
          'XML to JSON',
        ],
        description:
          'Converts between XML and JSON, handling attributes and text, and reports syntax errors such as unclosed tags with line and column.',
      },
    },
  },
  {
    slug: 'env-json-converter',
    category: 'data',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['json-formatter', 'yaml-json-converter', 'toml-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: '.env⇔JSON変換',
        keywords: ['.env', 'dotenv', '環境変数', 'JSON', 'env 変換'],
        description:
          '.env（環境変数ファイル）とJSONを相互に変換します。コメント・export・引用符つきの値に対応。',
      },
      en: {
        name: '.env to JSON Converter',
        keywords: [
          '.env',
          'dotenv',
          'environment variables',
          'JSON',
          'env to json',
        ],
        description:
          'Converts between .env files and JSON, handling comments, export prefixes, and quoted values.',
      },
    },
  },
  {
    slug: 'csv-markdown-table',
    category: 'data',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['csv-json-converter', 'markdown-preview', 'text-list-tools'],
    sensitive: true,
    translations: {
      ja: {
        name: 'CSV/TSV→Markdownテーブル変換',
        keywords: [
          'CSV',
          'TSV',
          'Markdown',
          'テーブル',
          '表',
          'Excel',
          'README',
        ],
        description:
          'CSV・TSV（Excelからコピーした表）をMarkdownのテーブルに変換します。列揃えや列幅の整形、見出し行の有無を指定できます。',
      },
      en: {
        name: 'CSV/TSV to Markdown Table Converter',
        keywords: ['CSV', 'TSV', 'Markdown', 'table', 'Excel', 'GitHub README'],
        description:
          'Converts CSV or TSV (including tables copied from Excel) into a Markdown table, with column alignment, padding, and optional header row.',
      },
    },
  },
  {
    slug: 'html-table-to-csv',
    category: 'data',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['csv-json-converter', 'csv-markdown-table', 'html-escape'],
    sensitive: true,
    translations: {
      ja: {
        name: 'HTMLテーブル→CSV変換',
        keywords: [
          'HTML',
          'table',
          'テーブル',
          'CSV',
          'TSV',
          '表',
          'スクレイピング',
        ],
        description:
          'HTMLの<table>をCSV・TSVに変換します。結合セルの展開、複数テーブルの選択、Excel向けのBOM付きダウンロードに対応。',
      },
      en: {
        name: 'HTML Table to CSV Converter',
        keywords: ['HTML', 'table', 'CSV', 'TSV', 'scrape', 'extract table'],
        description:
          'Converts an HTML <table> to CSV or TSV, expanding merged cells, choosing among multiple tables, and adding a BOM for Excel.',
      },
    },
  },
  {
    slug: 'json-tree-viewer',
    category: 'data',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['json-formatter', 'json-path-tester', 'json-diff'],
    sensitive: true,
    translations: {
      ja: {
        name: 'JSONツリービューア',
        keywords: [
          'json',
          'ツリー',
          'viewer',
          'ビューア',
          '折りたたみ',
          'JSON Hero',
        ],
        description:
          'JSONを折りたたみ可能なツリーで閲覧できます。キー・値の検索、各要素のパス（JSONPath・JSON Pointer）のコピーに対応。',
      },
      en: {
        name: 'JSON Tree Viewer',
        keywords: [
          'json',
          'tree',
          'viewer',
          'explorer',
          'collapsible',
          'json hero',
        ],
        description:
          'Browse JSON as a collapsible tree, search keys and values, and copy the path (JSONPath or JSON Pointer) of any node.',
      },
    },
  },
  {
    slug: 'json-schema-generator',
    category: 'data',
    addedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    related: ['json-to-typescript', 'json-formatter', 'json-diff'],
    sensitive: true,
    translations: {
      ja: {
        name: 'JSON Schema生成',
        keywords: [
          'json',
          'schema',
          'スキーマ',
          'JSON Schema',
          'バリデーション',
        ],
        description:
          'JSONのサンプルからJSON Schemaを自動生成します。draft 2020-12 / 2019-09 / 07、required・additionalProperties・format推測に対応。',
      },
      en: {
        name: 'JSON Schema Generator',
        keywords: ['json', 'schema', 'json schema', 'generator', 'validation'],
        description:
          'Generates a JSON Schema from a JSON sample, with draft 2020-12, 2019-09, or 07, required keys, additionalProperties, and format detection.',
      },
    },
  },
  {
    slug: 'image-merger',
    category: 'image',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['image-resizer', 'image-cropper', 'gif-maker'],
    sensitive: true,
    translations: {
      ja: {
        name: '画像結合',
        keywords: [
          '画像結合',
          '画像連結',
          '画像を並べる',
          'スクリーンショット結合',
          'グリッド',
          'コラージュ',
        ],
        description:
          '複数の画像を横・縦・グリッド状に並べて1枚にまとめます。順番の入れ替え、間隔・余白・背景色の指定、大きさをそろえる設定に対応し、PNG・JPEG・WebPで保存できます。',
      },
      en: {
        name: 'Image Merger',
        keywords: [
          'merge images',
          'combine images',
          'stitch images',
          'join images',
          'collage',
          'grid',
        ],
        description:
          'Combines multiple images into one, side by side, stacked, or in a grid, with reordering, spacing, margin, background color, and size matching, saved as PNG, JPEG, or WebP.',
      },
    },
  },
  {
    slug: 'image-text-overlay',
    category: 'image',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['image-cropper', 'image-converter', 'exif-viewer'],
    sensitive: true,
    translations: {
      ja: {
        name: '画像への文字入れ・透かし',
        keywords: [
          '文字入れ',
          '透かし',
          'ウォーターマーク',
          'テキスト追加',
          'キャプション',
          'コピーライト',
        ],
        description:
          '画像に好きな文字を入れたり、全体に透かし（ウォーターマーク）を敷き詰めたりします。位置・サイズ・色・透明度・縁取り・角度を指定でき、PNG・JPEG・WebPで保存できます。',
      },
      en: {
        name: 'Add Text or Watermark to Image',
        keywords: [
          'watermark',
          'add text to image',
          'text overlay',
          'caption',
          'copyright',
          'image annotation',
        ],
        description:
          'Adds text to an image or tiles a watermark across it, with position, size, color, opacity, outline, and angle controls, saved as PNG, JPEG, or WebP.',
      },
    },
  },
  {
    slug: 'gif-maker',
    category: 'image',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['image-merger', 'image-resizer', 'image-converter'],
    sensitive: true,
    translations: {
      ja: {
        name: 'GIF作成（連番画像から）',
        keywords: [
          'GIF作成',
          'アニメーションGIF',
          'パラパラ漫画',
          '連番画像',
          'GIFアニメ',
          '画像をGIFに',
        ],
        description:
          '複数の画像を順番につなげてアニメーションGIFを作ります。表示時間・幅・背景色・くり返し・往復再生に対応し、画像はブラウザ内で処理されます。',
      },
      en: {
        name: 'GIF Maker',
        keywords: [
          'gif maker',
          'animated gif',
          'images to gif',
          'flip book',
          'frame animation',
          'create gif',
        ],
        description:
          'Creates an animated GIF from several images in order, with frame delay, width, background color, looping, and ping-pong playback, all processed in your browser.',
      },
    },
  },
  {
    slug: 'unicode-escape',
    category: 'text',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['html-escape', 'url-encode', 'special-char-list'],
    translations: {
      ja: {
        name: 'Unicodeエスケープ変換',
        keywords: [
          'Unicodeエスケープ',
          '\\u',
          'ユニコードエスケープ',
          'サロゲートペア',
          'コードポイント',
          'U+',
          '数値参照',
        ],
        description:
          '文字を \\u3042 のようなUnicodeエスケープに変換、または文字に戻します。JavaScript・ES6・Python・U+表記・HTML数値参照に対応し、絵文字も正しく処理します。',
      },
      en: {
        name: 'Unicode Escape / Unescape',
        keywords: [
          'unicode escape',
          'unicode unescape',
          '\\u',
          'surrogate pair',
          'code point',
          'U+',
          'numeric character reference',
        ],
        description:
          'Converts text to Unicode escapes like \\u3042 and back. Supports JavaScript, ES6, Python, U+ notation and HTML numeric references, with correct emoji handling.',
      },
    },
  },
  {
    slug: 'zero-width-char-remover',
    category: 'text',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['char-counter', 'kishu-izon-checker', 'unicode-escape'],
    translations: {
      ja: {
        name: 'ゼロ幅文字の検出・除去',
        keywords: [
          'ゼロ幅スペース',
          '見えない文字',
          '不可視文字',
          'BOM',
          'U+200B',
          'ゼロ幅接合子',
          '制御文字',
        ],
        description:
          'テキストに混ざったゼロ幅スペース・BOM・方向制御文字などの見えない文字を検出し、種類と個数を確認しながら除去します。コピペ後の不具合対策に。',
      },
      en: {
        name: 'Zero-Width Character Remover',
        keywords: [
          'zero width space',
          'invisible characters',
          'hidden characters',
          'BOM',
          'U+200B',
          'zero width joiner',
          'remove invisible text',
        ],
        description:
          'Detects and removes invisible characters such as zero-width spaces, BOM and bidi controls, showing each type and count before cleaning your text.',
      },
    },
  },
  {
    slug: 'reading-time-calculator',
    category: 'text',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['char-counter', 'text-diff', 'zero-width-char-remover'],
    translations: {
      ja: {
        name: '読了時間・原稿用紙換算',
        keywords: [
          '読了時間',
          '原稿用紙',
          '400字詰め',
          '文字数',
          '朗読時間',
          'スピーチ',
          '読む時間',
        ],
        description:
          '文章を貼り付けて、読了時間・朗読にかかる時間・原稿用紙（400字詰め・200字詰め）の枚数を計算します。日本語と英語の混在文にも対応。',
      },
      en: {
        name: 'Reading Time Calculator',
        keywords: [
          'reading time',
          'speaking time',
          'manuscript paper',
          'genkoyoshi',
          'word count',
          'estimated read time',
        ],
        description:
          'Paste text to estimate reading time, speaking time and Japanese manuscript paper sheets (400 or 200 characters). Handles mixed Japanese and English.',
      },
    },
  },
  {
    slug: 'id-photo-maker',
    category: 'camera',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['image-cropper', 'image-resizer', 'webcam-tester'],
    sensitive: true,
    needsCamera: true,
    translations: {
      ja: {
        name: '証明写真作成（履歴書・パスポート）',
        keywords: [
          '証明写真',
          '履歴書 写真',
          'パスポート 写真',
          'マイナンバー 写真',
          '証明写真 サイズ',
          'エントリーシート',
        ],
        description:
          'Webカメラやスマホの写真を、履歴書（30×40mm）・パスポート（35×45mm）などの証明写真サイズにトリミングして保存。余白の背景色も指定できます。',
      },
      en: {
        name: 'ID Photo Maker (Passport & Resume)',
        keywords: [
          'id photo',
          'passport photo',
          'resume photo',
          'photo booth',
          'crop to 35x45',
          'webcam photo',
        ],
        description:
          'Take a photo with your webcam or phone, or pick one, and crop it to ID photo sizes like 35×45mm or 30×40mm. Fill the margins with any color.',
      },
    },
  },
  {
    slug: 'camera-color-picker',
    category: 'camera',
    addedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    related: ['color-converter', 'image-palette-extractor', 'webcam-tester'],
    sensitive: true,
    needsCamera: true,
    translations: {
      ja: {
        name: 'カメラ映像からカラーコード抽出',
        keywords: [
          'スポイト',
          'カラーピッカー',
          'カメラ 色',
          '色 調べる',
          'カラーコード 取得',
          'HEX',
        ],
        description:
          'カメラに映したものの色を、映像をなぞるだけでHEX・RGB・HSLのカラーコードとして取得するリアルタイムスポイト。壁紙や服の色合わせに。',
      },
      en: {
        name: 'Camera Color Picker (Live Eyedropper)',
        keywords: [
          'color picker',
          'eyedropper',
          'camera color',
          'color from camera',
          'hex color finder',
        ],
        description:
          'Point your camera at anything and pick its color as HEX, RGB or HSL by moving over the live video. Handy for matching paint, clothes and products.',
      },
    },
  },
  {
    slug: 'gamepad-tester',
    category: 'hardware',
    addedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    related: ['keyboard-tester', 'mouse-tester', 'speaker-tester'],
    translations: {
      ja: {
        name: 'ゲームパッドテスト（ボタン・スティック確認）',
        keywords: [
          'ゲームパッド',
          'コントローラー',
          'ドリフト',
          'スティック',
          'PS5',
          'Xbox',
        ],
        description:
          'ゲームパッドの全ボタン・スティック・トリガーの反応を確認します。スティックのドリフト確認や振動テストにも対応。',
      },
      en: {
        name: 'Gamepad Tester (Buttons, Sticks & Drift)',
        keywords: [
          'gamepad test',
          'controller test',
          'stick drift',
          'joystick test',
          'PS5 controller',
          'Xbox controller',
        ],
        description:
          'Check every button, stick and trigger on your controller. Spot stick drift and try the rumble motors.',
      },
    },
  },
  {
    slug: 'speaker-tester',
    category: 'hardware',
    addedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    related: ['mic-tester', 'gamepad-tester', 'keyboard-tester'],
    translations: {
      ja: {
        name: 'スピーカーテスト（左右確認・周波数ジェネレーター）',
        keywords: [
          'スピーカーテスト',
          'ステレオ',
          '左右',
          'イヤホン',
          '周波数',
          'テスト音',
          '低音',
        ],
        description:
          'スピーカーやイヤホンの左右が正しく鳴るかを確認し、20Hz〜20kHzの音やスイープを再生できます。',
      },
      en: {
        name: 'Speaker Test (Stereo Check & Tone Generator)',
        keywords: [
          'speaker test',
          'stereo test',
          'left right test',
          'headphone test',
          'tone generator',
          'frequency generator',
          'sine wave',
        ],
        description:
          'Check left and right channels on speakers or headphones, and play tones from 20 Hz to 20 kHz or a frequency sweep.',
      },
    },
  },
  {
    slug: 'mouse-tester',
    category: 'hardware',
    addedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    related: ['keyboard-tester', 'gamepad-tester', 'dead-pixel-checker'],
    translations: {
      ja: {
        name: 'マウステスト（クリック速度・ポーリングレート）',
        keywords: [
          'マウステスト',
          'クリック速度',
          'CPS',
          'ポーリングレート',
          'チャタリング',
          '連打',
        ],
        description:
          'クリック速度（CPS）の測定、全ボタンの反応確認、ダブルクリック誤作動の検出、ポーリングレートの目安確認ができます。',
      },
      en: {
        name: 'Mouse Tester (Click Speed & Polling Rate)',
        keywords: [
          'mouse test',
          'click speed test',
          'CPS test',
          'polling rate test',
          'double click test',
          'mouse button test',
        ],
        description:
          'Measure click speed (CPS), check every mouse button, detect double-click chatter and estimate the polling rate.',
      },
    },
  },
  {
    slug: 'electricity-cost-calculator',
    category: 'calc',
    addedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    related: ['unit-converter', 'tax-calculator', 'download-time-calculator'],
    translations: {
      ja: {
        name: '電気代計算機（消費電力から1日・1か月・1年を試算）',
        keywords: [
          '電気代',
          '消費電力',
          'ワット',
          'kWh',
          '家電',
          'エアコン',
          '電気料金',
        ],
        description:
          '家電の消費電力（W）・使用時間・電気料金の単価から、1時間・1日・1か月・1年の電気代を計算します。エアコンやPCの目安ワット数から選べます。',
      },
      en: {
        name: 'Electricity Cost Calculator (Watts to Monthly & Yearly Cost)',
        keywords: [
          'electricity cost',
          'power cost',
          'kWh calculator',
          'watts to cost',
          'appliance running cost',
          'energy bill',
        ],
        description:
          'Estimate what an appliance costs to run from its wattage, daily hours, and rate per kWh. See cost per hour, day, month, and year.',
      },
    },
  },
  {
    slug: 'download-time-calculator',
    category: 'calc',
    addedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    related: ['unit-converter', 'image-resizer', 'electricity-cost-calculator'],
    translations: {
      ja: {
        name: 'ダウンロード時間計算機（ファイルサイズと回線速度）',
        keywords: [
          'ダウンロード時間',
          '回線速度',
          'Mbps',
          'ファイルサイズ',
          '転送時間',
          'ゲーム容量',
        ],
        description:
          'ファイルサイズと回線速度（Mbps・Gbps・MB/s）からダウンロードにかかる時間を計算します。実効速度の割合も指定できます。',
      },
      en: {
        name: 'Download Time Calculator (File Size & Internet Speed)',
        keywords: [
          'download time',
          'transfer time',
          'Mbps to MB/s',
          'file size',
          'internet speed',
          'how long to download',
        ],
        description:
          'Calculate how long a download takes from the file size and your connection speed in Mbps, Gbps, or MB/s, with a real-world speed factor.',
      },
    },
  },
  {
    slug: 'statistics-calculator',
    category: 'calc',
    addedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    related: ['ratio-calculator', 'unit-converter', 'bmi-calculator'],
    translations: {
      ja: {
        name: '偏差値・平均・標準偏差計算機',
        keywords: [
          '偏差値',
          '平均',
          '標準偏差',
          '中央値',
          '最頻値',
          '分散',
          '統計',
        ],
        description:
          '数値を貼り付けるだけで、平均・中央値・最頻値・分散・標準偏差を一括計算。得点を入力すれば偏差値も求められます。',
      },
      en: {
        name: 'Statistics Calculator (Mean, Median, Standard Deviation)',
        keywords: [
          'standard deviation',
          'mean median mode',
          'variance calculator',
          'T-score',
          'z-score',
          'descriptive statistics',
        ],
        description:
          'Paste numbers to get mean, median, mode, variance, and standard deviation at once, plus a T-score for any value.',
      },
    },
  },
  {
    slug: 'break-even-calculator',
    category: 'calc',
    addedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    related: [
      'ratio-calculator',
      'tax-calculator',
      'freelance-income-calculator',
    ],
    translations: {
      ja: {
        name: '損益分岐点計算機（販売数量・売上高）',
        keywords: [
          '損益分岐点',
          '損益分岐点売上高',
          '限界利益',
          '固定費',
          '変動費',
          '目標利益',
          '安全余裕率',
        ],
        description:
          '販売単価・変動費・固定費から損益分岐点の販売数量と売上高を計算。目標利益の達成ラインや安全余裕率も確認できます。',
      },
      en: {
        name: 'Break-Even Calculator (Units, Sales & Target Profit)',
        keywords: [
          'break-even point',
          'break even analysis',
          'contribution margin',
          'fixed costs',
          'variable costs',
          'margin of safety',
        ],
        description:
          'Work out break-even units and sales from price, variable cost, and fixed costs, plus the volume needed for a target profit.',
      },
    },
  },
  {
    slug: 'http-header-analyzer',
    category: 'dev',
    addedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    related: ['curl-converter', 'jwt-decoder', 'meta-tag-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: 'HTTPヘッダー解析・セキュリティ診断',
        keywords: [
          'HTTPヘッダー',
          'レスポンスヘッダー',
          'セキュリティヘッダー',
          'CSP',
          'HSTS',
          'X-Frame-Options',
          'Cookie属性',
        ],
        description:
          '貼り付けたレスポンスヘッダーから、HSTS・CSP・Cookie属性などの不足や弱い設定を診断。nginx・Apache・_headers 形式の推奨設定も生成します。',
      },
      en: {
        name: 'HTTP Header Analyzer & Security Check',
        keywords: [
          'security headers',
          'response headers',
          'CSP',
          'HSTS',
          'X-Frame-Options',
          'cookie flags',
          'CORS',
        ],
        description:
          'Check pasted response headers for missing or weak HSTS, CSP, and cookie flags, and copy recommended nginx, Apache, or _headers config.',
      },
    },
  },
  {
    slug: 'dummy-data-generator',
    category: 'generate',
    addedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    related: ['uuid-generator', 'lorem-ipsum', 'csv-json-converter'],
    translations: {
      ja: {
        name: 'ダミー個人データ生成（JSON・CSV）',
        keywords: [
          'ダミーデータ',
          'テストデータ',
          'ダミー個人情報',
          '架空の氏名',
          '架空の住所',
          'モックデータ',
        ],
        description:
          'テストやデモ用の架空の氏名・メール・電話番号・住所・生年月日などを最大1,000件まとめて生成。JSON・CSV・TSVで出力でき、シード指定で再現も可能です。',
      },
      en: {
        name: 'Dummy Personal Data Generator (JSON, CSV)',
        keywords: [
          'fake data generator',
          'mock data',
          'test data',
          'fake names',
          'fake addresses',
          'sample users',
        ],
        description:
          'Generate up to 1,000 fake people with names, emails, phones, addresses, and birthdays as JSON, CSV, or TSV, with a seed for repeatable output.',
      },
    },
  },
  {
    slug: 'zip-tool',
    category: 'file',
    addedAt: '2026-10-05',
    updatedAt: '2026-10-05',
    related: ['file-hash-calculator', 'crypto-encryptor'],
    sensitive: true,
    translations: {
      ja: {
        name: 'ZIP作成・解凍',
        keywords: [
          'ZIP',
          '圧縮',
          '解凍',
          '展開',
          'アーカイブ',
          'ファイルをまとめる',
        ],
        description:
          '複数のファイルをZIPにまとめたり、ZIPの中身を確認して必要なファイルだけ取り出したりできます。日本語のファイル名にも対応。',
      },
      en: {
        name: 'ZIP Maker & Extractor',
        keywords: [
          'zip',
          'unzip',
          'compress',
          'extract',
          'archive',
          'create zip',
        ],
        description:
          'Bundle files into a ZIP, or open a ZIP, browse its contents and save only the files you need. Works with non-English file names.',
      },
    },
  },
  {
    slug: 'screen-recorder',
    category: 'hardware',
    addedAt: '2026-10-05',
    updatedAt: '2026-10-05',
    related: ['mic-tester', 'webcam-tester'],
    sensitive: true,
    translations: {
      ja: {
        name: '画面録画',
        keywords: [
          '画面録画',
          'スクリーンレコーダー',
          '画面キャプチャ',
          '録画',
          'タブ録画',
          'screen recording',
        ],
        description:
          '画面全体・ウィンドウ・ブラウザのタブをブラウザだけで録画し、動画ファイルとして保存できます。ソフトのインストール不要。',
      },
      en: {
        name: 'Screen Recorder',
        keywords: [
          'screen recorder',
          'screen capture',
          'record screen',
          'tab recorder',
          'screencast',
        ],
        description:
          'Record your entire screen, a window or a browser tab right in the browser and save it as a video file. Nothing to install.',
      },
    },
  },
  {
    slug: 'amidakuji-generator',
    category: 'generate',
    addedAt: '2026-10-05',
    updatedAt: '2026-10-05',
    related: ['roulette-dice', 'password-generator', 'uuid-generator'],
    translations: {
      ja: {
        name: 'あみだくじ生成',
        keywords: [
          'あみだくじ',
          'アミダクジ',
          'くじ引き',
          '抽選',
          '順番決め',
          '役割分担',
          '飲み会',
        ],
        description:
          '参加者と結果を入力するだけで、あみだくじを自動作成。結果を隠して1人ずつ辿る・全員分を一括表示・画像保存に対応します。',
      },
      en: {
        name: 'Amidakuji (Ghost Leg) Generator',
        keywords: [
          'amidakuji',
          'ghost leg',
          'ladder lottery',
          'random assignment',
          'lottery',
          'chore picker',
        ],
        description:
          'Create an amidakuji ghost-leg ladder from names and outcomes. Hide results and trace one player at a time, reveal everyone, or save it as an image.',
      },
    },
  },
  {
    slug: 'text-merge-tool',
    category: 'text',
    addedAt: '2026-10-05',
    updatedAt: '2026-10-05',
    related: ['text-diff', 'line-ending-converter', 'char-counter'],
    sensitive: true,
    translations: {
      ja: {
        name: 'テキストマージツール',
        keywords: [
          'マージ',
          'テキスト統合',
          '差分',
          '結合',
          '2バージョン',
          'merge',
          'diff',
        ],
        description:
          '2つのバージョンのテキストを比較し、差分の箇所ごとにA・Bのどちらを採用するか選んで1つに統合します。結果は手動で編集でき、コピー・ダウンロードも可能。',
      },
      en: {
        name: 'Text Merge Tool',
        keywords: [
          'merge',
          'text merge',
          'combine',
          'diff',
          'three-way',
          'resolve conflicts',
        ],
        description:
          'Compare two versions of a text and choose A, B, or both for each difference to merge them into one. Edit the result by hand, then copy or download it.',
      },
    },
  },
  {
    slug: 'keypair-generator',
    category: 'security',
    addedAt: '2026-10-06',
    updatedAt: '2026-10-06',
    related: ['crypto-encryptor', 'hmac-generator', 'password-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: 'キーペア生成',
        keywords: [
          'RSA',
          'ECDSA',
          'Ed25519',
          '公開鍵',
          '秘密鍵',
          'PEM',
          '鍵生成',
        ],
        description:
          'RSA・ECDSA・Ed25519の公開鍵と秘密鍵のペアをPEM形式で生成。鍵はブラウザ内で作られ、送信されません。',
      },
      en: {
        name: 'Key Pair Generator',
        keywords: [
          'RSA',
          'ECDSA',
          'Ed25519',
          'public key',
          'private key',
          'PEM',
          'keygen',
        ],
        description:
          'Generate RSA, ECDSA, or Ed25519 public/private key pairs in PEM format. Keys are created in your browser and never sent.',
      },
    },
  },
  {
    slug: 'data-recipe-builder',
    category: 'encode',
    addedAt: '2026-10-06',
    updatedAt: '2026-10-06',
    related: ['base64', 'url-encode', 'hash-generator'],
    sensitive: true,
    translations: {
      ja: {
        name: '多段エンコード/デコード・ハッシュ変換チェーン',
        keywords: [
          'レシピ',
          'CyberChef',
          '連続変換',
          'Base64',
          'ハッシュ',
          'パイプライン',
        ],
        description:
          'Base64・URL・16進数・HTMLエスケープ・MD5/SHA-256などを好きな順に連結して一度に変換。手順ごとの途中結果も確認できます。',
      },
      en: {
        name: 'Multi-Step Encode/Decode & Hash Chain',
        keywords: [
          'recipe',
          'CyberChef',
          'chain',
          'pipeline',
          'base64',
          'hash',
          'multi-step',
        ],
        description:
          'Chain Base64, URL, hex, HTML escape, MD5/SHA-256 and more in any order and convert in one go, with every intermediate result shown.',
      },
    },
  },
  {
    slug: 'text-replace-tools',
    category: 'text',
    addedAt: '2026-10-06',
    updatedAt: '2026-10-06',
    related: ['text-list-tools', 'regex-tester', 'text-diff'],
    translations: {
      ja: {
        name: 'テキスト一括置換・行操作',
        keywords: [
          '一括置換',
          '文字列置換',
          '行番号',
          '行番号付与',
          '行抽出',
          'grep',
          '正規表現',
          '行頭追加',
        ],
        description:
          'テキストの一括置換（正規表現対応）、行番号の付与・削除、キーワードを含む行の抽出・除外、各行の前後への文字追加、行の逆順を行います。',
      },
      en: {
        name: 'Find & Replace and Line Tools',
        keywords: [
          'find and replace',
          'bulk replace',
          'add line numbers',
          'filter lines',
          'grep',
          'regex replace',
          'prefix suffix',
        ],
        description:
          'Bulk find and replace (regex supported), add or remove line numbers, keep or remove lines by keyword, add a prefix or suffix to each line, and reverse line order.',
      },
    },
  },
  {
    slug: 'ocr-protect-image',
    category: 'image',
    addedAt: '2026-10-06',
    updatedAt: '2026-10-06',
    related: ['image-pixelart-converter', 'image-text-overlay', 'exif-viewer'],
    sensitive: true,
    translations: {
      ja: {
        name: 'OCR対策画像加工',
        keywords: [
          'OCR対策',
          '文字認識',
          'スクレイピング対策',
          '画像ノイズ',
          '文字を読み取りにくく',
        ],
        description:
          '画像内の文字に微小な歪み・ノイズ・細線を加え、OCRによる自動読み取りを難しくします。効果は保証できません。PNGで保存可能。',
      },
      en: {
        name: 'OCR-Resistant Image Obfuscator',
        keywords: [
          'OCR protection',
          'anti OCR',
          'anti scraping',
          'image noise',
          'obfuscate text',
        ],
        description:
          'Adds subtle distortion, noise, and fine lines to text in an image to make automatic OCR reading harder. No guarantee of effect. Saves as PNG.',
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
