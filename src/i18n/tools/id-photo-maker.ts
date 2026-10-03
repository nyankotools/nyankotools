import type { Locale } from '../../data/tools';

export interface IdPhotoMakerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  cameraHeading: string;
  cameraLabel: string;
  defaultCamera: string;
  startCamera: string;
  stopCamera: string;
  capture: string;
  mirrorPreview: string;
  videoAriaLabel: string;
  placeholder: string;
  fileHeading: string;
  fileHint: string;
  fileError: string;
  editorHeading: string;
  editorEmpty: string;
  previewAriaLabel: string;
  sizeLabel: string;
  presetLabels: Record<string, string>;
  customLabel: string;
  widthLabel: string;
  heightLabel: string;
  sizeError: string;
  dpiLabel: string;
  zoomLabel: string;
  offsetXLabel: string;
  offsetYLabel: string;
  resetPosition: string;
  backgroundLabel: string;
  gapNote: string;
  formatLabel: string;
  outputInfo: string;
  download: string;
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

export const idPhotoMakerContent: Record<Locale, IdPhotoMakerPageContent> = {
  ja: {
    title: '証明写真作成（履歴書・パスポートサイズ）カメラで撮影・トリミング',
    description:
      'Webカメラやスマホで撮った写真を、履歴書（30×40mm）・パスポート（35×45mm）などの証明写真サイズにトリミングして保存できる無料ツールです。背景色の指定にも対応。写真はブラウザ内で処理され、サーバーには送信・保存されません。',
    h1: '証明写真作成ツール（履歴書・エントリーシート用）',
    introHtml:
      'カメラで撮影（または手持ちの写真を選択）し、顔の位置と大きさを合わせて、規定サイズの証明写真として書き出せます。写真はこのページの外には出ません。人物の切り抜きや背景の自動合成は行わず、トリミングと余白部分の背景色の塗りつぶしだけを行います。写真の縮小は<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ</a>、自由な切り抜きは<a href="/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像トリミング</a>もご利用ください。',
    cameraHeading: '1. 写真を用意する',
    cameraLabel: 'カメラ',
    defaultCamera: '既定のカメラ',
    startCamera: 'カメラを開始',
    stopCamera: 'カメラを停止',
    capture: '撮影する',
    mirrorPreview: '映像を左右反転して表示（撮影した写真は反転しません）',
    videoAriaLabel: 'カメラ映像のプレビュー',
    placeholder: '「カメラを開始」を押すと、ここに映像が表示されます。',
    fileHeading: 'または、写真ファイルを選ぶ',
    fileHint: '画像ファイルを選択、またはここにドラッグ＆ドロップ',
    fileError: '画像を読み込めませんでした。別のファイルでお試しください。',
    editorHeading: '2. 位置・サイズを調整して保存',
    editorEmpty: '撮影するか写真を選ぶと、ここにプレビューが表示されます。',
    previewAriaLabel: '証明写真のプレビュー',
    sizeLabel: '写真のサイズ',
    presetLabels: {
      resume: '履歴書（縦40×横30mm）',
      'resume-large': '履歴書・大（縦45×横34mm）',
      passport: 'パスポート・マイナンバー（縦45×横35mm）',
      license: '運転免許証（縦30×横24mm）',
    },
    customLabel: 'サイズを指定',
    widthLabel: '横（mm）',
    heightLabel: '縦（mm）',
    sizeError: 'サイズは10〜100mmの数値で入力してください。',
    dpiLabel: '解像度',
    zoomLabel: '拡大・縮小',
    offsetXLabel: '左右の位置',
    offsetYLabel: '上下の位置',
    resetPosition: '位置を元に戻す',
    backgroundLabel: '余白の背景色',
    gapNote:
      '写真が枠を覆っていない部分は、上の背景色で塗りつぶされます。写真自体の背景は変わりません。',
    formatLabel: '保存形式',
    outputInfo: '出力サイズ',
    download: 'ダウンロード',
    errors: {
      'permission-denied':
        'カメラの使用が許可されていません。アドレスバーの鍵（サイト設定）アイコンから許可してから、もう一度お試しください。写真ファイルからも作成できます。',
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
      '「カメラを開始」で撮影するか、写真ファイルを選択（ドラッグ＆ドロップ）します。',
      '「写真のサイズ」を選び、拡大・縮小と上下左右の位置で、顔が枠の中央に収まるよう合わせます。',
      '必要に応じて余白の背景色と保存形式（JPEG・PNG）を選びます。',
      '「ダウンロード」で保存します。コンビニのネットプリントや写真店で、指定サイズの用紙にプリントしてください。',
    ],
    notesHeading: '注意点',
    notes: [
      '提出先には写真の規定（無帽・正面・無背景または無地の背景・撮影から3か月以内など）があります。パスポートなど公的な申請では、背景や影の条件が厳しく、このツールで作った写真が受理されない場合があります。提出先の規定を確認してください。',
      '人物と背景を自動で分離する機能はありません。無地の壁やカーテンの前で、影が出ないよう正面から光を当てて撮影すると仕上がりがきれいです。',
      '保存する画像の大きさは、サイズ（mm）と解像度（dpi）から計算したピクセル数です。元の写真の解像度が足りないと、拡大したときに粗くなります。',
      '写真・映像は保存も送信もされず、ページを閉じると破棄されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'dpi',
        description:
          '1インチ（25.4mm）あたりの画素数で、印刷の細かさを表します。証明写真のプリントでは300dpiが一般的です。',
      },
      {
        term: 'トリミング',
        description:
          '写真の必要な部分だけを切り出すことです。証明写真では、縦横の比率を規定サイズに合わせて顔が中央に来るよう切り出します。',
      },
    ],
  },
  en: {
    title: 'ID Photo Maker – Passport & Resume Photo Sizes',
    description:
      'Shoot or pick a photo and crop it to ID photo sizes like 35×45mm or 30×40mm. Runs in your browser; nothing is uploaded or stored.',
    h1: 'ID Photo Maker (Passport & Resume Sizes)',
    introHtml:
      'Shoot with your camera (or pick an existing photo), line up your face, and export it at a standard ID photo size. Your photo never leaves this page. It only crops and fills empty margins with a color; it does not cut out the person or replace the background. To shrink a photo, use the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>; for free-form cropping, try the <a href="/en/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Cropper</a>.',
    cameraHeading: '1. Get a photo',
    cameraLabel: 'Camera',
    defaultCamera: 'Default camera',
    startCamera: 'Start camera',
    stopCamera: 'Stop camera',
    capture: 'Take photo',
    mirrorPreview: 'Mirror the live view (the captured photo is not mirrored)',
    videoAriaLabel: 'Camera preview',
    placeholder: 'Press "Start camera" to see your video here.',
    fileHeading: 'Or choose a photo file',
    fileHint: 'Choose an image file, or drag & drop it here',
    fileError: 'Could not load that image. Try another file.',
    editorHeading: '2. Adjust position and size, then save',
    editorEmpty: 'Take a photo or choose one and the preview appears here.',
    previewAriaLabel: 'ID photo preview',
    sizeLabel: 'Photo size',
    presetLabels: {
      resume: 'Japanese resume (30 × 40 mm)',
      'resume-large': 'Japanese resume, large (34 × 45 mm)',
      passport: 'Passport / My Number card (35 × 45 mm)',
      license: 'Driver’s license (24 × 30 mm)',
    },
    customLabel: 'Custom size',
    widthLabel: 'Width (mm)',
    heightLabel: 'Height (mm)',
    sizeError: 'Enter a size between 10 and 100 mm.',
    dpiLabel: 'Resolution',
    zoomLabel: 'Zoom',
    offsetXLabel: 'Horizontal position',
    offsetYLabel: 'Vertical position',
    resetPosition: 'Reset position',
    backgroundLabel: 'Margin background color',
    gapNote:
      'Any area the photo does not cover is filled with the color above. The photo’s own background is not changed.',
    formatLabel: 'Format',
    outputInfo: 'Output size',
    download: 'Download',
    errors: {
      'permission-denied':
        'Camera access was blocked. Allow it from the site settings icon in the address bar, then try again. You can also use a photo file.',
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
      'Press "Start camera" to shoot, or choose (or drag & drop) a photo file.',
      'Pick a "Photo size", then use zoom and the position sliders to center your face in the frame.',
      'Choose a margin background color and a format (JPEG or PNG) if needed.',
      'Press "Download". Print it at the exact paper size at a photo shop or convenience-store print service.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Each requester has photo rules (no hat, facing forward, plain background, taken recently, and so on). Official applications such as passports have strict background and shadow rules, so a photo made here may be rejected. Check the requirements first.',
      'There is no automatic person/background separation. Stand in front of a plain wall or curtain with even light from the front to avoid shadows.',
      'The saved image size is the pixel count calculated from the size (mm) and resolution (dpi). If the source photo has too few pixels, zooming in will look rough.',
      'Photos and video are neither stored nor sent anywhere, and are discarded when you close the page.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'dpi',
        description:
          'Dots per inch (25.4 mm), the sharpness of a print. 300 dpi is typical for ID photo prints.',
      },
      {
        term: 'Cropping',
        description:
          'Cutting out just the part of a photo you need. For ID photos, you crop to the required aspect ratio with the face centered.',
      },
    ],
  },
};
