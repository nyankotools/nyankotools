import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface EnvJsonConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeAriaLabel: string;
  modeEnvToJson: string;
  modeJsonToEnv: string;
  indentLabel: string;
  indentOption2: string;
  indentOption4: string;
  parseValuesLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholderEnvToJson: string;
  inputPlaceholderJsonToEnv: string;
  syntaxErrorPrefix: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const envJsonConverterContent: Record<
  Locale,
  EnvJsonConverterPageContent
> = {
  ja: {
    title: '.env⇔JSON変換',
    description:
      '.env（環境変数ファイル）とJSONを相互に変換できる無料ツールです。コメント・export・引用符つきの値にも対応し、不正な行は行番号つきで表示。APIキーなどの値もブラウザ内で処理され、サーバーには送信されません。',
    h1: '.env⇔JSON変換ツール',
    introHtml:
      '.envファイルの内容を入力するとJSONに、JSONを入力すると.env形式に変換します。環境変数をCI/CDの設定やクラウドの管理画面へ移す時などに便利です。YAML形式が必要な場合は <a href="/tools/yaml-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">YAML⇔JSON変換</a> もご利用ください。',
    modeAriaLabel: '変換方向',
    modeEnvToJson: '.env→JSON',
    modeJsonToEnv: 'JSON→.env',
    indentLabel: 'インデント幅',
    indentOption2: '半角スペース2個',
    indentOption4: '半角スペース4個',
    parseValuesLabel: '数値・true/falseをJSONの型に変換する',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    outputLabel: '結果',
    inputPlaceholderEnvToJson:
      '# 例\nPORT=3000\nDEBUG=true\nGREETING="Hello World"',
    inputPlaceholderJsonToEnv:
      '{"PORT": 3000, "DEBUG": true, "GREETING": "Hello World"}',
    syntaxErrorPrefix: '構文エラー',
    notesHeading: '注意事項',
    notes: [
      '.envでは # から始まる行と、引用符のない値の「 #」以降はコメントとして無視されるため、JSONには含まれません。',
      'ダブルクォートの値は \\n・\\t・\\" などのエスケープを解釈し、シングルクォートの値は中身をそのまま扱います。引用符で囲めば複数行の値も読み込めます。',
      '同じキーが複数ある場合は、後に書かれた値が使われます。',
      'JSON→.envでは、値が文字列・数値・真偽値・nullのフラットなオブジェクトのみ変換できます。ネストしたオブジェクトや配列はエラーになります。',
      '既定では値をすべて文字列として扱います（0123のような値を保つため）。チェックを入れると数値・true/falseをJSONの型に変換します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '.env',
        description:
          'KEY=VALUE の形式で環境変数を1行ずつ書くテキストファイルです。APIキーやデータベース接続先などの設定をコードから分離して管理するために使われます。',
      },
      {
        term: '環境変数',
        description:
          'OSやプロセスに渡す設定値のことです。アプリの動作を、コードを書き換えずに環境ごとに切り替えるために使います。',
      },
      {
        term: 'JSON',
        description:
          'JavaScript Object Notation の略で、データをキーと値の組み合わせで表現するテキスト形式です。',
      },
    ],
  },
  en: {
    title: '.env to JSON Converter',
    description:
      'Convert between .env files and JSON online, with comments and quoted values handled. Runs in your browser, so secrets are never sent to a server.',
    h1: '.env ⇔ JSON Converter',
    introHtml:
      'Paste the contents of a .env file to convert it to JSON, or paste JSON to get .env lines — handy when moving environment variables into CI/CD settings or a cloud dashboard. If you need YAML, try the <a href="/en/tools/yaml-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">YAML ⇔ JSON Converter</a>.',
    modeAriaLabel: 'Direction',
    modeEnvToJson: '.env→JSON',
    modeJsonToEnv: 'JSON→.env',
    indentLabel: 'Indent',
    indentOption2: '2 spaces',
    indentOption4: '4 spaces',
    parseValuesLabel: 'Convert numbers and true/false to JSON types',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    outputLabel: 'Result',
    inputPlaceholderEnvToJson:
      '# Example\nPORT=3000\nDEBUG=true\nGREETING="Hello World"',
    inputPlaceholderJsonToEnv:
      '{"PORT": 3000, "DEBUG": true, "GREETING": "Hello World"}',
    syntaxErrorPrefix: 'Syntax error',
    notesHeading: 'Notes',
    notes: [
      'Lines starting with # and anything after " #" in an unquoted value are treated as comments and are not included in the JSON.',
      'Double-quoted values interpret escapes such as \\n, \\t and \\", while single-quoted values are taken literally. Quoted values may span several lines.',
      'If a key appears more than once, the last value wins.',
      'JSON→.env only supports a flat object whose values are strings, numbers, booleans, or null. Nested objects and arrays are reported as errors.',
      'By default all values stay strings (to keep values like 0123). Check the box to convert numbers and true/false to JSON types.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: '.env',
        description:
          'A text file that lists environment variables as KEY=VALUE lines. It keeps settings such as API keys and database URLs separate from your code.',
      },
      {
        term: 'Environment variable',
        description:
          'A setting passed to a process by the operating system. It lets an app behave differently per environment without changing its code.',
      },
      {
        term: 'JSON',
        description:
          'Short for JavaScript Object Notation, a text format for representing data as key-value pairs.',
      },
    ],
  },
};
