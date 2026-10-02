import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'カメラの映像や読み取った内容は送信・保存されますか？',
      answer:
        'いいえ。映像・画像の解析はすべてブラウザ内で行われ、サーバーには送信されず、保存もされません。読み取り履歴もページを閉じると消えます。',
    },
    {
      question: 'カメラが使えないときは読み取れませんか？',
      answer:
        'QRコードを含む画像ファイル（写真やスクリーンショット）を選択、またはドラッグ＆ドロップすれば読み取れます。カメラが使えない場合は、ブラウザのサイト設定でカメラが許可されているかも確認してください。',
    },
    {
      question: 'バーコード（JANコードなど）も読み取れますか？',
      answer:
        'ブラウザがバーコード検出（BarcodeDetector）に対応している場合のみ、JANなどの一般的なバーコードも読み取れます。非対応のブラウザではQRコードのみの読み取りになります。',
    },
    {
      question: '読み取ったURLを安全に開くには？',
      answer:
        '自動では開かないので、表示されたURLのドメインが想定どおりか確認してから「リンクを開く」を押してください。見覚えのないQRコードや、貼り直されたシールのQRコードには注意が必要です。',
    },
  ],
  en: [
    {
      question: 'Is my camera feed or the scanned content uploaded or stored?',
      answer:
        'No. Decoding happens entirely in your browser; nothing is uploaded or saved. The scan history disappears when you close the page.',
    },
    {
      question: 'Can I scan without a camera?',
      answer:
        'Yes. Choose or drag & drop an image file (a photo or screenshot) that contains a QR code. If the camera does not work, also check that camera access is allowed in the browser site settings.',
    },
    {
      question: 'Can it read barcodes such as EAN/UPC too?',
      answer:
        'Only in browsers that support the BarcodeDetector API, which can read common barcodes. Other browsers read QR codes only.',
    },
    {
      question: 'How do I open a scanned URL safely?',
      answer:
        'Links are never opened automatically. Check that the domain is what you expect before pressing "Open link", and be careful with unfamiliar codes or stickers pasted over an original code.',
    },
  ],
};
