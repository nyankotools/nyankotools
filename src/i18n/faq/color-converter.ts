import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'HEX・RGB・HSLはそれぞれどんな場面で使いますか？',
      answer:
        'HEXはCSSやデザインツールで最も一般的な表記です。RGBはプログラムでの色指定、HSLは色相・彩度・明度で調整するため、同系色で明るさだけ変えたいときに便利です。',
    },
    {
      question: '3桁のHEXコードにも対応していますか？',
      answer:
        'はい。「#f00」のような3桁の短縮形も入力できます。各桁を2回繰り返した6桁（#ff0000）として扱います。',
    },
    {
      question: '変換した色はどのように使えますか？',
      answer:
        '変換結果のコードをそのままCSSやデザインツールに貼り付けて使えます。色の見やすさを確認したい場合は、コントラスト比チェッカーとあわせて使うと便利です。',
    },
  ],
  en: [
    {
      question: 'When should I use HEX, RGB or HSL?',
      answer:
        'HEX is the most common notation in CSS and design tools. RGB is convenient in code, and HSL (hue, saturation, lightness) is handy for tweaking brightness within the same color family.',
    },
    {
      question: 'Are 3-digit HEX codes supported?',
      answer:
        'Yes. Short forms like "#f00" are accepted and expanded to six digits by doubling each digit (#ff0000).',
    },
    {
      question: 'How can I use the converted colors?',
      answer:
        'Copy the result straight into your CSS or design tool. To check readability of a color pair, use it together with the contrast checker.',
    },
  ],
};
