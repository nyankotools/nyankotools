import type { Locale } from '../../data/tools';

export interface PdfPasswordProtectorPageContent {
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
  userPasswordLabel: string;
  userPasswordHint: string;
  showPasswords: string;
  restrictHeading: string;
  restrictHint: string;
  allowPrint: string;
  allowCopy: string;
  allowModify: string;
  ownerPasswordLabel: string;
  ownerPasswordHint: string;
  noteHeading: string;
  notes: string[];
  run: string;
  processing: string;
  clear: string;
  resultHeading: string;
  /** {name} を置換 */
  downloadTemplate: string;
  errorNoFile: string;
  errorNotPdf: string;
  errorNoPassword: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfPasswordProtectorContent: Record<
  Locale,
  PdfPasswordProtectorPageContent
> = {
  ja: {
    title:
      'PDFパスワード設定｜PDFを暗号化する無料ツール（AES-256・ブラウザで完結）',
    description:
      'PDFに開くためのパスワードを設定して暗号化できる無料ツールです。AES-256暗号化で、印刷・コピー・編集の制限も指定できます。ファイルもパスワードもブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDFパスワード設定（暗号化）',
    introHtml:
      'PDFに「開くためのパスワード」を設定し、AES-256で暗号化して保存します。ファイルもパスワードも端末の外に出ません。パスワードを解除したい場合は<a href="/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDFページ回転・削除・並び替え</a>をご利用ください。強いパスワードは<a href="/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">パスワード生成</a>で作れます。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    pagesTemplate: '{pages}ページ',
    userPasswordLabel: '開くためのパスワード（必須）',
    userPasswordHint:
      '半角英数字・記号の使用をおすすめします（PDFリーダーによっては日本語のパスワードで開けないことがあります）。',
    showPasswords: 'パスワードを表示する',
    restrictHeading: '許可する操作',
    restrictHint:
      'チェックを外した操作は、パスワードを知っていても制限されます（PDFリーダーが制限に従う場合のみ有効です）。',
    allowPrint: '印刷を許可する',
    allowCopy: 'テキスト・画像のコピーを許可する',
    allowModify: '編集（ページの追加・削除など）を許可する',
    ownerPasswordLabel: '制限解除用のパスワード（任意）',
    ownerPasswordHint:
      '空欄の場合はランダムな値が設定され、制限は誰も解除できなくなります。',
    noteHeading: 'ご注意',
    notes: [
      'パスワードを忘れると、PDFを開けなくなります。このツールではパスワードを復元できません。必ず控えを保管してください。',
      '印刷・コピー・編集の制限は、対応していないPDFリーダーやツールでは無視されることがあります。強い秘匿が必要な場合は「開くためのパスワード」に頼ってください。',
      'すでにパスワードで保護されているPDFは処理できません。',
    ],
    run: '暗号化する',
    processing: '暗号化中…',
    clear: 'クリア',
    resultHeading: '結果',
    downloadTemplate: '{name} をダウンロード',
    errorNoFile: 'PDFファイルを選択してください。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorNoPassword: '開くためのパスワードを入力してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'すでにパスワードで保護されているPDFは処理できません。先に保護を解除してください。',
    errorFailed: '暗号化に失敗しました。',
    howToHeading: '使い方',
    howToSteps: [
      'PDFファイルを選択します。',
      '「開くためのパスワード」を入力します。',
      '印刷・コピー・編集のうち許可する操作を選びます（「制限解除用のパスワード」は任意です）。',
      '「暗号化する」を押し、結果のファイルをダウンロードします。パスワードは忘れないよう控えておいてください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'AES-256',
        description:
          '現在広く使われている強力な共通鍵暗号方式です。PDF 2.0でも採用されており、総当たりでの解読は現実的ではありません（パスワード自体が短いと推測されやすくなります）。',
      },
      {
        term: '開くためのパスワード（ユーザーパスワード）',
        description: 'PDFを開くときに入力を求められるパスワードです。',
      },
      {
        term: '制限解除用のパスワード（オーナーパスワード）',
        description:
          '印刷・コピー・編集の制限を変更するためのパスワードです。制限はPDFリーダーの対応に依存します。',
      },
    ],
  },
  en: {
    title: 'Password Protect PDF – Encrypt a PDF Free (AES-256, No Upload)',
    description:
      'A free online tool to add a password to a PDF and encrypt it with AES-256. You can also restrict printing, copying and editing. Your file and password are processed in the browser and never uploaded to a server.',
    h1: 'Password Protect PDF (Encrypt)',
    introHtml:
      'Add an open password to a PDF and save it encrypted with AES-256. Your file and password never leave your device. To remove a password instead, use the <a href="/en/tools/pdf-page-editor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Page Editor</a>. Need a strong password? Generate one with the <a href="/en/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Password Generator</a>.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick a single .pdf file.',
    pagesTemplate: '{pages} pages',
    userPasswordLabel: 'Password to open the PDF (required)',
    userPasswordHint:
      'Letters, digits and symbols (ASCII) are recommended; some PDF readers cannot open files with non-ASCII passwords.',
    showPasswords: 'Show passwords',
    restrictHeading: 'Allowed actions',
    restrictHint:
      'Unchecked actions are restricted even for people who know the password (only honored by PDF readers that respect permissions).',
    allowPrint: 'Allow printing',
    allowCopy: 'Allow copying text and images',
    allowModify: 'Allow editing (adding or removing pages, etc.)',
    ownerPasswordLabel: 'Permissions password (optional)',
    ownerPasswordHint:
      'If left empty, a random value is used and nobody can lift the restrictions.',
    noteHeading: 'Please note',
    notes: [
      'If you forget the password you can no longer open the PDF, and this tool cannot recover it. Keep a copy of the password somewhere safe.',
      'Print/copy/edit restrictions may be ignored by some PDF readers and tools. For real confidentiality, rely on the open password.',
      'PDFs that are already password-protected cannot be processed.',
    ],
    run: 'Encrypt',
    processing: 'Encrypting…',
    clear: 'Clear',
    resultHeading: 'Result',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorNoPassword: 'Please enter a password to open the PDF.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'This PDF is already password-protected. Remove the protection first.',
    errorFailed: 'Encryption failed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a PDF file.',
      'Enter the password required to open the PDF.',
      'Select which actions to allow: printing, copying, and editing (the "Permissions password" is optional).',
      'Press "Encrypt" and download the result. Keep a copy of the password somewhere safe.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'AES-256',
        description:
          'A strong symmetric cipher in wide use today and part of PDF 2.0. Brute-forcing the key is impractical, though a short password is still easy to guess.',
      },
      {
        term: 'Open password (user password)',
        description: 'The password requested when opening the PDF.',
      },
      {
        term: 'Permissions password (owner password)',
        description:
          'The password that lets someone change the print/copy/edit restrictions. Restrictions depend on the PDF reader honoring them.',
      },
    ],
  },
};
