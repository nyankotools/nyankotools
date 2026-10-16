import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '反対の向きに曲がれないのはなぜですか？',
      answer:
        '今進んでいる向きと逆へ曲がると、すぐ後ろの自分の体にぶつかって一瞬でゲームオーバーになってしまうため、その入力は無視します。上へ進んでいるときは左右にだけ曲がれます。',
    },
    {
      question: '素早く2回曲がろうとしても反応しないことがあります',
      answer:
        '1マス進む間に入力できる向きは、次の2回分まで覚えておきます。それ以上の連続入力は取りこぼされるので、曲がるタイミングを少し分けて操作してください。',
    },
    {
      question: 'スマホで遊べますか？',
      answer:
        'はい。盤面の上で指をスワイプした向きに曲がります。画面下の矢印ボタンでも操作できます。スワイプ中にページがスクロールしないよう、盤面の上ではスクロールを止めています。',
    },
    {
      question: 'どうなるとクリアですか？',
      answer:
        '盤面（20×20マス）のすべてのマスを蛇の体で埋めるとクリアです。多くの場合はそのまえに壁か自分の体にぶつかってゲームオーバーになります。端沿いに進んで体を折りたたむのがコツです。',
    },
    {
      question: 'ベストスコアはどこに保存されますか？',
      answer:
        'このブラウザのローカルストレージにだけ保存され、サーバーには送信されません。ブラウザのデータを消去したり、別の端末・ブラウザで遊んだりすると引き継がれません。',
    },
  ],
  en: [
    {
      question: 'Why can’t I turn straight back?',
      answer:
        'Turning to the opposite direction would run you into the body right behind your head and end the game instantly, so that input is ignored. While moving up you can only turn left or right.',
    },
    {
      question: 'Sometimes a quick double turn doesn’t register',
      answer:
        'The game remembers up to two queued turns per step. Anything faster than that is dropped, so space your turns out slightly.',
    },
    {
      question: 'Can I play on a phone?',
      answer:
        'Yes. Swipe on the board to turn in that direction, or use the arrow buttons below it. Page scrolling is disabled on the board itself so swipes do not scroll the page.',
    },
    {
      question: 'How do I win?',
      answer:
        'Fill every cell of the 20×20 board with the snake. Most games end earlier by hitting a wall or yourself; hugging the edges and folding your body into tight rows helps.',
    },
    {
      question: 'Where is my best score stored?',
      answer:
        'Only in this browser’s local storage; nothing is sent to a server. It is not carried over if you clear site data or play on a different browser or device.',
    },
  ],
};
