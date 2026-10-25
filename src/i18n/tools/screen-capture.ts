import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ScreenCapturePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  delayLabel: string;
  /** {n} を置換する */
  delayOption: string;
  delayNone: string;
  captureLabel: string;
  idleMessage: string;
  /** {n} を置換する */
  countdown: string;
  capturing: string;
  previewHeading: string;
  previewAriaLabel: string;
  /** {size} を置換する */
  sizeInfo: string;
  downloadLabel: string;
  copyLabel: string;
  copied: string;
  copyFailed: string;
  discardLabel: string;
  unsupportedMessage: string;
  errors: {
    cancelled: string;
    unsupported: string;
    insecure: string;
    unknown: string;
    frame: string;
  };
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const screenCaptureContent: Record<Locale, ScreenCapturePageContent> = {
  ja: {
    title: 'スクリーンショット撮影（ブラウザだけで画面をPNG保存）',
    description:
      '画面全体・ウィンドウ・ブラウザのタブをブラウザだけで撮影し、PNGで保存・コピーできる無料ツールです。遅延タイマー付き。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: 'スクリーンショット撮影',
    introHtml:
      '画面全体・アプリのウィンドウ・ブラウザのタブのいずれかを選んで1枚だけ撮影し、PNG画像として保存・コピーできます。撮影までの遅延タイマーも使えます。撮影した画像はこのページの外には出ません。撮影後に書き込みたいときは <a href="/tools/screenshot-annotator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スクリーンショット注釈</a> もご利用ください。',
    delayLabel: '撮影までの待ち時間',
    delayOption: '{n}秒',
    delayNone: 'なし',
    captureLabel: '撮影する',
    idleMessage:
      '「撮影する」を押すと、ブラウザが撮影する画面・ウィンドウ・タブの選択画面を表示します。',
    countdown: '撮影まで {n} 秒…',
    capturing: '撮影中…',
    previewHeading: '撮影した画像',
    previewAriaLabel: '撮影したスクリーンショットのプレビュー',
    sizeInfo: '画像サイズ: {size}',
    downloadLabel: 'PNGをダウンロード',
    copyLabel: '画像をコピー',
    copied: 'クリップボードにコピーしました。',
    copyFailed:
      'コピーできませんでした。ブラウザが画像のコピーに対応していない可能性があります。ダウンロードをご利用ください。',
    discardLabel: '破棄する',
    unsupportedMessage:
      'このブラウザは画面の撮影（getDisplayMedia）に対応していません。',
    errors: {
      cancelled:
        '画面の共有が許可されなかったか、キャンセルされました。もう一度「撮影する」を押して、撮影する画面を選んでください。',
      unsupported:
        'このブラウザ・端末は画面の撮影に対応していません。PC版のChrome・Edge・Firefox・Safariなどをお試しください（スマートフォンの多くは非対応です）。',
      insecure:
        '画面の撮影はHTTPSで開いたページでのみ使えます。URLがhttps://で始まっているか確認してください。',
      unknown:
        '撮影を開始できませんでした。ページを再読み込みして、もう一度お試しください。',
      frame: '画面の映像を取得できませんでした。もう一度お試しください。',
    },
    howToHeading: '使い方',
    howToSteps: [
      '必要なら「撮影までの待ち時間」を選びます（メニューやマウスオーバーを撮りたいときに便利です）。',
      '「撮影する」を押し、ブラウザの選択画面で撮影する画面・ウィンドウ・タブを選びます。',
      '待ち時間のあと、1枚だけ撮影されて共有は自動で終了します。',
      'プレビューを確認して「PNGをダウンロード」または「画像をコピー」を押します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '撮影にはブラウザの画面共有の許可が必要です。許可ダイアログで画面・ウィンドウ・タブを選ぶと、その1フレームだけを取得してすぐに共有を停止します。',
      '画面に表示されているものがそのまま写ります。パスワード・通知・個人情報が映り込まないよう、撮影前に確認してください。',
      '撮影できる解像度や、このページ自体が写り込むかどうかはブラウザと選んだ画面の種類で変わります。',
      'スマートフォンのブラウザは、画面の撮影に対応していないことが多いです。',
      '「画像をコピー」はブラウザの対応状況によって使えない場合があります。その場合はダウンロードしてください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'getDisplayMedia',
        description:
          'ブラウザが提供する画面共有のAPIです。ユーザーが許可した画面の映像だけを取得でき、このツールはそこから1フレームを切り出しています。',
      },
      {
        term: 'PNG',
        description:
          '劣化しない可逆圧縮の画像形式です。文字やUIのスクリーンショットをきれいに残せます。',
      },
    ],
  },
  en: {
    title: 'Screenshot Capture (Save Your Screen as PNG)',
    description:
      'Take a screenshot of your screen, a window or a browser tab right in the browser and save or copy it as PNG. Delay timer included. Nothing leaves your device.',
    h1: 'Screenshot Capture',
    introHtml:
      'Pick your whole screen, an app window or a browser tab and grab a single frame as a PNG you can save or copy. A delay timer lets you set things up first. The image never leaves this page. To draw on it afterwards, try the <a href="/en/tools/screenshot-annotator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Screenshot Annotator</a>.',
    delayLabel: 'Delay before capture',
    delayOption: '{n} s',
    delayNone: 'None',
    captureLabel: 'Take screenshot',
    idleMessage:
      'Press "Take screenshot" and your browser will ask which screen, window or tab to capture.',
    countdown: 'Capturing in {n} s…',
    capturing: 'Capturing…',
    previewHeading: 'Your screenshot',
    previewAriaLabel: 'Preview of the captured screenshot',
    sizeInfo: 'Image size: {size}',
    downloadLabel: 'Download PNG',
    copyLabel: 'Copy image',
    copied: 'Copied to the clipboard.',
    copyFailed:
      'Could not copy. Your browser may not support copying images; use Download instead.',
    discardLabel: 'Discard',
    unsupportedMessage:
      'This browser does not support screen capture (getDisplayMedia).',
    errors: {
      cancelled:
        'Screen sharing was denied or cancelled. Press "Take screenshot" again and choose what to capture.',
      unsupported:
        'This browser or device does not support screen capture. Try desktop Chrome, Edge, Firefox or Safari (most phones are not supported).',
      insecure:
        'Screen capture only works on pages opened over HTTPS. Check that the URL starts with https://.',
      unknown: 'Could not start the capture. Reload the page and try again.',
      frame: 'Could not read a frame from the screen. Please try again.',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Optionally choose a "Delay before capture" (handy for menus and hover states).',
      'Press "Take screenshot", then choose a screen, window or tab in your browser’s picker.',
      'After the delay, one frame is captured and sharing stops automatically.',
      'Check the preview, then press "Download PNG" or "Copy image".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Your browser must be allowed to share the screen. Once you pick a screen, window or tab, the tool grabs a single frame and stops sharing right away.',
      'Whatever is on screen is captured as is. Check that passwords, notifications and personal information are not visible first.',
      'The resolution, and whether this page itself shows up, depends on your browser and the kind of source you pick.',
      'Browsers on phones often do not support screen capture.',
      '"Copy image" is not available in every browser. If it fails, use the download button.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'getDisplayMedia',
        description:
          'The browser API for screen sharing. It only returns the video of the source you allow, and this tool takes one frame from it.',
      },
      {
        term: 'PNG',
        description:
          'A lossless image format. It keeps text and UI screenshots crisp.',
      },
    ],
  },
};
