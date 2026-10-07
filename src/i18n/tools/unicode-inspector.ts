import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UnicodeInspectorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  modeLabel: string;
  modeInspect: string;
  modeLookup: string;
  copyCodePoints: string;
  copyText: string;
  copied: string;
  copyFailed: string;
  inputLabelInspect: string;
  inputLabelLookup: string;
  placeholderInspect: string;
  placeholderLookup: string;
  sampleInspect: string;
  sampleLookup: string;
  outputLabel: string;
  statCodePoints: string;
  statGraphemes: string;
  statUtf16: string;
  statUtf8: string;
  colChar: string;
  colCodePoint: string;
  colUtf8: string;
  colUtf16: string;
  colCategory: string;
  colScript: string;
  colBlock: string;
  colName: string;
  invisible: string;
  flagEmoji: string;
  flagJoiner: string;
  truncated: string;
  /** {tokens} を解釈できなかった入力に置換する */
  invalidFormat: string;
  empty: string;
  categoryLabels: Record<string, string>;
  tableLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const unicodeInspectorContent: Record<
  Locale,
  UnicodeInspectorPageContent
> = {
  ja: {
    title: 'Unicodeコードポイント検索（文字⇔U+XXXX・UTF-8/UTF-16）',
    description:
      '文字からUnicodeコードポイント・UTF-8/UTF-16のバイト列・カテゴリ・スクリプトを調べ、U+3042 などのコードポイントから文字を逆引きできる無料ツールです。絵文字や結合文字はコードポイント単位に分解して表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Unicodeコードポイント検索（文字⇔コードポイント）',
    introHtml:
      '文字を貼り付けると、1コードポイントごとに <code>U+XXXX</code>・UTF-8/UTF-16のバイト列・一般カテゴリ・スクリプト・ブロックを一覧表示します。サロゲートペアや結合文字、ZWJでつながった絵文字も分解して確認できます。逆に <code>U+3042</code> のようなコードポイントを入力して文字を調べることも可能です。エスケープ形式への変換は <a href="/tools/unicode-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unicodeエスケープ変換</a>、記号探しは <a href="/tools/special-char-list/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">特殊文字・絵文字一覧</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「変換方向」で「文字 → コードポイント」か「コードポイント → 文字」を選びます。',
      '調べたい文字、またはU+XXXXのコードポイントを入力します（結果は入力と同時に更新されます）。',
      '一覧でバイト列・カテゴリ・スクリプトなどを確認し、必要なら「コードポイントをコピー」を押します。',
    ],
    modeLabel: '変換方向',
    modeInspect: '文字 → コードポイント',
    modeLookup: 'コードポイント → 文字',
    copyCodePoints: 'コードポイントをコピー',
    copyText: '文字をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabelInspect: '調べたい文字',
    inputLabelLookup: 'コードポイント（スペース・カンマ・改行区切り）',
    placeholderInspect: '例: あ😀é',
    placeholderLookup: '例: U+3042 U+1F600 0x41',
    sampleInspect: 'あA😀é👨‍👩‍👧',
    sampleLookup: 'U+3042 U+1F600 0x41 \\u{1F431}',
    outputLabel: '文字の情報',
    statCodePoints: 'コードポイント数',
    statGraphemes: '見た目の文字数',
    statUtf16: 'UTF-16コードユニット',
    statUtf8: 'UTF-8バイト数',
    colChar: '文字',
    colCodePoint: 'コードポイント',
    colUtf8: 'UTF-8',
    colUtf16: 'UTF-16',
    colCategory: 'カテゴリ',
    colScript: 'スクリプト',
    colBlock: 'ブロック',
    colName: '名称',
    invisible: '（不可視）',
    flagEmoji: '絵文字',
    flagJoiner: '結合・修飾',
    truncated: '文字数が多いため、先頭2,000コードポイントのみ表示しています。',
    invalidFormat: '解釈できなかった入力: {tokens}',
    empty: '文字またはコードポイントを入力すると、ここに一覧が表示されます。',
    categoryLabels: {
      Lu: '英大文字',
      Ll: '英小文字',
      Lt: 'タイトルケース文字',
      Lm: '修飾文字',
      Lo: 'その他の文字（かな・漢字など）',
      Mn: '結合文字（幅なし）',
      Mc: '結合文字（幅あり）',
      Me: '囲み結合文字',
      Nd: '10進数字',
      Nl: '文字数字',
      No: 'その他の数',
      Pc: '連結用句読点',
      Pd: 'ダッシュ',
      Ps: '開き括弧',
      Pe: '閉じ括弧',
      Pi: '開き引用符',
      Pf: '閉じ引用符',
      Po: 'その他の句読点',
      Sm: '数学記号',
      Sc: '通貨記号',
      Sk: '修飾記号',
      So: 'その他の記号（絵文字など）',
      Zs: '空白',
      Zl: '行区切り',
      Zp: '段落区切り',
      Cc: '制御文字',
      Cf: '書式制御文字',
      Cs: 'サロゲート（単独）',
      Co: '私用領域',
      Cn: '未割り当て',
    },
    tableLabel: 'コードポイントごとの文字情報（横にスクロールできます）',
    notesHeading: '注意事項',
    notes: [
      '文字名の大規模なデータベースは同梱していないため、名称はASCII・制御文字・ZWJなどの不可視文字・国旗の地域指示子など、ごく一部の文字にのみ表示されます。カテゴリとスクリプトはブラウザの機能で判定するため、ブラウザのUnicodeバージョンに依存します。',
      'ブロック名も主要なものだけを収録しています。該当しない場合は「-」と表示されます。',
      '「見た目の文字数」はブラウザの文字境界判定（Intl.Segmenter）による値です。非対応の環境ではコードポイント数と同じになります。',
      'コードポイント入力は U+3042・0x3042・\\u{3042}・&#x3042;・3042 の形式に対応し、U+10FFFFを超える値は無効として扱います。',
      '単独のサロゲート（U+D800〜U+DFFF）は正式なUTF-8では表せないため、実際のエンコーダと同じく U+FFFD（EF BF BD）に置き換えた形で表示します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'コードポイント',
        description:
          'Unicodeが各文字に割り当てた番号です。U+3042 のように「U+」に16進数を続けて書き、U+0000〜U+10FFFFの範囲を取ります。',
      },
      {
        term: 'UTF-8 / UTF-16',
        description:
          'コードポイントをバイト列にする符号化方式です。UTF-8は1〜4バイト、UTF-16は2バイトまたは4バイト（サロゲートペア）で1文字を表します。',
      },
      {
        term: '一般カテゴリ',
        description:
          'Unicodeが文字に付けている分類で、Lu（英大文字）やNd（10進数字）のように2文字の略号で表します。正規表現の \\p{Lu} などで使われます。',
      },
      {
        term: 'ZWJ（ゼロ幅接合子）',
        description:
          'U+200Dの不可視文字です。複数の絵文字をつないで、👨‍👩‍👧 のような1つの絵文字として表示させるときに使われます。',
      },
    ],
  },
  en: {
    title: 'Unicode Character Inspector (Code Point, UTF-8, UTF-16)',
    description:
      'Look up the code point, UTF-8/UTF-16 bytes, category and script of any character, or turn U+3042-style code points back into text. Runs in your browser.',
    h1: 'Unicode Character Inspector and Code Point Lookup',
    introHtml:
      'Paste any text to see each code point with its <code>U+XXXX</code> value, UTF-8 and UTF-16 bytes, general category, script and block. Surrogate pairs, combining marks and ZWJ emoji sequences are split into their individual code points. You can also go the other way: enter code points like <code>U+3042</code> to get the characters. To convert text into escape sequences, use <a href="/en/tools/unicode-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unicode Escape / Unescape</a>; to browse symbols, try the <a href="/en/tools/special-char-list/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Special Characters &amp; Emoji List</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick a direction: "Text → Code points" or "Code points → Text".',
      'Enter the characters to inspect, or code points such as U+XXXX. Results update as you type.',
      'Read the bytes, category and script in the table, and press "Copy code points" if you need them.',
    ],
    modeLabel: 'Direction',
    modeInspect: 'Text → Code points',
    modeLookup: 'Code points → Text',
    copyCodePoints: 'Copy code points',
    copyText: 'Copy text',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabelInspect: 'Characters to inspect',
    inputLabelLookup: 'Code points (separated by spaces, commas or new lines)',
    placeholderInspect: 'e.g. あ😀é',
    placeholderLookup: 'e.g. U+3042 U+1F600 0x41',
    sampleInspect: 'あA😀é👨‍👩‍👧',
    sampleLookup: 'U+3042 U+1F600 0x41 \\u{1F431}',
    outputLabel: 'Character details',
    statCodePoints: 'Code points',
    statGraphemes: 'Visible characters',
    statUtf16: 'UTF-16 code units',
    statUtf8: 'UTF-8 bytes',
    colChar: 'Char',
    colCodePoint: 'Code point',
    colUtf8: 'UTF-8',
    colUtf16: 'UTF-16',
    colCategory: 'Category',
    colScript: 'Script',
    colBlock: 'Block',
    colName: 'Name',
    invisible: '(invisible)',
    flagEmoji: 'Emoji',
    flagJoiner: 'Joiner / modifier',
    truncated: 'Only the first 2,000 code points are shown.',
    invalidFormat: 'Could not read: {tokens}',
    empty: 'Enter text or code points to see the breakdown here.',
    categoryLabels: {
      Lu: 'Uppercase letter',
      Ll: 'Lowercase letter',
      Lt: 'Titlecase letter',
      Lm: 'Modifier letter',
      Lo: 'Other letter (kana, kanji, etc.)',
      Mn: 'Nonspacing mark',
      Mc: 'Spacing mark',
      Me: 'Enclosing mark',
      Nd: 'Decimal digit',
      Nl: 'Letter number',
      No: 'Other number',
      Pc: 'Connector punctuation',
      Pd: 'Dash punctuation',
      Ps: 'Open punctuation',
      Pe: 'Close punctuation',
      Pi: 'Initial quote',
      Pf: 'Final quote',
      Po: 'Other punctuation',
      Sm: 'Math symbol',
      Sc: 'Currency symbol',
      Sk: 'Modifier symbol',
      So: 'Other symbol (emoji, etc.)',
      Zs: 'Space separator',
      Zl: 'Line separator',
      Zp: 'Paragraph separator',
      Cc: 'Control',
      Cf: 'Format',
      Cs: 'Lone surrogate',
      Co: 'Private use',
      Cn: 'Unassigned',
    },
    tableLabel: 'Per-code-point character details (scrolls horizontally)',
    notesHeading: 'Notes',
    notes: [
      'No large character-name database is bundled, so names appear only for a small set: ASCII, control characters, invisible characters such as ZWJ, and regional indicators. Category and script come from your browser, so they depend on its Unicode version.',
      'Only major blocks are included. Characters outside them show "-" as the block.',
      '"Visible characters" is the grapheme count from the browser (Intl.Segmenter). Where it is unsupported, it equals the code point count.',
      'Code point input accepts U+3042, 0x3042, \\u{3042}, &#x3042; and 3042. Values above U+10FFFF are rejected.',
      'A lone surrogate (U+D800 to U+DFFF) cannot be encoded in valid UTF-8; the table shows U+FFFD (EF BF BD), which is what a real encoder outputs.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Code point',
        description:
          'The number Unicode assigns to a character. It is written as "U+" plus hex digits, such as U+3042, and ranges from U+0000 to U+10FFFF.',
      },
      {
        term: 'UTF-8 / UTF-16',
        description:
          'Encodings that turn code points into bytes. UTF-8 uses 1 to 4 bytes per character; UTF-16 uses 2 bytes, or 4 as a surrogate pair.',
      },
      {
        term: 'General category',
        description:
          'The classification Unicode gives each character, written as a two-letter code like Lu (uppercase letter) or Nd (decimal digit). It is what regex \\p{Lu} matches against.',
      },
      {
        term: 'ZWJ (zero width joiner)',
        description:
          'The invisible character U+200D. It glues several emoji together so they render as one, such as 👨‍👩‍👧.',
      },
    ],
  },
};
