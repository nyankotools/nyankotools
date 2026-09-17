import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface SqlFormatterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dialectLabel: string;
  dialectOptions: SelectOption[];
  indentLabel: string;
  indentOptions: SelectOption[];
  keywordCaseLabel: string;
  keywordCaseOptions: SelectOption[];
  minifyButton: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  /** `{message}` を置換して使うテンプレート */
  errorTemplate: string;
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const sqlFormatterContent: Record<Locale, SqlFormatterPageContent> = {
  ja: {
    title: 'SQL整形',
    description:
      'SQLクエリをブラウザ上で整形・ミニファイ（圧縮）できる無料ツールです。MySQL・PostgreSQL・SQLite・BigQuery等の方言、インデント幅、キーワードの大文字/小文字に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'SQL整形・ミニファイツール',
    introHtml:
      'SQLクエリを入力すると自動で読みやすく整形して表示します。方言・インデント幅・キーワードの大文字/小文字を指定可能。1行に圧縮したい場合は「ミニファイ」ボタンを使ってください。整形結果をさらにJSONとして確認したい場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
    dialectLabel: 'SQL方言',
    dialectOptions: [
      { value: 'sql', label: '標準SQL' },
      { value: 'mysql', label: 'MySQL' },
      { value: 'mariadb', label: 'MariaDB' },
      { value: 'postgresql', label: 'PostgreSQL' },
      { value: 'sqlite', label: 'SQLite' },
      { value: 'bigquery', label: 'BigQuery' },
      { value: 'transactsql', label: 'SQL Server（T-SQL）' },
      { value: 'plsql', label: 'Oracle（PL/SQL）' },
    ],
    indentLabel: 'インデント幅',
    indentOptions: [
      { value: '2', label: '半角スペース2個' },
      { value: '4', label: '半角スペース4個' },
      { value: 'tab', label: 'タブ' },
    ],
    keywordCaseLabel: 'キーワード',
    keywordCaseOptions: [
      { value: 'upper', label: '大文字（SELECT）' },
      { value: 'lower', label: '小文字（select）' },
      { value: 'preserve', label: 'そのまま' },
    ],
    minifyButton: 'ミニファイ',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholder: 'select id, name from users where age > 20 order by id',
    outputLabel: '結果',
    errorTemplate:
      '構文エラー: {message}\n（内容: SQLの構文に誤りがあります。括弧・引用符の対応や、選択したSQL方言が入力内容に合っているかを確認してください。）',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'SQL方言（dialect）',
        description:
          'MySQL・PostgreSQL・SQLiteなど、データベース製品ごとに存在する構文・記法の違いのことです。識別子の引用符（`や"）などが方言によって異なるため、整形時に指定すると崩れにくくなります。',
      },
      {
        term: 'ミニファイ',
        description:
          '改行・インデント・コメントを取り除き、SQLを1行の最小限の空白だけで表現することです。ログやコードへの埋め込みなど、行数を減らしたい場面で使います。',
      },
      {
        term: 'キーワードの大文字/小文字',
        description:
          'SELECT・FROM・WHEREなどのSQL予約語を大文字・小文字・入力したまま（そのまま）のどれで表示するかの設定です。',
      },
    ],
  },
  en: {
    title: 'SQL Formatter',
    description:
      'Free online tool to format and minify SQL queries right in your browser. Supports MySQL, PostgreSQL, SQLite, BigQuery and other dialects, plus indent width and keyword case options. Your data is processed in the browser and never sent to a server.',
    h1: 'SQL Formatter & Minifier',
    introHtml:
      'Paste a SQL query to have it automatically formatted for readability. Choose the dialect, indent width, and keyword case. Click "Minify" to collapse it back to a single line. To further inspect the result as JSON, try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> as well.',
    dialectLabel: 'Dialect',
    dialectOptions: [
      { value: 'sql', label: 'Standard SQL' },
      { value: 'mysql', label: 'MySQL' },
      { value: 'mariadb', label: 'MariaDB' },
      { value: 'postgresql', label: 'PostgreSQL' },
      { value: 'sqlite', label: 'SQLite' },
      { value: 'bigquery', label: 'BigQuery' },
      { value: 'transactsql', label: 'SQL Server (T-SQL)' },
      { value: 'plsql', label: 'Oracle (PL/SQL)' },
    ],
    indentLabel: 'Indent',
    indentOptions: [
      { value: '2', label: '2 spaces' },
      { value: '4', label: '4 spaces' },
      { value: 'tab', label: 'Tab' },
    ],
    keywordCaseLabel: 'Keyword case',
    keywordCaseOptions: [
      { value: 'upper', label: 'Uppercase (SELECT)' },
      { value: 'lower', label: 'Lowercase (select)' },
      { value: 'preserve', label: 'Preserve' },
    ],
    minifyButton: 'Minify',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholder: 'select id, name from users where age > 20 order by id',
    outputLabel: 'Result',
    errorTemplate:
      'Syntax error: {message}\n(Check that parentheses and quotes are balanced, and that the selected SQL dialect matches your query.)',
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'SQL dialect',
        description:
          'Syntax differences between database products such as MySQL, PostgreSQL, and SQLite — for example, the quote character used for identifiers (` or ") — so choosing the right dialect keeps formatting accurate.',
      },
      {
        term: 'Minify',
        description:
          'Stripping line breaks, indentation, and comments so a SQL query is represented on a single line with minimal whitespace — useful when embedding a query in logs or code.',
      },
      {
        term: 'Keyword case',
        description:
          'Whether reserved words like SELECT, FROM, and WHERE are shown in uppercase, lowercase, or left exactly as typed.',
      },
    ],
  },
};
