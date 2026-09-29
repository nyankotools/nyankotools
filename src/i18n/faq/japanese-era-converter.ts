import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '改元の年は和暦でどう表しますか？',
      answer:
        '元号の1年目は「元年」と表示します。たとえば2019年は、5月1日までが平成31年、5月1日以降が令和元年です。ツールは改元日を日付単位で正確に判定します。',
    },
    {
      question: '明治より前の日付は変換できますか？',
      answer:
        'できません。対応範囲は明治元年（1868年1月25日）以降です。それより前の日付は変換の対象外です。',
    },
    {
      question: '昭和64年と平成元年は同じ年ですか？',
      answer:
        'はい、どちらも1989年です。1989年1月7日までが昭和64年、1月8日からが平成元年です。',
    },
  ],
  en: [
    {
      question: 'How are years of an era change shown?',
      answer:
        'The first year of an era is written "gannen" (元年). For example, 2019 is Heisei 31 until April 30 and Reiwa 1 from May 1. The tool checks era changes at the day level.',
    },
    {
      question: 'Can dates before the Meiji era be converted?',
      answer:
        'No. Conversion covers dates from Meiji 1 (January 25, 1868) onward.',
    },
    {
      question: 'Are Showa 64 and Heisei 1 the same year?',
      answer:
        'Yes, both are 1989. Showa 64 ends on January 7, 1989 and Heisei 1 begins on January 8.',
    },
  ],
};
