import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ExcelColumnConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  columnSectionHeading: string;
  columnLabel: string;
  columnPlaceholder: string;
  numberLabel: string;
  numberPlaceholder: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorInvalidColumn: string;
  errorInvalidNumber: string;
  errorOutOfRangeColumn: string;
  errorOutOfRangeNumber: string;
  refSectionHeading: string;
  refLabel: string;
  refPlaceholder: string;
  refHint: string;
  resultColumn: string;
  resultColumnNumber: string;
  resultRow: string;
  resultAbsolute: string;
  resultStart: string;
  resultEnd: string;
  resultColumns: string;
  resultRows: string;
  resultCells: string;
  yes: string;
  no: string;
  errorInvalidRef: string;
  errorOutOfRangeRef: string;
  tableHeading: string;
  tableColumnHeader: string;
  tableNumberHeader: string;
  tableNotes: Record<string, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const excelColumnConverterContent: Record<
  Locale,
  ExcelColumnConverterPageContent
> = {
  ja: {
    title: 'Excel列番号⇔列記号変換｜A1参照の分解・範囲の列数計算',
    description:
      'Excelの列記号（A、AZ、XFD）と列番号（1、52、16384）を相互変換し、$B$3のようなA1参照の分解やA1:C10の列数・行数・セル数の計算もできる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Excel列番号⇔列記号変換ツール',
    introHtml:
      'Excelやスプレッドシートの列記号（A＝1、AZ＝52、XFD＝16384）と列番号を相互に変換します。<code>$B$3</code> のようなA1形式のセル参照を列・行に分解したり、<code>A1:C10</code> のような範囲の列数・行数・セル数を求めたりすることもできます。大文字・小文字は区別しません。N進数の変換には<a href="/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">進数変換ツール</a>も使えます。',
    columnSectionHeading: '列記号と列番号の変換',
    columnLabel: '列記号',
    columnPlaceholder: 'AZ',
    numberLabel: '列番号',
    numberPlaceholder: '52',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidColumn: '列記号は英字（A〜Z）だけで入力してください',
    errorInvalidNumber: '列番号は整数で入力してください',
    errorOutOfRangeColumn:
      '列記号はA〜XFD（1〜16384列）の範囲で入力してください',
    errorOutOfRangeNumber: '列番号は1〜16384の範囲で入力してください',
    refSectionHeading: 'セル参照・範囲の分解',
    refLabel: 'セル参照または範囲',
    refPlaceholder: '$B$3 または A1:C10',
    refHint:
      '「B3」「$B$3」のようなセル参照、または「A1:C10」のような範囲を入力します。',
    resultColumn: '列記号',
    resultColumnNumber: '列番号',
    resultRow: '行番号',
    resultAbsolute: '絶対参照（列／行）',
    resultStart: '開始セル',
    resultEnd: '終了セル',
    resultColumns: '列数',
    resultRows: '行数',
    resultCells: 'セル数',
    yes: '絶対',
    no: '相対',
    errorInvalidRef:
      'A1形式のセル参照（例: B3、$B$3）または範囲（例: A1:C10）で入力してください',
    errorOutOfRangeRef: '列はA〜XFD、行は1〜1048576の範囲で入力してください',
    tableHeading: 'よく使う列の対応表',
    tableColumnHeader: '列記号',
    tableNumberHeader: '列番号',
    tableNotes: {
      A: '最初の列',
      Z: '英字1文字の最後',
      AA: '2文字の最初',
      AZ: '',
      BA: '',
      IV: '旧Excel（.xls）の最終列',
      IW: '',
      ZZ: '2文字の最後',
      AAA: '3文字の最初',
      XFD: '現行Excel（.xlsx）の最終列',
    },
    notesHeading: '注意事項',
    notes: [
      'Excel（.xlsx）の列は A〜XFD の16,384列、行は1,048,576行までです。範囲外の値はエラーになります。',
      'Googleスプレッドシートは既定の上限が異なります（列の最大はZZZ=18,278）。このツールはExcelの上限に合わせています。',
      '範囲は逆向き（C10:A1）でも、列数・行数・セル数を正しく計算します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'A1形式',
        description:
          '列記号と行番号を並べてセルを指す表記（例: B3は2列目の3行目）。これに対し、R1C1形式は行・列をどちらも数字で表します。',
      },
      {
        term: '絶対参照・相対参照',
        description:
          '$を付けた列または行は、数式をコピーしても位置が固定されます（$B$3は列も行も固定）。$がなければコピー先に合わせてずれる相対参照です。',
      },
      {
        term: '26進数との違い',
        description:
          '列記号は「0」のない26進数に近い数え方です（Z の次が AA）。そのため単純な26進数変換とは結果が異なります。',
      },
    ],
  },
  en: {
    title: 'Excel Column Letter to Number Converter (A=1, AZ=52)',
    description:
      'Convert Excel column letters to numbers and back (A=1, AZ=52, XFD=16384), split A1 references like $B$3, and count columns in a range. Runs in your browser.',
    h1: 'Excel Column Letter ⇔ Number Converter',
    introHtml:
      'Convert Excel and spreadsheet column letters to column numbers and back (A = 1, AZ = 52, XFD = 16384). You can also split an A1-style reference such as <code>$B$3</code> into its column and row, or get the column, row and cell counts of a range such as <code>A1:C10</code>. Input is case-insensitive. For other number bases, try the <a href="/en/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base Converter</a>.',
    columnSectionHeading: 'Column letter and number',
    columnLabel: 'Column letters',
    columnPlaceholder: 'AZ',
    numberLabel: 'Column number',
    numberPlaceholder: '52',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidColumn: 'Column letters must contain only A to Z',
    errorInvalidNumber: 'The column number must be a whole number',
    errorOutOfRangeColumn:
      'Column letters must be between A and XFD (columns 1 to 16384)',
    errorOutOfRangeNumber: 'The column number must be between 1 and 16384',
    refSectionHeading: 'Split a cell reference or range',
    refLabel: 'Cell reference or range',
    refPlaceholder: '$B$3 or A1:C10',
    refHint:
      'Enter a cell reference such as "B3" or "$B$3", or a range such as "A1:C10".',
    resultColumn: 'Column letters',
    resultColumnNumber: 'Column number',
    resultRow: 'Row number',
    resultAbsolute: 'Absolute (column / row)',
    resultStart: 'Start cell',
    resultEnd: 'End cell',
    resultColumns: 'Columns',
    resultRows: 'Rows',
    resultCells: 'Cells',
    yes: 'absolute',
    no: 'relative',
    errorInvalidRef:
      'Enter an A1-style reference (e.g. B3, $B$3) or a range (e.g. A1:C10)',
    errorOutOfRangeRef:
      'Columns must be A to XFD and rows must be 1 to 1048576',
    tableHeading: 'Common columns',
    tableColumnHeader: 'Letters',
    tableNumberHeader: 'Number',
    tableNotes: {
      A: 'First column',
      Z: 'Last single-letter column',
      AA: 'First two-letter column',
      AZ: '',
      BA: '',
      IV: 'Last column in old Excel (.xls)',
      IW: '',
      ZZ: 'Last two-letter column',
      AAA: 'First three-letter column',
      XFD: 'Last column in current Excel (.xlsx)',
    },
    notesHeading: 'Notes',
    notes: [
      'An Excel (.xlsx) sheet has 16,384 columns (A to XFD) and 1,048,576 rows. Values outside that range are rejected.',
      'Google Sheets has different default limits (up to column ZZZ = 18,278). This tool follows the Excel limits.',
      'Reversed ranges such as C10:A1 are fine; the column, row and cell counts are still correct.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'A1 notation',
        description:
          'Naming a cell by column letters followed by a row number (B3 is column 2, row 3). R1C1 notation, by contrast, uses numbers for both.',
      },
      {
        term: 'Absolute and relative references',
        description:
          'A column or row prefixed with $ stays fixed when a formula is copied ($B$3 fixes both). Without $, the reference shifts with the destination.',
      },
      {
        term: 'Not plain base 26',
        description:
          'Column letters count like base 26 with no zero digit (Z is followed by AA), so the result differs from an ordinary base-26 conversion.',
      },
    ],
  },
};
