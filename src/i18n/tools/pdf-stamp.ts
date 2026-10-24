import type { Locale } from '../../data/tools';

export interface PdfStampPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  /** 電子署名ではない旨の常時表示の注意書き */
  disclaimer: string;
  fileLabel: string;
  dropHint: string;
  fileHint: string;
  /** {pages} を置換 */
  pagesTemplate: string;
  infoSeparator: string;
  imageLabel: string;
  imageDropHint: string;
  imageHint: string;
  imageAlt: string;
  editorHeading: string;
  editorHint: string;
  prevPage: string;
  nextPage: string;
  /** {n} {total} を置換 */
  pageIndicatorTemplate: string;
  /** {n} を置換（プレビュー領域の読み上げ用） */
  canvasLabelTemplate: string;
  stampLabel: string;
  resizeHandleLabel: string;
  sizeLabel: string;
  opacityLabel: string;
  resetPosition: string;
  targetLabel: string;
  targetAll: string;
  targetCurrent: string;
  targetRange: string;
  rangeLabel: string;
  rangePlaceholder: string;
  run: string;
  processing: string;
  clear: string;
  resultHeading: string;
  /** {pages} を置換 */
  resultSummaryTemplate: string;
  /** {name} を置換 */
  downloadTemplate: string;
  errorNoFile: string;
  errorNoImage: string;
  errorNotPdf: string;
  errorNotImage: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorBadImage: string;
  errorEmptyRange: string;
  errorBadRange: string;
  errorOutOfRange: string;
  errorNoTarget: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfStampContent: Record<Locale, PdfStampPageContent> = {
  ja: {
    title: 'PDFに署名画像・ハンコを挿入｜位置とページを選べる無料ツール',
    description:
      'PDFに署名やハンコ（スタンプ）の画像を貼り付ける無料ツールです。ドラッグで位置、スライダーで大きさを決め、複数ページにも適用できます。電子署名ではありません。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDF署名・スタンプ挿入（画像を貼り付け）',
    introHtml:
      'PDFのページ上に、署名やハンコ（スタンプ）の画像を貼り付けて書き出します。プレビュー上でドラッグして位置を決め、スライダーで大きさと濃さを調整し、全ページ・今のページ・指定したページのどれにでも押せます。<a href="/tools/signature-pad/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">署名パッド</a>や<a href="/tools/seal-stamp-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ハンコ・印鑑ジェネレーター</a>で作った透過PNGも使えます。ファイルは端末の外に出ません。ページ番号やすかしを入れたいときは<a href="/tools/pdf-page-number-watermark/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDFページ番号・透かし</a>をご利用ください。',
    disclaimer:
      'このツールは画像を貼り付けるだけで、電子署名（デジタル署名・電子証明書）ではありません。本人確認や改ざん検知はできないため、法的に電子署名が必要な書類には使えません。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    pagesTemplate: '{pages}ページ',
    infoSeparator: '、',
    imageLabel: '署名・スタンプ画像を選択',
    imageDropHint: 'ここに画像をドラッグ＆ドロップすることもできます',
    imageHint:
      'PNG・JPEGなどの画像を1つ選んでください。背景が透明なPNGがおすすめです。',
    imageAlt: '選択した署名・スタンプ画像',
    editorHeading: '位置と大きさを決める',
    editorHint:
      'プレビュー上の画像をドラッグして動かし、右下の■で大きさを変えます。画像を選んだ状態で矢印キーを押すと微調整できます。スマートフォンでは指で動かします（画像の上ではスクロールできません）。',
    prevPage: '前のページ',
    nextPage: '次のページ',
    pageIndicatorTemplate: '{n} / {total} ページ',
    canvasLabelTemplate: '{n}ページ目のプレビュー',
    stampLabel: '署名・スタンプ画像（ドラッグで移動、矢印キーで微調整）',
    resizeHandleLabel: '大きさを変える',
    sizeLabel: '大きさ（ページ幅に対する割合）',
    opacityLabel: '濃さ（不透明度）',
    resetPosition: '位置を初期化',
    targetLabel: '押すページ',
    targetAll: '全ページ',
    targetCurrent: 'このページだけ',
    targetRange: 'ページを指定',
    rangeLabel: 'ページ指定（例: 1-3, 5）',
    rangePlaceholder: '1-3, 5',
    run: '署名・スタンプを入れて書き出す',
    processing: '書き出し中…',
    clear: 'クリア',
    resultHeading: '結果',
    resultSummaryTemplate: '{pages}ページに画像を貼り付けました。',
    downloadTemplate: '{name} をダウンロード',
    errorNoFile: 'PDFファイルを選択してください。',
    errorNoImage: '署名・スタンプの画像を選択してください。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorNotImage: '画像ファイルを選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'パスワードで保護されたPDFは処理できません。保護を解除してからお試しください。',
    errorBadImage:
      '画像を読み込めませんでした。PNGまたはJPEGで保存し直してお試しください。',
    errorEmptyRange: 'ページ指定を入力してください。',
    errorBadRange:
      'ページ指定の形式が正しくありません。「1-3, 5」のように入力してください。',
    errorOutOfRange: 'ページ指定がページ数を超えています。',
    errorNoTarget: '押すページがありません。',
    errorFailed: '処理に失敗しました。',
    howToHeading: '使い方',
    howToSteps: [
      'PDFファイルを選択します。',
      '「署名・スタンプ画像を選択」で、貼り付ける画像を選びます。',
      'プレビュー上で画像をドラッグして位置を決め、「大きさ」のスライダーで大きさを整えます。',
      '「押すページ」から「全ページ」「このページだけ」「ページを指定」のどれかを選びます。',
      '「署名・スタンプを入れて書き出す」を押して、結果のファイルをダウンロードします。',
    ],
    notesHeading: 'ご注意',
    notes: [
      'このツールは画像をページに貼り付けるだけで、電子署名（デジタル署名）やタイムスタンプではありません。証明書による本人確認や改ざん検知はできないため、法的に電子署名が必要な書類には認定された電子署名サービスをお使いください。',
      '貼り付けた画像は元の内容の上に重なる画像として保存されます。PDFを編集できるソフトでは移動や削除ができるため、改ざんを防ぐ用途には向きません。',
      '複数ページに押すときは、ページに対する同じ相対位置・同じ幅の割合で貼り付けます。ページごとに位置を変えたいときは、ページを分けて書き出してください。',
      'すでに電子署名が付いたPDFに画像を加えると、PDFを書き換えるため元の署名が無効になることがあります。',
      'PNG・JPEG以外の画像はPNGに変換して使います。背景が透明なPNGなら、文字や印影の周りが白く抜けません。パスワードで保護されたPDFは処理できません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '電子署名（デジタル署名）',
        description:
          '電子証明書を使って、誰が署名したか・署名後に内容が改ざんされていないかを確認できる仕組みです。署名画像を貼り付けるだけの操作とは別のものです。',
      },
      {
        term: '透過PNG',
        description:
          '背景が透明なPNG画像です。署名や印影に使うと、貼り付けたときに文字の下の内容が隠れません。',
      },
      {
        term: '不透明度',
        description:
          '画像の濃さを表す値です。100%で完全に不透明、下げるほど下の内容が透けて見えます。',
      },
    ],
  },
  en: {
    title: 'Add Signature or Stamp Image to PDF – Place & Export, Free',
    description:
      'Place a signature or stamp image on a PDF: drag to position, resize, and apply to one or many pages. Not a digital signature. Runs in your browser; no upload.',
    h1: 'Add a Signature or Stamp Image to a PDF',
    introHtml:
      'Paste a signature or stamp image onto your PDF and save the result. Drag the image into place on the preview, adjust its size and opacity, and stamp every page, just the current page, or the pages you choose. Transparent PNGs from the <a href="/en/tools/signature-pad/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Signature Pad</a> or the <a href="/en/tools/seal-stamp-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Seal Stamp Generator</a> work well. Your file never leaves your device. For page numbers or text watermarks, use the <a href="/en/tools/pdf-page-number-watermark/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Page Number &amp; Watermark</a> tool.',
    disclaimer:
      'This tool only places an image on the page. It is not a digital signature (no certificate), cannot verify who signed or detect later changes, and is not suitable for documents that legally require an electronic signature.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick a single .pdf file.',
    pagesTemplate: '{pages} pages',
    infoSeparator: ', ',
    imageLabel: 'Choose a signature or stamp image',
    imageDropHint: 'You can also drag and drop an image here',
    imageHint:
      'Pick one image such as PNG or JPEG. A PNG with a transparent background works best.',
    imageAlt: 'Selected signature or stamp image',
    editorHeading: 'Set position and size',
    editorHint:
      'Drag the image on the preview to move it and use the square handle at its bottom-right corner to resize. With the image focused, the arrow keys nudge it. On a phone, move it with your finger (the page cannot scroll while your finger is on the image).',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    pageIndicatorTemplate: 'Page {n} / {total}',
    canvasLabelTemplate: 'Preview of page {n}',
    stampLabel: 'Signature or stamp image (drag to move, arrow keys to nudge)',
    resizeHandleLabel: 'Resize',
    sizeLabel: 'Size (% of page width)',
    opacityLabel: 'Opacity',
    resetPosition: 'Reset position',
    targetLabel: 'Pages to stamp',
    targetAll: 'All pages',
    targetCurrent: 'This page only',
    targetRange: 'Choose pages',
    rangeLabel: 'Pages (e.g. 1-3, 5)',
    rangePlaceholder: '1-3, 5',
    run: 'Add to PDF and export',
    processing: 'Exporting…',
    clear: 'Clear',
    resultHeading: 'Result',
    resultSummaryTemplate: 'Placed the image on {pages} page(s).',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNoImage: 'Please choose a signature or stamp image.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorNotImage: 'Please choose an image file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'Password-protected PDFs cannot be processed. Remove the protection first and try again.',
    errorBadImage:
      'Could not read the image. Try saving it again as PNG or JPEG.',
    errorEmptyRange: 'Enter the pages to stamp.',
    errorBadRange: 'The page list is not valid. Use a format like 1-3, 5.',
    errorOutOfRange: 'The page list goes beyond the number of pages.',
    errorNoTarget: 'There are no pages to stamp.',
    errorFailed: 'Processing failed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a PDF file.',
      'Pick the image to place with "Choose a signature or stamp image".',
      'Drag the image on the preview to position it and fine-tune it with the "Size" slider.',
      'Under "Pages to stamp", pick "All pages", "This page only" or "Choose pages".',
      'Press "Add to PDF and export" and download the result.',
    ],
    notesHeading: 'Please note',
    notes: [
      'This tool only places an image on the page. It is not a digital signature or a timestamp, so it cannot verify identity with a certificate or detect later changes. For documents that legally require an electronic signature, use a certified e-signature service.',
      'The image is saved as a picture on top of the original content. Software that can edit PDFs can move or delete it, so it does not protect a document from tampering.',
      'When you stamp several pages, the image is placed at the same relative position and width on each page. To use different positions, export in separate passes.',
      'Adding an image to a PDF that already carries a digital signature rewrites the file and can invalidate the original signature.',
      'Images other than PNG and JPEG are converted to PNG. A transparent PNG keeps the area around your signature or seal clear. Password-protected PDFs cannot be processed.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Digital signature',
        description:
          'A certificate-based mechanism that shows who signed a document and whether it changed after signing. Placing a picture of a signature is a different thing.',
      },
      {
        term: 'Transparent PNG',
        description:
          'A PNG with a see-through background. Used for signatures and seals, it does not cover the content beneath the strokes.',
      },
      {
        term: 'Opacity',
        description:
          'How solid the image looks. At 100% it is fully opaque; lower values let the content underneath show through.',
      },
    ],
  },
};
