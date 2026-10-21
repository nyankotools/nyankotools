import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '判別式 D の値で解の種類はどう決まりますか？',
      answer:
        'D = b² − 4ac が正なら異なる2つの実数解、0 なら重解、負なら互いに共役な2つの虚数解になります。このツールは判別式から順に途中式を表示します。',
    },
    {
      question: 'a を 0 にするとどうなりますか？',
      answer:
        'a = 0 では二次方程式ではなくなるため、bx + c = 0 の一次方程式として解きます。b も 0 の場合は、c = 0 なら任意の x が解、c ≠ 0 なら解なしと表示します。',
    },
    {
      question: '連立方程式で「解なし」と「不定」はどう見分けますか？',
      answer:
        '係数の行列式が 0 のとき、係数行列の階数と拡大係数行列の階数を比べます。階数が異なれば解なし、同じなら解が無数にある不定です。途中式に階数も表示します。',
    },
    {
      question: '連立方程式の解が分数になるときはどう表示されますか？',
      answer:
        '係数がすべて整数なら、割り切れない解を既約分数（例：2/3）と小数の両方で表示します。小数を含む係数では、有効数字10桁の小数のみ表示します。',
    },
  ],
  en: [
    {
      question: 'How does the discriminant decide the type of roots?',
      answer:
        'With D = b² − 4ac, a positive D gives two distinct real roots, zero gives one repeated root, and a negative D gives two complex conjugate roots. The steps start from the discriminant.',
    },
    {
      question: 'What happens if I set a to 0?',
      answer:
        'With a = 0 the equation is no longer quadratic, so it is solved as bx + c = 0. If b is also 0, every x is a solution when c = 0, and there is no solution when c ≠ 0.',
    },
    {
      question:
        'How can I tell "no solution" from "infinitely many solutions" in a linear system?',
      answer:
        'When the determinant is 0, the tool compares the rank of the coefficient matrix with the rank of the augmented matrix. Different ranks mean no solution; equal ranks mean infinitely many. Both ranks appear in the steps.',
    },
    {
      question: 'How are fractional answers to a linear system shown?',
      answer:
        'If every coefficient is an integer, non-integer answers are shown both as a reduced fraction (such as 2/3) and as a decimal. With decimal coefficients, only a decimal rounded to 10 significant digits is shown.',
    },
  ],
};
