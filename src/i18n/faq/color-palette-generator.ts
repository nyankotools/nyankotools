import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '補色・類似色・トライアドの違いは何ですか？',
      answer:
        '補色は色相環の正反対（180度）、類似色は隣り合う色（±30度）、トライアドは120度ずつ離れた3色です。コントラストを強めたいなら補色、まとまりを重視するなら類似色が向いています。',
    },
    {
      question: '生成したパレットはどのように使えますか？',
      answer:
        '各色をクリックするとHEXコードをコピーできます。CSS変数（:root { --color-1: … }）やJSONでまとめて書き出せるので、スタイルシートやデザイントークンにそのまま貼り付けられます。',
    },
    {
      question: 'モノクロマティックはどう計算されますか？',
      answer:
        '基準色の色相と彩度を保ったまま、HSLの明度を20・35・50・65・80%の5段階に変えた色を作ります。基準色の明度が違っても、同じ5段階になります。',
    },
    {
      question: 'グレーを基準色にすると全部同じ色になるのはなぜですか？',
      answer:
        'グレーは彩度が0で色相を持たないため、色相を回転しても結果が変わりません。彩度のある色を基準色にしてください。',
    },
  ],
  en: [
    {
      question:
        'What is the difference between complementary, analogous and triadic?',
      answer:
        'Complementary colors are opposite on the color wheel (180 degrees), analogous colors are neighbors (±30 degrees), and triadic colors are 120 degrees apart. Use complementary for strong contrast and analogous for a cohesive look.',
    },
    {
      question: 'How do I use the generated palette?',
      answer:
        'Click a swatch to copy its HEX code. You can also export the whole palette as CSS variables (:root { --color-1: … }) or JSON and paste it into a stylesheet or design tokens.',
    },
    {
      question: 'How is the monochromatic palette calculated?',
      answer:
        'It keeps the hue and saturation of your base color and sets HSL lightness to 20, 35, 50, 65 and 80%. The same five steps are used whatever the base lightness is.',
    },
    {
      question: 'Why do all colors look the same when I use gray?',
      answer:
        'Gray has zero saturation and no real hue, so rotating the hue changes nothing. Start from a saturated color instead.',
    },
  ],
};
