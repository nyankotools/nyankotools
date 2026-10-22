import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'キーをソートしても配列の順番は変わりますか？',
      answer:
        '変わりません。ソートの対象はオブジェクトのキーだけで、配列の要素の順序は常に保持されます。再帰オンのときは、配列の中にあるオブジェクトのキーも並べ替えます。',
    },
    {
      question: 'フラット化したキーに「.」が含まれているとどうなりますか？',
      answer:
        'ドット・括弧・空白を含むキーや空のキー、数字だけのキーは ["a.b"] のようなブラケット表記になり、復元すると元のキーに戻ります。a.b と ["a.b"] は別物として区別されます。',
    },
    {
      question: '桁数の多い整数は丸められませんか？',
      answer:
        '丸められません。数値は入力の表記のまま出力します。ただし、このツールの結果を別のプログラムで読み込むとき、JavaScriptなどでは15〜17桁を超える整数が丸められる点には注意してください。',
    },
    {
      question: 'unflattenで「矛盾しています」と表示されるのはなぜですか？',
      answer:
        '"a": 1 と "a.b": 2 のように、同じ場所が値でもあり親でもある場合や、"a[0]" と "a.b" のように配列とオブジェクトが混在する場合は、一意に復元できないためエラーにしています。',
    },
  ],
  en: [
    {
      question: 'Does sorting keys change the order of arrays?',
      answer:
        'No. Only object keys are sorted; the order of array elements is always preserved. With recursion on, objects inside arrays still get their keys sorted.',
    },
    {
      question: 'What happens to keys that contain a dot when flattening?',
      answer:
        'Keys with dots, brackets or spaces, empty keys and digit-only keys are written in bracket form such as ["a.b"], and unflattening restores the original key. a.b and ["a.b"] are kept distinct.',
    },
    {
      question: 'Are long integers rounded?',
      answer:
        'No. Numbers are written exactly as they appear in the input. Be aware, though, that JavaScript and some other programs round integers beyond 15 to 17 digits when they read the result.',
    },
    {
      question: 'Why does unflatten report a conflict?',
      answer:
        'It happens when a location is both a value and a parent, as with "a": 1 and "a.b": 2, or when array and object are mixed, as with "a[0]" and "a.b". These cannot be rebuilt unambiguously.',
    },
  ],
};
