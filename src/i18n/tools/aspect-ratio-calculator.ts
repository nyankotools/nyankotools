import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface AspectRatioCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること */
  introHtml: string;

  fromSizeHeading: string;
  widthLabel: string;
  heightLabel: string;
  simplifiedLabel: string;
  decimalLabel: string;
  nearestLabel: string;
  /** {ratio} {diff} を置換 */
  nearestApprox: string;
  /** {ratio} を置換 */
  nearestExact: string;
  useRatioButton: string;
  invalidSize: string;

  toSizeHeading: string;
  presetLabel: string;
  customOption: string;
  ratioWidthLabel: string;
  ratioHeightLabel: string;
  knownSideLabel: string;
  knownWidth: string;
  knownHeight: string;
  knownValueLabel: string;
  resultWidthLabel: string;
  resultHeightLabel: string;
  /** {value} {exact} を置換 */
  roundedNote: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  invalidRatio: string;

  tableHeading: string;
  /** {ratio} を置換 */
  tableCaption: string;
  columnWidth: string;
  columnHeight: string;
  roundedMark: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const aspectRatioCalculatorContent: Record<
  Locale,
  AspectRatioCalculatorPageContent
> = {
  ja: {
    title: 'アスペクト比計算機（比率の約分・解像度から縦横サイズを計算）',
    description:
      '幅と高さからアスペクト比（16:9など）を約分して求めたり、比率と片辺の長さからもう一辺を計算できる無料ツールです。16:9・4:3・21:9などのプリセット付き。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'アスペクト比計算機',
    introHtml:
      '画像や動画の幅・高さからアスペクト比を約分して求めたり、「16:9で幅1280pxなら高さは？」のように比率と片辺の長さからもう一辺を計算できます。よく使う比率のプリセットと、比率ごとの解像度一覧も表示します。実際に画像を縮小したい場合は <a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ</a>、ブラウザの画面サイズを確認したい場合は <a href="/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Viewportチェッカー</a> をご利用ください。入力値はブラウザ内で処理され、サーバーには送信されません。',
    fromSizeHeading: '幅と高さから比率を求める',
    widthLabel: '幅（px）',
    heightLabel: '高さ（px）',
    simplifiedLabel: 'アスペクト比（約分）',
    decimalLabel: '比率の値（幅 ÷ 高さ）',
    nearestLabel: '近い代表的な比率',
    nearestApprox: '{ratio}（差 約{diff}%）',
    nearestExact: '{ratio}（一致）',
    useRatioButton: 'この比率で寸法を計算',
    invalidSize: '幅と高さには0より大きい数値を入力してください。',

    toSizeHeading: '比率と片辺からもう一辺を求める',
    presetLabel: '比率のプリセット',
    customOption: 'カスタム',
    ratioWidthLabel: '比率の横',
    ratioHeightLabel: '比率の縦',
    knownSideLabel: '分かっている辺',
    knownWidth: '幅',
    knownHeight: '高さ',
    knownValueLabel: '長さ（px）',
    resultWidthLabel: '幅（px）',
    resultHeightLabel: '高さ（px）',
    roundedNote: '厳密値は {exact}。四捨五入して {value} としています。',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    invalidRatio: '比率と長さには0より大きい数値を入力してください。',

    tableHeading: '解像度一覧',
    tableCaption: '比率 {ratio} の代表的な解像度',
    columnWidth: '幅',
    columnHeight: '高さ',
    roundedMark: '（四捨五入）',

    notesHeading: '注意事項',
    notes: [
      '割り切れない場合は高さ・幅を四捨五入した整数で表示します。実際の画像や動画では、偶数に揃えるなど用途に応じた調整が必要になることがあります。',
      '幅・高さが小数の場合は、小数点以下6桁までを整数に直してから約分します。',
      '「近い代表的な比率」は、よく使う比率のプリセットの中で比率の値がもっとも近いものです。必ずしもその規格の画面サイズとは限りません。',
      '1366×768のように約分しても大きな数になる解像度は、16:9に近い値として扱われます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'アスペクト比',
        description:
          '画像や画面の幅と高さの比率です。1920×1080は16:9です。「横:縦」の順で表すのが一般的です。',
      },
      {
        term: '約分',
        description:
          '幅と高さを最大公約数で割って、もっとも小さい整数の比にすることです。1920と1080は最大公約数が120なので、16:9になります。',
      },
      {
        term: '解像度',
        description:
          '画像や画面を構成するピクセル数（幅×高さ）です。同じアスペクト比でも解像度は複数あります（例: 16:9の1280×720、1920×1080、3840×2160）。',
      },
    ],
  },
  en: {
    title: 'Aspect Ratio Calculator: Simplify Ratio, Find Missing Side',
    description:
      'Find the aspect ratio (like 16:9) from a width and height, or the missing side from a ratio. Includes presets. Runs in your browser.',
    h1: 'Aspect Ratio Calculator',
    introHtml:
      'Enter the width and height of an image or video to get its simplified aspect ratio, or pick a ratio and one side to find the other (for example, the height of a 16:9 frame that is 1280px wide). Common presets and a resolution list for each ratio are included. To actually scale an image, use the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>; to see your screen size, try the <a href="/en/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Viewport Checker</a>. Everything runs in your browser and nothing is sent to a server.',
    fromSizeHeading: 'Find the ratio from width and height',
    widthLabel: 'Width (px)',
    heightLabel: 'Height (px)',
    simplifiedLabel: 'Aspect ratio (simplified)',
    decimalLabel: 'Ratio value (width / height)',
    nearestLabel: 'Closest common ratio',
    nearestApprox: '{ratio} (about {diff}% off)',
    nearestExact: '{ratio} (exact match)',
    useRatioButton: 'Use this ratio below',
    invalidSize: 'Enter numbers greater than 0 for width and height.',

    toSizeHeading: 'Find a missing side from a ratio',
    presetLabel: 'Ratio preset',
    customOption: 'Custom',
    ratioWidthLabel: 'Ratio width',
    ratioHeightLabel: 'Ratio height',
    knownSideLabel: 'Known side',
    knownWidth: 'Width',
    knownHeight: 'Height',
    knownValueLabel: 'Length (px)',
    resultWidthLabel: 'Width (px)',
    resultHeightLabel: 'Height (px)',
    roundedNote: 'The exact value is {exact}, rounded to {value}.',
    copyButton: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    invalidRatio: 'Enter numbers greater than 0 for the ratio and length.',

    tableHeading: 'Resolution list',
    tableCaption: 'Common resolutions for {ratio}',
    columnWidth: 'Width',
    columnHeight: 'Height',
    roundedMark: '(rounded)',

    notesHeading: 'Notes',
    notes: [
      'When the result is not a whole number, it is rounded to the nearest integer. For real images and video you may need further adjustment, such as using even numbers.',
      'Decimal widths and heights are converted to integers using up to 6 decimal places before simplifying.',
      '"Closest common ratio" is the preset whose ratio value is nearest to yours; it does not mean the size is an official standard.',
      'Sizes such as 1366×768 do not reduce to small numbers, so they are shown as close to 16:9.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Aspect ratio',
        description:
          'The proportion between the width and height of an image or screen. 1920×1080 is 16:9. It is usually written as width:height.',
      },
      {
        term: 'Simplifying',
        description:
          'Dividing width and height by their greatest common divisor to get the smallest whole-number ratio. 1920 and 1080 share a divisor of 120, giving 16:9.',
      },
      {
        term: 'Resolution',
        description:
          'The number of pixels in an image or display (width × height). One aspect ratio has many resolutions, e.g. 1280×720, 1920×1080 and 3840×2160 for 16:9.',
      },
    ],
  },
};
