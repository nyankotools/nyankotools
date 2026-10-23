import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageCompressToSizePageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{count}` を置換して使うテンプレート */
  filesSelectedTemplate: string;
  targetLabel: string;
  unitLabel: string;
  formatLabel: string;
  formatJpeg: string;
  formatWebp: string;
  resizeLabel: string;
  clearButton: string;
  resultsHeading: string;
  originalSizeLabel: string;
  compressedSizeLabel: string;
  /** `{quality}` `{scale}` を置換して使うテンプレート */
  settingsTemplate: string;
  /** `{scale}` を置換して使うテンプレート */
  settingsResizedTemplate: string;
  /** `{percent}` を置換して使うテンプレート */
  reductionDecreasedTemplate: string;
  /** `{percent}` を置換して使うテンプレート */
  reductionIncreasedTemplate: string;
  processingText: string;
  downloadButton: string;
  removeButton: string;
  errorInvalidTarget: string;
  errorUnsupportedFile: string;
  errorConversionFailed: string;
  /** `{size}` を置換して使うテンプレート（届かなかった場合の最小サイズ） */
  errorUnreachableTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManyFilesTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imageCompressToSizeContent: Record<
  Locale,
  ImageCompressToSizePageContent
> = {
  ja: {
    title: '画像を指定サイズ以下に圧縮（200KB以下など）',
    description:
      '画像のファイルサイズを「200KB以下」など目標容量に合わせて自動圧縮する無料ツールです。JPEG・WebPの品質を二分探索で自動調整し、複数画像にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像を指定サイズ以下に圧縮',
    introHtml:
      '目標のファイルサイズ（例: 200KB）を指定すると、その容量に収まる最大の画質をブラウザ内で自動的に探して圧縮します。応募フォームやアップロード制限のある画像提出に便利です。画質や寸法を自分で指定したい場合は<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a>をご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像ファイルをドラッグ＆ドロップすることもできます（複数選択可）',
    filesSelectedTemplate: '{count}件のファイルを読み込みました',
    targetLabel: '目標ファイルサイズ',
    unitLabel: '単位',
    formatLabel: '出力形式',
    formatJpeg: 'JPEG',
    formatWebp: 'WebP',
    resizeLabel: '画質を下げても届かない場合は画像サイズも縮小する',
    clearButton: 'すべてクリア',
    resultsHeading: '圧縮結果',
    originalSizeLabel: '圧縮前',
    compressedSizeLabel: '圧縮後',
    settingsTemplate: '画質 {quality}%',
    settingsResizedTemplate: '画質 {quality}%・{scale}%に縮小',
    reductionDecreasedTemplate: '{percent}%削減',
    reductionIncreasedTemplate: '{percent}%増加',
    processingText: '圧縮中…',
    downloadButton: 'ダウンロード',
    removeButton: '削除',
    errorInvalidTarget:
      '目標ファイルサイズには0より大きい数値を入力してください',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ対応）',
    errorConversionFailed:
      '圧縮に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorUnreachableTemplate:
      '目標サイズに届きませんでした（最小でも {size}）。目標を大きくするか、画像サイズの縮小を許可してください。',
    errorTooManyFilesTemplate: '一度に処理できるのは{max}件までです',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    notesHeading: '注意点',
    notes: [
      '目標サイズは 1KB = 1024バイトで計算します。アップロード先がKB=1000バイトで判定する場合は、少し小さめの値を指定してください。',
      '圧縮はJPEGまたはWebPの非可逆圧縮です。PNGの透過部分は、JPEGでは白で塗りつぶされます。透過を残したい場合はWebPを選んでください。',
      '画質を最低まで下げても目標に届かない場合のみ、「画質を下げても届かない場合は画像サイズも縮小する」がオンなら縦横の比率を保ったまま段階的に縮小します。オフの場合は届かなかった旨を表示します。',
      '元の画像が目標サイズより小さい場合でも、再エンコードにより出力が元より大きくなることがあります。その場合は元の画像をそのままお使いください。',
      'アニメーションGIFは最初のフレームのみが出力されます。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを選択します（複数選択やドラッグ＆ドロップも可能です）。',
      '「目標ファイルサイズ」と単位（KB・MB）を入力します。',
      '「出力形式」（JPEG・WebP）を選び、必要なら画像サイズの縮小を許可します。',
      '結果の一覧で圧縮後のサイズを確認してダウンロードします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '二分探索',
        description:
          '範囲の中央を試して「収まる／収まらない」で範囲を半分に絞っていく探索方法です。このツールでは画質（1〜100）を数回〜十回ほど試すだけで、目標サイズに収まる最大の画質を見つけます。',
      },
      {
        term: '非可逆圧縮',
        description:
          'データの一部を間引くことでファイルサイズを小さくする方式です。JPEGやWebPが該当し、画質を下げるほど小さくなりますが、元の画質には戻せません。',
      },
    ],
  },
  en: {
    title: 'Compress Image to Target Size (e.g. Under 200KB)',
    description:
      'Compress an image to under a target file size such as 200KB. JPEG or WebP quality is found automatically. Runs in your browser; nothing is uploaded.',
    h1: 'Compress Image to a Target File Size',
    introHtml:
      'Enter the file size you need (for example 200KB) and this tool searches for the highest quality that still fits, right in your browser. It is handy for upload forms with a size limit. If you would rather set quality or dimensions yourself, use the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer & Compressor</a>.',
    dropLabel: 'Choose image files',
    dropHint: 'You can also drag and drop image files here (multiple allowed)',
    filesSelectedTemplate: 'Loaded {count} file(s)',
    targetLabel: 'Target file size',
    unitLabel: 'Unit',
    formatLabel: 'Output format',
    formatJpeg: 'JPEG',
    formatWebp: 'WebP',
    resizeLabel: 'Also shrink the image if lowest quality is not enough',
    clearButton: 'Clear all',
    resultsHeading: 'Compressed files',
    originalSizeLabel: 'Original',
    compressedSizeLabel: 'Compressed',
    settingsTemplate: 'Quality {quality}%',
    settingsResizedTemplate: 'Quality {quality}%, scaled to {scale}%',
    reductionDecreasedTemplate: '{percent}% smaller',
    reductionIncreasedTemplate: '{percent}% larger',
    processingText: 'Compressing...',
    downloadButton: 'Download',
    removeButton: 'Remove',
    errorInvalidTarget: 'Enter a target file size greater than 0',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP are supported)',
    errorConversionFailed:
      'Compression failed. The file may be corrupted, or your browser may not support this format.',
    errorUnreachableTemplate:
      'Could not reach the target size (smallest result: {size}). Raise the target or allow shrinking the image.',
    errorTooManyFilesTemplate: 'You can process up to {max} files at a time',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    notesHeading: 'Notes',
    notes: [
      'The target is calculated with 1KB = 1024 bytes. If the site you upload to counts 1KB as 1000 bytes, enter a slightly smaller value.',
      'Compression is lossy (JPEG or WebP). Transparent areas become white in JPEG; choose WebP if you need to keep transparency.',
      'Only when even the lowest quality is too big and "Also shrink the image if lowest quality is not enough" is on, the image is scaled down step by step with its aspect ratio kept. If it is off, the tool reports that the target was not reached.',
      'If the original is already smaller than the target, re-encoding can still make it larger. In that case, keep using the original.',
      'Animated GIFs output only their first frame.',
      'All processing happens in your browser — the images you select are never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose your image files (multiple files and drag & drop are supported).',
      'Enter the "Target file size" and its unit (KB or MB).',
      'Pick the "Output format" (JPEG or WebP) and, if needed, allow shrinking the image.',
      'Check the compressed size in the results list, then download the files.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Binary search',
        description:
          'A search that tries the middle of a range and halves the range depending on whether the result fits. Here it finds the highest quality (1-100) under your size limit in about ten encodes or fewer.',
      },
      {
        term: 'Lossy compression',
        description:
          'A method that shrinks files by discarding some data. JPEG and WebP are lossy: lower quality means a smaller file, but the original quality cannot be restored.',
      },
    ],
  },
};
