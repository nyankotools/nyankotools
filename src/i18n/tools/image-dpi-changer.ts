import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageDpiChangerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  fileLabel: string;
  fileHint: string;
  /** `{format}` `{width}` `{height}` を置換 */
  fileInfoTemplate: string;
  /** `{dpi}` を置換 */
  currentDpiTemplate: string;
  currentDpiNone: string;
  /** `{x}` `{y}` を置換（縦横でDPIが異なる場合） */
  currentDpiDifferentTemplate: string;
  dpiLabel: string;
  dpiHint: string;
  presetsLabel: string;
  /** `{w}` `{h}` を置換（mm） */
  printSizeTemplate: string;
  printSizeHeading: string;
  paperHeading: string;
  paperHint: string;
  paperColName: string;
  paperColMm: string;
  paperColDpi: string;
  paperColFit: string;
  paperFitYes: string;
  paperFitNo: string;
  downloadButton: string;
  downloaded: string;
  clearButton: string;
  errorUnsupported: string;
  errorCorrupt: string;
  errorInvalidDpi: string;
  errorTooLarge: string;
  errorReadFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const link =
  'class="text-blue-700 underline hover:no-underline dark:text-blue-400"';

export const imageDpiChangerContent: Record<
  Locale,
  ImageDpiChangerPageContent
> = {
  ja: {
    title: '画像のDPI変更ツール｜PNG・JPEGのDPIを再圧縮なしで書き換え',
    description:
      'PNG・JPEG画像のDPI（解像度）を再エンコードなしで書き換え、ピクセル数に対する印刷サイズ(mm)とA判・B判用紙への収まりを確認できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像のDPI変更・印刷サイズ(mm)換算',
    introHtml: `PNGやJPEGに埋め込まれたDPI情報（PNGのpHYs、JPEGのJFIF）だけを書き換えます。画素データには触れないので、画質は劣化せずピクセル数も変わりません。変更後のDPIで何mmに印刷されるか、A4・B5などに収まるかも一覧で確認できます。ピクセル数そのものを変えたい場合は<a href="/tools/image-resizer/" ${link}>画像リサイズ</a>、用紙サイズとpxの換算は<a href="/tools/print-size-converter/" ${link}>印刷サイズ換算ツール</a>をご利用ください。`,
    howToHeading: '使い方',
    howToSteps: [
      '「画像ファイルを選択」でPNGまたはJPEGを選ぶ（ドラッグ＆ドロップも可）',
      '現在のDPIとピクセル数、印刷サイズ(mm)が表示される',
      '「新しいDPI」に値を入力するか、プリセットを選ぶ。印刷サイズと用紙への収まりが更新される',
      '「DPIを書き換えてダウンロード」で保存する',
    ],
    fileLabel: '画像ファイルを選択',
    fileHint:
      'PNG・JPEG に対応しています。ここにファイルをドラッグ＆ドロップすることもできます',
    fileInfoTemplate: '{format}・{width}×{height}px',
    currentDpiTemplate: '現在のDPI: {dpi}',
    currentDpiNone: '現在のDPI: 未設定',
    currentDpiDifferentTemplate: '現在のDPI: 横{x} / 縦{y}',
    dpiLabel: '新しいDPI',
    dpiHint: '1〜65535の整数。印刷用は300dpi、Web用は72〜96dpiが目安です。',
    presetsLabel: 'プリセット',
    printSizeHeading: '印刷サイズ',
    printSizeTemplate: '{w} × {h} mm',
    paperHeading: '用紙への収まり',
    paperHint:
      '画像の向きは自動で合わせます。「必要DPI」は、画像が用紙からはみ出さない最小のDPIです。',
    paperColName: '用紙',
    paperColMm: 'サイズ（mm）',
    paperColDpi: '必要DPI',
    paperColFit: '現在のDPIで',
    paperFitYes: '収まる',
    paperFitNo: 'はみ出す',
    downloadButton: 'DPIを書き換えてダウンロード',
    downloaded: 'ダウンロードしました',
    clearButton: 'クリア',
    errorUnsupported:
      'PNGまたはJPEGの画像を選んでください。GIF・WebPなどはDPI情報を書き換えられません。',
    errorCorrupt:
      '画像の構造を読み取れませんでした。ファイルが壊れている可能性があります。',
    errorInvalidDpi: 'DPIは1〜65535の整数で指定してください',
    errorTooLarge: 'ファイルサイズが上限（100MB）を超えています',
    errorReadFailed: 'ファイルの読み込みに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '画素データは再エンコードせず、メタデータだけを書き換えます。ピクセル数・画質・色は元のままで、DPIを変えても画像は拡大縮小されません。',
      'DPIはあくまで印刷時の1インチあたりのピクセル数の指定です。低解像度の画像のDPIを上げても、画質が良くなるわけではありません。',
      'JPEGでJFIF情報が無い場合（Exifのみの写真など）は、先頭にJFIFのAPP0を追加してDPIを記録します。Exif内の解像度タグは変更しないため、一部のソフトは古いExifの値を表示することがあります。',
      'PNG・JPEG以外（GIF・WebP・BMPなど）は書き換えできません。形式を変えたい場合は画像フォーマット変換をご利用ください。',
      'アプリや印刷ソフトによっては、埋め込みDPIを無視してピクセル数から独自に判断するものがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'DPI',
        description:
          '1インチ（25.4mm）あたりのドット数。画像に埋め込まれたDPIは、印刷や配置時の既定サイズを決めるための目安で、ピクセル数自体は変わりません。',
      },
      {
        term: 'pHYs（PNG）',
        description:
          'PNGの物理ピクセル寸法を表すチャンク。1メートルあたりのピクセル数で保存されるため、300dpiは11811ピクセル/メートル（約299.9994dpi）になります。',
      },
      {
        term: 'JFIF（JPEG）',
        description:
          'JPEGの先頭に置かれるAPP0セグメント。解像度の単位（dpi・dpcm・アスペクト比のみ）と縦横の密度を2バイトずつ保持します。',
      },
    ],
  },
  en: {
    title: 'Image DPI Changer | Edit PNG & JPEG DPI Online',
    description:
      'Change the DPI of a PNG or JPEG without re-encoding and see the print size in mm and A/B paper fit. Runs in your browser; nothing is uploaded.',
    h1: 'Image DPI Changer with Print Size (mm) Preview',
    introHtml: `Rewrite only the DPI metadata stored in a PNG (pHYs chunk) or JPEG (JFIF header). The pixel data is never touched, so there is no quality loss and the pixel dimensions stay the same. You also get the print size in mm at the new DPI and whether the image fits A4, B5 and other paper sizes. To change the pixel dimensions themselves, use the <a href="/en/tools/image-resizer/" ${link}>Image Resizer</a>; for paper size and pixel math, see the <a href="/en/tools/print-size-converter/" ${link}>Print Size Converter</a>.`,
    howToHeading: 'How to use',
    howToSteps: [
      'Pick a PNG or JPEG with "Choose an image file" (drag and drop also works)',
      'The current DPI, pixel size and print size in mm are shown',
      'Enter a value in "New DPI" or pick a preset; the print size and paper fit update',
      'Click "Rewrite DPI and download" to save the file',
    ],
    fileLabel: 'Choose an image file',
    fileHint:
      'PNG and JPEG are supported. You can also drag and drop a file here',
    fileInfoTemplate: '{format}, {width} x {height} px',
    currentDpiTemplate: 'Current DPI: {dpi}',
    currentDpiNone: 'Current DPI: not set',
    currentDpiDifferentTemplate: 'Current DPI: {x} horizontal / {y} vertical',
    dpiLabel: 'New DPI',
    dpiHint:
      'A whole number from 1 to 65535. 300 dpi is typical for print and 72-96 dpi for screens.',
    presetsLabel: 'Presets',
    printSizeHeading: 'Print size',
    printSizeTemplate: '{w} x {h} mm',
    paperHeading: 'Paper fit',
    paperHint:
      'The image orientation is matched automatically. "Min. DPI" is the lowest DPI at which the image does not overflow the paper.',
    paperColName: 'Paper',
    paperColMm: 'Size (mm)',
    paperColDpi: 'Min. DPI',
    paperColFit: 'At this DPI',
    paperFitYes: 'Fits',
    paperFitNo: 'Too large',
    downloadButton: 'Rewrite DPI and download',
    downloaded: 'Downloaded',
    clearButton: 'Clear',
    errorUnsupported:
      'Please choose a PNG or JPEG image. DPI metadata in GIF, WebP and other formats cannot be rewritten here.',
    errorCorrupt: "Couldn't read the image structure. The file may be damaged.",
    errorInvalidDpi: 'DPI must be a whole number from 1 to 65535',
    errorTooLarge: 'This file exceeds the size limit (100 MB)',
    errorReadFailed: 'Failed to read the file',
    notesHeading: 'Notes',
    notes: [
      'Only the metadata is rewritten; the pixel data is not re-encoded. Pixel size, quality and colors stay as they were, and the image is not scaled when you change the DPI.',
      'DPI only says how many pixels per inch to use when printing. Raising it on a low-resolution image does not add detail.',
      'If a JPEG has no JFIF header (for example a photo with only Exif), a JFIF APP0 segment is added at the start to store the DPI. The resolution tags inside Exif are left unchanged, so some software may still show the old Exif value.',
      'Formats other than PNG and JPEG (GIF, WebP, BMP and so on) cannot be rewritten. Use the image format converter if you need to change the format.',
      'Some apps and print software ignore the embedded DPI and decide the size from the pixel count alone.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'DPI',
        description:
          'Dots per inch (25.4 mm). The DPI stored in an image is a hint for the default print or layout size; it does not change the pixel count.',
      },
      {
        term: 'pHYs (PNG)',
        description:
          'The PNG chunk that stores the physical pixel dimensions. It is saved as pixels per meter, so 300 dpi becomes 11811 pixels/meter (about 299.9994 dpi).',
      },
      {
        term: 'JFIF (JPEG)',
        description:
          'The APP0 segment at the start of a JPEG. It holds the density unit (dpi, dpcm or aspect ratio only) and the horizontal and vertical density as two bytes each.',
      },
    ],
  },
};
