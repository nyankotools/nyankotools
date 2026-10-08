import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SudokuPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  difficultyLabel: string;
  difficultyEasy: string;
  difficultyNormal: string;
  difficultyHard: string;
  newGame: string;
  restart: string;
  boardLabel: string;
  /** {row} {col} {value} を置換して表示する */
  cellFilled: string;
  /** {row} {col} {notes} を置換して表示する */
  cellNotes: string;
  /** {row} {col} を置換して表示する */
  cellEmpty: string;
  cellGiven: string;
  padLabel: string;
  /** {n} を置換して表示する */
  padNumber: string;
  erase: string;
  noteMode: string;
  hint: string;
  check: string;
  /** {row} {col} {value} を置換して表示する */
  hintResult: string;
  hintNoCell: string;
  /** {n} を置換して表示する */
  mistakesFound: string;
  noMistakes: string;
  conflictsFound: string;
  solved: string;
  /** {clues} を置換して表示する */
  progress: string;
  keyboardHint: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const sudokuContent: Record<Locale, SudokuPageContent> = {
  ja: {
    title: '数独（ナンプレ）無料ゲーム｜問題生成・メモ・ヒント付き',
    description:
      'ブラウザで遊べる数独（ナンプレ）。簡単・普通・難しいの3段階で、唯一解の問題を毎回自動生成します。メモ（候補）入力、ヒント、誤りチェック、クリア判定に対応し、スマホはタップ入力パッドで操作可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '数独（ナンプレ）｜問題を自動生成して遊ぶ',
    introHtml:
      '難易度を選ぶだけで、答えが必ず1つに決まる数独の問題を自動生成します。メモ（候補）機能、ヒント、誤りチェックつきで、パソコンはキーボード、スマホは画面のパッドで操作できます。ほかのゲームでは <a href="/tools/bingo-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ビンゴ抽選機</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '難易度（簡単・普通・難しい）を選んで「新しい問題」を押します。',
      '空きマスをクリック（タップ）して選び、数字キーまたは画面の数字パッドで入力します。',
      '「メモ」をオンにすると、マスに小さく候補の数字を書き込めます。迷ったら「ヒント」や「誤りチェック」を使います。',
      'すべてのマスを正しく埋めるとクリアです。やり直すときは「最初から」を押します。',
    ],
    difficultyLabel: '難易度',
    difficultyEasy: '簡単',
    difficultyNormal: '普通',
    difficultyHard: '難しい',
    newGame: '新しい問題',
    restart: '最初から',
    boardLabel: '数独の盤面',
    cellFilled: '{row}行{col}列 {value}',
    cellNotes: '{row}行{col}列 空き メモ {notes}',
    cellEmpty: '{row}行{col}列 空き',
    cellGiven: '固定',
    padLabel: '数字パッド',
    padNumber: '{n}を入力',
    erase: '消す',
    noteMode: 'メモ',
    hint: 'ヒント',
    check: '誤りチェック',
    hintResult: 'ヒント: {row}行{col}列は {value} です。',
    hintNoCell: 'ヒントを出せる空きマスがありません。',
    mistakesFound: '正解と違うマスが {n} 個あります（赤で表示）。',
    noMistakes: '入力済みのマスに間違いはありません。',
    conflictsFound: '同じ行・列・ブロックで数字が重複しています（赤で表示）。',
    solved:
      'クリア！おめでとうございます。「新しい問題」で次の問題に挑戦できます。',
    progress: '残り {clues} マス',
    keyboardHint:
      'キーボード: 矢印キーでマス移動、1〜9で入力、0・Backspace・Deleteで消去、Nでメモのオン/オフ。',
    notesHeading: '注意事項',
    notes: [
      '問題は端末のブラウザ上で毎回ランダムに作成し、ソルバーで解が1つだけであることを確認しています。同じ問題が続けて出ることはほぼありません。',
      '難易度は初期配置の数（簡単は約40、普通は約32、難しいは約26）で調整しています。配置が少ないほど難しくなりますが、必要な解法のレベルまでは保証しません。',
      '重複した数字は入力と同時に赤く表示されます。「誤りチェック」は唯一解と照合して、正解と違う入力を表示します。ヒントは正解の数字を1マス埋めます。',
      'ページを再読み込みするとゲームの進行は消え、新しい問題になります。',
      '印刷や、手持ちの問題の入力・自動解答には対応していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '数独（ナンプレ）',
        description:
          '9×9のマスに1〜9を入れるパズルです。各行・各列・太線で区切られた3×3のブロックのどれにも、同じ数字が1つずつ入ります。「ナンバープレース（ナンプレ）」とも呼ばれます。',
      },
      {
        term: '唯一解',
        description:
          '正解がただ1つに決まる問題のことです。唯一解でない問題は当て推量が必要になるため、このツールではソルバーで解の数を数え、必ず1つの問題だけを出題します。',
      },
      {
        term: 'メモ（候補）',
        description:
          'そのマスに入りそうな数字を小さく書き込んでおく機能です。候補が1つに絞れたマスから埋めていくのが基本の解き方です。',
      },
    ],
  },
  en: {
    title: 'Free Sudoku Game – Puzzle Generator with Notes & Hints',
    description:
      'Play sudoku in your browser. Every puzzle has exactly one solution, in easy, medium or hard. Pencil notes, hints and a mistake check. Nothing is uploaded.',
    h1: 'Sudoku – Play Fresh Puzzles Generated in Your Browser',
    introHtml:
      'Pick a difficulty and get a brand-new sudoku with exactly one solution. Use pencil notes, hints and a mistake check, and play with the keyboard on a computer or the on-screen pad on a phone. Looking for another game? Try the <a href="/en/tools/bingo-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Bingo Number Caller</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a difficulty (Easy, Medium or Hard) and press “New puzzle”.',
      'Select an empty cell by clicking or tapping it, then type a number or use the on-screen number pad.',
      'Turn on “Notes” to pencil in small candidate numbers. If you get stuck, use “Hint” or “Check mistakes”.',
      'Fill every cell correctly to win. Press “Restart” to try the same puzzle again.',
    ],
    difficultyLabel: 'Difficulty',
    difficultyEasy: 'Easy',
    difficultyNormal: 'Medium',
    difficultyHard: 'Hard',
    newGame: 'New puzzle',
    restart: 'Restart',
    boardLabel: 'Sudoku board',
    cellFilled: 'Row {row}, column {col}: {value}',
    cellNotes: 'Row {row}, column {col}: empty, notes {notes}',
    cellEmpty: 'Row {row}, column {col}: empty',
    cellGiven: 'given',
    padLabel: 'Number pad',
    padNumber: 'Enter {n}',
    erase: 'Erase',
    noteMode: 'Notes',
    hint: 'Hint',
    check: 'Check mistakes',
    hintResult: 'Hint: row {row}, column {col} is {value}.',
    hintNoCell: 'There is no empty cell left to give a hint for.',
    mistakesFound: '{n} cell(s) do not match the solution (shown in red).',
    noMistakes: 'No mistakes among the numbers you have entered.',
    conflictsFound:
      'A number is repeated in a row, column or box (shown in red).',
    solved: 'Solved! Well done. Press “New puzzle” for another one.',
    progress: '{clues} cells left',
    keyboardHint:
      'Keyboard: arrow keys move, 1–9 enter a number, 0, Backspace or Delete erase, N toggles notes.',
    notesHeading: 'Notes',
    notes: [
      'Each puzzle is generated at random in your browser, and a solver confirms it has exactly one solution. Getting the same puzzle twice in a row is very unlikely.',
      'Difficulty is set by the number of given cells (about 40 for Easy, 32 for Medium, 26 for Hard). Fewer givens usually means a harder puzzle, but the techniques required are not guaranteed.',
      'Repeated numbers turn red as you type. “Check mistakes” compares your entries with the unique solution, and “Hint” fills one cell with the correct number.',
      'Reloading the page discards the current game and starts a new puzzle.',
      'Printing, entering your own puzzle and auto-solving are not supported.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Sudoku',
        description:
          'A puzzle where you place 1 to 9 in a 9×9 grid so that every row, every column and every bold-outlined 3×3 box contains each digit exactly once.',
      },
      {
        term: 'Unique solution',
        description:
          'A puzzle with exactly one valid answer, so it can be solved by logic without guessing. This tool counts solutions with a solver and only serves puzzles with one.',
      },
      {
        term: 'Pencil notes (candidates)',
        description:
          'Small numbers jotted in a cell to track which digits could still go there. Filling cells that are down to a single candidate is the basic way to progress.',
      },
    ],
  },
};
