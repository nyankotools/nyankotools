import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '写真が外部にアップロードされることはありますか？',
      answer:
        'ありません。補正はすべてブラウザ内のCanvasで行い、画像をサーバーに送ることはありません。契約書や身分証の写真でも安心して使えます。',
    },
    {
      question:
        '影が残る、または紙が灰色っぽくなるときはどうすればいいですか？',
      answer:
        '「影・照明ムラの除去」を上げ、「紙の白さ・文字の濃さ」も少し上げてみてください。紙が写真の大部分を占めていないと地色を正しく推定できないため、先にトリミングで書類だけにするときれいに仕上がります。',
    },
    {
      question: '白黒2値にすると文字がかすれます。どうすればいいですか？',
      answer:
        '「しきい値を自動で決める」をオフにして、しきい値を上げると薄い文字も黒として残ります。それでも難しい場合は、グレースケールで保存するのがおすすめです。',
    },
    {
      question: '大きな画像でも処理できますか？',
      answer:
        '約4,000万画素・25MBまで読み込めます。ただし保存時は長辺を最大3,000pxに縮小して処理します。書類の文字を読むには十分な解像度ですが、原寸が必要な場合は別のツールをお使いください。',
    },
    {
      question: 'スキャン結果をPDFにするには？',
      answer:
        '保存したPNG/JPEGを、画像からPDFへ変換するツールに読み込むと、書類のPDFを作れます。',
    },
  ],
  en: [
    {
      question: 'Is my photo uploaded anywhere?',
      answer:
        'No. All processing happens in your browser with Canvas, and the image is never sent to a server, so photos of contracts or IDs stay on your device.',
    },
    {
      question: 'Shadows remain or the paper looks gray. What can I do?',
      answer:
        'Raise "Shadow / uneven light removal" and nudge "Paper whiteness / text darkness" up. The paper color can only be estimated well when paper fills most of the photo, so cropping to the document first gives cleaner results.',
    },
    {
      question: 'Text looks broken in black & white mode. How do I fix it?',
      answer:
        'Turn off the automatic threshold and raise the threshold so fainter text stays black. If that is not enough, save as grayscale instead.',
    },
    {
      question: 'Can it handle large photos?',
      answer:
        'It accepts files up to about 40 megapixels and 25 MB. When saving, the long edge is scaled down to at most 3,000 px, which is plenty to read document text. Use a different tool if you need the original size.',
    },
    {
      question: 'How do I turn the result into a PDF?',
      answer:
        'Save the PNG or JPEG and load it into an image-to-PDF converter to build a PDF of your document.',
    },
  ],
};
