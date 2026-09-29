import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '漢字や英数字はどうなりますか？',
      answer:
        '変換対象はひらがなとカタカナだけで、漢字や英数字、記号などはそのまま維持されます。',
    },
    {
      question: '濁音や「ヴ」、踊り字にも対応していますか？',
      answer:
        'はい。濁音・半濁音・拗音・促音のほか、「ゔ」「ヴ」や踊り字（ゝゞ／ヽヾ）にも対応しています。',
    },
    {
      question: '半角カタカナも変換できますか？',
      answer:
        '半角カタカナは全角/半角変換ツールで全角にしてから変換してください。',
    },
  ],
  en: [
    {
      question: 'What happens to kanji and alphanumerics?',
      answer:
        'Only hiragana and katakana are converted. Kanji, letters, digits and symbols are left unchanged.',
    },
    {
      question: 'Are voiced sounds, "vu" and iteration marks supported?',
      answer:
        'Yes. Voiced and semi-voiced sounds, small kana, "ゔ/ヴ" and iteration marks (ゝゞ/ヽヾ) are supported.',
    },
    {
      question: 'Can it convert half-width katakana?',
      answer:
        'Convert half-width katakana to full-width first with the full-width/half-width converter, then use this tool.',
    },
  ],
};
