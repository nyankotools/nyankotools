import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '有給休暇はいつ、何日付与されますか？',
      answer:
        '雇入れから6か月継続勤務し、全労働日の8割以上出勤すると最初の有給が付与されます。通常の労働者（週5日以上または週30時間以上）は10日で、以後1年ごとに11・12・14・16・18日と増え、勤続6年6か月以降は毎年20日です。',
    },
    {
      question: 'パート・アルバイトの有給日数は正社員と違いますか？',
      answer:
        '週の所定労働日数が4日以下で週30時間未満の場合は比例付与になります。たとえば週4日なら6か月後に7日、週3日なら5日、週2日なら3日、週1日なら1日が付与されます。週4日以下でも週30時間以上なら通常付与です。',
    },
    {
      question: '年5日の取得義務は誰が対象ですか？',
      answer:
        '年10日以上の有給が付与される労働者が対象です。比例付与でも、週4日で勤続3年6か月以降（10日）などに達すると対象になります。使用者は付与日から1年以内に5日を取得させなければなりません。',
    },
    {
      question: '使わなかった有給休暇は翌年に繰り越せますか？',
      answer:
        '繰り越せますが、時効は付与日から2年です。たとえば2024年4月1日に付与された分は、2026年4月1日には消滅します。このツールでは、時効にかかっていない付与分の合計を最大保有日数として表示しています。',
    },
  ],
  en: [
    {
      question: 'When is paid leave granted in Japan, and how many days?',
      answer:
        'After 6 months of continuous employment and attendance on at least 80% of working days, you get your first grant. A standard worker (5+ days or 30+ hours a week) receives 10 days, then 11, 12, 14, 16, and 18 in later years, and 20 days every year from 6.5 years of service.',
    },
    {
      question: 'Do part-time workers get fewer paid leave days?',
      answer:
        'If you are scheduled 4 days or fewer and under 30 hours per week, the proportional table applies: at six months, 7 days for 4 days a week, 5 for 3 days, 3 for 2 days, and 1 for 1 day. With 30 or more weekly hours, the standard table applies even at 4 days.',
    },
    {
      question: 'Who is covered by the 5-day usage requirement?',
      answer:
        'Anyone granted 10 or more days in a year. Proportional workers become covered when a grant reaches 10 (for 4 days a week, from 3.5 years of service). The employer must have you take 5 days within one year of the grant date.',
    },
    {
      question: 'Do unused paid leave days carry over?',
      answer:
        'Yes, but they expire 2 years after the grant date. Days granted on 1 April 2024 expire on 1 April 2026. This tool shows the maximum held as the total of grants that have not expired.',
    },
  ],
};
