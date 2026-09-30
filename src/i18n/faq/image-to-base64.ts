import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Base64にするとファイルサイズはどのくらい増えますか？',
      answer:
        '元のファイルサイズのおよそ1.33倍（4/3倍）になります。HTMLやCSSに埋め込む場合は、小さなアイコンなどに限ると読み込みの負担を抑えられます。',
    },
    {
      question: 'Data URLとBase64文字列の違いは何ですか？',
      answer:
        'Base64文字列はデータ部分だけで、Data URLは「data:image/png;base64,」のようなプレフィックスが付いた形式です。imgタグやCSSのurl()にはData URLをそのまま使えます。',
    },
    {
      question: 'Base64から画像に戻せますか？',
      answer:
        'はい。「Base64→画像」を選ぶと復元できます。プレフィックスがなくても、先頭のバイトからPNG・JPEG・GIF・WebP・BMP・SVG・ICOを自動判定します。判定できない場合はエラーになります。',
    },
  ],
  en: [
    {
      question: 'How much larger does the file get when Base64-encoded?',
      answer:
        'About 1.33 times (4/3) the original size. When embedding in HTML or CSS, limit it to small assets like icons.',
    },
    {
      question:
        'What is the difference between a Data URL and a Base64 string?',
      answer:
        'A Base64 string is only the data; a Data URL adds a prefix like "data:image/png;base64,". Data URLs can be used directly in img tags and CSS url().',
    },
    {
      question: 'Can I turn Base64 back into an image?',
      answer:
        'Yes. Choose "Base64 to Image". Even without the prefix, the format (PNG, JPEG, GIF, WebP, BMP, SVG, ICO) is detected from the first bytes; if it cannot be detected, an error is shown.',
    },
  ],
};
