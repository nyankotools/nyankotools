import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ZipToolPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeCreate: string;
  modeExtract: string;
  createDropLabel: string;
  createDropHint: string;
  extractDropLabel: string;
  extractDropHint: string;
  fileListHeading: string;
  emptyList: string;
  remove: string;
  clearAll: string;
  levelLabel: string;
  levelStore: string;
  levelFast: string;
  levelNormal: string;
  levelMax: string;
  nameLabel: string;
  createButton: string;
  /** {count}, {size} を置換する */
  createdStatus: string;
  entriesHeading: string;
  /** {count}, {size} を置換する */
  entriesSummary: string;
  colName: string;
  colSize: string;
  colAction: string;
  download: string;
  folder: string;
  /** {max} を置換する */
  errorTooLarge: string;
  /** {max} を置換する */
  errorTooManyEntries: string;
  errorInvalidZip: string;
  errorUnsupported: string;
  errorReadFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const zipToolContent: Record<Locale, ZipToolPageContent> = {
  ja: {
    title: 'ZIP作成・解凍（ブラウザで圧縮・展開）',
    description:
      '複数のファイルをZIPにまとめたり、ZIPの中身を確認して必要なファイルだけ取り出したりできる無料ツールです。日本語のファイル名にも対応。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ZIP作成・解凍',
    introHtml:
      'ファイルをドラッグ＆ドロップしてZIPにまとめたり、ZIPの中身を一覧で確認して好きなファイルだけ保存したりできます。ソフトのインストールは不要で、ファイルはブラウザの外へ出ません。ファイルの改ざんチェックには <a href="/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ファイルハッシュ計算</a> もご利用ください。',
    modeLabel: '操作',
    modeCreate: 'ZIPを作る',
    modeExtract: 'ZIPを開く',
    createDropLabel: 'ZIPにまとめるファイル（複数可）',
    createDropHint:
      'ここにファイルをドラッグ＆ドロップするか、ボタンから選択してください。追加するたびに一覧へ加わります。',
    extractDropLabel: '開くZIPファイル',
    extractDropHint:
      'ここにZIPファイルをドラッグ＆ドロップするか、ボタンから選択してください。',
    fileListHeading: '追加したファイル',
    emptyList: 'まだファイルがありません。',
    remove: '削除',
    clearAll: 'すべて削除',
    levelLabel: '圧縮レベル',
    levelStore: '圧縮しない（最速）',
    levelFast: '速さ重視',
    levelNormal: '標準',
    levelMax: '最大圧縮（遅い）',
    nameLabel: 'ZIPのファイル名',
    createButton: 'ZIPを作成してダウンロード',
    createdStatus: '{count}個のファイルを{size}のZIPにしました。',
    entriesHeading: 'ZIPの中身',
    entriesSummary: '{count}個のファイル（展開後の合計 {size}）',
    colName: 'ファイル名',
    colSize: 'サイズ',
    colAction: '操作',
    download: '保存',
    folder: 'フォルダ',
    errorTooLarge:
      '合計サイズが{max}MBを超えるため処理できません。ファイルを分けてお試しください。',
    errorTooManyEntries:
      'ファイル数が{max}個を超えるため処理できません。ファイルを分けてお試しください。',
    errorInvalidZip:
      'ZIPファイルとして読み込めませんでした。ファイルが壊れているか、ZIP形式ではない可能性があります。',
    errorUnsupported:
      'パスワード付き、または未対応の圧縮方式のZIPのため開けません。',
    errorReadFailed: 'ファイルを読み込めませんでした。',
    howToHeading: '使い方',
    howToSteps: [
      '「ZIPを作る」か「ZIPを開く」を選びます。',
      'ZIPを作る場合は、まとめたいファイルを枠内にドラッグ＆ドロップし、圧縮レベルとファイル名を決めて「ZIPを作成してダウンロード」を押します。',
      'ZIPを開く場合は、ZIPファイルを枠内にドロップします。中身が一覧で表示されます。',
      '取り出したいファイルの「保存」を押すと、そのファイルだけ保存できます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'すべてブラウザのメモリ上で処理するため、合計100MBまで・5,000ファイルまでです。',
      'パスワード付きZIPの作成・解凍には対応していません。',
      'フォルダ構造は保持されません。作成時はファイルのみを追加でき、同じ名前のファイルには連番（a (2).txt など）が付きます。',
      'ZIPの中身は保存時にファイル名の最後の部分だけを使うため、パスに ../ を含むZIPでも意図しない場所には書き出されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ZIP',
        description:
          '複数のファイルを1つにまとめ、あわせて圧縮もできるアーカイブ形式です。WindowsやMacが標準で扱えるため、受け渡しによく使われます。',
      },
      {
        term: '圧縮レベル',
        description:
          '数字が大きいほど小さくなりますが、時間がかかります。JPEGやMP4など、すでに圧縮されているファイルはほとんど小さくなりません。',
      },
    ],
  },
  en: {
    title: 'ZIP Maker & Extractor (Create and Open ZIP Files Online)',
    description:
      'Bundle files into a ZIP, or open one and save only the files you need. Handles non-English names. Runs in your browser; files are never uploaded.',
    h1: 'ZIP Maker & Extractor',
    introHtml:
      'Drag and drop files to bundle them into a ZIP, or open a ZIP to see what is inside and save just the files you want. Nothing to install, and your files never leave the browser. To verify a download, try the <a href="/en/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">File Hash Calculator</a>.',
    modeLabel: 'Action',
    modeCreate: 'Create a ZIP',
    modeExtract: 'Open a ZIP',
    createDropLabel: 'Files to put in the ZIP (multiple allowed)',
    createDropHint:
      'Drag and drop files here, or pick them with the button. Each pick adds to the list.',
    extractDropLabel: 'ZIP file to open',
    extractDropHint:
      'Drag and drop a ZIP file here, or pick it with the button.',
    fileListHeading: 'Added files',
    emptyList: 'No files yet.',
    remove: 'Remove',
    clearAll: 'Remove all',
    levelLabel: 'Compression level',
    levelStore: 'None (fastest)',
    levelFast: 'Fast',
    levelNormal: 'Normal',
    levelMax: 'Maximum (slow)',
    nameLabel: 'ZIP file name',
    createButton: 'Create ZIP and download',
    createdStatus: 'Packed {count} files into a {size} ZIP.',
    entriesHeading: 'Contents',
    entriesSummary: '{count} files ({size} uncompressed in total)',
    colName: 'Name',
    colSize: 'Size',
    colAction: 'Action',
    download: 'Save',
    folder: 'Folder',
    errorTooLarge:
      'The total size is over {max} MB, so it cannot be processed. Try splitting the files.',
    errorTooManyEntries:
      'There are more than {max} files, so it cannot be processed. Try splitting the files.',
    errorInvalidZip:
      'Could not read this as a ZIP file. It may be corrupted or not a ZIP.',
    errorUnsupported:
      'This ZIP is password-protected or uses an unsupported compression method, so it cannot be opened.',
    errorReadFailed: 'Could not read the file.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Create a ZIP" or "Open a ZIP".',
      'To create one, drop the files you want to bundle, pick a compression level and a name, then press "Create ZIP and download".',
      'To open one, drop the ZIP file into the box. Its contents are listed.',
      'Press "Save" next to a file to save just that file.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Everything is processed in browser memory, so the limit is 100 MB in total and 5,000 files.',
      'Creating or opening password-protected ZIPs is not supported.',
      'Folder structure is not kept. Only files can be added when creating, and duplicate names get a number added (for example a (2).txt).',
      'Only the last part of an entry’s path is used as the saved file name, so a ZIP containing ../ paths cannot write anywhere unexpected.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ZIP',
        description:
          'An archive format that bundles several files into one and can compress them too. Windows and macOS open it natively, so it is a common way to send files.',
      },
      {
        term: 'Compression level',
        description:
          'Higher numbers make smaller files but take longer. Files that are already compressed, such as JPEG or MP4, barely shrink.',
      },
    ],
  },
};
