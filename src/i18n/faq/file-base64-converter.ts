import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '何MBのファイルまで変換できますか？',
      answer:
        '30MBまでです。5MBを超えると警告が出ます。Base64は元の約1.33倍の長さになり、数十MBの文字列はコピーや貼り付けでブラウザが重くなるため、大きなファイルは別の方法での受け渡しをおすすめします。',
    },
    {
      question: 'PDFや音声ファイルもBase64にできますか？',
      answer:
        'はい。画像に限らず、PDF・MP3・WAV・フォント（WOFF/TTF）・ZIPなど任意のファイルを、バイト列そのままBase64またはData URIに変換します。画像だけならプレビュー付きの画像のBase64変換も使えます。',
    },
    {
      question: 'Base64からファイルに戻したら拡張子が .bin になりました。',
      answer:
        'プレフィックスのないBase64は先頭バイトから種類を推定しますが、推定できない形式は .bin になります。ファイル名欄に「report.pdf」のように拡張子付きで入力してからダウンロードしてください。',
    },
    {
      question: 'Data URIとBase64のみの出力は何が違いますか？',
      answer:
        'Data URIは「data:application/pdf;base64,」というMIMEタイプ付きの1行のURLで、HTMLやCSSにそのまま使えます。Base64のみは中身だけで、APIのJSONやメール添付などに向きます。Base64のみは76文字ごとの改行も選べます。',
    },
  ],
  en: [
    {
      question: 'What is the maximum file size?',
      answer:
        '30 MB. A warning appears above 5 MB. Base64 is about 1.33x longer than the original, and strings of tens of megabytes make copying and pasting sluggish in the browser, so use another way to hand over large files.',
    },
    {
      question: 'Can I convert a PDF or audio file to Base64?',
      answer:
        'Yes. Any file works, not just images: PDF, MP3, WAV, fonts (WOFF/TTF), ZIP and so on. The raw bytes are encoded as a Base64 string or Data URI. For images only, the Image to Base64 tool adds a preview.',
    },
    {
      question: 'The decoded file was saved as .bin. Why?',
      answer:
        'For Base64 without a prefix, the type is guessed from the first bytes, and unrecognized formats fall back to .bin. Type a file name with an extension, such as "report.pdf", before you download.',
    },
    {
      question: 'What is the difference between Data URI and Base64 only?',
      answer:
        'A Data URI is a single-line URL with the MIME type, like "data:application/pdf;base64,", and can be used directly in HTML or CSS. Base64 only is just the content, suited to JSON APIs or email attachments, and can be wrapped every 76 characters.',
    },
  ],
};
