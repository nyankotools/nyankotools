import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'RGBとOKLabの混色はどう違いますか？',
      answer:
        'RGBはsRGBの数値をそのまま平均するため、補色同士だとくすんだ色になりがちです。OKLabは見た目の明るさに近い色空間で補間するので、明るさがなめらかに変わり、自然なグラデーションになりやすいです。',
    },
    {
      question: '中間色の数に両端の色は含まれますか？',
      answer:
        '含まれます。たとえば5段なら、1番目が色A、5番目が色Bで、その間に3色が等間隔で入ります。指定できるのは2〜21段です。',
    },
    {
      question: '混色結果が絵の具を混ぜたときと違うのはなぜですか？',
      answer:
        'このツールはディスプレイ上の色（光）の計算で、絵の具やインクのような減法混色とは仕組みが違います。たとえば青と黄を混ぜても、緑ではなく灰色寄りの色になることがあります。',
    },
    {
      question: 'OKLabで混ぜた色が少し違う色に丸められることはありますか？',
      answer:
        'あります。OKLabの補間結果がsRGBで表示できる範囲を超えた場合は、範囲内に丸めてHEXにします。鮮やかな色同士を混ぜたときに起こることがあります。',
    },
  ],
  en: [
    {
      question: 'What is the difference between RGB and OKLab mixing?',
      answer:
        'RGB mixing averages the sRGB values directly, so opposite colors often turn dull. OKLab interpolates in a perceptual space, so lightness changes more smoothly and gradients usually look more natural.',
    },
    {
      question: 'Does the number of steps include the two endpoints?',
      answer:
        'Yes. With 5 steps, the first is color A, the fifth is color B, and three evenly spaced colors sit between them. You can choose 2 to 21 steps.',
    },
    {
      question: 'Why does the result differ from mixing real paint?',
      answer:
        'This tool calculates on-screen light, not subtractive mixing like paint or ink. For example, blending blue and yellow can give a grayish color rather than green.',
    },
    {
      question: 'Can an OKLab result be clipped to a different color?',
      answer:
        'Yes. If the interpolated OKLab color falls outside the sRGB gamut, it is clipped into range before being shown as HEX. This can happen when blending very vivid colors.',
    },
  ],
};
