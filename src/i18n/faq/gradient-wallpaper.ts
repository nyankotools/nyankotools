import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '作れる画像の解像度に上限はありますか？',
      answer:
        '幅・高さは16〜8192pxで、幅×高さは約1677万ピクセルまでです。4K（3840×2160）は問題なく作れます。これを超えるとブラウザのCanvas上限で失敗することがあるため、あらかじめ制限しています。',
    },
    {
      question: 'グラデーションに縞（バンディング）が出るのはなぜですか？',
      answer:
        '8bitの色では、近い色の間の変化が段差として見えることがあります。「ノイズ（粒状感）」を5〜20程度加えると、段差が目立たなくなります。',
    },
    {
      question: 'PNGとJPEGはどちらで保存すべきですか？',
      answer:
        '劣化なく保存したい場合はPNG、ファイルサイズを小さくしたい場合はJPEGが向きます。ノイズを加えるとPNGは大きくなりやすいので、その場合はJPEGも検討してください。',
    },
    {
      question: 'CSSグラデーションジェネレーターとの違いは何ですか？',
      answer:
        'CSSグラデーションジェネレーターはCSSのコードを出力します。このツールは、解像度を指定した画像ファイル（壁紙・背景素材）を出力します。',
    },
  ],
  en: [
    {
      question: 'Is there a limit on the resolution?',
      answer:
        'Width and height must be 16 to 8192 px, and width × height is capped at about 16.7 million pixels. 4K (3840×2160) works fine. Beyond that, browsers may fail to create the canvas, so the limit is enforced up front.',
    },
    {
      question: 'Why do I see stripes (banding) in my gradient?',
      answer:
        'With 8-bit color, small changes between nearby colors can show up as steps. Adding "Noise (grain)" at around 5 to 20 breaks the steps up so they are far less visible.',
    },
    {
      question: 'Should I save as PNG or JPEG?',
      answer:
        'Use PNG for lossless output and JPEG for a smaller file. Noise makes PNG files larger, so JPEG is worth considering in that case.',
    },
    {
      question: 'How is this different from the CSS Gradient Generator?',
      answer:
        'The CSS Gradient Generator outputs CSS code. This tool outputs an actual image file at the resolution you choose, ready to use as a wallpaper or background.',
    },
  ],
};
