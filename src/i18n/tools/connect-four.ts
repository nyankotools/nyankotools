import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ConnectFourPageContent {
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
  redLabel: string;
  yellowLabel: string;
  boardLabel: string;
  /** {col} を置換して表示する */
  dropLabel: string;
  dropFullLabel: string;
  /** {row} {col} {state} を置換して表示する */
  cellLabel: string;
  cellEmpty: string;
  cellRed: string;
  cellYellow: string;
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

export const connectFourContent: Record<Locale, ConnectFourPageContent> = {
  ja: {
    title: '四目並べ｜無料でCPUと対戦・強さ3段階',
    description:
      'ブラウザで遊べる四目並べ（重力あり・7×6盤）です。かんたん・ふつう・つよいの3段階のCPUと対戦でき、先手・後手を選べます。勝ちラインの強調や「待った」にも対応。インストール・登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: '四目並べ｜強さを選べるCPU対戦',
    introHtml:
      '7列×6段の盤に石を落としていき、縦・横・斜めのどれかに自分の石を4つ並べた方が勝ちです。CPUの強さは3段階から選べ、先手か後手かも決められます。勝負がついたら並んだ4つが強調され、「待った」で数手戻して練習もできます。ほかのボードゲームでは <a href="/tools/reversi/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">リバーシ</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      'CPUの強さ（かんたん・ふつう・つよい）と、あなたの手番（先手の赤・後手の黄）を選びます。選ぶと新しいゲームが始まります。',
      '盤面の上にある列の矢印ボタン（または盤面のマス）をクリック（タップ）すると、その列の一番下に石が落ちます。',
      '縦・横・斜めのどれかに自分の石を4つ並べると勝ちです。並んだ4つは盤面で強調されます。盤面が全部埋まったら引き分けです。',
      '1手戻したいときは「待った」、最初からやり直すときは「新しいゲーム」を押します。',
    ],
    levelLabel: 'CPUの強さ',
    levelEasy: 'かんたん',
    levelNormal: 'ふつう',
    levelHard: 'つよい',
    sideLabel: 'あなたの手番',
    sideFirst: '先手（赤）',
    sideSecond: '後手（黄）',
    newGame: '新しいゲーム',
    undo: '待った',
    redLabel: '赤',
    yellowLabel: '黄',
    boardLabel: '四目並べの盤面',
    dropLabel: '{col}列目に石を落とす',
    dropFullLabel: '{col}列目（いっぱいです）',
    cellLabel: '{row}段{col}列 {state}',
    cellEmpty: '空き',
    cellRed: '赤',
    cellYellow: '黄',
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
      'CPUは盤面を数手先まで読んで打つ簡易的なAIです（「つよい」で7手先まで）。完全に読み切る専用ソフトほどの強さではありません。',
      '「かんたん」は落とせる列からランダムに選びます。「ふつう」は4手先、「つよい」は7手先まで読みます。',
      'CPUには同じ評価の手が複数あるとき、その中からランダムに選ぶため、同じ局面でも毎回同じ展開になるとは限りません。',
      '「待った」は、あなたの直前の手とそのあとのCPUの手をまとめて取り消します。ゲームの途中経過は保存されず、ページを再読み込みすると新しいゲームになります。',
      'キーボードでは、列の矢印ボタンにTabキーで移動し、Enter または Space で石を落とせます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '四目並べ',
        description:
          '7列×6段の盤に交互に石を落とし、縦・横・斜めのどれかに自分の石を4つ並べた方が勝つ2人用ゲームです。石は重力で列の一番下に積み上がります。',
      },
      {
        term: '先手・後手',
        description:
          '先に打つ側が先手です。盤面の中央列を取ると並べられる方向が多くなるため、先手は中央から始めると有利とされています。',
      },
      {
        term: 'ダブルリーチ',
        description:
          '次の1手で勝てる場所が同時に2か所できた状態です。相手は片方しか防げないため、ほぼ勝ちが決まります。',
      },
    ],
  },
  en: {
    title: 'Four in a Row – Free Online Game vs Computer, 3 Levels',
    description:
      'Play Four in a Row in your browser against the computer at three levels. Choose first or second move and undo. Nothing is sent to a server.',
    h1: 'Four in a Row – Play the Computer at 3 Strength Levels',
    introHtml:
      'Drop discs into a 7-column, 6-row grid and be the first to line up four of your own discs horizontally, vertically or diagonally. Pick one of three computer levels and choose whether you move first or second. The winning four are highlighted, and undo lets you practice. Looking for another board game? Try <a href="/en/tools/reversi/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Reversi</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the computer level (Easy, Normal or Hard) and your side (first as red, or second as yellow). A new game starts when you choose.',
      'Click (or tap) a column arrow above the grid, or any square in a column, to drop a disc to the lowest free spot.',
      'Line up four of your discs horizontally, vertically or diagonally to win. The winning four are highlighted. If the grid fills up, the game is a draw.',
      'Press "Undo" to take back a move, or "New game" to start over.',
    ],
    levelLabel: 'Computer level',
    levelEasy: 'Easy',
    levelNormal: 'Normal',
    levelHard: 'Hard',
    sideLabel: 'Your side',
    sideFirst: 'First (red)',
    sideSecond: 'Second (yellow)',
    newGame: 'New game',
    undo: 'Undo',
    redLabel: 'Red',
    yellowLabel: 'Yellow',
    boardLabel: 'Four in a Row grid',
    dropLabel: 'Drop a disc in column {col}',
    dropFullLabel: 'Column {col} (full)',
    cellLabel: 'Row {row}, column {col}: {state}',
    cellEmpty: 'empty',
    cellRed: 'red',
    cellYellow: 'yellow',
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
      'The computer is a simple engine that looks a few moves ahead (up to 7 on Hard). It is not a perfect solver.',
      'Easy picks a random open column. Normal looks 4 moves ahead and Hard looks 7.',
      'When several moves score equally, the computer picks one at random, so the same position will not always play out the same way.',
      'Undo takes back your last move together with the computer’s reply. Game progress is not saved; reloading the page starts a new game.',
      'With a keyboard, Tab to the column arrow buttons and press Enter or Space to drop a disc.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Four in a Row',
        description:
          'A two-player game on a 7-column, 6-row grid. Players take turns dropping discs, which fall to the lowest free spot in a column, and the first to line up four of their own discs in any direction wins.',
      },
      {
        term: 'First / second player',
        description:
          'The first player moves first. The center column takes part in the most possible lines, so starting there is generally considered strong.',
      },
      {
        term: 'Double threat',
        description:
          'A position where you can win at two different spots on your next move. Your opponent can block only one, so the game is almost decided.',
      },
    ],
  },
};
