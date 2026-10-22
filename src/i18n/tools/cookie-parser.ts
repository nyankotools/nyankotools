import type { Locale } from '../../data/tools';
import type { IssueCode } from '../../lib/tools/cookie-parser';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CookieLabels {
  kindRequest: string;
  kindSet: string;
  name: string;
  value: string;
  length: string;
  decoded: string;
  domain: string;
  path: string;
  expires: string;
  maxAge: string;
  secure: string;
  httpOnly: string;
  sameSite: string;
  partitioned: string;
  priority: string;
  lifetime: string;
  unknownAttributes: string;
  yes: string;
  no: string;
  notSet: string;
  empty: string;
  lifetimeSession: string;
  lifetimePersistent: string;
  lifetimeExpired: string;
  unitDay: string;
  unitHour: string;
  unitMinute: string;
  unitSecond: string;
  chars: string;
  issuesHeading: string;
}

export interface CookieParserPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  modeLabel: string;
  modeAuto: string;
  modeCookie: string;
  modeSetCookie: string;
  sampleButton: string;
  clearButton: string;
  revealLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  summary: string;
  noResult: string;
  labels: CookieLabels;
  issues: Record<IssueCode, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
  sampleText: string;
}

const SAMPLE = [
  'Set-Cookie: session_id=a1b2c3d4e5f6g7h8; Domain=example.com; Path=/; Max-Age=3600; Secure; HttpOnly; SameSite=Lax',
  'Set-Cookie: __Host-token=zyx987; Path=/; Secure; HttpOnly; SameSite=None; Partitioned',
  'Set-Cookie: theme=dark; Expires=Wed, 21 Oct 2037 07:28:00 GMT; SameSite=None',
].join('\n');

export const cookieParserContent: Record<Locale, CookieParserPageContent> = {
  ja: {
    title: 'Cookie解析（Cookie・Set-Cookieの属性を分解）',
    description:
      'CookieヘッダーやSet-Cookieを貼り付けて、名前・値・Domain・Path・Expires・Max-Age・Secure・HttpOnly・SameSite・Partitionedに分解して表示する無料ツールです。値は初期状態でマスク表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Cookie解析（Cookie・Set-Cookie分解）',
    introHtml:
      'リクエストの <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">Cookie</code> ヘッダーやレスポンスの <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">Set-Cookie</code> を貼り付けると、名前・値・各属性に分解し、SameSite=NoneでSecureがない、__Host-接頭辞の条件違反などの設定ミスも指摘します。Cookieの値はセッション情報を含み得るため、初期状態ではマスクして表示します。レスポンスヘッダー全体を診断したい場合は <a href="/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTPヘッダー解析・セキュリティ診断</a> をご利用ください。',
    inputLabel: 'Cookie / Set-Cookie',
    inputPlaceholder:
      'Set-Cookie: sid=abc123; Path=/; Secure; HttpOnly; SameSite=Lax',
    modeLabel: '入力の種類',
    modeAuto: '自動判定',
    modeCookie: 'Cookie',
    modeSetCookie: 'Set-Cookie',
    sampleButton: 'サンプルを入力',
    clearButton: 'クリア',
    revealLabel: 'Cookieの値を表示する',
    copyButton: '結果をJSONでコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    summary: '{count}件のCookieを解析しました',
    noResult: 'Cookieを解析できませんでした。入力内容を確認してください。',
    labels: {
      kindRequest: 'Cookie（リクエスト）',
      kindSet: 'Set-Cookie（レスポンス）',
      name: '名前',
      value: '値',
      length: '値の長さ',
      decoded: '値（URLデコード後）',
      domain: 'Domain',
      path: 'Path',
      expires: 'Expires',
      maxAge: 'Max-Age',
      secure: 'Secure',
      httpOnly: 'HttpOnly',
      sameSite: 'SameSite',
      partitioned: 'Partitioned',
      priority: 'Priority',
      lifetime: '有効期間',
      unknownAttributes: '不明な属性',
      yes: 'あり',
      no: 'なし',
      notSet: '未指定',
      empty: '（空）',
      lifetimeSession: 'セッションCookie（ブラウザを閉じると削除）',
      lifetimePersistent: '永続Cookie',
      lifetimeExpired: '期限切れ（削除指示）',
      unitDay: '日',
      unitHour: '時間',
      unitMinute: '分',
      unitSecond: '秒',
      chars: '文字',
      issuesHeading: '指摘事項',
    },
    issues: {
      noEquals:
        '「名前=値」の形式ではありません（= がありません）。ブラウザに無視される場合があります。',
      emptyName: 'Cookie名が空です。',
      duplicateName: '同じ名前のCookieが複数あります。',
      sameSiteInvalid:
        'SameSiteの値が不正です（Strict / Lax / None のいずれかを指定します）。',
      sameSiteNoneNoSecure:
        'SameSite=None にはSecure属性が必要です。付いていないとモダンなブラウザに拒否されます。',
      partitionedNoSecure: 'Partitioned属性にはSecure属性が必要です。',
      expiresInvalid: 'Expiresを日時として解釈できません。',
      maxAgeInvalid: 'Max-Ageが整数ではありません。無視されます。',
      expired:
        '有効期限が過去（またはMax-Age 0以下）のため、このCookieは削除されます。',
      bothExpiry:
        'ExpiresとMax-Ageの両方が指定されています。Max-Ageが優先されます。',
      lifetimeOver400d:
        '有効期間が400日を超えています。Chromeなどでは400日に短縮されます。',
      secureMissing: 'Secure属性がありません。HTTP通信でも送信されます。',
      httpOnlyMissing:
        'HttpOnly属性がありません。JavaScriptから読み取れます（XSS時に盗まれやすくなります）。',
      sameSiteMissing:
        'SameSiteが未指定です。モダンなブラウザでは Lax として扱われます。',
      prefixSecureInvalid: '__Secure- 接頭辞のCookieにはSecure属性が必要です。',
      prefixHostInvalid:
        '__Host- 接頭辞のCookieには、Secure属性・Path=/ が必要で、Domain属性は指定できません。',
    },
    notesHeading: '注意点',
    notes: [
      'Cookieの値はセッションIDなど他人になりすませる情報を含み得ます。このツールはすべてブラウザ内で処理し、サーバーには送信しませんが、本番の実Cookieの扱いには十分ご注意ください（画面共有中は値を表示しないでください）。',
      '自動判定では、2つ目以降にDomain・Path・Secureなどの属性があれば Set-Cookie、なければ Cookie ヘッダーとして扱います。行頭の「Set-Cookie:」「Cookie:」があればそれを優先します。',
      'Set-Cookie は1行に1つのCookieとして貼り付けてください（複数行も可）。Cookieヘッダーは「名前=値」をセミコロンで区切った形式です。',
      '指摘はブラウザの一般的な挙動（RFC 6265bis）に基づく目安です。ブラウザの種類やバージョンによって扱いが異なる場合があります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Set-Cookie',
        description:
          'サーバーがレスポンスヘッダーで送り、ブラウザにCookieを保存させるための指示です。名前=値に続けて、Domain・Path・有効期限・Secure・HttpOnly・SameSiteなどの属性をセミコロン区切りで指定します。',
      },
      {
        term: 'Domain / Path',
        description:
          'Cookieを送信する範囲の指定です。Domainを省略するとCookieを発行したホストのみが対象（ホスト限定）になり、指定するとそのサブドメインにも送信されます。Pathは対象のURLパスの前方一致です。',
      },
      {
        term: 'Expires / Max-Age',
        description:
          '有効期限の指定です。Expiresは日時、Max-Ageは秒数で指定し、両方ある場合はMax-Ageが優先されます。どちらも無いCookieはセッションCookieとして扱われます。',
      },
      {
        term: 'Secure / HttpOnly',
        description:
          'Secureは HTTPS 通信でのみ送信する指定、HttpOnlyはJavaScriptの document.cookie から読めなくする指定です。',
      },
      {
        term: 'SameSite',
        description:
          '他サイトからのリクエストにCookieを付けるかを制御します。Strictは同一サイトのみ、Laxはリンク遷移などの安全なトップレベル遷移では送信、Noneは常に送信（Secureが必須）です。',
      },
      {
        term: 'Partitioned（CHIPS）',
        description:
          'サードパーティCookieを、埋め込み元のトップレベルサイトごとに分けて保存する指定です。Secure属性が必要です。',
      },
      {
        term: '__Host- / __Secure- 接頭辞',
        description:
          'Cookie名の接頭辞でセキュリティ条件を強制する仕組みです。__Secure- はSecureが必須、__Host- はさらにPath=/ かつDomain指定なしが必須で、サブドメインからの上書きを防ぎます。',
      },
    ],
    sampleText: SAMPLE,
  },
  en: {
    title: 'Cookie Parser (Cookie & Set-Cookie Decoder)',
    description:
      'Parse Cookie and Set-Cookie headers into name, value, Domain, Path, Expires, Max-Age, Secure, HttpOnly and SameSite. Values are masked. Runs in your browser.',
    h1: 'Cookie Parser (Cookie & Set-Cookie)',
    introHtml:
      'Paste a request <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">Cookie</code> header or a response <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">Set-Cookie</code> line to split it into name, value and attributes. It also flags common mistakes such as SameSite=None without Secure or a broken __Host- prefix. Cookie values can contain session secrets, so they are masked by default. To audit a whole response, use the <a href="/en/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTP Header Analyzer</a>.',
    inputLabel: 'Cookie / Set-Cookie',
    inputPlaceholder:
      'Set-Cookie: sid=abc123; Path=/; Secure; HttpOnly; SameSite=Lax',
    modeLabel: 'Input type',
    modeAuto: 'Auto-detect',
    modeCookie: 'Cookie',
    modeSetCookie: 'Set-Cookie',
    sampleButton: 'Insert sample',
    clearButton: 'Clear',
    revealLabel: 'Show cookie values',
    copyButton: 'Copy result as JSON',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    summary: 'Parsed {count} cookie(s)',
    noResult: 'No cookies could be parsed. Check your input.',
    labels: {
      kindRequest: 'Cookie (request)',
      kindSet: 'Set-Cookie (response)',
      name: 'Name',
      value: 'Value',
      length: 'Value length',
      decoded: 'Value (URL-decoded)',
      domain: 'Domain',
      path: 'Path',
      expires: 'Expires',
      maxAge: 'Max-Age',
      secure: 'Secure',
      httpOnly: 'HttpOnly',
      sameSite: 'SameSite',
      partitioned: 'Partitioned',
      priority: 'Priority',
      lifetime: 'Lifetime',
      unknownAttributes: 'Unknown attributes',
      yes: 'Yes',
      no: 'No',
      notSet: 'Not set',
      empty: '(empty)',
      lifetimeSession: 'Session cookie (removed when the browser closes)',
      lifetimePersistent: 'Persistent cookie',
      lifetimeExpired: 'Expired (deletion instruction)',
      unitDay: 'd',
      unitHour: 'h',
      unitMinute: 'min',
      unitSecond: 's',
      chars: 'chars',
      issuesHeading: 'Findings',
    },
    issues: {
      noEquals:
        'Not in "name=value" form (no "=" found). Browsers may ignore it.',
      emptyName: 'The cookie name is empty.',
      duplicateName: 'Several cookies share this name.',
      sameSiteInvalid: 'Invalid SameSite value. Use Strict, Lax or None.',
      sameSiteNoneNoSecure:
        'SameSite=None requires the Secure attribute; modern browsers reject it otherwise.',
      partitionedNoSecure: 'Partitioned requires the Secure attribute.',
      expiresInvalid: 'Expires could not be read as a date.',
      maxAgeInvalid: 'Max-Age is not an integer and will be ignored.',
      expired:
        'The expiry is in the past (or Max-Age is 0 or less), so this cookie will be deleted.',
      bothExpiry: 'Both Expires and Max-Age are set. Max-Age takes precedence.',
      lifetimeOver400d:
        'The lifetime is over 400 days. Chrome and others cap it at 400 days.',
      secureMissing: 'No Secure attribute, so it is also sent over plain HTTP.',
      httpOnlyMissing:
        'No HttpOnly attribute: JavaScript can read it, which makes it easier to steal via XSS.',
      sameSiteMissing: 'SameSite is not set. Modern browsers treat it as Lax.',
      prefixSecureInvalid: 'A __Secure- cookie must have the Secure attribute.',
      prefixHostInvalid:
        'A __Host- cookie needs Secure and Path=/, and must not set Domain.',
    },
    notesHeading: 'Notes',
    notes: [
      'Cookie values can contain session IDs that let someone impersonate a user. Everything is processed in your browser and nothing is sent to a server, but handle real production cookies with care and keep values hidden while screen sharing.',
      'Auto-detect treats a line as Set-Cookie if it has attributes such as Domain, Path or Secure after the first pair, and as a Cookie header otherwise. A leading "Set-Cookie:" or "Cookie:" always wins.',
      'Paste one Set-Cookie per line (multiple lines are fine). A Cookie header is a list of "name=value" pairs separated by semicolons.',
      'Findings follow common browser behavior (RFC 6265bis) and are a guide only; handling can differ between browsers and versions.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Set-Cookie',
        description:
          'A response header a server uses to tell the browser to store a cookie. After name=value it lists attributes such as Domain, Path, expiry, Secure, HttpOnly and SameSite, separated by semicolons.',
      },
      {
        term: 'Domain / Path',
        description:
          'These limit where the cookie is sent. Without Domain the cookie is host-only (just the issuing host); with Domain it is also sent to subdomains. Path matches by URL path prefix.',
      },
      {
        term: 'Expires / Max-Age',
        description:
          'Expiry settings. Expires is a date and Max-Age is a number of seconds; Max-Age wins if both are present. A cookie with neither is a session cookie.',
      },
      {
        term: 'Secure / HttpOnly',
        description:
          'Secure sends the cookie only over HTTPS. HttpOnly hides it from JavaScript (document.cookie).',
      },
      {
        term: 'SameSite',
        description:
          'Controls whether the cookie is sent on cross-site requests. Strict sends it only on same-site requests, Lax also on safe top-level navigations such as link clicks, and None always (Secure required).',
      },
      {
        term: 'Partitioned (CHIPS)',
        description:
          'Stores a third-party cookie separately for each top-level site that embeds it. Requires Secure.',
      },
      {
        term: '__Host- / __Secure- prefixes',
        description:
          'Cookie name prefixes that enforce security rules. __Secure- requires Secure; __Host- additionally requires Path=/ and no Domain, preventing subdomains from overwriting it.',
      },
    ],
    sampleText: SAMPLE,
  },
};
