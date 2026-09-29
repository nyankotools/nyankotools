import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どのサイズのファイルが生成されますか？',
      answer:
        'favicon.ico（16・32・48pxを1ファイルに格納）、各サイズのPNG、apple-touch-icon.png（180px）、android-chrome-192x192.pngと512x512.pngをまとめて生成します。',
    },
    {
      question: 'どのくらいの大きさの元画像を用意すればよいですか？',
      answer:
        '正方形で、できれば512px以上の画像がおすすめです。長方形の画像を選ぶと、中央を基準にした正方形の範囲が使われ、枠をドラッグして切り抜き位置を調整できます。',
    },
    {
      question: 'manifest.jsonも作られますか？',
      answer:
        'いいえ。このツールが生成するのは画像ファイルのみで、manifest.json自体は作成しません。android-chromeの画像は、ご自身で用意したmanifest.jsonから参照してください。',
    },
  ],
  en: [
    {
      question: 'Which files are generated?',
      answer:
        'It generates favicon.ico (containing 16, 32 and 48px), PNGs for each size, apple-touch-icon.png (180px), and android-chrome 192x192 and 512x512 PNGs.',
    },
    {
      question: 'How large should the source image be?',
      answer:
        'A square image of at least 512px is recommended. With a rectangular image, a centered square crop is used and you can drag the frame to adjust it.',
    },
    {
      question: 'Does it also create manifest.json?',
      answer:
        'No. Only image files are generated. Reference the android-chrome images from your own manifest.json.',
    },
  ],
};
