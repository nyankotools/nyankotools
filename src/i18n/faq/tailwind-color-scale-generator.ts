import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '生成されるスケールはTailwind公式のパレットと同じですか？',
      answer:
        '同じではありません。基準色の色相と彩度を保ったまま、HSLの明度を50〜950の各段階に固定値で割り当てる方式です。公式パレットは色ごとに手作業で調整されているため、近い雰囲気にはなりますが数値は一致しません。',
    },
    {
      question: '基準色はどの段階に入りますか？',
      answer:
        '「基準色を最も近い段階にそのまま配置する」をオンにすると、基準色のHSL明度に最も近い段階が入力どおりのHEXになります。オフにすると、基準色も固定の明度で計算し直します。',
    },
    {
      question: 'Tailwind v4 と v3 の出力はどう使い分けますか？',
      answer:
        'v4 はCSSファイルに @theme { --color-名前-500: …; } を貼り付けます。v3 は tailwind.config.js の theme.extend.colors に貼り付けます。CSS変数形式は Tailwind を使わないプロジェクトでも使えます。',
    },
    {
      question: '同じ段階でも黄色だけ明るく見えるのはなぜですか？',
      answer:
        'HSLの明度は人の目に見える明るさとは一致しないためです。黄色や緑は同じ明度でも青や紫より明るく見えます。文字色に使う場合はコントラスト比を確認してください。',
    },
  ],
  en: [
    {
      question:
        'Is the generated scale the same as the official Tailwind palette?',
      answer:
        'No. The tool keeps the hue and saturation of your base color and assigns a fixed HSL lightness to each step from 50 to 950. The official palette is tuned by hand for each color, so the feel is similar but the values differ.',
    },
    {
      question: 'Which step does the base color land on?',
      answer:
        'With the placement option on, the step whose lightness is closest to your base color uses your exact HEX. With it off, the base color is also recalculated at the fixed lightness values.',
    },
    {
      question: 'When should I use the Tailwind v4 or v3 output?',
      answer:
        'For v4, paste the @theme { --color-name-500: …; } block into your CSS. For v3, paste the snippet into theme.extend.colors in tailwind.config.js. The CSS variables format works in projects that do not use Tailwind.',
    },
    {
      question: 'Why does yellow look lighter than blue at the same step?',
      answer:
        'HSL lightness is not perceived brightness. Yellows and greens look brighter than blues and purples at the same lightness, so check the contrast ratio before using a step for text.',
    },
  ],
};
