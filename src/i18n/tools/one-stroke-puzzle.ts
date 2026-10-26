import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface OneStrokePuzzlePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  boardLabel: string;
  levelLabel: string;
  levelEasy: string;
  levelNormal: string;
  levelHard: string;
  undoLabel: string;
  resetLabel: string;
  hintLabel: string;
  newLabel: string;
  progressLabel: string;
  oddLabel: string;
  /** {n} 頂点の番号 */
  vertexLabel: string;
  /** {n} 頂点の番号 */
  vertexCurrent: string;
  ready: string;
  /** {n} 頂点の番号 */
  started: string;
  /** {n} 頂点の番号 */
  moved: string;
  invalid: string;
  stuck: string;
  undone: string;
  /** {edges} を置換して表示する */
  solved: string;
  /** {n} 頂点の番号 */
  hintStart: string;
  /** {n} 頂点の番号 */
  hintEdge: string;
  hintNone: string;
  hintSolved: string;
  newBoard: string;
  resetDone: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const oneStrokePuzzleContent: Record<
  Locale,
  OneStrokePuzzlePageContent
> = {
  ja: {
    title: '一筆書きパズル｜ドラッグで全部の線をなぞる・ヒント付き無料ゲーム',
    description:
      '一筆書きパズルをブラウザで遊べます。全ての線をちょうど1回ずつなぞって完成させましょう。難易度3段階、1手戻す・ヒント・新しい問題に対応し、ドラッグもタップもOK。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '一筆書きパズル（ドラッグ・タップ対応、ヒントつき）',
    introHtml:
      '図形のすべての線を、ペンを離さず同じ線を二度通らずになぞるパズルです。出題はすべて必ず一筆書きできる図形なので、行き止まりになったら通り方が違うだけ。1手戻す・ヒントも使えます。ほかのパズルなら <a href="/tools/sokoban/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">倉庫番</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「難易度」を選びます（変えると新しい問題になります）。',
      '最初に通る頂点（丸）をクリック（タップ）し、そこから線でつながった頂点へドラッグするか、頂点を順にタップしてたどります。',
      '同じ線は二度通れません。全ての線を通ればクリアです。',
      '行き詰まったら「1手戻す」「ヒント」を使います。最初からなら「リセット」、別の図形なら「新しい問題」を押します。',
    ],
    boardLabel: '一筆書きの盤面（丸が頂点、線が辺）',
    levelLabel: '難易度',
    levelEasy: 'かんたん',
    levelNormal: 'ふつう',
    levelHard: 'むずかしい',
    undoLabel: '1手戻す',
    resetLabel: 'リセット',
    hintLabel: 'ヒント',
    newLabel: '新しい問題',
    progressLabel: '通った線',
    oddLabel: '奇点の数',
    vertexLabel: '頂点{n}',
    vertexCurrent: '現在地',
    ready: '最初に通る頂点を選んでください。',
    started: '頂点{n}から始めました。つながった頂点へ進んでください。',
    moved: '頂点{n}へ進みました。',
    invalid: 'そこへは進めません。つながっていない、またはすでに通った線です。',
    stuck:
      'この通り方では全ての線を通れません。「1手戻す」か「リセット」でやり直しましょう。',
    undone: '1手戻しました。',
    solved: 'クリア！ {edges}本の線をすべて一筆でなぞれました。',
    hintStart: '頂点{n}から始めると完成できます。',
    hintEdge: '次は頂点{n}へ進むと完成できます。',
    hintNone: 'この状態からは完成できません。「1手戻す」でやり直してください。',
    hintSolved: 'すでに完成しています。「新しい問題」で次へ進めます。',
    newBoard: '新しい問題です。最初に通る頂点を選んでください。',
    resetDone: '最初からやり直します。最初に通る頂点を選んでください。',
    notesHeading: '注意事項',
    notes: [
      '出題される図形は、必ず一筆書きできるもの（全体がつながっていて、奇点が0個または2個）だけを生成しています。',
      '奇点が2個の図形は、その2つの頂点のどちらかから始めないと完成できません。奇点が0個なら、どの頂点から始めても完成でき、最後は始点に戻ります。',
      '線が交差している場所は頂点ではないため、そこで曲がることはできません。丸のある場所だけが曲がり角です。',
      '「ヒント」は、通っても完成できる次の一手を教えます（橋を渡って戻れなくなる手は避けます）。ヒントを使っても記録などは残りません。',
      '進行状況や問題はこのページを開いている間だけ保持され、保存や送信はされません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '一筆書き（オイラー路）',
        description:
          '全ての辺をちょうど1回ずつ通る経路のことです。図形がつながっていて、奇点が0個か2個のときに限って存在します（オイラーの定理）。',
      },
      {
        term: '奇点',
        description:
          '集まっている線の本数が奇数の頂点です。奇点が2個なら一方から始めて他方で終わり、0個なら始点に戻って終わります。',
      },
      {
        term: '橋',
        description:
          '通ってしまうと元の側へ戻れなくなる線です。一筆書きでは、他に選べる線があるうちは橋を最後まで残すのがコツです（フルーリーのアルゴリズム）。',
      },
    ],
  },
  en: {
    title: 'One-Stroke Puzzle – Trace Every Line Once',
    description:
      'Play the one-stroke puzzle: trace every line exactly once. Three difficulty levels, undo, hints and endless new boards. Free in your browser.',
    h1: 'One-Stroke Puzzle (Drag or Tap, with Hints)',
    introHtml:
      'Trace every line of the figure in a single stroke, without lifting the pen or going over a line twice. Every puzzle is guaranteed to be solvable, so if you hit a dead end, you just took the wrong route. Undo and hints are there when you need them. For another puzzle, try <a href="/en/tools/sokoban/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Sokoban</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a "Difficulty" (changing it gives you a new puzzle).',
      'Click or tap the dot where you want to start, then drag to a connected dot, or tap the dots one after another.',
      'You cannot reuse a line. Cover every line to win.',
      'If you get stuck, use "Undo" or "Hint". "Reset" starts the same puzzle again and "New puzzle" gives you a different figure.',
    ],
    boardLabel: 'One-stroke board (dots are vertices, lines are edges)',
    levelLabel: 'Difficulty',
    levelEasy: 'Easy',
    levelNormal: 'Normal',
    levelHard: 'Hard',
    undoLabel: 'Undo',
    resetLabel: 'Reset',
    hintLabel: 'Hint',
    newLabel: 'New puzzle',
    progressLabel: 'Lines drawn',
    oddLabel: 'Odd dots',
    vertexLabel: 'Dot {n}',
    vertexCurrent: 'current position',
    ready: 'Pick the dot where you want to start.',
    started: 'Started at dot {n}. Move to a connected dot.',
    moved: 'Moved to dot {n}.',
    invalid:
      "You can't go there. The dots are not connected, or the line is already used.",
    stuck:
      'You can no longer cover every line this way. Use "Undo" or "Reset" to try again.',
    undone: 'Undid one move.',
    solved: 'Solved! You traced all {edges} lines in one stroke.',
    hintStart: 'Starting at dot {n} lets you finish.',
    hintEdge: 'Moving to dot {n} next keeps the puzzle solvable.',
    hintNone: 'This position cannot be finished. Use "Undo" and try again.',
    hintSolved: 'Already solved. Press "New puzzle" for another one.',
    newBoard: 'New puzzle. Pick the dot where you want to start.',
    resetDone: 'Starting over. Pick the dot where you want to start.',
    notesHeading: 'Notes',
    notes: [
      'Every figure is generated so that a one-stroke path exists: it is connected and has either 0 or 2 odd dots.',
      'With 2 odd dots you must start at one of them. With 0 odd dots you can start anywhere and you will end where you began.',
      'Places where lines cross are not dots, so you cannot turn there. Corners exist only at the circles.',
      '"Hint" shows a next move that still lets you finish, avoiding bridges that would strand you. Hints are not tracked.',
      'The puzzle and your progress are kept only while this page is open; nothing is saved or sent anywhere.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'One-stroke path (Eulerian trail)',
        description:
          'A route that uses every edge exactly once. It exists only when the figure is connected and has 0 or 2 odd vertices (Euler’s theorem).',
      },
      {
        term: 'Odd vertex',
        description:
          'A vertex where an odd number of lines meet. With 2 odd vertices you start at one and finish at the other; with none you finish where you started.',
      },
      {
        term: 'Bridge',
        description:
          'A line that cuts you off from the part you left once you cross it. While another choice exists, keep the bridge for last (Fleury’s algorithm).',
      },
    ],
  },
};
