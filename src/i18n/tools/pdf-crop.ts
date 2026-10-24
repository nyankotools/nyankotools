import type { Locale } from '../../data/tools';

export interface PdfCropPageContent {
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
  scopeLabel: string;
  scopeAll: string;
  scopePage: string;
  prevPage: string;
  nextPage: string;
  /** {n} {total} を置換 */
  pageIndicatorTemplate: string;
  marginsLabel: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingLabel: string;
  detect: string;
  detectEach: string;
  detecting: string;
  /** {done} {total} を置換 */
  detectProgressTemplate: string;
  resetCrop: string;
  /** {w} {h} を置換（mm） */
  sizeTemplate: string;
  /** {n} を置換（プレビュー領域の読み上げ用） */
  canvasLabelTemplate: string;
  /** 自動検出で内容が見つからなかったとき */
  detectBlank: string;
  detectDone: string;
  run: string;
  processing: string;
  clear: string;
  resultHeading: string;
  /** {pages} を置換 */
  resultSummaryTemplate: string;
  /** {name} を置換 */
  downloadTemplate: string;
  errorNoFile: string;
  errorNotPdf: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorNoCrop: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfCropContent: Record<Locale, PdfCropPageContent> = {
  ja: {
    title: 'PDF余白トリミング｜余白を自動検出して切り抜く無料ツール',
    description:
      'PDFの余白を数値入力・ドラッグ・自動検出で切り抜く無料ツールです。全ページ一括もページごとも指定でき、CropBoxを設定して書き出します。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDF余白トリミング（クロップ）',
    introHtml:
      'PDFの余白を切り落として、必要な部分だけが表示されるようにします。上下左右の数値入力、プレビュー上のドラッグ、内容から余白を探す自動検出に対応し、全ページ共通にもページごとにも設定できます。ファイルは端末の外に出ません。切り抜いた外側のデータはファイルに残るため、情報を隠したいときは<a href="/tools/pdf-redactor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF黒塗り</a>を、ページの削除・並べ替えは<a href="/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDFページ回転・削除・並び替え</a>をご利用ください。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    pagesTemplate: '{pages}ページ',
    infoSeparator: '、',
    editorHeading: '切り抜く範囲を決める',
    editorHint:
      'プレビュー上をドラッグすると、残す範囲を指定できます（暗い部分が切り落とされます）。数値で細かく調整することもできます。スマートフォンでは指でなぞって選びます（プレビュー上ではスクロールできません）。',
    scopeLabel: '適用先',
    scopeAll: '全ページ共通',
    scopePage: 'ページごと',
    prevPage: '前のページ',
    nextPage: '次のページ',
    pageIndicatorTemplate: '{n} / {total} ページ',
    marginsLabel: '切り落とす余白（mm）',
    marginTop: '上',
    marginRight: '右',
    marginBottom: '下',
    marginLeft: '左',
    paddingLabel: '自動検出で内容の周りに残す余白（mm）',
    detect: '余白を自動検出',
    detectEach: '全ページを個別に自動検出',
    detecting: '検出中…',
    detectProgressTemplate: '{done} / {total} ページ',
    resetCrop: '切り抜きをリセット',
    sizeTemplate: '切り抜き後のサイズ: {w} × {h} mm',
    canvasLabelTemplate: '{n}ページ目のプレビュー（ドラッグで残す範囲を指定）',
    detectBlank: '内容が見つからなかったため、余白を検出できませんでした。',
    detectDone:
      '内容に合わせて余白を設定しました。必要なら数値で調整してください。',
    run: '切り抜いて書き出す',
    processing: '書き出し中…',
    clear: 'クリア',
    resultHeading: '結果',
    resultSummaryTemplate: '{pages}ページ分の切り抜きを設定しました。',
    downloadTemplate: '{name} をダウンロード',
    errorNoFile: 'PDFファイルを選択してください。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'パスワードで保護されたPDFは処理できません。保護を解除してからお試しください。',
    errorNoCrop: '切り落とす余白を1か所以上設定してください。',
    errorFailed: '処理に失敗しました。',
    howToHeading: '使い方',
    howToSteps: [
      'PDFファイルを選択します。',
      '適用先を「全ページ共通」か「ページごと」から選びます。',
      '「余白を自動検出」を押すか、プレビュー上のドラッグ・数値入力で残す範囲を決めます。',
      '「切り抜いて書き出す」を押して、結果のファイルをダウンロードします。',
    ],
    notesHeading: 'ご注意',
    notes: [
      '切り抜きはページの表示範囲（CropBox）を設定するもので、範囲の外側のデータはファイルに残ります。PDFを編集できるソフトでは元に戻せるため、機密情報を隠す用途には向きません。',
      '文字・画像・リンクなどは削除や変換をされないため、検索や選択はそのまま使えます。ファイルサイズは基本的に小さくなりません。',
      '自動検出は、ページを画像にして白でない部分を探します。薄い色の内容や、スキャン時の影・ゴミがあると、期待と違う範囲になることがあります。結果はプレビューで確認し、数値で調整してください。',
      '全ページ共通は、同じ長さ（mm）をすべてのページの各辺から切り落とします。ページの大きさが違う場合は、ページごとの設定をお使いください。',
      'パスワードで保護されたPDFは処理できません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CropBox（クロップボックス）',
        description:
          'PDFビューアが表示・印刷するページ範囲です。MediaBox（用紙全体の大きさ）の内側に設定でき、外側のデータは消えずに非表示になります。',
      },
      {
        term: 'MediaBox（メディアボックス）',
        description:
          'ページの用紙全体の大きさを表す範囲です。このツールでは変更しません。',
      },
      {
        term: 'トリミング（クロップ）',
        description:
          '画像や紙面の周囲の不要な部分を切り落とすことです。PDFでは余白を取り除いて、内容を大きく見せたいときに使います。',
      },
    ],
  },
  en: {
    title: 'Crop PDF Margins – Auto-Detect & Trim Pages, Free',
    description:
      'Crop PDF margins by number, drag or auto-detect. Trim all pages at once or page by page and save with a new CropBox. Runs in your browser; never uploaded.',
    h1: 'PDF Margin Cropper (Trim White Space)',
    introHtml:
      'Cut away the white margins of a PDF so only the content shows. Set the margins by number, drag over the preview, or let the tool detect the content area, then apply the same crop to every page or set it page by page. Your file never leaves your device. The data outside the crop stays in the file, so to hide information use the <a href="/en/tools/pdf-redactor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Redactor</a>, and to delete or reorder pages use the <a href="/en/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Page Editor</a>.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick a single .pdf file.',
    pagesTemplate: '{pages} pages',
    infoSeparator: ', ',
    editorHeading: 'Set the crop area',
    editorHint:
      'Drag over the preview to mark the area to keep (the dark part is cropped away). You can fine-tune the margins with numbers. On a phone, draw with your finger (the preview cannot be scrolled while your finger is on it).',
    scopeLabel: 'Apply to',
    scopeAll: 'All pages',
    scopePage: 'Page by page',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    pageIndicatorTemplate: 'Page {n} / {total}',
    marginsLabel: 'Margins to cut (mm)',
    marginTop: 'Top',
    marginRight: 'Right',
    marginBottom: 'Bottom',
    marginLeft: 'Left',
    paddingLabel: 'Space to keep around content when auto-detecting (mm)',
    detect: 'Auto-detect margins',
    detectEach: 'Auto-detect every page separately',
    detecting: 'Detecting…',
    detectProgressTemplate: 'Page {done} / {total}',
    resetCrop: 'Reset crop',
    sizeTemplate: 'Size after crop: {w} × {h} mm',
    canvasLabelTemplate: 'Preview of page {n} (drag to mark the area to keep)',
    detectBlank: 'No content was found, so no margins could be detected.',
    detectDone:
      'Margins were set to fit the content. Adjust them by number if needed.',
    run: 'Crop and export',
    processing: 'Exporting…',
    clear: 'Clear',
    resultHeading: 'Result',
    resultSummaryTemplate: 'Applied the crop to {pages} page(s).',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'Password-protected PDFs cannot be processed. Remove the protection first and try again.',
    errorNoCrop: 'Set at least one margin to cut.',
    errorFailed: 'Processing failed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a PDF file.',
      'Pick "All pages" or "Page by page" as the target.',
      'Press "Auto-detect margins", or drag on the preview or type numbers to set the area to keep.',
      'Press "Crop and export" and download the result.',
    ],
    notesHeading: 'Please note',
    notes: [
      'Cropping sets the visible area of each page (the CropBox). The data outside it stays in the file, and software that can edit PDFs can bring it back, so do not rely on this to hide confidential information.',
      'Text, images and links are not removed or converted, so search and selection keep working. The file size usually does not get smaller.',
      'Auto-detect renders the page as an image and looks for non-white pixels. Very light content, scanner shadows or specks can give an unexpected area, so check the preview and adjust by number.',
      '"All pages" cuts the same length (mm) from every side of every page. If your pages differ in size, use "Page by page".',
      'Password-protected PDFs cannot be processed.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CropBox',
        description:
          'The page area that PDF viewers display and print. It sits inside the MediaBox, and data outside it is hidden rather than deleted.',
      },
      {
        term: 'MediaBox',
        description:
          'The full size of the page sheet. This tool does not change it.',
      },
      {
        term: 'Cropping',
        description:
          'Cutting away unwanted edges of an image or page. For PDFs it is used to remove white margins so the content appears larger.',
      },
    ],
  },
};
