import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '三目並べは必勝法がありますか？',
      answer:
        'お互いに最善を尽くすと必ず引き分けになります。先手が角か中央に置き、後手がそれに正しく応じれば引き分けです。相手がミスをしたとき（辺を取る、フォークを許すなど）に勝てるチャンスが生まれます。',
    },
    {
      question: '「最強」のCPUに勝てますか？',
      answer:
        '勝てません。「最強」はミニマックス法ですべての局面を読み切るため、先手でも後手でも負けません。人間にできるのは引き分けまでです。勝つ練習をしたいときは「ふつう」を選んでください。',
    },
    {
      question: '「ふつう」と「かんたん」の違いは何ですか？',
      answer:
        '「かんたん」は空きマスからランダムに選びます。「ふつう」は、1手で勝てるなら勝ち、あなたが次に勝てるならそのマスを防ぎ、それ以外はランダムに打ちます。そのためフォーク（2本同時のリーチ）を作れば勝てます。',
    },
    {
      question: '先手と後手はどちらが有利ですか？',
      answer:
        '先手のほうが有利とされ、角か中央を取れば負けにくくなります。後手は、先手が角に置いたら必ず中央を取るのが基本です。このツールでは先手が×、後手が○です。',
    },
    {
      question: '途中経過は保存されますか？',
      answer:
        '保存されません。対局はページを開いている間だけ有効で、再読み込みすると新しいゲームになります。このツールはサーバーにもデータを送らず、すべてブラウザ内で動きます。',
    },
  ],
  en: [
    {
      question: 'Is there a winning strategy in Tic-Tac-Toe?',
      answer:
        'With perfect play from both sides, the game is always a draw. If the first player opens in a corner or the center and the second player answers correctly, nobody wins. Wins come from mistakes, such as taking an edge too early or allowing a fork.',
    },
    {
      question: 'Can I beat the Unbeatable level?',
      answer:
        'No. Unbeatable searches every position with minimax, so it never loses as first or second player. The best you can do is draw. Choose Normal if you want to practice winning.',
    },
    {
      question: 'What is the difference between Normal and Easy?',
      answer:
        'Easy picks a random empty square. Normal takes a winning move if it has one, blocks your winning move if you have one, and otherwise plays at random. That means you can beat it by creating a fork, two threats at once.',
    },
    {
      question: 'Is it better to go first or second?',
      answer:
        'Going first is a slight advantage, and starting in a corner or the center is hard to lose with. As the second player, take the center when the opponent opens in a corner. In this tool the first player is X and the second is O.',
    },
    {
      question: 'Is my game saved?',
      answer:
        'No. A game lasts only while the page is open; reloading starts a new one. The tool runs entirely in your browser and sends no data to a server.',
    },
  ],
};
