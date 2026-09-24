import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImagePaletteExtractorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換して使うテンプレート */
  sourceInfoTemplate: string;
  paletteSizeLabel: string;
  /** `{value}` を置換して使うテンプレート */
  paletteSizeValueTemplate: string;
  originalPreviewLabel: string;
  resultsHeading: string;
  /** `{percent}` を置換して使うテンプレート */
  percentTemplate: string;
  copyButton: string;
  copiedMessage: string;
  copyFailedMessage: string;
  copyAllButton: string;
  clearButton: string;
  errorUnsupportedFile: string;
  errorConversionFailed: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorNoOpaquePixels: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imagePaletteExtractorContent: Record<
  Locale,
  ImagePaletteExtractorPageContent
> = {
  ja: {
    title: '画像カラーパレット抽出（主要な色を自動検出）無料ツール',
    description:
      '画像から主要な色（カラーパレット）を自動で抽出できる無料ツールです。画像内で使われている色をHEX・RGBコードと使用割合(%)で一覧表示し、クリックでコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像カラーパレット抽出ツール',
    introHtml:
      '画像を選択すると、その中で使われている主要な色を自動的に検出してパレットとして一覧表示します。デザインの配色決め、Webサイトやバナーのカラースキーム抽出、写真からのイメージカラー確認などに使えます。抽出した色をさらにHEX/RGB/HSLで変換したい場合は<a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a>もご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    paletteSizeLabel: '抽出する色数',
    paletteSizeValueTemplate: '{value}色',
    originalPreviewLabel: '元画像',
    resultsHeading: '抽出されたカラーパレット',
    percentTemplate: '使用割合: 約{percent}%',
    copyButton: 'コピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーに失敗しました',
    copyAllButton: 'すべてのHEXコードをコピー',
    clearButton: 'クリア',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ対応しています）',
    errorConversionFailed:
      '画像の解析に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorNoOpaquePixels:
      '色を検出できませんでした（画像全体が透明である可能性があります）',
    notesHeading: '注意点',
    notes: [
      '大きな画像は解析用に縮小してから処理するため、結果は画像全体の色の傾向を示す近似値です（1ピクセル単位の厳密な集計ではありません）。',
      '近い色同士は1つの色としてまとめて集計されるため、微妙な色の違いは反映されない場合があります。',
      '透明（アルファ値がほぼ0）のピクセルは集計対象から除外されます。画像全体が透明に近い場合、色を検出できないことがあります。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'カラーパレット',
        description:
          '画像やデザインで使われている色をまとめたセット。Webサイトやアプリの配色を検討する際、既存の写真やロゴから主要な色を抽出してパレット化することがよくあります。',
      },
      {
        term: '支配色（ドミナントカラー）',
        description:
          '画像の中で最も多くのピクセルを占める色のこと。画像の印象を決める中心的な色として、サムネイルの背景色決定やイメージカラーの分析などに利用されます。',
      },
      {
        term: 'カラークオンタイズ（減色・色の量子化）',
        description:
          '画像で使われている多数の色を、少数の代表的な色にまとめる処理。本ツールでは近い色を1つのグループとして集計し、その中の平均色を代表色として抽出しています。',
      },
    ],
  },
  en: {
    title: 'Image Color Palette Extractor (Dominant Colors) — Free Tool',
    description:
      'Free tool that automatically extracts the dominant colors from an image. Lists each color as a HEX/RGB code with its usage percentage, and lets you copy any color with one click. Your image is processed in the browser and never sent to a server.',
    h1: 'Image Color Palette Extractor',
    introHtml:
      'Select an image and this tool automatically detects its main colors and lists them as a palette. Useful for picking a design color scheme, extracting the palette of a website or banner, or checking the dominant colors of a photo. Need to convert an extracted color further? Try the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a> for HEX, RGB, and HSL.',
    dropLabel: 'Choose an image file',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    paletteSizeLabel: 'Number of colors to extract',
    paletteSizeValueTemplate: '{value} colors',
    originalPreviewLabel: 'Original image',
    resultsHeading: 'Extracted color palette',
    percentTemplate: 'Share: ~{percent}%',
    copyButton: 'Copy',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Copy failed',
    copyAllButton: 'Copy all HEX codes',
    clearButton: 'Clear',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP are supported)',
    errorConversionFailed:
      'Failed to analyze the image. The file may be corrupted, or your browser may not support this format.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    errorNoOpaquePixels:
      'No colors could be detected (the image may be entirely transparent)',
    notesHeading: 'Notes',
    notes: [
      "Large images are downscaled before analysis, so results are an approximation of the image's overall color trends rather than an exact pixel-by-pixel count.",
      'Similar colors are grouped together and counted as one, so subtle color differences may not show up separately.',
      'Nearly fully transparent pixels are excluded from the count. If the whole image is close to transparent, no colors may be detected.',
      'All processing happens in your browser — the image you select is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Color palette',
        description:
          'A set of colors used in an image or design. Designers often extract a palette of the main colors from an existing photo or logo when planning a website or app color scheme.',
      },
      {
        term: 'Dominant color',
        description:
          "The color that occupies the largest share of pixels in an image. Often used as the central color that defines an image's overall impression, such as choosing a thumbnail background color.",
      },
      {
        term: 'Color quantization',
        description:
          'The process of reducing the many colors used in an image down to a small set of representative colors. This tool groups similar colors together and reports the average color of each group as a representative palette color.',
      },
    ],
  },
};
