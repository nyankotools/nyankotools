import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '変換結果は正しいカタカナ表記ですか？',
      answer:
        '目安です。綴りのパターンと頻出語の辞書で変換する簡易版のため、実際に使われている表記と異なる場合があります（例: 辞書にない語の発音の揺れ）。公式な表記が必要なときは、元の公式情報を確認してください。',
    },
    {
      question: '「knife」や「people」のような不規則な綴りは変換できますか？',
      answer:
        '約300語の頻出語・IT用語・英語圏の一般的な名前は辞書で正しく変換します。辞書にない不規則な綴りの語は、ルールでの推測になり、正しい発音にならないことがあります。',
    },
    {
      question: '英語圏の人名は変換できますか？',
      answer:
        'John・Mary・Smith など、一般的な名前と姓（約180語）は辞書で変換します。それ以外の名前は綴りのルールでの推測になるため、本人や公式の表記を確認してください。',
    },
    {
      question: '「USB」「HTML」はどう変換されますか？',
      answer:
        '「略語は文字読みにする」をオンにすると、全て大文字の2〜4文字の語を ユーエスビー・エイチティーエムエル のように文字ごとに読みます。オフにすると、普通の単語と同じく綴りのルールで変換します。',
    },
    {
      question: '「ヴ」を使った表記にできますか？',
      answer:
        '「v の音」で選べます。バ行にすると video がビデオ、ヴにするとヴィデオになります。',
    },
  ],
  en: [
    {
      question: 'Is the result the correct katakana spelling?',
      answer:
        'It is a rough guide. The tool uses spelling patterns plus a dictionary of common words, so some results differ from the katakana actually in use. For an official spelling, check the original source.',
    },
    {
      question: 'Can it handle irregular words like "knife" or "people"?',
      answer:
        'About 300 common words, IT terms and common English first and last names are in the dictionary and convert correctly. Irregular words outside it are guessed by rules and may come out wrong.',
    },
    {
      question: 'Can it convert English personal names?',
      answer:
        'Common first and last names such as John, Mary and Smith (about 180) are in the dictionary. Other names are guessed from spelling, so check the person’s own or official katakana spelling.',
    },
    {
      question: 'How are acronyms like USB or HTML converted?',
      answer:
        'With "Spell out acronyms" on, all-caps words of 2 to 4 letters are read letter by letter (ユーエスビー, エイチティーエムエル). With it off, they are converted by spelling rules like any other word.',
    },
    {
      question: 'Can I use ヴ in the result?',
      answer:
        'Yes, with "Sound of v". The B-row gives ビデオ for video, and ヴ gives ヴィデオ.',
    },
  ],
};
