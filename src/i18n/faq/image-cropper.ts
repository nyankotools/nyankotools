import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '切り抜く範囲を指定するにはどうすればよいですか？',
      answer:
        'プレビュー上でドラッグすると、始点から終点までが切り抜く範囲になります。数値で正確に指定したいときは、「左端 X」「上端 Y」「幅」「高さ」の欄に入力してください。「全体を選択」で画像全体に戻せます。',
    },
    {
      question: '1:1や16:9など、縦横比を固定して切り抜けますか？',
      answer:
        'できます。「縦横比」で比率を選ぶと、ドラッグや幅・高さの入力が、その比率を保ったまま範囲に反映されます。SNSのアイコン（1:1）や動画のサムネイル（16:9）を作るときに便利です。',
    },
    {
      question: '回転や反転をしてから切り抜けますか？',
      answer:
        '回転・反転は、プレビューに表示されている向きの画像に対して適用され、そのあとに切り抜く範囲を決めます。回転するたびに範囲は画像全体にリセットされるため、向きを整えてから範囲を選ぶ順番がおすすめです。',
    },
    {
      question: '切り抜いた画像の画質は劣化しますか？',
      answer:
        'PNGで保存すれば、切り抜いた範囲のピクセルはそのまま保存されます。JPEGやWebPは圧縮を伴うため、「画質」を下げるほどファイルは小さくなりますが画質も落ちます。',
    },
    {
      question: '画像はサーバーにアップロードされますか？',
      answer:
        'されません。切り抜き・回転・書き出しはすべてブラウザ内で行われ、画像が外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'How do I set the crop area?',
      answer:
        'Drag on the preview and the area from the start point to the end point becomes the crop. For exact values, type them into "Left X", "Top Y", "Width", and "Height". "Select all" returns to the whole image.',
    },
    {
      question: 'Can I crop at a fixed ratio such as 1:1 or 16:9?',
      answer:
        'Yes. Pick a ratio under "Aspect ratio" and both dragging and the width and height fields keep that shape. It is handy for profile pictures (1:1) and video thumbnails (16:9).',
    },
    {
      question: 'Can I rotate or flip before cropping?',
      answer:
        'Rotation and flipping are applied to the image as shown in the preview, and then you choose the crop area. Each rotation resets the area to the whole image, so fix the orientation first and select the area afterward.',
    },
    {
      question: 'Does cropping reduce image quality?',
      answer:
        'Saving as PNG keeps the pixels of the cropped area exactly. JPEG and WebP use compression, so a lower "Quality" gives a smaller file but a less accurate image.',
    },
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. Cropping, rotating, and exporting all happen in your browser, and the image is never sent anywhere.',
    },
  ],
};
