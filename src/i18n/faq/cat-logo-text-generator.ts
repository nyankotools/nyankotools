import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '作成したロゴは商用利用できますか？',
      answer:
        '文字は丸ゴシック体のM PLUS Rounded 1cで描画しており、このフォントはSIL Open Font License 1.1で配布されているため、ロゴ画像への利用は商用でも可能です。装飾を含む作成物の扱いはご自身の責任でご判断ください。',
    },
    {
      question: '背景が透明なPNGはどう使えばよいですか？',
      answer:
        'ダウンロードしたPNGは背景が透明なので、色付きの背景や写真の上にそのまま重ねられます。画面のプレビュー背景は確認用で、書き出した画像には含まれません。',
    },
    {
      question: '猫耳やひげの位置は変えられますか？',
      answer:
        'はい。猫耳・ひげ・肉球・ハートなどの装飾は好きな位置へ配置できます。文字の大きさに合わせて位置を調整し、プレビューで確認しながら仕上げてください。',
    },
  ],
  en: [
    {
      question: 'Can I use the logos I create commercially?',
      answer:
        'The lettering is rendered in the rounded font M PLUS Rounded 1c, which is distributed under the SIL Open Font License 1.1, so using the resulting logo images commercially is allowed. You remain responsible for how you use the finished artwork.',
    },
    {
      question: 'How do I use the PNG with a transparent background?',
      answer:
        'The downloaded PNG has a transparent background, so you can place it directly over colored backgrounds or photos. The preview background is only for checking and is not included in the file.',
    },
    {
      question: 'Can I move the cat ears and whiskers?',
      answer:
        'Yes. Decorations such as ears, whiskers, paw prints and hearts can be placed wherever you like. Adjust them to fit the text size while checking the preview.',
    },
  ],
};
