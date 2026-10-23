import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '「5分ごと」や「平日9時〜18時」はどう指定しますか？',
      answer:
        '分を「間隔（*/N）」で5にすると */5、時を「範囲」で9〜18、曜日を「範囲」で1〜5にすると、*/5 9-18 * * 1-5 のように生成されます。',
    },
    {
      question: 'Quartz形式とは何が違いますか？',
      answer:
        'Quartzは先頭に秒フィールドがあり、曜日が1〜7（1が日曜）で、日と曜日のどちらかを ? にします。このツールは標準の5フィールド式から自動変換した参考値を表示します。',
    },
    {
      question:
        '日と曜日の両方を指定するとQuartz形式が表示されないのはなぜですか？',
      answer:
        'Quartzでは日と曜日の同時指定ができず、どちらかを ? にする必要があるためです。標準cronでは両方指定するとどちらかに一致すれば実行されます。',
    },
    {
      question: '生成した式が意図通りか確認するには？',
      answer:
        'Cron式シミュレーターに式を貼り付けると、意味の解説と次回の実行予定日時を確認できます。',
    },
  ],
  en: [
    {
      question: 'How do I set "every 5 minutes" or "weekdays 9 to 18"?',
      answer:
        'Set minute to Interval with 5 for */5, hour to Range 9 to 18, and weekday to Range 1 to 5. The result is */5 9-18 * * 1-5.',
    },
    {
      question: 'How is Quartz format different?',
      answer:
        'Quartz adds a leading seconds field, numbers weekdays 1-7 (1 is Sunday), and needs ? in either day of month or day of week. This tool shows an automatic conversion for reference.',
    },
    {
      question: 'Why is there no Quartz output when I set both day fields?',
      answer:
        'Quartz cannot restrict day of month and day of week together; one must be ?. Standard cron instead runs when either one matches.',
    },
    {
      question: 'How can I verify the expression does what I want?',
      answer:
        'Paste it into the Cron Expression Simulator to get a plain explanation and the upcoming run times.',
    },
  ],
};
