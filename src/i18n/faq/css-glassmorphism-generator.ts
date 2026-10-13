import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'グラスモーフィズムでぼかしが効いて見えないのはなぜですか？',
      answer:
        '`backdrop-filter`は要素の背後にある内容をぼかします。背後が単色だとぼかしても見た目が変わりません。画像やグラデーション、他の要素の上に重ねると効果が分かります。',
    },
    {
      question: 'backdrop-filterはどのブラウザで使えますか？',
      answer:
        '主要な最新ブラウザで利用できます。古いSafariでは`-webkit-`接頭辞が必要なため、生成CSSには両方を含めています。非対応の環境では半透明の背景のみが適用されます。',
    },
    {
      question: 'ニューモーフィズムの影が不自然に見えます。',
      answer:
        '要素と親要素の背景色を同じ基準色にそろえてください。白や黒に近い色は明暗の差が出にくいので、少し中間的な色にすると立体感が出ます。',
    },
    {
      question: 'ニューモーフィズムの注意点は何ですか？',
      answer:
        '要素と背景のコントラストが低いため、ボタンや入力欄の境界が分かりにくくなりがちです。文字色や枠線を別途補い、視認性を確認してください。',
    },
  ],
  en: [
    {
      question: 'Why can I not see the blur in my glass card?',
      answer:
        'backdrop-filter blurs whatever is behind the element. Over a flat solid color the blur changes nothing visible. Place it over an image, gradient, or other content to see the effect.',
    },
    {
      question: 'Which browsers support backdrop-filter?',
      answer:
        'All current major browsers do. Older Safari needs the -webkit- prefix, so the generated CSS includes both. Where it is unsupported, only the translucent background applies.',
    },
    {
      question: 'My neumorphic shadows look wrong. What is happening?',
      answer:
        'The element and its parent must share the same base color. Colors close to white or black leave little room for lighter and darker shades, so a mid-tone base works better.',
    },
    {
      question: 'What should I watch out for with neumorphism?',
      answer:
        'The contrast between the element and the background is low, so buttons and inputs can be hard to distinguish. Add text color or borders as needed and check readability.',
    },
  ],
};
