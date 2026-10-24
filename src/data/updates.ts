import type { Locale } from './tools';

/** 1日の更新内の個別項目。`slug` があればそのツールの説明を上書きし、なければ機能追加などの単独項目になる */
export interface UpdateItem {
  /** 紐づくツール（`toolSlugs` に含まれるものだけ指定できる） */
  slug?: string;
  translations: Record<Locale, { text: string }>;
}

export interface UpdateEntry {
  /** YYYY-MM-DD */
  date: string;
  /** 追加・更新したツール。表示時に `src/data/tools.ts` からツール名と説明を解決して1件ずつ並べる */
  toolSlugs?: string[];
  /** 一言の見出し。「N個のツールを追加しました。」程度に短くする */
  translations: Record<Locale, { summary: string }>;
  /** 任意。ツール説明の上書き（`slug` あり）や、ツール以外の機能追加（`slug` なし）を書く */
  items?: UpdateItem[];
}

/** サイト開始日（2026-09-15）以降の更新履歴。ツール追加・主要機能追加のみを対象とし、
 * インフラ・開発ルール整備・軽微な修正などは含めない。新しい更新は末尾に追記する。ツールの説明は書かず `toolSlugs` に並べる（レジストリの説明が表示される）。表示順は日付降順に自動整列する。同じ日付の更新は1エントリにまとめる（`updates.test.ts` が日付の重複を検出する）。 */
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
          'にゃんこツールを公開しました。15個のツールでスタートし、ダークモード表示と英語版ページにも対応しました。',
      },
      en: {
        summary:
          'Launched NyankoTools with 15 tools to start, along with dark mode and an English version of the site.',
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
          '18個のツールを追加し、運営者情報・FAQ・お問い合わせ・利用規約ページとセキュリティヘッダー（CSP）を整備しました。',
      },
      en: {
        summary:
          'Added 14 new tools, plus About, FAQ, Contact, and Terms of Service pages and security headers (CSP).',
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
        summary: '16個のツールを追加しました。',
      },
      en: {
        summary: 'Added 16 new tools.',
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
        summary: '6個のツールを追加しました。',
      },
      en: {
        summary: 'Added 6 new tools.',
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
          '7個のツールを追加し、ツールのお気に入り登録機能にも対応しました。',
      },
      en: {
        summary:
          'Added 7 new tools, plus a favorites feature for bookmarking tools.',
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
        summary: '9個のツールを追加し、ツールのカテゴリを9分類に整理しました。',
      },
      en: {
        summary:
          'Added 9 new tools, and reorganized tool categories into 9 groups.',
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
        summary: '5個のツールを追加しました。',
      },
      en: {
        summary: 'Added 5 new tools.',
      },
    },
  },
  {
    date: '2026-09-28',
    toolSlugs: ['px-rem-converter', 'contrast-checker', 'meta-tag-generator'],
    translations: {
      ja: {
        summary: '3個のツールを追加しました。',
      },
      en: {
        summary: 'Added 3 new tools.',
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
        summary: '使いやすさと探しやすさを高める機能を追加しました。',
      },
      en: {
        summary: 'Added features that make tools easier to find and use.',
      },
    },
    items: [
      {
        translations: {
          ja: {
            text: 'コマンドパレット（Ctrl+K）によるツール検索を追加しました。',
          },
          en: {
            text: 'Added a command palette (Ctrl+K) for finding tools.',
          },
        },
      },
      {
        translations: {
          ja: {
            text: 'キーボードショートカットを追加しました。',
          },
          en: {
            text: 'Added keyboard shortcuts.',
          },
        },
      },
      {
        translations: {
          ja: {
            text: '「🔒 ブラウザ内完結」バッジを追加しました。',
          },
          en: {
            text: 'Added a "🔒 Runs in your browser" badge.',
          },
        },
      },
      {
        translations: {
          ja: {
            text: 'カテゴリ別一覧ページを追加しました。',
          },
          en: {
            text: 'Added category listing pages.',
          },
        },
      },
      {
        translations: {
          ja: {
            text: 'URLクエリで入力の初期値を指定できるようにしました。',
          },
          en: {
            text: 'Added pre-filling inputs via URL query.',
          },
        },
      },
      {
        translations: {
          ja: {
            text: '入力内容を更新・言語切替後も保持するようにしました。',
          },
          en: {
            text: 'Inputs are now kept across reloads and language switches.',
          },
        },
      },
      {
        translations: {
          ja: {
            text: 'ページ先頭に戻るボタンを追加しました。',
          },
          en: {
            text: 'Added a back-to-top button.',
          },
        },
      },
      {
        translations: {
          ja: {
            text: 'シェア先にThreads・Bluesky・Redditを追加しました。',
          },
          en: {
            text: 'Added more share targets (Threads, Bluesky, Reddit).',
          },
        },
      },
      {
        translations: {
          ja: {
            text: '印刷用表示に対応しました。',
          },
          en: {
            text: 'Added print-friendly layouts.',
          },
        },
      },
      {
        translations: {
          ja: {
            text: 'スキップリンクなどのアクセシビリティ改善を行いました。',
          },
          en: {
            text: 'Improved accessibility, including a skip link.',
          },
        },
      },
      {
        translations: {
          ja: {
            text: '各ツールページのよくある質問（FAQ）・注意事項・使い方の解説を拡充しました。',
          },
          en: {
            text: 'Expanded FAQs, notes, and how-to guides on tool pages.',
          },
        },
      },
    ],
  },
  {
    date: '2026-10-01',
    toolSlugs: [
      'curl-converter',
      'json-to-types',
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
        summary: '11個のツールを追加しました。',
      },
      en: {
        summary: 'Added 11 new tools.',
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
          '34個のツールを追加し、新カテゴリ「ハードウェア」を設けました。',
      },
      en: {
        summary: 'Added 34 new tools, plus a new Hardware category.',
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
      'id-photo-maker',
      'camera-color-picker',
    ],
    translations: {
      ja: {
        summary: '10個のツールを追加しました。',
      },
      en: {
        summary: 'Added 10 new tools.',
      },
    },
  },
  {
    date: '2026-10-04',
    toolSlugs: [
      'gamepad-tester',
      'speaker-tester',
      'mouse-tester',
      'electricity-cost-calculator',
      'download-time-calculator',
      'statistics-calculator',
      'break-even-calculator',
      'http-header-analyzer',
      'dummy-data-generator',
    ],
    translations: {
      ja: {
        summary: '9個のツールを追加しました。',
      },
      en: {
        summary: 'Added 9 new tools.',
      },
    },
  },
  {
    date: '2026-10-05',
    toolSlugs: [
      'zip-tool',
      'screen-recorder',
      'amidakuji-generator',
      'text-merge-tool',
    ],
    translations: {
      ja: {
        summary: '4個のツールを追加しました。',
      },
      en: {
        summary: 'Added 12 new tools.',
      },
    },
  },
  {
    date: '2026-10-06',
    toolSlugs: [
      'keypair-generator',
      'data-recipe-builder',
      'text-replace-tools',
      'ocr-protect-image',
      'csp-sri-generator',
      'media-converter',
    ],
    translations: {
      ja: {
        summary:
          '6個のツールを追加し、404ページに猫アクションのミニゲームを追加しました。',
      },
      en: {
        summary:
          'Added 6 new tools, plus a cat action minigame on the 404 page.',
      },
    },
  },
  {
    date: '2026-10-07',
    toolSlugs: [
      'css-clamp-calculator',
      'time-calculator',
      'fuel-cost-calculator',
      'aspect-ratio-calculator',
      'gacha-calculator',
      'url-parser',
      'unicode-inspector',
      'user-agent-parser',
    ],
    translations: {
      ja: {
        summary: '12個のツールを追加しました。',
      },
      en: {
        summary: 'Added 8 new tools.',
      },
    },
  },
  {
    date: '2026-10-08',
    toolSlugs: [
      'team-splitter',
      'bingo-generator',
      'seat-shuffler',
      'omikuji',
      'image-blur-mosaic',
      'color-palette-generator',
      'image-filter',
      'typing-test',
      'reaction-test',
      'sudoku',
    ],
    translations: {
      ja: {
        summary: '10個のツールを追加しました。',
      },
      en: {
        summary: 'Added 10 new tools.',
      },
    },
  },
  {
    date: '2026-10-09',
    toolSlugs: [
      'char-counter',
      'markdown-preview',
      'json-to-types',
      'pdf-to-markdown',
      'timer-stopwatch',
    ],
    translations: {
      ja: {
        summary: '5つのツールを更新しました。',
      },
      en: {
        summary: 'Updated 5 tools.',
      },
    },
    items: [
      {
        slug: 'char-counter',
        translations: {
          ja: {
            text: 'X（Twitter）の文字数判定に対応しました。',
          },
          en: {
            text: 'Added X (Twitter) character-limit checking.',
          },
        },
      },
      {
        slug: 'markdown-preview',
        translations: {
          ja: {
            text: 'HTML→Markdownの書式オプションを追加しました。',
          },
          en: {
            text: 'Added formatting options for HTML to Markdown.',
          },
        },
      },
      {
        slug: 'json-to-types',
        translations: {
          ja: {
            text: 'C#・Go・Python・Javaの出力に対応しました。URLが /tools/json-to-types/ に変わりました（旧URLは自動で転送されます）。',
          },
          en: {
            text: 'Added C#, Go, Python and Java output. The URL moved to /en/tools/json-to-types/ (the old URL redirects automatically).',
          },
        },
      },
      {
        slug: 'pdf-to-markdown',
        translations: {
          ja: {
            text: 'テキスト出力に対応しました。',
          },
          en: {
            text: 'Added plain-text output.',
          },
        },
      },
      {
        slug: 'timer-stopwatch',
        translations: {
          ja: {
            text: '「ぴったりチャレンジ」を追加しました。',
          },
          en: {
            text: 'Added an "exact time challenge" mode.',
          },
        },
      },
    ],
  },
  {
    date: '2026-10-10',
    toolSlugs: [
      'csv-excel-converter',
      'css-layout-generator',
      'calendar-generator',
      'video-to-gif',
      'metronome-bpm',
      'random-generator',
      'file-type-detector',
    ],
    translations: {
      ja: {
        summary: '7個のツールを追加しました。',
      },
      en: {
        summary: 'Added 7 new tools.',
      },
    },
  },
  {
    date: '2026-10-11',
    toolSlugs: [
      'image-ascii-art',
      'jsonl-converter',
      'memory-match',
      'slide-puzzle',
      'game-2048',
    ],
    translations: {
      ja: {
        summary: '5個のツールを追加しました。',
      },
      en: {
        summary: 'Added 5 new tools.',
      },
    },
  },
  {
    date: '2026-10-12',
    toolSlugs: [
      'minesweeper',
      'reversi',
      'maze-generator',
      'word-search-generator',
      'crossword-generator',
      'color-sense-test',
      'game-of-life',
      'picross',
      'invaders-game',
    ],
    translations: {
      ja: {
        summary: '9個のツールを追加しました。',
      },
      en: {
        summary: 'Added 9 new tools.',
      },
    },
  },
  {
    date: '2026-10-13',
    toolSlugs: [
      'delimiter-converter',
      'morse-code-converter',
      'classical-cipher',
      'roman-numeral-converter',
      'prime-factorization',
      'combination-calculator',
      'gpa-calculator',
      'screen-size-calculator',
      'birthday-info',
      'school-grade-table',
      'anniversary-calculator',
      'due-date-calculator',
      'css-text-shadow-generator',
      'css-glassmorphism-generator',
      'css-animation-generator',
      'http-status-codes',
      'mime-type-lookup',
      'robots-txt-generator',
      'sitemap-generator',
    ],
    translations: {
      ja: {
        summary: '19個のツールを追加しました。',
      },
      en: {
        summary: 'Added 19 new tools.',
      },
    },
  },
  {
    date: '2026-10-14',
    toolSlugs: [
      'braille-converter',
      'number-to-words',
      'html-tag-stripper',
      'sequence-generator',
      'paid-leave-calculator',
      'running-pace-calculator',
      'image-round-crop',
      'image-padding',
      'seal-stamp-generator',
      'signature-pad',
      'japanese-traditional-colors',
    ],
    translations: {
      ja: {
        summary: '11個のツールを追加しました。',
      },
      en: {
        summary: 'Added 11 new tools.',
      },
    },
  },
  {
    date: '2026-10-15',
    toolSlugs: [
      'jwt-generator',
      'sql-insert-generator',
      'csv-viewer',
      'css-clip-path-generator',
      'svg-wave-generator',
      'color-blindness-simulator',
      'image-splitter',
      'graph-paper-generator',
    ],
    translations: {
      ja: {
        summary: '8個のツールを追加しました。',
      },
      en: {
        summary: 'Added 8 new tools.',
      },
    },
  },
  {
    date: '2026-10-16',
    toolSlugs: [
      'loan-calculator',
      'size-converter',
      'refresh-rate-tester',
      'touch-tester',
      'snake-game',
      'htaccess-generator',
      'figlet-text',
    ],
    translations: {
      ja: {
        summary: '7個のツールを追加しました。',
      },
      en: {
        summary: 'Added 7 new tools.',
      },
    },
  },
  {
    date: '2026-10-17',
    toolSlugs: [
      'rokuyo-calendar',
      'instrument-tuner',
      'tetris-game',
      'invoice-generator',
    ],
    translations: {
      ja: {
        summary: '4個のツールを追加しました。',
      },
      en: {
        summary: 'Added 4 new tools.',
      },
    },
  },
  {
    date: '2026-10-18',
    toolSlugs: [
      'word-frequency',
      'unicode-normalizer',
      'text-extractor',
      'indent-converter',
      'ascii-table-generator',
      'code-string-escaper',
      'slug-generator',
      'memorization-sheet',
      'vertical-text-converter',
      'base-n-encoder',
      'text-binary-converter',
      'checksum-calculator',
    ],
    translations: {
      ja: {
        summary: '12個のツールを追加しました。',
      },
      en: {
        summary: 'Added 12 new tools.',
      },
    },
  },
  {
    date: '2026-10-19',
    toolSlugs: [
      'punycode-converter',
      'json5-converter',
      'markdown-table-editor',
      'janken-game',
      'ip-address-converter',
      'semver-calculator',
      'jsonld-generator',
      'utm-builder',
      'htpasswd-generator',
      'nginx-redirect-generator',
      'port-number-lookup',
      'html-table-generator',
      'date-format-builder',
      'regex-pattern-library',
      'bitwise-calculator',
      'ieee754-viewer',
      'clipboard-inspector',
      'snowflake-id-decoder',
      'license-generator',
      'tree-diagram-generator',
    ],
    translations: {
      ja: {
        summary: '20個のツールを追加しました。',
      },
      en: {
        summary: 'Added 20 new tools.',
      },
    },
  },
  {
    date: '2026-10-20',
    toolSlugs: [
      'css-filter-generator',
      'css-transform-generator',
      'css-specificity-calculator',
      'css-button-generator',
      'css-pattern-background',
      'mailto-link-generator',
      'ics-generator',
      'vcard-generator',
      'math-drill-generator',
      'envelope-printer',
      'passphrase-generator',
      'dmarc-spf-generator',
      'email-header-analyzer',
      'image-compare-slider',
      'image-frame-maker',
      'gradient-wallpaper',
      'device-mockup',
      'avatar-generator',
      'tailwind-color-scale-generator',
      'pixel-art-editor',
      'screenshot-annotator',
      'audio-speed-changer',
      'noise-generator',
      'virtual-piano',
      'mosaic-smoother',
    ],
    translations: {
      ja: {
        summary: '25個のツールを追加しました。',
      },
      en: {
        summary: 'Added 25 new tools.',
      },
    },
  },
  {
    date: '2026-10-21',
    toolSlugs: [
      'audio-merger',
      'bpm-delay-calculator',
      'noise-meter',
      'screen-ruler',
      'spirit-level',
      'ufo-motion-test',
      'monitor-gamma-test',
      'hearing-test',
      'unit-price-comparator',
      'savings-goal-calculator',
      'rent-initial-cost',
      'bonus-take-home',
      'tax-wall-calculator',
      'unemployment-benefit',
      'childcare-leave-benefit',
      'retirement-allowance-tax',
      'real-estate-yield',
      'pfc-calculator',
      'sleep-calculator',
      'pet-age-calculator',
      'cooking-unit-converter',
      'recipe-scaler',
      'material-quantity',
      'ab-test-calculator',
      'linear-regression',
      'matrix-calculator',
      'quadratic-solver',
      'geometry-calculator',
      'senjitsu-calendar',
      'kyusei-kigaku',
      'shift-schedule-maker',
      'breakout-game',
      'connect-four',
      'hit-and-blow',
      'lights-out',
      'mental-math-trainer',
      'function-grapher',
      'scientific-calculator',
      'passport-romaji-converter',
      'image-reveal-mask',
    ],
    translations: {
      ja: {
        summary: '40個のツールを追加しました。',
      },
      en: {
        summary: 'Added 40 new tools.',
      },
    },
  },
  {
    date: '2026-10-22',
    toolSlugs: [
      'color-space-converter',
      'chart-maker',
      'file-encryptor',
      'image-ocr',
      'text-to-speech',
      'notation-variants-checker',
      'readability-checker',
      'ruby-tag-generator',
      'string-similarity',
      'whitespace-visualizer',
      'text-box-frame',
      'upside-down-text',
      'byte-length-counter',
      'markdown-toc-generator',
      'anagram-palindrome-checker',
      'json-sorter',
      'xml-formatter',
      'yaml-formatter',
      'csv-split-merge',
      'excel-column-converter',
      'query-string-json',
      'file-base64-converter',
      'svg-to-data-uri',
      'css-color-names',
      'html-entity-list',
    ],
    translations: {
      ja: {
        summary: '25個のツールを追加しました。',
      },
      en: {
        summary: 'Added 25 new tools.',
      },
    },
  },
  {
    date: '2026-10-23',
    toolSlugs: [
      'cron-generator',
      'iso-duration-converter',
      'cookie-parser',
      'umask-calculator',
      'docker-compose-converter',
      'regex-explainer',
      'css-unit-converter',
      'fetch-to-curl',
      'wifi-qr-generator',
      'tokushoho-generator',
      'privacy-policy-generator',
      'daily-proration-calculator',
      'business-card-maker',
      'resume-maker',
      'luhn-checker',
      'isbn-checker',
      'jwk-pem-converter',
      'shamir-secret-sharing',
      'rsa-encryptor',
      'digital-signature-tool',
      'coordinate-converter',
      'ohm-calculator',
      'print-size-converter',
      'resistor-color-code',
      'image-compress-to-size',
      'image-dpi-changer',
      'image-diff',
      'image-logo-watermark',
      'meme-generator',
      'sticker-outline-maker',
      'screen-color-picker',
    ],
    translations: {
      ja: {
        summary: '31個のツールを追加しました。',
      },
      en: {
        summary: 'Added 31 new tools.',
      },
    },
  },
  {
    date: '2026-10-24',
    toolSlugs: [
      'photo-collage-maker',
      'document-scan-filter',
      'svg-path-viewer',
      'color-mixer',
      'gif-splitter',
      'withholding-tax-calculator',
      'stamp-duty-calculator',
      'gift-tax-calculator',
      'pdf-nup',
      'pdf-crop',
      'depreciation-calculator',
      'parcel-size-checker',
      'pdf-stamp',
      'pdf-image-extractor',
      'fx-calculator',
      'mets-calorie-calculator',
    ],
    translations: {
      ja: {
        summary: '12個のツールを追加しました。',
      },
      en: {
        summary: 'Added 12 new tools.',
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
