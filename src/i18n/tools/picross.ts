import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PicrossPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  modeLabel: string;
  modePlay: string;
  modeCreate: string;
  sizeLabel: string;
  sizeSmall: string;
  sizeMedium: string;
  sizeLarge: string;
  toolLabel: string;
  toolFill: string;
  toolMark: string;
  newPuzzle: string;
  reset: string;
  showSolution: string;
  /** 遊ぶ盤面の代替テキスト。{size} を置換する */
  playBoardLabel: string;
  /** 絵を作る盤面の代替テキスト。{size} {filled} を置換する */
  draftBoardLabel: string;
  solvedMessage: string;
  solutionShown: string;
  clearDraft: string;
  makePuzzle: string;
  dropHint: string;
  imageLoadFailed: string;
  uniqueOk: string;
  uniqueMultiple: string;
  uniqueEmpty: string;
  createHint: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const picrossContent: Record<Locale, PicrossPageContent> = {
  ja: {
    title: 'お絵かきロジック（ピクロス）｜問題作成もできる無料パズル',
    description:
      'お絵かきロジック（ピクロス・ノノグラム）をブラウザで遊べる無料ツールです。5×5・10×10・15×15の問題をランダムに出題し、解が1通りの問題だけを作ります。自分で描いた絵や画像から問題を作ることもできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'お絵かきロジック（ピクロス）｜解が1通りの問題で遊べて、自分でも作れるパズル',
    introHtml:
      '行と列の数字をヒントに、黒く塗るマスを推理して絵を完成させるパズルです。数字は、その行（列）で黒マスが何個ずつ連続しているかを表します。出題される問題はすべて解が1通りに決まるので、運に頼らず論理だけで解けます。自分で描いた絵や画像から問題を作ることもできます。ほかのパズルは <a href="/tools/maze-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">迷路ジェネレーター</a> や <a href="/tools/word-search-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ワードサーチ作成</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「遊ぶ」で盤面の大きさを選ぶと、問題が出題されます。「新しい問題」で別の問題に変えられます。',
      '行と列の数字を手がかりに、黒マスだと思うマスをクリック（またはドラッグ）して塗ります。白マスだと分かったマスは「×印」で印を付けておくと便利です。',
      'すべての数字が満たされると完成です。行き詰まったら「リセット」でやり直すか、「答えを見る」で答えを確認できます。',
      '自分で問題を作るときは「自分で作る」に切り替え、マスを塗って絵を描くか、画像を読み込みます。「この絵で遊ぶ」を押すと、その絵の問題で遊べます。',
    ],
    modeLabel: 'モード',
    modePlay: '遊ぶ',
    modeCreate: '自分で作る',
    sizeLabel: '盤面の大きさ',
    sizeSmall: '5×5（かんたん）',
    sizeMedium: '10×10（ふつう）',
    sizeLarge: '15×15（むずかしい）',
    toolLabel: '塗り方',
    toolFill: '塗る',
    toolMark: '×印',
    newPuzzle: '新しい問題',
    reset: 'リセット',
    showSolution: '答えを見る',
    playBoardLabel:
      'お絵かきロジックの盤面。{size}×{size}マスで、行と列の数字がヒントです。',
    draftBoardLabel:
      '問題にする絵の盤面。{size}×{size}マスで、黒く塗ったマスは{filled}個です。',
    solvedMessage: '完成しました！すべての数字が満たされています。',
    solutionShown: '答えを表示しました。',
    clearDraft: '絵をクリア',
    makePuzzle: 'この絵で遊ぶ',
    dropHint:
      '画像をここにドラッグ＆ドロップするか、ファイルを選んでください。画像は選んだ大きさのマス目に縮小され、暗い部分が黒マスになります。',
    imageLoadFailed:
      '画像を読み込めませんでした。PNG・JPEG・WebP などの画像ファイルを選んでください。',
    uniqueOk: 'この絵から作る問題は、解が1通りに決まります。',
    uniqueMultiple:
      'この絵から作る問題は、解が複数あります（または判定できませんでした）。遊ぶことはできますが、答えが絵と違う形で完成することがあります。',
    uniqueEmpty: '黒マスがありません。マスを塗って絵を描いてください。',
    createHint:
      'マスをクリック（またはドラッグ）して絵を描きます。もう一度クリックすると白に戻ります。',
    notesHeading: '注意事項',
    notes: [
      '計算はすべて端末のブラウザ上で行い、画像を含め、サーバーには何も送信されません。',
      '「遊ぶ」で出題される問題は、行と列の数字だけから解が1通りに決まるものだけです。当てずっぽうの推測は不要で、論理だけで解けます（ただし、手がかりが少ない箇所では先の見通しが必要になることがあります）。',
      '「自分で作る」で作った問題は、解が複数になることがあります。画面に判定結果を表示しますが、複数の場合でも、数字をすべて満たせば完成として扱います。',
      '画像は暗い部分が黒マスになるため、黒一色のロゴや白黒のイラストが向いています。写真は輪郭が崩れやすく、解が複数になることが多くなります。',
      '盤面の保存・共有機能はありません。ページを再読み込みすると、問題や描いた絵は消えます。',
      '盤面はマウス・タッチでの操作が前提です。右クリックでも×印を付けられます。キーボードでは「新しい問題」「リセット」などのボタン操作のみ行えます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'お絵かきロジック（ピクロス・ノノグラム）',
        description:
          '行と列に書かれた数字をヒントに、マス目を黒く塗って絵を完成させるパズルです。ピクロス、ノノグラム、イラストロジックなど、販売元や地域によって呼び名が異なります。数字の並びは、その行（列）に黒マスが何個ずつ連続しているかを、上（左）から順に表します。',
      },
      {
        term: 'ヒントの数字',
        description:
          '「3 1」なら、黒マスが3個連続したかたまりと1個のかたまりがこの順に並び、間は1マス以上空くことを表します。黒マスが1つもない行（列）は「0」と書きます。',
      },
      {
        term: '唯一解',
        description:
          'ヒントを満たす絵がたった1つに決まることです。唯一解でない問題では、推理だけでは決められないマスが残り、答えが人によって変わってしまいます。このツールの出題は、解を数え上げて唯一解であることを確認しています。',
      },
      {
        term: '×印（白マスの印）',
        description:
          '「ここは黒ではない」と分かったマスに付ける印です。答えには影響しませんが、推理の整理に役立ちます。',
      },
    ],
  },
  en: {
    title: 'Picross / Nonogram Puzzle – Play Free & Make Your Own',
    description:
      'Play picross (nonogram) puzzles in your browser: random 5×5 to 15×15 puzzles with one solution each, or make one from your own drawing or image.',
    h1: 'Picross (Nonogram) – Play Single-Solution Puzzles or Make Your Own',
    introHtml:
      'Use the numbers beside each row and column to work out which squares to fill and reveal the picture. Each number is the length of an unbroken run of filled squares in that line. Every puzzle you are given has exactly one solution, so you can solve it by logic alone, with no guessing. You can also turn your own drawing or an image into a puzzle. Looking for more puzzles? Try the <a href="/en/tools/maze-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Maze Generator</a> or the <a href="/en/tools/word-search-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Word Search Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'In "Play", pick a board size and a puzzle appears. Press "New puzzle" to get a different one.',
      'Use the row and column numbers to decide which squares are black, then click (or drag) to fill them. Squares you know are white can be crossed out with "× mark".',
      'When every number is satisfied the puzzle is complete. If you get stuck, press "Reset" to start over or "Show solution" to see the answer.',
      'To make your own, switch to "Create", then paint squares to draw a picture or load an image. Press "Play this picture" to play a puzzle made from it.',
    ],
    modeLabel: 'Mode',
    modePlay: 'Play',
    modeCreate: 'Create',
    sizeLabel: 'Board size',
    sizeSmall: '5×5 (Easy)',
    sizeMedium: '10×10 (Normal)',
    sizeLarge: '15×15 (Hard)',
    toolLabel: 'Paint with',
    toolFill: 'Fill',
    toolMark: '× mark',
    newPuzzle: 'New puzzle',
    reset: 'Reset',
    showSolution: 'Show solution',
    playBoardLabel:
      'Picross board, {size} by {size} squares, with number clues for each row and column.',
    draftBoardLabel:
      'Drawing board for your puzzle, {size} by {size} squares, with {filled} filled.',
    solvedMessage: 'Solved! Every number is satisfied.',
    solutionShown: 'The solution is shown.',
    clearDraft: 'Clear drawing',
    makePuzzle: 'Play this picture',
    dropHint:
      'Drag and drop an image here, or choose a file. It is shrunk to the board size and dark areas become black squares.',
    imageLoadFailed:
      'Could not load that image. Please choose an image file such as PNG, JPEG or WebP.',
    uniqueOk: 'The puzzle made from this picture has exactly one solution.',
    uniqueMultiple:
      'The puzzle made from this picture has more than one solution (or could not be checked). You can still play it, but it may be completed with a picture different from yours.',
    uniqueEmpty:
      'There are no black squares. Paint some squares to draw a picture.',
    createHint:
      'Click or drag on the squares to draw. Click a black square again to turn it white.',
    notesHeading: 'Notes',
    notes: [
      'Everything is calculated in your browser. Nothing, including images, is sent to a server.',
      'Puzzles in "Play" are only ever ones whose numbers lead to exactly one solution, so logic is enough and no guessing is needed (though sparse areas may need you to think a few steps ahead).',
      'A puzzle made in "Create" may have more than one solution. The result of the check is shown, and even then the puzzle counts as complete once every number is satisfied.',
      'Dark areas of an image become black squares, so solid logos and black-and-white illustrations work best. Photos tend to lose their outlines and often have multiple solutions.',
      'There is no save or share feature. Reloading the page clears the puzzle and your drawing.',
      'The board is designed for mouse and touch input; right-click also places a × mark. From the keyboard you can use the buttons such as "New puzzle" and "Reset".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Picross / Nonogram',
        description:
          'A logic puzzle in which you fill squares of a grid using the numbers beside each row and column, revealing a picture. It is also sold as Griddlers, Hanjie or Paint by Numbers. The numbers give the length of each unbroken run of filled squares, in order from top (or left).',
      },
      {
        term: 'Clue numbers',
        description:
          'A clue of "3 1" means a run of three filled squares followed, after at least one empty square, by a run of one. A line with no filled squares is written as "0".',
      },
      {
        term: 'Unique solution',
        description:
          'The clues are satisfied by exactly one picture. A puzzle without a unique solution leaves squares that logic cannot decide, so the answer would vary by player. The puzzles here are checked by counting solutions to confirm there is only one.',
      },
      {
        term: '× mark (white square)',
        description:
          'A mark for a square you know is not black. It does not affect the answer but helps you keep track of your deductions.',
      },
    ],
  },
};
