import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '利息がつかない場合（年利0%）でも使えますか？',
      answer:
        '使えます。年利を0%にすると、貯まる金額は「現在の貯金額＋毎月の貯金額×月数」、毎月の貯金額は「（目標額−現在の貯金額）÷月数」というシンプルな計算になります。',
    },
    {
      question: '期間を求めると、目標額ちょうどになりませんか？',
      answer:
        '期間は目標額に初めて届く月数（整数月）で表示するため、その時点の残高は目標額と同じか、わずかに上回ります。年別の推移表で最終月の残高を確認できます。',
    },
    {
      question: '利息の税金は計算に含まれていますか？',
      answer:
        '含まれていません。預金利子には通常20.315%の税金がかかるため、実際に受け取れる金額はこの結果より少なくなります。利率が低い預貯金では差は小さいですが、目安としてお使いください。',
    },
    {
      question: '貯金は月初と月末のどちらに入れる計算ですか？',
      answer:
        '各月末に積み立てる前提です。その月の積立分には、その月の利息はつきません。月初に入金する場合は、結果がわずかに少なく見積もられます。',
    },
  ],
  en: [
    {
      question: 'Does it work with no interest (0% annual rate)?',
      answer:
        'Yes. At 0%, the final balance is simply your starting balance plus monthly savings times the number of months, and the monthly amount needed is (target minus starting balance) divided by the number of months.',
    },
    {
      question:
        'Why is the result slightly above my target when solving for time?',
      answer:
        'The time is the first whole month in which the balance reaches your target, so the balance at that point equals or slightly exceeds it. The year-by-year table shows the balance in the final month.',
    },
    {
      question: 'Are taxes on the interest included?',
      answer:
        'No. Deposit interest in Japan is normally taxed at 20.315%, so the amount you actually receive is a bit lower than shown. With low-rate accounts the difference is small, but treat the result as a rough guide.',
    },
    {
      question: 'Are deposits made at the start or end of the month?',
      answer:
        'At the end of each month. A deposit does not earn interest in the month it is made. If you deposit at the start of the month, this calculator slightly underestimates the result.',
    },
  ],
};
