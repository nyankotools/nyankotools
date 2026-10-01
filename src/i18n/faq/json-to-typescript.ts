import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        '配列の中のオブジェクトで、キーが揃っていない場合はどうなりますか？',
      answer:
        '配列内のすべてのオブジェクトを1つの型に統合します。一部の要素にしか存在しないキーは、省略可能なプロパティ（?付き）になります。',
    },
    {
      question: 'nullや空配列はどんな型になりますか？',
      answer:
        'nullの値は null 型、空配列は要素の型が分からないため unknown[] になります。実際のAPI仕様に合わせて、string | null のように手で書き換えてください。',
    },
    {
      question: 'キー名がハイフン入りや数字の場合も使えますか？',
      answer:
        'はい。"first-name" のようにTypeScriptの識別子として使えないキーは、引用符付きのプロパティとして出力します。ネストしたオブジェクトの型名は、キー名をPascalCaseにして付けます。',
    },
    {
      question: 'interfaceとtypeのどちらを選ぶべきですか？',
      answer:
        'オブジェクトの形を表すだけなら、どちらでも同じように使えます。拡張（extends）や宣言のマージを使うならinterface、ユニオン型などと組み合わせるならtypeが向きます。チームの規約に合わせて選んでください。',
    },
  ],
  en: [
    {
      question: 'What happens when objects in an array have different keys?',
      answer:
        'All objects in the array are merged into one type. Keys that appear in only some of them become optional properties (marked with ?).',
    },
    {
      question: 'What types do null and empty arrays get?',
      answer:
        'A null value becomes the null type, and an empty array becomes unknown[] because its element type cannot be inferred. Edit them to match your real API, for example string | null.',
    },
    {
      question: 'Does it work with keys that contain hyphens or digits?',
      answer:
        'Yes. Keys that are not valid TypeScript identifiers, such as "first-name", are emitted as quoted properties. Nested object types are named after the key in PascalCase.',
    },
    {
      question: 'Should I choose interface or type?',
      answer:
        'For plain object shapes they work the same way. Use interface if you rely on extends or declaration merging, and type if you combine the result with unions and other type operators. Follow your team convention.',
    },
  ],
};
