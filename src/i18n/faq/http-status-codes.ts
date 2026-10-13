import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '301・302・307・308 はどう使い分ければよいですか？',
      answer:
        '恒久的な移転か一時的な移転かと、メソッドを保つかどうかで選びます。恒久で GET に変わっても構わないなら 301、メソッドを保つなら 308。一時的なら 302、メソッドを保つなら 307、POST 後に結果画面へ GET で遷移させるなら 303 です。SEO の評価を新URLへ移したいサイト移転では 301（または 308）を使います。',
    },
    {
      question: '401 と 403 の違いは何ですか？',
      answer:
        '401 は認証されていない（ログインしていない・トークンが無効）状態で、認証し直せば通る可能性があります。403 は認証済みでも権限がなく、同じ認証情報では何度試しても通りません。名称の Unauthorized は紛らわしいですが、実際の意味は「未認証」です。',
    },
    {
      question: '502・503・504 の違いと、まず何を確認すべきですか？',
      answer:
        '502 は上流のアプリが不正な応答を返した（落ちている）、503 はサーバーが過負荷やメンテナンスで一時的に処理できない、504 は上流の応答が時間内に返らなかった、という違いです。502 はアプリの稼働とログ、503 は負荷とメンテナンス設定、504 は処理時間とプロキシのタイムアウト設定を確認します。',
    },
    {
      question: '404 と 410 はどちらを返すべきですか？',
      answer:
        '単に見つからない・以前から存在しない場合は 404 です。意図して恒久的に削除したことを伝えたい場合は 410 が選べ、検索エンジンが早めにインデックスから外す傾向があります。別のURLへ移した場合はどちらでもなく 301 を使います。',
    },
    {
      question: 'このツールの一覧に載っていないコードを受け取りました',
      answer:
        'Cloudflare 独自のコード（520〜530）や nginx の 499 など、サービス固有のコードは一覧にありません。その場合は、そのサービスの公式ドキュメントを確認してください。標準コードの意味も、使うフレームワークによって細部が異なることがあります。',
    },
  ],
  en: [
    {
      question: 'How do I choose between 301, 302, 307, and 308?',
      answer:
        'Decide whether the move is permanent or temporary, and whether the method must be preserved. Permanent and GET is fine: 301. Permanent and the method must stay: 308. Temporary: 302, or 307 to preserve the method. Redirecting to a result page with GET after a POST: 303. For site migrations where ranking should move to the new URL, use 301 or 308.',
    },
    {
      question: 'What is the difference between 401 and 403?',
      answer:
        '401 means the request is not authenticated (not signed in, or the token is invalid), and authenticating again may work. 403 means the server knows who you are but you lack permission, so retrying with the same credentials will not help. The name Unauthorized is misleading: it really means "unauthenticated".',
    },
    {
      question: 'What is the difference between 502, 503, and 504?',
      answer:
        '502 means an upstream app returned an invalid response (often because it is down). 503 means the server is temporarily overloaded or in maintenance. 504 means the upstream did not respond in time. Check the app status and logs for 502, load and maintenance settings for 503, and processing time and proxy timeouts for 504.',
    },
    {
      question: 'Should a missing page return 404 or 410?',
      answer:
        'Use 404 when a page is simply not found or never existed. Use 410 when you deliberately removed it for good; search engines tend to drop such URLs sooner. If the content moved to another URL, use a 301 redirect rather than either.',
    },
    {
      question: 'I got a status code that is not in this list',
      answer:
        'Vendor-specific codes, such as Cloudflare’s 520-530 or nginx’s 499, are not included. Check that service’s own documentation. Details of even standard codes can also vary a little between frameworks.',
    },
  ],
};
