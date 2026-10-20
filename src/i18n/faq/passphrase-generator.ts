import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'パスフレーズは何語にすればよいですか？',
      answer:
        '1語あたり約12.9ビットのエントロピーがあり、一般的な用途なら6語（約77ビット）以上がおすすめです。マスターパスワードや暗号化の鍵には7〜8語にするとより安心です。',
    },
    {
      question: 'Diceware方式はなぜ安全なのですか？',
      answer:
        '単語を人間の「思いつき」ではなく乱数で選ぶため、語数から強度を計算できるからです。攻撃者が単語リストと方式を知っていても、7,776語から選ぶ組み合わせは語数が増えるごとに指数的に増えます。',
    },
    {
      question: '生成したパスフレーズは保存・送信されますか？',
      answer:
        'いいえ。ブラウザ内で暗号学的乱数を使って生成し、サーバーには送信しません。単語リストもサイト内のデータを読み込むだけです。',
    },
    {
      question: '好きな単語に入れ替えたり、一部だけ作り直してもよいですか？',
      answer:
        '気に入らないからと単語を選び直すと、乱数で選んだことによる強度が下がります。語数を増やして、生成結果をそのまま使うのがおすすめです。',
    },
  ],
  en: [
    {
      question: 'How many words should a passphrase have?',
      answer:
        'Each word adds about 12.9 bits of entropy. Six words (about 77 bits) is a good default; use seven or eight for a master password or an encryption key.',
    },
    {
      question: 'Why is the Diceware method secure?',
      answer:
        'Words are picked by random numbers instead of by a person, so strength can be calculated from the word count. Even if an attacker knows the list and the method, the number of combinations from 7,776 words grows exponentially with each word.',
    },
    {
      question: 'Are generated passphrases stored or sent anywhere?',
      answer:
        'No. They are generated in your browser with secure random numbers and are never sent to a server. The word list is just a static file from this site.',
    },
    {
      question: 'Can I swap a word I do not like?',
      answer:
        'Rerolling individual words you dislike reduces the strength that random selection gives you. It is better to add a word or generate a fresh passphrase and use it as is.',
    },
  ],
};
