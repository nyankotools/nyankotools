import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どんな錯視が見られますか？',
      answer:
        'ミュラー・リヤー、ポンゾ、ツェルナー、エビングハウス、カフェウォール、チェッカーシャドウ、ヘルマン格子、ポッゲンドルフ、フレーザー（渦巻き）の9種類です。それぞれに「見え方」と「実際は」の解説が付きます。',
    },
    {
      question: '補助線は何を示していますか？',
      answer:
        '錯視ごとに、長さが同じ・平行・一直線・同じ色であることを確かめる線や帯です。たとえばミュラー・リヤーでは両端をそろえる縦線、チェッカーシャドウではAとBをつなぐ同色の帯を表示します。',
    },
    {
      question: '錯視が効かない、または見え方が人によって違うのは普通ですか？',
      answer:
        'はい。錯視の強さには個人差があり、画面の大きさ・明るさ・見る距離でも変わります。「強さ」のスライダーで調整してみてください。チェッカーシャドウは図が固定のため、強さは変えられません。',
    },
    {
      question: '光過敏でも安心して見られますか？',
      answer:
        'このページは点滅や高速なアニメーションを使っておらず、図は静止画です。ただし、模様を長く見つめると不快に感じる方もいます。気分が悪くなったらすぐに画面から目を離してください。',
    },
    {
      question: '表示される図は保存や印刷ができますか？',
      answer:
        '画像として保存する機能はありません。必要な場合は、ブラウザの印刷やスクリーンショット機能を使ってください。図はすべてページ内で描かれ、外部へ送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'Which illusions are included?',
      answer:
        'Nine: Müller-Lyer, Ponzo, Zöllner, Ebbinghaus, café wall, checker shadow, Hermann grid, Poggendorff and the Fraser spiral. Each comes with a short note on what you see and what is actually true.',
    },
    {
      question: 'What do the guide lines show?',
      answer:
        'They are lines or bands that prove the effect is only apparent: equal length, parallel, collinear or the same color. For Müller-Lyer they align the line ends, and for the checker shadow a band of one gray joins A and B.',
    },
    {
      question: 'The illusion looks weak to me. Is that normal?',
      answer:
        'Yes. How strong an illusion looks differs between people, and it also depends on screen size, brightness and viewing distance. Try the "Strength" slider. The checker shadow figure is fixed, so strength does not apply to it.',
    },
    {
      question: 'Is it safe for people who are sensitive to light?',
      answer:
        'The page has no flashing and no fast animation, and every figure is still. Some people still find staring at patterns uncomfortable, so look away from the screen if you start to feel unwell.',
    },
    {
      question: 'Can I save or print the figures?',
      answer:
        'There is no image export. Use your browser’s print function or a screenshot if you need a copy. The figures are drawn on the page itself and nothing is sent anywhere.',
    },
  ],
};
