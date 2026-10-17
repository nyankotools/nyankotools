import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TetrisGamePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  startButton: string;
  pauseButton: string;
  resumeButton: string;
  scoreLabel: string;
  bestLabel: string;
  linesLabel: string;
  levelLabel: string;
  holdLabel: string;
  nextLabel: string;
  /** canvas の代替テキスト */
  boardLabel: string;
  controlsLabel: string;
  leftButton: string;
  rightButton: string;
  rotateButton: string;
  downButton: string;
  dropButton: string;
  holdButton: string;
  /** 盤面の上に重ねて描く短い表示 */
  overlayReady: string;
  overlayPaused: string;
  overlayOver: string;
  started: string;
  paused: string;
  resumed: string;
  /** {score} と {lines} を置換して表示する */
  gameOver: string;
  newBest: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const tetrisGameContent: Record<Locale, TetrisGamePageContent> = {
  ja: {
    title:
      '落ち物パズル｜ブロックを回転・ホールドしてラインを消す無料ブラウザゲーム',
    description:
      '落ちてくるブロックを回転・移動して横一列に揃え、ラインを消していく定番の落ち物パズルをブラウザで遊べます。ホールド・ネクスト表示・落下位置のガイド付きで、キーボードにもスマホの画面ボタンにも対応。ベストスコアも記録されます。インストール・登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: '落ち物パズル｜ブロックを揃えてラインを消すブラウザゲーム',
    introHtml:
      '上から落ちてくる4マスのブロックを回転・移動させ、横一列をすき間なく埋めて消していく落ち物パズルです。ホールド（ブロックの一時退避）、次に来るブロックの表示、落下位置のガイド、ハードドロップに対応しています。パソコンではキーボード、スマホでは画面のボタンで遊べ、ベストスコアも記録されます。ほかのゲームでは <a href="/tools/snake-game/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スネークゲーム</a> や <a href="/tools/game-2048/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">2048</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「ゲーム開始」を押して始めます（ゲーム画面を選んだ状態でスペースキーを押しても始められます）。',
      '← → で横に動かし、↑（またはX）で右回り、Zで左回りに回転します。↓ でゆっくり、スペースキーで一気に落とせます。スマホは画面のボタンを使います。',
      'Cキー（またはShift）かホールドボタンで、今のブロックを一時退避して別のブロックに入れ替えられます。ホールドはブロック1つにつき1回までです。',
      '横一列を埋めるとラインが消えて得点になり、10ライン消すごとにレベルが上がって速くなります。積み上がって新しいブロックが出せなくなるとゲームオーバーです。「一時停止」（またはPキー）で中断できます。',
    ],
    startButton: 'ゲーム開始',
    pauseButton: '一時停止',
    resumeButton: '再開',
    scoreLabel: 'スコア',
    bestLabel: 'ベスト',
    linesLabel: 'ライン',
    levelLabel: 'レベル',
    holdLabel: 'ホールド',
    nextLabel: 'ネクスト',
    boardLabel: '落ち物パズルの画面',
    controlsLabel: '操作ボタン',
    leftButton: '←（A）',
    rightButton: '→（D）',
    rotateButton: '回転（↑/X）',
    downButton: '↓（S）',
    dropButton: '落とす（Space）',
    holdButton: 'ホールド（C）',
    overlayReady: '「ゲーム開始」を押してね',
    overlayPaused: '一時停止中',
    overlayOver: 'ゲームオーバー',
    started: 'ゲームを開始しました。',
    paused: '一時停止しました。',
    resumed: '再開しました。',
    gameOver:
      'ブロックが積み上がってゲームオーバーです。スコアは {score}、消したラインは {lines} でした。',
    newBest: 'ベストスコアを更新しました！',
    notesHeading: '注意事項',
    notes: [
      '操作は端末のブラウザ上だけで処理され、サーバーには何も送信されません。',
      '盤面は横10マス×縦20マスです。ブロックは7種類を1巡ずつ出す方式で、同じ種類が極端に続きにくくなっています。',
      '得点は、1ライン100点・2ライン300点・3ライン500点・4ライン同時800点にレベルを掛けた値です。ソフトドロップ（↓）は1段ごとに1点、ハードドロップは落とした段数ごとに2点が加わります。',
      '回転したときに壁や他のブロックにぶつかる場合は、少し位置をずらして回せるか試します。本家のゲームの回転規則と完全には同じではありません。',
      'ブロックは床や他のブロックに着いたあと、次の落下のタイミングまで動かしたり回したりできます。',
      'ベストスコアはこのブラウザのローカルストレージに保存されます。ブラウザのデータを消去したり、別の端末・ブラウザを使ったりすると引き継がれません。',
      '別のタブを開いたり画面から離れたりすると、自動で一時停止します。ゲームの途中経過は保存されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ホールド',
        description:
          '今操作しているブロックを一時的に脇へ取っておき、あとで取り出して使える機能です。置きにくいブロックを避けたり、長い棒状のブロックを温存したりするのに使います。',
      },
      {
        term: 'ハードドロップ',
        description:
          'ブロックを一番下まで一気に落として、その場で固定する操作です。ゴースト（薄く表示される落下予定位置）を見ながら使います。',
      },
      {
        term: 'ゴースト',
        description:
          '今のブロックをそのまま落としたときに着地する位置を、薄く表示したガイドです。',
      },
    ],
  },
  en: {
    title: 'Falling Block Puzzle – Play Free in Your Browser',
    description:
      'Rotate and stack falling blocks to clear lines. Hold, next preview and landing guide, with keyboard or on-screen buttons. Nothing is sent to a server.',
    h1: 'Falling Block Puzzle – Rotate, Stack and Clear Lines',
    introHtml:
      'Rotate and move the four-cell blocks falling from the top, and fill complete rows with no gaps to clear them. The game has a hold slot, a preview of the next blocks, a landing guide and hard drop. Play with the keyboard on a computer or the on-screen buttons on a phone; your best score is saved. Looking for another game? Try <a href="/en/tools/snake-game/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Snake Game</a> or <a href="/en/tools/game-2048/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">2048</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start game" to begin (or press the space bar while the game screen is focused).',
      'Move with ← →, rotate clockwise with ↑ (or X) and counter-clockwise with Z. Press ↓ to fall faster, or the space bar to drop instantly. On a phone, use the on-screen buttons.',
      'Press C (or Shift) or the Hold button to set the current block aside and swap in another. You can hold once per block.',
      'Fill a whole row to clear it and score; every 10 lines raises the level and the speed. The game ends when the stack reaches the top and a new block can’t enter. Use "Pause" (or the P key) to take a break.',
    ],
    startButton: 'Start game',
    pauseButton: 'Pause',
    resumeButton: 'Resume',
    scoreLabel: 'Score',
    bestLabel: 'Best',
    linesLabel: 'Lines',
    levelLabel: 'Level',
    holdLabel: 'Hold',
    nextLabel: 'Next',
    boardLabel: 'Falling block puzzle screen',
    controlsLabel: 'Control buttons',
    leftButton: '← (A)',
    rightButton: '→ (D)',
    rotateButton: 'Rotate (↑/X)',
    downButton: '↓ (S)',
    dropButton: 'Drop (Space)',
    holdButton: 'Hold (C)',
    overlayReady: 'Press "Start game"',
    overlayPaused: 'Paused',
    overlayOver: 'Game over',
    started: 'The game has started.',
    paused: 'Paused.',
    resumed: 'Resumed.',
    gameOver:
      'The stack reached the top. Game over. Your score was {score} with {lines} lines cleared.',
    newBest: 'New best score!',
    notesHeading: 'Notes',
    notes: [
      'Everything runs in your browser and nothing is sent to a server.',
      'The board is 10 columns by 20 rows. Blocks come out in a shuffled set of all seven shapes at a time, so long runs of the same shape are unlikely.',
      'Line clears score 100 / 300 / 500 for 1 / 2 / 3 lines and 800 for 4 at once, multiplied by your level. Soft drop (↓) adds 1 point per row and hard drop adds 2 points per row dropped.',
      'If a rotation would hit a wall or another block, the game tries nudging the block sideways or up a little. This is not identical to the rotation rules of the original game.',
      'After a block touches the floor or the stack, you can still move and rotate it until the next gravity step.',
      'Your best score is stored in this browser’s local storage. It is not carried over if you clear site data or switch browsers or devices.',
      'The game pauses automatically when you switch tabs or leave the page. Game progress is not saved.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Hold',
        description:
          'Sets the block you are controlling aside so you can swap it back in later. Useful for skipping an awkward block or saving a long bar block for when you need it.',
      },
      {
        term: 'Hard drop',
        description:
          'Drops the block straight to the bottom and locks it in place immediately. Use the ghost to see where it will land.',
      },
      {
        term: 'Ghost',
        description:
          'A faint outline showing where the current block will land if you let it fall straight down.',
      },
    ],
  },
};
