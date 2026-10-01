import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface FieldRow {
  id: string;
  label: string;
}

export interface ViewportCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  fieldRows: FieldRow[];
  breakpointTableHeading: string;
  columnName: string;
  columnMinWidth: string;
  breakpointNoneRowLabel: string;
  minWidthNone: string;
  /** {width} をスクリプト側で置換して使うテンプレート */
  minWidthSuffix: string;
  whenHandyHeading: string;
  whenHandyItems: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
  orientationLandscape: string;
  orientationPortrait: string;
  breakpointNone: string;
  colorSchemeDark: string;
  colorSchemeLight: string;
  touchSupported: string;
  touchNotSupported: string;
}

export const viewportCheckerContent: Record<
  Locale,
  ViewportCheckerPageContent
> = {
  ja: {
    title:
      'スクリーンサイズ・Viewportチェッカー（画面幅・DPR・ブレークポイント確認）',
    description:
      'ビューポートサイズ・画面解像度・デバイスピクセル比（DPR）・Tailwind CSSのブレークポイントをリアルタイムで確認できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'スクリーンサイズ・Viewportチェッカー',
    introHtml:
      'このページを開いているブラウザの <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">window.innerWidth</code> などのビューポートサイズ・ウィンドウサイズ・画面解像度・デバイスピクセル比・現在のTailwind CSSブレークポイントなどをリアルタイムで表示します。ウィンドウサイズを変更したり、開発者ツールのデバイスツールバーで端末を切り替えたりすると、下の表が自動的に更新されます。ブラウザ内で処理され、値がサーバーに送信されることはありません。キーボードイベントの値を確認したい場合は <a href="/tools/keycode-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">キーコード（e.code/e.key）チェッカー</a> もあわせてご利用ください。',
    fieldRows: [
      { id: 'viewport', label: 'ビューポートサイズ' },
      { id: 'window', label: 'ブラウザウィンドウサイズ' },
      { id: 'screen', label: '画面解像度' },
      { id: 'avail', label: '利用可能な画面サイズ' },
      { id: 'dpr', label: 'デバイスピクセル比（DPR）' },
      { id: 'orientation', label: '画面の向き' },
      { id: 'breakpoint', label: '現在のブレークポイント' },
      { id: 'color-scheme', label: 'OSのカラースキーム設定' },
      { id: 'touch', label: 'タッチ操作' },
    ],
    breakpointTableHeading: 'ブレークポイント早見表（Tailwind CSS）',
    columnName: '名前',
    columnMinWidth: '最小幅',
    breakpointNoneRowLabel: 'なし',
    minWidthNone: '〜639px',
    minWidthSuffix: '{width}px〜',
    whenHandyHeading: 'こんな時に便利',
    whenHandyItems: [
      'レスポンシブデザインの実装中に、実機やブラウザのウィンドウサイズが今どのブレークポイントに該当するかを確認したいとき。',
      'Retinaディスプレイ等の高解像度端末でデバイスピクセル比（DPR）がいくつになるか確認したいとき。',
      '問い合わせ対応や不具合調査で、ユーザーの画面サイズ・向き・タッチ操作対応状況をざっくり把握したいとき。',
    ],
    notesHeading: '注意事項',
    notes: [
      '「画面解像度」「利用可能な画面サイズ」はOS・ディスプレイ設定の拡大率（スケーリング）の影響を受けるため、ディスプレイの物理解像度とは一致しない場合があります。',
      '「タッチ操作」の判定は端末がタッチ入力に対応しているかの簡易的な目安であり、実際にタッチ操作可能かはOS・入力デバイスの状態にも依存します。',
      '「OSのカラースキーム設定」はOS・ブラウザ側の`prefers-color-scheme`の値であり、このサイト自体の表示（サイドバーのテーマ切り替えで手動選択したライト/ダーク）とは独立しています。両者が食い違うことがあります。',
      'ブレークポイントの区分はTailwind CSSのデフォルト値（sm: 640px / md: 768px / lg: 1024px / xl: 1280px / 2xl: 1536px）に基づいており、プロジェクトごとにカスタマイズされている場合は実際の設定値と異なることがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ビューポート',
        description:
          'ブラウザの中でWebページが実際に表示されている領域の幅・高さ（`window.innerWidth`/`innerHeight`）です。アドレスバーやスクロールバーは含みません。レスポンシブデザインの`@media`クエリはこの値を基準に判定されます。',
      },
      {
        term: 'デバイスピクセル比（DPR）',
        description:
          'CSS上の1pxが実際の物理ピクセル何個分に相当するかを表す値です（`window.devicePixelRatio`）。Retinaディスプレイ等の高解像度端末では2や3になり、画像を高解像度で用意すべきかの判断に使われます。',
      },
      {
        term: 'ブレークポイント',
        description:
          'レスポンシブデザインにおいて、レイアウトを切り替える画面幅の境目のことです。本ツールではTailwind CSSのデフォルト値（sm/md/lg/xl/2xl）を基準に、現在の幅がどの段階に該当するかを表示します。',
      },
      {
        term: 'prefers-color-scheme',
        description:
          'OS・ブラウザ側のダークモード/ライトモード設定を検知するCSSメディア特性です。`window.matchMedia("(prefers-color-scheme: dark)")`で取得でき、サイト側のテーマ初期値の決定などに使われます。',
      },
    ],
    orientationLandscape: '横向き（landscape）',
    orientationPortrait: '縦向き（portrait）',
    breakpointNone: 'なし（640px未満）',
    colorSchemeDark: 'ダーク',
    colorSchemeLight: 'ライト',
    touchSupported: '対応',
    touchNotSupported: '非対応',
  },
  en: {
    title: 'Screen Size & Viewport Checker (Width, DPR, Breakpoint)',
    description:
      'See your viewport size, screen resolution, device pixel ratio, and current Tailwind breakpoint in real time. Runs in your browser; nothing is sent to a server.',
    h1: 'Screen Size & Viewport Checker',
    introHtml:
      'Shows the <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">window.innerWidth</code> and other viewport size, window size, screen resolution, device pixel ratio, and current Tailwind CSS breakpoint of the browser you\'re using, in real time. The table below updates automatically as you resize the window or switch devices in your browser\'s device toolbar. Everything happens in your browser, and no value is ever sent to a server. If you also want to check keyboard event values, try the <a href="/en/tools/keycode-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Keycode (e.code / e.key) Checker</a> as well.',
    fieldRows: [
      { id: 'viewport', label: 'Viewport size' },
      { id: 'window', label: 'Browser window size' },
      { id: 'screen', label: 'Screen resolution' },
      { id: 'avail', label: 'Available screen size' },
      { id: 'dpr', label: 'Device pixel ratio (DPR)' },
      { id: 'orientation', label: 'Orientation' },
      { id: 'breakpoint', label: 'Current breakpoint' },
      { id: 'color-scheme', label: 'OS color scheme setting' },
      { id: 'touch', label: 'Touch support' },
    ],
    breakpointTableHeading: 'Breakpoint reference (Tailwind CSS)',
    columnName: 'Name',
    columnMinWidth: 'Minimum width',
    breakpointNoneRowLabel: 'None',
    minWidthNone: 'up to 639px',
    minWidthSuffix: '{width}px and up',
    whenHandyHeading: 'When this is handy',
    whenHandyItems: [
      'Checking which Tailwind CSS breakpoint your real device or browser window currently falls into while implementing a responsive design.',
      'Checking the device pixel ratio (DPR) on a high-density display such as a Retina screen.',
      "Quickly getting a rough picture of a user's screen size, orientation, and touch support when investigating a support request or bug report.",
    ],
    notesHeading: 'Notes',
    notes: [
      '"Screen resolution" and "Available screen size" are affected by the OS/display scaling setting, so they may not match the display\'s physical resolution.',
      '"Touch support" is only a rough indicator of whether the device supports touch input; actual touch usability also depends on the OS and input device state.',
      '"OS color scheme setting" reflects the OS/browser\'s prefers-color-scheme value, independent of this site\'s own theme (the light/dark mode you can pick manually from the sidebar). The two can disagree.',
      "Breakpoints are based on Tailwind CSS default values (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px) and may differ from a project's actual configuration if it has been customized.",
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Viewport',
        description:
          'The area of the browser where a web page is actually displayed (window.innerWidth / innerHeight), excluding the address bar and scrollbars. Responsive @media queries are evaluated against this value.',
      },
      {
        term: 'Device pixel ratio (DPR)',
        description:
          'How many physical pixels one CSS pixel maps to (window.devicePixelRatio). High-density displays such as Retina screens report 2 or 3, which is useful when deciding whether to serve higher-resolution images.',
      },
      {
        term: 'Breakpoint',
        description:
          'The screen-width threshold at which a responsive layout switches. This tool checks the current width against Tailwind CSS default breakpoints (sm/md/lg/xl/2xl).',
      },
      {
        term: 'prefers-color-scheme',
        description:
          'A CSS media feature that detects the OS/browser dark mode or light mode setting, read via window.matchMedia("(prefers-color-scheme: dark)"). Often used to decide a site\'s initial theme.',
      },
    ],
    orientationLandscape: 'Landscape',
    orientationPortrait: 'Portrait',
    breakpointNone: 'None (below 640px)',
    colorSchemeDark: 'Dark',
    colorSchemeLight: 'Light',
    touchSupported: 'Supported',
    touchNotSupported: 'Not supported',
  },
};
