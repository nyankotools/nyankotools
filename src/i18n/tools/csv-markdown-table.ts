import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CsvMarkdownTablePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  delimiterLabel: string;
  delimiterAuto: string;
  delimiterComma: string;
  delimiterTab: string;
  delimiterSemicolon: string;
  headerLabel: string;
  alignLabel: string;
  alignNone: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  padLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  unterminatedQuoteError: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const csvMarkdownTableContent: Record<
  Locale,
  CsvMarkdownTablePageContent
> = {
  ja: {
    title: 'CSV/TSV→Markdownテーブル変換',
    description:
      'CSV・TSV（Excelからコピーした表）をMarkdownのテーブルに変換できる無料ツールです。列揃え・列幅の整形・見出し行の有無を指定でき、GitHubのREADMEにそのまま貼れます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSV/TSV→Markdownテーブル変換ツール',
    introHtml:
      'CSVやTSV（ExcelやGoogleスプレッドシートからコピーした表）を貼り付けると、GitHubのREADMEやドキュメントにそのまま使えるMarkdownテーブルに変換します。JSONが必要な場合は <a href="/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV⇔JSON変換</a> もご利用ください。',
    delimiterLabel: '区切り文字',
    delimiterAuto: '自動判定',
    delimiterComma: 'カンマ（,）',
    delimiterTab: 'タブ',
    delimiterSemicolon: 'セミコロン（;）',
    headerLabel: '1行目を見出しにする',
    alignLabel: '列の配置',
    alignNone: '指定なし',
    alignLeft: '左揃え',
    alignCenter: '中央揃え',
    alignRight: '右揃え',
    padLabel: '列幅をそろえて整形する',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: 'CSV / TSV',
    outputLabel: 'Markdownテーブル',
    inputPlaceholder: '名前,年齢,職業\n田中,30,エンジニア\nSmith,25,デザイナー',
    unterminatedQuoteError:
      'ダブルクォートが閉じられていません。引用符の対応を確認してください。',
    notesHeading: '注意事項',
    notes: [
      'Markdownのテーブルには見出し行が必須です。「1行目を見出しにする」を外すと、空の見出し行を補って出力します。',
      'セル内の「|」は「\\|」に、セル内の改行は「<br>」に置き換えます。',
      '列数が足りない行は、空のセルで補います。空行は無視されます。',
      '「自動判定」は1行目にタブがあればTSV、なければカンマ区切りとして扱います。',
      '列幅の整形では、全角文字を半角2文字分の幅として数えます。フォントによっては、見た目の幅がずれることがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CSV / TSV',
        description:
          'CSVはカンマ、TSVはタブで項目を区切るテキスト形式の表データです。ExcelやGoogleスプレッドシートからコピーした表は、通常TSVになります。',
      },
      {
        term: 'Markdownテーブル',
        description:
          '「|」で列を区切り、2行目の「---」で見出しと本文を分けて書く表記です。GitHubなど多くのサービスで表として表示されます。',
      },
      {
        term: 'GFM',
        description:
          'GitHub Flavored Markdown の略で、テーブルやタスクリストなどを追加したMarkdownの拡張仕様です。',
      },
    ],
  },
  en: {
    title: 'CSV/TSV to Markdown Table Converter',
    description:
      'Convert CSV or TSV, including tables copied from Excel, into a Markdown table. Set alignment and padding. Runs in your browser; nothing is uploaded.',
    h1: 'CSV/TSV to Markdown Table Converter',
    introHtml:
      'Paste CSV or TSV — including a table copied from Excel or Google Sheets — and get a Markdown table you can drop straight into a GitHub README or docs. If you need JSON instead, try the <a href="/en/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV to JSON Converter</a>.',
    delimiterLabel: 'Delimiter',
    delimiterAuto: 'Auto-detect',
    delimiterComma: 'Comma (,)',
    delimiterTab: 'Tab',
    delimiterSemicolon: 'Semicolon (;)',
    headerLabel: 'Use the first row as header',
    alignLabel: 'Column alignment',
    alignNone: 'Default',
    alignLeft: 'Left',
    alignCenter: 'Center',
    alignRight: 'Right',
    padLabel: 'Pad columns to equal width',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'CSV / TSV',
    outputLabel: 'Markdown table',
    inputPlaceholder: 'Name,Age,Role\nTanaka,30,Engineer\nSmith,25,Designer',
    unterminatedQuoteError:
      'A double quote is not closed. Check that every quote has a matching pair.',
    notesHeading: 'Notes',
    notes: [
      'A Markdown table needs a header row. If you turn off "Use the first row as header", an empty header row is added.',
      'A "|" inside a cell becomes "\\|", and a line break inside a cell becomes "<br>".',
      'Rows with fewer columns are filled with empty cells. Blank lines are ignored.',
      '"Auto-detect" treats the input as TSV if the first line contains a tab, and as comma-separated otherwise.',
      'When padding columns, full-width characters count as two columns wide. The result may look slightly off in some fonts.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CSV / TSV',
        description:
          'Plain-text table formats that separate fields with commas (CSV) or tabs (TSV). A table copied from Excel or Google Sheets is usually TSV.',
      },
      {
        term: 'Markdown table',
        description:
          'A table written with "|" between columns and a "---" line under the header row. Many services such as GitHub render it as a table.',
      },
      {
        term: 'GFM',
        description:
          'GitHub Flavored Markdown, an extension of Markdown that adds tables, task lists and more.',
      },
    ],
  },
};
