import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '満年齢と数え年はどう違いますか？',
      answer:
        '満年齢は誕生日を迎えるたびに1歳ずつ増える数え方で、生まれた日を0歳とします。数え年は生まれた年を1歳とし、元日（1月1日）を迎えるたびに1歳増やす数え方です。このツールでは両方を同時に表示します。',
    },
    {
      question: '基準日を変えると何がわかりますか？',
      answer:
        '基準日を過去や未来の日付にすると、「2030年4月1日時点で何歳か」のように特定の日の年齢を確認できます。申込書の年齢要件や、入学・入社時点の年齢の確認に使えます。',
    },
    {
      question: '2月29日生まれの人の年齢はどう計算されますか？',
      answer:
        'うるう年でない年は、便宜上2月28日を経過した時点で1歳加算する扱いにしています。法律上は「年齢計算ニ関スル法律」により誕生日の前日の終了時に加算されるため、実際の手続きでは該当の規定も確認してください。',
    },
  ],
  en: [
    {
      question:
        'What is the difference between international age and Korean-style counting age (kazoedoshi)?',
      answer:
        "International (full) age starts at 0 on the day you are born and increases by one on each birthday. Kazoedoshi, the traditional East Asian count, starts at 1 at birth and adds one every New Year's Day. This tool shows both at once.",
    },
    {
      question: 'What can I do by changing the reference date?',
      answer:
        'Set the reference date to a past or future day to see how old someone is (or will be) on that date, for example on April 1, 2030. This is handy for checking age requirements on applications or age at enrollment.',
    },
    {
      question: 'How is the age calculated for someone born on February 29?',
      answer:
        'In non-leap years, this tool treats February 28 as the birthday for counting purposes. Legal rules on age may differ by country, so check the relevant regulation for official procedures.',
    },
  ],
};
