import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '伝統色のカラーコードは公式の値ですか？',
      answer:
        'いいえ。伝統色には統一された公式のカラーコードはなく、資料によって色味が異なります。ここに載せたHEXは代表的な近似値です。',
    },
    {
      question: '色名の読み方やローマ字でも検索できますか？',
      answer:
        'はい。漢字の色名のほか、ひらがな・カタカナの読み、ローマ字（sakura など）、HEX（#の有無は問いません）で検索できます。',
    },
    {
      question: '見つけた色をCSSやデザインツールで使うには？',
      answer:
        '色のカードを押すとHEXをコピーできます。そのままCSSやデザインツールに貼り付けてください。RGBやHSLが必要な場合はカラーコード変換ツールで変換できます。',
    },
    {
      question: '画面の色と印刷の色は同じになりますか？',
      answer:
        '同じになるとは限りません。画面は光の三原色（RGB）、印刷はインク（CMYK）で表現するため、特に鮮やかな色は印刷でくすむことがあります。',
    },
  ],
  en: [
    {
      question: 'Are the HEX codes the official values for these colors?',
      answer:
        'No. Traditional colors have no single official code, and sources differ. The HEX values here are common approximations.',
    },
    {
      question: 'Can I search by reading or romaji as well as the name?',
      answer:
        'Yes. You can search by the kanji name, the hiragana or katakana reading, romaji (such as "sakura"), or the HEX code with or without the #.',
    },
    {
      question: 'How do I use a color in CSS or a design tool?',
      answer:
        'Click a color card to copy its HEX and paste it straight into CSS or your design tool. If you need RGB or HSL, convert it with the Color Converter.',
    },
    {
      question: 'Will the color look the same in print?',
      answer:
        'Not necessarily. Screens mix red, green and blue light while print uses ink (CMYK), so vivid colors can look duller on paper.',
    },
  ],
};
