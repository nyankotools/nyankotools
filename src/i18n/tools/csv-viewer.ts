import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface CsvViewerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  fileLabel: string;
  fileHint: string;
  fileError: string;
  inputLabel: string;
  inputPlaceholder: string;
  delimiterLabel: string;
  delimiterOptions: SelectOption[];
  hasHeaderLabel: string;
  filterLabel: string;
  filterPlaceholder: string;
  filterColumnLabel: string;
  allColumns: string;
  /** `{n}` を置換して使うテンプレート */
  columnNameTemplate: string;
  columnsHeading: string;
  columnsHint: string;
  hiddenColumnsLabel: string;
  restoreAllButton: string;
  /** `{name}` を置換して使うテンプレート */
  moveLeftTemplate: string;
  moveRightTemplate: string;
  removeTemplate: string;
  restoreTemplate: string;
  /** `{name}` を置換して使うテンプレート */
  sortTemplate: string;
  rowNumberHeader: string;
  /** `{shown}` `{total}` `{columns}` を置換して使うテンプレート */
  summaryTemplate: string;
  tableAriaLabel: string;
  noMatches: string;
  noColumns: string;
  copyButton: string;
  downloadButton: string;
  copied: string;
  copyFailed: string;
  /** `{message}` を置換して使うテンプレート */
  errorTemplate: string;
  errorEmpty: string;
  errorUnterminatedQuote: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const csvViewerContent: Record<Locale, CsvViewerPageContent> = {
  ja: {
    title: 'CSVビューア・ソート・絞り込み・列抽出',
    description:
      'CSVをテーブルで表示し、列ソート・キーワード絞り込み・列の並べ替えや削除をして、CSVとして再出力できる無料ツール。数万行でも仮想スクロールで軽快。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSVビューア（ソート・絞り込み・列抽出）',
    introHtml:
      'CSVを貼り付けるかファイルを選ぶと、表として確認できます。列見出しのクリックで並べ替え、キーワードで行を絞り込み、不要な列の削除や並べ替えをして、結果をCSVとしてコピー・保存できます。形式の変換は <a href="/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV⇔JSON変換</a>、区切り文字の変更は <a href="/tools/delimiter-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">区切り文字変換</a> もご利用ください。',
    howToHeading: '使い方',
    howToSteps: [
      'CSVを貼り付けるか、ファイルを選択（ドラッグ＆ドロップも可）します。',
      '列見出しをクリックして並べ替え、「絞り込み」でキーワードに合う行だけを表示します。',
      '「列の編集」で列の並べ替え・削除をします。',
      '「CSVをコピー」または「CSVをダウンロード」で、表示中の内容を書き出します。',
    ],
    fileLabel: 'CSVファイル',
    fileHint:
      'CSV・TSV・テキストファイルを選択、またはここにドラッグ＆ドロップ（UTF-8）',
    fileError: 'ファイルを読み込めませんでした。',
    inputLabel: 'CSVを貼り付け',
    inputPlaceholder: 'id,name,age\n1,Taro,30\n2,Hanako,25',
    delimiterLabel: '区切り文字',
    delimiterOptions: [
      { value: 'auto', label: '自動判定' },
      { value: ',', label: 'カンマ ( , )' },
      { value: 'tab', label: 'タブ' },
      { value: ';', label: 'セミコロン ( ; )' },
    ],
    hasHeaderLabel: '1行目を見出しとして使う',
    filterLabel: '絞り込み',
    filterPlaceholder: 'キーワード（大文字小文字は区別しません）',
    filterColumnLabel: '対象の列',
    allColumns: 'すべての列',
    columnNameTemplate: '列{n}',
    columnsHeading: '列の編集',
    columnsHint:
      '矢印で表示順を変え、×で列を外します。外した列は出力にも含まれません。',
    hiddenColumnsLabel: '外した列',
    restoreAllButton: 'すべて戻す',
    moveLeftTemplate: '{name} を左へ',
    moveRightTemplate: '{name} を右へ',
    removeTemplate: '{name} を外す',
    restoreTemplate: '{name} を戻す',
    sortTemplate: '{name} で並べ替え',
    rowNumberHeader: '#',
    summaryTemplate: '{shown} / {total} 行・{columns} 列',
    tableAriaLabel: 'CSVのプレビュー',
    noMatches: '条件に合う行がありません。',
    noColumns: '表示する列がありません。',
    copyButton: 'CSVをコピー',
    downloadButton: 'CSVをダウンロード',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorTemplate: 'エラー: {message}',
    errorEmpty: 'データがありません。',
    errorUnterminatedQuote: '引用符（"）が閉じられていません。',
    notesHeading: '注意事項',
    notes: [
      '並べ替えは、空欄を除くすべての値が数値の列なら数値順、それ以外は自然順（file2 が file10 より前）の文字列順です。空欄は常に末尾に並びます。見出しを3回クリックすると元の順序に戻ります。',
      '絞り込みは「列の編集」で外した列を検索しません。並べ替え・絞り込み・列の編集の結果は、そのままCSVとして出力されます（改行コードはLF、引用符は必要なセルだけに付きます）。',
      '列数が揃っていない行は、足りない列を空欄として扱います。完全な空行は無視されます。',
      '表は固定高さのスクロール領域に表示中の行だけを描画するため、数万行でも動作します。ただし非常に大きなファイル（数十MB以上）はブラウザのメモリ次第で重くなることがあります。ファイルはUTF-8で読み込みます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CSV',
        description:
          'Comma-Separated Values の略で、値をカンマなどの区切り文字で並べたテキスト形式です。1行が1レコードを表します。',
      },
      {
        term: '仮想スクロール',
        description:
          '画面に見えている範囲の行だけを描画する技術です。全行を描画しないため、行数が多い表でも軽く動作します。',
      },
      {
        term: '自然順ソート',
        description:
          '文字列中の数字のかたまりを数値として比較する並べ替えです。file2 が file10 より前に並びます。',
      },
    ],
  },
  en: {
    title: 'CSV Viewer: Sort, Filter and Extract Columns',
    description:
      'View CSV as a table, sort columns, filter rows, reorder or remove columns and export as CSV. Handles big files. Runs in your browser; nothing is uploaded.',
    h1: 'CSV Viewer (Sort, Filter, Extract Columns)',
    introHtml:
      'Paste CSV or pick a file to inspect it as a table. Click a column header to sort, filter rows by keyword, drop or reorder columns, then copy or save the result as CSV. To change the format use the <a href="/en/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV ⇔ JSON Converter</a>, or switch separators with the <a href="/en/tools/delimiter-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Delimiter Converter</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste CSV or choose a file (drag & drop works too).',
      'Click a column header to sort, and use "Filter" to show only rows matching a keyword.',
      'Use "Edit columns" to reorder or remove columns.',
      'Press "Copy CSV" or "Download CSV" to export what is currently shown.',
    ],
    fileLabel: 'CSV file',
    fileHint: 'Choose a CSV, TSV or text file, or drag & drop it here (UTF-8)',
    fileError: 'Could not read the file.',
    inputLabel: 'Paste CSV',
    inputPlaceholder: 'id,name,age\n1,Taro,30\n2,Hanako,25',
    delimiterLabel: 'Delimiter',
    delimiterOptions: [
      { value: 'auto', label: 'Auto-detect' },
      { value: ',', label: 'Comma ( , )' },
      { value: 'tab', label: 'Tab' },
      { value: ';', label: 'Semicolon ( ; )' },
    ],
    hasHeaderLabel: 'First row is the header',
    filterLabel: 'Filter',
    filterPlaceholder: 'Keyword (case-insensitive)',
    filterColumnLabel: 'Column',
    allColumns: 'All columns',
    columnNameTemplate: 'Column {n}',
    columnsHeading: 'Edit columns',
    columnsHint:
      'Use the arrows to change the order and × to remove a column. Removed columns are left out of the export.',
    hiddenColumnsLabel: 'Removed columns',
    restoreAllButton: 'Restore all',
    moveLeftTemplate: 'Move {name} left',
    moveRightTemplate: 'Move {name} right',
    removeTemplate: 'Remove {name}',
    restoreTemplate: 'Restore {name}',
    sortTemplate: 'Sort by {name}',
    rowNumberHeader: '#',
    summaryTemplate: '{shown} of {total} rows · {columns} columns',
    tableAriaLabel: 'CSV preview',
    noMatches: 'No rows match the filter.',
    noColumns: 'There are no columns to show.',
    copyButton: 'Copy CSV',
    downloadButton: 'Download CSV',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorTemplate: 'Error: {message}',
    errorEmpty: 'There is no data.',
    errorUnterminatedQuote: 'An opening double quote (") is never closed.',
    notesHeading: 'Notes',
    notes: [
      'A column sorts numerically when every non-empty value is a number; otherwise it sorts as natural-order text (file2 before file10). Empty cells always go last. Click a header three times to return to the original order.',
      'The filter does not search columns you removed in "Edit columns". The sorted, filtered and column-edited result is exported as CSV exactly as shown (LF line endings; only cells that need it are quoted).',
      'Rows with fewer fields than the widest row are padded with empty cells. Fully blank lines are ignored.',
      'Only the visible rows are drawn inside a fixed-height scroll area, so tens of thousands of rows stay responsive. Very large files (tens of MB or more) may still be slow depending on browser memory. Files are read as UTF-8.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CSV',
        description:
          'Comma-Separated Values: a text format that lists values separated by a delimiter such as a comma, one record per line.',
      },
      {
        term: 'Virtual scrolling',
        description:
          'A technique that draws only the rows currently in view, so even a table with a huge number of rows stays fast.',
      },
      {
        term: 'Natural sort',
        description:
          'Sorting that compares runs of digits as numbers, so file2 comes before file10.',
      },
    ],
  },
};
