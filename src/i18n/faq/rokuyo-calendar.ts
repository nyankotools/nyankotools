import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '六曜はどうやって決まりますか？',
      answer:
        '旧暦の月と日を足して6で割った余りで決まります。余りが0なら大安、1なら赤口、2なら先勝、3なら友引、4なら先負、5なら仏滅です。たとえば旧暦1月1日は 1+1=2 で先勝になります。月が替わると数え直しになるため、新暦では規則性がないように見えます。',
    },
    {
      question: '旧暦は国立天文台の暦と同じ日付になりますか？',
      answer:
        '多くの日は一致しますが、保証はできません。このツールは朔（新月）と太陽黄経を天文計算で求めて日付を決めています。朔や節気の時刻が0時付近にあたると、計算には数分程度の誤差があるため、0時の前後10分ほどにあたる日は1日ずれることがあります。結婚式や葬儀の日取りなど大切な用途では、国立天文台などの公式の暦でも確認してください。',
    },
    {
      question: '閏月の日の六曜はどうなりますか？',
      answer:
        '閏月は直前の月と同じ番号として数えます。たとえば2025年の閏6月1日（7月25日）は、6月と同じ数え方で 6+1=7、7÷6の余り1で赤口になります。カレンダー上では「閏6/1」のように閏の文字を付けて表示します。',
    },
    {
      question: '友引や仏滅の日に結婚式や葬儀をしてはいけませんか？',
      answer:
        '六曜に法的な決まりや科学的な根拠はなく、避けるかどうかは本人と家族の考え方次第です。一般には、結婚式は大安・友引が好まれ仏滅は避けられがちですが、仏滅は式場の料金が下がることもあります。葬儀では友引の日に火葬場が休みのことが多く、日程に影響するため確認が必要です。',
    },
    {
      question: '何年から何年まで調べられますか？',
      answer:
        '1900〜2100年です。祝日の表示だけは2000〜2099年に限られ、それ以外の年では祝日なしで六曜と旧暦を表示します。2033年は旧暦の閏月の置き方に議論がありますが、冬至を基準にする規則で閏11月として扱います。',
    },
  ],
  en: [
    {
      question: 'How is the rokuyo for a day decided?',
      answer:
        'Add the lunar month and lunar day, divide by 6, and read the remainder: 0 is Taian, 1 Shakko, 2 Sensho, 3 Tomobiki, 4 Senbu, 5 Butsumetsu. Lunar 1/1 gives 1 + 1 = 2, so it is always Sensho. Because the cycle restarts every lunar month, it looks irregular on the Gregorian calendar.',
    },
    {
      question:
        'Do the lunar dates always match the official Japanese almanac?',
      answer:
        'Almost always, but this is not guaranteed. The tool calculates new moons and the sun’s ecliptic longitude astronomically, so when a new moon or solar term falls very close to midnight in Japan Standard Time, the result can be off by one day, because the calculation has an error of a few minutes. For important dates, check an official almanac such as the one from the National Astronomical Observatory of Japan.',
    },
    {
      question: 'What is the rokuyo of a leap-month day?',
      answer:
        'A leap month is counted with the same number as the month before it. For example, leap month 6, day 1 in 2025 (July 25) is 6 + 1 = 7, remainder 1, so Shakko. The calendar marks it as “L6/1”.',
    },
    {
      question:
        'Should I avoid Butsumetsu or Tomobiki for weddings and funerals?',
      answer:
        'Rokuyo has no legal or scientific force; whether to follow it is up to you and your family. Taian and Tomobiki are popular for weddings and Butsumetsu is often avoided (venues may discount it). For funerals, many crematoria in Japan close on Tomobiki days, so check availability first.',
    },
    {
      question: 'Which years are supported?',
      answer:
        '1900 to 2100. Only the holiday display is limited to 2000–2099; outside that range you still get rokuyo and lunar dates without holidays. The 2033 leap month is disputed, and this tool follows the winter-solstice rule, which makes it leap month 11.',
    },
  ],
};
