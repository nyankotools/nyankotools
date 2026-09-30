import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'JSONPathとJSON Pointerはどう使い分けますか？',
      answer:
        'JSONPathはフィルタ式やワイルドカードで複数の値をまとめて取り出せます。JSON Pointerは1か所だけを指す記法で、結果は常に単一の値（またはエラー）です。複数の値が欲しいときはJSONPathを選んでください。',
    },
    {
      question: 'フィルタ式や再帰下降（..）は使えますか？',
      answer:
        'はい。[?(@.price>10)] のようなフィルタ式や、.. による再帰下降にも対応しています。実装はjsonpath-plusライブラリに準拠しており、他のライブラリやjqとは細部の挙動が異なる場合があります。',
    },
    {
      question: 'OpenAPIの$refのように「#/」で始まるポインタも使えますか？',
      answer:
        'はい。JSON Pointerの先頭に # が付いた形式（例: #/components/schemas/Foo）も、# を読み飛ばして解釈します。',
    },
  ],
  en: [
    {
      question: 'When should I use JSONPath versus JSON Pointer?',
      answer:
        'JSONPath supports filters and wildcards and can return several values at once. JSON Pointer addresses exactly one location, so the result is always a single value or an error. Use JSONPath when you need multiple values.',
    },
    {
      question: 'Are filter expressions and recursive descent (..) supported?',
      answer:
        'Yes. Filters such as [?(@.price>10)] and recursive descent with .. work. The implementation follows the jsonpath-plus library, so details may differ from other libraries or jq.',
    },
    {
      question:
        'Can I use pointers starting with "#/" such as OpenAPI $ref values?',
      answer:
        'Yes. A leading # is skipped, so values like #/components/schemas/Foo work as JSON Pointers.',
    },
  ],
};
