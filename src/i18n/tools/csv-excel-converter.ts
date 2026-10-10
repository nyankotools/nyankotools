import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface CsvExcelConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  modeAriaLabel: string;
  modeToXlsx: string;
  modeToCsv: string;
  // CSV → Excel
  csvFileLabel: string;
  csvDropHint: string;
  csvPasteLabel: string;
  csvPastePlaceholder: string;
  delimiterLabel: string;
  delimiterOptions: SelectOption[];
  encodingLabel: string;
  encodingOptions: SelectOption[];
  detectNumbersLabel: string;
  sheetNameLabel: string;
  convertButton: string;
  /** `{name}` `{rows}` `{columns}` を置換して使うテンプレート */
  savedTemplate: string;
  /** `{name}` `{size}` を置換して使うテンプレート */
  loadedTemplate: string;
  // Excel → CSV
  xlsxFileLabel: string;
  xlsxDropHint: string;
  sheetLabel: string;
  csvDelimiterLabel: string;
  csvDelimiterOptions: SelectOption[];
  crlfLabel: string;
  bomLabel: string;
  outputLabel: string;
  /** `{rows}` `{columns}` を置換して使うテンプレート */
  sizeTemplate: string;
  /** `{count}` を置換して使うテンプレート */
  truncatedTemplate: string;
  copyButton: string;
  downloadButton: string;
  copied: string;
  copyFailed: string;
  downloaded: string;
  // errors
  errorNoInput: string;
  errorNoFile: string;
  errorUnterminatedQuote: string;
  errorTooManyRows: string;
  errorTooManyColumns: string;
  errorCellTooLong: string;
  errorNotXlsx: string;
  errorLegacy: string;
  errorTooLarge: string;
  errorInvalid: string;
  errorNoSheet: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const csvExcelConverterContent: Record<
  Locale,
  CsvExcelConverterPageContent
> = {
  ja: {
    title: 'CSV⇔Excel（xlsx）変換',
    description:
      'CSVファイルをExcel（xlsx）に、xlsxファイルをCSVに相互変換できる無料ツールです。Shift_JISのCSVの文字化け防止、シート選択、タブ区切り、BOM付きUTF-8出力に対応。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSV⇔Excel（xlsx）変換ツール',
    introHtml:
      'CSVファイルをExcelブック（.xlsx）に、Excelブックの各シートをCSVに変換します。Shift_JISで書き出したCSVも文字化けせずに読み込めます。ファイルはブラウザ内だけで処理されます。JSONに変換したい場合は <a href="/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV⇔JSON変換</a>、文字コードだけを変えたい場合は <a href="/tools/encoding-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字コード変換</a> もご利用ください。',
    modeAriaLabel: '変換方向',
    modeToXlsx: 'CSV→Excel',
    modeToCsv: 'Excel→CSV',
    csvFileLabel: 'CSVファイル',
    csvDropHint:
      'ここにCSV（.csv / .tsv / .txt）をドラッグ＆ドロップするか、クリックして選択',
    csvPasteLabel: 'またはCSVを貼り付け',
    csvPastePlaceholder: 'name,age\nTaro,30\nHanako,25',
    delimiterLabel: '区切り文字',
    delimiterOptions: [
      { value: 'auto', label: '自動判定' },
      { value: ',', label: 'カンマ ( , )' },
      { value: 'tab', label: 'タブ' },
      { value: ';', label: 'セミコロン ( ; )' },
    ],
    encodingLabel: '文字コード',
    encodingOptions: [
      { value: 'auto', label: '自動判定（UTF-8 / Shift_JIS）' },
      { value: 'utf-8', label: 'UTF-8' },
      { value: 'shift_jis', label: 'Shift_JIS' },
    ],
    detectNumbersLabel:
      '数値に見える値は数値セルにする（先頭が0の値や16桁以上の数字は文字列のまま）',
    sheetNameLabel: 'シート名',
    convertButton: 'xlsxに変換して保存',
    savedTemplate: '{name} を保存しました（{rows}行 × {columns}列）',
    loadedTemplate: '{name}（{size}）を読み込みました',
    xlsxFileLabel: 'Excelファイル（.xlsx）',
    xlsxDropHint:
      'ここに.xlsxファイルをドラッグ＆ドロップするか、クリックして選択',
    sheetLabel: 'シート',
    csvDelimiterLabel: '区切り文字',
    csvDelimiterOptions: [
      { value: ',', label: 'カンマ ( , )' },
      { value: 'tab', label: 'タブ（TSV）' },
      { value: ';', label: 'セミコロン ( ; )' },
    ],
    crlfLabel: '改行をCRLF（Windows形式）にする',
    bomLabel: 'BOM付きUTF-8で保存する（日本語版Excelで直接開く場合）',
    outputLabel: '変換結果',
    sizeTemplate: '{rows}行 × {columns}列',
    truncatedTemplate:
      '先頭{count}文字のみ表示しています。コピー・保存は全体が対象です。',
    copyButton: 'コピー',
    downloadButton: 'CSVを保存',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloaded: '保存しました',
    errorNoInput: 'CSVファイルを選ぶか、CSVを貼り付けてください。',
    errorNoFile: 'Excelファイル（.xlsx）を選んでください。',
    errorUnterminatedQuote:
      '引用符（"）が閉じられていません。CSVの内容を確認してください。',
    errorTooManyRows:
      'Excelの上限（1,048,576行）を超えているため変換できません。',
    errorTooManyColumns:
      'Excelの上限（16,384列）を超えているため変換できません。',
    errorCellTooLong:
      '1つのセルの文字数がExcelの上限（32,767文字）を超えているため変換できません。',
    errorNotXlsx:
      'Excelファイル（.xlsx）として読み込めませんでした。CSVファイルは「CSV→Excel」で変換してください。',
    errorLegacy:
      '古い形式（.xls）またはパスワード付きのファイルは読み込めません。Excelで「名前を付けて保存」から.xlsx形式で保存し直してください（パスワードは解除してください）。',
    errorTooLarge: 'ファイルが大きすぎます（上限50MB）。',
    errorInvalid:
      'ファイルを読み込めませんでした。破損しているか、対応していない形式の可能性があります。',
    errorNoSheet: 'ブックにシートが見つかりませんでした。',
    errorFailed: '変換に失敗しました。',
    howToHeading: '使い方',
    howToSteps: [
      '上の切り替えで「CSV→Excel」か「Excel→CSV」を選びます。',
      'ファイルをドラッグ＆ドロップするか、クリックして選択します（CSV→Excelは貼り付けも可）。',
      'オプションを確認します。Excel→CSVでは変換するシートも選べます。',
      '「xlsxに変換して保存」または「CSVを保存」を押して保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'CSV→Excelでは、CSVの内容を1枚のシートに書き込みます。列幅・色・数式などの書式は付きません。',
      '数値に見える値は数値セルになります。電話番号や郵便番号のように先頭が0の値、16桁以上の数字（Excelの有効桁数15桁を超えるもの）、1e5 のような指数表記の値は、値が変わらないよう文字列のままにします。',
      'Excel→CSVでは、数式は計算結果の値だけが出力されます。セルの表示書式（%・通貨・桁区切りなど）は反映されず、値そのものを出力します。日付・時刻の書式が付いたセルは、2026-10-10 や 2026-10-10 09:30:00 の形式で出力します。',
      'セルの結合・図・グラフ・マクロはCSVに反映されません。非表示の行・列・シートの値も区別なく出力・表示されます。',
      '古い形式（.xls）とパスワード付きのブックには対応していません。',
      '日本語のCSVをExcelで直接開く場合は、BOM付きUTF-8で保存すると文字化けしにくくなります。他のシステムに取り込む場合は、BOMなしを推奨します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'xlsx',
        description:
          'Excel 2007以降で使われるブックのファイル形式です。実体はXMLファイルをZIPで固めたもので、複数のシートを持てます。',
      },
      {
        term: 'CSV',
        description:
          'Comma-Separated Values の略で、カンマなどの区切り文字で列を区切るテキスト形式です。書式やシートを持たないため、ExcelやGoogleスプレッドシート、データベースの間でデータを受け渡すのによく使われます。',
      },
      {
        term: 'Shift_JIS',
        description:
          '日本語版Excelが「CSV（コンマ区切り）」で保存するときに使う文字コードです。UTF-8として読むと文字化けするため、このツールは自動で判定して読み込みます。',
      },
      {
        term: 'BOM',
        description:
          'Byte Order Mark の略で、UTF-8のファイルの先頭に付ける目印（3バイト）です。日本語版ExcelはBOMがあると、そのCSVをUTF-8として正しく開きます。',
      },
    ],
  },
  en: {
    title: 'Free CSV to Excel (XLSX) Converter and XLSX to CSV',
    description:
      'Convert CSV to an Excel .xlsx file, or export an xlsx sheet to CSV. Handles Shift_JIS, tab delimiters and UTF-8 BOM. Runs in your browser; nothing is uploaded.',
    h1: 'CSV ⇔ Excel (XLSX) Converter',
    introHtml:
      'Turn a CSV file into an Excel workbook (.xlsx), or export a sheet of an Excel workbook as CSV. Everything happens in your browser, so your files are never uploaded. If you need JSON instead, use the <a href="/en/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV ⇔ JSON Converter</a>; to only change a file\'s character encoding, try the <a href="/en/tools/encoding-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Encoding Converter</a>.',
    modeAriaLabel: 'Direction',
    modeToXlsx: 'CSV→Excel',
    modeToCsv: 'Excel→CSV',
    csvFileLabel: 'CSV file',
    csvDropHint:
      'Drag & drop a CSV (.csv / .tsv / .txt) here, or click to choose one',
    csvPasteLabel: 'Or paste CSV text',
    csvPastePlaceholder: 'name,age\nTaro,30\nHanako,25',
    delimiterLabel: 'Delimiter',
    delimiterOptions: [
      { value: 'auto', label: 'Auto-detect' },
      { value: ',', label: 'Comma ( , )' },
      { value: 'tab', label: 'Tab' },
      { value: ';', label: 'Semicolon ( ; )' },
    ],
    encodingLabel: 'Encoding',
    encodingOptions: [
      { value: 'auto', label: 'Auto-detect (UTF-8 / Shift_JIS)' },
      { value: 'utf-8', label: 'UTF-8' },
      { value: 'shift_jis', label: 'Shift_JIS' },
    ],
    detectNumbersLabel:
      'Store number-like values as numbers (values with leading zeros and numbers over 15 digits stay as text)',
    sheetNameLabel: 'Sheet name',
    convertButton: 'Convert and save as xlsx',
    savedTemplate: 'Saved {name} ({rows} rows × {columns} columns)',
    loadedTemplate: 'Loaded {name} ({size})',
    xlsxFileLabel: 'Excel file (.xlsx)',
    xlsxDropHint: 'Drag & drop an .xlsx file here, or click to choose one',
    sheetLabel: 'Sheet',
    csvDelimiterLabel: 'Delimiter',
    csvDelimiterOptions: [
      { value: ',', label: 'Comma ( , )' },
      { value: 'tab', label: 'Tab (TSV)' },
      { value: ';', label: 'Semicolon ( ; )' },
    ],
    crlfLabel: 'Use CRLF line endings (Windows)',
    bomLabel: 'Save as UTF-8 with BOM (for opening directly in Excel)',
    outputLabel: 'Result',
    sizeTemplate: '{rows} rows × {columns} columns',
    truncatedTemplate:
      'Showing only the first {count} characters. Copy and save use the full result.',
    copyButton: 'Copy',
    downloadButton: 'Save CSV',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloaded: 'Saved',
    errorNoInput: 'Choose a CSV file or paste some CSV text.',
    errorNoFile: 'Choose an Excel file (.xlsx).',
    errorUnterminatedQuote:
      'An opening double quote (") is never closed. Check the CSV content.',
    errorTooManyRows:
      'This CSV has more rows than Excel allows (1,048,576), so it cannot be converted.',
    errorTooManyColumns:
      'This CSV has more columns than Excel allows (16,384), so it cannot be converted.',
    errorCellTooLong:
      'A cell has more characters than Excel allows (32,767), so it cannot be converted.',
    errorNotXlsx:
      'This file could not be read as an Excel workbook (.xlsx). To convert a CSV file, use "CSV→Excel".',
    errorLegacy:
      'Legacy .xls files and password-protected workbooks are not supported. In Excel, use "Save As" to save a copy as .xlsx (without a password).',
    errorTooLarge: 'The file is too large (limit: 50 MB).',
    errorInvalid:
      'The file could not be read. It may be corrupted or in an unsupported format.',
    errorNoSheet: 'No sheets were found in this workbook.',
    errorFailed: 'The conversion failed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "CSV→Excel" or "Excel→CSV" with the switch above.',
      'Drag & drop a file or click to choose one (you can also paste text for CSV→Excel).',
      'Check the options. For Excel→CSV you can also pick which sheet to convert.',
      'Press "Convert and save as xlsx" or "Save CSV" to download the result.',
    ],
    notesHeading: 'Notes',
    notes: [
      'CSV→Excel writes the CSV into a single sheet with no formatting (column widths, colors, formulas and so on).',
      'Number-like values become number cells. Values with a leading zero (phone numbers, ZIP codes) and numbers with more than 15 digits and exponent notation such as 1e5 stay as text so they are not altered.',
      'Excel→CSV outputs only the calculated value of a formula. Display formats such as percentages, currency and thousands separators are not applied; the underlying value is written. Cells with a date or time format are written like 2026-10-10 or 2026-10-10 09:30:00.',
      'Merged cells, charts, images and macros are not reflected in the CSV. Hidden rows, columns and sheets are not treated specially: their values are exported and listed like any other.',
      'Legacy .xls files and password-protected workbooks are not supported.',
      'To open a CSV with Japanese text directly in Excel, save it as UTF-8 with BOM. When importing into another system, BOM-less UTF-8 is usually the better choice.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'XLSX',
        description:
          'The workbook file format used by Excel 2007 and later. It is a ZIP archive of XML files and can hold multiple sheets.',
      },
      {
        term: 'CSV',
        description:
          'Short for Comma-Separated Values, a plain-text format where columns are separated by commas or another delimiter. It carries no formatting or sheets, which makes it a common way to move data between Excel, Google Sheets and databases.',
      },
      {
        term: 'Shift_JIS',
        description:
          'The character encoding that Japanese-language Excel uses when saving "CSV (comma delimited)". Reading it as UTF-8 produces garbled text, so this tool detects it automatically.',
      },
      {
        term: 'BOM',
        description:
          'Short for Byte Order Mark, a 3-byte marker at the start of a UTF-8 file. With a BOM, Japanese-language Excel opens the CSV as UTF-8 correctly.',
      },
    ],
  },
};
