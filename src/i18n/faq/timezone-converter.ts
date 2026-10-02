import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'サマータイム（夏時間）は自動で反映されますか？',
      answer:
        '反映されます。入力した日付時点のその都市のサマータイムの有無を、ブラウザのタイムゾーンデータから判定して換算します。たとえばニューヨークは、夏はUTC-4、冬はUTC-5として計算されます。',
    },
    {
      question: '存在しない時刻や2回ある時刻を入力するとどうなりますか？',
      answer:
        'サマータイムの開始日には「午前2時台」のように存在しない時刻があり、終了日には同じ時刻が2回あります。存在しない時刻は切り替え前の時差で、2回ある時刻は早いほう（サマータイム中）で換算し、その旨を画面に表示します。',
    },
    {
      question: '一覧にない都市を追加するには？',
      answer:
        '「タイムゾーンを追加」に Europe/Madrid や America/Toronto のようなIANA名を入力して追加します。入力欄では、ブラウザが対応するタイムゾーン名が候補として表示されます。',
    },
    {
      question: '「日付の差」はどう計算されていますか？',
      answer:
        '基準のタイムゾーンの日付と比べて、変換先の現地の日付が何日ずれているかを表します。東京の朝9時はニューヨークでは前日の夜になるため、「-1日」と表示されます。',
    },
  ],
  en: [
    {
      question: 'Is daylight saving time applied automatically?',
      answer:
        'Yes. For the date you enter, the tool checks whether each city observes daylight saving time using your browser’s time zone data. For example, New York is calculated as UTC-4 in summer and UTC-5 in winter.',
    },
    {
      question:
        'What happens if I enter a time that does not exist or occurs twice?',
      answer:
        'On the day daylight saving starts, some times (like 2:30 a.m.) do not exist, and on the day it ends, some times happen twice. A non-existent time is converted with the offset from before the change, and a repeated time uses the earlier one (during daylight saving). A note is shown when this applies.',
    },
    {
      question: 'How do I add a city that is not in the list?',
      answer:
        'Type an IANA name such as Europe/Madrid or America/Toronto under “Add a time zone” and press Add. The input suggests the time zone names your browser supports.',
    },
    {
      question: 'How is the day difference calculated?',
      answer:
        'It compares each city’s local date with the date in your starting time zone. For example, 9:00 a.m. in Tokyo is the evening of the previous day in New York, so it shows -1 day.',
    },
  ],
};
