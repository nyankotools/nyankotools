import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '比の簡略化ではどのように計算されますか？',
      answer:
        '各数値を最大公約数で割って、最も簡単な整数比にします。たとえば 12:18 は 2:3、小数を含む 1.5:2.5 も 3:5 のように整数比へ直せます。',
    },
    {
      question: '比例式の空欄を求めるにはどうすればよいですか？',
      answer:
        'A:B = C:D のうち求めたい項を空欄にして、残り3つの項には0より大きい値を入力してください。内側の積と外側の積が等しいという比例式の性質で計算します。',
    },
    {
      question: '増減率はどのように計算されますか？',
      answer:
        '元の値に対する変化の割合で、(新しい値 − 元の値) ÷ 元の値 × 100 です。増加ならプラス、減少ならマイナスで表示されます。',
    },
  ],
  en: [
    {
      question: 'How does ratio simplification work?',
      answer:
        'Each number is divided by the greatest common divisor to give the simplest whole-number ratio. For example, 12:18 becomes 2:3, and decimals like 1.5:2.5 become 3:5.',
    },
    {
      question: 'How do I solve for a missing term in a proportion?',
      answer:
        'Leave the unknown term of A:B = C:D empty and enter positive numbers in the other three. The tool uses the fact that cross products are equal.',
    },
    {
      question: 'How is the percent change calculated?',
      answer:
        'It is the change relative to the original value: (new − original) ÷ original × 100. Increases are positive and decreases are negative.',
    },
  ],
};
