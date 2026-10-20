import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '2枚の画像のサイズが違っても比較できますか？',
      answer:
        'はい。ビフォー画像の大きさを基準に、アフター画像を縦横比を保ったまま収めて重ねます。縦横比が違う場合は余白ができるので、同じサイズに揃えた画像で比べるとより正確です。',
    },
    {
      question: '比較スライダーをキーボードで動かせますか？',
      answer:
        '「境界の位置」のスライダーを選択して左右の矢印キーで動かせます。マウスやタッチでプレビュー上をドラッグしても動かせます。',
    },
    {
      question: '「比較画像」と「並置画像」は何が違いますか？',
      answer:
        '比較画像は現在の境界位置で左右（または上下）に切り分けた1枚で、境界線が入ります。並置画像はビフォーとアフターをまるごと並べた1枚で、境界位置には依存しません。',
    },
    {
      question: 'GIFアニメーションとして書き出せますか？',
      answer:
        'いいえ。保存形式はPNGのみです。入力にアニメーションGIFを選んだ場合は最初のフレームだけを使います。',
    },
  ],
  en: [
    {
      question: 'Can I compare images of different sizes?',
      answer:
        'Yes. The after image is fitted inside the before image, keeping its aspect ratio. If the ratios differ you will see empty margins, so matching sizes gives the most accurate comparison.',
    },
    {
      question: 'Can I move the slider with the keyboard?',
      answer:
        'Yes. Focus the "Divider position" slider and use the left and right arrow keys. You can also drag on the preview with a mouse or finger.',
    },
    {
      question:
        'What is the difference between the comparison and side-by-side PNGs?',
      answer:
        'The comparison PNG is a single image split at the current divider position, with the divider line drawn in. The side-by-side PNG places the complete before and after images next to each other and does not depend on the divider.',
    },
    {
      question: 'Can I export an animated GIF?',
      answer:
        'No. Output is PNG only. If you load an animated GIF as input, only its first frame is used.',
    },
  ],
};
