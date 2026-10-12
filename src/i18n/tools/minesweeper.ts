import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MinesweeperPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  difficultyLabel: string;
  beginner: string;
  intermediate: string;
  expert: string;
  custom: string;
  colsLabel: string;
  rowsLabel: string;
  minesLabel: string;
  /** {cols} {rows} を範囲の文字列に置換して表示する */
  customHint: string;
  startCustom: string;
  /** {min} {max} を置換して表示する */
  errorCols: string;
  /** {min} {max} を置換して表示する */
  errorRows: string;
  /** {min} {max} を置換して表示する */
  errorMines: string;
  errorInvalid: string;
  newGame: string;
  modeLabel: string;
  modeOpen: string;
  modeFlag: string;
  minesLeftLabel: string;
  timeLabel: string;
  bestTimeLabel: string;
  bestTimeNone: string;
  boardLabel: string;
  /** {row} {col} {state} を置換して表示する */
  cellLabel: string;
  cellHidden: string;
  cellFlag: string;
  cellEmpty: string;
  /** {n} を置換して表示する（周囲の地雷の数） */
  cellNumber: string;
  cellMine: string;
  cellExploded: string;
  cellWrongFlag: string;
  /** {cols} {rows} {mines} を置換して表示する */
  started: string;
  /** {time} を置換して表示する */
  won: string;
  newBest: string;
  lost: string;
  resetRecords: string;
  recordsCleared: string;
  bestHeading: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const minesweeperContent: Record<Locale, MinesweeperPageContent> = {
  ja: {
    title: 'マインスイーパー｜無料ブラウザゲーム（初級〜上級・カスタム対応）',
    description:
      '定番パズル「マインスイーパー」をブラウザで遊べます。初級・中級・上級とカスタム（盤面の大きさと地雷数を自由に設定）に対応し、最初の1手は必ず安全。スマホでは長押しや「旗」モードで旗を立てられ、難易度ごとのベストタイムも記録します。インストール・登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: 'マインスイーパー｜地雷を避けて全マスを開くパズルゲーム',
    introHtml:
      '数字のヒントから地雷の場所を推理し、地雷以外のすべてのマスを開くパズルゲームです。パソコンでは左クリックで開き、右クリックで旗を立てます。スマホでは「掘る」「旗」モードの切り替えか、マスの長押しで旗を立てられます。難易度は初級・中級・上級のほか、盤面の大きさと地雷の数を自由に決められるカスタムも選べます。ほかのパズルでは <a href="/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">数独</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '難易度（初級・中級・上級・カスタム）を選びます。カスタムでは列数・行数・地雷の数を入力して「この設定で始める」を押します。',
      'マスをクリック（タップ）して開きます。最初の1手は必ず安全です。数字は、そのマスの周囲8マスにある地雷の数を表します。',
      '地雷があると思うマスには旗を立てます。パソコンは右クリック、スマホはマスの長押し、または操作モードを「旗」に切り替えてタップします。',
      '開いた数字の周囲に同じ数の旗を立てたら、その数字をもう一度クリックすると、残りのマスをまとめて開けます。地雷以外をすべて開けばクリアです。「新しいゲーム」でやり直せます。',
    ],
    difficultyLabel: '難易度',
    beginner: '初級（9×9・地雷10）',
    intermediate: '中級（16×16・地雷40）',
    expert: '上級（30×16・地雷99）',
    custom: 'カスタム',
    colsLabel: '列数',
    rowsLabel: '行数',
    minesLabel: '地雷の数',
    customHint:
      '列数は {cols}、行数は {rows}、地雷の数は 1〜（マス数−9）の範囲で指定できます。',
    startCustom: 'この設定で始める',
    errorCols: '列数は {min}〜{max} の整数で入力してください。',
    errorRows: '行数は {min}〜{max} の整数で入力してください。',
    errorMines:
      '地雷の数は {min}〜{max} の整数で入力してください（最大はマス数から9を引いた数です）。',
    errorInvalid: '列数・行数・地雷の数は整数で入力してください。',
    newGame: '新しいゲーム',
    modeLabel: '操作モード',
    modeOpen: '掘る',
    modeFlag: '旗',
    minesLeftLabel: '残りの地雷',
    timeLabel: '時間',
    bestTimeLabel: 'ベストタイム',
    bestTimeNone: '記録なし',
    boardLabel: 'マインスイーパーの盤面',
    cellLabel: '{row}行{col}列 {state}',
    cellHidden: '未開封',
    cellFlag: '旗',
    cellEmpty: '開封済み・周囲に地雷なし',
    cellNumber: '開封済み・周囲に地雷{n}個',
    cellMine: '地雷',
    cellExploded: '爆発した地雷',
    cellWrongFlag: '地雷のない場所の旗',
    started: '新しいゲームを始めました（{cols}×{rows}・地雷{mines}個）。',
    won: 'クリアしました！タイムは {time} でした。',
    newBest: 'ベストタイムを更新しました。',
    lost: '地雷を開いてしまいました。「新しいゲーム」でもう一度挑戦できます。',
    resetRecords: '記録をリセット',
    recordsCleared: 'ベストタイムをリセットしました。',
    bestHeading: 'ベストタイム',
    notesHeading: '注意事項',
    notes: [
      '操作は端末のブラウザ上だけで処理され、サーバーには何も送信されません。',
      '最初に開いたマスとその周囲8マスには地雷が置かれないため、最初の1手で負けることはありません。地雷は最初の1手のあとに配置されます。',
      'カスタムの盤面は、列数5〜30、行数5〜24、地雷の数1〜（マス数−9）まで指定できます。カスタムのタイムはベスト記録には残りません。',
      'ベストタイムは初級・中級・上級ごとに、このブラウザのローカルストレージへ保存されます。ブラウザのデータを消去したり、別の端末・ブラウザを使ったりすると引き継がれません。',
      'タイマーは最初のマスを開いたときに始まり、クリアまたは地雷を開いた時点で止まります。ゲームの途中経過は保存されず、ページを再読み込みすると新しいゲームになります。',
      'キーボードでは、矢印キーでマスを移動し、Enter または Space で開き、F キーで旗を立てます。スマホで広い盤面を遊ぶときは、盤面を横にスクロールできます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'マインスイーパー',
        description:
          '数字のヒントから隠れた地雷の位置を推理し、地雷のないマスをすべて開くパズルゲームです。1990年代にWindowsに標準搭載され、広く知られるようになりました。',
      },
      {
        term: 'チョード（周囲をまとめて開く）',
        description:
          '開いた数字のマスの周囲に、その数字と同じ数の旗が立っているとき、そのマスをもう一度クリックして残りのマスをまとめて開く操作です。旗の位置が間違っていると地雷を開いてしまうので注意してください。',
      },
    ],
  },
  en: {
    title: 'Minesweeper – Free Online Game with Custom Boards',
    description:
      'Play Minesweeper in your browser: Beginner to Expert or custom boards, safe first click, touch flags and best times. Nothing is sent to a server.',
    h1: 'Minesweeper – Clear the Board Without Hitting a Mine',
    introHtml:
      'Use the number clues to work out where the mines are and open every safe cell. On a computer, left-click to open and right-click to place a flag. On a phone, switch the mode between Dig and Flag, or long-press a cell to flag it. Pick Beginner, Intermediate or Expert, or set your own board size and mine count. Looking for another puzzle? Try <a href="/en/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Sudoku</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a difficulty (Beginner, Intermediate, Expert or Custom). For Custom, enter the number of columns, rows and mines and press "Start with these settings".',
      'Click (or tap) a cell to open it. Your first move is always safe. A number shows how many mines are in the 8 cells around it.',
      'Place a flag on any cell you think hides a mine: right-click on a computer, long-press on a phone, or switch the mode to "Flag" and tap.',
      'When an opened number has that many flags around it, click the number again to open all its remaining neighbors at once. Open every cell without a mine to win. Press "New game" to start over.',
    ],
    difficultyLabel: 'Difficulty',
    beginner: 'Beginner (9×9, 10 mines)',
    intermediate: 'Intermediate (16×16, 40 mines)',
    expert: 'Expert (30×16, 99 mines)',
    custom: 'Custom',
    colsLabel: 'Columns',
    rowsLabel: 'Rows',
    minesLabel: 'Mines',
    customHint:
      'Columns: {cols}, rows: {rows}, mines: from 1 up to (cells − 9).',
    startCustom: 'Start with these settings',
    errorCols: 'Enter a whole number of columns from {min} to {max}.',
    errorRows: 'Enter a whole number of rows from {min} to {max}.',
    errorMines:
      'Enter a whole number of mines from {min} to {max} (the maximum is the number of cells minus 9).',
    errorInvalid: 'Columns, rows and mines must be whole numbers.',
    newGame: 'New game',
    modeLabel: 'Mode',
    modeOpen: 'Dig',
    modeFlag: 'Flag',
    minesLeftLabel: 'Mines left',
    timeLabel: 'Time',
    bestTimeLabel: 'Best time',
    bestTimeNone: 'No record yet',
    boardLabel: 'Minesweeper board',
    cellLabel: 'Row {row}, column {col}: {state}',
    cellHidden: 'unopened',
    cellFlag: 'flagged',
    cellEmpty: 'opened, no adjacent mines',
    cellNumber: 'opened, {n} adjacent mines',
    cellMine: 'mine',
    cellExploded: 'exploded mine',
    cellWrongFlag: 'flag on a safe cell',
    started: 'A new game has started ({cols}×{rows}, {mines} mines).',
    won: 'You cleared the board! Your time was {time}.',
    newBest: 'New best time!',
    lost: 'You hit a mine. Press "New game" to try again.',
    resetRecords: 'Reset records',
    recordsCleared: 'Best times have been reset.',
    bestHeading: 'Best times',
    notesHeading: 'Notes',
    notes: [
      'Everything runs in your browser and nothing is sent to a server.',
      'The first cell you open and its 8 neighbors never contain a mine, so you cannot lose on your first move. Mines are placed after that first move.',
      'Custom boards allow 5–30 columns, 5–24 rows and 1 to (cells − 9) mines. Custom games do not count toward best times.',
      'Best times are saved per level (Beginner, Intermediate, Expert) in this browser’s local storage. They are not carried over if you clear site data or switch browsers or devices.',
      'The timer starts when you open the first cell and stops when you clear the board or hit a mine. Game progress is not saved; reloading the page starts a new game.',
      'With a keyboard, move between cells with the arrow keys, open with Enter or Space, and flag with the F key. On a phone, wide boards can be scrolled sideways.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Minesweeper',
        description:
          'A logic puzzle in which you deduce the positions of hidden mines from number clues and open every cell that is safe. It became widely known as a standard game on Windows in the 1990s.',
      },
      {
        term: 'Chording',
        description:
          'Clicking an opened number that already has as many flags around it as its value, to open all of its remaining neighbors at once. If a flag is misplaced you will open a mine, so use it carefully.',
      },
    ],
  },
};
