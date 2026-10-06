import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TextMergeToolPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  inputALabel: string;
  inputBLabel: string;
  inputPlaceholder: string;
  sampleA: string;
  sampleB: string;
  insertSample: string;
  hunksHeading: string;
  /** {count} をスクリプト側で置換する */
  statusTemplate: string;
  noChanges: string;
  allA: string;
  allB: string;
  allBoth: string;
  hunkTitleTemplate: string;
  sideA: string;
  sideB: string;
  emptySide: string;
  choiceA: string;
  choiceB: string;
  choiceAB: string;
  choiceBA: string;
  choiceNone: string;
  resultLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  downloadFileName: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const textMergeToolContent: Record<Locale, TextMergeToolPageContent> = {
  ja: {
    title: 'テキストマージツール（2つのテキストを統合・差分を選んで結合）',
    description:
      '2つのバージョンのテキストを行単位で比較し、差分の箇所ごとにA・Bのどちらを採用するか選んで1つに統合できる無料ツールです。結果は手動で編集でき、コピー・ダウンロードも可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'テキストマージツール（2つのバージョンを統合）',
    introHtml:
      '2つのテキストの差分を箇所ごとに表示し、A・Bのどちらを採用するかを選んで1つのテキストに統合します。選んだ結果は下のマージ結果欄にそのまま反映され、手で直すこともできます。差分を見るだけなら <a href="/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト差分比較</a> が便利です。',
    howToHeading: '使い方',
    howToSteps: [
      '「テキストA」と「テキストB」に、統合したい2つのバージョンを貼り付けます。',
      '差分の箇所ごとに、採用する側（A・B・両方・どちらも採用しない）を選びます。まとめて決めるときは「すべてAにする」「すべてBにする」が使えます。',
      '「マージ結果」を必要に応じて手で編集し、「コピー」または「ダウンロード」で取り出します。',
    ],
    inputALabel: 'テキストA',
    inputBLabel: 'テキストB',
    inputPlaceholder: '統合したいテキストを入力',
    sampleA: 'name: sample\nport: 3000\nmode: dev\ndebug: true\nlog: info',
    sampleB: 'name: sample\nport: 8080\nmode: dev\nlog: warn\ntimeout: 30',
    insertSample: 'サンプルを入れる',
    hunksHeading: '差分の箇所ごとの採用',
    statusTemplate: '差分の箇所: {count}件',
    noChanges: '差分はありません。AとBは同じ内容です。',
    allA: 'すべてAにする',
    allB: 'すべてBにする',
    allBoth: 'すべて両方（A→B）にする',
    hunkTitleTemplate: '差分 {n} / {total}',
    sideA: 'A',
    sideB: 'B',
    emptySide: '（なし）',
    choiceA: 'Aを採用',
    choiceB: 'Bを採用',
    choiceAB: '両方（A→Bの順）',
    choiceBA: '両方（B→Aの順）',
    choiceNone: 'どちらも採用しない',
    resultLabel: 'マージ結果（直接編集できます）',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'ダウンロード',
    downloadFileName: 'merged.txt',
    notesHeading: '注意点',
    notes: [
      '比較は行単位です。1行の中の一部だけを取り込むことはできないため、細かい調整はマージ結果欄で直接編集してください。',
      '「マージ結果」を直接編集した内容は、A・Bの入力や差分ごとの採用を変更すると、選択に従った結果で作り直されます。手で直すのは最後に行ってください。',
      '改行コードの違い（CRLF・LF）は無視して比較し、結果はLFで出力します。',
      '非常に長いテキスト（数千行以上）では、ブラウザの処理が重くなる場合があります。',
      'すべての処理はブラウザ内で完結しており、入力したテキストがサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'マージ（merge）',
        description:
          '2つのバージョンに分かれた内容を、1つにまとめ直すことです。バージョン管理（Gitなど）では、別々に編集された変更を取り込む操作を指します。',
      },
      {
        term: '差分の箇所（ハンク）',
        description:
          '2つのテキストで内容が異なる、連続した行のまとまりです。このツールでは箇所ごとに、Aの内容・Bの内容・両方・どちらも採用しない、から選べます。',
      },
    ],
  },
  en: {
    title: 'Text Merge Tool (Combine Two Versions, Pick Changes)',
    description:
      'Merge two versions of a text: pick A, B, or both for each difference, edit the result, then copy or download it. Runs in your browser; nothing is uploaded.',
    h1: 'Text Merge Tool (Combine Two Versions)',
    introHtml:
      'Shows every difference between two texts and lets you pick A, B, or both for each one, merging them into a single text. The result appears in the merged output below, where you can still edit it by hand. If you only want to see the differences, use the <a href="/en/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Diff Checker</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste the two versions you want to combine into "Text A" and "Text B".',
      'For each difference, choose which side to keep (A, B, both, or neither). To decide everything at once, use "Take all A" or "Take all B".',
      'Edit the "Merged result" by hand if needed, then take it out with "Copy" or "Download".',
    ],
    inputALabel: 'Text A',
    inputBLabel: 'Text B',
    inputPlaceholder: 'Enter the text you want to merge',
    sampleA: 'name: sample\nport: 3000\nmode: dev\ndebug: true\nlog: info',
    sampleB: 'name: sample\nport: 8080\nmode: dev\nlog: warn\ntimeout: 30',
    insertSample: 'Insert sample',
    hunksHeading: 'Choose per difference',
    statusTemplate: 'Differences: {count}',
    noChanges: 'No differences. A and B are identical.',
    allA: 'Take all A',
    allB: 'Take all B',
    allBoth: 'Take all both (A then B)',
    hunkTitleTemplate: 'Difference {n} of {total}',
    sideA: 'A',
    sideB: 'B',
    emptySide: '(nothing)',
    choiceA: 'Keep A',
    choiceB: 'Keep B',
    choiceAB: 'Both (A then B)',
    choiceBA: 'Both (B then A)',
    choiceNone: 'Keep neither',
    resultLabel: 'Merged result (editable)',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Download',
    downloadFileName: 'merged.txt',
    notesHeading: 'Notes',
    notes: [
      'Comparison is line-based. You cannot take just part of a line, so make fine adjustments by editing the merged result directly.',
      'Hand edits in the "Merged result" are rebuilt from your choices whenever you change A, B, or a per-difference choice, so do your manual edits last.',
      'Line-ending differences (CRLF vs LF) are ignored when comparing, and the result is output with LF.',
      'Very long texts (thousands of lines or more) may slow down your browser.',
      'Everything runs entirely in your browser — the text you enter is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Merge',
        description:
          'Combining content that has split into two versions back into one. In version control such as Git, it means bringing separately edited changes together.',
      },
      {
        term: 'Hunk (difference block)',
        description:
          'A run of consecutive lines that differ between the two texts. For each hunk this tool lets you keep A, keep B, keep both, or keep neither.',
      },
    ],
  },
};
