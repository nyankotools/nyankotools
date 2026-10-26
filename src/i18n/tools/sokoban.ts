import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SokobanPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  levelLabel: string;
  /** {n} を置換して表示する */
  levelOption: string;
  /** {n} を置換して表示する。クリア済みのステージ名 */
  levelOptionCleared: string;
  prevButton: string;
  nextButton: string;
  undoButton: string;
  resetButton: string;
  movesLabel: string;
  pushesLabel: string;
  boxesLabel: string;
  bestLabel: string;
  bestNone: string;
  boardLabel: string;
  dpadLabel: string;
  dpadUp: string;
  dpadDown: string;
  dpadLeft: string;
  dpadRight: string;
  /** {on} {total} を置換して表示する。盤面の読み上げ用 */
  boardSummary: string;
  statusPlaying: string;
  /** {moves} を置換して表示する */
  statusCleared: string;
  /** {moves} を置換して表示する */
  statusNewBest: string;
  /** {best} を置換して表示する */
  statusBestKept: string;
  statusLastCleared: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const sokobanContent: Record<Locale, SokobanPageContent> = {
  ja: {
    title: '箱押しパズル｜無料ブラウザゲーム・20面・最短手数の記録つき',
    description:
      'ブラウザで遊べる箱押しパズル。箱を押してすべてのゴールに運びます。全20面、矢印キー・スワイプ・ボタンで操作でき、1手戻す・リセット・最短手数の記録に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '箱押しパズル｜箱を押してゴールへ運ぶ全20面',
    introHtml:
      '倉庫で荷物を運ぶように、箱を押してすべてのゴール（○）に運ぶひとり用パズルです。箱は押すだけで引けないので、壁際や隅に押し込まないよう先を読みましょう。全20面はすべて解けることを確認済みで、クリアした手数の最短記録がこのブラウザに保存されます。ほかのパズルでは <a href="/tools/peg-solitaire/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ペグソリティア</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「ステージ」で遊ぶ面を選びます。最初の面はいちばん簡単です。',
      '矢印キー（または WASD）、盤面のスワイプ、画面の矢印ボタンで動かします。箱の方向へ歩くと箱を押せます。',
      'すべての箱をゴール（○）に載せるとクリアです。手数が少ないほど良い記録になります。',
      '行き詰まったら「1手戻す」で1手ずつ戻すか、「リセット」で最初からやり直します。',
    ],
    levelLabel: 'ステージ',
    levelOption: 'ステージ {n}',
    levelOptionCleared: 'ステージ {n}（クリア済み）',
    prevButton: '前の面',
    nextButton: '次の面',
    undoButton: '1手戻す',
    resetButton: 'リセット',
    movesLabel: '手数',
    pushesLabel: '押した回数',
    boxesLabel: 'ゴール上の箱',
    bestLabel: '最短記録',
    bestNone: '記録なし',
    boardLabel: '箱押しパズルの盤面',
    dpadLabel: '方向ボタン',
    dpadUp: '上へ',
    dpadDown: '下へ',
    dpadLeft: '左へ',
    dpadRight: '右へ',
    boardSummary: '箱 {total} 個のうち {on} 個がゴールにあります',
    statusPlaying: '箱を押してゴール（○）に運びましょう。',
    statusCleared: 'クリア！ {moves} 手でした。',
    statusNewBest: 'クリア！ {moves} 手で最短記録を更新しました。',
    statusBestKept: 'クリア！ 最短記録は {best} 手です。',
    statusLastCleared: '最後の面もクリアしました。おめでとうございます！',
    notesHeading: '注意事項',
    notes: [
      '箱は押すだけで、引くことはできません。壁際や隅に押し込むと動かせなくなるので、「1手戻す」で戻してください。',
      '箱は1度に1個しか押せません。箱の先に壁や別の箱があるときは押せません。',
      '手数は歩いた回数と押した回数の合計です。最短記録はステージごとに、このブラウザ（localStorage）にだけ保存されます。ブラウザのデータを消すと記録も消えます。',
      '全20面は作者が用意したもので、すべてクリアできることを自動の探索で確認しています。',
      '遊んでいる途中の盤面は保存されません。ページを再読み込みすると、選んでいた面の最初からになります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '箱押しパズル',
        description:
          '倉庫の荷物を押して所定の場所へ運ぶ、1980年代に生まれたパズルのジャンルです。引けない・同時に2個押せないというルールだけで、奥深い問題が作れます。「倉庫番」は商標のため、このツールでは「箱押しパズル」と呼んでいます。',
      },
      {
        term: 'デッドロック',
        description:
          '箱が隅や壁際に入るなどして、もうゴールに運べなくなった状態です。1個でも起こるとその面はクリアできないため、「1手戻す」で戻してやり直します。',
      },
    ],
  },
  en: {
    title: 'Box Push Puzzle – Free Online Warehouse Puzzle Game',
    description:
      'Play a free box push puzzle in your browser. Push every box onto a goal across 20 levels. Arrow keys, swipe or buttons, undo and best records. No uploads.',
    h1: 'Box Push Puzzle – Push Every Box onto a Goal',
    introHtml:
      'A classic warehouse-style puzzle for one player: push each box onto a goal (○). You can only push, never pull, so think ahead before you corner a box against a wall. All 20 levels have been checked to be solvable, and your best move count for each level is saved in this browser. Want another brain teaser? Try <a href="/en/tools/peg-solitaire/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Peg Solitaire</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick a level under "Level". The first one is the easiest.',
      'Move with the arrow keys (or WASD), by swiping on the board, or with the on-screen arrow buttons. Walk into a box to push it.',
      'Put every box on a goal (○) to clear the level. Fewer moves make a better record.',
      'If you get stuck, press "Undo" to step back one move or "Reset" to restart the level.',
    ],
    levelLabel: 'Level',
    levelOption: 'Level {n}',
    levelOptionCleared: 'Level {n} (cleared)',
    prevButton: 'Previous',
    nextButton: 'Next',
    undoButton: 'Undo',
    resetButton: 'Reset',
    movesLabel: 'Moves',
    pushesLabel: 'Pushes',
    boxesLabel: 'Boxes on goals',
    bestLabel: 'Best',
    bestNone: 'No record',
    boardLabel: 'Box push puzzle board',
    dpadLabel: 'Direction buttons',
    dpadUp: 'Up',
    dpadDown: 'Down',
    dpadLeft: 'Left',
    dpadRight: 'Right',
    boardSummary: '{on} of {total} boxes are on goals',
    statusPlaying: 'Push the boxes onto the goals (○).',
    statusCleared: 'Level cleared in {moves} moves.',
    statusNewBest: 'Level cleared in {moves} moves. New best!',
    statusBestKept: 'Level cleared. Your best is {best} moves.',
    statusLastCleared: 'You cleared the last level. Congratulations!',
    notesHeading: 'Notes',
    notes: [
      'Boxes can only be pushed, never pulled. If you push one into a corner or against a wall it may get stuck, so use "Undo" to step back.',
      'You can push only one box at a time. A box cannot be pushed if a wall or another box is right behind it.',
      'Moves count every step and every push. Your best count for each level is stored only in this browser (localStorage), and clearing browser data removes it.',
      'The 20 levels were made for this tool, and an automatic search confirms that every one can be solved.',
      'Your current board is not saved. Reloading the page restarts the level you had selected.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Box push puzzle',
        description:
          'A puzzle genre from the 1980s in which you push crates to target squares in a warehouse. Two rules, no pulling and no pushing two boxes at once, are enough to create deep problems. "Sokoban" is a trademark, so this tool calls it a box push puzzle.',
      },
      {
        term: 'Deadlock',
        description:
          'A position where a box can no longer reach any goal, for example because it sits in a corner. A single deadlocked box makes the level unwinnable, so step back with "Undo" and try another route.',
      },
    ],
  },
};
