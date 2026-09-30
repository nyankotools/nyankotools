import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'cronの曜日は0と7のどちらが日曜ですか？',
      answer:
        '一般的なcronでは0が日曜で、7も日曜として扱う実装があります。このツールでも0と7はどちらも日曜として扱い、1〜6が月曜〜土曜です。',
    },
    {
      question: '日と曜日の両方を指定すると、どう解釈されますか？',
      answer:
        '日と曜日の両方に「*」以外を指定すると、どちらかの条件に一致すれば実行されるOR判定になります。AND判定ではないため、意図しない日に実行されないよう注意してください。',
    },
    {
      question: 'GitHub ActionsやKubernetesのスケジュールにも使えますか？',
      answer:
        '5フィールド形式の式であれば、動作の確認に使えます。ただしGitHub Actionsの時刻はUTC基準で、このツールの予定日時は端末のローカル時刻で表示されるため、時差に注意してください。',
    },
  ],
  en: [
    {
      question: 'In cron, is Sunday 0 or 7?',
      answer:
        'In standard cron, 0 is Sunday, and some implementations also accept 7. This tool treats both 0 and 7 as Sunday, with 1 to 6 as Monday to Saturday.',
    },
    {
      question: 'What happens if I set both day-of-month and day-of-week?',
      answer:
        'When both fields are something other than "*", the job runs if either condition matches (OR logic), not both. Watch out for unexpected runs.',
    },
    {
      question: 'Can I use it for GitHub Actions or Kubernetes schedules?',
      answer:
        "For 5-field expressions, yes. Note that GitHub Actions uses UTC, while this tool shows run times in your device's local time, so account for the time difference.",
    },
  ],
};
