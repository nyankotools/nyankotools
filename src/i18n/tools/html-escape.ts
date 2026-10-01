import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HtmlEscapePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeHtmlEscape: string;
  modeHtmlUnescape: string;
  modeJsEscape: string;
  modeJsUnescape: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  outputLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const htmlEscapeContent: Record<Locale, HtmlEscapePageContent> = {
  ja: {
    title: 'HTML/JS文字列エスケープ・アンエスケープ',
    description:
      'HTMLの特殊文字（& < > " \'）やJavaScript文字列内の改行・クォートなどを、エスケープ・アンエスケープ変換できる無料ツールです。XSS対策やコード生成時の文字列組み立てに便利。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'HTML/JavaScript文字列 エスケープ・アンエスケープ',
    introHtml:
      '入力したテキストをHTMLの特殊文字（&amp; &lt; &gt; &quot; \'）としてエスケープしたり、実体参照から元の文字列に戻したりできます。JavaScriptの文字列リテラルに埋め込みたい場合は「JS文字列エスケープ」を選んでください。URLに含める文字列の変換が必要な場合は <a href="/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URLエンコード/デコード</a> もあわせてご利用ください。',
    modeLabel: '変換モード',
    modeHtmlEscape: 'HTMLエスケープ',
    modeHtmlUnescape: 'HTMLアンエスケープ',
    modeJsEscape: 'JS文字列エスケープ',
    modeJsUnescape: 'JS文字列アンエスケープ',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholder: '変換したいテキストを入力',
    sampleText: '<a href="https://example.com/?a=1&b=2">Tom & Jerry</a>',
    outputLabel: '結果',
    notesHeading: '注意事項',
    notes: [
      'HTMLエスケープは、&・<・>・"・\'の5文字を対象にしています。それ以外の文字はそのまま出力されます。',
      'エスケープは画面表示のためのものであり、それだけですべてのセキュリティ対策になるわけではありません。表示する場所（HTML本文・属性・JavaScript・URL）に応じた処理が必要です。',
      'JS文字列エスケープは、JavaScriptの文字列リテラルに埋め込むための変換です。HTMLの実体参照とは別のものです。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'HTMLエスケープ',
        description:
          '「&」「<」「>」「"」「\'」などHTMLで特別な意味を持つ文字を、そのまま文字として表示されるように実体参照（&amp;や&lt;など）に変換することです。ユーザー入力をHTMLに埋め込む際のXSS（クロスサイトスクリプティング）対策としても使われます。',
      },
      {
        term: 'JavaScript文字列エスケープ',
        description:
          'JavaScriptの文字列リテラル（\'...\'や"..."で囲まれた文字列）の中で、改行やクォート、バックスラッシュなどをそのまま含められるように、バックスラッシュ付きの記法（\\nや\\"など）に変換することです。',
      },
    ],
  },
  en: {
    title: 'HTML/JS String Escape & Unescape',
    description:
      'Escape or unescape HTML special characters and JavaScript string escapes, handy for XSS prevention. Runs in your browser; nothing is sent to a server.',
    h1: 'HTML / JavaScript String Escape & Unescape',
    introHtml:
      'Escape your text as HTML special characters (&amp; &lt; &gt; &quot; \') or convert character references back to the original text. Choose "JS String Escape" to embed the text inside a JavaScript string literal instead. Need to convert a string for use in a URL? Try the <a href="/en/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URL Encoder/Decoder</a>.',
    modeLabel: 'Mode',
    modeHtmlEscape: 'HTML Escape',
    modeHtmlUnescape: 'HTML Unescape',
    modeJsEscape: 'JS String Escape',
    modeJsUnescape: 'JS String Unescape',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert',
    sampleText: '<a href="https://example.com/?a=1&b=2">Tom & Jerry</a>',
    outputLabel: 'Result',
    notesHeading: 'Notes',
    notes: [
      'HTML escaping covers five characters: &, <, >, " and \'. Everything else is output as is.',
      'Escaping alone is not a complete security measure. The correct handling depends on where the text is inserted: HTML body, attribute, JavaScript or URL.',
      'JS string escape is meant for embedding text in JavaScript string literals and is different from HTML entities.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'HTML escaping',
        description:
          'Converting characters that have special meaning in HTML ("&", "<", ">", \'"\', and "\'") into character references (such as &amp; or &lt;) so they display as literal text. It is also a common defense against XSS (cross-site scripting) when embedding user input into HTML.',
      },
      {
        term: 'JavaScript string escaping',
        description:
          'Converting characters such as newlines, quotes, and backslashes into backslash-prefixed sequences (like \\n or \\") so they can safely appear inside a JavaScript string literal (\'...\' or "...").',
      },
    ],
  },
};
