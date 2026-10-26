import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface WhackAMolePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  boardLabel: string;
  startLabel: string;
  restartLabel: string;
  timeLabel: string;
  /** {n} を置換して表示する */
  timeValue: string;
  scoreLabel: string;
  missLabel: string;
  accuracyLabel: string;
  bestLabel: string;
  bestNone: string;
  resetBestLabel: string;
  bestCleared: string;
  /** {n} を置換して表示する */
  holeEmpty: string;
  /** {n} を置換して表示する */
  holeMole: string;
  ready: string;
  playing: string;
  /** {hits} {accuracy} を置換して表示する */
  finished: string;
  newBest: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const whackAMoleContent: Record<Locale, WhackAMolePageContent> = {
  ja: {
    title: 'モグラ叩きゲーム｜30秒で何匹叩ける？スマホ対応の無料ミニゲーム',
    description:
      '穴から顔を出すネコをクリック・タップで叩く、30秒のモグラ叩きゲームです。時間が進むほど出現が速くなり、命中率とベストスコアも記録。スマホ対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'モグラ叩きゲーム（30秒チャレンジ）',
    introHtml:
      '穴から顔を出すネコを、クリックやタップで叩くモグラ叩きです。制限時間は30秒で、時間が経つほどネコの出現が速く、顔を出している時間も短くなります。ベストスコアはこの端末に保存されます。反射神経を測るなら <a href="/tools/reaction-test/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">反応速度テスト</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「スタート」を押すと、30秒のゲームが始まります。',
      '穴からネコが顔を出したら、すぐにクリック（タップ）して叩きます。',
      '空の穴を叩くとミスになります。時間とともに速くなるので、集中して続けます。',
      '30秒たつと終了です。スコア・命中率が表示され、「もう一度遊ぶ」で再挑戦できます。',
    ],
    boardLabel: 'モグラ叩きの盤面（3×3の穴）',
    startLabel: 'スタート',
    restartLabel: 'もう一度遊ぶ',
    timeLabel: '残り時間',
    timeValue: '{n}秒',
    scoreLabel: 'スコア',
    missLabel: 'ミス',
    accuracyLabel: '命中率',
    bestLabel: 'ベストスコア',
    bestNone: '記録なし',
    resetBestLabel: 'ベスト記録を消す',
    bestCleared: 'ベスト記録を消しました。',
    holeEmpty: '穴{n}',
    holeMole: '穴{n}（ネコが出ています）',
    ready: '「スタート」を押すと始まります。',
    playing: 'ネコが出たら叩いてください！',
    finished: '終了！ {hits}匹叩きました（命中率 {accuracy}%）。',
    newBest: 'ベストスコアを更新しました！',
    notesHeading: '注意事項',
    notes: [
      'スコアは、叩いたネコの数です。空の穴を叩いてもスコアは減らず、「ミス」と命中率に反映されます。',
      'ネコが顔を出している時間は、開始時は約1.2秒、終了間際は約0.65秒まで短くなります。出現の間隔も同様に速くなります。',
      'ベストスコアはこの端末のブラウザ（localStorage）にのみ保存され、サーバーには送信されません。ブラウザのデータを消すと記録も消えます。',
      '画面の描画が重い端末では、タイミングがずれて感じることがあります。他のタブやアプリを閉じて遊ぶと安定します。',
      '動きや点滅の多い画面が苦手な方は、ご注意ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'モグラ叩き',
        description:
          '穴から出てくる相手を、引っ込む前に叩くアーケード定番のゲームです。反射神経と、素早く狙いを切り替える力が試されます。',
      },
      {
        term: '命中率',
        description:
          '叩いた回数のうち、実際にネコに当たった割合です。むやみに連打すると下がります。',
      },
    ],
  },
  en: {
    title: 'Whack-a-Mole Game – 30-Second Challenge in Your Browser',
    description:
      'Whack the cats popping out of the holes in this free 30-second whack-a-mole game. It speeds up as you play and saves your best score. Works on mobile.',
    h1: 'Whack-a-Mole Game (30-Second Challenge)',
    introHtml:
      'Click or tap the cats as they pop out of the holes. You have 30 seconds, and the cats appear faster and stay up for less time as the clock runs down. Your best score is saved on this device. To test your reflexes in a different way, try the <a href="/en/tools/reaction-test/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Reaction Time Test</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start" to begin the 30-second game.',
      'When a cat pops out of a hole, click or tap it right away.',
      'Hitting an empty hole counts as a miss. The game speeds up over time, so stay focused.',
      'When the 30 seconds are up you see your score and accuracy. Press "Play again" to retry.',
    ],
    boardLabel: 'Whack-a-mole board (3×3 holes)',
    startLabel: 'Start',
    restartLabel: 'Play again',
    timeLabel: 'Time left',
    timeValue: '{n}s',
    scoreLabel: 'Score',
    missLabel: 'Misses',
    accuracyLabel: 'Accuracy',
    bestLabel: 'Best score',
    bestNone: 'No record yet',
    resetBestLabel: 'Clear best score',
    bestCleared: 'Best score cleared.',
    holeEmpty: 'Hole {n}',
    holeMole: 'Hole {n} (a cat is out)',
    ready: 'Press "Start" to begin.',
    playing: 'Whack the cats as they appear!',
    finished: 'Time is up! You whacked {hits} (accuracy {accuracy}%).',
    newBest: 'New best score!',
    notesHeading: 'Notes',
    notes: [
      'Your score is the number of cats you hit. Tapping an empty hole does not lower the score, but it counts as a miss and lowers your accuracy.',
      'A cat stays up for about 1.2 seconds at the start and about 0.65 seconds near the end. The gap between appearances shrinks in the same way.',
      'Your best score is stored only in this browser (localStorage) and is never sent to a server. Clearing your browser data removes it.',
      'On slower devices the timing can feel off. Closing other tabs and apps helps.',
      'If you are sensitive to fast-moving or flashing screens, take care.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Whack-a-mole',
        description:
          'A classic arcade game where you hit targets popping out of holes before they disappear. It tests reflexes and how quickly you can switch your aim.',
      },
      {
        term: 'Accuracy',
        description:
          'The share of your hits that landed on a cat. Mashing at random lowers it.',
      },
    ],
  },
};
