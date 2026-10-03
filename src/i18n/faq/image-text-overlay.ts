import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '画像全体に薄く透かしを入れるにはどうすればよいですか？',
      answer:
        '「位置」で「全体に敷き詰める（透かし）」を選び、「不透明度」を30〜50%ほどに下げ、「角度」を-30度前後にすると、斜めに並ぶ一般的な透かしになります。文字の間隔は「敷き詰めの間隔」で調整できます。',
    },
    {
      question: '文字が背景と同化して読みにくいときはどうすればよいですか？',
      answer:
        '「縁取りの色」と「縁取りの太さ」を使うと、文字の輪郭に線が入って読みやすくなります。白い文字には黒の縁取り、黒い文字には白の縁取りを組み合わせるのが定番です。「文字色」を変えたり、不透明度を上げたりするのも有効です。',
    },
    {
      question: '日本語の文字や改行は使えますか？',
      answer:
        '使えます。「入れる文字」には日本語や絵文字も入力でき、改行すると複数行になります。書体は、お使いの端末に入っているゴシック体・明朝体・等幅フォントから選ばれるため、端末によって見た目が少し異なります。',
    },
    {
      question: '文字を入れた画像の画質は劣化しますか？',
      answer:
        'PNGで保存すれば、元の画像のピクセルはそのまま保存されます。JPEGやWebPは圧縮を伴うため、「画質」を下げるほどファイルは小さくなりますが画質も落ちます。画像の大きさは変わりません。',
    },
    {
      question: '文字を入れた画像はサーバーに送られますか？',
      answer:
        'いいえ。読み込みから文字の描画・保存まで、すべてお使いのブラウザの中で処理されます。画像や入力した文字がサーバーにアップロードされることはありません。',
    },
  ],
  en: [
    {
      question: 'How do I add a faint watermark across the whole image?',
      answer:
        'Choose "Tile across the image (watermark)" under "Position", lower "Opacity" to about 30–50%, and set "Angle" to around -30 degrees. That gives the usual diagonal watermark. Use "Tile spacing" to adjust how far apart the words are.',
    },
    {
      question: 'What if the text blends into the background?',
      answer:
        'Use "Outline color" and "Outline width" to draw a line around the letters. Black outlines on white text, or white outlines on black text, are the usual pairing. Changing "Text color" or raising "Opacity" also helps.',
    },
    {
      question: 'Can I use Japanese characters and line breaks?',
      answer:
        'Yes. "Text" accepts Japanese and emoji, and a line break starts a new line. Fonts come from the sans-serif, serif, and monospace fonts installed on your device, so the look varies a little between devices.',
    },
    {
      question: 'Does adding text reduce image quality?',
      answer:
        'With PNG, the pixels of your original image are kept as they are. JPEG and WebP use compression, so a lower "Quality" gives a smaller file but a rougher image. The image dimensions do not change.',
    },
    {
      question: 'Is my image or text sent to a server?',
      answer:
        'No. Loading, drawing the text, and saving all happen inside your browser. Neither your image nor the text you type is uploaded.',
    },
  ],
};
