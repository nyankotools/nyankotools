import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HtmlTableToCsvPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  tableLabel: string;
  /** {n} 表の番号、{rows} 行数、{cols} 列数 */
  tableOption: string;
  delimiterLabel: string;
  delimiterComma: string;
  delimiterTab: string;
  delimiterSemicolon: string;
  repeatMergedLabel: string;
  bomLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  noTableError: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const htmlTableToCsvContent: Record<Locale, HtmlTableToCsvPageContent> =
  {
    ja: {
      title: 'HTMLテーブル→CSV変換',
      description:
        'HTMLの<table>タグをCSV・TSVに変換できる無料ツールです。結合セル（colspan・rowspan）の展開、複数テーブルの選択、Excel向けのBOM付きダウンロードに対応。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'HTMLテーブル→CSV変換ツール',
      introHtml:
        'Webページのソースなどから取り出した <code>&lt;table&gt;</code> のHTMLを貼り付けると、CSVに変換します。結合セルの展開や、Excelで開いた時の文字化けを防ぐBOM付き保存にも対応しています。CSVをJSONにしたい場合は <a href="/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV⇔JSON変換</a> もご利用ください。',
      tableLabel: '変換する表',
      tableOption: '表{n}（{rows}行×{cols}列）',
      delimiterLabel: '区切り文字',
      delimiterComma: 'カンマ（,）',
      delimiterTab: 'タブ（TSV）',
      delimiterSemicolon: 'セミコロン（;）',
      repeatMergedLabel: '結合セルの値を繰り返す',
      bomLabel: 'ダウンロード時にBOMを付ける（Excel向け）',
      copy: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      download: 'CSVをダウンロード',
      inputLabel: 'HTML',
      outputLabel: 'CSV',
      inputPlaceholder:
        '<table>\n  <tr><th>名前</th><th>年齢</th></tr>\n  <tr><td>田中</td><td>30</td></tr>\n</table>',
      noTableError:
        '<table> が見つかりません。<table>〜</table> を含むHTMLを貼り付けてください。',
      notesHeading: '注意事項',
      notes: [
        'HTMLに複数の <table> が含まれる場合は、「変換する表」から選べます。入れ子の表は、外側と内側が別々の表として扱われます。',
        'セル内のタグは取り除き、テキストだけを取り出します。連続する空白や改行は半角スペース1つにまとめ、<br> は半角スペースに置き換えます。',
        '結合セル（colspan・rowspan）は列・行を展開します。既定では結合で覆われたセルを空にし、「結合セルの値を繰り返す」にチェックを入れると同じ値で埋めます。',
        '貼り付けたHTMLのスクリプトは実行されず、画像なども読み込まれません。',
        'Excelで開いて日本語が文字化けする場合は、「BOMを付ける」をオンにしてダウンロードしてください。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'colspan / rowspan',
          description:
            'HTMLの表で、セルを横（colspan）や縦（rowspan）に結合する属性です。CSVには結合の概念がないため、展開して出力します。',
        },
        {
          term: 'BOM',
          description:
            'Byte Order Mark の略で、ファイル先頭に付けるUTF-8の目印です。Excelは、BOMがないUTF-8のCSVを文字化けして開くことがあります。',
        },
        {
          term: 'CSV',
          description:
            'Comma-Separated Values の略で、項目をカンマで区切ったテキスト形式の表データです。',
        },
      ],
    },
    en: {
      title: 'HTML Table to CSV Converter',
      description:
        'Convert an HTML <table> to CSV or TSV. Expands merged cells and adds a BOM for Excel. Runs in your browser, so nothing is sent to a server.',
      h1: 'HTML Table to CSV Converter',
      introHtml:
        'Paste the HTML of a <code>&lt;table&gt;</code> — for example copied from a page\'s source — and get CSV. Merged cells are expanded, and you can add a BOM so Excel opens non-ASCII text correctly. If you want JSON instead, try the <a href="/en/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV to JSON Converter</a>.',
      tableLabel: 'Table to convert',
      tableOption: 'Table {n} ({rows} rows × {cols} columns)',
      delimiterLabel: 'Delimiter',
      delimiterComma: 'Comma (,)',
      delimiterTab: 'Tab (TSV)',
      delimiterSemicolon: 'Semicolon (;)',
      repeatMergedLabel: 'Repeat the value in merged cells',
      bomLabel: 'Add a BOM to the download (for Excel)',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      download: 'Download CSV',
      inputLabel: 'HTML',
      outputLabel: 'CSV',
      inputPlaceholder:
        '<table>\n  <tr><th>Name</th><th>Age</th></tr>\n  <tr><td>Tanaka</td><td>30</td></tr>\n</table>',
      noTableError:
        'No <table> found. Paste HTML that contains <table>…</table>.',
      notesHeading: 'Notes',
      notes: [
        'If the HTML contains several <table> elements, pick one with "Table to convert". A nested table is treated as a separate table from the one around it.',
        'Tags inside cells are stripped and only the text is kept. Runs of whitespace and line breaks collapse into one space, and <br> becomes a space.',
        'Merged cells (colspan and rowspan) are expanded. By default the cells they cover are left empty; check "Repeat the value in merged cells" to fill them with the same value.',
        'Scripts in the pasted HTML are not executed and images are not loaded.',
        'If Excel shows garbled non-ASCII text, turn on "Add a BOM" before downloading.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'colspan / rowspan',
          description:
            'HTML attributes that merge a cell across columns (colspan) or rows (rowspan). CSV has no merged cells, so they are expanded in the output.',
        },
        {
          term: 'BOM',
          description:
            'Byte Order Mark, a marker placed at the start of a UTF-8 file. Excel may misread UTF-8 CSV files that lack it.',
        },
        {
          term: 'CSV',
          description:
            'Comma-Separated Values, a plain-text table format that separates fields with commas.',
        },
      ],
    },
  };
