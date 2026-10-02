import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface CodeMinifierPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  languageLabel: string;
  languageOptions: SelectOption[];
  indentLabel: string;
  indentOptions: SelectOption[];
  minifyButton: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  /** `{message}` を置換して使うテンプレート */
  errorTemplate: string;
  /** set:html で描画する固定リテラルの注記 */
  footnoteHtml: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const codeMinifierContent: Record<Locale, CodeMinifierPageContent> = {
  ja: {
    title: 'CSS/JS/HTMLミニファイ＆整形ツール',
    description:
      'CSS・JavaScript・HTMLのコードをブラウザ上で整形・ミニファイ（圧縮）できる無料ツールです。インデント幅も指定可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS/JS/HTMLミニファイ＆整形ツール',
    introHtml:
      'CSS・JavaScript・HTMLのコードを入力すると自動で読みやすく整形して表示します。配信用にファイルサイズを小さくしたい場合は「ミニファイ」ボタンを使ってください。JSONを扱う場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
    languageLabel: '言語',
    languageOptions: [
      { value: 'css', label: 'CSS' },
      { value: 'javascript', label: 'JavaScript' },
      { value: 'html', label: 'HTML' },
    ],
    indentLabel: 'インデント幅',
    indentOptions: [
      { value: '2', label: '半角スペース2個' },
      { value: '4', label: '半角スペース4個' },
      { value: 'tab', label: 'タブ' },
    ],
    minifyButton: 'ミニファイ',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholder: '.a{color:red;margin:0}',
    outputLabel: '結果',
    errorTemplate:
      '構文エラー: {message}\n（内容: コードの構文に誤りがあります。括弧・引用符の対応や、選択した言語が入力内容に合っているかを確認してください。）',
    footnoteHtml:
      '※ CSSのミニファイは構文エラーがあっても例外を投げず、該当箇所を無視して処理する場合があります。想定と異なる結果になった場合は、整形結果で構文を確認してから再度お試しください。HTMLのミニファイはコメント除去とタグ間の空白圧縮のみを行い、<code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">&lt;style&gt;</code>・<code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">&lt;script&gt;</code>タグの中身はそのまま保持します（圧縮したい場合はCSS・JavaScriptとして個別に処理してください）。',
    notesHeading: '注意事項',
    notes: [
      '整形（Prettier）とミニファイ（CSSはcsso、JavaScriptはterser）は、対象の言語に合わせて処理されます。言語の選択が実際のコードと合っているか確認してください。',
      'ミニファイした結果は読みにくいため、元のコードは必ず別に保管してください。本番で不具合が出たときは、元のコードで原因を調べます。',
      '入力したコードはブラウザ内で処理され、サーバーには送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '整形（フォーマット）',
        description:
          'インデントや改行を整え、コードを人が読みやすい形に書き直すことです。このツールでは内部的にPrettierを使用しています。',
      },
      {
        term: 'ミニファイ',
        description:
          '改行・インデント・コメントなど実行に不要な部分を取り除き、コードのファイルサイズを小さくすることです。本番環境への配信前に行うのが一般的です。',
      },
    ],
  },
  en: {
    title: 'CSS/JS/HTML Minifier & Formatter',
    description:
      'Format and minify CSS, JavaScript, and HTML with a selectable indent width. Runs in your browser; nothing is sent to a server.',
    h1: 'CSS/JS/HTML Minifier & Formatter',
    introHtml:
      'Paste CSS, JavaScript, or HTML code to have it automatically formatted for readability. Click "Minify" to shrink it for production. To work with JSON, try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> as well.',
    languageLabel: 'Language',
    languageOptions: [
      { value: 'css', label: 'CSS' },
      { value: 'javascript', label: 'JavaScript' },
      { value: 'html', label: 'HTML' },
    ],
    indentLabel: 'Indent',
    indentOptions: [
      { value: '2', label: '2 spaces' },
      { value: '4', label: '4 spaces' },
      { value: 'tab', label: 'Tab' },
    ],
    minifyButton: 'Minify',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholder: '.a{color:red;margin:0}',
    outputLabel: 'Result',
    errorTemplate:
      'Syntax error: {message}\n(Check that parentheses and quotes are balanced, and that the selected language matches your code.)',
    footnoteHtml:
      'Note: minifying CSS does not throw on invalid syntax — it may silently skip the affected part instead. If the result looks unexpected, check the formatted output first to confirm the syntax is valid. Minifying HTML only strips comments and collapses whitespace between tags — the contents of <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">&lt;style&gt;</code> and <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">&lt;script&gt;</code> tags are kept as-is (switch to the CSS or JavaScript language to minify those separately).',
    notesHeading: 'Notes',
    notes: [
      'Formatting uses Prettier, and minifying uses csso for CSS and terser for JavaScript, chosen by the selected language. Make sure the language matches your code.',
      'Minified output is hard to read, so always keep the original source. If a problem appears in production, investigate with the original code.',
      'Your code is processed in the browser and is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Formatting',
        description:
          'Rewriting code with consistent indentation and line breaks so it is easier for humans to read. This tool uses Prettier internally.',
      },
      {
        term: 'Minify',
        description:
          "Stripping line breaks, indentation, and comments that are not needed at runtime to reduce a file's size, typically before shipping it to production.",
      },
    ],
  },
};
