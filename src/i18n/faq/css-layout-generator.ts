import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'FlexboxとGridはどう使い分ければよいですか？',
      answer:
        '要素を横または縦の一方向に並べるならFlexbox、行と列の両方を意識した格子状の配置ならGridが向いています。ナビゲーションやボタン列はFlexbox、カード一覧やページ全体の骨組みはGridが定番です。',
    },
    {
      question: 'justify-contentとalign-itemsの違いは何ですか？',
      answer:
        'justify-contentはアイテムが並ぶ向き（主軸）の揃え、align-itemsはそれと直交する向き（交差軸）の揃えです。flex-directionをcolumnにすると、主軸と交差軸の向きが入れ替わります。',
    },
    {
      question: 'align-contentが出力されないのはなぜですか？',
      answer:
        'align-contentは折り返しで複数行になったときの行同士の揃えを決めるプロパティで、flex-wrapがnowrapの場合は効果がありません。wrapまたはwrap-reverseを選ぶと出力されます。',
    },
    {
      question: '生成されたCSSのセレクタは変更できますか？',
      answer:
        'セレクタは.container固定です。コピー後に、ご自身のクラス名や要素名へ置き換えてお使いください。',
    },
  ],
  en: [
    {
      question: 'When should I use Flexbox and when Grid?',
      answer:
        'Use Flexbox to lay items out along a single direction, row or column, and Grid when you need to control both rows and columns. Navigation bars and button rows suit Flexbox; card galleries and page skeletons suit Grid.',
    },
    {
      question:
        'What is the difference between justify-content and align-items?',
      answer:
        'justify-content aligns items along the main axis (the direction they flow), and align-items aligns them along the perpendicular cross axis. Setting flex-direction to column swaps the two axes.',
    },
    {
      question: 'Why is align-content missing from the output?',
      answer:
        'align-content aligns the lines of a wrapped flex container, so it has no effect when flex-wrap is nowrap. Choose wrap or wrap-reverse and it is included.',
    },
    {
      question: 'Can I change the selector in the generated CSS?',
      answer:
        'The selector is fixed to .container. After copying, replace it with your own class name or element selector.',
    },
  ],
};
