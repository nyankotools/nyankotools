import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '出産予定日はどのように計算されますか？',
      answer:
        '最終月経の開始日から280日後（40週0日）を予定日とするネーゲレ式と同等の方法です。月経周期が28日でない場合は、28日との差の日数だけ予定日をずらします。排卵日から計算する場合は排卵日の266日後です。',
    },
    {
      question: '月経周期が不規則な場合はどうすればよいですか？',
      answer:
        '周期が不規則だと最終月経からの計算は大きくずれることがあります。その場合は排卵日がわかれば排卵日から、または医療機関で告げられた予定日を「分娩予定日（逆算）」に入力して妊娠週数を確認してください。',
    },
    {
      question: '妊娠週数と妊娠月数はどう数えますか？',
      answer:
        '妊娠週数は、最終月経の開始日（周期補正後）を0週0日として数えます。妊娠月数は4週ごとに1ヶ月とし、0〜3週が妊娠1ヶ月、36〜39週が妊娠10ヶ月です。',
    },
    {
      question: '医療機関で言われた予定日と違うのはなぜですか？',
      answer:
        '医療機関では超音波検査での胎児の大きさなどをもとに予定日を決めることが多く、計算式の結果と数日〜1週間以上ずれることがあります。このツールの結果は目安であり、診断の代わりにはなりません。医療機関の指示を優先してください。',
    },
  ],
  en: [
    {
      question: 'How is the due date calculated?',
      answer:
        "It adds 280 days (40 weeks) to the first day of your last period, which is equivalent to Naegele's rule. If your cycle is not 28 days, the date shifts by the difference. From an ovulation date, it adds 266 days.",
    },
    {
      question: 'What if my cycles are irregular?',
      answer:
        'With irregular cycles, a last-period estimate can be off by a lot. If you know your ovulation date, use that instead, or enter the due date your clinic gave you under "Known due date" to see the current week.',
    },
    {
      question: 'How are pregnancy weeks and months counted?',
      answer:
        'Weeks are counted from the first day of the last period (adjusted for cycle length) as week 0 day 0. Months are counted as 4 weeks each, so weeks 0-3 are month 1 and weeks 36-39 are month 10.',
    },
    {
      question: 'Why does my doctor give a different due date?',
      answer:
        'Providers often set the due date from ultrasound measurements, which can differ from the formula by several days or more than a week. This tool gives estimates and is not medical advice, so follow your provider.',
    },
  ],
};
