import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface FieldRow {
  id: string;
  label: string;
}

interface FieldGroup {
  heading: string;
  rows: FieldRow[];
}

export interface DeviceInfoViewerValueLabels {
  unknown: string;
  supported: string;
  notSupported: string;
  /** {gb} を置換 */
  memory: string;
  /** {gb} を置換 */
  memoryCapped: string;
  /** {bits} を置換 */
  bits: string;
  pointerFine: string;
  pointerCoarse: string;
  pointerNone: string;
  hoverYes: string;
  hoverNo: string;
  /** {count} {total} を置換 */
  apiSummary: string;
}

export interface DeviceInfoViewerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること */
  introHtml: string;
  groups: FieldGroup[];
  apiHeading: string;
  columnApi: string;
  columnStatus: string;
  copy: string;
  copied: string;
  copyFailed: string;
  valueLabels: DeviceInfoViewerValueLabels;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const deviceInfoViewerContent: Record<
  Locale,
  DeviceInfoViewerPageContent
> = {
  ja: {
    title: '端末情報ビューア（画面・CPU・メモリ・GPU・入力・対応API確認）',
    description:
      'いま使っている端末の画面解像度・DPR・CPUコア数・メモリ目安・GPU・タッチ/ポインタ・対応Web APIを一覧表示。結果はコピー可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '端末情報ビューア（画面・メモリ・GPU・入力）',
    introHtml: `このページを開いている端末とブラウザの画面解像度・デバイスピクセル比・色深度・CPUコア数・メモリ目安・WebGLのGPU名・タッチ点数・ポインタ種別、さらにWeb MIDI・Web Bluetooth・WebUSB・Clipboard APIなどの対応状況をまとめて確認できます。サポート問い合わせや不具合報告に貼るため、結果をテキストでコピーできます。ブラウザ内で処理され、値がサーバーに送信されることはありません。UserAgent文字列の解析は <a href="/tools/user-agent-parser/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">User-Agentパーサー</a>、ウィンドウ幅やブレークポイントは <a href="/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Viewportチェッカー</a> をご利用ください。`,
    groups: [
      {
        heading: '画面',
        rows: [
          { id: 'resolution', label: '画面解像度（CSSピクセル）' },
          { id: 'physical', label: '物理ピクセルの目安' },
          { id: 'avail', label: '利用可能な画面サイズ' },
          { id: 'dpr', label: 'デバイスピクセル比（DPR）' },
          { id: 'colordepth', label: '色深度' },
        ],
      },
      {
        heading: 'CPU・メモリ・GPU',
        rows: [
          { id: 'cpu', label: 'CPU論理コア数' },
          { id: 'memory', label: 'メモリ容量の目安' },
          { id: 'gpu-renderer', label: 'GPU（WebGLレンダラー）' },
          { id: 'gpu-vendor', label: 'GPUベンダー（WebGL）' },
        ],
      },
      {
        heading: '入力',
        rows: [
          { id: 'touch-points', label: '最大タッチ点数' },
          { id: 'pointer', label: '主なポインタの種類' },
          { id: 'hover', label: 'ホバー操作' },
        ],
      },
    ],
    apiHeading: '対応しているWeb API',
    columnApi: 'API',
    columnStatus: '対応状況',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    valueLabels: {
      unknown: '取得できません',
      supported: '対応',
      notSupported: '非対応',
      memory: '約{gb} GB',
      memoryCapped: '{gb} GB 以上',
      bits: '{bits} bit',
      pointerFine: '精密（マウス・トラックパッド等）',
      pointerCoarse: '粗い（指でのタッチ等）',
      pointerNone: 'なし',
      hoverYes: '可能',
      hoverNo: '不可',
      apiSummary: '{total}件中{count}件に対応',
    },
    notesHeading: '注意事項',
    notes: [
      'ブラウザのフィンガープリント対策（Firefoxの保護強化、Braveなど）が有効だと、CPUコア数・メモリ・GPU名・画面解像度が丸められたり、固定値や取得不可になったりします。表示値が実機と違っても故障ではありません。',
      'メモリ容量の目安は navigator.deviceMemory の値で、プライバシー保護のため最大8GBに丸められます。Safari・Firefoxでは取得できません。',
      'GPU名はWebGLのデバッグ情報から取得します。ブラウザが非公開にしている場合や、WebGLが無効の環境では取得できません。',
      '対応Web APIの判定は、そのAPIがブラウザに存在するかの確認だけです。HTTPS必須・権限の許可・OSやハードウェアの有無により、実際には使えない場合があります。',
      '画面解像度はOSの拡大率の影響を受けるため、ディスプレイの物理解像度と一致しないことがあります。物理ピクセルの目安は解像度にDPRを掛けた概算値です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'デバイスピクセル比（DPR）',
        description:
          'CSSの1pxが物理ピクセルいくつ分にあたるかを表す値です。Retinaなどの高密度ディスプレイでは2や3になります。',
      },
      {
        term: 'ポインタの種類（pointer: fine / coarse）',
        description:
          'CSSメディア特性で、主な入力装置の精度を表します。マウスやペンは fine、指でのタッチは coarse と判定されます。',
      },
      {
        term: 'WebGLレンダラー',
        description:
          'WebGLが使っているGPUやグラフィックスドライバーの名称です。WEBGL_debug_renderer_info 拡張から取得でき、ブラウザによっては非公開です。',
      },
    ],
  },
  en: {
    title: 'Device Info Viewer: Screen, CPU, Memory, GPU & Input',
    description:
      'Check your screen resolution, pixel ratio, CPU cores, memory, GPU, touch input and supported Web APIs. Copy the report. Runs in your browser; nothing is sent.',
    h1: 'Device Info Viewer (Screen, Memory, GPU & Input)',
    introHtml: `See what your device and browser report: screen resolution, device pixel ratio, color depth, CPU cores, approximate memory, WebGL GPU name, touch points and pointer type, plus which Web APIs such as Web MIDI, Web Bluetooth, WebUSB and the Clipboard API are available. Copy the result as plain text to paste into a bug report or support request. Everything runs in your browser and no value is sent to a server. To break down a User-Agent string use the <a href="/en/tools/user-agent-parser/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">User-Agent Parser</a>; for window width and breakpoints use the <a href="/en/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Viewport Checker</a>.`,
    groups: [
      {
        heading: 'Screen',
        rows: [
          { id: 'resolution', label: 'Screen resolution (CSS pixels)' },
          { id: 'physical', label: 'Estimated physical pixels' },
          { id: 'avail', label: 'Available screen size' },
          { id: 'dpr', label: 'Device pixel ratio (DPR)' },
          { id: 'colordepth', label: 'Color depth' },
        ],
      },
      {
        heading: 'CPU, memory & GPU',
        rows: [
          { id: 'cpu', label: 'Logical CPU cores' },
          { id: 'memory', label: 'Approximate memory' },
          { id: 'gpu-renderer', label: 'GPU (WebGL renderer)' },
          { id: 'gpu-vendor', label: 'GPU vendor (WebGL)' },
        ],
      },
      {
        heading: 'Input',
        rows: [
          { id: 'touch-points', label: 'Max touch points' },
          { id: 'pointer', label: 'Primary pointer type' },
          { id: 'hover', label: 'Hover capability' },
        ],
      },
    ],
    apiHeading: 'Supported Web APIs',
    columnApi: 'API',
    columnStatus: 'Status',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    valueLabels: {
      unknown: 'Not available',
      supported: 'Supported',
      notSupported: 'Not supported',
      memory: 'About {gb} GB',
      memoryCapped: '{gb} GB or more',
      bits: '{bits}-bit',
      pointerFine: 'Fine (mouse, trackpad, etc.)',
      pointerCoarse: 'Coarse (finger touch, etc.)',
      pointerNone: 'None',
      hoverYes: 'Yes',
      hoverNo: 'No',
      apiSummary: '{count} of {total} supported',
    },
    notesHeading: 'Notes',
    notes: [
      'Fingerprinting protection (Firefox hardening, Brave, privacy extensions) can round the CPU core count, memory, GPU name and screen size, return fixed values, or hide them entirely. A value that differs from your real hardware is not a bug.',
      'Memory comes from navigator.deviceMemory, which is capped at 8 GB for privacy and unavailable in Safari and Firefox.',
      'The GPU name is read from WebGL debug info. It is missing when the browser hides it or WebGL is disabled.',
      'API support only checks that the API exists in this browser. HTTPS requirements, permissions, the OS and the actual hardware can still make it unusable.',
      'Screen resolution is affected by OS display scaling and may not match the panel. Estimated physical pixels is the resolution multiplied by the DPR.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Device pixel ratio (DPR)',
        description:
          'How many physical pixels one CSS pixel covers. High-density displays such as Retina report 2 or 3.',
      },
      {
        term: 'Pointer type (pointer: fine / coarse)',
        description:
          'A CSS media feature describing the accuracy of the primary input. A mouse or pen is fine; finger touch is coarse.',
      },
      {
        term: 'WebGL renderer',
        description:
          'The name of the GPU or graphics driver WebGL is using, read from the WEBGL_debug_renderer_info extension. Some browsers hide it.',
      },
    ],
  },
};
