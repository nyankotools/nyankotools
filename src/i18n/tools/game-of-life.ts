import type { Locale } from '../../data/tools';
import type { PatternId } from '../../lib/tools/game-of-life';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface GameOfLifePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  play: string;
  pause: string;
  step: string;
  clear: string;
  randomize: string;
  presetPlaceholder: string;
  presetNames: Record<PatternId, string>;
  sizeLabel: string;
  sizeSmall: string;
  sizeMedium: string;
  sizeLarge: string;
  speedLabel: string;
  /** {n} を1秒あたりの世代数に置換する */
  speedValue: string;
  wrapLabel: string;
  generationLabel: string;
  populationLabel: string;
  /** 盤面 canvas の代替テキスト。{width} {height} {alive} を置換する */
  boardLabel: string;
  stoppedExtinct: string;
  stoppedStable: string;
  /** 小さい盤面に入りきらないパターンを選んだとき、盤面を広げた旨を伝える */
  boardEnlarged: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const gameOfLifeContent: Record<Locale, GameOfLifePageContent> = {
  ja: {
    title: 'ライフゲーム｜セルを配置して動かせる無料シミュレーター',
    description:
      'コンウェイのライフゲーム（Conway’s Game of Life）をブラウザで動かせる無料ツールです。セルをクリックして配置、再生・1コマ送り・速度調整、グライダーやパルサーなど有名パターンの配置に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ライフゲーム｜セルを置いて世代の移り変わりを観察できるシミュレーター',
    introHtml:
      '盤面のセルをクリックして生かし、「再生」を押すと、生きたセルは隣が2〜3個なら生き残り、死んだセルは隣がちょうど3個なら誕生する、という単純なルールだけで、パターンが動き、増え、消えていく様子を観察できます。グライダーやパルサー、グライダー銃などの有名なパターンもワンクリックで配置できます。パズルが好きな方は <a href="/tools/minesweeper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">マインスイーパー</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '盤面をクリック（またはドラッグ）してセルを生かします。もう一度クリックすると消えます。「パターンを選ぶ」から有名なパターンを置くこともできます。',
      '「再生」を押すと世代が進みます。「速さ」で1秒あたりの世代数を変えられます。',
      '「1コマ進める」を押すと、1世代ずつ進めて変化を確認できます。',
      '「ランダム配置」でランダムな初期状態を作れます。やり直すときは「クリア」で盤面を空にします。',
    ],
    play: '再生',
    pause: '一時停止',
    step: '1コマ進める',
    clear: 'クリア',
    randomize: 'ランダム配置',
    presetPlaceholder: 'パターンを選ぶ',
    presetNames: {
      glider: 'グライダー',
      blinker: 'ブリンカー',
      toad: 'トード',
      beacon: 'ビーコン',
      pulsar: 'パルサー',
      rpentomino: 'Rペントミノ',
      acorn: 'ドングリ（アコーン）',
      lwss: '軽量級宇宙船',
      gosperGun: 'グライダー銃（ゴスパー）',
    },
    sizeLabel: '盤面の大きさ',
    sizeSmall: '小（30×20）',
    sizeMedium: '標準（50×30）',
    sizeLarge: '大（80×50）',
    speedLabel: '速さ',
    speedValue: '毎秒{n}世代',
    wrapLabel: '端をつなげる（ループ）',
    generationLabel: '世代',
    populationLabel: '生きているセル',
    boardLabel:
      'ライフゲームの盤面。{width}×{height}マスで、生きているセルは{alive}個です。',
    stoppedExtinct: 'すべてのセルが死滅したため、再生を停止しました。',
    stoppedStable: '盤面が変化しなくなったため、再生を停止しました。',
    boardEnlarged:
      'このパターンは小さい盤面に収まらないため、盤面を「標準」に広げました。',
    notesHeading: '注意事項',
    notes: [
      '計算はすべて端末のブラウザ上で行い、サーバーには何も送信されません。',
      'ルールは標準のコンウェイ型（B3/S23）です。「端をつなげる」をオフにすると盤面の外は常に死んだ状態として扱い、オンにすると上下左右がつながったドーナツ状の盤面になります。',
      '盤面の大きさを変えると、現在の盤面と世代はリセットされます。',
      '盤面が変化しなくなる（静物になる）か全滅すると、再生は自動で停止します。振動子（ブリンカーなど）や宇宙船（グライダーなど）は動き続けるため、止まりません。',
      '盤面の保存・共有機能はありません。ページを再読み込みするとセルの配置は消えます。',
      '盤面はマウス・タッチでの操作が前提です。キーボードでは「再生」「1コマ進める」「ランダム配置」などのボタン操作と、パターンの配置ができます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ライフゲーム（Conwayのライフゲーム）',
        description:
          '数学者ジョン・コンウェイが1970年に考案した、セルオートマトンの一種です。格子状のセルが「生」か「死」の2状態を持ち、周囲8マスの生きたセルの数だけで次の世代が決まります。単純なルールから複雑な振る舞いが生まれる例として知られます。',
      },
      {
        term: '静物・振動子・宇宙船',
        description:
          'ライフゲームのパターンの分類です。静物は変化しないもの（ブロックなど）、振動子は一定の周期で同じ形に戻るもの（ブリンカー、パルサーなど）、宇宙船は形を保ったまま盤面を移動するもの（グライダーなど）を指します。',
      },
      {
        term: 'グライダー銃',
        description:
          '一定の周期でグライダーを撃ち出し続けるパターンです。1970年にビル・ゴスパーが発見した「ゴスパーのグライダー銃」は、生きたセルが増え続けることを示した最初の例として知られています。',
      },
      {
        term: 'トーラス（端をつなげる）',
        description:
          '盤面の右端と左端、上端と下端をつなげて、端のない盤面にする方法です。宇宙船が端に当たって崩れず、反対側から出てきて動き続けます。',
      },
    ],
  },
  en: {
    title: 'Game of Life – Free Online Simulator with Presets',
    description:
      'Run Conway’s Game of Life in your browser. Draw cells, play, step and set the speed, with glider and pulsar presets. Nothing is uploaded.',
    h1: 'Conway’s Game of Life – Draw Cells and Watch Generations Evolve',
    introHtml:
      'Click cells to bring them to life and press “Play”. With one simple rule – a live cell with two or three neighbors survives, and a dead cell with exactly three neighbors is born – patterns move, grow and disappear on their own. Famous patterns such as the glider, pulsar and Gosper glider gun can be placed with one click. If you like puzzles, try <a href="/en/tools/minesweeper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Minesweeper</a> too.',
    howToHeading: 'How to use',
    howToSteps: [
      'Click or drag on the board to bring cells to life; click again to remove one. You can also drop a famous pattern from "Choose a pattern".',
      'Press "Play" to advance generations. Use "Speed" to change how many generations run per second.',
      'Press "Step" to advance one generation at a time and see exactly what changes.',
      'Use "Randomize" to start from a random layout, and "Clear" to empty the board.',
    ],
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    clear: 'Clear',
    randomize: 'Randomize',
    presetPlaceholder: 'Choose a pattern',
    presetNames: {
      glider: 'Glider',
      blinker: 'Blinker',
      toad: 'Toad',
      beacon: 'Beacon',
      pulsar: 'Pulsar',
      rpentomino: 'R-pentomino',
      acorn: 'Acorn',
      lwss: 'Lightweight spaceship',
      gosperGun: 'Gosper glider gun',
    },
    sizeLabel: 'Board size',
    sizeSmall: 'Small (30×20)',
    sizeMedium: 'Medium (50×30)',
    sizeLarge: 'Large (80×50)',
    speedLabel: 'Speed',
    speedValue: '{n} gen/s',
    wrapLabel: 'Wrap around edges',
    generationLabel: 'Generation',
    populationLabel: 'Live cells',
    boardLabel:
      'Game of Life board, {width} by {height} cells, with {alive} live cells.',
    stoppedExtinct: 'Playback stopped because every cell has died.',
    stoppedStable: 'Playback stopped because the board no longer changes.',
    boardEnlarged:
      'That pattern does not fit the small board, so the board was enlarged to Medium.',
    notesHeading: 'Notes',
    notes: [
      'All calculation happens in your browser. Nothing is sent to a server.',
      'The rules are the standard Conway rules (B3/S23). With "Wrap around edges" off, everything outside the board is treated as dead; with it on, the edges connect to form a torus.',
      'Changing the board size resets the current board and generation counter.',
      'Playback stops automatically when the board stops changing or every cell dies. Oscillators (such as the blinker) and spaceships (such as the glider) keep changing, so they never stop on their own.',
      'There is no save or share feature. Reloading the page clears your layout.',
      'The board is drawn with the mouse or touch. From the keyboard you can use the buttons such as "Play", "Step" and "Randomize", and place patterns.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Game of Life (Conway’s)',
        description:
          'A cellular automaton devised by mathematician John Conway in 1970. Cells on a grid are alive or dead, and the next generation is decided only by how many of the eight surrounding cells are alive. It is the classic example of simple rules producing complex behavior.',
      },
      {
        term: 'Still life, oscillator, spaceship',
        description:
          'The main kinds of pattern. A still life never changes (the block), an oscillator returns to the same shape after a fixed period (blinker, pulsar), and a spaceship keeps its shape while moving across the board (glider).',
      },
      {
        term: 'Glider gun',
        description:
          'A pattern that keeps firing gliders at a regular interval. The Gosper glider gun, found by Bill Gosper in 1970, was the first known pattern whose population grows without bound.',
      },
      {
        term: 'Torus (wrap around)',
        description:
          'Joining the left edge to the right and the top to the bottom so the board has no edges. Spaceships that reach an edge reappear on the opposite side instead of crashing.',
      },
    ],
  },
};
