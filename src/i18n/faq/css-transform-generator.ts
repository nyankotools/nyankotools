import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'transformの関数は順番で結果が変わりますか？',
      answer:
        '変わります。関数は左から順に適用されるため、「移動してから回転」と「回転してから移動」では位置が異なります。このツールは移動 → 回転 → 拡大縮小 → 傾きの順で出力します。別の順にしたい場合は、コピーしたCSSの関数を並べ替えてください。',
    },
    {
      question: '3Dの奥行きが出ません。どうすればよいですか？',
      answer:
        'X軸またはY軸の回転だけでは平面的に見えます。「perspective」に600〜1000程度を入れると奥行きが出ます。小さい値ほど遠近感が強くなります。',
    },
    {
      question: 'perspective()関数と親要素のperspectiveプロパティの違いは？',
      answer:
        'このツールは`transform`の先頭に`perspective()`を置く方式で出力します。要素単体の変形には十分ですが、複数の子要素に共通の消失点を与えたい場合は、親要素に`perspective`プロパティを指定する方式を使ってください。',
    },
    {
      question: 'transform-originを変えると何が変わりますか？',
      answer:
        '回転や拡大縮小の中心点が変わります。初期値は中心（50% 50%）で、0% 0%にすると左上を軸に回転します。初期値のままなら出力から省略されます。',
    },
    {
      question: 'skewの角度を90度にできないのはなぜですか？',
      answer:
        '90度付近では要素が無限に伸びて表示できなくなるため、±89度までに制限しています。',
    },
  ],
  en: [
    {
      question: 'Does the order of transform functions matter?',
      answer:
        'Yes. Functions are applied from left to right, so "translate then rotate" lands somewhere different from "rotate then translate". This tool outputs translate, rotate, scale, then skew; reorder the copied CSS if you need another order.',
    },
    {
      question: 'My 3D rotation looks flat. What is missing?',
      answer:
        'Rotating around the X or Y axis alone looks flat. Set "Perspective" to around 600-1000 px to add depth; smaller values give a stronger effect.',
    },
    {
      question:
        'What is the difference between perspective() and the perspective property?',
      answer:
        'This tool puts `perspective()` at the start of `transform`, which is fine for a single element. If several children should share one vanishing point, set the `perspective` property on their parent instead.',
    },
    {
      question: 'What does changing transform-origin do?',
      answer:
        'It moves the anchor point for rotation and scaling. The default is the center (50% 50%); at 0% 0% the element rotates around its top-left corner. The line is omitted from the output when it is the default.',
    },
    {
      question: 'Why can I not set skew to 90 degrees?',
      answer:
        'Near 90 degrees the element stretches toward infinity and disappears, so the range is limited to +/-89 degrees.',
    },
  ],
};
