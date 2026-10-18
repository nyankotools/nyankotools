import type { Locale } from '../../data/tools';

export interface MemorizationSheetPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  sampleButton: string;
  wrapButton: string;
  wrapHint: string;
  styleLabel: string;
  styleRed: string;
  styleBlank: string;
  printLabel: string;
  printHidden: string;
  printShown: string;
  hideAllButton: string;
  showAllButton: string;
  printButton: string;
  copyAnswersButton: string;
  copied: string;
  copyFailed: string;
  previewLabel: string;
  previewEmpty: string;
  /** `{count}` `{revealed}` を置換するテンプレート */
  countTemplate: string;
  /** 隠した語のボタンに付けるラベル */
  markAriaLabel: string;
  notesHeading: string;
  notes: string[];
}

export const memorizationSheetContent: Record<
  Locale,
  MemorizationSheetPageContent
> = {
  ja: {
    title: '暗記シート作成（赤シート・穴埋めプリント）',
    description:
      '覚えたい語を ** で囲むだけで、赤シートで隠せる暗記用プリントを作成できます。クリックで答えを確認でき、隠した状態・答え入りの状態で印刷も可能。ブラウザ内で処理され、サーバーには送信されません。',
    h1: '暗記シート作成（赤シート・穴埋めプリント）',
    introHtml:
      '覚えたい語を <code>**語**</code> のように囲んで入力すると、赤シートをかぶせたように語が隠れた暗記シートができます。隠した語はクリック（タップ）で個別に確認でき、全体を隠す・表示する切り替えや、答えだけを並べたコピーもできます。テキストの文字数を数えたいときは <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もご利用ください。',
    inputLabel: '暗記したい文章（隠したい語を ** で囲む）',
    inputPlaceholder: '例: 日本の首都は**東京**です。',
    sampleText:
      '日本の首都は**東京**です。\n光合成は**葉緑体**で行われ、**二酸化炭素**と**水**から**デンプン**と**酸素**ができます。\n鎌倉幕府を開いたのは**源頼朝**（**1192年**）。',
    sampleButton: 'サンプルを入力',
    wrapButton: '選択範囲を ** で囲む',
    wrapHint:
      '文章中の語を選んでからボタンを押すと、囲みの追加・解除ができます。',
    styleLabel: '隠し方',
    styleRed: '赤シート（赤い帯）',
    styleBlank: '空欄（下線）',
    printLabel: '印刷時の状態',
    printHidden: '語を隠して印刷',
    printShown: '答えを赤字で印刷',
    hideAllButton: 'すべて隠す',
    showAllButton: 'すべて表示',
    printButton: '印刷',
    copyAnswersButton: '答えの一覧をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    previewLabel: '暗記シート（隠した語をクリックで表示）',
    previewEmpty: '文章を入力すると、ここに暗記シートが表示されます。',
    countTemplate: '隠した語: {count}個（表示中 {revealed}個）',
    markAriaLabel: '隠した語（クリックで表示・非表示を切り替え）',
    notesHeading: '注意点',
    notes: [
      '隠せるのは ** で囲んだ語だけです。閉じていない ** や、中身が空の **** は、そのまま文字として表示されます。',
      '入力した文章は文字として表示するだけで、HTMLとしては解釈しません。<b> などのタグを書いても、そのまま表示されます。',
      '印刷の状態は画面の表示とは独立しており、印刷時の状態の設定どおりに出力されます。赤い帯が薄くなる場合は、ブラウザの印刷設定で背景のグラフィックを有効にしてください。',
      '隠した語は幅を保ったまま隠れるため、語の長さがヒントになります。長さを伏せたい場合は、空欄の表示で確認してください。',
      'すべての処理はブラウザ内で完結し、入力した文章がサーバーに送信されることはありません。',
    ],
  },
  en: {
    title: 'Memorization Sheet Maker (Red Sheet Flashcards)',
    description:
      'Wrap key terms in ** to make a study sheet that hides them like a red sheet. Click to reveal answers and print hidden or revealed. Runs in your browser.',
    h1: 'Memorization Sheet Maker (Red Sheet, Fill-in-the-Blank)',
    introHtml:
      'Wrap the words you want to learn like <code>**term**</code> and they are covered up as if by a red study sheet. Click or tap a term to peek at it, hide or show everything at once, and copy a list of just the answers. To count the characters in your notes, try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a>.',
    inputLabel: 'Study text (wrap terms to hide in **)',
    inputPlaceholder: 'Example: The capital of Japan is **Tokyo**.',
    sampleText:
      'The capital of Japan is **Tokyo**.\nPhotosynthesis happens in the **chloroplast**, turning **carbon dioxide** and **water** into **glucose** and **oxygen**.\nThe Kamakura shogunate was founded by **Minamoto no Yoritomo** in **1192**.',
    sampleButton: 'Insert sample',
    wrapButton: 'Wrap selection in **',
    wrapHint:
      'Select some text, then press the button to add or remove the markers.',
    styleLabel: 'Hiding style',
    styleRed: 'Red sheet (red bar)',
    styleBlank: 'Blank (underline)',
    printLabel: 'Print state',
    printHidden: 'Print with terms hidden',
    printShown: 'Print with answers in red',
    hideAllButton: 'Hide all',
    showAllButton: 'Show all',
    printButton: 'Print',
    copyAnswersButton: 'Copy answer list',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    previewLabel: 'Study sheet (click a hidden term to reveal it)',
    previewEmpty: 'Your study sheet will appear here once you enter text.',
    countTemplate: 'Hidden terms: {count} ({revealed} shown)',
    markAriaLabel: 'Hidden term (click to show or hide)',
    notesHeading: 'Notes',
    notes: [
      'Only text wrapped in ** is hidden. An unclosed ** or an empty **** is shown as plain characters.',
      'Your text is displayed as plain text and never interpreted as HTML, so tags such as <b> appear exactly as typed.',
      'The print state is independent of what is on screen and follows the "Print state" setting. If the red bars look faint, enable background graphics in your browser print dialog.',
      'Hidden terms keep their width, so the length can be a hint. Use the blank style if you would rather not give that away.',
      'Everything runs in your browser; the text you enter is never sent to a server.',
    ],
  },
};
