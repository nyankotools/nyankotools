import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BreakoutGamePageContent {
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
  levelLabel: string;
  livesLabel: string;
  /** canvas の代替テキスト */
  boardLabel: string;
  controlsLabel: string;
  leftButton: string;
  rightButton: string;
  launchButton: string;
  /** 盤面の上に重ねて描く短い表示 */
  overlayReady: string;
  overlayPaused: string;
  overlayOver: string;
  started: string;
  paused: string;
  resumed: string;
  /** {level} を置換して表示する */
  levelUp: string;
  /** {lives} を置換して表示する */
  lifeLost: string;
  /** {score} を置換して表示する */
  gameOver: string;
  newBest: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const breakoutGameContent: Record<Locale, BreakoutGamePageContent> = {
  ja: {
    title: 'ブロック崩し｜マウス・タッチ・キーで遊べる無料ブラウザゲーム',
    description:
      'パドルでボールを跳ね返してブロックを全部崩す、定番のブロック崩しをブラウザで遊べます。マウス・スマホのタッチ・矢印キーに対応し、ステージ進行・残機・ベストスコア記録付き。インストール・登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: 'ブロック崩し｜パドルでボールを打ち返してブロックを全部崩すゲーム',
    introHtml:
      'パドルでボールを打ち返し、並んだブロックをすべて崩すゲームです。パソコンではマウスを動かすか矢印キー（またはA・D）、スマホでは盤面をなぞるか画面のボタンでパドルを動かせます。パドルの端で返すほどボールは斜めに飛び、上の段ほど高得点で、ステージが進むほどボールが速くなります。ベストスコアも記録されます。ほかのゲームでは <a href="/tools/invaders-game/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">インベーダーゲーム</a>や<a href="/tools/snake-game/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スネークゲーム</a>もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「ゲーム開始」を押して始めます（ゲーム画面を選んだ状態でスペースキーを押しても始められます）。',
      'マウスを動かすか矢印キー（またはA・D）、スマホは盤面をなぞるか画面の「←」「→」ボタンでパドルを動かします。',
      'ボールはパドルの上で待機しています。クリック・タップ、スペースキー、または「発射」ボタンで打ち出します。',
      'ボールを落とさずブロックを全部崩すと次のステージへ進みます。ボールを3回落とすとゲームオーバーです。「一時停止」で中断できます。',
    ],
    startButton: 'ゲーム開始',
    pauseButton: '一時停止',
    resumeButton: '再開',
    scoreLabel: 'スコア',
    bestLabel: 'ベスト',
    levelLabel: 'ステージ',
    livesLabel: '残機',
    boardLabel: 'ブロック崩しの画面',
    controlsLabel: '操作ボタン',
    leftButton: '←',
    rightButton: '→',
    launchButton: '発射',
    overlayReady: '「ゲーム開始」を押してね',
    overlayPaused: '一時停止中',
    overlayOver: 'ゲームオーバー',
    started: 'ゲームを開始しました。',
    paused: '一時停止しました。',
    resumed: '再開しました。',
    levelUp: 'ステージ {level} に進みました。',
    lifeLost: 'ボールを落としました。残機は {lives} です。',
    gameOver: 'ゲームオーバーです。スコアは {score} でした。',
    newBest: 'ベストスコアを更新しました！',
    notesHeading: '注意事項',
    notes: [
      '操作は端末のブラウザ上だけで処理され、サーバーには何も送信されません。',
      'ボールはパドルのどこで返すかで角度が変わります。中央なら真上、左右の端ほど斜めに飛びます。',
      '残機は3つです。ボールを下に落とすと1つ減り、ボールはパドルの上に戻って待機します。',
      '得点は上の段ほど高く（60・50・40・30・20・10点）、ステージが進むとボールが速くなります。',
      'ベストスコアはこのブラウザのローカルストレージに保存されます。ブラウザのデータを消去したり、別の端末・ブラウザを使ったりすると引き継がれません。',
      '別のタブを開いたり画面から離れたりすると、自動で一時停止します。ゲームの途中経過は保存されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'パドル',
        description:
          '画面の下にある、ボールを打ち返すための板です。ボールを当てる位置で跳ね返る角度が変わります。',
      },
    ],
  },
  en: {
    title: 'Breakout Game – Play Free in Your Browser',
    description:
      'Play a classic brick-breaker in your browser: bounce the ball off the paddle and clear every brick. Mouse, touch or keys. Nothing is sent to a server.',
    h1: 'Breakout Game – Bounce the Ball and Clear Every Brick',
    introHtml:
      'A classic brick-breaker: bounce the ball off your paddle and clear the whole wall. Move the paddle with the mouse or the arrow keys (or A/D) on a computer, or by dragging across the board or using the on-screen buttons on a phone. Hitting the ball with the edge of the paddle sends it off at a sharper angle, upper rows are worth more points, and the ball gets faster on every level. Your best score is saved. Looking for another game? Try <a href="/en/tools/invaders-game/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Invaders</a> or <a href="/en/tools/snake-game/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Snake</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start game" to begin (or press the space bar while the game screen is focused).',
      'Move the paddle with the mouse or the arrow keys (or A/D), or on a phone by dragging across the board or using the on-screen "←" and "→" buttons.',
      'The ball waits on the paddle. Click or tap, press the space bar, or press "Launch" to shoot it.',
      'Clear every brick without dropping the ball to reach the next level. You lose after dropping the ball three times. Use "Pause" to take a break.',
    ],
    startButton: 'Start game',
    pauseButton: 'Pause',
    resumeButton: 'Resume',
    scoreLabel: 'Score',
    bestLabel: 'Best',
    levelLabel: 'Level',
    livesLabel: 'Lives',
    boardLabel: 'Breakout game screen',
    controlsLabel: 'Control buttons',
    leftButton: '←',
    rightButton: '→',
    launchButton: 'Launch',
    overlayReady: 'Press "Start game"',
    overlayPaused: 'Paused',
    overlayOver: 'Game over',
    started: 'The game has started.',
    paused: 'Paused.',
    resumed: 'Resumed.',
    levelUp: 'Level {level}.',
    lifeLost: 'You dropped the ball. {lives} lives left.',
    gameOver: 'Game over. Your score was {score}.',
    newBest: 'New best score!',
    notesHeading: 'Notes',
    notes: [
      'Everything runs in your browser and nothing is sent to a server.',
      'Where the ball meets the paddle sets its angle: the center sends it straight up, and the edges send it off more sharply.',
      'You have three lives. Dropping the ball costs one, and the next ball waits on the paddle.',
      'Upper rows score more (60, 50, 40, 30, 20 and 10 points), and the ball gets faster on each level.',
      'Your best score is stored in this browser’s local storage. It is not carried over if you clear site data or switch browsers or devices.',
      'The game pauses automatically when you switch tabs or leave the page. Game progress is not saved.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Paddle',
        description:
          'The bar at the bottom of the screen that bounces the ball back. Where the ball lands on it changes the angle it leaves at.',
      },
    ],
  },
};
