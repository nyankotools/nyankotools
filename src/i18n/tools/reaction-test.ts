import type { Locale } from '../../data/tools';
import type { RankId } from '../../lib/tools/reaction-test';

export interface ReactionTestPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  padIdle: string;
  padWaiting: string;
  padGo: string;
  padEarly: string;
  padResult: string;
  padDone: string;
  roundLabel: string;
  lastLabel: string;
  averageLabel: string;
  bestLabel: string;
  worstLabel: string;
  medianLabel: string;
  earlyCountLabel: string;
  rankLabel: string;
  ranks: Record<RankId, string>;
  resetLabel: string;
  historyLabel: string;
  unit: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const reactionTestContent: Record<Locale, ReactionTestPageContent> = {
  ja: {
    title: '反応速度テスト（色が変わったらクリック・5回平均）',
    description:
      '画面の色が変わった瞬間にクリック・タップ・Spaceキーを押して、反応速度をミリ秒で測定する無料ツールです。5回の平均・最速・ランク判定、フライング判定に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '反応速度テスト（色が変わったらクリック）',
    introHtml:
      '赤い画面が緑に変わったら、できるだけ早くクリック（タップ・Spaceキー）してください。5回の平均と最速をミリ秒で表示し、平均からランクも判定します。待ち時間は毎回ランダムで、早すぎる操作はフライングになります。マウスの調子は<a href="/tools/mouse-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">マウステスト</a>でも確認できます。',
    padIdle: 'クリック・タップ・Spaceキーで開始',
    padWaiting: '緑になるまで待ってください…',
    padGo: '今！',
    padEarly: 'フライング！ 緑になってから押してください。クリックでやり直し',
    padResult: 'ミリ秒。クリックで次のラウンドへ',
    padDone: '5回終了。クリックでもう一度測定します',
    roundLabel: 'ラウンド',
    lastLabel: '今回',
    averageLabel: '平均',
    bestLabel: '最速',
    worstLabel: '最遅',
    medianLabel: '中央値',
    earlyCountLabel: 'フライング回数',
    rankLabel: '判定',
    ranks: {
      excellent: 'とても速い',
      good: '速い',
      average: '平均的',
      slow: 'やや遅い',
      verySlow: '遅い',
    },
    resetLabel: 'リセット',
    historyLabel: '各回の記録',
    unit: 'ms',
    howToHeading: '使い方',
    howToSteps: [
      '測定エリアをクリック（またはタップ、Spaceキー）して開始します。',
      '赤い画面のあいだは待ちます。緑に変わったらすぐにクリックします。',
      '5回測定すると、平均・最速・ランクが表示されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '表示される値は『画面が変わってから入力イベントが届くまで』の時間です。モニターの表示遅延（リフレッシュレートや応答速度）、マウス・キーボード・タッチ画面の入力遅延、ブラウザの処理遅延が含まれるため、純粋な神経反応速度ではありません。',
      '同じ環境で比べるなら、結果は端末間でも比較できますが、デバイスが違うと数十ミリ秒の差が出ることがあります。',
      '緑になる前に操作するとフライングで、その回は記録されません。待ち時間は1.5〜5秒の範囲でランダムです。',
      'ランクは一般的な目安です（平均200ms未満でとても速い、250ms未満で速い、300ms未満で平均的）。体調・時間帯・年齢でも変わります。',
      '光過敏性の方は、色の切り替えにご注意ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '反応時間',
        description:
          '刺激（色の変化）を見てから動作（クリック）をするまでの時間です。視覚刺激への一般的な反応時間は200〜250ミリ秒前後といわれます。',
      },
      {
        term: 'フライング',
        description:
          '合図が出る前に操作してしまうことです。このツールでは、その回を無効にしてやり直しになります。',
      },
      {
        term: '入力遅延',
        description:
          '操作してからPCがそれを受け取るまでの遅れです。無線マウスやタッチ画面、リフレッシュレートの低いモニターでは大きくなる傾向があります。',
      },
    ],
  },
  en: {
    title: 'Reaction Time Test – Click When the Color Changes',
    description:
      'Test your reaction time in ms: click, tap or press Space when the screen turns green. Averages 5 rounds, shows your best time and a rank. Runs in your browser.',
    h1: 'Reaction Time Test (Click When It Turns Green)',
    introHtml:
      'Wait for the red screen to turn green, then click, tap or press Space as fast as you can. After 5 rounds you get your average and best time in milliseconds, plus a rank. The wait is random every time, and reacting too early counts as a false start. To check your mouse itself, try the <a href="/en/tools/mouse-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Mouse Tester</a>.',
    padIdle: 'Click, tap or press Space to start',
    padWaiting: 'Wait for green…',
    padGo: 'Now!',
    padEarly: 'Too soon! Wait for green. Click to try again',
    padResult: 'ms. Click for the next round',
    padDone: 'All 5 rounds done. Click to test again',
    roundLabel: 'Round',
    lastLabel: 'Last',
    averageLabel: 'Average',
    bestLabel: 'Best',
    worstLabel: 'Slowest',
    medianLabel: 'Median',
    earlyCountLabel: 'False starts',
    rankLabel: 'Rating',
    ranks: {
      excellent: 'Excellent',
      good: 'Fast',
      average: 'Average',
      slow: 'A bit slow',
      verySlow: 'Slow',
    },
    resetLabel: 'Reset',
    historyLabel: 'Round times',
    unit: 'ms',
    howToHeading: 'How to use',
    howToSteps: [
      'Click the test area (or tap it, or press Space) to start.',
      'Wait while it is red. As soon as it turns green, click.',
      'After 5 rounds you see your average, best time and rating.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The time shown runs from the screen change to the moment your input reaches the browser. It includes display lag (refresh rate, pixel response), input lag from your mouse, keyboard or touchscreen, and browser overhead, so it is not a pure measure of your nervous system.',
      'Results are best compared on the same device. Different hardware can shift the numbers by tens of milliseconds.',
      'Pressing before the screen turns green is a false start and that round is not recorded. The wait is random between 1.5 and 5 seconds.',
      'Ratings are rough guidelines: under 200 ms is excellent, under 250 ms is fast, under 300 ms is average. Fatigue, time of day and age also matter.',
      'If you are sensitive to flashing colors, be careful with the color changes.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Reaction time',
        description:
          'The delay between seeing a stimulus (the color change) and responding (the click). Typical visual reaction time is around 200–250 ms.',
      },
      {
        term: 'False start',
        description:
          'Reacting before the signal appears. Here the round is discarded and you start it again.',
      },
      {
        term: 'Input lag',
        description:
          'The delay between your action and the PC receiving it. It tends to be larger with wireless mice, touchscreens and low-refresh-rate monitors.',
      },
    ],
  },
};
