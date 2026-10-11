import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '2048を達成したら、ゲームは終わりますか？',
      answer:
        '終わりません。「2048」のタイルを作るとメッセージが出ますが、そのまま続けられます。タイルは4096、8192…と大きくなり、動かせなくなった時点でゲームオーバーになります。',
    },
    {
      question: 'どうなるとゲームオーバーですか？',
      answer:
        '盤面のすべてのマスが埋まり、かつ上下左右に同じ数字のタイルが隣り合っていない状態です。この状態ではどの向きに動かしても盤面が変わらないため、ゲームオーバーになります。',
    },
    {
      question: '新しく出るタイルはランダムですか？',
      answer:
        'はい。動かして盤面が変わるたびに、空きマスのうち1か所へランダムで1枚出ます。出る数字は2が90％、4が10％です。盤面が変わらない操作では新しいタイルは出ません。',
    },
    {
      question: 'スマホでスクロールしたいのに、盤面の上だと動かせません',
      answer:
        '盤面の上では、スワイプをタイルの操作に使うため画面がスクロールしません。盤面の外側（余白や見出しの部分）をなぞればスクロールできます。',
    },
    {
      question: '4×4・5×5・6×6でベスト記録は別々ですか？',
      answer:
        'はい。盤面の大きさごとに、最高スコアと最大タイルを別々に保存します。記録はこのブラウザのローカルストレージに保存され、「記録をリセット」で消せます。',
    },
  ],
  en: [
    {
      question: 'Does the game end when I make 2048?',
      answer:
        'No. A message appears when you create the 2048 tile, but you can keep playing. Tiles continue to 4096, 8192 and beyond, and the game ends only when no move is possible.',
    },
    {
      question: 'When is it game over?',
      answer:
        'When every cell is filled and no two equal tiles are adjacent horizontally or vertically. In that state no direction changes the board, so the game ends.',
    },
    {
      question: 'Are the new tiles random?',
      answer:
        'Yes. Every time a move changes the board, one tile appears in a random empty cell: a 2 with 90% probability, a 4 with 10%. A move that changes nothing does not add a tile.',
    },
    {
      question: 'I cannot scroll the page on my phone when touching the board',
      answer:
        'Swipes on the board are used to move the tiles, so the page does not scroll there. Swipe on the area outside the board (the margins or headings) to scroll.',
    },
    {
      question: 'Are best records separate for 4×4, 5×5 and 6×6?',
      answer:
        'Yes. The highest score and largest tile are saved separately for each board size in this browser’s local storage. "Reset records" clears them.',
    },
  ],
};
