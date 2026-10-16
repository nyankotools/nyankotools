import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '元利均等と元金均等はどちらが得ですか？',
      answer:
        '同じ借入額・金利・期間なら、総利息は元金均等のほうが少なくなります。ただし初期の返済額は元金均等のほうが大きいため、毎月の負担と総額のバランスで選びます。',
    },
    {
      question: 'リボ払いの支払額を低くするとどうなりますか？',
      answer:
        '毎月の負担は軽くなりますが、残高に手数料がかかり続けるため完済までが長期化し、総手数料が大きく増えます。支払額を変えて、総利息と期間を比較してみてください。',
    },
    {
      question: 'リボ払いで「完済できません」と表示されるのはなぜですか？',
      answer:
        '毎月の支払額が、残高にかかる月々の手数料以下だと元金が減らず完済できません。支払額を手数料より大きくしてください。',
    },
    {
      question: '実際の金融機関の返済額と違うことはありますか？',
      answer:
        'あります。本ツールは月利＝年率÷12の簡易計算で、日割りや約定日、手数料の端数処理、カード会社ごとのリボ方式は反映しません。参考値としてご利用ください。',
    },
  ],
  en: [
    {
      question: 'Which is cheaper: amortizing or equal principal?',
      answer:
        'For the same amount, rate and term, equal principal costs less total interest. Its early payments are larger, though, so choose by balancing monthly burden against the total.',
    },
    {
      question: 'What happens if I set a low revolving payment?',
      answer:
        'The monthly burden is lighter, but fees keep accruing on the balance, so payoff takes far longer and total fees climb. Try different payments to compare interest and duration.',
    },
    {
      question: 'Why does it say the balance cannot be paid off?',
      answer:
        'If the monthly payment is not larger than the monthly fee on the balance, the principal never falls. Raise the payment above the monthly fee.',
    },
    {
      question: "Can this differ from my lender's actual figures?",
      answer:
        'Yes. It uses a simple monthly rate of annual rate ÷ 12 and ignores daily accrual, due dates, rounding rules and issuer-specific revolving schemes. Treat it as an estimate.',
    },
  ],
};
