import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '1文は何文字までが読みやすいですか？',
      answer:
        '一般に日本語の1文は40〜60文字程度までが読みやすいとされます。このツールの既定の上限は60文字で、「1文の長さの上限（文字）」から変更できます。専門的な文書や法律文書では長めになるため、目的に合わせて調整してください。',
    },
    {
      question: '漢字率はどのくらいが適切ですか？',
      answer:
        '漢字・ひらがな・カタカナの合計に占める漢字の割合で、15〜40%程度が目安です。高すぎると堅く読みにくく、低すぎると意味の切れ目が分かりにくくなります。日本語が30文字に満たない場合は評価しません。',
    },
    {
      question: '同じ文末が続くとなぜ指摘されるのですか？',
      answer:
        '「〜です。〜です。〜です。」のように同じ文末が3文以上続くと単調で幼い印象になりやすいためです。文末を「です」「ます」「だ」「ない」などの表現で分類し、連続する文をまとめて指摘します。',
    },
    {
      question: '英語の文章も診断できますか？',
      answer:
        '基本的な診断はできますが、日本語向けに調整されています。日本語を含まない文は語数の3倍を文字数相当として長さを判定し、文末の重複と漢字率は評価しません。接続詞の連続と読点の数は英文でも判定します。',
    },
  ],
  en: [
    {
      question: 'How long should a sentence be?',
      answer:
        'Japanese sentences are generally easy to read up to roughly 40 to 60 characters. The default limit here is 60, and you can change it with the max sentence length field. Technical and legal writing often runs longer, so adjust it to fit your purpose.',
    },
    {
      question: 'What is a good kanji ratio?',
      answer:
        'The ratio is kanji divided by kanji, hiragana and katakana combined, and about 15 to 40% is a common guideline. Too high feels stiff and dense; too low makes word boundaries hard to see. Text with fewer than 30 Japanese characters is not evaluated.',
    },
    {
      question: 'Why are repeated sentence endings flagged?',
      answer:
        'Three or more sentences in a row ending the same way (for example three in a row ending in です) sound monotonous. The tool groups endings such as です, ます, だ and ない and flags the whole run.',
    },
    {
      question: 'Does it work for English text?',
      answer:
        'Partly. It is tuned for Japanese. For sentences without Japanese characters, length is estimated as three times the word count, and ending repetition and kanji ratio are skipped. Conjunction runs and comma counts are still checked.',
    },
  ],
};
