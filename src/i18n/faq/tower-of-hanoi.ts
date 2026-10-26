import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '最短手数はどうやって決まりますか？',
      answer:
        '円盤がn枚のとき、最短手数は2のn乗−1手です。3枚なら7手、5枚なら31手、8枚なら255手です。これより少ない手数でクリアすることはできません。',
    },
    {
      question: '自動で解くとき、今の盤面から続きを解いてくれますか？',
      answer:
        'いいえ。盤面を最初の状態に戻してから、最適解を最初から再生します。再生中は手動で動かせず、「停止」を押すとその時点から自分で続きを操作できます。',
    },
    {
      question: 'ドラッグしなくても遊べますか？',
      answer:
        'はい。動かす円盤がある杭をクリック（タップ）し、次に移動先の杭をクリックするだけで移動できます。キーボードでは、杭にフォーカスしてEnter/Spaceを押すか、数字キー1〜3で杭を選べます。',
    },
    {
      question: 'ベスト手数はどこに保存されますか？',
      answer:
        '円盤の枚数ごとに、お使いのブラウザのlocalStorageにだけ保存され、サーバーには送信されません。自動解法でクリアした場合は記録されません。',
    },
  ],
  en: [
    {
      question: 'How is the minimum number of moves determined?',
      answer:
        'With n discs the minimum is 2^n − 1 moves: 7 for 3 discs, 31 for 5 discs and 255 for 8 discs. It is not possible to finish in fewer.',
    },
    {
      question: 'Does auto-solve continue from my current position?',
      answer:
        'No. It returns the board to the start and plays the optimal solution from the beginning. You cannot move while it plays, but pressing "Stop" lets you carry on from that position yourself.',
    },
    {
      question: 'Can I play without dragging?',
      answer:
        'Yes. Click or tap the peg holding the disc, then click the peg to move it to. With a keyboard, focus a peg and press Enter or Space, or use the number keys 1 to 3 to select a peg.',
    },
    {
      question: 'Where are my best moves stored?',
      answer:
        "Per disc count, only in your browser's localStorage; nothing is sent to a server. Puzzles finished with auto-solve are not recorded.",
    },
  ],
};
