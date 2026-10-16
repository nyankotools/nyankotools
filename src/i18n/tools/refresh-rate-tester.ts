import type { Locale } from '../../data/tools';

export interface RefreshRateTesterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  currentLabel: string;
  unitHz: string;
  waiting: string;
  nearestLabel: string;
  nearestNone: string;
  statusLabel: string;
  statusMeasuring: string;
  statusPaused: string;
  pauseLabel: string;
  resumeLabel: string;
  resetLabel: string;
  statsHeading: string;
  statLabels: {
    samples: string;
    medianInterval: string;
    averageInterval: string;
    minInterval: string;
    maxInterval: string;
    averageHz: string;
    stdDev: string;
    dropped: string;
  };
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const refreshRateTesterContent: Record<
  Locale,
  RefreshRateTesterPageContent
> = {
  ja: {
    title: 'リフレッシュレート測定（60Hz/120Hz/144Hzを確認）',
    description:
      'ブラウザのフレーム間隔からモニター・スマホの画面のリフレッシュレート（Hz）を測定します。60Hz・120Hz・144Hzなどを自動判定。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'リフレッシュレート測定',
    introHtml:
      'このページを開いているブラウザの描画タイミング（<code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">requestAnimationFrame</code>）の間隔から、画面のリフレッシュレートを実測します。ページを開くと自動で測定が始まり、60Hz・120Hz・144Hz などの近い値を表示します。画面の色ムラやドット抜けは <a href="/tools/dead-pixel-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ドット抜けチェック</a>、画面サイズやDPRは <a href="/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スクリーンサイズ・Viewportチェッカー</a> で確認できます。',
    currentLabel: '測定値',
    unitHz: 'Hz',
    waiting: '測定中…',
    nearestLabel: '近い標準レート',
    nearestNone: '標準値と一致しません（可変リフレッシュレート等）',
    statusLabel: '状態',
    statusMeasuring: '測定中',
    statusPaused: '一時停止中',
    pauseLabel: '一時停止',
    resumeLabel: '再開',
    resetLabel: 'リセット',
    statsHeading: '詳細な統計',
    statLabels: {
      samples: 'サンプル数',
      medianInterval: 'フレーム間隔（中央値）',
      averageInterval: 'フレーム間隔（平均）',
      minInterval: '最短の間隔',
      maxInterval: '最長の間隔',
      averageHz: '平均ベースのレート',
      stdDev: '間隔のばらつき（標準偏差）',
      dropped: 'フレーム落ち（中央値の1.5倍超）',
    },
    howToHeading: '使い方',
    howToSteps: [
      'ページを開くと自動で測定が始まります。数秒待つと測定値が安定します。',
      '「近い標準レート」に60Hz・120Hz・144Hzなどが表示されます。',
      '測り直したいときは「リセット」を押します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ブラウザの描画タイミングを測るため、OS・ブラウザの省電力モードやバッテリーセーバーが有効だと、実際のディスプレイより低いレート（例: 60Hz）に制限されることがあります。',
      '複数モニターを使っている場合は、このウィンドウが表示されているモニターの値になります。ウィンドウを移動して測り直してください。',
      '可変リフレッシュレート（G-SYNC / FreeSync / ProMotion等）のディスプレイでは、画面内容や負荷に応じてレートが変動し、標準値と一致しないことがあります。',
      '他のタブやアプリの負荷が高いとフレーム落ちが発生し、実際より低い値や大きなばらつきが出ることがあります。',
      'ブラウザの仕様により、測定値には数%程度の誤差が出ます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'リフレッシュレート',
        description:
          '画面が1秒間に表示内容を更新する回数で、単位はHz（ヘルツ）です。60Hzなら1秒に60回、144Hzなら144回更新され、数値が大きいほど動きが滑らかに見えます。',
      },
      {
        term: 'requestAnimationFrame',
        description:
          'ブラウザが次の画面更新の直前に処理を呼び出すAPIです。通常はディスプレイのリフレッシュレートに同期して呼ばれるため、その間隔からリフレッシュレートを推定できます。',
      },
      {
        term: '可変リフレッシュレート（VRR）',
        description:
          'GPUの描画速度に合わせてディスプレイの更新間隔を動的に変える仕組みです。G-SYNC・FreeSync・ProMotionなどがあり、ティアリングやカクつきを抑えます。',
      },
    ],
  },
  en: {
    title: 'Refresh Rate Test (Check 60Hz / 120Hz / 144Hz)',
    description:
      'Measure your screen refresh rate in Hz from browser frame timing and see if it is 60Hz, 120Hz or 144Hz. Runs in your browser; nothing is sent to a server.',
    h1: 'Refresh Rate Test',
    introHtml:
      'Measures your display\'s refresh rate from the timing of <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">requestAnimationFrame</code> callbacks in the browser you\'re using. Measurement starts as soon as the page opens and shows the closest standard value such as 60Hz, 120Hz or 144Hz. To check for stuck pixels or uneven color, use the <a href="/en/tools/dead-pixel-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Dead Pixel Test</a>; for screen size and DPR, try the <a href="/en/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Screen Size &amp; Viewport Checker</a>.',
    currentLabel: 'Measured rate',
    unitHz: 'Hz',
    waiting: 'Measuring…',
    nearestLabel: 'Closest standard rate',
    nearestNone: 'No standard match (e.g. variable refresh rate)',
    statusLabel: 'Status',
    statusMeasuring: 'Measuring',
    statusPaused: 'Paused',
    pauseLabel: 'Pause',
    resumeLabel: 'Resume',
    resetLabel: 'Reset',
    statsHeading: 'Detailed statistics',
    statLabels: {
      samples: 'Samples',
      medianInterval: 'Frame interval (median)',
      averageInterval: 'Frame interval (average)',
      minInterval: 'Shortest interval',
      maxInterval: 'Longest interval',
      averageHz: 'Rate from the average',
      stdDev: 'Interval jitter (std. deviation)',
      dropped: 'Dropped frames (over 1.5x median)',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Measurement starts automatically when the page opens. Wait a few seconds for the value to settle.',
      'The closest standard rate, such as 60Hz, 120Hz or 144Hz, is shown.',
      'Press "Reset" to measure again.',
    ],
    notesHeading: 'Notes',
    notes: [
      "This measures the browser's paint timing, so power-saving or battery-saver modes in the OS or browser may cap it below your display's real rate (for example at 60Hz).",
      'With multiple monitors, the value is for the monitor this window is on. Move the window and measure again.',
      'On variable refresh rate displays (G-SYNC, FreeSync, ProMotion, etc.) the rate changes with content and load, so it may not match a standard value.',
      'Heavy load from other tabs or apps can cause dropped frames, giving a lower value or large jitter.',
      'Browser behavior means the measurement can be off by a few percent.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Refresh rate',
        description:
          'How many times per second the screen updates its image, in Hz. A 60Hz display updates 60 times a second and a 144Hz display 144 times; higher values make motion look smoother.',
      },
      {
        term: 'requestAnimationFrame',
        description:
          'A browser API that calls your code just before the next screen update. It is normally synced to the display refresh rate, so the interval between calls reveals the rate.',
      },
      {
        term: 'Variable refresh rate (VRR)',
        description:
          'A technology that changes the display update interval dynamically to match the GPU frame rate, such as G-SYNC, FreeSync and ProMotion, reducing tearing and stutter.',
      },
    ],
  },
};
