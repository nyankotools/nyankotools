import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'JSONの構文エラーはどのように調べればよいですか？',
      answer:
        '入力に構文エラーがあると、エラー内容が表示されます。よくある原因は、末尾のカンマ、シングルクォートの使用、キーをダブルクォートで囲んでいない、コメントの混入などです。',
    },
    {
      question: '整形とミニファイの違いは何ですか？',
      answer:
        '整形はインデントと改行を加えて読みやすくする処理、ミニファイは不要な空白や改行を取り除いてサイズを小さくする処理です。通常、意味やデータは変わりません。',
    },
    {
      question: '大きな数値や桁数の多い数値は正確に扱えますか？',
      answer:
        'JavaScriptの数値の精度（約15〜17桁）を超える整数は、整形時に丸められることがあります。桁数の多いIDなどを扱う場合は、文字列として持たせることをおすすめします。',
    },
  ],
  en: [
    {
      question: 'How do I find JSON syntax errors?',
      answer:
        'When the input is invalid, an error message is shown. Common causes are trailing commas, single quotes, unquoted keys, and comments, none of which are allowed in JSON.',
    },
    {
      question: 'What is the difference between formatting and minifying?',
      answer:
        'Formatting adds indentation and line breaks for readability; minifying removes whitespace to reduce size. The data normally does not change.',
    },
    {
      question: 'Are very large numbers handled exactly?',
      answer:
        "Integers beyond JavaScript's numeric precision (about 15 to 17 digits) may be rounded when formatted. For long IDs, store them as strings.",
    },
  ],
};
