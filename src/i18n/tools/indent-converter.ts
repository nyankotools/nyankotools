import type { Locale } from '../../data/tools';

export interface IndentConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  modeLabel: string;
  modeTabsToSpaces: string;
  modeSpacesToTabs: string;
  modeChangeWidth: string;
  /** タブ⇔スペース変換のときの幅の入力ラベル */
  tabWidthLabel: string;
  /** 幅変更モードの「変換前」ラベル */
  fromWidthLabel: string;
  /** 幅変更モードの「変換後」ラベル */
  toWidthLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  downloadButton: string;
  downloaded: string;
  resultLabel: string;
  /** `{total}` `{tab}` `{space}` `{mixed}` `{none}` を置換するテンプレート */
  statsTemplate: string;
  notesHeading: string;
  notes: string[];
}

export const indentConverterContent: Record<
  Locale,
  IndentConverterPageContent
> = {
  ja: {
    title: 'インデント変換（タブ⇔スペース・幅変更）',
    description:
      'コードやテキストの行頭インデントだけをタブ⇔スペースに一括変換し、2スペース⇔4スペースなど幅の変更もできる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'インデント変換（タブ⇔スペース・幅変更）',
    introHtml:
      'テキストの行頭にあるインデントだけを、タブからスペース、スペースからタブ、あるいは2スペースから4スペースのように幅を変えて一括変換します。コードの整形（フォーマット）は行わず、行中のタブやスペース、改行コードには手を加えません。改行コードを揃えたい場合は <a href="/tools/line-ending-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">改行コード変換</a> もご利用ください。',
    inputLabel: '変換したいテキスト',
    inputPlaceholder: 'インデント付きのコードやテキストを貼り付けてください',
    sampleText: 'function hello() {\n\tif (true) {\n\t\treturn "hi";\n\t}\n}\n',
    modeLabel: '変換の種類',
    modeTabsToSpaces: 'タブ → スペース',
    modeSpacesToTabs: 'スペース → タブ',
    modeChangeWidth: 'スペースの幅を変更',
    tabWidthLabel: 'タブ1つの幅（スペース数）',
    fromWidthLabel: '変換前のインデント幅',
    toWidthLabel: '変換後のインデント幅',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloadButton: 'ファイルとしてダウンロード',
    downloaded: 'ダウンロードしました',
    resultLabel: '結果',
    statsTemplate:
      '行頭の内訳: 全{total}行 / インデントなし{none}行 / タブ{tab}行 / スペース{space}行 / 混在{mixed}行',
    notesHeading: '注意点',
    notes: [
      '変換するのは各行の先頭にある空白（タブ・スペース）だけです。行の途中にあるタブやスペース、文字列リテラルの中身は変更されません。',
      'タブとスペースが混在した行は、タブストップ（指定した幅の倍数の桁）に合わせて桁数に換算してから変換します。',
      '「スペース → タブ」で幅に満たない端数のスペースは、そのままスペースとして残します（桁揃えを崩さないため）。',
      'インデントの深さそのものを判定するツールではないため、元の幅と異なる値を指定すると深さがずれます。元のインデント幅を確認してから指定してください。',
      'Makefile や TSV のようにタブが意味を持つ形式、Python のようにインデントが構文になる言語では、変換後の動作を必ず確認してください。',
      'すべての処理はブラウザ内で完結し、入力したテキストがサーバーに送信されることはありません。',
    ],
  },
  en: {
    title: 'Indent Converter: Tabs to Spaces & Spaces to Tabs',
    description:
      'Convert leading indentation between tabs and spaces, or change the indent width (2 to 4 spaces). Only line-start whitespace changes. Runs in your browser.',
    h1: 'Indent Converter (Tabs, Spaces, Width)',
    introHtml:
      'Convert only the indentation at the start of each line: tabs to spaces, spaces to tabs, or a new width such as 2 spaces to 4. It does not reformat your code, and tabs, spaces and line endings in the middle of a line are left alone. To normalize line endings too, try the <a href="/en/tools/line-ending-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Line Ending Converter</a>.',
    inputLabel: 'Text to convert',
    inputPlaceholder: 'Paste indented code or text here',
    sampleText: 'function hello() {\n\tif (true) {\n\t\treturn "hi";\n\t}\n}\n',
    modeLabel: 'Conversion',
    modeTabsToSpaces: 'Tabs to spaces',
    modeSpacesToTabs: 'Spaces to tabs',
    modeChangeWidth: 'Change space width',
    tabWidthLabel: 'Width of one tab (spaces)',
    fromWidthLabel: 'Current indent width',
    toWidthLabel: 'New indent width',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloadButton: 'Download as file',
    downloaded: 'Downloaded',
    resultLabel: 'Result',
    statsTemplate:
      'Line starts: {total} lines / {none} unindented / {tab} tab / {space} space / {mixed} mixed',
    notesHeading: 'Notes',
    notes: [
      'Only the whitespace (tabs and spaces) at the start of each line is converted. Tabs and spaces inside a line, including string literals, are never touched.',
      'Lines that mix tabs and spaces are measured in columns using tab stops (multiples of the width you set) before being converted.',
      'With "Spaces to tabs", leftover spaces that do not fill a whole tab are kept as spaces so that alignment is preserved.',
      'The tool does not detect your original indent size. If the width you enter differs from the real one, the nesting depth will shift, so check it first.',
      'Be careful with formats where tabs are significant (Makefile, TSV) or where indentation is syntax (Python): test the result after converting.',
      'Everything runs in your browser; the text you enter is never sent to a server.',
    ],
  },
};
