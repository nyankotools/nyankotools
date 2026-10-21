import type { Locale } from '../../data/tools';
import type { CalcErrorCode } from '../../lib/tools/scientific-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ScientificCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  expressionLabel: string;
  expressionPlaceholder: string;
  angleLabel: string;
  degLabel: string;
  radLabel: string;
  padLabel: string;
  keyLabels: Record<string, string>;
  resultLabel: string;
  errors: Record<CalcErrorCode, string>;
  copyResult: string;
  copied: string;
  copyFailed: string;
  historyHeading: string;
  historyEmpty: string;
  historyClear: string;
  historyItemLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const scientificCalculatorContent: Record<
  Locale,
  ScientificCalculatorPageContent
> = {
  ja: {
    title: '関数電卓（sin・cos・log・√・階乗・度/ラジアン切替・履歴）',
    description:
      'キーボードでもボタンでも使えるオンライン関数電卓。三角関数・対数・平方根・べき乗・階乗・パーセントに対応し、度/ラジアン切替と計算履歴つき。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '関数電卓（sin/cos/log/√/階乗・度とラジアン切替）',
    introHtml:
      '式をキーボードで入力して Enter を押すか、ボタンを押して計算します。三角関数・対数・平方根・べき乗・階乗・パーセントと、直前の結果を呼び出す ans が使えます。0.1+0.2 のような浮動小数点の誤差は有効12桁に丸めて表示します。図形の面積や体積を求めたいときは <a href="/tools/geometry-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">図形の面積・体積計算</a> も使えます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。',
    expressionLabel: '式',
    expressionPlaceholder: '例: sin(30)+2^10/4  ※Enterで計算',
    angleLabel: '角度の単位',
    degLabel: '度 (DEG)',
    radLabel: 'ラジアン (RAD)',
    padLabel: '電卓ボタン',
    keyLabels: {
      sin: 'サイン',
      cos: 'コサイン',
      tan: 'タンジェント',
      log: '常用対数',
      ln: '自然対数',
      sqrt: '平方根',
      pow: 'べき乗',
      fact: '階乗',
      pi: '円周率',
      e: 'ネイピア数',
      lp: '左かっこ',
      rp: '右かっこ',
      pct: 'パーセント',
      ans: '直前の結果',
      div: '割る',
      mul: '掛ける',
      sub: '引く',
      add: '足す',
      comma: 'カンマ',
      dot: '小数点',
      clear: '全消去',
      back: '1文字削除',
      eq: '計算する',
    },
    resultLabel: '計算結果',
    errors: {
      empty: '式を入力してください。',
      syntax:
        '式の形が正しくありません。演算子や数字の並びを確認してください。',
      paren: 'かっこの対応が取れていません。',
      unknownName:
        '未定義の名前があります。使えるのは関数名・pi・e・ans です。',
      arity: '関数に渡す引数の数が合っていません。',
      tooLong: '式が長すぎます（500文字まで）。',
      undefined: '計算できません（0÷0、負数の平方根、定義域外の値など）。',
      overflow: '計算できません（0で割った、または結果が大きすぎます）。',
    },
    copyResult: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    historyHeading: '計算履歴',
    historyEmpty: 'まだ履歴はありません。',
    historyClear: '履歴を消去',
    historyItemLabel: '式に戻す',
    notesHeading: '注意事項',
    notes: [
      '使える演算子は + - * / ^ ! % と、全角の × ÷ − も受け付けます。2π や 3(4+5) のような掛け算の省略もできます。',
      '使える関数は sin cos tan asin acos atan sinh cosh tanh sqrt cbrt abs exp ln log log2 floor ceil round mod min max などです。log は常用対数で、log(8,2) のように底を指定することもできます。',
      '三角関数は度かラジアンのどちらかで計算します。切り替えたあとは、Enter か = を押し直してください。',
      '結果は有効12桁に丸めて表示します。階乗は170!までの整数だけ計算できます。',
      '履歴は直近20件で、ページを閉じる・再読み込みすると消えます。履歴をクリックすると式を入力欄に戻します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ラジアン',
        description:
          '角度の単位のひとつで、180度がπラジアンにあたります。数学やプログラミングの三角関数は、ラジアンで角度を受け取るのが一般的です。',
      },
      {
        term: '常用対数と自然対数',
        description:
          '常用対数 log は10を底とする対数、自然対数 ln はネイピア数 e（約2.71828）を底とする対数です。log(1000) は3、ln(e) は1になります。',
      },
      {
        term: '階乗',
        description:
          '1からnまでの整数をすべて掛けた値で、n! と書きます。5! は 5×4×3×2×1 = 120 です。0! は1と定めます。',
      },
    ],
  },
  en: {
    title: 'Scientific Calculator Online (Degrees, Radians, History)',
    description:
      'Free online scientific calculator: sin, cos, log, roots, powers and factorials. Type or tap, switch degrees/radians, keep a history. Runs in your browser.',
    h1: 'Scientific Calculator (Trig, Log, Roots, Factorial, Degrees/Radians)',
    introHtml:
      'Type an expression and press Enter, or tap the buttons. It supports trigonometry, logarithms, square roots, powers, factorials, percent, and "ans" for the previous result. Floating-point noise such as 0.1+0.2 is rounded to 12 significant digits. For areas and volumes of shapes, try the <a href="/en/tools/geometry-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Geometry Calculator</a>. Everything runs in your browser, so nothing you type is sent to a server.',
    expressionLabel: 'Expression',
    expressionPlaceholder: 'e.g. sin(30)+2^10/4 (press Enter to calculate)',
    angleLabel: 'Angle unit',
    degLabel: 'Degrees (DEG)',
    radLabel: 'Radians (RAD)',
    padLabel: 'Calculator keys',
    keyLabels: {
      sin: 'Sine',
      cos: 'Cosine',
      tan: 'Tangent',
      log: 'Base-10 logarithm',
      ln: 'Natural logarithm',
      sqrt: 'Square root',
      pow: 'Power',
      fact: 'Factorial',
      pi: 'Pi',
      e: 'Euler’s number',
      lp: 'Left parenthesis',
      rp: 'Right parenthesis',
      pct: 'Percent',
      ans: 'Previous answer',
      div: 'Divide',
      mul: 'Multiply',
      sub: 'Subtract',
      add: 'Add',
      comma: 'Comma',
      dot: 'Decimal point',
      clear: 'Clear all',
      back: 'Delete last character',
      eq: 'Calculate',
    },
    resultLabel: 'Result',
    errors: {
      empty: 'Enter an expression.',
      syntax: 'The expression is not valid. Check the operators and numbers.',
      paren: 'The parentheses do not match.',
      unknownName: 'Unknown name. You can use function names, pi, e and ans.',
      arity: 'A function got the wrong number of arguments.',
      tooLong: 'The expression is too long (500 characters max).',
      undefined:
        'Cannot calculate this (for example 0÷0, the square root of a negative number, or a value outside the domain).',
      overflow:
        'Cannot calculate this (division by zero, or the result is too large).',
    },
    copyResult: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    historyHeading: 'History',
    historyEmpty: 'No calculations yet.',
    historyClear: 'Clear history',
    historyItemLabel: 'Reuse expression',
    notesHeading: 'Notes',
    notes: [
      'Operators are + - * / ^ ! %. The full-width × ÷ − are accepted too, and you can omit the multiplication sign as in 2π or 3(4+5).',
      'Functions include sin cos tan asin acos atan sinh cosh tanh sqrt cbrt abs exp ln log log2 floor ceil round mod min max. log is base 10; pass a base as in log(8,2).',
      'Trig functions use either degrees or radians. After switching, press Enter or = again to recalculate.',
      'Results are rounded to 12 significant digits. Factorials work for whole numbers up to 170!.',
      'The history keeps the last 20 calculations and is cleared when you close or reload the page. Click an entry to put its expression back in the input.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Radian',
        description:
          'A unit of angle where 180 degrees equals π radians. Math libraries and programming languages usually expect radians for trig functions.',
      },
      {
        term: 'Common vs natural logarithm',
        description:
          'The common logarithm (log) uses base 10, while the natural logarithm (ln) uses Euler’s number e (about 2.71828). log(1000) is 3 and ln(e) is 1.',
      },
      {
        term: 'Factorial',
        description:
          'The product of all whole numbers from 1 to n, written n!. For example 5! = 5×4×3×2×1 = 120, and 0! is defined as 1.',
      },
    ],
  },
};
