import type { Locale } from '../../data/tools';
import type { PageNumberPosition } from '../../lib/tools/pdf-page-number-watermark';

export interface PdfPageNumberWatermarkPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  fileLabel: string;
  dropHint: string;
  fileHint: string;
  /** {pages} を置換 */
  infoTemplate: string;
  pageNumberEnable: string;
  positionLabel: string;
  positions: Record<PageNumberPosition, string>;
  templateLabel: string;
  templateHint: string;
  startLabel: string;
  skipFirstLabel: string;
  fontSizeLabel: string;
  marginLabel: string;
  numberColorLabel: string;
  watermarkEnable: string;
  watermarkTextLabel: string;
  watermarkTextPlaceholder: string;
  watermarkColorLabel: string;
  widthLabel: string;
  opacityLabel: string;
  angleLabel: string;
  tiledLabel: string;
  run: string;
  processing: string;
  clear: string;
  resultHeading: string;
  /** {name} を置換 */
  downloadTemplate: string;
  errorNoFile: string;
  errorNotPdf: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorNoOperation: string;
  errorNoWatermarkText: string;
  errorBadOption: string;
  errorUnsupportedChar: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfPageNumberWatermarkContent: Record<
  Locale,
  PdfPageNumberWatermarkPageContent
> = {
  ja: {
    title: 'PDFにページ番号・透かしを追加｜ブラウザで完結する無料ツール',
    description:
      'PDFの各ページにページ番号（1 / 10 など）や「社外秘」「DRAFT」などの透かし文字を追加できる無料ツールです。位置・サイズ・濃さ・角度を指定可能。PDFはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDFにページ番号・透かしを追加',
    introHtml:
      'PDFの全ページにページ番号を振ったり、社外秘・DRAFTなどの透かし文字を重ねたりして、新しいPDFとして保存できます。位置・大きさ・濃さ・角度を指定でき、透かしは日本語にも対応。ファイルは端末の外に出ません。ページの並び替えや削除は<a href="/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDFページ回転・削除・並び替え</a>をご利用ください。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    infoTemplate: '{pages}ページ',
    pageNumberEnable: 'ページ番号を入れる',
    positionLabel: '位置',
    positions: {
      'bottom-center': '下・中央',
      'bottom-left': '下・左',
      'bottom-right': '下・右',
      'top-center': '上・中央',
      'top-left': '上・左',
      'top-right': '上・右',
    },
    templateLabel: '表示形式',
    templateHint:
      '{n} が番号、{total} が総ページ数になります（例: {n} / {total} → 1 / 10）。半角の英数字・記号のみ使えます。',
    startLabel: '開始番号',
    skipFirstLabel: '1ページ目には入れない（2ページ目を開始番号にする）',
    fontSizeLabel: '文字サイズ（pt）',
    marginLabel: '端からの余白（pt）',
    numberColorLabel: '文字色',
    watermarkEnable: '透かしを入れる',
    watermarkTextLabel: '透かし文字',
    watermarkTextPlaceholder: '例: 社外秘 / DRAFT',
    watermarkColorLabel: '透かしの色',
    widthLabel: '透かしの大きさ（ページ幅に対する割合 %）',
    opacityLabel: '濃さ（%、小さいほど薄い）',
    angleLabel: '角度（度、反時計回り）',
    tiledLabel: 'ページ全体に敷き詰める',
    run: '実行',
    processing: '処理中…',
    clear: 'クリア',
    resultHeading: '結果',
    downloadTemplate: '{name} をダウンロード',
    errorNoFile: 'PDFファイルを選択してください。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'このPDFはパスワードで保護されています。先に「PDFページ回転・削除・並び替え」でパスワードを解除してください。',
    errorNoOperation:
      '「ページ番号を入れる」か「透かしを入れる」のどちらかを選んでください。',
    errorNoWatermarkText: '透かし文字を入力してください。',
    errorBadOption:
      '設定値が範囲外です。開始番号・文字サイズ・余白・大きさ・濃さ・角度を確認してください。',
    errorUnsupportedChar:
      '表示形式には半角の英数字・記号のみ使えます（日本語は使えません）。',
    errorFailed: '処理に失敗しました。',
    howToHeading: '使い方',
    howToSteps: [
      'PDFファイルを選択します。',
      '「ページ番号を入れる」「透かしを入れる」のうち使うものにチェックを入れ、位置・大きさ・濃さなどを設定します。',
      '「実行」を押すと、新しいPDFが作られます。',
      '結果に表示されたファイルをダウンロードします。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ページ番号の表示形式は、標準フォントで描ける半角の英数字・記号のみです。日本語の文字は入れられません。',
      '透かしの文字は画像として貼り付けるため、PDF上で文字として選択・検索はできません。日本語の字形はお使いの端末のフォントで描かれます。',
      '「実行」を押しても元のファイルは変更されず、ページ番号・透かしを加えた新しいPDFが作られます。取り消すには元のファイルを使ってください。',
      'パスワードで保護されたPDFは扱えません。先に解除してからご利用ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '透かし（ウォーターマーク）',
        description:
          'ページの背景や上に薄く重ねる文字や画像です。「社外秘」「DRAFT」「見本」など、資料の扱いや状態を示すために使います。',
      },
      {
        term: 'pt（ポイント）',
        description:
          'PDFの長さの単位で、1ptは約0.35mmです。A4の用紙は約595×842ptです。',
      },
    ],
  },
  en: {
    title: 'Add Page Numbers & Watermark to PDF – Free, No Upload',
    description:
      'Add page numbers and watermark text such as CONFIDENTIAL or DRAFT to every PDF page. Choose position, size and opacity. Runs in your browser; no upload.',
    h1: 'Add Page Numbers & Watermark to PDF',
    introHtml:
      'Number every page of a PDF and overlay watermark text such as CONFIDENTIAL or DRAFT, then save a new file. Pick the position, size, opacity and angle; the watermark also works with non-Latin text. Your file never leaves your device. To reorder or delete pages first, use the <a href="/en/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Page Editor</a>.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick one .pdf file.',
    infoTemplate: '{pages}-page PDF',
    pageNumberEnable: 'Add page numbers',
    positionLabel: 'Position',
    positions: {
      'bottom-center': 'Bottom center',
      'bottom-left': 'Bottom left',
      'bottom-right': 'Bottom right',
      'top-center': 'Top center',
      'top-left': 'Top left',
      'top-right': 'Top right',
    },
    templateLabel: 'Format',
    templateHint:
      '{n} is the page number and {total} the page count (e.g. {n} / {total} gives 1 / 10). Only ASCII letters, digits and symbols are allowed.',
    startLabel: 'Starting number',
    skipFirstLabel: 'Skip the first page (page 2 gets the starting number)',
    fontSizeLabel: 'Font size (pt)',
    marginLabel: 'Margin from the edge (pt)',
    numberColorLabel: 'Text color',
    watermarkEnable: 'Add a watermark',
    watermarkTextLabel: 'Watermark text',
    watermarkTextPlaceholder: 'e.g. CONFIDENTIAL / DRAFT',
    watermarkColorLabel: 'Watermark color',
    widthLabel: 'Watermark size (% of page width)',
    opacityLabel: 'Opacity (%, lower is fainter)',
    angleLabel: 'Angle (degrees, counter-clockwise)',
    tiledLabel: 'Tile across the whole page',
    run: 'Run',
    processing: 'Processing…',
    clear: 'Clear',
    resultHeading: 'Result',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'This PDF is password-protected. Unlock it first with the PDF Page Editor.',
    errorNoOperation:
      'Turn on "Add page numbers" or "Add a watermark" (or both).',
    errorNoWatermarkText: 'Please enter the watermark text.',
    errorBadOption:
      'A setting is out of range. Check the starting number, font size, margin, size, opacity and angle.',
    errorUnsupportedChar:
      'The format can only contain ASCII letters, digits and symbols.',
    errorFailed: 'Processing failed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a PDF file.',
      'Tick "Add page numbers" and/or "Add a watermark", then set the position, size, opacity and so on.',
      'Press "Run" to build a new PDF.',
      'Download the file shown under the result.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Page numbers use a standard font, so the format can only contain ASCII letters, digits and symbols.',
      'The watermark is placed as an image, so its text cannot be selected or searched in the PDF. Non-Latin glyphs are drawn with the fonts installed on your device.',
      'Pressing the run button does not change your original file; it creates a new PDF with the page numbers and watermark added. Keep the original if you need to undo.',
      'Password-protected PDFs are not supported. Unlock them first.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Watermark',
        description:
          'Faint text or an image laid over (or behind) a page content to mark a document, for example CONFIDENTIAL, DRAFT or SAMPLE.',
      },
      {
        term: 'pt (point)',
        description:
          'The length unit used in PDFs. 1 pt is about 0.35 mm, and an A4 page is roughly 595 × 842 pt.',
      },
    ],
  },
};
