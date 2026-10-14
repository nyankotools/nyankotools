import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '円形に切り抜いた画像の背景は透明になりますか？',
      answer:
        'はい。PNGまたはWebPで保存すると、円の外側は透明になります。JPEGは透明を扱えないため、このツールでは選べません。',
    },
    {
      question: '切り抜く位置はどう決めますか？',
      answer:
        '「正方形に切り抜く」では、画像上をクリック・ドラッグするとその位置が中心になります。「切り抜きの大きさ（px）」で範囲を広げ縮めでき、「左端 X」「上端 Y」で数値指定もできます。「中央に戻す」で初期状態に戻ります。',
    },
    {
      question: '角丸の丸みはどのくらい変えられますか？',
      answer:
        '「角の丸み（%）」で0〜100を指定できます。0は角がそのままの四角形、100は短辺の半分の半径になり、正方形なら円と同じ形です。',
    },
    {
      question: '縦長・横長の画像を円形にすると楕円になりますか？',
      answer:
        '「元の縦横比のまま」を選ぶと画像全体が対象になり、円形は楕円になります。真円にしたいときは「正方形に切り抜く」を選んでください。',
    },
    {
      question: '画像はサーバーにアップロードされますか？',
      answer:
        'されません。切り抜きと書き出しはすべてブラウザ内で行われ、画像が外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'Is the background transparent after a circular crop?',
      answer:
        'Yes. Saved as PNG or WebP, everything outside the circle is transparent. JPEG cannot hold transparency, so it is not offered here.',
    },
    {
      question: 'How do I choose the crop position?',
      answer:
        'With "Square crop", click or drag on the image to center the crop there. Use "Crop size (px)" to widen or narrow it, or type "Left X" and "Top Y". "Recenter" resets it.',
    },
    {
      question: 'How round can the corners be?',
      answer:
        '"Corner roundness (%)" accepts 0 to 100. 0 keeps sharp corners, and 100 uses a radius of half the shorter side, which makes a square look like a circle.',
    },
    {
      question: 'Does a tall or wide image become an ellipse?',
      answer:
        'If you choose "Keep original ratio", the whole image is used and "Circle" becomes an ellipse. For a true circle, choose "Square crop".',
    },
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. Cropping and exporting happen entirely in your browser, and the image is never sent anywhere.',
    },
  ],
};
