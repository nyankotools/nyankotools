import type { Locale } from '../../data/tools';
import type { NginxIssueCode } from '../../lib/tools/nginx-redirect-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface NginxRedirectGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  warningHeading: string;
  warningText: string;
  howToHeading: string;
  howToSteps: string[];
  httpsHeading: string;
  forceHttpsLabel: string;
  behindProxyLabel: string;
  behindProxyHint: string;
  hostHeading: string;
  wwwLabel: string;
  wwwOptions: { value: 'none' | 'add' | 'remove'; label: string }[];
  domainLabel: string;
  domainPlaceholder: string;
  pathHeading: string;
  slashLabel: string;
  slashOptions: { value: 'none' | 'add' | 'remove'; label: string }[];
  removeIndexLabel: string;
  redirectHeading: string;
  redirectsLabel: string;
  redirectsPlaceholder: string;
  redirectsHint: string;
  redirectMatchLabel: string;
  redirectMatchOptions: { value: 'exact' | 'prefix'; label: string }[];
  issuesHeading: string;
  noIssues: string;
  errorPrefix: string;
  warningPrefix: string;
  issueMessages: Record<NginxIssueCode, string>;
  outputHeading: string;
  outputEmpty: string;
  copyButton: string;
  downloadButton: string;
  copied: string;
  copyFailed: string;
  downloaded: string;
  verifyHeading: string;
  verifySteps: string[];
  verifyCommand: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const nginxRedirectGeneratorContent: Record<
  Locale,
  NginxRedirectGeneratorPageContent
> = {
  ja: {
    title: 'nginxリダイレクト設定生成（HTTPS強制・www統一・301）',
    description:
      'nginxのリダイレクト設定を、HTTPS強制、www有無の統一、末尾スラッシュ、個別URLの301/302リダイレクトまで項目を選ぶだけで生成する無料ツールです。serverブロックの断片を出力し、ループや危険な文字も検出。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'nginxリダイレクト設定生成（HTTPS強制・www統一・301/302）',
    introHtml:
      'nginxの <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">server</code> ブロックに貼り付ける設定を、HTTPS強制・www有無の統一・末尾スラッシュ・個別URLの301/302リダイレクトから選んで生成します。<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">;</code> や改行など設定を壊す文字は弾き、リダイレクトのループや重複も警告します。Apacheの場合は <a href="/tools/htaccess-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">.htaccess生成</a>、リダイレクトの意味は <a href="/tools/http-status-codes/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTPステータスコード一覧</a> を参照してください。',
    warningHeading: '反映前にお読みください',
    warningText:
      '生成した設定は、そのまま本番に反映せず、必ず nginx -t で文法を確認してから reload してください。設定ファイルは事前にバックアップし、ssl_certificate などの値は自分の環境に合わせて書き換えます。',
    howToHeading: '使い方',
    howToSteps: [
      '「HTTPS強制」「www の統一」「末尾スラッシュ」など、行いたい設定を選びます。',
      'www を統一する場合は「ドメイン」欄に、example.com のようにwwwなしのドメインを入力します。',
      '個別のURLを転送したいときは、「個別URLのリダイレクト」欄に1行ずつ「元のパス 転送先」を入力します。',
      '確認事項を見て、「コピー」または「ダウンロード」で出力し、コメントの指示どおりに設定ファイルへ貼り付けます。',
    ],
    httpsHeading: 'HTTPS',
    forceHttpsLabel: 'HTTPをHTTPSへ301リダイレクトする（HTTPS強制）',
    behindProxyLabel: 'CDN・リバースプロキシ（Cloudflare等）配下で使う',
    behindProxyHint:
      'プロキシがHTTPSを終端している場合に選びます。専用のserverブロックではなく、X-Forwarded-Proto ヘッダーを見る if を出力します。',
    hostHeading: 'www の有無',
    wwwLabel: 'www の統一',
    wwwOptions: [
      { value: 'none', label: '統一しない' },
      {
        value: 'remove',
        label: 'wwwなしに統一（www.example.com → example.com）',
      },
      { value: 'add', label: 'wwwありに統一（example.com → www.example.com）' },
    ],
    domainLabel: 'ドメイン（wwwなし。例: example.com）',
    domainPlaceholder: '例: example.com',
    pathHeading: 'パスの正規化',
    slashLabel: '末尾スラッシュ',
    slashOptions: [
      { value: 'none', label: '変更しない' },
      { value: 'add', label: '拡張子のないURLの末尾に / を付ける' },
      {
        value: 'remove',
        label: 'URL末尾の / を取り除く（実在するディレクトリを除く）',
      },
    ],
    removeIndexLabel:
      '/index.html・/index.php への直接アクセスを / へ301リダイレクトする',
    redirectHeading: '個別URLのリダイレクト',
    redirectsLabel:
      '個別URLのリダイレクト（1行に「元のパス 転送先 [ステータス]」）',
    redirectsPlaceholder:
      '例:\n/old-page /new-page\n/campaign https://example.com/sale 302',
    redirectsHint:
      '元のパスは / から始め、転送先は / から始まるパスか https:// で始まるURLにします。ステータスは 301（恒久）・302（一時）・307・308 から選べ、省略すると301です。# で始まる行は無視します。元のパスの日本語はそのまま書けます（% によるエンコードは使えません）。',
    redirectMatchLabel: '元のパスの照合',
    redirectMatchOptions: [
      { value: 'exact', label: '完全一致（そのURLだけ）' },
      { value: 'prefix', label: '前方一致（配下のURLも同じ構成で転送）' },
    ],
    issuesHeading: '確認事項',
    noIssues: '問題は見つかりませんでした。',
    errorPrefix: 'エラー',
    warningPrefix: '警告',
    issueMessages: {
      noRules: '設定が選ばれていないため、出力は空です。',
      domainRequired:
        'www の統一にはドメインの入力が必要です。入力するまで、この設定は出力されません。',
      invalidDomain:
        'ドメイン「{value}」は使えません。example.com のような英数字とハイフンのドメインを入力してください（日本語ドメインは xn-- から始まる形式にします）。この設定は出力されません。',
      invalidRedirectFormat:
        '{line}行目: 「{value}」は「元のパス 転送先 [ステータス]」の形式（空白区切りで2〜3項目）ではありません。この行は出力されません。',
      invalidFrom:
        '{line}行目: 元のパス「{value}」は / から始め、? # % ; { } $ ・引用符・バックスラッシュ・空白を含まない形にしてください。この行は出力されません。',
      invalidTo:
        '{line}行目: 転送先「{value}」は / から始まるパス、または https:// か http:// で始まるURLにしてください（$ ; { } ・引用符・バックスラッシュ・空白・日本語は使えません。日本語は %E3… の形式にします）。この行は出力されません。',
      invalidStatus:
        '{line}行目: ステータス「{value}」は 301・302・307・308 のいずれかにしてください。この行は出力されません。',
      redirectLoop:
        '{line}行目: 「{value}」の転送先が元のパスと同じか、その配下のため、無限にリダイレクトされます。この行は出力されません。',
      duplicateRedirect:
        '{line}行目: 元のパス「{value}」が複数行にあります。nginxでは同じ location を2回書くと設定エラーになるため、出力されるのは最初の1行だけです。重複を整理してください。',
      redirectChain:
        '{line}行目: 転送先「{value}」がさらに別の行で転送されます。リダイレクトが2回以上連続するので、最終的な転送先に直接向けることをおすすめします。',
      httpTarget:
        '{line}行目: 転送先「{value}」が http:// です。HTTPS強制と合わせて、余計なリダイレクトが増えます。https:// にできるか確認してください。',
      slashRedirectConflict:
        '末尾スラッシュの付与・除去は個別リダイレクトより先に実行されます。元のパスが対象のURLと食い違う場合（例: 付与設定で /old を指定）、個別リダイレクトが効かないことがあります。元のパスの末尾スラッシュの有無を設定に合わせてください。',
      certificateNeeded:
        'HTTPS用のserverブロックには ssl_certificate のダミーのパスが入ります。www と wwwなしの両方を含む証明書（またはSAN証明書）のパスに書き換えてください。',
      proxyScheme:
        'プロキシ配下でHTTPS強制を使わない場合、リダイレクト先のスキーム（http/https）が実際のアクセスとずれることがあります。HTTPS強制と併用するか、反映後にURLを確認してください。',
    },
    outputHeading: '生成された nginx 設定',
    outputEmpty: '設定を選ぶと、ここに nginx の設定が生成されます。',
    copyButton: 'コピー',
    downloadButton: 'ダウンロード（nginx-redirect.conf）',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloaded: 'nginx-redirect.conf をダウンロードしました',
    verifyHeading: '反映後の確認手順',
    verifySteps: [
      '反映前に、現在の nginx の設定ファイル（/etc/nginx/ 以下など）をバックアップする。',
      '出力のコメントにある場所へ貼り付ける。「server { }」から始まるブロックは、server ブロックの外（http コンテキスト内）に置く。',
      'nginx -t で文法を確認し、問題がなければ nginx -s reload（または systemctl reload nginx）で反映する。',
      '次のコマンドで、転送先（Location）とステータス（301など）が意図どおりか、転送が何回も続いていないかを確認する。',
    ],
    verifyCommand:
      'curl -sIL http://example.com/ | grep -iE "^(HTTP|Location)"',
    notesHeading: '注意事項',
    notes: [
      '出力は設定の断片です。server { } で始まるブロックは、既存の server ブロックとは別に追加します。コメントで Add the following inside your main server block と書かれた部分は、ドメインを担当している既存の server ブロックの中に入れます。',
      'HTTPS強制のserverブロックは listen 80 を使います。同じ server_name と listen の組み合わせがすでにある場合は、重複しないように既存のブロックを整理してください。',
      'if は nginx では使える場所が限られます。このツールが出力する if は、return または rewrite だけを書く安全な使い方に絞っています。手で処理を追加するときは、nginx の公式ドキュメントにある if is evil の注意点を確認してください。',
      'location の照合は、%エンコードを戻したあとのパスに対して行われます。そのため元のパスに % は使えず、日本語などはそのまま書きます。',
      '末尾スラッシュを付けるルールは、拡張子（.）のないURLすべてに働きます。APIのパスなどが意図せず転送されないか確認してください。取り除くルールは、root が決まった server ブロックの中で、実在するディレクトリを除いて働きます。',
      '個別URLのリダイレクトは location として出力されます。完全一致（location =）と前方一致（正規表現）が混在すると、設定上の順序で優先順位が決まります。',
      '301は恒久的な移転として検索エンジンやブラウザにキャッシュされ、あとから戻すのが難しくなります。動作確認が済むまでは302で試すことをおすすめします。',
      '正規表現を直接書く上級者向けの指定には対応していません。複雑な条件は、生成結果を手で編集してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'serverブロック',
        description:
          'nginxで1つのサイト（ドメインとポートの組み合わせ）の設定をまとめる記述。server_name で担当するドメインを決める。',
      },
      {
        term: '301 / 302リダイレクト',
        description:
          '301は恒久的な移転、302は一時的な移転を表すステータス。検索エンジンは301を新しいURLへの評価の引き継ぎとして扱う。307・308は、リクエストの方式（POSTなど）を保ったまま転送するもの。',
      },
      {
        term: '$request_uri',
        description:
          'nginxの変数。リクエストされたパスとクエリ文字列を、書き換え前のまま保持している。リダイレクトでパスとクエリを引き継ぐのに使う。',
      },
      {
        term: 'location',
        description:
          'nginxでURLのパスごとに処理を振り分ける記述。= は完全一致、~ は正規表現での一致を表す。',
      },
    ],
  },
  en: {
    title: 'nginx Redirect Generator – HTTPS, www & 301 Rewrite',
    description:
      'Generate nginx redirect config: force HTTPS, unify www, trailing slashes and 301/302 redirects as server block snippets, with loop checks. Runs in your browser.',
    h1: 'nginx Redirect Generator (Force HTTPS, www Canonical, 301/302)',
    introHtml:
      'Build nginx config to paste into your <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">server</code> blocks by choosing the rules you need: force HTTPS, canonical www or non-www host, trailing slashes, and per-URL 301/302 redirects. Characters that would break the config, such as <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">;</code> or line breaks, are rejected, and redirect loops and duplicates are flagged. On Apache, use the <a href="/en/tools/htaccess-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">.htaccess Generator</a> instead; for what each code means, see the <a href="/en/tools/http-status-codes/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTP Status Codes reference</a>.',
    warningHeading: 'Read this before you deploy',
    warningText:
      'Do not apply the output to production as is. Run nginx -t to check the syntax, then reload. Back up your config first and replace placeholder values such as ssl_certificate with your own.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the rules you want, such as "Force HTTPS", "Unify www" and "Trailing slash".',
      'If you unify www, enter the bare domain, such as example.com, in the "Domain" field.',
      'To forward individual URLs, enter one "old path destination" pair per line in "Per-URL redirects".',
      'Review the checks, then use "Copy" or "Download" and paste the result into your config where the comments say.',
    ],
    httpsHeading: 'HTTPS',
    forceHttpsLabel: 'Redirect HTTP to HTTPS with a 301 (Force HTTPS)',
    behindProxyLabel: 'Site is behind a CDN or reverse proxy (e.g. Cloudflare)',
    behindProxyHint:
      'Choose this if a proxy terminates HTTPS. Instead of a separate server block, the output checks the X-Forwarded-Proto header with an if.',
    hostHeading: 'www or non-www',
    wwwLabel: 'Unify www',
    wwwOptions: [
      { value: 'none', label: 'Leave as is' },
      {
        value: 'remove',
        label: 'Use non-www (www.example.com → example.com)',
      },
      { value: 'add', label: 'Use www (example.com → www.example.com)' },
    ],
    domainLabel: 'Domain (without www, e.g. example.com)',
    domainPlaceholder: 'e.g. example.com',
    pathHeading: 'Path normalization',
    slashLabel: 'Trailing slash',
    slashOptions: [
      { value: 'none', label: 'Leave as is' },
      { value: 'add', label: 'Add / to URLs without a file extension' },
      {
        value: 'remove',
        label: 'Remove a trailing / (except real directories)',
      },
    ],
    removeIndexLabel:
      'Redirect direct requests for /index.html and /index.php to / (301)',
    redirectHeading: 'Per-URL redirects',
    redirectsLabel:
      'Per-URL redirects (one line per rule: "old path destination [status]")',
    redirectsPlaceholder:
      'e.g.\n/old-page /new-page\n/campaign https://example.com/sale 302',
    redirectsHint:
      'The old path starts with /. The destination is a path starting with / or a URL starting with https://. The status can be 301 (permanent), 302 (temporary), 307 or 308, and defaults to 301. Lines starting with # are ignored. Write non-ASCII characters in the old path as they are (percent-encoding is not allowed).',
    redirectMatchLabel: 'How to match the old path',
    redirectMatchOptions: [
      { value: 'exact', label: 'Exact match (that URL only)' },
      { value: 'prefix', label: 'Prefix match (also forwards URLs under it)' },
    ],
    issuesHeading: 'Checks',
    noIssues: 'No problems found.',
    errorPrefix: 'Error',
    warningPrefix: 'Warning',
    issueMessages: {
      noRules: 'No rules are selected, so the output is empty.',
      domainRequired:
        'Unifying www needs a domain. Until you enter one, this rule is left out of the output.',
      invalidDomain:
        'The domain "{value}" cannot be used. Enter a domain such as example.com with letters, digits and hyphens (use the xn-- form for internationalized domains). This rule is left out.',
      invalidRedirectFormat:
        'Line {line}: "{value}" is not in the "old path destination [status]" format (2 or 3 items separated by spaces). This line is left out.',
      invalidFrom:
        'Line {line}: the old path "{value}" must start with / and must not contain ? # % ; { } $, quotes, backslashes or whitespace. This line is left out.',
      invalidTo:
        'Line {line}: the destination "{value}" must be a path starting with / or a URL starting with https:// or http:// (no $ ; { }, quotes, backslashes, whitespace or non-ASCII characters; percent-encode them). This line is left out.',
      invalidStatus:
        'Line {line}: the status "{value}" must be 301, 302, 307 or 308. This line is left out.',
      redirectLoop:
        'Line {line}: the destination of "{value}" is the same path or sits under it, so it would redirect endlessly. This line is left out.',
      duplicateRedirect:
        'Line {line}: the old path "{value}" appears on more than one line. nginx rejects a duplicate location, so only the first line is output. Remove the extra line.',
      redirectChain:
        'Line {line}: the destination "{value}" is itself redirected by another line. That makes a chain of two or more redirects, so point it directly at the final URL.',
      httpTarget:
        'Line {line}: the destination "{value}" is http://. Combined with Force HTTPS it adds an extra redirect, so use https:// if you can.',
      slashRedirectConflict:
        'Trailing-slash rules run before the individual redirects. If an old path does not match the slash setting (for example /old with Add), that redirect may never fire. Write the old path with or without the trailing slash to match the setting.',
      certificateNeeded:
        'The HTTPS server block contains placeholder ssl_certificate paths. Replace them with a certificate that covers both the www and non-www names (or a SAN certificate).',
      proxyScheme:
        'Behind a proxy without Force HTTPS, the scheme (http or https) of the redirect target can differ from what the visitor used. Combine it with Force HTTPS or check the resulting URLs after you deploy.',
    },
    outputHeading: 'Generated nginx config',
    outputEmpty: 'Pick some rules and the nginx config appears here.',
    copyButton: 'Copy',
    downloadButton: 'Download (nginx-redirect.conf)',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloaded: 'Downloaded nginx-redirect.conf',
    verifyHeading: 'Checklist after deploying',
    verifySteps: [
      'Before the change, back up your current nginx config files (for example under /etc/nginx/).',
      'Paste the output where its comments say. Blocks that start with "server { }" go outside existing server blocks, inside the http context.',
      'Run nginx -t to check the syntax, then apply it with nginx -s reload (or systemctl reload nginx).',
      'Run the command below to check that the Location and status (such as 301) are what you expect and that the redirects do not repeat many times.',
    ],
    verifyCommand:
      'curl -sIL http://example.com/ | grep -iE "^(HTTP|Location)"',
    notesHeading: 'Notes',
    notes: [
      'The output is a set of snippets. Blocks that start with server { } are added as separate server blocks. Everything under the comment that says to add it inside your main server block goes inside the existing server block that handles your domain.',
      'The force-HTTPS server block uses listen 80. If you already have a server block with the same listen and server_name, merge them so they do not conflict.',
      'In nginx, if is only safe in a few situations. The if blocks this tool writes contain just a return or rewrite, which is the safe pattern. If you add more to them by hand, read the If Is Evil page in the nginx documentation first.',
      'A location is matched against the path after percent-decoding. That is why % is not allowed in the old path and non-ASCII characters are written as they are.',
      'The rule that adds a trailing slash applies to every URL without a dot, so check that API paths are not redirected by accident. The rule that removes it works inside a server block that has a root, and skips real directories.',
      'Per-URL redirects are written as locations. When exact matches (location =) and prefix matches (regex) are mixed, the order in the file decides which one wins.',
      'Browsers and search engines cache a 301 as a permanent move, which is hard to undo. Try a 302 first until you are sure it works.',
      'Hand-written regular expressions are not supported. For complex conditions, edit the generated output by hand.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'server block',
        description:
          'The nginx directive that groups the settings for one site (a domain and port combination). server_name decides which domains it handles.',
      },
      {
        term: '301 / 302 redirect',
        description:
          '301 means a permanent move and 302 a temporary one. Search engines treat a 301 as passing ranking signals to the new URL. 307 and 308 forward while keeping the request method (such as POST).',
      },
      {
        term: '$request_uri',
        description:
          'An nginx variable holding the original requested path and query string, before any rewriting. Used to carry the path and query over in a redirect.',
      },
      {
        term: 'location',
        description:
          'The nginx directive that routes requests by URL path. = means an exact match and ~ a regular expression match.',
      },
    ],
  },
};
