import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface PhotoCollageMakerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  listLabel: string;
  moveUpButton: string;
  moveDownButton: string;
  removeButton: string;
  clearButton: string;
  selectButton: string;
  /** {name} を置換する（読み上げ用のボタン名） */
  moveUpAria: string;
  moveDownAria: string;
  removeAria: string;
  selectAria: string;
  templateLabel: string;
  /** TemplateKind をキーにした表示名 */
  templateNames: Record<string, string>;
  templateNeedMore: string;
  aspectLabel: string;
  sizeLabel: string;
  sizeOptions: SelectOption[];
  gapLabel: string;
  marginLabel: string;
  borderWidthLabel: string;
  borderColorLabel: string;
  radiusLabel: string;
  backgroundLabel: string;
  adjustLabel: string;
  adjustNone: string;
  /** {name} を置換する */
  adjustTarget: string;
  zoomLabel: string;
  posXLabel: string;
  posYLabel: string;
  previewLabel: string;
  dragHint: string;
  formatLabel: string;
  qualityLabel: string;
  /** {width}, {height}, {count} を置換する */
  outputInfo: string;
  downloadButton: string;
  downloaded: string;
  /** {name} を置換する */
  errorNotImage: string;
  /** {name} を置換する */
  errorLoadFailed: string;
  /** {name} を置換する */
  errorTooLarge: string;
  /** {max} を置換する */
  errorTooMany: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const photoCollageMakerContent: Record<
  Locale,
  PhotoCollageMakerPageContent
> = {
  ja: {
    title: 'フォトコラージュ作成｜テンプレートで写真を並べる',
    description:
      '2〜9枚の写真をレイアウトテンプレートに並べて1枚のコラージュにする無料ツールです。枠の間隔・外側の余白・枠線・角丸・背景色を調整し、ドラッグで表示位置も動かせます。PNG・JPEG・WebPで保存でき、画像はブラウザ内で処理されサーバーには送信されません。',
    h1: 'フォトコラージュ作成（テンプレートで写真を1枚にまとめる）',
    introHtml:
      '2〜9枚の写真をテンプレートの枠に配置して、1枚のコラージュ画像を作ります。各枠の中は、ドラッグして見せたい位置に動かせます。写真はブラウザ内で処理され、アップロードされません。均等に並べるだけなら <a href="/tools/image-merger/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像結合</a> も便利です。',
    dropLabel: '写真を選択（複数可）',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。2〜9枚まで、あとから追加もできます。',
    listLabel: '写真の一覧（枠に入る順）',
    moveUpButton: '↑ 上へ',
    moveDownButton: '↓ 下へ',
    removeButton: '削除',
    clearButton: 'すべて削除',
    selectButton: '調整',
    moveUpAria: '{name} を前へ移動',
    moveDownAria: '{name} を後ろへ移動',
    removeAria: '{name} を削除',
    selectAria: '{name} の位置・拡大を調整',
    templateLabel: 'テンプレート',
    templateNames: {
      row: '横に並べる',
      column: '縦に並べる',
      grid: 'グリッド',
      'main-left': '左を大きく',
      'main-top': '上を大きく',
    },
    templateNeedMore: '2枚以上の写真を追加するとテンプレートを選べます。',
    aspectLabel: '画像の縦横比',
    sizeLabel: '出力サイズ（長辺）',
    sizeOptions: [
      { value: '1200', label: '1200 px' },
      { value: '2000', label: '2000 px' },
      { value: '3000', label: '3000 px' },
    ],
    gapLabel: '枠の間隔（px）',
    marginLabel: '外側の余白（px）',
    borderWidthLabel: '枠線の太さ（px）',
    borderColorLabel: '枠線の色',
    radiusLabel: '角丸（px）',
    backgroundLabel: '背景色',
    adjustLabel: '選んだ写真の調整',
    adjustNone:
      '写真の「調整」ボタンか、プレビューの枠をクリックすると選べます。',
    adjustTarget: '調整中: {name}',
    zoomLabel: '拡大',
    posXLabel: '横の位置',
    posYLabel: '縦の位置',
    previewLabel: 'プレビュー',
    dragHint: 'プレビューの枠をドラッグすると、写真の表示位置を動かせます。',
    formatLabel: '保存形式',
    qualityLabel: '画質',
    outputInfo: '出力サイズ: {width} × {height} px（{count}枚）',
    downloadButton: 'コラージュをダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '「{name}」は画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorLoadFailed:
      '「{name}」を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorTooLarge:
      '「{name}」は大きすぎます（1辺16384pxまで、総画素数5,000万まで）。先に画像を縮小してください。',
    errorTooMany: '一度に使える写真は{max}枚までです。',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザがこの保存形式に対応していない可能性があります。別の形式をお試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '写真を枠内にドラッグ＆ドロップするか、ボタンから2〜9枚選びます。',
      '「テンプレート」で配置を選び、「画像の縦横比」「出力サイズ（長辺）」を決めます。入れ替えは「写真の一覧」の「↑ 上へ」「↓ 下へ」で行います。',
      'プレビューの枠をドラッグして写真の位置を合わせます。「枠の間隔（px）」「外側の余白（px）」「枠線の太さ（px）」「背景色」なども調整します。',
      '「保存形式」を選び、「コラージュをダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '使える写真は2〜9枚です。出力画像は長辺1200・2000・3000pxから選べます。',
      '写真は枠いっぱいに敷き詰められ、はみ出した部分は切り取られます。「拡大」で大きくすると、より狭い範囲を見せられます。',
      '「JPEG」は透明を扱えません。角丸にすると四隅は「背景色」で塗られます。',
      'GIFやアニメーションWebPは、最初の1コマだけが使われます。スマートフォンの写真の向き（EXIF）は自動で反映されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'コラージュ',
        description:
          '複数の写真を1枚の画像に組み合わせたものです。SNSの投稿や、思い出のまとめ画像によく使われます。',
      },
      {
        term: 'アスペクト比（縦横比）',
        description:
          '画像の幅と高さの比率です。1:1は正方形、4:3や16:9は横長、3:4や9:16は縦長で、投稿先に合わせて選びます。',
      },
      {
        term: 'トリミング（切り取り）',
        description:
          '画像の一部だけを見せることです。このツールでは、写真を枠いっぱいに敷いたときのはみ出し部分が切り取られます。',
      },
    ],
  },
  en: {
    title: 'Photo Collage Maker: Layout Templates, No Upload',
    description:
      'Make a collage from 2-9 photos with layout templates. Set spacing, borders, corners and background; save as PNG, JPEG or WebP. Runs in your browser.',
    h1: 'Photo Collage Maker (Arrange Photos in Layout Templates)',
    introHtml:
      'Place 2 to 9 photos into a layout template and save them as one collage. Drag inside any frame to choose which part of the photo shows. Everything runs in your browser and nothing is uploaded. If you only need an even row or grid, the <a href="/en/tools/image-merger/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Merger</a> is simpler.',
    dropLabel: 'Choose photos (multiple allowed)',
    dropHint:
      'Drag and drop images here, or pick them with the button. Use 2 to 9 photos; you can add more later.',
    listLabel: 'Photo list (in frame order)',
    moveUpButton: '↑ Up',
    moveDownButton: '↓ Down',
    removeButton: 'Remove',
    clearButton: 'Remove all',
    selectButton: 'Adjust',
    moveUpAria: 'Move {name} earlier',
    moveDownAria: 'Move {name} later',
    removeAria: 'Remove {name}',
    selectAria: 'Adjust position and zoom of {name}',
    templateLabel: 'Template',
    templateNames: {
      row: 'Row',
      column: 'Column',
      grid: 'Grid',
      'main-left': 'Large left',
      'main-top': 'Large top',
    },
    templateNeedMore: 'Add at least 2 photos to choose a template.',
    aspectLabel: 'Aspect ratio',
    sizeLabel: 'Output size (long side)',
    sizeOptions: [
      { value: '1200', label: '1200 px' },
      { value: '2000', label: '2000 px' },
      { value: '3000', label: '3000 px' },
    ],
    gapLabel: 'Gap between frames (px)',
    marginLabel: 'Outer margin (px)',
    borderWidthLabel: 'Border width (px)',
    borderColorLabel: 'Border color',
    radiusLabel: 'Corner radius (px)',
    backgroundLabel: 'Background color',
    adjustLabel: 'Adjust selected photo',
    adjustNone: 'Press "Adjust" on a photo or click a frame in the preview.',
    adjustTarget: 'Adjusting: {name}',
    zoomLabel: 'Zoom',
    posXLabel: 'Horizontal position',
    posYLabel: 'Vertical position',
    previewLabel: 'Preview',
    dragHint: 'Drag inside a frame in the preview to move the photo.',
    formatLabel: 'Format',
    qualityLabel: 'Quality',
    outputInfo: 'Output size: {width} × {height} px ({count} photos)',
    downloadButton: 'Download collage',
    downloaded: 'Downloaded',
    errorNotImage:
      '"{name}" cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorLoadFailed:
      'Could not load "{name}". Check that the file is not corrupted and is in a supported format.',
    errorTooLarge:
      '"{name}" is too large (up to 16384 px per side and 50 million pixels in total). Shrink it first.',
    errorTooMany: 'You can use up to {max} photos at a time.',
    errorExportFailed:
      'Could not export the image. Your browser may not support this format. Try another one.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop 2 to 9 photos into the box, or pick them with the button.',
      'Choose a layout under "Template", then set the "Aspect ratio" and "Output size (long side)". Change the order with "↑ Up" and "↓ Down" in the "Photo list".',
      'Drag inside the frames in the preview to position each photo. Adjust "Gap between frames (px)", "Outer margin (px)", "Border width (px)", "Background color", and more.',
      'Choose a "Format" and click "Download collage" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'You can use 2 to 9 photos. The output long side can be 1200, 2000, or 3000 px.',
      'Each photo fills its frame and the overflow is cropped. Raise "Zoom" to show a smaller part of the photo.',
      '"JPEG" cannot hold transparency, and rounded corners show the "Background color" in the corners.',
      'For GIF and animated WebP, only the first frame is used. The orientation stored in smartphone photos (EXIF) is applied automatically.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Collage',
        description:
          'Several photos combined into a single image. Popular for social posts and photo recaps.',
      },
      {
        term: 'Aspect ratio',
        description:
          'The ratio of an image width to its height. 1:1 is square, 4:3 and 16:9 are landscape, 3:4 and 9:16 are portrait. Pick one that suits where you will post it.',
      },
      {
        term: 'Cropping',
        description:
          'Showing only part of an image. Here, the part of a photo that overflows its frame is cropped away.',
      },
    ],
  },
};
