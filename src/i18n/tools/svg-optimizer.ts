import type { Locale } from '../../data/tools';

export interface SvgOptimizerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  fileLabel: string;
  fileHint: string;
  dropHint: string;
  inputLabel: string;
  inputPlaceholder: string;
  optionsHeading: string;
  optionMultipass: string;
  optionPretty: string;
  optionRemoveDimensions: string;
  optionPrecision: string;
  outputLabel: string;
  previewLabel: string;
  /** {original} {optimized} {percent} を置換 */
  sizeTemplate: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  clear: string;
  errorInvalid: string;
  errorNotSvg: string;
  errorReadFailed: string;
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const svgOptimizerContent: Record<Locale, SvgOptimizerPageContent> = {
  ja: {
    title: 'SVG最適化（SVGO）｜SVGを圧縮して軽量化',
    description:
      'SVGファイルやSVGコードをSVGOで最適化し、不要なメタデータやコメントを削除してファイルサイズを削減する無料ツールです。最適化前後のサイズ比較とプレビュー付き。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'SVG最適化（SVGO）',
    introHtml:
      'SVGファイルを選択するかSVGコードを貼り付けると、SVGOで不要な情報を取り除いて軽量化します。ビットマップ画像のサイズ変更・圧縮は<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a>、SVGをCSSなどに埋め込みたい場合は<a href="/tools/image-to-base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像のBase64（Data URL）変換</a>もご利用ください。',
    fileLabel: 'SVGファイルを選択',
    dropHint: 'ここにSVGファイルをドラッグ＆ドロップすることもできます',
    fileHint:
      '.svgファイルを選ぶか、下の入力欄にSVGコードを貼り付けてください。',
    inputLabel: 'SVGコード（入力）',
    inputPlaceholder: '<svg xmlns="http://www.w3.org/2000/svg" ...>',
    optionsHeading: '最適化オプション',
    optionMultipass: '複数回パスで最適化する（より小さくなる）',
    optionPretty: '読みやすく整形して出力する',
    optionRemoveDimensions: 'width/height属性を削除する（viewBoxで拡縮）',
    optionPrecision: '数値の小数点以下の桁数',
    outputLabel: '最適化後のSVG',
    previewLabel: 'プレビュー',
    sizeTemplate: '{original} → {optimized}（{percent}）',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'SVGをダウンロード',
    clear: 'クリア',
    errorInvalid:
      'SVGとして解釈できませんでした。タグが正しく閉じられているか確認してください。',
    errorNotSvg: 'SVGファイル（.svg）を選択してください。',
    errorReadFailed: 'ファイルの読み込みに失敗しました。',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'SVG',
        description:
          'XMLベースのベクター画像形式です。拡大しても劣化せず、ロゴやアイコンによく使われます。デザインツールが書き出したSVGには編集用のメタデータなど、表示に不要な情報が多く含まれがちです。',
      },
      {
        term: 'SVGO',
        description:
          'SVGを最適化するオープンソースのツールです。コメントや不要な属性の削除、パスデータの短縮などで、見た目を変えずにファイルサイズを減らします。',
      },
      {
        term: 'viewBox',
        description:
          'SVGの描画座標系を定める属性です。width/heightを削除してviewBoxだけにすると、表示先のサイズに合わせて自由に拡縮できます。',
      },
    ],
  },
  en: {
    title: 'SVG Optimizer (SVGO) – Compress and Minify SVG Online',
    description:
      'A free online SVG optimizer powered by SVGO. Paste SVG code or upload a file to strip metadata and comments and shrink the file size, with a before/after size comparison and preview. Your data is processed in the browser and never sent to a server.',
    h1: 'SVG Optimizer (SVGO)',
    introHtml:
      'Choose an SVG file or paste SVG code to remove unnecessary data and make it smaller with SVGO. To resize or compress raster images, try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>. To embed an SVG in CSS or HTML, use the <a href="/en/tools/image-to-base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image to Base64 Converter</a>.',
    fileLabel: 'Choose an SVG file',
    dropHint: 'You can also drag and drop an SVG file here',
    fileHint: 'Pick an .svg file, or paste SVG code into the box below.',
    inputLabel: 'SVG code (input)',
    inputPlaceholder: '<svg xmlns="http://www.w3.org/2000/svg" ...>',
    optionsHeading: 'Optimization options',
    optionMultipass: 'Run multiple passes (smaller output)',
    optionPretty: 'Pretty-print the output',
    optionRemoveDimensions: 'Remove width/height (scale via viewBox)',
    optionPrecision: 'Decimal places for numbers',
    outputLabel: 'Optimized SVG',
    previewLabel: 'Preview',
    sizeTemplate: '{original} → {optimized} ({percent})',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Download SVG',
    clear: 'Clear',
    errorInvalid:
      'Could not parse this as SVG. Please check that all tags are properly closed.',
    errorNotSvg: 'Please choose an SVG (.svg) file.',
    errorReadFailed: 'Failed to read the file.',
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'SVG',
        description:
          'An XML-based vector image format that stays sharp at any size and is widely used for logos and icons. SVGs exported from design tools often contain editor metadata and other data that is not needed for rendering.',
      },
      {
        term: 'SVGO',
        description:
          'An open-source SVG optimizer. It removes comments and unused attributes and shortens path data to reduce file size without changing how the image looks.',
      },
      {
        term: 'viewBox',
        description:
          'An attribute that defines the SVG coordinate system. If you drop width/height and keep only the viewBox, the image scales freely to fit its container.',
      },
    ],
  },
};
