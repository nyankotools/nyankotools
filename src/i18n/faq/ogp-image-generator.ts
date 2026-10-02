import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'OGP画像の推奨サイズはいくつですか？',
      answer:
        '一般的には1200×630px（約1.91:1）が推奨です。Facebookやほとんどのサービスでこの比率が使われます。Xで大きなカードとして表示したい場合は16:9に近い1200×675pxも選べます。',
    },
    {
      question: '作った画像をOGP画像として設定するにはどうしますか？',
      answer:
        'ダウンロードしたPNGをサイトにアップロードし、そのURLを og:image のメタタグに指定します。メタタグの作成にはメタタグ生成ツールが使えます。',
    },
    {
      question: 'タイトルが長いとどうなりますか？',
      answer:
        '枠に収まるまで文字サイズを自動で小さくし、折り返して表示します。最小サイズでも収まらない場合は、末尾を「…」で省略します。',
    },
    {
      question: '画像に使える文字やフォントに制限はありますか？',
      answer:
        'お使いの端末にあるゴシック体・明朝体で描画します。Webフォントは読み込まないため、端末によって字形が少し変わります。絵文字は端末の絵文字フォントで表示されます。',
    },
  ],
  en: [
    {
      question: 'What is the recommended OGP image size?',
      answer:
        '1200×630 px (about 1.91:1) is the common recommendation and is used by Facebook and most other services. For a large card on X, you can also pick 1200×675 px, which is closer to 16:9.',
    },
    {
      question: 'How do I set the generated image as my OGP image?',
      answer:
        'Upload the downloaded PNG to your site and set its URL in the og:image meta tag. The Meta Tag Generator can help you write the tags.',
    },
    {
      question: 'What happens when the title is long?',
      answer:
        'The font size is reduced automatically and the text wraps until it fits. If it still does not fit at the smallest size, the end is cut off with an ellipsis.',
    },
    {
      question: 'Are there limits on the fonts or characters I can use?',
      answer:
        'Text is drawn with the sans-serif or serif fonts on your device. Web fonts are not loaded, so glyph shapes vary slightly between devices, and emoji use your device emoji font.',
    },
  ],
};
