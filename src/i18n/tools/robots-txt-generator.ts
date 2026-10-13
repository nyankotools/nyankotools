import type { Locale } from '../../data/tools';
import type {
  RobotsIssueCode,
  RobotsPresetId,
} from '../../lib/tools/robots-txt-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RobotsTxtGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  presetHeading: string;
  presetHint: string;
  presets: { id: RobotsPresetId; label: string }[];
  groupsHeading: string;
  groupTitle: string;
  userAgentLabel: string;
  userAgentPlaceholder: string;
  addCrawlerLabel: string;
  addCrawlerDefault: string;
  crawlerSearchGroup: string;
  crawlerAiGroup: string;
  disallowLabel: string;
  disallowPlaceholder: string;
  allowLabel: string;
  allowPlaceholder: string;
  crawlDelayLabel: string;
  crawlDelayPlaceholder: string;
  removeGroup: string;
  addGroup: string;
  sitemapHeading: string;
  sitemapLabel: string;
  sitemapPlaceholder: string;
  issuesHeading: string;
  noIssues: string;
  errorPrefix: string;
  warningPrefix: string;
  issueMessages: Record<RobotsIssueCode, string>;
  outputHeading: string;
  outputEmpty: string;
  copyButton: string;
  downloadButton: string;
  copied: string;
  copyFailed: string;
  downloaded: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const robotsTxtGeneratorContent: Record<
  Locale,
  RobotsTxtGeneratorPageContent
> = {
  ja: {
    title: 'robots.txt生成ツール（AIボット・クローラーのブロック設定対応）',
    description:
      'User-agent別のAllow/Disallow、Sitemap、Crawl-delayを入力するだけでrobots.txtを生成する無料ツールです。GPTBot・ClaudeBot・CCBotなどAIボットのブロックにも対応し、パスの書き間違いや全体Disallowの注意を表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'robots.txt生成',
    introHtml:
      'クローラー（User-agent）ごとに<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">Disallow</code>・<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">Allow</code>のパスを指定し、サイトマップのURLを加えると、サイトのルートに置く robots.txt をリアルタイムに生成します。Googlebot・Bingbotといった検索エンジンのほか、GPTBot・ClaudeBot・CCBot・Google-Extended などのAIボット向けのブロック設定もプリセットで追加できます。生成後は <a href="/tools/meta-tag-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">metaタグ・OGPタグ生成</a> と合わせて、検索エンジン向けの設定を整えましょう。',
    howToHeading: '使い方',
    howToSteps: [
      '「プリセット」から目的に近いものを追加するか、「グループを追加」で独自のルールを作ります。',
      'グループごとに User-agent、Disallow、Allow のパスを1行に1つずつ入力します（パスは / から始めます）。',
      '必要であればSitemapのURLを入力します。複数ある場合は1行に1つずつ書きます。',
      '警告を確認し、「コピー」または「robots.txtをダウンロード」で出力します。サイトのルート（/robots.txt）に配置してください。',
    ],
    presetHeading: 'プリセット',
    presetHint:
      'クリックするとグループを追加します（最初の空のグループだけの場合は置き換えます）。',
    presets: [
      { id: 'allowAll', label: '全クローラーを許可' },
      { id: 'blockAll', label: '全クローラーをブロック' },
      { id: 'blockAi', label: 'AIボットをブロック' },
      { id: 'wordpress', label: 'WordPress向け' },
      { id: 'blockQuery', label: 'クエリ付きURL・検索結果を除外' },
    ],
    groupsHeading: 'ルール（グループ）',
    groupTitle: 'グループ {n}',
    userAgentLabel: 'User-agent（カンマ区切りで複数可、* は全クローラー）',
    userAgentPlaceholder: '例: *, Googlebot',
    addCrawlerLabel: 'User-agentを追加',
    addCrawlerDefault: '主要クローラーから選ぶ',
    crawlerSearchGroup: '検索エンジン',
    crawlerAiGroup: 'AIボット',
    disallowLabel: 'Disallow（クロールを禁止するパス、1行に1つ）',
    disallowPlaceholder: '例:\n/admin/\n/private/',
    allowLabel: 'Allow（Disallow内で許可するパス、1行に1つ）',
    allowPlaceholder: '例:\n/admin/public/',
    crawlDelayLabel: 'Crawl-delay（秒、任意）',
    crawlDelayPlaceholder: '例: 10',
    removeGroup: 'このグループを削除',
    addGroup: 'グループを追加',
    sitemapHeading: 'Sitemap',
    sitemapLabel: 'SitemapのURL（1行に1つ）',
    sitemapPlaceholder: '例: https://example.com/sitemap.xml',
    issuesHeading: '確認事項',
    noIssues: '問題は見つかりませんでした。',
    errorPrefix: 'エラー',
    warningPrefix: '警告',
    issueMessages: {
      noGroups:
        'ルールもSitemapも入力されていません。robots.txt を置かない場合と同じく、すべてのクロールが許可されます。',
      noUserAgent:
        'グループ {group}: User-agent が指定されていないため、このグループは出力されません。',
      invalidUserAgent:
        'グループ {group}: User-agent「{value}」に使えない文字（: や #）が含まれています。',
      duplicateUserAgent:
        'グループ {group}: User-agent「{value}」が複数のグループに指定されています。クローラーによってはルールが統合されたり、最初のグループだけが使われたりします。',
      pathNoSlash:
        'グループ {group}: パス「{value}」が / で始まっていません。パスは / から書いてください。',
      pathFullUrl:
        'グループ {group}: 「{value}」はURLではなくパスで指定してください（例: /private/）。',
      pathHasSpace:
        'グループ {group}: パス「{value}」に空白が含まれています。空白は %20 に置き換えてください。',
      invalidCrawlDelay:
        'グループ {group}: Crawl-delay「{value}」は0以上の数値で指定してください。出力には含まれません。',
      invalidSitemap:
        'Sitemap「{value}」は https:// または http:// で始まる絶対URLで指定してください。',
      blockAll:
        'グループ {group}: すべてのクローラーに対して Disallow: / を指定しています。サイト全体が検索結果に載らなくなる可能性があります。公開サイトでは意図したものか確認してください。',
      blockAllSearch:
        'グループ {group}: 検索エンジンのクローラー（{value}）に対してサイト全体を禁止しています。検索結果に表示されなくなる可能性があります。',
      allowOverridesBlockAll:
        'グループ {group}: Disallow: / と Allow を併用しています。より具体的な Allow のパスだけが許可されます。意図どおりか確認してください。',
      emptyGroup:
        'グループ {group}: ルールがないため、このグループのクローラーはすべて許可されます（Disallow: が空で出力されます）。',
    },
    outputHeading: '生成されたrobots.txt',
    outputEmpty:
      'User-agentなどを入力すると、ここに robots.txt が生成されます。',
    copyButton: 'コピー',
    downloadButton: 'robots.txtをダウンロード',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloaded: 'robots.txt をダウンロードしました',
    notesHeading: '注意事項',
    notes: [
      'robots.txt はクロールのお願いであり、アクセス制限ではありません。誰でも閲覧でき、守らないボットもあります。機密情報の保護にはパスワード認証などを使ってください。',
      'Disallow したURLでも、他のページからのリンクなどで検索結果に表示されることがあります。検索結果から外したい場合は noindex を指定してください（noindex を読み取らせるにはクロールを許可する必要があります）。',
      'Crawl-delay はBingなど一部のクローラーのみが解釈し、Googlebotは無視します。',
      '`Disallow:` の値が空のグループは何も禁止しないという意味です。`Disallow: /` はサイト全体の禁止を意味するので注意してください。',
      'ファイルは必ずドメインのルート（例: https://example.com/robots.txt）に、UTF-8のテキストとして置いてください。サブドメインごとに別のファイルが必要です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'User-agent',
        description:
          'クローラーの名前。`*` はすべてのクローラーを表し、Googlebot や GPTBot などの名前を書くと、そのクローラーだけに適用されるルールになる。',
      },
      {
        term: 'Disallow / Allow',
        description:
          'クロールを禁止する／許可するパスの接頭辞。`/` から始める。より具体的（長い）パスのルールが優先される。',
      },
      {
        term: 'Sitemap',
        description:
          'サイト内のURL一覧（sitemap.xml）の場所をクローラーに伝える行。絶対URLで書き、複数指定できる。',
      },
    ],
  },
  en: {
    title: 'robots.txt Generator – Block AI Bots & Set Crawler Rules',
    description:
      'Build robots.txt with per-user-agent Allow/Disallow rules and Sitemap URLs, with presets for GPTBot, ClaudeBot and more. Runs in your browser.',
    h1: 'robots.txt Generator',
    introHtml:
      'Add rules per crawler (user-agent) with <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">Disallow</code> and <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">Allow</code> paths, add your sitemap URLs, and get a robots.txt file for your site root as you type. Presets cover search engines such as Googlebot and Bingbot as well as AI crawlers like GPTBot, ClaudeBot, CCBot, and Google-Extended. For the rest of your search-facing markup, see the <a href="/en/tools/meta-tag-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Meta Tag &amp; OGP Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Add a preset that fits your goal, or click "Add group" to write your own rules.',
      'For each group, enter the user-agents and the Disallow and Allow paths, one per line. Paths must start with /.',
      'Optionally add Sitemap URLs, one per line.',
      'Review the warnings, then copy the result or download robots.txt. Place it at the root of your site (/robots.txt).',
    ],
    presetHeading: 'Presets',
    presetHint:
      'Click to add a group (it replaces the initial group if that is still empty).',
    presets: [
      { id: 'allowAll', label: 'Allow all crawlers' },
      { id: 'blockAll', label: 'Block all crawlers' },
      { id: 'blockAi', label: 'Block AI bots' },
      { id: 'wordpress', label: 'WordPress' },
      { id: 'blockQuery', label: 'Exclude query URLs & search results' },
    ],
    groupsHeading: 'Rules (groups)',
    groupTitle: 'Group {n}',
    userAgentLabel: 'User-agent (comma-separated; * means all crawlers)',
    userAgentPlaceholder: 'e.g. *, Googlebot',
    addCrawlerLabel: 'Add a user-agent',
    addCrawlerDefault: 'Pick a well-known crawler',
    crawlerSearchGroup: 'Search engines',
    crawlerAiGroup: 'AI bots',
    disallowLabel: 'Disallow (paths crawlers must not fetch, one per line)',
    disallowPlaceholder: 'e.g.\n/admin/\n/private/',
    allowLabel: 'Allow (exceptions inside a Disallow, one per line)',
    allowPlaceholder: 'e.g.\n/admin/public/',
    crawlDelayLabel: 'Crawl-delay (seconds, optional)',
    crawlDelayPlaceholder: 'e.g. 10',
    removeGroup: 'Remove this group',
    addGroup: 'Add group',
    sitemapHeading: 'Sitemap',
    sitemapLabel: 'Sitemap URLs (one per line)',
    sitemapPlaceholder: 'e.g. https://example.com/sitemap.xml',
    issuesHeading: 'Checks',
    noIssues: 'No problems found.',
    errorPrefix: 'Error',
    warningPrefix: 'Warning',
    issueMessages: {
      noGroups:
        'No rules or sitemaps entered. This behaves the same as having no robots.txt: everything may be crawled.',
      noUserAgent:
        'Group {group}: no user-agent is set, so this group is left out of the output.',
      invalidUserAgent:
        'Group {group}: the user-agent "{value}" contains a character that is not allowed (: or #).',
      duplicateUserAgent:
        'Group {group}: the user-agent "{value}" appears in more than one group. Some crawlers merge the groups, others use only the first one.',
      pathNoSlash:
        'Group {group}: the path "{value}" does not start with /. Paths must begin with a slash.',
      pathFullUrl:
        'Group {group}: "{value}" is a full URL. Use a path instead (e.g. /private/).',
      pathHasSpace:
        'Group {group}: the path "{value}" contains whitespace. Replace spaces with %20.',
      invalidCrawlDelay:
        'Group {group}: Crawl-delay "{value}" must be a number of 0 or more. It is left out of the output.',
      invalidSitemap:
        'The sitemap "{value}" must be an absolute URL starting with https:// or http://.',
      blockAll:
        'Group {group}: Disallow: / is set for all crawlers. Your whole site may disappear from search results. Make sure that is intended for a public site.',
      blockAllSearch:
        'Group {group}: the whole site is blocked for a search engine crawler ({value}). It may stop appearing in search results.',
      allowOverridesBlockAll:
        'Group {group}: Disallow: / is combined with Allow. Only the more specific Allow paths stay crawlable. Check that this is what you want.',
      emptyGroup:
        'Group {group}: no rules, so this crawler may fetch everything (an empty Disallow: line is written).',
    },
    outputHeading: 'Generated robots.txt',
    outputEmpty: 'Enter a user-agent or rules to generate robots.txt here.',
    copyButton: 'Copy',
    downloadButton: 'Download robots.txt',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloaded: 'Downloaded robots.txt',
    notesHeading: 'Notes',
    notes: [
      'robots.txt is a request to crawlers, not access control. Anyone can read it and some bots ignore it. Use authentication to protect anything confidential.',
      'A URL blocked with Disallow can still appear in search results if other pages link to it. To keep a page out of search, use noindex (and allow crawling so the noindex can be read).',
      'Crawl-delay is honored by some crawlers such as Bing, but Googlebot ignores it.',
      'An empty `Disallow:` blocks nothing, while `Disallow: /` blocks the entire site.',
      'Serve the file as UTF-8 text at the root of the host (e.g. https://example.com/robots.txt). Each subdomain needs its own file.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'User-agent',
        description:
          'The name of a crawler. `*` matches every crawler, while a name such as Googlebot or GPTBot targets only that crawler.',
      },
      {
        term: 'Disallow / Allow',
        description:
          'Path prefixes crawlers must not fetch / may fetch. They start with `/`, and the more specific (longer) rule wins.',
      },
      {
        term: 'Sitemap',
        description:
          'A line that tells crawlers where your sitemap.xml lives. Use an absolute URL; multiple lines are allowed.',
      },
    ],
  },
};
