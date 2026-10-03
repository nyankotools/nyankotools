import type { Locale } from './tools';

export interface UpdateEntry {
  /** YYYY-MM-DD */
  date: string;
  /** 関連ツールへの内部リンク表示用（存在すれば `src/data/tools.ts` から名前を解決） */
  toolSlugs?: string[];
  translations: Record<Locale, { summary: string }>;
}

/** サイト開始日（2026-09-15）以降の更新履歴。ツール追加・主要機能追加のみを対象とし、
 * インフラ・開発ルール整備・軽微な修正などは含めない。新しい更新は末尾に追記する（表示順は日付降順に自動整列）。同じ日付の更新は1エントリにまとめる（`updates.test.ts` が日付の重複を検出する）。 */
export const updates: UpdateEntry[] = [
  {
    date: '2026-09-15',
    toolSlugs: [
      'char-counter',
      'json-formatter',
      'base64',
      'url-encode',
      'uuid-generator',
      'password-generator',
      'hash-generator',
      'qr-generator',
      'color-converter',
      'unix-timestamp',
      'zenkaku-hankaku',
      'kana-converter',
      'yaml-json-converter',
      'csv-json-converter',
      'markdown-preview',
    ],
    translations: {
      ja: {
        summary:
          'にゃんこツールを公開しました。文字数カウント・JSON整形・Base64エンコード/デコードなど15個のツールでスタートし、ダークモード表示と英語版ページにも対応しました。',
      },
      en: {
        summary:
          'Launched NyankoTools with 15 tools to start, including Character Counter, JSON Formatter, and Base64 Encoder/Decoder, along with dark mode and an English version of the site.',
      },
    },
  },
  {
    date: '2026-09-16',
    toolSlugs: [
      'kishu-izon-checker',
      'regex-tester',
      'text-diff',
      'jwt-decoder',
      'lorem-ipsum',
      'text-list-tools',
      'line-ending-converter',
      'cron-parser',
      'japanese-era-converter',
      'date-calculator',
      'age-calculator',
      'hourly-wage-calculator',
      'tax-calculator',
      'html-escape',
    ],
    translations: {
      ja: {
        summary:
          '機種依存文字チェッカー・正規表現テスター・テキスト差分比較（diff）・JWTデコーダー・ダミーテキスト生成・Cron式スケジュールシミュレーター・和暦⇔西暦変換・年齢計算機など14個のツールを追加し、運営者情報・FAQ・お問い合わせ・利用規約ページとセキュリティヘッダー（CSP）を整備しました。',
      },
      en: {
        summary:
          'Added 14 new tools including the Machine-Dependent Character Checker, Regex Tester, Text Diff Checker, JWT Decoder, Dummy Text Generator, and Age Calculator, plus About, FAQ, Contact, and Terms of Service pages and security headers (CSP).',
      },
    },
  },
  {
    date: '2026-09-17',
    toolSlugs: [
      'sql-formatter',
      'code-minifier',
      'chmod-calculator',
      'cidr-calculator',
      'keycode-checker',
      'viewport-checker',
      'json-path-tester',
      'toml-converter',
    ],
    translations: {
      ja: {
        summary:
          'SQL整形・CSS/JS/HTMLミニファイ＆整形・Chmodパーミッション計算機・CIDR/サブネット計算機・キーコードチェッカー・スクリーンサイズ/Viewportチェッカー・JSON Path/JSON Pointerテスター・TOML⇔JSON/YAML変換を追加しました。',
      },
      en: {
        summary:
          'Added the SQL Formatter, CSS/JS/HTML Minifier, Chmod Permission Calculator, CIDR/Subnet Calculator, Keycode Checker, Screen Size & Viewport Checker, JSON Path/JSON Pointer Tester, and TOML to JSON/YAML Converter.',
      },
    },
  },
  {
    date: '2026-09-18',
    toolSlugs: ['text-case-converter'],
    translations: {
      ja: {
        summary:
          'テキストケース変換を追加し、全37ツールの英語版ページ対応が完了しました。',
      },
      en: {
        summary:
          'Added the Text Case Converter, and finished translating all 37 tools into English.',
      },
    },
  },
  {
    date: '2026-09-23',
    toolSlugs: [
      'ratio-calculator',
      'bmi-calculator',
      'freelance-income-calculator',
      'mortgage-calculator',
      'investment-simulator',
      'scholarship-repayment-simulator',
    ],
    translations: {
      ja: {
        summary:
          '割合・比率計算機・BMI計算機・フリーランス手取り計算機・住宅ローン繰り上げ返済比較シミュレーション・資産運用シミュレーション・奨学金返済シミュレーションを追加しました。',
      },
      en: {
        summary:
          'Added the Ratio & Percentage Calculator, BMI Calculator, Freelancer Take-Home Pay Calculator, Mortgage Prepayment Comparison Calculator, Investment Growth Simulator, and JASSO Student Loan Repayment Simulator.',
      },
    },
  },
  {
    date: '2026-09-24',
    toolSlugs: [
      'image-converter',
      'image-resizer',
      'image-to-base64',
      'favicon-generator',
      'exif-viewer',
      'image-pixelart-converter',
      'image-palette-extractor',
    ],
    translations: {
      ja: {
        summary:
          '画像フォーマット変換・画像リサイズ/圧縮・画像のBase64変換・favicon一括生成・EXIF情報表示/削除・画像ドット絵化/モザイク/減色・画像カラーパレット抽出を追加し、ツールのお気に入り登録機能にも対応しました。',
      },
      en: {
        summary:
          'Added the Image Format Converter, Image Resizer & Compressor, Image to Base64 Converter, Favicon Generator, EXIF Viewer & Remover, Pixelate/Mosaic/Color Reduction tool, and Image Color Palette Extractor, plus a favorites feature for bookmarking tools.',
      },
    },
  },
  {
    date: '2026-09-25',
    toolSlugs: [
      'svg-optimizer',
      'placeholder-image-generator',
      'pdf-merge-split',
      'pdf-image-converter',
      'pdf-compressor',
      'pdf-page-editor',
      'cat-logo-text-generator',
      'pdf-password-protector',
      'encoding-converter',
    ],
    translations: {
      ja: {
        summary:
          'SVG最適化・ダミー画像生成・PDF結合/分割/ページ抽出・PDF⇔画像変換・PDF圧縮・PDFページ回転/削除/並び替え・猫ロゴ文字ジェネレーター・PDFパスワード設定・文字コード変換/文字化け診断を追加し、ツールのカテゴリを9分類に整理しました。',
      },
      en: {
        summary:
          'Added the SVG Optimizer, Placeholder Image Generator, PDF Merge/Split/Extract, PDF ⇔ Image Converter, PDF Compressor, PDF Page Editor, Cat Logo Text Generator, and PDF Password Protector, plus the Encoding Converter & Mojibake Fixer, and reorganized tool categories into 9 groups.',
      },
    },
  },
  {
    date: '2026-09-26',
    toolSlugs: ['pdf-to-markdown'],
    translations: {
      ja: {
        summary: 'PDFをMarkdownに変換ツールを追加しました。',
      },
      en: {
        summary: 'Added the PDF to Markdown Converter.',
      },
    },
  },
  {
    date: '2026-09-27',
    toolSlugs: [
      'webcam-tester',
      'base-converter',
      'css-gradient-generator',
      'css-box-shadow-generator',
      'css-border-radius-generator',
    ],
    translations: {
      ja: {
        summary:
          'Webカメラ動作確認・進数変換・CSSグラデーションジェネレーター・CSS box-shadowジェネレーター・CSS border-radiusジェネレーターを追加しました。',
      },
      en: {
        summary:
          'Added the Webcam & Microphone Test, Base Converter, CSS Gradient Generator, CSS Box-Shadow Generator, and CSS Border-Radius Generator.',
      },
    },
  },
  {
    date: '2026-09-28',
    toolSlugs: ['px-rem-converter', 'contrast-checker', 'meta-tag-generator'],
    translations: {
      ja: {
        summary:
          'px⇔rem変換・色のコントラスト比チェッカー（WCAG）・metaタグ・OGPタグ生成を追加しました。',
      },
      en: {
        summary:
          'Added the px to rem Converter, Color Contrast Checker (WCAG), and Meta Tag & OGP Generator.',
      },
    },
  },
  {
    date: '2026-09-29',
    translations: {
      ja: {
        summary:
          '検索結果にパンくずリストが表示されるよう、BreadcrumbList構造化データに対応しました。',
      },
      en: {
        summary:
          'Added BreadcrumbList structured data so breadcrumbs can appear in search results.',
      },
    },
  },
  {
    date: '2026-09-30',
    translations: {
      ja: {
        summary:
          'コマンドパレット（Ctrl+K）によるツール検索、キーボードショートカット、「🔒 ブラウザ内完結」バッジ、カテゴリ別一覧ページ、URLクエリでの入力初期値の指定、入力内容の保持（更新・言語切替後も維持）、ページ先頭に戻るボタン、シェア先の追加（Threads・Bluesky・Reddit）、印刷用表示、スキップリンクなどのアクセシビリティ改善を追加しました。各ツールページにも、よくある質問（FAQ）・注意事項・使い方の解説を拡充しています。',
      },
      en: {
        summary:
          'Added a command palette (Ctrl+K) for finding tools, keyboard shortcuts, a "🔒 Runs in your browser" badge, category listing pages, pre-filling inputs via URL query, input persistence across reloads and language switches, a back-to-top button, more share targets (Threads, Bluesky, Reddit), print-friendly layouts, and accessibility improvements such as a skip link. Tool pages also gained expanded FAQs, notes, and how-to guides.',
      },
    },
  },
  {
    date: '2026-10-01',
    toolSlugs: [
      'curl-converter',
      'json-to-typescript',
      'json-diff',
      'barcode-generator',
      'ulid-nanoid-generator',
      'password-strength-checker',
      'file-hash-calculator',
      'svg-to-png',
      'ogp-image-generator',
      'image-cropper',
      'image-background-remover',
    ],
    translations: {
      ja: {
        summary:
          'cURL→Fetch/Axios変換、JSON→TypeScript型生成、JSON差分比較、バーコード生成、ULID・NanoID生成、パスワード強度チェッカー、ファイルハッシュ計算、SVG→PNG変換、OGP画像ジェネレーター、画像トリミング・回転・反転、画像の背景透過（輪郭付き）を追加しました。',
      },
      en: {
        summary:
          'Added the cURL to Fetch / Axios Converter, JSON to TypeScript Converter, JSON Diff, Barcode Generator, ULID & NanoID Generator, Password Strength Checker, File Hash Calculator, SVG to PNG Converter, OGP Image Generator, Image Cropper, Rotator & Flipper, and Image Background Remover.',
      },
    },
  },
  {
    date: '2026-10-02',
    toolSlugs: [
      'mic-tester',
      'keyboard-tester',
      'dead-pixel-checker',
      'unit-converter',
      'split-bill-calculator',
      'bmr-calorie-calculator',
      'salary-take-home-calculator',
      'furusato-nozei-calculator',
      'timezone-converter',
      'business-day-calculator',
      'timer-stopwatch',
      'kanji-number-converter',
      'kyujitai-converter',
      'my-number-checker',
      'romaji-kana-converter',
      'english-katakana-converter',
      'unicode-decorator',
      'special-char-list',
      'roulette-dice',
      'qr-code-reader',
      'heic-converter',
      'pdf-redactor',
      'crypto-encryptor',
      'hmac-generator',
      'totp-generator',
      'bcrypt-generator',
      'x509-decoder',
      'ssh-fingerprint',
      'xml-json-converter',
      'env-json-converter',
      'csv-markdown-table',
      'html-table-to-csv',
      'json-tree-viewer',
      'json-schema-generator',
    ],
    translations: {
      ja: {
        summary:
          'マイクテスト（入力レベル・録音）、キーボードテスト（全キー押下判定）、ドット抜けチェック（色ムラ確認）を追加し、新カテゴリ「ハードウェア」を設けました。あわせて、単位変換、割り勘計算機（端数処理・傾斜割り勘）、基礎代謝・消費カロリー計算機、会社員の手取り計算機、ふるさと納税の上限額シミュレーション、タイムゾーン変換・世界時計、営業日計算（日本の祝日対応）、タイマー・ストップウォッチ・ポモドーロ、漢数字⇔算用数字・大字変換、旧字体⇔新字体変換、マイナンバー・法人番号チェックデジット検証、ローマ字⇔ひらがな変換、英単語カタカナ変換、Unicode装飾文字変換、特殊文字・絵文字一覧、ルーレット・抽選・サイコロ、QRコードリーダー（カメラ・画像）、HEIC→JPEG変換、PDF黒塗り、テキスト暗号化・復号（AES-256-GCM）、HMAC署名生成、TOTPコード生成・検証、bcryptハッシュ生成・照合、X.509証明書デコーダー、SSH鍵フィンガープリント表示、XML⇔JSON変換、.env⇔JSON変換、CSV/TSV→Markdownテーブル変換、HTMLテーブル→CSV変換、JSONツリービューア、JSON Schema生成も追加しました。',
      },
      en: {
        summary:
          'Added the Microphone Test (level & recording), Keyboard Tester, and Dead Pixel Test, plus a new Hardware category. Also added the Unit Converter, Split Bill Calculator, BMR & Calorie Calculator, Salary Take-Home Pay Calculator, Furusato Nozei Donation Limit Calculator, Time Zone Converter, Japan Business Day Calculator, Timer, Stopwatch & Pomodoro, Kanji Numeral Converter, Kyujitai ⇔ Shinjitai Converter, My Number & Corporate Number Validator, Romaji ⇔ Hiragana Converter, English to Katakana Converter, Unicode Text Decorator, Special Characters & Emoji List, Roulette, Random Picker & Dice, QR Code Reader (Camera & Image), HEIC to JPG Converter, PDF Redactor, Text Encryptor & Decryptor (AES-256-GCM), HMAC Generator, TOTP Code Generator, Bcrypt Hash Generator & Verifier, X.509 Certificate Decoder, SSH Key Fingerprint Viewer, XML to JSON Converter, .env to JSON Converter, CSV/TSV to Markdown Table Converter, HTML Table to CSV Converter, JSON Tree Viewer, and JSON Schema Generator.',
      },
    },
  },
  {
    date: '2026-10-03',
    toolSlugs: [
      'image-merger',
      'image-text-overlay',
      'gif-maker',
      'pdf-page-number-watermark',
      'pdf-metadata-editor',
      'unicode-escape',
      'zero-width-char-remover',
      'reading-time-calculator',
    ],
    translations: {
      ja: {
        summary:
          '画像結合（縦・横・グリッド）、画像への文字入れ・透かし、GIF作成（連番画像から）、PDFへのページ番号・透かし追加、PDFメタデータ編集、Unicodeエスケープ変換、ゼロ幅文字の検出・除去、読了時間・原稿用紙換算を追加しました。',
      },
      en: {
        summary:
          'Added the Image Merger, Add Text or Watermark to Image, GIF Maker, PDF Page Numbers & Watermark, PDF Metadata Editor, Unicode Escape / Unescape, Zero-Width Character Remover, and Reading Time Calculator.',
      },
    },
  },
];

/** 表示用に日付の新しい順へ並び替える */
export function getSortedUpdates(): UpdateEntry[] {
  return [...updates].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}
