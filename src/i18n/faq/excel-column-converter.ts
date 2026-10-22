import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Excelの最終列は何列目ですか？',
      answer:
        '現行のExcel（.xlsx）は XFD列、つまり16,384列目までです。旧形式（.xls）は IV列（256列目）まででした。このツールは XFD を上限として、範囲外はエラーにします。',
    },
    {
      question: '列記号の計算は普通の26進数と何が違いますか？',
      answer:
        '列記号には「0」にあたる文字がなく、Z（26）の次が AA（27）になります。そのため A=0 とする単純な26進数変換では ZやAZ の値がずれます。このツールは Excel の数え方に合わせています。',
    },
    {
      question: '$B$3 のような絶対参照も分解できますか？',
      answer:
        'できます。$ は無視せず「列が絶対か相対か」「行が絶対か相対か」として別々に表示します。$B3 や B$3 のような複合参照にも対応しています。',
    },
    {
      question: '範囲の列数・セル数はどう計算されますか？',
      answer:
        'A1:C10 なら列数は3、行数は10、セル数は 3×10＝30 です。開始と終了が逆（C10:A1）でも同じ結果になります。',
    },
  ],
  en: [
    {
      question: 'What is the last column in Excel?',
      answer:
        'Current Excel (.xlsx) ends at column XFD, which is column 16,384. The old .xls format stopped at IV (column 256). This tool uses XFD as the upper limit and reports anything beyond it as an error.',
    },
    {
      question:
        'How is a column letter different from an ordinary base-26 number?',
      answer:
        'Column letters have no digit for zero: Z (26) is followed by AA (27). A plain base-26 conversion with A=0 gets values like Z and AZ wrong. This tool follows the way Excel counts.',
    },
    {
      question: 'Can it split absolute references such as $B$3?',
      answer:
        'Yes. The $ signs are not discarded; the tool shows separately whether the column and the row are absolute. Mixed references like $B3 and B$3 work too.',
    },
    {
      question: 'How are the column and cell counts of a range calculated?',
      answer:
        'For A1:C10 there are 3 columns and 10 rows, so 3 x 10 = 30 cells. A reversed range such as C10:A1 gives the same result.',
    },
  ],
};
