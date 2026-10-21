import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '図形の部分だけ元の画像を見せるにはどうすればよいですか？',
      answer:
        '画像を読み込んだ後に「図形を追加」を押すと、覆いの中に図形の形の窓があき、その部分だけ元の画像が見えます。図形はドラッグで移動し、角のハンドルで大きさ、上の丸いハンドルで角度を変えられます。',
    },
    {
      question: '図形の外側を見せて内側を覆う（反転）こともできますか？',
      answer:
        'はい。「反転する」にチェックを入れると、図形の内側が覆われ、外側が元の画像のまま見えます。人物や文字の一部だけを隠したいときにも使えます。',
    },
    {
      question: '覆いを半透明にして元の画像を薄く見せられますか？',
      answer:
        '「覆いの濃さ」を100%未満にすると、覆った部分から元の画像が透けて見えます。内容を完全に隠したいときは100%にしてください。',
    },
    {
      question: 'スマホで図形を動かすとページがスクロールしてしまいます。',
      answer:
        '画面幅が狭いときは、画像の上の操作を「図形を操作」と「スクロール」で切り替えます。図形を動かしたいときは「図形を操作」にしてください。',
    },
    {
      question: '大きな写真でも使えますか？',
      answer:
        '25MBまでのPNG・JPEG・WebP・GIF・BMPを読み込めます。長辺が4096pxを超える画像は、編集と書き出しのため4096pxに縮小されます。',
    },
  ],
  en: [
    {
      question: 'How do I show only part of the original image?',
      answer:
        'After loading an image, press "Add shape". A window in the shape of your choice opens in the cover and shows the original image through it. Drag the shape to move it, use the corner handles to resize and the round handle on top to rotate.',
    },
    {
      question: 'Can I show the outside of the shapes and cover the inside?',
      answer:
        'Yes. Turn on "Invert" and the inside of each shape is covered while the outside stays as the original image. It also works for hiding just one part of a picture.',
    },
    {
      question: 'Can the cover be semi-transparent?',
      answer:
        'Lower the "Cover opacity" below 100% and the original image shows faintly through the covered area. Use 100% to hide it completely.',
    },
    {
      question: 'The page scrolls when I try to move a shape on my phone.',
      answer:
        'On narrow screens, touch on the image switches between "Edit shapes" and "Scroll". Choose "Edit shapes" when you want to move a shape.',
    },
    {
      question: 'Does it work with large photos?',
      answer:
        'It opens PNG, JPEG, WebP, GIF and BMP files up to 25 MB. Images whose longer side exceeds 4096px are scaled down to 4096px for editing and export.',
    },
  ],
};
