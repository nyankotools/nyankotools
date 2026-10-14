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

export interface ImagePaddingPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  aspectLabel: string;
  aspectOptions: SelectOption[];
  customWidthLabel: string;
  customHeightLabel: string;
  marginLabel: string;
  marginHint: string;
  backgroundLabel: string;
  transparentLabel: string;
  formatLabel: string;
  qualityLabel: string;
  previewLabel: string;
  /** {srcWidth}, {srcHeight}, {width}, {height} を置換する */
  outputInfo: string;
  jpegTransparentNote: string;
  downloadButton: string;
  downloaded: string;
  errorNotImage: string;
  /** {max} を置換する */
  errorTooLarge: string;
  /** {max} を置換する */
  errorOutputTooLarge: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imagePaddingContent: Record<Locale, ImagePaddingPageContent> = {
  ja: {
    title: '画像に余白を追加・正方形にする',
    description:
      '画像の周囲に余白を足したり、1:1・4:5・16:9などの縦横比に合わせて背景色（透過も可）で埋めたりできる無料ツールです。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像に余白を追加・正方形にする（背景色で埋める）',
    introHtml:
      '画像を拡大・縮小や切り抜きをせずに、周囲に余白を足して正方形や好きな縦横比にそろえます。SNS投稿用の1:1・4:5、動画サムネイル用の16:9などに対応し、余白は背景色または透明にできます。ブラウザ内で処理され、画像はアップロードされません。切り抜きたいときは <a href="/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像トリミング・回転・反転</a>、大きさを変えたいときは <a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a> をご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。',
    aspectLabel: '縦横比',
    aspectOptions: [
      { value: '1:1', label: '1:1（正方形）', selected: true },
      { value: '4:5', label: '4:5（縦長・SNS）' },
      { value: '5:4', label: '5:4' },
      { value: '3:4', label: '3:4' },
      { value: '4:3', label: '4:3' },
      { value: '16:9', label: '16:9（横長）' },
      { value: '9:16', label: '9:16（縦長・ストーリーズ）' },
      { value: '1.91:1', label: '1.91:1（OGP・リンク画像）' },
      { value: 'custom', label: '自由に指定' },
      { value: 'none', label: '比率を指定しない（余白のみ）' },
    ],
    customWidthLabel: '比率の幅',
    customHeightLabel: '比率の高さ',
    marginLabel: '追加する余白（px・四方）',
    marginHint:
      '画像の上下左右に同じ幅を足します。縦横比に合わせる余白は、これとは別に自動で追加されます。',
    backgroundLabel: '背景色',
    transparentLabel: '背景を透明にする',
    formatLabel: '保存形式',
    qualityLabel: '画質',
    previewLabel: 'プレビュー',
    outputInfo:
      '元画像: {srcWidth} × {srcHeight} px → 出力: {width} × {height} px',
    jpegTransparentNote:
      'JPEGは透明を扱えないため、透明にした部分は白で保存されます。',
    downloadButton: '余白を足した画像をダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorTooLarge:
      '画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。先に画像を縮小してください。',
    errorOutputTooLarge:
      '余白を足した画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。余白や縦横比を見直してください。',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザがこの保存形式に対応していない可能性があります。別の形式をお試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを枠内にドラッグ＆ドロップするか、ボタンから選びます。',
      '「縦横比」で仕上がりの比率を選びます。余白だけを足したいときは「比率を指定しない（余白のみ）」を選び、「追加する余白（px・四方）」を入力します。',
      '「背景色」を選ぶか、「背景を透明にする」にチェックします。',
      '「保存形式」を選び、「余白を足した画像をダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '元の画像は拡大・縮小も切り抜きもされず、余白の中央にそのまま置かれます。',
      '「JPEG」は透明を扱えないため、透明にした部分は白で塗りつぶされます。透明を残したいときは「PNG」または「WebP」を選んでください。',
      '縦横比に合わせるとき、画像の短い辺側にだけ余白が足されます。元の画像より小さくなることはありません。',
      'GIFやアニメーションWebPは、最初の1コマだけが対象になります。',
      '読み込める画像は、1辺16384px・総画素数5,000万までです。出力も同じ上限が適用されます。スマートフォンの写真の向き（EXIF）は自動で反映されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'レターボックス（余白埋め）',
        description:
          '画像の縦横比を変えずに、足りない部分を帯状の余白で埋める方法です。画像が歪まず、切り抜かれることもありません。',
      },
      {
        term: '縦横比（アスペクト比）',
        description:
          '画像の幅と高さの比率です。1:1は正方形、4:5は縦長、16:9は横長のワイド画面です。SNSごとに推奨される比率があります。',
      },
      {
        term: '透過（アルファチャンネル）',
        description:
          '画像の一部を透明にする仕組みです。PNGとWebPは透過に対応しますが、JPEGは対応しません。',
      },
    ],
  },
  en: {
    title: 'Add Padding to Image & Make It Square',
    description:
      'Add margins to an image or fit it to 1:1, 4:5, or 16:9 with a background color or transparency. Runs in your browser; nothing is uploaded.',
    h1: 'Add Padding to an Image & Make It Square (Online, In Your Browser)',
    introHtml:
      'Add margins around an image to make it square or fit any aspect ratio, without scaling or cropping it. Use 1:1 or 4:5 for social posts and 16:9 for video thumbnails, and fill the margins with a color or leave them transparent. Everything runs in your browser and nothing is uploaded. To cut parts away, try the <a href="/en/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Cropper</a>; to change the size, use the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>.',
    dropLabel: 'Choose an image file',
    dropHint: 'Drag and drop an image here, or pick one with the button.',
    aspectLabel: 'Aspect ratio',
    aspectOptions: [
      { value: '1:1', label: '1:1 (square)', selected: true },
      { value: '4:5', label: '4:5 (portrait, social)' },
      { value: '5:4', label: '5:4' },
      { value: '3:4', label: '3:4' },
      { value: '4:3', label: '4:3' },
      { value: '16:9', label: '16:9 (landscape)' },
      { value: '9:16', label: '9:16 (stories)' },
      { value: '1.91:1', label: '1.91:1 (link preview)' },
      { value: 'custom', label: 'Custom' },
      { value: 'none', label: 'No ratio (margins only)' },
    ],
    customWidthLabel: 'Ratio width',
    customHeightLabel: 'Ratio height',
    marginLabel: 'Margin to add (px, all sides)',
    marginHint:
      'The same width is added on every side. Extra space needed to reach the aspect ratio is added automatically on top of this.',
    backgroundLabel: 'Background color',
    transparentLabel: 'Transparent background',
    formatLabel: 'Format',
    qualityLabel: 'Quality',
    previewLabel: 'Preview',
    outputInfo:
      'Source: {srcWidth} × {srcHeight} px → Output: {width} × {height} px',
    jpegTransparentNote:
      'JPEG cannot hold transparency, so transparent areas are saved as white.',
    downloadButton: 'Download padded image',
    downloaded: 'Downloaded',
    errorNotImage:
      'This file cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorTooLarge:
      'The image is too large (up to {max} px per side and 50 million pixels in total). Shrink it first.',
    errorOutputTooLarge:
      'The padded image would be too large (up to {max} px per side and 50 million pixels in total). Reduce the margin or change the ratio.',
    errorLoadFailed:
      'Could not load the image. Check that the file is not corrupted and is in a supported format.',
    errorExportFailed:
      'Could not export the image. Your browser may not support this format. Try another one.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop an image file into the box, or pick one with the button.',
      'Choose the result shape under "Aspect ratio". To add margins only, pick "No ratio (margins only)" and enter "Margin to add (px, all sides)".',
      'Pick a "Background color", or tick "Transparent background".',
      'Choose a "Format" and click "Download padded image" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The original image is neither scaled nor cropped. It is placed unchanged in the center of the margins.',
      '"JPEG" cannot hold transparency, so transparent areas are filled with white. Choose "PNG" or "WebP" to keep transparency.',
      'When fitting an aspect ratio, margins are added only along the shorter side, so the result is never smaller than the original.',
      'For GIF and animated WebP, only the first frame is used.',
      'Images up to 16384 px per side and 50 million pixels in total can be loaded, and the same limit applies to the output. The orientation stored in smartphone photos (EXIF) is applied automatically.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Letterboxing (padding)',
        description:
          'Filling the missing area with bands of margin instead of changing the aspect ratio of the image. The image is not distorted or cropped.',
      },
      {
        term: 'Aspect ratio',
        description:
          'The ratio of an image width to its height. 1:1 is a square, 4:5 is portrait, and 16:9 is a widescreen shape. Each social network has recommended ratios.',
      },
      {
        term: 'Transparency (alpha channel)',
        description:
          'A mechanism that makes part of an image see-through. PNG and WebP support it, while JPEG does not.',
      },
    ],
  },
};
