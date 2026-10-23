import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ロゴの背景を透明にして重ねるにはどうすればよいですか？',
      answer:
        '背景が透明なPNG（透過PNG）のロゴを「ロゴ画像」に選んでください。透過部分はそのまま透けて、ロゴの形だけが重なります。JPEGなど透過のない画像を選ぶと、四角い背景ごと重なります。',
    },
    {
      question: '画像全体に薄くロゴを並べるにはどうすればよいですか？',
      answer:
        '「位置」で「全体に敷き詰める（透かし）」を選び、「不透明度」を30〜50%ほどに下げ、「サイズ（ベース画像の幅に対する割合）」を小さめにします。「角度（度）」を-30度前後にすると、斜めに並ぶ一般的な透かしになります。',
    },
    {
      question: 'ロゴのサイズは何を基準に決まりますか？',
      answer:
        'ベース画像の幅に対する割合で決まり、ロゴの縦横比は変わりません。たとえば20%なら、幅1000pxの画像でロゴの幅は200pxになります。ベース画像の大きさが変わっても、同じ見た目の割合で入ります。',
    },
    {
      question: '文字の透かしを入れたいときも使えますか？',
      answer:
        'このツールはロゴなどの画像を重ねる専用です。文字を入れたい場合は「画像への文字入れ・透かし」ツールを使ってください。文字をロゴ画像にしてからここで合成することもできます。',
    },
    {
      question: '画像やロゴはサーバーに送られますか？',
      answer:
        'いいえ。読み込みから合成・保存まで、すべてお使いのブラウザの中で処理されます。ベース画像もロゴ画像もアップロードされることはありません。',
    },
  ],
  en: [
    {
      question: 'How do I overlay a logo with a transparent background?',
      answer:
        'Choose a transparent PNG as the "Logo image". The see-through areas stay see-through and only the logo shape is laid over the photo. An image without transparency, such as a JPEG, is placed with its whole rectangle.',
    },
    {
      question: 'How do I repeat a faint logo over the whole image?',
      answer:
        'Choose "Tile across the image (watermark)" under "Position", lower "Opacity" to about 30–50%, and keep the size small. Setting the angle to around -30 degrees gives the usual diagonal watermark pattern.',
    },
    {
      question: 'What is the logo size based on?',
      answer:
        'It is a percentage of the base image width, and the logo keeps its aspect ratio. At 20%, a 1000 px wide image gets a logo 200 px wide. The logo stays in proportion even if you use a different base image size.',
    },
    {
      question: 'Can I use it for a text watermark?',
      answer:
        'This tool is for image logos only. To add words, use the text overlay tool ("Add Text or Watermark to Image"). You can also turn your text into a logo image first and combine it here.',
    },
    {
      question: 'Are my image and logo sent to a server?',
      answer:
        'No. Loading, combining, and saving all happen inside your browser. Neither the base image nor the logo is uploaded.',
    },
  ],
};
