import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'XMLの属性はJSONでどう表されますか？',
      answer:
        '属性は「@_」を付けたキー（例: "@_id"）になり、同じ要素内のテキストは「#text」キーになります。JSON→XMLでも同じ表記を読み取るので、往復して元の構造に戻せます。',
    },
    {
      question:
        '同じ名前の要素が1つのときと複数のときで、結果の形が変わるのはなぜですか？',
      answer:
        'XMLには配列の概念がないため、同名の要素が複数ある場合だけ配列になります。1つだけの要素は配列にならないので、要素数が変わりうるデータを扱うときは、受け取る側で配列と単一値の両方を想定してください。',
    },
    {
      question: '数字が文字列になってしまいます。',
      answer:
        '既定では値をすべて文字列として扱い、郵便番号の先頭の0などが失われないようにしています。「数値・true/falseをJSONの型に変換する」にチェックを入れると、数値や真偽値になります。',
    },
    {
      question: 'XMLのコメントやXML宣言は残りますか？',
      answer:
        'いいえ。コメント・処理命令・XML宣言は変換時に失われます。JSON→XMLでもXML宣言は付かないため、必要な場合は先頭に手で追加してください。',
    },
  ],
  en: [
    {
      question: 'How are XML attributes represented in JSON?',
      answer:
        'Attributes become keys prefixed with "@_" (for example "@_id"), and text inside the same element becomes the "#text" key. JSON→XML reads the same notation, so you can round-trip the structure.',
    },
    {
      question:
        'Why does the result change shape when an element appears once or several times?',
      answer:
        'XML has no array type, so only repeated elements with the same name become an array. A single element stays a single value, so when the number of elements can vary, handle both an array and a single value on the receiving side.',
    },
    {
      question: 'Why are my numbers strings?',
      answer:
        'By default every value stays a string so leading zeros such as in postal codes are not lost. Check "Convert numbers and true/false to JSON types" to get numbers and booleans.',
    },
    {
      question: 'Are XML comments and the XML declaration kept?',
      answer:
        'No. Comments, processing instructions, and the XML declaration are dropped during conversion. JSON→XML does not add a declaration either, so add one by hand if you need it.',
    },
  ],
};
