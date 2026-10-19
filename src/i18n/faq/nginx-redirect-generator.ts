import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '出力された設定はどこに貼ればよいですか？',
      answer:
        '出力のコメントに書いてあるとおり、「server { }」で始まるブロックは既存の server ブロックとは別に追加します（通常は /etc/nginx/conf.d/ 以下のファイルなど、http コンテキストの中）。「Add the following inside your main server { } block」以下は、そのドメインを担当している既存の server ブロックの中に入れます。反映前に nginx -t で確認してください。',
    },
    {
      question:
        'HTTPS強制を入れたら「リダイレクトが繰り返し行われました」と出ます。',
      answer:
        'CloudflareなどのCDNやリバースプロキシがHTTPSを終端している場合、nginxにはHTTPで届くため、80番ポートで「HTTPSへ転送」すると無限にループします。「CDN・リバースプロキシ（Cloudflare等）配下で使う」を選ぶと、X-Forwarded-Proto ヘッダーが http のときだけ転送する if を出力するので解消します。CDN側の「常にHTTPSを使用」で済ませる方法もあります。',
    },
    {
      question:
        'なぜ if や rewrite ではなく server ブロックで転送するのですか？',
      answer:
        'nginxでは if は使える場所が限られ、書き方によって意図しない動きをします。ホスト名やスキームの転送は、専用の server ブロックで return 301 を書くのが推奨されている方法で、高速で間違いも起きにくいためです。このツールが if を使うのは、プロキシ配下の判定と index.html の除去など、return だけを書く安全な範囲に限っています。',
    },
    {
      question: '元のパスに % や ? を書けないのはなぜですか？',
      answer:
        'nginxの location は、% エンコードを戻したあとのパス（クエリ文字列を除く）と照合します。そのため /a%20b のように書いても一致せず、日本語などはそのまま書く必要があります。? や # はパスの一部ではないので使えません。また、; { } $ や引用符・改行は、設定ファイルの構文を壊して別の設定を差し込めてしまうため、入力の時点で弾いています。',
    },
    {
      question: '完全一致と前方一致の違いは何ですか？',
      answer:
        '完全一致は location = を使い、/old というURLだけを転送します。前方一致は正規表現の location で、/old/page のような配下のURLも /new/page のように同じ構成のまま転送します。ディレクトリごと引っ越すときは前方一致、1ページだけの転送は完全一致を使ってください。前方一致で転送先が元のパスの配下にあるとループになるため、エラーとして検出します。',
    },
  ],
  en: [
    {
      question: 'Where do I paste the generated config?',
      answer:
        'Follow the comments in the output. Blocks that start with server { } are added as separate server blocks (usually in a file under /etc/nginx/conf.d/, inside the http context). The part under the comment about your main server block goes inside the existing server block that handles that domain. Run nginx -t before you reload.',
    },
    {
      question:
        'After enabling Force HTTPS my browser says there were too many redirects.',
      answer:
        'When a CDN or reverse proxy such as Cloudflare terminates HTTPS, nginx receives plain HTTP, so redirecting everything on port 80 to HTTPS loops forever. Choose the option for a site behind a CDN or reverse proxy: the output then redirects only when the X-Forwarded-Proto header says http. If your CDN has its own "Always use HTTPS" option, you can use that instead.',
    },
    {
      question:
        'Why does the tool use separate server blocks instead of if and rewrite?',
      answer:
        'In nginx, if only works safely in a few places and can behave in surprising ways. For host and scheme redirects, a dedicated server block with return 301 is the recommended pattern: it is fast and hard to get wrong. This tool uses if only where that is safe, such as the proxy check and the index.html rule, and only with a return inside.',
    },
    {
      question: 'Why can I not use % or ? in the old path?',
      answer:
        'An nginx location is matched against the path after percent-decoding, without the query string. A pattern like /a%20b therefore never matches, and non-ASCII characters have to be written as they are. ? and # are not part of the path. Characters such as ; { } $, quotes and line breaks are rejected because they could break the config syntax or inject extra directives.',
    },
    {
      question: 'What is the difference between exact and prefix matching?',
      answer:
        'Exact matching uses location = and forwards only the URL /old. Prefix matching uses a regular-expression location and also forwards everything under it, so /old/page goes to /new/page. Use prefix matching when you move a whole directory and exact matching for a single page. A destination inside the old path would loop forever with prefix matching, so the tool reports it as an error.',
    },
  ],
};
