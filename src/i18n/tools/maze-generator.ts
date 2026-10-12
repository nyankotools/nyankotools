import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MazeGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  widthLabel: string;
  heightLabel: string;
  /** {min} {max} を置換して表示する */
  sizeHint: string;
  difficultyLabel: string;
  difficultyEasy: string;
  difficultyNormal: string;
  difficultyHard: string;
  /** 難易度ごとの説明（選択中の難易度のものだけ表示する） */
  difficultyHintEasy: string;
  difficultyHintNormal: string;
  difficultyHintHard: string;
  generate: string;
  showSolution: string;
  download: string;
  print: string;
  /** 迷路 canvas の代替テキスト。{width} {height} を置換する */
  mazeLabel: string;
  generated: string;
  downloaded: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const mazeGeneratorContent: Record<Locale, MazeGeneratorPageContent> = {
  ja: {
    title: '迷路ジェネレーター｜サイズ・難易度を選んで作成、PNG保存・印刷対応',
    description:
      '縦横のマス数と難易度を選ぶだけで、ランダムな迷路を作成できる無料ツールです。解答（正解ルート）の表示、PNG画像での保存、A4印刷に対応。子どもの学習プリントや遊びに使えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '迷路ジェネレーター｜印刷・PNG保存できる迷路づくり',
    introHtml:
      '縦横のマス数と難易度を選んで「迷路を作る」を押すと、スタートからゴールまでの道が1本だけある迷路を作成します。解答ルートの表示、PNG画像での保存、そのまま印刷にも対応しているので、子どもの知育プリントやイベントの配布物に使えます。くじ引きのような遊びには <a href="/tools/amidakuji-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">あみだくじ</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「横のマス数」「縦のマス数」と「難易度」を選びます。',
      '「迷路を作る」を押すと、新しい迷路が表示されます。気に入らなければ何度でも作り直せます。',
      '答えを見たいときは「解答を表示」にチェックを入れます。',
      '「PNGで保存」で画像として保存するか、「印刷」で印刷します。解答を表示した状態で保存・印刷すると解答つきになります。',
    ],
    widthLabel: '横のマス数',
    heightLabel: '縦のマス数',
    sizeHint: '{min}〜{max}マスで指定できます。',
    difficultyLabel: '難易度',
    difficultyEasy: 'かんたん',
    difficultyNormal: 'ふつう',
    difficultyHard: 'むずかしい',
    difficultyHintEasy:
      'かんたん: 下か右へ進めばゴールに着くので、小さな子どもでも解きやすい迷路です。',
    difficultyHintNormal:
      'ふつう: 短い行き止まりが多く枝分かれする、標準的な迷路です。',
    difficultyHintHard:
      'むずかしい: 長くうねる道が続き、行き止まりに気づくのが遅れやすい迷路です。',
    generate: '迷路を作る',
    showSolution: '解答を表示',
    download: 'PNGで保存',
    print: '印刷',
    mazeLabel: '{width}×{height}マスの迷路。左上がスタート、右下がゴールです。',
    generated: '迷路を作成しました。',
    downloaded: 'PNG画像を保存しました。',
    notesHeading: '注意事項',
    notes: [
      '迷路の作成・解答の計算・画像の生成はすべて端末のブラウザ上で行い、サーバーには何も送信されません。',
      'スタートは左上（S）、ゴールは右下（G）で固定です。作られる迷路は、どの2か所の間にも道がちょうど1本だけの完全迷路（下の用語解説を参照）で、ループや、たどり着けない場所はありません。',
      'マス数は縦横それぞれ5〜50です。大きいほど細かい迷路になり、印刷時に線が細く見えることがあります。小さな子ども向けなら10×10程度までが目安です。',
      '「迷路を作る」を押すたびに別の迷路になり、同じ迷路を後から再現することはできません。必要な迷路はPNG保存か印刷で残してください。',
      'PNG画像は背景が白で、長い辺はおよそ1600ピクセル以下になります。',
      '印刷は用紙いっぱいに迷路を拡大して出力します。ブラウザの印刷設定で用紙サイズや余白などを調整できます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '完全迷路',
        description:
          'どの2つのマスの間にも、通路がちょうど1本だけ存在する迷路です。ループがなく、必ずスタートからゴールへ行ける道が1つに決まります。このツールが作るのはこの形式です。',
      },
      {
        term: '再帰バックトラッカー（深さ優先探索）',
        description:
          '行き止まりに当たるまで一方向にランダムに掘り進め、行き詰まったら戻って別の方向に進む作り方です。長くうねる道ができ、「むずかしい」はこの方法で作っています。',
      },
      {
        term: 'プリム法',
        description:
          'すでに作った迷路につながるマスの中からランダムに1つ選んで広げていく作り方です。短い枝分かれが多い迷路になり、「ふつう」はこの方法で作っています。',
      },
      {
        term: 'バイナリツリー法',
        description:
          '各マスから下か右のどちらかの壁をランダムに取り除くだけの単純な作り方です。下と右だけでゴールへ行ける偏りがあるため、「かんたん」に使っています。',
      },
    ],
  },
  en: {
    title: 'Maze Generator – Printable Mazes with Solution, PNG Download',
    description:
      'Make a random maze by choosing size and difficulty. Show the solution, save a PNG or print it for activity sheets. Runs in your browser; nothing is uploaded.',
    h1: 'Maze Generator – Make Printable Mazes with an Answer Key',
    introHtml:
      'Pick the grid size and difficulty, press “Generate maze”, and you get a maze with exactly one route from start to finish. You can reveal the solution, save the maze as a PNG, or print it straight away – handy for kids’ activity sheets, classroom handouts and party games. Looking for another simple game? Try <a href="/en/tools/amidakuji-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">the Amidakuji generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Set the number of columns and rows, and choose a difficulty.',
      'Press "Generate maze" to see a new maze. You can regenerate as many times as you like.',
      'Tick "Show solution" to reveal the answer route.',
      'Use "Save as PNG" to download an image or "Print" to print it. Whatever is shown, including the solution if it is on, is what gets saved or printed.',
    ],
    widthLabel: 'Columns',
    heightLabel: 'Rows',
    sizeHint: 'Choose from {min} to {max} cells.',
    difficultyLabel: 'Difficulty',
    difficultyEasy: 'Easy',
    difficultyNormal: 'Normal',
    difficultyHard: 'Hard',
    difficultyHintEasy:
      'Easy: moving only down and right always leads to the goal, so even young children can solve it.',
    difficultyHintNormal:
      'Normal: a standard maze with many short dead ends and branches.',
    difficultyHintHard:
      'Hard: long winding corridors where it is easy to miss that you have entered a dead end.',
    generate: 'Generate maze',
    showSolution: 'Show solution',
    download: 'Save as PNG',
    print: 'Print',
    mazeLabel:
      'A {width} by {height} maze. The start is the top-left, the goal is the bottom-right.',
    generated: 'A new maze has been generated.',
    downloaded: 'The PNG image has been saved.',
    notesHeading: 'Notes',
    notes: [
      'Generating the maze, computing the solution and creating the image all happen in your browser. Nothing is sent to a server.',
      'The start (S) is always the top-left and the goal (G) the bottom-right. Mazes are perfect mazes (see the glossary): there is exactly one route between any two cells, with no loops and no sealed-off areas.',
      'Width and height can each be 5 to 50 cells. Larger mazes have thinner passages and the lines may look fine when printed; around 10×10 or smaller is a good starting point for young children.',
      'Every press of "Generate maze" makes a different maze and the same one cannot be recreated later, so save it as a PNG or print it if you want to keep it.',
      'The PNG has a white background, and its longer side is at most about 1600 pixels.',
      'Printing scales the maze up to fill the page. You can adjust paper size and margins in your browser’s print dialog.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Perfect maze',
        description:
          'A maze in which there is exactly one path between any two cells: no loops and no unreachable areas. The route from start to goal is therefore unique. This tool always makes perfect mazes.',
      },
      {
        term: 'Recursive backtracker (depth-first search)',
        description:
          'A generation method that carves in a random direction until it hits a dead end, then backs up and branches off. It produces long winding corridors and is used for Hard.',
      },
      {
        term: 'Prim’s algorithm',
        description:
          'A generation method that repeatedly attaches a random cell next to the maze built so far. It produces many short branches and is used for Normal.',
      },
      {
        term: 'Binary tree algorithm',
        description:
          'The simplest method: each cell opens a wall either downward or to the right at random. This bias lets you reach the goal by only moving down and right, so it is used for Easy.',
      },
    ],
  },
};
