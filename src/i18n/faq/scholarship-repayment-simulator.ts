import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どの奨学金を想定した試算ですか？',
      answer:
        'JASSO（日本学生支援機構）の第二種奨学金（利子付き）を想定した簡易試算です。無利子の第一種奨学金には対応していません。',
    },
    {
      question: '在学中に試算するとき、利率はどう入力すればよいですか？',
      answer:
        '在学中は利率が確定しておらず、貸与終了時の市場金利で決まります。入力する利率は仮の数値なので、複数の利率で試して返済額の幅を確認するのがおすすめです。',
    },
    {
      question: '利率見直し方式とは何ですか？',
      answer:
        '約5年ごとに利率を市場金利へ見直す方式です。将来の金利は誰にもわからないため、このツールでは見直しごとの利率の変化幅を入力し、返済額がどう変わるかを試算します。',
    },
  ],
  en: [
    {
      question: 'Which scholarship does this assume?',
      answer:
        'It assumes a JASSO Type 2 (interest-bearing) scholarship loan. Interest-free Type 1 loans are not supported.',
    },
    {
      question: 'What interest rate should I enter while still in school?',
      answer:
        'The rate is not fixed until the loan period ends. Treat your input as an assumption and try several rates to see the range of payments.',
    },
    {
      question: 'What is the rate-review method?',
      answer:
        'The rate is reset to the market rate roughly every five years. Since future rates are unknown, you enter an assumed change per review to see how payments would move.',
    },
  ],
};
