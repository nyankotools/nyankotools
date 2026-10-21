import type { Locale } from '../data/tools';

export interface ReferenceRow {
  /** 書き方（コード表記） */
  syntax: string;
  description: string;
}

export interface ExpressionReferenceContent {
  heading: string;
  functionsHeading: string;
  functions: ReferenceRow[];
  operatorsHeading: string;
  operators: ReferenceRow[];
  constantsHeading: string;
  constants: ReferenceRow[];
  /** 変数行。関数グラフは x、関数電卓は ans だけを一覧に加える */
  variables: { x: ReferenceRow; ans: ReferenceRow };
}

/** 式パーサー（src/lib/expression-parser.ts）で使える関数・演算子・定数の一覧。関数グラフと関数電卓で共有する */
export const expressionReference: Record<Locale, ExpressionReferenceContent> = {
  ja: {
    heading: '使える関数・演算子の一覧',
    functionsHeading: '関数',
    functions: [
      {
        syntax: 'sin(x) cos(x) tan(x)',
        description: '三角関数。角度の単位は度／ラジアンの設定に従います',
      },
      {
        syntax: 'asin(x) acos(x) atan(x)',
        description: '逆三角関数。結果は設定した角度の単位で返ります',
      },
      { syntax: 'atan2(y, x)', description: '2つの値から求める逆正接' },
      { syntax: 'sinh(x) cosh(x) tanh(x)', description: '双曲線関数' },
      {
        syntax: 'sqrt(x)　√x',
        description: '平方根（√2 のように括弧なしでも書けます）',
      },
      { syntax: 'cbrt(x)', description: '立方根' },
      { syntax: 'abs(x)', description: '絶対値' },
      { syntax: 'exp(x)', description: 'e の x 乗' },
      { syntax: 'ln(x)', description: '自然対数（底 e）' },
      {
        syntax: 'log(x)　log(x, b)',
        description: '常用対数（底10）。2つ目の引数で底を指定できます',
      },
      { syntax: 'log10(x) log2(x)', description: '底10・底2の対数' },
      { syntax: 'floor(x) ceil(x)', description: '切り捨て・切り上げ' },
      { syntax: 'round(x)', description: '四捨五入' },
      { syntax: 'trunc(x)', description: '小数部の切り捨て（0方向）' },
      { syntax: 'sign(x)', description: '符号（-1・0・1）' },
      { syntax: 'fact(x)', description: '階乗（0〜170の整数のみ）' },
      { syntax: 'pow(a, b)', description: 'a の b 乗' },
      { syntax: 'mod(a, b)', description: '剰余（結果は常に0以上）' },
      {
        syntax: 'min(a, b, …) max(a, b, …)',
        description: '最小値・最大値（引数は8個まで）',
      },
    ],
    operatorsHeading: '演算子・記法',
    operators: [
      {
        syntax: '+ - * /',
        description: '四則演算（全角の × ÷ − ＋ も使えます）',
      },
      {
        syntax: 'a^b',
        description: 'べき乗。2^3^2 は 2^(3^2) として右から計算します',
      },
      { syntax: 'n!', description: '階乗' },
      { syntax: 'n%', description: '100で割る（50% = 0.5）' },
      {
        syntax: '2x　2(x+1)　2pi',
        description: '掛け算の記号は省略できます',
      },
    ],
    constantsHeading: '定数・変数',
    constants: [
      { syntax: 'pi　π', description: '円周率' },
      { syntax: 'e', description: 'ネイピア数' },
      { syntax: 'tau', description: '2π' },
    ],
    variables: {
      x: { syntax: 'x', description: '横軸の変数' },
      ans: { syntax: 'ans', description: '直前の計算結果' },
    },
  },
  en: {
    heading: 'Supported functions and operators',
    functionsHeading: 'Functions',
    functions: [
      {
        syntax: 'sin(x) cos(x) tan(x)',
        description:
          'Trigonometric functions, in degrees or radians per the angle setting',
      },
      {
        syntax: 'asin(x) acos(x) atan(x)',
        description:
          'Inverse trig functions; results use the selected angle unit',
      },
      { syntax: 'atan2(y, x)', description: 'Two-argument arctangent' },
      {
        syntax: 'sinh(x) cosh(x) tanh(x)',
        description: 'Hyperbolic functions',
      },
      {
        syntax: 'sqrt(x)  √x',
        description: 'Square root (parentheses optional, as in √2)',
      },
      { syntax: 'cbrt(x)', description: 'Cube root' },
      { syntax: 'abs(x)', description: 'Absolute value' },
      { syntax: 'exp(x)', description: 'e raised to the power x' },
      { syntax: 'ln(x)', description: 'Natural logarithm (base e)' },
      {
        syntax: 'log(x)  log(x, b)',
        description:
          'Base-10 logarithm; pass a second argument for another base',
      },
      {
        syntax: 'log10(x) log2(x)',
        description: 'Base-10 and base-2 logarithms',
      },
      { syntax: 'floor(x) ceil(x)', description: 'Round down / round up' },
      { syntax: 'round(x)', description: 'Round to the nearest integer' },
      {
        syntax: 'trunc(x)',
        description: 'Drop the fractional part (toward 0)',
      },
      { syntax: 'sign(x)', description: 'Sign (-1, 0 or 1)' },
      { syntax: 'fact(x)', description: 'Factorial (whole numbers 0 to 170)' },
      { syntax: 'pow(a, b)', description: 'a raised to the power b' },
      { syntax: 'mod(a, b)', description: 'Modulo (never negative)' },
      {
        syntax: 'min(a, b, …) max(a, b, …)',
        description: 'Smallest / largest value (up to 8 arguments)',
      },
    ],
    operatorsHeading: 'Operators and notation',
    operators: [
      {
        syntax: '+ - * /',
        description: 'Arithmetic (full-width × ÷ − ＋ also work)',
      },
      {
        syntax: 'a^b',
        description: 'Power; 2^3^2 is evaluated right to left as 2^(3^2)',
      },
      { syntax: 'n!', description: 'Factorial' },
      { syntax: 'n%', description: 'Divide by 100 (50% = 0.5)' },
      {
        syntax: '2x  2(x+1)  2pi',
        description: 'The multiplication sign can be omitted',
      },
    ],
    constantsHeading: 'Constants and variables',
    constants: [
      { syntax: 'pi  π', description: 'Pi' },
      { syntax: 'e', description: "Euler's number" },
      { syntax: 'tau', description: '2π' },
    ],
    variables: {
      x: { syntax: 'x', description: 'The horizontal-axis variable' },
      ans: { syntax: 'ans', description: 'The previous result' },
    },
  },
};
