import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'PT1H30M と P1M の「M」は何が違いますか？',
      answer:
        'T より前の M は月、T より後ろの M は分です。P1M は1か月、PT1M は1分を表します。時間・分・秒を書くときは必ず T を付けてください。',
    },
    {
      question: '年や月を含む期間の秒数が「概算」なのはなぜですか？',
      answer:
        '1か月は28〜31日、1年は365日か366日と長さが決まっていないためです。このツールは1年=365.2425日、1か月=その12分の1で換算します。正確な日付が必要なときは、基準日時に期間を足す機能でカレンダー通りに計算できます。',
    },
    {
      question: 'P1W2D のように週と日を併記できますか？',
      answer:
        'ISO 8601の基本形式では週(W)は単独で使うものですが、このツールは併記も読み取り、週を7日として合算します。ただし、読み込む側のシステムが対応しているとは限らないため、他のシステムに渡す期間は日数にそろえるのが安全です。',
    },
    {
      question: 'PT0.5S のような小数秒や、マイナスの期間は使えますか？',
      answer:
        'はい。小数はドットでもカンマでも読み取ります。先頭に - を付けた -PT15M のような負の期間も扱えます（iCalendarのアラームなどで使われる形式です）。',
    },
  ],
  en: [
    {
      question: 'What is the difference between the M in PT1H30M and in P1M?',
      answer:
        'An M before the T means months, and an M after the T means minutes. P1M is one month and PT1M is one minute. Always put a T before hours, minutes and seconds.',
    },
    {
      question:
        'Why are the totals for durations with years or months approximate?',
      answer:
        'A month can be 28 to 31 days and a year 365 or 366, so their length is not fixed. This tool uses 1 year = 365.2425 days and 1 month = one twelfth of that. For an exact date, use the date addition section, which follows the calendar.',
    },
    {
      question: 'Can I combine weeks and days, like P1W2D?',
      answer:
        'In the basic ISO 8601 format, weeks (W) are meant to stand alone, but this tool also reads combinations and counts a week as 7 days. Other systems may reject them, so use days only when passing a duration elsewhere.',
    },
    {
      question:
        'Are fractional seconds like PT0.5S and negative durations supported?',
      answer:
        'Yes. Decimals can use a dot or a comma. A leading minus, as in -PT15M (used for iCalendar alarms), makes the duration negative.',
    },
  ],
};
