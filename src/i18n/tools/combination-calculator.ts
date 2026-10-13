import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface RowCopy {
  label: string;
  hint: string;
}

export interface CombinationCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  nLabel: string;
  rLabel: string;
  resultsHeading: string;
  factorial: RowCopy;
  permutation: RowCopy;
  combination: RowCopy;
  repeatedPermutation: RowCopy;
  repeatedCombination: RowCopy;
  /** {length} {sci} を置換する */
  metaShort: string;
  metaLong: string;
  unavailable: string;
  rGreaterNotice: string;
  probabilityHeading: string;
  probabilityOrdered: string;
  probabilityUnordered: string;
  probabilityValue: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {field} {max} を置換して表示する */
  errorEmpty: string;
  errorInvalid: string;
  errorNegative: string;
  errorNotInteger: string;
  errorTooLarge: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const combinationCalculatorContent: Record<
  Locale,
  CombinationCalculatorPageContent
> = {
  ja: {
    title: '順列・組み合わせ計算｜nPr・nCr・階乗を桁数無制限で',
    description:
      'nPr（順列）・nCr（組み合わせ）・n!（階乗）・重複順列 n^r・重複組合せ nHr を、巨大な値も全桁正確に計算する無料ツールです。桁数・科学的記法・1通りを引く確率も表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '順列・組み合わせ計算（nPr・nCr・階乗・重複）',
    introHtml:
      'n と r を入力すると、階乗 n!・順列 nPr・組み合わせ nCr・重複順列 n^r・重複組合せ nHr を一度に計算します。計算は BigInt で行うため、桁が大きくなっても丸め誤差なく全桁を表示できます。ガチャの当選確率は <a href="/tools/gacha-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ガチャ確率計算機</a>、平均や分散は <a href="/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">偏差値・平均・標準偏差計算機</a> をご利用ください。',
    nLabel: 'n（全体の個数）',
    rLabel: 'r（選ぶ個数）',
    resultsHeading: '計算結果',
    factorial: {
      label: '階乗 n!',
      hint: 'n 個すべてを1列に並べる並べ方',
    },
    permutation: {
      label: '順列 nPr',
      hint: 'n 個から r 個を選んで順番も区別して並べる（同じものは選ばない）',
    },
    combination: {
      label: '組み合わせ nCr',
      hint: 'n 個から r 個を選ぶ（順番は区別しない）',
    },
    repeatedPermutation: {
      label: '重複順列 n^r',
      hint: 'n 種類から重複を許して r 個並べる',
    },
    repeatedCombination: {
      label: '重複組合せ nHr',
      hint: 'n 種類から重複を許して r 個選ぶ（順番は区別しない）',
    },
    metaShort: '{length} 桁',
    metaLong: '{length} 桁 / 科学的記法 約 {sci}',
    unavailable: 'r が n を超えているため計算できません',
    rGreaterNotice:
      'r が n を超えているため、順列 nPr と組み合わせ nCr は計算できません（重複を許す場合のみ計算できます）。',
    probabilityHeading: '1通りを引く確率の目安',
    probabilityOrdered: '特定の並びを1通り当てる確率（1 / nPr）',
    probabilityUnordered: '特定の組み合わせを1通り当てる確率（1 / nCr）',
    probabilityValue: '約 {sci}',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorEmpty: '{field} を入力してください。',
    errorInvalid:
      '{field} は 0 以上の整数で入力してください（半角・全角どちらも可）。',
    errorNegative:
      '{field} に負の数は使えません。0 以上の整数を入力してください。',
    errorNotInteger: '{field} は小数ではなく整数で入力してください。',
    errorTooLarge:
      '{field} が大きすぎます。{max} 以下の整数を入力してください。',
    notesHeading: '注意事項',
    notes: [
      'n・r は 0〜10000 の整数に対応しています。上限を超えると、計算時間と表示する桁数が大きくなりすぎるため、エラーにしています。',
      '順列 nPr と組み合わせ nCr は r ≤ n のときだけ定義されます。r が n を超える場合は、重複を許す n^r と nHr のみ表示します。',
      '0! は 1、nP0 と nC0 は 1、0^0 は 1 として扱います。n = 0 のとき重複組合せ 0Hr は、r = 0 なら 1、r が 1 以上なら 0 です。',
      '全桁表示の値は数万桁になることがあります。コピーボタンで全桁をそのままコピーできます。科学的記法は有効数字6桁までの切り捨て表示です。',
      '確率の目安は「すべての並び・組み合わせが同じ確からしさで出る」前提の値です。抽選に重みがある場合は当てはまりません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '順列（nPr）と組み合わせ（nCr）',
        description:
          '順列は「選んだ順番も区別する」数え方、組み合わせは「順番を区別しない」数え方です。nCr = nPr ÷ r! の関係があり、たとえば 5 人から 2 人を選ぶ場合、順番を区別すれば 20 通り、区別しなければ 10 通りです。',
      },
      {
        term: '重複順列・重複組合せ',
        description:
          '同じものを何度選んでもよい場合の数え方です。重複順列は n^r、重複組合せは nHr = (n+r−1)Cr で求められます。サイコロを3回振る出目の並びは 6^3 = 216 通り、出目の組み合わせ（順番なし）は 6H3 = 56 通りです。',
      },
      {
        term: '階乗（n!）',
        description:
          '1 から n までのすべての整数を掛けた値です。n 個を1列に並べる並べ方の総数になります。20! で約 2.4×10^18 と、n が小さいうちから急激に大きくなります。',
      },
    ],
  },
  en: {
    title: 'Permutation & Combination Calculator – nPr, nCr, Factorial',
    description:
      'Calculate nPr, nCr, n!, n^r and nHr exactly, even for huge values. Shows every digit, digit count and scientific notation. Runs in your browser.',
    h1: 'Permutation & Combination Calculator (nPr, nCr, Factorial)',
    introHtml:
      'Enter n and r to get the factorial n!, permutations nPr, combinations nCr, permutations with repetition n^r and combinations with repetition nHr at once. Everything is computed with BigInt, so large results are shown in full with no rounding error. For gacha odds, see the <a href="/en/tools/gacha-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Gacha Probability Calculator</a>; for means and variance, use the <a href="/en/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Statistics Calculator</a>.',
    nLabel: 'n (total items)',
    rLabel: 'r (items chosen)',
    resultsHeading: 'Results',
    factorial: {
      label: 'Factorial n!',
      hint: 'Ways to arrange all n items in a row',
    },
    permutation: {
      label: 'Permutations nPr',
      hint: 'Choose r of n items where order matters, no repeats',
    },
    combination: {
      label: 'Combinations nCr',
      hint: 'Choose r of n items where order does not matter',
    },
    repeatedPermutation: {
      label: 'Permutations with repetition n^r',
      hint: 'Fill r positions from n kinds, repeats allowed',
    },
    repeatedCombination: {
      label: 'Combinations with repetition nHr',
      hint: 'Choose r items from n kinds, repeats allowed, order ignored',
    },
    metaShort: '{length} digits',
    metaLong: '{length} digits / scientific notation ≈ {sci}',
    unavailable: 'Not defined because r is greater than n',
    rGreaterNotice:
      'Because r is greater than n, nPr and nCr are not defined. Only the versions with repetition (n^r and nHr) are shown.',
    probabilityHeading: 'Odds of hitting one outcome',
    probabilityOrdered: 'One specific ordered arrangement (1 / nPr)',
    probabilityUnordered: 'One specific combination (1 / nCr)',
    probabilityValue: '≈ {sci}',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorEmpty: 'Enter a value for {field}.',
    errorInvalid: '{field} must be a whole number of 0 or more.',
    errorNegative: '{field} cannot be negative. Enter 0 or more.',
    errorNotInteger: '{field} must be a whole number, not a decimal.',
    errorTooLarge: '{field} is too large. Enter a whole number up to {max}.',
    notesHeading: 'Notes',
    notes: [
      'n and r accept whole numbers from 0 to 10000. Larger values are rejected because computing and showing every digit would take too long.',
      'nPr and nCr are only defined when r ≤ n. When r is greater than n, only n^r and nHr (with repetition) are shown.',
      'The tool uses 0! = 1, nP0 = nC0 = 1 and 0^0 = 1. For n = 0, 0Hr is 1 when r = 0 and 0 when r is 1 or more.',
      'Full values can run to tens of thousands of digits; the Copy button copies every digit. Scientific notation is truncated to six significant digits.',
      'The odds assume every arrangement or combination is equally likely. They do not apply to weighted draws.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Permutation (nPr) vs. combination (nCr)',
        description:
          'A permutation counts selections where order matters; a combination counts them where order does not. They are related by nCr = nPr ÷ r!. Choosing 2 people out of 5 gives 20 ordered ways but only 10 unordered ones.',
      },
      {
        term: 'Repetition (n^r and nHr)',
        description:
          'These count selections where the same item may be picked more than once. With repetition, ordered sequences number n^r and unordered selections number nHr = (n+r−1)Cr. Rolling a die three times gives 6^3 = 216 sequences but 6H3 = 56 unordered outcomes.',
      },
      {
        term: 'Factorial (n!)',
        description:
          'The product of every whole number from 1 to n. It is the number of ways to line up n items. It grows very fast: 20! is already about 2.4×10^18.',
      },
    ],
  },
};
