import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ミニファイするとコードの動作は変わりませんか？',
      answer:
        'ミニファイは空白やコメントなど不要な部分を取り除く処理です。JavaScriptは変数名の短縮なども行いますが、通常は動作が変わりません。HTMLはタグ間の空白が除去されるため、インライン要素の間隔など見た目が変わる場合があります。また構文にエラーがあると意図しない結果になることがあるため、本番配信の前に必ず動作確認をしてください。',
    },
    {
      question: '整形とミニファイの違いは何ですか？',
      answer:
        '整形はインデントや改行を整えてコードを読みやすくする処理で、ミニファイは逆にファイルサイズを小さくするために不要な文字を取り除く処理です。開発中は整形、配信用はミニファイと使い分けます。',
    },
    {
      question: 'コードは外部に送信されますか？',
      answer:
        'いいえ。整形・ミニファイはすべてブラウザ内で実行されるため、入力したコードがサーバーに送信されることはありません。社内コードでも安心して使えます。',
    },
  ],
  en: [
    {
      question: 'Does minifying change how the code behaves?',
      answer:
        'Minifying removes unneeded whitespace and comments. JavaScript is also compressed (for example, variable names are shortened) and normally behaves the same, while HTML loses whitespace between tags, which can change spacing between inline elements. Invalid syntax can produce unexpected output, so always test before deploying.',
    },
    {
      question: 'What is the difference between formatting and minifying?',
      answer:
        'Formatting adds indentation and line breaks to make code readable; minifying removes unnecessary characters to reduce file size. Use formatting while developing and minifying for delivery.',
    },
    {
      question: 'Is my code sent to a server?',
      answer:
        'No. Everything runs in your browser and your code is never uploaded, so it is safe to use with private code.',
    },
  ],
};
