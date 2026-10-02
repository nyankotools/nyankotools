import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface IndentOption {
  value: string;
  label: string;
}

interface ErrorExplanation {
  /** RegExp のソース文字列（new RegExp() に渡す） */
  pattern: string;
  explanation: string;
}

export interface JsonFormatterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  indentLabel: string;
  indentOptions: IndentOption[];
  minify: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  outputLabel: string;
  /** {message} は元のJSON.parseエラーメッセージ、{explanation} はerrorExplanationsから解決した補足説明に置換される */
  errorTemplate: string;
  errorExplanations: ErrorExplanation[];
  errorExplanationFallback: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const jsonFormatterContent: Record<Locale, JsonFormatterPageContent> = {
  ja: {
    title: 'JSON整形',
    description:
      'JSONデータをブラウザ上で整形・圧縮・検証できる無料ツールです。構文エラーの内容も分かりやすく表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JSON整形・検証ツール',
    introHtml:
      'JSONを入力すると自動で整形して表示します。構文エラーがある場合はエラー内容を表示します。テキストの文字数を数えたい場合は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もあわせてご利用ください。',
    indentLabel: 'インデント幅',
    indentOptions: [
      { value: '2', label: '半角スペース2個' },
      { value: '4', label: '半角スペース4個' },
      { value: 'tab', label: 'タブ' },
    ],
    minify: '圧縮',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    outputLabel: '結果',
    errorTemplate: '構文エラー: {message}\n{explanation}',
    errorExplanations: [
      {
        pattern: 'Unexpected end of (JSON input|input)',
        explanation:
          '（内容: 入力が途中で終わっています。閉じ括弧（} や ]）や引用符の閉じ忘れがないか確認してください。）',
      },
      {
        pattern: 'Unexpected non-whitespace character',
        explanation:
          '（内容: JSONの末尾に余分な文字があります。閉じ括弧の後ろに不要な文字が入っていないか確認してください。）',
      },
      {
        pattern: 'Expected double-quoted property name',
        explanation:
          '（内容: プロパティ名はダブルクォート(")で囲む必要があります。）',
      },
      {
        pattern: 'Unterminated string',
        explanation:
          '（内容: 文字列が閉じられていません。引用符(")の閉じ忘れがないか確認してください。）',
      },
      {
        pattern: 'Bad control character',
        explanation:
          '（内容: 文字列内に使用できない制御文字が含まれています。）',
      },
      {
        pattern: 'Unexpected token',
        explanation:
          '（内容: 予期しない記号があります。末尾の余分なカンマや、括弧・引用符の閉じ忘れがないか確認してください。）',
      },
    ],
    errorExplanationFallback:
      '（内容: JSONの構文に誤りがあります。カンマ・括弧・引用符の対応を確認してください。）',
    notesHeading: '注意事項',
    notes: [
      'JSONの仕様では、末尾のカンマ・シングルクォート・コメントは使えません。これらが含まれていると構文エラーになります。',
      'JavaScriptの数値の精度（約15〜17桁）を超える整数は、整形時に丸められることがあります。桁数の多いIDなどは文字列として扱うことをおすすめします。',
      '入力したJSONはブラウザ内で処理され、サーバーには送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'JSON',
        description:
          'JavaScript Object Notation の略で、データをキーと値の組み合わせで表現するテキスト形式です。APIのやり取りや設定ファイルなど、幅広い場面で使われています。',
      },
      {
        term: '構文エラー（シンタックスエラー）',
        description:
          'JSONのルール（括弧・カンマ・引用符の対応など）に違反した記述があるときに発生するエラーです。多くの場合、閉じ忘れた括弧や末尾の余分なカンマが原因です。',
      },
    ],
  },
  en: {
    title: 'Free JSON Formatter',
    description:
      'Format, minify, and validate JSON with clear syntax error messages. Runs in your browser; nothing is sent to a server.',
    h1: 'JSON Formatter & Validator',
    introHtml:
      'Paste JSON below to automatically format it. Any syntax error is shown with a clear message. Need to count characters in text instead? Try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a>.',
    indentLabel: 'Indent',
    indentOptions: [
      { value: '2', label: '2 spaces' },
      { value: '4', label: '4 spaces' },
      { value: 'tab', label: 'Tab' },
    ],
    minify: 'Minify',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    outputLabel: 'Result',
    errorTemplate: 'Syntax error: {message}\n{explanation}',
    errorExplanations: [
      {
        pattern: 'Unexpected end of (JSON input|input)',
        explanation:
          '(Hint: the input ends unexpectedly. Check for a missing closing bracket (} or ]) or quotation mark.)',
      },
      {
        pattern: 'Unexpected non-whitespace character',
        explanation:
          '(Hint: there is extra text at the end of the JSON. Check for stray characters after the closing bracket.)',
      },
      {
        pattern: 'Expected double-quoted property name',
        explanation:
          '(Hint: property names must be wrapped in double quotes (").)',
      },
      {
        pattern: 'Unterminated string',
        explanation:
          '(Hint: a string is not closed. Check for a missing closing quotation mark (").)',
      },
      {
        pattern: 'Bad control character',
        explanation:
          '(Hint: a string contains a control character that is not allowed.)',
      },
      {
        pattern: 'Unexpected token',
        explanation:
          '(Hint: there is an unexpected symbol. Check for a trailing comma or a missing bracket or quotation mark.)',
      },
    ],
    errorExplanationFallback:
      '(Hint: the JSON syntax is invalid. Check that commas, brackets, and quotes are paired correctly.)',
    notesHeading: 'Notes',
    notes: [
      'JSON does not allow trailing commas, single quotes or comments. Including any of them causes a syntax error.',
      "Integers beyond JavaScript's numeric precision (about 15 to 17 digits) may be rounded when formatted. Store long IDs as strings.",
      'Your JSON is processed in the browser and is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'JSON',
        description:
          'Short for JavaScript Object Notation, a text format for representing data as key-value pairs. It is widely used for APIs and configuration files.',
      },
      {
        term: 'Syntax error',
        description:
          "An error that occurs when JSON's rules (matching brackets, commas, quotes, etc.) are violated. It's usually caused by a missing closing bracket or a trailing comma.",
      },
    ],
  },
};
