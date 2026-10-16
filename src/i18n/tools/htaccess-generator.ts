import type { Locale } from '../../data/tools';
import type { HtaccessIssueCode } from '../../lib/tools/htaccess-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HtaccessGeneratorPageContent {
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
  miscHeading: string;
  disableIndexesLabel: string;
  errorDocHeading: string;
  errorDoc403Label: string;
  errorDoc404Label: string;
  errorDoc500Label: string;
  errorDocPlaceholder: string;
  issuesHeading: string;
  noIssues: string;
  errorPrefix: string;
  warningPrefix: string;
  issueMessages: Record<HtaccessIssueCode, string>;
  outputHeading: string;
  outputEmpty: string;
  copyButton: string;
  downloadButton: string;
  downloadHint: string;
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

export const htaccessGeneratorContent: Record<
  Locale,
  HtaccessGeneratorPageContent
> = {
  ja: {
    title: '.htaccess生成ツール（HTTPS強制・www統一・301リダイレクト）',
    description:
      'Apache用の.htaccessを、HTTPS強制、www有無の統一、末尾スラッシュ、個別URLの301/302リダイレクト、エラーページ指定まで項目を選ぶだけで生成する無料ツールです。リダイレクトループの警告と反映後の確認手順つき。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '.htaccess生成（リダイレクト・HTTPS強制・www統一）',
    introHtml:
      'Apache（共用レンタルサーバーなど）で使う <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">.htaccess</code> を、HTTPS強制・www有無の統一・末尾スラッシュ・個別URLの301/302リダイレクト・エラーページ指定から選んで生成します。リダイレクトのループや重複を検出して警告し、反映後に確認するコマンドも案内します。リダイレクトの意味は <a href="/tools/http-status-codes/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTPステータスコード一覧</a> も参考にしてください。',
    warningHeading: '反映前にお読みください',
    warningText:
      '.htaccess の書き間違いは、サイト全体が500エラーになる原因になります。反映する前に、現在の .htaccess を必ずバックアップしてください。反映後はすぐにサイトを開いて確認し、エラーになったら元のファイルに戻します。',
    howToHeading: '使い方',
    howToSteps: [
      '「HTTPS強制」「www の統一」「末尾スラッシュ」など、行いたい設定を選びます。',
      'www を統一する場合は「ドメイン」欄に、example.com のようにwwwなしのドメインを入力します。',
      '個別のURLを転送したいときは、「個別URLのリダイレクト」欄に1行ずつ「元のパス 転送先」を入力します。',
      '確認事項を見て、「コピー」または「ダウンロード」で出力し、サイトのルートの .htaccess に反映します（ダウンロードしたファイルは htaccess.txt から .htaccess に名前を変更します）。',
    ],
    httpsHeading: 'HTTPS',
    forceHttpsLabel: 'HTTPをHTTPSへ301リダイレクトする（HTTPS強制）',
    behindProxyLabel: 'CDN・リバースプロキシ（Cloudflare等）配下で使う',
    behindProxyHint:
      'プロキシがHTTPSを終端している場合は、チェックしないと無限リダイレクト（ループ）になることがあります。',
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
      { value: 'add', label: 'ディレクトリのURLに / を付ける' },
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
      '元のパスは / から始め、転送先は / から始まるパスか https:// で始まるURLにします。ステータスは 301（恒久）・302（一時）・307・308 から選べ、省略すると301です。# で始まる行は無視します。',
    redirectMatchLabel: '元のパスの照合',
    redirectMatchOptions: [
      { value: 'exact', label: '完全一致（そのURLだけ）' },
      { value: 'prefix', label: '前方一致（配下のURLも同じ構成で転送）' },
    ],
    miscHeading: 'その他',
    disableIndexesLabel:
      'ディレクトリの一覧表示を無効にする（Options -Indexes）',
    errorDocHeading: 'エラーページ',
    errorDoc403Label: '403（アクセス拒否）のページ',
    errorDoc404Label: '404（ページが見つからない）のページ',
    errorDoc500Label: '500（サーバーエラー）のページ',
    errorDocPlaceholder: '例: /404.html',
    issuesHeading: '確認事項',
    noIssues: '問題は見つかりませんでした。',
    errorPrefix: 'エラー',
    warningPrefix: '警告',
    issueMessages: {
      noRules: '設定が選ばれていないため、.htaccess の内容は空です。',
      domainRequired:
        'www の統一にはドメインの入力が必要です。入力するまで、この設定は出力されません。',
      invalidDomain:
        'ドメイン「{value}」は使えません。example.com のような英数字とハイフンのドメインを入力してください（日本語ドメインは xn-- から始まる形式にします）。この設定は出力されません。',
      invalidRedirectFormat:
        '{line}行目: 「{value}」は「元のパス 転送先 [ステータス]」の形式（空白区切りで2〜3項目）ではありません。この行は出力されません。',
      invalidFrom:
        '{line}行目: 元のパス「{value}」は / から始め、?・#・引用符・バックスラッシュ・日本語などを含まない形にしてください（日本語は %E3… の形式にします）。この行は出力されません。',
      invalidTo:
        '{line}行目: 転送先「{value}」は / から始まるパス、または https:// か http:// で始まるURLにしてください（$・引用符・バックスラッシュ・空白・日本語は使えません）。この行は出力されません。',
      invalidStatus:
        '{line}行目: ステータス「{value}」は 301・302・307・308 のいずれかにしてください。この行は出力されません。',
      redirectLoop:
        '{line}行目: 「{value}」の転送先が元のパスと同じか、その配下のため、無限にリダイレクトされます。この行は出力されません。',
      duplicateRedirect:
        '{line}行目: 元のパス「{value}」が複数行にあります。先に書いたものが優先され、後の行は効きません。',
      redirectChain:
        '{line}行目: 転送先「{value}」がさらに別の行で転送されます。リダイレクトが2回以上連続するので、最終的な転送先に直接向けることをおすすめします。',
      httpTarget:
        '{line}行目: 転送先「{value}」が http:// です。HTTPS強制と合わせて、余計なリダイレクトが増えます。https:// にできるか確認してください。',
      invalidErrorDoc:
        'エラーページ「{value}」は / から始まるパスにしてください（引用符・$・日本語は使えません）。この設定は出力されません。',
      httpsLoopRisk:
        'Cloudflareなどの CDN・リバースプロキシ経由で配信している場合、このままではリダイレクトのループになることがあります。その場合は「CDN・リバースプロキシ配下で使う」をチェックしてください。',
      proxyScheme:
        'プロキシ配下でHTTPS強制を使わない場合、リダイレクト先のスキーム（http/https）が実際のアクセスとずれることがあります。HTTPS強制と併用するか、反映後にURLを確認してください。',
    },
    outputHeading: '生成された .htaccess',
    outputEmpty: '設定を選ぶと、ここに .htaccess の内容が生成されます。',
    copyButton: 'コピー',
    downloadButton: 'ダウンロード（htaccess.txt）',
    downloadHint:
      'ブラウザの仕様で、保存されるファイル名は先頭のドットが付かない htaccess.txt になります。サーバーに置く前に .htaccess に名前を変更してください。',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloaded: 'htaccess.txt をダウンロードしました',
    verifyHeading: '反映後の確認手順',
    verifySteps: [
      '反映前に、サーバー上の既存の .htaccess を別名でバックアップする（FTPやファイルマネージャーでコピーするだけで十分です）。',
      '生成した内容を、サイトのルートの .htaccess に追記または置き換える。すでにWordPressなどの記述がある場合は、# BEGIN WordPress より前に追記する。',
      'ブラウザでサイトのトップページを開き、500エラー（Internal Server Error）が出ていないか確認する。出たら、すぐに手順1のバックアップに戻す。',
      '次のコマンドで、転送先（Location）とステータス（301など）が意図どおりか、転送が何回も続いていないかを確認する。',
    ],
    verifyCommand:
      'curl -sIL http://example.com/ | grep -iE "^(HTTP|Location)"',
    notesHeading: '注意事項',
    notes: [
      '.htaccess は Apache（およびその互換サーバー）専用です。nginx や、Cloudflare Pages・Netlify・Vercel などの静的ホスティングでは使えません。',
      'サーバー設定で AllowOverride が許可されていないと、.htaccess は無視されるか、Options など一部の記述が500エラーになります。共用レンタルサーバーでは、管理画面の .htaccess 編集機能が使える場合もあります。',
      '生成するルールは mod_rewrite・mod_alias を使い、モジュールが無効な環境でも500エラーにならないよう <IfModule> で囲んでいます。ただし、その場合はリダイレクトが動かないだけで気づきにくいため、反映後に必ず動作を確認してください。',
      'サイトのルート（ドキュメントルート）に置く前提のルールです。サブディレクトリに置く場合は、パスの指定を調整する必要があります。',
      'WordPressなどのCMSが同じ .htaccess を書き換えることがあります。CMSが管理する区間（# BEGIN と # END で囲まれた部分）の外側に追記してください。',
      '301は恒久的な移転として検索エンジンやブラウザにキャッシュされ、あとから戻すのが難しくなります。動作確認が済むまでは302で試すことをおすすめします。',
      '個別URLのリダイレクトは、HTTPS強制やwww統一より先にApacheが処理します。http:// や www 付きの元URLからは、2回に分けて転送されることがあります。1回で済ませたい場合は、転送先を https:// から始まる正規のURL（絶対URL）にしてください。',
      '正規表現を直接書く上級者向けの指定には対応していません。複雑な条件は、生成結果を手で編集してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '.htaccess',
        description:
          'Apacheでディレクトリ単位の設定を書けるファイル。サーバー全体の設定を変えずに、リダイレクトやアクセス制限などを個別に設定できる。',
      },
      {
        term: '301 / 302リダイレクト',
        description:
          '301は恒久的な移転、302は一時的な移転を表すステータス。検索エンジンは301を新しいURLへの評価の引き継ぎとして扱う。307・308は、リクエストの方式（POSTなど）を保ったまま転送するもの。',
      },
      {
        term: 'mod_rewrite / mod_alias',
        description:
          'Apacheのモジュール。mod_rewriteは条件付きの書き換え（HTTPS強制やwww統一）、mod_aliasは単純なURLの転送（Redirect）に使う。',
      },
      {
        term: 'AllowOverride',
        description:
          'Apacheの設定項目。.htaccessでどの種類の設定を上書きしてよいかを決める。許可されていないと、.htaccessの記述が無視されるか500エラーになる。',
      },
    ],
  },
  en: {
    title: '.htaccess Generator – Force HTTPS, www & 301 Redirects',
    description:
      'Build an Apache .htaccess file: force HTTPS, unify www, trailing slashes, 301/302 redirects and error pages, with loop warnings. Runs in your browser.',
    h1: '.htaccess Generator (Redirects, Force HTTPS, www Canonical)',
    introHtml:
      'Build an Apache <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">.htaccess</code> file by choosing the rules you need: force HTTPS, canonical www or non-www host, trailing slashes, per-URL 301/302 redirects, and custom error pages. The tool flags redirect loops and duplicates, and tells you how to verify the result after you upload it. For what each redirect code means, see the <a href="/en/tools/http-status-codes/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTP Status Codes reference</a>.',
    warningHeading: 'Read this before you deploy',
    warningText:
      'A mistake in .htaccess can make your whole site return a 500 error. Back up your current .htaccess before changing it, open the site right after the change, and restore the backup immediately if it breaks.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the rules you want, such as "Force HTTPS", "Unify www" and "Trailing slash".',
      'If you unify www, enter the bare domain, such as example.com, in the "Domain" field.',
      'To forward individual URLs, enter one "old path destination" pair per line in "Per-URL redirects".',
      'Review the checks, then use "Copy" or "Download" and apply it to the .htaccess in your site root (rename a downloaded htaccess.txt to .htaccess).',
    ],
    httpsHeading: 'HTTPS',
    forceHttpsLabel: 'Redirect HTTP to HTTPS with a 301 (Force HTTPS)',
    behindProxyLabel: 'Site is behind a CDN or reverse proxy (e.g. Cloudflare)',
    behindProxyHint:
      'If a proxy terminates HTTPS and you leave this unchecked, the site can end up in an endless redirect loop.',
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
      { value: 'add', label: 'Add / to directory URLs' },
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
      'The old path starts with /. The destination is a path starting with / or a URL starting with https://. The status can be 301 (permanent), 302 (temporary), 307 or 308, and defaults to 301. Lines starting with # are ignored.',
    redirectMatchLabel: 'How to match the old path',
    redirectMatchOptions: [
      { value: 'exact', label: 'Exact match (that URL only)' },
      { value: 'prefix', label: 'Prefix match (also forwards URLs under it)' },
    ],
    miscHeading: 'Other',
    disableIndexesLabel: 'Disable directory listings (Options -Indexes)',
    errorDocHeading: 'Error pages',
    errorDoc403Label: '403 (forbidden) page',
    errorDoc404Label: '404 (not found) page',
    errorDoc500Label: '500 (server error) page',
    errorDocPlaceholder: 'e.g. /404.html',
    issuesHeading: 'Checks',
    noIssues: 'No problems found.',
    errorPrefix: 'Error',
    warningPrefix: 'Warning',
    issueMessages: {
      noRules: 'No rules are selected, so the .htaccess output is empty.',
      domainRequired:
        'Unifying www needs a domain. Until you enter one, this rule is left out of the output.',
      invalidDomain:
        'The domain "{value}" cannot be used. Enter a domain such as example.com with letters, digits and hyphens (use the xn-- form for internationalized domains). This rule is left out.',
      invalidRedirectFormat:
        'Line {line}: "{value}" is not in the "old path destination [status]" format (2 or 3 items separated by spaces). This line is left out.',
      invalidFrom:
        'Line {line}: the old path "{value}" must start with / and must not contain ?, #, quotes, backslashes or non-ASCII characters (percent-encode them). This line is left out.',
      invalidTo:
        'Line {line}: the destination "{value}" must be a path starting with / or a URL starting with https:// or http:// (no $, quotes, backslashes, spaces or non-ASCII characters). This line is left out.',
      invalidStatus:
        'Line {line}: the status "{value}" must be 301, 302, 307 or 308. This line is left out.',
      redirectLoop:
        'Line {line}: the destination of "{value}" is the same path or sits under it, so it would redirect endlessly. This line is left out.',
      duplicateRedirect:
        'Line {line}: the old path "{value}" appears on more than one line. The first one wins and the later line has no effect.',
      redirectChain:
        'Line {line}: the destination "{value}" is itself redirected by another line. That makes a chain of two or more redirects, so point it directly at the final URL.',
      httpTarget:
        'Line {line}: the destination "{value}" is http://. Combined with Force HTTPS it adds an extra redirect, so use https:// if you can.',
      invalidErrorDoc:
        'The error page "{value}" must be a path starting with / (no quotes, $ or non-ASCII characters). This setting is left out.',
      httpsLoopRisk:
        'If the site is served through a CDN or reverse proxy such as Cloudflare, this rule can cause a redirect loop. In that case check "Site is behind a CDN or reverse proxy".',
      proxyScheme:
        'Behind a proxy without Force HTTPS, the scheme (http or https) of the redirect target can differ from what the visitor used. Combine it with Force HTTPS or check the resulting URLs after you deploy.',
    },
    outputHeading: 'Generated .htaccess',
    outputEmpty: 'Pick some rules and the .htaccess content appears here.',
    copyButton: 'Copy',
    downloadButton: 'Download (htaccess.txt)',
    downloadHint:
      'Browsers drop the leading dot, so the file is saved as htaccess.txt. Rename it to .htaccess before you put it on the server.',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloaded: 'Downloaded htaccess.txt',
    verifyHeading: 'Checklist after deploying',
    verifySteps: [
      'Before the change, copy the existing .htaccess on the server to a backup name (copying it in FTP or the file manager is enough).',
      'Add the generated content to the .htaccess in your site root, or replace it. If a CMS such as WordPress already wrote rules there, add yours above the # BEGIN WordPress line.',
      'Open the top page in a browser and check there is no 500 Internal Server Error. If there is, restore the backup from step 1 right away.',
      'Run the command below to check that the Location and status (such as 301) are what you expect and that the redirects do not repeat many times.',
    ],
    verifyCommand:
      'curl -sIL http://example.com/ | grep -iE "^(HTTP|Location)"',
    notesHeading: 'Notes',
    notes: [
      '.htaccess works only on Apache and compatible servers. It does not work on nginx or on static hosts such as Cloudflare Pages, Netlify or Vercel.',
      'If the server does not allow AllowOverride, .htaccess is ignored, or directives such as Options cause a 500 error. Some shared hosts also provide an .htaccess editor in their control panel.',
      'The generated rules use mod_rewrite and mod_alias and are wrapped in <IfModule> so a missing module does not cause a 500 error. The downside is that the redirect then silently does nothing, so always test it after deploying.',
      'The rules assume the file lives in the site root (document root). If you place it in a subdirectory, the paths need adjusting.',
      'A CMS such as WordPress may rewrite the same .htaccess. Add your rules outside the section the CMS manages (between its # BEGIN and # END lines).',
      'Browsers and search engines cache a 301 as a permanent move, which is hard to undo. Try a 302 first until you are sure it works.',
      'Apache applies per-URL redirects before the force-HTTPS and www rules, so a request to an http:// or www URL can be redirected twice. To do it in one step, make the destination a full https:// URL on your canonical host.',
      'Hand-written regular expressions are not supported. For complex conditions, edit the generated output by hand.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: '.htaccess',
        description:
          'A per-directory configuration file for Apache. It lets you set redirects, access rules and more without changing the main server configuration.',
      },
      {
        term: '301 / 302 redirect',
        description:
          '301 means a permanent move and 302 a temporary one. Search engines treat a 301 as passing ranking signals to the new URL. 307 and 308 forward while keeping the request method (such as POST).',
      },
      {
        term: 'mod_rewrite / mod_alias',
        description:
          'Apache modules. mod_rewrite does conditional rewriting (force HTTPS, www canonicalization), while mod_alias handles plain URL redirects (Redirect).',
      },
      {
        term: 'AllowOverride',
        description:
          'An Apache setting that decides which kinds of directives .htaccess may override. If it is not allowed, the .htaccess rules are ignored or cause a 500 error.',
      },
    ],
  },
};
