import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '箱押しパズルのルールは？',
      answer:
        'プレイヤーは上下左右に1マスずつ歩け、箱に向かって歩くとその箱を1マス押せます。箱を引くことはできず、箱の先が壁や別の箱のときは押せません。すべての箱をゴール（○）に載せるとクリアです。',
    },
    {
      question: '箱が動かせなくなったらどうすればいい？',
      answer:
        '箱が隅や壁際に入ると、ゴールに運べなくなる（デッドロック）ことがあります。「1手戻す」で何手でもさかのぼれるので、押す前の位置まで戻して別の手順を試してください。最初からなら「リセット」です。',
    },
    {
      question: '手数と最短記録はどう数えますか？',
      answer:
        '歩いた回数と箱を押した回数の合計が手数です（「1手戻す」で戻した分は引かれます）。クリア時の手数が過去の記録より少なければ、ステージごとの最短記録として更新されます。',
    },
    {
      question: '記録はどこに保存されますか？',
      answer:
        'お使いのブラウザの localStorage にだけ保存され、サーバーには送信されません。別のブラウザや端末とは共有されず、ブラウザのデータを消去すると記録も消えます。プライベートモードでは、ページを閉じると消えることがあります。',
    },
    {
      question: 'スマホではどう操作しますか？',
      answer:
        '盤面を上下左右になぞる（スワイプ）か、盤面の下の矢印ボタンをタップして動かします。パソコンでは矢印キーまたは W/A/S/D キーが使えます。',
    },
  ],
  en: [
    {
      question: 'What are the rules of the box push puzzle?',
      answer:
        'You walk one square at a time up, down, left or right, and walking into a box pushes it one square. You cannot pull, and a box will not move if a wall or another box is behind it. Put every box on a goal (○) to clear the level.',
    },
    {
      question: 'What if a box gets stuck?',
      answer:
        'A box pushed into a corner or against a wall can become impossible to bring to a goal (a deadlock). "Undo" takes back as many moves as you like, so go back to before the push and try another route, or press "Reset" to restart the level.',
    },
    {
      question: 'How are moves and best records counted?',
      answer:
        'Every step and every push counts as one move, and moves you take back with "Undo" are subtracted. If the count when you clear a level is lower than your previous record, it becomes the new best for that level.',
    },
    {
      question: 'Where are my records stored?',
      answer:
        "Only in your browser's localStorage. Nothing is sent to a server. Records are not shared between browsers or devices, and clearing browser data removes them. In private browsing they may disappear when you close the tab.",
    },
    {
      question: 'How do I play on a phone?',
      answer:
        'Swipe up, down, left or right on the board, or tap the arrow buttons below it. On a computer, use the arrow keys or W/A/S/D.',
    },
  ],
};
