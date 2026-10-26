import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TowerOfHanoiPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  boardLabel: string;
  discsLabel: string;
  /** {n} を置換して表示する */
  discsOption: string;
  resetLabel: string;
  autoLabel: string;
  stopLabel: string;
  movesLabel: string;
  minLabel: string;
  bestLabel: string;
  bestNone: string;
  resetBestLabel: string;
  bestCleared: string;
  /** {n} 杭の番号、{list} 下から順の円盤の大きさ */
  pegLabel: string;
  /** {n} 杭の番号 */
  pegEmpty: string;
  /** {n} 杭の番号 */
  pegSelected: string;
  ready: string;
  /** {n} 杭の番号 */
  picked: string;
  invalid: string;
  /** {moves} {min} を置換して表示する */
  solvedOptimal: string;
  /** {moves} {min} {extra} を置換して表示する */
  solvedExtra: string;
  newBest: string;
  autoRunning: string;
  /** {moves} を置換して表示する */
  autoDone: string;
  autoStopped: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const towerOfHanoiContent: Record<Locale, TowerOfHanoiPageContent> = {
  ja: {
    title: 'ハノイの塔｜円盤3〜8枚・最短手数と比較・自動解法つき無料ゲーム',
    description:
      'ハノイの塔をブラウザで遊べます。円盤は3〜8枚、手数を数えて最短手数（2のn乗−1）と比較でき、最適解を自動で再生する機能も。クリック・タップ・キーボード対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ハノイの塔（円盤3〜8枚・自動解法つき）',
    introHtml:
      '大きさの違う円盤を、小さい円盤の上にしか置けないルールを守りながら、左の杭から右の杭へすべて移すパズルです。手数を数え、最短手数と比べられます。行き詰まったら最適解を自動で再生できます。ほかの頭の体操なら <a href="/tools/memory-match/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">神経衰弱</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「円盤の枚数」を3〜8枚から選びます（枚数を変えると最初からになります）。',
      '動かしたい円盤がある杭をクリック（タップ）し、続けて移動先の杭をクリックします。一番上の円盤が移ります。',
      '大きい円盤を小さい円盤の上には置けません。全部の円盤を右の杭へ移せばクリアで、手数が最短手数と比較されます。',
      '行き詰まったら「自動で解く」を押すと最適解がアニメーションで再生され、「停止」で止められます。「リセット」で最初からやり直せます。',
    ],
    boardLabel: 'ハノイの塔の盤面（杭が3本）',
    discsLabel: '円盤の枚数',
    discsOption: '{n}枚',
    resetLabel: 'リセット',
    autoLabel: '自動で解く',
    stopLabel: '停止',
    movesLabel: '手数',
    minLabel: '最短手数',
    bestLabel: 'ベスト手数',
    bestNone: '記録なし',
    resetBestLabel: 'ベスト記録を消す',
    bestCleared: 'この枚数のベスト記録を消しました。',
    pegLabel: '杭{n}（下から順に円盤 {list}）',
    pegEmpty: '杭{n}（空）',
    pegSelected: '選択中',
    ready: '動かす円盤がある杭を選んでください。数字キー1〜3でも杭を選べます。',
    picked: '杭{n}を選びました。移動先の杭を選んでください。',
    invalid: 'その移動はできません。小さい円盤の上にしか置けません。',
    solvedOptimal: 'クリア！ {moves}手（最短手数 {min}手）で完成。完璧です！',
    solvedExtra:
      'クリア！ {moves}手でした（最短手数 {min}手、あと{extra}手少なくできます）。',
    newBest: 'この枚数のベスト手数を更新しました！',
    autoRunning: '最適解を再生中です…',
    autoDone: '最適解の再生が終わりました（{moves}手）。',
    autoStopped: '自動再生を止めました。続きは自分で操作できます。',
    notesHeading: '注意事項',
    notes: [
      '最短手数は円盤n枚のとき 2のn乗−1 手です（3枚で7手、8枚で255手）。最適解はこの手数ちょうどで完成します。',
      '「自動で解く」は盤面を最初に戻してから最適解を再生します。再生中に自分で操作することはできず、「停止」で止めると続きを自分で操作できます。',
      '自動解法で完成させた場合は、ベスト手数には記録されません。',
      'ベスト手数は枚数ごとにこの端末のブラウザ（localStorage）にのみ保存され、サーバーには送信されません。ブラウザのデータを消すと記録も消えます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ハノイの塔',
        description:
          '3本の杭と大きさの違う円盤で遊ぶパズルです。円盤は1枚ずつ動かし、小さい円盤の上にしか置けません。再帰の例題としても有名です。',
      },
      {
        term: '最短手数（2のn乗−1）',
        description:
          '円盤n枚を移すのに必要な最小の手数です。n−1枚を寄せ、最大の円盤を1手で動かし、またn−1枚を戻す、という再帰から導かれます。',
      },
    ],
  },
  en: {
    title: 'Tower of Hanoi – Play with 3 to 8 Discs and Auto-Solve',
    description:
      'Play the Tower of Hanoi in your browser with 3 to 8 discs. Count your moves, compare them with the minimum (2^n - 1), and watch the optimal solution animate.',
    h1: 'Tower of Hanoi (3–8 Discs, with Auto-Solve)',
    introHtml:
      'Move the whole stack of discs from the left peg to the right peg, one disc at a time, never placing a larger disc on a smaller one. Your moves are counted and compared with the minimum possible. If you get stuck, let the game play the optimal solution for you. For another brain teaser, try <a href="/en/tools/memory-match/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Memory Match</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the "Number of discs" from 3 to 8 (changing it restarts the puzzle).',
      'Click (or tap) the peg that holds the disc you want to move, then click the peg to move it to. The top disc moves.',
      'A larger disc cannot go on a smaller one. Move every disc to the right peg to win and compare your moves with the minimum.',
      'If you get stuck, press "Auto-solve" to watch the optimal solution, and "Stop" to halt it. "Reset" starts over.',
    ],
    boardLabel: 'Tower of Hanoi board (three pegs)',
    discsLabel: 'Number of discs',
    discsOption: '{n} discs',
    resetLabel: 'Reset',
    autoLabel: 'Auto-solve',
    stopLabel: 'Stop',
    movesLabel: 'Moves',
    minLabel: 'Minimum moves',
    bestLabel: 'Best moves',
    bestNone: 'No record yet',
    resetBestLabel: 'Clear best',
    bestCleared: 'Best record for this disc count cleared.',
    pegLabel: 'Peg {n} (discs from the bottom: {list})',
    pegEmpty: 'Peg {n} (empty)',
    pegSelected: 'selected',
    ready:
      'Pick the peg with the disc you want to move. Keys 1 to 3 also select a peg.',
    picked: 'Peg {n} selected. Now pick the peg to move it to.',
    invalid: "That move isn't allowed. A disc can only go on a larger one.",
    solvedOptimal: 'Solved in {moves} moves (minimum {min}). Perfect!',
    solvedExtra:
      'Solved in {moves} moves (minimum {min}, so {extra} more than needed).',
    newBest: 'New best for this disc count!',
    autoRunning: 'Playing the optimal solution…',
    autoDone: 'The optimal solution is done ({moves} moves).',
    autoStopped: 'Auto-solve stopped. You can carry on yourself.',
    notesHeading: 'Notes',
    notes: [
      'With n discs the minimum is 2^n − 1 moves (7 for 3 discs, 255 for 8 discs). The optimal solution finishes in exactly that many.',
      '"Auto-solve" first returns the board to the start and then plays the optimal solution. You cannot move while it plays; press "Stop" to take over.',
      'A puzzle finished by auto-solve is not saved as a best record.',
      'Best moves are saved per disc count only in this browser (localStorage) and are never sent to a server. Clearing browser data removes them.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Tower of Hanoi',
        description:
          'A puzzle with three pegs and discs of different sizes. Discs move one at a time and may only be placed on a larger disc. It is a classic example for teaching recursion.',
      },
      {
        term: 'Minimum moves (2^n − 1)',
        description:
          'The fewest moves needed to transfer n discs. It follows from recursion: move n−1 discs aside, move the largest disc once, then bring the n−1 discs back on top.',
      },
    ],
  },
};
