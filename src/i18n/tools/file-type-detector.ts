import type { Locale } from '../../data/tools';
import type { FileTypeCategory } from '../../lib/tools/file-type-detector';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FileTypeDetectorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** 結果カードの項目名 */
  labelType: string;
  labelCategory: string;
  labelMime: string;
  labelExtension: string;
  labelSize: string;
  labelHead: string;
  noExtension: string;
  hexDumpSummary: string;
  categories: Record<FileTypeCategory, string>;
  /** {ext}, {type}, {exts} を置換する */
  verdictMatch: string;
  verdictMismatch: string;
  verdictTextMismatch: string;
  verdictNoExtension: string;
  verdictUndetermined: string;
  verdictTextNote: string;
  emptyFile: string;
  /** {name} を置換する */
  errorReadFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const categoriesJa: Record<FileTypeCategory, string> = {
  image: '画像',
  audio: '音声',
  video: '動画',
  archive: 'アーカイブ・圧縮',
  document: 'ドキュメント',
  executable: '実行ファイル',
  font: 'フォント',
  database: 'データベース',
  text: 'テキスト',
  other: 'その他',
};

const categoriesEn: Record<FileTypeCategory, string> = {
  image: 'Image',
  audio: 'Audio',
  video: 'Video',
  archive: 'Archive',
  document: 'Document',
  executable: 'Executable',
  font: 'Font',
  database: 'Database',
  text: 'Text',
  other: 'Other',
};

export const fileTypeDetectorContent: Record<
  Locale,
  FileTypeDetectorPageContent
> = {
  ja: {
    title: 'ファイル種別判定（マジックナンバー・拡張子偽装チェック）',
    description:
      'ファイルの先頭バイト（マジックナンバー）から実際の形式を判定し、拡張子との不一致を警告する無料ツールです。16進ダンプも表示できます。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ファイル種別判定（マジックナンバー）',
    introHtml:
      'ファイルの先頭バイト（マジックナンバー）を調べて、拡張子ではなく中身から本当の形式を判定します。拡張子と中身が食い違っていれば警告するので、拡張子を書き換えられたファイルや、ダウンロードに失敗してHTMLが保存されたファイルの確認に使えます。ファイルはブラウザ内で処理され、アップロードされません。ファイルの改ざん確認には <a href="/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ファイルハッシュ計算</a> もご利用ください。',
    dropLabel: 'ファイルを選択（複数可）',
    dropHint:
      'ここにファイルをドラッグ＆ドロップするか、ボタンから選択してください。',
    labelType: '判定した形式',
    labelCategory: '分類',
    labelMime: 'MIMEタイプ',
    labelExtension: 'ファイル名の拡張子',
    labelSize: 'サイズ',
    labelHead: '先頭16バイト',
    noExtension: '（なし）',
    hexDumpSummary: '16進ダンプ（先頭256バイト）',
    categories: categoriesJa,
    verdictMatch: '拡張子（.{ext}）は中身（{type}）と一致しています。',
    verdictMismatch:
      '拡張子（.{ext}）と中身（{type}）が一致しません。正しい拡張子の例: {exts}。拡張子が偽装されているか、別の形式で保存されている可能性があります。',
    verdictTextMismatch:
      '拡張子（.{ext}）は画像や書類などのバイナリ形式ですが、中身は{type}のテキストです。ダウンロードに失敗してエラーページなどが保存された可能性があります。',
    verdictNoExtension:
      '拡張子がありません。中身は {type} です（一般的な拡張子: {exts}）。',
    verdictUndetermined:
      '既知の形式として判定できませんでした。独自形式、または未対応の形式の可能性があります。',
    verdictTextNote:
      'テキストファイルは中身から拡張子を決められないため、バイナリ形式の拡張子との不一致だけを確認しています。',
    emptyFile: '空のファイルです（0バイト）。',
    errorReadFailed: '{name} を読み込めませんでした。',
    howToHeading: '使い方',
    howToSteps: [
      '調べたいファイルを枠内にドラッグ＆ドロップするか、ファイルを選択します（複数可）。',
      'ファイルごとに、中身から判定した形式とMIMEタイプが表示されます。',
      '拡張子と中身が食い違っている場合は、警告メッセージが赤字で表示されます。',
      '16進ダンプを開くと、先頭256バイトの中身を確認できます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ファイルの先頭部分（最大64KB）だけを読み込んで判定します。ファイル全体の整合性や、中身が壊れていないかは確認しません。',
      'マジックナンバーが同じでも、中身が悪意のあるものかどうかは判定できません。拡張子が一致していても、安全なファイルとは限りません。',
      'ZIP形式のファイル（Word・Excel・PowerPoint・EPUB・APKなど）は、ZIP内のファイル名から種類を推定します。先頭付近に手掛かりが無い場合は ZIP と表示されます。',
      '判定できるのは主要な画像・音声・動画・圧縮・ドキュメント・実行ファイルなどの形式です。JSONやCSVなど先頭に目印の無いテキスト形式は、テキストとして扱います。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'マジックナンバー',
        description:
          'ファイルの先頭にある、形式ごとに決まったバイト列です。たとえばPNG画像は 89 50 4E 47 で始まります。拡張子と違い、ファイル名を変えても変わりません。',
      },
      {
        term: 'MIMEタイプ',
        description:
          'ファイルの種類を表す「image/png」のような識別子です。Webサーバーやメールがファイルの種類を伝えるために使います。',
      },
      {
        term: '拡張子の偽装',
        description:
          '実行ファイルを画像や文書に見せかけるなど、拡張子を書き換えて別の種類のファイルに見せることです。中身の形式を確認すると見抜けます。',
      },
    ],
  },
  en: {
    title: 'File Type Detector (Magic Number & Extension Mismatch Check)',
    description:
      'Identify a file’s real format from its magic number and get warned when the extension is wrong. Includes a hex dump. Runs in your browser; nothing is uploaded.',
    h1: 'File Type Detector (Magic Number Checker)',
    introHtml:
      'Reads the first bytes of a file (its magic number) to tell you what the file really is, regardless of its extension. If the extension and the contents disagree you get a warning, which helps with renamed files or downloads that saved an HTML error page instead. Files are processed in your browser and are never uploaded. To verify a file has not been modified, use the <a href="/en/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">File Hash Calculator</a>.',
    dropLabel: 'Choose files (multiple allowed)',
    dropHint: 'Drag and drop files here, or pick them with the button.',
    labelType: 'Detected type',
    labelCategory: 'Category',
    labelMime: 'MIME type',
    labelExtension: 'File name extension',
    labelSize: 'Size',
    labelHead: 'First 16 bytes',
    noExtension: '(none)',
    hexDumpSummary: 'Hex dump (first 256 bytes)',
    categories: categoriesEn,
    verdictMatch: 'The extension (.{ext}) matches the contents ({type}).',
    verdictMismatch:
      'The extension (.{ext}) does not match the contents ({type}). Expected extensions include: {exts}. The file may have been renamed or saved in a different format.',
    verdictTextMismatch:
      'The extension (.{ext}) belongs to a binary format, but the contents are {type} text. A failed download may have saved an error page instead.',
    verdictNoExtension:
      'The file has no extension. The contents are {type} (typical extensions: {exts}).',
    verdictUndetermined:
      'Could not identify a known format. It may be a proprietary or unsupported format.',
    verdictTextNote:
      'Text files cannot be matched to a single extension, so only a clash with a binary-format extension is flagged.',
    emptyFile: 'The file is empty (0 bytes).',
    errorReadFailed: 'Could not read {name}.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop the files you want to check into the box, or choose them (multiple allowed).',
      'Each file shows the format detected from its contents and its MIME type.',
      'If the extension and the contents disagree, a warning appears in red.',
      'Open the hex dump to inspect the first 256 bytes.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Only the first part of each file (up to 64 KB) is read for detection. The tool does not verify the whole file or whether it is corrupted.',
      'A matching magic number says nothing about whether the contents are malicious. A matching extension does not make a file safe.',
      'ZIP-based files (Word, Excel, PowerPoint, EPUB, APK, and so on) are identified from the file names inside the archive. If there is no clue near the start, they are shown as ZIP.',
      'Major image, audio, video, archive, document, and executable formats are recognized. Text formats without a marker at the start, such as JSON or CSV, are reported as plain text.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Magic number',
        description:
          'A fixed byte sequence at the start of a file that identifies its format. A PNG image, for example, begins with 89 50 4E 47. Unlike an extension, it does not change when the file is renamed.',
      },
      {
        term: 'MIME type',
        description:
          'An identifier such as "image/png" that describes a file’s type. Web servers and email use it to tell clients what kind of file they are sending.',
      },
      {
        term: 'Extension spoofing',
        description:
          'Renaming a file’s extension to disguise it as another type, such as making an executable look like an image or document. Checking the actual format exposes it.',
      },
    ],
  },
};
