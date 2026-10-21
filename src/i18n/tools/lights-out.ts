import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface LightsOutPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  sizeLabel: string;
  newGame: string;
  restartLabel: string;
  hintLabel: string;
  boardLabel: string;
  /** {row} {col} {state} を置換して表示する */
  cellLabel: string;
  stateOn: string;
  stateOff: string;
  movesLabel: string;
  litLabel: string;
  hintsLabel: string;
  /** {row} {col} {remaining} を置換して表示する */
  hintMessage: string;
  /** {moves} {hints} を置換して表示する */
  completed: string;
  restarted: string;
  newStarted: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const lightsOutContent: Record<Locale, LightsOutPageContent> = {
  ja: {
    title: 'ライツアウト（消灯パズル）｜必ず解ける3×3〜7×7の無料ゲーム',
    description:
      'ブラウザで遊べるライツアウト（消灯パズル）。3×3〜7×7から選べて、配置は必ず解けるものだけを生成。手数カウント、最短手順のヒント、やり直し付き。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ライツアウト｜全部のライトを消す消灯パズル',
    introHtml:
      'マスを押すと、そのマスと上下左右のライトが反転します。すべてのライトを消せばクリアです。3×3〜7×7から選べ、配置は解からの逆操作で作るので必ず解けます。行き詰まったら「ヒント」で最短手順の次の1手を確認できます。ほかのパズルでは <a href="/tools/slide-puzzle/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スライドパズル</a> や <a href="/tools/minesweeper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">マインスイーパー</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '盤面サイズを選びます。選ぶとすぐに新しいゲームが始まります。',
      'マスをクリック（タップ）すると、そのマスと上下左右のマスのライトが反転します。',
      'すべてのライトを消せばクリアです。迷ったら「ヒント」を押すと、押すべきマスが強調されます。',
      '最初からやり直すときは「やり直し」、別の配置にするときは「新しいゲーム」を押します。',
    ],
    sizeLabel: '盤面サイズ',
    newGame: '新しいゲーム',
    restartLabel: 'やり直し',
    hintLabel: 'ヒント',
    boardLabel: 'ライツアウトの盤面',
    cellLabel: '{row}行{col}列、{state}',
    stateOn: '点灯',
    stateOff: '消灯',
    movesLabel: '手数',
    litLabel: '点灯中',
    hintsLabel: 'ヒント使用',
    hintMessage:
      'ヒント: {row}行{col}列を押します。このまま最短で解くと、あと{remaining}手です。',
    completed: 'クリア！ {moves} 手（ヒント {hints} 回）でした。',
    restarted: '最初の配置に戻しました。',
    newStarted: '新しいゲームを始めました。',
    notesHeading: '注意事項',
    notes: [
      '配置は、すべて消灯した盤面からランダムにマスを押して作ります。そのため必ず解けて、完成済みの配置は出ません。',
      '「ヒント」は、いまの盤面を最短手数で解く手順のうち1手を示します。途中でほかのマスを押すと、最短手順は盤面に合わせて計算し直されます。',
      '「手数」は押した回数です。「やり直し」では手数とヒント回数が0に戻ります。',
      'ゲームの途中経過は保存されません。ページを再読み込みすると新しいゲームになります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ライツアウト',
        description:
          '格子状に並んだライトのうち、押したマスとその上下左右のライトが反転する消灯パズルです。すべてを消灯させるのが目的です。',
      },
      {
        term: 'GF(2)（2元体）',
        description:
          '0と1だけを扱い、足し算が「同じなら0、違えば1」（排他的論理和）になる数の体系です。ライツアウトは、押す・押さないを0/1で表した連立方程式としてこの体系で解けます。',
      },
    ],
  },
  en: {
    title: 'Lights Out Puzzle – Always Solvable, 3×3 to 7×7 Online',
    description:
      'Play Lights Out in your browser. Pick 3×3 to 7×7, every board is solvable, with a move counter, hints and restart. Nothing is sent to a server.',
    h1: 'Lights Out – Turn Off Every Light in This Puzzle',
    introHtml:
      'Press a cell and it flips itself and its four neighbors. Turn all the lights off to win. Choose 3×3 to 7×7; boards are built by working backwards from a solution, so each one is solvable. If you get stuck, press "Hint" to see the next move of a shortest solution. Also try <a href="/en/tools/slide-puzzle/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Sliding Puzzle</a> or <a href="/en/tools/minesweeper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Minesweeper</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a board size. A new game starts as soon as you pick one.',
      'Click or tap a cell to flip its light and the lights above, below, left and right of it.',
      'Turn every light off to win. If you are stuck, press "Hint" and the cell to press is highlighted.',
      'Press "Restart" to replay the same board, or "New game" for a different one.',
    ],
    sizeLabel: 'Board size',
    newGame: 'New game',
    restartLabel: 'Restart',
    hintLabel: 'Hint',
    boardLabel: 'Lights Out board',
    cellLabel: 'Row {row}, column {col}, {state}',
    stateOn: 'on',
    stateOff: 'off',
    movesLabel: 'Moves',
    litLabel: 'Lights on',
    hintsLabel: 'Hints used',
    hintMessage:
      'Hint: press row {row}, column {col}. A shortest solution from here takes {remaining} more moves.',
    completed: 'Solved! {moves} moves with {hints} hints.',
    restarted: 'Back to the starting board.',
    newStarted: 'A new game has started.',
    notesHeading: 'Notes',
    notes: [
      'Each board is made by pressing random cells on an all-off board, so it is always solvable and never starts already solved.',
      '"Hint" shows one move of a shortest solution for the current board. If you press a different cell, the shortest solution is recalculated for the new board.',
      'Moves count your presses. "Restart" resets both moves and hints used to 0.',
      'Progress is not saved. Reloading the page starts a new game.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Lights Out',
        description:
          'A puzzle on a grid of lights where pressing a cell flips that light and its four neighbors. The goal is to turn every light off.',
      },
      {
        term: 'GF(2)',
        description:
          'The number system with only 0 and 1, where addition is XOR (same gives 0, different gives 1). Lights Out becomes a system of equations over GF(2), with each cell either pressed (1) or not (0).',
      },
    ],
  },
};
