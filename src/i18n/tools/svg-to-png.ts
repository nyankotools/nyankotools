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

export interface SvgToPngPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  inputLabel: string;
  inputPlaceholder: string;
  scaleLabel: string;
  scaleOptions: SelectOption[];
  backgroundLabel: string;
  backgroundOptions: SelectOption[];
  backgroundColorLabel: string;
  previewLabel: string;
  /** {width}, {height} を置換する */
  sizeInfo: string;
  downloadButton: string;
  downloaded: string;
  errorNotSvg: string;
  errorNoSize: string;
  /** {max} を置換する */
  errorTooLarge: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  errorFileRead: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const svgToPngContent: Record<Locale, SvgToPngPageContent> = {
  ja: {
    title: 'SVG→PNG変換',
    description:
      'SVGファイルやSVGコードをPNG画像に変換する無料ツールです。1〜4倍の高解像度出力、透過・白・任意色の背景に対応。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'SVG→PNG変換（高解像度・透過対応）',
    introHtml:
      'SVGファイルを読み込むかSVGコードを貼り付けて、PNG画像に変換します。倍率を上げれば高解像度のPNGも作れ、背景は透過のままでも、白や好きな色でも塗れます。ブラウザ内で処理され、アップロードはされません。SVGを軽量化したいときは <a href="/tools/svg-optimizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">SVG最適化</a> もご利用ください。',
    dropLabel: 'SVGファイルを選択',
    dropHint:
      'ここにSVGファイルをドラッグ＆ドロップするか、ボタンから選択してください。',
    inputLabel: 'またはSVGコードを貼り付け',
    inputPlaceholder: '<svg xmlns="http://www.w3.org/2000/svg" ...>',
    scaleLabel: '出力サイズ（倍率）',
    scaleOptions: [
      { value: '1', label: '1倍（元のサイズ）', selected: true },
      { value: '2', label: '2倍' },
      { value: '3', label: '3倍' },
      { value: '4', label: '4倍' },
    ],
    backgroundLabel: '背景',
    backgroundOptions: [
      { value: 'transparent', label: '透過', selected: true },
      { value: 'white', label: '白' },
      { value: 'custom', label: '色を指定' },
    ],
    backgroundColorLabel: '背景色',
    previewLabel: 'プレビュー',
    sizeInfo: '出力サイズ: {width} × {height} px',
    downloadButton: 'PNG画像をダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotSvg:
      'SVGとして読み取れません。「<svg」で始まるSVGコードか、SVGファイルを指定してください。',
    errorNoSize:
      'SVGの大きさを判定できません。ルートの <svg> に width・height または viewBox を指定してください。',
    errorTooLarge:
      '出力サイズが大きすぎます（1辺{max}pxまで、総画素数1,600万まで）。倍率を下げてください。',
    errorLoadFailed:
      'SVGを画像として読み込めませんでした。SVGの構文に誤りがないか確認してください。',
    errorExportFailed:
      'PNGを書き出せませんでした。外部の画像やforeignObjectを含むSVGは、ブラウザの制限で変換できないことがあります。',
    errorFileRead: 'ファイルを読み込めませんでした。',
    howToHeading: '使い方',
    howToSteps: [
      'SVGファイルを枠内にドラッグ＆ドロップするか、「SVGコードを貼り付け」欄にコードを貼り付けます。',
      '「出力サイズ（倍率）」と「背景」を選びます。「色を指定」を選ぶと背景色を決められます。',
      'プレビューで仕上がりを確認します。',
      '「PNG画像をダウンロード」ボタンで保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'SVGはブラウザの画像読み込みで描画するため、外部の画像・フォント・CSSを参照しているSVGは、それらが読み込まれず表示が崩れることがあります。画像は data URI で埋め込んでください。',
      'foreignObject（HTMLの埋め込み）を含むSVGは、ブラウザによってはPNGに書き出せません。',
      '出力サイズは1辺8192px・総画素数1,600万までです。大きなSVGに高い倍率を指定するとエラーになります。',
      'テキストは、お使いの端末にあるフォントで描画されます。特殊なフォントを使うSVGは、事前にテキストを図形（パス）に変換しておくと見た目が崩れません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'SVG',
        description:
          '図形や文字を数式（ベクター）で表す画像形式です。拡大しても粗くならず、ロゴやアイコンによく使われます。',
      },
      {
        term: 'PNG',
        description:
          '色数を落とさずに保存できるラスター画像（ピクセルの集まり）の形式です。背景の透過に対応しています。',
      },
      {
        term: 'viewBox',
        description:
          'SVGの描画領域の座標と大きさを指定する属性です。width・heightを省略しても、viewBoxがあれば元の大きさや縦横比を判定できます。',
      },
    ],
  },
  en: {
    title: 'SVG to PNG Converter',
    description:
      'Convert SVG files or code to PNG at 1x-4x resolution with a transparent, white, or custom background. Runs in your browser; files are never uploaded.',
    h1: 'SVG to PNG Converter (High Resolution, Transparent)',
    introHtml:
      'Load an SVG file or paste SVG code to convert it to a PNG image. Raise the scale for a high-resolution PNG, and keep the background transparent or fill it with white or any color. Everything runs in your browser and nothing is uploaded. To shrink an SVG instead, try the <a href="/en/tools/svg-optimizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">SVG Optimizer</a>.',
    dropLabel: 'Choose an SVG file',
    dropHint: 'Drag and drop an SVG file here, or pick one with the button.',
    inputLabel: 'Or paste SVG code',
    inputPlaceholder: '<svg xmlns="http://www.w3.org/2000/svg" ...>',
    scaleLabel: 'Output size (scale)',
    scaleOptions: [
      { value: '1', label: '1x (original size)', selected: true },
      { value: '2', label: '2x' },
      { value: '3', label: '3x' },
      { value: '4', label: '4x' },
    ],
    backgroundLabel: 'Background',
    backgroundOptions: [
      { value: 'transparent', label: 'Transparent', selected: true },
      { value: 'white', label: 'White' },
      { value: 'custom', label: 'Custom color' },
    ],
    backgroundColorLabel: 'Background color',
    previewLabel: 'Preview',
    sizeInfo: 'Output size: {width} × {height} px',
    downloadButton: 'Download PNG',
    downloaded: 'Downloaded',
    errorNotSvg:
      'This is not readable as SVG. Provide SVG code starting with "<svg", or an SVG file.',
    errorNoSize:
      'Could not determine the SVG size. Add width and height, or a viewBox, to the root <svg> element.',
    errorTooLarge:
      'The output is too large (up to {max} px per side and 16 million pixels in total). Lower the scale.',
    errorLoadFailed:
      'Could not load the SVG as an image. Check the SVG for syntax errors.',
    errorExportFailed:
      'Could not export the PNG. SVGs that use external images or foreignObject may be blocked by the browser.',
    errorFileRead: 'Could not read the file.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop an SVG file into the box, or paste code into the "Or paste SVG code" field.',
      'Choose the "Output size (scale)" and the "Background". Pick "Custom color" to set a background color.',
      'Check the result in the preview.',
      'Click "Download PNG" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The SVG is rendered through the browser image loader, so external images, fonts, or CSS it references are not loaded and the result may look different. Embed images as data URIs instead.',
      'SVGs containing foreignObject (embedded HTML) cannot be exported to PNG in some browsers.',
      'The output is limited to 8192 px per side and 16 million pixels in total. A large SVG with a high scale will show an error.',
      'Text is drawn with fonts installed on your device. If an SVG relies on special fonts, convert the text to paths beforehand to keep it looking the same.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'SVG',
        description:
          'An image format that describes shapes and text mathematically (vector). It stays sharp at any size, which is why it is common for logos and icons.',
      },
      {
        term: 'PNG',
        description:
          'A lossless raster (pixel-based) image format that supports transparent backgrounds.',
      },
      {
        term: 'viewBox',
        description:
          'An SVG attribute that defines the coordinate system and size of the drawing area. Even without width and height, a viewBox lets the original size and aspect ratio be determined.',
      },
    ],
  },
};
