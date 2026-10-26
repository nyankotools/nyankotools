import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface GomokuPageContent {
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
  levelExpert: string;
  sideLabel: string;
  sideBlack: string;
  sideWhite: string;
  newGame: string;
  undo: string;
  blackLabel: string;
  whiteLabel: string;
  boardLabel: string;
  /** {row} {col} {state} を置換して表示する */
  cellLabel: string;
  cellEmpty: string;
  cellBlack: string;
  cellWhite: string;
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

export const gomokuContent: Record<Locale, GomokuPageContent> = {
  ja: {
    title: '五目並べ｜無料でCPUと対戦・強さ4段階・先手後手を選べる',
    description:
      'ブラウザで遊べる五目並べ（15×15の盤面）です。かんたん・ふつう・つよい・最強の4段階のCPUと対戦でき、先手（黒）・後手（白）を選べます。禁じ手なし、「待った」にも対応。インストール・登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: '五目並べ｜強さを選べるCPU対戦（15×15）',
    introHtml:
      '縦・横・斜めのいずれかに自分の石を5つ並べた方が勝ちの定番ゲームです。15×15の盤面で、禁じ手はありません。CPUの強さは4段階から選べ、先手（黒）か後手（白）かも決められます。ほかの対戦ゲームでは <a href="/tools/connect-four/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">四目並べ</a> や <a href="/tools/reversi/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">リバーシ</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      'CPUの強さ（かんたん・ふつう・つよい・最強）と、あなたの手番（先手の黒・後手の白）を選びます。選ぶと新しいゲームが始まります。',
      '盤面の置きたい交点をクリック（タップ）して石を置きます。黒（先手）から交互に打ちます。',
      '縦・横・斜めのいずれかに自分の石を5つ（6つ以上でも可）並べると勝ちです。勝った並びは色が付いて表示されます。',
      '1手戻したいときは「待った」を押します。「新しいゲーム」でやり直せます。',
    ],
    levelLabel: 'CPUの強さ',
    levelEasy: 'かんたん',
    levelNormal: 'ふつう',
    levelHard: 'つよい',
    levelExpert: '最強',
    sideLabel: 'あなたの手番',
    sideBlack: '先手（黒）',
    sideWhite: '後手（白）',
    newGame: '新しいゲーム',
    undo: '待った',
    blackLabel: '黒',
    whiteLabel: '白',
    boardLabel: '五目並べの盤面',
    cellLabel: '{row}行{col}列 {state}',
    cellEmpty: '空き',
    cellBlack: '黒',
    cellWhite: '白',
    turnYou: 'あなたの番です。',
    turnCpu: 'CPUの番です。',
    thinking: 'CPUが考えています…',
    youWon: 'あなたの勝ちです！',
    cpuWon: 'CPUの勝ちです。',
    draw: '盤面が埋まりました。引き分けです。',
    started: '新しいゲームを始めました。',
    notesHeading: '注意事項',
    notes: [
      '操作は端末のブラウザ上だけで処理され、サーバーには何も送信されません。CPUの思考もブラウザ内で行います。',
      'ルールは15×15の盤面で、先手・後手とも禁じ手はありません。5つ以上並べば（6つ以上の長連でも）勝ちです。',
      'CPUは並びの形を点数にして数手先まで読む簡易的なAIです（「最強」で4手先まで）。専用ソフトのような完璧な強さではなく、強い人には勝てることがあります。',
      '「かんたん」は石の近くからほぼランダムに打ちます（自分が5つ並べられるときだけは必ず打ちます）。「ふつう」「つよい」「最強」は先読みが深くなり、そのぶん考える時間が少し長くなります。',
      '同じ評価の手が複数あるとき、CPUはその中からランダムに選ぶため、同じ局面でも毎回同じ展開になるとは限りません。',
      '「待った」は、あなたの直前の手とそのあとのCPUの手をまとめて取り消します。ゲームの途中経過は保存されず、ページを再読み込みすると新しいゲームになります。',
      'キーボードでは、矢印キーで交点を移動し、Enter または Space で石を置けます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '五目並べ',
        description:
          '碁盤に黒と白の石を交互に置き、縦・横・斜めのいずれかに自分の石を先に5つ並べた方が勝ちとなるゲームです。このページでは、ルールを簡単にするため禁じ手を設けていません。',
      },
      {
        term: '禁じ手',
        description:
          '先手（黒）が有利すぎないよう、三三・四四・長連などを反則とする競技ルールのことです。このページでは採用していないため、どの並びでも置けます。',
      },
      {
        term: '長連（ちょうれん）',
        description:
          '自分の石が6つ以上つながった並びです。このページでは禁じ手ではなく、5つ以上並べば勝ちとして扱います。',
      },
    ],
  },
  en: {
    title: 'Gomoku (Five in a Row) – Free Online Game vs Computer',
    description:
      'Play Gomoku (Five in a Row) in your browser against the computer at four levels. Pick your side and undo moves. Nothing is sent to a server.',
    h1: 'Gomoku (Five in a Row) – Play the Computer on a 15×15 Board',
    introHtml:
      'Place stones in turn and be the first to line up five in a row, horizontally, vertically or diagonally. The board is 15×15 and there are no restricted moves. Choose from four computer levels and decide whether to play first (black) or second (white). Want another board game? Try <a href="/en/tools/connect-four/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Connect Four</a> or <a href="/en/tools/reversi/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Reversi</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the computer level (Easy, Normal, Hard or Expert) and your side (first as black, or second as white). A new game starts when you choose.',
      'Click (or tap) an intersection to place a stone. Black moves first and the players alternate.',
      'Line up five of your stones (six or more also counts) horizontally, vertically or diagonally to win. The winning line is highlighted.',
      'Use "Undo" to take back your last move, or "New game" to start over.',
    ],
    levelLabel: 'Computer level',
    levelEasy: 'Easy',
    levelNormal: 'Normal',
    levelHard: 'Hard',
    levelExpert: 'Expert',
    sideLabel: 'Your side',
    sideBlack: 'First (black)',
    sideWhite: 'Second (white)',
    newGame: 'New game',
    undo: 'Undo',
    blackLabel: 'Black',
    whiteLabel: 'White',
    boardLabel: 'Gomoku board',
    cellLabel: 'Row {row}, column {col}: {state}',
    cellEmpty: 'empty',
    cellBlack: 'black',
    cellWhite: 'white',
    turnYou: 'Your turn.',
    turnCpu: 'Computer’s turn.',
    thinking: 'The computer is thinking…',
    youWon: 'You win!',
    cpuWon: 'The computer wins.',
    draw: 'The board is full. It’s a draw.',
    started: 'A new game has started.',
    notesHeading: 'Notes',
    notes: [
      'Everything runs in your browser and nothing is sent to a server. The computer’s moves are also calculated in your browser.',
      'The board is 15×15 and neither side has restricted moves. Five or more in a row (including an overline of six or more) wins.',
      'The computer is a simple engine that scores line shapes and looks a few moves ahead (up to 4 on Expert). It is not as strong as dedicated software, and strong players can beat it.',
      'Easy plays mostly at random near the existing stones (it always takes a winning move when it has one). Normal, Hard and Expert look further ahead and take a little longer to move.',
      'When several moves score equally, the computer picks one at random, so the same position will not always play out the same way.',
      'Undo takes back your last move together with the computer’s reply. Game progress is not saved; reloading the page starts a new game.',
      'With a keyboard, move between intersections with the arrow keys and place a stone with Enter or Space.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Gomoku',
        description:
          'A two-player game in which players take turns placing black and white stones on a grid; the first to get five of their own stones in an unbroken row horizontally, vertically or diagonally wins. This page uses no restricted moves, to keep the rules simple.',
      },
      {
        term: 'Restricted moves',
        description:
          'Competition rules that forbid certain shapes for the first player (such as double-three, double-four and overlines) to offset the first-move advantage. This page does not use them, so any move is allowed.',
      },
      {
        term: 'Overline',
        description:
          'A row of six or more of your own stones. Here it is not a foul: five or more in a row wins.',
      },
    ],
  },
};
