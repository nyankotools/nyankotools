import type { Locale } from '../../data/tools';

export interface HeicConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{count}` を置換して使うテンプレート */
  filesSelectedTemplate: string;
  formatLabel: string;
  formatJpeg: string;
  formatPng: string;
  formatWebp: string;
  qualityLabel: string;
  /** `{value}` を置換して使うテンプレート */
  qualityValueTemplate: string;
  qualityPngNote: string;
  clearButton: string;
  resultsHeading: string;
  loading: string;
  originalSizeLabel: string;
  convertedSizeLabel: string;
  downloadButton: string;
  removeButton: string;
  errorUnsupportedFile: string;
  errorConversionFailed: string;
  errorLoadFailed: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManyFilesTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const heicConverterContent: Record<Locale, HeicConverterPageContent> = {
  ja: {
    title: 'HEIC→JPEG変換（iPhone写真をJPG・PNGに変換）無料ツール',
    description:
      'iPhoneで撮影したHEIC・HEIF画像をJPEG・PNG・WebPに変換する無料ツールです。複数枚の一括変換に対応し、画質も指定できます。写真はブラウザ内で処理され、サーバーには送信されません。',
    h1: 'HEIC→JPEG変換（HEIC / HEIF → JPEG・PNG・WebP）',
    introHtml:
      'iPhoneやiPadで撮影した HEIC・HEIF 形式の写真を、Windowsや多くのアプリでそのまま開ける JPEG・PNG・WebP に変換します。変換はすべてお使いのブラウザの中で行われるため、写真がサーバーにアップロードされることはありません。変換後の画像を小さくしたいときは<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a>もご利用ください。',
    dropLabel: 'HEIC / HEIF ファイルを選択',
    dropHint:
      'ここにHEIC・HEIFファイルをドラッグ＆ドロップすることもできます（複数選択可）',
    filesSelectedTemplate: '{count}件のファイルを読み込みました',
    formatLabel: '変換先フォーマット',
    formatJpeg: 'JPEG',
    formatPng: 'PNG',
    formatWebp: 'WebP',
    qualityLabel: '画質（圧縮率）',
    qualityValueTemplate: '{value}%',
    qualityPngNote:
      'PNGは可逆圧縮のため画質設定は反映されません（ファイルサイズは大きくなります）',
    clearButton: 'すべてクリア',
    resultsHeading: '変換結果',
    loading: '変換中…',
    originalSizeLabel: '変換前',
    convertedSizeLabel: '変換後',
    downloadButton: 'ダウンロード',
    removeButton: '削除',
    errorUnsupportedFile:
      'HEIC・HEIF形式のファイルではありません（拡張子が .heic / .heif の写真を選んでください）',
    errorConversionFailed:
      '変換に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorLoadFailed:
      '変換エンジンの読み込みに失敗しました。通信状況を確認して、ページを再読み込みしてください。',
    errorTooManyFilesTemplate: '一度に変換できるのは{max}件までです',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    howToHeading: '使い方',
    howToSteps: [
      'HEIC / HEIF ファイルを選択します（複数選択やドラッグ＆ドロップも可能です）。',
      '変換先フォーマット（JPEG・PNG・WebP）を選びます。',
      'JPEG・WebP では画質（圧縮率）を調整します。',
      '変換結果の一覧で、変換前後のサイズを確認してダウンロードします。',
    ],
    notesHeading: '注意点',
    notes: [
      '初回の変換時に、変換エンジン（約3MB）を読み込みます。以降はブラウザのキャッシュが使われます。',
      'JPEG・PNG・WebPへ変換すると、HEICに含まれる撮影日時・位置情報などのEXIF情報は引き継がれません（位置情報を含まない写真として共有したいときにも使えます）。',
      '向きは自動で補正されます。Live Photo（動き）は静止画の1枚のみが変換されます。',
      '写真の画素数が非常に大きい場合や、端末のメモリが少ない場合は、変換に時間がかかったり失敗したりすることがあります。',
      'すべての処理はブラウザ内で完結し、選択した写真がサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'HEIC / HEIF',
        description:
          '高効率画像ファイル形式（HEIF）の一種で、iPhoneの標準の写真形式です。JPEGの約半分のサイズで同程度の画質を保てますが、Windowsや一部のアプリ・Webサービスでは開けないことがあります。',
      },
      {
        term: '可逆圧縮／非可逆圧縮',
        description:
          '可逆圧縮（PNGなど）は元のデータを完全に復元できる方式、非可逆圧縮（JPEG・WebPなど）はデータの一部を間引いてサイズを小さくする方式です。写真には、サイズの小さいJPEGが一般的に向いています。',
      },
    ],
  },
  en: {
    title: 'HEIC to JPG Converter – Convert iPhone Photos Free',
    description:
      'Convert HEIC and HEIF photos from iPhone to JPEG, PNG, or WebP with adjustable quality, in batches. Runs in your browser; nothing is uploaded.',
    h1: 'HEIC to JPG Converter (HEIC / HEIF to JPEG, PNG, WebP)',
    introHtml:
      'Convert HEIC and HEIF photos taken on an iPhone or iPad into JPEG, PNG, or WebP files that open almost anywhere. Everything runs inside your browser, so your photos are never uploaded to a server. Need smaller files afterwards? Try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer & Compressor</a>.',
    dropLabel: 'Choose HEIC / HEIF files',
    dropHint:
      'You can also drag and drop HEIC or HEIF files here (multiple allowed)',
    filesSelectedTemplate: 'Loaded {count} file(s)',
    formatLabel: 'Output format',
    formatJpeg: 'JPEG',
    formatPng: 'PNG',
    formatWebp: 'WebP',
    qualityLabel: 'Quality (compression level)',
    qualityValueTemplate: '{value}%',
    qualityPngNote:
      'PNG is lossless, so the quality setting has no effect (files will be larger)',
    clearButton: 'Clear all',
    resultsHeading: 'Converted files',
    loading: 'Converting…',
    originalSizeLabel: 'Original',
    convertedSizeLabel: 'Converted',
    downloadButton: 'Download',
    removeButton: 'Remove',
    errorUnsupportedFile:
      'This is not a HEIC / HEIF file (choose a photo with a .heic or .heif extension)',
    errorConversionFailed:
      'Conversion failed. The file may be corrupted, or your browser may not support it.',
    errorLoadFailed:
      'Could not load the conversion engine. Check your connection and reload the page.',
    errorTooManyFilesTemplate: 'You can convert up to {max} files at a time',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose your HEIC / HEIF files (multiple files and drag & drop are supported).',
      'Pick the output format: JPEG, PNG, or WebP.',
      'For JPEG and WebP, adjust the quality (compression level).',
      'Check the before/after sizes in the results list, then download the files.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The conversion engine (about 3 MB) is loaded the first time you convert. After that, your browser cache is used.',
      'EXIF data such as the shooting date and GPS location is not carried over to the JPEG, PNG, or WebP output, so converted files also work as location-free copies for sharing.',
      'Orientation is corrected automatically. For a Live Photo, only the still image is converted.',
      'Very high-resolution photos or devices with little memory may convert slowly or fail.',
      'All processing happens in your browser — the photos you select are never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'HEIC / HEIF',
        description:
          'High Efficiency Image File Format, the default photo format on iPhone. It keeps similar quality at roughly half the size of JPEG, but some Windows apps and web services cannot open it.',
      },
      {
        term: 'Lossless / lossy compression',
        description:
          'Lossless compression (like PNG) can restore the original data exactly; lossy compression (like JPEG or WebP) discards some data to shrink the file. JPEG is usually the best fit for photos.',
      },
    ],
  },
};
