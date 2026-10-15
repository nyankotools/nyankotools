import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '何行くらいまで開けますか？',
      answer:
        '画面に見えている行だけを描画する仮想スクロールなので、数万〜数十万行でも表示は軽快です。ただし解析や並べ替えはブラウザのメモリを使うため、数十MBを超えるファイルでは時間がかかることがあります。',
    },
    {
      question: '並べ替えで「10」が「9」より前に来ません。',
      answer:
        '空欄を除くすべての値が数値の列は数値として比較するため、9 → 10 → 100 の順になります。数値以外が1つでも混ざる列は文字列の自然順で並べます。',
    },
    {
      question: '列を外したり並べ替えたりした結果はどう出力されますか？',
      answer:
        '「CSVをコピー」「CSVをダウンロード」は、表示中の行（絞り込み・並べ替え後）と列（外した列を除き、並べ替えた順）をそのままCSVにします。1行目を見出しにしている場合は見出し行も出力されます。',
    },
    {
      question: '文字化けする、または日本語が読めません。',
      answer:
        'ファイルはUTF-8として読み込みます。Shift_JISのCSVは文字化けするため、先に文字コード変換ツールでUTF-8にしてから開いてください。',
    },
  ],
  en: [
    {
      question: 'How many rows can it open?',
      answer:
        'Only the rows in view are drawn (virtual scrolling), so tens or hundreds of thousands of rows display smoothly. Parsing and sorting still use browser memory, so files over a few tens of MB may take a while.',
    },
    {
      question: 'Why does "10" sort after "9"?',
      answer:
        'When every non-empty value in a column is a number, the column is compared numerically (9, 10, 100). If even one value is not a number, the column is sorted as natural-order text instead.',
    },
    {
      question: 'What is exported after I remove or reorder columns?',
      answer:
        'Copy CSV and Download CSV write exactly what is shown: the filtered and sorted rows, and the columns that remain in their current order. The header row is included when the first row is used as the header.',
    },
    {
      question: 'My file shows garbled characters.',
      answer:
        'Files are read as UTF-8. A Shift_JIS or other legacy-encoded CSV will look garbled, so convert it to UTF-8 first and then open it.',
    },
  ],
};
