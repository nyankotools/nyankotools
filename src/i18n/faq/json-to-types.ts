import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'TypeScript以外にどの言語の型を生成できますか？',
      answer:
        'C#（クラス）、Go（構造体とjsonタグ）、Python（dataclass）、Java（record）に対応しています。出力する言語は画面上のボタンで切り替えます。どの言語でも、ネストしたオブジェクトは別の型として切り出します。',
    },
    {
      question: '数値は整数と小数をどう区別しますか？',
      answer:
        'TypeScript以外の言語では、サンプルの値に小数点があれば小数（double / float64 / float）、なければ整数（long / int64 / int）にします。配列内で整数と小数が混在する場合は小数として扱います。サンプルでは整数でも実際は小数になる項目は手で直してください。',
    },
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
  ],
  en: [
    {
      question: 'Which languages besides TypeScript can it generate?',
      answer:
        'C# classes, Go structs with json tags, Python dataclasses, and Java records. Switch the output language with the buttons on the page. In every language, nested objects become their own types.',
    },
    {
      question: 'How are integers and decimals told apart?',
      answer:
        'For languages other than TypeScript, a value with a decimal point becomes a floating-point type (double / float64 / float) and one without becomes an integer type (long / int64 / int). If an array mixes both, it is treated as floating-point. Fix fields by hand if a value that is an integer in your sample can really be fractional.',
    },
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
  ],
};
