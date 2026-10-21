import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '回帰直線はどのように計算していますか？',
      answer:
        '最小二乗法で、各点と直線の縦のずれの二乗和が最小になる y = ax + b を求めています。傾き a は xとyの偏差積和÷xの偏差平方和、切片 b は yの平均−a×xの平均です。',
    },
    {
      question: '決定係数R²と相関係数rの違いは何ですか？',
      answer:
        'rは−1〜1で直線的な関係の強さと向き（正・負）を表し、R²はその2乗（0〜1）で、回帰直線がyのばらつきの何割を説明できるかを表します。R²が0.81ならrは0.9または−0.9です。',
    },
    {
      question:
        '「x がすべて同じ値」や「y がすべて同じ値」と出るのはなぜですか？',
      answer:
        'xがすべて同じだと直線の傾きが定まらないため、回帰直線を計算できません。yがすべて同じ場合は傾き0の水平線になりますが、ばらつきがないため相関係数rとR²は定義できず「計算不可」と表示します。',
    },
    {
      question: '表計算ソフトのデータはそのまま貼り付けられますか？',
      answer:
        'はい。ExcelやGoogleスプレッドシートで2列を選択してコピーすると、タブ区切りで1行に1組になるので、そのまま貼り付けられます。見出し行など2つの数値でない行は無視されます。',
    },
  ],
  en: [
    {
      question: 'How is the regression line calculated?',
      answer:
        'It uses ordinary least squares: the line y = ax + b that minimizes the sum of squared vertical distances to the points. The slope a is Σ(x−x̄)(y−ȳ) ÷ Σ(x−x̄)², and the intercept b is ȳ − a·x̄.',
    },
    {
      question: 'What is the difference between r and R²?',
      answer:
        'r ranges from −1 to 1 and shows the strength and direction of the linear relationship. R² is r squared (0 to 1) and tells you the share of the variation in y explained by the line. An R² of 0.81 means r is 0.9 or −0.9.',
    },
    {
      question: 'Why does it say all x values or all y values are the same?',
      answer:
        'If every x is identical, the slope is undefined, so no line can be fitted. If every y is identical, the line is flat (slope 0), but r and R² are undefined because there is no variation to explain, so they are shown as not available.',
    },
    {
      question: 'Can I paste data straight from a spreadsheet?',
      answer:
        'Yes. Copy two columns from Excel or Google Sheets and paste them; they arrive tab-separated, one pair per line. Lines that are not exactly two numbers, such as a header row, are ignored.',
    },
  ],
};
