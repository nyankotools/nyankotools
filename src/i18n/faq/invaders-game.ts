import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '弾が1発しか撃てないのはなぜですか？',
      answer:
        '定番のインベーダーゲームと同じく、自機の弾は画面に1発だけです。弾が敵・トーチカに当たるか画面の上へ出ると、次の弾を撃てます。連打せず、狙って撃つのがコツです。',
    },
    {
      question: 'どうなるとゲームオーバーですか？',
      answer:
        '敵の弾に3回当たって残機がなくなるか、降りてきた敵が自機の高さまで届くとゲームオーバーです。敵が減るほど隊列は速くなるので、端の列から崩して降りる回数を減らすのも手です。',
    },
    {
      question: 'スマホで遊べますか？',
      answer:
        'はい。画面下の「←」「→」「発射」ボタンで操作できます。ボタンは押し続けると動き続け、「発射」は押し続けると連続して撃ちます。スマホを横向きにすると画面が広くなります。',
    },
    {
      question: '別のタブを開いたら止まってしまいました',
      answer:
        'タブを切り替えたり、画面から離れたりすると、気づかないうちにやられないよう自動で一時停止します。「再開」を押すか、スペースキーで続けられます。',
    },
    {
      question: 'ベストスコアはどこに保存されますか？',
      answer:
        'このブラウザのローカルストレージにだけ保存され、サーバーには送信されません。ブラウザのデータを消去したり、別の端末・ブラウザで遊んだりすると引き継がれません。',
    },
  ],
  en: [
    {
      question: 'Why can I only fire one shot at a time?',
      answer:
        'As in the classic arcade game, only one of your shots can be on screen at once. You can fire again when it hits an enemy or a shield, or leaves the top of the screen, so aim instead of mashing the button.',
    },
    {
      question: 'When is it game over?',
      answer:
        'When you have been hit three times and run out of lives, or when the descending fleet reaches the height of your cannon. The fleet speeds up as it thins out, so clearing the outer columns first reduces how often it drops.',
    },
    {
      question: 'Can I play on a phone?',
      answer:
        'Yes. Use the on-screen "←", "→" and "Fire" buttons below the screen. Holding a move button keeps moving, and holding "Fire" keeps shooting. Rotating the phone to landscape gives you a bigger screen.',
    },
    {
      question: 'The game stopped when I opened another tab',
      answer:
        'The game pauses automatically when you switch tabs or leave the page so that you are not hit while away. Press "Resume" or the space bar to continue.',
    },
    {
      question: 'Where is my best score stored?',
      answer:
        'Only in this browser’s local storage; nothing is sent to a server. It is not carried over if you clear site data or play on a different browser or device.',
    },
  ],
};
