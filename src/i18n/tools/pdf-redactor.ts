import type { Locale } from '../../data/tools';

export interface PdfRedactorPageContent {
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
  /** ファイル情報（ページ数とサイズ）の区切り */
  infoSeparator: string;
  editorHeading: string;
  editorHint: string;
  prevPage: string;
  nextPage: string;
  /** {n} {total} を置換 */
  pageIndicatorTemplate: string;
  undo: string;
  clearPage: string;
  /** {count} {pages} を置換 */
  summaryTemplate: string;
  summaryNone: string;
  /** {n} を置換（プレビュー領域の読み上げ用） */
  canvasLabelTemplate: string;
  qualityLabel: string;
  qualityStandard: string;
  qualityHigh: string;
  run: string;
  processing: string;
  /** {done} {total} を置換 */
  progressTemplate: string;
  clear: string;
  resultHeading: string;
  /** {count} {pages} を置換 */
  resultSummaryTemplate: string;
  /** {name} を置換 */
  downloadTemplate: string;
  errorNoFile: string;
  errorNotPdf: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorNoRedaction: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfRedactorContent: Record<Locale, PdfRedactorPageContent> = {
  ja: {
    title: 'PDF黒塗り｜個人情報を完全に隠す無料ツール（ブラウザで完結）',
    description:
      'PDFの氏名・住所・金額などを黒塗りして、元の文字を復元できない形で書き出せる無料ツールです。ページ上をドラッグするだけ。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDF黒塗り（墨消し）ツール',
    introHtml:
      'PDFの隠したい部分をドラッグで黒く塗りつぶします。書き出すときは各ページを画像化するため、黒塗りの下の文字は残らず、コピーや復元はできません。ファイルは端末の外に出ません。ページの削除・並べ替えは<a href="/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDFページ回転・削除・並び替え</a>をご利用ください。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    pagesTemplate: '{pages}ページ',
    infoSeparator: '、',
    editorHeading: '黒塗りする範囲を選ぶ',
    editorHint:
      'ページ上をドラッグすると黒塗りの範囲を追加できます。スマートフォンでは指でなぞって選びます（ページ上ではスクロールできません）。',
    prevPage: '前のページ',
    nextPage: '次のページ',
    pageIndicatorTemplate: '{n} / {total} ページ',
    undo: '直前の範囲を取り消す',
    clearPage: 'このページの黒塗りを消す',
    summaryTemplate: '黒塗り: 合計{count}か所（{pages}ページ）',
    summaryNone: '黒塗りの範囲はまだありません',
    canvasLabelTemplate:
      '{n}ページ目のプレビュー（ドラッグで黒塗り範囲を指定）',
    qualityLabel: '書き出しの画質',
    qualityStandard: '標準（144dpi）',
    qualityHigh: '高画質（216dpi・ファイルは大きくなります）',
    run: '黒塗りして書き出す',
    processing: '書き出し中…',
    progressTemplate: '{done} / {total} ページ',
    clear: 'クリア',
    resultHeading: '結果',
    resultSummaryTemplate: '{count}か所を黒塗りしました（{pages}ページ）。',
    downloadTemplate: '{name} をダウンロード',
    errorNoFile: 'PDFファイルを選択してください。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'パスワードで保護されたPDFは処理できません。保護を解除してからお試しください。',
    errorNoRedaction: '黒塗りする範囲を1か所以上指定してください。',
    errorFailed: '処理に失敗しました。',
    howToHeading: '使い方',
    howToSteps: [
      'PDFファイルを選択します。',
      'プレビュー上でドラッグして、隠したい部分を黒い四角で囲みます。「前のページ」「次のページ」でページを移動します。',
      '書き出しの画質を選び、「黒塗りして書き出す」を押します。',
      '結果のファイルをダウンロードし、黒塗り部分が読めないことを確認してから共有します。',
    ],
    notesHeading: 'ご注意',
    notes: [
      '書き出したPDFは全ページが画像になります。黒塗りの下の文字は残りませんが、文字の選択・検索・コピー、リンク、しおり、フォームも使えなくなります。',
      'Chrome・Edgeなど一部のPDFビューアは、画像のPDFを自動で文字認識（OCR）するため、黒塗りしていない部分の文字はコピーできることがあります。PDF自体に文字データは含まれておらず、黒塗りした部分の元の文字は復元できません。',
      '黒塗りは指定した範囲だけに適用されます。範囲が文字からはみ出さないよう、書き出し後のPDFで必ず目視確認してください。',
      'パスワードで保護されたPDFは処理できません。',
      'ページが大きい場合は、ブラウザの制限により書き出し画質が自動的に下がることがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '黒塗り（墨消し・リダクション）',
        description:
          '個人情報や機密情報を、読めない形で完全に取り除くことです。PDF上に黒い図形を重ねるだけだと、下の文字が残ったままコピーできてしまいます。',
      },
      {
        term: 'ラスタライズ（画像化）',
        description:
          'ページを画素の集まり（画像）に変換することです。このツールは黒塗りの後でページを画像化するため、塗りつぶした部分の元データは出力に含まれません。',
      },
      {
        term: 'dpi（解像度）',
        description:
          '1インチあたりの画素数です。値が大きいほど文字がくっきりしますが、ファイルサイズも大きくなります。',
      },
    ],
  },
  en: {
    title: 'Redact PDF – Black Out Text Permanently, Free & No Upload',
    description:
      'Black out names, addresses and amounts in a PDF so the hidden text cannot be recovered. Just drag over the page. Runs in your browser; never uploaded.',
    h1: 'PDF Redactor (Black Out Sensitive Info)',
    introHtml:
      'Drag over the parts of a PDF you want to hide and fill them in black. On export every page is flattened into an image, so the text under the black boxes is gone for good and cannot be copied or recovered. Your file never leaves your device. To delete or reorder pages first, use the <a href="/en/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Page Editor</a>.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick a single .pdf file.',
    pagesTemplate: '{pages} pages',
    infoSeparator: ', ',
    editorHeading: 'Choose what to black out',
    editorHint:
      'Drag over the page to add a redaction box. On a phone, draw with your finger (the page cannot be scrolled while your finger is on it).',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    pageIndicatorTemplate: 'Page {n} / {total}',
    undo: 'Undo last box',
    clearPage: 'Clear boxes on this page',
    summaryTemplate: 'Redactions: {count} in total ({pages} pages)',
    summaryNone: 'No redaction boxes yet',
    canvasLabelTemplate: 'Preview of page {n} (drag to mark a redaction box)',
    qualityLabel: 'Export quality',
    qualityStandard: 'Standard (144 dpi)',
    qualityHigh: 'High (216 dpi, larger file)',
    run: 'Redact and export',
    processing: 'Exporting…',
    progressTemplate: 'Page {done} / {total}',
    clear: 'Clear',
    resultHeading: 'Result',
    resultSummaryTemplate: 'Redacted {count} area(s) on {pages} page(s).',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'Password-protected PDFs cannot be processed. Remove the protection first and try again.',
    errorNoRedaction: 'Mark at least one area to black out.',
    errorFailed: 'Processing failed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a PDF file.',
      'Drag over the preview to cover what you want to hide with black boxes. Use "Previous page" and "Next page" to move between pages.',
      'Pick an export quality and press "Redact and export".',
      'Download the result and check that the covered areas are unreadable before sharing it.',
    ],
    notesHeading: 'Please note',
    notes: [
      'Every page of the exported PDF becomes an image. Text under the black boxes is not kept, but text selection, search, copy, links, bookmarks and form fields are also lost.',
      'Some PDF viewers, such as Chrome and Edge, run OCR on image-only PDFs, so text outside the black boxes may still be copyable. The PDF itself contains no text data, and the text under the black boxes cannot be recovered.',
      'Only the areas you mark are covered. Make sure the boxes fully cover the text, and always check the exported PDF by eye.',
      'Password-protected PDFs cannot be processed.',
      'For very large pages, the export resolution may be lowered automatically because of browser limits.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Redaction',
        description:
          'Permanently removing personal or confidential information so it cannot be read. Simply placing a black shape over a PDF leaves the text underneath, which can still be copied.',
      },
      {
        term: 'Rasterizing (flattening to an image)',
        description:
          'Converting a page into a grid of pixels. This tool rasterizes each page after the black boxes are applied, so the original data under them is not in the output.',
      },
      {
        term: 'dpi (resolution)',
        description:
          'Dots per inch. A higher value makes text sharper but also makes the file larger.',
      },
    ],
  },
};
