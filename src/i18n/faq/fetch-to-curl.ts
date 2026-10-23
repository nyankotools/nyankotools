import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '貼り付けたコードは実行されますか？',
      answer:
        'いいえ。コードはevalやFunctionで評価せず、本ツール内の構文解析で文字列やオブジェクトなどのリテラルを読み取るだけです。そのため、コード中の関数は呼ばれず、通信も発生しません。',
    },
    {
      question: 'ブラウザの「fetchとしてコピー」の内容も変換できますか？',
      answer:
        'はい。ChromeやEdgeの開発者ツールの「fetchとしてコピー」で得たコードをそのまま貼り付けて変換できます。mode・referrerPolicy・cache などcurlに影響しないオプションは警告なしで無視し、credentials: "include" は警告を表示します。',
    },
    {
      question: '変数や関数の戻り値を使っているコードはどうなりますか？',
      answer:
        '同じコード内で const / let / var により文字列やオブジェクトとして宣言された変数は値を解決します。関数の戻り値や外部の変数など値を特定できない式は、<token> のようなプレースホルダで出力し、警告を表示します。実際の値に置き換えてお使いください。',
    },
    {
      question: 'axiosのparamsやオブジェクトのdataはどう変換されますか？',
      answer:
        'paramsはaxiosと同じ規則（配列は key[]=値）でURLのクエリ文字列に追加します。dataにオブジェクトや配列を渡した場合はJSON文字列として --data-raw に出力し、Content-Typeが未指定なら application/json のヘッダーを補います。',
    },
  ],
  en: [
    {
      question: 'Is the pasted code executed?',
      answer:
        'No. The code is never run through eval or Function. The tool parses it with its own parser and only reads literals such as strings and objects, so no functions in your code are called and no request is made.',
    },
    {
      question: 'Can I convert "Copy as fetch" from my browser DevTools?',
      answer:
        'Yes. Paste the code from "Copy as fetch" in Chrome or Edge DevTools as-is. Options that do not affect curl, such as mode, referrerPolicy, and cache, are ignored without a warning, while credentials: "include" shows a warning.',
    },
    {
      question: 'What happens to variables and function results in my code?',
      answer:
        'Variables declared with const / let / var in the same snippet as strings or objects are resolved. Expressions whose value cannot be known, such as function return values or outside variables, are written as placeholders like <token> with a warning. Replace them with the real values.',
    },
    {
      question: 'How are axios params and object data converted?',
      answer:
        'params are appended to the URL query string using the same rules as axios (arrays become key[]=value). An object or array passed as data is written as a JSON string with --data-raw, and an application/json Content-Type header is added if you did not set one.',
    },
  ],
};
