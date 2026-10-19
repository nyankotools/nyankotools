import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HtmlTableGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  sizeHeading: string;
  rowsLabel: string;
  columnsLabel: string;
  importLabel: string;
  importPlaceholder: string;
  importButton: string;
  importError: string;
  imported: string;
  editorLabel: string;
  headerCell: string;
  bodyCell: string;
  mergeHeading: string;
  mergeRowFrom: string;
  mergeRowTo: string;
  mergeColumnFrom: string;
  mergeColumnTo: string;
  mergeButton: string;
  unmergeButton: string;
  merged: string;
  unmerged: string;
  mergeInvalid: string;
  styleHeading: string;
  headerLabel: string;
  presetLabel: string;
  presetNone: string;
  presetSimple: string;
  presetStriped: string;
  presetMinimal: string;
  modeLabel: string;
  modeStyle: string;
  modeInline: string;
  paddingLabel: string;
  borderColorLabel: string;
  fullWidthLabel: string;
  classNameLabel: string;
  captionLabel: string;
  previewLabel: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const htmlTableGeneratorContent: Record<
  Locale,
  HtmlTableGeneratorPageContent
> = {
  ja: {
    title: 'HTMLテーブル生成｜セル結合・CSS付きで作成',
    description:
      '行数・列数を指定してHTMLのtableタグを作る無料ツールです。セル結合（colspan・rowspan）、見出し行（thead）、罫線・縞模様のCSS付き出力とプレビューに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'HTMLテーブル生成ツール（セル結合・CSS付き）',
    introHtml:
      '行数と列数を指定して表を作り、セルを編集・結合して、コピーできるHTMLの table タグを出力します。罫線や縞模様などのCSSを付けることもできます。セル内の文字は自動でエスケープされます。逆にHTMLの表からデータを取り出したい場合は <a href="/tools/html-table-to-csv/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTMLテーブル→CSV変換</a> をご利用ください。',
    sizeHeading: '表のサイズ',
    rowsLabel: '行数',
    columnsLabel: '列数',
    importLabel: 'Excel・スプレッドシートからの貼り付け（タブ区切り）',
    importPlaceholder: '名前\t年齢\n田中\t30',
    importButton: '表に読み込む',
    importError: '読み込める行が見つかりませんでした。',
    imported: '読み込みました',
    editorLabel: '表の編集',
    headerCell: '見出し',
    bodyCell: 'セル',
    mergeHeading: 'セルの結合',
    mergeRowFrom: '開始行',
    mergeRowTo: '終了行',
    mergeColumnFrom: '開始列',
    mergeColumnTo: '終了列',
    mergeButton: 'セルを結合',
    unmergeButton: '結合を解除',
    merged: '結合しました',
    unmerged: '解除しました',
    mergeInvalid: '2つ以上のセルを含む範囲を指定してください。',
    styleHeading: 'スタイルと出力',
    headerLabel: '1行目を見出し行（thead・th）にする',
    presetLabel: 'スタイル',
    presetNone: 'なし（HTMLのみ）',
    presetSimple: '罫線あり',
    presetStriped: '罫線＋縞模様',
    presetMinimal: '横線のみ',
    modeLabel: 'CSSの出力方法',
    modeStyle: 'styleタグ＋クラス',
    modeInline: 'インライン（style属性）',
    paddingLabel: '余白（px）',
    borderColorLabel: '罫線の色',
    fullWidthLabel: '幅いっぱいに広げる',
    classNameLabel: 'クラス名',
    captionLabel: 'キャプション（任意）',
    previewLabel: 'プレビュー',
    outputLabel: 'HTML',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'ダウンロード',
    howToHeading: '使い方',
    howToSteps: [
      '「行数」「列数」で表の大きさを決め、表のセルに内容を入力します。Excelなどの表は「表に読み込む」から貼り付けられます。',
      '結合したい範囲を「開始行」から「終了列」で指定し、「セルを結合」を押します。戻すときは範囲内のセルを指定して「結合を解除」を押します。',
      '「スタイル」と「CSSの出力方法」、余白や罫線の色を選ぶと、プレビューと出力が変わります。',
      '下の「HTML」欄を「コピー」するか、「ダウンロード」でファイルとして保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'セル内の & や < や > などの文字は自動でエスケープされ、改行は br タグ（<br>）になります。HTMLタグをセルに書いても、タグとしては動作しません。',
      '見出し行を有効にすると、1行目は thead 内の th として出力され、1行目の縦方向の結合（rowspan）は無効になります。',
      '結合すると、範囲の左上以外のセルの内容は消えます。',
      '縞模様の背景色などは固定の配色です。細かなデザインは、出力したCSSを編集してください。',
      'プレビューは、このページ内の表示です。お使いのサイトのCSSがあると、見え方が変わることがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'colspan / rowspan',
        description:
          'セルを横方向（colspan）・縦方向（rowspan）に何マス分つなげるかを指定するHTMLの属性です。',
      },
      {
        term: 'thead / tbody / th',
        description:
          'thead は見出し行のまとまり、tbody は本文行のまとまり、th は見出しセルを表すタグです。スクリーンリーダーが表の構造を読み上げる助けになります。',
      },
      {
        term: 'インラインスタイル',
        description:
          '要素の style 属性に直接CSSを書く方法です。HTMLメールなど、styleタグが使えない場面で役立ちます。',
      },
    ],
  },
  en: {
    title: 'HTML Table Generator with Merged Cells and CSS',
    description:
      'Build an HTML table by choosing rows and columns. Merge cells with colspan and rowspan, add a header row, and copy the code with CSS. Runs in your browser.',
    h1: 'HTML Table Generator',
    introHtml:
      'Pick the number of rows and columns, edit and merge cells, and copy the generated HTML table markup. You can add CSS such as borders and zebra stripes, and cell text is escaped automatically. To pull data out of an HTML table instead, use the <a href="/en/tools/html-table-to-csv/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML Table to CSV Converter</a>.',
    sizeHeading: 'Table size',
    rowsLabel: 'Rows',
    columnsLabel: 'Columns',
    importLabel: 'Paste from Excel or a spreadsheet (tab-separated)',
    importPlaceholder: 'Name\tAge\nTanaka\t30',
    importButton: 'Load into table',
    importError: 'No rows were found in the pasted text.',
    imported: 'Loaded',
    editorLabel: 'Table editor',
    headerCell: 'Header',
    bodyCell: 'Cell',
    mergeHeading: 'Merge cells',
    mergeRowFrom: 'From row',
    mergeRowTo: 'To row',
    mergeColumnFrom: 'From column',
    mergeColumnTo: 'To column',
    mergeButton: 'Merge cells',
    unmergeButton: 'Unmerge',
    merged: 'Merged',
    unmerged: 'Unmerged',
    mergeInvalid: 'Choose a range that covers at least two cells.',
    styleHeading: 'Style and output',
    headerLabel: 'Use the first row as the header (thead, th)',
    presetLabel: 'Style',
    presetNone: 'None (HTML only)',
    presetSimple: 'Borders',
    presetStriped: 'Borders and stripes',
    presetMinimal: 'Horizontal lines only',
    modeLabel: 'CSS output',
    modeStyle: 'Style tag and class',
    modeInline: 'Inline (style attributes)',
    paddingLabel: 'Padding (px)',
    borderColorLabel: 'Border color',
    fullWidthLabel: 'Stretch to full width',
    classNameLabel: 'Class name',
    captionLabel: 'Caption (optional)',
    previewLabel: 'Preview',
    outputLabel: 'HTML',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Download',
    howToHeading: 'How to use',
    howToSteps: [
      'Set the size with "Rows" and "Columns", then type into the cells. A table from Excel can be pasted with "Load into table".',
      'Enter the range to join using "From row" through "To column", then press "Merge cells". To undo, pick any cell in the range and press "Unmerge".',
      'Choose a "Style", the "CSS output" method, and the padding and border color. The preview and the code update right away.',
      'Press "Copy" on the "HTML" box below, or "Download" to save it as a file.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Characters such as & < and > in cells are escaped automatically, and line breaks become br tags (<br>). HTML typed into a cell will not act as markup.',
      'With the header row on, the first row is written as th cells inside thead, and a vertical merge (rowspan) in that row is ignored.',
      'Merging clears the text of every cell in the range except the top-left one.',
      'Stripe and header colors are fixed. For finer design, edit the generated CSS.',
      "The preview is rendered with this page's own styles. Your site's CSS may change how the table looks.",
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'colspan / rowspan',
        description:
          'HTML attributes that make a cell span several columns (colspan) or rows (rowspan).',
      },
      {
        term: 'thead / tbody / th',
        description:
          'thead groups the header rows, tbody groups the body rows, and th marks a header cell. They help screen readers understand the table structure.',
      },
      {
        term: 'Inline styles',
        description:
          "CSS written directly in an element's style attribute. Useful where a style tag is not allowed, such as HTML email.",
      },
    ],
  },
};
