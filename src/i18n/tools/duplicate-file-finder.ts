import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DuplicateFileFinderPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  filesLabel: string;
  folderLabel: string;
  dropHint: string;
  folderHint: string;
  clear: string;
  /** {done}, {total} を置換する */
  progress: string;
  /** {count} を置換する */
  loadedFiles: string;
  /** {groups}, {files}, {wasted} を置換する */
  summary: string;
  noDuplicates: string;
  /** {index}, {count}, {size}, {wasted} を置換する */
  groupTitle: string;
  /** {name}, {max} を置換する */
  errorTooLarge: string;
  /** {name} を置換する */
  errorReadFailed: string;
  copy: string;
  copied: string;
  copyFailed: string;
  csv: string;
  csvHeader: [string, string, string, string];
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const duplicateFileFinderContent: Record<
  Locale,
  DuplicateFileFinderPageContent
> = {
  ja: {
    title: '重複ファイル検出（ハッシュ比較）',
    description:
      '複数のファイルやフォルダをドロップして、中身が同じ重複ファイルをSHA-256で検出します。グループごとの無駄な容量も表示。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: '重複ファイル検出（SHA-256ハッシュ比較）',
    introHtml:
      '複数のファイルやフォルダを選ぶ（ファイルはドロップも可）と、中身が完全に同じ重複ファイルをグループにして表示します。まずファイルサイズで絞り込み、同じサイズのファイルだけSHA-256を計算するので速く処理できます。ファイルはブラウザ内で処理され、アップロードされません。1つのファイルのハッシュ値を知りたいときは <a href="/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ファイルハッシュ計算</a> をご利用ください。',
    filesLabel: 'ファイルを選択',
    folderLabel: 'フォルダを選択',
    dropHint:
      'ここにファイルをドラッグ＆ドロップするか、ボタンから選択してください。追加で選ぶと一覧に足されます。',
    folderHint: 'フォルダを選ぶと、中のファイルをすべて対象にします。',
    clear: 'クリア',
    progress: 'ハッシュを計算中… {done} / {total}',
    loadedFiles: '読み込んだファイル：{count}個',
    summary: '重複 {groups}グループ（{files}ファイル）、無駄な容量 {wasted}',
    noDuplicates: '重複しているファイルは見つかりませんでした。',
    groupTitle:
      'グループ{index}：{count}ファイル × {size}（無駄な容量 {wasted}）',
    errorTooLarge: '{name} は{max}MBを超えているため比較できません。',
    errorReadFailed: '{name} を読み込めませんでした。',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    csv: 'CSVをダウンロード',
    csvHeader: ['グループ', 'サイズ(バイト)', 'SHA-256', 'パス'],
    howToHeading: '使い方',
    howToSteps: [
      '枠内にファイルをドラッグ＆ドロップするか、「ファイルを選択」「フォルダを選択」から選びます。',
      '同じサイズのファイルだけSHA-256を計算し、中身が同じファイルがグループで表示されます。',
      '各グループの無駄な容量と合計を見て、不要なファイルを手元で整理します。',
      '「結果をコピー」または「CSVをダウンロード」で一覧を保存できます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'このツールはファイルの検出だけを行い、削除はしません。表示されたパスを見て、ご自身で整理してください。',
      '比較できるのは1ファイルあたり256MBまでです。それより大きいファイルは対象外になります。',
      '比較するのは中身（バイト列）だけです。ファイル名や更新日時が違っていても、中身が同じなら重複として扱います。',
      'ブラウザの仕様上、フォルダ選択時は相対パス（フォルダ名から始まるパス）までしか表示できません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'SHA-256',
        description:
          'ファイルの中身から計算する256ビットの「指紋」です。中身が同じなら必ず同じ値になり、1バイトでも違えばまったく別の値になります。',
      },
      {
        term: '無駄な容量',
        description:
          '同じ内容のファイルが複数あるとき、1つだけ残して他を整理した場合に空く容量です。「サイズ × (件数 − 1)」で計算しています。',
      },
    ],
  },
  en: {
    title: 'Duplicate File Finder (SHA-256 Compare)',
    description:
      'Pick files or a folder to find duplicate files by SHA-256 hash and see how much space they waste. Everything runs in your browser; nothing is uploaded.',
    h1: 'Duplicate File Finder (SHA-256 Hash Compare)',
    introHtml:
      'Pick several files or a folder and files with identical contents are listed in groups. Files are first narrowed down by size, and only files of the same size are hashed with SHA-256, which keeps it fast. Files are processed in your browser and are never uploaded. To get the hash of a single file, use the <a href="/en/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">File Hash Calculator</a>.',
    filesLabel: 'Choose files',
    folderLabel: 'Choose folder',
    dropHint:
      'Drag and drop files here, or pick them with the buttons. Picking more adds to the list.',
    folderHint: 'Choosing a folder includes every file inside it.',
    clear: 'Clear',
    progress: 'Hashing… {done} / {total}',
    loadedFiles: 'Files loaded: {count}',
    summary:
      'Duplicate groups: {groups} ({files} files), wasted space: {wasted}',
    noDuplicates: 'No duplicate files were found.',
    groupTitle: 'Group {index}: {count} copies × {size} ({wasted} wasted)',
    errorTooLarge: '{name} is larger than {max} MB and cannot be compared.',
    errorReadFailed: 'Could not read {name}.',
    copy: 'Copy results',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    csv: 'Download CSV',
    csvHeader: ['Group', 'Size (bytes)', 'SHA-256', 'Path'],
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop files into the box, or use "Choose files" or "Choose folder".',
      'Only files of the same size are hashed with SHA-256, and files with identical contents appear in groups.',
      'Check the wasted space per group and in total, then clean up the unneeded files yourself.',
      'Save the list with "Copy results" or "Download CSV".',
    ],
    notesHeading: 'Notes',
    notes: [
      'This tool only finds duplicates; it never deletes anything. Use the listed paths to tidy up yourself.',
      'Files up to 256 MB each can be compared. Larger files are skipped.',
      'Only the contents (bytes) are compared. Files with different names or modified dates are still duplicates if their contents match.',
      'For folders, browsers only expose a relative path starting at the folder name, not the full path on disk.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'SHA-256',
        description:
          'A 256-bit "fingerprint" computed from a file’s contents. Identical contents always give the same value, and changing even one byte gives a completely different one.',
      },
      {
        term: 'Wasted space',
        description:
          'The space you would free by keeping one copy of identical files and removing the rest, calculated as size × (copies − 1).',
      },
    ],
  },
};
