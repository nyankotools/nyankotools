import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PegSolitairePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  typeLabel: string;
  typeEnglish: string;
  typeEuropean: string;
  boardLabel: string;
  undoButton: string;
  resetButton: string;
  remainingLabel: string;
  movesLabel: string;
  /** {row} {col} を置換して表示する */
  cellPeg: string;
  /** {row} {col} を置換して表示する */
  cellPegSelected: string;
  /** {row} {col} を置換して表示する */
  cellEmpty: string;
  /** {row} {col} を置換して表示する */
  cellTarget: string;
  statusStart: string;
  statusSelect: string;
  /** {n} を置換して表示する */
  statusSelected: string;
  statusNoMoves: string;
  /** {n} を置換して表示する */
  statusPerfect: string;
  /** {n} を置換して表示する */
  statusSolved: string;
  /** {n} を置換して表示する */
  statusStuck: string;
  rankGenius: string;
  rankGood: string;
  rankAverage: string;
  rankBeginner: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const pegSolitaireContent: Record<Locale, PegSolitairePageContent> = {
  ja: {
    title:
      'ペグソリティア｜無料ブラウザゲーム・英国式33穴／欧州式37穴・戻す機能付き',
    description:
      'ブラウザで遊べるペグソリティア。駒を飛び越えて取り、最後の1個を目指すパズルです。英国式33穴・欧州式37穴を選べ、残数表示と「1手戻す」に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ペグソリティア｜駒を飛び越えて最後の1個を目指すパズル',
    introHtml:
      '駒を別の駒の上で飛び越えて取り、盤上の駒をできるだけ減らすひとり用パズルです。理想は中央に1個だけ残すこと。盤面は英国式（33穴）と欧州式（37穴）から選べ、間違えたら1手ずつ戻せます。ほかのパズルでは <a href="/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">数独</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「盤面」で英国式（33穴）か欧州式（37穴）を選びます。最初は中央だけが空いています。',
      '動かしたい駒をクリック（タップ）すると、飛び越えて移動できる空き穴が強調されます。',
      '強調された穴をクリックすると、間の駒を取りながら移動します。縦と横にだけ飛べます。',
      '手を間違えたら「1手戻す」、最初からやり直すなら「リセット」を押します。動かせなくなるか、1個だけ残ると終了です。',
    ],
    typeLabel: '盤面',
    typeEnglish: '英国式（33穴）',
    typeEuropean: '欧州式（37穴）',
    boardLabel: 'ペグソリティアの盤面',
    undoButton: '1手戻す',
    resetButton: 'リセット',
    remainingLabel: '残り',
    movesLabel: '手数',
    cellPeg: '{row}行{col}列 駒',
    cellPegSelected: '{row}行{col}列 駒（選択中）',
    cellEmpty: '{row}行{col}列 空き',
    cellTarget: '{row}行{col}列 移動できる空き穴',
    statusStart: '駒をクリックして、飛び越える先を選びましょう。',
    statusSelect: '駒を選んでください。',
    statusSelected: '選択中。強調された穴をクリックすると移動します。',
    statusNoMoves: 'その駒は動かせません。',
    statusPerfect: '完全クリア！ 中央に1個だけ残りました（{n} 手）。',
    statusSolved: 'クリア！ 1個まで減らしました。中央に残すとさらに完璧です。',
    statusStuck: '動かせる駒がなくなりました。残り {n} 個。',
    rankGenius: '評価：天才',
    rankGood: '評価：優秀',
    rankAverage: '評価：普通',
    rankBeginner: '評価：もう少し',
    notesHeading: '注意事項',
    notes: [
      '駒は縦または横に隣り合う駒を飛び越え、その先の空き穴に着地します。斜めには動けません。',
      '残り1個で、それが中央にあれば完全クリアです。残り1個でも中央以外でもクリアとして扱います。',
      '評価は終了時の残数で決まります（1個＝天才、2個＝優秀、3〜4個＝普通、5個以上＝もう少し）。',
      '「1手戻す」は何手でもさかのぼれます。「リセット」または盤面の切り替えで初期配置に戻ります。',
      'ゲームの途中経過は保存されません。ページを再読み込みすると初期配置に戻ります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ペグソリティア',
        description:
          '穴の開いた盤に駒（ペグ）を並べ、ほかの駒を飛び越えて取りながら数を減らす、ひとり用のボードゲームです。17世紀のフランスで広まったとされ、「ソリティア」「ペグパズル」とも呼ばれます。',
      },
      {
        term: '英国式・欧州式',
        description:
          '英国式は十字形の33穴、欧州式は角を丸めた37穴の盤です。どちらも初期配置は中央だけが空きで、欧州式のほうが穴が多く、完全クリアはより難しいといわれます。',
      },
    ],
  },
  en: {
    title: 'Peg Solitaire – Free Online Puzzle with Undo',
    description:
      'Play peg solitaire in your browser. Jump pegs to remove them and leave one in the center. 33-hole and 37-hole boards, with undo. Nothing is uploaded.',
    h1: 'Peg Solitaire – Jump Pegs and Leave Just One',
    introHtml:
      'A one-player puzzle: jump a peg over a neighbor to capture it and clear the board down to as few pegs as you can. The perfect finish leaves a single peg in the center. Choose the English (33-hole) or European (37-hole) board, and step back one move at a time if you slip. Want another puzzle? Try <a href="/en/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Sudoku</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick the English (33 holes) or European (37 holes) board under "Board". Only the center hole is empty at the start.',
      'Click or tap a peg. The empty holes it can jump to are highlighted.',
      'Click a highlighted hole to jump there and capture the peg in between. Jumps go up, down, left or right only.',
      'Press "Undo" to take back a move or "Reset" to start over. The game ends when no jumps are left or one peg remains.',
    ],
    typeLabel: 'Board',
    typeEnglish: 'English (33 holes)',
    typeEuropean: 'European (37 holes)',
    boardLabel: 'Peg solitaire board',
    undoButton: 'Undo',
    resetButton: 'Reset',
    remainingLabel: 'Pegs left',
    movesLabel: 'Moves',
    cellPeg: 'Row {row}, column {col}, peg',
    cellPegSelected: 'Row {row}, column {col}, peg, selected',
    cellEmpty: 'Row {row}, column {col}, empty',
    cellTarget: 'Row {row}, column {col}, empty, can jump here',
    statusStart: 'Click a peg, then choose where to jump.',
    statusSelect: 'Select a peg.',
    statusSelected: 'Selected. Click a highlighted hole to jump.',
    statusNoMoves: 'That peg cannot move.',
    statusPerfect: 'Perfect! One peg left in the center ({n} moves).',
    statusSolved:
      'Solved! Down to one peg. Leave it in the center for a perfect finish.',
    statusStuck: 'No more jumps are possible. {n} pegs left.',
    rankGenius: 'Rank: Genius',
    rankGood: 'Rank: Excellent',
    rankAverage: 'Rank: Average',
    rankBeginner: 'Rank: Keep trying',
    notesHeading: 'Notes',
    notes: [
      'A peg jumps over an adjacent peg, up, down, left or right, and lands in the empty hole beyond it. Diagonal jumps are not allowed.',
      'One peg left in the center is a perfect finish. One peg left anywhere else still counts as solved.',
      'The rank depends on the pegs left at the end: 1 is Genius, 2 is Excellent, 3-4 is Average, 5 or more is Keep trying.',
      'You can undo as many moves as you like. "Reset" or switching the board returns to the starting layout.',
      'Progress is not saved. Reloading the page restores the starting layout.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Peg solitaire',
        description:
          'A one-player board game where pegs fill a board with holes and you remove them by jumping one peg over another. It dates back to 17th-century France and is also called Solitaire or the peg puzzle.',
      },
      {
        term: 'English and European boards',
        description:
          'The English board is a cross with 33 holes; the European (French) board has rounded corners and 37 holes. Both start with only the center empty. The European board has more holes and is generally harder to finish with a single center peg.',
      },
    ],
  },
};
