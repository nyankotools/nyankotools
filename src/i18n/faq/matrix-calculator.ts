import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '逆行列が求められない（エラーになる）のはなぜですか？',
      answer:
        '逆行列は正方行列で、かつ行列式が 0 でないときだけ存在します。行列式が 0 の特異行列（ある行が他の行の定数倍になっている場合など）や、行数と列数が違う行列では計算できません。',
    },
    {
      question: '分数と小数の表示はどう違いますか？',
      answer:
        '内部では常に分数で厳密に計算しており、表示だけを切り替えます。小数は小数第6位で四捨五入するため、1/3 は 0.333333 のように近似値になります。丸め誤差を避けたいときは分数表示を使ってください。',
    },
    {
      question: '行列の積 A×B が計算できないのはどんなときですか？',
      answer:
        'A の列数と B の行数が等しくないときです。たとえば 2×3 の行列と 2×2 の行列は掛けられません。また積は順序で結果が変わるため、A×B と B×A は一般に別の行列になります。',
    },
    {
      question: '入力できる数の形式と、サイズの上限を教えてください。',
      answer:
        '整数、小数（0.25）、分数（3/4）に対応し、空欄は 0 として扱います。1e3 のような指数表記は使えません。サイズは 1×1 から 6×6 までです。',
    },
  ],
  en: [
    {
      question: 'Why does the inverse show an error?',
      answer:
        'An inverse exists only for a square matrix with a non-zero determinant. A singular matrix (for example, one row is a multiple of another) or a non-square matrix has no inverse.',
    },
    {
      question: 'What is the difference between fraction and decimal display?',
      answer:
        'Everything is calculated as exact fractions; only the display changes. Decimals are rounded to 6 places, so 1/3 shows as 0.333333. Use fractions when you want to avoid rounding.',
    },
    {
      question: 'When can I not multiply A × B?',
      answer:
        'When the number of columns in A differs from the number of rows in B. A 2×3 matrix cannot be multiplied by a 2×2 matrix, for example. Order also matters: A × B and B × A are usually different matrices.',
    },
    {
      question: 'What number formats and sizes are supported?',
      answer:
        'Integers, decimals (0.25) and fractions (3/4). Empty cells count as 0, and scientific notation like 1e3 is not accepted. Matrices can be from 1×1 up to 6×6.',
    },
  ],
};
