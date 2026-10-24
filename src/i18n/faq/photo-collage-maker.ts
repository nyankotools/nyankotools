import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '何枚までの写真でコラージュを作れますか？',
      answer:
        '2〜9枚です。枚数に合わせて、横並び・縦並び・グリッド・左を大きく・上を大きく、といったテンプレートが自動で用意されます。写真を追加・削除すると、選べるテンプレートも変わります。',
    },
    {
      question: '枠の中の写真の見せたい位置を変えるには？',
      answer:
        'プレビューの枠の上でドラッグすると、写真が動きます。写真の一覧の「調整」ボタンで選んで、「拡大」「横の位置」「縦の位置」のスライダーで動かすこともできます。スマートフォンでも指でなぞって動かせます。',
    },
    {
      question: '写真の縦横比が枠と合わないときはどうなりますか？',
      answer:
        '写真は枠いっぱいに敷き詰められ、はみ出した部分は切り取られます（全体が収まるように縮小して余白を作ることはしません）。見せたい部分が切れるときは、ドラッグで位置を動かすか、テンプレートや縦横比を変えてください。',
    },
    {
      question: '角丸や枠線を付けて保存できますか？',
      answer:
        '「角丸（px）」「枠線の太さ（px）」「枠線の色」で指定できます。JPEGは透明を扱えないため、角丸の四隅は背景色で塗られます。',
    },
    {
      question: '選んだ写真はサーバーに送られますか？',
      answer:
        'いいえ。読み込みから配置・書き出しまで、すべてお使いのブラウザの中で処理されます。写真がアップロードされることはありません。',
    },
  ],
  en: [
    {
      question: 'How many photos can I use in a collage?',
      answer:
        'From 2 to 9. Templates such as row, column, grid, large left, and large top are generated to match the number of photos, so the choices change as you add or remove photos.',
    },
    {
      question: 'How do I change which part of a photo shows in its frame?',
      answer:
        'Drag inside a frame in the preview and the photo moves. You can also press "Adjust" in the photo list and use the "Zoom", "Horizontal position", and "Vertical position" sliders. Dragging with a finger works on phones too.',
    },
    {
      question: 'What if a photo has a different shape from its frame?',
      answer:
        'Each photo fills its frame and the overflow is cropped; it is not shrunk to fit with empty bars. If an important part gets cut off, drag the photo to reposition it, or try another template or aspect ratio.',
    },
    {
      question: 'Can I add rounded corners and borders?',
      answer:
        'Yes, with "Corner radius (px)", "Border width (px)", and "Border color". JPEG cannot hold transparency, so the area outside rounded corners is filled with the background color.',
    },
    {
      question: 'Are my photos sent to a server?',
      answer:
        'No. Loading, arranging, and exporting all happen inside your browser. Your photos are never uploaded.',
    },
  ],
};
