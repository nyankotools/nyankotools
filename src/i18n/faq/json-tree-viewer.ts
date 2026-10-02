import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'コピーしたパスはどう使えますか？',
      answer:
        'JSONPath は $.orders[0].price のような記法で、JSON Path / JSON Pointerテスターや各種ライブラリで値の取り出しに使えます。JSON Pointer は /orders/0/price の形で、JSON PatchやOpenAPIの参照などで使われます。JavaScript 表記はコードに貼って data.orders[0].price のように値へアクセスする用途向けです。',
    },
    {
      question: '大きなJSONでも開けますか？',
      answer:
        '数MB程度までなら、ブラウザ内でそのまま表示できます。ツリーは展開した要素だけを描画するので、閉じたままの部分は重くなりません。「すべて展開」は一定数の要素で止まります。',
    },
    {
      question: '検索ではキーと値のどちらが対象ですか？',
      answer:
        '両方が対象です。キー名と、文字列・数値・真偽値・nullの値に対して、大文字小文字を区別しない部分一致で探します。一致した要素までのツリーが自動で展開されます。',
    },
    {
      question: 'ハイフン入りのキーや日本語のキーはパスでどう表されますか？',
      answer:
        'JSONPath と JavaScript 表記では $["first-name"] のように引用符つきの角括弧で表します。JSON Pointer ではそのまま書き、スラッシュは ~1、チルダは ~0 にエスケープします。',
    },
  ],
  en: [
    {
      question: 'How can I use the copied path?',
      answer:
        'JSONPath such as $.orders[0].price works in the JSON Path / JSON Pointer Tester and many libraries for extracting values. JSON Pointer such as /orders/0/price is used by JSON Patch and OpenAPI references. The JavaScript notation, like data.orders[0].price, can be pasted into code to access the value.',
    },
    {
      question: 'Can it open large JSON files?',
      answer:
        'JSON up to a few megabytes displays fine in the browser. The tree renders only the nodes you expand, so collapsed parts add no load. "Expand all" stops after a fixed number of nodes.',
    },
    {
      question: 'Does search look at keys or values?',
      answer:
        'Both. It finds case-insensitive substrings in key names and in string, number, boolean, and null values. The tree is expanded automatically down to each match.',
    },
    {
      question: 'How are hyphenated or non-ASCII keys written in a path?',
      answer:
        'JSONPath and JavaScript notation use quoted brackets, such as $["first-name"]. JSON Pointer writes the key as is, escaping a slash as ~1 and a tilde as ~0.',
    },
  ],
};
