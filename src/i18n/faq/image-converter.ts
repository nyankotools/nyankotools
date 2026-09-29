import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'JPEGに変換すると透明部分はどうなりますか？',
      answer:
        'JPEGは透過に対応していないため、透明な部分は白で塗りつぶされます。透過を維持したい場合はWebPまたはPNGを選んでください。',
    },
    {
      question: '画質の設定はPNGでも効きますか？',
      answer:
        'いいえ。画質（圧縮率）はWebPとJPEGのみ有効です。PNGは可逆圧縮のため、常に元画像と同じ画質で出力されます。',
    },
    {
      question: 'アニメーションGIFも変換できますか？',
      answer:
        '変換はできますが、アニメーションは失われ、最初のフレームだけの静止画になります。',
    },
  ],
  en: [
    {
      question: 'What happens to transparency when converting to JPEG?',
      answer:
        'JPEG does not support transparency, so transparent areas are filled with white. Choose WebP or PNG to keep transparency.',
    },
    {
      question: 'Does the quality setting apply to PNG?',
      answer:
        'No. Quality only applies to WebP and JPEG. PNG is lossless and is always output at the original quality.',
    },
    {
      question: 'Can I convert animated GIFs?',
      answer:
        'You can, but the animation is lost and only the first frame is converted to a still image.',
    },
  ],
};
