import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'UUIDのバージョン4とは何ですか？',
      answer:
        'ランダムな値で作るUUIDで、RFC 4122に準拠しています。ブラウザの暗号学的乱数を使って生成するため、衝突する確率は現実的には無視できるほど低くなります。',
    },
    {
      question: '一度にいくつまで生成できますか？',
      answer:
        '最大100個までまとめて生成できます。ハイフンの有無や大文字・小文字の形式も選べるので、用途に合わせて整えてください。',
    },
    {
      question: 'データベースの主キーにUUIDを使っても大丈夫ですか？',
      answer:
        '使えます。ただし、バージョン4はランダムなため、順序が不規則でインデックスの効率が下がる場合があります。用途によっては連番や時間順のIDも検討してください。',
    },
  ],
  en: [
    {
      question: 'What is UUID version 4?',
      answer:
        "It is a random UUID defined in RFC 4122. It is generated with the browser's cryptographic random source, so the chance of a collision is negligible in practice.",
    },
    {
      question: 'How many can I generate at once?',
      answer:
        'Up to 100 at a time, and you can choose the format such as with or without hyphens and upper or lower case.',
    },
    {
      question: 'Is it OK to use a UUID as a database primary key?',
      answer:
        'Yes, but version 4 values are random and unordered, which can reduce index efficiency. Depending on the use case, consider sequential or time-ordered IDs.',
    },
  ],
};
