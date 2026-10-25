import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '2021年1月1日が「2020年第53週」になるのはなぜですか？',
      answer:
        'ISO 8601では週が月曜に始まり、木曜日が属する年をその週の年（ISO週年）とします。2021年1月1日は金曜で、同じ週の木曜（2020年12月31日）が2020年なので、2020年の第53週に数えられます。',
    },
    {
      question: '年によって52週のときと53週のときがあるのはなぜですか？',
      answer:
        '1年は364日（52週）より1〜2日長いため、そのずれが積み重なって約5〜6年に一度、53週の年が現れます。1月1日が木曜の年（うるう年は水曜か木曜）が53週になります。',
    },
    {
      question: 'カレンダーアプリの週番号と違うことがあるのはなぜですか？',
      answer:
        '米国などでは日曜始まりで1月1日を含む週を第1週とする方式が使われ、ISO方式とは数え方が異なります。本ツールはISO 8601のみに対応しているため、アプリの設定が違うと数字がずれることがあります。',
    },
    {
      question:
        '「年の何日目」や「残り日数」は暦年とISO週年のどちらで数えますか？',
      answer:
        '暦年（1月1日〜12月31日）で数えます。1月1日が1日目で、うるう年は366日までです。残り日数は当日を含まず、12月31日で0になります。',
    },
  ],
  en: [
    {
      question: 'Why is January 1, 2021 in week 53 of 2020?',
      answer:
        'ISO 8601 weeks start on Monday, and a week belongs to the year that contains its Thursday. January 1, 2021 is a Friday and its Thursday is December 31, 2020, so the date falls in week 53 of ISO year 2020.',
    },
    {
      question: 'Why do some years have 52 weeks and others 53?',
      answer:
        'A year is one or two days longer than 52 full weeks, and the extra days add up, producing a 53-week year about every five to six years. Years that start on a Thursday (or leap years that start on a Wednesday) have 53 weeks.',
    },
    {
      question: 'Why does my calendar app show a different week number?',
      answer:
        'Many apps, especially in the US, use weeks that start on Sunday with week 1 containing January 1. That differs from ISO numbering, which this tool follows exclusively, so numbers can be off by one.',
    },
    {
      question:
        'Is "day of the year" based on the calendar year or the ISO year?',
      answer:
        'The calendar year. January 1 is day 1 and a leap year ends on day 366. Days left does not include the date itself, so December 31 shows 0.',
    },
  ],
};
