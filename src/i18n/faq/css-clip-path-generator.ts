import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'clip-pathで切り抜いた要素に影や枠線を付けられますか？',
      answer:
        'clip-pathは影や枠線も切り抜いてしまいます。影を残したい場合は、要素を別の親要素で包み、その親にfilter: drop-shadow()を指定してください。',
    },
    {
      question: '頂点の数を増やすにはどうしますか？',
      answer:
        'polygonを選んで「頂点を追加」を押すと、最後の頂点と先頭の頂点の中間に新しい頂点が加わります。頂点は最大24個まで、削除は3個になるまで可能です。',
    },
    {
      question: '表示される形が要素の大きさによって変わるのはなぜですか？',
      answer:
        'このツールの座標はすべて%指定で、要素の幅・高さに対する割合です。そのため要素が縦長・横長になると、形も同じ比率で伸縮します。px固定にしたい場合は、コピー後に値を手で書き換えてください。',
    },
    {
      question: 'clip-pathはどのブラウザで使えますか？',
      answer:
        '主要なモダンブラウザで利用できます。古いSafariなどに配慮する場合は、「-webkit- 付きも出力する」を有効にすると-webkit-clip-pathも一緒に出力されます。',
    },
  ],
  en: [
    {
      question: 'Can I add a shadow or border to a clipped element?',
      answer:
        'clip-path crops shadows and borders too. To keep a shadow, wrap the element in a parent and apply filter: drop-shadow() to that parent.',
    },
    {
      question: 'How do I add more points?',
      answer:
        'Choose polygon and press "Add point"; a new point is placed halfway between the last and the first point. You can have up to 24 points and remove points down to 3.',
    },
    {
      question: 'Why does the shape change with the element size?',
      answer:
        'All coordinates here are percentages of the element’s width and height, so a taller or wider element stretches the shape by the same ratio. To fix sizes in px, edit the values by hand after copying.',
    },
    {
      question: 'Which browsers support clip-path?',
      answer:
        'All major modern browsers do. If you need to cover older Safari, turn on "Also output -webkit- prefix" to include -webkit-clip-path in the output.',
    },
  ],
};
