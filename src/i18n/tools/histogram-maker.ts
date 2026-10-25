import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HistogramMakerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dataLabel: string;
  dataHint: string;
  sampleData: string;
  sampleButton: string;
  clearButton: string;
  widthLabel: string;
  widthPlaceholder: string;
  widthHint: string;
  startLabel: string;
  startPlaceholder: string;
  startHint: string;
  yModeLabel: string;
  yModeCount: string;
  yModeRelative: string;
  titleLabel: string;
  titlePlaceholder: string;
  xLabel: string;
  sizeLabel: string;
  scaleLabel: string;
  optionGrid: string;
  optionTransparent: string;
  downloadButton: string;
  downloaded: string;
  downloadFailed: string;
  canvasLabel: string;
  axisCount: string;
  axisRelative: string;
  tableHeading: string;
  thBin: string;
  thMidpoint: string;
  thCount: string;
  thRelative: string;
  thCumulative: string;
  thCumulativeRelative: string;
  totalRow: string;
  copyTsvButton: string;
  copyCsvButton: string;
  copied: string;
  copyFailed: string;
  /** `{total}` `{width}` `{start}` `{bins}` を置換して使うテンプレート */
  summaryTemplate: string;
  /** `{n}` を置換して使うテンプレート */
  ignoredTemplate: string;
  /** `{n}` を置換して使うテンプレート */
  excludedTemplate: string;
  errorEmpty: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManyTemplate: string;
  errorInvalidWidth: string;
  errorInvalidStart: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManyBinsTemplate: string;
  errorTooSmall: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const histogramMakerContent: Record<Locale, HistogramMakerPageContent> =
  {
    ja: {
      title: '度数分布表・ヒストグラム作成｜階級幅を指定してPNG保存',
      description:
        'データを貼り付けて階級幅を指定するだけで、度数分布表（度数・相対度数・累積度数）とヒストグラムを作成。PNG保存・表のコピーに対応。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '度数分布表・ヒストグラム作成（階級幅を指定してPNG保存）',
      introHtml:
        'テストの点数やアンケートの数値などを貼り付けると、階級ごとの度数・相対度数・累積度数・累積相対度数を表にまとめ、ヒストグラムを描きます。階級幅と開始値は自動でも手動でも指定でき、階級は下限以上・上限未満（左閉右開）で区切ります。表はTSV・CSVでコピーでき、グラフはPNG画像で保存できます。入力したデータはブラウザ内で処理され、サーバーには送信されません。平均や標準偏差も知りたいときは <a href="/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">偏差値・平均・標準偏差計算機</a> もご利用ください。',
      dataLabel: 'データ（数値）',
      dataHint:
        'カンマ・空白・改行・タブ区切りで数値を入力します（最大10000件、Excelの列をそのまま貼り付け可）。数値以外は無視されます。',
      sampleData:
        '45 52 58 61 63 64 67 68 70 71 72 73 74 75 76 77 78 79 80 81 82 83 85 86 88 90 92 95 98 100',
      sampleButton: 'サンプルを入れる',
      clearButton: 'クリア',
      widthLabel: '階級幅',
      widthPlaceholder: '自動',
      widthHint: '空欄なら、データ数に応じたキリのよい幅を自動で選びます。',
      startLabel: '開始値',
      startPlaceholder: '自動',
      startHint: '最初の階級の下限です。空欄なら階級幅の倍数に切り下げます。',
      yModeLabel: '縦軸',
      yModeCount: '度数',
      yModeRelative: '相対度数',
      titleLabel: 'タイトル',
      titlePlaceholder: '例: 数学テストの得点分布',
      xLabel: '横軸のラベル',
      sizeLabel: '画像のサイズ',
      scaleLabel: '解像度',
      optionGrid: 'グリッド線を表示',
      optionTransparent: '背景を透明にする',
      downloadButton: 'PNGで保存',
      downloaded: 'PNG画像を保存しました。',
      downloadFailed: '画像の書き出しに失敗しました。',
      canvasLabel: '作成したヒストグラムのプレビュー',
      axisCount: '度数',
      axisRelative: '相対度数（%）',
      tableHeading: '度数分布表',
      thBin: '階級（以上〜未満）',
      thMidpoint: '階級値',
      thCount: '度数',
      thRelative: '相対度数(%)',
      thCumulative: '累積度数',
      thCumulativeRelative: '累積相対度数(%)',
      totalRow: '合計',
      copyTsvButton: '表をTSVでコピー',
      copyCsvButton: '表をCSVでコピー',
      copied: '表をコピーしました。',
      copyFailed: 'コピーに失敗しました。',
      summaryTemplate:
        'データ{total}件 / 階級幅 {width} / 開始値 {start} / 階級数 {bins}',
      ignoredTemplate: '数値として読めなかった{n}個の項目を無視しました。',
      excludedTemplate: '開始値より小さい{n}件のデータは集計から除きました。',
      errorEmpty: '数値を入力してください。',
      errorTooManyTemplate: 'データは最大{max}件までです。',
      errorInvalidWidth: '階級幅は0より大きい数値を入力してください。',
      errorInvalidStart:
        '開始値は数値で、データの最大値以下になるように入力してください。',
      errorTooManyBinsTemplate:
        '階級数が多すぎます（最大{max}）。階級幅を大きくするか、開始値を調整してください。',
      errorTooSmall:
        '画像サイズに対して階級が多すぎて描画できません。画像のサイズを大きくするか、階級幅を広げてください。',
      notesHeading: '注意事項',
      notes: [
        '階級は下限以上・上限未満（左閉右開）です。たとえば階級幅10・開始値0なら、10はちょうど10〜20の階級に入ります。',
        '最大値が必ずいずれかの階級に入るよう、最後の階級は最大値を含むところまで作られます。',
        '階級数は最大200、データは最大10000件までです。',
        '開始値をデータの最小値より大きくすると、それより小さいデータは集計から除かれます。',
        '自動の階級幅は、スタージェスの公式（階級数 ≒ 1 + log2(データ数)）で目安の階級数を求め、データの範囲をそれで割ったキリのよい値です。あくまで目安なので、見やすい幅に調整してください。',
        '相対度数・累積相対度数は小数第3位を四捨五入して表示しているため、合計が100にならないことがあります。',
        '「背景を透明にする」を選ぶと、保存されるPNGの背景が透明になります。',
      ],
      howToHeading: '使い方',
      howToSteps: [
        '「データ（数値）」欄に、点数などの数値を貼り付ける',
        '必要なら「階級幅」と「開始値」を入力する（空欄なら自動）',
        '度数分布表とヒストグラムを確認し、タイトルや縦軸を整える',
        '「PNGで保存」でグラフを保存するか、表をTSV・CSVでコピーする',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '階級・階級幅',
          description:
            'データを区切った区間を階級、その幅を階級幅といいます。このツールの階級は「下限以上・上限未満」です。',
        },
        {
          term: '度数・相対度数',
          description:
            '度数は階級に入るデータの個数、相対度数は度数を全体の個数で割った割合です。',
        },
        {
          term: '累積度数',
          description:
            '最初の階級からその階級までの度数を足し合わせた値です。全体の個数で割ると累積相対度数になります。',
        },
        {
          term: 'スタージェスの公式',
          description:
            'データ数nから階級数の目安を 1 + log2(n) として求める経験則です。',
        },
      ],
    },
    en: {
      title: 'Histogram Maker & Frequency Table – PNG Online',
      description:
        'Paste data and set a bin width to get a frequency table (relative and cumulative) and a histogram you can save as PNG. Free; data stays in your browser.',
      h1: 'Histogram Maker and Frequency Distribution Table',
      introHtml:
        'Paste test scores, survey answers or any list of numbers to get a frequency table with counts, relative frequencies and cumulative frequencies, plus a histogram. Bin width and start value can be automatic or set by hand, and each bin includes its lower bound but not its upper bound. Copy the table as TSV or CSV, and save the chart as a PNG. Your data is processed in your browser and never uploaded. For the mean and standard deviation, try the <a href="/en/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Statistics Calculator</a>.',
      dataLabel: 'Data (numbers)',
      dataHint:
        'Enter numbers separated by commas, spaces, tabs or new lines (up to 10,000; you can paste a spreadsheet column). Anything that is not a number is ignored.',
      sampleData:
        '45 52 58 61 63 64 67 68 70 71 72 73 74 75 76 77 78 79 80 81 82 83 85 86 88 90 92 95 98 100',
      sampleButton: 'Insert sample',
      clearButton: 'Clear',
      widthLabel: 'Bin width',
      widthPlaceholder: 'Auto',
      widthHint:
        'Leave blank to pick a round width that suits the amount of data.',
      startLabel: 'Start value',
      startPlaceholder: 'Auto',
      startHint:
        'Lower bound of the first bin. Blank rounds down to a multiple of the bin width.',
      yModeLabel: 'Y-axis',
      yModeCount: 'Frequency',
      yModeRelative: 'Relative frequency',
      titleLabel: 'Title',
      titlePlaceholder: 'e.g. Math test scores',
      xLabel: 'X-axis label',
      sizeLabel: 'Image size',
      scaleLabel: 'Resolution',
      optionGrid: 'Show grid lines',
      optionTransparent: 'Transparent background',
      downloadButton: 'Save as PNG',
      downloaded: 'Saved the PNG image.',
      downloadFailed: 'Could not export the image.',
      canvasLabel: 'Preview of the histogram',
      axisCount: 'Frequency',
      axisRelative: 'Relative frequency (%)',
      tableHeading: 'Frequency table',
      thBin: 'Bin [lower, upper)',
      thMidpoint: 'Midpoint',
      thCount: 'Frequency',
      thRelative: 'Relative (%)',
      thCumulative: 'Cumulative',
      thCumulativeRelative: 'Cumulative relative (%)',
      totalRow: 'Total',
      copyTsvButton: 'Copy table as TSV',
      copyCsvButton: 'Copy table as CSV',
      copied: 'Copied the table.',
      copyFailed: 'Could not copy.',
      summaryTemplate:
        '{total} values / bin width {width} / start {start} / {bins} bins',
      ignoredTemplate: 'Ignored {n} item(s) that could not be read as numbers.',
      excludedTemplate:
        '{n} value(s) below the start value were left out of the counts.',
      errorEmpty: 'Enter some numbers.',
      errorTooManyTemplate: 'You can use up to {max} values.',
      errorInvalidWidth: 'Bin width must be a number greater than 0.',
      errorInvalidStart:
        'Start value must be a number no larger than the maximum of your data.',
      errorTooManyBinsTemplate:
        'Too many bins (maximum {max}). Use a larger bin width or adjust the start value.',
      errorTooSmall:
        'There are too many bins to draw at this image size. Choose a larger size or a wider bin width.',
      notesHeading: 'Notes',
      notes: [
        'Each bin includes its lower bound and excludes its upper bound (left-closed, right-open). With a width of 10 and a start of 0, the value 10 falls in the bin 10 to 20.',
        'Bins are created up to the one that contains the maximum value, so no data point is dropped at the right edge.',
        'Up to 200 bins and 10,000 values are supported.',
        'If you set a start value above the minimum, values below it are left out of the counts.',
        "The automatic bin width uses Sturges' rule (bins ≈ 1 + log2 n) to pick a target number of bins and divides the data range by it, rounded to a round number. It is only a starting point, so adjust it for readability.",
        'Relative and cumulative relative frequencies are rounded to two decimals in percent, so the displayed values may not add up to exactly 100.',
        'With "Transparent background" on, the saved PNG has a transparent background.',
      ],
      howToHeading: 'How to use',
      howToSteps: [
        'Paste your numbers into "Data (numbers)"',
        'Optionally enter "Bin width" and "Start value" (blank means automatic)',
        'Check the frequency table and histogram, and adjust the title and Y-axis',
        'Press "Save as PNG" to save the chart, or copy the table as TSV or CSV',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Bin and bin width',
          description:
            'A bin is one interval the data is grouped into, and its size is the bin width. Here each bin includes its lower bound but not its upper bound.',
        },
        {
          term: 'Frequency and relative frequency',
          description:
            'Frequency is the number of values in a bin. Relative frequency is that count divided by the total number of values.',
        },
        {
          term: 'Cumulative frequency',
          description:
            'The running total of frequencies from the first bin up to the current bin. Divided by the total, it becomes the cumulative relative frequency.',
        },
        {
          term: "Sturges' rule",
          description:
            'A rule of thumb that suggests about 1 + log2(n) bins for n data points.',
        },
      ],
    },
  };
