import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
  selected?: boolean;
}

export interface ImageCropperPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  transformLabel: string;
  rotateLeftButton: string;
  rotateRightButton: string;
  flipHorizontalButton: string;
  flipVerticalButton: string;
  aspectLabel: string;
  aspectOptions: SelectOption[];
  selectionLabel: string;
  xLabel: string;
  yLabel: string;
  widthLabel: string;
  heightLabel: string;
  selectAllButton: string;
  previewLabel: string;
  previewHint: string;
  formatLabel: string;
  qualityLabel: string;
  /** {width}, {height} を置換する */
  outputInfo: string;
  downloadButton: string;
  downloaded: string;
  errorNotImage: string;
  /** {max} を置換する */
  errorTooLarge: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imageCropperContent: Record<Locale, ImageCropperPageContent> = {
  ja: {
    title: '画像トリミング・回転・反転',
    description:
      '画像を好きな範囲に切り抜き（トリミング）し、90度回転や左右・上下反転ができる無料ツールです。縦横比の固定にも対応し、PNG・JPEG・WebPで保存できます。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像トリミング・回転・反転（ブラウザで切り抜き）',
    introHtml:
      '画像を読み込み、ドラッグで好きな範囲を切り抜きます。90度ずつの回転と左右・上下の反転、1:1や16:9などの縦横比の固定にも対応しています。ブラウザ内で処理され、画像はアップロードされません。切り抜いたあとに大きさを変えたいときは <a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a> もご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。',
    transformLabel: '向きの調整',
    rotateLeftButton: '左に回転',
    rotateRightButton: '右に回転',
    flipHorizontalButton: '左右反転',
    flipVerticalButton: '上下反転',
    aspectLabel: '縦横比',
    aspectOptions: [
      { value: 'free', label: '自由', selected: true },
      { value: '1:1', label: '1:1（正方形）' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
      { value: '3:2', label: '3:2' },
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
    ],
    selectionLabel: '切り抜く範囲（px）',
    xLabel: '左端 X',
    yLabel: '上端 Y',
    widthLabel: '幅',
    heightLabel: '高さ',
    selectAllButton: '全体を選択',
    previewLabel: 'プレビュー',
    previewHint:
      'プレビュー上をドラッグすると、切り抜く範囲を選び直せます（明るい部分が残る範囲です）。',
    formatLabel: '保存形式',
    qualityLabel: '画質',
    outputInfo: '出力サイズ: {width} × {height} px',
    downloadButton: '切り抜いた画像をダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorTooLarge:
      '画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。先に画像を縮小してください。',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザがこの保存形式に対応していない可能性があります。別の形式をお試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを枠内にドラッグ＆ドロップするか、ボタンから選びます。',
      '必要に応じて「左に回転」「右に回転」「左右反転」「上下反転」で向きを整えます。',
      'プレビュー上をドラッグして切り抜く範囲を決めます。「縦横比」で比率を固定でき、数値で微調整もできます。',
      '「保存形式」を選び、「切り抜いた画像をダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '回転・反転は画像の見た目に対して行います。回転すると、切り抜く範囲は画像全体にリセットされます。',
      '「JPEG」は透明を扱えないため、透明部分は白で塗りつぶされます。透明を残したいときは「PNG」または「WebP」を選んでください。',
      'GIFやアニメーションWebPは、最初の1コマだけが切り抜き対象になります。',
      '読み込める画像は、1辺16384px・総画素数5,000万までです。スマートフォンの写真の向き（EXIF）は自動で反映されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'トリミング',
        description:
          '画像の一部だけを残して、周囲を切り落とす操作です。構図を整えたり、不要な部分を隠したりするときに使います。',
      },
      {
        term: '縦横比（アスペクト比）',
        description:
          '画像の幅と高さの比率です。1:1は正方形、16:9は横長のワイド画面です。SNSのアイコンやサムネイルは比率が決まっていることが多くあります。',
      },
      {
        term: 'EXIF',
        description:
          '写真に埋め込まれる撮影情報です。スマートフォンの写真は、向きの情報もここに入っており、ブラウザが自動で正しい向きに直します。',
      },
    ],
  },
  en: {
    title: 'Image Cropper, Rotator & Flipper',
    description:
      'Crop images, rotate in 90° steps, and flip them. Lock an aspect ratio and save as PNG, JPEG, or WebP. Runs in your browser; nothing is uploaded.',
    h1: 'Image Cropper, Rotator & Flipper (Online, In Your Browser)',
    introHtml:
      'Load an image and drag to crop the area you want. You can also rotate in 90° steps, flip horizontally or vertically, and lock an aspect ratio such as 1:1 or 16:9. Everything runs in your browser and nothing is uploaded. To change the size after cropping, try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>.',
    dropLabel: 'Choose an image file',
    dropHint: 'Drag and drop an image here, or pick one with the button.',
    transformLabel: 'Orientation',
    rotateLeftButton: 'Rotate left',
    rotateRightButton: 'Rotate right',
    flipHorizontalButton: 'Flip horizontal',
    flipVerticalButton: 'Flip vertical',
    aspectLabel: 'Aspect ratio',
    aspectOptions: [
      { value: 'free', label: 'Free', selected: true },
      { value: '1:1', label: '1:1 (square)' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
      { value: '3:2', label: '3:2' },
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
    ],
    selectionLabel: 'Crop area (px)',
    xLabel: 'Left X',
    yLabel: 'Top Y',
    widthLabel: 'Width',
    heightLabel: 'Height',
    selectAllButton: 'Select all',
    previewLabel: 'Preview',
    previewHint:
      'Drag on the preview to choose the crop area again (the bright part is what stays).',
    formatLabel: 'Format',
    qualityLabel: 'Quality',
    outputInfo: 'Output size: {width} × {height} px',
    downloadButton: 'Download cropped image',
    downloaded: 'Downloaded',
    errorNotImage:
      'This file cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorTooLarge:
      'The image is too large (up to {max} px per side and 50 million pixels in total). Shrink it first.',
    errorLoadFailed:
      'Could not load the image. Check that the file is not corrupted and is in a supported format.',
    errorExportFailed:
      'Could not export the image. Your browser may not support this format. Try another one.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop an image file into the box, or pick one with the button.',
      'If needed, fix the orientation with "Rotate left", "Rotate right", "Flip horizontal", and "Flip vertical".',
      'Drag on the preview to choose the crop area. You can lock the shape with "Aspect ratio" and fine-tune with the numbers.',
      'Choose a "Format" and click "Download cropped image" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Rotation and flipping apply to the image as you see it. Rotating resets the crop area to the whole image.',
      '"JPEG" cannot hold transparency, so transparent areas are filled with white. Choose "PNG" or "WebP" to keep transparency.',
      'For GIF and animated WebP, only the first frame is cropped.',
      'Images up to 16384 px per side and 50 million pixels in total can be loaded. The orientation stored in smartphone photos (EXIF) is applied automatically.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Cropping',
        description:
          'Keeping only part of an image and cutting away the rest. It is used to improve composition or hide unwanted areas.',
      },
      {
        term: 'Aspect ratio',
        description:
          'The ratio of an image width to its height. 1:1 is a square and 16:9 is a widescreen shape. Profile pictures and thumbnails on social media often require a fixed ratio.',
      },
      {
        term: 'EXIF',
        description:
          'Shooting information embedded in a photo. Smartphone photos store their orientation here, and the browser rotates them correctly for you.',
      },
    ],
  },
};
