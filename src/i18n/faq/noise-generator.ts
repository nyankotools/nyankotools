import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ホワイト・ピンク・ブラウンノイズはどれを選べばよいですか？',
      answer:
        '雑音を覆い隠したいならホワイトノイズ、雨や滝のような自然な音で作業や睡眠をしたいならピンクノイズ、低くて深い音が好みならブラウンノイズが目安です。好みには個人差があるので、聞き比べて選んでください。',
    },
    {
      question: 'タイマーが終わると急に止まりますか？',
      answer:
        'いいえ。終了の前の最大10秒間で音量が徐々に下がり、静かに止まります。睡眠中でも突然の無音で目が覚めにくくなります。',
    },
    {
      question: 'スマートフォンで画面を消しても鳴り続けますか？',
      answer:
        'ブラウザやOSの省電力設定によります。画面ロックでタブが止まる端末では、音も止まります。ロックしても再生を続けたい場合は、端末の設定でバックグラウンド再生や省電力を確認してください。',
    },
    {
      question: '音が途切れたり、同じ音のくり返しに聞こえたりしませんか？',
      answer:
        '約10秒分のノイズを、つなぎ目をなじませながらくり返し再生しています。ノイズは不規則な音なので、周期は通常ほとんど気になりません。',
    },
    {
      question: '生成した音は保存・送信されますか？',
      answer:
        'いいえ。音はこのページの中で生成して再生するだけで、サーバーへの送信や保存はありません。',
    },
  ],
  en: [
    {
      question: 'Which should I pick: white, pink or brown noise?',
      answer:
        'White noise is good for masking distracting sounds, pink noise sounds like steady rain or a waterfall and suits work and sleep, and brown noise is deeper and bass-heavy. Preferences vary, so try each and see which feels comfortable.',
    },
    {
      question: 'Does the sound cut off suddenly when the timer ends?',
      answer:
        'No. The volume fades down over up to 10 seconds before the end, then stops quietly, so the silence is less likely to wake you if you are asleep.',
    },
    {
      question: 'Does it keep playing when my phone screen turns off?',
      answer:
        'It depends on your browser and OS power settings. On devices that suspend the tab when the screen locks, the sound stops too. Check background playback and battery-saver settings on your device if you need it to continue.',
    },
    {
      question: 'Will I hear a loop or a gap in the sound?',
      answer:
        'The noise is a loop of about 10 seconds with a smoothed seam. Because noise is random, the repetition is usually not noticeable.',
    },
    {
      question: 'Is the generated sound saved or uploaded?',
      answer:
        'No. The sound is generated and played inside this page and is never uploaded or stored.',
    },
  ],
};
