import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        '画像を正方形にするとき、切り抜かれたり引き伸ばされたりしますか？',
      answer:
        'いいえ。元の画像は拡大・縮小も切り抜きもされず、短い辺の側に余白が足されて中央に置かれます。「縦横比」で「1:1（正方形）」を選ぶだけで、SNSのアイコンや投稿用の正方形画像になります。',
    },
    {
      question: '余白を透明にして保存できますか？',
      answer:
        '「背景を透明にする」にチェックし、保存形式を「PNG」または「WebP」にすると、余白が透明のまま保存されます。JPEGは透明を扱えないため、透明部分は白で保存されます。',
    },
    {
      question: '余白のpx指定と縦横比は、どちらが先に反映されますか？',
      answer:
        '先に「追加する余白（px・四方）」を上下左右に足し、そのあとで選んだ縦横比になるよう短い辺側へ余白が加わります。余白だけを足したいときは、縦横比を「比率を指定しない（余白のみ）」にしてください。',
    },
    {
      question: '1:1や4:5以外の縦横比にも合わせられますか？',
      answer:
        '「縦横比」で「自由に指定」を選ぶと、「比率の幅」と「比率の高さ」に好きな値を入力できます。たとえば21:9や2:3にも対応できます。',
    },
    {
      question: '画像はサーバーにアップロードされますか？',
      answer:
        'されません。余白の追加と書き出しはすべてブラウザ内で行われ、画像が外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'Will my image be cropped or stretched when I make it square?',
      answer:
        'No. The original is neither scaled nor cropped. Margins are added along the shorter side and the image is placed in the center. Just choose "1:1 (square)" under "Aspect ratio" to get a square image for social profiles or posts.',
    },
    {
      question: 'Can I save the margins as transparent?',
      answer:
        'Tick "Transparent background" and save as "PNG" or "WebP" to keep the margins transparent. JPEG cannot hold transparency, so transparent areas are saved as white.',
    },
    {
      question: 'Is the pixel margin applied before or after the aspect ratio?',
      answer:
        'The "Margin to add (px, all sides)" is added to every side first, and then extra margin is added along the shorter side to reach the chosen ratio. To add margins only, set the aspect ratio to "No ratio (margins only)".',
    },
    {
      question: 'Can I use a ratio other than 1:1 or 4:5?',
      answer:
        'Choose "Custom" under "Aspect ratio" and type any values into "Ratio width" and "Ratio height". Ratios such as 21:9 or 2:3 work as well.',
    },
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. Adding margins and exporting all happen in your browser, and the image is never sent anywhere.',
    },
  ],
};
