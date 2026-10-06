import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'この加工でOCRによる読み取りを確実に防げますか？',
      answer:
        '確実に防ぐことはできません。OCRエンジンや生成AIの画像認識は進化しており、加工後の文字が読み取られる可能性があります。パスワードや個人情報などは、そもそも画像に含めないようにしてください。',
    },
    {
      question: '強度はどのくらいに設定すればよいですか？',
      answer:
        'まずは「標準」から試し、加工後のプレビューを拡大して人の目で読めるか確認してください。強度を上げるほどOCRには読みにくくなる傾向がありますが、人にとっても読みづらくなります。',
    },
    {
      question:
        'ノイズや歪みを加えると、スクリーンリーダーの利用者には影響しますか？',
      answer:
        '画像の文字は、スクリーンリーダーでは代替テキストで伝わり、拡大表示で読む方にはノイズが読みづらさにつながることがあります。重要な内容は代替テキストなど別の手段でも伝えることをおすすめします。',
    },
    {
      question: '出力がPNGのみなのはなぜですか？',
      answer:
        'JPEGやWebPの非可逆圧縮は、加えたノイズや細線をなめらかにして加工の効果を弱めることがあるため、可逆圧縮のPNGで保存します。ノイズを含むため、元の画像よりファイルサイズが大きくなる場合があります。',
    },
  ],
  en: [
    {
      question: 'Does this reliably stop OCR from reading my text?',
      answer:
        'No. OCR engines and AI image recognition keep improving, and processed text may still be read. Keep passwords, personal data, and similar information out of images in the first place.',
    },
    {
      question: 'What strength should I use?',
      answer:
        'Start with "Standard", zoom in on the processed preview, and check that it is still readable to the eye. Higher strength tends to make text harder for OCR to read, but also harder for people.',
    },
    {
      question: 'Does adding noise and distortion affect screen reader users?',
      answer:
        'Text in images reaches screen reader users through alt text, and people who read with magnification may find noisy text harder to read. For important content, also provide it another way, such as alt text.',
    },
    {
      question: 'Why is the output PNG only?',
      answer:
        'Lossy compression in JPEG or WebP can smooth out the added noise and lines and weaken the effect, so the result is saved as lossless PNG. Because of the noise, the file may be larger than the original.',
    },
  ],
};
