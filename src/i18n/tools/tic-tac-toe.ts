import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TicTacToePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  levelLabel: string;
  levelEasy: string;
  levelNormal: string;
  levelHard: string;
  sideLabel: string;
  sideFirst: string;
  sideSecond: string;
  newGame: string;
  undo: string;
  boardLabel: string;
  /** {row} {col} {state} を置換して表示する */
  cellLabel: string;
  cellEmpty: string;
  cellX: string;
  cellO: string;
  turnYou: string;
  turnCpu: string;
  thinking: string;
  youWon: string;
  cpuWon: string;
  draw: string;
  started: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const ticTacToeContent: Record<Locale, TicTacToePageContent> = {
  ja: {
    title: '三目並べ（○×ゲーム）｜無料でCPUと対戦・最強まで3段階',
    description:
      'ブラウザで遊べる三目並べ（○×ゲーム）です。かんたん・ふつう・最強の3段階のCPUと対戦でき、先手・後手も選べます。最強は絶対に負けません。登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: '三目並べ｜最強まで選べるCPU対戦',
    introHtml:
      '3×3のマスに交互に×と○を置き、縦・横・斜めのどれかに自分のマークを3つ並べた方が勝ちです。CPUの強さは3段階で、「最強」はミニマックス法で全局面を読み切るため、人間は引き分けまでしか持ち込めません。先手・後手も選べます。もう少し大きな盤面で遊ぶなら <a href="/tools/connect-four/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">四目並べ</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      'CPUの強さ（かんたん・ふつう・最強）と、あなたの手番（先手の×・後手の○）を選びます。選ぶと新しいゲームが始まります。',
      '空いているマスをクリック（タップ）すると、あなたのマークが置かれ、続けてCPUが打ちます。',
      '縦・横・斜めのどれかに自分のマークを3つ並べると勝ちです。並んだ3つは強調されます。9マスが埋まったら引き分けです。',
      '1手戻したいときは「待った」、最初からやり直すときは「新しいゲーム」を押します。',
    ],
    levelLabel: 'CPUの強さ',
    levelEasy: 'かんたん',
    levelNormal: 'ふつう',
    levelHard: '最強',
    sideLabel: 'あなたの手番',
    sideFirst: '先手（×）',
    sideSecond: '後手（○）',
    newGame: '新しいゲーム',
    undo: '待った',
    boardLabel: '三目並べの盤面',
    cellLabel: '{row}段{col}列 {state}',
    cellEmpty: '空き',
    cellX: '×',
    cellO: '○',
    turnYou: 'あなたの番です。',
    turnCpu: 'CPUの番です。',
    thinking: 'CPUが考えています…',
    youWon: 'あなたの勝ちです！',
    cpuWon: 'CPUの勝ちです。',
    draw: '引き分けです。',
    started: '新しいゲームを始めました。',
    notesHeading: '注意事項',
    notes: [
      '操作は端末のブラウザ上だけで処理され、サーバーには何も送信されません。CPUの思考もブラウザ内で行います。',
      '「かんたん」は空いているマスからランダムに選びます。「ふつう」は自分が勝てるときは勝ち、相手が勝ちそうなときは防ぎ、それ以外はランダムに打ちます。',
      '「最強」は全局面を読み切るため、どちらの手番でも負けません。人間が勝てるのは「かんたん」「ふつう」までです。',
      'CPUには同じ評価の手が複数あるとき、その中からランダムに選ぶため、同じ局面でも毎回同じ展開になるとは限りません。',
      '「待った」は、あなたの直前の手とそのあとのCPUの手をまとめて取り消します。ゲームの途中経過は保存されず、ページを再読み込みすると新しいゲームになります。',
      'キーボードでは、Tabキーでマスに移動し、Enter または Space でマークを置けます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '三目並べ（○×ゲーム）',
        description:
          '3×3のマスに2人が交互にマークを置き、縦・横・斜めのどれかに自分のマークを3つ並べた方が勝つゲームです。お互いに最善を尽くすと必ず引き分けになります。',
      },
      {
        term: 'ミニマックス法',
        description:
          '自分は評価が最大になる手、相手は最小になる手を選ぶと仮定して、先の局面をすべて読んで最善手を決める探索方法です。三目並べは局面が少ないため、最後まで読み切れます。',
      },
      {
        term: 'フォーク（ダブルリーチ）',
        description:
          '次の1手で勝てるラインが同時に2本できた状態です。相手は片方しか防げないため、勝ちがほぼ決まります。',
      },
    ],
  },
  en: {
    title: 'Tic-Tac-Toe vs Computer – Free, Unbeatable Mode',
    description:
      'Play Tic-Tac-Toe in your browser against the computer at three levels, including an unbeatable minimax mode. Pick X or O. Nothing is sent to a server.',
    h1: 'Tic-Tac-Toe – Play the Computer, Up to Unbeatable',
    introHtml:
      'Take turns placing X and O on a 3×3 grid, and be the first to line up three of your marks in a row, column or diagonal. Choose from three computer levels; "Unbeatable" uses minimax to search every position, so the best you can do against it is a draw. You can also choose to move first or second. Want a bigger grid? Try <a href="/en/tools/connect-four/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Four in a Row</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the computer level (Easy, Normal or Unbeatable) and your side (first as X, or second as O). A new game starts when you choose.',
      'Click (or tap) an empty square to place your mark. The computer replies right after.',
      'Line up three of your marks in a row, column or diagonal to win. The winning three are highlighted. If all nine squares fill up, the game is a draw.',
      'Press "Undo" to take back a move, or "New game" to start over.',
    ],
    levelLabel: 'Computer level',
    levelEasy: 'Easy',
    levelNormal: 'Normal',
    levelHard: 'Unbeatable',
    sideLabel: 'Your side',
    sideFirst: 'First (X)',
    sideSecond: 'Second (O)',
    newGame: 'New game',
    undo: 'Undo',
    boardLabel: 'Tic-Tac-Toe grid',
    cellLabel: 'Row {row}, column {col}: {state}',
    cellEmpty: 'empty',
    cellX: 'X',
    cellO: 'O',
    turnYou: 'Your turn.',
    turnCpu: 'Computer’s turn.',
    thinking: 'The computer is thinking…',
    youWon: 'You win!',
    cpuWon: 'The computer wins.',
    draw: 'It’s a draw.',
    started: 'A new game has started.',
    notesHeading: 'Notes',
    notes: [
      'Everything runs in your browser and nothing is sent to a server. The computer’s moves are also calculated in your browser.',
      'Easy picks a random empty square. Normal wins if it can, blocks your winning move if needed, and otherwise plays at random.',
      'Unbeatable searches every possible continuation, so it never loses from either side. You can only win against Easy and Normal.',
      'When several moves are equally good, the computer picks one at random, so the same position will not always play out the same way.',
      'Undo takes back your last move together with the computer’s reply. Game progress is not saved; reloading the page starts a new game.',
      'With a keyboard, Tab to a square and press Enter or Space to place your mark.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Tic-Tac-Toe (Noughts and Crosses)',
        description:
          'A two-player game on a 3×3 grid. Players alternate placing X and O, and the first to get three in a row, column or diagonal wins. With perfect play from both sides, the game is always a draw.',
      },
      {
        term: 'Minimax',
        description:
          'A search method that assumes you pick the move with the highest score and your opponent picks the one with the lowest, then looks through the following positions to choose the best move. Tic-Tac-Toe is small enough to search to the end.',
      },
      {
        term: 'Fork',
        description:
          'A position where you threaten to complete two lines at once. Your opponent can block only one, so the game is almost decided.',
      },
    ],
  },
};
