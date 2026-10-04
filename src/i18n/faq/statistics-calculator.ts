import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '偏差値はどのように計算していますか？',
      answer:
        '「50＋10×（得点−平均）÷標準偏差」で計算しています。標準偏差には、入力したデータ全体を母集団とみなした母標準偏差を使います。平均点なら偏差値50、平均より標準偏差1つ分高ければ60です。',
    },
    {
      question:
        '標準偏差は母標準偏差と標本標準偏差のどちらを見ればよいですか？',
      answer:
        'クラス全員の点数など対象の全データがそろっているなら母標準偏差（データ数で割る）、一部を抽出したデータから全体を推定したいなら標本標準偏差（データ数−1で割る）を使います。どちらも同時に表示します。',
    },
    {
      question: '最頻値が「なし」と表示されるのはなぜですか？',
      answer:
        'すべての値が1回ずつしか現れないと、最頻値を決められないためです。同じ回数で最も多い値が複数あるときは、すべてを昇順で表示します。',
    },
    {
      question: '入力できるデータの形式や件数に制限はありますか？',
      answer:
        'カンマ・スペース・タブ・改行で区切った数値を最大10,000件まで計算できます。全角数字や負の数、小数、指数表記も読み取れますが、「1,000」のような桁区切りのカンマは区切りとして扱われます。',
    },
  ],
  en: [
    {
      question: 'How is the T-score (deviation score) calculated?',
      answer:
        'It is 50 + 10 × (score − mean) ÷ standard deviation, using the population standard deviation of the data you entered. A score equal to the mean gets 50, and one standard deviation above the mean gets 60.',
    },
    {
      question: 'Should I use the population or the sample standard deviation?',
      answer:
        'Use the population value when you have every data point, such as all scores in a class. Use the sample value when your data is a subset used to estimate a larger group; it divides by n − 1 instead of n. Both are shown.',
    },
    {
      question: 'Why does the mode say "None"?',
      answer:
        'When every value appears exactly once, there is no single most frequent value. If several values tie for the highest count, all of them are listed in ascending order.',
    },
    {
      question: 'What input format and size limits apply?',
      answer:
        'Numbers separated by commas, spaces, tabs, or new lines, up to 10,000 values. Negative numbers, decimals, exponent notation, and full-width digits work, but a comma is always a separator, so 1,000 is read as 1 and 000.',
    },
  ],
};
