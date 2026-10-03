import type { Locale } from '../../data/tools';

export interface CameraColorPickerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  cameraLabel: string;
  defaultCamera: string;
  startCamera: string;
  stopCamera: string;
  freeze: string;
  unfreeze: string;
  radiusLabel: string;
  radiusOptions: { value: string; label: string }[];
  videoAriaLabel: string;
  placeholder: string;
  liveHeading: string;
  liveHint: string;
  resultHeading: string;
  resultEmpty: string;
  swatchLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  historyHeading: string;
  historyItemLabel: string;
  errors: {
    'permission-denied': string;
    'not-found': string;
    'in-use': string;
    constraints: string;
    insecure: string;
    unsupported: string;
    unknown: string;
  };
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const cameraColorPickerContent: Record<
  Locale,
  CameraColorPickerPageContent
> = {
  ja: {
    title: 'カメラ映像からカラーコード抽出（リアルタイムスポイト）',
    description:
      'カメラに映したものの色を、映像上をなぞるだけでHEX・RGB・HSLのカラーコードとして取得できる無料ツールです。壁紙・服・商品などの色合わせに。映像はブラウザ内で処理され、サーバーには送信・保存されません。',
    h1: 'カメラ映像からカラーコードを抽出（スポイト）',
    introHtml:
      'スマホやWebカメラに映した実物の色を、映像をなぞって確認し、クリック（タップ）でHEX・RGB・HSLとして取り出せます。映像はこのページの外には出ません。取得した色の形式変換は<a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a>、画像ファイルから色を抜き出すには<a href="/tools/image-palette-extractor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像カラーパレット抽出</a>もご利用ください。',
    cameraLabel: 'カメラ',
    defaultCamera: '既定のカメラ',
    startCamera: 'カメラを開始',
    stopCamera: 'カメラを停止',
    freeze: '映像を静止',
    unfreeze: '静止を解除',
    radiusLabel: '色を取る範囲',
    radiusOptions: [
      { value: '0', label: '1画素（ピンポイント）' },
      { value: '2', label: '5×5画素の平均' },
      { value: '5', label: '11×11画素の平均' },
      { value: '10', label: '21×21画素の平均' },
    ],
    videoAriaLabel: 'カメラ映像（クリックした位置の色を取得します）',
    placeholder:
      '「カメラを開始」を押すと、ここに映像が表示されます。映像の上をなぞると、その位置の色が表示されます。',
    liveHeading: 'いまの位置の色',
    liveHint: '映像の上にポインターを重ねる（スマホは触れる）と表示されます。',
    resultHeading: '取得した色',
    resultEmpty: '映像をクリック（タップ）すると、ここに色が表示されます。',
    swatchLabel: '取得した色の見本',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーできませんでした',
    historyHeading: '履歴',
    historyItemLabel: 'この色を表示',
    errors: {
      'permission-denied':
        'カメラの使用が許可されていません。アドレスバーの鍵（サイト設定）アイコンから許可してから、もう一度お試しください。',
      'not-found': 'カメラが見つかりませんでした。接続を確認してください。',
      'in-use':
        'カメラを開始できませんでした。他のアプリやタブが使用中の可能性があります。',
      constraints: 'このカメラでは指定の設定で開始できませんでした。',
      insecure: 'この環境ではカメラを利用できません（HTTPS接続が必要です）。',
      unsupported: 'お使いのブラウザはカメラの取得に対応していません。',
      unknown: 'カメラを開始できませんでした。',
    },
    howToHeading: '使い方',
    howToSteps: [
      '「カメラを開始」を押し、ブラウザのカメラ使用許可で「許可」を選びます。',
      '色を知りたいものを映し、映像の上をなぞると「いまの位置の色」にリアルタイムで表示されます。',
      '「映像を静止」で映像を止めると、手を動かさずに複数の位置の色を取れます。',
      '色をクリック（タップ）すると「取得した色」に確定し、HEX・RGB・HSLをそれぞれコピーできます。',
    ],
    notesHeading: '注意点',
    notes: [
      'カメラ映像の色は、照明の色・明るさ、カメラの自動ホワイトバランスや露出補正の影響を受けます。実物の色と完全には一致しないため、あくまで目安として使ってください。',
      '色は映像の1画素、または選んだ範囲の平均です。ノイズの多い暗い場所では、平均する範囲を広げると安定します。',
      '映像は録画も保存もされず、停止またはページを閉じると破棄されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'HEX（カラーコード）',
        description:
          '赤・緑・青の強さを16進数2桁ずつ並べた色の表記です。#FF0000 は純粋な赤。CSSやデザインツールで広く使われます。',
      },
      {
        term: 'ホワイトバランス',
        description:
          '光源の色の違いを補正して、白いものが白く写るようにするカメラの機能です。自動の場合、映す物によって色味が変わることがあります。',
      },
    ],
  },
  en: {
    title: 'Camera Color Picker – Get Color Codes from Live Video',
    description:
      'Pick any color with your camera as HEX, RGB or HSL by moving over live video. Runs in your browser; nothing is uploaded or stored.',
    h1: 'Camera Color Picker (Live Eyedropper)',
    introHtml:
      'Point your phone or webcam at a real object, move over the video to preview its color, and click (or tap) to grab it as HEX, RGB and HSL. Your video never leaves this page. To convert the result between formats, use the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a>; to pull colors from an image file, try the <a href="/en/tools/image-palette-extractor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Palette Extractor</a>.',
    cameraLabel: 'Camera',
    defaultCamera: 'Default camera',
    startCamera: 'Start camera',
    stopCamera: 'Stop camera',
    freeze: 'Freeze video',
    unfreeze: 'Unfreeze',
    radiusLabel: 'Sampling area',
    radiusOptions: [
      { value: '0', label: '1 pixel (exact)' },
      { value: '2', label: 'Average of 5×5 pixels' },
      { value: '5', label: 'Average of 11×11 pixels' },
      { value: '10', label: 'Average of 21×21 pixels' },
    ],
    videoAriaLabel: 'Camera video (click to pick the color at that point)',
    placeholder:
      'Press "Start camera" to see your video here. Move over the video to preview the color at that point.',
    liveHeading: 'Color under the pointer',
    liveHint: 'Hover over the video (or touch it on a phone) to see it here.',
    resultHeading: 'Picked color',
    resultEmpty: 'Click (or tap) the video and the color appears here.',
    swatchLabel: 'Picked color swatch',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    historyHeading: 'History',
    historyItemLabel: 'Show this color',
    errors: {
      'permission-denied':
        'Camera access was blocked. Allow it from the site settings icon in the address bar, then try again.',
      'not-found': 'No camera was found. Check that it is connected.',
      'in-use':
        'Could not start the camera. Another app or tab may be using it.',
      constraints: 'This camera could not start with the requested settings.',
      insecure:
        'The camera is unavailable here (an HTTPS connection is required).',
      unsupported: 'Your browser does not support camera access.',
      unknown: 'Could not start the camera.',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start camera" and choose "Allow" when the browser asks for camera access.',
      'Show the object whose color you want and move over the video; the color under the pointer updates live.',
      'Press "Freeze video" to hold the frame so you can sample several points without moving the camera.',
      'Click (or tap) to lock a color under "Picked color", then copy its HEX, RGB or HSL.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Colors from a camera depend on the lighting and on the camera’s automatic white balance and exposure, so they will not exactly match the real object. Treat the result as a guide.',
      'The color is one pixel of the video, or the average of the area you choose. In dim, noisy scenes a wider area gives steadier values.',
      'Video is neither recorded nor stored, and is discarded when you stop or close the page.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'HEX color code',
        description:
          'A color written as red, green and blue intensities in two hexadecimal digits each. #FF0000 is pure red. Widely used in CSS and design tools.',
      },
      {
        term: 'White balance',
        description:
          'A camera feature that compensates for the color of the light so white objects look white. In auto mode, the tint can shift depending on what the camera sees.',
      },
    ],
  },
};
