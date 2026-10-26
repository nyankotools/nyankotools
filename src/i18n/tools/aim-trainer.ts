import type { Locale } from '../../data/tools';

export interface AimTrainerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  sizeLabel: string;
  sizeOptions: { value: number; label: string }[];
  startLabel: string;
  resetLabel: string;
  arenaLabel: string;
  targetLabel: string;
  arenaIdle: string;
  arenaDone: string;
  progressLabel: string;
  hitsLabel: string;
  missesLabel: string;
  accuracyLabel: string;
  averageLabel: string;
  bestLabel: string;
  worstLabel: string;
  medianLabel: string;
  recordLabel: string;
  newRecord: string;
  historyLabel: string;
  unit: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const aimTrainerContent: Record<Locale, AimTrainerPageContent> = {
  ja: {
    title: 'エイム練習（的クリックで精度と速度を測定）',
    description:
      '出現する的を20個クリックして、命中までの平均時間・精度・ミス回数を測定するエイム練習ツールです。ベスト記録はこの端末に保存。マウス・タッチ対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'エイム練習（的をクリックして精度と速度を測定）',
    introHtml:
      '的が出るたびにクリック（タップ）して、全部で20個を撃ち抜きます。的が出てから命中するまでの平均時間とミリ秒単位の最速、的を外したクリックを含めた精度を表示します。ベスト記録はこの端末のブラウザにだけ保存されます。ウォームアップには<a href="/tools/reaction-test/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">反応速度テスト</a>、マウスの確認には<a href="/tools/mouse-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">マウステスト</a>もどうぞ。',
    sizeLabel: '的の大きさ',
    sizeOptions: [
      { value: 56, label: '大（56px）' },
      { value: 40, label: '中（40px）' },
      { value: 24, label: '小（24px）' },
      { value: 16, label: '極小（16px）' },
    ],
    startLabel: 'スタート',
    resetLabel: 'リセット',
    arenaLabel: 'エイム練習エリア',
    targetLabel: '的',
    arenaIdle: '「スタート」を押すと的が出ます',
    arenaDone: '終了！ 結果は下に表示されています',
    progressLabel: '残りの的',
    hitsLabel: '命中',
    missesLabel: 'ミス（的外れ）',
    accuracyLabel: '精度',
    averageLabel: '平均時間',
    bestLabel: '最速',
    worstLabel: '最遅',
    medianLabel: '中央値',
    recordLabel: 'ベスト記録（平均時間）',
    newRecord: 'ベスト記録を更新しました！',
    historyLabel: '各的の記録',
    unit: 'ms',
    howToHeading: '使い方',
    howToSteps: [
      '的の大きさを選び、「スタート」を押します。',
      '出てきた的をできるだけ早く、正確にクリック（タップ）します。的を外したクリックはミスになります。',
      '20個終わると、平均時間・精度・ベスト記録が表示されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '時間は『的が表示されてからクリックが届くまで』で、モニターの表示遅延やマウス・タッチ画面の入力遅延、ブラウザの処理遅延を含みます。同じ環境での比較に向いています。',
      '的の大きさは4段階から選べ、ベスト記録は大きさごとに保存されます。練習エリアの大きさは画面幅に合わせて変わるため、画面サイズが違うと難しさも変わります。比較は同じ画面で行ってください。',
      '精度は『命中数 ÷ （命中数 ＋ ミス数）』です。的の外をクリックするとミスになり、的はそのまま残ります。',
      'ベスト記録（平均時間）はこのブラウザのlocalStorageにだけ保存され、サーバーには送られません。ブラウザのデータを消すと失われます。',
      '的は毎回ランダムな位置に出ます。点滅や急な動きが苦手な方は、無理のない範囲でお試しください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'エイム',
        description:
          'FPSなどのゲームで、照準を狙った位置に合わせる操作や技術のことです。マウスの細かい動かし方が重要になります。',
      },
      {
        term: '精度（命中率）',
        description:
          '全クリックのうち、的に当たったクリックの割合です。速さを優先して雑にクリックすると、精度が下がります。',
      },
      {
        term: '入力遅延',
        description:
          '操作してからPCがそれを受け取るまでの遅れです。無線マウスやタッチ画面、リフレッシュレートの低いモニターでは大きくなる傾向があります。',
      },
    ],
  },
  en: {
    title: 'Aim Trainer – Click Targets, Test Accuracy & Speed',
    description:
      'Browser aim trainer: click 20 targets and measure your average hit time in ms, accuracy and misses. Your best score is saved locally. Runs in your browser.',
    h1: 'Aim Trainer (Click Targets, Measure Accuracy & Speed)',
    introHtml:
      'Click (or tap) each target as it appears, 20 in total. You get your average time to hit, fastest hit in milliseconds, and an accuracy score that counts every click that missed. Your best score is stored only in this browser. To warm up, try the <a href="/en/tools/reaction-test/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Reaction Time Test</a>, or check your mouse with the <a href="/en/tools/mouse-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Mouse Tester</a>.',
    sizeLabel: 'Target size',
    sizeOptions: [
      { value: 56, label: 'Large (56px)' },
      { value: 40, label: 'Medium (40px)' },
      { value: 24, label: 'Small (24px)' },
      { value: 16, label: 'Tiny (16px)' },
    ],
    startLabel: 'Start',
    resetLabel: 'Reset',
    arenaLabel: 'Aim training area',
    targetLabel: 'Target',
    arenaIdle: 'Press "Start" to spawn the first target',
    arenaDone: 'Done! Your results are shown below',
    progressLabel: 'Targets left',
    hitsLabel: 'Hits',
    missesLabel: 'Misses',
    accuracyLabel: 'Accuracy',
    averageLabel: 'Average time',
    bestLabel: 'Fastest',
    worstLabel: 'Slowest',
    medianLabel: 'Median',
    recordLabel: 'Best score (average time)',
    newRecord: 'New best score!',
    historyLabel: 'Time per target',
    unit: 'ms',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a target size and press "Start".',
      'Click (or tap) each target as fast and as accurately as you can. A click that misses the target counts as a miss.',
      'After 20 targets you see your average time, accuracy and best score.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Time runs from the target appearing to your click reaching the browser, so it includes display lag, input lag from your mouse or touchscreen, and browser overhead. It is best for comparing runs on the same setup.',
      'You can pick one of four target sizes, and the best score is saved per size. The play area scales with the screen width, so difficulty changes with screen size; compare scores on the same screen.',
      'Accuracy is hits ÷ (hits + misses). Clicking outside the target is a miss, and the target stays where it is.',
      "Your best score (average time) is saved only in this browser's localStorage and is never sent to a server. Clearing browser data removes it.",
      'Targets appear at random positions. If sudden movement bothers you, play at a comfortable pace.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Aim',
        description:
          'In FPS and similar games, the skill of moving the crosshair precisely onto a target. Fine mouse control is the key.',
      },
      {
        term: 'Accuracy',
        description:
          'The share of all clicks that hit a target. Clicking sloppily for speed lowers it.',
      },
      {
        term: 'Input lag',
        description:
          'The delay between your action and the PC receiving it. It tends to be larger with wireless mice, touchscreens and low-refresh-rate monitors.',
      },
    ],
  },
};
