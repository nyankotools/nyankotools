import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'これは電子署名（デジタル署名）ですか？',
      answer:
        'いいえ。署名やハンコの画像をページに貼り付けるだけで、電子証明書による本人確認や改ざん検知は行いません。法的に電子署名が必要な契約書などには、認定された電子署名サービスをお使いください。社内の回覧や確認用など、画像の押印で足りる書類向けです。',
    },
    {
      question: '背景が白く残らないようにするには？',
      answer:
        '背景が透明なPNGを使ってください。署名パッドやハンコ・印鑑ジェネレーターで作った透過PNGなら、文字や印影の周りの内容を隠さずに貼り付けられます。JPEGには透明部分がないため、白い四角として貼り付けられます。',
    },
    {
      question: '複数ページに同じ署名を押せますか？',
      answer:
        'はい。「押すページ」で「全ページ」「このページだけ」「ページを指定」（例: 1-3, 5）を選べます。複数ページでは、ページに対して同じ相対位置・同じ幅の割合で貼り付けます。ページの大きさが違うPDFでは、実際の大きさもその分変わります。',
    },
    {
      question: '貼り付けた署名を後から消したり動かしたりできますか？',
      answer:
        'このツールで書き出したあとは動かせません。やり直すときは元のPDFを選び直してください。なお、PDFを編集できるソフトでは貼り付けた画像を移動・削除できるため、改ざん防止にはなりません。',
    },
    {
      question: 'PDFや画像はサーバーに送られますか？',
      answer:
        'いいえ。PDFも署名画像もすべてブラウザ内で処理され、端末の外に出ることはありません。署名は個人情報にあたるため、共用パソコンで使った場合はブラウザのタブを閉じて、ダウンロードしたファイルの扱いにご注意ください。',
    },
  ],
  en: [
    {
      question: 'Is this a digital (electronic) signature?',
      answer:
        'No. It only places a picture of a signature or seal on the page. There is no certificate, so it cannot verify who signed or detect later changes. For contracts that legally require an electronic signature, use a certified e-signature service. This tool suits documents where a stamped image is enough, such as internal sign-offs.',
    },
    {
      question: 'How do I avoid a white box around my signature?',
      answer:
        'Use a PNG with a transparent background. A transparent PNG from the Signature Pad or the Seal Stamp Generator keeps the content around the strokes visible. JPEG has no transparency, so it is placed as a solid rectangle.',
    },
    {
      question: 'Can I stamp the same signature on several pages?',
      answer:
        'Yes. Under "Pages to stamp" choose "All pages", "This page only" or "Choose pages" (for example 1-3, 5). The image goes at the same relative position and width on each page, so on a PDF with mixed page sizes its real size changes with the page.',
    },
    {
      question: 'Can I move or remove the signature after exporting?',
      answer:
        'Not with this tool. To start over, choose the original PDF again. Note that software that can edit PDFs can move or delete the placed image, so it does not protect a document from tampering.',
    },
    {
      question: 'Are my PDF and image uploaded anywhere?',
      answer:
        'No. Both the PDF and the signature image are processed in your browser and never leave your device. A signature is personal data, so on a shared computer close the tab afterwards and be careful with the downloaded file.',
    },
  ],
};
