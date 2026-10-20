import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '作ったICSファイルはどうやってカレンダーに追加しますか？',
      answer:
        'ダウンロードした.icsファイルをダブルクリックするか、Googleカレンダーの「設定 > インポート／エクスポート」、Outlookの「ファイル > 開く／エクスポート」、iPhoneならメールやファイルアプリから開いて取り込みます。取り込みはお使いの端末・アプリ内で行われます。',
    },
    {
      question: '時刻がずれて取り込まれるのはなぜですか？',
      answer:
        'タイムゾーンの扱いが原因のことが多いです。「指定しない」だと取り込んだ側の現地時間になります。「タイムゾーンを指定（TZID）」はVTIMEZONEを含まないため、古いアプリでは解釈できないことがあります。その場合は「UTCに変換して書き出す」を選ぶと、どの環境でも同じ瞬間を指します。',
    },
    {
      question: '終日の予定の終了日はどう扱われますか？',
      answer:
        'この画面では終了日に最終日を入力します。ICSの仕様では終日予定の終了日は「最終日の翌日」を指定する決まりなので、ファイルには自動で1日加えた値（DTEND）を書き出します。',
    },
    {
      question: '繰り返しの予定を途中で終わらせるには？',
      answer:
        '「繰り返しの終わり」で「回数で指定」か「終了日で指定」を選びます。回数は最大999回です。終了日を指定した場合は、その日の終わりまでの予定が対象になります。',
    },
    {
      question: 'Googleカレンダーの追加リンクにリマインダーは付けられますか？',
      answer:
        'できません。追加リンクで指定できるのはタイトル・日時・場所・説明・繰り返しです。通知は.icsファイルをインポートするか、追加後にGoogleカレンダー側で設定してください。',
    },
  ],
  en: [
    {
      question: 'How do I add the generated ICS file to my calendar?',
      answer:
        'Open the downloaded .ics file, or import it from Google Calendar (Settings > Import & export), Outlook (File > Open & Export) or the Files/Mail app on iPhone. The import happens inside your own device and app.',
    },
    {
      question: 'Why does the event import at the wrong time?',
      answer:
        'It is usually the time zone setting. "None" uses the local time of whoever imports the file. "Use a time zone (TZID)" does not include a VTIMEZONE definition, so older apps may not understand it. Choose "Convert to UTC" to point to the same instant in every app.',
    },
    {
      question: 'How is the end date of an all-day event handled?',
      answer:
        'Enter the last day of the event. The ICS standard stores the end of an all-day event as the day after the last day, so the file adds one day to DTEND automatically.',
    },
    {
      question: 'How do I stop a repeating event after a while?',
      answer:
        'Under "Ends", choose "After a number of times" or "On a date". The count can be up to 999. With a date, occurrences up to the end of that day are included.',
    },
    {
      question: 'Can the Google Calendar link include a reminder?',
      answer:
        'No. The link can carry the title, time, location, description and recurrence only. Import the .ics file to include a reminder, or add one in Google Calendar afterwards.',
    },
  ],
};
