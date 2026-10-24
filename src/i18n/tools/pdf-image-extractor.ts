import type { Locale } from '../../data/tools';

export interface PdfImageExtractorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  fileLabel: string;
  dropHint: string;
  fileHint: string;
  /** {pages} を置換 */
  pagesTemplate: string;
  rangeLabel: string;
  rangePlaceholder: string;
  rangeHint: string;
  minSizeLabel: string;
  minSizeNone: string;
  minSize32: string;
  minSize100: string;
  run: string;
  processing: string;
  clear: string;
  resultHeading: string;
  /** {count} {pages} を置換 */
  summaryTemplate: string;
  /** {max} を置換 */
  truncatedTemplate: string;
  /** {skipped} を置換 */
  skippedTemplate: string;
  noImages: string;
  zipButton: string;
  saveOne: string;
  /** {page} {w} {h} {size} を置換 */
  captionTemplate: string;
  errorNoFile: string;
  errorNotPdf: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorEmptyRange: string;
  errorBadRange: string;
  /** {pages} を置換 */
  errorOutOfRange: string;
  errorFailed: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfImageExtractorContent: Record<
  Locale,
  PdfImageExtractorPageContent
> = {
  ja: {
    title:
      'PDFから画像を抽出（PNG・ZIP一括保存）｜ブラウザで完結する無料ツール',
    description:
      'PDFに埋め込まれた画像だけを取り出してPNGで保存、ZIPで一括ダウンロードできる無料ツールです。ページ範囲指定・小さい画像の除外に対応。ファイルは外部に送信されません。',
    h1: 'PDF画像抽出（埋め込み画像をPNGで保存）',
    introHtml:
      'PDFの中に貼り込まれている写真・図版などの画像を、元のサイズのままPNGとして取り出します。ページ全体を画像にしたい場合は<a href="/tools/pdf-image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF⇔画像変換</a>をご利用ください。ファイルは端末の外に出ません。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    pagesTemplate: '{pages}ページ',
    rangeLabel: '対象ページ（空欄で全ページ）',
    rangePlaceholder: '例: 1-3, 5, 8-',
    rangeHint:
      'カンマ区切りでページ番号を指定します。「8-」は8ページ目から最後まで。',
    minSizeLabel: '小さい画像の除外',
    minSizeNone: '除外しない（すべて抽出）',
    minSize32: '短辺32px未満を除外',
    minSize100: '短辺100px未満を除外',
    run: '画像を抽出',
    processing: '抽出中…',
    clear: 'クリア',
    resultHeading: '抽出結果',
    summaryTemplate: '{pages}ページから{count}枚の画像を抽出しました。',
    truncatedTemplate:
      '画像が多いため、最初の{max}枚で処理を打ち切りました。ページ範囲を分けて実行してください。',
    skippedTemplate: '{skipped}枚は変換できなかったため除外しました。',
    noImages:
      '指定したページに抽出できる画像が見つかりませんでした。ページ全体がスキャン画像でも、形式によっては検出されない場合があります。',
    zipButton: 'ZIPで一括保存',
    saveOne: '保存',
    captionTemplate: '{page}ページ・{w}×{h}px・{size}',
    errorNoFile: 'PDFファイルを選択してください。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'パスワードで保護されたPDFは処理できません。保護を解除してからお試しください。',
    errorEmptyRange: 'ページ範囲を入力してください。',
    errorBadRange:
      'ページ範囲の形式が正しくありません。「1-3, 5, 8-」のように入力してください。',
    errorOutOfRange: '指定したページがPDFの範囲外です（全{pages}ページ）。',
    errorFailed: '処理に失敗しました。',
    notesHeading: '注意事項',
    notes: [
      '抽出できるのはPDFに画像として埋め込まれているものだけです。文字・ベクター図形（グラフや図形）は画像ではないため取り出せません。',
      '画像はPDFが保持するピクセルをそのままPNGにします。元がJPEGの画像も、このツールではPNGとして保存されるためファイルサイズが大きくなることがあります。',
      '透過（アルファ）やソフトマスクを持つ画像は、透明部分を保ったPNGになります。切り抜き・回転・拡大縮小などPDF内で加えられた表示上の加工は反映されず、埋め込まれた画像そのものを取り出します。',
      'パスワードで保護されたPDFは処理できません。スキャンPDFはページ全体が1枚の画像として入っていることが多く、その場合は1ページにつき1枚が抽出されます。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      'PDFファイルを選択します（ドラッグ＆ドロップも可）。',
      '必要に応じて、対象ページと「小さい画像の除外」（ロゴや罫線などの小さな画像を除く）を設定します。',
      '「画像を抽出」を押し、サムネイル一覧で内容を確認します。',
      '画像ごとの「保存」、または「ZIPで一括保存」でダウンロードします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '画像XObject',
        description:
          'PDFの中に1つのオブジェクトとして保存されている画像データです。ページ上では「この画像をここに描く」という命令で呼び出されます。このツールはこれを取り出します。',
      },
      {
        term: 'ソフトマスク（SMask）',
        description:
          '画像の透明度を別のグレースケール画像として持たせるPDFの仕組みです。抽出時は元画像と合成し、透過PNGとして保存します。',
      },
      {
        term: 'ラスタライズ',
        description:
          'ページ全体（文字や図形を含む）を画像に描き直すことです。画像の抽出とは異なり、埋め込み画像以外も含めてページの見た目を丸ごと画像にします。',
      },
    ],
  },
  en: {
    title: 'Extract Images from PDF (PNG/ZIP) – Free, No Upload',
    description:
      'Pull the embedded images out of a PDF and save them as PNG or one ZIP. Page range and small-image filter included. Runs in your browser; nothing is uploaded.',
    h1: 'PDF Image Extractor (Save Embedded Images as PNG)',
    introHtml:
      'Extract the photos and pictures embedded in a PDF at their original pixel size and save them as PNG. To turn whole pages into images instead, use <a href="/en/tools/pdf-image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF ⇔ Image Converter</a>. Your file never leaves your device.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick a single .pdf file.',
    pagesTemplate: '{pages} pages',
    rangeLabel: 'Pages to scan (blank = all pages)',
    rangePlaceholder: 'e.g. 1-3, 5, 8-',
    rangeHint:
      'Separate page numbers with commas. "8-" means page 8 to the end.',
    minSizeLabel: 'Skip small images',
    minSizeNone: 'Keep everything',
    minSize32: 'Skip if shorter side < 32 px',
    minSize100: 'Skip if shorter side < 100 px',
    run: 'Extract images',
    processing: 'Extracting…',
    clear: 'Clear',
    resultHeading: 'Extracted images',
    summaryTemplate: 'Extracted {count} images from {pages} pages.',
    truncatedTemplate:
      'There were too many images, so extraction stopped after the first {max}. Run it again with a narrower page range.',
    skippedTemplate:
      '{skipped} images could not be converted and were skipped.',
    noImages:
      'No extractable images were found on the selected pages. Some image formats may not be detected even in scanned PDFs.',
    zipButton: 'Save all as ZIP',
    saveOne: 'Save',
    captionTemplate: 'Page {page} · {w}×{h} px · {size}',
    errorNoFile: 'Please choose a PDF file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'Password-protected PDFs cannot be processed. Remove the protection first and try again.',
    errorEmptyRange: 'Please enter a page range.',
    errorBadRange: 'Invalid page range. Use a format like "1-3, 5, 8-".',
    errorOutOfRange:
      'The specified pages are outside the PDF (it has {pages} pages).',
    errorFailed: 'Processing failed.',
    notesHeading: 'Notes',
    notes: [
      'Only images embedded in the PDF can be extracted. Text and vector graphics (charts, shapes) are not images and cannot be pulled out.',
      'Images are saved as PNG using the pixels stored in the PDF. Images that were JPEG inside the PDF are also written as PNG here, so files can be larger than the originals.',
      'Images with transparency or a soft mask are saved as PNG with the transparency kept. Display effects applied inside the PDF (cropping, rotation, scaling) are not reflected; you get the embedded image itself.',
      'Password-protected PDFs cannot be processed. Scanned PDFs usually hold one full-page image per page, so you get one image per page.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a PDF file (drag and drop works too).',
      'If needed, set the pages and "Skip small images" (to drop logos, rules and other tiny pictures).',
      'Press "Extract images" and check the thumbnails.',
      'Download each image with "Save", or everything at once with "Save all as ZIP".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Image XObject',
        description:
          'An image stored as a single object inside the PDF. A page draws it with a "paint this image here" instruction. This tool pulls these out.',
      },
      {
        term: 'Soft mask (SMask)',
        description:
          "A PDF mechanism that stores an image's transparency as a separate grayscale image. On extraction it is combined with the picture and saved as a transparent PNG.",
      },
      {
        term: 'Rasterizing',
        description:
          'Redrawing a whole page, including text and shapes, as an image. Unlike extraction, it captures everything on the page, not just the embedded pictures.',
      },
    ],
  },
};
