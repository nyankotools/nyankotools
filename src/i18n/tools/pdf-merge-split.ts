import type { Locale } from '../../data/tools';

export interface PdfMergeSplitPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeMerge: string;
  modeExtract: string;
  modeSplit: string;
  fileLabelMerge: string;
  fileLabelSingle: string;
  fileHint: string;
  dropHint: string;
  /** {pages} を置換 */
  pagesTemplate: string;
  moveUp: string;
  moveDown: string;
  remove: string;
  rangeLabel: string;
  rangePlaceholder: string;
  rangeHint: string;
  splitLabel: string;
  splitSuffix: string;
  run: string;
  processing: string;
  clear: string;
  resultHeading: string;
  /** {name} を置換 */
  downloadTemplate: string;
  errorNoFile: string;
  errorNeedTwo: string;
  errorNotPdf: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorEmptyRange: string;
  errorBadRange: string;
  /** {pages} を置換 */
  errorOutOfRange: string;
  errorBadCount: string;
  errorFailed: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfMergeSplitContent: Record<Locale, PdfMergeSplitPageContent> = {
  ja: {
    title: 'PDF結合・分割・ページ抽出｜ブラウザで完結する無料ツール',
    description:
      '複数のPDFを1つに結合、PDFをページ数ごとに分割、「1-3,5」のようなページ指定で必要なページだけを抽出できる無料ツールです。PDFはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDF結合・分割・ページ抽出',
    introHtml:
      'PDFを結合したり、ページ単位で分割・抽出したりできます。ファイルは端末の外に出ません。画像をPDFにしたいときは<a href="/tools/pdf-image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF⇔画像変換</a>、その前に画像を軽くしたいときは<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a>をご利用ください（出力形式はJPEGがおすすめです）。',
    modeLabel: '操作',
    modeMerge: '結合',
    modeExtract: 'ページ抽出',
    modeSplit: '分割',
    fileLabelMerge: 'PDFファイルを選択（複数可）',
    fileLabelSingle: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint:
      '.pdfファイルを選んでください。結合では複数ファイルを選べ、追加選択もできます。',
    pagesTemplate: '{pages}ページ',
    moveUp: '上へ',
    moveDown: '下へ',
    remove: '削除',
    rangeLabel: '抽出するページ',
    rangePlaceholder: '例: 1-3, 5, 8-',
    rangeHint:
      'カンマ区切りでページ番号を指定します。「1-3」は範囲、「8-」は8ページ目から最後まで。指定した順に並びます。',
    splitLabel: '分割する単位',
    splitSuffix: 'ページごと',
    run: '実行',
    processing: '処理中…',
    clear: 'クリア',
    resultHeading: '結果',
    downloadTemplate: '{name} をダウンロード',
    errorNoFile: 'PDFファイルを選択してください。',
    errorNeedTwo: '結合には2つ以上のPDFファイルが必要です。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'パスワードで保護されたPDFは処理できません。保護を解除してからお試しください。',
    errorEmptyRange: 'ページ範囲を入力してください。',
    errorBadRange:
      'ページ範囲の形式が正しくありません。「1-3, 5, 8-」のように入力してください。',
    errorOutOfRange: '指定したページがPDFの範囲外です（全{pages}ページ）。',
    errorBadCount: '分割するページ数は1以上の整数で指定してください。',
    errorFailed: '処理に失敗しました。',
    notesHeading: '注意事項',
    notes: [
      'パスワードで保護されたPDFは処理できません。先に保護を解除してから使ってください。',
      'ページ範囲は「1-3, 5, 8-」のようにカンマ区切りで指定します。ページ抽出では、指定した順にページが並びます。',
      'ファイルはブラウザ内で処理され、端末の外には送信されません。非常に大きなPDFは、端末のメモリ状況によって処理に時間がかかる場合があります。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '「結合」「ページ抽出」「分割」から、行いたい操作を選びます。',
      'PDFファイルを選択します（結合では複数選択でき、「上へ」「下へ」で順番を入れ替えられます）。',
      'ページ抽出では「1-3, 5」のようにページを、分割では何ページごとに分けるかを入力します。',
      '「実行」を押し、結果に表示されたファイルをダウンロードします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'PDF',
        description:
          'レイアウトを保ったまま文書を共有できるファイル形式です。1つのファイルが複数のページで構成されており、ページ単位で取り出したり並べ替えたりできます。',
      },
      {
        term: 'ページ抽出',
        description:
          'PDFから必要なページだけを取り出して、新しいPDFとして保存する操作です。不要なページを除いた資料を作りたいときに使います。',
      },
      {
        term: '暗号化（パスワード保護）PDF',
        description:
          '開くためにパスワードが必要なPDFです。このツールではパスワード保護されたPDFは扱えません。',
      },
    ],
  },
  en: {
    title: 'PDF Merge, Split & Extract Pages – Free Online, No Upload',
    description:
      'Merge PDFs, split every N pages, or extract pages like "1-3,5". Runs in your browser; your PDFs are never uploaded.',
    h1: 'PDF Merge, Split & Extract Pages',
    introHtml:
      'Combine PDFs, or split a PDF and pull out just the pages you need. Your files never leave your device. To turn images into a PDF, try the <a href="/en/tools/pdf-image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF ⇔ Image Converter</a>. To shrink the images first, use the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a> (JPEG output is recommended).',
    modeLabel: 'Action',
    modeMerge: 'Merge',
    modeExtract: 'Extract pages',
    modeSplit: 'Split',
    fileLabelMerge: 'Choose PDF files (multiple allowed)',
    fileLabelSingle: 'Choose a PDF file',
    dropHint: 'You can also drag and drop PDF files here',
    fileHint:
      'Pick .pdf files. For merging you can select several at once and add more later.',
    pagesTemplate: '{pages} pages',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Remove',
    rangeLabel: 'Pages to extract',
    rangePlaceholder: 'e.g. 1-3, 5, 8-',
    rangeHint:
      'Separate page numbers with commas. "1-3" is a range and "8-" means page 8 to the end. Pages appear in the order you list them.',
    splitLabel: 'Split every',
    splitSuffix: 'pages',
    run: 'Run',
    processing: 'Processing…',
    clear: 'Clear',
    resultHeading: 'Result',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNeedTwo: 'Merging needs at least two PDF files.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'Password-protected PDFs cannot be processed. Remove the protection first and try again.',
    errorEmptyRange: 'Please enter a page range.',
    errorBadRange: 'Invalid page range. Use a format like "1-3, 5, 8-".',
    errorOutOfRange:
      'The specified pages are outside the PDF (it has {pages} pages).',
    errorBadCount: 'Enter a whole number of pages, 1 or more.',
    errorFailed: 'Processing failed.',
    notesHeading: 'Notes',
    notes: [
      'Password-protected PDFs cannot be processed. Remove the protection first.',
      'Specify page ranges separated by commas, like "1-3, 5, 8-". When extracting pages, they appear in the order you list them.',
      "Files are processed in the browser and never leave your device. Very large PDFs may take longer depending on your device's memory.",
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an action: Merge, Extract pages, or Split.',
      'Choose your PDF files (Merge accepts several; use "Move up" / "Move down" to reorder them).',
      'For Extract pages, enter pages such as "1-3, 5". For Split, enter how many pages each file should have.',
      'Press "Run", then download the files listed under the result.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'PDF',
        description:
          'A file format for sharing documents with their layout intact. A PDF is made of pages, which can be pulled out or reordered individually.',
      },
      {
        term: 'Page extraction',
        description:
          'Copying only the pages you need from a PDF into a new PDF. Handy for producing a document without the pages you do not want to share.',
      },
      {
        term: 'Encrypted (password-protected) PDF',
        description:
          'A PDF that requires a password to open. This tool cannot process password-protected PDFs.',
      },
    ],
  },
};
