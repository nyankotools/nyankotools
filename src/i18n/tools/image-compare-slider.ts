import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageCompareSliderPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  beforeDropLabel: string;
  afterDropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換 */
  sourceInfoTemplate: string;
  orientationLabel: string;
  orientationHorizontal: string;
  orientationVertical: string;
  positionLabel: string;
  showLabelsLabel: string;
  beforeBadge: string;
  afterBadge: string;
  resultsHeading: string;
  sliderHint: string;
  downloadSliderButton: string;
  downloadSideButton: string;
  clearButton: string;
  processing: string;
  needBothNote: string;
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

export const imageCompareSliderContent: Record<
  Locale,
  ImageCompareSliderPageContent
> = {
  ja: {
    title: '画像比較スライダー（ビフォーアフター）無料ツール',
    description:
      '2枚の画像をドラッグで見比べられるビフォーアフター比較スライダー。左右・上下の切り替え、ラベル表示、並置画像のPNG保存に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像比較スライダー（ビフォーアフター）',
    introHtml:
      '加工前と加工後の2枚の画像を読み込み、境界線をドラッグまたは矢印キーで動かして違いを確認できます。左右・上下の切り替え、「Before」「After」のラベル表示、2枚を並べた画像のPNG保存に対応しています。写真の色味を整えるなら<a href="/tools/image-filter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像フィルター・色調補正</a>もご利用ください。',
    beforeDropLabel: 'ビフォー画像を選択',
    afterDropLabel: 'アフター画像を選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '{width}×{height}px（{size}）',
    orientationLabel: '分割の向き',
    orientationHorizontal: '左右に分割',
    orientationVertical: '上下に分割',
    positionLabel: '境界の位置',
    showLabelsLabel: 'ラベルを表示',
    beforeBadge: 'Before',
    afterBadge: 'After',
    resultsHeading: '比較プレビュー',
    sliderHint:
      'プレビュー上をドラッグするか、スライダーを選んで矢印キーで境界を動かせます。',
    downloadSliderButton: '比較画像をPNGで保存',
    downloadSideButton: '並置画像をPNGで保存',
    clearButton: 'クリア',
    processing: '処理中…',
    needBothNote: '2枚の画像を読み込むと比較できます。',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ）',
    errorConversionFailed:
      '処理に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorTooManyPixels: '画像の画素数が多すぎます（上限は約4,000万画素）',
    notesHeading: '注意点',
    notes: [
      'アフター画像がビフォー画像と縦横比が違う場合は、ビフォー画像の大きさに合わせて余白付きで収めて表示します。',
      '保存するPNGの1枚あたりの長辺は最大4,096pxです。これより大きい画像は縮小されます。',
      '「並置画像をPNGで保存」はビフォーとアフターを並べた画像で、分割の向きに応じて横並びまたは縦並びになります。',
      'GIFアニメーションは最初のフレームだけを使います。アニメーションGIFとしての出力には対応していません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '「ビフォー画像を選択」と「アフター画像を選択」で2枚の画像を読み込みます（ドラッグ＆ドロップも可能です）。',
      'プレビュー上をドラッグするか、「境界の位置」を矢印キーで動かして見比べます。',
      '「分割の向き」と「ラベルを表示」を必要に応じて切り替えます。',
      '「比較画像をPNGで保存」または「並置画像をPNGで保存」で保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ビフォーアフター',
        description:
          '加工や修正の前後を並べて見せる表現。画像比較スライダーでは、境界線の片側に加工前、もう片側に加工後を表示します。',
      },
      {
        term: '並置画像',
        description:
          '2枚の画像を横または縦に並べて1枚にまとめた画像。SNSや資料に貼るとき、スライダーを使えない場所でも違いを見せられます。',
      },
    ],
  },
  en: {
    title: 'Image Compare Slider: Before & After Comparison',
    description:
      'Compare two images with a draggable before/after slider. Switch horizontal or vertical, add labels, and save a side-by-side PNG. Runs in your browser.',
    h1: 'Image Compare Slider (Before & After)',
    introHtml:
      'Load a before and an after image, then drag the divider or use the arrow keys to see exactly what changed. Switch between a horizontal and vertical split, show "Before" and "After" labels, and save a side-by-side PNG. To adjust photo colors first, try the <a href="/en/tools/image-filter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Filter & Color Adjustment</a> tool.',
    beforeDropLabel: 'Choose the before image',
    afterDropLabel: 'Choose the after image',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: '{width}×{height}px ({size})',
    orientationLabel: 'Split direction',
    orientationHorizontal: 'Left / right',
    orientationVertical: 'Top / bottom',
    positionLabel: 'Divider position',
    showLabelsLabel: 'Show labels',
    beforeBadge: 'Before',
    afterBadge: 'After',
    resultsHeading: 'Comparison preview',
    sliderHint:
      'Drag on the preview, or focus the slider and use the arrow keys, to move the divider.',
    downloadSliderButton: 'Save comparison as PNG',
    downloadSideButton: 'Save side-by-side as PNG',
    clearButton: 'Clear',
    processing: 'Processing…',
    needBothNote: 'Load both images to start comparing.',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP)',
    errorConversionFailed:
      'Processing failed. The file may be corrupted, or your browser may not support this format.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    errorTooManyPixels:
      'This image has too many pixels (limit: about 40 megapixels)',
    notesHeading: 'Notes',
    notes: [
      'If the after image has a different aspect ratio, it is fitted inside the before image with empty margins.',
      'Saved PNGs are limited to 4,096px on the longest edge per image. Larger images are scaled down.',
      '"Save side-by-side as PNG" places the before and after images next to each other, horizontally or vertically depending on the split direction.',
      'Animated GIFs use only their first frame. Exporting an animated GIF is not supported.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Load two images with "Choose the before image" and "Choose the after image" (drag & drop also works).',
      'Drag on the preview, or move "Divider position" with the arrow keys, to compare.',
      'Switch "Split direction" and "Show labels" as needed.',
      'Save with "Save comparison as PNG" or "Save side-by-side as PNG".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Before / after',
        description:
          'A way of showing an edit by placing the original next to the result. The slider shows the original on one side of the divider and the edited version on the other.',
      },
      {
        term: 'Side-by-side image',
        description:
          'One image made by placing two images next to each other. It shows the difference even where an interactive slider cannot be embedded, such as social posts or documents.',
      },
    ],
  },
};
