import type { Locale } from '../../data/tools';

export interface StringSimilarityPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputALabel: string;
  inputBLabel: string;
  inputPlaceholder: string;
  unitLabel: string;
  unitCodepoint: string;
  unitGrapheme: string;
  ignoreCase: string;
  statDistance: string;
  statDamerau: string;
  statSimilarity: string;
  statJaroWinkler: string;
  statLengths: string;
  statOps: string;
  /** {a} {b} を置換 */
  lengthsTemplate: string;
  /** {ins} {del} {sub} を置換 */
  opsTemplate: string;
  diffHeading: string;
  legendDelete: string;
  legendInsert: string;
  legendReplace: string;
  /** 操作一覧 */
  opsHeading: string;
  columnOp: string;
  columnFrom: string;
  columnTo: string;
  opEqual: string;
  opInsert: string;
  opDelete: string;
  opReplace: string;
  /** {shown} {total} を置換 */
  truncatedTemplate: string;
  /** {max} {a} {b} を置換 */
  tooLongTemplate: string;
  emptyHint: string;
  notesHeading: string;
  notes: string[];
}

export const stringSimilarityContent: Record<
  Locale,
  StringSimilarityPageContent
> = {
  ja: {
    title: '文字列の類似度・編集距離（レーベンシュタイン）計算',
    description:
      '2つの文字列の編集距離（レーベンシュタイン）・類似率・挿入/削除/置換の操作列を計算します。絵文字や結合文字も正しく数えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '文字列の類似度・編集距離計算',
    introHtml:
      '2つの文字列がどれだけ似ているかを、編集距離（レーベンシュタイン距離）と類似率で数値化し、どこを挿入・削除・置換すれば一致するかを表示します。行や文字の違いを見比べたいだけなら <a href="/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト差分比較</a> も便利です。',
    inputALabel: '文字列A',
    inputBLabel: '文字列B',
    inputPlaceholder: '比較したい文字列を入力',
    unitLabel: '数える単位',
    unitCodepoint: 'コードポイント',
    unitGrapheme: '書記素（見た目の1文字）',
    ignoreCase: '大文字・小文字の違いを無視する',
    statDistance: '編集距離（レーベンシュタイン）',
    statDamerau: '編集距離（隣接転置を1回と数える）',
    statSimilarity: '類似率',
    statJaroWinkler: 'Jaro-Winkler 類似度',
    statLengths: '長さ',
    statOps: '内訳',
    lengthsTemplate: 'A: {a}文字 / B: {b}文字',
    opsTemplate: '挿入 {ins} / 削除 {del} / 置換 {sub}',
    diffHeading: 'AからBへの変更',
    legendDelete: '削除',
    legendInsert: '挿入',
    legendReplace: '置換',
    opsHeading: '操作の一覧',
    columnOp: '操作',
    columnFrom: 'A',
    columnTo: 'B',
    opEqual: '一致',
    opInsert: '挿入',
    opDelete: '削除',
    opReplace: '置換',
    truncatedTemplate:
      '操作が多いため先頭の{shown}件のみ表示しています（全{total}件）。',
    tooLongTemplate:
      '長すぎるため計算できません。各文字列は{max}文字までです（現在 A: {a}、B: {b}）。',
    emptyHint: '2つの文字列を入力すると結果が表示されます。',
    notesHeading: '注意点',
    notes: [
      '編集距離は、挿入・削除・置換をそれぞれ1回と数えて、AをBに変えるのに必要な最小の操作回数です。',
      '類似率は 1 −（編集距離 ÷ 長い方の文字数）で求めます。両方が空なら 100% です。',
      '操作列は、最小回数になる組み合わせのうちの1つです。同じ回数でも別の組み合わせが存在することがあります。',
      '処理が重くなるのを防ぐため、各文字列は5000文字までです。',
      '「書記素（見た目の1文字）」を選ぶと、結合文字や絵文字の組み合わせを見た目の1文字として数えます。ブラウザが対応していない場合はコードポイント単位になります。',
      'すべての処理はブラウザ内で完結しており、入力した文字列がサーバーに送信されることはありません。',
    ],
  },
  en: {
    title: 'String Similarity & Edit Distance (Levenshtein)',
    description:
      'Compare two strings: Levenshtein edit distance, similarity percentage, and insert/delete/replace steps. Emoji-safe. Runs in your browser; nothing is uploaded.',
    h1: 'String Similarity & Edit Distance Calculator',
    introHtml:
      'Measures how alike two strings are with Levenshtein edit distance and a similarity percentage, and lists the inserts, deletes, and replacements that turn one into the other. To see line-by-line changes instead, use the <a href="/en/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Diff Checker</a>.',
    inputALabel: 'String A',
    inputBLabel: 'String B',
    inputPlaceholder: 'Enter a string to compare',
    unitLabel: 'Count by',
    unitCodepoint: 'Code points',
    unitGrapheme: 'Graphemes (visible characters)',
    ignoreCase: 'Ignore case differences',
    statDistance: 'Edit distance (Levenshtein)',
    statDamerau: 'Edit distance (adjacent swap counts as 1)',
    statSimilarity: 'Similarity',
    statJaroWinkler: 'Jaro-Winkler similarity',
    statLengths: 'Length',
    statOps: 'Breakdown',
    lengthsTemplate: 'A: {a} / B: {b}',
    opsTemplate: 'Insert {ins} / Delete {del} / Replace {sub}',
    diffHeading: 'Changes from A to B',
    legendDelete: 'Delete',
    legendInsert: 'Insert',
    legendReplace: 'Replace',
    opsHeading: 'Edit steps',
    columnOp: 'Operation',
    columnFrom: 'A',
    columnTo: 'B',
    opEqual: 'Keep',
    opInsert: 'Insert',
    opDelete: 'Delete',
    opReplace: 'Replace',
    truncatedTemplate:
      'Showing the first {shown} of {total} steps because there are many.',
    tooLongTemplate:
      'Too long to compute. Each string can be up to {max} characters (now A: {a}, B: {b}).',
    emptyHint: 'Enter two strings to see the result.',
    notesHeading: 'Notes',
    notes: [
      'Edit distance is the minimum number of single-character inserts, deletes, and replacements needed to turn A into B.',
      'Similarity is 1 - (edit distance / length of the longer string). Two empty strings count as 100%.',
      'The step list is one of the possible minimal sequences; a different sequence with the same count can exist.',
      'To keep the page responsive, each string is limited to 5000 characters.',
      '"Graphemes (visible characters)" counts combining marks and emoji sequences as one character. If your browser does not support it, code points are used.',
      'Everything runs entirely in your browser - the strings you enter are never sent to a server.',
    ],
  },
};
