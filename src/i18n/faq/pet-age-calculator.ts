import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '犬や猫の年齢はどのように人間の年齢に換算しますか？',
      answer:
        '1歳を人間の15歳、2歳を24歳とし、2歳以降は1年ごとに猫・小型犬は4歳、中型犬は5歳、大型犬は6歳を加えます。たとえば猫の10歳は 24 + 4 × 8 = 56歳です。',
    },
    {
      question: '犬は体格によって換算が違うのはなぜですか？',
      answer:
        '大型犬ほど寿命が短く、老化が早い傾向があるためです。そのため2歳以降に加える年数を体格別に変えています。犬種や個体差もあるので、あくまで目安として使ってください。',
    },
    {
      question: '1歳未満の子犬・子猫はどう計算していますか？',
      answer:
        '0歳0ヶ月を0歳、1歳を15歳として月数に比例して直線的に求めた概算です。実際には生後数か月で急速に成長するため、数値は大まかな目安にとどまります。',
    },
    {
      question: '換算式に公式な基準はありますか？',
      answer:
        '公的に統一された基準はなく、資料によって数値が異なります。このツールは広く紹介されている目安式を使っており、健康状態の判断や獣医師の診断に代わるものではありません。',
    },
  ],
  en: [
    {
      question: "How is a dog's or cat's age converted to human years?",
      answer:
        'Age 1 counts as 15 human years and age 2 as 24. After that, add 4 years per year for cats and small dogs, 5 for medium dogs, and 6 for large dogs. A 10-year-old cat is 24 + 4 × 8 = 56.',
    },
    {
      question: 'Why does the conversion depend on dog size?',
      answer:
        'Larger dogs tend to have shorter lifespans and age faster, so more human years are added per year after age 2. Breed and individual differences matter too, so treat the result as a rough guide.',
    },
    {
      question: 'How are puppies and kittens under 1 year handled?',
      answer:
        'The age is scaled in a straight line from 0 at birth to 15 at one year, based on months. Real pets grow very quickly in their first months, so this is only a rough estimate.',
    },
    {
      question: 'Is there an official conversion standard?',
      answer:
        'No. There is no official standard and sources give different numbers. This tool uses a commonly quoted rule of thumb and is not a substitute for veterinary advice.',
    },
  ],
};
