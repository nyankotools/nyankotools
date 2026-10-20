import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '写真をポラロイド風にするには、どうすればいいですか？',
      answer:
        '画像を読み込み、「枠のスタイル」で「ポラロイド風」を選ぶだけです。上と左右が細く下側だけが広い白い枠が付きます。「枠の太さ」や「枠の色」で、白以外の枠にも変えられます。',
    },
    {
      question: '枠を付けると画像が縮小されたり切り抜かれたりしますか？',
      answer:
        'いいえ。枠は元画像の外側に足されるので、出力は元画像より大きくなります。画像の中身は拡大・縮小も切り抜きもされません。大きさをそろえたいときは、先に別のツールでリサイズしてください。',
    },
    {
      question: '角丸の外側を透明にして保存できますか？',
      answer:
        '「角丸」を調整し、保存形式を「PNG」または「WebP」にすると、角の外側が透明のまま保存されます。JPEGは透明を扱えないため、その部分は白で保存されます。',
    },
    {
      question: '影付きの影の色や向きは変えられますか？',
      answer:
        '影の色は「補助色」で変えられます。影は画像の少し下側に落ちる向きで固定です。外側を透明にしたいときは「背景を透明にする」にチェックし、PNGかWebPで保存してください。',
    },
    {
      question: '画像はサーバーにアップロードされますか？',
      answer:
        'されません。枠の描画と書き出しはすべてブラウザ内で行われ、画像が外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'How do I make a photo look like a Polaroid?',
      answer:
        'Load the image and pick "Polaroid" under "Frame style". You get a white frame that is thin on the top and sides and wider at the bottom. Use "Frame thickness" and "Frame color" to change the width or use a color other than white.',
    },
    {
      question: 'Is my image scaled or cropped when a frame is added?',
      answer:
        'No. The frame is added outside the original image, so the output is larger than the source. The picture itself is never scaled or cropped. If you need a fixed output size, resize the image with another tool first.',
    },
    {
      question: 'Can I keep the area outside rounded corners transparent?',
      answer:
        'Adjust "Corner radius" and save as "PNG" or "WebP", and the area outside the corners stays transparent. JPEG cannot hold transparency, so that area is saved as white.',
    },
    {
      question: 'Can I change the color or direction of the drop shadow?',
      answer:
        'The shadow color follows the "Accent color". The direction is fixed, with the shadow falling slightly below the image. To make the outside transparent, tick "Transparent background" and save as PNG or WebP.',
    },
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. Drawing the frame and exporting all happen in your browser, and the image is never sent anywhere.',
    },
  ],
};
