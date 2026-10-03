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

export interface ImageTextOverlayPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  textLabel: string;
  textPlaceholder: string;
  /** 画像を読み込んだときに入れておく文字 */
  defaultText: string;
  positionLabel: string;
  positionOptions: SelectOption[];
  fontLabel: string;
  fontOptions: SelectOption[];
  sizeLabel: string;
  boldLabel: string;
  colorLabel: string;
  opacityLabel: string;
  strokeColorLabel: string;
  strokeWidthLabel: string;
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

export const imageTextOverlayContent: Record<
  Locale,
  ImageTextOverlayPageContent
> = {
  ja: {
    title: '画像への文字入れ・透かし（テキストウォーターマーク）',
    description:
      '画像に好きな文字を入れたり、全体に透かし（ウォーターマーク）を敷き詰めたりできる無料ツールです。位置・サイズ・色・透明度・縁取り・角度を指定でき、PNG・JPEG・WebPで保存できます。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像への文字入れ・透かし（ブラウザで文字を重ねる）',
    introHtml:
      '画像に文字を重ねて、キャプションやクレジット、コピーライト表記を入れます。「全体に敷き詰める」を選ぶと、斜めの透かし（ウォーターマーク）も作れます。位置・サイズ・色・透明度・縁取り・角度を調整でき、ブラウザ内で処理されるため画像はアップロードされません。写真の位置情報を消したいときは <a href="/tools/exif-viewer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">EXIF情報表示・削除</a> もご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。',
    textLabel: '入れる文字（改行で複数行）',
    textPlaceholder: '例: © Your Name',
    defaultText: '© Your Name',
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
    fontLabel: '書体',
    fontOptions: [
      { value: 'sans', label: 'ゴシック体', selected: true },
      { value: 'serif', label: '明朝体' },
      { value: 'mono', label: '等幅' },
    ],
    sizeLabel: '文字サイズ（px）',
    boldLabel: '太字',
    colorLabel: '文字色',
    opacityLabel: '不透明度',
    strokeColorLabel: '縁取りの色',
    strokeWidthLabel: '縁取りの太さ（px）',
    marginLabel: '端からの余白（px）',
    angleLabel: '角度（度）',
    tileGapLabel: '敷き詰めの間隔（px）',
    previewLabel: 'プレビュー',
    formatLabel: '保存形式',
    qualityLabel: '画質',
    outputInfo: '出力サイズ: {width} × {height} px',
    downloadButton: '文字入れした画像をダウンロード',
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
      '「入れる文字」に文字を入力し、「位置」を選びます。透かしにしたいときは「全体に敷き詰める（透かし）」を選びます。',
      '「文字サイズ」「文字色」「不透明度」「縁取りの色」「角度」などを調整します。プレビューで仕上がりを確認できます。',
      '「保存形式」を選び、「文字入れした画像をダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '文字サイズは元の画像のピクセル数での指定です。大きな画像では、初期値より大きめにしないと小さく見えます。',
      '書体はお使いの端末に入っているフォントから選ばれます（ゴシック体・明朝体・等幅）。端末によって見た目が少し異なります。',
      '敷き詰めた透かしの個数には上限があり、画像に対して間隔が狭すぎる場合は自動で広げられます。',
      '「JPEG」は透明を扱えないため、透明部分は白で塗りつぶされます。GIFやアニメーションWebPは、最初の1コマだけが対象です。',
      '文字を重ねた画像は、元の画像と別のファイルとして保存されます。元の画像は変更されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '透かし（ウォーターマーク）',
        description:
          '画像に重ねて入れる、著作者名やロゴなどの薄い文字です。無断転載の抑止や、出どころを示す目的で使われます。',
      },
      {
        term: '不透明度',
        description:
          '文字の濃さを表す割合です。100%は完全に不透明、小さくするほど下の画像が透けて見えます。透かしでは30〜50%程度がよく使われます。',
      },
      {
        term: '縁取り（ストローク）',
        description:
          '文字の輪郭に付ける線です。写真の明るさや色と文字色が近いときでも、読みやすくなります。',
      },
    ],
  },
  en: {
    title: 'Add Text or Watermark to Image (Text Overlay)',
    description:
      'Add text or a tiled watermark to an image with custom position, size, color, opacity, and outline. Runs in your browser; nothing is uploaded.',
    h1: 'Add Text or Watermark to Image (Online, In Your Browser)',
    introHtml:
      'Overlay text on an image for captions, credits, or copyright notices. Choose "Tile across the image (watermark)" to make a diagonal watermark. You can adjust position, size, color, opacity, outline, and angle. Everything runs in your browser and nothing is uploaded. To strip location data from photos, try the <a href="/en/tools/exif-viewer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">EXIF Viewer &amp; Remover</a>.',
    dropLabel: 'Choose an image file',
    dropHint: 'Drag and drop an image here, or pick one with the button.',
    textLabel: 'Text (one line per row)',
    textPlaceholder: 'e.g. © Your Name',
    defaultText: '© Your Name',
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
    fontLabel: 'Font',
    fontOptions: [
      { value: 'sans', label: 'Sans-serif', selected: true },
      { value: 'serif', label: 'Serif' },
      { value: 'mono', label: 'Monospace' },
    ],
    sizeLabel: 'Font size (px)',
    boldLabel: 'Bold',
    colorLabel: 'Text color',
    opacityLabel: 'Opacity',
    strokeColorLabel: 'Outline color',
    strokeWidthLabel: 'Outline width (px)',
    marginLabel: 'Margin from edge (px)',
    angleLabel: 'Angle (degrees)',
    tileGapLabel: 'Tile spacing (px)',
    previewLabel: 'Preview',
    formatLabel: 'Format',
    qualityLabel: 'Quality',
    outputInfo: 'Output size: {width} × {height} px',
    downloadButton: 'Download image with text',
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
      'Type your words in "Text" and choose a "Position". For a watermark, choose "Tile across the image (watermark)".',
      'Adjust "Font size", "Text color", "Opacity", "Outline color", "Angle", and more. The preview shows the result.',
      'Choose a "Format" and click "Download image with text" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Font size is in pixels of the original image. On a large image, text looks small unless you make it larger than the default.',
      'Fonts come from those installed on your device (sans-serif, serif, monospace), so the look varies a little between devices.',
      'The number of tiled watermarks is capped; if the spacing is too tight for the image, it is widened automatically.',
      '"JPEG" cannot hold transparency, so transparent areas are filled with white. For GIF and animated WebP, only the first frame is used.',
      'The image with text is saved as a new file; your original image is not changed.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Watermark',
        description:
          'Faint text or a logo laid over an image, such as the author name. It discourages unauthorized reuse and shows where the image came from.',
      },
      {
        term: 'Opacity',
        description:
          'How solid the text is. 100% is fully opaque; the lower it is, the more of the image shows through. Watermarks often use about 30–50%.',
      },
      {
        term: 'Outline (stroke)',
        description:
          'A line drawn around the edge of the letters. It keeps text readable even when its color is close to the photo behind it.',
      },
    ],
  },
};
