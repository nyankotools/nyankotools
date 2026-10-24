import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'PDF⇔画像変換との違いは何ですか？',
      answer:
        'PDF⇔画像変換はページ全体（文字や図形を含む）を1枚の画像に描き直します。このツールはPDFの中に埋め込まれている写真・図版などの画像そのものを、元のピクセルのまま取り出します。ページの見た目ではなく素材の画像が欲しいときに向いています。',
    },
    {
      question: 'どんな画像が抽出できませんか？',
      answer:
        '文字、グラフや図形などのベクターデータは画像ではないため取り出せません。また、型抜き用のマスク画像や、形式によっては検出されない画像もあります。その場合は、ページ全体を画像にするPDF⇔画像変換をお試しください。',
    },
    {
      question: '元がJPEGの画像もPNGで保存されるのはなぜですか？',
      answer:
        'ブラウザ上でデコードしたピクセルを劣化なく保存するため、一律でPNGにしています。そのため元のJPEGより容量が大きくなることがあります。見た目の画質は変わりません。',
    },
    {
      question: '透明な部分のある画像はどうなりますか？',
      answer:
        '透過情報やソフトマスクを持つ画像は、透明部分を保ったPNGとして保存されます。背景が白く塗りつぶされることはありません。',
    },
  ],
  en: [
    {
      question: 'How is this different from the PDF ⇔ Image Converter?',
      answer:
        'The PDF ⇔ Image Converter redraws a whole page, text and shapes included, as one image. This tool pulls out the pictures embedded in the PDF at their original pixels. Use it when you want the source images, not the look of the page.',
    },
    {
      question: 'What kinds of images cannot be extracted?',
      answer:
        'Text and vector data such as charts and shapes are not images, so they cannot be extracted. Stencil mask images, and some formats, may also go undetected. In that case, try the PDF ⇔ Image Converter to render the whole page instead.',
    },
    {
      question: 'Why are JPEG images saved as PNG?',
      answer:
        'The pixels are decoded in the browser and saved losslessly, so everything is written as PNG. Files can therefore be larger than the original JPEG, but the picture quality is unchanged.',
    },
    {
      question: 'What happens to images with transparent areas?',
      answer:
        'Images with an alpha channel or soft mask are saved as PNG with the transparency kept. The background is not filled with white.',
    },
  ],
};
