import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TextReplaceToolsPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  modeLabel: string;
  modeReplace: string;
  modeExtract: string;
  modeAffix: string;
  modeNumberAdd: string;
  modeNumberRemove: string;
  modeReverse: string;
  findLabel: string;
  replaceLabel: string;
  keywordLabel: string;
  regexOption: string;
  ignoreCaseOption: string;
  invertOption: string;
  prefixLabel: string;
  suffixLabel: string;
  skipEmptyOption: string;
  startLabel: string;
  stepLabel: string;
  separatorLabel: string;
  zeroPadOption: string;
  reverseHint: string;
  numberRemoveHint: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {count} をスクリプト側で置換する。モードごとに件数の意味が異なる */
  countReplace: string;
  countExtract: string;
  countAffix: string;
  countNumberAdd: string;
  countNumberRemove: string;
  countReverse: string;
  invalidRegex: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const textReplaceToolsContent: Record<
  Locale,
  TextReplaceToolsPageContent
> = {
  ja: {
    title: 'テキスト一括置換・行操作（行番号付与・行の抽出・前後に文字追加）',
    description:
      'テキストの一括置換（正規表現対応）、行番号の付与・削除、キーワードを含む行の抽出・除外、各行の前後への文字追加、行の逆順をブラウザ上で行える無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'テキスト一括置換・行操作ツール',
    introHtml:
      '文字列の一括置換と、行単位の加工（行番号の付与・削除、キーワードで行を抽出・除外、各行の前後に文字を追加、行の逆順）を1か所で行います。重複行の削除・ソート・空行の削除は <a href="/tools/text-list-tools/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字列の重複削除・ソート・シャッフル</a> をご利用ください。',
    howToHeading: '使い方',
    howToSteps: [
      '「入力テキスト」に加工したいテキストを貼り付けます。',
      '「操作」から、置換・行の抽出・前後に文字を追加・行番号を付ける・行番号を消す・行を逆順にする、のいずれかを選び、表示された項目を入力します。',
      '「結果」を確認し、「コピー」で取り出します。',
    ],
    inputLabel: '入力テキスト',
    inputPlaceholder: '加工したいテキストを入力（1行1項目）',
    sampleText: 'apple\nbanana\n\ncherry\nbanana split',
    modeLabel: '操作',
    modeReplace: '置換',
    modeExtract: '行の抽出・除外',
    modeAffix: '各行の前後に文字を追加',
    modeNumberAdd: '行番号を付ける',
    modeNumberRemove: '行番号を消す',
    modeReverse: '行を逆順にする',
    findLabel: '検索する文字列',
    replaceLabel: '置換後の文字列',
    keywordLabel: '含まれる文字列',
    regexOption: '正規表現を使う',
    ignoreCaseOption: '大文字・小文字を区別しない',
    invertOption: '一致した行を取り除く（一致しない行を残す）',
    prefixLabel: '各行の先頭に追加',
    suffixLabel: '各行の末尾に追加',
    skipEmptyOption: '空行は対象にしない',
    startLabel: '開始番号',
    stepLabel: '増分',
    separatorLabel: '番号と本文の区切り',
    zeroPadOption: '桁数をそろえてゼロ埋め（01, 02…）',
    reverseHint: '行の並び順を上下逆にします。設定項目はありません。',
    numberRemoveHint:
      '「1. 」「2) 」「3: 」「4、」「5 」のような行頭の番号を取り除きます。',
    outputLabel: '結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    countReplace: '{count}件を置換しました',
    countExtract: '一致した行: {count}行',
    countAffix: '{count}行に追加しました',
    countNumberAdd: '{count}行に番号を付けました',
    countNumberRemove: '{count}行から番号を取り除きました',
    countReverse: '{count}行を逆順にしました',
    invalidRegex: '正規表現の書式が正しくありません。',
    notesHeading: '注意点',
    notes: [
      '正規表現を使うときは、置換後の文字列に $1（1番目のかっこの内容）や $&（一致した部分全体）が使えます。^ と $ は行頭・行末に一致します。',
      '「正規表現を使う」をオフにすると、. や ( などもそのままの文字として検索・置換します。',
      '行単位の操作の結果は改行コードをLFにそろえて出力します（置換だけは入力の改行コードをそのまま保ちます）。',
      '行番号を消す操作は、行頭の数字と、それに続く記号（ピリオド・かっこ・コロン・読点）やスペース・タブまで取り除きます。100 apples のように数字から始まる本文や、1.5 kg・10:30 のような小数・時刻は、行番号とみなして数字が消える場合があります。',
      '非常に複雑な正規表現や巨大なテキストでは、ブラウザの処理が重くなる場合があります。',
      'すべての処理はブラウザ内で完結しており、入力したテキストがサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '正規表現',
        description:
          '文字列のパターンを記号で表す書き方です。たとえば \\d+ は連続する数字、^foo は「foo」で始まる行に一致します。',
      },
      {
        term: 'キャプチャ（後方参照）',
        description:
          '正規表現のかっこ ( ) で囲んだ部分を取り出す機能です。置換後の文字列で $1、$2 と書くと、その内容を並べ替えて使えます。',
      },
    ],
  },
  en: {
    title: 'Find & Replace and Line Tools (Line Numbers, Filter)',
    description:
      'Bulk find and replace (regex), add or remove line numbers, filter lines, add a prefix or suffix, reverse lines. Runs in your browser; nothing is uploaded.',
    h1: 'Find & Replace and Line Operations',
    introHtml:
      'Bulk find and replace, plus line-by-line edits in one place: add or remove line numbers, keep or remove lines that contain a keyword, add text to the start or end of every line, and reverse the line order. To remove duplicate lines, sort, or delete empty lines, use the <a href="/en/tools/text-list-tools/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text List Deduplicate, Sort &amp; Shuffle</a> tool.',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste the text you want to edit into "Input text".',
      'Pick an "Operation" (replace, filter lines, add prefix/suffix, add line numbers, remove line numbers, or reverse lines) and fill in the fields that appear.',
      'Check the "Result" and take it out with "Copy".',
    ],
    inputLabel: 'Input text',
    inputPlaceholder: 'Enter the text to edit (one item per line)',
    sampleText: 'apple\nbanana\n\ncherry\nbanana split',
    modeLabel: 'Operation',
    modeReplace: 'Find & replace',
    modeExtract: 'Keep / remove lines',
    modeAffix: 'Add prefix / suffix to each line',
    modeNumberAdd: 'Add line numbers',
    modeNumberRemove: 'Remove line numbers',
    modeReverse: 'Reverse line order',
    findLabel: 'Find',
    replaceLabel: 'Replace with',
    keywordLabel: 'Lines containing',
    regexOption: 'Use regular expression',
    ignoreCaseOption: 'Ignore case',
    invertOption: 'Remove matching lines (keep the rest)',
    prefixLabel: 'Add to the start of each line',
    suffixLabel: 'Add to the end of each line',
    skipEmptyOption: 'Skip empty lines',
    startLabel: 'Start at',
    stepLabel: 'Step',
    separatorLabel: 'Separator after the number',
    zeroPadOption: 'Zero-pad to equal width (01, 02…)',
    reverseHint: 'Flips the order of the lines. There are no options.',
    numberRemoveHint:
      'Strips leading numbers such as "1. ", "2) ", "3: " or "4 " from each line.',
    outputLabel: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    countReplace: '{count} replaced',
    countExtract: 'Matching lines: {count}',
    countAffix: 'Added to {count} lines',
    countNumberAdd: 'Numbered {count} lines',
    countNumberRemove: 'Removed numbers from {count} lines',
    countReverse: 'Reversed {count} lines',
    invalidRegex: 'The regular expression is not valid.',
    notesHeading: 'Notes',
    notes: [
      'With regular expressions on, the replacement can use $1 (the first group) and $& (the whole match). ^ and $ match the start and end of each line.',
      'With "Use regular expression" off, characters such as . and ( are searched and replaced literally.',
      'Line operations output LF line endings (only Find & replace keeps the line endings of your input).',
      'Removing line numbers strips a leading number plus any following punctuation (period, parenthesis, colon), space or tab. Text that genuinely starts with a number, such as 100 apples, 1.5 kg or 10:30, may lose its number.',
      'Very complex regular expressions or huge texts may slow down your browser.',
      'Everything runs entirely in your browser — the text you enter is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Regular expression',
        description:
          'A notation for describing text patterns. For example \\d+ matches a run of digits and ^foo matches lines starting with "foo".',
      },
      {
        term: 'Capture group (backreference)',
        description:
          'The part of a regular expression wrapped in ( ). In the replacement, $1, $2 insert those captured parts so you can reorder them.',
      },
    ],
  },
};
