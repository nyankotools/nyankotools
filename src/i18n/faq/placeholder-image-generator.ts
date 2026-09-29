import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '作成できる画像のサイズに上限はありますか？',
      answer:
        '幅・高さともに最大4096pxまで指定できます。それを超えるサイズや極端に大きなサイズはブラウザの負荷が大きいため対応していません。',
    },
    {
      question: 'ダミー画像はどんな場面で使いますか？',
      answer:
        'デザインの試作やレイアウト確認、コードのテスト、ドキュメントのサンプルなど、本物の画像が用意できていない場面で使います。',
    },
    {
      question: '作成した画像の背景色や文字色は変えられますか？',
      answer:
        'はい。背景色と文字色は #RGB または #RRGGBB 形式で指定でき、文字も自由に変えられます。空欄なら「幅×高さ」が表示されます。PNG・JPEG・WebPでダウンロードできます。',
    },
  ],
  en: [
    {
      question: 'Is there a maximum image size?',
      answer:
        'Width and height can be up to 4096 px each. Larger sizes are not supported because they strain the browser.',
    },
    {
      question: 'What is a placeholder image used for?',
      answer:
        'It stands in for real images during design mockups, layout checks, code testing and documentation samples.',
    },
    {
      question: 'Can I change the background and text colors?',
      answer:
        'Yes. Set the background and text colors in #RGB or #RRGGBB format and change the text; if left empty, the label shows width × height. Download as PNG, JPEG or WebP.',
    },
  ],
};
