import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'リバーシとオセロは同じゲームですか？',
      answer:
        'ルールは基本的に同じです。「オセロ」は日本の商標で、一般的な名称としてはリバーシと呼ばれます。このページは初期配置を含め、標準的な8×8の盤面のルールで遊べます。',
    },
    {
      question: '置ける場所がないときはどうなりますか？',
      answer:
        '置ける場所がない側は自動でパスになり、相手が続けて打ちます。両方とも置けなくなるか、盤面が全部埋まったらゲーム終了で、石の多い方が勝ちです。同数なら引き分けです。',
    },
    {
      question: 'CPUの強さの違いは何ですか？',
      answer:
        '「かんたん」は置ける場所からランダムに選びます。「ふつう」「つよい」「最強」は盤面を2手・4手・6手先まで読み、角を取る・相手の置ける場所を減らすといった基準で手を選びます。最強でも専用ソフトほどの強さではありません。',
    },
    {
      question: '「待った」で戻せるのはどこまでですか？',
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
      question: 'Are Reversi and Othello the same game?',
      answer:
        'The rules are essentially the same. Othello is a trademarked name for a standardized version; the generic name is Reversi. This page uses the standard 8×8 board and starting position.',
    },
    {
      question: 'What happens when a player has no legal move?',
      answer:
        'That side passes automatically and the opponent moves again. The game ends when neither side can move or the board is full, and the player with more discs wins. Equal counts are a draw.',
    },
    {
      question: 'What is the difference between the computer levels?',
      answer:
        'Easy picks a random legal move. Normal, Hard and Expert search 2, 4 and 6 moves ahead and favor corners and limiting your options. Even Expert is not as strong as dedicated Othello programs.',
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
