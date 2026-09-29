import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '抽出される色は正確ですか？',
      answer:
        '大きな画像は解析用に縮小してから処理し、近い色は1つにまとめて集計するため、画像全体の色の傾向を示す近似値です。1ピクセル単位の厳密な集計ではありません。',
    },
    {
      question: '透明な部分の色は含まれますか？',
      answer:
        '含まれません。透明（アルファ値がほぼ0）のピクセルは集計から除外されます。画像全体がほぼ透明の場合は、色を検出できないことがあります。',
    },
    {
      question: '抽出した色はどう活用できますか？',
      answer:
        'HEXなどのカラーコードとして、デザインの配色決めやWebサイトのカラースキーム作りに使えます。他の形式に変換したいときはカラーコード変換ツールと組み合わせてください。',
    },
  ],
  en: [
    {
      question: 'How accurate is the extracted palette?',
      answer:
        'Large images are downscaled for analysis and similar colors are merged, so the result approximates the overall color tendency rather than an exact pixel count.',
    },
    {
      question: 'Are transparent areas included?',
      answer:
        'No. Fully transparent pixels are excluded. If an image is almost entirely transparent, no colors may be detected.',
    },
    {
      question: 'How can I use the extracted colors?',
      answer:
        'Use them as HEX color codes for palettes and website color schemes. To convert them to other formats, combine this tool with the color converter.',
    },
  ],
};
