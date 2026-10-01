import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface LineEndingConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  loadFileLabel: string;
  dropHint: string;
  loadedFileTemplate: string;
  inputLabel: string;
  inputPlaceholder: string;
  textareaNote: string;
  targetLabel: string;
  targetLf: string;
  targetCrlf: string;
  targetCr: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  downloadButton: string;
  downloaded: string;
  resultLabel: string;
  /** `{stats}` を置換して使うテンプレート */
  currentStatsTemplate: string;
  /** `{stats}` を置換して使うテンプレート */
  convertedStatsTemplate: string;
  /** `{lf}` `{crlf}` `{cr}` を置換して使うテンプレート */
  statsFormatTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const lineEndingConverterContent: Record<
  Locale,
  LineEndingConverterPageContent
> = {
  ja: {
    title: '改行コード変換ツール（LF/CRLF/CR）',
    description:
      'テキストの改行コードをLF・CRLF・CRのいずれかに統一変換する無料ツールです。現在含まれる改行コードの内訳も表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '改行コード変換（LF/CRLF/CR）',
    introHtml:
      'テキストに含まれる改行コード（LF・CRLF・CR）を判定し、指定した種類に統一変換します。WindowsとmacOS/Linuxの間でファイルをやり取りした際の改行コード混在の解消や、Gitの差分に無関係な改行コード変更が紛れ込むのを防ぎたい時に便利です。行数や文字数を確認したい場合は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もあわせてご利用ください。',
    loadFileLabel:
      'ファイルを読み込む（改行コードを正確に判定・変換したい場合）',
    dropHint: 'ここにファイルをドラッグ＆ドロップすることもできます',
    loadedFileTemplate: '読み込み済み: {fileName}',
    inputLabel: 'またはテキストを直接入力',
    inputPlaceholder: '変換したいテキストを貼り付けてください',
    textareaNote:
      '※ ブラウザの仕様上、この欄に直接入力・貼り付けした内容は改行コードが自動的にLFに変換されます。既存ファイルの改行コードを正確に判定・変換したい場合は、上の「ファイルを読み込む」をご利用ください。',
    targetLabel: '変換先の改行コード',
    targetLf: 'LF（\\n）— macOS/Linux',
    targetCrlf: 'CRLF（\\r\\n）— Windows',
    targetCr: 'CR（\\r）— 旧Mac OS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloadButton: 'ファイルとしてダウンロード',
    downloaded: 'ダウンロードしました',
    resultLabel: '結果',
    currentStatsTemplate: '現在の改行コード: {stats}',
    convertedStatsTemplate: '変換後の改行コード: {stats}',
    statsFormatTemplate: 'LF {lf}件 / CRLF {crlf}件 / CR {cr}件',
    notesHeading: '注意点',
    notes: [
      'ブラウザのテキスト入力欄（<textarea>）は仕様上、貼り付け・入力された改行コードを自動的にLFへ変換します。既存ファイルの改行コードを正確に判定・変換するには、直接入力ではなく「ファイルを読み込む」機能を使ってください。',
      '「ファイルとしてダウンロード」で保存したファイルには、選択した改行コードがそのまま反映されます。コピーボタンの結果を別のテキストエディタやアプリに貼り付ける場合は、貼り付け先のアプリやOSの仕様によって改行コードが変換される可能性がある点にご注意ください。',
      '読み込んだファイルの文字コードはUTF-8として扱われます。Shift-JIS等UTF-8以外のファイルは文字化けする場合があります。',
      'すべての処理はブラウザ内で完結し、読み込んだファイルやテキストがサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'LF（改行コード）',
        description:
          'Line Feedの略で、改行を表す制御文字「\\n」のことです。macOS・Linuxで標準的に使われます。',
      },
      {
        term: 'CRLF（改行コード）',
        description:
          'Carriage Return + Line Feedの略で、「\\r\\n」の2文字で改行を表します。Windowsで標準的に使われ、テキストファイルをOS間でやり取りする際に混在の原因になりがちです。',
      },
      {
        term: 'CR（改行コード）',
        description:
          'Carriage Returnの略で、「\\r」の1文字で改行を表します。古いMac OS（〜9）で使われていましたが、現在はほとんど使われません。',
      },
    ],
  },
  en: {
    title: 'Line Ending Converter (LF / CRLF / CR)',
    description:
      'Detect and convert line endings to LF, CRLF, or CR, with a breakdown of those present. Runs in your browser; nothing is sent to a server.',
    h1: 'Line Ending Converter (LF / CRLF / CR)',
    introHtml:
      'Detects the line endings (LF, CRLF, or CR) in your text and converts them all to the type you choose. Handy for fixing mixed line endings after exchanging files between Windows and macOS/Linux, or for keeping unrelated line-ending changes out of a Git diff. To check the number of lines or characters, also try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a> tool.',
    loadFileLabel:
      'Load a file (for accurate line-ending detection and conversion)',
    dropHint: 'You can also drag and drop a file here',
    loadedFileTemplate: 'Loaded: {fileName}',
    inputLabel: 'Or type/paste text directly',
    inputPlaceholder: 'Paste the text you want to convert',
    textareaNote:
      'Note: browsers always normalize line endings to LF for text typed or pasted into this field. To accurately detect and convert an existing file\'s line endings, use "Load a file" above instead.',
    targetLabel: 'Target line ending',
    targetLf: 'LF (\\n) — macOS/Linux',
    targetCrlf: 'CRLF (\\r\\n) — Windows',
    targetCr: 'CR (\\r) — classic Mac OS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloadButton: 'Download as file',
    downloaded: 'Downloaded',
    resultLabel: 'Result',
    currentStatsTemplate: 'Current line endings: {stats}',
    convertedStatsTemplate: 'Converted line endings: {stats}',
    statsFormatTemplate: 'LF {lf} / CRLF {crlf} / CR {cr}',
    notesHeading: 'Notes',
    notes: [
      'Browser <textarea> fields always normalize pasted or typed line endings to LF. To accurately detect and convert an existing file\'s line endings, use "Load a file" instead of typing directly.',
      'The file saved via "Download as file" contains exactly the line ending you chose. If you paste the copied result into another text editor or app instead, that app or OS may still convert the line endings on its own.',
      'Loaded files are read as UTF-8. Files in another encoding, such as Shift-JIS, may appear garbled.',
      'All processing happens in your browser — the file or text you load is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'LF (line ending)',
        description:
          'Short for Line Feed, the "\\n" control character used to represent a newline. The standard on macOS and Linux.',
      },
      {
        term: 'CRLF (line ending)',
        description:
          'Short for Carriage Return + Line Feed, the two-character sequence "\\r\\n" used to represent a newline. The standard on Windows, and a common source of mixed line endings when exchanging text files across operating systems.',
      },
      {
        term: 'CR (line ending)',
        description:
          'Short for Carriage Return, the single "\\r" character used to represent a newline. Used by classic Mac OS (up to version 9) but rarely seen today.',
      },
    ],
  },
};
