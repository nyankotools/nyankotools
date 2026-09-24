import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageResizerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{count}` を置換して使うテンプレート */
  filesSelectedTemplate: string;
  resizeModeLabel: string;
  modePxLabel: string;
  modePercentLabel: string;
  widthLabel: string;
  heightLabel: string;
  aspectLockLabel: string;
  resetButton: string;
  percentLabel: string;
  /** `{value}` を置換して使うテンプレート */
  percentValueTemplate: string;
  formatLabel: string;
  formatWebp: string;
  formatJpeg: string;
  formatPng: string;
  qualityLabel: string;
  /** `{value}` を置換して使うテンプレート */
  qualityValueTemplate: string;
  qualityPngNote: string;
  clearButton: string;
  resultsHeading: string;
  originalSizeLabel: string;
  convertedSizeLabel: string;
  /** `{width}` `{height}` `{size}` を置換して使うテンプレート */
  dimensionsSizeTemplate: string;
  /** `{percent}` を置換して使うテンプレート（増加時は負の値） */
  reductionIncreasedTemplate: string;
  /** `{percent}` を置換して使うテンプレート */
  reductionDecreasedTemplate: string;
  downloadButton: string;
  removeButton: string;
  errorUnsupportedFile: string;
  errorConversionFailed: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManyFilesTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imageResizerContent: Record<Locale, ImageResizerPageContent> = {
  ja: {
    title: '画像リサイズ・圧縮（サイズ変更＋WebP/JPEG/PNG圧縮）無料ツール',
    description:
      '画像の幅・高さをピクセルまたは％指定でリサイズし、WebP・JPEG・PNGで圧縮して書き出せる無料ツールです。複数画像の一括処理に対応し、変換前後のサイズ・ファイル容量・削減率を確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像リサイズ・圧縮',
    introHtml:
      '画像を選択し、幅・高さ（px）または拡大縮小率（%）を指定してリサイズしたうえで、WebP・JPEG・PNGとして圧縮・書き出しします。SNSやブログへのアップロード用に画像サイズを小さくしたいときに便利です。複数ファイルをまとめて処理することもできます。フォーマット変換のみでよい場合は<a href="/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像フォーマット変換</a>もご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像ファイルをドラッグ＆ドロップすることもできます（複数選択可）',
    filesSelectedTemplate: '{count}件のファイルを読み込みました',
    resizeModeLabel: 'リサイズ方法',
    modePxLabel: 'サイズ指定（px）',
    modePercentLabel: '割合指定（%）',
    widthLabel: '幅',
    heightLabel: '高さ',
    aspectLockLabel: '縦横比を固定する',
    resetButton: '元のサイズに戻す',
    percentLabel: '拡大縮小率',
    percentValueTemplate: '{value}%',
    formatLabel: '出力フォーマット',
    formatWebp: 'WebP',
    formatJpeg: 'JPEG',
    formatPng: 'PNG',
    qualityLabel: '画質（圧縮率）',
    qualityValueTemplate: '{value}%',
    qualityPngNote:
      'PNGは可逆圧縮のため画質設定は反映されません（元画像の透過情報はそのまま保持されます）',
    clearButton: 'すべてクリア',
    resultsHeading: '変換結果',
    originalSizeLabel: '変換前',
    convertedSizeLabel: '変換後',
    dimensionsSizeTemplate: '{width}×{height}px（{size}）',
    reductionIncreasedTemplate: '{percent}%増加',
    reductionDecreasedTemplate: '{percent}%削減',
    downloadButton: 'ダウンロード',
    removeButton: '削除',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ変換できます）',
    errorConversionFailed:
      '変換に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorTooManyFilesTemplate: '一度に変換できるのは{max}件までです',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    notesHeading: '注意点',
    notes: [
      '複数画像を一括処理する場合、幅または高さのどちらか一方で指定すると、画像ごとに元の縦横比を保ったままリサイズされます（縦横比の固定を解除して幅・高さを両方指定した場合は、画像ごとの縦横比を無視して同じサイズに揃えます）。',
      '拡大（100%超・元のサイズより大きい幅/高さ）も可能ですが、画質は元画像以上には戻らないため、ぼやけて見える場合があります。',
      'JPEGには透過（アルファチャンネル）情報がないため、透過部分は白色で塗りつぶされます。透過を維持したい場合はWebPまたはPNGを選んでください。',
      'WebPの書き出しに対応していないブラウザでは変換に失敗する場合があります。最新版のChrome・Firefox・Edge・Safariでの利用を推奨します。',
      'アニメーションGIFを変換すると、アニメーションは失われ最初のフレームのみが変換されます。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '縦横比（アスペクト比）',
        description:
          '画像の幅と高さの比率のこと。縦横比を固定したままリサイズすると、画像が縦や横に間延びしたり潰れたりせずに、元と同じ見た目のまま拡大・縮小できます。',
      },
      {
        term: 'WebP',
        description:
          'Googleが開発した画像フォーマットで、JPEGやPNGと比べて同程度の画質でファイルサイズを小さくできます。透過（アルファチャンネル）にも対応しており、Webページの表示速度改善によく使われます。',
      },
      {
        term: '可逆圧縮／非可逆圧縮',
        description:
          '可逆圧縮（PNGなど）は圧縮しても元のデータを完全に復元できる方式です。非可逆圧縮（JPEG・WebPなど）はデータの一部を間引くことでファイルサイズを大きく削減できますが、元の画質には戻せません。',
      },
    ],
  },
  en: {
    title: 'Image Resizer & Compressor (Resize + WebP/JPEG/PNG Compression)',
    description:
      'Free tool that resizes images by pixel dimensions or percentage, then compresses them to WebP, JPEG, or PNG. Process multiple images at once and compare dimensions, file size, and reduction before and after. Your images are processed in the browser and never sent to a server.',
    h1: 'Image Resizer & Compressor',
    introHtml:
      'Select images, choose a target width/height in pixels or a scale percentage, and resize them in your browser before compressing to WebP, JPEG, or PNG. Handy for shrinking images before uploading to social media or a blog. You can process several files at once. If you only need format conversion, try the <a href="/en/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Format Converter</a> instead.',
    dropLabel: 'Choose image files',
    dropHint: 'You can also drag and drop image files here (multiple allowed)',
    filesSelectedTemplate: 'Loaded {count} file(s)',
    resizeModeLabel: 'Resize by',
    modePxLabel: 'Pixel size',
    modePercentLabel: 'Percentage',
    widthLabel: 'Width',
    heightLabel: 'Height',
    aspectLockLabel: 'Lock aspect ratio',
    resetButton: 'Reset to original size',
    percentLabel: 'Scale',
    percentValueTemplate: '{value}%',
    formatLabel: 'Output format',
    formatWebp: 'WebP',
    formatJpeg: 'JPEG',
    formatPng: 'PNG',
    qualityLabel: 'Quality (compression level)',
    qualityValueTemplate: '{value}%',
    qualityPngNote:
      'PNG is lossless, so the quality setting has no effect (the original transparency is preserved as-is)',
    clearButton: 'Clear all',
    resultsHeading: 'Converted files',
    originalSizeLabel: 'Original',
    convertedSizeLabel: 'Converted',
    dimensionsSizeTemplate: '{width}×{height}px ({size})',
    reductionIncreasedTemplate: '{percent}% larger',
    reductionDecreasedTemplate: '{percent}% smaller',
    downloadButton: 'Download',
    removeButton: 'Remove',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP can be converted)',
    errorConversionFailed:
      'Conversion failed. The file may be corrupted, or your browser may not support this format.',
    errorTooManyFilesTemplate: 'You can convert up to {max} files at a time',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    notesHeading: 'Notes',
    notes: [
      'When processing multiple images, specifying only a width or only a height resizes each image while keeping its own aspect ratio. Unlocking the aspect ratio and setting both width and height forces every image to that exact size, ignoring its original ratio.',
      'Enlarging (scaling above 100%, or to a width/height larger than the original) is possible, but quality can never exceed the original, so results may look blurry.',
      'JPEG has no alpha channel, so transparent areas are filled with white. Use WebP or PNG if you need to keep transparency.',
      'Conversion may fail in browsers that lack WebP encoding support. Use a recent version of Chrome, Firefox, Edge, or Safari.',
      'Converting an animated GIF discards the animation and keeps only its first frame.',
      'All processing happens in your browser — the images you select are never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Aspect ratio',
        description:
          "The ratio between an image's width and height. Resizing with the aspect ratio locked keeps the image looking the same, just larger or smaller, instead of stretching or squashing it.",
      },
      {
        term: 'WebP',
        description:
          'An image format developed by Google that achieves smaller file sizes than JPEG or PNG at a similar visual quality. It also supports transparency (an alpha channel), making it popular for improving page load speed.',
      },
      {
        term: 'Lossless / lossy compression',
        description:
          'Lossless compression (like PNG) can fully restore the original data after compression. Lossy compression (like JPEG or WebP) discards some data to shrink file size significantly, but the original quality cannot be fully recovered.',
      },
    ],
  },
};
