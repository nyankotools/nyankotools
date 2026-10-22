import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '読みを自動で付けてくれますか？',
      answer:
        'いいえ。辞書を使った自動付与は行わず、入力した読みをそのままrubyタグにします。読みは《》の中に自分で書いてください。',
    },
    {
      question: '「漢字《かんじ》」と「｜親文字《ルビ》」の違いは？',
      answer:
        '《の直前にある漢字の連続が親文字になるのが前者です。ひらがな・カタカナ・英字に読みを付けたい場合や、漢字の途中から付けたい場合は、親文字の先頭に ｜ を置く後者を使います。',
    },
    {
      question: '<rp>タグは付けたほうがよいですか？',
      answer:
        'rubyに対応していない古い環境では、rpがあると読みが（）付きで表示されます。現在のブラウザでは通常不要ですが、互換性を重視する場合はオンにしてください。',
    },
    {
      question: '《》が変換されずにそのまま残るのはなぜですか？',
      answer:
        '直前に漢字も ｜ もない場合、読みが空の場合、閉じ括弧がない場合、改行をまたぐ場合は変換されません。記法を見直してください。',
    },
  ],
  en: [
    {
      question: 'Does it add readings automatically?',
      answer:
        'No. It does not use a dictionary; whatever you type inside 《》 becomes the ruby text. You supply the readings yourself.',
    },
    {
      question:
        'What is the difference between 漢字《かんじ》 and ｜base《ruby》?',
      answer:
        'With the first form, the run of kanji right before 《 is the base. Use ｜ at the start of the base when annotating kana, letters, or only part of a kanji run.',
    },
    {
      question: 'Should I include <rp> tags?',
      answer:
        'In older environments without ruby support, <rp> makes the reading appear in parentheses. Modern browsers rarely need it, but turn it on for maximum compatibility.',
    },
    {
      question: 'Why is my 《》 left as plain text?',
      answer:
        'It is left alone when no kanji or ｜ precedes it, the reading is empty, the closing 》 is missing, or it spans a line break. Check the notation.',
    },
  ],
};
