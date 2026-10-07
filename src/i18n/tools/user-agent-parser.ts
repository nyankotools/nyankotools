import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface FieldRow {
  id: string;
  label: string;
}

export interface UserAgentParserPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  ownHeading: string;
  uaStringLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** browser / engine / os / device / model の順 */
  fieldRows: FieldRow[];
  hintsHeading: string;
  hintsUnsupported: string;
  hintRows: FieldRow[];
  parseHeading: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  useOwn: string;
  emptyMessage: string;
  unknown: string;
  deviceMobile: string;
  deviceTablet: string;
  deviceDesktop: string;
  deviceBot: string;
  deviceUnknown: string;
  yes: string;
  no: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const userAgentParserContent: Record<
  Locale,
  UserAgentParserPageContent
> = {
  ja: {
    title: 'User-Agent解析（ブラウザ・OS・デバイス判定／自分のUA確認）',
    description:
      'User-Agent文字列からブラウザ・OS・レンダリングエンジン・デバイス種別を判定し、いま使っているブラウザのUAも自動表示する無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'User-Agent解析（ブラウザ・OS・デバイス判定）',
    introHtml:
      'このページを開いているブラウザの <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">navigator.userAgent</code> を自動で表示し、ブラウザ・OS・レンダリングエンジン・デバイス種別に分解します。ログやお問い合わせで受け取ったUser-Agent文字列を貼り付けて判定することもできます。ブラウザ内で処理され、UAがサーバーに送信されることはありません。画面サイズやDPRは <a href="/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スクリーンサイズ・Viewportチェッカー</a>、HTTPヘッダー全体の確認は <a href="/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTPヘッダー解析</a> をご利用ください。',
    ownHeading: 'あなたのブラウザの情報',
    uaStringLabel: 'User-Agent文字列',
    copy: 'UAをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    fieldRows: [
      { id: 'browser', label: 'ブラウザ' },
      { id: 'engine', label: 'レンダリングエンジン' },
      { id: 'os', label: 'OS' },
      { id: 'device', label: 'デバイス種別' },
      { id: 'model', label: '機種名' },
    ],
    hintsHeading: 'Client Hints（userAgentData）',
    hintsUnsupported:
      'このブラウザは navigator.userAgentData に対応していないため、Client Hintsの情報は表示できません（FirefoxやSafariなど）。',
    hintRows: [
      { id: 'brands', label: 'ブランドとバージョン' },
      { id: 'platform', label: 'プラットフォーム' },
      { id: 'architecture', label: 'アーキテクチャ' },
      { id: 'model', label: '機種名' },
      { id: 'mobile', label: 'モバイル端末' },
    ],
    parseHeading: 'User-Agent文字列を解析する',
    inputLabel: '解析するUser-Agent文字列',
    inputPlaceholder: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...',
    sampleText:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    useOwn: '自分のUAを入力',
    emptyMessage:
      'User-Agent文字列を入力すると、ここに判定結果が表示されます。',
    unknown: '不明',
    deviceMobile: 'モバイル（スマートフォン）',
    deviceTablet: 'タブレット',
    deviceDesktop: 'デスクトップ',
    deviceBot: 'ボット・クローラー',
    deviceUnknown: '不明',
    yes: 'はい',
    no: 'いいえ',
    notesHeading: '注意事項',
    notes: [
      'User-Agentは自己申告の文字列で、偽装や変更が可能です。判定は正規表現による推定であり、セキュリティ判断やアクセス制御の根拠にはしないでください。',
      'Chromeなど一部ブラウザはUser-Agentの情報を縮小しており、Windows 10とWindows 11は区別できず（どちらも「Windows NT 10.0」）、macOSは常に「10_15_7」、Androidの機種名は「K」になることがあります。',
      'iPadのSafariは既定で「Macintosh」を名乗るため、貼り付けた文字列だけではMacと区別できません。このブラウザの自動表示では、タッチ点の数も参考にiPadOSを判定しています。',
      'Brave、Arc、各種アプリ内ブラウザなど、UA上は別のブラウザ（主にChrome）に見えるものは正確に判別できません。判定対象外のものは「不明」と表示します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'User-Agent',
        description:
          'ブラウザがHTTPリクエストの`User-Agent`ヘッダーやJavaScriptの`navigator.userAgent`で送る、ブラウザ・OS・端末を示す文字列です。互換性のため先頭が`Mozilla/5.0`で始まるなど、歴史的な経緯で複雑な形式になっています。',
      },
      {
        term: 'Client Hints（userAgentData）',
        description:
          'User-Agent文字列の縮小に伴って導入された、より構造化された端末情報の取得方法です。`navigator.userAgentData`で基本情報を、`getHighEntropyValues()`でOSバージョンやアーキテクチャなどの詳細値を取得できます。主にChrome系ブラウザが対応しています。',
      },
      {
        term: 'レンダリングエンジン',
        description:
          'HTMLやCSSを解釈して画面に描画するブラウザの中核部分です。Chrome・Edge・Operaは Blink、Firefoxは Gecko、Safariは WebKit を使います。iOSでは、どのブラウザでもWebKitが使われます。',
      },
    ],
  },
  en: {
    title: 'User-Agent Parser: Detect Browser, OS & Device',
    description:
      'Parse a User-Agent string into browser, OS, engine and device type, and see the UA of your own browser automatically. Runs in your browser.',
    h1: 'User-Agent Parser (Browser, OS & Device Detector)',
    introHtml:
      'Shows the <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">navigator.userAgent</code> of your browser automatically and breaks it down into browser, OS, rendering engine, and device type. You can also paste a User-Agent string from a server log or a support request to identify it. Everything is processed in your browser, and the UA is never sent to a server. For screen size and DPR, use the <a href="/en/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Screen Size &amp; Viewport Checker</a>; to inspect full HTTP headers, try the <a href="/en/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTP Header Analyzer</a>.',
    ownHeading: 'Your browser',
    uaStringLabel: 'User-Agent string',
    copy: 'Copy UA',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    fieldRows: [
      { id: 'browser', label: 'Browser' },
      { id: 'engine', label: 'Rendering engine' },
      { id: 'os', label: 'OS' },
      { id: 'device', label: 'Device type' },
      { id: 'model', label: 'Device model' },
    ],
    hintsHeading: 'Client Hints (userAgentData)',
    hintsUnsupported:
      'This browser does not support navigator.userAgentData (for example Firefox and Safari), so Client Hints are not available.',
    hintRows: [
      { id: 'brands', label: 'Brands and versions' },
      { id: 'platform', label: 'Platform' },
      { id: 'architecture', label: 'Architecture' },
      { id: 'model', label: 'Device model' },
      { id: 'mobile', label: 'Mobile device' },
    ],
    parseHeading: 'Parse a User-Agent string',
    inputLabel: 'User-Agent string to parse',
    inputPlaceholder: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...',
    sampleText:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    useOwn: 'Use my UA',
    emptyMessage: 'Enter a User-Agent string and the result will appear here.',
    unknown: 'Unknown',
    deviceMobile: 'Mobile (smartphone)',
    deviceTablet: 'Tablet',
    deviceDesktop: 'Desktop',
    deviceBot: 'Bot / crawler',
    deviceUnknown: 'Unknown',
    yes: 'Yes',
    no: 'No',
    notesHeading: 'Notes',
    notes: [
      'A User-Agent is self-reported and easy to spoof or change. Detection here is a regular-expression estimate, so do not rely on it for security decisions or access control.',
      'Chrome and some other browsers reduce the User-Agent: Windows 10 and 11 look identical ("Windows NT 10.0"), macOS is always "10_15_7", and Android device models may show as "K".',
      'Safari on iPad identifies itself as "Macintosh" by default, so a pasted string alone cannot be told apart from a Mac. For your own browser, the touch point count is also used to detect iPadOS.',
      'Browsers that look like another browser (mostly Chrome) in the UA, such as Brave, Arc, and many in-app browsers, cannot be told apart reliably. Anything not recognized is shown as "Unknown".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'User-Agent',
        description:
          'A string identifying the browser, OS, and device, sent in the HTTP `User-Agent` header and exposed as `navigator.userAgent`. For historical compatibility reasons it starts with `Mozilla/5.0` and has a convoluted format.',
      },
      {
        term: 'Client Hints (userAgentData)',
        description:
          'A more structured way to read device information, introduced as User-Agent strings are being reduced. `navigator.userAgentData` gives basic data and `getHighEntropyValues()` returns details such as the OS version and architecture. Mostly supported by Chromium-based browsers.',
      },
      {
        term: 'Rendering engine',
        description:
          'The core of a browser that interprets HTML and CSS and draws the page. Chrome, Edge, and Opera use Blink, Firefox uses Gecko, and Safari uses WebKit. On iOS, every browser uses WebKit.',
      },
    ],
  },
};
