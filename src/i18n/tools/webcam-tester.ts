import type { Locale } from '../../data/tools';

export interface WebcamTesterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  fullscreen: string;
  exitFullscreen: string;
  mirror: string;
  cameraLabel: string;
  micLabel: string;
  defaultDevice: string;
  resolutionLabel: string;
  resolutionAuto: string;
  videoAriaLabel: string;
  placeholder: string;
  infoHeading: string;
  rowDevice: string;
  rowResolution: string;
  rowFps: string;
  rowFacing: string;
  rowMic: string;
  micLevelLabel: string;
  micOff: string;
  none: string;
  fpsUnit: string;
  facingUser: string;
  facingEnvironment: string;
  errors: {
    'permission-denied': string;
    'not-found': string;
    'in-use': string;
    constraints: string;
    insecure: string;
    unsupported: string;
    unknown: string;
  };
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const webcamTesterContent: Record<Locale, WebcamTesterPageContent> = {
  ja: {
    title: 'Webカメラテスト（動作確認・解像度・FPS・マイク）',
    description:
      'Webカメラとマイクの動作確認をブラウザ上で行える無料ツールです。映像のプレビュー、解像度・フレームレート（FPS）の実測、マイクの入力レベル確認に対応。映像・音声はブラウザ内で処理され、サーバーには送信・保存されません。',
    h1: 'Webカメラ動作確認ツール',
    introHtml:
      'Webカメラの購入直後や、Web会議・配信の前に、映像が映るか・解像度やFPSはどのくらいか・マイクが音を拾っているかを確認できます。映像も音声もこのページの外には出ません。別のアプリで撮影した画像の縮小には<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ</a>もご利用ください。',
    fullscreen: '全画面表示',
    exitFullscreen: '全画面を終了',
    mirror: '左右反転して表示',
    cameraLabel: 'カメラ',
    micLabel: 'マイク',
    defaultDevice: '既定のデバイス',
    resolutionLabel: '解像度の指定',
    resolutionAuto: '自動（最大フルHD）',
    videoAriaLabel: 'カメラ映像のプレビュー',
    placeholder:
      '下のカメラボタンを押すと、ここに映像が表示されます。マイクも確認する場合はマイクボタンもオンにしてください。',
    infoHeading: '取得できた情報',
    rowDevice: 'カメラ名',
    rowResolution: '解像度',
    rowFps: 'フレームレート（実測）',
    rowFacing: '向き',
    rowMic: 'マイク',
    micLevelLabel: 'マイクの入力レベル',
    micOff: '未使用',
    none: '取得できません',
    fpsUnit: 'fps',
    facingUser: '前面（インカメラ）',
    facingEnvironment: '背面（アウトカメラ）',
    errors: {
      'permission-denied':
        'カメラ・マイクの使用が許可されていません。アドレスバーの鍵（サイト設定）アイコンから許可してから、もう一度お試しください。',
      'not-found':
        'カメラ（またはマイク）が見つかりませんでした。接続を確認してください。',
      'in-use':
        'カメラを開始できませんでした。他のアプリ（Zoom・Teams等）やタブが使用中の可能性があります。',
      constraints:
        '指定した解像度に対応していません。「自動」など別の解像度でお試しください。',
      insecure: 'この環境ではカメラを利用できません（HTTPS接続が必要です）。',
      unsupported: 'お使いのブラウザはカメラ・マイクの取得に対応していません。',
      unknown: 'カメラを開始できませんでした。',
    },
    notesHeading: '使い方と注意点',
    notes: [
      '初回は、ブラウザからカメラ（マイクを確認する場合はマイクも）の使用許可を求められます。「許可」を選んでください。',
      '解像度は指定した値が必ず得られるとは限らず、カメラが対応する最も近い値になります。「自動」は最大フルHDで取得します。実際の値は「取得できた情報」で確認できます。',
      'フレームレートは、対応ブラウザでは映像の描画間隔から算出した実測値です（非対応のブラウザではカメラの設定値を表示します）。暗い場所ではカメラが自動で下げることがあります。',
      '映像・音声は録画も保存もされず、ページを閉じる・停止すると破棄されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '解像度',
        description:
          '映像の細かさを、横×縦の画素数で表したものです。1280×720がHD、1920×1080がフルHD、3840×2160が4Kです。数値が大きいほど精細ですが、Web会議では通信量も増えます。',
      },
      {
        term: 'フレームレート（fps）',
        description:
          '1秒間に表示されるコマ数です。30fpsなら1秒に30枚。数値が大きいほど動きが滑らかで、配信では60fpsが使われることもあります。',
      },
    ],
  },
  en: {
    title: 'Webcam Test – Check Camera, Resolution, FPS & Microphone',
    description:
      'A free online webcam test. Preview your camera, measure the actual resolution and frame rate (FPS), and check your microphone input level right in the browser. Video and audio stay in your browser and are never uploaded or stored.',
    h1: 'Webcam & Microphone Test',
    introHtml:
      'Check that your new webcam works, see its real resolution and FPS, and confirm your microphone is picking up sound before a video call or stream. Nothing leaves this page. Need to shrink an image taken with another app? Try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>.',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    mirror: 'Mirror preview',
    cameraLabel: 'Camera',
    micLabel: 'Microphone',
    defaultDevice: 'Default device',
    resolutionLabel: 'Requested resolution',
    resolutionAuto: 'Auto (up to Full HD)',
    videoAriaLabel: 'Camera preview',
    placeholder:
      'Press the camera button below to see your video here. Turn on the microphone button too to test your mic.',
    infoHeading: 'Detected information',
    rowDevice: 'Camera name',
    rowResolution: 'Resolution',
    rowFps: 'Frame rate (measured)',
    rowFacing: 'Facing',
    rowMic: 'Microphone',
    micLevelLabel: 'Microphone input level',
    micOff: 'Not in use',
    none: 'Not available',
    fpsUnit: 'fps',
    facingUser: 'Front (user-facing)',
    facingEnvironment: 'Back (environment-facing)',
    errors: {
      'permission-denied':
        'Camera or microphone access was blocked. Allow it from the site settings icon in the address bar, then try again.',
      'not-found':
        'No camera (or microphone) was found. Check that it is connected.',
      'in-use':
        'Could not start the camera. Another app (Zoom, Teams, etc.) or tab may be using it.',
      constraints:
        'That resolution is not supported by this camera. Try "Auto" or another resolution.',
      insecure:
        'The camera is unavailable here (an HTTPS connection is required).',
      unsupported:
        'Your browser does not support camera and microphone access.',
      unknown: 'Could not start the camera.',
    },
    notesHeading: 'How to use & notes',
    notes: [
      'The first time, your browser asks for permission to use the camera (and the microphone, if you test it). Choose "Allow".',
      'A requested resolution is not guaranteed ("Auto" uses up to Full HD); you get the closest one the camera supports. The actual value appears under "Detected information".',
      'Where supported, the frame rate is measured from how often frames are drawn (browsers without support show the configured value reported by the camera instead). Cameras often lower it automatically in dim light.',
      'Video and audio are neither recorded nor stored, and are discarded when you stop or close the page.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Resolution',
        description:
          'The detail of a video, given as width × height in pixels. 1280×720 is HD, 1920×1080 is Full HD and 3840×2160 is 4K. Higher is sharper but uses more bandwidth on video calls.',
      },
      {
        term: 'Frame rate (fps)',
        description:
          'The number of frames shown per second. At 30 fps you get 30 images a second. Higher rates look smoother, and streams sometimes use 60 fps.',
      },
    ],
  },
};
