import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'なぜ90分単位で計算するのですか？',
      answer:
        'ノンレム睡眠とレム睡眠が一巡する睡眠サイクルが、成人でおよそ90分とされるためです。サイクルの区切りで起きると目覚めやすいという考え方に基づく目安で、実際の長さには個人差があります。',
    },
    {
      question: '入眠までの時間はどう設定すればよいですか？',
      answer:
        '布団に入ってから眠りにつくまでの時間を入力します。既定は15分です。寝つきが良い人は短く、時間がかかる人は長めにすると、より実態に近い結果になります。',
    },
    {
      question: '日付をまたぐ時刻はどう表示されますか？',
      answer:
        '24時間表記で表示し、入力した時刻と日付が異なる場合は「前日」「翌日」と添えます。たとえば7:00に起きたい場合、23:15は前日の時刻です。',
    },
    {
      question: '結果どおりに寝れば必ずすっきり起きられますか？',
      answer:
        '保証はできません。睡眠の質は体調・環境・睡眠負債などにも左右されます。結果は目安であり、医療上のアドバイスではありません。',
    },
  ],
  en: [
    {
      question: 'Why does the calculator use 90-minute blocks?',
      answer:
        'A sleep cycle, one pass through non-REM and REM sleep, lasts about 90 minutes in adults. Waking at the end of a cycle is thought to feel easier, but the real length varies from person to person.',
    },
    {
      question: 'What should I enter for the time to fall asleep?',
      answer:
        'Enter how long it usually takes you to fall asleep after getting into bed. The default is 15 minutes. Use a lower number if you drift off quickly and a higher one if you need longer.',
    },
    {
      question: 'How are times that cross midnight shown?',
      answer:
        'Times use the 24-hour clock, with "previous day" or "next day" added when the result is on a different day than the time you entered. For a 07:00 wake-up, 23:15 is the evening before.',
    },
    {
      question: 'Will I definitely wake up refreshed if I follow the result?',
      answer:
        'There is no guarantee. Sleep quality also depends on your health, environment and accumulated sleep debt. The results are estimates, not medical advice.',
    },
  ],
};
