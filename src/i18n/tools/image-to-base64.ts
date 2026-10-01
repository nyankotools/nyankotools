import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageToBase64PageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  modeLabel: string;
  modeEncode: string;
  modeDecode: string;
  encodeDropLabel: string;
  encodeDropHint: string;
  /** `{name}` `{type}` `{size}` を置換して使うテンプレート */
  encodeFileInfoTemplate: string;
  encodeOutputStyleLabel: string;
  encodeOutputStyleDataUrl: string;
  encodeOutputStyleBase64Only: string;
  encodeOutputLabel: string;
  copyButton: string;
  copiedMessage: string;
  copyFailedMessage: string;
  downloadButton: string;
  clearButton: string;
  errorUnsupportedFile: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorReadFailed: string;
  decodeInputLabel: string;
  decodeInputPlaceholder: string;
  decodePreviewLabel: string;
  /** `{type}` `{size}` を置換して使うテンプレート */
  decodeInfoTemplate: string;
  decodeDownloadButton: string;
  decodeErrorMessage: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imageToBase64Content: Record<Locale, ImageToBase64PageContent> = {
  ja: {
    title: '画像のBase64（Data URL）変換 無料ツール',
    description:
      '画像ファイルをBase64文字列・Data URLに変換したり、Base64文字列やData URLを画像に戻して保存できる無料ツールです。CSSやJSON・HTMLへの画像埋め込みに便利。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像のBase64（Data URL）変換',
    introHtml:
      '画像ファイルを選択すると、そのままBase64文字列またはData URL形式に変換します（画質の劣化や再圧縮はありません）。逆にBase64文字列やData URLを画像に戻したい場合は「Base64→画像」を選んでください。CSS/JS用の文字列変換には<a href="/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64エンコード/デコード</a>、画像の形式変換・圧縮には<a href="/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像フォーマット変換</a>もあわせてご利用ください。',
    modeLabel: 'モード',
    modeEncode: '画像→Base64',
    modeDecode: 'Base64→画像',
    encodeDropLabel: '画像ファイルを選択',
    encodeDropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    encodeFileInfoTemplate: '{name}（{type}・{size}）',
    encodeOutputStyleLabel: '出力形式',
    encodeOutputStyleDataUrl: 'Data URL',
    encodeOutputStyleBase64Only: 'Base64のみ',
    encodeOutputLabel: '変換結果',
    copyButton: 'コピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーに失敗しました',
    downloadButton: 'テキストとしてダウンロード',
    clearButton: 'クリア',
    errorUnsupportedFile: '画像ファイルを選択してください',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorReadFailed: 'ファイルの読み込みに失敗しました',
    decodeInputLabel: 'Base64文字列 / Data URL',
    decodeInputPlaceholder:
      'data:image/png;base64,... または Base64文字列のみを貼り付け',
    decodePreviewLabel: 'プレビュー',
    decodeInfoTemplate: '{type}・{size}',
    decodeDownloadButton: '画像としてダウンロード',
    decodeErrorMessage:
      '画像として解釈できませんでした。Base64文字列またはData URLの形式を確認してください。',
    notesHeading: '注意点',
    notes: [
      '「画像→Base64」はCanvasでの再エンコードを行わないため、SVGやICOを含む元画像のバイト列をそのままBase64に変換します（画質劣化・アニメーションGIFの欠落もありません）。',
      'Base64化すると元のファイルサイズよりおよそ1.33倍（4/3倍）大きくなります。特にHTML・CSS・JSONへの埋め込みではファイルサイズの増加に注意してください。',
      '「Base64→画像」はプレフィックス（data:image/xxx;base64,）が無いBase64文字列でも、先頭バイト（マジックナンバー）からPNG/JPEG/GIF/WebP/BMP/SVG/ICOを自動判定します。判定できない場合はエラーになります。',
      'すべての処理はブラウザ内で完結し、選択した画像やBase64文字列がサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Base64',
        description:
          '画像などのバイナリデータを、英数字と一部の記号（A-Z, a-z, 0-9, +, /, =）のみの文字列に変換するエンコード方式です。テキストしか扱えない環境（CSS・JSON・メールなど）に画像データを埋め込む際によく使われます。',
      },
      {
        term: 'Data URL',
        description:
          '`data:image/png;base64,...` のように、データの種類（MIMEタイプ）とBase64化した中身を1つのURL文字列にまとめた形式です。`<img src="...">`やCSSの`background-image`にそのまま指定でき、外部ファイルを別途読み込まずに画像を表示できます。',
      },
      {
        term: 'MIMEタイプ',
        description:
          'ファイルの種類を表す識別子で、画像なら`image/png`や`image/jpeg`のように表されます。Data URLの先頭部分に含まれ、ブラウザがデータをどう解釈すべきかを判断する手がかりになります。',
      },
    ],
  },
  en: {
    title: 'Image to Base64 / Data URL Converter',
    description:
      'Convert an image to a Base64 string or Data URL, or turn Base64 back into an image file. Runs in your browser; nothing is uploaded to a server.',
    h1: 'Image to Base64 (Data URL) Converter',
    introHtml:
      'Select an image file to convert it directly to a Base64 string or Data URL, with no re-compression or quality loss. Switch to "Base64 to Image" to turn a Base64 string or Data URL back into a downloadable image. For plain text conversion, try the <a href="/en/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64 Encoder/Decoder</a>; for format conversion and compression, see the <a href="/en/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Format Converter</a>.',
    modeLabel: 'Mode',
    modeEncode: 'Image to Base64',
    modeDecode: 'Base64 to Image',
    encodeDropLabel: 'Choose an image file',
    encodeDropHint: 'You can also drag and drop an image file here',
    encodeFileInfoTemplate: '{name} ({type}, {size})',
    encodeOutputStyleLabel: 'Output format',
    encodeOutputStyleDataUrl: 'Data URL',
    encodeOutputStyleBase64Only: 'Base64 only',
    encodeOutputLabel: 'Result',
    copyButton: 'Copy',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Copy failed',
    downloadButton: 'Download as text',
    clearButton: 'Clear',
    errorUnsupportedFile: 'Please select an image file',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    errorReadFailed: 'Failed to read the file',
    decodeInputLabel: 'Base64 string / Data URL',
    decodeInputPlaceholder:
      'Paste a data:image/png;base64,... URL or a raw Base64 string',
    decodePreviewLabel: 'Preview',
    decodeInfoTemplate: '{type}, {size}',
    decodeDownloadButton: 'Download as image',
    decodeErrorMessage:
      "Couldn't parse this as an image. Please check the Base64 string or Data URL format.",
    notesHeading: 'Notes',
    notes: [
      '"Image to Base64" does not re-encode via canvas, so the original bytes (including SVG and ICO files) are converted to Base64 as-is, with no quality loss and no dropped GIF animation.',
      'Base64 encoding increases the size by roughly 1.33x (4/3) over the original file. Keep this in mind when embedding images in HTML, CSS, or JSON.',
      '"Base64 to Image" auto-detects PNG, JPEG, GIF, WebP, BMP, SVG, and ICO from the leading bytes (magic number), even without a data:image/xxx;base64, prefix. If the type cannot be determined, an error is shown.',
      'All processing happens in your browser — the image or Base64 string you provide is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Base64',
        description:
          'An encoding scheme that converts binary data, such as an image, into a string using only letters, digits, and a few symbols (A-Z, a-z, 0-9, +, /, =). Commonly used to embed binary data in text-only formats like CSS, JSON, or email.',
      },
      {
        term: 'Data URL',
        description:
          'A URL such as `data:image/png;base64,...` that bundles a MIME type and Base64-encoded content into a single string. It can be used directly as an `<img src="...">` or a CSS `background-image`, displaying the image without a separate file request.',
      },
      {
        term: 'MIME type',
        description:
          "An identifier describing a file's type, such as `image/png` or `image/jpeg` for images. It appears at the start of a Data URL and tells the browser how to interpret the data that follows.",
      },
    ],
  },
};
