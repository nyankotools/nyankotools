import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'CookieヘッダーとSet-Cookieの違いは何ですか？',
      answer:
        'Cookieはブラウザがリクエストで送る「名前=値」の一覧で、属性は含まれません。Set-Cookieはサーバーがレスポンスで返す指示で、1つのCookieに対しDomain・Path・Expires・Secure・HttpOnly・SameSiteなどの属性を付けられます。このツールは両方に対応し、自動判定もできます。',
    },
    {
      question: 'Expires と Max-Age の両方がある場合はどちらが使われますか？',
      answer:
        'Max-Ageが優先されます。Max-Ageが0以下の場合や、Expiresが過去の日時の場合は、そのCookieの削除を指示するものとして扱われます。',
    },
    {
      question: 'SameSite=None なのに Cookie が保存されないのはなぜですか？',
      answer:
        'SameSite=None のCookieにはSecure属性が必須で、無いとChromeなどのモダンなブラウザに拒否されます。HTTPSで配信しているかも合わせて確認してください。このツールはその組み合わせを指摘します。',
    },
    {
      question: '貼り付けた Cookie の値は画面に表示されますか？',
      answer:
        '初期状態では先頭2文字を除いてマスクして表示します。「Cookieの値を表示する」をオンにしたときだけ全体が表示されます。入力内容はブラウザ内でのみ処理され、送信も保存もされません。',
    },
  ],
  en: [
    {
      question: 'What is the difference between Cookie and Set-Cookie?',
      answer:
        'Cookie is the list of name=value pairs a browser sends with a request and carries no attributes. Set-Cookie is the server instruction in a response and can attach Domain, Path, Expires, Secure, HttpOnly, SameSite and more. This tool handles both and can auto-detect which one you pasted.',
    },
    {
      question: 'Which wins when both Expires and Max-Age are set?',
      answer:
        'Max-Age takes precedence. If Max-Age is 0 or negative, or Expires is in the past, the cookie is treated as a deletion instruction.',
    },
    {
      question: 'Why is my SameSite=None cookie not being stored?',
      answer:
        'A SameSite=None cookie must also have the Secure attribute, otherwise modern browsers such as Chrome reject it. Make sure the site is served over HTTPS too. This tool flags that combination.',
    },
    {
      question: 'Are the pasted cookie values shown on screen?',
      answer:
        'By default values are masked except for the first two characters. Turn on "Show cookie values" to see them in full. Input is processed only in your browser and is never sent or stored.',
    },
  ],
};
