import type { Locale } from '../../data/tools';

export interface PdfImageConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeToImage: string;
  modeToPdf: string;
  pdfFileLabel: string;
  pdfFileHint: string;
  pdfDropHint: string;
  imageFileLabel: string;
  imageFileHint: string;
  imageDropHint: string;
  /** {pages} を置換 */
  pagesTemplate: string;
  formatLabel: string;
  scaleLabel: string;
  scale1: string;
  scale2: string;
  scale3: string;
  qualityLabel: string;
  rangeLabel: string;
  rangePlaceholder: string;
  rangeHint: string;
  pageSizeLabel: string;
  pageSizeFit: string;
  pageSizeA4: string;
  moveUp: string;
  moveDown: string;
  remove: string;
  run: string;
  processing: string;
  clear: string;
  resultHeading: string;
  /** {name} を置換 */
  downloadTemplate: string;
  errorNoFile: string;
  errorNotPdf: string;
  errorNotImage: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorEmptyRange: string;
  errorBadRange: string;
  /** {pages} を置換 */
  errorOutOfRange: string;
  errorBadImage: string;
  errorFailed: string;
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfImageConverterContent: Record<
  Locale,
  PdfImageConverterPageContent
> = {
  ja: {
    title: 'PDF⇔画像変換（PNG/JPEG）｜ブラウザで完結する無料ツール',
    description:
      'PDFの各ページをPNG・JPEG画像に変換、または複数の画像を1つのPDFにまとめられる無料ツールです。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDF⇔画像変換（PNG/JPEG）',
    introHtml:
      'PDFをページごとの画像に、または画像をPDFに変換できます。ファイルは端末の外に出ません。ページの結合・分割は<a href="/tools/pdf-merge-split/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF結合・分割・ページ抽出</a>をご利用ください。',
    modeLabel: '変換方向',
    modeToImage: 'PDF → 画像',
    modeToPdf: '画像 → PDF',
    pdfFileLabel: 'PDFファイルを選択',
    pdfDropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    imageDropHint:
      'ここに画像ファイルをドラッグ＆ドロップすることもできます（複数可）',
    pdfFileHint: '.pdfファイルを1つ選んでください。',
    imageFileLabel: '画像ファイルを選択（複数可）',
    imageFileHint:
      'PNG・JPEG・WebP・GIFなどの画像を選べます。選んだ順に1枚1ページで並び、追加選択もできます。',
    pagesTemplate: '{pages}ページ',
    formatLabel: '出力形式',
    scaleLabel: '解像度',
    scale1: '標準（72dpi）',
    scale2: '高（144dpi）',
    scale3: '最高（216dpi）',
    qualityLabel: 'JPEG品質',
    rangeLabel: '変換するページ（空欄で全ページ）',
    rangePlaceholder: '例: 1-3, 5, 8-',
    rangeHint:
      'カンマ区切りでページ番号を指定します。「8-」は8ページ目から最後まで。',
    pageSizeLabel: 'ページサイズ',
    pageSizeFit: '画像サイズに合わせる',
    pageSizeA4: 'A4（余白付きで中央に配置）',
    moveUp: '上へ',
    moveDown: '下へ',
    remove: '削除',
    run: '変換',
    processing: '変換中…',
    clear: 'クリア',
    resultHeading: '結果',
    downloadTemplate: '{name} をダウンロード',
    errorNoFile: 'ファイルを選択してください。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorNotImage: '画像ファイルを選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'パスワードで保護されたPDFは処理できません。保護を解除してからお試しください。',
    errorEmptyRange: 'ページ範囲を入力してください。',
    errorBadRange:
      'ページ範囲の形式が正しくありません。「1-3, 5, 8-」のように入力してください。',
    errorOutOfRange: '指定したページがPDFの範囲外です（全{pages}ページ）。',
    errorBadImage:
      '画像を読み込めませんでした。ファイルが破損している可能性があります。',
    errorFailed: '処理に失敗しました。',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'dpi（解像度）',
        description:
          '1インチあたりの画素数です。PDFのページは72dpiを基準に画像化されるため、倍率を上げるほど文字が細部まで鮮明になる一方、ファイルサイズも大きくなります。',
      },
      {
        term: 'PNGとJPEG',
        description:
          'PNGは劣化のない可逆圧縮で文字や図表向き、JPEGは写真向きの非可逆圧縮でファイルサイズを小さくできます。',
      },
      {
        term: '暗号化（パスワード保護）PDF',
        description:
          '開くためにパスワードが必要なPDFです。このツールではパスワード保護されたPDFは扱えません。',
      },
    ],
  },
  en: {
    title: 'PDF to Image & Image to PDF Converter – Free, No Upload',
    description:
      'A free online tool to convert each PDF page to PNG or JPEG, or combine several images into one PDF. Your files are processed in the browser and never uploaded to a server.',
    h1: 'PDF ⇔ Image Converter (PNG/JPEG)',
    introHtml:
      'Turn a PDF into one image per page, or turn images into a PDF. Your files never leave your device. To merge or split PDF pages, use the <a href="/en/tools/pdf-merge-split/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Merge, Split & Extract</a> tool.',
    modeLabel: 'Direction',
    modeToImage: 'PDF → Images',
    modeToPdf: 'Images → PDF',
    pdfFileLabel: 'Choose a PDF file',
    pdfDropHint: 'You can also drag and drop a PDF file here',
    imageDropHint:
      'You can also drag and drop image files here (multiple allowed)',
    pdfFileHint: 'Pick a single .pdf file.',
    imageFileLabel: 'Choose image files (multiple allowed)',
    imageFileHint:
      'PNG, JPEG, WebP, GIF and similar images work. Each becomes one page in the order chosen, and you can add more later.',
    pagesTemplate: '{pages} pages',
    formatLabel: 'Output format',
    scaleLabel: 'Resolution',
    scale1: 'Standard (72 dpi)',
    scale2: 'High (144 dpi)',
    scale3: 'Highest (216 dpi)',
    qualityLabel: 'JPEG quality',
    rangeLabel: 'Pages to convert (blank = all pages)',
    rangePlaceholder: 'e.g. 1-3, 5, 8-',
    rangeHint:
      'Separate page numbers with commas. "8-" means page 8 to the end.',
    pageSizeLabel: 'Page size',
    pageSizeFit: 'Match image size',
    pageSizeA4: 'A4 (centered with margins)',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Remove',
    run: 'Convert',
    processing: 'Converting…',
    clear: 'Clear',
    resultHeading: 'Result',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorNotImage: 'Please choose image files.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'Password-protected PDFs cannot be processed. Remove the protection first and try again.',
    errorEmptyRange: 'Please enter a page range.',
    errorBadRange: 'Invalid page range. Use a format like "1-3, 5, 8-".',
    errorOutOfRange:
      'The specified pages are outside the PDF (it has {pages} pages).',
    errorBadImage: 'Could not read an image. The file may be corrupted.',
    errorFailed: 'Processing failed.',
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'dpi (resolution)',
        description:
          'Dots per inch. PDF pages are rasterized relative to 72 dpi, so a higher setting gives sharper text but a larger file.',
      },
      {
        term: 'PNG vs JPEG',
        description:
          'PNG is lossless and suits text and diagrams. JPEG is lossy and suits photos, producing smaller files.',
      },
      {
        term: 'Encrypted (password-protected) PDF',
        description:
          'A PDF that requires a password to open. This tool cannot process password-protected PDFs.',
      },
    ],
  },
};
