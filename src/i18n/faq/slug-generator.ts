import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '漢字を含むタイトルはローマ字にできますか？',
      answer:
        'できません。漢字は文脈で読みが変わるため、このツールは漢字を読み仮名に直せません。「取り除く」にすると漢字部分が消え、「そのまま残す」にすると漢字が残ります。ひらがな・カタカナ部分だけがローマ字になるので、漢字を含むタイトルは英語やローマ字に書き直してから入力してください。',
    },
    {
      question: 'スラッグにはハイフンとアンダースコアのどちらが良いですか？',
      answer:
        'SEOではハイフン区切りが一般的で、Googleも単語の区切りとして扱うと説明しています。特別な理由がなければハイフンを選んでください。',
    },
    {
      question: 'スラッグは何文字くらいが適切ですか？',
      answer:
        '決まった上限はありませんが、短くて内容が分かる50〜60文字程度に収めるのが一般的です。最大文字数を指定すると、単語の途中で切らず直前の区切りで切ることもできます。',
    },
    {
      question: 'テキストケース変換のkebab-caseとの違いは何ですか？',
      answer:
        'テキストケース変換は英語の識別子を単語に分けて並べ替えるだけです。このツールはさらに、日本語のかなをローマ字にし、記号を取り除き、文字数の制限までかけて、URLにそのまま使える文字列にします。',
    },
  ],
  en: [
    {
      question: 'Can it turn kanji into romaji?',
      answer:
        'No. Kanji readings depend on context, so the tool cannot convert them. Choose "Remove" to drop kanji or "Keep as is" to leave them. Only hiragana and katakana become romaji, so rewrite kanji titles in English or romaji first.',
    },
    {
      question: 'Should a slug use hyphens or underscores?',
      answer:
        'Hyphens are the usual choice for SEO, and Google treats them as word separators. Pick hyphens unless you have a specific reason not to.',
    },
    {
      question: 'How long should a slug be?',
      answer:
        'There is no fixed limit, but short and descriptive, around 50 to 60 characters, is common. With a max length set, the tool can cut at the previous separator rather than mid-word.',
    },
    {
      question: 'How is this different from kebab-case in the case converter?',
      answer:
        'The case converter only splits identifiers into words and rejoins them. This tool also romanizes Japanese kana, strips symbols and applies a length limit, so the result is ready to use in a URL.',
    },
  ],
};
