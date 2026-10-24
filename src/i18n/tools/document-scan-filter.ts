import type { Locale } from '../../data/tools';
import type { ScanMode } from '../../lib/tools/document-scan-filter';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DocumentScanFilterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換 */
  sourceInfoTemplate: string;
  presetsLabel: string;
  presetLabels: Record<ScanMode, string>;
  modeLabel: string;
  modeLabels: Record<ScanMode, string>;
  shadowLabel: string;
  contrastLabel: string;
  autoThresholdLabel: string;
  thresholdLabel: string;
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

export const documentScanFilterContent: Record<
  Locale,
  DocumentScanFilterPageContent
> = {
  ja: {
    title: '書類スキャン風補正（影除去・白黒化）｜写真をスキャン画像に',
    description:
      'スマホで撮った書類・レシートの写真を、影を除去して紙を白く、文字をくっきりと補正。カラー・グレー・白黒2値に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '書類スキャン風補正ツール（影除去・白黒化）',
    introHtml:
      '書類の写真を選ぶだけで、照明ムラや影を取り除き、紙を白く・文字をくっきりさせたスキャン風の画像にします。カラー・グレースケール・白黒2値から選べ、補正前後を並べて確認できます。明るさや彩度を自由に調整したい場合は<a href="/tools/image-filter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像フィルター</a>、斜めに写った部分の切り取りには<a href="/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像トリミング</a>をご利用ください。',
    dropLabel: '書類の画像ファイルを選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    presetsLabel: 'プリセット',
    presetLabels: {
      color: 'カラー書類',
      gray: 'グレー書類',
      bw: '白黒コピー風',
    },
    modeLabel: '色のモード',
    modeLabels: {
      color: 'カラー',
      gray: 'グレースケール',
      bw: '白黒2値',
    },
    shadowLabel: '影・照明ムラの除去',
    contrastLabel: '紙の白さ・文字の濃さ',
    autoThresholdLabel: 'しきい値を自動で決める',
    thresholdLabel: 'しきい値',
    resetButton: '初期設定に戻す',
    formatLabel: '出力フォーマット',
    qualityLabel: '画質',
    qualityPngNote: 'PNGは可逆圧縮のため画質設定は反映されません',
    resultsHeading: 'プレビュー',
    originalPreviewLabel: '補正前',
    resultPreviewLabel: '補正後',
    downloadButton: 'ダウンロード',
    clearButton: 'クリア',
    previewScaledNote:
      'プレビューは軽量化のため縮小表示です。保存時は元に近いサイズで処理します（長辺3,000pxまで）。',
    processing: '処理中…',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ）',
    errorConversionFailed:
      '処理に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorTooManyPixels: '画像の画素数が多すぎます（上限は約4,000万画素）',
    notesHeading: '注意点',
    notes: [
      '画像はブラウザ内でのみ処理され、外部には送信されません。契約書・身分証・レシートなども安心して扱えます。',
      '保存時の長辺は最大3,000pxです。それより大きい画像は縦横比を保ったまま縮小して処理します。',
      '影の除去は紙の地色が画像全体でおおむね明るいことを前提にしています。紙が画面の大部分を占めない写真や、全面が濃い色の書類では効果が不自然になることがあります。',
      '白黒2値は文字を読み取りやすくしますが、写真や薄い印字、色つきの線は消えることがあります。その場合はグレースケールか「しきい値」の手動調整を試してください。',
      '紙の傾きや台形のゆがみは補正しません。必要なら先にトリミングしてください。',
      '写真のExif情報（撮影場所など）は再エンコード時に含まれないため、出力ファイルには引き継がれません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '書類を撮影した画像ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      'プリセットを選ぶか、「色のモード」「影・照明ムラの除去」「紙の白さ・文字の濃さ」を調整します。',
      '補正前と補正後のプレビューを見比べ、出力フォーマットを選びます。',
      '「ダウンロード」で保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '二値化（2値化）',
        description:
          '画像を白と黒の2色だけにする処理。しきい値より暗い画素を黒、明るい画素を白にします。コピー機やFAXのような見た目になり、ファイルサイズも小さくなります。',
      },
      {
        term: '大津の方法',
        description:
          '画像の明るさの分布から、白と黒をうまく分けるしきい値を自動で決める方法です。「しきい値を自動で決める」をオンにするとこの方法を使います。',
      },
      {
        term: '影除去（照明ムラ補正）',
        description:
          '紙の地色が場所によって暗くなっている部分を推定し、全体が同じ明るさの白になるよう補正する処理です。',
      },
    ],
  },
  en: {
    title: 'Document Scan Filter: Remove Shadows, Whiten, B&W',
    description:
      'Turn a phone photo of a document into a clean scan: remove shadows, whiten the paper, pick color, grayscale or black & white. Runs in your browser.',
    h1: 'Document Scan Filter: Remove Shadows and Clean Up Photos',
    introHtml:
      'Pick a photo of a document and get a scan-style image: uneven lighting and shadows are removed, the paper turns white, and the text gets sharper. Choose color, grayscale, or pure black & white and compare before and after. For general brightness and saturation tweaks, use <a href="/en/tools/image-filter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Filter</a>; to cut away the background first, try <a href="/en/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Cropper</a>.',
    dropLabel: 'Choose a document image',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    presetsLabel: 'Presets',
    presetLabels: {
      color: 'Color document',
      gray: 'Gray document',
      bw: 'Photocopy B&W',
    },
    modeLabel: 'Color mode',
    modeLabels: {
      color: 'Color',
      gray: 'Grayscale',
      bw: 'Black & white',
    },
    shadowLabel: 'Shadow / uneven light removal',
    contrastLabel: 'Paper whiteness / text darkness',
    autoThresholdLabel: 'Pick the threshold automatically',
    thresholdLabel: 'Threshold',
    resetButton: 'Reset to defaults',
    formatLabel: 'Output format',
    qualityLabel: 'Quality',
    qualityPngNote: 'PNG is lossless, so the quality setting has no effect',
    resultsHeading: 'Preview',
    originalPreviewLabel: 'Before',
    resultPreviewLabel: 'After',
    downloadButton: 'Download',
    clearButton: 'Clear',
    previewScaledNote:
      'The preview is scaled down to stay fast. The saved file is processed at up to 3,000 px on the long edge.',
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
      'Your image is processed only in your browser and is never uploaded, so contracts, IDs, and receipts stay private.',
      'The saved file is at most 3,000 px on the long edge. Larger images are scaled down while keeping the aspect ratio.',
      'Shadow removal assumes the paper is mostly bright across the photo. If the paper fills only a small part of the frame, or the whole page is dark, the result can look unnatural.',
      'Pure black & white makes text easy to read, but photos, faint print, and colored lines can disappear. Try grayscale or adjust the "Threshold" manually.',
      'Skew and perspective distortion are not corrected. Crop the image first if needed.',
      'Exif metadata such as shooting location is not carried over, because the image is re-encoded.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a photo of your document (drag & drop also works).',
      'Pick a preset, or adjust "Color mode", "Shadow / uneven light removal", and "Paper whiteness / text darkness".',
      'Compare the before and after previews, then choose an output format.',
      'Click "Download" to save the result.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Binarization',
        description:
          'Reducing an image to just black and white. Pixels darker than the threshold become black and the rest become white, which looks like a photocopy and keeps files small.',
      },
      {
        term: "Otsu's method",
        description:
          'A way to pick the threshold automatically from the brightness distribution so that black and white are separated cleanly. It is used when the automatic threshold option is on.',
      },
      {
        term: 'Shadow removal',
        description:
          'Estimates how dark the paper is in each area and brightens it so the whole page ends up the same white.',
      },
    ],
  },
};
