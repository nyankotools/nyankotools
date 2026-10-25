import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FileSplitterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeSplit: string;
  modeMerge: string;
  splitDropLabel: string;
  splitDropHint: string;
  /** {name}, {size} を置換する */
  splitFileInfo: string;
  sizeLabel: string;
  unitLabel: string;
  /** {count}, {first}, {last} を置換する */
  splitPreview: string;
  splitButton: string;
  /** {count} を置換する */
  splitDone: string;
  partsHeading: string;
  download: string;
  downloadAll: string;
  downloadZip: string;
  /** {count} を置換する */
  warnManyParts: string;
  warnLargeFile: string;
  /** {max} を置換する */
  errorTooManyParts: string;
  errorInvalidSize: string;
  errorEmptyFile: string;
  errorZipTooLarge: string;
  errorReadFailed: string;
  mergeDropLabel: string;
  mergeDropHint: string;
  mergeListHeading: string;
  mergeEmpty: string;
  remove: string;
  clearAll: string;
  mergeNameLabel: string;
  mergeButton: string;
  /** {name}, {size} を置換する */
  mergeDone: string;
  /** {names} を置換する */
  issueNotPart: string;
  /** {names} を置換する */
  issueMixedBase: string;
  /** {numbers} を置換する */
  issueDuplicate: string;
  /** {numbers} を置換する */
  issueMissing: string;
  /** {first} を置換する */
  issueNotFromOne: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const fileSplitterContent: Record<Locale, FileSplitterPageContent> = {
  ja: {
    title: 'ファイル分割・結合（.001形式・メール添付の容量対策）',
    description:
      '大きなファイルを指定サイズ（KB・MB）で分割して .001 .002 … のパーツにし、あとで結合して元に戻せる無料ツールです。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ファイル分割・結合',
    introHtml:
      'メールの添付容量やアップロード上限に収まらない大きなファイルを、指定したサイズで分割します。分割したパーツ（.001 .002 …）はあとで結合して元のファイルに戻せます。分割前後の一致確認には <a href="/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ファイルハッシュ計算</a>、まとめて送るときは <a href="/tools/zip-tool/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ZIP作成・解凍</a> も使えます。',
    modeLabel: '操作',
    modeSplit: 'ファイルを分割',
    modeMerge: 'パーツを結合',
    splitDropLabel: '分割するファイル',
    splitDropHint:
      'ここにファイルをドラッグ＆ドロップするか、ボタンから選択してください。',
    splitFileInfo: '{name}（{size}）',
    sizeLabel: '1パーツのサイズ',
    unitLabel: '単位',
    splitPreview: '{count}個のパーツに分かれます（{first} ～ {last}）。',
    splitButton: '分割する',
    splitDone: '{count}個のパーツに分割しました。',
    partsHeading: '分割したパーツ',
    download: '保存',
    downloadAll: 'すべて順にダウンロード',
    downloadZip: 'ZIPでまとめてダウンロード',
    warnManyParts:
      'パーツが{count}個と多くなります。サイズを大きくするか、ZIPでまとめるのがおすすめです。',
    warnLargeFile:
      'ファイルが1GBを超えています。ブラウザやメモリの状況によっては失敗することがあります。',
    errorTooManyParts:
      'パーツの数が{max}個を超えるため分割できません。1パーツのサイズを大きくしてください。',
    errorInvalidSize: '1パーツのサイズは0より大きい数値で指定してください。',
    errorEmptyFile: '空のファイルは分割できません。',
    errorZipTooLarge:
      'ZIPにまとめるには合計100MB以下である必要があります。個別に保存してください。',
    errorReadFailed: 'ファイルを読み込めませんでした。',
    mergeDropLabel: '結合するパーツ（.001 .002 … を複数選択）',
    mergeDropHint:
      'ここにパーツをまとめてドラッグ＆ドロップするか、ボタンから複数選択してください。追加するたびに一覧へ加わります。',
    mergeListHeading: '結合の順番',
    mergeEmpty: 'まだパーツがありません。',
    remove: '削除',
    clearAll: 'すべて削除',
    mergeNameLabel: '復元後のファイル名',
    mergeButton: '結合してダウンロード',
    mergeDone: '{name}（{size}）を復元しました。',
    issueNotPart:
      '連番（.001 など）で終わらないファイルが含まれています: {names}',
    issueMixedBase: '元のファイル名が異なるパーツが混ざっています: {names}',
    issueDuplicate: '同じ番号のパーツが重複しています: {numbers}',
    issueMissing: '次の番号のパーツが足りません: {numbers}',
    issueNotFromOne:
      '先頭のパーツ（.001）がありません。最小の番号は {first} です。',
    howToHeading: '使い方',
    howToSteps: [
      '「ファイルを分割」か「パーツを結合」を選びます。',
      '分割する場合は、ファイルを枠内にドロップし、1パーツのサイズと単位を決めて「分割する」を押します。',
      '作られたパーツを「保存」で1つずつ、または「すべて順にダウンロード」「ZIPでまとめてダウンロード」で保存します。',
      '結合する場合は、すべてのパーツ（.001 .002 …）を枠内にドロップし、順番と欠番がないことを確認して「結合してダウンロード」を押します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '分割は Blob.slice で必要な部分だけを切り出すため、ファイル全体を二重にメモリへ載せません。それでも上限はお使いの端末のメモリに依存し、1GBを超えるファイルでは失敗することがあります。',
      'パーツは1,000個を超えると警告し、10,000個を超える設定はできません。連番は3桁（.001）ですが、1,000個以上のときは4桁になります。',
      '.001 形式のパーツは、結合ツールで連結すると元に戻ります。7-ZipやHJSplit形式のパーツとは互換性がありますが、別の方式（独自ヘッダー付き）のパーツには対応しません。',
      '結合時は番号順に並べ替え、欠番・重複・別ファイルの混在があると結合しません。復元後のファイル名はパーツ名から連番を除いたもので、変更もできます。',
      '「すべて順にダウンロード」はブラウザによって複数ファイルのダウンロード許可を求められます。ZIPでまとめる場合は合計100MBまでです（圧縮はせず格納のみ）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ファイル分割',
        description:
          '1つの大きなファイルを一定サイズごとのかたまり（パーツ）に切り分けることです。分割しただけでは中身は変わらず、すべてのパーツを順に連結すると元のファイルに戻ります。',
      },
      {
        term: '.001形式',
        description:
          '元のファイル名の後ろに .001 .002 … と連番を付ける分割ファイルの命名です。7-Zipなどの分割形式と同じ並びで、番号順につなぐと復元できます。',
      },
    ],
  },
  en: {
    title: 'File Splitter & Joiner (Split Large Files Online)',
    description:
      'Split a large file into .001, .002 parts of any size to fit email limits, then join the parts back. Runs in your browser; files are never uploaded.',
    h1: 'File Splitter & Joiner',
    introHtml:
      'Cut a big file into parts of the size you choose so it fits an email attachment or upload limit. The parts (.001, .002 …) can be joined back into the original file. To confirm the result matches, use the <a href="/en/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">File Hash Calculator</a>; to bundle files, see the <a href="/en/tools/zip-tool/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ZIP Maker & Extractor</a>.',
    modeLabel: 'Action',
    modeSplit: 'Split a file',
    modeMerge: 'Join parts',
    splitDropLabel: 'File to split',
    splitDropHint: 'Drag and drop a file here, or pick it with the button.',
    splitFileInfo: '{name} ({size})',
    sizeLabel: 'Size of each part',
    unitLabel: 'Unit',
    splitPreview: 'It will be split into {count} parts ({first} to {last}).',
    splitButton: 'Split',
    splitDone: 'Split into {count} parts.',
    partsHeading: 'Parts',
    download: 'Save',
    downloadAll: 'Download all in order',
    downloadZip: 'Download all as a ZIP',
    warnManyParts:
      'This makes {count} parts. Consider a larger part size or bundling them into a ZIP.',
    warnLargeFile:
      'This file is over 1 GB. Depending on your browser and memory, it may fail.',
    errorTooManyParts:
      'This would make more than {max} parts. Increase the size of each part.',
    errorInvalidSize: 'Enter a part size greater than 0.',
    errorEmptyFile: 'An empty file cannot be split.',
    errorZipTooLarge:
      'A ZIP can hold up to 100 MB in total. Save the parts one by one instead.',
    errorReadFailed: 'Could not read the file.',
    mergeDropLabel: 'Parts to join (select several .001, .002 … files)',
    mergeDropHint:
      'Drag and drop the parts here, or pick several with the button. Each pick adds to the list.',
    mergeListHeading: 'Join order',
    mergeEmpty: 'No parts yet.',
    remove: 'Remove',
    clearAll: 'Remove all',
    mergeNameLabel: 'Restored file name',
    mergeButton: 'Join and download',
    mergeDone: 'Restored {name} ({size}).',
    issueNotPart:
      'Some files do not end in a part number (such as .001): {names}',
    issueMixedBase: 'These parts come from different original files: {names}',
    issueDuplicate: 'These part numbers appear more than once: {numbers}',
    issueMissing: 'These part numbers are missing: {numbers}',
    issueNotFromOne:
      'The first part (.001) is missing. The lowest number is {first}.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Split a file" or "Join parts".',
      'To split, drop the file into the box, set the size and unit of each part, then press "Split".',
      'Save the parts one at a time with "Save", or use "Download all in order" or "Download all as a ZIP".',
      'To join, drop all the parts (.001, .002 …) into the box, check the order and that none are missing, then press "Join and download".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Splitting cuts only the needed range with Blob.slice, so the whole file is not loaded into memory twice. The limit still depends on your device’s memory, and files over 1 GB may fail.',
      'More than 1,000 parts triggers a warning, and more than 10,000 is not allowed. Part numbers use 3 digits (.001), growing to 4 digits at 1,000 parts or more.',
      'Parts named .001 restore the original when joined here. They match the layout used by 7-Zip and HJSplit, but parts from tools that add their own header are not supported.',
      'When joining, parts are sorted by number, and joining is blocked if numbers are missing, duplicated, or from different files. The restored name is the part name without the number, and you can change it.',
      '"Download all in order" may ask your browser for permission to download several files. A ZIP holds up to 100 MB in total (stored, not compressed).',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'File splitting',
        description:
          'Cutting one large file into chunks (parts) of a fixed size. The data itself is unchanged; joining every part in order gives back the original file.',
      },
      {
        term: '.001 format',
        description:
          'A naming scheme that appends .001, .002 … to the original file name. It follows the same order as 7-Zip split archives, and joining the parts by number restores the file.',
      },
    ],
  },
};
