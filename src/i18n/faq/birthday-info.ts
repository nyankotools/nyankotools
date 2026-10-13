import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '1月や2月生まれの干支は前の年になりますか？',
      answer:
        'このツールは西暦の暦年（1月1日〜12月31日）で干支を判定するため、1月生まれでも生まれ年の干支になります。一方、占いなどでは立春（2月4日ごろ）で年を切り替える流派があり、その場合は1月〜2月上旬生まれが前年の干支になります。',
    },
    {
      question: '星座の境目の日に生まれた場合はどうなりますか？',
      answer:
        '一般的に公開されている日付区分（例：牡羊座は3月21日〜4月19日）で判定しています。境目の日は、年によって太陽が星座の境界を通過する時刻がずれるため、占星術の資料によって1日ほど異なることがあります。正確に知りたい場合は出生時刻を含めた星座表を確認してください。',
    },
    {
      question: '誕生花は日ごとではなく月ごとですか？',
      answer:
        '日ごとの誕生花（366日分）は書籍やサイトごとに内容が大きく異なるため、このツールでは一般的な月ごとの代表的な花を表示しています。誕生石も同様に月ごとの代表的な一つを表示します。',
    },
    {
      question: '年男・年女とは何歳のときですか？',
      answer:
        '自分の干支と同じ十二支の年が巡ってくる12年ごとで、満年齢ではおおむね12歳・24歳・36歳…の年です。このツールでは、今年が年男・年女かどうかと、次に同じ干支になる年・その年の年齢を表示します。',
    },
  ],
  en: [
    {
      question:
        "Is the zodiac animal for January or February births the previous year's animal?",
      answer:
        'This tool uses the calendar year (January 1 to December 31), so a January birthday gets the animal of the birth year. Some traditions, such as the Chinese lunar calendar or Risshun-based Japanese fortune-telling (around February 4), switch animals later, in which case people born in January or early February would belong to the previous animal.',
    },
    {
      question: 'What if I was born on the cusp of two star signs?',
      answer:
        'The result uses the widely published date ranges (for example, Aries is March 21 to April 19). The exact moment the Sun crosses a sign boundary shifts from year to year, so cusp dates can differ by a day between sources. For a precise answer, use an astrology chart that includes your birth time.',
    },
    {
      question: 'Are the birth flower and birthstone per day or per month?',
      answer:
        'Both are shown per month. Daily birth flowers (366 of them) differ greatly between books and websites, so this tool shows a commonly cited flower for the month instead, along with one representative birthstone.',
    },
    {
      question: 'What is a "year man" or "year woman" year in Japan?',
      answer:
        'It is a year whose zodiac animal matches the animal of your birth year. This repeats every 12 years, around ages 12, 24, 36, and so on. The tool tells you whether this year is one and shows the next such year and the age you will reach.',
    },
  ],
};
