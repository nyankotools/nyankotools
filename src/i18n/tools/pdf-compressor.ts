import type { Locale } from '../../data/tools';

export interface PdfCompressorPageContent {
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
  levelLabel: string;
  levelHigh: string;
  levelMedium: string;
  levelLow: string;
  noteHeading: string;
  notes: string[];
  run: string;
  processing: string;
  /** {done} {total} を置換 */
  progressTemplate: string;
  clear: string;
  resultHeading: string;
  /** {original} {output} {percent} を置換 */
  reducedTemplate: string;
  /** {original} {output} を置換 */
  largerTemplate: string;
  /** {name} を置換 */
  downloadTemplate: string;
  errorNoFile: string;
  errorNotPdf: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfCompressorContent: Record<Locale, PdfCompressorPageContent> = {
  ja: {
    title: 'PDF圧縮｜ファイルサイズを小さくする無料ツール（ブラウザで完結）',
    description:
      'PDFのファイルサイズを小さくできる無料の圧縮ツールです。各ページを画像として再圧縮し、メール添付やアップロード制限に対応できます。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDF圧縮（ファイルサイズ削減）',
    introHtml:
      'PDFの各ページを画像として再圧縮し、ファイルサイズを小さくします。ファイルは端末の外に出ません。不要なページを減らしたい場合は<a href="/tools/pdf-merge-split/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF結合・分割・ページ抽出</a>もご利用ください。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    pagesTemplate: '{pages}ページ',
    levelLabel: '圧縮レベル',
    levelHigh: '低圧縮（高画質・144dpi）',
    levelMedium: '標準（108dpi）',
    levelLow: '高圧縮（低画質・72dpi）',
    noteHeading: 'ご注意',
    notes: [
      '圧縮後のPDFは各ページが画像になるため、文字の選択・検索・コピーができなくなります。',
      'リンクやしおり、フォームなどの機能も失われます。',
      '写真やスキャン画像が中心のPDFでは効果が大きく、文字中心のPDFでは元より大きくなることがあります。',
    ],
    run: '圧縮する',
    processing: '圧縮中…',
    progressTemplate: '{done} / {total} ページ',
    clear: 'クリア',
    resultHeading: '結果',
    reducedTemplate: '{original} → {output}（{percent}%削減）',
    largerTemplate:
      '{original} → {output}（元より大きくなりました。元のPDFのままのほうが小さい可能性があります）',
    downloadTemplate: '{name} をダウンロード',
    errorNoFile: 'PDFファイルを選択してください。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'パスワードで保護されたPDFは処理できません。保護を解除してからお試しください。',
    errorFailed: '処理に失敗しました。',
    howToHeading: '使い方',
    howToSteps: [
      'PDFファイルを選択します。',
      '圧縮レベル（低圧縮・標準・高圧縮）を選びます。',
      '「圧縮する」を押します。ページ数が多いと時間がかかります。',
      '削減前後のサイズを確認し、結果のファイルをダウンロードします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'dpi（解像度）',
        description:
          '1インチあたりの画素数です。値が小さいほど画像の細かさは落ちますが、ファイルサイズは小さくなります。',
      },
      {
        term: 'JPEG圧縮',
        description:
          '写真向きの非可逆圧縮です。品質を下げるほどファイルサイズは小さくなりますが、文字の周りにノイズが出やすくなります。',
      },
      {
        term: '暗号化（パスワード保護）PDF',
        description:
          '開くためにパスワードが必要なPDFです。このツールではパスワード保護されたPDFは扱えません。',
      },
    ],
  },
  en: {
    title: 'Compress PDF – Reduce File Size Free, No Upload',
    description:
      'A free online tool to make a PDF smaller. Each page is recompressed as an image so the file fits email and upload limits. Your file is processed in the browser and never uploaded to a server.',
    h1: 'PDF Compressor (Reduce File Size)',
    introHtml:
      'Shrink a PDF by recompressing each page as an image. Your file never leaves your device. To drop pages you do not need first, use the <a href="/en/tools/pdf-merge-split/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Merge, Split & Extract</a> tool.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Pick a single .pdf file.',
    pagesTemplate: '{pages} pages',
    levelLabel: 'Compression level',
    levelHigh: 'Light (high quality, 144 dpi)',
    levelMedium: 'Standard (108 dpi)',
    levelLow: 'Strong (low quality, 72 dpi)',
    noteHeading: 'Please note',
    notes: [
      'Each page becomes an image, so text can no longer be selected, searched or copied.',
      'Links, bookmarks and form fields are also lost.',
      'Photo-heavy and scanned PDFs shrink a lot; text-heavy PDFs may even get larger.',
    ],
    run: 'Compress',
    processing: 'Compressing…',
    progressTemplate: 'Page {done} / {total}',
    clear: 'Clear',
    resultHeading: 'Result',
    reducedTemplate: '{original} → {output} ({percent}% smaller)',
    largerTemplate:
      '{original} → {output} (larger than the original — keeping the original PDF may be better)',
    downloadTemplate: 'Download {name}',
    errorNoFile: 'Please choose a PDF file.',
    errorNotPdf: 'Please choose a PDF (.pdf) file.',
    errorInvalid: 'Could not read this as a PDF. The file may be corrupted.',
    errorEncrypted:
      'Password-protected PDFs cannot be processed. Remove the protection first and try again.',
    errorFailed: 'Processing failed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a PDF file.',
      'Pick a compression level (Light, Standard, or Strong).',
      'Press "Compress". Files with many pages take longer.',
      'Check the before/after sizes, then download the result.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'dpi (resolution)',
        description:
          'Dots per inch. A lower value loses image detail but produces a smaller file.',
      },
      {
        term: 'JPEG compression',
        description:
          'Lossy compression suited to photos. Lower quality means a smaller file but more noise around text.',
      },
      {
        term: 'Encrypted (password-protected) PDF',
        description:
          'A PDF that requires a password to open. This tool cannot process password-protected PDFs.',
      },
    ],
  },
};
