import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'filterのdrop-shadowとbox-shadowは何が違いますか？',
      answer:
        'box-shadowは要素の四角い枠に影を付けますが、drop-shadowは透明部分を除いた見た目の輪郭に沿って影を付けます。透過PNGや丸い図形の形どおりに影を出したいときはdrop-shadowを使います。',
    },
    {
      question: '複数のfilterを組み合わせると順序は関係ありますか？',
      answer:
        '関係します。filterは左から順に適用されるため、たとえば grayscale のあとに sepia を重ねるのと逆では結果が変わることがあります。このツールは表示順が固定で、変更した関数だけをその順に出力します。',
    },
    {
      question: 'blurやfilterを使うと表示が重くなりますか？',
      answer:
        '大きなblur値や、多数の要素・大きな画像への適用は描画負荷が高くなることがあります。アニメーションで値を変える場合は特に、必要な範囲に絞って使ってください。',
    },
    {
      question: 'filterとbackdrop-filterの違いは何ですか？',
      answer:
        'filterは要素自身とその子要素に効果をかけます。backdrop-filterは要素の背後にあるものに効果をかけ、すりガラス風の表現に使います。後者はCSS Glassmorphismジェネレーターで扱っています。',
    },
  ],
  en: [
    {
      question: 'How is filter: drop-shadow() different from box-shadow?',
      answer:
        'box-shadow follows the rectangular box of an element, while drop-shadow follows its visible outline and ignores transparent areas. Use drop-shadow when you want a shadow that hugs a transparent PNG or a round shape.',
    },
    {
      question: 'Does the order of multiple filters matter?',
      answer:
        'Yes. Filters are applied left to right, so chaining grayscale then sepia can look different from the reverse. This tool keeps a fixed order and outputs only the functions you changed.',
    },
    {
      question: 'Can blur and other filters slow down the page?',
      answer:
        'Large blur values, or filters on many elements or big images, can be expensive to render, especially if you animate them. Apply them only where needed.',
    },
    {
      question: 'What is the difference between filter and backdrop-filter?',
      answer:
        'filter affects the element itself and its children. backdrop-filter affects whatever is behind the element and is used for frosted-glass looks. The latter is covered by the CSS Glassmorphism Generator.',
    },
  ],
};
