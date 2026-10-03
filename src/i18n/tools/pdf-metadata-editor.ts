import type { Locale } from '../../data/tools';

export interface PdfMetadataEditorPageContent {
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
  editorHeading: string;
  editorHint: string;
  titleLabel: string;
  authorLabel: string;
  subjectLabel: string;
  keywordsLabel: string;
  creatorLabel: string;
  producerLabel: string;
  creationDateLabel: string;
  modificationDateLabel: string;
  removeXmpLabel: string;
  clearFields: string;
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
  errorBadDate: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfMetadataEditorContent: Record<
  Locale,
  PdfMetadataEditorPageContent
> = {
  ja: {
    title:
      'PDFメタデータ編集（タイトル・作成者・日付）｜ブラウザで完結する無料ツール',
    description:
      'PDFのタイトル・作成者・件名・キーワード・作成日時などの文書情報を確認・編集・削除できる無料ツールです。公開前の個人情報の消去にも。PDFはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDFメタデータ編集',
    introHtml:
      'PDFに埋め込まれたタイトル・作成者・件名・キーワード・作成ソフト・作成日時などの文書情報（メタデータ）を確認し、書き換えたり消したりして保存できます。作成者名やファイルの履歴を公開前に消したいときにも便利です。ファイルは端末の外に出ません。ページの内容を隠したいときは<a href="/tools/pdf-redactor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF黒塗り</a>をご利用ください。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    infoTemplate: '{pages}ページ',
    editorHeading: '文書情報',
    editorHint: '空欄にした項目は、保存するPDFから削除されます。',
    titleLabel: 'タイトル',
    authorLabel: '作成者',
    subjectLabel: '件名',
    keywordsLabel: 'キーワード',
    creatorLabel: '作成アプリケーション',
    producerLabel: 'PDF変換ソフト',
    creationDateLabel: '作成日時',
    modificationDateLabel: '更新日時',
    removeXmpLabel: 'XMPメタデータも削除する（古い情報が残るのを防ぎます）',
    clearFields: 'すべての項目を空にする',
    run: '保存用PDFを作成',
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
    errorBadDate: '日時の形式が正しくありません。',
    errorFailed: '処理に失敗しました。',
    howToHeading: '使い方',
    howToSteps: [
      'PDFファイルを選択すると、現在の文書情報が表示されます。',
      '書き換えたい項目を編集します。消したい項目は空欄にするか、「すべての項目を空にする」を押します。',
      '「保存用PDFを作成」を押します。',
      '結果に表示されたファイルをダウンロードします。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ここで編集できるのはPDFの文書情報（タイトル・作成者など）だけです。ページ内に書かれた文字や、画像に埋め込まれた情報（Exifなど）は変わりません。',
      '「XMPメタデータも削除する」にチェックがないと、PDF内のXMPメタデータに古いタイトルや作成者が残ることがあります。通常はチェックを入れたままにしてください。',
      '「保存用PDFを作成」を押しても元のファイルは変更されず、文書情報を書き換えた新しいPDFが作られます。',
      'パスワードで保護されたPDFは扱えません。先に解除してからご利用ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'メタデータ（文書情報）',
        description:
          'PDFファイルに付随するタイトル・作成者・作成日時などの属性情報です。ページの見た目には表示されませんが、PDFビューアのプロパティ画面などで確認できます。',
      },
      {
        term: 'XMPメタデータ',
        description:
          'Adobeが策定した、XML形式で埋め込むメタデータです。文書情報と同じ内容が重複して入っていることがあり、片方だけ消すと古い情報が残る場合があります。',
      },
    ],
  },
  en: {
    title: 'PDF Metadata Editor (Title, Author, Dates) – Free, No Upload',
    description:
      'View, edit or remove a PDF’s title, author, keywords and dates. Clear personal details before sharing. Runs in your browser; no upload.',
    h1: 'PDF Metadata Editor',
    introHtml:
      'See the document properties embedded in a PDF (title, author, subject, keywords, creating software, dates), then edit or remove them and save a new file. Useful for clearing an author name or file history before you share a document. Your file never leaves your device. To hide content on the pages themselves, use the <a href="/en/tools/pdf-redactor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Redactor</a>.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick one .pdf file.',
    infoTemplate: '{pages}-page PDF',
    editorHeading: 'Document properties',
    editorHint: 'Fields left empty are removed from the saved PDF.',
    titleLabel: 'Title',
    authorLabel: 'Author',
    subjectLabel: 'Subject',
    keywordsLabel: 'Keywords',
    creatorLabel: 'Creator application',
    producerLabel: 'PDF producer',
    creationDateLabel: 'Created',
    modificationDateLabel: 'Modified',
    removeXmpLabel:
      'Also remove XMP metadata (avoids leaving old values behind)',
    clearFields: 'Empty all fields',
    run: 'Create PDF',
    processing: 'Processing…',
    clear: 'Clear',
    resultHeading: 'Result',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'This PDF is password-protected. Unlock it first with the PDF Page Editor.',
    errorBadDate: 'The date or time is not valid.',
    errorFailed: 'Processing failed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a PDF file. Its current properties are shown.',
      'Edit the fields you want to change. Leave a field empty to remove it, or press "Empty all fields".',
      'Press "Create PDF".',
      'Download the file shown under the result.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Only the PDF’s document properties (title, author and so on) are edited. Text written on the pages and information embedded in images (such as Exif) are not changed.',
      'If "Also remove XMP metadata" is unchecked, old titles and authors can remain in the PDF’s XMP metadata. Normally leave it checked.',
      'Pressing "Create PDF" does not change your original file; it creates a new PDF with the properties rewritten.',
      'Password-protected PDFs are not supported. Unlock them first.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Metadata (document properties)',
        description:
          'Attributes attached to a PDF such as title, author and creation date. They are not drawn on the page but show up in a PDF viewer’s properties dialog.',
      },
      {
        term: 'XMP metadata',
        description:
          'An XML-based metadata format defined by Adobe. It often duplicates the document properties, so removing only one copy can leave the old values readable.',
      },
    ],
  },
};
