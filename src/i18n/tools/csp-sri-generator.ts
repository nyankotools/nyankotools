import type { Locale } from '../../data/tools';
import type {
  CspDirective,
  CspFormat,
  CspPresetId,
  CspWarningCode,
} from '../../lib/tools/csp-sri-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CspSriGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  sriHeading: string;
  sriFileLabel: string;
  sriFileHint: string;
  sriTextLabel: string;
  sriTextPlaceholder: string;
  sriAlgoLabel: string;
  sriKindLabel: string;
  sriKindScript: string;
  sriKindStylesheet: string;
  sriUrlLabel: string;
  sriUrlPlaceholder: string;
  sriIntegrityLabel: string;
  sriTagLabel: string;
  /** {name} はファイル名に置き換える */
  sriSource: string;
  sriFileTooLarge: string;
  sriFileReadError: string;
  sriNoAlgo: string;
  cspHeading: string;
  presetLabel: string;
  presets: Record<CspPresetId, string>;
  directivesLabel: string;
  directiveHints: Record<CspDirective, string>;
  sourcesPlaceholder: string;
  upgradeInsecure: string;
  reportOnly: string;
  formatLabel: string;
  formats: Record<CspFormat, string>;
  policyLabel: string;
  emptyPolicy: string;
  warningsHeading: string;
  /** {directive} はディレクティブ名に置き換える */
  warnings: Record<CspWarningCode, string>;
  metaIgnoredNote: string;
  metaReportOnlyNote: string;
  copy: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cspSriGeneratorContent: Record<
  Locale,
  CspSriGeneratorPageContent
> = {
  ja: {
    title: 'CSP・SRIハッシュ生成',
    description:
      'Content-Security-Policy（CSP）をディレクティブごとに組み立て、nginx・Apache・_headers・metaタグ用に出力。CDNスクリプトのSRI（integrity）ハッシュも計算できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSP・SRIハッシュ生成（Content-Security-Policy / integrity）',
    introHtml:
      'スクリプトやCSSのファイルからSRIの <code>integrity</code> 値と <code>&lt;script&gt;</code>／<code>&lt;link&gt;</code> タグを作り、CSP（Content-Security-Policy）をディレクティブごとに組み立てます。すでにあるレスポンスヘッダーの診断は <a href="/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTPヘッダー解析・セキュリティ診断</a> をご利用ください。',
    sriHeading: 'SRI（integrity）ハッシュ',
    sriFileLabel: 'ファイルから計算',
    sriFileHint:
      'JS・CSSなどのファイルを選択、またはここにドラッグ＆ドロップします（64MBまで）。',
    sriTextLabel: 'またはテキストを貼り付け',
    sriTextPlaceholder: 'スクリプトやCSSの中身をそのまま貼り付け',
    sriAlgoLabel: 'ハッシュ方式',
    sriKindLabel: 'タグの種類',
    sriKindScript: 'script',
    sriKindStylesheet: 'stylesheet（link）',
    sriUrlLabel: 'ファイルのURL（タグ用）',
    sriUrlPlaceholder: 'https://cdn.example.com/app.js',
    sriIntegrityLabel: 'integrity 属性の値',
    sriTagLabel: 'HTMLタグ',
    sriSource: '計算対象: {name}',
    sriFileTooLarge: 'ファイルが大きすぎます（64MBまで）。',
    sriFileReadError: 'ファイルを読み込めませんでした。',
    sriNoAlgo: 'ハッシュ方式を1つ以上選んでください。',
    cspHeading: 'CSP（Content-Security-Policy）',
    presetLabel: 'プリセット',
    presets: {
      basic: '基本（自サイト＋HTTPS画像）',
      strict: '厳格（自サイトのみ）',
      blank: '空にする',
    },
    directivesLabel: 'ディレクティブごとの許可する送信元',
    directiveHints: {
      'default-src': '他で指定しなかった種類の読み込み元',
      'script-src': 'JavaScript',
      'style-src': 'CSS',
      'img-src': '画像',
      'font-src': 'Webフォント',
      'connect-src': 'fetch・XHR・WebSocketの接続先',
      'media-src': '音声・動画',
      'frame-src': 'iframeに埋め込むページ',
      'worker-src': 'Worker・Service Worker',
      'manifest-src': 'Webアプリマニフェスト',
      'object-src': '<object>・<embed>',
      'base-uri': '<base>タグで指定できるURL',
      'form-action': 'フォームの送信先',
      'frame-ancestors': 'このページを埋め込めるサイト',
    },
    sourcesPlaceholder: "例: 'self' https://cdn.example.com",
    upgradeInsecure: 'HTTPのリクエストをHTTPSに自動で切り替える',
    reportOnly: 'Report-Onlyにする（違反を報告するだけでブロックしない）',
    formatLabel: '出力形式',
    formats: {
      header: 'HTTPヘッダー',
      meta: 'metaタグ',
      nginx: 'nginx',
      apache: 'Apache',
      'headers-file': '_headers（Cloudflare・Netlify）',
    },
    policyLabel: '生成されたポリシー',
    emptyPolicy:
      '送信元を1つ以上入力するか、プリセットを選ぶとここに出力されます。',
    warningsHeading: '診断',
    warnings: {
      'no-default-src':
        'default-src がありません。指定していない種類の読み込みは制限されません。',
      'unsafe-inline-script':
        "{directive} の 'unsafe-inline' は、インラインスクリプトを許可するためXSS対策としての効果が大きく下がります。nonce・ハッシュの利用を検討してください。",
      'unsafe-eval':
        "{directive} の 'unsafe-eval' は eval() などを許可します。",
      wildcard:
        '{directive} の * は、ほぼ任意のサイトからの読み込みを許可します。',
      'data-script':
        '{directive} の data: は、任意のスクリプトを埋め込めるため危険です。',
      'http-source':
        '{directive} にHTTP（暗号化されていない）の送信元があります。HTTPSを推奨します。',
      'no-object-src':
        "object-src（または default-src）が 'none' ではありません。プラグイン経由の攻撃を防ぐため 'none' を推奨します。",
      'none-mixed':
        "{directive} で 'none' と他の送信元を併記しています。'none' は単独で使います。",
    },
    metaIgnoredNote:
      'metaタグ形式では frame-ancestors は無視されます。HTTPヘッダーで設定してください。',
    metaReportOnlyNote:
      'metaタグ形式ではReport-Onlyにできません。HTTPヘッダー形式を使ってください。',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      'SRIが必要なら、「ファイルから計算」でJS・CSSを選び（またはテキストを貼り付け）、タグ用のURLを入れて、integrity とHTMLタグをコピーします。',
      'CSPは「プリセット」から近いものを選び、ディレクティブごとの送信元を調整します。',
      '「診断」の指摘を確認し、「Report-Onlyにする」で動作確認してから本番適用するのがおすすめです。',
      '「出力形式」を選んで「コピー」し、サーバー設定やHTMLに貼り付けます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'SRIのハッシュは、ファイルの内容がバイト単位で1つでも違うと一致しません。貼り付けたテキストは改行コードや末尾の改行が元のファイルと変わることがあるため、できるだけファイルを選んで計算してください。',
      'SRIの対象ファイルは、別オリジンのCDNなどでは CORS（Access-Control-Allow-Origin）を許可している必要があります。このツールが出力するタグには crossorigin="anonymous" を付けています。',
      'このツールは外部のURLを取得しません。CDNのファイルは、ダウンロードして選択するか、中身を貼り付けて計算します。',
      'CSPを厳しくするとインラインスクリプト・外部SNSの埋め込み・解析タグなどが動かなくなることがあります。まずReport-Onlyで確認し、ブラウザの開発者ツールのコンソールで違反を確認してください。',
      "nonce（リクエストごとに変わる値）はサーバー側での生成が必要です。静的サイトではスクリプトのハッシュ（'sha256-…'）を送信元に追加する方法が使えます。",
      '出力は設定の雛形です。実際のサイトの読み込み元に合わせて調整し、適用後は必ず動作確認をしてください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CSP（Content-Security-Policy）',
        description:
          'ページが読み込める画像・スクリプト・接続先などをサーバーが宣言する仕組みです。想定外の送信元からの読み込みをブラウザがブロックするため、XSS（スクリプト注入）の被害を抑えられます。',
      },
      {
        term: 'SRI（Subresource Integrity）',
        description:
          'script や link に integrity 属性でハッシュ値を指定し、読み込んだファイルが改ざんされていないかをブラウザが検証する仕組みです。CDNが侵害された場合の対策になります。',
      },
      {
        term: 'nonce',
        description:
          'リクエストごとに生成するランダムな値です。CSPとスクリプトタグに同じ値を付けると、そのタグだけ実行を許可できます。',
      },
    ],
  },
  en: {
    title: 'CSP & SRI Hash Generator',
    description:
      'Build a Content-Security-Policy per directive and copy it as header, nginx, Apache or _headers config. Also computes SRI hashes. Runs in your browser.',
    h1: 'CSP & SRI Hash Generator (Content-Security-Policy / integrity)',
    introHtml:
      'Generate the SRI <code>integrity</code> value and a ready-to-paste <code>&lt;script&gt;</code> / <code>&lt;link&gt;</code> tag from a script or CSS file, and assemble a Content-Security-Policy one directive at a time. To audit headers you already serve, use the <a href="/en/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTP Header Analyzer</a>.',
    sriHeading: 'SRI (integrity) hash',
    sriFileLabel: 'Calculate from a file',
    sriFileHint:
      'Choose a JS or CSS file, or drag & drop it here (up to 64 MB).',
    sriTextLabel: 'Or paste the text',
    sriTextPlaceholder: 'Paste the script or CSS contents as-is',
    sriAlgoLabel: 'Hash algorithm',
    sriKindLabel: 'Tag type',
    sriKindScript: 'script',
    sriKindStylesheet: 'stylesheet (link)',
    sriUrlLabel: 'File URL (for the tag)',
    sriUrlPlaceholder: 'https://cdn.example.com/app.js',
    sriIntegrityLabel: 'integrity attribute value',
    sriTagLabel: 'HTML tag',
    sriSource: 'Source: {name}',
    sriFileTooLarge: 'The file is too large (up to 64 MB).',
    sriFileReadError: 'Could not read the file.',
    sriNoAlgo: 'Select at least one hash algorithm.',
    cspHeading: 'CSP (Content-Security-Policy)',
    presetLabel: 'Preset',
    presets: {
      basic: 'Basic (own site + HTTPS images)',
      strict: 'Strict (own site only)',
      blank: 'Clear all',
    },
    directivesLabel: 'Allowed sources per directive',
    directiveHints: {
      'default-src': 'fallback for any type not listed below',
      'script-src': 'JavaScript',
      'style-src': 'CSS',
      'img-src': 'images',
      'font-src': 'web fonts',
      'connect-src': 'fetch, XHR and WebSocket targets',
      'media-src': 'audio and video',
      'frame-src': 'pages embedded in iframes',
      'worker-src': 'Workers and Service Workers',
      'manifest-src': 'web app manifest',
      'object-src': '<object> and <embed>',
      'base-uri': 'URLs allowed in <base>',
      'form-action': 'form submission targets',
      'frame-ancestors': 'sites allowed to embed this page',
    },
    sourcesPlaceholder: "e.g. 'self' https://cdn.example.com",
    upgradeInsecure: 'Upgrade HTTP requests to HTTPS automatically',
    reportOnly: 'Report-Only (report violations without blocking)',
    formatLabel: 'Output format',
    formats: {
      header: 'HTTP header',
      meta: 'meta tag',
      nginx: 'nginx',
      apache: 'Apache',
      'headers-file': '_headers (Cloudflare, Netlify)',
    },
    policyLabel: 'Generated policy',
    emptyPolicy:
      'Enter at least one source or pick a preset and the policy appears here.',
    warningsHeading: 'Checks',
    warnings: {
      'no-default-src':
        'There is no default-src, so resource types you do not list are unrestricted.',
      'unsafe-inline-script':
        "'unsafe-inline' in {directive} allows inline scripts and greatly weakens XSS protection. Consider nonces or hashes.",
      'unsafe-eval': "'unsafe-eval' in {directive} allows eval() and similar.",
      wildcard: 'A * in {directive} allows loading from almost any site.',
      'data-script':
        'data: in {directive} is dangerous because it lets attackers inline arbitrary scripts.',
      'http-source':
        '{directive} contains an HTTP (unencrypted) source. HTTPS is recommended.',
      'no-object-src':
        "object-src (or default-src) is not 'none'. Setting it to 'none' blocks plugin-based attacks.",
      'none-mixed':
        "{directive} mixes 'none' with other sources. 'none' must stand alone.",
    },
    metaIgnoredNote:
      'frame-ancestors is ignored in a meta tag. Set it with an HTTP header.',
    metaReportOnlyNote:
      'Report-Only cannot be used in a meta tag. Use the HTTP header format.',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'For SRI, pick a JS or CSS file under "Calculate from a file" (or paste the text), enter the URL for the tag, and copy the integrity value or the HTML tag.',
      'For CSP, choose the closest "Preset" and adjust the sources for each directive.',
      'Review the "Checks", and try "Report-Only (report violations without blocking)" before enforcing the policy in production.',
      'Pick an "Output format", press "Copy", and paste it into your server config or HTML.',
    ],
    notesHeading: 'Notes',
    notes: [
      'An SRI hash stops matching if even one byte of the file differs. Pasted text can end up with different line endings or a different trailing newline than the original file, so choose the file itself whenever you can.',
      'For a file on another origin such as a CDN, the server must send CORS headers (Access-Control-Allow-Origin). The tags this tool outputs include the crossorigin attribute set to anonymous.',
      'This tool does not fetch external URLs. Download the CDN file and select it, or paste its contents.',
      'A strict CSP can break inline scripts, social embeds, analytics tags and more. Try Report-Only first and check the violations in your browser developer console.',
      "A nonce (a value that changes on every request) must be generated on the server. On a static site you can add script hashes ('sha256-…') to the sources instead.",
      'The output is a starting template. Adjust it to the resources your site really loads and test the site after applying it.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CSP (Content-Security-Policy)',
        description:
          'A policy the server sends to declare which images, scripts and connections a page may use. The browser blocks anything from an unexpected source, which limits the damage of XSS (script injection).',
      },
      {
        term: 'SRI (Subresource Integrity)',
        description:
          'The integrity attribute on a script or link holds a hash, and the browser checks that the fetched file matches it. It protects you if a CDN is compromised.',
      },
      {
        term: 'nonce',
        description:
          'A random value generated per request. Putting the same value in the CSP and on a script tag allows only that tag to run.',
      },
    ],
  },
};
