import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'insetを付けるとどうなりますか？',
      answer:
        'insetを付けると影が要素の外側ではなく内側に描画され、へこんだような見た目になります。入力欄の内側の影や押し込まれたボタン表現に使われます。',
    },
    {
      question: '複数の影を重ねることはできますか？',
      answer:
        'はい。シャドウレイヤーを最大6個まで追加できます。薄い影を重ねると、1つの濃い影よりも自然で立体的な見た目になります。',
    },
    {
      question: 'ぼかし半径と広がり半径の違いは何ですか？',
      answer:
        'ぼかし半径は影の輪郭をどれだけぼかすかを指定します。広がり半径は影そのものの大きさを拡大・縮小し、負の値にすると影が小さくなります。',
    },
  ],
  en: [
    {
      question: 'What does "inset" do?',
      answer:
        'With inset, the shadow is drawn inside the element instead of outside, creating a recessed look. It is often used for input fields and pressed buttons.',
    },
    {
      question: 'Can I stack multiple shadows?',
      answer:
        'Yes. You can add up to 6 shadow layers. Layering several soft shadows usually looks more natural than one heavy shadow.',
    },
    {
      question: 'What is the difference between blur radius and spread radius?',
      answer:
        'Blur radius controls how soft the shadow edge is. Spread radius grows or shrinks the shadow itself; a negative value makes it smaller.',
    },
  ],
};
