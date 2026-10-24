import type { Locale } from '../../data/tools';
import type {
  NupOrder,
  NupOrientation,
  PerSheet,
  SheetSize,
} from '../../lib/tools/pdf-nup';

export interface PdfNupPageContent {
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
  perSheetLabel: string;
  /** {n} を置換 */
  perSheetOptions: Record<PerSheet, string>;
  sheetSizeLabel: string;
  sheetSizes: Record<SheetSize, string>;
  orientationLabel: string;
  orientations: Record<NupOrientation, string>;
  orderLabel: string;
  orders: Record<NupOrder, string>;
  marginLabel: string;
  gapLabel: string;
  borderLabel: string;
  run: string;
  processing: string;
  clear: string;
  resultHeading: string;
  /** {sheets} {pages} を置換 */
  resultSummary: string;
  /** {name} を置換 */
  downloadTemplate: string;
  errorNoFile: string;
  errorNotPdf: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorBadOption: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfNupContent: Record<Locale, PdfNupPageContent> = {
  ja: {
    title: 'PDF割付（2in1・4in1）｜複数ページを1枚にまとめる無料ツール',
    description:
      'PDFの複数ページを1枚の用紙に縮小して並べる割付（N-up）ツールです。2in1・4in1・6in1・8in1・9in1に対応し、向き・順序・余白・枠線を指定可能。PDFはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDF割付（2in1・4in1）で複数ページを1枚にまとめる',
    introHtml:
      '配布資料やスライドPDFを、1枚の用紙に2・4・6・8・9ページずつ縮小して並べた新しいPDFにします。用紙サイズ・向き・並び順・余白・枠線を選べ、印刷枚数を減らしたいときに便利です。ファイルは端末の外に出ません。不要なページを先に取り除くなら<a href="/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDFページ回転・削除・並び替え</a>をご利用ください。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    infoTemplate: '{pages}ページ',
    perSheetLabel: '1枚あたりのページ数',
    perSheetOptions: {
      2: '2ページ（2in1）',
      4: '4ページ（4in1）',
      6: '6ページ（6in1）',
      8: '8ページ（8in1）',
      9: '9ページ（9in1）',
    },
    sheetSizeLabel: '用紙サイズ',
    sheetSizes: {
      a4: 'A4',
      a3: 'A3',
      b5: 'B5',
      b4: 'B4',
      letter: 'レター',
    },
    orientationLabel: '用紙の向き',
    orientations: {
      auto: '自動（枚数に合わせる）',
      portrait: '縦',
      landscape: '横',
    },
    orderLabel: 'ページの並び順',
    orders: {
      row: '横方向（左→右、上→下）',
      column: '縦方向（上→下、左→右）',
    },
    marginLabel: '用紙の端からの余白（pt）',
    gapLabel: 'ページ同士の間隔（pt）',
    borderLabel: '各ページに枠線をつける',
    run: '実行',
    processing: '処理中…',
    clear: 'クリア',
    resultHeading: '結果',
    resultSummary: '{pages}ページを{sheets}枚にまとめました。',
    downloadTemplate: '{name} をダウンロード',
    errorNoFile: 'PDFファイルを選択してください。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'このPDFはパスワードで保護されています。先にパスワードを解除してください。',
    errorBadOption:
      '設定値が範囲外です。余白と間隔は0〜100ptの範囲で指定してください。',
    errorFailed: '処理に失敗しました。',
    howToHeading: '使い方',
    howToSteps: [
      'PDFファイルを選択します。',
      '「1枚あたりのページ数」と用紙サイズ・向き・並び順などを設定します。',
      '「実行」を押すと、割り付けた新しいPDFが作られます。',
      '結果に表示されたファイルをダウンロードします。',
    ],
    notesHeading: '注意事項',
    notes: [
      '各ページは縦横比を保ったまま縮小されます。ページの大きさが用紙と異なると、余白ができます。',
      '「実行」を押しても元のファイルは変更されず、割り付けた新しいPDFが作られます。',
      'ページを縮小するため、細かい文字は小さくなります。印刷後に読みにくい場合は、1枚あたりのページ数を減らしてください。',
      'パスワードで保護されたPDFは扱えません。先に解除してからご利用ください。',
      'CropBox（表示範囲）が設定されたPDFは、その範囲に従って割り付けます。切り抜いた部分は載りません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '割付（N-up）',
        description:
          '複数のページを縮小して、1枚の用紙にまとめて配置する印刷方法です。2ページなら2in1、4ページなら4in1と呼びます。',
      },
      {
        term: 'pt（ポイント）',
        description:
          'PDFの長さの単位で、1ptは約0.35mmです。A4の用紙は約595×842ptです。',
      },
    ],
  },
  en: {
    title: 'PDF N-up: 2-up, 4-up Pages per Sheet – Free, No Upload',
    description:
      'Shrink several PDF pages onto one sheet with 2-up, 4-up, 6-up, 8-up or 9-up layouts. Set orientation, order, margin, borders. Runs in your browser; no upload.',
    h1: 'PDF N-up: Put Multiple Pages on One Sheet',
    introHtml:
      'Turn handouts or slide decks into a new PDF with 2, 4, 6, 8 or 9 pages shrunk onto each sheet. Choose the paper size, orientation, page order, margin and borders to save paper when printing. Your file never leaves your device. To remove unwanted pages first, use the <a href="/en/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Page Editor</a>.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick one .pdf file.',
    infoTemplate: '{pages}-page PDF',
    perSheetLabel: 'Pages per sheet',
    perSheetOptions: {
      2: '2 pages (2-up)',
      4: '4 pages (4-up)',
      6: '6 pages (6-up)',
      8: '8 pages (8-up)',
      9: '9 pages (9-up)',
    },
    sheetSizeLabel: 'Paper size',
    sheetSizes: {
      a4: 'A4',
      a3: 'A3',
      b5: 'B5',
      b4: 'B4',
      letter: 'Letter',
    },
    orientationLabel: 'Orientation',
    orientations: {
      auto: 'Auto (best for the layout)',
      portrait: 'Portrait',
      landscape: 'Landscape',
    },
    orderLabel: 'Page order',
    orders: {
      row: 'Across (left to right, then down)',
      column: 'Down (top to bottom, then right)',
    },
    marginLabel: 'Margin from the paper edge (pt)',
    gapLabel: 'Gap between pages (pt)',
    borderLabel: 'Draw a border around each page',
    run: 'Run',
    processing: 'Processing…',
    clear: 'Clear',
    resultHeading: 'Result',
    resultSummary: 'Combined {pages} pages onto {sheets} sheets.',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted: 'This PDF is password-protected. Please unlock it first.',
    errorBadOption:
      'A setting is out of range. Margin and gap must be between 0 and 100 pt.',
    errorFailed: 'Processing failed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a PDF file.',
      'Set "Pages per sheet", plus the paper size, orientation and page order.',
      'Press "Run" to build the new PDF.',
      'Download the file shown under the result.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Each page is scaled down while keeping its aspect ratio. If the page shape differs from its slot, there will be blank space around it.',
      'Pressing the run button does not change your original file; it creates a new, laid-out PDF.',
      'Pages are shrunk, so small text becomes smaller. If it is hard to read once printed, use fewer pages per sheet.',
      'Password-protected PDFs are not supported. Unlock them first.',
      'If a PDF has a CropBox (visible area), pages are laid out according to it. Areas outside the CropBox are not included.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'N-up',
        description:
          'A print layout that shrinks several pages onto one sheet of paper. Two pages per sheet is 2-up, four is 4-up, and so on.',
      },
      {
        term: 'pt (point)',
        description:
          'The length unit used in PDFs. 1 pt is about 0.35 mm, and an A4 page is roughly 595 × 842 pt.',
      },
    ],
  },
};
