import type { Locale } from '../../data/tools';
import type { RegressionError } from '../../lib/tools/linear-regression';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface LinearRegressionPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;

  dataLabel: string;
  dataPlaceholder: string;
  defaultData: string;
  dataHint: string;
  predictLabel: string;
  predictHint: string;

  errors: Record<RegressionError, string>;
  /** {count} を無視した行数に置き換える */
  ignoredNotice: string;

  resultHeading: string;
  labelCount: string;
  labelSlope: string;
  labelIntercept: string;
  labelEquation: string;
  labelR: string;
  labelR2: string;
  notAvailable: string;
  predictResult: string;
  predictUndefined: string;
  chartHeading: string;
  chartLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const linearRegressionContent: Record<
  Locale,
  LinearRegressionPageContent
> = {
  ja: {
    title: '回帰直線・相関係数計算機（最小二乗法・決定係数R²・散布図）',
    description:
      'x,yのデータを貼り付けるだけで、最小二乗法の回帰直線（傾き・切片）、相関係数r、決定係数R²を計算し、散布図に表示します。xからyの予測値も算出。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '回帰直線・相関係数計算機',
    introHtml:
      '1行に1組ずつ「x,y」を貼り付けると、最小二乗法による回帰直線 y = ax + b の傾き・切片、相関係数r、決定係数R²を求め、散布図と回帰直線を表示します。xの値を入力すれば、回帰直線から予測されるyも計算できます。計算はブラウザ内で行われ、入力したデータがサーバーに送信されることはありません。平均や標準偏差だけを知りたいときは <a href="/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">偏差値・平均・標準偏差計算機</a> もご利用ください。',
    numberLocale: 'ja-JP',

    dataLabel: 'データ（1行に x,y を1組）',
    dataPlaceholder: '例:\n1,2\n2,3.5\n3,5',
    defaultData: '1,52\n2,58\n3,61\n4,70\n5,74\n6,79\n7,83',
    dataHint:
      'カンマ・タブ・スペース区切りで入力できます。表計算ソフトの2列をそのまま貼り付けられます。2つの数値になっていない行（見出しなど）は無視されます。',
    predictLabel: '予測したい x の値（任意）',
    predictHint: '回帰直線に x を代入した y を計算します。',

    errors: {
      tooFew: 'データを2組以上入力してください',
      xConstant: 'x がすべて同じ値のため回帰直線を計算できません',
      tooMany: 'データは10,000組以内にしてください',
    },
    ignoredNotice: '2つの数値として読めない {count} 行を無視しました',

    resultHeading: '計算結果',
    labelCount: 'データ数',
    labelSlope: '傾き a',
    labelIntercept: '切片 b',
    labelEquation: '回帰直線',
    labelR: '相関係数 r',
    labelR2: '決定係数 R²',
    notAvailable: '— (y がすべて同じ値のため計算不可)',
    predictResult: 'x = {x} のときの予測値 y',
    predictUndefined: '予測値を計算できません',
    chartHeading: '散布図と回帰直線',
    chartLabel: 'データ点と回帰直線を示した散布図',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    notesHeading: '注意事項',
    notes: [
      'y を x で説明する単回帰（y on x）です。x と y を入れ替えると、傾きや切片は変わります（相関係数は変わりません）。',
      '相関が強いことは因果関係を意味しません。また、外れ値が1点あるだけで回帰直線は大きく動きます。散布図で確認してください。',
      '予測値はデータの範囲を超えた外挿では当てになりにくくなります。',
      '1行に2つ以上の数値がある行や、桁区切りカンマ（1,000）を含む行は無視されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '最小二乗法',
        description:
          '各データ点と直線との縦方向のずれ（残差）の二乗和が最小になるように直線を決める方法です。',
      },
      {
        term: '相関係数 r',
        description:
          '2つの変数の直線的な関係の強さを−1〜1で表します。1に近いほど正の相関、−1に近いほど負の相関、0に近いほど直線的な関係が弱いことを示します。',
      },
      {
        term: '決定係数 R²',
        description:
          '回帰直線がyのばらつきをどれだけ説明できているかを0〜1で表します。単回帰では相関係数rの2乗に等しくなります。',
      },
    ],
  },
  en: {
    title: 'Linear Regression Calculator: Best-Fit Line, r and R²',
    description:
      'Paste x,y data to get the least-squares regression line, slope, intercept, correlation r and R², plus a scatter plot and predictions. Runs in your browser.',
    h1: 'Linear Regression & Correlation Calculator',
    introHtml:
      'Paste one x,y pair per line to fit a least-squares line y = ax + b. You get the slope, intercept, correlation coefficient r, and R², drawn over a scatter plot. Enter an x value to predict y from the fitted line. Everything is calculated in your browser, and your data is never sent to a server. If you only need a mean or standard deviation, try the <a href="/en/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Statistics Calculator</a>.',
    numberLocale: 'en-US',

    dataLabel: 'Data (one x,y pair per line)',
    dataPlaceholder: 'e.g.\n1,2\n2,3.5\n3,5',
    defaultData: '1,52\n2,58\n3,61\n4,70\n5,74\n6,79\n7,83',
    dataHint:
      'Separate x and y with a comma, tab, or space. You can paste two columns straight from a spreadsheet. Lines that are not exactly two numbers (such as headers) are ignored.',
    predictLabel: 'x value to predict (optional)',
    predictHint: 'Plugs x into the fitted line to estimate y.',

    errors: {
      tooFew: 'Enter at least two data points',
      xConstant: 'All x values are the same, so no line can be fitted',
      tooMany: 'Please keep the data to 10,000 points or fewer',
    },
    ignoredNotice: 'Ignored {count} line(s) that are not two numbers',

    resultHeading: 'Results',
    labelCount: 'Points',
    labelSlope: 'Slope (a)',
    labelIntercept: 'Intercept (b)',
    labelEquation: 'Regression line',
    labelR: 'Correlation r',
    labelR2: 'R² (coefficient of determination)',
    notAvailable: '— (all y values are the same)',
    predictResult: 'Predicted y at x = {x}',
    predictUndefined: 'The prediction cannot be calculated',
    chartHeading: 'Scatter plot with regression line',
    chartLabel: 'Scatter plot of the data points with the regression line',
    copyButton: 'Copy results',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    notesHeading: 'Notes',
    notes: [
      'This is simple regression of y on x. Swapping x and y changes the slope and intercept (the correlation r stays the same).',
      'A strong correlation does not prove causation, and a single outlier can move the line a lot. Check the scatter plot.',
      'Predictions are unreliable outside the range of your data (extrapolation).',
      'Lines with more than two numbers, or with thousands separators such as 1,000, are ignored.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Least squares',
        description:
          'A method that chooses the line minimizing the sum of squared vertical distances (residuals) between the points and the line.',
      },
      {
        term: 'Correlation coefficient r',
        description:
          'Measures the strength of a straight-line relationship from −1 to 1. Near 1 is a strong positive relationship, near −1 a strong negative one, and near 0 a weak linear one.',
      },
      {
        term: 'R² (coefficient of determination)',
        description:
          'The share of the variation in y that the line explains, from 0 to 1. In simple regression it equals r squared.',
      },
    ],
  },
};
