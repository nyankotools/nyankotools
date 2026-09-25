import type { Locale } from '../../data/tools';

export interface PdfPageEditorPageContent {
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
  passwordHeading: string;
  passwordNote: string;
  passwordLabel: string;
  unlock: string;
  unlocking: string;
  /** {done} {total} を置換 */
  unlockProgress: string;
  unlockedMessage: string;
  unlockedNote: string;
  listHeading: string;
  listHint: string;
  /** {n} {orig} を置換 */
  pageTemplate: string;
  /** {angle} を置換 */
  rotationTemplate: string;
  rotateLeft: string;
  rotateRight: string;
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
  errorInvalid: string;
  errorEncrypted: string;
  errorEmptyRange: string;
  errorOutOfRange: string;
  errorWrongPassword: string;
  errorFailed: string;
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfPageEditorContent: Record<Locale, PdfPageEditorPageContent> = {
  ja: {
    title:
      'PDFページ回転・削除・並び替え・パスワード解除｜ブラウザで完結する無料ツール',
    description:
      'PDFのページを回転・削除・並び替えして保存できる無料ツールです。パスワードを知っているPDFの保護解除にも対応。PDFはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDFページ回転・削除・並び替え',
    introHtml:
      'PDFのページを回転したり、不要なページを削除したり、順番を入れ替えたりして保存できます。パスワードを知っているPDFなら保護の解除もできます。ファイルは端末の外に出ません。複数ファイルの結合や範囲指定の抽出は<a href="/tools/pdf-merge-split/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF結合・分割・ページ抽出</a>をご利用ください。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    infoTemplate: '{pages}ページ',
    passwordHeading: 'パスワード解除',
    passwordNote:
      'このPDFはパスワードで保護されています。パスワードを入力して解除すると、ページ操作ができるようになります。解除後のPDFは各ページを画像化して作り直すため、文字の選択・検索はできなくなり、ファイルサイズが大きくなることがあります。また、ダウンロードするPDFにはパスワードが掛かりません（保護が外れた状態で保存されます）。パスワードの推測・総当たりには対応していません。',
    passwordLabel: 'パスワード',
    unlock: '解除する',
    unlocking: '解除中…',
    unlockProgress: '解除中… {done}/{total}ページ',
    unlockedMessage: 'パスワードを解除しました。',
    unlockedNote: 'ダウンロードするPDFにはパスワードが掛かりません。',
    listHeading: 'ページ一覧',
    listHint:
      '各ページを回転・削除・並び替えできます。「実行」を押すと、この一覧のとおりに新しいPDFを作成します。',
    pageTemplate: '{n}ページ目（元 {orig}ページ）',
    rotationTemplate: '回転 {angle}°',
    rotateLeft: '左へ回転',
    rotateRight: '右へ回転',
    moveUp: '上へ',
    moveDown: '下へ',
    remove: '削除',
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
      'このPDFはパスワードで保護されています。下の欄にパスワードを入力して解除してください。',
    errorEmptyRange: '残すページがありません。すべて削除されています。',
    errorOutOfRange: 'ページ指定が不正です。ファイルを選び直してください。',
    errorWrongPassword: 'パスワードが正しくありません。',
    errorFailed: '処理に失敗しました。',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ページ回転',
        description:
          '横向きに取り込まれたスキャン資料などのページを、90度単位で向きを直す操作です。ページの内容自体は変えず、表示の向きだけを変更します。',
      },
      {
        term: 'パスワード保護（暗号化）PDF',
        description:
          '開くためにパスワードが必要なPDFです。このツールでは、ご自身が知っているパスワードを入力して保護を外すことのみ可能で、パスワードの解析はできません。',
      },
    ],
  },
  en: {
    title:
      'Rotate, Delete & Reorder PDF Pages, Remove Password – Free, No Upload',
    description:
      'A free online tool to rotate, delete and reorder PDF pages, and to remove the password from a PDF you know the password for. Your PDFs are processed in the browser and never uploaded to a server.',
    h1: 'Rotate, Delete & Reorder PDF Pages',
    introHtml:
      'Rotate pages, delete the ones you do not need, and change their order, then save a new PDF. If you know the password of a protected PDF, you can remove it too. Your files never leave your device. To combine files or pull out a page range, use the <a href="/en/tools/pdf-merge-split/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Merge, Split & Extract</a> tool.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick one .pdf file.',
    infoTemplate: '{pages}-page PDF',
    passwordHeading: 'Remove password',
    passwordNote:
      'This PDF is password-protected. Enter the password to unlock it and edit its pages. The unlocked PDF is rebuilt from page images, so its text can no longer be selected or searched and the file may get larger. The downloaded PDF will also not be password-protected (it is saved without protection). Guessing or cracking passwords is not supported.',
    passwordLabel: 'Password',
    unlock: 'Unlock',
    unlocking: 'Unlocking…',
    unlockProgress: 'Unlocking… page {done}/{total}',
    unlockedMessage: 'The password was removed.',
    unlockedNote: 'The downloaded PDF will not be password-protected.',
    listHeading: 'Pages',
    listHint:
      'Rotate, delete or reorder each page. Press "Run" to build a new PDF that matches this list.',
    pageTemplate: 'Page {n} (originally {orig})',
    rotationTemplate: 'Rotated {angle}°',
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Delete',
    run: 'Run',
    processing: 'Processing…',
    clear: 'Clear',
    resultHeading: 'Result',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'This PDF is password-protected. Enter the password below to unlock it.',
    errorEmptyRange: 'No pages left. Every page has been deleted.',
    errorOutOfRange: 'Invalid page selection. Please choose the file again.',
    errorWrongPassword: 'The password is incorrect.',
    errorFailed: 'Processing failed.',
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Page rotation',
        description:
          'Turning a page in 90-degree steps, for example to fix a scan that was captured sideways. The page content is unchanged; only its display orientation is.',
      },
      {
        term: 'Password-protected (encrypted) PDF',
        description:
          'A PDF that needs a password to open. This tool can only remove protection when you enter a password you already know; it cannot recover unknown passwords.',
      },
    ],
  },
};
