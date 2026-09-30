import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TextListToolsPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  trimLabel: string;
  removeEmptyLabel: string;
  dedupeLabel: string;
  caseInsensitiveLabel: string;
  sortLabel: string;
  sortOptionNone: string;
  sortOptionAsc: string;
  sortOptionDesc: string;
  sortOptionNumericAsc: string;
  sortOptionNumericDesc: string;
  sortOptionShuffle: string;
  reshuffleButton: string;
  copy: string;
  copied: string;
  copyFailed: string;
  outputLabel: string;
  countTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const textListToolsContent: Record<Locale, TextListToolsPageContent> = {
  ja: {
    title: '文字列リストの重複削除・ソート・シャッフルツール',
    description:
      '改行区切りのテキストを対象に、重複行の削除・昇順/降順/数値ソート・ランダムシャッフルができる無料ツールです。空行削除や前後の空白削除にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '文字列の重複削除・ソート・シャッフル',
    introHtml:
      '1行1項目のテキストを対象に、重複行の削除・並び替え（ソート）・ランダムなシャッフルをまとめて行えます。メールアドレスや名簿、タグ一覧などの整理に便利です。行数や文字数を確認したい場合は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もあわせてご利用ください。',
    inputLabel: '入力（1行1項目）',
    inputPlaceholder: '例:\nbanana\napple\napple\ncherry',
    sampleText: 'banana\napple\napple\ncherry',
    trimLabel: '各行の前後の空白を削除する',
    removeEmptyLabel: '空行を削除する',
    dedupeLabel: '重複する行を削除する',
    caseInsensitiveLabel:
      '大文字・小文字を区別しない（重複削除・ソートに適用）',
    sortLabel: '並び替え',
    sortOptionNone: 'そのまま（並び替えない）',
    sortOptionAsc: '昇順（あ→ん、A→Z）',
    sortOptionDesc: '降順（ん→あ、Z→A）',
    sortOptionNumericAsc: '数値として昇順',
    sortOptionNumericDesc: '数値として降順',
    sortOptionShuffle: 'シャッフル（ランダム）',
    reshuffleButton: 'もう一度シャッフルする',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    outputLabel: '結果',
    countTemplate: '{count}行',
    notesHeading: '注意点',
    notes: [
      '重複削除は最初に出現した行を残します。どの表記が残るか気になる場合は、事前に前後の空白削除や大文字・小文字を区別しないオプションと組み合わせて調整してください。',
      '数値ソートは各行の中から最初に見つかった数値を基準に比較します。数値を含まない行は並び替え後の末尾にまとまります。',
      'シャッフルは選択するたびにランダムな結果になります。同じ並びをもう一度得たい場合は「もう一度シャッフルする」ボタンではなく、結果をコピーして保存してください。',
      'すべての処理はブラウザ内で完結し、入力したテキストがサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '重複削除（ユニーク化）',
        description:
          '同じ内容の行が複数ある場合に、最初に出てきた1行だけを残して残りを取り除くことです。メールアドレスや商品コードの一覧から重複を取り除きたい時などに使います。',
      },
      {
        term: '辞書順ソート',
        description:
          '文字コードや五十音・アルファベット順に基づいて並び替えることです。数値として大小を比較したい場合は「10」が「2」より前に来てしまうことがあるため、その場合は数値ソートを使います。',
      },
      {
        term: 'シャッフル（ランダム化）',
        description:
          'リストの並び順をランダムに入れ替えることです。抽選の順番決めやアンケート項目の順序をランダム化したい時などに使います。ボタンを押すたびに毎回異なる結果になります。',
      },
    ],
  },
  en: {
    title: 'Text List Deduplicate, Sort & Shuffle Tool',
    description:
      'Deduplicates lines, sorts them (alphabetical, reverse, or numeric), or shuffles them randomly for any newline-separated text. Also removes empty lines and trims whitespace. Your data is processed in the browser and never sent to a server.',
    h1: 'Text List Deduplicate, Sort & Shuffle',
    introHtml:
      'Cleans up a list of one item per line by deduplicating lines, sorting them, or shuffling them into a random order. Handy for tidying up email lists, name rosters, or tag lists. To check the number of lines or characters, also try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a> tool.',
    inputLabel: 'Input (one item per line)',
    inputPlaceholder: 'e.g.\nbanana\napple\napple\ncherry',
    sampleText: 'banana\napple\napple\ncherry',
    trimLabel: 'Trim leading/trailing whitespace on each line',
    removeEmptyLabel: 'Remove empty lines',
    dedupeLabel: 'Remove duplicate lines',
    caseInsensitiveLabel: 'Ignore case (applies to deduplication and sorting)',
    sortLabel: 'Sort',
    sortOptionNone: 'Keep original order',
    sortOptionAsc: 'Ascending (A to Z)',
    sortOptionDesc: 'Descending (Z to A)',
    sortOptionNumericAsc: 'Numeric ascending',
    sortOptionNumericDesc: 'Numeric descending',
    sortOptionShuffle: 'Shuffle (random)',
    reshuffleButton: 'Shuffle again',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    outputLabel: 'Result',
    countTemplate: '{count} lines',
    notesHeading: 'Notes',
    notes: [
      "Deduplication keeps the first occurrence of each line. If you're not sure which spelling will be kept, combine it with the whitespace-trim or ignore-case options first.",
      'Numeric sort compares lines using the first number found in each line. Lines without a number are grouped at the end after sorting.',
      'Shuffle produces a different random result every time. If you want to keep a particular result, copy it instead of relying on the "Shuffle again" button to reproduce it.',
      'All processing happens in your browser — the text you enter is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Deduplication',
        description:
          'When multiple lines have the same content, only the first occurrence is kept and the rest are removed. Handy for cleaning up lists of email addresses or product codes.',
      },
      {
        term: 'Lexicographic sort',
        description:
          'Sorting based on character order (alphabetical order). Comparing values as text can put "10" before "2", so use numeric sort instead when you want to compare by numeric value.',
      },
      {
        term: 'Shuffle (randomize)',
        description:
          'Randomly reorders the lines in a list. Useful for randomizing the order of a raffle or survey questions. Each click produces a different result.',
      },
    ],
  },
};
