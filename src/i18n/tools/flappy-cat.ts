import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FlappyCatPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  canvasLabel: string;
  startLabel: string;
  restartLabel: string;
  scoreLabel: string;
  bestLabel: string;
  bestNone: string;
  resetBestLabel: string;
  bestCleared: string;
  ready: string;
  playing: string;
  /** {score} を置換して表示する */
  finished: string;
  newBest: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const flappyCatContent: Record<Locale, FlappyCatPageContent> = {
  ja: {
    title: '猫ジャンプゲーム｜タップで羽ばたく1ボタンの無料ミニゲーム',
    description:
      'クリック・タップ・スペースキーだけで猫を操り、土管のすき間をくぐり抜ける1ボタンの猫ジャンプゲームです。ベストスコアを保存。スマホ対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '猫ジャンプゲーム（1ボタンで土管をくぐる）',
    introHtml:
      '画面をクリック・タップ（またはスペースキー・↑キー）するたびに猫が羽ばたいて上に跳び、何もしないと落ちていきます。次々に現れる土管のすき間をくぐり抜けた数がスコアです。ベストスコアはこの端末に保存されます。反射神経を測るなら <a href="/tools/reaction-test/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">反応速度テスト</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「スタート」を押すか、ゲーム画面をクリック（タップ）して始めます。',
      'クリック・タップ・スペースキー・↑キーで猫が羽ばたきます。押すタイミングで高さを調整します。',
      '土管の上下の壁や地面に当たるとゲームオーバーです。',
      '通り抜けた土管の数がスコアです。「もう一度遊ぶ」で再挑戦できます。',
    ],
    canvasLabel:
      '猫ジャンプゲームの画面。クリック・タップ・スペースキー・上矢印キーで猫が羽ばたきます。',
    startLabel: 'スタート',
    restartLabel: 'もう一度遊ぶ',
    scoreLabel: 'スコア',
    bestLabel: 'ベストスコア',
    bestNone: '記録なし',
    resetBestLabel: 'ベスト記録を消す',
    bestCleared: 'ベスト記録を消しました。',
    ready: '画面をクリック・タップするか、スペースキーで始まります。',
    playing: 'タイミングよく羽ばたいて、土管のすき間をくぐりましょう！',
    finished: 'ゲームオーバー！ スコアは {score} でした。',
    newBest: 'ベストスコアを更新しました！',
    notesHeading: '注意事項',
    notes: [
      'スコアは、通り抜けた土管の数です。土管や地面に当たると終了し、天井には当たっても終了しません。',
      '当たり判定は見た目の猫より少し小さくしてあります。土管のすき間の高さは毎回ランダムに決まりますが、すき間の大きさは一定です。',
      'ベストスコアはこの端末のブラウザ（localStorage）にのみ保存され、サーバーには送信されません。ブラウザのデータを消すと記録も消えます。',
      '端末の設定で『視差効果を減らす（動きを減らす）』が有効な場合、猫の待機中の上下の揺れと雲の動きを止めます。ゲーム自体は操作に応じて動きます。',
      '動きの多い画面が苦手な方は、ご注意ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '1ボタン操作',
        description:
          '操作が「押す」だけのゲームの形式です。押すタイミングと、押す回数の調整だけで難しさが生まれます。',
      },
      {
        term: '当たり判定',
        description:
          'キャラクターと障害物が接触したかを判断する範囲のことです。見た目より小さくすると、ぎりぎりの回避が成功しやすくなります。',
      },
    ],
  },
  en: {
    title: 'Cat Jump Game – One-Tap Flap Game in Your Browser',
    description:
      'Tap, click or press Space to flap your cat through the gaps between pipes in this free one-button cat jump game. Saves your best score. Works on mobile.',
    h1: 'Cat Jump Game (One-Button Pipe Dodger)',
    introHtml:
      'Click, tap, or press Space or the up arrow to make the cat flap upward; if you do nothing, it falls. Your score is the number of pipe gaps you fly through. Your best score is saved on this device. To test your reflexes in a different way, try the <a href="/en/tools/reaction-test/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Reaction Time Test</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start", or click or tap the game screen, to begin.',
      'Click, tap, or press Space or the up arrow to flap. Time your presses to control the height.',
      'Hitting a pipe or the ground ends the game.',
      'Each pipe you pass is one point. Press "Play again" to retry.',
    ],
    canvasLabel:
      'Cat Jump Game screen. Click, tap, or press Space or the up arrow key to make the cat flap.',
    startLabel: 'Start',
    restartLabel: 'Play again',
    scoreLabel: 'Score',
    bestLabel: 'Best score',
    bestNone: 'No record yet',
    resetBestLabel: 'Clear best score',
    bestCleared: 'Best score cleared.',
    ready: 'Click or tap the screen, or press Space, to start.',
    playing: 'Flap with good timing and fly through the gaps!',
    finished: 'Game over! You scored {score}.',
    newBest: 'New best score!',
    notesHeading: 'Notes',
    notes: [
      'Your score is the number of pipes you pass. Hitting a pipe or the ground ends the game; touching the top of the screen does not.',
      'The hit area is slightly smaller than the cat you see. The height of each gap is random, but the size of the gap stays the same.',
      'Your best score is stored only in this browser (localStorage) and is never sent to a server. Clearing your browser data removes it.',
      'If your device is set to reduce motion, the idle bobbing of the cat and the drifting clouds are turned off. The game itself still moves in response to your input.',
      'If you are sensitive to fast-moving screens, take care.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'One-button game',
        description:
          'A game where the only input is a single press. All of the difficulty comes from when and how often you press.',
      },
      {
        term: 'Hitbox',
        description:
          'The area used to decide whether a character touched an obstacle. A hitbox slightly smaller than the sprite makes close calls feel fairer.',
      },
    ],
  },
};
