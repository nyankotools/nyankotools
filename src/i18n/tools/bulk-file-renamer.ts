import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BulkFileRenamerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** {count}, {size} を置換する */
  fileSummary: string;
  clearAll: string;
  sortLabel: string;
  sortSelection: string;
  sortName: string;
  replaceLegend: string;
  findLabel: string;
  replaceLabel: string;
  regexLabel: string;
  ignoreCaseLabel: string;
  caseLabel: string;
  caseNone: string;
  caseLower: string;
  caseUpper: string;
  affixLegend: string;
  prefixLabel: string;
  suffixLabel: string;
  numberingLegend: string;
  numberingEnable: string;
  startLabel: string;
  stepLabel: string;
  digitsLabel: string;
  positionLabel: string;
  posSuffix: string;
  posPrefix: string;
  posReplace: string;
  separatorLabel: string;
  extLegend: string;
  extLabel: string;
  extKeep: string;
  extLower: string;
  extUpper: string;
  extChange: string;
  extRemove: string;
  newExtLabel: string;
  previewHeading: string;
  /** {changed}, {total} を置換する */
  summary: string;
  /** {n} を置換する */
  moreRows: string;
  emptyList: string;
  colOriginal: string;
  colRenamed: string;
  colStatus: string;
  statusOk: string;
  statusUnchanged: string;
  issueEmpty: string;
  issueDuplicate: string;
  issueSanitized: string;
  issueReserved: string;
  issueTooLong: string;
  zipNameLabel: string;
  zipButton: string;
  /** {count}, {name} を置換する */
  zipDone: string;
  /** {max} を置換する */
  errorTooManyFiles: string;
  errorInvalidRegex: string;
  errorPatternTooLong: string;
  errorInvalidNumber: string;
  errorTextTooLong: string;
  errorBlocked: string;
  errorZipTooLarge: string;
  errorZipFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const bulkFileRenamerContent: Record<
  Locale,
  BulkFileRenamerPageContent
> = {
  ja: {
    title: 'ファイル名一括変更（連番・置換→ZIP保存）',
    description:
      '複数ファイルの名前を連番・文字列置換・大文字小文字変換でまとめて変更し、プレビュー確認のうえ変更後の名前でZIPに保存できる無料ツールです。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ファイル名一括変更',
    introHtml:
      '複数のファイルの名前を、連番の付与・文字列の置換（正規表現も可）・大文字小文字の変換・接頭辞や接尾辞の追加でまとめて変更します。ブラウザは元のファイルを書き換えられないため、変更後の名前でZIPにまとめて保存します。ZIPの中身の確認や解凍は <a href="/tools/zip-tool/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ZIP作成・解凍</a> も使えます。',
    dropLabel: '名前を変更するファイル（複数選択可）',
    dropHint:
      'ここにファイルをまとめてドラッグ＆ドロップするか、ボタンから複数選択してください。追加するたびに一覧へ加わります。',
    fileSummary: '{count}個のファイル（合計 {size}）',
    clearAll: 'すべて削除',
    sortLabel: '並び順（連番の順番）',
    sortSelection: '選んだ順',
    sortName: '名前の自然順（file2 → file10）',
    replaceLegend: '文字列の置換',
    findLabel: '置換前の文字列',
    replaceLabel: '置換後の文字列',
    regexLabel: '正規表現を使う',
    ignoreCaseLabel: '大文字小文字を区別しない',
    caseLabel: '大文字・小文字の変換（拡張子を除く）',
    caseNone: '変換しない',
    caseLower: 'すべて小文字',
    caseUpper: 'すべて大文字',
    affixLegend: '接頭辞・接尾辞',
    prefixLabel: '先頭に付ける文字列',
    suffixLabel: '末尾に付ける文字列（拡張子の前）',
    numberingLegend: '連番',
    numberingEnable: '連番を付ける',
    startLabel: '開始番号',
    stepLabel: '増分',
    digitsLabel: '桁数（ゼロ埋め）',
    positionLabel: '連番の位置',
    posSuffix: '名前の後ろ',
    posPrefix: '名前の前',
    posReplace: '名前を連番に置き換える',
    separatorLabel: '名前との区切り文字',
    extLegend: '拡張子',
    extLabel: '拡張子の扱い',
    extKeep: 'そのまま',
    extLower: '小文字にする',
    extUpper: '大文字にする',
    extChange: '別の拡張子に変更',
    extRemove: '取り除く',
    newExtLabel: '新しい拡張子（例: jpg）',
    previewHeading: '変更後の名前のプレビュー',
    summary: '{total}個中 {changed}個の名前が変わります。',
    moreRows: '…ほか {n}個（プレビューは先頭のみ表示）',
    emptyList: 'ファイルを追加すると、ここに変更前後の名前が表示されます。',
    colOriginal: '変更前',
    colRenamed: '変更後',
    colStatus: '状態',
    statusOk: '変更あり',
    statusUnchanged: '変更なし',
    issueEmpty: '名前が空になります',
    issueDuplicate: '他のファイルと名前が重複します',
    issueSanitized: '使えない文字・末尾のドットを調整しました',
    issueReserved: 'Windowsの予約名です',
    issueTooLong: '名前が255文字を超えます',
    zipNameLabel: 'ZIPのファイル名',
    zipButton: 'ZIPで保存',
    zipDone: '{count}個のファイルを変更後の名前で {name} に保存しました。',
    errorTooManyFiles: 'ファイルは一度に{max}個までです。',
    errorInvalidRegex: '正規表現が正しくありません。',
    errorPatternTooLong: '正規表現は200文字以内で指定してください。',
    errorInvalidNumber:
      '開始番号は0〜999999999、増分は1〜99999、桁数は1〜10の整数で指定してください。',
    errorTextTooLong: '入力した文字列が長すぎます（各欄100文字まで）。',
    errorBlocked:
      '名前が重複している、空になる、または長すぎるファイルがあるため保存できません。プレビューの状態を確認してください。',
    errorZipTooLarge:
      'ZIPにまとめられるのは合計100MBまでです。ファイルを減らして試してください。',
    errorZipFailed: 'ZIPの作成に失敗しました。ファイルを読み込めませんでした。',
    howToHeading: '使い方',
    howToSteps: [
      '名前を変えたいファイルを枠内にまとめてドロップします。',
      '置換・大文字小文字・接頭辞や接尾辞・連番・拡張子の設定を選びます。',
      'プレビュー表で変更後の名前と状態（重複や空の名前など）を確認します。',
      'ZIPのファイル名を決めて「ZIPで保存」を押します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ブラウザは元のファイルの名前を直接書き換えられません。このツールは変更後の名前でファイルをZIPにまとめるので、保存したZIPを解凍すると名前が変わったファイルが得られます（元のファイルはそのままです）。',
      '処理の順番は 置換 → 大文字小文字の変換 → 連番 → 接頭辞・接尾辞 → 拡張子 です。置換と大文字小文字の変換は拡張子を除いた部分だけが対象で、拡張子は「拡張子」の設定で別に変更します。',
      '変更後の名前が他のファイルと同じ（大文字小文字は区別しません）になる場合や、空になる場合は保存できません。ZIPの中ではフォルダ区切りやパス指定にならないよう、/ \\ : * ? " < > | などの使えない文字は _ に置き換えます。',
      '連番は並び順どおりに、開始番号から増分ずつ振ります。桁数は最大10、一度に扱えるファイルは5,000個まで、ZIPにまとめられるのは合計100MBまでです。',
      '「ZIPで保存」では圧縮せず格納のみで保存します。フォルダ構造は扱わず、すべてZIPの直下に入ります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '連番（ゼロ埋め）',
        description:
          '001・002・003 のように、桁数をそろえて先頭を0で埋めた番号です。桁をそろえると、ファイルの並び替えが名前順でも番号順になり、10番が2番より前に来る問題を防げます。',
      },
      {
        term: '自然順',
        description:
          'file2 の次に file10 が来るように、名前に含まれる数字を数値として比べる並べ方です。単純な文字順だと file10 が file2 より前になります。',
      },
      {
        term: '正規表現',
        description:
          '文字列のパターンを書いて一致する部分を探す記法です。丸括弧で囲んだ部分は $1 のように置換後の文字列で再利用できます。',
      },
    ],
  },
  en: {
    title: 'Bulk File Renamer (Number, Replace, Save as ZIP)',
    description:
      'Rename many files at once with numbering, find and replace, and case changes. Preview the new names, then save them as a ZIP. Runs in your browser; no uploads.',
    h1: 'Bulk File Renamer',
    introHtml:
      'Rename several files at once: add sequence numbers, find and replace text (regex supported), change case, or add a prefix or suffix. A browser cannot rename your original files, so the renamed copies are bundled into a ZIP for download. To inspect or extract the archive, use the <a href="/en/tools/zip-tool/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ZIP Maker & Extractor</a>.',
    dropLabel: 'Files to rename (select several)',
    dropHint:
      'Drag and drop files here, or pick several with the button. Each pick adds to the list.',
    fileSummary: '{count} files ({size} in total)',
    clearAll: 'Remove all',
    sortLabel: 'Order (used for numbering)',
    sortSelection: 'As selected',
    sortName: 'Natural name order (file2, file10)',
    replaceLegend: 'Find and replace',
    findLabel: 'Find',
    replaceLabel: 'Replace with',
    regexLabel: 'Use regular expression',
    ignoreCaseLabel: 'Ignore case',
    caseLabel: 'Change case (extension excluded)',
    caseNone: 'Keep as is',
    caseLower: 'All lowercase',
    caseUpper: 'All uppercase',
    affixLegend: 'Prefix and suffix',
    prefixLabel: 'Text to add at the start',
    suffixLabel: 'Text to add at the end (before the extension)',
    numberingLegend: 'Numbering',
    numberingEnable: 'Add sequence numbers',
    startLabel: 'Start at',
    stepLabel: 'Step',
    digitsLabel: 'Digits (zero padding)',
    positionLabel: 'Number position',
    posSuffix: 'After the name',
    posPrefix: 'Before the name',
    posReplace: 'Replace the name with the number',
    separatorLabel: 'Separator from the name',
    extLegend: 'Extension',
    extLabel: 'What to do with the extension',
    extKeep: 'Keep as is',
    extLower: 'Make lowercase',
    extUpper: 'Make uppercase',
    extChange: 'Change to another extension',
    extRemove: 'Remove it',
    newExtLabel: 'New extension (e.g. jpg)',
    previewHeading: 'Preview of the new names',
    summary: '{changed} of {total} names will change.',
    moreRows: '… and {n} more (only the first rows are shown)',
    emptyList: 'Add files to see the names before and after here.',
    colOriginal: 'Before',
    colRenamed: 'After',
    colStatus: 'Status',
    statusOk: 'Changed',
    statusUnchanged: 'Unchanged',
    issueEmpty: 'The name would be empty',
    issueDuplicate: 'The name clashes with another file',
    issueSanitized: 'Invalid characters or trailing dots were adjusted',
    issueReserved: 'Reserved name on Windows',
    issueTooLong: 'The name exceeds 255 characters',
    zipNameLabel: 'ZIP file name',
    zipButton: 'Save as ZIP',
    zipDone: 'Saved {count} renamed files to {name}.',
    errorTooManyFiles: 'You can add up to {max} files at a time.',
    errorInvalidRegex: 'The regular expression is not valid.',
    errorPatternTooLong: 'Keep the regular expression within 200 characters.',
    errorInvalidNumber:
      'Use whole numbers: start 0 to 999999999, step 1 to 99999, digits 1 to 10.',
    errorTextTooLong: 'A text field is too long (100 characters at most).',
    errorBlocked:
      'Some names are duplicated, empty, or too long, so nothing can be saved. Check the status column in the preview.',
    errorZipTooLarge:
      'A ZIP can hold up to 100 MB in total. Try again with fewer files.',
    errorZipFailed: 'Could not create the ZIP. The files could not be read.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drop the files you want to rename into the box.',
      'Choose the replace, case, prefix and suffix, numbering, and extension options.',
      'Check the new names and statuses (duplicates, empty names) in the preview table.',
      'Enter a ZIP file name and press "Save as ZIP".',
    ],
    notesHeading: 'Notes',
    notes: [
      'A browser cannot rename your original files directly. This tool bundles copies under the new names into a ZIP; extract it to get the renamed files. Your originals are left untouched.',
      'Options are applied in this order: replace, case change, numbering, prefix and suffix, then the extension. Replace and case change affect only the part before the extension, which has its own setting.',
      'Saving is blocked when a new name matches another file (case is ignored) or is empty. Characters that are not allowed, such as / \\ : * ? " < > |, are replaced with _ so a name can never act as a folder path.',
      'Numbers are assigned in the chosen order, from the start value by the step. Up to 10 digits, 5,000 files at a time, and 100 MB in total for the ZIP.',
      '"Save as ZIP" stores files without compression and puts everything at the top level of the ZIP; folder structure is not kept.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Zero padding',
        description:
          'Filling a number with leading zeros to a fixed width, like 001, 002, 003. With equal widths, sorting by name also sorts by number, so 10 does not land before 2.',
      },
      {
        term: 'Natural order',
        description:
          'A sort that compares digits as numbers, so file10 comes after file2. A plain text sort would put file10 before file2.',
      },
      {
        term: 'Regular expression',
        description:
          'A notation for describing text patterns. Parts in parentheses can be reused in the replacement as $1, $2, and so on.',
      },
    ],
  },
};
