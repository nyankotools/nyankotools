import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{count}` を置換して使うテンプレート */
  filesSelectedTemplate: string;
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

export const imageConverterContent: Record<Locale, ImageConverterPageContent> =
  {
    ja: {
      title:
        '画像フォーマット変換（PNG/JPEG/GIF/BMP → WebP・JPEG・PNG）無料ツール',
      description:
        'PNG・JPEG・GIF・BMP画像をWebP・JPEG・PNGに変換し、品質を指定して圧縮できる無料ツールです。複数画像の一括変換に対応し、変換前後のファイルサイズと削減率も確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '画像フォーマット変換（→ WebP / JPEG / PNG）',
      introHtml:
        'PNG・JPEG・GIF・BMP画像を選択すると、指定した形式・品質でブラウザ内で変換します。WebPへの変換は同程度の画質でファイルサイズを大きく削減できるため、Webサイトの表示速度改善に便利です。複数ファイルをまとめて変換することもできます。サイズ変更もあわせて行いたい場合は<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a>もご利用ください。',
      dropLabel: '画像ファイルを選択',
      dropHint:
        'ここに画像ファイルをドラッグ＆ドロップすることもできます（複数選択可）',
      filesSelectedTemplate: '{count}件のファイルを読み込みました',
      formatLabel: '変換先フォーマット',
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
        'JPEGには透過（アルファチャンネル）情報がないため、透過部分は白色で塗りつぶされます。透過を維持したい場合はWebPまたはPNGを選んでください。',
        'WebPの書き出しに対応していないブラウザでは変換に失敗する場合があります。最新版のChrome・Firefox・Edge・Safariでの利用を推奨します。',
        '画質（圧縮率）はWebP・JPEGのみ有効です。PNGは可逆圧縮のため常に元画像と同じ画質で出力されます。',
        'アニメーションGIFを変換すると、アニメーションは失われ最初のフレームのみが変換されます。',
        'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
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
        {
          term: 'アルファチャンネル（透過）',
          description:
            '画像の各ピクセルに、色情報とは別に「透明度」の情報を持たせる仕組みです。PNGやWebPは対応していますが、JPEGは対応していないため、JPEGに変換すると透明部分は不透明な色（このツールでは白）になります。',
        },
      ],
    },
    en: {
      title: 'Image Format Converter (PNG/JPEG/GIF/BMP to WebP, JPEG, PNG)',
      description:
        'Free tool that converts PNG, JPEG, GIF, and BMP images to WebP, JPEG, or PNG with an adjustable quality/compression level. Convert multiple images at once and compare file size before and after. Your images are processed in the browser and never sent to a server.',
      h1: 'Image Format Converter (to WebP / JPEG / PNG)',
      introHtml:
        'Select PNG, JPEG, GIF, or BMP images to convert them in your browser to the format and quality you choose. Converting to WebP usually cuts file size significantly at a similar visual quality, which helps page load speed. You can convert several files at once. Need to resize as well? Try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer & Compressor</a>.',
      dropLabel: 'Choose image files',
      dropHint:
        'You can also drag and drop image files here (multiple allowed)',
      filesSelectedTemplate: 'Loaded {count} file(s)',
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
        'JPEG has no alpha channel, so transparent areas are filled with white. Use WebP or PNG if you need to keep transparency.',
        'Conversion may fail in browsers that lack WebP encoding support. Use a recent version of Chrome, Firefox, Edge, or Safari.',
        'The quality setting only affects WebP and JPEG. PNG is lossless and is always exported at the same quality as the original.',
        'Converting an animated GIF discards the animation and keeps only its first frame.',
        'All processing happens in your browser — the images you select are never sent to a server.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
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
        {
          term: 'Alpha channel (transparency)',
          description:
            'A per-pixel value stored alongside color data to represent transparency. PNG and WebP support it, but JPEG does not — converting to JPEG replaces transparent areas with an opaque color (white, in this tool).',
        },
      ],
    },
  };
