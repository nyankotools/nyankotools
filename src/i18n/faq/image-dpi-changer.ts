import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'DPIを変えると画質は変わりますか？',
      answer:
        '変わりません。PNGのpHYsやJPEGのJFIFといったメタデータだけを書き換え、画素データは再エンコードしないため、ピクセル数も画質もそのままです。',
    },
    {
      question: 'DPIを300にすれば印刷がきれいになりますか？',
      answer:
        'いいえ。DPIは印刷サイズを決める目安で、画像自体の細かさはピクセル数で決まります。A4を300dpiできれいに印刷するには約2480×3508px以上が必要です。足りない場合は、用紙への収まりの表で必要DPIを確認してください。',
    },
    {
      question: 'DPIを書き換えたのに、ほかのソフトで違う値が表示されます。',
      answer:
        'JPEGにExifの解像度タグが残っている場合、ソフトによってはJFIFではなくExifの値を表示します。また、埋め込みDPIを無視してピクセル数だけで扱うソフトもあります。',
    },
    {
      question: 'GIFやWebPのDPIも変更できますか？',
      answer:
        'できません。このツールが書き換えられるのはPNGとJPEGだけです。ほかの形式を選ぶとエラーを表示します。画像フォーマット変換でPNGやJPEGにしてからお使いください。',
    },
  ],
  en: [
    {
      question: 'Does changing the DPI affect image quality?',
      answer:
        'No. Only metadata (the PNG pHYs chunk or the JPEG JFIF header) is rewritten and the pixel data is not re-encoded, so the pixel size and quality stay exactly the same.',
    },
    {
      question: 'Will setting 300 DPI make my print sharper?',
      answer:
        'No. DPI only sets the intended print size; sharpness depends on the pixel count. To print A4 at 300 dpi you need about 2480 x 3508 px or more. Check the "Min. DPI" column in the paper fit table to see what your image supports.',
    },
    {
      question:
        'Another app still shows a different DPI after I changed it. Why?',
      answer:
        'If a JPEG keeps resolution tags in its Exif data, some software reads those instead of the JFIF header. Other apps ignore the embedded DPI entirely and work from the pixel count.',
    },
    {
      question: 'Can I change the DPI of a GIF or WebP file?',
      answer:
        'No. This tool rewrites PNG and JPEG only, and shows an error for other formats. Convert the file to PNG or JPEG with the image format converter first.',
    },
  ],
};
