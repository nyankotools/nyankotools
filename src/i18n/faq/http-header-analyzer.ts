import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'URLを入力してヘッダーを自動取得できますか？',
      answer:
        'できません。ブラウザのJavaScriptは CORS の制約により他サイトのレスポンスヘッダーを読み取れず、取得にはサーバー経由が必要になるためです。このツールは通信を行わず、貼り付けたヘッダーをブラウザ内で解析します。curl -I https://example.com やブラウザ開発者ツールのネットワークタブでヘッダーをコピーしてください。',
    },
    {
      question: '診断で「良好」なら、そのサイトは安全ですか？',
      answer:
        'いいえ。このツールが見るのは代表的なセキュリティヘッダーの有無と明らかに弱い設定だけです。アプリケーション自体の脆弱性（SQLインジェクションや認証の不備など）は判定できません。設定の抜け漏れを確認する目安としてお使いください。',
    },
    {
      question: '推奨のContent-Security-Policyをそのまま設定してもよいですか？',
      answer:
        "出力するのは default-src 'self' を基本にした出発点です。外部のスクリプト・フォント・画像・分析タグなどを読み込んでいるサイトでは、そのまま適用すると表示や機能が壊れる可能性があります。先に Content-Security-Policy-Report-Only で違反を確認し、必要な出所を追加してから適用してください。",
    },
    {
      question:
        'X-Frame-Options がないのに「良好」と表示されるのはなぜですか？',
      answer:
        'CSP の frame-ancestors ディレクティブで埋め込みを制限している場合は、X-Frame-Options と同じ役割を果たしており、現在のブラウザでは frame-ancestors が優先されるためです。古いブラウザにも対応したい場合は両方を設定します。',
    },
    {
      question: 'Cookieの値が結果に表示されないのはなぜですか？',
      answer:
        'セッションIDなどの秘密情報が画面やコピー結果に残らないよう、Cookie は名前と属性（Secure・HttpOnly・SameSite）だけを診断し、値は表示しません。なお通信はブラウザ内で完結し、貼り付けた内容がサーバーに送られることはありません。',
    },
  ],
  en: [
    {
      question: 'Can I enter a URL and have the headers fetched automatically?',
      answer:
        'No. Browser JavaScript cannot read another site’s response headers because of CORS, so fetching them would need a server in the middle. This tool makes no requests and analyzes the headers you paste in your browser. Copy them from curl -I https://example.com or the Network tab of your dev tools.',
    },
    {
      question: 'If everything is marked good, is the site secure?',
      answer:
        'No. The tool only checks for the main security headers and clearly weak values. It cannot detect application vulnerabilities such as SQL injection or broken authentication. Use it as a checklist for configuration gaps, not as proof of security.',
    },
    {
      question: 'Can I deploy the recommended Content-Security-Policy as is?',
      answer:
        "It is a starting point built around default-src 'self'. A site that loads external scripts, fonts, images, or analytics tags may break if you apply it unchanged. Try Content-Security-Policy-Report-Only first, review the violations, add the sources you need, and then enforce it.",
    },
    {
      question: 'Why is X-Frame-Options marked good when it is missing?',
      answer:
        'When CSP has a frame-ancestors directive, it already restricts framing, and modern browsers prefer it over X-Frame-Options. If you also need to support very old browsers, set both.',
    },
    {
      question: 'Why are cookie values not shown in the results?',
      answer:
        'To keep secrets such as session IDs off the screen and out of copied output, only the cookie name and its Secure, HttpOnly, and SameSite attributes are checked. The analysis also happens entirely in your browser, so nothing you paste is uploaded.',
    },
  ],
};
