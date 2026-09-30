import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Lorem ipsumとは何ですか？',
      answer:
        'デザインや組版の確認に使われる、意味を持たない定番のダミーテキストです。文章の内容に気を取られず、レイアウトや文字量だけを検討できます。',
    },
    {
      question:
        '日本語のダミーテキストで単語単位の生成ができないのはなぜですか？',
      answer:
        '日本語は単語の区切りが不自然になるため、段落と文の単位のみ選択できます。欧文のLorem ipsumでは段落・文・単語から選べます。',
    },
    {
      question: '生成される文章は毎回同じですか？',
      answer:
        'いいえ、内容はランダムに生成されます。実際に意味のある文章ではないため、デザインや文字量の確認用としてお使いください。',
    },
  ],
  en: [
    {
      question: 'What is Lorem ipsum?',
      answer:
        'It is standard placeholder text with no meaning, used to evaluate layout and typography without being distracted by the actual content.',
    },
    {
      question: "Why can't Japanese placeholder text be generated per word?",
      answer:
        'Word boundaries are unnatural in Japanese, so only paragraphs and sentences are offered. The Latin Lorem ipsum supports paragraphs, sentences and words.',
    },
    {
      question: 'Is the generated text the same every time?',
      answer:
        'No, it is generated randomly. It is not meaningful text, so use it for checking design and text volume.',
    },
  ],
};
