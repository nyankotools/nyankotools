import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '連番をゼロ埋めして「001」のようにするには？',
      answer:
        '「ゼロ埋め桁数」に3を入れると、1が001、25が025のように最小3桁でそろいます。桁数より大きい数（1000など）は桁が増えるだけで切り捨てません。ファイル名なら接頭辞に「img_」、接尾辞に「.jpg」を入れると img_001.jpg の形で作れます。',
    },
    {
      question: '月ごとの日付で31日スタートだとどうなりますか？',
      answer:
        '日が存在しない月は、その月の末日に寄せます。1月31日から1か月ごとなら 1/31、2/28（うるう年は2/29）、3/31、4/30 の順です。毎回前の日付から足すのではなく開始日を基準に計算するので、3月以降に31日へ戻ります。',
    },
    {
      question: '土日を除くと件数はどうなりますか？',
      answer:
        '件数指定のときは、土日を飛ばしたうえで指定の件数が揃うまで進めます。終了日指定のときは、期間内の平日だけが出力されます。土曜日開始で7日ごとのように、条件に合う日が1つもなければエラーになります。',
    },
    {
      question: '祝日や英語表記の曜日にも対応していますか？',
      answer:
        '祝日の判定には対応していません（土日のみ除外できます）。曜日は日本語ページでは「月」「月曜日」、英語ページでは Mon / Monday の形で付き、日付の後ろに（月）のように添えられます。',
    },
    {
      question: '一度に作れる件数に上限はありますか？',
      answer:
        '最大10000件です。終了値や終了日の指定でこれを超える場合はエラーになるので、範囲を分けるか増分・間隔を広げてください。',
    },
  ],
  en: [
    {
      question: 'How do I make zero-padded numbers like 001?',
      answer:
        'Set "Zero padding digits" to 3 and 1 becomes 001, 25 becomes 025. Numbers wider than the padding (such as 1000) simply grow and are never cut. For file names, put "img_" in the prefix and ".jpg" in the suffix to get img_001.jpg.',
    },
    {
      question: 'What happens when I start on the 31st with monthly steps?',
      answer:
        'A day that does not exist in a month moves to that month’s last day. From January 31 with one-month steps you get 1/31, 2/28 (2/29 in a leap year), 3/31, 4/30. Each date is calculated from the start date rather than the previous one, so it returns to the 31st in March.',
    },
    {
      question: 'How does skipping weekends affect the count?',
      answer:
        'With a count, weekend days are skipped and the list continues until you have the requested number of dates. With an end date, only weekdays in the period are output. If no date can match, such as starting on a Saturday with 7-day steps, an error is shown.',
    },
    {
      question: 'Are public holidays and weekday names supported?',
      answer:
        'Public holidays are not detected; only Saturdays and Sundays can be skipped. Weekdays appear after the date, like "2026-10-14 (Wed)" or in full as Wednesday, depending on the option you choose.',
    },
    {
      question: 'Is there a limit on how many items I can generate?',
      answer:
        'Up to 10,000 items. If an end value or end date would produce more, an error is shown; split the range or use a larger step or interval.',
    },
  ],
};
