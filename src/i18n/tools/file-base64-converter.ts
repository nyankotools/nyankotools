import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FileBase64ConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  modeLabel: string;
  modeEncode: string;
  modeDecode: string;
  encodeDropLabel: string;
  encodeDropHint: string;
  /** `{name}` `{type}` `{size}` を置換して使うテンプレート */
  encodeFileInfoTemplate: string;
  encodeOutputStyleLabel: string;
  encodeOutputStyleDataUri: string;
  encodeOutputStyleBase64Only: string;
  encodeWrapLabel: string;
  encodeOutputLabel: string;
  copyButton: string;
  copiedMessage: string;
  copyFailedMessage: string;
  downloadButton: string;
  clearButton: string;
  /** `{size}` `{max}` を置換して使う */
  warnLargeTemplate: string;
  /** `{max}` を置換して使う */
  errorFileTooLargeTemplate: string;
  errorReadFailed: string;
  decodeInputLabel: string;
  decodeInputPlaceholder: string;
  decodeFileNameLabel: string;
  decodeFileNameHint: string;
  decodeResultLabel: string;
  /** `{type}` `{size}` を置換して使うテンプレート */
  decodeInfoTemplate: string;
  decodeTypeGuessedNote: string;
  decodeDownloadButton: string;
  decodeErrorMessage: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const linkClass =
  'text-blue-700 underline hover:no-underline dark:text-blue-400';

export const fileBase64ConverterContent: Record<
  Locale,
  FileBase64ConverterPageContent
> = {
  ja: {
    title: 'ファイルのBase64・Data URI変換（PDF・音声・フォントも）',
    description:
      'PDF・音声・フォント・ZIPなど任意のファイルをBase64文字列やData URIに変換し、Base64からファイルに戻して保存できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ファイルのBase64・Data URI変換',
    introHtml: `PDF・音声・フォント・ZIPなど、画像に限らず任意のファイルをBase64文字列またはData URIに変換します。逆にBase64文字列やData URIをファイルに戻してダウンロードすることもできます。画像だけを扱う場合はプレビュー付きの<a href="/tools/image-to-base64/" class="${linkClass}">画像のBase64変換</a>、テキストの変換には<a href="/tools/base64/" class="${linkClass}">Base64エンコード/デコード</a>が便利です。`,
    howToHeading: '使い方',
    howToSteps: [
      'モードで「ファイル→Base64」か「Base64→ファイル」を選びます。',
      '「ファイル→Base64」では、ファイルを選択するかドラッグ＆ドロップし、出力形式（「Data URI」または「Base64のみ」）を選んで「コピー」します。',
      '「Base64→ファイル」では、Base64文字列またはData URIを貼り付け、必要ならファイル名を入力して「ファイルとしてダウンロード」を押します。',
    ],
    modeLabel: 'モード',
    modeEncode: 'ファイル→Base64',
    modeDecode: 'Base64→ファイル',
    encodeDropLabel: 'ファイルを選択',
    encodeDropHint:
      'ここにファイルをドラッグ＆ドロップすることもできます（形式は問いません）',
    encodeFileInfoTemplate: '{name}（{type}・{size}）',
    encodeOutputStyleLabel: '出力形式',
    encodeOutputStyleDataUri: 'Data URI',
    encodeOutputStyleBase64Only: 'Base64のみ',
    encodeWrapLabel: '76文字ごとに改行する（Base64のみ）',
    encodeOutputLabel: '変換結果',
    copyButton: 'コピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーに失敗しました',
    downloadButton: 'テキストとしてダウンロード',
    clearButton: 'クリア',
    warnLargeTemplate:
      'ファイルサイズが {size} あります。変換結果は約1.33倍の長さになるため、表示やコピーに時間がかかったりブラウザが重くなったりすることがあります（上限は {max}）。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorReadFailed: 'ファイルの読み込みに失敗しました',
    decodeInputLabel: 'Base64文字列 / Data URI',
    decodeInputPlaceholder:
      'data:application/pdf;base64,... または Base64文字列のみを貼り付け',
    decodeFileNameLabel: 'ファイル名（拡張子なしでも可）',
    decodeFileNameHint: '空欄なら file に自動で拡張子を付けます',
    decodeResultLabel: '復元結果',
    decodeInfoTemplate: '{type}・{size}',
    decodeTypeGuessedNote:
      '※種類はデータの先頭バイトから推定しています。違う場合はファイル名に拡張子を入力してください。',
    decodeDownloadButton: 'ファイルとしてダウンロード',
    decodeErrorMessage:
      'ファイルに変換できませんでした。Base64文字列またはData URIの形式を確認してください。',
    notesHeading: '注意点',
    notes: [
      'ファイルのバイト列をそのままBase64にするため、再圧縮や画質劣化はありません。Base64化すると元のサイズの約1.33倍（4/3倍）の長さになります。',
      '5MBを超えるファイルでは警告を表示し、30MBを超えるファイルは変換できません。巨大なBase64文字列はコピーや貼り付けでブラウザが重くなることがあります。',
      '「Base64→ファイル」はBase64URL（- と _）、改行や空白の混在、末尾のパディング（=）の欠落にも対応します。Data URIがdata:text/plain,Hello%20World のようなパーセントエンコード形式でも復元できます。',
      'プレフィックスのないBase64は、先頭バイトからPDF・ZIP・画像・音声・フォントなどを推定します。推定できない場合はバイナリ（.bin）として保存されるので、ファイル名に拡張子を付けてください。',
      'すべての処理はブラウザ内で完結し、選択したファイルやBase64文字列がサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Base64',
        description:
          'バイナリデータを英数字と一部の記号（A-Z, a-z, 0-9, +, /, =）だけの文字列に変換するエンコード方式です。テキストしか扱えないJSONやメール、HTMLなどにファイルを埋め込むときに使われます。',
      },
      {
        term: 'Data URI',
        description:
          '`data:application/pdf;base64,...` のように、データの種類（MIMEタイプ）と中身を1つのURL文字列にまとめた形式です。外部ファイルを読み込まずにブラウザへデータを渡せます。',
      },
      {
        term: 'MIMEタイプ',
        description:
          'ファイルの種類を表す識別子です。PDFなら`application/pdf`、MP3なら`audio/mpeg`のように表し、ブラウザがデータをどう扱うかの手がかりになります。',
      },
      {
        term: 'マジックナンバー',
        description:
          'ファイル形式ごとに決まっている先頭数バイトの目印です。PDFは`%PDF-`、ZIPは`PK`で始まります。拡張子やMIMEタイプが分からないとき、形式の推定に使います。',
      },
    ],
  },
  en: {
    title: 'File to Base64 / Data URI Converter (Any File)',
    description:
      'Convert any file (PDF, audio, fonts, ZIP) to Base64 or a Data URI, or decode Base64 back into a downloadable file. Runs in your browser; nothing is uploaded.',
    h1: 'File to Base64 / Data URI Converter',
    introHtml: `Convert any file, not just images, to a Base64 string or Data URI: PDF, audio, fonts, ZIP and more. You can also paste a Base64 string or Data URI and download it back as a file. For images only, with a preview, use the <a href="/en/tools/image-to-base64/" class="${linkClass}">Image to Base64 Converter</a>; for plain text, try the <a href="/en/tools/base64/" class="${linkClass}">Base64 Encoder/Decoder</a>.`,
    howToHeading: 'How to use',
    howToSteps: [
      'Pick "File to Base64" or "Base64 to File" with the mode switch.',
      'For "File to Base64", choose or drop a file, pick the output format ("Data URI" or "Base64 only"), then press "Copy".',
      'For "Base64 to File", paste the Base64 string or Data URI, optionally type a file name, and press "Download as file".',
    ],
    modeLabel: 'Mode',
    modeEncode: 'File to Base64',
    modeDecode: 'Base64 to File',
    encodeDropLabel: 'Choose a file',
    encodeDropHint: 'You can also drag and drop any file here',
    encodeFileInfoTemplate: '{name} ({type}, {size})',
    encodeOutputStyleLabel: 'Output format',
    encodeOutputStyleDataUri: 'Data URI',
    encodeOutputStyleBase64Only: 'Base64 only',
    encodeWrapLabel: 'Wrap every 76 characters (Base64 only)',
    encodeOutputLabel: 'Result',
    copyButton: 'Copy',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Copy failed',
    downloadButton: 'Download as text',
    clearButton: 'Clear',
    warnLargeTemplate:
      'This file is {size}. The result is about 1.33x longer, so showing or copying it may be slow and the browser may lag (limit: {max}).',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    errorReadFailed: 'Failed to read the file',
    decodeInputLabel: 'Base64 string / Data URI',
    decodeInputPlaceholder:
      'Paste a data:application/pdf;base64,... URI or a raw Base64 string',
    decodeFileNameLabel: 'File name (extension optional)',
    decodeFileNameHint: 'If empty, "file" plus a detected extension is used',
    decodeResultLabel: 'Decoded file',
    decodeInfoTemplate: '{type}, {size}',
    decodeTypeGuessedNote:
      'The type was guessed from the first bytes of the data. If it is wrong, type a file name with the right extension.',
    decodeDownloadButton: 'Download as file',
    decodeErrorMessage:
      "Couldn't decode this as a file. Please check the Base64 string or Data URI format.",
    notesHeading: 'Notes',
    notes: [
      'The file bytes are encoded as-is, so there is no re-compression or quality loss. Base64 output is about 1.33x (4/3) longer than the original.',
      'Files over 5 MB show a warning and files over 30 MB cannot be converted. Very long Base64 strings can make copying and pasting slow in the browser.',
      '"Base64 to File" accepts Base64URL (- and _), mixed line breaks and spaces, and missing padding (=). It also decodes percent-encoded Data URIs such as data:text/plain,Hello%20World.',
      'For Base64 without a prefix, the type (PDF, ZIP, image, audio, font and so on) is guessed from the first bytes. If it cannot be guessed, the file is saved as .bin, so add an extension in the file name.',
      'All processing happens in your browser. The file or Base64 string you provide is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Base64',
        description:
          'An encoding that turns binary data into a string of letters, digits and a few symbols (A-Z, a-z, 0-9, +, /, =). It is used to embed files in text-only formats such as JSON, email or HTML.',
      },
      {
        term: 'Data URI',
        description:
          'A URL such as `data:application/pdf;base64,...` that bundles a MIME type and the content into one string, so data can be handed to the browser without a separate file request.',
      },
      {
        term: 'MIME type',
        description:
          'An identifier for a file type, such as `application/pdf` for PDF or `audio/mpeg` for MP3. It tells the browser how to treat the data.',
      },
      {
        term: 'Magic number',
        description:
          'A few fixed bytes at the start of a file that identify its format. PDF starts with `%PDF-` and ZIP starts with `PK`. They are used to guess a type when no extension or MIME type is known.',
      },
    ],
  },
};
