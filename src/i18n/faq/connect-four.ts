import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '盤面の大きさとルールを教えてください。',
      answer:
        '7列×6段の盤に、赤と黄の石を交互に落とします。石は重力で選んだ列の一番下に止まります。縦・横・斜めのどれかに自分の石を4つ並べた方が勝ちで、盤面が全部埋まったら引き分けです。',
    },
    {
      question: 'CPUの強さの違いは何ですか？',
      answer:
        '「かんたん」は落とせる列からランダムに選びます。「ふつう」は4手先、「つよい」は7手先まで読み、中央の列や3つ並びを重視して手を選びます。「つよい」でも完全に読み切るわけではないので、ダブルリーチを作れば勝てることがあります。',
    },
    {
      question: '先手と後手で有利不利はありますか？',
      answer:
        '標準の7×6盤では、先手が中央の列から正しく打ち続けると必ず勝てることが知られています。ただし実際に完璧に打つのは難しく、このCPUも完璧ではないため、後手でも十分に勝てます。',
    },
    {
      question: '「待った」はどこまで戻せますか？',
      answer:
        'あなたの直前の手と、そのあとのCPUの手をまとめて取り消し、あなたの番に戻します。何度でも押せるので、ゲームの最初まで戻れます。',
    },
    {
      question: '途中経過は保存されますか？',
      answer:
        '保存されません。対局はページを開いている間だけ有効で、再読み込みすると新しいゲームになります。このツールはサーバーにもデータを送らず、すべてブラウザ内で動きます。',
    },
  ],
  en: [
    {
      question: 'What are the board size and the rules?',
      answer:
        'The grid has 7 columns and 6 rows. Red and yellow discs are dropped in turn and fall to the lowest free spot in the chosen column. The first to line up four of their own discs horizontally, vertically or diagonally wins; if the grid fills up, it is a draw.',
    },
    {
      question: 'What is the difference between the computer levels?',
      answer:
        'Easy picks a random open column. Normal looks 4 moves ahead and Hard looks 7, favoring the center column and open threes. Even Hard does not search the whole game, so creating a double threat can beat it.',
    },
    {
      question: 'Is going first an advantage?',
      answer:
        'On the standard 7×6 grid, the first player can force a win by starting in the center column and playing perfectly. In practice that is hard to do, and this computer is not perfect, so you can win as the second player too.',
    },
    {
      question: 'How far back can I undo?',
      answer:
        'Undo removes your last move and the computer’s reply and returns the turn to you. You can press it repeatedly to go all the way back to the start of the game.',
    },
    {
      question: 'Is my game saved?',
      answer:
        'No. A game lasts only while the page is open; reloading starts a new one. The tool runs entirely in your browser and sends no data to a server.',
    },
  ],
};
