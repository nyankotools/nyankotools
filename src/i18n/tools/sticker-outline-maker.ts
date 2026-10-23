import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface StickerOutlineMakerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  widthLabel: string;
  colorLabel: string;
  outerWidthLabel: string;
  outerColorLabel: string;
  fillHolesLabel: string;
  shadowOpacityLabel: string;
  shadowXLabel: string;
  shadowYLabel: string;
  shadowColorLabel: string;
  previewLabel: string;
  /** {width}, {height} を置換する */
  outputInfo: string;
  /** {width}, {height} を置換する */
  scaledInfo: string;
  downloadButton: string;
  downloaded: string;
  errorNotImage: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const stickerOutlineMakerContent: Record<
  Locale,
  StickerOutlineMakerPageContent
> = {
  ja: {
    title: 'ステッカー風の縁取りを付ける（透過PNG）',
    description:
      '切り抜いた透過PNGに、ステッカーのような縁取りを付けるツールです。太さと色の指定、二重縁、影、内側の穴埋めに対応。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: '切り抜き画像にステッカー風の縁取りを付ける',
    introHtml:
      '透過PNGの輪郭に沿って、好きな太さ・色の縁取りを付けます。二重縁や影、内側の穴埋めにも対応し、透過PNGのまま保存できます。背景を透過していない画像は、先に <a href="/tools/image-background-remover/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像の背景透過</a> で切り抜いてからお使いください。画像はブラウザ内で処理され、アップロードされません。',
    dropLabel: '透過PNGを選択',
    dropHint:
      'ここに切り抜き済みの画像（透過PNGなど）をドラッグ＆ドロップするか、ボタンから選択してください。',
    widthLabel: '縁取りの太さ',
    colorLabel: '縁取りの色',
    outerWidthLabel: '外側の縁の太さ',
    outerColorLabel: '外側の縁の色',
    fillHolesLabel: '内側の穴を埋める',
    shadowOpacityLabel: '影の濃さ',
    shadowXLabel: '影の横ずれ',
    shadowYLabel: '影の縦ずれ',
    shadowColorLabel: '影の色',
    previewLabel: 'プレビュー（市松模様の部分が透明）',
    outputInfo: '出力サイズ: {width} × {height} px',
    scaledInfo:
      '大きな画像のため {width} × {height} px に縮小して処理しました。',
    downloadButton: '透過PNGをダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '画像として読み取れません。PNG・WebP・GIFなどの画像ファイルを選んでください。',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorExportFailed:
      'PNGを書き出せませんでした。画像が大きすぎるか、ブラウザの制限の可能性があります。',
    howToHeading: '使い方',
    howToSteps: [
      '切り抜き済みの透過PNGを枠内にドラッグ＆ドロップするか、ボタンから選びます。',
      '「縁取りの太さ」と「縁取りの色」を設定します。プレビューで仕上がりを確認できます。',
      '必要に応じて「外側の縁の太さ」で二重縁、「影の濃さ」で影、「内側の穴を埋める」でドーナツ状の穴の塗りつぶしを設定します。',
      '「透過PNGをダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '縁取りは、画像の透明でない部分（アルファ値がある程度以上の画素）の外側に付けます。背景が透明でない画像（JPEGなど）は、画像全体が1つの四角形として縁取りされます。',
      '縁取りの太さの分だけ、四辺に余白が加わって出力サイズが大きくなります。影を付けるときは、ずれの分も余白が増えます。',
      '長辺が2000pxを超える画像は、処理を軽くするために縮小してから縁取りします。',
      '「内側の穴を埋める」は、画像の端につながっていない透明部分だけを埋めます。端に開いた切れ込みは埋まりません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'アルファチャンネル',
        description:
          '画像の各ピクセルの透明度を表すデータです。PNGやWebPは対応しており、背景を透明にして保存できます。JPEGは対応していません。',
      },
      {
        term: '距離変換',
        description:
          '各ピクセルから、図形の最も近い点までの距離を求める処理です。このツールでは、この距離が縁取りの太さ以下のピクセルを塗ることで、円形になめらかな縁取りを作っています。',
      },
    ],
  },
  en: {
    title: 'Sticker Outline Maker for Transparent PNGs',
    description:
      'Add a sticker-style outline to a cutout PNG. Choose width and color, add a double border, a shadow, or fill holes. Runs in your browser; nothing is uploaded.',
    h1: 'Add a Sticker-Style Outline to a Cutout Image',
    introHtml:
      'Add an outline of any width and color that follows the edge of a transparent PNG. Double borders, a drop shadow, and hole filling are supported, and the result is saved as a transparent PNG. If your image still has a background, cut it out first with the <a href="/en/tools/image-background-remover/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Background Remover</a>. Everything runs in your browser and nothing is uploaded.',
    dropLabel: 'Choose a transparent PNG',
    dropHint:
      'Drag and drop a cutout image (such as a transparent PNG) here, or pick one with the button.',
    widthLabel: 'Outline width',
    colorLabel: 'Outline color',
    outerWidthLabel: 'Outer border width',
    outerColorLabel: 'Outer border color',
    fillHolesLabel: 'Fill inner holes',
    shadowOpacityLabel: 'Shadow opacity',
    shadowXLabel: 'Shadow offset X',
    shadowYLabel: 'Shadow offset Y',
    shadowColorLabel: 'Shadow color',
    previewLabel: 'Preview (the checkerboard is transparent)',
    outputInfo: 'Output size: {width} × {height} px',
    scaledInfo:
      'The image was large, so it was scaled down to {width} × {height} px before processing.',
    downloadButton: 'Download transparent PNG',
    downloaded: 'Downloaded',
    errorNotImage:
      'This file cannot be read as an image. Choose an image such as PNG, WebP, or GIF.',
    errorLoadFailed:
      'Could not load the image. Check that the file is not corrupted and is in a supported format.',
    errorExportFailed:
      'Could not export the PNG. The image may be too large, or the browser may be limiting it.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop a cutout PNG with a transparent background into the box, or pick one with the button.',
      'Set the "Outline width" and "Outline color". The preview shows the result.',
      'If you like, add a double border with "Outer border width", a shadow with "Shadow opacity", and fill ring-shaped gaps with "Fill inner holes".',
      'Click "Download transparent PNG" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The outline is drawn around the non-transparent part of the image (pixels with more than a small alpha value). An image without transparency, such as a JPEG, gets one rectangular outline around the whole picture.',
      'The output grows by the outline width on all four sides, and by the shadow offset as well when a shadow is on.',
      'Images with a long side over 2000 px are scaled down before the outline is added, to keep processing light.',
      '"Fill inner holes" only fills transparent areas that do not touch the image border. Notches that open to the edge stay open.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Alpha channel',
        description:
          'Data that stores the transparency of each pixel. PNG and WebP support it, so the background can be saved as transparent. JPEG does not.',
      },
      {
        term: 'Distance transform',
        description:
          'A calculation of how far each pixel is from the nearest point of a shape. This tool paints every pixel whose distance is within the outline width, which gives a smooth, round outline.',
      },
    ],
  },
};
