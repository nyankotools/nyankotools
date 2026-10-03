import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'コマの順番はどう決まりますか？',
      answer:
        '画像を追加した順に一覧へ並びます。ファイル名の順には自動で並べ替えないため、「↑ 上へ」「↓ 下へ」で再生したい順に整えてください。連番のファイルをまとめて選んだときは、OSやブラウザによって選択の順番が変わることがあるので、一覧で確認すると確実です。',
    },
    {
      question: 'GIFのファイルサイズを小さくするにはどうすればよいですか？',
      answer:
        'いちばん効くのは「GIFの幅」を小さくすることと、コマ数を減らすことです。GIFは1コマごとに画像を保存するため、幅を半分にすると面積は4分の1になります。色数の少ないイラストは、写真よりも小さく仕上がります。',
    },
    {
      question: '写真をGIFにすると色が荒れるのはなぜですか？',
      answer:
        'GIFは1コマで使える色が最大256色と決まっているためです。このツールは、画像ごとに色をまとめて256色以内にしますが、色数の多い写真ではグラデーションが段になって見えることがあります。',
    },
    {
      question: '縦横比の違う画像を混ぜるとどうなりますか？',
      answer:
        'GIFの大きさは、最初のコマの縦横比と指定した幅で決まります。縦横比の違うコマは、その中に収まるよう拡大・縮小して中央に置かれ、余った部分は背景色で塗られます。',
    },
    {
      question: '作成したGIFはサーバーに送られますか？',
      answer:
        'いいえ。読み込みから減色・GIFの書き出しまで、すべてお使いのブラウザの中で処理されます。画像がサーバーにアップロードされることはありません。',
    },
  ],
  en: [
    {
      question: 'How is the frame order decided?',
      answer:
        'Images appear in the list in the order you add them. They are not sorted by file name automatically, so use "↑ Up" and "↓ Down" to set the playback order. When you select a numbered sequence at once, the order can differ by OS and browser, so it is worth checking the list.',
    },
    {
      question: 'How can I make the GIF file smaller?',
      answer:
        'The biggest levers are a smaller "GIF width" and fewer frames. A GIF stores every frame as an image, so halving the width cuts the area to a quarter. Flat illustrations with few colors also come out smaller than photos.',
    },
    {
      question: 'Why do photos look rough as a GIF?',
      answer:
        'A GIF frame can use at most 256 colors. This tool reduces each frame to 256 colors or fewer, but in photos with many colors, gradients can look banded.',
    },
    {
      question: 'What happens if I mix images with different aspect ratios?',
      answer:
        'The GIF size is set by the aspect ratio of the first frame and the width you choose. Frames with a different ratio are scaled to fit inside it and centered, and the leftover space is filled with the background color.',
    },
    {
      question: 'Is my GIF sent to a server?',
      answer:
        'No. Loading, color reduction, and encoding all happen inside your browser. Your images are never uploaded.',
    },
  ],
};
