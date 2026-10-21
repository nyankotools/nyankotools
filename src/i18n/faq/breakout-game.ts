import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ボールの角度はどう決まりますか？',
      answer:
        'パドルのどこで返すかで決まります。中央なら真上に、左右の端に近いほど斜めに飛びます。ブロックや壁では入射角どおりに反射します。端で返して狙った場所を崩すのがコツです。',
    },
    {
      question: 'スマホで遊べますか？',
      answer:
        'はい。盤面を指でなぞるとパドルがついてきて、タップでボールを打ち出せます。画面下の「←」「→」「発射」ボタンでも操作できます。盤面の上では画面がスクロールしないので、スクロールは盤面の外側でしてください。',
    },
    {
      question: 'どうなるとゲームオーバーですか？',
      answer:
        'ボールを3回下に落とすとゲームオーバーです。落とすたびに残機が1つ減り、ボールはパドルの上で待機します。ブロックを全部崩すと次のステージへ進みます。',
    },
    {
      question: '別のタブを開いたら止まってしまいました',
      answer:
        'タブを切り替えたり、画面から離れたりすると、気づかないうちにボールを落とさないよう自動で一時停止します。「再開」を押すか、スペースキーで続けられます。',
    },
    {
      question: 'ベストスコアはどこに保存されますか？',
      answer:
        'このブラウザのローカルストレージにだけ保存され、サーバーには送信されません。ブラウザのデータを消去したり、別の端末・ブラウザで遊んだりすると引き継がれません。',
    },
  ],
  en: [
    {
      question: 'How is the ball’s angle decided?',
      answer:
        'By where it meets the paddle: the center sends it straight up, and the closer to an edge, the sharper the angle. Walls and bricks reflect it normally. Use the paddle edges to aim at the bricks you want to clear.',
    },
    {
      question: 'Can I play on a phone?',
      answer:
        'Yes. Drag your finger across the board and the paddle follows; tap to launch the ball. You can also use the on-screen "←", "→" and "Launch" buttons. The page does not scroll while you touch the board, so scroll from outside it.',
    },
    {
      question: 'When is it game over?',
      answer:
        'When you have dropped the ball three times. Each drop costs one life and the next ball waits on the paddle. Clearing every brick takes you to the next level.',
    },
    {
      question: 'The game stopped when I opened another tab',
      answer:
        'The game pauses automatically when you switch tabs or leave the page so that you do not lose the ball while away. Press "Resume" or the space bar to continue.',
    },
    {
      question: 'Where is my best score stored?',
      answer:
        'Only in this browser’s local storage; nothing is sent to a server. It is not carried over if you clear site data or play on a different browser or device.',
    },
  ],
};
