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

export interface ImageRoundCropPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  shapeLabel: string;
  shapeCircle: string;
  shapeRounded: string;
  radiusLabel: string;
  frameLabel: string;
  frameSquare: string;
  frameOriginal: string;
  sizeLabel: string;
  xLabel: string;
  yLabel: string;
  centerButton: string;
  outputSizeLabel: string;
  outputSizeOptions: SelectOption[];
  formatLabel: string;
  qualityLabel: string;
  previewLabel: string;
  previewHint: string;
  resultLabel: string;
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

export const imageRoundCropContent: Record<Locale, ImageRoundCropPageContent> =
  {
    ja: {
      title: '画像の円形・角丸切り抜き（透過PNG）',
      description:
        '画像を円形や角丸に切り抜いて、背景が透明なPNG・WebPで保存できる無料ツールです。SNSのアイコン作りに最適。切り抜き位置や角の丸みも調整できます。画像はブラウザ内で処理され、サーバーには送信されません。',
      h1: '画像を円形・角丸に切り抜く（透過PNGで保存）',
      introHtml:
        '画像を読み込み、円形または角丸の正方形に切り抜いて、背景が透明なPNG・WebPで保存します。SNSのプロフィールアイコン作りに便利です。切り抜き位置はドラッグで調整でき、角の丸みも自由に変えられます。ブラウザ内で処理され、画像はアップロードされません。四角いまま切り抜きたいときは <a href="/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像トリミング・回転・反転</a> をご利用ください。',
      dropLabel: '画像ファイルを選択',
      dropHint:
        'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。',
      shapeLabel: '形',
      shapeCircle: '円形',
      shapeRounded: '角丸',
      radiusLabel: '角の丸み（%）',
      frameLabel: '切り抜き方',
      frameSquare: '正方形に切り抜く',
      frameOriginal: '元の縦横比のまま',
      sizeLabel: '切り抜きの大きさ（px）',
      xLabel: '左端 X',
      yLabel: '上端 Y',
      centerButton: '中央に戻す',
      outputSizeLabel: '出力サイズ（長辺）',
      outputSizeOptions: [
        { value: '0', label: '原寸', selected: true },
        { value: '1024', label: '1024px' },
        { value: '512', label: '512px' },
        { value: '256', label: '256px' },
        { value: '128', label: '128px' },
      ],
      formatLabel: '保存形式',
      qualityLabel: '画質',
      previewLabel: '元画像（切り抜く位置）',
      previewHint:
        '画像上をクリック・ドラッグすると、切り抜く位置を動かせます（明るい部分が残る範囲です）。',
      resultLabel: '仕上がり',
      outputInfo: '出力サイズ: {width} × {height} px',
      downloadButton: '透過画像をダウンロード',
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
        '「形」で「円形」か「角丸」を選びます。角丸では「角の丸み（%）」で丸さを調整します。',
        '画像上をクリック・ドラッグして切り抜く位置を決め、「切り抜きの大きさ（px）」で範囲を広げ縮めします。',
        '必要なら「出力サイズ（長辺）」と「保存形式」を選び、「透過画像をダウンロード」で保存します。',
      ],
      notesHeading: '注意事項',
      notes: [
        '「正方形に切り抜く」では範囲は常に正方形です。「元の縦横比のまま」では画像全体が対象で、「円形」は楕円になります。',
        '透明な背景はPNGとWebPで保持されます。JPEGには透明がないため、このツールでは保存形式にありません。',
        '出力サイズは縮小のみで、元の範囲より大きくはなりません。',
        'GIFやアニメーションWebPは、最初の1コマだけが対象です。読み込める画像は1辺16384px・総画素数5,000万までです。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '透過PNG',
          description:
            '背景を透明にできるPNG画像です。円形に切り抜いた外側の部分が透明になるため、どんな背景色のページにも自然になじみます。',
        },
        {
          term: '角丸',
          description:
            '四角形の角を丸くする加工です。丸みを最大にすると、正方形は円になります。',
        },
        {
          term: 'アルファチャンネル',
          description:
            'ピクセルごとの透明度を持つ情報です。PNGやWebPが持ち、JPEGにはありません。',
        },
      ],
    },
    en: {
      title: 'Round Image Cropper: Circle & Rounded Corners',
      description:
        'Crop an image into a circle or rounded corners and save a transparent PNG or WebP. Great for profile icons. Runs in your browser; nothing is uploaded.',
      h1: 'Crop an Image into a Circle or Rounded Corners (Transparent PNG)',
      introHtml:
        'Load an image, crop it into a circle or a rounded square, and save it as a PNG or WebP with a transparent background. It is handy for profile pictures on social media. Drag to move the crop position and adjust how round the corners are. Everything runs in your browser and nothing is uploaded. For a plain rectangular crop, use the <a href="/en/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Cropper</a>.',
      dropLabel: 'Choose an image file',
      dropHint: 'Drag and drop an image here, or pick one with the button.',
      shapeLabel: 'Shape',
      shapeCircle: 'Circle',
      shapeRounded: 'Rounded',
      radiusLabel: 'Corner roundness (%)',
      frameLabel: 'Crop mode',
      frameSquare: 'Square crop',
      frameOriginal: 'Keep original ratio',
      sizeLabel: 'Crop size (px)',
      xLabel: 'Left X',
      yLabel: 'Top Y',
      centerButton: 'Recenter',
      outputSizeLabel: 'Output size (long side)',
      outputSizeOptions: [
        { value: '0', label: 'Original', selected: true },
        { value: '1024', label: '1024px' },
        { value: '512', label: '512px' },
        { value: '256', label: '256px' },
        { value: '128', label: '128px' },
      ],
      formatLabel: 'Format',
      qualityLabel: 'Quality',
      previewLabel: 'Source image (crop position)',
      previewHint:
        'Click or drag on the image to move the crop position (the bright part is what stays).',
      resultLabel: 'Result',
      outputInfo: 'Output size: {width} × {height} px',
      downloadButton: 'Download transparent image',
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
        'Choose "Circle" or "Rounded" under "Shape". For rounded corners, adjust "Corner roundness (%)".',
        'Click or drag on the image to set the crop position, then widen or narrow it with "Crop size (px)".',
        'If needed, pick an "Output size (long side)" and a "Format", then click "Download transparent image".',
      ],
      notesHeading: 'Notes',
      notes: [
        'With "Square crop" the area is always a square. With "Keep original ratio" the whole image is used, and "Circle" becomes an ellipse.',
        'Transparency is kept in PNG and WebP. JPEG has no transparency, so it is not offered here.',
        'The output size can only shrink the image; it never enlarges it beyond the cropped area.',
        'For GIF and animated WebP, only the first frame is used. Images up to 16384 px per side and 50 million pixels in total can be loaded.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Transparent PNG',
          description:
            'A PNG image that can have a see-through background. The area outside a circular crop becomes transparent, so it blends into any page color.',
        },
        {
          term: 'Rounded corners',
          description:
            'Softening the corners of a rectangle. At maximum roundness, a square becomes a circle.',
        },
        {
          term: 'Alpha channel',
          description:
            'Per-pixel transparency data. PNG and WebP have it; JPEG does not.',
        },
      ],
    },
  };
