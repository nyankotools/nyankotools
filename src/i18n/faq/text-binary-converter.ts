import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '同じ文字なのに文字コードで結果が違うのはなぜですか？',
      answer:
        '文字コードは「どの文字をどのバイトで表すか」の取り決めだからです。たとえば「あ」はUTF-8では E3 81 82（3バイト）、Shift_JISでは 82 A0（2バイト）、UTF-16では 30 42（BEの場合）になります。ASCIIの英数字はUTF-8とShift_JISで同じ値になります。',
    },
    {
      question: '数値からテキストに戻すとき、区切りは必要ですか？',
      answer:
        '不要です。空白・カンマ・改行で区切っても、区切りなしで続けて書いても読み取れます。区切りなしの場合は1バイトぶんの桁数（2進数8桁、8進数3桁、16進数2桁）ごとに区切るので、桁数が足りないとエラーになります。0x や \\x の接頭辞も使えます。',
    },
    {
      question: 'Shift_JISに変換すると「?」（3F）になる文字があります。',
      answer:
        'Shift_JISに無い文字（絵文字や一部の記号など）は表現できないため、「?」に置き換えます。該当する文字は結果欄の下に表示されます。そうした文字を含む場合はUTF-8かUTF-16を選んでください。',
    },
    {
      question: '数値からテキストに戻すと「�」が出ます。',
      answer:
        '選んだ文字コードとして解釈できないバイトが含まれているためです。バイト列を作ったときの文字コードと同じものを選んでいるか、一部が抜けていないかを確認してください。',
    },
  ],
  en: [
    {
      question:
        'Why does the same character give different bytes per encoding?',
      answer:
        'An encoding is just an agreement on which bytes stand for which characters. For example, "あ" is E3 81 82 (3 bytes) in UTF-8, 82 A0 (2 bytes) in Shift_JIS, and 30 42 in UTF-16BE. Plain ASCII letters and digits are identical in UTF-8 and Shift_JIS.',
    },
    {
      question: 'Do I need separators when converting numbers back to text?',
      answer:
        'No. Spaces, commas and line breaks all work, and so does one unbroken run. Without separators the input is cut every full byte (8 binary, 3 octal or 2 hex digits), so a missing digit causes an error. 0x and \\x prefixes are accepted too.',
    },
    {
      question: 'Some characters turn into "?" (3F) in Shift_JIS. Why?',
      answer:
        'Shift_JIS has no code for characters such as emoji and some symbols, so they are replaced with "?". The affected characters are listed below the result. Choose UTF-8 or UTF-16 if your text contains them.',
    },
    {
      question: 'Why do I see "�" when converting numbers to text?',
      answer:
        'Some bytes are not valid in the selected encoding. Make sure the encoding matches the one used to create the bytes, and check that no bytes are missing.',
    },
  ],
};
