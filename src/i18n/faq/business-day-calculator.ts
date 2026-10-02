import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '「◯営業日後」を数えるとき、起算日は含まれますか？',
      answer:
        '含まれません。起算日の翌日から数えて、営業日にあたる日だけをカウントします。たとえば金曜日を起算日に1営業日後を求めると、翌週月曜日（祝日でなければ）になります。起算日を1日目として数える契約・社内ルールの場合は、営業日数を1つ減らして計算してください。',
    },
    {
      question: '振替休日や国民の休日は反映されますか？',
      answer:
        '反映されます。祝日が日曜日にあたるときの振替休日（2007年以降は祝日でない最初の平日）と、祝日にはさまれた平日の「国民の休日」を自動で加えています。祝日一覧でも種別が確認できます。',
    },
    {
      question: '祝日はいつの年まで対応していますか？',
      answer:
        '2000〜2099年です。春分・秋分の日は天文計算の近似式で求めており、この範囲では実際の官報の発表と一致します。ただし、将来の法改正や臨時の祝日の追加・移動は反映されないため、重要な期日は内閣府の「国民の祝日」でも確認してください。',
    },
    {
      question: '会社の休業日（お盆休みや創立記念日）は設定できますか？',
      answer:
        '年末年始（12/29〜1/3）のみ切り替えられます。お盆休みや創立記念日などの会社独自の休業日には対応していないため、その分は結果の日付から手動で調整してください。',
    },
  ],
  en: [
    {
      question: 'Is the start date counted when I add business days?',
      answer:
        'No. Counting begins the day after the start date, and only business days are counted. For example, one business day after a Friday is the following Monday (unless it is a holiday). If your contract counts the start date as day one, subtract one from the number of business days.',
    },
    {
      question: 'Are substitute holidays and citizens’ holidays included?',
      answer:
        'Yes. When a national holiday falls on a Sunday, the next weekday that is not a holiday becomes a substitute holiday (the rule since 2007), and a weekday between two holidays becomes a citizens’ holiday. Both are added automatically and labeled in the holiday list.',
    },
    {
      question: 'Which years are supported?',
      answer:
        'Years 2000 through 2099. The equinox dates are computed with an astronomical approximation that matches the official announcements in this range. Future law changes and one-off holidays are not reflected, so check the Cabinet Office list for critical deadlines.',
    },
    {
      question: 'Can I add company holidays like Obon or a founding day?',
      answer:
        'Only the year-end break (Dec 29 – Jan 3) can be toggled. Company-specific closures are not supported, so adjust the resulting date by hand for those days.',
    },
  ],
};
