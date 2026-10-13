import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'robots.txt はどこに置けばよいですか？',
      answer:
        'ドメインのルート直下（例: https://example.com/robots.txt）に置きます。サブディレクトリに置いても効力はなく、サブドメインごとに別のファイルが必要です。静的サイトならpublicフォルダ直下に robots.txt として保存してください。',
    },
    {
      question: 'AIの学習用クローラーをブロックするにはどう書けばよいですか？',
      answer:
        '対象のUser-agent（GPTBot、ClaudeBot、CCBot、Google-Extendedなど）を指定し、Disallow: / を書きます。プリセットの「AIボットをブロック」で一括追加できます。ただし守るかどうかは各社の運営次第で、強制力はありません。',
    },
    {
      question: 'Disallow に指定したページが検索結果に出てくるのはなぜですか？',
      answer:
        'robots.txt はクロールを制限するだけで、インデックスを禁止するものではありません。他ページからのリンクがあるとURLだけ表示されることがあります。検索結果から外したい場合は noindex を使い、そのページのクロールは許可しておいてください。',
    },
    {
      question: 'Allow と Disallow が競合した場合はどちらが優先されますか？',
      answer:
        'GoogleやBingでは、より具体的（長い）パスのルールが優先されます。たとえば Disallow: /admin/ と Allow: /admin/public/ を併記すると、/admin/public/ 以下だけクロールできます。',
    },
  ],
  en: [
    {
      question: 'Where do I put robots.txt?',
      answer:
        'At the root of the host, for example https://example.com/robots.txt. A file in a subdirectory has no effect, and every subdomain needs its own file. On a static site, save it as robots.txt at the top of your public folder.',
    },
    {
      question: 'How do I block AI training crawlers?',
      answer:
        'Name each crawler (GPTBot, ClaudeBot, CCBot, Google-Extended, and so on) as a User-agent and add Disallow: /. The "Block AI bots" preset adds them all at once. Compliance is voluntary on the crawler operator\'s side, so this is a request, not enforcement.',
    },
    {
      question: 'Why does a Disallowed page still appear in search results?',
      answer:
        'robots.txt only limits crawling, not indexing. If other pages link to the URL, it can still be listed without a snippet. To remove a page from search, use noindex and leave the page crawlable so the directive can be read.',
    },
    {
      question: 'Which wins when Allow and Disallow conflict?',
      answer:
        'Google and Bing apply the most specific (longest) matching path. With Disallow: /admin/ and Allow: /admin/public/, only /admin/public/ and below can be crawled.',
    },
  ],
};
