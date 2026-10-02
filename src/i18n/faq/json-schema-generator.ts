import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        '配列の中のオブジェクトで、キーが揃っていない場合はどうなりますか？',
      answer:
        '配列内のすべてのオブジェクトを1つのスキーマに統合します。properties にはすべてのキーを載せ、全オブジェクトにあるキーだけを required にします。',
    },
    {
      question: '生成されたスキーマはそのまま本番で使えますか？',
      answer:
        'サンプルから推測できる型と構造までが対象です。列挙値、文字数・数値の範囲、正規表現パターンなどはサンプルからは分からないので、仕様に合わせて追記してから使ってください。',
    },
    {
      question: 'draft 2020-12・2019-09・07の違いは何ですか？',
      answer:
        'このツールが出力するスキーマの範囲（type・properties・required・items・format）では、どのドラフトでも内容は同じで、$schema の値だけが変わります。使っている検証ライブラリが対応するドラフトを選んでください。',
    },
    {
      question: 'nullが混ざった値はどう表されますか？',
      answer:
        '同じ位置に文字列とnullが現れた場合は、"type": ["null", "string"] のように型の配列で表します。',
    },
  ],
  en: [
    {
      question: 'What happens when objects in an array have different keys?',
      answer:
        'All objects in the array are merged into one schema. Every key is listed under properties, and only keys present in every object are marked required.',
    },
    {
      question: 'Can I use the generated schema in production as is?',
      answer:
        'It covers what can be inferred from the sample: types and structure. Enums, length or numeric ranges, and regex patterns cannot be guessed from a sample, so add them to match your spec first.',
    },
    {
      question:
        'What is the difference between draft 2020-12, 2019-09, and 07?',
      answer:
        'For the keywords this tool emits (type, properties, required, items, format), the schema is identical across drafts; only the $schema value changes. Pick the draft your validator library supports.',
    },
    {
      question: 'How are values that can be null represented?',
      answer:
        'When a string and null appear at the same position, the type becomes an array such as "type": ["null", "string"].',
    },
  ],
};
