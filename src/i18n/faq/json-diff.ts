import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'キーの順序が違うだけのJSONは差分になりますか？',
      answer:
        'なりません。オブジェクトのキーの順序は無視して、同じキーの値どうしを比べます。インデントや改行などの整形の違いも差分になりません。',
    },
    {
      question: '配列の要素の順番が違う場合はどうなりますか？',
      answer:
        '既定では同じ位置の要素どうしを比べるため、並びが違えば変更として表示されます。「配列の並び順を無視する」をオンにすると、同じ値の要素を対応づけて比較し、並べ替えだけなら差分になりません。',
    },
    {
      question: '差分のパスの見方を教えてください。',
      answer:
        '$ がJSON全体のルートです。$.user.name はuserオブジェクトのnameキー、$.items[2] はitems配列の3番目の要素を表します。ハイフンなど識別子にできないキーは $["first-name"] のように表示します。',
    },
    {
      question: '大きなJSONや深くネストしたJSONも比較できますか？',
      answer:
        '数MB程度までのJSONは、ブラウザ内でそのまま比較できます。ネストが極端に深い場合は、処理できない旨のエラーを表示します。',
    },
  ],
  en: [
    {
      question: 'Does a different key order count as a difference?',
      answer:
        'No. Object keys are compared without regard to order, matching values by key. Formatting differences such as indentation and line breaks do not count either.',
    },
    {
      question: 'What if array items are in a different order?',
      answer:
        'By default, items at the same position are compared, so a reordered array shows as changes. Turn on "Ignore array order" to match items by value; a pure reorder then produces no differences.',
    },
    {
      question: 'How do I read the paths in the results?',
      answer:
        '$ is the root of the whole document. $.user.name is the name key of the user object, and $.items[2] is the third element of the items array. Keys that are not plain identifiers, such as ones with hyphens, appear as $["first-name"].',
    },
    {
      question: 'Can it compare large or deeply nested JSON?',
      answer:
        'JSON up to a few megabytes compares fine in the browser. If the nesting is extremely deep, an error message tells you it cannot be processed.',
    },
  ],
};
