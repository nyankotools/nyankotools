import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '出題される問題の答えは必ず1つですか？',
      answer:
        'はい。問題を作るとき、マスを1つ消すたびにソルバーで解の数を数え、解が2つ以上になる消し方は取り消しています。そのため、どの問題も論理だけで解ける唯一解です。',
    },
    {
      question: '難易度はどうやって決まっていますか？',
      answer:
        '最初から入っている数字の数で調整しています（簡単は約40、普通は約32、難しいは約26）。数字が少ないほど手がかりが減って難しくなりますが、必要な解法のレベルまで厳密に分類しているわけではありません。',
    },
    {
      question: 'メモ（候補）の使い方は？',
      answer:
        '「メモ」をオンにしたまま空きマスを選んで数字を押すと、そのマスに小さく候補が書き込まれます。同じ数字をもう一度押すと消えます。通常入力でそのマスに数字を入れると、同じ行・列・ブロックのマスからその数字のメモが自動で消えます。',
    },
    {
      question: 'ヒントと誤りチェックの違いは？',
      answer:
        'ヒントは空きマスを1つ選び、正解の数字をそのマスに入れます（マスを選んでいればそのマスが対象です）。誤りチェックはすでに入力した数字を唯一解と照合し、違うマスを赤く表示するだけで、数字は直しません。',
    },
    {
      question: '途中でページを閉じるとどうなりますか？',
      answer:
        '進行状況は保存されず、再読み込みすると新しい問題になります。プレイの内容がサーバーに送信されることもありません。',
    },
  ],
  en: [
    {
      question: 'Does every puzzle have exactly one solution?',
      answer:
        'Yes. While a puzzle is built, the solver counts solutions after every cell is removed, and any removal that would allow two or more solutions is undone. Each puzzle can therefore be solved by logic alone.',
    },
    {
      question: 'How is the difficulty decided?',
      answer:
        'By the number of given cells: about 40 for Easy, 32 for Medium and 26 for Hard. Fewer givens means fewer clues and usually a harder puzzle, but puzzles are not graded by the solving techniques they require.',
    },
    {
      question: 'How do pencil notes work?',
      answer:
        'Keep “Notes” on, select an empty cell and press a number to pencil it in; press the same number again to remove it. When you place a number normally, matching notes are cleared automatically from the same row, column and box.',
    },
    {
      question: 'What is the difference between Hint and Check mistakes?',
      answer:
        'Hint fills one empty cell with the correct number (the selected cell if you picked one). Check mistakes compares what you have entered with the unique solution and highlights wrong cells in red without changing anything.',
    },
    {
      question: 'What happens if I close the page mid-game?',
      answer:
        'Progress is not saved, so reloading gives you a new puzzle. Nothing about your game is sent to any server.',
    },
  ],
};
