import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'identiconとは何ですか？同じ文字列なら同じ模様になりますか？',
      answer:
        '文字列から自動で作られる、左右対称の5×5の模様アイコンです。文字列から計算した値で模様と色を決めるため、同じ文字列なら別の端末・別の日でも必ず同じ結果になります。',
    },
    {
      question: '日本語の名前のイニシャルはどうなりますか？',
      answer:
        '「山田 太郎」のように空白で区切ると「山太」になります。空白がない「山田太郎」は先頭から数えて、「文字数」が2文字なら「山田」、1文字なら「山」です。',
    },
    {
      question: 'GitHubのアイコンと同じ模様になりますか？',
      answer:
        'いいえ。GitHubのidenticonと同じ左右対称の考え方ですが、計算方法が違うため、同じ文字列でも同じ模様にはなりません。あくまで自作アイコン用です。',
    },
    {
      question: '円形や角丸にすると背景は透明になりますか？',
      answer:
        'はい。「円形」「角丸」を選ぶと、形の外側が透明なPNGで保存されます。「正方形」は四隅まで色で塗られます。',
    },
    {
      question: '入力した名前やメールアドレスは送信されますか？',
      answer:
        'されません。模様の計算も画像の書き出しもすべてブラウザ内で行われ、入力した文字が外部に送られることはありません。',
    },
  ],
  en: [
    {
      question:
        'What is an identicon, and is the pattern the same for the same text?',
      answer:
        'It is a symmetric 5x5 pattern icon generated from a string. The pattern and color are computed from the text, so the same text always gives the same result on any device, on any day.',
    },
    {
      question: 'How are initials made from a name?',
      answer:
        'With several words, such as "Ada Lovelace", it uses the first letters of the first and last word ("AL"). With a single word, it takes the leading letters, one or two depending on "Letters". Letters are uppercased.',
    },
    {
      question:
        'Will the pattern match the GitHub identicon for the same name?',
      answer:
        'No. It follows the same symmetric idea as GitHub identicons, but the algorithm differs, so the same text gives a different pattern. Use it for your own icons.',
    },
    {
      question: 'Is the background transparent for circle or rounded shapes?',
      answer:
        'Yes. With "Circle" or "Rounded", the PNG has transparent corners outside the shape. "Square" fills the whole image with color.',
    },
    {
      question: 'Is the name or email I type sent anywhere?',
      answer:
        'No. The pattern is calculated and the image is exported entirely in your browser, and what you type is never sent out.',
    },
  ],
};
