import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ブラウザの「cURLとしてコピー」の内容も変換できますか？',
      answer:
        'はい。ChromeやFirefoxの開発者ツールの「cURLとしてコピー（bash）」で得たコマンドを、そのまま貼り付けて変換できます。Windows向けの「cURLとしてコピー（cmd）」は書式が異なるため、bash形式でコピーしてください。',
    },
    {
      question: 'JSONのボディはどのように変換されますか？',
      answer:
        'Content-Typeがjsonで、ボディが正しいJSONの場合は、fetchでは JSON.stringify({...})、axiosでは data にオブジェクトとして出力します。JSONとして解釈できない場合は、文字列のまま出力します。',
    },
    {
      question: 'curlのオプションはすべて変換されますか？',
      answer:
        '主要なオプション（メソッド・ヘッダー・データ・フォーム・Basic認証・Cookie・User-Agent・Referer・-G・-I）に対応しています。タイムアウトやプロキシなどfetch・axiosの基本構文で表せないオプションは無視され、画面に警告が出ます。',
    },
    {
      question: '変換したコードがブラウザでCORSエラーになるのはなぜですか？',
      answer:
        'curlはブラウザではないためCORSの制限を受けませんが、ブラウザ上のfetch・axiosは、リクエスト先のサーバーが許可していないとブロックされます。サーバー側でCORSを設定するか、Node.jsなどのサーバー環境で実行してください。',
    },
  ],
  en: [
    {
      question: 'Can I convert "Copy as cURL" from my browser DevTools?',
      answer:
        'Yes. Paste the command from "Copy as cURL (bash)" in Chrome or Firefox DevTools as-is. The Windows "Copy as cURL (cmd)" format uses different quoting, so copy the bash version instead.',
    },
    {
      question: 'How is a JSON body converted?',
      answer:
        'If the Content-Type is JSON and the body is valid JSON, fetch gets JSON.stringify({...}) and axios gets an object in data. If the body cannot be parsed as JSON, it is output as a plain string.',
    },
    {
      question: 'Are all curl options converted?',
      answer:
        'The main ones are: method, headers, data, form fields, basic auth, cookie, User-Agent, Referer, -G, and -I. Options that fetch and axios cannot express with basic syntax, such as timeouts and proxies, are ignored and a warning is shown.',
    },
    {
      question: 'Why does the converted code hit a CORS error in the browser?',
      answer:
        'curl is not a browser, so CORS does not apply to it, but browser fetch and axios are blocked unless the target server allows your origin. Configure CORS on the server, or run the code in a server environment such as Node.js.',
    },
  ],
};
