import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '書いた署名をPDFや書類に貼り付けるにはどうすればよいですか？',
      answer:
        '書き出した透過PNGを、WordやGoogleドキュメント、PDFエディタなどの「画像の挿入」で貼り付けてください。背景が透明なので、書類の上に重ねても署名の線だけが表示されます。サイズは貼り付け先で調整できます。',
    },
    {
      question: '背景が白や黒に見えてしまうのはなぜですか？',
      answer:
        '書き出した画像の背景は透明です。画像ビューアやプレビューによっては、透明部分を黒や白で表示するため、そう見えることがあります。書類に貼り付ければ透明のまま重なります。',
    },
    {
      question: 'スマホで書くとページがスクロールしてしまいませんか？',
      answer:
        '署名の枠の中では、指でなぞってもページはスクロールしないようにしています。枠の外をなぞるとスクロールできます。細かく書きたいときは、スマホを横向きにすると枠が広くなります。',
    },
    {
      question: '拡大してもきれいな署名画像にするにはどうすればよいですか？',
      answer:
        '「出力の倍率」を2倍または3倍にして保存してください。ペンの太さは「ペンの太さ」で調整できます。倍率を上げるほど画素数が増えますが、ファイルサイズも大きくなります。',
    },
    {
      question: '書いた署名はサーバーに送られますか？',
      answer:
        'いいえ。署名の描画から画像の書き出しまで、すべてお使いのブラウザの中で処理されます。署名のデータがサーバーにアップロードされることはありません。',
    },
  ],
  en: [
    {
      question: 'How do I put my signature on a PDF or document?',
      answer:
        'Insert the exported transparent PNG with "Insert image" in Word, Google Docs, or a PDF editor. Because the background is transparent, only the pen strokes show over the document. You can resize it where you paste it.',
    },
    {
      question: 'Why does the background look white or black?',
      answer:
        'The exported image has a transparent background. Some image viewers and previews paint transparent areas black or white, which makes it look filled. Once pasted into a document, it stays transparent.',
    },
    {
      question: 'Will the page scroll while I sign on my phone?',
      answer:
        'Inside the signature box, dragging with your finger draws instead of scrolling the page. Touch outside the box to scroll. For finer detail, turn your phone sideways to get a wider box.',
    },
    {
      question: 'How can I keep the signature sharp when enlarged?',
      answer:
        'Save with "Output scale" set to 2x or 3x. You can also set "Pen width" to taste. A higher scale adds pixels but also makes the file larger.',
    },
    {
      question: 'Is my signature sent to a server?',
      answer:
        'No. Drawing and exporting the image both happen inside your browser. Your signature is never uploaded.',
    },
  ],
};
