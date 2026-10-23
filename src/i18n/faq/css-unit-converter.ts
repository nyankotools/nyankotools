import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'vwやvhをpxに換算するには何を指定しますか？',
      answer:
        '画面幅と画面高さ（px）を指定します。たとえば画面幅1920pxなら1vw=19.2pxです。ブラウザの開発者ツールで確認した実際の表示領域の値を入れると正確です。',
    },
    {
      question: 'remとemで基準が違うのはなぜですか？',
      answer:
        'remはhtml要素のfont-size、emは親要素のfont-sizeを基準にするためです。このツールでは「ルートフォントサイズ」と「親フォントサイズ」を別々に指定できます。',
    },
    {
      question: 'chの換算結果はどのくらい正確ですか？',
      answer:
        'chはフォントごとの「0」の幅なので正確な値は環境で変わります。このツールでは親フォントサイズの0.5倍で近似するため、目安としてお使いください。',
    },
    {
      question: 'ptやcmの換算はCSS仕様どおりですか？',
      answer:
        'はい、1in=96px=72pt=2.54cm、1pc=16pxというCSSの固定比率で計算します。実際の画面の物理サイズは端末のDPIで変わるため一致しないことがあります。',
    },
  ],
  en: [
    {
      question: 'What do I need to set to convert vw or vh to px?',
      answer:
        'Set the viewport width and height in px. For a 1920px-wide viewport, 1vw is 19.2px. Use the real viewport size from your browser dev tools for accurate results.',
    },
    {
      question: 'Why do rem and em use different reference values?',
      answer:
        'rem is based on the html element font-size, while em is based on the parent element font-size. This tool lets you set the root and parent font sizes separately.',
    },
    {
      question: 'How accurate is the ch conversion?',
      answer:
        'ch is the width of the "0" glyph, which differs by font. This tool approximates it as 0.5 times the parent font size, so treat the result as a guide.',
    },
    {
      question: 'Are pt and cm converted according to the CSS spec?',
      answer:
        'Yes, it uses the fixed CSS ratios: 1in = 96px = 72pt = 2.54cm and 1pc = 16px. The physical size on a real display depends on its DPI, so it may differ.',
    },
  ],
};
