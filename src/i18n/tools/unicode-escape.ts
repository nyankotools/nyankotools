import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface UnicodeEscapePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeEscape: string;
  modeUnescape: string;
  formatLabel: string;
  formatOptions: SelectOption[];
  scopeLabel: string;
  scopeOptions: SelectOption[];
  uppercaseLabel: string;
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

export const unicodeEscapeContent: Record<Locale, UnicodeEscapePageContent> = {
  ja: {
    title: 'Unicodeエスケープ変換（\\uXXXX ⇔ 文字）',
    description:
      '日本語などの文字を \\u3042 のようなUnicodeエスケープに変換、またはその逆に戻せる無料ツールです。JavaScript・ES6・Python・U+表記・HTML数値参照に対応し、絵文字（サロゲートペア）も正しく処理します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Unicodeエスケープ変換（\\uXXXX ⇔ 文字）',
    introHtml:
      '文字を <code>\\u3042</code> のようなUnicodeエスケープに変換したり、エスケープされた文字列を元の文字に戻したりできます。JSONやJavaScriptのソース、ログに出てくる「\\u65e5\\u672c\\u8a9e」のような文字列の確認に便利です。HTMLの特殊文字（&amp; や &lt;）の変換は <a href="/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML/JS文字列エスケープ</a>、URL用のパーセントエンコードは <a href="/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URLエンコード/デコード</a> をご利用ください。',
    modeLabel: '変換方向',
    modeEscape: '文字 → エスケープ',
    modeUnescape: 'エスケープ → 文字',
    formatLabel: 'エスケープ形式',
    formatOptions: [
      { value: 'js', label: 'JavaScript / JSON（\\uXXXX）' },
      { value: 'es6', label: 'ES6（\\u{XXXXX}）' },
      { value: 'python', label: 'Python（\\uXXXX / \\UXXXXXXXX）' },
      { value: 'codepoint', label: 'コードポイント（U+XXXX）' },
      { value: 'html-hex', label: 'HTML数値参照 16進（&#xXXXX;）' },
      { value: 'html-dec', label: 'HTML数値参照 10進（&#NNNNN;）' },
    ],
    scopeLabel: '変換する文字',
    scopeOptions: [
      { value: 'non-ascii', label: 'ASCII以外のみ' },
      { value: 'all', label: 'すべての文字' },
    ],
    uppercaseLabel: '16進数を大文字にする',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholder: '変換したいテキストを入力',
    sampleText: 'Hello こんにちは 😀',
    outputLabel: '結果',
    notesHeading: '注意事項',
    notes: [
      '「エスケープ → 文字」では、\\uXXXX・\\u{...}・\\UXXXXXXXX・\\xXX・U+XXXX・HTML数値参照（&#x...; / &#...;）を形式の指定なしで自動的に判別して元に戻します。',
      'JavaScript形式では、絵文字などBMP外の文字は \\uD83D\\uDE00 のようにサロゲートペア（2つの \\u）になります。ES6形式なら \\u{1F600} の1つで表せます。',
      'バックスラッシュが2つ続く「\\\\u3042」は、バックスラッシュ自体のエスケープとして扱い、展開しません。',
      '\\n や \\" などの一般的なエスケープシーケンスは対象外です。これらは「HTML/JS文字列エスケープ」で変換できます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Unicodeエスケープ',
        description:
          'ソースコードやJSONの中で、文字をコードポイントの16進数で書き表す記法です。\\u3042 は「あ」を表します。ファイルの文字コードや環境に左右されず、ASCII文字だけで任意の文字を表せるのが利点です。',
      },
      {
        term: 'サロゲートペア',
        description:
          'UTF-16で、U+FFFFを超える文字（絵文字や一部の漢字など）を表すために使う、2つの16ビット値の組です。JavaScriptの \\uD83D\\uDE00 は、この2つで「😀」を表します。',
      },
      {
        term: 'コードポイント',
        description:
          'Unicodeで各文字に割り当てられた番号です。「あ」ならU+3042のように、「U+」に16進数を続けて書きます。',
      },
    ],
  },
  en: {
    title: 'Unicode Escape & Unescape (\\uXXXX to Text)',
    description:
      'Convert text to Unicode escapes (\\u3042, U+3042, &#x3042;) and back, with emoji support. Runs in your browser; nothing is sent to a server.',
    h1: 'Unicode Escape / Unescape (\\uXXXX to Text and Back)',
    introHtml:
      'Turn text into Unicode escapes such as <code>\\u3042</code>, or decode escaped strings back into readable characters. Handy for reading JSON, JavaScript source, or logs full of sequences like "\\u65e5\\u672c\\u8a9e". For HTML entities (&amp; and &lt;) use the <a href="/en/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML/JS String Escape</a> tool, and for percent-encoding use the <a href="/en/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URL Encoder/Decoder</a>.',
    modeLabel: 'Direction',
    modeEscape: 'Text → Escape',
    modeUnescape: 'Escape → Text',
    formatLabel: 'Escape format',
    formatOptions: [
      { value: 'js', label: 'JavaScript / JSON (\\uXXXX)' },
      { value: 'es6', label: 'ES6 (\\u{XXXXX})' },
      { value: 'python', label: 'Python (\\uXXXX / \\UXXXXXXXX)' },
      { value: 'codepoint', label: 'Code point (U+XXXX)' },
      { value: 'html-hex', label: 'HTML numeric, hex (&#xXXXX;)' },
      { value: 'html-dec', label: 'HTML numeric, decimal (&#NNNNN;)' },
    ],
    scopeLabel: 'Characters to convert',
    scopeOptions: [
      { value: 'non-ascii', label: 'Non-ASCII only' },
      { value: 'all', label: 'All characters' },
    ],
    uppercaseLabel: 'Uppercase hex digits',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert',
    sampleText: 'Hello こんにちは 😀',
    outputLabel: 'Result',
    notesHeading: 'Notes',
    notes: [
      'In "Escape → Text" mode, \\uXXXX, \\u{...}, \\UXXXXXXXX, \\xXX, U+XXXX and HTML numeric references (&#x...; / &#...;) are detected automatically, so no format needs to be chosen.',
      'In JavaScript format, characters outside the BMP such as emoji become surrogate pairs like \\uD83D\\uDE00 (two \\u escapes). ES6 format writes the same character as a single \\u{1F600}.',
      'A doubled backslash, as in "\\\\u3042", is treated as an escaped backslash and is not expanded.',
      'Common sequences such as \\n and \\" are not handled here; use the HTML/JS String Escape tool for those.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Unicode escape',
        description:
          'A notation used in source code and JSON that writes a character as its code point in hexadecimal. \\u3042 stands for "あ". It lets plain ASCII text represent any character regardless of the file encoding.',
      },
      {
        term: 'Surrogate pair',
        description:
          'A pair of 16-bit values that UTF-16 uses to represent characters above U+FFFF, such as emoji and some rare kanji. In JavaScript, \\uD83D\\uDE00 is the pair that stands for "😀".',
      },
      {
        term: 'Code point',
        description:
          'The number Unicode assigns to each character. It is written as "U+" followed by hex digits, for example U+3042 for "あ".',
      },
    ],
  },
};
