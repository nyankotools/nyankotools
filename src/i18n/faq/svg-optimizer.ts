import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'SVGを最適化すると見た目は変わりますか？',
      answer:
        '通常は変わりません。SVGOでエディタのメタデータや不要な属性、空白などを取り除きます。ただし数値の精度を落とすため、非常に細かい図形では差が出ることがあるので、結果を必ず確認してください。',
    },
    {
      question: 'PNGやJPEGにも使えますか？',
      answer:
        'いいえ。このツールはSVG専用です。PNGやJPEGなどのビットマップ画像のサイズ変更や圧縮は、画像リサイズ・圧縮ツールをご利用ください。',
    },
    {
      question: '最適化したSVGをCSSに埋め込むにはどうしますか？',
      answer:
        '画像のBase64（Data URL）変換ツールでData URLにすると、CSSのurl()などに埋め込めます。',
    },
  ],
  en: [
    {
      question: 'Will optimizing change how the SVG looks?',
      answer:
        'Normally not. SVGO strips editor metadata, unused attributes and whitespace. It also reduces numeric precision, which can affect very fine shapes, so always check the result.',
    },
    {
      question: 'Does it work on PNG or JPEG?',
      answer:
        'No. It is SVG-only. Use the image resizer for bitmap images such as PNG and JPEG.',
    },
    {
      question: 'How can I embed the optimized SVG in CSS?',
      answer:
        'Convert it to a Data URL with the image-to-Base64 tool, then use it in CSS url() or similar.',
    },
  ],
};
