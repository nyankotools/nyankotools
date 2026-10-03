import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'サイズの違う画像を並べるとどうなりますか？',
      answer:
        '「大きさをそろえる」がオフのときは、画像は元のサイズのまま並び、小さい画像のまわりは背景色で埋まります。オンにすると、横並びでは高さ、縦並びでは幅をそろえて拡大・縮小するため、すき間のない1枚になります。グリッドでは、いちばん大きい画像のサイズを1マスとして、その中に収まるように拡大・縮小します。',
    },
    {
      question: '画像の並び順を変えるにはどうすればよいですか？',
      answer:
        '「結合する画像」の一覧にある「↑ 上へ」「↓ 下へ」で1つずつ入れ替えられます。横並びなら上から順に左から右へ、縦並びなら上から下へ、グリッドなら左から右・上から下の順に並びます。追加した画像は一覧の末尾に入ります。',
    },
    {
      question: '背景を透明にして結合できますか？',
      answer:
        '「背景を透明にする」を選び、保存形式をPNGまたはWebPにすると、間隔や余白の部分が透明になります。JPEGは透明を扱えないため、白で塗りつぶされます。',
    },
    {
      question: '結合できる枚数や大きさに上限はありますか？',
      answer:
        '一度に結合できるのは50枚までで、結合後の画像は1辺16384px・総画素数5,000万までです。大きな写真をたくさん並べると上限を超えることがあるため、その場合は先に画像を縮小するか、「大きさをそろえる」を見直してください。',
    },
    {
      question: '結合した画像はサーバーに送られますか？',
      answer:
        'いいえ。読み込みから結合・保存まで、すべてお使いのブラウザの中で処理されます。画像がサーバーにアップロードされることはありません。',
    },
  ],
  en: [
    {
      question: 'What happens when the images have different sizes?',
      answer:
        'With "Match sizes" off, images keep their original size and the space around smaller ones is filled with the background color. With it on, images are scaled to the same height (side by side) or the same width (stacked), so the result has no gaps. In a grid, the largest image defines the size of one cell and every image is scaled to fit inside it.',
    },
    {
      question: 'How do I change the order of the images?',
      answer:
        'Use "↑ Up" and "↓ Down" in the "Images to merge" list to move one image at a time. Side by side runs left to right, stacked runs top to bottom, and a grid fills left to right, then top to bottom. Newly added images go to the end of the list.',
    },
    {
      question: 'Can I merge images on a transparent background?',
      answer:
        'Yes. Check "Transparent background" and save as PNG or WebP, and the gaps and margins stay transparent. JPEG cannot hold transparency, so those areas are filled with white.',
    },
    {
      question:
        'Is there a limit on how many images or how large the result can be?',
      answer:
        'You can merge up to 50 images at a time, and the result can be up to 16384 px per side and 50 million pixels in total. Many large photos can exceed that; shrink them first or review the "Match sizes" setting.',
    },
    {
      question: 'Are my merged images sent to a server?',
      answer:
        'No. Loading, merging, and saving all happen inside your browser. Your images are never uploaded.',
    },
  ],
};
