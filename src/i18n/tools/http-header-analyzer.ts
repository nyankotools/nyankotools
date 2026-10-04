import type { Locale } from '../../data/tools';
import type {
  FindingId,
  FindingStatus,
  IssueCode,
  RecommendationFormat,
} from '../../lib/tools/http-header-analyzer';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface FindingText {
  label: string;
  /** そのヘッダーが何を守るか（常に表示する短い説明） */
  description: string;
}

export interface HttpHeaderAnalyzerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  sampleButton: string;
  inputHint: string;
  analyzeButton: string;
  emptyError: string;
  /** {count} を解釈できなかった行数に置き換える */
  invalidNotice: string;

  summaryHeading: string;
  /** {good} {warn} {missing} を件数に置き換える */
  summaryTemplate: string;
  statusLabels: Record<FindingStatus, string>;
  findingsHeading: string;
  findings: Record<FindingId, FindingText>;
  issues: Record<IssueCode, string>;
  notSet: string;

  parsedHeading: string;
  parsedNameLabel: string;
  parsedValueLabel: string;

  recommendHeading: string;
  recommendNone: string;
  recommendFormatLabel: string;
  formatLabels: Record<RecommendationFormat, string>;
  copyButton: string;
  copied: string;
  copyFailed: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const httpHeaderAnalyzerContent: Record<
  Locale,
  HttpHeaderAnalyzerPageContent
> = {
  ja: {
    title: 'HTTPヘッダー解析（セキュリティヘッダーのチェックと推奨設定）',
    description:
      'レスポンスヘッダーを貼り付けるだけで、HSTS・CSP・X-Frame-Options・Cookie属性などの不足や弱い設定を診断し、nginx・Apache・_headers 形式の推奨設定を生成します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'HTTPヘッダー解析・セキュリティ診断',
    introHtml:
      'curl -I やブラウザの開発者ツールで取得したレスポンスヘッダーを貼り付けると、HSTS・CSP・X-Content-Type-Options・Referrer-Policy・Cookie属性・CORS などをチェックし、不足している設定と推奨値を表示します。解析はブラウザ内だけで行われ、貼り付けた内容がサーバーに送信されることはありません。ヘッダーを取得するコマンドの組み立ては <a href="/tools/curl-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">curl変換</a> もご利用ください。',

    inputLabel: 'レスポンスヘッダー',
    inputPlaceholder:
      'HTTP/2 200\ncontent-type: text/html\nserver: nginx/1.24.0',
    sampleText:
      "HTTP/2 200\ncontent-type: text/html; charset=utf-8\nserver: nginx/1.24.0\nx-powered-by: Express\nstrict-transport-security: max-age=300\ncontent-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'\nx-content-type-options: nosniff\nset-cookie: sid=abc123; Path=/; HttpOnly\naccess-control-allow-origin: *",
    sampleButton: 'サンプルを入れる',
    inputHint:
      'ステータス行（HTTP/1.1 200 OK など）は付けても付けなくても構いません。Set-Cookie の値は診断結果に表示されません（それ以外のヘッダーは全文が表示されます）。',
    analyzeButton: '診断する',
    emptyError: 'レスポンスヘッダーを貼り付けてください',
    invalidNotice: 'ヘッダーとして読み取れなかった {count} 行を無視しました',

    summaryHeading: '診断サマリー',
    summaryTemplate:
      '良好 {good} 件 ／ 要改善 {warn} 件 ／ 未設定 {missing} 件',
    statusLabels: {
      good: '良好',
      warn: '要改善',
      missing: '未設定',
      info: '参考',
    },
    findingsHeading: 'チェック結果',
    findings: {
      hsts: {
        label: 'Strict-Transport-Security（HSTS）',
        description:
          'ブラウザに以後 HTTPS だけで接続させ、通信の盗み見や改ざんを防ぎます。',
      },
      csp: {
        label: 'Content-Security-Policy（CSP）',
        description:
          '読み込めるスクリプトや画像などの出所を制限し、XSS の被害を抑えます。',
      },
      xcto: {
        label: 'X-Content-Type-Options',
        description:
          'ブラウザが Content-Type を無視して中身から種類を推測するのを防ぎます。',
      },
      xfo: {
        label: 'X-Frame-Options',
        description:
          '他サイトの iframe に埋め込まれるクリックジャッキングを防ぎます。',
      },
      referrer: {
        label: 'Referrer-Policy',
        description: 'リンク先へ送られる参照元URLの情報量を制御します。',
      },
      permissions: {
        label: 'Permissions-Policy',
        description:
          'カメラ・マイク・位置情報など、ブラウザ機能の利用を制限します。',
      },
      coop: {
        label: 'Cross-Origin-Opener-Policy',
        description:
          '他オリジンのウィンドウと状態を共有させず、情報漏えい攻撃を抑えます（任意）。',
      },
      corp: {
        label: 'Cross-Origin-Resource-Policy',
        description: '他オリジンからのリソース読み込みを制限します（任意）。',
      },
      server: {
        label: 'Server',
        description: 'サーバーソフトウェアの情報です。',
      },
      poweredBy: {
        label: 'X-Powered-By',
        description: '使用しているフレームワークなどが外部に伝わります。',
      },
      cookie: {
        label: 'Set-Cookie',
        description:
          'Cookie の属性（Secure・HttpOnly・SameSite）を確認します。',
      },
      cors: {
        label: 'Access-Control-Allow-Origin（CORS）',
        description: '他オリジンのページから API を呼び出せる範囲です。',
      },
    },
    issues: {
      hstsNoMaxAge: 'max-age が指定されていないため、HSTS が機能しません。',
      hstsShort:
        'max-age が180日（15552000秒）未満です。1年（31536000秒）以上が推奨です。',
      cspReportOnly:
        'Report-Only のため、ポリシーは適用されず報告のみ行われます。本番で守らせるには Content-Security-Policy に切り替えます。',
      cspUnsafeInline:
        "script-src（または default-src）に 'unsafe-inline' があり、インラインスクリプトが許可されるため XSS への防御が弱まります。nonce やハッシュの利用を検討してください。",
      cspUnsafeEval:
        "'unsafe-eval' により eval() などの動的コード実行が許可されています。",
      cspWildcard:
        'script-src（または default-src）が * や https: など広すぎる指定で、任意のサイトのスクリプトを読み込めます。',
      cspNoFallback:
        'default-src も script-src もなく、スクリプトの読み込み元が制限されていません。',
      xctoInvalid: '値が nosniff ではありません。',
      xfoAllowFrom:
        'ALLOW-FROM は現在のブラウザで無視されます。CSP の frame-ancestors を使ってください。',
      xfoInvalid: '値が DENY か SAMEORIGIN ではありません。',
      xfoCoveredByCsp:
        'CSP の frame-ancestors で埋め込みが制限されているため、問題ありません。',
      referrerWeak:
        '完全なURL（パス・クエリを含む）が他サイトに送られる設定です。strict-origin-when-cross-origin などが推奨です。',
      serverVersion:
        'バージョン番号が含まれています。既知の脆弱性を狙われやすくなるため、非表示にすることを推奨します。',
      cookieNoSecure:
        'Secure がないため、HTTP 通信でも Cookie が送信されます。',
      cookieNoHttpOnly:
        'HttpOnly がないため、JavaScript から Cookie を読み取れます。',
      cookieNoSameSite:
        'SameSite がありません。CSRF 対策として Lax か Strict を指定してください。',
      cookieSameSiteNoneInsecure:
        'SameSite=None には Secure が必須です。付けないとブラウザに拒否されます。',
      corsWildcard:
        '任意のオリジンからのアクセスを許可しています。公開 API なら問題ありませんが、認証が必要なAPIでは避けてください。',
      corsWildcardCredentials:
        '* と Allow-Credentials: true の組み合わせは、ブラウザに拒否される無効な設定です。許可するオリジンを明示してください。',
      corsNull:
        'Origin: null を許可すると、サンドボックス化した iframe などからのアクセスも通ってしまいます。',
    },
    notSet: '（未設定）',

    parsedHeading: '解析したヘッダー一覧',
    parsedNameLabel: 'ヘッダー名',
    parsedValueLabel: '値',

    recommendHeading: '推奨設定',
    recommendNone: '追加が必要な基本ヘッダーはありません。',
    recommendFormatLabel: '出力形式',
    formatLabels: {
      raw: 'ヘッダー行',
      nginx: 'nginx',
      apache: 'Apache',
      'headers-file': '_headers',
    },
    copyButton: '推奨設定をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    notesHeading: '注意事項',
    notes: [
      '診断は貼り付けたヘッダーだけを見て行います。URLを指定して自動取得する機能はありません（ブラウザからは CORS の制約で他サイトのヘッダーを取得できないため）。ヘッダーは curl -I やブラウザの開発者ツール（ネットワークタブ）で取得してください。',
      '推奨値は一般的な出発点です。特に Content-Security-Policy は、サイトが読み込む外部リソースに合わせて調整しないと表示が崩れることがあります。まず Content-Security-Policy-Report-Only で動作を確認してから適用してください。',
      'Strict-Transport-Security は HTTPS で配信しているサイトにだけ設定してください。includeSubDomains を付けると全サブドメインが HTTPS 必須になります。',
      '診断結果は一般的な指針であり、サイトの安全性を保証するものではありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'HSTS（HTTP Strict Transport Security）',
        description:
          '一度 HTTPS で接続したサイトに、指定期間は HTTPS だけで接続するようブラウザへ指示する仕組みです。HTTP へのダウングレード攻撃を防ぎます。',
      },
      {
        term: 'CSP（Content Security Policy）',
        description:
          'ページが読み込んでよいスクリプト・スタイル・画像などの出所を宣言するヘッダーです。万一 XSS の脆弱性があっても、攻撃者のスクリプトの実行を防げます。',
      },
      {
        term: 'クリックジャッキング',
        description:
          '攻撃者のページに対象サイトを透明な iframe で重ね、ユーザーに意図しないクリックをさせる攻撃です。X-Frame-Options や CSP の frame-ancestors で防ぎます。',
      },
      {
        term: 'SameSite 属性',
        description:
          '他サイトからのリクエストに Cookie を付けるかを制御する Cookie の属性です。Lax や Strict にすると CSRF（クロスサイトリクエストフォージェリ）を抑えられます。',
      },
    ],
  },
  en: {
    title: 'HTTP Header Analyzer: Security Headers Check',
    description:
      'Paste response headers to check HSTS, CSP, cookie flags, and CORS for gaps, then copy recommended nginx, Apache, or _headers config. Runs in your browser.',
    h1: 'HTTP Header Analyzer & Security Check',
    introHtml:
      'Paste the response headers from <code>curl -I</code> or your browser dev tools to check HSTS, CSP, X-Content-Type-Options, Referrer-Policy, cookie attributes, and CORS. You get a list of what is missing or weak, plus recommended values. Everything is analyzed in your browser, and the headers you paste are never sent to a server. To build the command that fetches them, see the <a href="/en/tools/curl-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">cURL Converter</a>.',

    inputLabel: 'Response headers',
    inputPlaceholder:
      'HTTP/2 200\ncontent-type: text/html\nserver: nginx/1.24.0',
    sampleText:
      "HTTP/2 200\ncontent-type: text/html; charset=utf-8\nserver: nginx/1.24.0\nx-powered-by: Express\nstrict-transport-security: max-age=300\ncontent-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'\nx-content-type-options: nosniff\nset-cookie: sid=abc123; Path=/; HttpOnly\naccess-control-allow-origin: *",
    sampleButton: 'Insert sample',
    inputHint:
      'The status line (such as HTTP/1.1 200 OK) is optional. Set-Cookie values are not shown in the results (all other headers are shown in full).',
    analyzeButton: 'Analyze',
    emptyError: 'Paste the response headers first',
    invalidNotice: 'Ignored {count} line(s) that could not be read as headers',

    summaryHeading: 'Summary',
    summaryTemplate: '{good} good / {warn} to improve / {missing} missing',
    statusLabels: {
      good: 'Good',
      warn: 'Improve',
      missing: 'Missing',
      info: 'Info',
    },
    findingsHeading: 'Results',
    findings: {
      hsts: {
        label: 'Strict-Transport-Security (HSTS)',
        description:
          'Tells browsers to use HTTPS only from now on, preventing eavesdropping and tampering.',
      },
      csp: {
        label: 'Content-Security-Policy (CSP)',
        description:
          'Restricts where scripts, images, and other resources may load from, limiting the damage of XSS.',
      },
      xcto: {
        label: 'X-Content-Type-Options',
        description:
          'Stops browsers from guessing a file type from its content instead of trusting Content-Type.',
      },
      xfo: {
        label: 'X-Frame-Options',
        description:
          'Prevents clickjacking by blocking your pages from being embedded in other sites’ iframes.',
      },
      referrer: {
        label: 'Referrer-Policy',
        description:
          'Controls how much of the referring URL is sent to the next site.',
      },
      permissions: {
        label: 'Permissions-Policy',
        description:
          'Limits browser features such as camera, microphone, and geolocation.',
      },
      coop: {
        label: 'Cross-Origin-Opener-Policy',
        description:
          'Isolates your window from other origins to blunt cross-window leaks (optional).',
      },
      corp: {
        label: 'Cross-Origin-Resource-Policy',
        description:
          'Restricts which origins may load your resources (optional).',
      },
      server: {
        label: 'Server',
        description: 'Information about the server software.',
      },
      poweredBy: {
        label: 'X-Powered-By',
        description: 'Reveals the framework or platform behind the site.',
      },
      cookie: {
        label: 'Set-Cookie',
        description: 'Checks the Secure, HttpOnly, and SameSite attributes.',
      },
      cors: {
        label: 'Access-Control-Allow-Origin (CORS)',
        description: 'Which origins may call this resource from a web page.',
      },
    },
    issues: {
      hstsNoMaxAge: 'There is no max-age, so HSTS has no effect.',
      hstsShort:
        'max-age is under 180 days (15552000 seconds). One year (31536000) or more is recommended.',
      cspReportOnly:
        'Report-Only mode only reports violations and does not enforce the policy. Switch to Content-Security-Policy to enforce it.',
      cspUnsafeInline:
        "script-src (or default-src) allows 'unsafe-inline', which weakens XSS protection. Consider nonces or hashes.",
      cspUnsafeEval:
        "'unsafe-eval' permits eval() and other dynamic code execution.",
      cspWildcard:
        'script-src (or default-src) uses a very broad source such as * or https:, so scripts can load from any site.',
      cspNoFallback:
        'There is neither default-src nor script-src, so script sources are not restricted.',
      xctoInvalid: 'The value is not nosniff.',
      xfoAllowFrom:
        'ALLOW-FROM is ignored by current browsers. Use frame-ancestors in CSP instead.',
      xfoInvalid: 'The value is not DENY or SAMEORIGIN.',
      xfoCoveredByCsp:
        'Framing is already restricted by frame-ancestors in CSP, so this is fine.',
      referrerWeak:
        'The full URL (path and query included) is sent to other sites. strict-origin-when-cross-origin is a safer choice.',
      serverVersion:
        'The header includes a version number, which helps attackers target known vulnerabilities. Consider hiding it.',
      cookieNoSecure:
        'Without Secure, the cookie is also sent over plain HTTP.',
      cookieNoHttpOnly: 'Without HttpOnly, JavaScript can read the cookie.',
      cookieNoSameSite:
        'SameSite is not set. Use Lax or Strict to help prevent CSRF.',
      cookieSameSiteNoneInsecure:
        'SameSite=None requires Secure, otherwise browsers reject the cookie.',
      corsWildcard:
        'Any origin may access this resource. That is fine for a public API but avoid it for authenticated ones.',
      corsWildcardCredentials:
        'Combining * with Allow-Credentials: true is invalid and rejected by browsers. Name the allowed origin explicitly.',
      corsNull:
        'Allowing Origin: null also lets sandboxed iframes and similar contexts in.',
    },
    notSet: '(not set)',

    parsedHeading: 'Parsed headers',
    parsedNameLabel: 'Header',
    parsedValueLabel: 'Value',

    recommendHeading: 'Recommended config',
    recommendNone: 'No additional basic headers are needed.',
    recommendFormatLabel: 'Output format',
    formatLabels: {
      raw: 'Header lines',
      nginx: 'nginx',
      apache: 'Apache',
      'headers-file': '_headers',
    },
    copyButton: 'Copy recommended config',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    notesHeading: 'Notes',
    notes: [
      'The analysis only looks at the headers you paste. There is no fetch-by-URL option, because browsers cannot read other sites’ headers because of CORS. Get them with curl -I or the Network tab of your browser dev tools.',
      'The recommended values are a general starting point. Content-Security-Policy in particular can break a page unless it matches the external resources the site loads, so try Content-Security-Policy-Report-Only first.',
      'Only set Strict-Transport-Security on sites served over HTTPS. Adding includeSubDomains requires HTTPS on every subdomain.',
      'Results are general guidance and do not guarantee that a site is secure.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'HSTS (HTTP Strict Transport Security)',
        description:
          'A header that tells the browser to connect to a site only over HTTPS for a set period after the first visit, preventing downgrade attacks to HTTP.',
      },
      {
        term: 'CSP (Content Security Policy)',
        description:
          'A header that declares which sources scripts, styles, and images may load from. Even if an XSS bug exists, it can stop an attacker’s script from running.',
      },
      {
        term: 'Clickjacking',
        description:
          'An attack that overlays your site as a transparent iframe on a malicious page so users click something unintended. Prevented with X-Frame-Options or CSP frame-ancestors.',
      },
      {
        term: 'SameSite attribute',
        description:
          'A cookie attribute that controls whether the cookie is sent on cross-site requests. Lax or Strict helps prevent CSRF (cross-site request forgery).',
      },
    ],
  },
};
