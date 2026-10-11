import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface Game2048PageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  sizeLabel: string;
  size4: string;
  size5: string;
  size6: string;
  newGame: string;
  undo: string;
  scoreLabel: string;
  bestScoreLabel: string;
  maxTileLabel: string;
  boardLabel: string;
  controlsLabel: string;
  moveUp: string;
  moveDown: string;
  moveLeft: string;
  moveRight: string;
  /** {n} を置換して表示する */
  tileLabel: string;
  started: string;
  undone: string;
  /** 2048 を作った直後に表示する */
  won: string;
  /** {score} を置換して表示する */
  gameOver: string;
  resetRecords: string;
  recordsCleared: string;
  bestHeading: string;
  bestNone: string;
  /** {score} {tile} を置換して表示する */
  bestValue: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const game2048Content: Record<Locale, Game2048PageContent> = {
  ja: {
    title: '2048｜スワイプ・矢印キーで遊べる無料ブラウザゲーム（4×4〜6×6）',
    description:
      '数字タイルを合体させて2048を目指す定番パズル「2048」をブラウザで遊べます。スワイプ・矢印キー・WASD・画面のボタンに対応し、4×4・5×5・6×6から選択可能。1手戻す機能とベストスコア記録付き。インストール・登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: '2048｜数字を合体させて2048を目指すパズルゲーム',
    introHtml:
      '同じ数字のタイルをぶつけて合体させ、「2048」のタイルを作るパズルゲームです。スマホではスワイプ、パソコンでは矢印キー（またはWASD）で操作できます。盤面は4×4・5×5・6×6から選べ、1手だけ戻す機能と、大きさごとのベストスコア記録も付いています。ほかのパズルでは <a href="/tools/slide-puzzle/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スライドパズル</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '盤面の大きさ（4×4・5×5・6×6）を選びます。選ぶとすぐに新しいゲームが始まります。',
      '矢印キー（またはWASD）、盤面の上でのスワイプ、画面の矢印ボタンのいずれかで、全タイルを上下左右へ滑らせます。同じ数字がぶつかると1つに合体し、合体した数がスコアに加算されます。',
      '動かすたびに空きマスへ新しいタイル（2または4）が1枚出ます。「2048」のタイルを作ると達成ですが、そのまま続けて高得点を狙えます。',
      '間違えたら「元に戻す」で1手だけ戻せます。動かせなくなるとゲームオーバーです。「新しいゲーム」で最初からやり直せます。',
    ],
    sizeLabel: '盤面の大きさ',
    size4: '4×4（標準）',
    size5: '5×5',
    size6: '6×6',
    newGame: '新しいゲーム',
    undo: '元に戻す',
    scoreLabel: 'スコア',
    bestScoreLabel: 'ベストスコア',
    maxTileLabel: '最大タイル',
    boardLabel: '2048の盤面',
    controlsLabel: '移動ボタン',
    moveUp: '上へ動かす',
    moveDown: '下へ動かす',
    moveLeft: '左へ動かす',
    moveRight: '右へ動かす',
    tileLabel: 'タイル{n}',
    started: '新しいゲームを始めました。',
    undone: '1手戻しました。',
    won: '2048を達成しました！このまま続けられます。',
    gameOver: 'ゲームオーバーです。スコアは {score} でした。',
    resetRecords: '記録をリセット',
    recordsCleared: 'ベスト記録をリセットしました。',
    bestHeading: 'ベスト記録',
    bestNone: '記録なし',
    bestValue: 'スコア {score}・最大タイル {tile}',
    notesHeading: '注意事項',
    notes: [
      '操作は端末のブラウザ上だけで処理され、サーバーには何も送信されません。',
      '新しいタイルは空きマスのうち1か所へランダムに出現し、2が90％、4が10％の確率です。',
      '「元に戻す」は直前の1手だけ戻せます。連続して戻すことはできません。戻してもベストスコアは下がりません。',
      '「2048」を作ったあとも、動かせなくなるまで続けられます。タイルは4096、8192…と大きくなります。',
      'ベスト記録（最高スコアと最大タイル）は盤面の大きさごとに、このブラウザのローカルストレージへ保存されます。ブラウザのデータを消去したり、別の端末・ブラウザを使ったりすると引き継がれません。',
      'ゲームの途中経過は保存されません。ページを再読み込みすると新しいゲームになります。スマホでは、盤面の上でのスワイプ中は画面がスクロールしません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '2048',
        description:
          '2014年に公開されて世界的に広まった、数字タイルを合体させるパズルゲームです。同じ数字のタイルが隣り合った状態で動かすと合計の数字のタイルになり、2048のタイルを作るのが基本の目標です。',
      },
      {
        term: 'スワイプ',
        description:
          'タッチ画面を指でなぞる操作です。このツールでは、盤面の上でなぞった向きにすべてのタイルが動きます。短すぎる動きは、タップと区別するため無視されます。',
      },
    ],
  },
  en: {
    title: '2048 Game – Play Free Online, Swipe or Arrow Keys',
    description:
      'Play 2048 in your browser: merge tiles to reach 2048. Swipe or use arrow keys, 4×4 to 6×6 boards, undo and best scores. Nothing is sent to a server.',
    h1: '2048 – Merge Tiles to Reach 2048',
    introHtml:
      'The classic number puzzle: slide the tiles so equal numbers merge, and try to build the 2048 tile. Swipe on a phone or use the arrow keys (or WASD) on a computer. Choose a 4×4, 5×5 or 6×6 board; you also get a one-move undo and a best score for each size. Looking for another puzzle? Try the <a href="/en/tools/slide-puzzle/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Sliding Puzzle</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a board size (4×4, 5×5 or 6×6). A new game starts as soon as you pick one.',
      'Slide all tiles up, down, left or right with the arrow keys (or WASD), by swiping on the board, or with the on-screen arrow buttons. Equal tiles merge into one and the merged value is added to your score.',
      'After each move a new tile (2 or 4) appears in an empty cell. Making the 2048 tile wins, but you can keep playing for a higher score.',
      'Press "Undo" to take back your last move once. The game ends when no move is possible. Press "New game" to start over.',
    ],
    sizeLabel: 'Board size',
    size4: '4×4 (standard)',
    size5: '5×5',
    size6: '6×6',
    newGame: 'New game',
    undo: 'Undo',
    scoreLabel: 'Score',
    bestScoreLabel: 'Best score',
    maxTileLabel: 'Max tile',
    boardLabel: '2048 board',
    controlsLabel: 'Move buttons',
    moveUp: 'Move up',
    moveDown: 'Move down',
    moveLeft: 'Move left',
    moveRight: 'Move right',
    tileLabel: 'Tile {n}',
    started: 'A new game has started.',
    undone: 'Undid the last move.',
    won: 'You made 2048! You can keep playing.',
    gameOver: 'Game over. Your score was {score}.',
    resetRecords: 'Reset records',
    recordsCleared: 'Best records have been reset.',
    bestHeading: 'Best records',
    bestNone: 'No record yet',
    bestValue: 'Score {score} · max tile {tile}',
    notesHeading: 'Notes',
    notes: [
      'Everything runs in your browser and nothing is sent to a server.',
      'A new tile appears in a random empty cell: a 2 with 90% probability and a 4 with 10%.',
      '"Undo" takes back only the last move; you cannot undo several moves in a row. Undoing does not lower your best score.',
      'After you make 2048 you can keep going until no move is possible; tiles continue to 4096, 8192 and beyond.',
      'Best records (highest score and largest tile) are stored per board size in this browser’s local storage. They are not carried over if you clear site data or switch browsers or devices.',
      'Game progress is not saved. Reloading the page starts a new game. On touch screens the page does not scroll while you swipe on the board.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: '2048',
        description:
          'A sliding number puzzle in which equal tiles merge into their sum when you move. The usual goal is to create the 2048 tile before the board fills up.',
      },
      {
        term: 'Swipe',
        description:
          'Dragging a finger across a touch screen. Here, all tiles move in the direction you swipe on the board. Very short movements are ignored so that taps are not mistaken for swipes.',
      },
    ],
  },
};
