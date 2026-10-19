import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MarkdownTableEditorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  importLabel: string;
  importPlaceholder: string;
  importButton: string;
  importError: string;
  imported: string;
  editorLabel: string;
  addRow: string;
  addColumn: string;
  alignLabel: string;
  alignNone: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  headerCell: string;
  bodyCell: string;
  moveRowUp: string;
  moveRowDown: string;
  deleteRow: string;
  moveColumnLeft: string;
  moveColumnRight: string;
  deleteColumn: string;
  padLabel: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const markdownTableEditorContent: Record<
  Locale,
  MarkdownTableEditorPageContent
> = {
  ja: {
    title: 'Markdownテーブルエディタ｜表で編集して整形出力',
    description:
      'Markdownのテーブルを表のまま編集できる無料ツールです。セル編集・行列の追加削除・並べ替え・列ごとの配置に対応し、全角を考慮して列幅をそろえた状態で出力します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Markdownテーブルエディタ（表で編集・整形出力）',
    introHtml:
      '表の画面でセルを編集し、行や列の追加・削除・並べ替え、列ごとの左右中央揃えまで行って、整形したMarkdownテーブルを出力します。既存のMarkdownテーブルを貼り付けて読み込むこともできます。CSVやExcelの表から変換したい場合は <a href="/tools/csv-markdown-table/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV/TSV→Markdownテーブル変換</a> をご利用ください。',
    importLabel: '既存のMarkdownテーブルを読み込む',
    importPlaceholder: '| 名前 | 年齢 |\n| --- | ---: |\n| 田中 | 30 |',
    importButton: '読み込む',
    importError: '表として読み込める行が見つかりませんでした。',
    imported: '読み込みました',
    editorLabel: '表の編集',
    addRow: '行を追加',
    addColumn: '列を追加',
    alignLabel: '列の配置',
    alignNone: '指定なし',
    alignLeft: '左揃え',
    alignCenter: '中央揃え',
    alignRight: '右揃え',
    headerCell: '見出し',
    bodyCell: 'セル',
    moveRowUp: '行を上へ',
    moveRowDown: '行を下へ',
    deleteRow: '行を削除',
    moveColumnLeft: '列を左へ',
    moveColumnRight: '列を右へ',
    deleteColumn: '列を削除',
    padLabel: '列幅をそろえて整形する',
    outputLabel: 'Markdownテーブル',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '既存の表があれば、入力欄に貼り付けて「読み込む」を押します。新規の場合は、そのまま表のセルに入力します。',
      '「行を追加」「列を追加」で表を広げ、各行・各列の矢印ボタンで並べ替え、削除ボタンで取り除きます。列の配置は列ごとのプルダウンで選びます。',
      'Enterで下のセル、Tabで次のセルへ移動できます（最後のセルで押すと行が増えます）。セル内で改行したいときはShift+Enterです。',
      '下の出力欄に整形済みのMarkdownが表示されるので、「コピー」で取り出します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'セル内の縦線（|）はバックスラッシュ付き（\\|）に、セル内の改行は br タグ（<br>）に置き換えて出力します。読み込み時はその逆に戻します。',
      '見出し行は必須のため削除できません。列も最低1列は残ります。',
      '列幅の整形では、全角文字を半角2文字分の幅として数えます。フォントによっては、見た目の幅がずれることがあります。',
      '読み込み時、区切り行（---）が無い場合は、縦線を含む行を表とみなして1行目を見出しにします。',
      'Markdown内のHTMLや装飾（太字・リンクなど）はそのまま文字として扱い、解釈や変換はしません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Markdownテーブル',
        description:
          '縦線（|）で列を区切り、2行目のハイフンの行で見出しと本文を分けて書く表記です。GitHubなど多くのサービスで表として表示されます。',
      },
      {
        term: '列の配置',
        description:
          '区切り行のコロン（:）の位置で指定する、列ごとの左揃え・中央揃え・右揃えです。表示側が対応していれば反映されます。',
      },
      {
        term: 'GFM',
        description:
          'GitHub Flavored Markdown の略で、テーブルやタスクリストなどを追加したMarkdownの拡張仕様です。',
      },
    ],
  },
  en: {
    title: 'Markdown Table Editor: Edit and Format Online',
    description:
      'Edit a Markdown table in a grid: edit cells, add, delete and reorder rows and columns, set alignment, and copy padded output. Runs in your browser.',
    h1: 'Markdown Table Editor',
    introHtml:
      'Edit cells in a grid, add, delete and reorder rows and columns, set each column to left, center or right alignment, and copy a neatly formatted Markdown table. You can also paste an existing Markdown table to keep editing it. To start from CSV or an Excel range, use the <a href="/en/tools/csv-markdown-table/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV/TSV to Markdown Table Converter</a>.',
    importLabel: 'Load an existing Markdown table',
    importPlaceholder: '| Name | Age |\n| --- | ---: |\n| Tanaka | 30 |',
    importButton: 'Load table',
    importError: 'No table rows were found in the pasted text.',
    imported: 'Loaded',
    editorLabel: 'Table editor',
    addRow: 'Add row',
    addColumn: 'Add column',
    alignLabel: 'Column alignment',
    alignNone: 'Default',
    alignLeft: 'Left',
    alignCenter: 'Center',
    alignRight: 'Right',
    headerCell: 'Header',
    bodyCell: 'Cell',
    moveRowUp: 'Move row up',
    moveRowDown: 'Move row down',
    deleteRow: 'Delete row',
    moveColumnLeft: 'Move column left',
    moveColumnRight: 'Move column right',
    deleteColumn: 'Delete column',
    padLabel: 'Pad columns to equal width',
    outputLabel: 'Markdown table',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'If you already have a table, paste it into the box and press "Load table". Otherwise just type into the grid.',
      'Use "Add row" and "Add column" to grow the table, the arrow buttons to reorder, and the delete buttons to remove. Pick each column\'s alignment from its dropdown.',
      'Press Enter to move down a cell and Tab to move to the next one (pressing it in the last cell adds a row). Use Shift+Enter for a line break inside a cell.',
      'The formatted Markdown appears in the output box below. Press "Copy" to take it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'A pipe (|) inside a cell is written with a backslash (\\|), and a line break inside a cell becomes a br tag (<br>). Loading a table reverses both.',
      'The header row is required and cannot be deleted, and at least one column always remains.',
      'When padding columns, full-width characters count as two columns wide. The result may look slightly off in some fonts.',
      'If the pasted text has no separator row (---), lines containing a pipe are treated as table rows and the first one becomes the header.',
      'HTML and formatting inside cells (bold, links and so on) are kept as plain text; nothing is interpreted or converted.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Markdown table',
        description:
          'A table written with pipes (|) between columns and a line of hyphens under the header row. Many services such as GitHub render it as a table.',
      },
      {
        term: 'Column alignment',
        description:
          'Left, center or right alignment per column, set by where the colons (:) sit in the separator row. It is applied when the viewer supports it.',
      },
      {
        term: 'GFM',
        description:
          'GitHub Flavored Markdown, an extension of Markdown that adds tables, task lists and more.',
      },
    ],
  },
};
