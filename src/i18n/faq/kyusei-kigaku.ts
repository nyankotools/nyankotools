import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '1月や2月生まれの本命星は前の年になりますか？',
      answer:
        'はい。九星気学では年が立春（2月3日〜5日ごろ）で切り替わるため、1月1日から立春の前日（節分）までに生まれた方は前年の本命星になります。たとえば2024年2月3日生まれは2023年の四緑木星、2月4日生まれは2024年の三碧木星です。',
    },
    {
      question: '立春の日は毎年2月4日ではないのですか？',
      answer:
        '立春は太陽が黄経315度に達する日で、年によって2月3日〜5日にずれます。たとえば2021年・2025年は2月3日、2022年・2024年・2026年は2月4日です。このツールは年ごとに立春の日付を計算し、結果に表示します。',
    },
    {
      question: '立春の当日に生まれた場合はどう判定されますか？',
      answer:
        'このツールは日付単位で判定するため、立春当日は新しい年として扱います。ただし厳密には立春になる時刻の前に生まれた場合は前年の星になります。当日生まれの方は、暦で立春の入りの時刻を確認してください。月命星の節入りの日も同様です。',
    },
    {
      question: '月命星はどのように決まりますか？',
      answer:
        '月は節入り（立春・啓蟄・清明など）の日から切り替わり、立春からの寅月を最初の月とします。寅月の星は本命星のグループ（一白・四緑・七赤は八白、三碧・六白・九紫は二黒、二黒・五黄・八白は五黄）で決まり、以降は月ごとに1つずつ戻ります。',
    },
    {
      question: '吉方位や相性も分かりますか？',
      answer:
        'このツールは本命星・月命星・五行と性格の目安、年→星の早見表に絞っています。吉方位や相性は流派によって考え方が異なるため扱っていません。結果は占い・娯楽としての目安です。',
    },
  ],
  en: [
    {
      question: 'Do people born in January or February get the previous year?',
      answer:
        "Yes. In Nine Star Ki the year changes at Risshun (February 3-5), so anyone born from January 1 to the day before Risshun gets the previous year's star. For example, February 3, 2024 gives the 2023 star (4 Green Wood), while February 4, 2024 gives the 2024 star (3 Jade Wood).",
    },
    {
      question: 'Is Risshun always on February 4?',
      answer:
        'No. Risshun is the day the Sun reaches ecliptic longitude 315 degrees, and it falls on February 3, 4 or 5 depending on the year. It was February 3 in 2021 and 2025, and February 4 in 2022, 2024 and 2026. The tool calculates it for each year and shows it in the result.',
    },
    {
      question: 'What if I was born on the day of Risshun?',
      answer:
        'The tool works by date, so the day of Risshun counts as the new year. Strictly, a birth before the exact time of Risshun belongs to the previous year, so check the time on a calendar if you were born that day. The same applies to the start day of a solar month for the month star.',
    },
    {
      question: 'How is the month star decided?',
      answer:
        'Months change on the first day of each solar term month (Risshun, Keichitsu, Seimei and so on), with the Tiger month starting at Risshun. The Tiger month star depends on your year star group (1, 4, 7 gives 8; 3, 6, 9 gives 2; 2, 5, 8 gives 5), and it goes down by one each month.',
    },
    {
      question: 'Does it show lucky directions or compatibility?',
      answer:
        'No. This tool is limited to the year star, month star, element, a short description, and the year-to-star chart. Lucky directions and compatibility vary by school, so they are not included. Results are for fortune-telling and entertainment only.',
    },
  ],
};
