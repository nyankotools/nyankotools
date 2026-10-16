import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '.htaccess はどこに置けばよいですか？',
      answer:
        '公開フォルダ（ドキュメントルート。public_html など）の直下に、ファイル名 .htaccess として置きます。この設定はサイト全体に効くルートの .htaccess を前提にしています。サブディレクトリに置くと、そのディレクトリ配下にだけ効き、パスの指定も変わります。',
    },
    {
      question:
        'HTTPS強制を入れたら「リダイレクトが繰り返し行われました」と出ます。',
      answer:
        'CloudflareなどのCDNやリバースプロキシがHTTPSを終端している場合、サーバーにはHTTPで届くため、HTTPS判定が常に「HTTP」になり、ループします。「CDN・リバースプロキシ配下で使う」をチェックすると X-Forwarded-Proto ヘッダーも見て判定するので解消します。CDN側にも「常にHTTPSを使用」の設定があれば、そちらと重ねない方法もあります。',
    },
    {
      question: '301と302はどちらを使えばよいですか？',
      answer:
        'URLを恒久的に変えるなら301、期間限定のキャンペーンなど一時的な転送なら302です。301はブラウザや検索エンジンにキャッシュされ、あとから戻しにくいので、動作確認が済むまでは302で試し、確定してから301に変える方法が安全です。',
    },
    {
      question: '完全一致と前方一致の違いは何ですか？',
      answer:
        '完全一致は /old というURLだけを転送します。前方一致は /old/page のような配下のURLも、/new/page のように同じ構成のまま転送します。ディレクトリごと引っ越すときは前方一致、1ページだけの転送は完全一致を使ってください。前方一致では転送先が元のパスの配下にあるとループになるため、エラーとして検出します。',
    },
    {
      question: '反映したら500エラーになりました。どうすればよいですか？',
      answer:
        'すぐに、反映前にバックアップした .htaccess に戻してください。多くはサーバーが AllowOverride で一部の記述（Options など）を許可していないことが原因です。その場合は「ディレクトリの一覧表示を無効にする」のチェックを外して試すか、サーバー管理画面の設定で代替できないか確認してください。',
    },
  ],
  en: [
    {
      question: 'Where do I put the .htaccess file?',
      answer:
        'Save it as .htaccess directly in your public folder (the document root, such as public_html). These rules assume the root .htaccess that covers the whole site. A file in a subdirectory affects only that directory and the paths in the rules would need to change.',
    },
    {
      question:
        'After enabling Force HTTPS my browser says there were too many redirects.',
      answer:
        'When a CDN or reverse proxy such as Cloudflare terminates HTTPS, the request reaches your server over plain HTTP, so the HTTPS check always fails and the redirect repeats. Tick "Site is behind a CDN or reverse proxy" so the rule also reads the X-Forwarded-Proto header. If your CDN has its own "Always use HTTPS" option, you can also let it do the job instead of .htaccess.',
    },
    {
      question: 'Should I use a 301 or a 302 redirect?',
      answer:
        'Use 301 when a URL has moved for good and 302 for a temporary forward such as a limited-time campaign. Browsers and search engines cache a 301, which makes it hard to undo, so start with 302 while testing and switch to 301 once you are sure.',
    },
    {
      question: 'What is the difference between exact and prefix matching?',
      answer:
        'Exact matching forwards only the URL /old. Prefix matching also forwards everything under it, so /old/page goes to /new/page. Use prefix matching when you move a whole directory and exact matching for a single page. With prefix matching, a destination inside the old path would loop forever, so the tool reports it as an error.',
    },
    {
      question: 'My site shows a 500 error after the change. What now?',
      answer:
        'Restore the .htaccess you backed up before the change right away. A common cause is that the server does not allow some directives, such as Options, through AllowOverride. In that case, untick "Disable directory listings" and try again, or check whether your hosting control panel offers the same setting.',
    },
  ],
};
