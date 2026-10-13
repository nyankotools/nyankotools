import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ScreenSizeCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること */
  introHtml: string;

  screenHeading: string;
  diagonalLabel: string;
  ratioPresetLabel: string;
  customOption: string;
  ratioWidthLabel: string;
  ratioHeightLabel: string;
  resPresetLabel: string;
  resWidthLabel: string;
  resHeightLabel: string;
  invalidScreen: string;
  /** {diff} を置換 */
  mismatchNote: string;

  resultHeading: string;
  widthLabel: string;
  heightLabel: string;
  areaLabel: string;
  ppiLabel: string;
  pitchLabel: string;
  invisibleLabel: string;
  overviewLabel: string;
  /** {cm} {inch} を置換 */
  lengthValue: string;
  /** {cm2} {in2} を置換 */
  areaValue: string;
  /** {ppi} を置換 */
  ppiValue: string;
  /** {mm} を置換 */
  pitchValue: string;
  /** {cm} を置換 */
  invisibleValue: string;
  /** {min} {max} を置換 */
  overviewValue: string;
  copyButton: string;
  copied: string;
  copyFailed: string;

  sizeHeading: string;
  cmWidthLabel: string;
  cmHeightLabel: string;
  invalidSize: string;
  diagResultLabel: string;
  /** {inch} {cm} を置換 */
  diagValue: string;
  sizeInchLabel: string;
  /** {w} {h} を置換 */
  sizeInchValue: string;
  nearestLabel: string;
  /** {ratio} {diff} を置換 */
  nearestApprox: string;
  /** {ratio} を置換 */
  nearestExact: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const screenSizeCalculatorContent: Record<
  Locale,
  ScreenSizeCalculatorPageContent
> = {
  ja: {
    title: '画面サイズ計算機（インチ⇔cm・PPI・ドットピッチ・視聴距離）',
    description:
      'モニターやテレビの対角インチと縦横比から画面の幅・高さ（cm）を計算し、解像度からPPI・ドットピッチ・視聴距離の目安も求める無料ツールです。cmからインチへの逆算にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画面サイズ計算機（インチ・PPI・解像度）',
    introHtml:
      'モニター・テレビ・スマホの対角インチと縦横比から、画面の幅と高さ（cm・インチ）や面積を計算します。解像度を入れればPPI（画素密度）とドットピッチ、画素が見分けにくくなる視聴距離の目安もわかります。幅×高さ（cm）から対角インチへの逆算もできます。縦横比や解像度の拡縮だけを知りたい場合は <a href="/tools/aspect-ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">アスペクト比計算機</a>、長さの単位換算は <a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換</a> をご利用ください。入力値はブラウザ内で処理され、サーバーには送信されません。',

    screenHeading: '対角インチからサイズ・PPIを求める',
    diagonalLabel: '対角サイズ（インチ）',
    ratioPresetLabel: '画面の縦横比',
    customOption: 'カスタム',
    ratioWidthLabel: '縦横比の横',
    ratioHeightLabel: '縦横比の縦',
    resPresetLabel: '解像度のプリセット',
    resWidthLabel: '解像度の横（px）',
    resHeightLabel: '解像度の縦（px）',
    invalidScreen:
      '対角サイズ・縦横比・解像度には0より大きい数値を入力してください。',
    mismatchNote:
      '解像度の縦横比と画面の縦横比が約{diff}%異なります。PPIは解像度の対角画素数と対角インチから求めた概算です。',

    resultHeading: '計算結果',
    widthLabel: '画面の幅',
    heightLabel: '画面の高さ',
    areaLabel: '画面の面積',
    ppiLabel: 'PPI（画素密度）',
    pitchLabel: 'ドットピッチ',
    invisibleLabel: '画素が見分けにくくなる距離（目安）',
    overviewLabel: '画面全体を見渡しやすい距離（目安）',
    lengthValue: '{cm} cm（{inch} インチ）',
    areaValue: '{cm2} cm²（{in2} 平方インチ）',
    ppiValue: '{ppi} PPI',
    pitchValue: '{mm} mm',
    invisibleValue: '約 {cm} cm 以上',
    overviewValue: '約 {min}〜{max} cm',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    sizeHeading: '幅×高さ（cm）から対角インチを求める',
    cmWidthLabel: '画面の幅（cm）',
    cmHeightLabel: '画面の高さ（cm）',
    invalidSize: '幅と高さには0より大きい数値を入力してください。',
    diagResultLabel: '対角サイズ',
    diagValue: '{inch} インチ（{cm} cm）',
    sizeInchLabel: '幅×高さ（インチ）',
    sizeInchValue: '{w} × {h} インチ',
    nearestLabel: '近い代表的な縦横比',
    nearestApprox: '{ratio}（差 約{diff}%）',
    nearestExact: '{ratio}（一致）',

    notesHeading: '注意事項',
    notes: [
      '計算は画面の表示領域（ベゼルを除いた部分）を対象にした理想値です。製品によってはカタログ値の対角インチが丸められており、実測値と少し異なることがあります。',
      '視聴距離は、視力1.0（1分角）で1画素が見分けにくくなる距離と、対角の1.0〜1.5倍という一般的な目安から求めた概算です。個人差や用途（作業用・映像鑑賞用）で適切な距離は変わります。',
      'PPIは解像度の対角画素数を対角インチで割った値です。画面の縦横比と解像度の縦横比が異なる場合は、概算である旨を表示します。',
      '曲面ディスプレイは、曲面に沿った長さではなく弦（直線）の長さで計算した近似値になります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '対角インチ',
        description:
          '画面の左上から右下までの対角線の長さをインチで表したものです。1インチは2.54cmです。画面サイズの呼び方として使われます。',
      },
      {
        term: 'PPI（画素密度）',
        description:
          '1インチあたりの画素（ピクセル）数です。値が大きいほど細かく表示でき、同じ解像度なら画面が小さいほどPPIは高くなります。',
      },
      {
        term: 'ドットピッチ',
        description:
          '隣り合う画素の中心間の距離（mm）です。25.4を PPI で割った値で、小さいほど精細です。',
      },
    ],
  },
  en: {
    title: 'Screen Size Calculator: Inches to cm, PPI, Dot Pitch',
    description:
      'Turn a screen diagonal in inches and aspect ratio into width and height in cm, then get PPI, dot pitch and a viewing distance estimate. Runs in your browser.',
    h1: 'Screen Size Calculator (Inches, PPI, Resolution)',
    introHtml:
      'Enter the diagonal size and aspect ratio of a monitor, TV or phone to get its width, height and area in cm and inches. Add the resolution to see the PPI, dot pitch and a rough distance at which pixels blend together. You can also work backwards from width and height in cm to the diagonal in inches. To only scale ratios and resolutions, use the <a href="/en/tools/aspect-ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Aspect Ratio Calculator</a>; for general length units, try the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>. Everything runs in your browser and nothing is sent to a server.',

    screenHeading: 'Find size and PPI from the diagonal',
    diagonalLabel: 'Diagonal size (inches)',
    ratioPresetLabel: 'Screen aspect ratio',
    customOption: 'Custom',
    ratioWidthLabel: 'Ratio width',
    ratioHeightLabel: 'Ratio height',
    resPresetLabel: 'Resolution preset',
    resWidthLabel: 'Resolution width (px)',
    resHeightLabel: 'Resolution height (px)',
    invalidScreen:
      'Enter numbers greater than 0 for the diagonal, ratio and resolution.',
    mismatchNote:
      'The resolution ratio differs from the screen ratio by about {diff}%. PPI is estimated from the diagonal pixel count and the diagonal size.',

    resultHeading: 'Results',
    widthLabel: 'Screen width',
    heightLabel: 'Screen height',
    areaLabel: 'Screen area',
    ppiLabel: 'PPI (pixel density)',
    pitchLabel: 'Dot pitch',
    invisibleLabel: 'Distance where pixels blend together (estimate)',
    overviewLabel: 'Comfortable distance to see the whole screen (estimate)',
    lengthValue: '{cm} cm ({inch} in)',
    areaValue: '{cm2} cm² ({in2} sq in)',
    ppiValue: '{ppi} PPI',
    pitchValue: '{mm} mm',
    invisibleValue: 'about {cm} cm or more',
    overviewValue: 'about {min} to {max} cm',
    copyButton: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    sizeHeading: 'Find the diagonal from width and height (cm)',
    cmWidthLabel: 'Screen width (cm)',
    cmHeightLabel: 'Screen height (cm)',
    invalidSize: 'Enter numbers greater than 0 for width and height.',
    diagResultLabel: 'Diagonal size',
    diagValue: '{inch} in ({cm} cm)',
    sizeInchLabel: 'Width × height (inches)',
    sizeInchValue: '{w} × {h} in',
    nearestLabel: 'Closest common ratio',
    nearestApprox: '{ratio} (about {diff}% off)',
    nearestExact: '{ratio} (exact match)',

    notesHeading: 'Notes',
    notes: [
      'Results are ideal values for the visible display area (excluding the bezel). Some products round the advertised diagonal, so measured sizes can differ slightly.',
      'Viewing distances are estimates: the distance where one pixel subtends one arcminute (20/20 vision), and a common rule of thumb of 1.0 to 1.5 times the diagonal. The right distance varies by person and use.',
      'PPI is the diagonal pixel count divided by the diagonal in inches. If the screen ratio and the resolution ratio differ, a note tells you the PPI is approximate.',
      'For curved displays the result uses the straight chord length rather than the length along the curve, so it is an approximation.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Diagonal size',
        description:
          'The length of the line from one corner of the screen to the opposite corner, in inches. One inch is 2.54 cm. It is the usual way to name a screen size.',
      },
      {
        term: 'PPI (pixel density)',
        description:
          'The number of pixels per inch. Higher values look sharper, and for the same resolution a smaller screen has a higher PPI.',
      },
      {
        term: 'Dot pitch',
        description:
          'The distance between the centers of neighboring pixels in mm. It equals 25.4 divided by the PPI; smaller means finer.',
      },
    ],
  },
};
