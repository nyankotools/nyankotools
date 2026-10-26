import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '操作方法は？キーボードだけでも遊べますか？',
      answer:
        'ゲーム画面のクリック・タップ、スペースキー、上矢印キー（↑）のどれでも猫が羽ばたきます。キーボードだけでも遊べます。最初の1回の操作でゲームが始まります。',
    },
    {
      question: 'スコアはどのように数えますか？',
      answer:
        '猫が土管のすき間を通り抜けて、土管の右端を越えるたびに1点です。土管や地面に当たるとゲームオーバーになります。画面の上端に頭が当たっても終了せず、そこで止まります。',
    },
    {
      question: 'ベストスコアはどこに保存されますか？',
      answer:
        'お使いのブラウザのlocalStorageにだけ保存され、サーバーには送信されません。ブラウザのデータを消去する、別のブラウザや端末で開く、プライベートモードで遊ぶ場合は記録が引き継がれません。',
    },
    {
      question: '端末によって難しさや速さが変わりますか？',
      answer:
        '変わりません。猫と土管の動きは経過時間をもとに計算しているので、画面の更新頻度（60Hzや120Hz）が違っても同じ速さで進みます。ただし処理が重くて描画が遅れると、操作とのずれを感じることがあります。',
    },
  ],
  en: [
    {
      question: 'What are the controls? Can I play with just the keyboard?',
      answer:
        'Click or tap the game screen, or press Space or the up arrow key, to make the cat flap. You can play with only the keyboard. Your first input starts the game.',
    },
    {
      question: 'How is the score counted?',
      answer:
        'You get one point each time the cat passes through a gap and clears the right edge of the pipe. Hitting a pipe or the ground ends the game. Bumping the top of the screen does not end it; the cat just stops there.',
    },
    {
      question: 'Where is my best score stored?',
      answer:
        "Only in your browser's localStorage; nothing is sent to a server. It does not carry over if you clear browser data, switch browsers or devices, or play in private mode.",
    },
    {
      question: 'Does the speed or difficulty change on different devices?',
      answer:
        'No. Movement is calculated from elapsed time, so the game runs at the same speed on 60 Hz and 120 Hz screens. If a slow device delays drawing, the controls may feel slightly off.',
    },
  ],
};
