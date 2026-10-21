import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface AbTestCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  modeLabel: string;
  modeTest: string;
  modeSample: string;

  // 有意差の検定
  groupA: string;
  groupB: string;
  visitorsLabel: string;
  conversionsLabel: string;
  alphaLabel: string;
  alphaOption10: string;
  alphaOption5: string;
  alphaOption1: string;
  tailLabel: string;
  tailTwo: string;
  tailOne: string;

  resultHeading: string;
  rateA: string;
  rateB: string;
  diffLabel: string;
  liftLabel: string;
  zLabel: string;
  pLabel: string;
  ciLabel: string;
  /** {p} はp値、{alpha} は有意水準（%） */
  verdictSignificant: string;
  verdictNotSignificant: string;
  /** {level} は信頼水準（%） */
  ciNote: string;
  notApplicable: string;
  warnSmall: string;
  warnWinner: string;

  // 必要サンプルサイズ
  baselineLabel: string;
  effectTypeLabel: string;
  effectRelative: string;
  effectAbsolute: string;
  effectValueLabel: string;
  powerLabel: string;
  powerOption80: string;
  powerOption90: string;
  powerOption95: string;
  sampleHeading: string;
  targetRateLabel: string;
  perGroupLabel: string;
  totalLabel: string;
  /** {n} は各群の人数、{rate} は想定CVR */
  sampleNote: string;

  errorVisitors: string;
  errorConversions: string;
  errorAlpha: string;
  errorBaseline: string;
  errorEffect: string;
  errorPower: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const abTestCalculatorContent: Record<
  Locale,
  AbTestCalculatorPageContent
> = {
  ja: {
    title: 'A/Bテスト有意差・必要サンプルサイズ計算（p値・信頼区間）',
    description:
      'A/Bテストの結果が有意差ありか、2標本比率のz検定でp値・信頼区間を計算します。必要なサンプルサイズの計算にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'A/Bテスト有意差・必要サンプルサイズ計算',
    introHtml:
      'A/Bテストの訪問数とコンバージョン数を入力すると、コンバージョン率の差が偶然とは言いにくいかどうかを、2標本比率のz検定（プール分散）で判定します。p値・z値・相対改善率・差の信頼区間を表示し、両側/片側も切り替えられます。「必要サンプルサイズ」ではテスト開始前に各群に必要な人数を見積もれます。計算はブラウザ内で行われ、入力内容がサーバーに送信されることはありません。平均や標準偏差を調べたいときは <a href="/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">統計計算機</a>、損益分岐点を知りたいときは <a href="/tools/break-even-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">損益分岐点計算</a> もご利用ください。',

    modeLabel: '計算モード',
    modeTest: '有意差の検定',
    modeSample: '必要サンプルサイズ',

    groupA: 'A（元のパターン）',
    groupB: 'B（変更したパターン）',
    visitorsLabel: '訪問数',
    conversionsLabel: 'コンバージョン数',
    alphaLabel: '有意水準（α）',
    alphaOption10: '10%',
    alphaOption5: '5%',
    alphaOption1: '1%',
    tailLabel: '検定の種類',
    tailTwo: '両側検定（AとBに差があるか）',
    tailOne: '片側検定（BがAより高いか）',

    resultHeading: '検定結果',
    rateA: 'Aのコンバージョン率',
    rateB: 'Bのコンバージョン率',
    diffLabel: '差（B − A）',
    liftLabel: '相対改善率',
    zLabel: 'z値',
    pLabel: 'p値',
    ciLabel: '差の信頼区間',
    verdictSignificant:
      'p値 {p} が有意水準 {alpha}% を下回っているため、有意差あり（偶然とは考えにくい差）です。',
    verdictNotSignificant:
      'p値 {p} が有意水準 {alpha}% 以上のため、有意差なし（偶然の範囲内の差である可能性を否定できません）。',
    ciNote: '{level}% 信頼区間（Bの率 − Aの率、ポイント）',
    notApplicable: '—',
    warnSmall:
      'サンプルが小さい（期待度数が5未満のセルがある）ため、正規近似の精度が下がります。結果は参考程度にし、訪問数を増やして再確認してください。',
    warnWinner:
      '有意差ありは「Bが必ず勝ち」という意味ではありません。差の大きさ（信頼区間）や、事前に決めたサンプルサイズ・期間を守ったかも合わせて判断してください。',

    baselineLabel: '現在のコンバージョン率（%）',
    effectTypeLabel: '改善の指定方法',
    effectRelative: '相対（現在の何%増か）',
    effectAbsolute: '絶対（何ポイント増か）',
    effectValueLabel: '検出したい最小の改善（%）',
    powerLabel: '検出力（1 − β）',
    powerOption80: '80%',
    powerOption90: '90%',
    powerOption95: '95%',
    sampleHeading: '必要サンプルサイズ',
    targetRateLabel: '改善後に想定するコンバージョン率',
    perGroupLabel: '各群に必要な訪問数',
    totalLabel: '合計（A + B）',
    sampleNote:
      'コンバージョン率 {rate}% への改善を検出するには、各群 {n} 訪問が目安です。テストは事前に決めた人数に達するまで続けてください。',

    errorVisitors: '訪問数は1以上の整数で入力してください',
    errorConversions:
      'コンバージョン数は0以上で、訪問数以下の整数で入力してください',
    errorAlpha: '有意水準は0%より大きく50%未満にしてください',
    errorBaseline:
      '現在のコンバージョン率は0%より大きく100%未満で入力してください',
    errorEffect:
      '改善は0以外で、改善後のコンバージョン率が0%より大きく100%未満になる値を入力してください',
    errorPower: '検出力は50%より大きく100%未満にしてください',

    notesHeading: '注意事項',
    notes: [
      '2標本比率のz検定（プール分散）による正規近似です。各群の訪問数が小さい、またはコンバージョン率が0%や100%に近いと近似が粗くなります。期待度数が5未満のセルがあると警告を表示します。',
      '有意差ありは「偶然だけで説明しにくい」という意味にとどまり、Bが必ず勝つことや、差が事業上意味のある大きさであることは保証しません。差の大きさは信頼区間で確認してください。',
      '途中経過を何度も見て、有意になった時点でテストを止めると、実際より有意になりやすくなります（ピーキング問題）。サンプルサイズ計算で人数を決め、その人数に達してから判定してください。',
      '複数のパターンや複数の指標を同時に比べる場合は、多重比較の補正（ボンフェローニ補正など）が別途必要です。このツールは1回の比較（A対B）を前提としています。',
      '片側検定は「BがAより高い」場合だけを調べます。Bが下がった場合を見逃すため、迷うときは両側検定を使ってください。信頼区間は常に両側です。',
      'サンプルサイズは、各群に同数を割り当てる場合の値です。訪問者ごとの重複カウントや、曜日による変動などは考慮していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'p値',
        description:
          '「本当は差がない」と仮定したときに、今回以上に大きな差が偶然出る確率です。小さいほど偶然では説明しにくくなります。「Bが勝つ確率」ではない点に注意してください。',
      },
      {
        term: '有意水準（α）',
        description:
          '有意差ありと判定する基準となる確率で、一般に5%を使います。p値がαを下回ると有意差ありとし、差がないのに誤って有意と判定する確率（第一種の過誤）をα以下に抑えます。',
      },
      {
        term: '検出力（1 − β）',
        description:
          '本当に差があるときに、それを有意差として見つけられる確率です。一般に80%以上を目標にします。検出力が低いと、差があっても見逃しやすくなります。',
      },
      {
        term: '信頼区間',
        description:
          '真の差が含まれていると見込める範囲です。95%信頼区間が0をまたがなければ、5%水準で有意差ありと対応します。幅が広いほど、差の大きさが不確かです。',
      },
      {
        term: '相対改善率',
        description:
          'Aに対してBのコンバージョン率がどれだけ上がったかを、Aの率に対する割合で表したものです。Aが2%、Bが2.5%なら、差は0.5ポイントで相対改善率は+25%です。',
      },
    ],
  },
  en: {
    title: 'A/B Test Significance & Sample Size Calculator',
    description:
      'Check whether an A/B test is statistically significant (z-test, p-value, confidence interval) and find the sample size you need. Runs in your browser only.',
    h1: 'A/B Test Significance & Sample Size Calculator',
    introHtml:
      'Enter the visitors and conversions for each variant to test whether the difference in conversion rate is likely to be real, using a two-proportion z-test with pooled variance. You get the p-value, z-score, relative lift, and a confidence interval for the difference, with a one-sided or two-sided option. Switch to "Sample size" to estimate how many visitors each group needs before you start. Everything is calculated in your browser, and nothing you enter is sent to a server. For means and standard deviations, see the <a href="/en/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Statistics Calculator</a>; for profit planning, try the <a href="/en/tools/break-even-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Break-Even Calculator</a>.',

    modeLabel: 'Mode',
    modeTest: 'Significance test',
    modeSample: 'Sample size',

    groupA: 'A (control)',
    groupB: 'B (variant)',
    visitorsLabel: 'Visitors',
    conversionsLabel: 'Conversions',
    alphaLabel: 'Significance level (α)',
    alphaOption10: '10%',
    alphaOption5: '5%',
    alphaOption1: '1%',
    tailLabel: 'Test type',
    tailTwo: 'Two-sided (is there any difference?)',
    tailOne: 'One-sided (is B higher than A?)',

    resultHeading: 'Test result',
    rateA: 'Conversion rate A',
    rateB: 'Conversion rate B',
    diffLabel: 'Difference (B − A)',
    liftLabel: 'Relative lift',
    zLabel: 'z-score',
    pLabel: 'p-value',
    ciLabel: 'Confidence interval',
    verdictSignificant:
      'The p-value {p} is below the {alpha}% significance level, so the difference is statistically significant (unlikely to be chance alone).',
    verdictNotSignificant:
      'The p-value {p} is not below the {alpha}% significance level, so the difference is not statistically significant (it could be chance).',
    ciNote: '{level}% confidence interval for B − A, in percentage points',
    notApplicable: '—',
    warnSmall:
      'The sample is small (at least one expected count is below 5), so the normal approximation is less accurate. Treat the result as a rough guide and collect more visitors.',
    warnWinner:
      'A significant result does not mean B is a sure winner. Also look at the size of the difference (the confidence interval) and whether you kept to the sample size and duration you planned.',

    baselineLabel: 'Current conversion rate (%)',
    effectTypeLabel: 'How to specify the lift',
    effectRelative: 'Relative (% increase on current)',
    effectAbsolute: 'Absolute (percentage points)',
    effectValueLabel: 'Smallest lift to detect (%)',
    powerLabel: 'Power (1 − β)',
    powerOption80: '80%',
    powerOption90: '90%',
    powerOption95: '95%',
    sampleHeading: 'Required sample size',
    targetRateLabel: 'Expected conversion rate after the lift',
    perGroupLabel: 'Visitors needed per group',
    totalLabel: 'Total (A + B)',
    sampleNote:
      'To detect a lift to {rate}%, plan on about {n} visitors per group. Run the test until it reaches the planned number.',

    errorVisitors: 'Visitors must be a whole number of 1 or more',
    errorConversions:
      'Conversions must be a whole number between 0 and the number of visitors',
    errorAlpha: 'The significance level must be above 0% and below 50%',
    errorBaseline:
      'The current conversion rate must be above 0% and below 100%',
    errorEffect:
      'Enter a non-zero lift that keeps the expected conversion rate above 0% and below 100%',
    errorPower: 'Power must be above 50% and below 100%',

    notesHeading: 'Notes',
    notes: [
      'This is a normal approximation using a two-proportion z-test with pooled variance. It gets rough when groups are small or rates are close to 0% or 100%; a warning appears when any expected count is below 5.',
      'Significant only means the difference is hard to explain by chance alone. It does not guarantee B wins, or that the difference is large enough to matter for your business. Check the size of the effect in the confidence interval.',
      'Checking the results repeatedly and stopping as soon as they look significant makes false positives much more likely (the peeking problem). Decide the sample size first with the sample size mode and judge only after reaching it.',
      'Comparing several variants or metrics at once needs a multiple-comparison correction such as Bonferroni. This tool assumes a single A versus B comparison.',
      'The one-sided test only checks whether B is higher than A and misses a drop in B, so use the two-sided test when in doubt. The confidence interval is always two-sided.',
      'The sample size assumes equal traffic in both groups and ignores repeat visitors and weekday effects.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'p-value',
        description:
          'The probability of seeing a difference at least this large by chance if there were really no difference. Smaller values are harder to explain by chance. It is not the probability that B is better.',
      },
      {
        term: 'Significance level (α)',
        description:
          'The threshold for calling a result significant, usually 5%. If the p-value is below α the result is significant, which keeps the false positive rate (Type I error) at or below α.',
      },
      {
        term: 'Power (1 − β)',
        description:
          'The probability of detecting a real difference as significant. Aim for 80% or more; low power means real differences are easily missed.',
      },
      {
        term: 'Confidence interval',
        description:
          'A range likely to contain the true difference. If a 95% interval does not include 0, the result is significant at the 5% level. A wider interval means the size of the effect is less certain.',
      },
      {
        term: 'Relative lift',
        description:
          'The improvement of B over A as a percentage of A. If A converts at 2% and B at 2.5%, the difference is 0.5 points and the relative lift is +25%.',
      },
    ],
  },
};
