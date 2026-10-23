import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageDiffPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  baseDropLabel: string;
  targetDropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換 */
  sourceInfoTemplate: string;
  sizeModeLabel: string;
  sizeModePad: string;
  sizeModeResize: string;
  thresholdLabel: string;
  thresholdHint: string;
  styleLabel: string;
  styleHeatmap: string;
  styleHighlight: string;
  needBothNote: string;
  resultsHeading: string;
  identicalMessage: string;
  differentMessage: string;
  /** `{width}` `{height}` を置換 */
  comparedSizeTemplate: string;
  sizeMismatchNote: string;
  scaledNote: string;
  statDiffPercent: string;
  statDiffPixels: string;
  statMaxDelta: string;
  statMeanDelta: string;
  statBounds: string;
  /** `{x}` `{y}` `{width}` `{height}` を置換 */
  boundsTemplate: string;
  noneValue: string;
  downloadButton: string;
  clearButton: string;
  processing: string;
  errorUnsupportedFile: string;
  errorConversionFailed: string;
  /** `{max}` を置換 */
  errorFileTooLargeTemplate: string;
  errorTooManyPixels: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imageDiffContent: Record<Locale, ImageDiffPageContent> = {
  ja: {
    title: '画像差分比較（ピクセルdiff）ヒートマップ無料ツール',
    description:
      '2枚の画像をピクセル単位で比較し、差異率とヒートマップを表示。しきい値の指定、サイズが違う画像の扱い切り替え、差分画像のPNG保存に対応。ブラウザ内で処理され送信されません。',
    h1: '画像差分比較（ピクセルdiff・ヒートマップ）',
    introHtml:
      '基準画像と比較画像をピクセル単位で突き合わせ、違う場所を色で示して差異率を計算します。デザインの修正漏れ確認、スクリーンショットの回帰チェック、圧縮前後の劣化確認に使えます。ドラッグで見比べたいときは<a href="/tools/image-compare-slider/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像比較スライダー</a>もご利用ください。',
    baseDropLabel: '基準画像を選択',
    targetDropLabel: '比較画像を選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '{width}×{height}px（{size}）',
    sizeModeLabel: 'サイズが違う場合の扱い',
    sizeModePad: '余白を足して比較',
    sizeModeResize: '大きい方に拡縮して比較',
    thresholdLabel: 'しきい値（許容する差）',
    thresholdHint:
      '0%なら1段階でも違えば差異とみなします。値を上げると、圧縮ノイズなどの小さな差を無視できます。',
    styleLabel: '差分の表示',
    styleHeatmap: 'ヒートマップ',
    styleHighlight: 'ハイライト',
    needBothNote: '2枚の画像を読み込むと比較できます。',
    resultsHeading: '比較結果',
    identicalMessage: '差異はありません（しきい値の範囲内で一致）。',
    differentMessage: '差異が見つかりました。',
    comparedSizeTemplate: '比較サイズ: {width}×{height}px',
    sizeMismatchNote:
      '2枚の画像サイズが異なります。選んだ扱いに従って比較しています。',
    scaledNote:
      '画像が大きいため、比較用に縮小して計算しています（差異率は近似値です）。',
    statDiffPercent: '差異率',
    statDiffPixels: '差異のある画素数',
    statMaxDelta: '最大差分（0〜255）',
    statMeanDelta: '平均差分（0〜255）',
    statBounds: '差異の範囲',
    boundsTemplate: 'x={x}, y={y}, {width}×{height}px',
    noneValue: 'なし',
    downloadButton: '差分画像をPNGで保存',
    clearButton: 'クリア',
    processing: '処理中…',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ）',
    errorConversionFailed:
      '処理に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorTooManyPixels: '画像の画素数が多すぎます（上限は約4,000万画素）',
    notesHeading: '注意点',
    notes: [
      '「余白を足して比較」は、画像を拡縮せず左上を揃えて大きい方のサイズに足りない部分を透明として扱うため、サイズ違いの余白部分は差異になります。',
      '「大きい方に拡縮して比較」は、面積の大きい画像のサイズに、もう一方を縦横比を無視して引き伸ばして合わせます。縦横比が違うと全体が差異になりやすくなります。',
      '差分は赤・緑・青・透明度のうち最も大きく違う値で判定します。人の目に見える差とは一致しない場合があります。',
      '比較用の画像は長辺4,096px・1,600万画素までに収めます。これを超える画像は縮小して計算します。',
      'GIFアニメーションは最初のフレームだけを使います。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '「基準画像を選択」と「比較画像を選択」で2枚の画像を読み込みます（ドラッグ＆ドロップも可能です）。',
      'サイズが違うときは「サイズが違う場合の扱い」を選びます。',
      '「しきい値（許容する差）」と「差分の表示」を調整して、差異率と差分マップを確認します。',
      '「差分画像をPNGで保存」で差分マップを保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ピクセルdiff',
        description:
          '2枚の画像の同じ位置の画素どうしを比べ、違う画素を数える方法。見た目では分かりにくい1ピクセル単位の変化も検出できます。',
      },
      {
        term: 'ヒートマップ',
        description:
          '差の大きさを色で表した図。このツールでは差がない場所を黒、差が大きいほど赤から黄色に近づけて表示します。',
      },
      {
        term: '差異率',
        description: '全画素のうち、しきい値を超えて違っていた画素の割合です。',
      },
    ],
  },
  en: {
    title: 'Image Diff: Pixel Comparison Heatmap Tool',
    description:
      'Compare two images pixel by pixel and see the difference rate on a heatmap. Set a tolerance, choose how mismatched sizes are handled, and save the diff as PNG.',
    h1: 'Image Diff: Pixel Comparison with Heatmap',
    introHtml:
      'Load a base image and a comparison image to find out exactly which pixels changed and what percentage differs. Useful for catching missed design edits, checking screenshots for regressions, and measuring compression loss. To eyeball two images with a draggable divider instead, use the <a href="/en/tools/image-compare-slider/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Compare Slider</a>.',
    baseDropLabel: 'Choose the base image',
    targetDropLabel: 'Choose the comparison image',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: '{width}×{height}px ({size})',
    sizeModeLabel: 'When sizes differ',
    sizeModePad: 'Pad to the larger size',
    sizeModeResize: 'Scale to the larger image',
    thresholdLabel: 'Tolerance',
    thresholdHint:
      'At 0%, any difference counts. Raise it to ignore small differences such as compression noise.',
    styleLabel: 'Diff display',
    styleHeatmap: 'Heatmap',
    styleHighlight: 'Highlight',
    needBothNote: 'Load both images to start comparing.',
    resultsHeading: 'Result',
    identicalMessage: 'No differences (identical within the tolerance).',
    differentMessage: 'Differences found.',
    comparedSizeTemplate: 'Compared at {width}×{height}px',
    sizeMismatchNote:
      'The two images have different sizes, so they are compared using the option you selected.',
    scaledNote:
      'The images are large, so they were scaled down for the comparison (the rate is approximate).',
    statDiffPercent: 'Difference rate',
    statDiffPixels: 'Different pixels',
    statMaxDelta: 'Max delta (0-255)',
    statMeanDelta: 'Mean delta (0-255)',
    statBounds: 'Bounding box',
    boundsTemplate: 'x={x}, y={y}, {width}×{height}px',
    noneValue: 'None',
    downloadButton: 'Save diff as PNG',
    clearButton: 'Clear',
    processing: 'Processing…',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP)',
    errorConversionFailed:
      'Processing failed. The file may be corrupted, or your browser may not support this format.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    errorTooManyPixels:
      'This image has too many pixels (limit: about 40 megapixels)',
    notesHeading: 'Notes',
    notes: [
      '"Pad to the larger size" does not scale anything. The images are aligned at the top-left and missing areas count as transparent, so the margins show up as differences.',
      '"Scale to the larger image" stretches the other image to the size of the one with the larger area, ignoring aspect ratio. If the ratios differ, most pixels will be reported as different.',
      'A pixel is judged by its largest difference across red, green, blue, and alpha. This may not match how visible the difference is to the eye.',
      'Comparison is capped at 4,096px on the longest edge and 16 megapixels. Larger images are scaled down first.',
      'Animated GIFs use only their first frame.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Load two images with "Choose the base image" and "Choose the comparison image" (drag & drop also works).',
      'If the sizes differ, pick an option under "When sizes differ".',
      'Adjust "Tolerance" and "Diff display" and check the difference rate and the diff map.',
      'Save the diff map with "Save diff as PNG".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Pixel diff',
        description:
          'Comparing pixels at the same position in two images and counting the ones that differ. It catches single-pixel changes that are hard to see by eye.',
      },
      {
        term: 'Heatmap',
        description:
          'A picture that shows the size of a difference with color. Here, unchanged areas are black and larger differences shift from red toward yellow.',
      },
      {
        term: 'Difference rate',
        description:
          'The share of all pixels that differ by more than the tolerance.',
      },
    ],
  },
};
