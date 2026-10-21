import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '入力できる式の書き方を教えてください。',
      answer:
        '変数は x のみで、y= は付けても付けなくても構いません。x^2、sin(x)/x、sqrt(x)、abs(x)、2^x、log(x, 2) のように書けます。2x のような省略した掛け算にも対応しています。',
    },
    {
      question: 'tan(x) や 1/x の線が途切れるのはなぜですか？',
      answer:
        '定義されない点や、値が正負の無限大に発散する漸近線をまたいで線をつなぐと、実際には存在しない縦線が描かれてしまうためです。そのため該当する箇所では線を途切れさせています。',
    },
    {
      question: 'sin(90) が 1 にならないのはなぜですか？',
      answer:
        '角度の単位が既定でラジアンになっているためです。「角度の単位」を「度」に切り替えると sin(90) = 1 になります。asin などの逆三角関数の結果も同じ単位で表示されます。',
    },
    {
      question: '保存したPNGにはどの範囲が写りますか？',
      answer:
        '画面に表示している範囲がそのまま画像になります。保存する前に「表示範囲」やドラッグ・ズームで見せたい範囲に合わせてください。背景は白で、ダークモードでも同じです。',
    },
    {
      question: '何本まで重ね描きできますか？',
      answer:
        '最大6本です。空の欄は無視され、式にエラーがある欄はその欄の下にメッセージが表示されて、ほかの式の描画は続きます。',
    },
  ],
  en: [
    {
      question: 'What expression syntax is supported?',
      answer:
        'The only variable is x, and a leading "y=" is optional. You can write x^2, sin(x)/x, sqrt(x), abs(x), 2^x or log(x, 2). Implicit multiplication such as 2x also works.',
    },
    {
      question: 'Why does the line break for tan(x) or 1/x?',
      answer:
        'Joining points across an undefined value or a vertical asymptote would draw a vertical line that is not part of the function, so the curve is deliberately broken there.',
    },
    {
      question: 'Why is sin(90) not 1?',
      answer:
        'The angle unit defaults to radians. Switch "Angle unit" to degrees and sin(90) becomes 1. Inverse functions such as asin then return degrees as well.',
    },
    {
      question: 'Which area ends up in the saved PNG?',
      answer:
        'Exactly what is on screen. Set the "View range", or pan and zoom, before saving. The background is white, even in dark mode.',
    },
    {
      question: 'How many curves can I overlay?',
      answer:
        'Up to six. Empty boxes are ignored, and a box with an error shows its message while the other curves keep drawing.',
    },
  ],
};
