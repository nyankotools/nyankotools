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

export interface ImageLogoWatermarkPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  baseLabel: string;
  baseHint: string;
  logoLabel: string;
  logoHint: string;
  positionLabel: string;
  positionOptions: SelectOption[];
  sizeLabel: string;
  opacityLabel: string;
  marginLabel: string;
  angleLabel: string;
  tileGapLabel: string;
  previewLabel: string;
  formatLabel: string;
  qualityLabel: string;
  /** {width}, {height} を置換する */
  outputInfo: string;
  downloadButton: string;
  downloaded: string;
  needLogo: string;
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

export const imageLogoWatermarkContent: Record<
  Locale,
  ImageLogoWatermarkPageContent
> = {
  ja: {
    title: '画像にロゴ・透かし画像を合成（位置・サイズ・不透明度）',
    description:
      'ベース画像にロゴや透かし画像を重ねて保存できる無料ツールです。9分割の位置・サイズ・不透明度・余白・回転・敷き詰めを指定でき、PNG・JPEGで保存できます。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像にロゴ・透かし画像を合成（ブラウザで完結）',
    introHtml:
      'ベース画像の上にロゴ画像を重ねて、ウォーターマーク入りの画像を作ります。位置は9分割から選び、サイズ・不透明度・余白・回転を調整できます。「全体に敷き詰める（透かし）」を選ぶと、ロゴを画像全体に並べられます。画像はブラウザ内だけで処理され、外部には送信されません。文字を入れたいときは <a href="/tools/image-text-overlay/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像への文字入れ・透かし</a> をご利用ください。',
    baseLabel: 'ベース画像',
    baseHint:
      'ここにベースにする画像をドラッグ＆ドロップするか、ボタンから選択してください。',
    logoLabel: 'ロゴ画像',
    logoHint:
      'ここにロゴ（透過PNG推奨）をドラッグ＆ドロップするか、ボタンから選択してください。',
    positionLabel: '位置',
    positionOptions: [
      { value: 'top-left', label: '左上' },
      { value: 'top-center', label: '上中央' },
      { value: 'top-right', label: '右上' },
      { value: 'middle-left', label: '左中央' },
      { value: 'center', label: '中央' },
      { value: 'middle-right', label: '右中央' },
      { value: 'bottom-left', label: '左下' },
      { value: 'bottom-center', label: '下中央' },
      { value: 'bottom-right', label: '右下', selected: true },
      { value: 'tile', label: '全体に敷き詰める（透かし）' },
    ],
    sizeLabel: 'サイズ（ベース画像の幅に対する割合）',
    opacityLabel: '不透明度',
    marginLabel: '端からの余白（px）',
    angleLabel: '角度（度）',
    tileGapLabel: '敷き詰めの間隔（px）',
    previewLabel: 'プレビュー',
    formatLabel: '保存形式',
    qualityLabel: '画質',
    outputInfo: '出力サイズ: {width} × {height} px',
    downloadButton: '合成した画像をダウンロード',
    downloaded: 'ダウンロードしました',
    needLogo: 'ロゴ画像を選ぶと、ベース画像に重ねて表示されます。',
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
      '「ベース画像」に透かしを入れたい画像を、「ロゴ画像」に重ねるロゴを選びます（ドラッグ＆ドロップも可）。',
      '「位置」を選びます。画像全体に並べたいときは「全体に敷き詰める（透かし）」を選びます。',
      '「サイズ（ベース画像の幅に対する割合）」「不透明度」「端からの余白（px）」「角度（度）」を調整します。プレビューで仕上がりを確認できます。',
      '「保存形式」を選び、「合成した画像をダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '画像は外部に送信されず、ブラウザ内だけで処理されます。ロゴや未公開の写真も安心して使えます。',
      'ロゴの背景を透かしたいときは、透過PNGを使ってください。JPEGなど透過のない画像は、四角いまま重なります。',
      'サイズはベース画像の幅に対する割合で、ロゴの縦横比は保たれます。',
      '敷き詰めたロゴの個数には上限があり、間隔が狭すぎる場合は自動で広げられます。',
      '「JPEG」は透明を扱えないため、透明部分は白で塗りつぶされます。GIFやアニメーションWebPは、最初の1コマだけが対象です。',
      '文字を透かしにしたい場合は、画像への文字入れ・透かしツールを使ってください。このツールはロゴ画像の合成専用です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '透かし（ウォーターマーク）',
        description:
          '画像に重ねて入れる、ロゴや著作者名などの薄い表示です。無断転載の抑止や、出どころを示す目的で使われます。',
      },
      {
        term: '透過PNG',
        description:
          '背景が透明なPNG画像です。ロゴを重ねたときに、ロゴの形だけが表示され、四角い背景が出ません。',
      },
      {
        term: '不透明度',
        description:
          'ロゴの濃さを表す割合です。100%は完全に不透明、小さくするほど下の画像が透けて見えます。透かしでは30〜50%程度がよく使われます。',
      },
    ],
  },
  en: {
    title: 'Add Logo Watermark to Image Online',
    description:
      'Overlay a logo watermark on an image: choose position, size, opacity, margin, rotation, or tile it. Save as PNG or JPEG. Runs in your browser; no upload.',
    h1: 'Add a Logo or Watermark Image to Your Photo (In Your Browser)',
    introHtml:
      'Place a logo on top of a base image to make a watermarked copy. Pick one of nine positions and adjust size, opacity, margin, and rotation. Choose "Tile across the image (watermark)" to repeat the logo over the whole image. Everything runs in your browser and your images are never sent anywhere. To add words instead, use <a href="/en/tools/image-text-overlay/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Add Text or Watermark to Image</a>.',
    baseLabel: 'Base image',
    baseHint: 'Drag and drop the base image here, or pick one with the button.',
    logoLabel: 'Logo image',
    logoHint:
      'Drag and drop your logo here (a transparent PNG works best), or pick one with the button.',
    positionLabel: 'Position',
    positionOptions: [
      { value: 'top-left', label: 'Top left' },
      { value: 'top-center', label: 'Top center' },
      { value: 'top-right', label: 'Top right' },
      { value: 'middle-left', label: 'Middle left' },
      { value: 'center', label: 'Center' },
      { value: 'middle-right', label: 'Middle right' },
      { value: 'bottom-left', label: 'Bottom left' },
      { value: 'bottom-center', label: 'Bottom center' },
      { value: 'bottom-right', label: 'Bottom right', selected: true },
      { value: 'tile', label: 'Tile across the image (watermark)' },
    ],
    sizeLabel: 'Size (% of base image width)',
    opacityLabel: 'Opacity',
    marginLabel: 'Margin from edge (px)',
    angleLabel: 'Angle (degrees)',
    tileGapLabel: 'Tile spacing (px)',
    previewLabel: 'Preview',
    formatLabel: 'Format',
    qualityLabel: 'Quality',
    outputInfo: 'Output size: {width} × {height} px',
    downloadButton: 'Download combined image',
    downloaded: 'Downloaded',
    needLogo:
      'Choose a logo image and it will appear on top of the base image.',
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
      'Choose the image to protect as "Base image" and the logo to overlay as "Logo image" (drag and drop works too).',
      'Pick a "Position". To repeat the logo across the picture, choose "Tile across the image (watermark)".',
      'Adjust "Size (% of base image width)", "Opacity", "Margin from edge (px)", and "Angle (degrees)". The preview shows the result.',
      'Choose a "Format" and click "Download combined image" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Your images are processed only in your browser and are never sent to a server, so unreleased photos and private logos are safe to use.',
      'To make the logo background see-through, use a transparent PNG. Images without transparency, such as JPEG, stay rectangular.',
      'Size is a percentage of the base image width, and the logo keeps its aspect ratio.',
      'The number of tiled logos is capped; if the spacing is too tight for the image, it is widened automatically.',
      '"JPEG" cannot hold transparency, so transparent areas are filled with white. For GIF and animated WebP, only the first frame is used.',
      'This tool is for logo images only. To use words as a watermark, use the text overlay tool instead.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Watermark',
        description:
          'A faint logo or name laid over an image. It discourages unauthorized reuse and shows where the image came from.',
      },
      {
        term: 'Transparent PNG',
        description:
          'A PNG with a see-through background. When laid over a photo, only the logo shape shows and no white box appears around it.',
      },
      {
        term: 'Opacity',
        description:
          'How solid the logo is. 100% is fully opaque; the lower it is, the more of the image shows through. Watermarks often use about 30–50%.',
      },
    ],
  },
};
