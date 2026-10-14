import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '漢字は点字に変換できますか？',
      answer:
        'いいえ。このツールはかな文字と数字だけを変換します。漢字や英字はそのまま残るので、先にひらがなに直してから変換してください。',
    },
    {
      question:
        '「は」や「へ」が助詞のとき、「わ」「え」にならないのはなぜですか？',
      answer:
        '本ツールは文章の意味を解析せず、文字を1つずつ点字に置き換えるためです。助詞の「は」「へ」を「わ」「え」と書く点字の決まりや、分かち書きは自動では行いません。',
    },
    {
      question: '数字の後にかなが続くとき、間に入る記号は何ですか？',
      answer:
        '数符（点3・4・5・6）の後に数字を並べ、その直後に「あ行」「ら行」のかなが続く場合は、数字と区別するためにつなぎ符（点3・6）を自動で挿入します。',
    },
    {
      question: '8点点字には対応していますか？',
      answer:
        'かな→点字では6点点字（Unicodeの点字パターン）を出力します。点字→かなでは6点の範囲を解釈し、点7・8を含むセルはそのまま残します。',
    },
  ],
  en: [
    {
      question: 'Can it convert kanji to braille?',
      answer:
        'No. Only kana and digits are converted. Kanji and Latin letters are left as they are, so rewrite kanji in hiragana first.',
    },
    {
      question: 'Why are the particles は and へ not written as わ and え?',
      answer:
        'The tool does not analyze meaning; it replaces characters one by one. Braille rules such as writing the particles は and へ as わ and え, and word spacing, are not applied automatically.',
    },
    {
      question: 'What cell appears between a number and the kana after it?',
      answer:
        'A number sign (dots 3-4-5-6) precedes digits. If an あ-row or ら-row kana directly follows a number, a connector (dots 3-6) is inserted to tell them apart from digits.',
    },
    {
      question: 'Does it support eight-dot braille?',
      answer:
        'Kana → braille outputs six-dot patterns as Unicode braille characters. Braille → kana reads the six-dot range and leaves cells with dots 7 or 8 unchanged.',
    },
  ],
};
