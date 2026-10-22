import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'CSSの色名キーワードはいくつありますか？',
      answer:
        '現在のCSS仕様（Color Module Level 4）では148個です。gray と grey のような綴り違いの別名や rebeccapurple を含み、transparent と currentColor は含みません。',
    },
    {
      question: 'gray と grey はどちらを使えばよいですか？',
      answer:
        'どちらも同じ色（#808080）でブラウザの動作も同じです。プロジェクト内でどちらかに統一しておくと、検索や置換がしやすくなります。',
    },
    {
      question: 'rebeccapurple とは何ですか？',
      answer:
        'CSS Color Module Level 4 で追加された色名で、#663399 を表します。古いブラウザでは使えない場合があるため、必要ならHEXで指定してください。',
    },
    {
      question: 'transparent や currentColor が一覧にないのはなぜですか？',
      answer:
        '固定の色ではないためです。transparent は完全な透明、currentColor は要素の文字色を引き継ぐ特別なキーワードで、HEXやRGBに対応しません。',
    },
  ],
  en: [
    {
      question: 'How many CSS named colors are there?',
      answer:
        'There are 148 in the current spec (CSS Color Module Level 4), including gray/grey spelling variants and rebeccapurple. transparent and currentColor are not counted.',
    },
    {
      question: 'Should I use gray or grey?',
      answer:
        'Both name the same color (#808080) and behave identically in browsers. Pick one spelling per project so searching and refactoring stay simple.',
    },
    {
      question: 'What is rebeccapurple?',
      answer:
        'A named color added in CSS Color Module Level 4 that stands for #663399. Very old browsers may not know it, so use the HEX code if you need to support them.',
    },
    {
      question: 'Why are transparent and currentColor missing from the list?',
      answer:
        'They are not fixed colors. transparent is fully see-through and currentColor inherits the text color, so neither has a HEX or RGB value.',
    },
  ],
};
