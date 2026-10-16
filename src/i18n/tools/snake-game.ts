import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SnakeGamePageContent {
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
  lengthLabel: string;
  /** canvas の代替テキスト */
  boardLabel: string;
  controlsLabel: string;
  upButton: string;
  downButton: string;
  leftButton: string;
  rightButton: string;
  /** 盤面の上に重ねて描く短い表示 */
  overlayReady: string;
  overlayPaused: string;
  overlayOver: string;
  overlayWon: string;
  started: string;
  paused: string;
  resumed: string;
  /** {score} を置換して表示する */
  gameOverWall: string;
  /** {score} を置換して表示する */
  gameOverSelf: string;
  /** {score} を置換して表示する */
  won: string;
  newBest: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const snakeGameContent: Record<Locale, SnakeGamePageContent> = {
  ja: {
    title:
      'スネークゲーム｜キーボード・スワイプで遊べる無料ブラウザ版ヘビゲーム',
    description:
      '餌を食べるほど長くなる蛇を操作して、壁や自分の体にぶつからずに高得点を目指す定番のスネークゲームをブラウザで遊べます。矢印キー・WASD・スマホのスワイプや画面ボタンに対応し、ベストスコア記録付き。インストール・登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: 'スネークゲーム｜餌を食べて長くなる蛇を操作する定番ゲーム',
    introHtml:
      '餌を食べるほど長く、そして速くなる蛇を操作して、壁や自分の体にぶつからないように進むゲームです。パソコンでは矢印キー（またはWASD）、スマホでは盤面のスワイプや画面の矢印ボタンで操作できます。ベストスコアも記録されます。ほかのゲームでは <a href="/tools/invaders-game/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">インベーダーゲーム</a> や <a href="/tools/game-2048/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">2048</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「ゲーム開始」を押して始めます（ゲーム画面を選んだ状態でスペースキーを押しても始められます）。',
      '矢印キー（またはWASD）で蛇の向きを変えます。スマホは盤面をスワイプするか、画面の矢印ボタンを押します。',
      '赤い餌を食べると蛇が1マス長くなり、10点が入ります。食べるほど蛇は速くなります。',
      '壁や自分の体にぶつかるとゲームオーバーです。「一時停止」（またはPキー）で中断できます。',
    ],
    startButton: 'ゲーム開始',
    pauseButton: '一時停止',
    resumeButton: '再開',
    scoreLabel: 'スコア',
    bestLabel: 'ベスト',
    lengthLabel: '長さ',
    boardLabel: 'スネークゲームの画面',
    controlsLabel: '操作ボタン',
    upButton: '↑',
    downButton: '↓',
    leftButton: '←',
    rightButton: '→',
    overlayReady: '「ゲーム開始」を押してね',
    overlayPaused: '一時停止中',
    overlayOver: 'ゲームオーバー',
    overlayWon: 'クリア！',
    started: 'ゲームを開始しました。',
    paused: '一時停止しました。',
    resumed: '再開しました。',
    gameOverWall: '壁にぶつかってゲームオーバーです。スコアは {score} でした。',
    gameOverSelf:
      '自分の体にぶつかってゲームオーバーです。スコアは {score} でした。',
    won: '盤面をすべて埋めてクリアしました！スコアは {score} です。',
    newBest: 'ベストスコアを更新しました！',
    notesHeading: '注意事項',
    notes: [
      '操作は端末のブラウザ上だけで処理され、サーバーには何も送信されません。',
      '壁は通り抜けられません。ぶつかるとその場でゲームオーバーです。',
      '直前に進んできた向きと反対の向きへは曲がれません（その場で逆走して自滅するのを防ぐため）。素早く2回続けて曲がる操作は取りこぼさず順に反映されます。',
      '餌を食べるたびに蛇の速さが少しずつ上がり、一定の速さで頭打ちになります。',
      '盤面（20×20マス）をすべて蛇で埋めるとクリアです。',
      'ベストスコアはこのブラウザのローカルストレージに保存されます。ブラウザのデータを消去したり、別の端末・ブラウザを使ったりすると引き継がれません。',
      '別のタブを開いたり画面から離れたりすると、自動で一時停止します。ゲームの途中経過は保存されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'スワイプ',
        description:
          '指を画面につけたまま一方向へ滑らせる操作です。このゲームでは、盤面の上で指を動かした向きに蛇が曲がります。',
      },
    ],
  },
  en: {
    title: 'Snake Game – Play Free in Your Browser',
    description:
      'Play classic Snake in your browser: eat food to grow, avoid walls and your own tail. Arrow keys, WASD or swipes. Nothing is sent to a server.',
    h1: 'Snake Game – Eat, Grow and Don’t Hit Your Own Tail',
    introHtml:
      'Steer a snake that grows longer and faster with every bite, and try not to run into a wall or your own body. Use the arrow keys (or WASD) on a computer, or swipe the board or use the on-screen arrow buttons on a phone. Your best score is saved. Looking for another game? Try <a href="/en/tools/invaders-game/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Invaders Game</a> or <a href="/en/tools/game-2048/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">2048</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start game" to begin (or press the space bar while the game screen is focused).',
      'Turn the snake with the arrow keys (or WASD). On a phone, swipe the board or press the on-screen arrow buttons.',
      'Eating the red food makes the snake one cell longer and scores 10 points. The more you eat, the faster it moves.',
      'The game ends when you hit a wall or your own body. Use "Pause" (or the P key) to take a break.',
    ],
    startButton: 'Start game',
    pauseButton: 'Pause',
    resumeButton: 'Resume',
    scoreLabel: 'Score',
    bestLabel: 'Best',
    lengthLabel: 'Length',
    boardLabel: 'Snake game screen',
    controlsLabel: 'Control buttons',
    upButton: '↑',
    downButton: '↓',
    leftButton: '←',
    rightButton: '→',
    overlayReady: 'Press "Start game"',
    overlayPaused: 'Paused',
    overlayOver: 'Game over',
    overlayWon: 'You win!',
    started: 'The game has started.',
    paused: 'Paused.',
    resumed: 'Resumed.',
    gameOverWall: 'You hit a wall. Game over. Your score was {score}.',
    gameOverSelf: 'You ran into yourself. Game over. Your score was {score}.',
    won: 'You filled the whole board! Your score is {score}.',
    newBest: 'New best score!',
    notesHeading: 'Notes',
    notes: [
      'Everything runs in your browser and nothing is sent to a server.',
      'Walls are solid: hitting one ends the game immediately.',
      'You cannot turn straight back the way you came (to stop you from reversing into yourself). Two quick turns in a row are queued and applied in order rather than dropped.',
      'The snake speeds up a little with every piece of food, up to a maximum speed.',
      'Fill the entire 20×20 board with the snake to win.',
      'Your best score is stored in this browser’s local storage. It is not carried over if you clear site data or switch browsers or devices.',
      'The game pauses automatically when you switch tabs or leave the page. Game progress is not saved.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Swipe',
        description:
          'Sliding a finger across the screen in one direction without lifting it. In this game the snake turns toward the direction you swipe on the board.',
      },
    ],
  },
};
