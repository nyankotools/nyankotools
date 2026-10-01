import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ExifViewerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  errorUnsupportedFile: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorReadFailed: string;
  errorParseFailed: string;
  /** `{name}` `{size}` を置換して使うテンプレート */
  fileInfoTemplate: string;
  /** `{width}` `{height}` を置換して使うテンプレート */
  dimensionsTemplate: string;
  summaryHeading: string;
  noExifMessage: string;
  labelMake: string;
  labelModel: string;
  labelLensModel: string;
  labelSoftware: string;
  labelDateTimeOriginal: string;
  labelExposureTime: string;
  labelFNumber: string;
  labelIso: string;
  labelFocalLength: string;
  labelFlash: string;
  flashFired: string;
  flashNotFired: string;
  labelWhiteBalance: string;
  whiteBalanceAuto: string;
  whiteBalanceManual: string;
  labelOrientation: string;
  orientationLabels: Record<
    | 'normal'
    | 'flip-horizontal'
    | 'rotate-180'
    | 'flip-vertical'
    | 'transpose'
    | 'rotate-90-cw'
    | 'transverse'
    | 'rotate-90-ccw',
    string
  >;
  labelGpsCoordinates: string;
  gpsPrivacyNote: string;
  showAllButton: string;
  hideAllButton: string;
  rawTableKeyHeading: string;
  rawTableValueHeading: string;
  removeButton: string;
  removingButton: string;
  removeSuccessMessage: string;
  /** メタデータはなく、末尾の連結データだけを取り除いたとき */
  removeTrailingMessage: string;
  removeNoExifMessage: string;
  clearButton: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const exifViewerContent: Record<Locale, ExifViewerPageContent> = {
  ja: {
    title: 'EXIF情報表示・削除 無料ツール',
    description:
      'JPEG画像のExif（撮影日時・カメラ機種・レンズ・露出・GPS位置情報など）をブラウザ内で解析して一覧表示し、Exif情報だけを削除した画像をダウンロードできる無料ツールです。画質の劣化や再圧縮は発生しません。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'EXIF情報表示・削除',
    introHtml:
      'JPEG画像を選択すると、撮影日時・カメラ機種・レンズ・露出設定・GPS位置情報などのExif（メタデータ）を解析して一覧表示します。「Exif情報を削除してダウンロード」ボタンから、Exif情報だけを取り除いた画像（画質・解像度はそのまま）をダウンロードできます。画像の形式変換・圧縮には<a href="/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像フォーマット変換</a>、リサイズには<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a>もあわせてご利用ください。',
    dropLabel: 'JPEG画像を選択',
    dropHint: 'ここにJPEG画像をドラッグ＆ドロップすることもできます',
    errorUnsupportedFile:
      'JPEG画像（.jpg/.jpeg）を選択してください。Exifは主にJPEG形式に埋め込まれる情報のため、他の形式には対応していません。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorReadFailed: 'ファイルの読み込みに失敗しました',
    errorParseFailed:
      'Exif情報の解析に失敗しました。ファイルが破損している可能性があります。',
    fileInfoTemplate: '{name}（{size}）',
    dimensionsTemplate: '{width} × {height}px',
    summaryHeading: '撮影情報（Exif）',
    noExifMessage:
      'この画像からExif情報は見つかりませんでした（SNS等でアップロードされた画像はExifが自動的に削除されている場合があります）。',
    labelMake: 'メーカー',
    labelModel: '機種',
    labelLensModel: 'レンズ',
    labelSoftware: 'ソフトウェア',
    labelDateTimeOriginal: '撮影日時',
    labelExposureTime: '露出時間（シャッタースピード）',
    labelFNumber: 'F値（絞り）',
    labelIso: 'ISO感度',
    labelFocalLength: '焦点距離',
    labelFlash: 'フラッシュ',
    flashFired: '発光した',
    flashNotFired: '発光しなかった',
    labelWhiteBalance: 'ホワイトバランス',
    whiteBalanceAuto: '自動',
    whiteBalanceManual: 'マニュアル',
    labelOrientation: '回転情報（Orientation）',
    orientationLabels: {
      normal: '通常（回転なし）',
      'flip-horizontal': '左右反転',
      'rotate-180': '180度回転',
      'flip-vertical': '上下反転',
      transpose: '左右反転＋反時計回りに90度回転',
      'rotate-90-cw': '時計回りに90度回転',
      transverse: '左右反転＋時計回りに90度回転',
      'rotate-90-ccw': '反時計回りに90度回転',
    },
    labelGpsCoordinates: 'GPS位置情報（緯度, 経度）',
    gpsPrivacyNote:
      'GPS位置情報が含まれている場合、この画像を撮影した場所（自宅など）が第三者に特定される可能性があります。SNS等で公開する前にExif情報の削除をおすすめします。',
    showAllButton: 'すべての項目を表示',
    hideAllButton: '閉じる',
    rawTableKeyHeading: '項目',
    rawTableValueHeading: '値',
    removeButton: 'Exif情報を削除してダウンロード',
    removingButton: '処理中...',
    removeSuccessMessage:
      'メタデータ（Exif情報など）を削除した画像をダウンロードしました',
    removeTrailingMessage:
      '末尾に連結されていたデータを削除した画像をダウンロードしました',
    removeNoExifMessage: '削除対象のメタデータや連結データはありませんでした',
    clearButton: 'クリア',
    notesHeading: '注意点',
    notes: [
      'Exifの削除はJPEGのマーカーセグメントを走査して、撮影情報・位置情報を含みうるメタデータ（Exif、XMP、IPTCなどのPhotoshop形式メタデータ）の部分だけを取り除く方式のため、Canvas等での再エンコードは行われず、画質・解像度は完全に維持されます。ICCプロファイル（色の情報）は残ります。また、主画像の後ろに連結された副画像（マルチピクチャ形式）や動画データ（Motion Photo など）も取り除かれます。',
      'Exifを削除すると、回転情報（Orientation）も一緒に失われます。Orientationタグに依存して向きを表示しているビューア・アプリでは、削除後の画像が横向き・上下逆に表示される場合があります（多くのブラウザやスマートフォンは撮影時に画素データ自体を正しい向きで保存するため、影響が出るのは一部のカメラ・アプリのみです）。',
      '対応形式はJPEG（.jpg/.jpeg）のみです。PNG・WebP等はExifを持たないか扱いが異なるため対象外です。',
      'カメラのモデルによっては、Exifの一部（メーカー独自のMakerNote等）が正しく解釈できない場合があります。その場合も一覧表示から除外されるだけで、削除処理自体には影響しません。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      'JPEG画像を選択します（ドラッグ＆ドロップも可能です）。',
      '撮影日時・カメラ機種・露出などの撮影情報を確認します。',
      '必要に応じて「すべての項目を表示」で全項目を確認します。',
      'GPS位置情報などを消したいときは「Exif情報を削除してダウンロード」を押します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Exif（Exchangeable image file format）',
        description:
          'デジタルカメラやスマートフォンで撮影した画像に自動的に埋め込まれる、撮影日時・カメラ機種・レンズ・露出設定・GPS位置情報などのメタデータ規格です。JPEGファイルのAPP1セグメントに格納されます。',
      },
      {
        term: 'GPS位置情報（Exif）',
        description:
          'スマートフォンなどで位置情報サービスを有効にしたまま撮影すると、Exifに撮影場所の緯度・経度が記録されることがあります。SNSへの投稿時に意図せず自宅などの位置が特定されるリスクがあるため注意が必要です。',
      },
      {
        term: 'Orientation（回転情報）',
        description:
          'カメラを縦向き・横向きのどちらで構えて撮影したかを記録するタグです。多くのブラウザ・OSはこの値をもとに画像を自動回転して表示します。',
      },
    ],
  },
  en: {
    title: 'EXIF Viewer & Remover (JPEG Metadata)',
    description:
      'View a JPEG photo’s Exif metadata (date, camera, lens, GPS) and download a copy with Exif stripped, losslessly. Runs in your browser; nothing is uploaded.',
    h1: 'EXIF Viewer & Remover',
    introHtml:
      'Select a JPEG photo to read its Exif metadata — date taken, camera model, lens, exposure settings, GPS location, and more. Use the "Remove Exif & Download" button to get a copy of the same image with only the Exif data stripped out (resolution and quality are untouched). For format conversion and compression, see the <a href="/en/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Format Converter</a>; for resizing, see the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>.',
    dropLabel: 'Choose a JPEG file',
    dropHint: 'You can also drag and drop a JPEG file here',
    errorUnsupportedFile:
      'Please select a JPEG file (.jpg/.jpeg). Exif metadata mainly lives in JPEG files, so other formats are not supported.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    errorReadFailed: 'Failed to read the file',
    errorParseFailed:
      'Failed to parse the Exif data. The file may be corrupted.',
    fileInfoTemplate: '{name} ({size})',
    dimensionsTemplate: '{width} × {height}px',
    summaryHeading: 'Photo info (Exif)',
    noExifMessage:
      'No Exif data was found in this image (images uploaded to social media are often stripped of Exif automatically).',
    labelMake: 'Make',
    labelModel: 'Model',
    labelLensModel: 'Lens',
    labelSoftware: 'Software',
    labelDateTimeOriginal: 'Date taken',
    labelExposureTime: 'Exposure time (shutter speed)',
    labelFNumber: 'F-number (aperture)',
    labelIso: 'ISO',
    labelFocalLength: 'Focal length',
    labelFlash: 'Flash',
    flashFired: 'Fired',
    flashNotFired: 'Did not fire',
    labelWhiteBalance: 'White balance',
    whiteBalanceAuto: 'Auto',
    whiteBalanceManual: 'Manual',
    labelOrientation: 'Orientation',
    orientationLabels: {
      normal: 'Normal (no rotation)',
      'flip-horizontal': 'Mirrored horizontally',
      'rotate-180': 'Rotated 180°',
      'flip-vertical': 'Mirrored vertically',
      transpose: 'Mirrored and rotated 90° CCW',
      'rotate-90-cw': 'Rotated 90° CW',
      transverse: 'Mirrored and rotated 90° CW',
      'rotate-90-ccw': 'Rotated 90° CCW',
    },
    labelGpsCoordinates: 'GPS location (latitude, longitude)',
    gpsPrivacyNote:
      'If GPS coordinates are present, anyone with this file could figure out where it was taken (e.g. your home). Consider removing the Exif data before sharing photos publicly.',
    showAllButton: 'Show all fields',
    hideAllButton: 'Hide',
    rawTableKeyHeading: 'Field',
    rawTableValueHeading: 'Value',
    removeButton: 'Remove Exif & Download',
    removingButton: 'Processing...',
    removeSuccessMessage:
      'Downloaded the image with metadata (Exif, etc.) removed',
    removeTrailingMessage:
      'Downloaded the image with the trailing appended data removed',
    removeNoExifMessage:
      'There was no metadata or appended data to remove in this image',
    clearButton: 'Clear',
    notesHeading: 'Notes',
    notes: [
      'Exif removal works by scanning JPEG marker segments and dropping only the metadata segments that can carry shooting or location data (Exif, XMP, and IPTC / Photoshop-format metadata), so the image is never re-encoded via canvas — quality and resolution stay exactly the same. The ICC color profile is kept. Data appended after the main image (secondary images in multi-picture files, Motion Photo video, etc.) is also removed.',
      'Removing Exif also removes the Orientation tag. If a viewer or app relies on that tag to display the image right-side up, the exported copy may appear sideways or upside down (most browsers and phones already save the pixel data itself in the correct orientation, so this only affects certain cameras and apps).',
      'Only JPEG (.jpg/.jpeg) is supported. PNG and WebP either lack Exif or handle it differently, so they are out of scope.',
      'Some camera-specific Exif fields (proprietary MakerNote data) may not be parsed correctly depending on the model. This only affects what is shown in the list — it has no effect on the removal process.',
      'All processing happens in your browser — the image you select is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a JPEG image (drag & drop also works).',
      'Review the shooting details, such as the date, camera model, and exposure.',
      'Use "Show all fields" to see every item if needed.',
      'To remove data such as GPS location, press "Remove Exif & Download".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Exif (Exchangeable Image File Format)',
        description:
          'A metadata standard automatically embedded by digital cameras and smartphones into photos, recording things like the date taken, camera model, lens, exposure settings, and GPS location. It is stored in the APP1 segment of a JPEG file.',
      },
      {
        term: 'GPS location (Exif)',
        description:
          "If location services were enabled when a photo was taken on a phone, the shot's latitude and longitude may be recorded in its Exif data. Sharing such a photo online can unintentionally reveal where it was taken, such as your home.",
      },
      {
        term: 'Orientation',
        description:
          'A tag recording whether the camera was held in portrait or landscape when the photo was taken. Most browsers and operating systems use this value to automatically rotate the image for display.',
      },
    ],
  },
};
