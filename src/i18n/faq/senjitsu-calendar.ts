import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '天赦日はどうやって決まりますか？',
      answer:
        '季節ごとに決まった干支の日です。春（立春〜立夏の前日）は戊寅、夏（立夏〜立秋の前日）は甲午、秋（立秋〜立冬の前日）は戊申、冬（立冬〜立春の前日）は甲子の日が天赦日になります。同じ干支でも季節が合わない日は天赦日にならないため、年に5〜6回ほどです。',
    },
    {
      question: '一粒万倍日と寅の日・巳の日が重なったらどうなりますか？',
      answer:
        '吉日が重なる日は、より縁起がよいとされます。たとえば寅の日が一粒万倍日でもある日は、財布の購入や開業の日取りに選ばれやすい日です。一方、不成就日と重なる日は、避ける印があるため用途別の吉日からは外します（天赦日と重なる場合は天赦日が打ち消すものとして扱います）。',
    },
    {
      question: '不成就日はいつですか？',
      answer:
        '旧暦の月と日で決まります。1・7月は3・11・19・27日、2・8月は2・10・18・26日、3・9月は1・9・17・25日、4・10月は8・16・24日、5・11月は7・15・23日、6・12月は6・14・22日です。新暦の日付はこのツールで年月を選ぶと確認できます。',
    },
    {
      question: '他の暦サイトと日付が違うのはなぜですか？',
      answer:
        '節入りや朔の時刻が0時付近にあたると、数分の計算誤差で1日ずれることがあります。また、一粒万倍日の十二支の表や、用途ごとの吉凶の分け方は暦によって違いがあります。大切な日取りは、複数の暦で確認してください。',
    },
    {
      question: '結婚式に寅の日や仏滅は避けたほうがよいですか？',
      answer:
        '科学的な根拠や法的な決まりはなく、気にするかどうかは本人と家族の考え方次第です。一般には、寅の日は「千里を行って千里を帰る」ことから結婚には向かないとされ、仏滅も避けられがちです。このツールの結婚の判定では、これらと不成就日・鬼宿日を避ける日として扱います。',
    },
  ],
  en: [
    {
      question: 'How is Tenshanichi decided?',
      answer:
        'It is a fixed stem-branch day for each season: Tsuchinoe-tora (戊寅) in spring (Start of Spring up to the day before Start of Summer), Kinoe-uma (甲午) in summer, Tsuchinoe-saru (戊申) in autumn and Kinoe-ne (甲子) in winter. The same stem-branch day outside its season does not count, so it comes about five or six times a year.',
    },
    {
      question: 'What if Ichiryumanbai falls on a Tora or Mi day?',
      answer:
        'Overlapping lucky days are considered even better, and a Tora day that is also Ichiryumanbai is a popular pick for starting a business or buying a wallet. A Fujoju day, however, carries a mark to avoid, so it is left out of the lucky-day list for the chosen purpose; if it coincides with Tenshanichi, Tenshanichi is treated as cancelling it.',
    },
    {
      question: 'When are Fujoju days?',
      answer:
        'They follow the lunar month and day: lunar months 1 and 7 on days 3, 11, 19 and 27; months 2 and 8 on days 2, 10, 18 and 26; months 3 and 9 on days 1, 9, 17 and 25; months 4 and 10 on days 8, 16 and 24; months 5 and 11 on days 7, 15 and 23; months 6 and 12 on days 6, 14 and 22. Pick a year and month here to see the Gregorian dates.',
    },
    {
      question: 'Why do the dates differ from another calendar site?',
      answer:
        'When a solar term or new moon falls within a few minutes of midnight, the calculation can land one day off. Calendars also differ on the branch table for Ichiryumanbai and on which days suit which purpose. For an important date, compare more than one almanac.',
    },
    {
      question: 'Should I avoid Tora days and Butsumetsu for a wedding?',
      answer:
        'There is no scientific or legal basis, so it is up to you and your family. Tora days are traditionally avoided for weddings because the tiger "goes a thousand ri and returns", and Butsumetsu is often avoided too. For weddings this tool treats those two, plus Fujoju and Kishukunichi, as days to avoid.',
    },
  ],
};
