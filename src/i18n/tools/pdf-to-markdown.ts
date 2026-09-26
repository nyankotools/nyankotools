import type { Locale } from '../../data/tools';

export interface PdfToMarkdownPageContent {
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
  optionsLabel: string;
  optHeaderFooter: string;
  optTables: string;
  optPageSeparator: string;
  run: string;
  processing: string;
  clear: string;
  resultHeading: string;
  /** {pages} {chars} {tables} を置換 */
  statsTemplate: string;
  markdownLabel: string;
  copy: string;
  copied: string;
  download: string;
  /** {pages} を置換（ページ番号の列挙） */
  warnEmptyPages: string;
  warnNoText: string;
  errorNotPdf: string;
  errorInvalid: string;
  errorEncrypted: string;
  errorFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const pdfToMarkdownContent: Record<Locale, PdfToMarkdownPageContent> = {
  ja: {
    title: 'PDFをMarkdownに変換｜表・見出し対応の無料ツール（ブラウザ完結）',
    description:
      'PDFのテキストを見出し・段落・箇条書き・表を推定してMarkdownに変換する無料ツールです。ChatGPTなどのAIに読ませる前処理にも。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PDFをMarkdownに変換',
    introHtml:
      'PDFから文字を取り出し、文字サイズや位置をもとに見出し・段落・箇条書き・表を推定してMarkdownにします。AIに読ませる前処理やドキュメントの再利用に便利です。ファイルは端末の外に出ません。PDFを画像にしたい場合は<a href="/tools/pdf-image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF⇔画像変換</a>をご利用ください。',
    fileLabel: 'PDFファイルを選択',
    dropHint: 'ここにPDFファイルをドラッグ＆ドロップすることもできます',
    fileHint: '.pdfファイルを1つ選んでください。',
    pagesTemplate: '{pages}ページ',
    optionsLabel: '変換オプション',
    optHeaderFooter: 'ヘッダー・フッター・ページ番号を除去する',
    optTables: '表を検出してMarkdownの表にする',
    optPageSeparator: 'ページの境目に水平線（---）を入れる',
    run: '変換',
    processing: '変換中…',
    clear: 'クリア',
    resultHeading: '変換結果',
    statsTemplate: '{pages}ページ・{chars}文字・表{tables}件',
    markdownLabel: 'Markdown',
    copy: 'コピー',
    copied: 'コピーしました',
    download: '.mdをダウンロード',
    warnEmptyPages:
      '文字情報がないページ: {pages}（画像のみのページの可能性があります）。',
    warnNoText:
      'このPDFには文字情報がありません。スキャンした画像のPDFはOCR（文字認識）が必要なため、このツールでは変換できません。',
    errorNotPdf: 'PDFファイル（.pdf）を選択してください。',
    errorInvalid:
      'PDFとして読み込めませんでした。ファイルが破損している可能性があります。',
    errorEncrypted:
      'パスワードで保護されたPDFは処理できません。保護を解除してからお試しください。',
    errorFailed: '処理に失敗しました。',
    notesHeading: '変換の精度と注意点',
    notes: [
      '文字情報を持つPDFが対象です。スキャンした画像のPDFはOCRが必要なため変換できません。',
      '見出しは本文より大きい文字と太字だけの短い行から、表は桁の揃った行から推定します。PDFの作り方によっては正しく認識できないことがあります。',
      'セルの結合や、セル内で改行された表は崩れることがあります。変換後に内容を確認してください。',
      '2段組みは左の段から順に読みますが、図や囲み記事が混在するレイアウトでは読み順が乱れることがあります。',
      '図・画像・数式は変換されません。縦書きのPDFにも対応していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Markdown',
        description:
          '「#」で見出し、「-」で箇条書き、「|」で表を書く軽量なマークアップ記法です。GitHubやNotion、多くのメモアプリで使えます。',
      },
      {
        term: 'OCR（光学文字認識）',
        description:
          '画像に写った文字をテキストとして読み取る技術です。スキャンしたPDFは文字ではなく画像なので、OCRをかけないとテキストを取り出せません。',
      },
      {
        term: 'GFM（GitHub Flavored Markdown）',
        description:
          'GitHubが拡張したMarkdown記法で、表（|区切り）や取り消し線などが使えます。このツールの表はGFM形式で出力します。',
      },
    ],
  },
  en: {
    title: 'PDF to Markdown Converter with Tables | Free, Runs in Your Browser',
    description:
      'Convert PDF text to Markdown, detecting headings, paragraphs, lists and tables. Handy for preparing documents for ChatGPT and other AI tools. Files are processed in your browser and never uploaded.',
    h1: 'PDF to Markdown Converter',
    introHtml:
      'Extracts text from a PDF and uses font sizes and positions to rebuild headings, paragraphs, lists and tables as Markdown. Useful for feeding documents to AI tools or reusing their content. Your file never leaves your device. To turn pages into images instead, try the <a href="/en/tools/pdf-image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF ⇔ Image Converter</a>.',
    fileLabel: 'Choose a PDF file',
    dropHint: 'You can also drag and drop a PDF file here',
    fileHint: 'Choose one .pdf file.',
    pagesTemplate: '{pages} pages',
    optionsLabel: 'Options',
    optHeaderFooter: 'Remove headers, footers and page numbers',
    optTables: 'Detect tables and output Markdown tables',
    optPageSeparator: 'Insert a horizontal rule (---) between pages',
    run: 'Convert',
    processing: 'Converting…',
    clear: 'Clear',
    resultHeading: 'Result',
    statsTemplate: '{pages} pages · {chars} characters · {tables} tables',
    markdownLabel: 'Markdown',
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download .md',
    warnEmptyPages:
      'No text found on page(s): {pages}. They may be image-only pages.',
    warnNoText:
      'This PDF has no text layer. Scanned PDFs need OCR (text recognition), which this tool does not support.',
    errorNotPdf: 'Please choose a PDF file (.pdf).',
    errorInvalid: 'Could not read this file as a PDF. It may be corrupted.',
    errorEncrypted:
      'Password-protected PDFs cannot be processed. Remove the protection and try again.',
    errorFailed: 'Processing failed.',
    notesHeading: 'Accuracy and limitations',
    notes: [
      'Works on PDFs that contain text. Scanned image PDFs need OCR and cannot be converted.',
      'Headings are inferred from larger text and short bold-only lines, and tables from aligned columns. Depending on how the PDF was made, they may not be recognized correctly.',
      'Merged cells and cells with wrapped text may break a table. Please review the output.',
      'Two-column pages are read left column first, but layouts mixing figures and sidebars can come out in the wrong order.',
      'Figures, images and equations are not converted. Vertical (tategaki) text is not supported.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Markdown',
        description:
          'A lightweight markup syntax: "#" for headings, "-" for bullet lists and "|" for tables. It is supported by GitHub, Notion and many note-taking apps.',
      },
      {
        term: 'OCR (optical character recognition)',
        description:
          'Technology that reads text from images. A scanned PDF holds pictures rather than text, so it must go through OCR before its text can be extracted.',
      },
      {
        term: 'GFM (GitHub Flavored Markdown)',
        description:
          'GitHub’s extension of Markdown that adds pipe-delimited tables, strikethrough and more. This tool writes tables in GFM format.',
      },
    ],
  },
};
