import type { Locale } from '../../data/tools';
import type { FilterKey, FilterPreset } from '../../lib/tools/image-filter';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageFilterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換 */
  sourceInfoTemplate: string;
  presetsLabel: string;
  presetLabels: Record<FilterPreset['id'], string>;
  filterLabels: Record<FilterKey, string>;
  resetButton: string;
  formatLabel: string;
  qualityLabel: string;
  qualityPngNote: string;
  resultsHeading: string;
  originalPreviewLabel: string;
  resultPreviewLabel: string;
  downloadButton: string;
  clearButton: string;
  previewScaledNote: string;
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

export const imageFilterContent: Record<Locale, ImageFilterPageContent> = {
  ja: {
    title:
      '画像フィルター・色調補正（明るさ・コントラスト・モノクロ・セピア）無料ツール',
    description:
      '写真の明るさ・コントラスト・彩度・色相・モノクロ・セピア・反転・ぼかし・シャープを無料で調整。ビフォーアフターを見比べてPNG・JPEG・WebPで保存できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像フィルター・色調補正ツール',
    introHtml:
      '画像を選んでスライダーを動かすだけで、明るさ・コントラスト・彩度・色相の調整や、モノクロ・セピア・色の反転、ぼかし・シャープ化ができます。変換前後を並べて確認し、そのまま保存できます。画像の一部をぼかしたい場合は<a href="/tools/image-blur-mosaic/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像ぼかし・モザイク</a>もご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    presetsLabel: 'プリセット',
    presetLabels: {
      mono: 'モノクロ',
      sepia: 'セピア',
      vivid: '鮮やか',
      soft: 'やわらか',
      negative: 'ネガ反転',
    },
    filterLabels: {
      brightness: '明るさ',
      contrast: 'コントラスト',
      saturation: '彩度',
      hue: '色相',
      grayscale: 'モノクロ',
      sepia: 'セピア',
      invert: '反転',
      blur: 'ぼかし',
      sharpen: 'シャープ',
    },
    resetButton: 'すべてリセット',
    formatLabel: '出力フォーマット',
    qualityLabel: '画質',
    qualityPngNote: 'PNGは可逆圧縮のため画質設定は反映されません',
    resultsHeading: 'プレビュー',
    originalPreviewLabel: '補正前',
    resultPreviewLabel: '補正後',
    downloadButton: 'ダウンロード',
    clearButton: 'クリア',
    previewScaledNote:
      'プレビューは軽量化のため縮小表示です。保存時は元のサイズで処理します。',
    processing: '処理中…',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ）',
    errorConversionFailed:
      '処理に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorTooManyPixels: '画像の画素数が多すぎます（上限は約4,000万画素）',
    notesHeading: '注意点',
    notes: [
      'すべてのフィルターをブラウザ内のピクセル計算で適用するため、ブラウザの種類（Safariなど）による差は出ません。',
      '適用順は明るさ→コントラスト→彩度→色相→モノクロ→セピア→反転→ぼかし→シャープです。',
      '大きな画像では保存時の処理に数秒かかることがあります。特にぼかしの値が大きいと時間がかかります。',
      'JPEGは透過に対応していないため、透明部分は白で塗りつぶされます。透過を残すにはPNGかWebPを選んでください。',
      '写真のExif情報（撮影場所など）は再エンコード時に含まれないため、出力ファイルには引き継がれません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      'プリセットを選ぶか、各スライダーで明るさや色味などを調整します。',
      '補正前と補正後のプレビューを見比べ、出力フォーマットを選びます。',
      '「ダウンロード」で保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'コントラスト',
        description:
          '明るい部分と暗い部分の差。上げるとメリハリが強くなり、下げると全体がのっぺりとやわらかい印象になります。',
      },
      {
        term: '彩度',
        description:
          '色の鮮やかさ。下げるほど灰色に近づき、-100で白黒になります。上げると色が濃く鮮やかになります。',
      },
      {
        term: '色相',
        description:
          '赤・緑・青といった色の種類。色相を回転させると、画像全体の色合いが別の色味へずれます。',
      },
    ],
  },
  en: {
    title: 'Image Filter & Color Adjustment: Brightness, Contrast, Sepia',
    description:
      'Adjust brightness, contrast, saturation, sepia and more with sliders. Compare before and after, then save. Runs in your browser; nothing is uploaded.',
    h1: 'Image Filter & Color Adjustment Tool',
    introHtml:
      'Pick a photo and move the sliders to tweak brightness, contrast, saturation, and hue, or apply black & white, sepia, invert, blur, and sharpen. See the original and the result side by side, then save it. To blur only part of an image, try the <a href="/en/tools/image-blur-mosaic/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Blur & Mosaic</a> tool.',
    dropLabel: 'Choose an image file',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    presetsLabel: 'Presets',
    presetLabels: {
      mono: 'Black & white',
      sepia: 'Sepia',
      vivid: 'Vivid',
      soft: 'Soft',
      negative: 'Negative',
    },
    filterLabels: {
      brightness: 'Brightness',
      contrast: 'Contrast',
      saturation: 'Saturation',
      hue: 'Hue',
      grayscale: 'Black & white',
      sepia: 'Sepia',
      invert: 'Invert',
      blur: 'Blur',
      sharpen: 'Sharpen',
    },
    resetButton: 'Reset all',
    formatLabel: 'Output format',
    qualityLabel: 'Quality',
    qualityPngNote: 'PNG is lossless, so the quality setting has no effect',
    resultsHeading: 'Preview',
    originalPreviewLabel: 'Before',
    resultPreviewLabel: 'After',
    downloadButton: 'Download',
    clearButton: 'Clear',
    previewScaledNote:
      'The preview is scaled down to stay fast. The saved file is processed at full size.',
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
      'Every filter is applied with pixel math inside the page, so results look the same in Safari and other browsers regardless of CSS filter support.',
      'Filters are applied in this order: brightness, contrast, saturation, hue, black & white, sepia, invert, blur, sharpen.',
      'Large images can take a few seconds to process when saving, especially with a large blur value.',
      'JPEG has no transparency, so transparent areas are filled with white. Choose PNG or WebP to keep it.',
      'Exif metadata such as shooting location is not carried over, because the image is re-encoded.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an image file (drag & drop also works).',
      'Pick a preset or adjust brightness, color, and other sliders.',
      'Compare the before and after previews, then choose an output format.',
      'Click "Download" to save the result.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Contrast',
        description:
          'The difference between light and dark areas. Raising it makes the image punchier; lowering it makes it flat and soft.',
      },
      {
        term: 'Saturation',
        description:
          'How vivid the colors are. Lowering it moves toward gray, and -100 gives black & white. Raising it makes colors richer.',
      },
      {
        term: 'Hue',
        description:
          'The kind of color, such as red, green, or blue. Rotating the hue shifts the whole image toward different colors.',
      },
    ],
  },
};
