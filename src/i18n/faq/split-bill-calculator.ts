import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '割り切れないときの端数はどうなりますか？',
      answer:
        '選んだ丸め単位（1円・10円・100円など）と丸め方（切り上げ・切り捨て・四捨五入）で1人あたりの金額を丸め、集まる合計と実際の金額との差を「余り」または「不足」として表示します。たとえば10,000円を3人で100円単位に切り上げると、1人3,400円で200円の余りになります。',
    },
    {
      question: '上司だけ多めに払う割り勘はできますか？',
      answer:
        'できます。「多めに払う人」の人数と倍率を指定すると、その人たちを倍率分の重みで按分します。たとえば12,000円を3人で割り、1人だけ2倍払うなら、重みは 2+1+1=4 なので、2倍の人が6,000円、ほかの2人が3,000円ずつです。',
    },
    {
      question: '切り上げ・切り捨て・四捨五入はどれを選べばよいですか？',
      answer:
        '幹事が立て替えたくないなら切り上げ（余りが出ます）、キリのよい金額にそろえたいなら四捨五入や切り捨てが向いています。切り捨てと四捨五入では不足が出ることがあるため、差額を確認してから集金してください。',
    },
  ],
  en: [
    {
      question:
        'What happens to the leftover when the bill does not divide evenly?',
      answer:
        'Each share is rounded to your chosen unit (0.01, 1, 10, and so on) using your chosen rounding, and the gap between the collected total and the real bill is shown as extra or short. For example, 100 split among 3 and rounded up to the nearest 1 is 34 each, which collects 2 extra.',
    },
    {
      question: 'Can some people pay more than others?',
      answer:
        'Yes. Set how many people pay more and by what multiple, and they are weighted accordingly. For a 120 bill among 3 people where one pays double, the weights are 2+1+1=4, so that person pays 60 and the other two pay 30 each.',
    },
    {
      question: 'Should I round up, down, or to the nearest?',
      answer:
        'Round up if the organizer should never be out of pocket (you may collect a little extra). Round down or to the nearest gives tidier amounts but can leave a shortfall, so check the difference before collecting.',
    },
  ],
};
