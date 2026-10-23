import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'A4を300dpiで印刷するには何pxの画像が必要ですか？',
      answer:
        'A4（210×297mm）は300dpiで約2480×3508pxです。DPIを入力すると、下の用紙サイズ一覧でA0〜A10・B0〜B10のピクセル数をまとめて確認できます。',
    },
    {
      question: 'ptとmmの換算でDPIは関係しますか？',
      answer:
        '関係しません。1pt=1/72インチ=約0.3528mmと固定です。DPIが影響するのはpxとの換算だけです。',
    },
    {
      question: 'B判のサイズがほかのサイトと違うのはなぜですか？',
      answer:
        '日本で一般的なJIS規格のB判を使っています。海外のISO規格のB判はやや小さく、たとえばB5はJISが182×257mm、ISOが176×250mmです。',
    },
    {
      question: 'Web用の72dpiと96dpiはどちらを使えばよいですか？',
      answer:
        'CSSのpxは96dpi基準（1in=96px）、DTPのptは72dpi基準です。用途に合わせてDPIを96や72に設定してください。印刷用の画像は300dpiが一般的です。',
    },
  ],
  en: [
    {
      question: 'How many pixels do I need to print A4 at 300 dpi?',
      answer:
        'A4 (210 x 297 mm) is about 2480 x 3508 px at 300 dpi. Enter your DPI and the paper size chart lists the pixel size of every A0-A10 and B0-B10 size.',
    },
    {
      question: 'Does DPI affect pt to mm conversion?',
      answer:
        'No. 1 pt is always 1/72 inch, about 0.3528 mm. DPI only matters when converting to or from px.',
    },
    {
      question: 'Why are the B sizes different from other sites?',
      answer:
        'This tool uses the Japanese JIS B series. The ISO B series is slightly smaller: B5 is 182 x 257 mm in JIS but 176 x 250 mm in ISO.',
    },
    {
      question: 'Should I use 72 dpi or 96 dpi for screens?',
      answer:
        'CSS px assume 96 dpi (1 in = 96 px), while DTP points assume 72 dpi. Set the DPI to match your target. Images for print are usually 300 dpi.',
    },
  ],
};
