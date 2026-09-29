import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '円や楕円を作るにはどうすればよいですか？',
      answer:
        '正方形の要素なら、角丸を50%にすると円になります。長方形では50%で楕円になります。px指定では要素の半分以上の値を入れても、見た目は最大の丸みに収まります。',
    },
    {
      question: '4つの角を別々の値にできますか？',
      answer:
        'はい。「4隅を連動させる」を無効にすると、左上・右上・右下・左下の値を個別に指定できます。4隅がすべて同じ値のときは、CSSも単一値に短縮して出力されます。',
    },
    {
      question: '生成したCSSはどう使いますか？',
      answer:
        '生成されたborder-radiusの行をコピーして、対象要素のスタイルに貼り付けてください。すべての主要ブラウザで追加設定なしに動作します。',
    },
  ],
  en: [
    {
      question: 'How do I make a circle or ellipse?',
      answer:
        'On a square element, set the border radius to 50% to get a circle; on a rectangle, 50% gives an ellipse. With pixel values, anything above half the element size still renders as maximum rounding.',
    },
    {
      question: 'Can each corner have a different value?',
      answer:
        'Yes. Turn off the linked-corners option to set top-left, top-right, bottom-right and bottom-left individually. When all four corners are equal, the CSS is shortened to a single value.',
    },
    {
      question: 'How do I use the generated CSS?',
      answer:
        'Copy the border-radius line and paste it into the style rules of your element. It works in all major browsers without vendor prefixes.',
    },
  ],
};
