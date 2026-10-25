import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'コイントスの表と裏は本当に50%ずつですか？',
      answer:
        'ブラウザの暗号用乱数（crypto.getRandomValues）から偏りなく0か1を選び、表と裏にしています。確率はどちらも50%で、直前の結果には影響されません。コインの回転は演出で、結果は投げる前に決まっています。',
    },
    {
      question: '表が何回も続くのは、乱数がおかしいからですか？',
      answer:
        'いいえ、偶然でも起こります。たとえば10回投げて、どこかで表が4回以上続く確率は半分近くあります。毎回の結果は独立しているので、「そろそろ裏が出る」ということもありません。',
    },
    {
      question: '連続で投げた結果はどこに表示されますか？',
      answer:
        '回数を指定して投げると、表と裏の合計と、投げた順の結果が表示されます。回数と同じ枚数のコインが並び、それぞれの面が表示されます。履歴・割合・連続記録は「集計」にまとまります。',
    },
    {
      question: '履歴はどこかに保存されますか？',
      answer:
        '履歴はこのページを開いている間だけメモリ上に保持され、サーバーにも端末にも保存されません。リロードすると消えます。最新の1000回分まで保持します。',
    },
    {
      question: '3つ以上の選択肢から選びたいときは？',
      answer:
        'コイントスは二択専用です。選択肢が3つ以上のときは、ルーレット・抽選・サイコロのツールで項目を入力して選んでください。',
    },
  ],
  en: [
    {
      question: 'Is the coin really 50/50?',
      answer:
        'Yes. The tool takes an unbiased 0 or 1 from the browser’s cryptographic generator (crypto.getRandomValues) and maps it to heads or tails. Each side has a 50% chance regardless of earlier flips. The spinning coin is only a show: the result is decided before it spins.',
    },
    {
      question: 'Does a long run of heads mean the randomness is broken?',
      answer:
        'No, runs happen by chance. In 10 flips there is close to a 50% chance of a run of at least four of the same side somewhere. Flips are independent, so tails is never "due".',
    },
    {
      question: 'Where do I see the results of several flips in a row?',
      answer:
        'When you flip more than once, the result line shows the heads and tails totals and the order flipped. One coin is shown per flip, each landing on its own side. History, the split and streaks are collected under Statistics.',
    },
    {
      question: 'Is my history saved anywhere?',
      answer:
        'The history stays in memory only while this page is open. It is not saved to a server or to your device, and it disappears on reload. The last 1000 flips are kept.',
    },
    {
      question: 'What if I need to choose among three or more options?',
      answer:
        'A coin only covers two outcomes. For three or more options, enter them in the roulette and random picker tool instead.',
    },
  ],
};
