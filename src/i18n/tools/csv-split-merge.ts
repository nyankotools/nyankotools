import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface CsvSplitMergePageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  modeLabel: string;
  modeSplit: string;
  modeMerge: string;
  modeDedupe: string;
  settingsHeading: string;
  encodingLabel: string;
  encodingOptions: SelectOption[];
  delimiterLabel: string;
  delimiterOptions: SelectOption[];
  hasHeaderLabel: string;
  bomLabel: string;
  /* 分割 */
  splitFileLabel: string;
  fileHint: string;
  splitByLabel: string;
  splitByOptions: SelectOption[];
  splitValueLabel: string;
  splitButton: string;
  /** `{files}` `{rows}` */
  splitDoneTemplate: string;
  /* 結合 */
  mergeFileLabel: string;
  mergeFileHint: string;
  mergeFilesHeading: string;
  /** `{name}` */
  mergeRemoveTemplate: string;
  mergeClearButton: string;
  validateHeaderLabel: string;
  mergeButton: string;
  /** `{files}` `{rows}` */
  mergeDoneTemplate: string;
  /* 重複削除 */
  dedupeFileLabel: string;
  keyColumnsHeading: string;
  keyColumnsHint: string;
  /** `{n}` */
  columnNameTemplate: string;
  keepLabel: string;
  keepOptions: SelectOption[];
  ignoreCaseLabel: string;
  trimLabel: string;
  dedupeButton: string;
  /** `{removed}` `{rows}` */
  dedupeDoneTemplate: string;
  /* 共通メッセージ */
  /** `{name}` `{size}` */
  fileSelectedTemplate: string;
  warnLargeTemplate: string;
  /** `{message}` */
  errorTemplate: string;
  /** `{name}` `{message}` */
  fileErrorTemplate: string;
  errorNoFile: string;
  errorTooFewFiles: string;
  errorEmpty: string;
  errorUnterminatedQuote: string;
  errorTooLarge: string;
  errorInvalidValue: string;
  errorTooManyParts: string;
  errorNoRows: string;
  /** `{name}` */
  errorHeaderMismatchTemplate: string;
  errorReadFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const csvSplitMergeContent: Record<Locale, CsvSplitMergePageContent> = {
  ja: {
    title: 'CSV分割・結合・重複行削除ツール',
    description:
      'CSVを行数や個数で分割してZIPで保存、複数CSVの結合（見出しチェック付き）、キー列での重複行削除ができる無料ツール。引用符内の改行やBOMにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSV分割・結合・重複行削除',
    introHtml:
      '大きなCSVを行数や個数で分けたり、複数のCSVを1つにまとめたり、キー列が同じ行を取り除いたりできます。セル内の改行や引用符も壊さず処理します。表として確認・並べ替えたいときは <a href="/tools/csv-viewer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSVビューア</a>、ZIPの作成・展開だけなら <a href="/tools/zip-tool/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ZIP作成・解凍</a> をご利用ください。',
    howToHeading: '使い方',
    howToSteps: [
      '「共通の設定」で文字コード・区切り文字・1行目を見出しとして使うかを選びます。',
      '「分割」「結合」「重複削除」のいずれかのタブを選び、CSVファイルを選択（ドラッグ＆ドロップも可）します。',
      '分割は行数または個数、重複削除はキー列と残す行を指定します。結合は複数のファイルを選びます。',
      '「分割してZIPをダウンロード」「結合してダウンロード」「重複を削除してダウンロード」のいずれかを押して保存します。',
    ],
    modeLabel: '機能',
    modeSplit: '分割',
    modeMerge: '結合',
    modeDedupe: '重複削除',
    settingsHeading: '共通の設定',
    encodingLabel: '読み込む文字コード',
    encodingOptions: [
      { value: 'utf-8', label: 'UTF-8' },
      { value: 'shift_jis', label: 'Shift_JIS' },
    ],
    delimiterLabel: '区切り文字',
    delimiterOptions: [
      { value: 'auto', label: '自動判定' },
      { value: ',', label: 'カンマ ( , )' },
      { value: 'tab', label: 'タブ' },
    ],
    hasHeaderLabel: '1行目を見出しとして使う',
    bomLabel: '出力にBOMを付ける（Excel向け）',
    splitFileLabel: '分割するCSVファイル',
    fileHint:
      'CSV・TSV・テキストファイルを選択、またはここにドラッグ＆ドロップ',
    splitByLabel: '分割の方法',
    splitByOptions: [
      { value: 'rows', label: '1ファイルあたりの行数' },
      { value: 'parts', label: 'ファイルの個数' },
    ],
    splitValueLabel: '数値',
    splitButton: '分割してZIPをダウンロード',
    splitDoneTemplate: '{rows} 行を {files} 個のファイルに分割しました。',
    mergeFileLabel: '結合するCSVファイル（複数選択可）',
    mergeFileHint:
      '2つ以上のCSVを選択、またはここにドラッグ＆ドロップ。選んだ順に結合します',
    mergeFilesHeading: '結合するファイル',
    mergeRemoveTemplate: '{name} を一覧から外す',
    mergeClearButton: 'すべてクリア',
    validateHeaderLabel: '見出しが一致するか確認する',
    mergeButton: '結合してダウンロード',
    mergeDoneTemplate: '{files} 個のファイルを結合しました（{rows} 行）。',
    dedupeFileLabel: '重複を削除するCSVファイル',
    keyColumnsHeading: '重複を判定する列',
    keyColumnsHint:
      '何も選ばなければ、行全体が同じ行を重複とみなします。複数選ぶと、すべての値が同じ行だけを重複とみなします。',
    columnNameTemplate: '列{n}',
    keepLabel: '残す行',
    keepOptions: [
      { value: 'first', label: '最初に出てきた行' },
      { value: 'last', label: '最後に出てきた行' },
    ],
    ignoreCaseLabel: '大文字小文字を区別しない',
    trimLabel: '前後の空白を無視する',
    dedupeButton: '重複を削除してダウンロード',
    dedupeDoneTemplate: '{removed} 行を削除しました（残り {rows} 行）。',
    fileSelectedTemplate: '{name}（{size}）',
    warnLargeTemplate:
      '{name} は大きいため、処理に時間がかかったりブラウザが重くなったりすることがあります。',
    errorTemplate: 'エラー: {message}',
    fileErrorTemplate: '{name}: {message}',
    errorNoFile: 'CSVファイルを選択してください。',
    errorTooFewFiles: '結合するには2つ以上のファイルを選択してください。',
    errorEmpty: 'データがありません。',
    errorUnterminatedQuote: '引用符（"）が閉じられていません。',
    errorTooLarge: 'ファイルが大きすぎます（上限100MB）。',
    errorInvalidValue: '数値は1以上の整数で入力してください。',
    errorTooManyParts: '分割後のファイル数が多すぎます（上限1000個）。',
    errorNoRows: '分割できるデータ行がありません。',
    errorHeaderMismatchTemplate:
      '「{name}」の見出しが最初のファイルと一致しません。',
    errorReadFailed: 'ファイルを読み込めませんでした。',
    notesHeading: '注意事項',
    notes: [
      '分割したファイルにはすべて同じ見出し行が付きます（「1行目を見出しとして使う」がオンの場合）。分割結果は1つのZIPにまとめて保存され、ファイル名は 元のファイル名_01.csv のような連番になります。',
      '結合は、最初のファイルの見出しを使い、2つ目以降の見出し行は取り除いて行を連結します。「見出しが一致するか確認する」をオンにすると、列名・列の順序・列数が1文字でも違うファイルがあれば結合せずにエラーにします。オフにすると、2つ目以降の見出し行もデータ行として残ります。',
      '重複削除は、残った行の順序を元のまま保ちます。判定は値の文字列そのものの比較で、1 と 01 は別の値です。見出し行は削除の対象になりません。',
      '出力は常にUTF-8、改行コードはLFで、必要なセルだけを引用符で囲みます。元ファイルと引用符の付け方や改行コード（CRLF）が変わる場合があります。完全な空行は取り除かれます。',
      'ファイル全体をブラウザのメモリに読み込むため、1ファイル100MBまで（20MBを超えると警告）です。処理は自分のブラウザ内で行われ、ファイルは外部に送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'BOM',
        description:
          'ファイル先頭に付く目印のバイト列です。付けておくと、ExcelがUTF-8のCSVを文字化けせずに開けます。',
      },
      {
        term: 'キー列',
        description:
          '行が重複しているかを判定するために比べる列です。たとえば「ID」列をキーにすると、IDが同じ行が重複になります。',
      },
    ],
  },
  en: {
    title: 'CSV Splitter, Merger and Duplicate Remover',
    description:
      'Split a CSV by row count or number of files (saved as ZIP), merge CSVs with header checks, or remove duplicate rows by key column. Runs in your browser only.',
    h1: 'CSV Split, Merge and Remove Duplicates',
    introHtml:
      'Break a large CSV into smaller files, combine several CSVs into one, or drop rows that share the same key columns. Quoted fields with line breaks are kept intact. To browse or sort a file as a table, use the <a href="/en/tools/csv-viewer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV Viewer</a>; for plain archives see the <a href="/en/tools/zip-tool/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ZIP Tool</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Under "Common settings", choose the encoding, delimiter and whether the first row is a header.',
      'Pick the "Split", "Merge" or "Remove duplicates" tab and choose your CSV file(s) (drag & drop works too).',
      'For splitting, set a row count or number of files; for duplicates, choose key columns and which row to keep; for merging, select several files.',
      'Press "Split and download ZIP", "Merge and download" or "Remove duplicates and download" to save the result.',
    ],
    modeLabel: 'Function',
    modeSplit: 'Split',
    modeMerge: 'Merge',
    modeDedupe: 'Remove duplicates',
    settingsHeading: 'Common settings',
    encodingLabel: 'Input encoding',
    encodingOptions: [
      { value: 'utf-8', label: 'UTF-8' },
      { value: 'shift_jis', label: 'Shift_JIS' },
    ],
    delimiterLabel: 'Delimiter',
    delimiterOptions: [
      { value: 'auto', label: 'Auto-detect' },
      { value: ',', label: 'Comma ( , )' },
      { value: 'tab', label: 'Tab' },
    ],
    hasHeaderLabel: 'First row is the header',
    bomLabel: 'Add a BOM to the output (for Excel)',
    splitFileLabel: 'CSV file to split',
    fileHint: 'Choose a CSV, TSV or text file, or drag & drop it here',
    splitByLabel: 'Split by',
    splitByOptions: [
      { value: 'rows', label: 'Rows per file' },
      { value: 'parts', label: 'Number of files' },
    ],
    splitValueLabel: 'Value',
    splitButton: 'Split and download ZIP',
    splitDoneTemplate: 'Split {rows} rows into {files} files.',
    mergeFileLabel: 'CSV files to merge (select several)',
    mergeFileHint:
      'Choose two or more CSV files, or drag & drop them here. They are merged in the order selected',
    mergeFilesHeading: 'Files to merge',
    mergeRemoveTemplate: 'Remove {name} from the list',
    mergeClearButton: 'Clear all',
    validateHeaderLabel: 'Check that headers match',
    mergeButton: 'Merge and download',
    mergeDoneTemplate: 'Merged {files} files ({rows} rows).',
    dedupeFileLabel: 'CSV file to deduplicate',
    keyColumnsHeading: 'Columns that identify a duplicate',
    keyColumnsHint:
      'If none are selected, rows are duplicates only when the whole row is identical. With several selected, all of those values must match.',
    columnNameTemplate: 'Column {n}',
    keepLabel: 'Row to keep',
    keepOptions: [
      { value: 'first', label: 'First occurrence' },
      { value: 'last', label: 'Last occurrence' },
    ],
    ignoreCaseLabel: 'Ignore case',
    trimLabel: 'Ignore leading and trailing spaces',
    dedupeButton: 'Remove duplicates and download',
    dedupeDoneTemplate: 'Removed {removed} rows ({rows} rows left).',
    fileSelectedTemplate: '{name} ({size})',
    warnLargeTemplate:
      '{name} is large, so processing may be slow or the browser may become sluggish.',
    errorTemplate: 'Error: {message}',
    fileErrorTemplate: '{name}: {message}',
    errorNoFile: 'Please choose a CSV file.',
    errorTooFewFiles: 'Choose at least two files to merge.',
    errorEmpty: 'There is no data.',
    errorUnterminatedQuote: 'An opening double quote (") is never closed.',
    errorTooLarge: 'The file is too large (limit 100 MB).',
    errorInvalidValue: 'Enter a whole number of 1 or more.',
    errorTooManyParts: 'That would create too many files (limit 1,000).',
    errorNoRows: 'There are no data rows to split.',
    errorHeaderMismatchTemplate:
      'The header of "{name}" does not match the first file.',
    errorReadFailed: 'Could not read the file.',
    notesHeading: 'Notes',
    notes: [
      'Every split file gets the same header row (when "First row is the header" is on). The parts are saved together in one ZIP and named like original_01.csv.',
      'Merging keeps the first file\'s header and drops the header rows of the others. With "Check that headers match" on, any file whose column names, order or count differ by even one character stops the merge with an error. With it off, the later header rows stay in as data rows.',
      'Duplicate removal keeps the remaining rows in their original order. Values are compared as exact text, so 1 and 01 are different. The header row is never removed.',
      'Output is always UTF-8 with LF line endings, quoting only the cells that need it. Quoting style and CRLF line endings of the original may change. Completely blank lines are dropped.',
      'The whole file is loaded into browser memory, so files up to 100 MB are accepted (a warning appears above 20 MB). Everything runs in your browser and files are never uploaded.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'BOM',
        description:
          'A marker at the start of a file. With it, Excel opens a UTF-8 CSV without garbling non-ASCII text.',
      },
      {
        term: 'Key column',
        description:
          'A column compared to decide whether rows are duplicates. Using an "ID" column as the key makes rows with the same ID duplicates.',
      },
    ],
  },
};
