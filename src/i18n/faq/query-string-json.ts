import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'b[]・b[0]・b=1&b=2 のどれで書かれた配列も読み込めますか？',
      answer:
        '読み込めます。クエリ文字列からJSONへの変換では3種類の表記を自動で判別し、どれも同じ配列になります。JSONからクエリ文字列へ出力するときだけ、表記を選びます。',
    },
    {
      question: '数値や true が文字列の "1"・"true" になるのはなぜですか？',
      answer:
        'クエリ文字列には型の情報がないためです。「数値・true/false・null を型変換する」をオンにすると 1 や true に変換します。ただし 007 や 1e3、15桁を超える整数は元の値を守るため文字列のままです。',
    },
    {
      question: '+ はスペースとして扱われますか？',
      answer:
        '既定では + をスペースに変換します（フォーム送信の形式）。URLのパス部分と同じように + を文字として残したいときは、オプションをオフにしてください。%20 は常にスペースです。',
    },
    {
      question: 'オブジェクトを含む配列は、なぜ b[0][name] になるのですか？',
      answer:
        'b[][name]=x&b[][name]=y のように書くと、要素の区切りが分からなくなるためです。構造を正しく戻せるよう、オブジェクトを含む配列は添字表記で出力します。',
    },
    {
      question: '__proto__ というキーを入れても安全ですか？',
      answer:
        '安全です。プロトタイプを持たないオブジェクトに格納するため、共通のオブジェクトを書き換えることはなく、__proto__ も普通のキーとして出力されます。',
    },
  ],
  en: [
    {
      question: 'Can it read arrays written as b[], b[0] or b=1&b=2?',
      answer:
        'Yes. When converting a query string to JSON, all three styles are detected automatically and give the same array. You only choose a style when writing a query string from JSON.',
    },
    {
      question:
        'Why do numbers and true come out as the strings "1" and "true"?',
      answer:
        'A query string carries no type information. Turn on the type conversion option to get 1 and true. Values such as 007, 1e3 and integers over 15 digits stay strings so the original text is not altered.',
    },
    {
      question: 'Is + treated as a space?',
      answer:
        'By default yes, as in form submissions. If you need a literal + like in a URL path, turn the option off. %20 is always a space.',
    },
    {
      question: 'Why are arrays of objects written as b[0][name]?',
      answer:
        'With b[][name]=x&b[][name]=y it would be impossible to tell where one element ends and the next begins. Index notation keeps the structure recoverable.',
    },
    {
      question: 'Is a key named __proto__ safe?',
      answer:
        'Yes. Results are stored in objects without a prototype, so shared objects cannot be modified, and __proto__ is just an ordinary key in the output.',
    },
  ],
};
