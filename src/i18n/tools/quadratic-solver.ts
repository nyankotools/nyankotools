import type { Locale } from '../../data/tools';
import type {
  LinearSystemKind,
  QuadraticKind,
  StepKey,
} from '../../lib/tools/quadratic-solver';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface QuadraticSolverPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  quadHeading: string;
  quadIntro: string;
  quadALabel: string;
  quadBLabel: string;
  quadCLabel: string;
  quadError: string;
  quadKinds: Record<QuadraticKind, string>;
  quadDiscriminantLabel: string;
  quadRootsLabel: string;

  sysHeading: string;
  sysIntro: string;
  sysSizeLegend: string;
  sysSize2: string;
  sysSize3: string;
  /** {row} は式の番号、{var} は変数名に置換される */
  coefAria: string;
  constAria: string;
  sysError: string;
  sysKinds: Record<LinearSystemKind, string>;
  sysSolutionLabel: string;

  stepsHeading: string;
  stepLabels: Record<StepKey, string>;
  copyButton: string;
  copied: string;
  copyFailed: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const quadraticSolverContent: Record<
  Locale,
  QuadraticSolverPageContent
> = {
  ja: {
    title: '二次方程式・連立方程式ソルバー｜途中式つきで解く',
    description:
      '二次方程式 ax²+bx+c=0 の判別式・実数解・重解・虚数解と、2元・3元の連立一次方程式（クラメルの公式）を途中式つきで解く無料ツール。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '二次方程式・連立方程式ソルバー（途中式つき）',
    introHtml:
      '二次方程式 ax²+bx+c=0 を判別式から順に解き、実数解・重解・虚数解を判定します。2元・3元の連立一次方程式はクラメルの公式で解き、解なし・不定の判定も行います。答えだけでなく途中式を表示するので、宿題の検算や学習にも使えます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。比や比例式を扱いたい場合は <a href="/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">割合・比率計算機</a> もご利用ください。',

    quadHeading: '1. 二次方程式 ax² + bx + c = 0',
    quadIntro:
      '係数 a・b・c を入力してください。空欄は 0 として扱います。a が 0 のときは一次方程式として解きます。',
    quadALabel: 'a（x² の係数）',
    quadBLabel: 'b（x の係数）',
    quadCLabel: 'c（定数項）',
    quadError: '計算できませんでした（係数には有限の数値を入力してください）',
    quadKinds: {
      'two-real': '異なる2つの実数解（D > 0）',
      double: '重解（D = 0）',
      complex: '異なる2つの虚数解（D < 0）',
      linear: 'a = 0 のため一次方程式として解きました',
      'linear-none': '解なし（0 = c で c ≠ 0）',
      identity: '任意の x が解（0 = 0）',
    },
    quadDiscriminantLabel: '判別式 D',
    quadRootsLabel: '解',

    sysHeading: '2. 連立一次方程式（クラメルの公式）',
    sysIntro:
      '未知数の数を選び、各式の係数と右辺の定数を入力してください。空欄は 0 として扱います。',
    sysSizeLegend: '未知数の数',
    sysSize2: '2元（x, y）',
    sysSize3: '3元（x, y, z）',
    coefAria: '式{row}：{var} の係数',
    constAria: '式{row}：右辺の定数',
    sysError: '計算できませんでした（係数には有限の数値を入力してください）',
    sysKinds: {
      unique: '解はただ1組に決まります',
      none: '解なし（式どうしが矛盾しています）',
      infinite: '不定（解が無数にあります）',
    },
    sysSolutionLabel: '解',

    stepsHeading: '途中式',
    stepLabels: {
      equation: '方程式',
      linearEquation: '一次方程式として整理',
      discriminant: '判別式',
      formula: '解の公式に代入',
      solution: '解',
      determinant: '係数の行列式 D',
      replacedDeterminant: '該当する列を右辺の定数に置き換えた行列式',
      rankCheck: '階数の比較（係数行列 A と拡大係数行列 [A | b]）',
    },
    copyButton: '結果と途中式をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    notesHeading: '注意事項',
    notes: [
      '計算は浮動小数点で行い、表示は有効数字10桁で丸めます。係数が整数の連立方程式では、割り切れない解を既約分数でも併記します。',
      '二次方程式の解は小数で表示します。平方根を含む形（例：1 ± √2）で答えたい場合は、途中式の解の公式への代入結果を参照してください。',
      '連立方程式は行列式が0のとき、係数行列と拡大係数行列の階数を比べて「解なし」か「不定」かを判定します。',
      '学習・検算用のツールです。試験や業務で使う場合は、結果を必ずご自身で確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '判別式',
        description:
          '二次方程式 ax²+bx+c=0 に対して D = b² − 4ac で定義される値。D > 0 なら異なる2つの実数解、D = 0 なら重解、D < 0 なら異なる2つの虚数解（互いに共役）を持ちます。',
      },
      {
        term: '重解',
        description:
          '二次方程式で2つの解が一致している状態。グラフでは放物線が x 軸にちょうど接する場合にあたり、解は x = −b / 2a です。',
      },
      {
        term: '虚数解',
        description:
          '虚数単位 i（i² = −1）を含む解。実数係数の二次方程式では、D < 0 のとき (−b ± √|D| i) / 2a の形の共役な2つの解になります。',
      },
      {
        term: 'クラメルの公式',
        description:
          '係数行列の行列式 D が0でないとき、各未知数を「D の該当列を右辺の定数に置き換えた行列式 ÷ D」で求める方法。2元・3元の連立一次方程式に向いています。',
      },
    ],
  },
  en: {
    title: 'Quadratic & Linear System Solver with Steps',
    description:
      "Solve ax²+bx+c=0 with discriminant, real, repeated or complex roots, plus 2- and 3-variable linear systems via Cramer's rule, with steps. Runs in your browser.",
    h1: 'Quadratic Equation & Linear System Solver (with Steps)',
    introHtml:
      'Solve a quadratic equation ax²+bx+c=0 starting from the discriminant, and see whether the roots are real, repeated, or complex. Solve 2- or 3-variable linear systems with Cramer\'s rule, with no-solution and infinite-solution cases detected. Every step is shown, not just the answer, so it works for homework checks and studying. Everything runs in your browser and nothing you type is sent to a server. For ratios and proportions, try the <a href="/en/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Ratio & Percentage Calculator</a>.',

    quadHeading: '1. Quadratic equation ax² + bx + c = 0',
    quadIntro:
      'Enter the coefficients a, b and c. Blank fields count as 0. If a is 0, the equation is solved as a linear one.',
    quadALabel: 'a (coefficient of x²)',
    quadBLabel: 'b (coefficient of x)',
    quadCLabel: 'c (constant)',
    quadError: 'Could not calculate (coefficients must be finite numbers)',
    quadKinds: {
      'two-real': 'Two distinct real roots (D > 0)',
      double: 'One repeated real root (D = 0)',
      complex: 'Two complex conjugate roots (D < 0)',
      linear: 'a = 0, so it was solved as a linear equation',
      'linear-none': 'No solution (0 = c with c ≠ 0)',
      identity: 'Every x is a solution (0 = 0)',
    },
    quadDiscriminantLabel: 'Discriminant D',
    quadRootsLabel: 'Roots',

    sysHeading: "2. Linear system (Cramer's rule)",
    sysIntro:
      'Choose the number of unknowns, then enter the coefficients and the right-hand constant of each equation. Blank fields count as 0.',
    sysSizeLegend: 'Number of unknowns',
    sysSize2: '2 unknowns (x, y)',
    sysSize3: '3 unknowns (x, y, z)',
    coefAria: 'Equation {row}: coefficient of {var}',
    constAria: 'Equation {row}: right-hand constant',
    sysError: 'Could not calculate (coefficients must be finite numbers)',
    sysKinds: {
      unique: 'There is exactly one solution',
      none: 'No solution (the equations contradict each other)',
      infinite: 'Infinitely many solutions',
    },
    sysSolutionLabel: 'Solution',

    stepsHeading: 'Steps',
    stepLabels: {
      equation: 'Equation',
      linearEquation: 'Rewritten as a linear equation',
      discriminant: 'Discriminant',
      formula: 'Plug into the quadratic formula',
      solution: 'Solution',
      determinant: 'Determinant D of the coefficients',
      replacedDeterminant:
        'Determinant with the matching column replaced by the constants',
      rankCheck: 'Rank comparison (coefficient matrix A and augmented [A | b])',
    },
    copyButton: 'Copy result and steps',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    notesHeading: 'Notes',
    notes: [
      'Calculations use floating-point numbers and results are rounded to 10 significant digits. For linear systems with integer coefficients, non-integer answers are also shown as reduced fractions.',
      'Quadratic roots are shown as decimals. If you need an exact radical form such as 1 ± √2, read it from the quadratic-formula step.',
      'When the determinant is 0, the ranks of the coefficient matrix and the augmented matrix are compared to tell "no solution" from "infinitely many solutions".',
      'This tool is for learning and checking work. Verify the results yourself before using them in an exam or at work.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Discriminant',
        description:
          'For ax²+bx+c=0 it is D = b² − 4ac. If D > 0 there are two distinct real roots, if D = 0 one repeated root, and if D < 0 two complex conjugate roots.',
      },
      {
        term: 'Repeated root',
        description:
          'A quadratic whose two roots coincide. Its parabola just touches the x-axis, and the root is x = −b / 2a.',
      },
      {
        term: 'Complex root',
        description:
          'A root containing the imaginary unit i (i² = −1). For real coefficients and D < 0, the roots are the conjugate pair (−b ± √|D| i) / 2a.',
      },
      {
        term: "Cramer's rule",
        description:
          'When the determinant D of the coefficient matrix is not 0, each unknown equals the determinant with its column replaced by the constants, divided by D. It suits 2- and 3-variable systems.',
      },
    ],
  },
};
