import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        '1つの絵文字なのに複数のコードポイントが表示されるのはなぜですか？',
      answer:
        '家族の絵文字（👨‍👩‍👧）や肌色つきの絵文字は、複数の絵文字をZWJ（U+200D）や肌色修飾子でつないで1つに見せています。このツールはそれらをコードポイント単位に分解して表示し、「見た目の文字数」では1文字として数えます。',
    },
    {
      question: 'UTF-8とUTF-16のバイト列はどう違いますか？',
      answer:
        '同じコードポイントでも符号化方式で並びが変わります。「あ」(U+3042) はUTF-8では E3 81 82 の3バイト、UTF-16では 3042 の1ユニット（2バイト）です。UTF-16でU+FFFFを超える文字は、サロゲートペアの2ユニットになります。',
    },
    {
      question: '文字の名前（例: HIRAGANA LETTER A）は表示されますか？',
      answer:
        '文字名の巨大なデータベースは読み込まないため、ASCII・制御文字・ZWJなどの不可視文字・国旗の地域指示子など、ごく一部にだけ名称を表示します。それ以外もカテゴリ・スクリプト・ブロックで種類を確認できます。',
    },
    {
      question: 'U+3042 以外の書き方でも文字を調べられますか？',
      answer:
        '「コードポイント → 文字」では U+3042・0x3042・\\u{3042}・&#x3042;・3042 を受け付け、スペース・カンマ・改行で区切って複数入力できます。U+10FFFFを超える値は無効です。',
    },
  ],
  en: [
    {
      question: 'Why does one emoji show up as several code points?',
      answer:
        'Family emoji (👨‍👩‍👧) and skin-toned emoji are built from several emoji glued together with a ZWJ (U+200D) or a skin-tone modifier. This tool lists each code point separately, while "Visible characters" counts the whole sequence as one.',
    },
    {
      question: 'How do the UTF-8 and UTF-16 bytes differ?',
      answer:
        'The same code point is laid out differently in each encoding. "あ" (U+3042) is three bytes in UTF-8 (E3 81 82) but a single 16-bit unit in UTF-16 (3042). Characters above U+FFFF become a two-unit surrogate pair in UTF-16.',
    },
    {
      question: 'Does it show official character names like HIRAGANA LETTER A?',
      answer:
        'No large name database is loaded, so names are shown only for a small set such as ASCII, control characters, invisible characters like ZWJ, and regional indicators. Everything else still gets its category, script and block.',
    },
    {
      question: 'Which code point formats can I enter?',
      answer:
        'In "Code points → Text" mode you can use U+3042, 0x3042, \\u{3042}, &#x3042; or plain 3042, separated by spaces, commas or new lines. Values above U+10FFFF are rejected.',
    },
  ],
};
