import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '画像ファイルなしでストライプや水玉の背景は作れますか？',
      answer:
        '作れます。ストライプは`repeating-linear-gradient`、ドットは`radial-gradient`にbackground-sizeを組み合わせ、チェックは`conic-gradient`で描きます。CSSだけで完結するので、画像の読み込みやリクエストは発生しません。',
    },
    {
      question: 'CSS形式とSVG形式はどう使い分けますか？',
      answer:
        'CSS形式は軽量で、色や大きさを後からCSS変数で書き換えやすいのが利点です。SVG形式は`url("data:image/svg+xml,...")`として背景に指定でき、`conic-gradient`に対応していない古いブラウザでも使えます。ただしコードが長くなります。',
    },
    {
      question: 'ストライプの角度は何度が基準ですか？',
      answer:
        'CSSの`linear-gradient`と同じで、0度が上向き、時計回りに増えます。0度なら横縞、90度なら縦縞、45度なら右上がりの斜め縞になります。ドットとチェックには角度は適用されません。',
    },
    {
      question: 'チェック柄のサイズは何を指しますか？',
      answer:
        '「サイズ」は1マスの一辺です。CSSでは2×2マスを1タイルとして繰り返すため、`background-size`にはその2倍の値が出力されます。',
    },
    {
      question: 'パターンの縁がギザギザに見えるのはなぜですか？',
      answer:
        'グラデーションで色の境目を同じ位置に置くと、画面の解像度によっては縁がにじまず、階段状に見えることがあります。ドットは境目を1pxかけて変化させて軽減していますが、気になる場合はSVG形式を試してください。',
    },
  ],
  en: [
    {
      question: 'Can I make stripes or polka dots without an image file?',
      answer:
        'Yes. Stripes use `repeating-linear-gradient`, dots use `radial-gradient` with a background-size, and checks use `conic-gradient`. It is all CSS, so no image has to be loaded or requested.',
    },
    {
      question: 'When should I use the CSS output versus the SVG output?',
      answer:
        'The CSS output is compact and easy to tweak later, for example with CSS variables. The SVG output is set as `url("data:image/svg+xml,...")`, and works in older browsers that lack `conic-gradient`, but the code is longer.',
    },
    {
      question: 'How is the stripe angle measured?',
      answer:
        'It follows CSS `linear-gradient`: 0 degrees points up and the value increases clockwise. So 0 gives horizontal stripes, 90 gives vertical stripes, and 45 gives diagonal stripes rising to the right. Dots and checks ignore the angle.',
    },
    {
      question: 'What does "Size" mean for the checkerboard?',
      answer:
        'It is the side length of one square. The CSS repeats a 2 x 2 block of squares as a single tile, so the output background-size is twice the value you set.',
    },
    {
      question: 'Why do the pattern edges look jagged?',
      answer:
        'When two gradient stops sit at the same position, the edge is not anti-aliased on some screens and can look stepped. Dots blend over 1px to soften this, but if it bothers you, try the SVG output.',
    },
  ],
};
