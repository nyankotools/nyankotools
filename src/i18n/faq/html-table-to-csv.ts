import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ページ内の表をCSVにするには、何を貼り付ければよいですか？',
      answer:
        'ブラウザの開発者ツールで表の要素を選び、「HTMLとしてコピー」（Outer HTML）した内容を貼り付けてください。<table> から </table> までを含んでいれば、ページ全体のソースでも構いません。',
    },
    {
      question: '結合セル（colspan・rowspan）はどう変換されますか？',
      answer:
        'CSVには結合セルがないため、列・行を展開して出力します。既定では結合で覆われたセルを空にします。「結合セルの値を繰り返す」にチェックを入れると、同じ値で埋めます。',
    },
    {
      question: 'Excelで開くと日本語が文字化けします。',
      answer:
        'ExcelはBOMのないUTF-8のCSVを正しく読めないことがあります。「ダウンロード時にBOMを付ける」をオンにしてダウンロードしてください。コピーした文字列にBOMは含まれません。',
    },
    {
      question: '1つのHTMLに複数の表があるときはどうなりますか？',
      answer:
        '「変換する表」のプルダウンに、行数・列数つきで一覧表示されます。選んだ表だけがCSVになります。',
    },
  ],
  en: [
    {
      question: 'What should I paste to convert a table on a web page?',
      answer:
        'In your browser\'s developer tools, select the table element and use "Copy outerHTML". Anything that contains <table> … </table> works, including the whole page source.',
    },
    {
      question: 'How are merged cells (colspan and rowspan) converted?',
      answer:
        'CSV has no merged cells, so they are expanded across columns and rows. By default the covered cells are left empty. Check "Repeat the value in merged cells" to fill them with the same value.',
    },
    {
      question: 'Excel shows garbled text when I open the CSV.',
      answer:
        'Excel can misread UTF-8 CSV files that have no BOM. Turn on "Add a BOM to the download" before downloading. The copied text never includes a BOM.',
    },
    {
      question: 'What happens when the HTML contains more than one table?',
      answer:
        'The "Table to convert" dropdown lists each table with its row and column count. Only the table you select is converted.',
    },
  ],
};
