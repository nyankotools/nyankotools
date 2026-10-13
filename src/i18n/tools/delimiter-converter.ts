import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DelimiterConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  inputDelimiterLabel: string;
  outputDelimiterLabel: string;
  delimNewline: string;
  delimComma: string;
  delimCommaSpace: string;
  delimTab: string;
  delimSpace: string;
  delimSemicolon: string;
  delimPipe: string;
  delimCustom: string;
  inputCustomLabel: string;
  outputCustomLabel: string;
  customPlaceholder: string;
  swapButton: string;
  trimLabel: string;
  removeEmptyLabel: string;
  dedupeLabel: string;
  stripQuotesLabel: string;
  quoteLabel: string;
  quoteNone: string;
  quoteDouble: string;
  quoteSingle: string;
  quoteBacktick: string;
  copy: string;
  copied: string;
  copyFailed: string;
  outputLabel: string;
  countTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const delimiterConverterContent: Record<
  Locale,
  DelimiterConverterPageContent
> = {
  ja: {
    title: '改行⇔カンマ変換ツール｜区切り文字をオンラインで一括変換',
    description:
      '改行をカンマ区切りに、カンマ区切りを改行に、タブ・スペース・セミコロン・任意の文字列にも変換できる無料ツールです。空要素・重複の削除や引用符の付与にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '改行⇔カンマ・区切り文字変換',
    introHtml:
      '改行区切りのリストをカンマ区切りにしたり、カンマ区切りを1行1項目に戻したりと、区切り文字を相互に変換します。タブ・スペース・セミコロン・縦線・任意の文字列にも対応し、前後の空白削除、空要素・重複の除去、引用符（" \' `）の付与もできます。行単位の並べ替えや重複削除だけ行いたい場合は <a href="/tools/text-list-tools/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字列の重複削除・ソート・シャッフル</a> も便利です。',
    howToHeading: '使い方',
    howToSteps: [
      '変換したいテキストを入力欄に貼り付けます。',
      '「入力の区切り」と「出力の区切り」を選びます（任意の文字列も指定できます）。',
      '必要に応じて、空白削除・空要素の除去・重複除去・引用符の付与を設定します。',
      '下の結果を確認し、「コピー」ボタンでコピーします。',
    ],
    inputLabel: '入力',
    inputPlaceholder: '例:\napple\nbanana\ncherry',
    sampleText: 'apple\nbanana\nbanana\ncherry',
    inputDelimiterLabel: '入力の区切り',
    outputDelimiterLabel: '出力の区切り',
    delimNewline: '改行',
    delimComma: 'カンマ（,）',
    delimCommaSpace: 'カンマ+スペース（, ）',
    delimTab: 'タブ',
    delimSpace: 'スペース',
    delimSemicolon: 'セミコロン（;）',
    delimPipe: '縦線（|）',
    delimCustom: '任意の文字列',
    inputCustomLabel: '入力の区切り文字列',
    outputCustomLabel: '出力の区切り文字列',
    customPlaceholder: '例: / や \\t',
    swapButton: '入力と出力の区切りを入れ替える',
    trimLabel: '各項目の前後の空白を削除する',
    removeEmptyLabel: '空の項目を取り除く',
    dedupeLabel: '重複する項目を取り除く',
    stripQuotesLabel: '入力項目を囲む引用符（" \' `）を外す',
    quoteLabel: '出力項目の引用符',
    quoteNone: 'なし',
    quoteDouble: 'ダブルクォート（"）',
    quoteSingle: "シングルクォート（'）",
    quoteBacktick: 'バッククォート（`）',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    outputLabel: '結果',
    countTemplate: '{count}項目',
    notesHeading: '注意点',
    notes: [
      '処理の順序は、分割 → 前後の空白削除 → 引用符を外す → 空要素の除去 → 重複除去 → 引用符の付与 → 結合です。',
      'スペース区切りは、連続した半角・全角スペースを1つの区切りとして扱います。',
      '任意の文字列では \\n（改行）・\\t（タブ）・\\\\（バックスラッシュ）をエスケープとして使えます。空欄の場合は分割しません。',
      '引用符を付けるとき、項目内に同じ引用符があれば2つ重ねてエスケープします（CSV・SQLと同じ方式）。',
      'カンマ区切りは単純にカンマで分割します。引用符内のカンマを保護した本格的なCSV解析はしません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '区切り文字（デリミタ）',
        description:
          'リストの項目と項目の境目を表す文字です。カンマ・タブ・セミコロン・改行などがよく使われ、CSVはカンマ、TSVはタブを区切りにしたデータ形式です。',
      },
      {
        term: 'TSV',
        description:
          'Tab-Separated Values の略で、タブで項目を区切った形式です。値の中にカンマを含みやすいデータや、スプレッドシートからの貼り付けに向いています。',
      },
      {
        term: '引用符のエスケープ',
        description:
          '引用符で囲んだ項目の中に同じ引用符が現れるとき、区別のために2つ重ねて書く方式です。例: say "hi" は "say ""hi""" になります。',
      },
    ],
  },
  en: {
    title: 'Newline to Comma Converter: Convert Delimiters Online',
    description:
      'Convert newline lists to comma-separated values and back, or to tabs, spaces and custom delimiters. Trim, dedupe and quote items. Runs in your browser.',
    h1: 'Newline to Comma & Delimiter Converter',
    introHtml:
      'Turn a list with one item per line into a comma-separated string, or split a comma-separated string back into lines. It also handles tabs, spaces, semicolons, pipes, and any custom delimiter, and can trim whitespace, drop empty items and duplicates, and wrap items in quotes (" \' `). To sort or deduplicate a plain list line by line, try <a href="/en/tools/text-list-tools/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text List Deduplicate, Sort & Shuffle</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste the text you want to convert into the input box.',
      'Choose the input delimiter and the output delimiter (a custom string works too).',
      'Optionally trim whitespace, remove empty items or duplicates, and add quotes.',
      'Check the result below and press Copy.',
    ],
    inputLabel: 'Input',
    inputPlaceholder: 'e.g.\napple\nbanana\ncherry',
    sampleText: 'apple\nbanana\nbanana\ncherry',
    inputDelimiterLabel: 'Input delimiter',
    outputDelimiterLabel: 'Output delimiter',
    delimNewline: 'Newline',
    delimComma: 'Comma (,)',
    delimCommaSpace: 'Comma + space (, )',
    delimTab: 'Tab',
    delimSpace: 'Space',
    delimSemicolon: 'Semicolon (;)',
    delimPipe: 'Pipe (|)',
    delimCustom: 'Custom string',
    inputCustomLabel: 'Custom input delimiter',
    outputCustomLabel: 'Custom output delimiter',
    customPlaceholder: 'e.g. / or \\t',
    swapButton: 'Swap input and output delimiters',
    trimLabel: 'Trim whitespace around each item',
    removeEmptyLabel: 'Remove empty items',
    dedupeLabel: 'Remove duplicate items',
    stripQuotesLabel: 'Strip surrounding quotes (" \' `) from input items',
    quoteLabel: 'Quote output items',
    quoteNone: 'None',
    quoteDouble: 'Double quote (")',
    quoteSingle: "Single quote (')",
    quoteBacktick: 'Backtick (`)',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    outputLabel: 'Result',
    countTemplate: '{count} items',
    notesHeading: 'Notes',
    notes: [
      'Processing order: split, trim, strip quotes, remove empty items, remove duplicates, add quotes, then join.',
      'The space delimiter treats a run of half-width or full-width spaces as a single separator.',
      'In a custom string, \\n (newline), \\t (tab), and \\\\ (backslash) work as escapes. If it is empty, the text is not split.',
      'When adding quotes, a matching quote inside an item is doubled to escape it (the same convention as CSV and SQL).',
      'Comma splitting is a plain split on commas. It does not protect commas inside quoted fields the way a full CSV parser does.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Delimiter',
        description:
          'A character that marks the boundary between items in a list. Commas, tabs, semicolons, and newlines are common; CSV uses commas and TSV uses tabs.',
      },
      {
        term: 'TSV',
        description:
          'Tab-Separated Values: a format that separates items with tabs. It suits data that often contains commas and text pasted from spreadsheets.',
      },
      {
        term: 'Quote escaping',
        description:
          'When a quoted item contains the same quote character, it is written twice to tell it apart from the closing quote. Example: say "hi" becomes "say ""hi""".',
      },
    ],
  },
};
