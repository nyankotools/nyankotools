import type { Locale } from '../../data/tools';

export interface JankenGamePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  chooseLabel: string;
  rock: string;
  scissors: string;
  paper: string;
  cpuLabel: string;
  playerLabel: string;
  /** 結果を出す前の案内 */
  waiting: string;
  win: string;
  lose: string;
  draw: string;
  /** {player} {cpu} {outcome} を置換して表示する */
  resultText: string;
  statsHeading: string;
  streakLabel: string;
  bestStreakLabel: string;
  winsLabel: string;
  lossesLabel: string;
  drawsLabel: string;
  historyHeading: string;
  historyEmpty: string;
  reset: string;
  resetDone: string;
  notesHeading: string;
  notes: string[];
}

export const jankenGameContent: Record<Locale, JankenGamePageContent> = {
  ja: {
    title: 'じゃんけんゲーム｜CPU対戦・連勝記録つきの無料ミニゲーム',
    description:
      'グー・チョキ・パーを選んでCPUとじゃんけん対戦。連勝数・最高連勝・通算の勝ち負け数を記録できる無料ミニゲームです。記録はこの端末のブラウザ内にだけ保存され、サーバーには送信されません。',
    h1: 'じゃんけんゲーム（CPU対戦・連勝記録）',
    introHtml:
      'グー・チョキ・パーのどれかを選んで、CPUとじゃんけんで勝負します。勝つたびに連勝が伸び、最高連勝と通算成績はこの端末に保存されます。CPUの手は偏りのない乱数で選ばれるので、勝率は長く遊ぶほど3分の1に近づきます。順番決めなどには <a href="/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ルーレット・抽選・サイコロ</a> も使えます。',
    chooseLabel: '出す手を選ぶ',
    rock: 'グー',
    scissors: 'チョキ',
    paper: 'パー',
    cpuLabel: 'CPU',
    playerLabel: 'あなた',
    waiting: '手を選んでください。',
    win: '勝ち',
    lose: '負け',
    draw: 'あいこ',
    resultText: 'あなた: {player} / CPU: {cpu} → {outcome}',
    statsHeading: '成績',
    streakLabel: '現在の連勝',
    bestStreakLabel: '最高連勝',
    winsLabel: '勝ち',
    lossesLabel: '負け',
    drawsLabel: 'あいこ',
    historyHeading: '直近の勝負',
    historyEmpty: 'まだ勝負していません。',
    reset: '成績をリセット',
    resetDone: '成績をリセットしました。',
    notesHeading: '注意事項',
    notes: [
      'CPUの手は、ブラウザの暗号用乱数で3つの手から等確率に選びます。あなたの手を見てから出す手を決めることはありません。',
      'あいこのときは連勝が途切れず、そのまま続きます。負けると連勝は0に戻ります。',
      '最高連勝と通算の勝ち・負け・あいこは、このブラウザの localStorage に保存されます。ブラウザのデータを消したり別の端末で開いたりすると引き継がれません。保存できない環境では、ページを開いている間だけ記録されます。',
      '現在の連勝と直近の勝負（最大20件）は、ページを閉じるか再読み込みすると消えます。',
    ],
  },
  en: {
    title: 'Rock Paper Scissors vs CPU – Win Streak Counter',
    description:
      'Play rock paper scissors against the computer and track your win streak, best streak and total wins, losses and ties. Your record stays in your browser.',
    h1: 'Rock Paper Scissors vs CPU with Win Streak',
    introHtml:
      'Pick rock, paper or scissors and play the computer. Each win extends your streak, and your best streak and overall record are saved on this device. The CPU picks its move with unbiased random numbers, so in the long run you should win about one round in three. To settle who goes first, you can also use the <a href="/en/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Roulette, Random Picker &amp; Dice Roller</a>.',
    chooseLabel: 'Choose your move',
    rock: 'Rock',
    scissors: 'Scissors',
    paper: 'Paper',
    cpuLabel: 'CPU',
    playerLabel: 'You',
    waiting: 'Choose a move to start.',
    win: 'You win',
    lose: 'You lose',
    draw: 'Tie',
    resultText: 'You: {player} / CPU: {cpu} → {outcome}',
    statsHeading: 'Your record',
    streakLabel: 'Current streak',
    bestStreakLabel: 'Best streak',
    winsLabel: 'Wins',
    lossesLabel: 'Losses',
    drawsLabel: 'Ties',
    historyHeading: 'Recent rounds',
    historyEmpty: 'No rounds played yet.',
    reset: 'Reset record',
    resetDone: 'Your record has been reset.',
    notesHeading: 'Notes',
    notes: [
      'The CPU picks one of the three moves with equal probability using your browser’s cryptographic random generator. It never looks at your move first.',
      'A tie keeps your streak alive. A loss resets it to 0.',
      'Your best streak and total wins, losses and ties are saved in this browser’s localStorage. Clearing browser data or switching devices starts a fresh record. If saving is blocked, the record lasts only while the page is open.',
      'The current streak and recent rounds (up to 20) are cleared when you close or reload the page.',
    ],
  },
};
