import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '結果は本当にランダムですか？偏りはありませんか？',
      answer:
        'ブラウザの暗号用乱数（crypto.getRandomValues）を使い、余りによる偏りが出ないよう棄却サンプリングで選んでいます。ルーレットの回転は演出で、結果は回す前に決まっています。',
    },
    {
      question: '項目ごとに当たる確率を変えられますか？',
      answer:
        '行末に「*3」のように重みを書くと、重みに比例した確率になります。たとえば「A*3」「B*1」なら、Aが75%、Bが25%です。重みを書かない行は1として扱い、小数（B*0.5）も使えます。ホイールの扇形の大きさにも反映され、項目の下に確率が表示されます。同じ名前を複数行に入力しても、その行数に比例して当たりやすくなります。',
    },
    {
      question: '抽選で同じ人が2回選ばれることはありますか？',
      answer:
        '抽選モードでは重複なしで選ぶため、同じ行は1回しか当選しません。ただし同じ名前を複数行に入力した場合は、別々の行として扱われます。ルーレットで何度も回す場合は「当たった項目は次から除外する」をオンにしてください。',
    },
    {
      question: 'プレゼント企画の抽選に使っても大丈夫ですか？',
      answer:
        '身内のくじ引きなどには使えますが、結果の公正さを第三者に証明する仕組みはありません。懸賞や景品表示法の対象になる抽選、金銭が絡む抽選には使わないでください。',
    },
    {
      question: '「2D6+3」のような指定はどう入力しますか？',
      answer:
        'サイコロモードで、ダイスの数に2、面の数に6、補正値に3を入力します。D4・D6・D8・D10・D12・D20・D100はボタンで面の数を入力できます。',
    },
  ],
  en: [
    {
      question: 'Is the result truly random and unbiased?',
      answer:
        'It uses the browser’s cryptographic generator (crypto.getRandomValues) and rejection sampling so that no value is favored by a remainder. The wheel animation is just a show: the result is decided before it spins.',
    },
    {
      question: 'Can I set a different chance for each item?',
      answer:
        'Yes. Add a weight at the end of a line such as "*3"; the chance is proportional to it. "A*3" and "B*1" give A 75% and B 25%. Lines without a weight count as 1, and decimals like B*0.5 work. The wheel segments are sized to match and the percentages are shown under the list. Entering the same name on several lines also works in proportion to the number of lines.',
    },
    {
      question: 'Can the same person be drawn twice?',
      answer:
        'Draw mode picks without repeats, so each line can win only once. Identical names on separate lines count as separate entries. For repeated spins, turn on "Remove each winner from the next spin".',
    },
    {
      question: 'Can I use it for a giveaway?',
      answer:
        'It is fine for casual draws among friends, but it offers no way to prove fairness to a third party. Do not use it for sweepstakes governed by law or for draws involving money.',
    },
    {
      question: 'How do I enter something like 2d6+3?',
      answer:
        'In Dice mode, enter 2 for the number of dice, 6 for the sides and 3 for the modifier. Buttons fill in the sides for d4, d6, d8, d10, d12, d20 and d100.',
    },
  ],
};
