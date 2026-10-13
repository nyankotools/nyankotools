import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '順列と組み合わせはどう使い分けますか？',
      answer:
        '順番が結果に影響するなら順列（nPr）、影響しないなら組み合わせ（nCr）です。たとえば「1位・2位・3位を決める」は順列、「3人のメンバーを選ぶ」は組み合わせです。nCr = nPr ÷ r! の関係があります。',
    },
    {
      question:
        'r が n より大きいとき nPr と nCr が表示されないのはなぜですか？',
      answer:
        '重複なしで n 個から r 個を選べないため、nPr と nCr は定義されません（0 通り扱い）。同じものを何度でも選べる重複順列 n^r・重複組合せ nHr は r が n より大きくても計算できるので、そちらだけ表示します。',
    },
    {
      question: '桁が大きい階乗や組み合わせも正確ですか？',
      answer:
        'BigInt（任意精度の整数）で計算しているため、100! や 10000! でも丸め誤差なく全桁を求められます。電卓や表計算ソフトのように 1.2e+30 などの近似値にはなりません。',
    },
    {
      question: 'n や r に入力できる上限はありますか？',
      answer:
        'どちらも 0〜10000 の整数です。10000! は約 35660 桁、10000^10000 は 40001 桁になり、これ以上は計算と表示に時間がかかるため上限を設けています。',
    },
    {
      question: '0! や 0^0 はいくつですか？',
      answer:
        '組み合わせ論の慣習に従い、0! = 1、0^0 = 1 として計算します。nP0 と nC0 はどちらも 1（「何も選ばない」1通り）です。',
    },
  ],
  en: [
    {
      question: 'When should I use permutations instead of combinations?',
      answer:
        'Use permutations (nPr) when order matters and combinations (nCr) when it does not. Awarding 1st, 2nd and 3rd place is a permutation; picking a 3-person committee is a combination. They are linked by nCr = nPr ÷ r!.',
    },
    {
      question: 'Why are nPr and nCr missing when r is greater than n?',
      answer:
        'Without repetition you cannot choose more items than you have, so nPr and nCr are undefined (zero ways). Permutations n^r and combinations nHr with repetition still make sense when r exceeds n, so those are shown.',
    },
    {
      question: 'Are large factorials and combinations exact?',
      answer:
        'Yes. The tool uses BigInt arbitrary-precision integers, so values such as 100! or 10000! are computed with no rounding error, unlike a calculator or spreadsheet that falls back to approximations like 1.2e+30.',
    },
    {
      question: 'Is there a limit on n and r?',
      answer:
        'Both must be whole numbers from 0 to 10000. 10000! has about 35,660 digits and 10000^10000 has 40,001, so larger inputs are rejected to keep the page responsive.',
    },
    {
      question: 'What are 0! and 0^0 here?',
      answer:
        'Following the usual combinatorics convention, 0! = 1 and 0^0 = 1. nP0 and nC0 are both 1: there is exactly one way to choose nothing.',
    },
  ],
};
