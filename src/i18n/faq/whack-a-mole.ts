import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'スコアはどのように数えますか？',
      answer:
        '顔を出しているネコを叩いた数がスコアです。空の穴を叩いてもスコアは減りませんが、ミスと命中率に反映されます。同じネコを二重に叩いても1匹としか数えません。',
    },
    {
      question: '時間が進むとどのくらい難しくなりますか？',
      answer:
        '出現の間隔は約0.9秒から約0.4秒へ、ネコが顔を出している時間は約1.2秒から約0.65秒へ、30秒かけて少しずつ短くなります。後半は複数のネコが同時に出ることもあります。',
    },
    {
      question: 'ベストスコアはどこに保存されますか？',
      answer:
        'お使いのブラウザのlocalStorageにだけ保存され、サーバーには送信されません。ブラウザのデータを消去する、別のブラウザや端末で開く、プライベートモードで遊ぶ場合は記録が引き継がれません。',
    },
    {
      question: 'スマホでも遊べますか？画面が動いたりしませんか？',
      answer:
        'タップで遊べます。ゲーム中は盤面でのスクロールやダブルタップ拡大が起きないようにしています。盤面の外はこれまで通りスクロールできます。',
    },
  ],
  en: [
    {
      question: 'How is the score counted?',
      answer:
        'Your score is the number of cats you hit while they are out. Hitting an empty hole does not reduce it, but it counts as a miss and lowers your accuracy. Hitting the same cat twice only counts once.',
    },
    {
      question: 'How much harder does the game get?',
      answer:
        'Over the 30 seconds, the gap between appearances shrinks from about 0.9 s to about 0.4 s, and each cat stays up for about 1.2 s at first and about 0.65 s at the end. Later on, several cats can be out at once.',
    },
    {
      question: 'Where is my best score stored?',
      answer:
        "Only in your browser's localStorage; nothing is sent to a server. It does not carry over if you clear browser data, switch browsers or devices, or play in private mode.",
    },
    {
      question:
        'Does it work on a phone without the page scrolling or zooming?',
      answer:
        'Yes, you can play by tapping. While a game is running, the board does not scroll or zoom on double-tap. The rest of the page scrolls as usual.',
    },
  ],
};
