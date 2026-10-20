import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        'スクリーンショットをスマホの枠に入れるには、どうすればいいですか？',
      answer:
        '画像を読み込み、「デバイス」で「スマートフォン」を選ぶだけです。画面の縦横比に合わせて画像が中央で切り抜かれ、枠にはめ込まれます。「モックアップをPNGでダウンロード」で保存できます。',
    },
    {
      question: '画像の端が切れてしまいます。全体を表示するには？',
      answer:
        '「画像のはめ込み」を「全体を収める（余白は黒）」に変えると、切り抜かずに画面内へ収まります。画面と画像の縦横比が違うときは、上下または左右に黒い余白が出ます。',
    },
    {
      question: '背景を透明にして、スライドなどに重ねられますか？',
      answer:
        '「背景を透明にする」にチェックすると、枠の外側が透明なPNGで保存できます。影を付けた場合は、影の部分だけが半透明で残ります。',
    },
    {
      question: '特定メーカーのスマホそっくりの枠は使えますか？',
      answer:
        'いいえ。枠は特定の製品を再現しない、このツール独自の汎用デザインです。ノッチやカメラ位置も簡略化しています。商標への配慮から、実機の外観を再現することは目指していません。',
    },
    {
      question: '画像はサーバーにアップロードされますか？',
      answer:
        'されません。枠への合成とPNGの書き出しはすべてブラウザ内で行われ、画像が外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'How do I put a screenshot into a phone frame?',
      answer:
        'Load the image and pick "Phone" under "Device". The image is center-cropped to the screen’s aspect ratio and placed into the frame. Click the PNG download button to save it.',
    },
    {
      question:
        'The edges of my screenshot are cut off. How do I show all of it?',
      answer:
        'Change "Image fit" to "Fit inside (black bars)". The whole image is placed on the screen without cropping, and black bars appear on the top and bottom or the sides when the aspect ratios differ.',
    },
    {
      question: 'Can I get a transparent background for slides?',
      answer:
        'Tick "Transparent background" and the area outside the frame is saved as transparent PNG. If you add a shadow, only the shadow stays semi-transparent.',
    },
    {
      question:
        'Can I use a frame that looks exactly like a specific brand’s phone?',
      answer:
        'No. The frames are original generic shapes, and the notch and camera are simplified. The tool deliberately avoids reproducing any real product’s look out of respect for trademarks.',
    },
    {
      question: 'Is my screenshot uploaded to a server?',
      answer:
        'No. Compositing and PNG export all happen in your browser, and the image is never sent anywhere.',
    },
  ],
};
