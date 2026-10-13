import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'text-shadowにはbox-shadowのようなspreadやinsetがありますか？',
      answer:
        'ありません。text-shadowは「X方向 Y方向 ぼかし 色」の4値のみで、広がり半径（spread）や inset は指定できません。縁取り風にしたい場合は、ぼかし0の影を上下左右に複数重ねます。',
    },
    {
      question: 'ネオン風の文字にするにはどうすればよいですか？',
      answer:
        'プリセットの「ネオン」を選んでください。白い小さな影の上に、同じ位置でぼかしを段階的に大きくした色付きの影を重ねると光って見えます。背景は暗い色にすると映えます。',
    },
    {
      question: '複数の影を重ねたとき、どの影が上に表示されますか？',
      answer:
        '先に書いた影ほど手前に表示されます。縁取りと光彩を組み合わせる場合は、縁取り用の影を先頭に置いてください。',
    },
    {
      question: '半透明の影にしたい場合はどうしますか？',
      answer:
        '色選択は6桁の16進数のみのため、生成されたCSSの色部分を `rgba(0 0 0 / 0.5)` のように直接書き換えてください。',
    },
  ],
  en: [
    {
      question: 'Does text-shadow have spread or inset like box-shadow?',
      answer:
        'No. text-shadow takes only four values: X offset, Y offset, blur, and color. To fake an outline, stack several zero-blur shadows around the text.',
    },
    {
      question: 'How do I make a neon text effect?',
      answer:
        'Pick the "Neon" preset. A small white shadow is layered with colored shadows of increasing blur at the same position, which reads as a glow. It looks best on a dark background.',
    },
    {
      question: 'Which shadow is drawn on top when I stack several?',
      answer:
        'The first shadow in the list is painted on top. When combining an outline with a glow, put the outline shadows first.',
    },
    {
      question: 'How can I make the shadow semi-transparent?',
      answer:
        'The color picker only supports 6-digit hex, so edit the color in the generated CSS by hand, for example to `rgba(0 0 0 / 0.5)`.',
    },
  ],
};
