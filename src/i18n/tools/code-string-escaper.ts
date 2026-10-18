import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CodeStringEscaperPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  languageLabel: string;
  languageShell: string;
  languageRegex: string;
  languageSql: string;
  languageSqlMysql: string;
  languageCsv: string;
  languageJson: string;
  directionLabel: string;
  directionEscape: string;
  directionUnescape: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  outputLabel: string;
  errorUnterminatedQuote: string;
  errorInvalidJson: string;
  errorInvalidCsv: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const codeStringEscaperContent: Record<
  Locale,
  CodeStringEscaperPageContent
> = {
  ja: {
    title: 'シェル・正規表現・SQL・CSV・JSON文字列エスケープ',
    description:
      'シェル（引用符）・正規表現・SQL・CSV・JSON文字列の特殊文字を、言語別にエスケープ・アンエスケープできる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'シェル・正規表現・SQL・CSV・JSON 文字列エスケープ／アンエスケープ',
    introHtml:
      'プログラミング言語や形式ごとに異なる引用符・特殊文字のエスケープを、ブラウザ上でまとめて変換できます。エスケープとアンエスケープの両方向に対応しています。HTMLやJavaScript文字列の変換は <a href="/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML/JS文字列エスケープ</a> を、URLの変換は <a href="/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URLエンコード/デコード</a> をご利用ください。',
    languageLabel: '対象',
    languageShell: 'シェル（単一引用符）',
    languageRegex: '正規表現',
    languageSql: "SQL（標準・''方式）",
    languageSqlMysql: 'SQL（MySQL・\\方式）',
    languageCsv: 'CSV',
    languageJson: 'JSON文字列',
    directionLabel: '変換方向',
    directionEscape: 'エスケープ',
    directionUnescape: 'アンエスケープ',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholder: '変換したいテキストを入力',
    sampleText: 'He said "it\'s $100, ok?" (a.b*c)\nline2',
    outputLabel: '結果',
    errorUnterminatedQuote: '引用符が閉じられていません。',
    errorInvalidJson:
      'JSON文字列として解釈できません。不正なエスケープや、エスケープされていない二重引用符・改行が含まれていないか確認してください。',
    errorInvalidCsv:
      'CSVフィールドとして解釈できません。二重引用符は「""」の2連続で表す必要があります。',
    notesHeading: '注意事項',
    notes: [
      'SQLのエスケープは学習・表示用です。本番のアプリケーションでは、文字列を連結せず、プレースホルダー（パラメータ化クエリ）を使ってください。エスケープだけではSQLインジェクションを完全には防げません。',
      '結果は文字列の中身に対する変換です。シェルは全体を単一引用符で囲みます。SQL・JSONは外側の引用符を付けないので、必要に応じて自分で囲んでください。',
      'シェルのエスケープはPOSIX sh・bash・zsh向けです。Windowsのコマンドプロンプトや PowerShell では規則が異なります。',
      "SQLの方式はデータベースで異なります。標準SQL・PostgreSQL・SQLiteなどは「''」方式、MySQLはバックスラッシュ方式も使えます（MySQLでもNO_BACKSLASH_ESCAPES設定時は「''」方式のみ）。",
      'CSVは入力全体を1つのフィールドとして扱います。カンマ・二重引用符・改行を含むときだけ二重引用符で囲みます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'エスケープ',
        description:
          '文字列の中で特別な意味を持つ文字（引用符、バックスラッシュ、正規表現のメタ文字など）を、ただの文字として扱わせるための書き換えです。方法は言語や形式ごとに異なります。',
      },
      {
        term: 'SQLインジェクション',
        description:
          '入力値がSQL文の一部として解釈されてしまい、意図しない命令を実行される攻撃です。根本的な対策は、値をSQL文と分けて渡すプレースホルダー（パラメータ化クエリ）を使うことです。',
      },
      {
        term: 'メタ文字',
        description:
          '正規表現で「任意の1文字」(.)や「0回以上の繰り返し」(*)のように、文字そのものではなく特別な機能を表す文字です。文字として検索したいときはバックスラッシュでエスケープします。',
      },
    ],
  },
  en: {
    title: 'Shell, Regex, SQL, CSV & JSON String Escape',
    description:
      'Escape and unescape strings for shell quoting, regular expressions, SQL, CSV and JSON. Runs in your browser; nothing is sent to a server.',
    h1: 'Shell, Regex, SQL, CSV & JSON String Escape / Unescape',
    introHtml:
      'Every language and format has its own rules for quotes and special characters. Convert text for the one you need, in either direction, right in your browser. For HTML and JavaScript strings, use the <a href="/en/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML/JS String Escape</a> tool. For URLs, try the <a href="/en/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URL Encoder/Decoder</a>.',
    languageLabel: 'Format',
    languageShell: 'Shell (single quotes)',
    languageRegex: 'Regular expression',
    languageSql: "SQL (standard, '' style)",
    languageSqlMysql: 'SQL (MySQL, backslash style)',
    languageCsv: 'CSV',
    languageJson: 'JSON string',
    directionLabel: 'Direction',
    directionEscape: 'Escape',
    directionUnescape: 'Unescape',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert',
    sampleText: 'He said "it\'s $100, ok?" (a.b*c)\nline2',
    outputLabel: 'Result',
    errorUnterminatedQuote: 'A quote is not closed.',
    errorInvalidJson:
      'This is not a valid JSON string. Check for invalid escapes, or unescaped double quotes and line breaks.',
    errorInvalidCsv:
      'This is not a valid CSV field. A double quote inside must be written as two double quotes ("").',
    notesHeading: 'Notes',
    notes: [
      'The SQL output is for learning and display only. In real applications, never build queries by string concatenation; use placeholders (parameterized queries). Escaping alone does not fully prevent SQL injection.',
      'The result converts the contents of a string. Shell output is wrapped in single quotes; SQL and JSON output has no surrounding quotes, so add them yourself if you need them.',
      'Shell escaping targets POSIX sh, bash and zsh. Windows Command Prompt and PowerShell follow different rules.',
      "SQL dialects differ. Standard SQL, PostgreSQL and SQLite use the '' style, while MySQL also accepts backslash escapes (unless NO_BACKSLASH_ESCAPES is on).",
      'CSV treats the whole input as a single field. It is wrapped in double quotes only when it contains a comma, a double quote or a line break.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Escaping',
        description:
          'Rewriting characters that have a special meaning inside a string (quotes, backslashes, regex metacharacters and so on) so they are treated as plain text. The method differs by language and format.',
      },
      {
        term: 'SQL injection',
        description:
          'An attack where input is interpreted as part of an SQL statement and runs unintended commands. The reliable defense is to pass values separately from the SQL using placeholders (parameterized queries).',
      },
      {
        term: 'Metacharacter',
        description:
          'A character with a special function in a regular expression, such as "." (any character) or "*" (zero or more repeats), rather than standing for itself. Escape it with a backslash to match it literally.',
      },
    ],
  },
};
