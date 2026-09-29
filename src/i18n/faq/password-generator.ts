import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どれくらいの長さのパスワードが安全ですか？',
      answer:
        '一般的には12〜16文字以上で、大文字・小文字・数字・記号を組み合わせると推測されにくくなります。長いほど安全性が上がるため、サービスが許すなら長めにするのがおすすめです。',
    },
    {
      question: '生成したパスワードは保存・送信されますか？',
      answer:
        'いいえ。ブラウザの暗号学的乱数生成機能（Web Crypto API）を使ってブラウザ内で生成し、サーバーに送信されることはありません。生成後は忘れずにパスワードマネージャーなどに保管してください。',
    },
    {
      question: '「紛らわしい文字を除外」は何のための機能ですか？',
      answer:
        'l（小文字のエル）と1、I（大文字のアイ）、Oと0など、見間違えやすい文字を除外します。手入力したり、紙に書き写したりする場面で入力ミスを減らせます。',
    },
  ],
  en: [
    {
      question: 'How long should a secure password be?',
      answer:
        'Generally 12 to 16 characters or more, mixing upper and lower case, digits and symbols. Longer is stronger, so use longer passwords where the service allows.',
    },
    {
      question: 'Are generated passwords stored or sent?',
      answer:
        'No. They are generated in your browser with the Web Crypto API and never sent to a server. Save them in a password manager right after generating.',
    },
    {
      question: 'What does "exclude similar characters" do?',
      answer:
        'It removes look-alike characters such as l, 1, I, O and 0, which reduces typing mistakes when entering or copying a password by hand.',
    },
  ],
};
