import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ReversiPageContent {
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
  hintLabel: string;
  blackLabel: string;
  whiteLabel: string;
  boardLabel: string;
  /** {row} {col} {state} を置換して表示する */
  cellLabel: string;
  cellEmpty: string;
  cellBlack: string;
  cellWhite: string;
  cellLegal: string;
  turnYou: string;
  turnCpu: string;
  thinking: string;
  youPassed: string;
  cpuPassed: string;
  /** {black} {white} を置換して表示する */
  youWon: string;
  cpuWon: string;
  draw: string;
  started: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const reversiContent: Record<Locale, ReversiPageContent> = {
  ja: {
    title: 'リバーシ（オセロ）｜無料でCPUと対戦・強さ4段階',
    description:
      'ブラウザで遊べるリバーシ（オセロ）です。かんたん・ふつう・つよい・最強の4段階のCPUと対戦でき、先手（黒）・後手（白）を選べます。置ける場所のヒント表示や「待った」にも対応。インストール・登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: 'リバーシ（オセロ）｜強さを選べるCPU対戦',
    introHtml:
      '8×8の盤面で石を挟んで裏返し、最終的に石の多い方が勝つ定番のボードゲームです。CPUの強さは4段階から選べ、先手（黒）か後手（白）かも決められます。置ける場所の表示と「待った」で、初心者でも気軽に練習できます。ほかのゲームでは <a href="/tools/minesweeper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">マインスイーパー</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      'CPUの強さ（かんたん・ふつう・つよい・最強）と、あなたの手番（先手の黒・後手の白）を選びます。選ぶと新しいゲームが始まります。',
      '盤面の置きたい場所をクリック（タップ）して石を置きます。相手の石を挟むと、挟んだ石がすべて裏返ります。',
      '置ける場所が分からないときは「ヒント」で置ける場所を表示できます。1手戻したいときは「待った」を押します。',
      '置ける場所がない側は自動でパスになります。両方とも置けなくなるか盤面が埋まったら終了で、石の多い方の勝ちです。「新しいゲーム」でやり直せます。',
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
    hintLabel: 'ヒント',
    blackLabel: '黒',
    whiteLabel: '白',
    boardLabel: 'リバーシの盤面',
    cellLabel: '{row}行{col}列 {state}',
    cellEmpty: '空き',
    cellBlack: '黒',
    cellWhite: '白',
    cellLegal: '置けます',
    turnYou: 'あなたの番です。',
    turnCpu: 'CPUの番です。',
    thinking: 'CPUが考えています…',
    youPassed: 'あなたは置ける場所がないためパスしました。',
    cpuPassed: 'CPUは置ける場所がないためパスしました。続けてあなたの番です。',
    youWon: 'あなたの勝ちです！ 黒 {black} 対 白 {white}',
    cpuWon: 'CPUの勝ちです。 黒 {black} 対 白 {white}',
    draw: '引き分けです。 黒 {black} 対 白 {white}',
    started: '新しいゲームを始めました。',
    notesHeading: '注意事項',
    notes: [
      '操作は端末のブラウザ上だけで処理され、サーバーには何も送信されません。CPUの思考もブラウザ内で行います。',
      'CPUは盤面を数手先まで読んで打つ簡易的なAIです（「最強」でも6手先まで）。専用ソフトのような完璧な強さではありません。',
      '「かんたん」は置ける場所からランダムに選びます。「ふつう」「つよい」「最強」は先読みの手数が増え、そのぶん考える時間が少し長くなります。端末によっては「最強」で1手に1秒前後かかることがあります。',
      'CPUには同じ評価の手が複数あるとき、その中からランダムに選ぶため、同じ局面でも毎回同じ展開になるとは限りません。',
      '「待った」は、あなたの直前の手とそのあとのCPUの手をまとめて取り消します。ゲームの途中経過は保存されず、ページを再読み込みすると新しいゲームになります。',
      'キーボードでは、矢印キーでマスを移動し、Enter または Space で石を置けます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'リバーシ／オセロ',
        description:
          '8×8の盤面で、白と黒の石を交互に置き、相手の石を挟んで自分の色に変えていくボードゲームです。「オセロ」は日本の商標で、同じルールのゲームは一般にリバーシと呼ばれます。',
      },
      {
        term: 'パス',
        description:
          '置ける場所がないときに手番を飛ばすことです。リバーシでは置ける場所があるのにパスはできません。両者が置けなくなった時点でゲームが終わります。',
      },
      {
        term: '角（かど）',
        description:
          '盤面の四隅のマスです。角に置いた石は挟まれて裏返されることがないため、取れると有利になります。',
      },
    ],
  },
  en: {
    title: 'Reversi (Othello) – Free Online Game vs Computer, 4 Levels',
    description:
      'Play Reversi (Othello) in your browser against the computer at four levels. Choose your side, show hints and undo. Nothing is sent to a server.',
    h1: 'Reversi (Othello) – Play the Computer at 4 Strength Levels',
    introHtml:
      'Flip your opponent’s discs by trapping them between yours on an 8×8 board; whoever has more discs at the end wins. Choose from four computer levels and decide whether to play first (black) or second (white). Legal-move hints and undo make it easy to practice. Looking for another game? Try <a href="/en/tools/minesweeper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Minesweeper</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the computer level (Easy, Normal, Hard or Expert) and your side (first as black, or second as white). A new game starts when you choose.',
      'Click (or tap) a square to place a disc. Any opponent discs trapped between your new disc and another of yours are flipped.',
      'Use "Hints" to show where you can play, and "Undo" to take back your last move.',
      'A side with no legal move passes automatically. The game ends when neither side can move or the board is full, and the player with more discs wins. Press "New game" to start over.',
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
    hintLabel: 'Hints',
    blackLabel: 'Black',
    whiteLabel: 'White',
    boardLabel: 'Reversi board',
    cellLabel: 'Row {row}, column {col}: {state}',
    cellEmpty: 'empty',
    cellBlack: 'black',
    cellWhite: 'white',
    cellLegal: 'you can play here',
    turnYou: 'Your turn.',
    turnCpu: 'Computer’s turn.',
    thinking: 'The computer is thinking…',
    youPassed: 'You have no legal move, so you passed.',
    cpuPassed: 'The computer has no legal move and passed. Your turn again.',
    youWon: 'You win! Black {black} – White {white}',
    cpuWon: 'The computer wins. Black {black} – White {white}',
    draw: 'It’s a draw. Black {black} – White {white}',
    started: 'A new game has started.',
    notesHeading: 'Notes',
    notes: [
      'Everything runs in your browser and nothing is sent to a server. The computer’s moves are also calculated in your browser.',
      'The computer is a simple engine that looks a few moves ahead (up to 6 on Expert). It is not as strong as dedicated Othello software.',
      'Easy picks a random legal move. Normal, Hard and Expert look further ahead and take a little longer to move; on some devices Expert may take around a second per move.',
      'When several moves score equally, the computer picks one at random, so the same position will not always play out the same way.',
      'Undo takes back your last move together with the computer’s reply. Game progress is not saved; reloading the page starts a new game.',
      'With a keyboard, move between squares with the arrow keys and place a disc with Enter or Space.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Reversi / Othello',
        description:
          'A two-player board game on an 8×8 board in which players take turns placing discs and flip any opposing discs they trap in a line. Othello is a trademarked variant name; the standard rules are essentially the same.',
      },
      {
        term: 'Pass',
        description:
          'Skipping a turn because you have no legal move. You may not pass if you have a legal move. The game ends when neither player can move.',
      },
      {
        term: 'Corner',
        description:
          'One of the four corner squares. A disc in a corner can never be flipped, so taking corners is a big advantage.',
      },
    ],
  },
};
