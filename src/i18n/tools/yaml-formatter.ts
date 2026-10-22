import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface YamlFormatterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  indentLabel: string;
  indentOption2: string;
  indentOption4: string;
  sortKeysLabel: string;
  expandFlowLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  syntaxErrorPrefix: string;
  /** {line} {column} を置き換えて表示する */
  errorLocationTemplate: string;
  /** {n} を置き換えて表示する */
  errorDocumentTemplate: string;
  errorExcerptLabel: string;
  /** {n} を置き換えて表示する */
  documentsTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const yamlFormatterContent: Record<Locale, YamlFormatterPageContent> = {
  ja: {
    title: 'YAML整形・構文チェック（キーソート対応）',
    description:
      'YAMLをインデント整形・構文チェックできる無料ツールです。エラーは行・列つきで表示し、キーソートや複数ドキュメント（---）にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'YAML整形・構文チェックツール',
    introHtml:
      'インデントの揃っていないYAMLを読みやすく整形し、構文エラーは行・列つきで確認できます。キーの並べ替えや、1行に書かれた {a: 1} 形式のブロック展開にも対応します。JSONと相互に変換したい場合は <a href="/tools/yaml-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">YAML⇔JSON変換</a> をご利用ください。',
    inputLabel: '入力（YAML）',
    outputLabel: '結果',
    inputPlaceholder: 'server: {host: localhost, port: 8080}\nitems: [a, b]',
    indentLabel: 'インデント',
    indentOption2: '半角スペース2個',
    indentOption4: '半角スペース4個',
    sortKeysLabel: 'キーを昇順に並べ替える',
    expandFlowLabel: '{ } や [ ] をブロック形式に展開する',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'ダウンロード',
    syntaxErrorPrefix: '構文エラー',
    errorLocationTemplate: '{line}行目 {column}列目',
    errorDocumentTemplate: '{n}番目のドキュメント',
    errorExcerptLabel: '該当行',
    documentsTemplate: '{n}個のドキュメントを整形しました',
    notesHeading: '注意事項',
    notes: [
      'コメントは保持されますが、位置や空白は整形に合わせて調整されることがあります。',
      '長い文字列は折り返さず、そのまま1行で出力します。',
      '「キーを昇順に並べ替える」はネストしたマップにも適用されます。リスト（配列）の順序は変えません。',
      '複数ドキュメントは --- で区切って整形します。同じマップに同じキーが2つある場合は、エラーとして扱います。',
      'アンカー（&）とエイリアス（*）は展開せずそのまま保持します。構文チェックはYAMLとしての正しさの確認で、スキーマ検証は行いません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ブロック形式とフロー形式',
        description:
          'ブロック形式は改行とインデントで構造を表す書き方、フロー形式は {a: 1} や [x, y] のように括弧で1行に書く書き方です。',
      },
      {
        term: 'アンカーとエイリアス',
        description:
          '&名前 で値に目印を付け、*名前 で同じ値を別の場所から再利用する仕組みです。設定ファイルの重複を減らすのに使います。',
      },
      {
        term: '複数ドキュメント',
        description:
          '--- で区切って、1つのファイルに複数のYAMLを並べる書き方です。Kubernetesのマニフェストなどでよく使われます。',
      },
    ],
  },
  en: {
    title: 'YAML Formatter & Validator - Beautify, Sort Keys',
    description:
      'Format and validate YAML online with line and column error positions. Sort keys, handle multiple documents. Runs in your browser; nothing is uploaded.',
    h1: 'YAML Formatter & Validator',
    introHtml:
      'Tidy up messy YAML and find syntax errors with their line and column. You can also sort keys and expand inline {a: 1} style into block style. To convert to JSON, use the <a href="/en/tools/yaml-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">YAML ⇔ JSON Converter</a>.',
    inputLabel: 'Input (YAML)',
    outputLabel: 'Result',
    inputPlaceholder: 'server: {host: localhost, port: 8080}\nitems: [a, b]',
    indentLabel: 'Indent',
    indentOption2: '2 spaces',
    indentOption4: '4 spaces',
    sortKeysLabel: 'Sort keys alphabetically',
    expandFlowLabel: 'Expand { } and [ ] into block style',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Download',
    syntaxErrorPrefix: 'Syntax error',
    errorLocationTemplate: 'line {line}, column {column}',
    errorDocumentTemplate: 'document {n}',
    errorExcerptLabel: 'Line',
    documentsTemplate: 'Formatted {n} documents',
    notesHeading: 'Notes',
    notes: [
      'Comments are kept, but their position and spacing may be adjusted to fit the formatted layout.',
      'Long strings are not wrapped; they stay on a single line.',
      '"Sort keys alphabetically" applies to nested maps too. The order of list items is never changed.',
      'Multiple documents are separated with "---". A map that contains the same key twice is reported as an error.',
      'Anchors (&) and aliases (*) are kept as written, not expanded. The check covers YAML syntax only; it does not validate against a schema.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Block style vs. flow style',
        description:
          'Block style shows structure with line breaks and indentation; flow style writes it inline with brackets, such as {a: 1} or [x, y].',
      },
      {
        term: 'Anchor and alias',
        description:
          'An anchor (&name) labels a value and an alias (*name) reuses it elsewhere, which cuts repetition in config files.',
      },
      {
        term: 'Multiple documents',
        description:
          'One file can hold several YAML documents separated by "---", as is common in Kubernetes manifests.',
      },
    ],
  },
};
