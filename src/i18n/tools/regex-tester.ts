import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RegexTesterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  patternLabel: string;
  patternPlaceholder: string;
  flagILabel: string;
  flagMLabel: string;
  flagSLabel: string;
  flagULabel: string;
  globalNote: string;
  testInputLabel: string;
  testInputPlaceholder: string;
  /** `{message}` を置換して使うテンプレート */
  errorInvalidPatternTemplate: string;
  /** 正規表現の実行が制限時間内に終わらなかったときのメッセージ */
  errorTimeout: string;
  /** `{count}` を置換して使うテンプレート（1件の場合） */
  statusMatchSingularTemplate: string;
  /** `{count}` を置換して使うテンプレート（複数件の場合） */
  statusMatchPluralTemplate: string;
  highlightHeading: string;
  matchListHeading: string;
  columnIndexNumber: string;
  columnPosition: string;
  columnMatchedText: string;
  columnCaptureGroups: string;
  noGroups: string;
  noValue: string;
  replacementLabel: string;
  replacementPlaceholder: string;
  replacementPreviewHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const regexTesterContent: Record<Locale, RegexTesterPageContent> = {
  ja: {
    title: '正規表現テスター（マッチ確認・置換プレビュー）',
    description:
      '正規表現（Regular Expression）のパターンをブラウザ上でリアルタイムに検証できる無料ツールです。マッチ箇所のハイライト表示、キャプチャグループの一覧、置換結果のプレビューに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '正規表現テスター',
    introHtml:
      '正規表現のパターンとテスト対象の文字列を入力すると、マッチした箇所をハイライト表示し、キャプチャグループの内容も一覧で確認できます。置換パターンを指定すれば、置換後の結果もその場でプレビューできます。JavaScript（ECMAScript）の正規表現構文に対応しています。文字列そのものの変換であれば <a href="/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML/JS文字列エスケープ・アンエスケープ</a> もあわせてご利用ください。',
    patternLabel: '正規表現パターン',
    patternPlaceholder: '\\d+',
    flagILabel: 'i（大文字・小文字を区別しない）',
    flagMLabel: 'm（複数行モード：^ $ が各行の先頭・末尾にマッチ）',
    flagSLabel: 's（. が改行にもマッチ）',
    flagULabel: 'u（Unicodeモード）',
    globalNote:
      '※ すべてのマッチ箇所を表示するため、g（グローバル検索）は常に有効です。',
    testInputLabel: 'テスト対象の文字列',
    testInputPlaceholder: 'マッチを確認したいテキストを入力',
    errorInvalidPatternTemplate: '正規表現が不正です: {message}',
    errorTimeout:
      '処理に時間がかかりすぎたため中断しました。パターンが重い（バックトラッキングが多発する）可能性があります。(a+)+ のような入れ子の繰り返しを見直してください。',
    statusMatchSingularTemplate: '{count}件マッチしました。',
    statusMatchPluralTemplate: '{count}件マッチしました。',
    highlightHeading: 'マッチ箇所のハイライト表示',
    matchListHeading: 'マッチ結果の一覧',
    columnIndexNumber: '#',
    columnPosition: '位置',
    columnMatchedText: 'マッチ文字列',
    columnCaptureGroups: 'キャプチャグループ',
    noGroups: '-',
    noValue: '(なし)',
    replacementLabel: '置換パターン（任意）',
    replacementPlaceholder: '例: $2/$1',
    replacementPreviewHeading: '置換結果のプレビュー',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意点',
    notes: [
      '構文はJavaScript（ECMAScript）の正規表現に準拠します。他言語（PHP・Python・Java等）の正規表現とは一部記法が異なる場合があります。',
      'パターンが不正な場合や、危険なバックトラック（破滅的バックトラッキング）を招く複雑なパターンでは、ブラウザが一時的に固まる可能性があります。大きなテキストで試す際はご注意ください。',
      'すべての処理はブラウザ内で完結しており、入力したパターンやテキストがサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '正規表現（Regular Expression）',
        description:
          '文字列のパターンを表現するための記法です。「数字が1文字以上連続する箇所」「@を含むメールアドレスらしき文字列」のような条件を、`\\d+` や `[\\w.]+@[\\w.]+` といった短い記述で表せます。バリデーションや文字列の検索・置換に広く使われます。',
      },
      {
        term: 'フラグ',
        description:
          '正規表現の挙動を切り替えるオプションです。`i` は大文字・小文字を区別しない、`m` は複数行モード（`^` `$` が各行の先頭・末尾にマッチ）、`s` は `.` が改行にもマッチするモード、`u` はUnicodeモード（サロゲートペアや\\u{}記法を正しく扱う）を表します。',
      },
      {
        term: 'キャプチャグループ',
        description:
          'パターンの一部を `(...)` で囲むと、その部分にマッチした文字列を個別に取り出せます。`(\\d+)-(\\d+)` なら1つ目・2つ目の数字の並びをそれぞれ取得できます。`(?<name>...)` の形式で名前を付けたものは「名前付きキャプチャグループ」と呼ばれます。',
      },
      {
        term: '置換パターン',
        description:
          'マッチした文字列を置き換える際に使う書式です。`$1` `$2` でキャプチャグループを、`$<name>` で名前付きキャプチャグループを参照できます。例えば `(\\d+)-(\\d+)` に対して `$2/$1` と指定すると、順序を入れ替えて置換できます。',
      },
    ],
  },
  en: {
    title: 'Regex Tester (Match Checker & Replace Preview)',
    description:
      'Test regular expressions live: highlight matches, list capture groups, and preview replacements. Runs in your browser; nothing is sent to a server.',
    h1: 'Regex Tester',
    introHtml:
      'Enter a regular expression pattern and some test text to see every match highlighted, along with a list of any capture groups. Add a replacement pattern to preview the result of a replace operation instantly. This tool follows JavaScript (ECMAScript) regular expression syntax. For plain string transformations, also try the <a href="/en/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML/JS String Escape & Unescape</a> tool.',
    patternLabel: 'Regular expression pattern',
    patternPlaceholder: '\\d+',
    flagILabel: 'i (case-insensitive)',
    flagMLabel: 'm (multiline: ^ $ match start/end of each line)',
    flagSLabel: 's (. also matches newlines)',
    flagULabel: 'u (Unicode mode)',
    globalNote:
      '* The g (global) flag is always on so that every match can be shown.',
    testInputLabel: 'Test string',
    testInputPlaceholder: 'Enter the text you want to test matches against',
    errorInvalidPatternTemplate: 'Invalid regular expression: {message}',
    errorTimeout:
      'The match took too long and was stopped. The pattern may cause heavy backtracking; try avoiding nested repetition such as (a+)+.',
    statusMatchSingularTemplate: '{count} match found.',
    statusMatchPluralTemplate: '{count} matches found.',
    highlightHeading: 'Highlighted matches',
    matchListHeading: 'Match list',
    columnIndexNumber: '#',
    columnPosition: 'Index',
    columnMatchedText: 'Matched text',
    columnCaptureGroups: 'Capture groups',
    noGroups: '-',
    noValue: '(none)',
    replacementLabel: 'Replacement pattern (optional)',
    replacementPlaceholder: 'e.g. $2/$1',
    replacementPreviewHeading: 'Replacement preview',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Syntax follows JavaScript (ECMAScript) regular expressions, which differ in some details from other languages such as PHP, Python, or Java.',
      'An invalid pattern, or a complex pattern prone to catastrophic backtracking, may temporarily freeze the browser. Be careful when testing against large amounts of text.',
      'Everything runs entirely in your browser — the pattern and text you enter are never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Regular expression',
        description:
          'A notation for describing patterns in text, such as "one or more digits in a row" or "something that looks like an email address containing @". Short expressions like `\\d+` or `[\\w.]+@[\\w.]+` can capture these conditions. Widely used for validation and for searching or replacing text.',
      },
      {
        term: 'Flags',
        description:
          'Options that change how a regular expression behaves. `i` makes matching case-insensitive, `m` enables multiline mode (so `^` and `$` match the start/end of each line), `s` makes `.` also match newlines, and `u` enables Unicode mode (correct handling of surrogate pairs and `\\u{}` escapes).',
      },
      {
        term: 'Capture group',
        description:
          'Wrapping part of a pattern in `(...)` lets you extract just that matched portion. For example, `(\\d+)-(\\d+)` captures the first and second runs of digits separately. A group written as `(?<name>...)` is called a "named capture group".',
      },
      {
        term: 'Replacement pattern',
        description:
          'The syntax used to build the replacement text for a match. `$1`, `$2` refer to capture groups by position, and `$<name>` refers to a named capture group. For example, replacing matches of `(\\d+)-(\\d+)` with `$2/$1` swaps the two numbers around.',
      },
    ],
  },
};
