import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '6つ以上並べた場合（長連）は勝ちですか？',
      answer:
        '勝ちです。このページには禁じ手がなく、縦・横・斜めのいずれかに5つ以上並べば勝ちになります。三三・四四・長連を反則にする競技ルールとは異なります。',
    },
    {
      question: '先手（黒）は有利ですか？',
      answer:
        '禁じ手のない五目並べでは、先手が有利とされています。そのため初心者はまず先手（黒）、慣れてきたら後手（白）や「最強」のCPUに挑戦すると練習になります。',
    },
    {
      question: 'CPUの強さの違いは何ですか？',
      answer:
        '「かんたん」は石の近くからほぼランダムに打ちます。「ふつう」は1手の価値（自分の並びを伸ばす・相手の並びを止める）だけで選び、「つよい」は2手先、「最強」は4手先まで読みます。どの強さでも、5つ並べられる場面では必ず打ちます。',
    },
    {
      question: '引き分けになることはありますか？',
      answer:
        '15×15の225マスがすべて埋まって、どちらも5つ並べていなければ引き分けです。実際の対局ではほとんど起こりません。',
    },
    {
      question: '途中経過は保存されますか？',
      answer:
        '保存されません。対局はページを開いている間だけ有効で、再読み込みすると新しいゲームになります。このツールはサーバーにもデータを送らず、すべてブラウザ内で動きます。',
    },
  ],
  en: [
    {
      question: 'Does a row of six or more stones win?',
      answer:
        'Yes. This page has no restricted moves, so any row of five or more stones, horizontally, vertically or diagonally, wins. Competition rules that ban double-three, double-four and overlines for one side are not applied.',
    },
    {
      question: 'Does moving first give an advantage?',
      answer:
        'In Gomoku without restricted moves, the first player has a clear advantage. Beginners may want to start as black, then try playing second or beating the Expert level.',
    },
    {
      question: 'What is the difference between the computer levels?',
      answer:
        'Easy plays mostly at random near existing stones. Normal picks the move with the best immediate value (extending its own lines and blocking yours), Hard looks 2 moves ahead and Expert looks 4. At every level the computer takes a winning move when it has one.',
    },
    {
      question: 'Can the game end in a draw?',
      answer:
        'Yes, if all 225 points are filled and nobody has made five in a row. In practice it almost never happens.',
    },
    {
      question: 'Is my game saved?',
      answer:
        'No. A game lasts only while the page is open; reloading starts a new one. The tool runs entirely in your browser and sends no data to a server.',
    },
  ],
};
