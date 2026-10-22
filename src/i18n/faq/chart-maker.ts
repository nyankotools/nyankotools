import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Excelの表はどうやって貼り付ければよいですか？',
      answer:
        'Excelやスプレッドシートで範囲を選んでコピーし、「グラフの元データ」欄に貼り付けてください。コピーした表はタブ区切りになりますが、自動で判別されます。1行目に系列名、1列目にラベルが入るように範囲を選びます。',
    },
    {
      question: '円グラフに複数の列を入れるとどうなりますか？',
      answer:
        '円グラフは1つの系列の内訳を表すため、最初の値の列（2列目）だけを使います。複数の系列を比べたいときは、棒グラフか折れ線グラフを選んでください。',
    },
    {
      question: '棒グラフの縦軸が0から始まるのはなぜですか？',
      answer:
        '棒の長さで大きさを比べるグラフなので、0から始めないと差が実際より大きく見えてしまうためです。値の変化に注目したいときは折れ線グラフを使うと、値の範囲に合わせて軸が調整されます。',
    },
    {
      question: '保存したPNGの文字が端末ごとに違って見えるのはなぜですか？',
      answer:
        '文字はお使いの端末にあるフォントで描かれるためです。保存後の画像は固定されるので、別の端末で開いても見た目は変わりません。',
    },
  ],
  en: [
    {
      question: 'How do I paste a table from Excel?',
      answer:
        'Select the range in Excel or your spreadsheet, copy it, and paste it into the "Chart data" box. Copied tables are tab-separated, which is detected automatically. Select the range so that series names are in the first row and labels are in the first column.',
    },
    {
      question: 'What happens if I give a pie chart several columns?',
      answer:
        'A pie chart shows the breakdown of a single series, so only the first value column (the second column) is used. To compare several series, choose a bar or line chart instead.',
    },
    {
      question: 'Why does the bar chart axis always start at 0?',
      answer:
        'Bars are compared by length, and a truncated axis makes differences look bigger than they are. If you care about how values change, use a line chart, whose axis fits the range of the data.',
    },
    {
      question: 'Why can the text look different on another device?',
      answer:
        'Text is drawn with the fonts installed on your device. Once saved, the PNG is fixed, so it looks the same wherever you open it.',
    },
  ],
};
