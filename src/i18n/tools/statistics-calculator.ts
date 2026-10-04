import type { Locale } from '../../data/tools';
import type { StatisticsError } from '../../lib/tools/statistics-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface StatisticsCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;

  dataLabel: string;
  dataPlaceholder: string;
  defaultData: string;
  dataHint: string;
  scoreLabel: string;
  scoreHint: string;

  errors: Record<StatisticsError, string>;
  /** {count} を無視した数値の個数に置き換える */
  ignoredNotice: string;

  resultHeading: string;
  labelCount: string;
  labelSum: string;
  labelMean: string;
  labelMedian: string;
  labelMode: string;
  noMode: string;
  labelMin: string;
  labelMax: string;
  labelRange: string;
  labelPopVariance: string;
  labelPopStdDev: string;
  labelSampleVariance: string;
  labelSampleStdDev: string;
  notAvailable: string;
  deviationHeading: string;
  deviationResult: string;
  deviationUndefined: string;
  copyButton: string;
  copied: string;
  copyFailed: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const statisticsCalculatorContent: Record<
  Locale,
  StatisticsCalculatorPageContent
> = {
  ja: {
    title: '偏差値・平均・標準偏差計算機（中央値・最頻値・分散も一括計算）',
    description:
      '数値を貼り付けるだけで、平均・中央値・最頻値・分散・標準偏差・最大/最小を一括で計算します。自分の得点を入力すれば偏差値も算出できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '偏差値・平均・標準偏差計算機',
    introHtml:
      'テストの得点や測定値など、数値をカンマ・スペース・改行で区切って入力すると、合計・平均・中央値・最頻値・最大/最小・分散・標準偏差（母集団・標本の両方）をまとめて計算します。自分の得点を入力すると、そのデータを母集団とした偏差値も求められます。計算はブラウザ内で行われ、入力した数値がサーバーに送信されることはありません。割合の計算は <a href="/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">比率計算機</a>、単位の換算は <a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換</a> もご利用ください。',
    numberLocale: 'ja-JP',

    dataLabel: 'データ（カンマ・スペース・改行区切り）',
    dataPlaceholder: '例: 62 75 80 58 91 70',
    defaultData: '62 75 80 58 91 70 66 84 73 77',
    dataHint:
      '全角数字も使えます。桁区切りのカンマ（1,000）は使えません。数値以外の文字は無視されます。',
    scoreLabel: '偏差値を求めたい得点（任意）',
    scoreHint: 'このデータ全体を母集団として偏差値を計算します。',

    errors: {
      empty: '数値を1つ以上入力してください',
      tooMany: 'データは10,000件以内にしてください',
    },
    ignoredNotice: '数値として読めない {count} 件を無視しました',

    resultHeading: '計算結果',
    labelCount: 'データ数',
    labelSum: '合計',
    labelMean: '平均',
    labelMedian: '中央値',
    labelMode: '最頻値',
    noMode: 'なし（すべて1回ずつ）',
    labelMin: '最小値',
    labelMax: '最大値',
    labelRange: '範囲（最大−最小）',
    labelPopVariance: '分散（母分散）',
    labelPopStdDev: '標準偏差（母標準偏差）',
    labelSampleVariance: '不偏分散',
    labelSampleStdDev: '標本標準偏差',
    notAvailable: '—（2件以上で計算）',
    deviationHeading: '偏差値',
    deviationResult: '得点 {score} の偏差値',
    deviationUndefined: '標準偏差が0のため偏差値を計算できません',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    notesHeading: '注意事項',
    notes: [
      '偏差値は「50＋10×（得点−平均）÷母標準偏差」で計算しています。入力したデータ全体を母集団として扱うため、実際の模試の偏差値（受験者全体の平均・標準偏差）とは一致しません。',
      'カンマは区切り文字として扱うため、「1,000」のような桁区切りは使わず「1000」と入力してください。',
      '小数の計算には浮動小数点誤差が含まれることがあります。表示は小数第6位までで丸めています。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '標準偏差',
        description:
          'データが平均からどれだけ散らばっているかを表す指標です。値が大きいほどばらつきが大きいことを示します。分散の平方根にあたります。',
      },
      {
        term: '母分散と不偏分散',
        description:
          '母分散は偏差の二乗の平均（データ数で割る）、不偏分散は標本から母集団を推定するためにデータ数−1で割ったものです。全データが対象なら母分散、一部を抽出したデータなら不偏分散を使います。',
      },
      {
        term: '偏差値',
        description:
          '平均を50、標準偏差を10に換算した得点です。平均点なら50、平均より標準偏差1つ分高ければ60になります。',
      },
      {
        term: '中央値・最頻値',
        description:
          '中央値は小さい順に並べたときの真ん中の値（データ数が偶数のときは中央の2つの値の平均）、最頻値は最も多く現れる値です。外れ値の影響を受けにくい代表値として使われます。',
      },
    ],
  },
  en: {
    title: 'Statistics Calculator: Mean, Median & Standard Deviation',
    description:
      'Paste numbers to get mean, median, mode, variance, and standard deviation at once, plus a T-score for any value. Runs in your browser; nothing is sent.',
    h1: 'Mean, Median & Standard Deviation Calculator',
    introHtml:
      'Enter numbers separated by commas, spaces, or new lines to get the sum, mean, median, mode, min, max, variance, and standard deviation, for both a population and a sample. Add one score to see its T-score (deviation score, mean 50 and SD 10) based on your data as the population. Everything is calculated in your browser, and nothing you type is sent to a server. For ratios, try the <a href="/en/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Ratio Calculator</a>; for unit math, try the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>.',
    numberLocale: 'en-US',

    dataLabel: 'Data (separated by commas, spaces, or new lines)',
    dataPlaceholder: 'e.g. 62 75 80 58 91 70',
    defaultData: '62 75 80 58 91 70 66 84 73 77',
    dataHint:
      'Full-width digits also work. Do not use thousands separators (1,000). Anything that is not a number is ignored.',
    scoreLabel: 'Score to convert to a T-score (optional)',
    scoreHint: 'Your data is treated as the whole population.',

    errors: {
      empty: 'Enter at least one number',
      tooMany: 'Please keep the data to 10,000 values or fewer',
    },
    ignoredNotice: 'Ignored {count} item(s) that are not numbers',

    resultHeading: 'Results',
    labelCount: 'Count',
    labelSum: 'Sum',
    labelMean: 'Mean',
    labelMedian: 'Median',
    labelMode: 'Mode',
    noMode: 'None (every value appears once)',
    labelMin: 'Minimum',
    labelMax: 'Maximum',
    labelRange: 'Range (max − min)',
    labelPopVariance: 'Population variance',
    labelPopStdDev: 'Population standard deviation',
    labelSampleVariance: 'Sample variance',
    labelSampleStdDev: 'Sample standard deviation',
    notAvailable: '— (needs 2 or more values)',
    deviationHeading: 'T-score',
    deviationResult: 'T-score of {score}',
    deviationUndefined:
      'The standard deviation is 0, so no T-score can be computed',
    copyButton: 'Copy results',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    notesHeading: 'Notes',
    notes: [
      'The T-score is 50 + 10 × (score − mean) ÷ population standard deviation. Your data is treated as the entire population, so it will not match a real exam’s score, which uses all test takers.',
      'Commas are treated as separators, so type 1000 rather than 1,000.',
      'Decimal arithmetic can show tiny floating-point errors. Displayed values are rounded to 6 decimal places.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Standard deviation',
        description:
          'A measure of how far values spread from the mean. A larger value means more variation. It is the square root of the variance.',
      },
      {
        term: 'Population vs. sample variance',
        description:
          'Population variance divides the squared deviations by n; sample variance divides by n − 1 to estimate the population from a sample. Use population when you have every value and sample when you have only a subset.',
      },
      {
        term: 'T-score',
        description:
          'A score rescaled to a mean of 50 and a standard deviation of 10. The average scores 50, and one standard deviation above it scores 60.',
      },
      {
        term: 'Median and mode',
        description:
          'The median is the middle value when sorted (the average of the two middle values when the count is even); the mode is the most frequent value. Both are less affected by outliers than the mean.',
      },
    ],
  },
};
