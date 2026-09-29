import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '線形グラデーションの角度はどの向きが基準ですか？',
      answer:
        'CSSの仕様に準拠しており、0°は下から上、90°は左から右、180°は上から下に向かうグラデーションになります。',
    },
    {
      question: 'カラーストップはいくつまで追加できますか？',
      answer:
        '2〜6個まで追加・削除できます。追加ボタンを押すと、既存のストップ間で最も空いている位置の中央に新しい色が入ります。位置が前後しても、出力時に自動で昇順へ並べ替えられます。',
    },
    {
      question: '円形グラデーションの中心をずらすにはどうしますか？',
      answer:
        'このツールは中心を要素の中央で出力します。ずらしたい場合は、生成されたCSSのradial-gradient(...)の形状指定の後に「at 30% 40%」のように追記してください。',
    },
  ],
  en: [
    {
      question: 'Which direction does the linear gradient angle refer to?',
      answer:
        'It follows the CSS specification: 0° runs from bottom to top, 90° from left to right, and 180° from top to bottom.',
    },
    {
      question: 'How many color stops can I add?',
      answer:
        'You can have 2 to 6 stops. A new stop is inserted at the midpoint of the widest gap, and stops are automatically sorted by position in the output.',
    },
    {
      question: 'How can I move the center of a radial gradient?',
      answer:
        'The tool always outputs a centered gradient. To shift it, append something like "at 30% 40%" after the shape in the generated radial-gradient(...).',
    },
  ],
};
