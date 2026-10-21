import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FunctionGrapherPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  functionsLabel: string;
  /** 各式の入力欄のラベル（後ろに番号を付ける） */
  curveLabel: string;
  curvePlaceholder: string;
  angleLabel: string;
  angleRad: string;
  angleDeg: string;
  viewLabel: string;
  xMinLabel: string;
  xMaxLabel: string;
  yMinLabel: string;
  yMaxLabel: string;
  zoomInButton: string;
  zoomOutButton: string;
  resetButton: string;
  downloadButton: string;
  canvasLabel: string;
  canvasHint: string;
  /** {x} {y} を置き換える */
  coords: string;
  /** {count} を置き換える */
  summary: string;
  noCurves: string;
  downloaded: string;
  downloadFailed: string;

  /** {position} を置き換える（文字位置付き） */
  errorAt: string;
  errorSyntax: string;
  errorParen: string;
  errorUnknownName: string;
  errorArity: string;
  errorTooLong: string;
  errorNotNumber: string;
  errorOrder: string;
  errorSpan: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const functionGrapherContent: Record<
  Locale,
  FunctionGrapherPageContent
> = {
  ja: {
    title: '関数グラフ描画（y=f(x)を複数重ねて表示・PNG保存）',
    description:
      'y=sin(x) や x^2 などの式を入力して関数のグラフを描画できます。最大6本の重ね描き、ドラッグで移動・ホイールで拡大縮小、度/ラジアン切替、PNG保存に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '関数グラフ描画（y=f(x)の重ね描き・PNG保存）',
    introHtml:
      'y=f(x) の式を入力すると、その場でグラフを描きます。最大6本まで色分けして重ね描きでき、ドラッグで移動、ホイールや「拡大」「縮小」ボタンでズームできます。1/x や tan(x) のような不連続な点では線をつながずに描きます。式の解析も描画もブラウザ内だけで行い、入力した式がサーバーに送信されることはありません。方程式の解を求めたいときは <a href="/tools/quadratic-solver/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">二次方程式の解の計算</a> もご利用ください。',

    functionsLabel: '関数の式',
    curveLabel: '式',
    curvePlaceholder: '例: sin(x)',
    angleLabel: '角度の単位',
    angleRad: 'ラジアン',
    angleDeg: '度',
    viewLabel: '表示範囲',
    xMinLabel: 'x の最小',
    xMaxLabel: 'x の最大',
    yMinLabel: 'y の最小',
    yMaxLabel: 'y の最大',
    zoomInButton: '拡大',
    zoomOutButton: '縮小',
    resetButton: 'リセット',
    downloadButton: 'PNGで保存',
    canvasLabel: '関数のグラフ',
    canvasHint: 'ドラッグで移動、ホイールで拡大縮小',
    coords: 'x = {x}、y = {y}',
    summary: '{count}本の関数を描画中',
    noCurves: 'グラフにする式を入力してください',
    downloaded: 'PNGを保存しました',
    downloadFailed: 'PNGの作成に失敗しました',

    errorAt: '（{position}文字目付近）',
    errorSyntax: '式の書き方が正しくありません',
    errorParen: '括弧の対応が取れていません',
    errorUnknownName:
      '未知の名前があります（使える変数は x、定数は pi と e です）',
    errorArity: '関数の引数の数が正しくありません',
    errorTooLong: '式が長すぎます（500文字まで）',
    errorNotNumber: '表示範囲には数値を入力してください',
    errorOrder: '表示範囲は最小値より最大値を大きくしてください',
    errorSpan: '表示範囲が小さすぎるか大きすぎます',

    howToHeading: '使い方',
    howToSteps: [
      '「関数の式」に y=f(x) の右辺を入力します（例: sin(x)、x^2/4、1/x）。複数の欄に入力すると色分けして重ね描きされます。',
      '三角関数を度で計算したいときは「角度の単位」を切り替え、「表示範囲」で x と y の範囲を指定します。',
      'グラフ上をドラッグして移動し、ホイールまたは「拡大」「縮小」で大きさを変えます。元に戻すには「リセット」を押します。',
      '「PNGで保存」で、いま表示している範囲を画像として保存できます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '使える演算子は + - * / ^ と、後置の ! と % です。2x や 2(x+1) のような省略した掛け算も使えます。',
      '使える関数は sin cos tan asin acos atan sinh cosh tanh sqrt cbrt abs exp ln log log2 log10 floor ceil round trunc sign pow mod min max などで、定数は pi と e です。',
      'ln は自然対数、log は常用対数（log(x, b) で底を指定）です。',
      '定義されない点（0での除算や負数の平方根など）では線が途切れます。tan(x) のような漸近線をまたぐ部分は線でつなぎません。',
      '式は一定間隔で計算して折れ線で描くため、非常に細かく振動する関数（sin(1000x) など）は正確に描けないことがあります。',
      'グラフの画像は白い背景で描画され、ダークモードでも同じ配色です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '漸近線',
        description:
          '曲線がどこまでも近づくものの交わらない直線です。1/x の x=0 や、tan(x) の x=π/2 などで、値が正負の無限大に発散します。',
      },
      {
        term: 'ラジアン',
        description:
          '角度の単位のひとつで、180° が π ラジアンです。多くのプログラムや数学で三角関数の標準の単位として使われます。',
      },
    ],
  },
  en: {
    title: 'Function Grapher: Plot y=f(x) Online and Save as PNG',
    description:
      'Plot y=f(x) graphs in your browser. Overlay up to 6 functions, drag to pan, scroll to zoom, switch degrees/radians and save a PNG. Nothing is uploaded.',
    h1: 'Function Grapher: Plot Multiple y=f(x) Curves and Save as PNG',
    introHtml:
      'Type an expression in x and the graph is drawn right away. Overlay up to six colored curves, drag to pan, and zoom with the mouse wheel or the "Zoom in" and "Zoom out" buttons. Curves are broken at discontinuities such as 1/x or tan(x) instead of drawing a false line across them. Parsing and drawing both happen in your browser, so your expressions are never sent to a server. Looking for roots instead? Try the <a href="/en/tools/quadratic-solver/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Quadratic Equation Solver</a>.',

    functionsLabel: 'Functions',
    curveLabel: 'Expression',
    curvePlaceholder: 'e.g. sin(x)',
    angleLabel: 'Angle unit',
    angleRad: 'Radians',
    angleDeg: 'Degrees',
    viewLabel: 'View range',
    xMinLabel: 'x min',
    xMaxLabel: 'x max',
    yMinLabel: 'y min',
    yMaxLabel: 'y max',
    zoomInButton: 'Zoom in',
    zoomOutButton: 'Zoom out',
    resetButton: 'Reset',
    downloadButton: 'Save as PNG',
    canvasLabel: 'Function graph',
    canvasHint: 'Drag to pan, scroll to zoom',
    coords: 'x = {x}, y = {y}',
    summary: 'Plotting {count} function(s)',
    noCurves: 'Enter an expression to plot.',
    downloaded: 'PNG saved',
    downloadFailed: 'Could not create the PNG.',

    errorAt: ' (near character {position})',
    errorSyntax: 'The expression is not valid.',
    errorParen: 'The parentheses do not match.',
    errorUnknownName:
      'Unknown name. The only variable is x; constants are pi and e.',
    errorArity: 'Wrong number of arguments for a function.',
    errorTooLong: 'The expression is too long (500 characters max).',
    errorNotNumber: 'Enter numbers for the view range.',
    errorOrder: 'Each maximum must be greater than its minimum.',
    errorSpan: 'The view range is too small or too large.',

    howToHeading: 'How to use',
    howToSteps: [
      'Type the right-hand side of y=f(x) into "Functions" (for example sin(x), x^2/4 or 1/x). Fill several boxes to overlay colored curves.',
      'Switch "Angle unit" if you want trigonometric functions in degrees, and set the x and y limits under "View range".',
      'Drag the graph to pan, and use the mouse wheel or "Zoom in" / "Zoom out" to change the scale. Press "Reset" to go back.',
      'Press "Save as PNG" to save the currently visible area as an image.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Operators: + - * / ^ plus postfix ! and %. Implicit multiplication such as 2x or 2(x+1) works too.',
      'Functions: sin cos tan asin acos atan sinh cosh tanh sqrt cbrt abs exp ln log log2 log10 floor ceil round trunc sign pow mod min max. Constants: pi and e.',
      'ln is the natural logarithm and log is base 10 (use log(x, b) for another base).',
      'The line breaks where the function is undefined, such as division by zero or the square root of a negative number, and across vertical asymptotes like tan(x).',
      'Curves are sampled at fixed steps and drawn as polylines, so extremely fast oscillations such as sin(1000x) may not be drawn accurately.',
      'The image is drawn on a white background and looks the same in dark mode.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Asymptote',
        description:
          'A line that a curve approaches forever without touching it. 1/x has one at x = 0 and tan(x) at x = π/2, where the value runs off to positive or negative infinity.',
      },
      {
        term: 'Radian',
        description:
          'An angle unit in which 180° equals π radians. Most programming languages and mathematics texts use radians for trigonometric functions by default.',
      },
    ],
  },
};
