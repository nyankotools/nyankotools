import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '背景が白いJPEGに縁取りを付けるとどうなりますか？',
      answer:
        'JPEGには透明な部分がないため、画像全体が1つの四角形として扱われ、四角い枠に沿って縁取りが付きます。被写体の形に沿わせたいときは、先に「画像の背景透過」で背景を透明にした透過PNGを用意してください。',
    },
    {
      question: '縁取りの角は丸くなりますか？',
      answer:
        'はい。円形のカーネルで広げる方式（距離変換）なので、角は丸く、太さはどの方向でもほぼ同じになります。細い突起や角も、太さを大きくするほど丸みを帯びた形にまとまります。',
    },
    {
      question: 'ドーナツ状の穴やアルファベットの内側が透明のままです。',
      answer:
        '縁取りの太さが穴の大きさより小さいと、内側は透明のまま残ります。「内側の穴を埋める」をオンにすると、画像の端につながっていない透明部分が縁取りの色で塗りつぶされます。',
    },
    {
      question: '大きな画像でも処理できますか？',
      answer:
        '長辺が2000pxを超える画像は、縦横比を保ったまま長辺2000pxに縮小してから処理します。縁取りの太さはその縮小後のピクセルで指定します。高解像度のまま使いたいときは、事前に必要なサイズへ調整してください。',
    },
    {
      question: '画像はサーバーにアップロードされますか？',
      answer:
        'されません。縁取りの計算から保存までブラウザ内で行われ、画像が外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question:
        'What happens if I add an outline to a JPEG with a white background?',
      answer:
        'A JPEG has no transparent area, so the whole picture counts as one rectangle and the outline follows its rectangular edge. To follow the subject instead, first make the background transparent with the Image Background Remover and use the resulting PNG.',
    },
    {
      question: 'Are the outline corners rounded?',
      answer:
        'Yes. The outline is grown with a circular kernel (a distance transform), so corners come out rounded and the thickness is the same in every direction. The larger the width, the more thin spikes and sharp corners are smoothed into a round shape.',
    },
    {
      question: 'The inside of a ring or a letter stays transparent.',
      answer:
        'If the outline width is smaller than the hole, the inside stays transparent. Turn on "Fill inner holes" to paint every transparent area that does not touch the image border with the outline color.',
    },
    {
      question: 'Can it handle large images?',
      answer:
        'Images with a long side over 2000 px are scaled down to 2000 px, keeping the aspect ratio, before processing, and the outline width is measured in pixels of the scaled image. If you need a high-resolution result, resize the image to the size you need beforehand.',
    },
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. Everything from the outline calculation to saving the file happens in your browser, and the image is never sent anywhere.',
    },
  ],
};
