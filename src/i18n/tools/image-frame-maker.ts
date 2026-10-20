import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface PresetOption {
  value: string;
  label: string;
  selected?: boolean;
}

export interface ImageFrameMakerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  presetLabel: string;
  presetOptions: PresetOption[];
  thicknessLabel: string;
  radiusLabel: string;
  colorLabel: string;
  accentLabel: string;
  accentHint: string;
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

export const imageFrameMakerContent: Record<
  Locale,
  ImageFrameMakerPageContent
> = {
  ja: {
    title: '画像に枠・フレームを付ける（ポラロイド風・額縁・角丸）',
    description:
      '写真にポラロイド風・シンプル枠・二重枠・額縁風・角丸・影付きのフレームを付ける無料ツールです。色・太さ・角丸を調整し、PNG・JPEG・WebPで保存。画像はサーバーに送信されません。',
    h1: '画像に枠・フレームを付ける（ポラロイド風・額縁・角丸）',
    introHtml:
      '写真やイラストの周りに、ポラロイド風・シンプル枠・二重枠・額縁風・角丸・影付きの装飾フレームを付けます。枠の色・太さ・角丸をその場で調整でき、PNG・JPEG・WebPで保存できます。画像はブラウザ内で処理され、アップロードされません。余白だけを足したいときは <a href="/tools/image-padding/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像に余白を追加・正方形にする</a>、円形に切り抜きたいときは <a href="/tools/image-round-crop/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像の円形・角丸切り抜き</a> をご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。',
    presetLabel: '枠のスタイル',
    presetOptions: [
      { value: 'polaroid', label: 'ポラロイド風', selected: true },
      { value: 'simple', label: 'シンプル枠' },
      { value: 'double', label: '二重枠' },
      { value: 'frame', label: '額縁風' },
      { value: 'rounded', label: '角丸' },
      { value: 'shadow', label: '影付き' },
    ],
    thicknessLabel: '枠の太さ（画像の短辺に対する%）',
    radiusLabel: '角丸（出力の短辺に対する%）',
    colorLabel: '枠の色',
    accentLabel: '補助色',
    accentHint:
      '二重枠の線、額縁風のマット、影付きの影の色に使います。ほかのスタイルでは使いません。',
    transparentLabel: '背景を透明にする',
    formatLabel: '保存形式',
    qualityLabel: '画質',
    previewLabel: 'プレビュー',
    outputInfo:
      '元画像: {srcWidth} × {srcHeight} px → 出力: {width} × {height} px',
    jpegTransparentNote:
      'JPEGは透明を扱えないため、透明な部分（角丸の外側など）は白で保存されます。',
    downloadButton: '枠付き画像をダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorTooLarge:
      '画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。先に画像を縮小してください。',
    errorOutputTooLarge:
      '枠を付けた画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。枠を細くするか、元画像を縮小してください。',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザがこの保存形式に対応していない可能性があります。別の形式をお試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを枠内にドラッグ＆ドロップするか、ボタンから選びます。',
      '「枠のスタイル」から「ポラロイド風」「額縁風」などを選びます。',
      '「枠の太さ」「角丸」「枠の色」を調整し、プレビューで仕上がりを確認します。',
      '「保存形式」を選び、「枠付き画像をダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '枠は元画像の外側に足されるため、出力は元画像より大きくなります。元画像が縮小・切り抜きされることはありません。',
      '「影付き」では画像の周りに余白を取って影を描きます。「背景を透明にする」をチェックすると、余白部分は透明になります（PNG・WebPのみ）。',
      '「角丸」は枠の外側の角を丸くします。枠の外側の角は透明になるため、透明を残したいときは「PNG」または「WebP」を選んでください。「JPEG」では白で塗りつぶされます。',
      '「ポラロイド風」は下側の枠だけが広くなります。「補助色」は「二重枠」「額縁風」「影付き」でだけ使われます。',
      'GIFやアニメーションWebPは、最初の1コマだけが対象になります。読み込める画像は1辺16384px・総画素数5,000万までで、出力にも同じ上限があります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ポラロイド風',
        description:
          'インスタントカメラの写真のように、上と左右が細く、下側だけが広い白い枠を付けるスタイルです。',
      },
      {
        term: 'マット（額縁のマット）',
        description:
          '額縁の内側で、絵と木枠のあいだに入れる紙の縁取りです。ここでは「補助色」で色を決めます。',
      },
      {
        term: '角丸（border-radius）',
        description:
          '四隅を丸くする処理です。半径が大きいほど丸くなり、最大は短辺の半分（円形に近い形）です。',
      },
    ],
  },
  en: {
    title: 'Image Frame Maker: Polaroid, Border & Rounded Frames',
    description:
      'Add a Polaroid, simple, double, wooden-frame, rounded or drop-shadow frame to a photo. Adjust color, thickness and corners; save as PNG, JPEG or WebP.',
    h1: 'Add a Frame to an Image (Polaroid, Border, Rounded Corners)',
    introHtml:
      'Put a decorative frame around a photo or illustration: Polaroid-style, simple border, double border, picture frame, rounded corners, or a drop shadow. Tweak the color, thickness and corner radius live and save as PNG, JPEG or WebP. Everything runs in your browser, so your image is never uploaded. If you only need plain margins, use <a href="/en/tools/image-padding/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Padding</a>; for circular crops, try the <a href="/en/tools/image-round-crop/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Round Image Cropper</a>.',
    dropLabel: 'Choose an image file',
    dropHint: 'Drag and drop an image here, or pick one with the button.',
    presetLabel: 'Frame style',
    presetOptions: [
      { value: 'polaroid', label: 'Polaroid', selected: true },
      { value: 'simple', label: 'Simple border' },
      { value: 'double', label: 'Double border' },
      { value: 'frame', label: 'Picture frame' },
      { value: 'rounded', label: 'Rounded' },
      { value: 'shadow', label: 'Drop shadow' },
    ],
    thicknessLabel: 'Frame thickness (% of the image short side)',
    radiusLabel: 'Corner radius (% of the output short side)',
    colorLabel: 'Frame color',
    accentLabel: 'Accent color',
    accentHint:
      'Used for the lines of the double border, the mat of the picture frame, and the shadow. Other styles ignore it.',
    transparentLabel: 'Transparent background',
    formatLabel: 'Format',
    qualityLabel: 'Quality',
    previewLabel: 'Preview',
    outputInfo:
      'Source: {srcWidth} × {srcHeight} px → Output: {width} × {height} px',
    jpegTransparentNote:
      'JPEG cannot hold transparency, so transparent areas (such as outside rounded corners) are saved as white.',
    downloadButton: 'Download framed image',
    downloaded: 'Downloaded',
    errorNotImage:
      'This file cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorTooLarge:
      'The image is too large (up to {max} px per side and 50 million pixels in total). Shrink it first.',
    errorOutputTooLarge:
      'The framed image would be too large (up to {max} px per side and 50 million pixels in total). Use a thinner frame or shrink the image first.',
    errorLoadFailed:
      'Could not load the image. Check that the file is not corrupted and is in a supported format.',
    errorExportFailed:
      'Could not export the image. Your browser may not support this format. Try another one.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop an image file into the box, or pick one with the button.',
      'Choose a style such as "Polaroid" or "Picture frame" under "Frame style".',
      'Adjust "Frame thickness (% of the image short side)", "Corner radius (% of the output short side)" and "Frame color", and check the preview.',
      'Choose a "Format" and click "Download framed image" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The frame is added outside the original image, so the output is larger than the source. The image itself is never scaled or cropped.',
      '"Drop shadow" leaves a margin around the image for the shadow. Tick "Transparent background" to make that margin transparent (PNG and WebP only).',
      'Rounded corners make the outer corners of the frame transparent. Choose "PNG" or "WebP" to keep that transparency; "JPEG" fills it with white.',
      '"Polaroid" widens only the bottom edge. The "Accent color" is used only by "Double border", "Picture frame" and "Drop shadow".',
      'For GIF and animated WebP, only the first frame is used. Images up to 16384 px per side and 50 million pixels in total can be loaded, and the same limit applies to the output.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Polaroid-style frame',
        description:
          'A white frame like an instant-camera print: thin on the top and sides, with a wider strip at the bottom.',
      },
      {
        term: 'Mat (picture frame mat)',
        description:
          'The paper border between a picture and the wooden frame. Here its color is set by the accent color.',
      },
      {
        term: 'Corner radius (border-radius)',
        description:
          'How round the four corners are. A larger radius means rounder corners, up to half of the short side (close to a circle).',
      },
    ],
  },
};
