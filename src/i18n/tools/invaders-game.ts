import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface InvadersGamePageContent {
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
  fireButton: string;
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
  gameOverLives: string;
  /** {score} を置換して表示する */
  gameOverInvaded: string;
  newBest: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const invadersGameContent: Record<Locale, InvadersGamePageContent> = {
  ja: {
    title:
      'インベーダーゲーム｜キーボード・スマホで遊べる無料ブラウザシューティング',
    description:
      '左右に動く猫の隊列を撃ち落とす、定番のインベーダー系シューティングをブラウザで遊べます。矢印キー・スペースキー・スマホの画面ボタンに対応し、トーチカ・UFO・ステージ進行・ベストスコア記録付き。インストール・登録不要で、データはブラウザ内で処理されサーバーには送信されません。',
    h1: 'インベーダーゲーム｜降りてくる猫の隊列を撃ち落とすシューティング',
    introHtml:
      '左右に動きながら少しずつ降りてくる猫の隊列を、自機のビームで撃ち落とすシューティングゲームです。パソコンでは矢印キー（またはA・D）とスペースキー、スマホでは画面のボタンで操作できます。壊れていくトーチカ、ときどき横切る高得点のUFO、倒すほど速くなる隊列、ステージが進むほど激しくなる攻撃が楽しめ、ベストスコアも記録されます。ほかのゲームでは <a href="/tools/game-2048/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">2048</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「ゲーム開始」を押して始めます（ゲーム画面を選んだ状態でスペースキーを押しても始められます）。',
      '矢印キー（またはA・D）、スマホは画面の「←」「→」ボタンで自機を左右に動かします。',
      'スペースキー、またはスマホの「発射」ボタンでビームを撃ちます。弾は画面に1発だけなので、狙って撃ちましょう。',
      '敵を全滅させると次のステージへ進みます。敵の弾に3回当たるか、敵が自機の高さまで降りてくるとゲームオーバーです。「一時停止」で中断できます。',
    ],
    startButton: 'ゲーム開始',
    pauseButton: '一時停止',
    resumeButton: '再開',
    scoreLabel: 'スコア',
    bestLabel: 'ベスト',
    levelLabel: 'ステージ',
    livesLabel: '残機',
    boardLabel: 'インベーダーゲームの画面',
    controlsLabel: '操作ボタン',
    leftButton: '←',
    rightButton: '→',
    fireButton: '発射',
    overlayReady: '「ゲーム開始」を押してね',
    overlayPaused: '一時停止中',
    overlayOver: 'ゲームオーバー',
    started: 'ゲームを開始しました。',
    paused: '一時停止しました。',
    resumed: '再開しました。',
    levelUp: 'ステージ {level} に進みました。',
    lifeLost: '撃たれました。残機は {lives} です。',
    gameOverLives: 'ゲームオーバーです。スコアは {score} でした。',
    gameOverInvaded:
      '敵に降りてこられてゲームオーバーです。スコアは {score} でした。',
    newBest: 'ベストスコアを更新しました！',
    notesHeading: '注意事項',
    notes: [
      '操作は端末のブラウザ上だけで処理され、サーバーには何も送信されません。',
      '自機の弾は画面に1発だけです。当たるか画面の外へ出るまで、次の弾は撃てません。',
      '残機は3つです。撃たれたあとの約2秒間は、続けて撃たれても減りません。',
      '敵の数が減るほど隊列は速くなります。ステージが進むと隊列の速さ・弾の速さ・攻撃の頻度が上がり、開始位置も少し低くなります。',
      '得点は上の列の敵ほど高く（30・20・10点）、ときどき横切るUFOは50〜300点です。',
      'ベストスコアはこのブラウザのローカルストレージに保存されます。ブラウザのデータを消去したり、別の端末・ブラウザを使ったりすると引き継がれません。',
      '別のタブを開いたり画面から離れたりすると、自動で一時停止します。ゲームの途中経過は保存されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'トーチカ',
        description:
          '自機の前に並んだ防壁です。敵の弾も自機の弾も当たると壊れ、少しずつ削れていきます。敵が降りてきてぶつかっても壊れます。',
      },
      {
        term: 'UFO',
        description:
          '画面の上部をときどき横切る特別な敵です。降りてはきませんが、撃ち落とすと50〜300点の高得点が入ります。',
      },
    ],
  },
  en: {
    title: 'Invaders-Style Shooter – Play Free in Your Browser',
    description:
      'Play an invaders-style shooter in your browser: shoot down the descending cat fleet. Keyboard or touch buttons, shields, levels. Nothing is sent to a server.',
    h1: 'Invaders Game – Shoot Down the Descending Cat Fleet',
    introHtml:
      'A classic shoot-’em-up: a fleet of cats marches sideways and creeps down the screen, and you shoot them down from your cannon. Use the arrow keys (or A/D) and the space bar on a computer, or the on-screen buttons on a phone. Enjoy crumbling shields, a bonus UFO that flies across the top, a fleet that speeds up as you thin it out, and levels that get tougher, with your best score saved. Looking for another game? Try <a href="/en/tools/game-2048/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">2048</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start game" to begin (or press the space bar while the game screen is focused).',
      'Move your cannon left and right with the arrow keys (or A/D), or with the on-screen "←" and "→" buttons on a phone.',
      'Fire with the space bar or the on-screen "Fire" button. Only one shot can be on screen at a time, so aim carefully.',
      'Clear the whole fleet to reach the next level. You lose when you are hit three times or the fleet reaches your cannon. Use "Pause" to take a break.',
    ],
    startButton: 'Start game',
    pauseButton: 'Pause',
    resumeButton: 'Resume',
    scoreLabel: 'Score',
    bestLabel: 'Best',
    levelLabel: 'Level',
    livesLabel: 'Lives',
    boardLabel: 'Invaders game screen',
    controlsLabel: 'Control buttons',
    leftButton: '←',
    rightButton: '→',
    fireButton: 'Fire',
    overlayReady: 'Press "Start game"',
    overlayPaused: 'Paused',
    overlayOver: 'Game over',
    started: 'The game has started.',
    paused: 'Paused.',
    resumed: 'Resumed.',
    levelUp: 'Level {level}.',
    lifeLost: 'You were hit. {lives} lives left.',
    gameOverLives: 'Game over. Your score was {score}.',
    gameOverInvaded: 'The cats reached you. Game over. Your score was {score}.',
    newBest: 'New best score!',
    notesHeading: 'Notes',
    notes: [
      'Everything runs in your browser and nothing is sent to a server.',
      'Only one of your shots can be on screen at a time; you cannot fire again until it hits something or leaves the screen.',
      'You have three lives. For about two seconds after being hit you cannot be hit again.',
      'The fleet speeds up as it thins out. On later levels the fleet and the enemy shots get faster, enemies fire more often and the fleet starts a little lower.',
      'Enemies in the upper rows score more (30, 20 and 10 points); the UFO that sometimes flies across the top is worth 50 to 300 points.',
      'Your best score is stored in this browser’s local storage. It is not carried over if you clear site data or switch browsers or devices.',
      'The game pauses automatically when you switch tabs or leave the page. Game progress is not saved.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Shield',
        description:
          'The barriers in front of your cannon. They wear away when hit by enemy shots or your own, and they are also destroyed if the fleet descends into them.',
      },
      {
        term: 'UFO',
        description:
          'A special enemy that occasionally crosses the top of the screen. It never descends, but shooting it is worth 50 to 300 points.',
      },
    ],
  },
};
