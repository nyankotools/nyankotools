import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '秒とミリ秒はどう見分けますか？',
      answer:
        '「自動判定」では、10桁以下を秒、11桁以上をミリ秒として扱います。手動で単位を切り替えることもできます。マイクロ秒やナノ秒には対応していません。',
    },
    {
      question: '日時を入力したとき、どのタイムゾーンで扱われますか？',
      answer:
        '入力した日時は、お使いの端末のタイムゾーン（ローカル時刻）として扱われます。UTCとして扱いたい場合は、時差を考慮して入力してください。',
    },
    {
      question: '1970年より前の日付も変換できますか？',
      answer:
        'はい。1970年1月1日より前の日時は、負のタイムスタンプとして扱われます。',
    },
  ],
  en: [
    {
      question: 'How are seconds and milliseconds told apart?',
      answer:
        'With auto-detect, 10 digits or fewer are seconds and 11 or more are milliseconds. You can also set the unit manually. Microseconds and nanoseconds are not supported.',
    },
    {
      question: 'Which time zone is used when I enter a date and time?',
      answer:
        "Input is interpreted in your device's local time zone. If you need UTC, adjust for the offset.",
    },
    {
      question: 'Can dates before 1970 be converted?',
      answer:
        'Yes. Dates before January 1, 1970 are represented as negative timestamps.',
    },
  ],
};
