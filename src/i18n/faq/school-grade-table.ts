import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '早生まれとは何月何日生まれの人ですか？',
      answer:
        '1月1日から4月1日までに生まれた人です。4月1日生まれも早生まれに含まれます。法律上は誕生日の前日に年齢が加算されるため、4月1日生まれは3月31日に満年齢が上がり、前年4月2日以降に生まれた子と同じ学年になります。',
    },
    {
      question: '同じ年に生まれても学年が違うのはなぜですか？',
      answer:
        '学年は4月2日〜翌年4月1日生まれでひとまとまりになるためです。たとえば2015年2月生まれ（早生まれ）は、同じ2015年の5月生まれより1学年上になります。このツールでは生年月日を入力すれば自動で判定します。',
    },
    {
      question: '基準年度は何を指定すればよいですか？',
      answer:
        '初期値は今日の日付から算出した年度（4月〜翌年3月）です。たとえば2027年2月なら2026年度です。過去や将来の年度を入れると、「2030年度に小学1年になるのは何年度生まれか」といった逆引きもできます。',
    },
    {
      question: '浪人や留年、海外の学校の場合も使えますか？',
      answer:
        '浪人・留年・飛び級・早期入学などは考慮せず、日本の学校に標準的に進学した場合の学年を表示します。9月入学の海外の学校とは学年の区切りが異なるため、そのまま当てはめられません。',
    },
  ],
  en: [
    {
      question: 'Who counts as early-born (hayaumare) in Japan?',
      answer:
        'Anyone born from January 1 through April 1, including April 1 itself. Japanese law counts a person as a year older on the day before their birthday, so an April 1 baby ages on March 31 and joins the grade of children born from April 2 of the previous year.',
    },
    {
      question: 'Why are children born in the same year in different grades?',
      answer:
        'Japanese grades group children born from April 2 to April 1 of the next year. A child born in February 2015 (early-born) is one grade above a child born in May 2015. Enter a date of birth and the tool works this out for you.',
    },
    {
      question: 'Which school year should I enter?',
      answer:
        'The default is the school year (April to the following March) that contains today. For example, February 2027 belongs to school year 2026. You can enter a past or future year to see, for example, which birth dates will start elementary school in 2030.',
    },
    {
      question: 'Does this work for repeated years or schools outside Japan?',
      answer:
        'No. Results assume a standard path through the Japanese school system, without repeated years, skipped grades, or deferred entry. Schools abroad that start in September use different cut-off dates, so the grades will not match.',
    },
  ],
};
