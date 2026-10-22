import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageOcrPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  /** 認識精度を保証しない旨の警告（ツール本体の直前に常時表示する） */
  disclaimer: string;
  dropLabel: string;
  dropHint: string;
  languageLabel: string;
  languageJpn: string;
  languageEng: string;
  languageJpnEng: string;
  previewAlt: string;
  /** `{name}` `{size}` を置換して使うテンプレート */
  fileInfoTemplate: string;
  recognizeButton: string;
  clearButton: string;
  /** 初回のみ言語データ（数MB）を読み込む旨の補足 */
  firstRunNote: string;
  statusLoading: string;
  /** `{percent}` を置換して使うテンプレート */
  statusRecognizingTemplate: string;
  statusDone: string;
  statusEmpty: string;
  resultLabel: string;
  /** `{percent}` を置換して使うテンプレート */
  confidenceTemplate: string;
  confidenceLowWarning: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  downloadButton: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorNotImage: string;
  errorRecognizeFailed: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imageOcrContent: Record<Locale, ImageOcrPageContent> = {
  ja: {
    title: '画像から文字抽出（OCR）｜日本語・英語対応の無料文字認識',
    description:
      '画像（スクリーンショット・写真・スキャン）の文字を日本語・英語でテキスト化する無料のOCRツールです。認識はブラウザ内で完結し、画像はサーバーに送信されません。結果はコピーやテキスト保存ができます。',
    h1: '画像から文字抽出（OCR・日本語／英語）',
    introHtml:
      '画像を選ぶだけで、写っている文字をテキストとして取り出します。スクリーンショットや書類の写真、スキャン画像に使えます。文字認識（Tesseract）をブラウザ内で動かすため、画像はサーバーに送信されません。画像内の文字を読み取りにくく加工したいときは<a href="/tools/ocr-protect-image/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">OCR対策画像加工</a>もご利用ください。',
    disclaimer:
      '認識結果の正確さは保証できません。画質・フォント・レイアウトによって誤認識や抜けが出るため、重要な内容は必ず原本と照らして確認してください。',
    dropLabel: '画像ファイル',
    dropHint:
      'クリックして選ぶか、ここにドラッグ＆ドロップ（PNG・JPEG・WebPなど、20MBまで）',
    languageLabel: '認識する言語',
    languageJpn: '日本語',
    languageEng: '英語',
    languageJpnEng: '日本語＋英語',
    previewAlt: '選択した画像のプレビュー',
    fileInfoTemplate: '{name}（{size}）',
    recognizeButton: '文字を認識する',
    clearButton: 'クリア',
    firstRunNote:
      '初回は認識エンジンと言語データ（数MB）を読み込むため、少し時間がかかります。2回目以降はブラウザに保存されたデータを使います。',
    statusLoading: '認識エンジンを読み込んでいます…',
    statusRecognizingTemplate: '認識中… {percent}%',
    statusDone: '認識が完了しました。',
    statusEmpty: '文字を検出できませんでした。',
    resultLabel: '認識結果（編集できます）',
    confidenceTemplate: '認識の信頼度: {percent}%',
    confidenceLowWarning:
      '信頼度が低めです。画像を拡大・高コントラストにする、言語を変えるなどで改善することがあります。',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloadButton: 'テキストで保存（.txt）',
    errorFileTooLargeTemplate: 'ファイルが大きすぎます（上限 {max}）。',
    errorNotImage: '画像ファイルを選んでください。',
    errorRecognizeFailed:
      '文字認識に失敗しました。HEIC・SVGなど非対応の形式（PNG・JPEG・WebP推奨）や、WebAssembly SIMDに対応しない古いブラウザでは動作しないことがあります。',
    notesHeading: '注意事項',
    notes: [
      '認識精度は保証できません。小さな文字、低解像度、斜めに写った画像、手書き、装飾の強いフォント、縦書きは特に誤りが増えます。',
      '初回のみ、認識エンジンと言語データ（日本語・英語で合計数MB）をこのサイトから読み込みます。外部サーバーとは通信しません。',
      '画像はこの端末のブラウザ内だけで処理されます。ただし、認識結果に個人情報が含まれる場合は取り扱いにご注意ください。',
      '表の罫線やレイアウトは再現されず、読み取った文字が順に並ぶだけです。',
      '対応形式はPNG・JPEG・WebP・BMP・GIFです（HEIC・SVGは非対応）。WebAssembly SIMDに対応した最近のブラウザが必要です。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを選ぶ（またはドラッグ＆ドロップ）',
      '「認識する言語」を選ぶ（迷ったら「日本語＋英語」）',
      '「文字を認識する」を押す',
      '結果を確認・修正して、コピーまたはテキスト保存する',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'OCR',
        description:
          'Optical Character Recognitionの略。画像に写った文字を、コピーや検索ができるテキストデータに変換する技術です。',
      },
      {
        term: 'Tesseract',
        description:
          'オープンソースのOCRエンジンです。このツールはTesseractをWebAssemblyで動かし、ブラウザ内で認識しています。',
      },
      {
        term: '信頼度',
        description:
          '認識結果がどれだけ確からしいかを0〜100%で表した目安です。高くても誤りが無いとは限りません。',
      },
    ],
  },
  en: {
    title: 'Image to Text (OCR) – Free Japanese & English Text Extractor',
    description:
      'Free OCR to extract English or Japanese text from images and screenshots. It runs in your browser, so your image is never uploaded. Copy or save as .txt.',
    h1: 'Image to Text (OCR for English & Japanese)',
    introHtml:
      'Pick an image and get the text in it. Works on screenshots, photos of documents and scans. The OCR engine (Tesseract) runs inside your browser, so your image is never uploaded to a server. To make text in an image harder for OCR to read, try the <a href="/en/tools/ocr-protect-image/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">OCR-Resistant Image Obfuscator</a>.',
    disclaimer:
      'Accuracy is not guaranteed. Image quality, fonts and layout can cause mistakes or missing text, so always check important content against the original.',
    dropLabel: 'Image file',
    dropHint:
      'Click to choose, or drag and drop here (PNG, JPEG, WebP and more, up to 20 MB)',
    languageLabel: 'Language to recognize',
    languageJpn: 'Japanese',
    languageEng: 'English',
    languageJpnEng: 'Japanese + English',
    previewAlt: 'Preview of the selected image',
    fileInfoTemplate: '{name} ({size})',
    recognizeButton: 'Extract text',
    clearButton: 'Clear',
    firstRunNote:
      'The first run downloads the OCR engine and language data (a few MB), so it takes a little longer. Later runs use the copy saved in your browser.',
    statusLoading: 'Loading the OCR engine…',
    statusRecognizingTemplate: 'Recognizing… {percent}%',
    statusDone: 'Done.',
    statusEmpty: 'No text was detected.',
    resultLabel: 'Recognized text (editable)',
    confidenceTemplate: 'Confidence: {percent}%',
    confidenceLowWarning:
      'Confidence is low. Enlarging the image, raising its contrast or changing the language may help.',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloadButton: 'Save as text (.txt)',
    errorFileTooLargeTemplate: 'The file is too large (limit {max}).',
    errorNotImage: 'Please choose an image file.',
    errorRecognizeFailed:
      'Text recognition failed. Formats such as HEIC or SVG (PNG, JPEG or WebP recommended) and older browsers without WebAssembly SIMD may not work.',
    notesHeading: 'Notes',
    notes: [
      'Accuracy is not guaranteed. Small text, low resolution, tilted shots, handwriting, decorative fonts and vertical text produce more errors.',
      'Only on the first run, the OCR engine and language data (a few MB for Japanese and English) are loaded from this site. No external server is contacted.',
      'Images are processed only inside your browser. If the recognized text contains personal information, handle it with care.',
      'Table borders and layout are not reproduced; the recognized text is simply listed in reading order.',
      'Supported formats are PNG, JPEG, WebP, BMP and GIF (not HEIC or SVG). A recent browser with WebAssembly SIMD support is required.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an image file (or drag and drop it)',
      'Pick the language to recognize (use "Japanese + English" if unsure)',
      'Press "Extract text"',
      'Check and fix the result, then copy it or save it as a text file',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'OCR',
        description:
          'Short for Optical Character Recognition. Technology that turns text in an image into text data you can copy and search.',
      },
      {
        term: 'Tesseract',
        description:
          'An open-source OCR engine. This tool runs Tesseract as WebAssembly so recognition happens inside your browser.',
      },
      {
        term: 'Confidence',
        description:
          'A 0–100% guide to how certain the engine is about its result. A high value does not guarantee there are no mistakes.',
      },
    ],
  },
};
