import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '機種依存文字とは何ですか？なぜ問題になりますか？',
      answer:
        '丸数字（①）やローマ数字（Ⅰ）、㈱などの、環境によって表示できない文字です。メールやWebフォームで、相手の端末やシステムによっては文字化けして「?」になることがあります。',
    },
    {
      question: 'すべての環境依存文字を検出できますか？',
      answer:
        'できません。検出対象はNEC特殊文字やNEC選定IBM拡張文字など代表的なものです。すべてを網羅しているわけではないため、重要な文書は別途確認してください。',
    },
    {
      question: '「髙」などの異体字も置き換えたほうがよいですか？',
      answer:
        '人名や地名では正式な表記として使われていることがあるため、機械的な置き換えは注意が必要です。置き換え候補は一般的な目安として、内容を確認してから使ってください。',
    },
  ],
  en: [
    {
      question:
        'What are platform-dependent characters and why are they a problem?',
      answer:
        'They are characters such as circled numbers (①), Roman numerals (Ⅰ) and ㈱ that may not display in every environment. In emails or web forms they can turn into "?" on the recipient\'s system.',
    },
    {
      question: 'Does it detect every environment-dependent character?',
      answer:
        'No. It covers representative sets such as NEC special characters and NEC-selected IBM extensions, not everything. Check important documents separately.',
    },
    {
      question: 'Should variant kanji such as 髙 be replaced too?',
      answer:
        'These can be the correct spelling in personal or place names, so blind replacement can be wrong. Treat suggestions as a guide and review the result.',
    },
  ],
};
