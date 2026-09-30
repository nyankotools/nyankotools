import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'PDFを画像にするとき、画質は変えられますか？',
      answer:
        '書き出しの解像度を標準（72dpi）・高（144dpi）・最高（216dpi）から選べ、形式はPNGまたはJPEGです。ページが極端に大きい場合は、ブラウザの制限に収まるよう自動で縮小されることがあります。',
    },
    {
      question: '複数の画像を1つのPDFにまとめられますか？',
      answer:
        'はい。複数の画像を選ぶと、選んだ順に1枚1ページで並べて1つのPDFにできます。ページサイズは「画像サイズに合わせる」かA4から選べ、追加選択もできます。',
    },
    {
      question: 'ファイルは外部に送信されますか？',
      answer:
        'いいえ。PDFも画像もブラウザ内で処理され、端末の外に出ることはありません。',
    },
  ],
  en: [
    {
      question: 'Can I adjust the image quality when converting a PDF?',
      answer:
        'You can choose a resolution of standard (72 dpi), high (144 dpi) or maximum (216 dpi), and export as PNG or JPEG. For extremely large pages, the image may be scaled down automatically to fit browser limits.',
    },
    {
      question: 'Can I combine several images into one PDF?',
      answer:
        'Yes. Select multiple images and they are placed one per page in the order chosen, in a single PDF. You can fit the page to each image or use A4, and you can add more images afterward.',
    },
    {
      question: 'Are my files sent anywhere?',
      answer:
        'No. Both PDFs and images are processed in your browser and never leave your device.',
    },
  ],
};
