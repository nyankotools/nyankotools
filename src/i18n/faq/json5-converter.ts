import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'JSON5とJSONの違いは何ですか？',
      answer:
        'JSON5はJSONの上位互換で、コメント、末尾カンマ、クォート無しのキー、シングルクォートの文字列、16進数、Infinity・NaN などを書けます。標準のJSONはこれらを受け付けないため、APIなどに渡す前にこのツールでJSONへ変換できます。',
    },
    {
      question:
        'JavaScriptのオブジェクトリテラルをそのまま貼り付けられますか？',
      answer:
        'キーがクォート無し、値がシングルクォートといった、データだけの記述なら変換できます。関数や変数、テンプレートリテラル、正規表現など、コードとして評価が必要なものは扱えません。このツールは入力を実行せず、専用の読み取り処理だけで解析します。',
    },
    {
      question: 'InfinityやNaNはJSONにするとどうなりますか？',
      answer:
        'JSONでは表せないため、「JSON5→JSON」では null か文字列（"Infinity" など）に置き換えます。置き換えた個数は結果の下に表示されます。',
    },
    {
      question: 'エラーの場所はどのように表示されますか？',
      answer:
        '構文エラーは「何行目の何列目か」と原因つきで表示されます。多いのは、閉じ忘れた括弧やクォート、キーと値の間のコロン抜け、カンマ抜けです。',
    },
  ],
  en: [
    {
      question: 'What is the difference between JSON5 and JSON?',
      answer:
        'JSON5 is a superset of JSON that allows comments, trailing commas, unquoted keys, single-quoted strings, hex numbers, Infinity and NaN. Plain JSON rejects all of these, so convert to JSON here before handing the data to an API or parser.',
    },
    {
      question: 'Can I paste a JavaScript object literal as is?',
      answer:
        'Yes, as long as it contains only data, such as unquoted keys and single-quoted strings. Anything that must be evaluated as code, like functions, variables, template literals or regular expressions, is not supported. The input is never executed; it is read by a dedicated parser.',
    },
    {
      question: 'What happens to Infinity and NaN in JSON?',
      answer:
        'JSON cannot represent them, so "JSON5→JSON" replaces them with null or a string such as "Infinity". The number of replaced values is shown below the result.',
    },
    {
      question: 'How are syntax errors reported?',
      answer:
        'Errors show the line and column along with the cause. Common culprits are a missing closing bracket or quote, a missing colon between a key and its value, and a missing comma.',
    },
  ],
};
