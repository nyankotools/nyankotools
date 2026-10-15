import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '波をページの横幅いっぱいに表示するにはどうしますか？',
      answer:
        '生成したSVGにはpreserveAspectRatio="none"が付いているため、width: 100%を指定した<svg>要素や、background-size: 100% 100%のCSSで横幅いっぱいに引き伸ばせます。高さはCSSのheightで調整してください。',
    },
    {
      question: '気に入った形をあとで再現できますか？',
      answer:
        'できます。シードの数値と各設定が同じなら、いつでも同じ形が生成されます。気に入った形が出たらシードをメモしておいてください。',
    },
    {
      question: '上側と下側のどちらを塗りつぶせばよいですか？',
      answer:
        'セクションの下端に置く波は「下側」（波の下が塗られ、上の背景が見える形）、上端に置く波は「上側」を選ぶと、次のセクションの色に自然につながります。',
    },
    {
      question: 'ブロブの色をあとから変えるには？',
      answer:
        'SVGコードのpath要素のfill属性の値を書き換えてください。CSS背景（data URI）を使う場合は、色を変えてこのツールで再生成するのが簡単です。',
    },
  ],
  en: [
    {
      question: 'How do I make a wave span the full page width?',
      answer:
        'The generated SVG includes preserveAspectRatio="none", so an <svg> element with width: 100%, or CSS with background-size: 100% 100%, stretches it to the full width. Set the height with CSS height.',
    },
    {
      question: 'Can I reproduce a shape I liked later?',
      answer:
        'Yes. With the same seed number and the same settings, the same shape is always generated. Note down the seed when you find one you like.',
    },
    {
      question: 'Should I fill the top or the bottom side?',
      answer:
        'For a wave at the bottom edge of a section, choose "Bottom" (the area under the wave is filled, so the background above shows through). For a wave at the top edge, choose "Top", so it blends into the next section’s color.',
    },
    {
      question: 'How do I change a blob’s color afterwards?',
      answer:
        'Edit the fill attribute of the path element in the SVG code. If you use the CSS background (data URI), it is easiest to change the color and generate it again here.',
    },
  ],
};
